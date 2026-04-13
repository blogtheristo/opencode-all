/**
 * Fact Extraction Service — DWS IQ 6/7
 *
 * Extracts structured facts (subject-predicate-value triples) from
 * conversation text, documents, or any unstructured input using LLM.
 * Extracted facts are persisted as `fact` type memories in the
 * semantic_memories table for later recall and profile building.
 *
 * Part of the Agent Memory System (PR 254).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-254 (agent-memory-fact-extraction)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';
import { createLLMClient, type LLMClient } from './llm-client.js';
import { memoryService } from './memory.service.js';
import type {
  ExtractedFact,
  FactExtractionInput,
  FactExtractionResult,
} from './memory.types.js';

// ============ EXTRACTION PROMPT ============

const EXTRACTION_SYSTEM_PROMPT = `You are a fact extraction engine. Given text, extract structured facts as JSON.

Each fact is a triple: { subject, predicate, value, confidence, category }

Rules:
1. Extract only explicit facts stated in the text — never infer or guess.
2. Subject: the entity the fact is about (person, company, project, product).
3. Predicate: the relationship or attribute (use snake_case, e.g., "is_located_in", "has_revenue", "prefers").
4. Value: the fact value as a string.
5. Confidence: 0.0-1.0. Use 1.0 for explicitly stated facts, 0.8 for strongly implied, 0.6 for loosely implied.
6. Category: one of "identity", "preference", "relationship", "metric", "status", "other".

Categories:
- identity: name, location, industry, role, company info
- preference: likes, dislikes, preferred tools, communication style
- relationship: partnerships, team membership, client-vendor links
- metric: numbers, KPIs, revenue, headcount, scores
- status: current state, progress, phase, health
- other: anything that doesn't fit above

Respond with ONLY a JSON array of fact objects. No markdown, no explanation.
If no facts can be extracted, respond with an empty array: []

Example input: "ACME Corp is based in Helsinki with 250 employees. They prefer weekly reports."
Example output:
[
  {"subject":"ACME Corp","predicate":"is_located_in","value":"Helsinki","confidence":1.0,"category":"identity"},
  {"subject":"ACME Corp","predicate":"has_employee_count","value":"250","confidence":1.0,"category":"metric"},
  {"subject":"ACME Corp","predicate":"prefers_report_frequency","value":"weekly","confidence":1.0,"category":"preference"}
]`;

// ============ FACT EXTRACTION SERVICE ============

export class FactExtractionService {
  private llmClient: LLMClient | null = null;

  /**
   * Extract facts from text and optionally persist them as memories.
   */
  async extract(input: FactExtractionInput): Promise<FactExtractionResult> {
    const startTime = Date.now();
    const minConfidence = input.minConfidence ?? 0.7;
    const shouldPersist = input.persist !== false;

    // Step 1: Extract facts via LLM
    const facts = await this.callLLM(input.text);

    if (facts.length === 0) {
      return {
        facts: [],
        persisted: 0,
        skipped: 0,
        memoryIds: [],
        durationMs: Date.now() - startTime,
      };
    }

    // Step 2: Filter by confidence threshold
    const highConfidence = facts.filter((f) => f.confidence >= minConfidence);
    const skipped = facts.length - highConfidence.length;

    // Step 3: Persist as memories
    const memoryIds: string[] = [];
    let persisted = 0;

    if (shouldPersist) {
      for (const fact of highConfidence) {
        const result = await memoryService.store({
          content: `${fact.subject} ${fact.predicate.replace(/_/g, ' ')} ${fact.value}`,
          memoryType: 'fact',
          orgId: input.orgId,
          customerId: input.customerId,
          source: input.source || 'fact-extraction',
          confidence: fact.confidence,
          metadata: {
            subject: fact.subject,
            predicate: fact.predicate,
            value: fact.value,
            category: fact.category,
            extractedFrom: 'llm',
          },
        });

        if (result.stored) {
          memoryIds.push(result.id);
          persisted++;
        } else if (result.duplicateOf) {
          // Duplicate detected — count as skipped
          logger.debug('Fact duplicate detected', {
            subject: fact.subject,
            predicate: fact.predicate,
            duplicateOf: result.duplicateOf,
          });
        }
      }
    }

    const totalSkipped = skipped + (highConfidence.length - persisted);

    logger.info('Facts extracted', {
      total: facts.length,
      persisted,
      skipped: totalSkipped,
      orgId: input.orgId,
      durationMs: Date.now() - startTime,
    });

    return {
      facts,
      persisted,
      skipped: totalSkipped,
      memoryIds,
      durationMs: Date.now() - startTime,
    };
  }

  // ============ PRIVATE ============

  /** Call LLM to extract facts from text */
  private async callLLM(text: string): Promise<ExtractedFact[]> {
    const client = this.getLLMClient();
    if (!client) {
      logger.warn('No LLM provider available for fact extraction');
      return [];
    }

    try {
      const response = await client.chat([
        { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
        { role: 'user', content: text.slice(0, 12_000) }, // Limit input size
      ]);

      const content = response.content?.trim();
      if (!content) return [];

      return this.parseFacts(content);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Fact extraction LLM call failed', { error: msg });
      return [];
    }
  }

  /** Parse LLM output into ExtractedFact array */
  private parseFacts(raw: string): ExtractedFact[] {
    // Strip markdown code fences if present
    let cleaned = raw;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) return [];

      // Validate each fact
      const validCategories = ['identity', 'preference', 'relationship', 'metric', 'status', 'other'];
      return parsed
        .filter((f: Record<string, unknown>) =>
          typeof f.subject === 'string' &&
          typeof f.predicate === 'string' &&
          typeof f.value === 'string' &&
          typeof f.confidence === 'number' &&
          f.confidence >= 0 && f.confidence <= 1
        )
        .map((f: Record<string, unknown>) => ({
          subject: f.subject as string,
          predicate: f.predicate as string,
          value: f.value as string,
          confidence: f.confidence as number,
          category: validCategories.includes(f.category as string)
            ? f.category as ExtractedFact['category']
            : 'other' as const,
        }));
    } catch {
      logger.warn('Failed to parse fact extraction response', { raw: raw.slice(0, 200) });
      return [];
    }
  }

  /** Lazy-initialize LLM client */
  private getLLMClient(): LLMClient | null {
    if (this.llmClient) return this.llmClient;
    this.llmClient = createLLMClient('claude-haiku', undefined, 'agent');
    return this.llmClient;
  }
}

/** Singleton instance */
export const factExtractionService = new FactExtractionService();
