/**
 * Graph Extraction Service — DWS IQ 6/7
 *
 * Extracts causal/relational triples (subject → relation → object) from
 * text using a local LLM and persists them to graph_facts for later
 * traversal via graph.service.ts. First slice of "graph engineering":
 * one deterministic query can answer a multi-hop causal question that
 * would otherwise take several agent-loop iterations of re-querying.
 *
 * Sibling of fact-extraction.service.ts — same triple-extraction shape,
 * retargeted toward causal/relational predicates and persisted to a
 * dedicated table (graph_facts) instead of semantic_memories, since
 * traversal needs real indexed columns, not JSON buried in metadata.
 *
 * Code-Version: 1.0.0
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';
import { getInternalDbPool } from '../config/internal-db.js';
import { createLLMClientForAgent, type LLMClient } from './llm-client.js';

// ============ TYPES ============

export interface ExtractedGraphFact {
  subject: string;
  relation: string;
  object: string;
  confidence: number;
}

export interface GraphExtractionInput {
  text: string;
  sourceRef: string;
  orgId: string;
  minConfidence?: number;
}

export interface GraphExtractionResult {
  facts: ExtractedGraphFact[];
  persisted: number;
  skipped: number;
  durationMs: number;
}

// ============ EXTRACTION PROMPT ============

const EXTRACTION_SYSTEM_PROMPT = `You are a causal-relationship extraction engine. Given text, extract structured facts as JSON.

Each fact is a triple: { subject, relation, object, confidence }

Rules:
1. Extract only explicit relationships stated in the text — never infer or guess.
2. Subject and object: concrete entities or events (concepts, companies, regulations, incidents).
3. Relation: snake_case, prefer causal/dependency relations when the text supports them —
   "caused_by", "led_to", "resulted_in", "depends_on", "is_regulated_by". Use other snake_case
   relations ("is_a", "part_of", "located_in") only when no causal relation applies.
4. Confidence: 0.0-1.0. Use 1.0 for explicitly stated relationships, 0.8 for strongly implied,
   0.6 for loosely implied.

Respond with ONLY a JSON array of fact objects. No markdown, no explanation.
If no facts can be extracted, respond with an empty array: []

Example input: "The warehouse failure caused a supplier delay, which led to the release being pushed back."
Example output:
[
  {"subject":"warehouse failure","relation":"caused","object":"supplier delay","confidence":1.0},
  {"subject":"supplier delay","relation":"led_to","object":"release delay","confidence":1.0}
]`;

// ============ GRAPH EXTRACTION SERVICE ============

export class GraphExtractionService {
  private llmClient: LLMClient | null = null;

  /**
   * Extract causal/relational triples from text and persist them to graph_facts.
   */
  async extract(input: GraphExtractionInput): Promise<GraphExtractionResult> {
    const startTime = Date.now();
    const minConfidence = input.minConfidence ?? 0.7;

    const facts = await this.callLLM(input.text);

    if (facts.length === 0) {
      return { facts: [], persisted: 0, skipped: 0, durationMs: Date.now() - startTime };
    }

    const highConfidence = facts.filter((f) => f.confidence >= minConfidence);
    const skipped = facts.length - highConfidence.length;

    const persisted = await this.persist(highConfidence, input.sourceRef, input.orgId);

    logger.info('Graph facts extracted', {
      total: facts.length,
      persisted,
      skipped: skipped + (highConfidence.length - persisted),
      sourceRef: input.sourceRef,
      orgId: input.orgId,
      durationMs: Date.now() - startTime,
    });

    return {
      facts,
      persisted,
      skipped: skipped + (highConfidence.length - persisted),
      durationMs: Date.now() - startTime,
    };
  }

  // ============ PRIVATE ============

  private async persist(
    facts: ExtractedGraphFact[],
    sourceRef: string,
    orgId: string,
  ): Promise<number> {
    const pool = getInternalDbPool();
    if (!pool) {
      logger.warn('Internal Postgres not configured — skipping graph fact persistence', {
        sourceRef,
      });
      return 0;
    }

    const modelId = this.getLLMClient()?.model ?? 'unknown';
    let persisted = 0;

    for (const fact of facts) {
      try {
        await pool.query(
          `INSERT INTO graph_facts (
             org_id, subject, relation, object, confidence,
             source_type, source_ref, extracted_by
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            orgId,
            fact.subject,
            fact.relation,
            fact.object,
            fact.confidence,
            'kb',
            sourceRef,
            modelId,
          ],
        );
        persisted++;
      } catch (err) {
        logger.warn('Failed to persist graph fact', {
          sourceRef,
          subject: fact.subject,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return persisted;
  }

  /** Call LLM to extract graph facts from text */
  private async callLLM(text: string): Promise<ExtractedGraphFact[]> {
    const client = this.getLLMClient();
    if (!client) {
      logger.warn('No LLM provider available for graph extraction');
      return [];
    }

    try {
      const response = await client.chat([
        { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
        { role: 'user', content: text.slice(0, 12_000) },
      ]);

      const content = response.content?.trim();
      if (!content) return [];

      return this.parseFacts(content);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Graph extraction LLM call failed', { error: msg });
      return [];
    }
  }

  /** Parse LLM output into ExtractedGraphFact array */
  private parseFacts(raw: string): ExtractedGraphFact[] {
    let cleaned = raw;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(
          (f: Record<string, unknown>) =>
            typeof f.subject === 'string' &&
            typeof f.relation === 'string' &&
            typeof f.object === 'string' &&
            typeof f.confidence === 'number' &&
            f.confidence >= 0 &&
            f.confidence <= 1,
        )
        .map((f: Record<string, unknown>) => ({
          subject: f.subject as string,
          relation: f.relation as string,
          object: f.object as string,
          confidence: f.confidence as number,
        }));
    } catch {
      logger.warn('Failed to parse graph extraction response', { raw: raw.slice(0, 200) });
      return [];
    }
  }

  /** Lazy-initialize LLM client — resolves to local qwen3-coder:30b via AGENT_TIER_MAP */
  private getLLMClient(): LLMClient | null {
    if (this.llmClient) return this.llmClient;
    this.llmClient = createLLMClientForAgent('graph-extract', {
      tierOverride: 'standard',
      requiresTools: false,
    });
    return this.llmClient;
  }
}

/** Singleton instance */
export const graphExtractionService = new GraphExtractionService();
