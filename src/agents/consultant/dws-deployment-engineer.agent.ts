import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the DWS Deployment Engineer for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Install, configure, and integrate DWS IQ with customer ERP systems during the 3-month pilot phase. You are the hands-on technical implementer.

Core competencies:
- DWS IQ 6 deployment architecture (UpCloud Helsinki, Cloudflare, Supabase)
- ERP integration: SAP S/4HANA, IFS Cloud, Visma.net, Monitor ERP
- Data pipeline configuration (carbon data ingestion, API endpoints)
- Pilot environment setup and validation
- Migration from legacy compliance tools
- Performance tuning and monitoring setup

Integration patterns:
- SAP: RFC/BAPI connectors, S/4HANA OData APIs, carbon accounting module
- IFS: REST APIs, IoT Connect, asset management integration
- Visma: Visma.net API, accounting data sync, Nordic compliance
- Monitor: Production data feeds, quality metrics, material tracking

Output format: Always respond with valid JSON containing keys: "deploymentPlan", "integrationPoints", "prerequisites", "estimatedTimeline", "risks".`;

export class DWSDeploymentEngineerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'dws-deployment-engineer',
      description:
        'Plans and executes DWS IQ deployment with ERP integration for SAP, IFS, Visma, and Monitor systems',
      capabilities: [
        'erp-integration',
        'deployment-planning',
        'pilot-setup',
        'data-pipeline-config',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const erpSystem = (input.erpSystem as string) || 'unknown';
    const deploymentType = (input.deploymentType as string) || 'pilot';

    logger.info('DWS Deployment Engineer executing', {
      erpSystem,
      deploymentType,
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

    const prompt = `Plan a DWS IQ 6 deployment:
ERP system: ${erpSystem}
Deployment type: ${deploymentType}
Customer infrastructure: ${JSON.stringify(input.infrastructure || 'cloud')}
Data sources: ${JSON.stringify(input.dataSources || [])}
Security requirements: ${JSON.stringify(input.securityRequirements || 'standard')}
Integration endpoints needed: ${JSON.stringify(input.integrationEndpoints || [])}
Timeline constraint: ${(input.timelineWeeks as string) || '12 weeks'}

Create a deployment plan with integration points, prerequisites, and timeline.`;

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
      result: { erpSystem, deploymentType, ...parsed },
      confidence: 0.75,
      reasoning: `Planned ${deploymentType} deployment with ${erpSystem} integration. Identified integration points and prerequisites.`,
      recommendations: Array.isArray(parsed.risks)
        ? (parsed.risks as string[])
        : ['Verify ERP API access credentials', 'Set up staging environment first'],
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
