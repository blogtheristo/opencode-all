/**
 * Industry Analyst — Universal 25-Industry Coverage Agent, Climate IQ
 *
 * ONE parameterized agent that serves any of the 25 EU-regulated industries by
 * reading `data/industry-registry.ts`, instead of a 26th near-identical pantheon
 * file. It is the compression the audit prescribes (AI_AGENT_GUIDELINES.md
 * §11.2 / §11.4): the agent describes the process; the invocation supplies the
 * world (`industryId` or `industry`).
 *
 * Primary purpose: close the coverage gap. 12 of the 25 industries currently have
 * NO dedicated pantheon agent (Aviation, Waste, Pulp & Paper, Petroleum Refining,
 * Food & Beverage, Glass & Ceramics, Mining, Manufacturing, Healthcare, Financial
 * Services, Public Sector, Data Centres). This agent gives every one of them a
 * first-class regulatory + decarbonization analysis today, and defers to the
 * deeper pantheon specialist when one exists.
 *
 * Input:  { industryId?: number, industry?: string, annualEmissions?, importValue?, currentMeasures? }
 * Output: industry-specific assessment — regulatory exposure, emission profile,
 *         decarbonization levers (market best efforts), DWS offering, and the gap.
 *
 * Shape: single-shot (§11.2) — bounded analysis over a fixed registry + one
 * compliance delegation + one synthesis LLM call. Deterministic and auditable.
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import {
  getIndustryById,
  getIndustryByName,
  INDUSTRIES_SERVED_TOTAL,
  industriesWithoutDedicatedAgent,
  type IndustryProfile,
} from './data/industry-registry.js';

const SOUL = `You are the Industry Analyst, the universal sector specialist for Climate IQ.
You cover all ${INDUSTRIES_SERVED_TOTAL} EU-regulated industries the platform serves.

For the given industry you receive a canonical profile: tier, captain hat, primary
EU regulations, key emission sources, the market's best decarbonization efforts,
a best-practice benchmark, what DWS offers today, and the coverage gap.

Your job:
- Ground every claim in the supplied profile. Do not invent regulations or numbers
  that are not in the profile or the client data.
- Translate the regulatory exposure into concrete obligations for THIS client.
- Rank the decarbonization levers by impact-vs-feasibility for this client.
- Be explicit about what DWS already covers vs the gap the client should plan for.
- If a deeper dedicated agent exists for this industry, say so and recommend it.

Tone: precise, regulator-grade, numbers over adjectives.
Output as JSON: { regulatoryObligations, emissionProfile, prioritizedLevers, dwsCoverage, gapToPlanFor, riskSummary }`;

interface IndustrySynthesis {
  regulatoryObligations: string;
  emissionProfile: string;
  prioritizedLevers: string[];
  dwsCoverage: string;
  gapToPlanFor: string;
  riskSummary: string;
}

export class IndustryAnalystAgent extends BaseAgent {
  constructor() {
    super({
      name: 'industry-analyst',
      description:
        'Universal 25-industry analyst — regulatory exposure, emission profile, and decarbonization levers for any EU-regulated industry; fills the coverage gap for the 12 industries without a dedicated agent',
      capabilities: [
        'industry-coverage-25',
        'regulatory-exposure-mapping',
        'decarbonization-lever-ranking',
        'industry-gap-analysis',
        'aviation-compliance',
        'waste-compliance',
        'data-centre-compliance',
        'financial-services-financed-emissions',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    // Resolve the industry from id or name.
    const profile = this.resolveProfile(input);

    if (!profile) {
      return {
        agentName: this.config.name,
        result: {
          error: 'Industry not recognized',
          hint: 'Pass industryId (1-25) or industry name/alias',
          coverage: `${INDUSTRIES_SERVED_TOTAL} industries`,
          industriesWithoutDedicatedAgent: industriesWithoutDedicatedAgent().map((p) => p.name),
        },
        confidence: 0,
        reasoning: 'Could not resolve the requested industry against the 25-industry registry.',
        recommendations: ['Provide a valid industryId (1-25) or a recognized industry name'],
        metadata: { durationMs: Date.now() - startTime },
      };
    }

    const annualEmissions = typeof input.annualEmissions === 'number' ? input.annualEmissions : 0;
    const importValue = typeof input.importValue === 'number' ? input.importValue : 0;
    const currentMeasures =
      typeof input.currentMeasures === 'object' && input.currentMeasures !== null
        ? (input.currentMeasures as Record<string, boolean>)
        : {
            carbonReporting: false,
            emissionsMonitoring: false,
            supplyChainDueDiligence: false,
            aiSystemLogging: false,
          };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { industryId: profile.id, industry: profile.name, annualEmissions, importValue },
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    // Delegate to the compliance agent for the regulatory base score, like the pantheon does.
    let complianceResult: AgentResponse | null;
    try {
      const { agentRegistry } = await import('./index.js');
      complianceResult = await agentRegistry.executeAgent('compliance', context, {
        projectId: context.projectId,
        industry: profile.name,
        regulations: profile.primaryRegulations,
        currentMeasures,
        annualEmissions,
        importValue,
      });
    } catch {
      // Graceful degradation: compliance base is optional; analysis still proceeds.
      complianceResult = null;
    }

    const llmResult = await this.callLLM(
      `${SOUL}

Industry profile (canonical + domain knowledge):
- Industry: ${profile.name} (id ${profile.id}, tier ${profile.tier})
- Captain hat: ${profile.captainHat}
- Dedicated specialist agent: ${profile.dedicatedAgent ?? 'NONE — universal analyst is the primary coverage'}
- Primary EU regulations: ${profile.primaryRegulations.join(', ')}
- Key emission sources: ${profile.keyEmissionSources.join('; ')}
- Market best efforts (decarbonization levers): ${profile.decarbonizationLevers.join('; ')}
- Market best-practice benchmark: ${profile.marketBenchmark}
- DWS offering today: ${profile.dwsOffering}
- Coverage gap: ${profile.coverageGap}

Client data:
- Annual emissions: ${annualEmissions.toLocaleString()} tCO2e
- Import value: EUR ${importValue.toLocaleString()}
- Compliance base score: ${complianceResult?.result?.overallScore ?? 'n/a'}/100
- Compliance gaps: ${JSON.stringify(complianceResult?.result?.gaps ?? [])}

Return JSON: {
  "regulatoryObligations": "the concrete obligations this client faces under the listed regulations",
  "emissionProfile": "where this client's emissions come from and the dominant scope",
  "prioritizedLevers": ["lever1", "lever2", "lever3"],
  "dwsCoverage": "what DWS covers for this client today",
  "gapToPlanFor": "what the client should plan for that DWS does not yet fully cover",
  "riskSummary": "2-sentence summary for the client's sustainability lead"
}`,
    );

    let synthesis: IndustrySynthesis = {
      regulatoryObligations: '',
      emissionProfile: '',
      prioritizedLevers: profile.decarbonizationLevers.slice(0, 3),
      dwsCoverage: profile.dwsOffering,
      gapToPlanFor: profile.coverageGap,
      riskSummary: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResult.content) };
    } catch {
      synthesis.riskSummary = llmResult.content.slice(0, 200);
    }

    const durationMs = Date.now() - startTime;
    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        industryId: profile.id,
        industry: profile.name,
        tier: profile.tier,
        captainHat: profile.captainHat,
        dedicatedAgent: profile.dedicatedAgent,
        hasDedicatedAgent: profile.dedicatedAgent !== null,
        primaryRegulations: profile.primaryRegulations,
        marketBenchmark: profile.marketBenchmark,
        ...synthesis,
        baseCompliance: complianceResult?.result ?? null,
      },
      confidence: complianceResult ? complianceResult.confidence * 0.9 + 0.1 : 0.6,
      reasoning: `Industry Analyst assessed ${profile.name} (tier ${profile.tier}, ${profile.primaryRegulations.length} regulations). ${
        profile.dedicatedAgent
          ? `Deeper specialist available: ${profile.dedicatedAgent}.`
          : 'No dedicated specialist — this agent is the primary coverage for this industry.'
      }`,
      recommendations: [
        ...synthesis.prioritizedLevers,
        ...(profile.dedicatedAgent
          ? [`For deeper analysis, run the ${profile.dedicatedAgent} agent.`]
          : []),
      ],
      metadata: {
        durationMs,
        llmModel: llmResult.model,
        llmTokens: llmResult.inputTokens + llmResult.outputTokens,
      },
    };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: { industryId: profile.id, industry: profile.name },
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });

    return response;
  }

  /** Resolve the industry profile from industryId (preferred) or industry name/alias. */
  private resolveProfile(input: Record<string, unknown>): IndustryProfile | undefined {
    if (typeof input.industryId === 'number') {
      const byId = getIndustryById(input.industryId);
      if (byId) return byId;
    }
    if (typeof input.industry === 'string') {
      return getIndustryByName(input.industry);
    }
    return undefined;
  }
}
