/**
 * Outreach Orchestrator Agent — Coordinator of the 4-step DWS Outreach Pipeline
 *
 * Chains the 3 specialist agents in sequence:
 *   Step 1: outreach-lead-finder   — find + score + upsert leads
 *   Step 2: outreach-message-crafter — craft personalized email + LinkedIn drafts
 *   Step 3: outreach-executor      — deliver (gated by human approval)
 *
 * autoSend defaults to false — Step 3 is only run when autoSend=true AND
 * approvedBy is provided. Without both, the orchestrator stops at Step 2
 * and returns drafts for human review.
 *
 * Also registers the OUTREACH_FULL_WORKFLOW for use with the WorkflowExecutor.
 *
 * Input:  { icp, industry, roleId, region, regulatoryTrigger, offering,
 *           maxLeads, emailStyle, linkedinDraft, autoSend, approvedBy,
 *           toEmail, toName }
 * Output: combined results from all steps run
 *
 * Tier: 2 (produces outbound communication — auto-send blocked without approvedBy)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import { agentRegistry } from './index.js';
import type { AgentContext, AgentResponse } from './types.js';
import type { WorkflowDefinition } from './workflows.js';

// ============ WORKFLOW DEFINITION ============

/** WorkflowDefinition for WorkflowExecutor (workflows.ts) */
export const OUTREACH_FULL_WORKFLOW: WorkflowDefinition = {
  name: 'outreach-full',
  description:
    'Full outreach pipeline: find high-intent leads → craft personalized messages → queue for review. Step 3 (send) requires explicit human approval.',
  version: '1.0.0',
  timeoutMs: 600_000, // 10 minutes (LLM-heavy on DGX Spark)
  steps: [
    {
      id: 'find-leads',
      type: 'agent',
      agent: 'outreach-lead-finder',
      description: 'Find and score high-intent EU enterprise leads matching the ICP',
    },
    {
      id: 'craft-messages',
      type: 'agent',
      agent: 'outreach-message-crafter',
      description: 'Craft personalized email + LinkedIn drafts for top leads',
      inputFrom: {
        leads: 'find-leads.result.leads',
        orgDomain: 'find-leads.result.leads.0.domain',
        orgName: 'find-leads.result.leads.0.name',
        regulatoryTrigger: 'find-leads.result.leads.0.regulations.0',
      },
    },
    {
      id: 'notify-ready',
      type: 'emit-event',
      eventType: 'workflow.outreach_full.drafts_ready',
      description: 'Emit event — drafts ready for human review before send',
    },
  ],
};

// ============ INPUT TYPE ============

interface OrchestratorInput {
  icp: string;
  industry: string;
  roleId: string;
  region: string;
  regulatoryTrigger: string;
  offering: string;
  maxLeads: number;
  emailStyle: 'consultative' | 'professional' | 'cold';
  linkedinDraft: boolean;
  autoSend: boolean;
  approvedBy?: string;
  toEmail?: string;
  toName?: string;
}

// ============ AGENT IMPLEMENTATION ============

