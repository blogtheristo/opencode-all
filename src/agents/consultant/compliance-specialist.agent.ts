import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the Compliance Specialist for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Deep expertise in EU climate and digital regulations. You know how DWS IQ automates compliance workflows and can advise on regulatory strategy across all customer projects.

Core competencies:
- CBAM (Carbon Border Adjustment Mechanism): quarterly reporting, embedded emissions, authorized declarants
- CSRD (Corporate Sustainability Reporting Directive): double materiality, ESRS standards, assurance
- ETS (Emissions Trading System): Phase 4, free allocation, surrender obligations, MRV
- NIS2 (Network and Information Security Directive): critical infrastructure, incident reporting
- CER (Critical Entities Resilience Directive): resilience plans, risk assessment
- EU AI Act: Article 12 logging, high-risk classification, conformity assessment
- DWS IQ automation: how each product axis maps to regulatory requirements

Regulatory calendar awareness:
- CBAM: Quarterly CBAM declarations, annual verification
- CSRD: Annual sustainability report aligned with financial reporting
- ETS: Annual MRV, surrender by April 30
- NIS2: 24h initial notification, 72h detailed report for incidents

Output format: Always respond with valid JSON containing keys: "regulatoryAssessment", "complianceGaps", "automationOpportunities", "deadlines", "recommendations".`;

export class ComplianceSpecialistAgent extends BaseAgent {
  constructor() {
    super({
      name: 'compliance-specialist',
      description:
        'Deep regulatory expertise in CBAM, CSRD, ETS, NIS2, CER, and EU AI Act with DWS IQ automation mapping',
      capabilities: [
        'regulatory-advisory',
        'cbam-expertise',
        'csrd-reporting',
        'ets-management',
        'nis2-compliance',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const regulations = (input.regulations as string[]) || ['cbam', 'csrd', 'ets'];
    const industry = (input.industry as string) || 'manufacturing';

    logger.info('Compliance Specialist executing', {
      regulations,
      industry,
      userId: context.userId,
    });

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

    const prompt = `Provide regulatory compliance advisory:
Industry: ${industry}
Regulations of interest: ${regulations.join(', ')}
Current compliance measures: ${JSON.stringify(input.currentMeasures || 'none specified')}
Annual emissions (tonnes CO2e): ${(input.annualEmissions as number) || 'unknown'}
Import value (EUR): ${(input.importValue as number) || 'unknown'}
Number of employees: ${(input.employees as number) || 'unknown'}
Question: ${(input.question as string) || 'Provide a comprehensive compliance assessment'}

Assess regulatory exposure, identify gaps, and recommend DWS IQ automation opportunities.`;

    const llmResponse = await this.callLLM(prompt);
    const durationMs = Date.now() - startTime;

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(llmResponse.content);
    } catch {
      parsed = { rawAnalysis: llmResponse.content };
    }

    const response: AgentResponse = {
      agentName: this.config.name,
      result: { regulations, industry, ...parsed },
      confidence: 0.85,
      reasoning: `Assessed compliance posture for ${industry} across ${regulations.join(', ')}. Identified automation opportunities with DWS IQ.`,
      recommendations: Array.isArray(parsed.recommendations)
        ? (parsed.recommendations as string[])
        : ['Conduct full compliance gap analysis', 'Map regulatory deadlines to DWS IQ automation'],
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
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
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}
