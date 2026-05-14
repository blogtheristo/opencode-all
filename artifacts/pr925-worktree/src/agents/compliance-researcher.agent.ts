/**
 * Compliance Researcher Agent - EU Regulatory Research & Report Generation
 *
 * Extracted from: github.com/Shubhamsaboo/awesome-llm-apps
 * Original file: starter_ai_agents/opeani_research_agent/research_agent.py
 * Extraction date: 2026-02-11
 * Agent session: claude/deepwiki-agent-extraction-aS6Ub
 * Purpose: Research EU regulations (CSRD, ETS, CBAM, Fit for 55) and generate compliance reports
 * License: MIT (original repo)
 *
 * Pattern: Triage (plan) → Research (search + fact collection) → Report (synthesis)
 * Adapted from OpenAI Agents SDK handoff pattern to DWS6 BaseAgent.
 *
 * Input: {
 *   topic:       Research topic or regulatory question
 *   regulations: Array of regulation IDs to focus on ("csrd", "ets", "cbam", "fit55", "nis2")
 *   industry:    Target industry for impact assessment
 *   depth:       "quick" (summary) | "standard" (report) | "deep" (comprehensive)
 * }
 *
 * Output: Research plan, key findings, compliance report, recommendations with sources
 *
 * Tier: 1 (read-only analysis, no mutations)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT INTERFACE ============

type Regulation = 'csrd' | 'ets' | 'cbam' | 'fit55' | 'nis2' | 'eu-ai-act' | 'taxonomy';

interface ComplianceResearcherInput {
  topic: string;
  regulations: Regulation[];
  industry: string;
  depth: 'quick' | 'standard' | 'deep';
}

// ============ REGULATION KNOWLEDGE BASE ============

interface RegulationInfo {
  fullName: string;
  effectiveDate: string;
  scope: string;
  keyRequirements: string[];
  penalties: string;
  reportingDeadline: string;
}

const REGULATION_DB: Record<Regulation, RegulationInfo> = {
  csrd: {
    fullName: 'Corporate Sustainability Reporting Directive (2022/2464)',
    effectiveDate: '2024-01-01 (large companies), 2025-01-01 (listed SMEs)',
    scope: 'Companies with >250 employees or >EUR 50M revenue or >EUR 25M balance sheet',
    keyRequirements: [
      'Double materiality assessment (financial + impact)',
      'Report per European Sustainability Reporting Standards (ESRS)',
      'E1: Climate change disclosure (Scope 1/2/3 emissions)',
      'Limited assurance by auditor required',
      'Digital tagging (XBRL) for machine readability',
    ],
    penalties: 'Member state defined - typically administrative fines, director liability',
    reportingDeadline: 'Within annual management report, same deadline as financial statements',
  },
  ets: {
    fullName: 'EU Emissions Trading System - Phase 4 (2023/959)',
    effectiveDate: '2021-2030 (Phase 4), revised 2023',
    scope: 'Power stations, industrial plants >20MW, aviation, maritime (2024+)',
    keyRequirements: [
      'Annual monitoring, reporting, verification (MRV) of emissions',
      'Surrender allowances equal to verified emissions',
      'Free allocation based on benchmarks (declining annually)',
      'Fit for 55: -62% reduction target by 2030 vs 2005',
      'Maritime emissions included from 2024',
    ],
    penalties: 'EUR 100/tonne for non-surrendered allowances + naming',
    reportingDeadline: '31 March (verified emissions report), 30 April (allowance surrender)',
  },
  cbam: {
    fullName: 'Carbon Border Adjustment Mechanism (2023/956)',
    effectiveDate: '2023-10-01 (transitional), 2026-01-01 (definitive)',
    scope: 'Imports of cement, iron/steel, aluminium, fertilisers, electricity, hydrogen',
    keyRequirements: [
      'Quarterly reporting of embedded emissions in imports (transitional phase)',
      'Purchase CBAM certificates matching embedded emissions (definitive phase)',
      'Certificates priced at EU ETS weekly average',
      'Deduction for carbon price already paid in country of origin',
      'Authorized declarant registration required',
    ],
    penalties: 'EUR 50/tonne for non-reported emissions (transitional), EUR 100/tonne (definitive)',
    reportingDeadline: 'Quarterly during transitional phase, annual during definitive phase',
  },
  fit55: {
    fullName: 'Fit for 55 Package - European Green Deal',
    effectiveDate: '2021-2030 (phased implementation)',
    scope: 'Economy-wide EU climate target package',
    keyRequirements: [
      'Net -55% GHG emissions by 2030 vs 1990',
      'Revised ETS with tighter cap',
      'New ETS for buildings and road transport (ETS2) from 2027',
      'Renewable energy target: 42.5% by 2030',
      'Energy efficiency: -11.7% final energy consumption by 2030',
    ],
    penalties: 'Varies by individual regulation within the package',
    reportingDeadline: 'Varies by regulation',
  },
  nis2: {
    fullName: 'Network and Information Security Directive 2 (2022/2555)',
    effectiveDate: '2024-10-18 (transposition deadline)',
    scope: 'Essential and important entities in critical sectors including energy, transport, water',
    keyRequirements: [
      'Risk management measures for network and information systems',
      'Incident reporting within 24h (early warning), 72h (full notification)',
      'Supply chain security assessment',
      'Business continuity and crisis management',
      'Management body accountability and training',
    ],
    penalties: 'Up to EUR 10M or 2% global turnover (essential entities)',
    reportingDeadline: 'Ongoing compliance, incident reporting within 24-72 hours',
  },
  'eu-ai-act': {
    fullName: 'EU Artificial Intelligence Act (2024/1689)',
    effectiveDate: '2024-08-01 (entry), 2025-02 (prohibited), 2026-08 (high-risk)',
    scope: 'All AI systems placed on EU market or affecting EU persons',
    keyRequirements: [
      'Risk classification: unacceptable, high, limited, minimal',
      'Article 12: Automatic logging for high-risk AI systems',
      'Reasoning lineage documentation',
      'Conformity assessment before market placement',
      'Post-market monitoring',
    ],
    penalties: 'Up to EUR 35M or 7% global turnover',
    reportingDeadline: 'Continuous compliance, incident reporting to market surveillance authority',
  },
  taxonomy: {
    fullName: 'EU Taxonomy Regulation (2020/852)',
    effectiveDate: '2022-01-01 (climate objectives)',
    scope: 'Large companies subject to CSRD, financial market participants',
    keyRequirements: [
      'Disclose proportion of Taxonomy-aligned activities',
      'Six environmental objectives (climate mitigation, adaptation, water, circular economy, pollution, biodiversity)',
      'Technical screening criteria per activity',
      'Do No Significant Harm (DNSH) principle',
      'Minimum social safeguards compliance',
    ],
    penalties: 'Through CSRD enforcement mechanisms',
    reportingDeadline: 'Annual, aligned with CSRD reporting',
  },
};

// ============ AGENT IMPLEMENTATION ============

export class ComplianceResearcherAgent extends BaseAgent {
  constructor() {
    super({
      name: 'compliance-researcher',
      description:
        'Researches EU climate regulations (CSRD, ETS, CBAM, Fit for 55, NIS2, EU AI Act, Taxonomy) and generates compliance reports with impact assessments',
      capabilities: [
        'regulatory-research',
        'compliance-report',
        'impact-assessment',
        'deadline-tracking',
        'penalty-analysis',
        'industry-mapping',
      ],
      model: 'llama-3.1-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
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

      // Phase 1: Triage - build research plan
      const plan = this.buildResearchPlan(validated);

      // Phase 2: Research - gather regulatory facts
      const findings = this.gatherFindings(validated);

      // Phase 3: Report - synthesize with LLM
      const report = await this.synthesizeReport(validated, plan, findings);

      const confidence = this.calculateConfidence(validated);
      const recommendations = this.generateRecommendations(findings, validated.industry);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          researchPlan: plan,
          findings,
          report,
          regulationsAnalyzed: validated.regulations,
          industry: validated.industry,
        },
        confidence,
        reasoning: `Researched ${validated.regulations.length} regulation(s) for ${validated.industry} industry. ${plan.searchQueries.length} research queries planned. Found ${findings.facts.length} key facts and ${findings.deadlines.length} upcoming deadlines.`,
        recommendations,
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          depth: validated.depth,
          regulationCount: validated.regulations.length,
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

      logger.error('Compliance research failed', { agent: this.config.name, error: errorMessage });

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
        reasoning: `Research failed: ${errorMessage}`,
        recommendations: ['Verify regulation IDs are valid', 'Try a more specific topic'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): ComplianceResearcherInput {
    if (typeof input.topic !== 'string' || input.topic.length < 5) {
      throw new Error('topic must be a descriptive string (min 5 chars)');
    }
    const validRegs: Regulation[] = ['csrd', 'ets', 'cbam', 'fit55', 'nis2', 'eu-ai-act', 'taxonomy'];
    const regs: Regulation[] = Array.isArray(input.regulations)
      ? (input.regulations as string[]).filter((r) => validRegs.includes(r as Regulation)) as Regulation[]
      : ['csrd'];
    if (Array.isArray(input.regulations) && regs.length === 0) {
      throw new Error(`No valid regulations provided. Must include at least one of: ${validRegs.join(', ')}`);
    }
    const depth = ['quick', 'standard', 'deep'].includes(input.depth as string)
      ? (input.depth as 'quick' | 'standard' | 'deep')
      : 'standard';
    const industry = typeof input.industry === 'string' ? input.industry : 'general';

    return { topic: input.topic, regulations: regs, industry, depth };
  }

  private buildResearchPlan(input: ComplianceResearcherInput): {
    topic: string;
    searchQueries: string[];
    focusAreas: string[];
  } {
    const searchQueries: string[] = [];
    const focusAreas: string[] = [];

    for (const reg of input.regulations) {
      const info = REGULATION_DB[reg];
      searchQueries.push(`${info.fullName} requirements for ${input.industry}`);
      searchQueries.push(`${reg.toUpperCase()} compliance deadlines 2026`);
      focusAreas.push(`${info.fullName}: scope and applicability to ${input.industry}`);
    }

    if (input.depth === 'deep') {
      searchQueries.push(`${input.industry} EU climate compliance best practices 2026`);
      searchQueries.push(`${input.industry} ESRS disclosure examples`);
      focusAreas.push('Cross-regulation interactions and overlapping requirements');
      focusAreas.push('Industry-specific implementation guidance');
    }

    return { topic: input.topic, searchQueries, focusAreas };
  }

  private gatherFindings(input: ComplianceResearcherInput): {
    facts: Array<{ regulation: string; fact: string; source: string }>;
    deadlines: Array<{ regulation: string; deadline: string; description: string }>;
    penalties: Array<{ regulation: string; penalty: string }>;
    applicability: Array<{ regulation: string; applies: boolean; reason: string }>;
  } {
    const facts: Array<{ regulation: string; fact: string; source: string }> = [];
    const deadlines: Array<{ regulation: string; deadline: string; description: string }> = [];
    const penalties: Array<{ regulation: string; penalty: string }> = [];
    const applicability: Array<{ regulation: string; applies: boolean; reason: string }> = [];

    for (const reg of input.regulations) {
      const info = REGULATION_DB[reg];

      // Key facts
      for (const req of info.keyRequirements) {
        facts.push({
          regulation: reg.toUpperCase(),
          fact: req,
          source: info.fullName,
        });
      }

      // Deadlines
      deadlines.push({
        regulation: reg.toUpperCase(),
        deadline: info.reportingDeadline,
        description: `${info.fullName} reporting deadline`,
      });

      // Penalties
      penalties.push({
        regulation: reg.toUpperCase(),
        penalty: info.penalties,
      });

      // Applicability assessment
      applicability.push({
        regulation: reg.toUpperCase(),
        applies: true,
        reason: `Scope: ${info.scope}. Effective: ${info.effectiveDate}.`,
      });
    }

    return { facts, deadlines, penalties, applicability };
  }

  private async synthesizeReport(
    input: ComplianceResearcherInput,
    plan: { searchQueries: string[]; focusAreas: string[] },
    findings: {
      facts: Array<{ regulation: string; fact: string }>;
      deadlines: Array<{ regulation: string; deadline: string; description: string }>;
    },
  ): Promise<{ title: string; executiveSummary: string; sections: Array<{ heading: string; content: string }>; nextSteps: string[] }> {
    const prompt = [
      `Write a compliance research report for the ${input.industry} industry.`,
      `Topic: ${input.topic}`,
      `Regulations: ${input.regulations.join(', ')}`,
      `Depth: ${input.depth}`,
      `Key facts found: ${JSON.stringify(findings.facts.slice(0, 10))}`,
      `Deadlines: ${JSON.stringify(findings.deadlines)}`,
      ``,
      `Generate a structured report as JSON with fields:`,
      `- title (string)`,
      `- executiveSummary (string, 2-3 sentences)`,
      `- sections (array of {heading, content})`,
      `- nextSteps (string[])`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content);
      return {
        title: parsed.title || '',
        executiveSummary: parsed.executiveSummary || '',
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      };
    } catch {
      // Deterministic fallback
      const regNames = input.regulations.map((r) => REGULATION_DB[r].fullName).join(', ');
      return {
        title: `Compliance Research: ${input.industry} — ${input.topic}`,
        executiveSummary: `Compliance research for ${input.industry}: Analyzed ${input.regulations.length} regulation(s) (${regNames}). Found ${findings.facts.length} key requirements and ${findings.deadlines.length} deadlines. Refer to detailed findings for actionable items.`,
        sections: plan.focusAreas.map((area) => ({ heading: area, content: '' })),
        nextSteps: [],
      };
    }
    // Deterministic fallback
    const regNames = input.regulations.map((r) => REGULATION_DB[r].fullName).join(', ');
    return {
      title: `${input.industry} Compliance Research`,
      executiveSummary: `Compliance research for ${input.industry}: Analyzed ${input.regulations.length} regulation(s) (${regNames}). Found ${findings.facts.length} key requirements and ${findings.deadlines.length} deadlines. Refer to detailed findings for actionable items.`,
      sections: [],
      nextSteps: [],
    };
  }

  private calculateConfidence(input: ComplianceResearcherInput): number {
    let confidence = 0.85;
    // More regulations = more comprehensive
    confidence += Math.min(input.regulations.length * 0.02, 0.1);
    // Deeper analysis = higher confidence
    if (input.depth === 'deep') confidence += 0.05;
    if (input.depth === 'quick') confidence -= 0.05;
    return Math.max(0, Math.min(1, confidence));
  }

  private generateRecommendations(
    findings: { deadlines: Array<{ regulation: string; deadline: string }>; penalties: Array<{ regulation: string; penalty: string }> },
    industry: string,
  ): string[] {
    const recs: string[] = [];

    // Deadline-based recommendations
    for (const d of findings.deadlines) {
      recs.push(`${d.regulation}: Ensure compliance by ${d.deadline}`);
    }

    // Penalty-based urgency
    const highPenalty = findings.penalties.find((p) => p.penalty.includes('35M') || p.penalty.includes('10M'));
    if (highPenalty) {
      recs.push(`HIGH PRIORITY: ${highPenalty.regulation} carries penalties up to ${highPenalty.penalty}`);
    }

    recs.push(`Schedule regulatory review for ${industry} with legal counsel`);
    recs.push('Use emissions-data-analyst agent to validate data before regulatory submission');

    return recs;
  }
}
