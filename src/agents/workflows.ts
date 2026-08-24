/**
 * Workflow Definitions — DWS IQ 6/7
 *
 * Temporal-compatible workflow definitions for long-running, durable
 * agent orchestration. These replace the Express monolith's in-process
 * scheduling with properly resumable, retryable workflows.
 *
 * Fix #6 from DWS7 modernization: Event-driven architecture.
 *
 * Architecture:
 *   - WorkflowDefinition: Declarative workflow spec (agents, order, conditions)
 *   - WorkflowExecutor: Local executor (runs in-process, no Temporal required)
 *   - When Temporal is wired: these definitions export directly to Temporal workflows
 *
 * This is the "ship first" approach: workflows run in-process now,
 * migrate to Temporal when the infrastructure is ready.
 */

import logger from '../utils/logger.js';
import { agentRegistry } from './index.js';
import { eventBus } from './event-bus.js';
import { withWorkflowSpan, withWorkflowStepSpan } from '../observability/tracing.js';
import type { AgentContext, AgentResponse } from './types.js';
import { MORNING_INTELLIGENCE_WORKFLOW } from './workflow/workflows/morning-intelligence.js';
import { CONTENT_PIPELINE_WORKFLOW } from './workflow/workflows/content-pipeline.js';
import { OUTREACH_FULL_WORKFLOW } from './outreach-orchestrator.agent.js';

// ============ WORKFLOW TYPES ============

export type StepType = 'agent' | 'parallel' | 'condition' | 'emit-event';

export interface WorkflowStep {
  id: string;
  type: StepType;
  /** For 'agent' type: agent name to execute */
  agent?: string;
  /** For 'parallel' type: array of agent names to run concurrently */
  agents?: string[];
  /** For 'condition' type: expression evaluated against previous step results */
  condition?: string;
  /** For 'emit-event' type: event type to emit */
  eventType?: string;
  /** Input transform: maps previous step outputs to this step's input */
  inputFrom?: Record<string, string>;
  /** Human-readable step description */
  description: string;
  /** Retry policy */
  retry?: { maxAttempts: number; backoffMs: number };
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  version: string;
  steps: WorkflowStep[];
  /** Maximum total execution time in ms (default: 5 minutes) */
  timeoutMs?: number;
}

export interface WorkflowExecution {
  workflowName: string;
  executionId: string;
  status: 'running' | 'completed' | 'failed' | 'timed-out';
  startedAt: string;
  completedAt?: string;
  stepResults: Map<string, AgentResponse | AgentResponse[]>;
  error?: string;
}

// ============ BUILT-IN WORKFLOWS ============

/** Full compliance assessment: data analysis → regulatory check → recommendations */
export const COMPLIANCE_ASSESSMENT_WORKFLOW: WorkflowDefinition = {
  name: 'compliance-assessment',
  description:
    'Full EU compliance assessment: emissions analysis, regulatory gap check, and remediation recommendations',
  version: '1.0.0',
  timeoutMs: 300_000, // 5 minutes
  steps: [
    {
      id: 'analyze-emissions',
      type: 'agent',
      agent: 'emissions-data-analyst',
      description: 'Analyze emissions data and identify regulatory scope',
    },
    {
      id: 'check-compliance',
      type: 'agent',
      agent: 'compliance',
      description: 'Run compliance checks against EU regulations',
      inputFrom: { emissionsAnalysis: 'analyze-emissions.result' },
    },
    {
      id: 'assess-viability',
      type: 'agent',
      agent: 'viability',
      description: 'Calculate financial viability of compliance measures',
      inputFrom: { complianceGaps: 'check-compliance.result.gaps' },
    },
    {
      id: 'notify-complete',
      type: 'emit-event',
      eventType: 'workflow.compliance_assessment_complete',
      description: 'Emit completion event for downstream systems',
    },
  ],
};

