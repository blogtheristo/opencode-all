/**
 * Session Checkpoint Service — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Persists agent loop state to Supabase so sessions can survive
 * interruptions and resume from the last checkpoint.
 *
 * - checkpoint(): saves current loop state after each act phase
 * - recover(): loads most recent checkpoint for a session (24h TTL)
 * - clear(): removes checkpoints after successful completion
 *
 * Non-blocking: checkpoint failures are logged but don't propagate.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';
import type { AgentContext } from './types.js';
import type { SessionState } from './session-checkpoint.types.js';

const CHECKPOINT_TTL_HOURS = 24;

class SessionCheckpointService {
  /** Save a checkpoint of the current agent loop state. Non-blocking. */
  async checkpoint(context: AgentContext, state: SessionState): Promise<string | null> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) {
        logger.debug('Checkpoint skipped — Supabase not configured');
        return null;
      }

      const client = createClient(url, key);
      const expiresAt = new Date(Date.now() + CHECKPOINT_TTL_HOURS * 60 * 60 * 1000).toISOString();

      // Upsert: one checkpoint per session+agent (latest wins)
      const { data, error } = await client
        .from('session_checkpoints')
        .upsert(
          {
            session_id: context.sessionId,
            org_id: context.orgId,
            agent_name: state.agentName,
            state: JSON.stringify(state),
            created_at: new Date().toISOString(),
            expires_at: expiresAt,
          },
          { onConflict: 'session_id,agent_name' },
        )
        .select('id')
        .single();

      if (error) {
        logger.warn('Checkpoint save failed', { error: error.message, session: context.sessionId });
        return null;
      }

      logger.debug('Checkpoint saved', {
        session: context.sessionId,
        agent: state.agentName,
        iteration: state.iterationIndex,
      });

      return data?.id || null;
    } catch (err) {
      logger.warn('Checkpoint save exception', { error: String(err) });
      return null;
    }
  }

  /** Recover the most recent checkpoint for a session. Returns null if none or expired. */
  async recover(sessionId: string, orgId: string, agentName: string): Promise<SessionState | null> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) return null;

      const client = createClient(url, key);
      const { data, error } = await client
        .from('session_checkpoints')
        .select('state, expires_at')
        .eq('session_id', sessionId)
        .eq('org_id', orgId)
        .eq('agent_name', agentName)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      // Check expiry
      if (new Date(data.expires_at) < new Date()) {
        logger.debug('Checkpoint expired', { session: sessionId, agent: agentName });
        return null;
      }

      const state: SessionState = typeof data.state === 'string'
        ? JSON.parse(data.state)
        : data.state;

      logger.info('Checkpoint recovered', {
        session: sessionId,
        agent: agentName,
        iteration: state.iterationIndex,
      });

      return state;
    } catch (err) {
      logger.warn('Checkpoint recovery failed', { error: String(err) });
      return null;
    }
  }

  /** Clear checkpoints after successful session completion. */
  async clear(sessionId: string, agentName: string): Promise<void> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_KEY;
      if (!url || !key) return;

      const client = createClient(url, key);
      await client
        .from('session_checkpoints')
        .delete()
        .eq('session_id', sessionId)
        .eq('agent_name', agentName);

      logger.debug('Checkpoint cleared', { session: sessionId, agent: agentName });
    } catch (err) {
      logger.warn('Checkpoint clear failed', { error: String(err) });
    }
  }
}

/** Singleton checkpoint service instance */
export const checkpointService = new SessionCheckpointService();
