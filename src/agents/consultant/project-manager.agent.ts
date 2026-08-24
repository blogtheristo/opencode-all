import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the Project Manager for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Coordinate multi-role consulting projects, manage JIRA workflows, customer documentation, and ensure timely delivery of DWS IQ engagements.

Core competencies:
- Project planning: Gantt charts, sprint planning, milestone tracking
- JIRA workflow management: epics, stories, task breakdown
- Stakeholder communication: status reports, steering committee briefings
- Resource allocation across the 8 consultant roles
- Risk management and mitigation planning
- Customer documentation: SOWs, project charters, acceptance criteria
- Budget tracking and burn-rate monitoring
- Multi-role project coordination (scoping → deployment → go-live)

Engagement phases:
1. Scoping (1-2 weeks): AI Scoping Consultant leads, PM coordinates
2. Design (2-4 weeks): GenAI Solution Architect + Compliance Specialist
3. Pilot (3 months): DWS Deployment Engineer + Edge AI Engineer + DevOps
4. Go-Live (2 weeks): Full team, PM manages cutover
5. Hypercare (4 weeks): Compliance Specialist + Enterprise Model Engineer

Deliverables per phase:
- Scoping: Needs assessment, product recommendation, SOW
- Design: Architecture document, integration plan, compliance mapping
- Pilot: Working environment, validated integrations, user training
- Go-Live: Production deployment, data migration, acceptance sign-off
- Hypercare: Knowledge transfer, documentation, SLA monitoring

Output format: Always respond with valid JSON containing keys: "projectPlan", "teamAllocation", "milestones", "risks", "deliverables".`;

export class ProjectManagerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'project-manager',
      description:
        'Coordinates multi-role DWS IQ consulting projects with JIRA workflows, scheduling, and customer documentation',
      capabilities: [
        'project-planning',
        'resource-allocation',
        'stakeholder-management',
        'risk-management',
        'jira-workflows',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const projectName = (input.projectName as string) || 'unnamed-project';
    const phase = (input.phase as string) || 'scoping';

    logger.info('Project Manager executing', {
      projectName,
      phase,
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

    const prompt = `Create a project management plan:
Project: ${projectName}
Current phase: ${phase}
Customer: ${(input.customerName as string) || 'unnamed'}
Industry: ${(input.industry as string) || 'manufacturing'}
Team size available: ${(input.teamSize as number) || 4}
Roles needed: ${JSON.stringify(input.rolesNeeded || ['ai-scoping-consultant', 'deployment-engineer', 'compliance-specialist'])}
Timeline constraint: ${(input.timelineWeeks as number) || 16} weeks
Budget: ${(input.budget as string) || 'unspecified'}
Key risks: ${JSON.stringify(input.risks || [])}

Create the project plan with team allocation, milestones, risks, and deliverables for each phase.`;

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
      result: { projectName, phase, ...parsed },
      confidence: 0.8,
      reasoning: `Created project plan for "${projectName}" in ${phase} phase. Allocated team roles and defined milestones.`,
      recommendations: Array.isArray(parsed.risks)
        ? (parsed.risks as string[])
        : ['Define acceptance criteria with customer', 'Set up weekly status reporting'],
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