/** Construction project full assessment: parallel sensor data + material + schedule, then unified assessment */
export const CONSTRUCTION_FULL_WORKFLOW: WorkflowDefinition = {
  name: 'construction-full',
  description:
    'Full construction project assessment: site safety, material carbon, schedule risk, then unified compliance',
  version: '1.0.0',
  timeoutMs: 300_000,
  steps: [
    {
      id: 'parallel-analysis',
      type: 'parallel',
      agents: ['sitesense', 'material-oracle', 'schedule-genius'],
      description: 'Run site safety, material carbon, and schedule analysis in parallel',
    },
    {
      id: 'unified-assessment',
      type: 'agent',
      agent: 'construction',
      description: 'Unified construction compliance assessment using parallel results',
      inputFrom: {
        sitesenseResult: 'parallel-analysis.0.result',
        materialResult: 'parallel-analysis.1.result',
        scheduleResult: 'parallel-analysis.2.result',
      },
    },
    {
      id: 'notify-complete',
      type: 'emit-event',
      eventType: 'workflow.construction_assessment_complete',
      description: 'Emit completion event',
    },
  ],
};

/** SEO pipeline: keyword research → competitor analysis → content brief → audit */
export const SEO_PIPELINE_WORKFLOW: WorkflowDefinition = {
  name: 'seo-pipeline',
  description: 'Full SEO pipeline: keyword intent → competitor surveillance → content brief',
  version: '1.0.0',
  timeoutMs: 600_000, // 10 minutes (LLM-heavy)
  steps: [
    {
      id: 'keyword-research',
      type: 'agent',
      agent: 'keyword-intent',
      description: 'Analyze keyword intent and search volume',
    },
    {
      id: 'competitor-analysis',
      type: 'agent',
      agent: 'competitor-surveillance',
      description: 'Analyze competitor positioning',
      inputFrom: { keywords: 'keyword-research.result' },
    },
    {
      id: 'content-strategy',
      type: 'agent',
      agent: 'content-brief',
      description: 'Generate content briefs from keyword and competitor data',
      inputFrom: {
        keywords: 'keyword-research.result',
        competitors: 'competitor-analysis.result',
      },
    },
  ],
};

/** Registry of all workflow definitions */
export const WORKFLOW_REGISTRY: Map<string, WorkflowDefinition> = new Map([
  ['compliance-assessment', COMPLIANCE_ASSESSMENT_WORKFLOW],
  ['construction-full', CONSTRUCTION_FULL_WORKFLOW],
  ['seo-pipeline', SEO_PIPELINE_WORKFLOW],
  // Climate IQ Pantheon Workflows
  ['morning-intelligence', MORNING_INTELLIGENCE_WORKFLOW],
  ['content-pipeline', CONTENT_PIPELINE_WORKFLOW],
  // Outreach Pipeline
  ['outreach-full', OUTREACH_FULL_WORKFLOW],
]);

// ============ WORKFLOW EXECUTOR ============

/**
 * Execute a workflow definition in-process.
 *
 * This is the local executor that runs without Temporal.
 * When Temporal is wired, this becomes the workflow implementation
 * registered with the Temporal worker.
 */
