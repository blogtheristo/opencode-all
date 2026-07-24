/**
 * Outreach Lead Finder Agent — Step 1 of 4 in DWS Outreach Pipeline
 *
 * Finds high-intent EU enterprise leads matching an Ideal Customer Profile (ICP).
 * Scores each candidate against regulatory exposure + role fit using DGX Spark Ollama.
 * Upserts scored leads into Supabase outreach_orgs + persons tables.
 *
 * DGX Spark routing: BaseAgent.callLLM() auto-routes to DGX Spark Ollama
 * when OLLAMA_BASE_URL / OLLAMA_HOST env vars are set (see ollama-env.ts).
 * Default model: llama3.3:70b (OLLAMA_MODEL_AGENT).
 *
 * Input:  { icp, industry, roleId, region, regulatoryTrigger, maxLeads }
 * Output: scored leads array + Supabase upsert count
 *
 * Tier: 1 (read/score only — no outbound communication)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ ICP TARGET UNIVERSE ============

export interface TargetCandidate {
  name: string;
  domain: string;
  industry: string;
  regulations: string[];
  region: string;
  /** Buying personas likely at this company type */
  likelyRoles: string[];
}

/** EU enterprise universe covering DWS target sectors (ETS/CSRD/CBAM-exposed) */
export const EU_TARGET_UNIVERSE: TargetCandidate[] = [
  // Steel & Metals
  {
    name: 'SSAB',
    domain: 'ssab.com',
    industry: 'steel',
    regulations: ['ETS', 'CBAM'],
    region: 'SE',
    likelyRoles: ['R07', 'R23', 'R13'],
  },
  {
    name: 'Outokumpu',
    domain: 'outokumpu.com',
    industry: 'steel',
    regulations: ['ETS', 'CBAM'],
    region: 'FI',
    likelyRoles: ['R07', 'R23'],
  },
  {
    name: 'SSAB Luleå',
    domain: 'ssab.com',
    industry: 'steel',
    regulations: ['ETS', 'CBAM', 'CSRD'],
    region: 'SE',
    likelyRoles: ['R07', 'R13'],
  },
  // Construction
  {
    name: 'NCC',
    domain: 'ncc.com',
    industry: 'construction',
    regulations: ['CSRD', 'EU-Taxonomy'],
    region: 'SE',
    likelyRoles: ['R07', 'R22'],
  },
  {
    name: 'YIT',
    domain: 'yitgroup.com',
    industry: 'construction',
    regulations: ['CSRD', 'EU-Taxonomy'],
    region: 'FI',
    likelyRoles: ['R07', 'R13'],
  },
  {
    name: 'SRV Group',
    domain: 'srv.fi',
    industry: 'construction',
    regulations: ['CSRD', 'EU-Taxonomy'],
    region: 'FI',
    likelyRoles: ['R22', 'R07'],
  },
  {
    name: 'Skanska',
    domain: 'skanska.com',
    industry: 'construction',
    regulations: ['CSRD', 'SBTs', 'EU-Taxonomy'],
    region: 'SE',
    likelyRoles: ['R07', 'R13'],
  },
  {
    name: 'PORR AG',
    domain: 'porr-group.com',
    industry: 'construction',
    regulations: ['CSRD', 'CBAM'],
    region: 'AT',
    likelyRoles: ['R07', 'R23'],
  },
  // Cement & Materials
  {
    name: 'Heidelberg Materials',
    domain: 'heidelbergmaterials.com',
    industry: 'cement',
    regulations: ['ETS', 'CBAM', 'CSRD'],
    region: 'DE',
    likelyRoles: ['R07', 'R23', 'R13'],
  },
  {
    name: 'Holcim',
    domain: 'holcim.com',
    industry: 'cement',
    regulations: ['ETS', 'CBAM', 'SBTs'],
    region: 'CH',
    likelyRoles: ['R07', 'R22'],
  },
  // Manufacturing & Forest
  {
    name: 'UPM-Kymmene',
    domain: 'upm.com',
    industry: 'manufacturing',
    regulations: ['ETS', 'CSRD'],
    region: 'FI',
    likelyRoles: ['R07', 'R23'],
  },
  {
    name: 'Stora Enso',
    domain: 'storaenso.com',
    industry: 'manufacturing',
    regulations: ['ETS', 'CSRD'],
    region: 'FI',
    likelyRoles: ['R07', 'R13'],
  },
  // Energy & Renewables
  {
    name: 'Wärtsilä',
    domain: 'wartsila.com',
    industry: 'energy',
    regulations: ['ETS', 'FuelEU', 'Fit-for-55'],
    region: 'FI',
    likelyRoles: ['R07', 'R13'],
  },
  {
    name: 'Neste',
    domain: 'neste.com',
    industry: 'energy',
    regulations: ['ETS', 'CBAM', 'CSRD'],
    region: 'FI',
    likelyRoles: ['R07', 'R22', 'R23'],
  },
  // Logistics
  {
    name: 'Posti Group',
    domain: 'posti.com',
    industry: 'logistics',
    regulations: ['CSRD', 'Scope3'],
    region: 'FI',
    likelyRoles: ['R07', 'R13'],
  },
  {
    name: 'DB Schenker',
    domain: 'dbschenker.com',
    industry: 'logistics',
    regulations: ['CSRD', 'GLEC', 'Scope3'],
    region: 'DE',
    likelyRoles: ['R07', 'R22'],
  },
];

