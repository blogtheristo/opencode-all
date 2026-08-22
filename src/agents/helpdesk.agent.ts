/**
 * Helpdesk Agent — AI-native support ticket triage
 *
 * Code-Version: 1.0.0
 * Branch: claude/ai-native-support-workflow-1c4kO
 * Date: 2026-05-12
 * Owner: Lifetime Oy
 *
 * Reads a support ticket, the customer's plan and history, and the support
 * policy KB, then drafts a reply with a recommended action. Never sends
 * email — a human reviewer approves the draft via the reviewer endpoints.
 *
 * Invariant: this module MUST NOT import src/utils/send-email.ts. The
 * draft-only contract is enforced by a unit test that walks the import
 * graph.
 *
 * Input:  { action: 'triage', ticketId }
 * Output: { intent, confidence, draftReply, recommendedAction,
 *           citedPolicySources, escalationReason? }
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { BaseAgent } from './base.agent.js';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';
import type { AgentContext, AgentResponse } from './types.js';
import type { SupabaseClient } from '@supabase/supabase-js';

type Recommendation = 'resolve' | 'reply' | 'escalate' | 'refund' | 'plan-upgrade-suggest';

const KB_ROOT = resolve(process.cwd(), 'kb');
const POLICY_DIR = join(KB_ROOT, 'wiki', 'concepts', 'support');
const POLICY_BYTES_BUDGET = 24_000;
const PRIOR_TICKETS_LIMIT = 5;
const ESCALATION_CONFIDENCE = 0.6;

interface TicketRow {
  id: string;
  source: string;
  customer_id: string | null;
  user_id: string | null;
  from_addr: string | null;
  subject: string | null;
  body: string;
  status: string;
}

interface CustomerSnapshot {
  customer: Record<string, unknown> | null;
  subscription: Record<string, unknown> | null;
  plan: Record<string, unknown> | null;
  priorTickets: Array<{ id: string; subject: string | null; status: string; created_at: string }>;
}

interface PolicyChunk {
  path: string;
  content: string;
}

export interface HelpdeskTriageResult {
  intent: string;
  confidence: number;
  draftReply: string;
  recommendedAction: Recommendation;
  citedPolicySources: string[];
  escalationReason?: string;
}

export class HelpdeskAgent extends BaseAgent {
  constructor() {
    super({
      name: 'helpdesk',
      description:
        'Support ticket triage agent. Reads ticket + customer plan + prior tickets + policy KB, ' +
        'then drafts a reply and recommends an action (resolve / reply / escalate / refund / plan-upgrade-suggest). ' +
        'Never sends email — humans approve via the reviewer endpoints.',
      capabilities: [
        'support-ticket-triage',
        'customer-context-lookup',
        'policy-citation',
        'human-in-the-loop-draft',
      ],
      model: 'claude-sonnet-4-6',
      modelTier: 'standard',
    });

    this.soulPrompt = `You are Helpdesk, the support triage agent for DWS IQ.

Your job: read the ticket, the customer's plan and history, and the support policy, then draft a reply.
You NEVER send email — a human reviews your draft and clicks send.

Principles:
1. Match the customer's tone. Be concise, warm, and specific.
2. Always cite the policy file(s) that support your answer in citedPolicySources.
3. If the question is a billing dispute, refund, account closure, contract change,
   security incident, or you are not confident — recommend "escalate" or "refund" so a human takes over.
4. If the customer is hitting a plan limit (e.g. agent_calls_per_month), recommend "plan-upgrade-suggest"
   and reference the specific plan tier and limit.
5. If your confidence is below ${ESCALATION_CONFIDENCE}, set recommendedAction to "escalate" and put a clear
   one-sentence reason in escalationReason so the human knows what they're being asked.
6. Output STRICT JSON only — no prose, no markdown fences.

Output shape:
{
  "intent": "string — short tag like 'plan-limit', 'billing', 'bug-report', 'how-to', 'refund'",
  "confidence": 0.0–1.0,
  "draftReply": "the full reply text the human will review",
  "recommendedAction": "resolve" | "reply" | "escalate" | "refund" | "plan-upgrade-suggest",
  "citedPolicySources": ["wiki/concepts/support/refund-policy.md", ...],
  "escalationReason": "string — only when recommendedAction is escalate/refund"
}`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as string) || 'triage';
    if (action !== 'triage') {
      return this.errorResponse(`Unknown action: ${action}. Use 'triage'.`);
    }

    const ticketId = (input.ticketId as string) || '';
    if (!ticketId) {
      return this.errorResponse('ticketId is required');
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.errorResponse('Supabase not configured');
    }

    const ticket = await this.loadTicket(supabase, ticketId);
    if (!ticket) {
      return this.errorResponse(`Ticket not found: ${ticketId}`);
    }

    const snapshot = await this.loadCustomerSnapshot(supabase, ticket);
    const policy = this.loadPolicy();

    if (policy.length === 0) {
      logger.warn('Helpdesk policy KB is empty — agent confidence will be low', {
        policyDir: POLICY_DIR,
      });
    }

    const triage = await this.draftTriage(ticket, snapshot, policy);

    let escalationId: string | null = null;
    const needsEscalation =
      triage.confidence < ESCALATION_CONFIDENCE ||
      triage.recommendedAction === 'escalate' ||
      triage.recommendedAction === 'refund';

    if (needsEscalation) {
      escalationId = await this.createEscalation(supabase, ticket, triage);
    }

    await this.persistTriage(supabase, ticket, triage, escalationId);

    return {
      agentName: this.config.name,
      result: { ...triage, ticketId: ticket.id, escalationId },
      confidence: triage.confidence,
      reasoning: `Triaged ticket ${ticket.id} → intent=${triage.intent}, action=${triage.recommendedAction}`,
      recommendations: [
        needsEscalation
          ? `Human reviewer required — escalation ${escalationId ?? '(create failed)'}`
          : `Human reviewer to approve draft via POST /api/v1/support/tickets/${ticket.id}/send`,
      ],
      metadata: {
        sessionId: context.sessionId,
        ticketId: ticket.id,
        policyFilesLoaded: policy.length,
        priorTickets: snapshot.priorTickets.length,
      },
    };
  }

  // ============ Data loading ============

  private async loadTicket(supabase: SupabaseClient, ticketId: string): Promise<TicketRow | null> {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id, source, customer_id, user_id, from_addr, subject, body, status')
      .eq('id', ticketId)
      .limit(1);
    if (error || !data || data.length === 0) {
      if (error)
        logger.error('Helpdesk: failed to load ticket', { ticketId, error: error.message });
      return null;
    }
    return data[0] as TicketRow;
  }

  private async loadCustomerSnapshot(
    supabase: SupabaseClient,
    ticket: TicketRow,
  ): Promise<CustomerSnapshot> {
    const snapshot: CustomerSnapshot = {
      customer: null,
      subscription: null,
      plan: null,
      priorTickets: [],
    };

    if (ticket.customer_id) {
      const { data: c } = await supabase
        .from('customers')
        .select(
          'id, name, industry, country, status, current_mrr, primary_contact_email, contract_start_date, contract_end_date',
        )
        .eq('id', ticket.customer_id)
        .limit(1);
      snapshot.customer = (c && c[0]) || null;

      const { data: s } = await supabase
        .from('subscriptions')
        .select(
          'id, product_name, billing_cycle, monthly_amount, currency, is_active, next_billing_date, cancelled_at',
        )
        .eq('customer_id', ticket.customer_id)
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1);
      snapshot.subscription = (s && s[0]) || null;

      const productName = (snapshot.subscription?.product_name as string | undefined) || null;
      if (productName) {
        const { data: p } = await supabase
          .from('subscription_plans')
          .select(
            'tier, price_monthly_eur, agent_calls_per_month, edge_devices, features, support_type',
          )
          .ilike('tier', `%${productName}%`)
          .limit(1);
        snapshot.plan = (p && p[0]) || null;
      }

      const { data: prior } = await supabase
        .from('support_tickets')
        .select('id, subject, status, created_at')
        .eq('customer_id', ticket.customer_id)
        .neq('id', ticket.id)
        .order('created_at', { ascending: false })
        .limit(PRIOR_TICKETS_LIMIT);
      snapshot.priorTickets = (prior as CustomerSnapshot['priorTickets']) ?? [];
    }

    return snapshot;
  }

  private loadPolicy(): PolicyChunk[] {
    if (!existsSync(POLICY_DIR)) return [];
    const chunks: PolicyChunk[] = [];
    let total = 0;
    const entries = readdirSync(POLICY_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.md')) continue;
      const fullPath = join(POLICY_DIR, entry.name);
      const stat = statSync(fullPath);
      if (stat.size > POLICY_BYTES_BUDGET) continue;
      if (total + stat.size > POLICY_BYTES_BUDGET) break;
      const content = readFileSync(fullPath, 'utf-8');
      chunks.push({ path: relative(KB_ROOT, fullPath), content });
      total += stat.size;
    }
    return chunks;
  }

  // ============ LLM draft ============

  private async draftTriage(
    ticket: TicketRow,
    snapshot: CustomerSnapshot,
    policy: PolicyChunk[],
  ): Promise<HelpdeskTriageResult> {
    const policyBlock = policy.length
      ? policy.map((p) => `=== ${p.path} ===\n${p.content}`).join('\n\n')
      : '(no policy files loaded — confidence should be capped low)';

    const customerBlock = snapshot.customer
      ? JSON.stringify(snapshot.customer, null, 2)
      : '(unknown customer — ticket from unrecognized email)';
    const planBlock = snapshot.plan
      ? JSON.stringify(snapshot.plan, null, 2)
      : '(no active plan resolved)';
    const subBlock = snapshot.subscription
      ? JSON.stringify(snapshot.subscription, null, 2)
      : '(no active subscription)';
    const priorBlock = snapshot.priorTickets.length
      ? snapshot.priorTickets
          .map((t) => `- ${t.created_at} [${t.status}] ${t.subject ?? '(no subject)'}`)
          .join('\n')
      : '(no prior tickets)';

    const prompt = `Triage this support ticket.

TICKET
------
id: ${ticket.id}
source: ${ticket.source}
from: ${ticket.from_addr ?? '(unknown)'}
subject: ${ticket.subject ?? '(no subject)'}

body:
${ticket.body}

CUSTOMER
--------
${customerBlock}

SUBSCRIPTION
------------
${subBlock}

PLAN
----
${planBlock}

PRIOR TICKETS (most recent first, up to ${PRIOR_TICKETS_LIMIT})
-----------------------------------------------------------
${priorBlock}

SUPPORT POLICY KB
-----------------
${policyBlock}

Respond with STRICT JSON only matching the schema in the system prompt.`;

    const llm = await this.callLLM(prompt);
    return this.parseTriage(llm.content, policy);
  }

  private parseTriage(raw: string, policy: PolicyChunk[]): HelpdeskTriageResult {
    let parsed: Record<string, unknown>;
    try {
      const trimmed = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```$/m, '')
        .trim();
      parsed = JSON.parse(trimmed);
    } catch {
      logger.warn('Helpdesk: LLM output was not valid JSON — falling back to escalate', {
        rawPrefix: raw.slice(0, 200),
      });
      return {
        intent: 'unknown',
        confidence: 0,
        draftReply: 'Thanks for reaching out — a member of our team will follow up shortly.',
        recommendedAction: 'escalate',
        citedPolicySources: [],
        escalationReason: 'LLM returned non-JSON output',
      };
    }

    const allowedActions: Recommendation[] = [
      'resolve',
      'reply',
      'escalate',
      'refund',
      'plan-upgrade-suggest',
    ];
    const action: Recommendation = allowedActions.includes(
      parsed.recommendedAction as Recommendation,
    )
      ? (parsed.recommendedAction as Recommendation)
      : 'escalate';

    const validPaths = new Set(policy.map((p) => p.path));
    const cited = Array.isArray(parsed.citedPolicySources)
      ? (parsed.citedPolicySources as unknown[])
          .filter((s): s is string => typeof s === 'string')
          .filter((s) => validPaths.has(s))
      : [];

    let confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0;
    if (confidence < 0) confidence = 0;
    if (confidence > 1) confidence = 1;
    if (policy.length === 0 && confidence > ESCALATION_CONFIDENCE) {
      confidence = ESCALATION_CONFIDENCE - 0.01;
    }

    return {
      intent: typeof parsed.intent === 'string' ? parsed.intent : 'unknown',
      confidence,
      draftReply:
        typeof parsed.draftReply === 'string' && parsed.draftReply.trim().length > 0
          ? (parsed.draftReply as string)
          : 'Thanks for reaching out — a member of our team will follow up shortly.',
      recommendedAction: action,
      citedPolicySources: cited,
      escalationReason:
        typeof parsed.escalationReason === 'string'
          ? (parsed.escalationReason as string)
          : undefined,
    };
  }

  // ============ Persistence ============

  private async createEscalation(
    supabase: SupabaseClient,
    ticket: TicketRow,
    triage: HelpdeskTriageResult,
  ): Promise<string | null> {
    const reason =
      triage.escalationReason ||
      `Helpdesk recommends ${triage.recommendedAction} (confidence ${triage.confidence.toFixed(2)})`;
    const recipient = process.env.HIL_ESCALATION_EMAIL || 'risto@lifetime.fi';

    const { data, error } = await supabase
      .from('hil_escalations')
      .insert({
        agent_name: 'helpdesk',
        reason,
        confidence: triage.confidence,
        context: {
          ticketId: ticket.id,
          intent: triage.intent,
          recommendedAction: triage.recommendedAction,
          citedPolicySources: triage.citedPolicySources,
          from_addr: ticket.from_addr,
          subject: ticket.subject,
        },
        channel: 'email',
        recipient,
        status: 'pending',
      })
      .select('id')
      .limit(1);

    if (error || !data || data.length === 0) {
      logger.error('Helpdesk: failed to create escalation', {
        ticketId: ticket.id,
        error: error?.message,
      });
      return null;
    }
    return data[0].id as string;
  }

  private async persistTriage(
    supabase: SupabaseClient,
    ticket: TicketRow,
    triage: HelpdeskTriageResult,
    escalationId: string | null,
  ): Promise<void> {
    const newStatus = escalationId ? 'awaiting_human' : 'triaged';

    const { error: updateError } = await supabase
      .from('support_tickets')
      .update({
        intent_tag: triage.intent,
        agent_confidence: triage.confidence,
        agent_draft: triage.draftReply,
        agent_recommendation: triage.recommendedAction,
        cited_sources: triage.citedPolicySources,
        escalation_id: escalationId,
        status: newStatus,
      })
      .eq('id', ticket.id);

    if (updateError) {
      logger.error('Helpdesk: failed to write triage to ticket', {
        ticketId: ticket.id,
        error: updateError.message,
      });
    }

    await supabase.from('ticket_events').insert({
      ticket_id: ticket.id,
      actor_type: 'agent',
      actor_id: 'helpdesk',
      event_type: escalationId ? 'escalated' : 'triaged',
      payload: {
        intent: triage.intent,
        confidence: triage.confidence,
        recommendedAction: triage.recommendedAction,
        citedPolicySources: triage.citedPolicySources,
        escalationId,
      },
    });
  }

  private errorResponse(message: string): AgentResponse {
    return {
      agentName: this.config.name,
      result: { error: message },
      confidence: 0,
      reasoning: message,
      recommendations: ['Fix the input and retry'],
      metadata: {},
    };
  }
}
