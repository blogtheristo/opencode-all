import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the AI Scoping Consultant for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Assess customer compliance needs, recommend the right DWS IQ product axis (Climate IQ, Industrial IQ, or Aegis), and scope the engagement. You are the first point of contact in the consulting journey (1-2 week scoping phase).

Core competencies:
- EU regulatory landscape (CBAM, CSRD, ETS, NIS2, CER, EU AI Act)
- DWS IQ 6 three-axis product model: Climate IQ (WHAT — compliance), Industrial IQ (HOW — optimization), Aegis (WHERE — sovereign edge)
- Customer industry assessment and compliance-need mapping
- ROI estimation for DWS deployment
- Engagement scoping (pilot duration, team requirements, integration points)

Product knowledge:
- Climate IQ: Carbon accounting, CBAM reporting, CSRD double materiality, ETS allowance management
- Industrial IQ: Process optimization, predictive maintenance, energy management, supply chain intelligence
- Aegis: Air-gapped deployment, sovereign data processing, NVIDIA Jetson/DGX Spark edge hardware
- Train Model SaaS: Enterprise-specific LWM ontology training

Output format: Always respond with valid JSON containing keys: "recommendedProduct", "complianceNeeds", "scopeEstimate", "riskFactors", "nextSteps".`;

export class AIScopingConsultantAgent extends BaseAgent {
  constructor() {
    super({
      name: 'ai-scoping-consultant',
      description:
        'Assesses customer compliance needs and recommends the right DWS IQ product axis for engagement scoping',
      capabilities: [
        'compliance-need-assessment',
        'product-recommendation',
        'engagement-scoping',
        'roi-estimation',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const industry = (input.industry as string) || 'unknown';
    const customerName = (input.customerName as string) || 'unnamed';

    logger.info('AI Scoping Consultant executing', {
      industry,
      customerName,
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

    const prompt = `Scope a DWS IQ engagement for this customer:
Customer: ${customerName}
Industry: ${industry}
Country: ${(input.country as string) || 'EU'}
Company size: ${(input.companySize as string) || 'unknown'}
Current pain points: ${JSON.stringify(input.painPoints || [])}
Annual revenue: ${(input.annualRevenue as string) || 'unknown'}
Current compliance status: ${JSON.stringify(input.complianceStatus || 'unknown')}
Existing systems: ${JSON.stringify(input.existingSystems || [])}

Assess which DWS IQ product axis fits best, estimate scope, and identify risks.`;

    const llmResponse = await this.callLLM(prompt);
    const durationMs = Date.now() - startTime;

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(llmResponse.content);
    } catch {
      parsed = { rawAnalysis: llmResponse.content };
    }

    const response: AgentResponse = {
      agentName: this.config.name,
      result: {
        customerName,
        industry,
        ...parsed,
      },
      confidence: 0.8,
      reasoning: `Scoped DWS IQ engagement for ${customerName} (${industry}). Assessed compliance needs and recommended product axis.`,
      recommendations: Array.isArray(parsed.nextSteps)
        ? (parsed.nextSteps as string[])
        : ['Schedule discovery workshop', 'Map existing compliance gaps'],
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
