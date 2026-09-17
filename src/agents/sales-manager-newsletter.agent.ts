/**
 * Sales Manager Newsletter Agent — Stage 2 of the sales-manager newsletter automation
 *
 * Reads live signal data collected by:
 *   - scripts/collect_regulatory_signals.py (Stage 1) -> Supabase market_signals
 *     (signal_type='regulation')
 *   - scripts/daily/news-to-signal.sh -> logs/news-signals/*.jsonl (industrial incidents)
 *
 * Synthesizes them into the Story -> Key Takeaway -> Sales Opportunity structure used by
 * docs/market-research/sales-manager.md, mapping sales targets ONLY to the existing
 * EU_TARGET_UNIVERSE (outreach-lead-finder.agent.ts) rather than letting the LLM invent
 * company names — a newsletter that drives outreach must not fabricate targets.
 *
 * Input:  { lookbackDays?, minStories?, editionDate? }
 * Output: { edition: string (Markdown body, NOT the DWS doc header), storiesUsed,
 *           signalsScanned, insufficientData }
 *
 * If there isn't enough real signal data, returns insufficientData=true and does NOT
 * fabricate a newsletter — see docs/field-notes/2026-07-12-sales-manager-newsletter-automation-plan.md
 * "Every generated edition carries the Provenance disclaimer".
 *
 * Tier: 1 (read-only synthesis; writing the result into sales-manager.md / knowledge_base
 * is Stage 3's job, not this agent's).
 */

import { readdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import { EU_TARGET_UNIVERSE } from './outreach-lead-finder.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT / OUTPUT TYPES ============

interface NewsletterInput {
  lookbackDays: number;
  minStories: number;
  editionDate: string;
}

interface RegulationSignal {
  title: string;
  summary: string | null;
  source_url: string;
  impact_score: number;
  dws_product_id: string | null;
  collected_at: string;
}

interface IncidentSignal {
  timestamp: string;
  title: string;
  industries: string;
  cascade_score: number;
  dual_use: boolean;
}

interface NewsletterStory {
  headline: string;
  keyTakeaway: string;
  salesOpportunity: string;
  targetCompanies: string[];
  sourceUrls: string[];
}

// ============ AGENT IMPLEMENTATION ============

export class SalesManagerNewsletterAgent extends BaseAgent {
  constructor() {
    super({
      name: 'sales-manager-newsletter',
      description:
        'Synthesizes collected EU regulatory + industrial signals into the sales-manager.md Story -> Key Takeaway -> Sales Opportunity newsletter format. Read-only synthesis — does not write the target file (Stage 3).',
      capabilities: [
        'market-intelligence',
        'newsletter-synthesis',
        'sales-opportunity-mapping',
        'regulatory-scoring',
      ],
      model: 'llama3.3:70b',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const validated = this.validateInput(input);

      const [regulationSignals, incidentSignals] = await Promise.all([
        this.fetchRegulationSignals(validated.lookbackDays),
        this.fetchIncidentSignals(validated.lookbackDays),
      ]);

      const totalSignals = regulationSignals.length + incidentSignals.length;

      if (totalSignals < validated.minStories) {
        const reasoning = `Insufficient live signal data: ${regulationSignals.length} regulation signals + ${incidentSignals.length} incident signals = ${totalSignals} total, below minStories=${validated.minStories}. Not generating an edition — a newsletter built from too little real data risks fabricated stories. Check Stage 1 (scripts/collect_regulatory_signals.py) actually ran on DGX Spark and populated market_signals.`;

        const response: AgentResponse = {
          agentName: this.config.name,
          result: { insufficientData: true, signalsScanned: totalSignals, edition: null },
          confidence: 0.2,
          reasoning,
          recommendations: [
            'Run scripts/weekly/collect-regulatory-signals.sh on DGX Spark and verify it wrote rows to market_signals',
            'Check logs/news-signals/ for recent alerts-*.jsonl output from news-to-signal.sh',
            `Consider lowering minStories below ${validated.minStories} if a smaller edition is acceptable`,
          ],
          metadata: { durationMs: Date.now() - startTime, model: this.config.model },
        };

        await this.logExecution({
          agent_name: this.config.name,
          user_id: context.userId,
          org_id: context.orgId,
          session_id: context.sessionId,
          project_id: context.projectId,
          input,
          output: response,
          status: 'completed',
          duration_ms: Date.now() - startTime,
          created_at: new Date().toISOString(),
        });

        return response;
      }

      const stories = await this.synthesizeStories(regulationSignals, incidentSignals);
      const edition = this.renderEdition(validated.editionDate, stories);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          insufficientData: false,
          edition,
          storiesUsed: stories.length,
          signalsScanned: totalSignals,
        },
        confidence: stories.length >= 3 ? 0.75 : 0.5,
        reasoning: `Synthesized ${stories.length} stories from ${regulationSignals.length} regulation signals + ${incidentSignals.length} incident signals (last ${validated.lookbackDays}d). Sales targets drawn only from EU_TARGET_UNIVERSE (${EU_TARGET_UNIVERSE.length} companies) — no invented company names.`,
        recommendations: [
          'Stage 3 (not yet built): write this edition into docs/market-research/sales-manager.md and Supabase knowledge_base',
          'Route company-specific claims through /truth-check before external use',
        ],
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          lookbackDays: validated.lookbackDays,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;
      logger.error('Sales manager newsletter synthesis failed', {
        agent: this.config.name,
        error: errorMessage,
      });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Newsletter synthesis failed: ${errorMessage}`,
        recommendations: [
          'Check SUPABASE_URL/SUPABASE_SERVICE_KEY are set',
          'Check logs/news-signals/ is readable',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  private validateInput(input: Record<string, unknown>): NewsletterInput {
    const lookbackDays =
      typeof input.lookbackDays === 'number' && input.lookbackDays > 0 ? input.lookbackDays : 7;
    const minStories =
      typeof input.minStories === 'number' && input.minStories > 0 ? input.minStories : 3;
    const editionDate =
      typeof input.editionDate === 'string' && input.editionDate
        ? input.editionDate
        : new Date().toISOString().split('T')[0];
    return { lookbackDays, minStories, editionDate };
  }

  // ============ SIGNAL FETCHING ============

  private async fetchRegulationSignals(lookbackDays: number): Promise<RegulationSignal[]> {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      logger.debug('Supabase not configured — skipping regulation signal fetch');
      return [];
    }

    const since = new Date(Date.now() - lookbackDays * 86_400_000).toISOString();
    try {
      const resp = await fetch(
        `${url}/rest/v1/market_signals?signal_type=eq.regulation&collected_at=gte.${since}` +
          `&order=impact_score.desc&limit=30` +
          `&select=title,summary,source_url,impact_score,dws_product_id,collected_at`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        },
      );
      if (!resp.ok) {
        logger.warn('market_signals fetch failed', { status: resp.status });
        return [];
      }
      return (await resp.json()) as RegulationSignal[];
    } catch (err) {
      logger.warn('market_signals fetch error', {
        error: err instanceof Error ? err.message : 'unknown',
      });
      return [];
    }
  }

  private async fetchIncidentSignals(lookbackDays: number): Promise<IncidentSignal[]> {
    try {
      const currentDir =
        typeof __dirname !== 'undefined'
          ? __dirname
          : resolve(fileURLToPath(import.meta.url), '..');
      const projectRoot = resolve(currentDir, '..', '..');
      const logDir = resolve(projectRoot, 'logs', 'news-signals');

      const entries = await readdir(logDir).catch(() => [] as string[]);
      const alertFiles = entries.filter((f) => f.startsWith('alerts-') && f.endsWith('.jsonl'));

      const cutoff = Date.now() - lookbackDays * 86_400_000;
      const signals: IncidentSignal[] = [];

      for (const filename of alertFiles) {
        const raw = await readFile(resolve(logDir, filename), 'utf-8').catch(() => '');
        for (const line of raw.split('\n')) {
          if (!line.trim()) continue;
          try {
            const alert = JSON.parse(line) as IncidentSignal;
            if (new Date(alert.timestamp).getTime() >= cutoff) {
              signals.push(alert);
            }
          } catch {
            // skip malformed line
          }
        }
      }

      return signals.sort((a, b) => b.cascade_score - a.cascade_score).slice(0, 15);
    } catch (err) {
      logger.warn('Incident signal read failed (non-critical)', {
        error: err instanceof Error ? err.message : 'unknown',
      });
      return [];
    }
  }

  // ============ SYNTHESIS ============

  private async synthesizeStories(
    regulationSignals: RegulationSignal[],
    incidentSignals: IncidentSignal[],
  ): Promise<NewsletterStory[]> {
    const targetList = EU_TARGET_UNIVERSE.map((c) => ({
      name: c.name,
      industry: c.industry,
      regulations: c.regulations,
    }));

    const prompt = [
      'You are drafting the "Story -> Key Takeaway -> Sales Opportunity" section of a B2B',
      'sales intelligence newsletter for DWS IQ 6 (Nordic/EU industrial compliance platform).',
      '',
      'STRICT RULES:',
      '1. Only use facts present in the SIGNALS below. Do not invent regulatory dates,',
      '   prices, or events not present in the source text.',
      '2. Only name companies from the SALES TARGETS list below as sales opportunities.',
      '   Never invent a company name.',
      '3. If a signal does not clearly map to a sales angle, skip it rather than force one.',
      '',
      'SIGNALS (regulation):',
      JSON.stringify(
        regulationSignals.map((s) => ({ title: s.title, summary: s.summary, url: s.source_url })),
      ),
      '',
      'SIGNALS (industrial incidents):',
      JSON.stringify(incidentSignals.map((s) => ({ title: s.title, industries: s.industries }))),
      '',
      'SALES TARGETS (only use these — do not invent others):',
      JSON.stringify(targetList),
      '',
      'Return JSON: {"stories": [{"headline": string, "keyTakeaway": string,',
      '"salesOpportunity": string, "targetCompanies": string[], "sourceUrls": string[]}]}',
      'Produce at most 5 stories. Each targetCompanies entry must be a name from SALES TARGETS.',
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content) as { stories: NewsletterStory[] };
      if (Array.isArray(parsed.stories)) {
        const validNames = new Set(EU_TARGET_UNIVERSE.map((c) => c.name));
        return parsed.stories
          .map((s) => ({
            ...s,
            targetCompanies: (s.targetCompanies || []).filter((n) => validNames.has(n)),
          }))
          .filter((s) => s.headline && s.keyTakeaway && s.salesOpportunity);
      }
    } catch (err) {
      logger.warn('Newsletter synthesis JSON parse failed', {
        error: err instanceof Error ? err.message : 'unknown',
      });
    }
    return [];
  }

  private renderEdition(editionDate: string, stories: NewsletterStory[]): string {
    const lines: string[] = [
      `**Edition: ${editionDate} | Weekly Digest**`,
      '',
      '> Generated by sales-manager-newsletter agent from live market_signals + news-to-signal.sh data.',
      '> Company/pricing/date claims are unverified external signal — route through /truth-check',
      '> before external use (see DWS_DOCUMENT_STANDARD.md §22, sales-manager.md Provenance note).',
      '',
    ];

    stories.forEach((s, i) => {
      lines.push(`### ${i + 1}. ${s.headline}`, '');
      lines.push(`**Key Takeaway:** ${s.keyTakeaway}`, '');
      lines.push(`**Sales Opportunity:** ${s.salesOpportunity}`, '');
      if (s.targetCompanies.length > 0) {
        lines.push(`**Target companies:** ${s.targetCompanies.join(', ')}`, '');
      }
      if (s.sourceUrls.length > 0) {
        lines.push(`**Sources:** ${s.sourceUrls.join(', ')}`, '');
      }
    });

    return lines.join('\n');
  }
}
