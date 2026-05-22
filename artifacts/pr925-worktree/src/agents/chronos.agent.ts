/**
 * Chronos — Temporal Workflow + Deadline Planning Engine
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Chronos, the Greek personification of Time.
 * Chronos manages time-sensitive regulatory deadlines, workflow scheduling,
 * EU compliance calendar, and durable task orchestration via Temporal.io.
 * It knows every CBAM, CSRD, ETS, and ESRS reporting deadline by heart.
 *
 * Book types #2 (Planning Agent) + #8 (Agentic Workflow System).
 *
 * Input: { action, year?, orgId?, regulation?, deadline?, workflow? }
 * Output: deadline calendar, workflow plan, critical path, Temporal cron spec
 *
 * Actions:
 *   - deadline-calendar: All EU compliance deadlines for a year
 *   - critical-path: Which deadlines are at risk given current progress
 *   - workflow-plan: Temporal.io workflow spec for a compliance process
 *   - schedule: Create or update a scheduled task
 *   - countdown: Days remaining to a specific deadline
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type ChronosAction =
  | 'deadline-calendar'
  | 'critical-path'
  | 'workflow-plan'
  | 'schedule'
  | 'countdown';

/**
 * EU compliance deadlines registry (static for 2026).
 * Sources: CBAM Reg. 2023/956; CSRD Dir. 2022/2464; EU ETS Dir. 2003/87/EC amended;
 *          ESRS Del. Reg. 2023/2772; EU AI Act Reg. 2024/1689.
 */
const EU_COMPLIANCE_DEADLINES_2026: Array<{
  regulation: string;
  deadline: string;
  description: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
}> = [
  {
    regulation: 'CBAM',
    deadline: '2026-01-31',
    description: 'CBAM quarterly report Q4 2025 submission',
    risk: 'HIGH',
  },
  {
    regulation: 'EU ETS',
    deadline: '2026-02-28',
    description: 'ETS verified emissions report for 2025',
    risk: 'HIGH',
  },
  {
    regulation: 'EU ETS',
    deadline: '2026-04-30',
    description: 'ETS surrender allowances for 2025 emissions',
    risk: 'HIGH',
  },
  {
    regulation: 'CBAM',
    deadline: '2026-04-30',
    description: 'CBAM quarterly report Q1 2026 submission',
    risk: 'HIGH',
  },
  {
    regulation: 'CSRD',
    deadline: '2026-06-30',
    description: 'CSRD first-wave large companies sustainability report',
    risk: 'HIGH',
  },
  {
    regulation: 'CBAM',
    deadline: '2026-07-31',
    description: 'CBAM quarterly report Q2 2026 submission',
    risk: 'MEDIUM',
  },
  {
    regulation: 'EU AI Act',
    deadline: '2026-08-02',
    description: 'EU AI Act general-purpose AI model compliance (12-month grace)',
    risk: 'HIGH',
  },
  {
    regulation: 'CBAM',
    deadline: '2026-10-31',
    description: 'CBAM quarterly report Q3 2026 submission',
    risk: 'MEDIUM',
  },
  {
    regulation: 'ESRS',
    deadline: '2026-12-31',
    description: 'ESRS E1–E4 double materiality assessment completion',
    risk: 'MEDIUM',
  },
];

export class ChronosAgent extends BaseAgent {
  constructor() {
    super({
      name: 'chronos',
      description:
        'Temporal workflow + deadline planning — EU compliance deadline calendar, ' +
        'critical path analysis for at-risk deadlines, Temporal.io workflow specs, ' +
        `and scheduling engine. Tracks ${EU_COMPLIANCE_DEADLINES_2026.length} EU compliance deadlines for 2026.`,
      capabilities: [
        'eu-deadline-calendar',
        'critical-path-analysis',
        'temporal-workflow-spec',
        'compliance-scheduling',
        'deadline-countdown',
        'at-risk-detection',
        'cron-specification',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Chronos, the temporal workflow and deadline planning agent for DWS IQ.
You know every EU compliance deadline and help organisations stay on schedule.

2026 EU compliance deadlines (${EU_COMPLIANCE_DEADLINES_2026.length} tracked):
${EU_COMPLIANCE_DEADLINES_2026.map((d) => `- ${d.deadline}: [${d.regulation}] ${d.description} [${d.risk}]`).join('\n')}

Planning principles:
1. Work backwards from deadline — identify the latest safe start date.
2. Buffer for verification: add 14 days before each submission deadline.
3. Critical path = the sequence of dependent tasks where any delay pushes the final deadline.
4. For Temporal.io specs: output cronSchedule, workflowType, taskQueue, searchAttributes.
5. Always flag HIGH risk deadlines first.

Output structured JSON with: action, year, deadlines, criticalPath, workflowSpec, countdowns, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as ChronosAction) || 'deadline-calendar';
    const year = (input.year as number) || new Date().getFullYear();
    const regulation = (input.regulation as string) || 'all';
    const today = new Date().toISOString().split('T')[0];

    const relevantDeadlines =
      regulation === 'all'
        ? EU_COMPLIANCE_DEADLINES_2026
        : EU_COMPLIANCE_DEADLINES_2026.filter((d) =>
            d.regulation.toLowerCase().includes(regulation.toLowerCase()),
          );

    const upcomingHighRisk = relevantDeadlines.filter(
      (d) => d.risk === 'HIGH' && d.deadline >= today,
    );

    const prompt = `Chronos action: ${action}
Year: ${year}
Regulation filter: ${regulation}
Today: ${today}
Relevant deadlines: ${relevantDeadlines.length}
Upcoming HIGH risk: ${upcomingHighRisk.length}
Workflow spec requested: ${JSON.stringify(input.workflow || {})}

Perform ${action} temporal analysis.
Output structured JSON with:
- action: "${action}"
- year: ${year}
- deadlines: [{regulation, deadline, description, daysRemaining, risk, status}]
- criticalPath: [{task, deadline, bufferDays, dependencies}]
- workflowSpec: {cronSchedule?, workflowType?, taskQueue?, searchAttributes?} or null
- nextHighRiskDeadline: string (ISO date)
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: {
        action,
        year,
        regulation,
        totalDeadlines: relevantDeadlines.length,
        upcomingHighRisk: upcomingHighRisk.length,
        response: llmResponse,
      },
      confidence: 0.92,
      reasoning: `Chronos performed ${action} — ${upcomingHighRisk.length} HIGH risk deadlines upcoming`,
      recommendations: upcomingHighRisk
        .slice(0, 3)
        .map((d) => `[${d.regulation}] ${d.deadline}: ${d.description}`),
      metadata: {
        sessionId: context.sessionId,
        action,
        year,
        totalDeadlines2026: EU_COMPLIANCE_DEADLINES_2026.length,
        today,
      },
    };
  }
}
