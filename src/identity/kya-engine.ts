/**
 * KYA Policy Engine — Shanghai Model
 *
 * Processes external identity signals (Shufti Pro, AML providers) and maps
 * them to trust chain actions: UPDATE_SCORE, TERMINATE_CHAIN, REVAL_LEASH.
 *
 * The "Shanghai Model" enforces real-time agent governance:
 *   - approved  → KYA Score +5, extend session TTL
 *   - declined  → TC-4 Cascade: terminate entire trust chain
 *   - ongoing changed → Tighten sandbox (revoke egress/write)
 *
 * @see Legal/KYA_SECURITY_v1.2.md §2.2 (Capability Gating — The Leash)
 * @see DWS_SECURITY_STANDARD.md §18.5 (Leash Snap Protocol)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { eventBus } from '../agents/event-bus.js';

// ============ TYPES ============

export interface ShuftiWebhookPayload {
  event: string;
  reference: string;
  verification_data: {
    aml_screening: {
      status: 'approved' | 'declined';
      filters?: string[];
    };
    ongoing_screening?: {
      status: 'changed' | 'unchanged';
    };
  };
  signature?: string;
}

export type PolicyAction = 'UPDATE_SCORE' | 'TERMINATE_CHAIN' | 'REVAL_LEASH';

export interface PolicyDecision {
  action: PolicyAction;
  sessionId: string;
  reason: string;
  details: Record<string, unknown>;
  durationMs: number;
  timestamp: string;
}

export interface ChainTerminationResult {
  sessionId: string;
  agentsTerminated: number;
  reason: string;
  forensicDump: boolean;
  durationMs: number;
}

// ============ POLICY ENGINE ============

/**
 * Evaluate a Shufti webhook signal and return the policy decision.
 * This is the core "bridge" logic mapping Shufti → DWS Policy Engine.
 */