// R-ID → Role name map (from DWS_ROLES_REGISTRY.md, R01–R25)
const ROLE_MAP: Record<string, string> = {
  R07: 'Chief Sustainability Officer (CSO)',
  R13: 'Chief Information Officer (CIO)',
  R19: 'Chief Revenue Officer (CRO)',
  R22: 'Chief Executive Officer (CEO)',
  R23: 'Chief Financial Officer (CFO)',
  R02: 'IP / Legal Director',
  R01: 'Sustainability Manager',
  R08: 'EHS Director',
  R14: 'Head of Digital',
  R24: 'Board Director',
};

// ============ INPUT / OUTPUT TYPES ============

interface LeadFinderInput {
  icp: string;
  industry: string;
  roleId: string;
  region: string;
  regulatoryTrigger: string;
  maxLeads: number;
}

interface ScoredLead {
  name: string;
  domain: string;
  industry: string;
  region: string;
  regulations: string[];
  fitScore: number;
  fitReason: string;
  targetRole: string;
  regulatoryUrgency: string;
}

// ============ AGENT IMPLEMENTATION ============

export class OutreachLeadFinderAgent extends BaseAgent {
  constructor() {
    super({
      name: 'outreach-lead-finder',
      description:
        'Finds and scores high-intent EU enterprise leads matching an ICP. Upserts results to Supabase outreach_orgs. Powered by DGX Spark Ollama.',
      capabilities: [
        'lead-generation',
        'icp-matching',
        'regulatory-scoring',
        'prospect-research',
        'outreach',
        'b2b-sales',
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

      // Stage 1: Filter candidates by industry + region
      const candidates = this.filterCandidates(validated);

      // Stage 2: Score candidates against ICP using DGX Spark
      const scored = await this.scoreCandidates(candidates, validated);

      // Stage 3: Upsert top leads to Supabase outreach_orgs
      const upsertCount = await this.upsertLeads(scored.slice(0, validated.maxLeads), context);

      const confidence = scored.length > 0 ? Math.min(0.9, 0.5 + scored.length * 0.04) : 0.3;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          leads: scored.slice(0, validated.maxLeads),
          totalCandidates: candidates.length,
          scored: scored.length,
          upsertedToSupabase: upsertCount,
          targetRole: ROLE_MAP[validated.roleId] || validated.roleId,
        },
        confidence,
        reasoning: `Filtered ${candidates.length} candidates from EU target universe for "${validated.industry}" in "${validated.region}". Scored ${scored.length} against ICP "${validated.icp}" with regulatory trigger "${validated.regulatoryTrigger}". Top ${Math.min(scored.length, validated.maxLeads)} upserted to outreach_orgs.`,
        recommendations: [
          `Run outreach-message-crafter on the ${Math.min(scored.length, validated.maxLeads)} leads to generate personalized emails`,
          `Target role ${ROLE_MAP[validated.roleId] || validated.roleId} across all leads`,
          `Regulatory hook: ${validated.regulatoryTrigger} — use this as the opening angle`,
        ],
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          industry: validated.industry,
          region: validated.region,
          roleId: validated.roleId,
          regulatoryTrigger: validated.regulatoryTrigger,
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
      logger.error('Lead finder failed', { agent: this.config.name, error: errorMessage });

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
        reasoning: `Lead finder failed: ${errorMessage}`,
        recommendations: [
          'Check ICP description (min 10 chars)',
          'Verify industry matches DWS target sectors',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): LeadFinderInput {
    const icp = typeof input.icp === 'string' ? input.icp.trim() : '';
    if (icp.length < 10)
      throw new Error('icp must describe the target customer profile (min 10 chars)');

    const industry =
      typeof input.industry === 'string' ? input.industry.trim().toLowerCase() : 'manufacturing';
    const roleId = typeof input.roleId === 'string' ? input.roleId.trim() : 'R07';
    const region = typeof input.region === 'string' ? input.region.trim().toUpperCase() : 'EU';
    const regulatoryTrigger =
      typeof input.regulatoryTrigger === 'string' ? input.regulatoryTrigger.trim() : 'CSRD';
    const raw = typeof input.maxLeads === 'number' ? input.maxLeads : 5;
    const maxLeads = Math.max(1, Math.min(15, Math.round(raw)));

    return { icp, industry, roleId, region, regulatoryTrigger, maxLeads };
  }

  private filterCandidates(input: LeadFinderInput): TargetCandidate[] {
    return EU_TARGET_UNIVERSE.filter((c) => {
      const industryMatch =
        input.industry === 'all' ||
        c.industry === input.industry ||
        c.industry.includes(input.industry);
      const regionMatch = input.region === 'EU' || c.region === input.region;
      const regulationMatch =
        input.regulatoryTrigger === 'all' ||
        c.regulations.some((r) => r.toLowerCase().includes(input.regulatoryTrigger.toLowerCase()));
      return industryMatch || (regionMatch && regulationMatch);
    });
  }

  private async scoreCandidates(
    candidates: TargetCandidate[],
    input: LeadFinderInput,
  ): Promise<ScoredLead[]> {
    if (candidates.length === 0) {
      return EU_TARGET_UNIVERSE.slice(0, input.maxLeads).map((c) =>
        this.toScoredLead(c, 0.5, 'Default match — ICP filter returned no results'),
      );
    }

    const prompt = [
      `Score each company 0.0–1.0 for fit against this Ideal Customer Profile (ICP):`,
      `ICP: ${input.icp}`,
      `Target industry: ${input.industry}`,
      `Target role: ${ROLE_MAP[input.roleId] || input.roleId}`,
      `Regulatory trigger: ${input.regulatoryTrigger}`,
      ``,
      `Companies to score:`,
      JSON.stringify(
        candidates.map((c) => ({
          name: c.name,
          industry: c.industry,
          regulations: c.regulations,
          region: c.region,
        })),
      ),
      ``,
      `Return JSON: {"scores": [{"name": string, "fitScore": number, "fitReason": string, "regulatoryUrgency": string}]}`,
      `fitScore: 0.0 = poor fit, 1.0 = perfect fit. fitReason: 1 sentence. regulatoryUrgency: low/medium/high.`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content) as {
        scores: Array<{
          name: string;
          fitScore: number;
          fitReason: string;
          regulatoryUrgency: string;
        }>;
      };
      if (Array.isArray(parsed.scores)) {
        return candidates
          .map((c) => {
            const score = parsed.scores.find((s) => s.name === c.name);
            return this.toScoredLead(
              c,
              score?.fitScore ?? 0.5,
              score?.fitReason ?? 'LLM scored',
              score?.regulatoryUrgency ?? 'medium',
            );
          })
          .sort((a, b) => b.fitScore - a.fitScore);
      }
    } catch {
      // fall through to deterministic fallback
    }

    return candidates
      .map((c) => {
        const regHit = c.regulations.some((r) =>
          r.toLowerCase().includes(input.regulatoryTrigger.toLowerCase()),
        );
        const roleHit = c.likelyRoles.includes(input.roleId);
        const score =
          (regHit ? 0.5 : 0.2) + (roleHit ? 0.3 : 0) + (c.region === input.region ? 0.2 : 0);
        return this.toScoredLead(
          c,
          Math.min(1, score),
          `${input.regulatoryTrigger} exposure${roleHit ? ' + target role match' : ''}`,
        );
      })
      .sort((a, b) => b.fitScore - a.fitScore);
  }

  private toScoredLead(
    c: TargetCandidate,
    fitScore: number,
    fitReason: string,
    regulatoryUrgency = 'medium',
  ): ScoredLead {
    return {
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      region: c.region,
      regulations: c.regulations,
      fitScore: Math.round(fitScore * 100) / 100,
      fitReason,
      targetRole: c.likelyRoles[0] || 'R07',
      regulatoryUrgency,
    };
  }

  private async upsertLeads(leads: ScoredLead[], context: AgentContext): Promise<number> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      logger.debug('Supabase not configured — skipping lead upsert');
      return 0;
    }

    let upserted = 0;
    for (const lead of leads) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/outreach_orgs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            domain: lead.domain,
            name: lead.name,
            industry: lead.industry,
            region: lead.region,
            fit_score: lead.fitScore,
            fit_reason: lead.fitReason,
            regulatory_triggers: lead.regulations,
            pipeline: 'customer',
            sourced_by: this.config.name,
            sourced_at: new Date().toISOString(),
            org_id: context.orgId,
          }),
        });
        if (res.ok || res.status === 409) upserted++;
      } catch (err) {
        logger.warn('Failed to upsert lead', { lead: lead.name, error: String(err) });
      }
    }
    return upserted;
  }
}