export async function executeWorkflow(
  workflow: WorkflowDefinition,
  input: Record<string, unknown>,
  context: AgentContext,
): Promise<WorkflowExecution> {
  const executionId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const execution: WorkflowExecution = {
    workflowName: workflow.name,
    executionId,
    status: 'running',
    startedAt: new Date().toISOString(),
    stepResults: new Map(),
  };

  logger.info('Workflow started', {
    workflow: workflow.name,
    executionId,
    steps: workflow.steps.length,
  });

  // Emit start event
  await eventBus.emit({
    type: `workflow.${workflow.name}.started`,
    source: `workflow:${executionId}`,
    payload: { workflowName: workflow.name, input },
    priority: 'normal',
    timestamp: new Date().toISOString(),
    orgId: context.orgId,
    sessionId: context.sessionId,
  });

  const timeout = workflow.timeoutMs || 300_000;
  const deadline = Date.now() + timeout;

  try {
    await withWorkflowSpan(
      workflow.name,
      {
        executionId,
        orgId: context.orgId,
        sessionId: context.sessionId,
        stepCount: workflow.steps.length,
      },
      async (wfSpan) => {
        for (const step of workflow.steps) {
          // Check timeout
          if (Date.now() > deadline) {
            execution.status = 'timed-out';
            execution.error = `Workflow timed out after ${timeout}ms`;
            wfSpan.setAttribute('dws.workflow.timed_out', true);
            break;
          }

          logger.debug('Workflow step executing', {
            workflow: workflow.name,
            step: step.id,
            type: step.type,
          });

          // Build step input from previous results
          const stepInput = buildStepInput(input, step.inputFrom, execution.stepResults);

          await withWorkflowStepSpan(step.id, step.type, async () => {
            switch (step.type) {
              case 'agent': {
                if (!step.agent) throw new Error(`Step ${step.id} missing agent name`);
                const result = await agentRegistry.executeAgent(step.agent, context, stepInput);
                execution.stepResults.set(step.id, result);
                break;
              }

              case 'parallel': {
                if (!step.agents) throw new Error(`Step ${step.id} missing agents list`);
                const results = await Promise.all(
                  step.agents.map((agent) => agentRegistry.executeAgent(agent, context, stepInput)),
                );
                // Store as array keyed by step.id
                execution.stepResults.set(step.id, results as unknown as AgentResponse);
                break;
              }

              case 'emit-event': {
                if (!step.eventType) throw new Error(`Step ${step.id} missing eventType`);
                await eventBus.emit({
                  type: step.eventType,
                  source: `workflow:${executionId}`,
                  payload: {
                    workflowName: workflow.name,
                    executionId,
                    stepResults: Object.fromEntries(execution.stepResults),
                  },
                  priority: 'normal',
                  timestamp: new Date().toISOString(),
                  orgId: context.orgId,
                  sessionId: context.sessionId,
                });
                break;
              }

              case 'condition': {
                // Simple condition evaluation — skip remaining steps if false
                // In Temporal, this would be a proper saga compensation
                logger.debug('Condition step (pass-through in local executor)', {
                  step: step.id,
                });
                break;
              }
            }
          });
        }

        if (execution.status === 'running') {
          execution.status = 'completed';
        }
        wfSpan.setAttribute('dws.workflow.status', execution.status);
      },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    execution.status = 'failed';
    execution.error = msg;
    logger.error('Workflow failed', {
      workflow: workflow.name,
      executionId,
      error: msg,
    });
  }

  execution.completedAt = new Date().toISOString();

  logger.info('Workflow completed', {
    workflow: workflow.name,
    executionId,
    status: execution.status,
    steps: execution.stepResults.size,
  });

  return execution;
}

/**
 * Build input for a workflow step by resolving references to previous step outputs.
 */
function buildStepInput(
  baseInput: Record<string, unknown>,
  inputFrom: Record<string, string> | undefined,
  stepResults: Map<string, AgentResponse | AgentResponse[]>,
): Record<string, unknown> {
  const result = { ...baseInput };

  if (!inputFrom) return result;

  for (const [key, path] of Object.entries(inputFrom)) {
    // Parse path like "analyze-emissions.result.gaps"
    const parts = path.split('.');
    const stepId = parts[0];
    const stepResult = stepResults.get(stepId);

    if (!stepResult) {
      logger.debug('Step result not found for inputFrom', { key, path, stepId });
      continue;
    }

    // Navigate the path
    let value: unknown = stepResult;
    for (let i = 1; i < parts.length; i++) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[parts[i]];
      } else {
        value = undefined;
        break;
      }
    }

    result[key] = value;
  }

  return result;
}