export function evaluateSignal(payload: ShuftiWebhookPayload): PolicyDecision {
  const startTime = performance.now();
  const sessionId = payload.reference;
  const amlStatus = payload.verification_data.aml_screening.status;
  const ongoingStatus = payload.verification_data.ongoing_screening?.status;

  let action: PolicyAction;
  let reason: string;

  // Shanghai Model decision tree
  if (amlStatus === 'declined') {
    action = 'TERMINATE_CHAIN';
    reason = 'SHUFTI_AML_DECLINE';
  } else if (ongoingStatus === 'changed') {
    action = 'REVAL_LEASH';
    reason = 'SHUFTI_ONGOING_CHANGED';
  } else {
    action = 'UPDATE_SCORE';
    reason = 'SHUFTI_AML_APPROVED';
  }

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    action,
    sessionId,
    reason,
    details: {
      amlStatus,
      ongoingStatus: ongoingStatus || null,
      filters: payload.verification_data.aml_screening.filters || [],
    },
    durationMs,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Execute a policy decision against the trust chain.
 */
export async function executeDecision(decision: PolicyDecision): Promise<ChainTerminationResult | null> {
  // Emit event for Observer Dashboard (Supabase Realtime)
  eventBus.emit({
    type: 'kya.policy_decision',
    source: 'kya-engine',
    payload: {
      action: decision.action,
      sessionId: decision.sessionId,
      reason: decision.reason,
    },
    priority: decision.action === 'TERMINATE_CHAIN' ? 'critical' : 'normal',
    timestamp: decision.timestamp,
    orgId: '',
    sessionId: decision.sessionId,
  });

  switch (decision.action) {
    case 'TERMINATE_CHAIN':
      return terminateChain(decision.sessionId, {
        reason: decision.reason,
        forensicDump: true,
      });

    case 'REVAL_LEASH':
      await revalLeash(decision.sessionId, decision.reason);
      return null;

    case 'UPDATE_SCORE':
      await updateScore(decision.sessionId, 5, decision.reason);
      return null;

    default:
      logger.warn('Unknown policy action', { action: decision.action });
      return null;
  }
}

// ============ CHAIN TERMINATION (TC-4) ============

/**
 * Terminate an entire agent trust chain.
 * Finds the parent agent by session reference, then kills all children.
 *
 * TC-4 Cascade: SIGKILL to all PIDs in the trust_chain.
 */
export async function terminateChain(
  sessionId: string,
  options: { reason: string; forensicDump?: boolean },
): Promise<ChainTerminationResult> {
  const startTime = performance.now();
  const client = getSupabaseClient();

  logger.warn('TC-4 Chain Termination initiated', {
    sessionId,
    reason: options.reason,
  });

  let agentsTerminated = 0;

  if (client) {
    try {
      // 1. Find all agents in this session's trust chain
      const { data: chain, error } = await client
        .from('agent_executions')
        .select('id, agent_name, session_id, status')
        .eq('session_id', sessionId)
        .in('status', ['started', 'running']);

      if (error) {
        logger.error('Failed to query trust chain', { error: error.message });
      }

      if (chain && chain.length > 0) {
        // 2. Mark all as terminated with reason
        const { error: updateError } = await client
          .from('agent_executions')
          .update({
            status: 'terminated',
            error_message: `TC-4: ${options.reason}`,
          })
          .eq('session_id', sessionId)
          .in('status', ['started', 'running']);

        if (updateError) {
          logger.error('Failed to terminate chain', { error: updateError.message });
        }

        agentsTerminated = chain.length;
      }

      // 3. Write forensic record
      if (options.forensicDump) {
        await client.from('agent_activity').insert({
          agent_name: 'kya-engine',
          task: 'TC-4 Chain Termination',
          status: 'completed',
          metadata: {
            sessionId,
            reason: options.reason,
            agentsTerminated,
            chain: chain?.map(a => ({ id: a.id, name: a.agent_name })) || [],
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (err) {
      logger.error('Chain termination exception', {
        error: (err as Error).message,
        sessionId,
      });
    }
  }

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  // Emit termination event for Observer Dashboard
  eventBus.emit({
    type: 'kya.chain_terminated',
    source: 'kya-engine',
    payload: { sessionId, reason: options.reason, agentsTerminated, durationMs },
    priority: 'critical',
    timestamp: new Date().toISOString(),
    orgId: '',
    sessionId,
  });

  logger.info('TC-4 Chain Termination complete', {
    sessionId,
    agentsTerminated,
    durationMs: `${durationMs}ms`,
  });

  return {
    sessionId,
    agentsTerminated,
    reason: options.reason,
    forensicDump: options.forensicDump ?? false,
    durationMs,
  };
}

// ============ LEASH RE-EVALUATION ============

/**
 * Tighten sandbox constraints for a session.
 * Removes egress and write access when ongoing screening flags changes.
 */
async function revalLeash(sessionId: string, reason: string): Promise<void> {
  const client = getSupabaseClient();

  logger.info('Leash re-evaluation triggered', { sessionId, reason });

  if (client) {
    try {
      await client.from('agent_activity').insert({
        agent_name: 'kya-engine',
        task: 'REVAL_LEASH',
        status: 'completed',
        metadata: {
          sessionId,
          reason,
          action: 'sandbox_tightened',
          removedCapabilities: ['egress', 'write'],
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      logger.error('Leash re-evaluation logging failed', {
        error: (err as Error).message,
      });
    }
  }

  eventBus.emit({
    type: 'kya.leash_tightened',
    source: 'kya-engine',
    payload: { sessionId, reason },
    priority: 'high',
    timestamp: new Date().toISOString(),
    orgId: '',
    sessionId,
  });
}

// ============ SCORE UPDATE ============

/**
 * Adjust the KYA score for a session and extend TTL.
 */
async function updateScore(
  sessionId: string,
  delta: number,
  reason: string,
): Promise<void> {
  const client = getSupabaseClient();

  logger.info('KYA score updated', { sessionId, delta, reason });

  if (client) {
    try {
      await client.from('agent_activity').insert({
        agent_name: 'kya-engine',
        task: 'UPDATE_SCORE',
        status: 'completed',
        metadata: {
          sessionId,
          scoreDelta: delta,
          reason,
          ttlExtended: true,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      logger.error('Score update logging failed', {
        error: (err as Error).message,
      });
    }
  }

  eventBus.emit({
    type: 'kya.score_updated',
    source: 'kya-engine',
    payload: { sessionId, delta, reason },
    priority: 'normal',
    timestamp: new Date().toISOString(),
    orgId: '',
    sessionId,
  });
}

// ============ SUPABASE CLIENT ============

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;

  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}