export class OutreachOrchestratorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'outreach-orchestrator',
      description:
        'Orchestrates the full DWS outreach pipeline: lead finding → message crafting → delivery. Chains outreach-lead-finder, outreach-message-crafter, and outreach-executor. autoSend=false by default.',
      capabilities: [
        'outreach-orchestration',
        'lead-to-email',
        'multi-agent-coordination',
        'b2b-outreach',
        'sales-pipeline',
      ],
      model: 'placeholder',
      modelTier: 'lite',
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

      // ── Step 1: Find Leads ──────────────────────────────────────────────
      logger.info('Outreach orchestrator: Step 1 — find leads', { icp: validated.icp });
      const step1Result = await agentRegistry.executeAgent('outreach-lead-finder', context, {
        icp: validated.icp,
        industry: validated.industry,
        roleId: validated.roleId,
        region: validated.region,
        regulatoryTrigger: validated.regulatoryTrigger,
        maxLeads: validated.maxLeads,
      });

      const leads =
        (step1Result.result.leads as Array<{
          domain: string;
          name: string;
          fitReason: string;
          regulations: string[];
        }>) || [];
      if (leads.length === 0) {
        return this.buildResponse(
          'No leads found — adjust ICP or industry filter',
          { step1: step1Result },
          startTime,
          0.3,
        );
      }

      // ── Step 2: Craft Messages (for each lead) ──────────────────────────
      logger.info('Outreach orchestrator: Step 2 — craft messages', { leadCount: leads.length });
      const craftResults: AgentResponse[] = [];
      const topLeads = leads.slice(0, Math.min(leads.length, 5));

      for (const lead of topLeads) {
        const craftResult = await agentRegistry.executeAgent('outreach-message-crafter', context, {
          orgDomain: lead.domain,
          orgName: lead.name,
          offering: validated.offering,
          emailStyle: validated.emailStyle,
          linkedinDraft: validated.linkedinDraft,
          roleId: validated.roleId,
          regulatoryTrigger: lead.regulations?.[0] || validated.regulatoryTrigger,
          fitReason: lead.fitReason,
        });
        craftResults.push(craftResult);
      }

      const threadIds = craftResults
        .map((r) => (r.result as { threadId?: string }).threadId)
        .filter(Boolean);

      // ── Step 3: Execute (only if autoSend=true AND approvedBy is set) ──
      const executeResults: AgentResponse[] = [];
      if (validated.autoSend && validated.approvedBy && validated.toEmail) {
        logger.info('Outreach orchestrator: Step 3 — execute (autoSend=true)', {
          approvedBy: validated.approvedBy,
        });
        for (const threadId of threadIds) {
          if (!threadId) continue;
          const execResult = await agentRegistry.executeAgent('outreach-executor', context, {
            threadId,
            toEmail: validated.toEmail,
            toName: validated.toName || 'Sustainability Team',
            channel: 'email',
            approvedBy: validated.approvedBy,
          });
          executeResults.push(execResult);
        }
      } else if (validated.autoSend && !validated.approvedBy) {
        logger.warn(
          'Outreach orchestrator: autoSend=true but approvedBy missing — skipping Step 3 (Tier 2 gate)',
        );
      }

      const summary = {
        leadsFound: leads.length,
        draftsCrafted: craftResults.length,
        threadIds,
        emailsSent: executeResults.filter((r) => r.result.ok === true).length,
        autoSendSkipped: validated.autoSend && !validated.approvedBy,
        step1: step1Result.result,
        step2: craftResults.map((r) => ({ threadId: r.result.threadId, confidence: r.confidence })),
        step3: executeResults.map((r) => ({ ok: r.result.ok, detail: r.result.detail })),
      };

      const response = this.buildResponse(
        validateAutoSend(validated)
          ? `Pipeline complete: ${summary.leadsFound} leads → ${summary.draftsCrafted} drafts → ${summary.emailsSent} sent`
          : `Drafts ready: ${summary.draftsCrafted} personalized messages for ${summary.leadsFound} leads. Run outreach-executor with approvedBy to send.`,
        summary,
        startTime,
        Math.min(0.95, (step1Result.confidence + (craftResults[0]?.confidence || 0.7)) / 2),
      );

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
      logger.error('Outreach orchestrator failed', { error: errorMessage });

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
        reasoning: `Orchestration failed: ${errorMessage}`,
        recommendations: [
          'Check that outreach-lead-finder and outreach-message-crafter are registered',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): OrchestratorInput {
    const icp = typeof input.icp === 'string' ? input.icp.trim() : '';
    if (icp.length < 10) throw new Error('icp must describe the target profile (min 10 chars)');

    const industry = typeof input.industry === 'string' ? input.industry.trim() : 'manufacturing';
    const roleId = typeof input.roleId === 'string' ? input.roleId.trim() : 'R07';
    const region = typeof input.region === 'string' ? input.region.trim().toUpperCase() : 'EU';
    const regulatoryTrigger =
      typeof input.regulatoryTrigger === 'string' ? input.regulatoryTrigger.trim() : 'CSRD';
    const offering = typeof input.offering === 'string' ? input.offering.trim() : 'dws-iq6';
    const raw = typeof input.maxLeads === 'number' ? input.maxLeads : 5;
    const maxLeads = Math.max(1, Math.min(15, Math.round(raw)));
    const styles = ['consultative', 'professional', 'cold'] as const;
    const emailStyle = styles.includes(input.emailStyle as (typeof styles)[number])
      ? (input.emailStyle as OrchestratorInput['emailStyle'])
      : 'consultative';
    const linkedinDraft = input.linkedinDraft !== false;
    const autoSend = input.autoSend === true;
    const approvedBy = typeof input.approvedBy === 'string' ? input.approvedBy.trim() : undefined;
    const toEmail = typeof input.toEmail === 'string' ? input.toEmail.trim() : undefined;
    const toName = typeof input.toName === 'string' ? input.toName.trim() : undefined;

    return {
      icp,
      industry,
      roleId,
      region,
      regulatoryTrigger,
      offering,
      maxLeads,
      emailStyle,
      linkedinDraft,
      autoSend,
      approvedBy,
      toEmail,
      toName,
    };
  }

  private buildResponse(
    reasoning: string,
    result: Record<string, unknown>,
    startTime: number,
    confidence: number,
  ): AgentResponse {
    return {
      agentName: this.config.name,
      result,
      confidence,
      reasoning,
      recommendations: [
        'Review drafts in Supabase outreach_threads before sending',
        'Set approvedBy + toEmail to trigger Step 3 (email delivery)',
        'Monitor replies in outreach_threads (status: responded → meeting_booked)',
      ],
      metadata: { durationMs: Date.now() - startTime, model: this.config.model },
    };
  }
}

/** Check if autoSend would have been triggered */
function validateAutoSend(input: OrchestratorInput): boolean {
  return input.autoSend && !!input.approvedBy && !!input.toEmail;
}
