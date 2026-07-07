/**
 * Session Checkpoint Service — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Persists agent loop state to the internal-ops Postgres pool so sessions can
 * survive interruptions and resume from the last checkpoint.
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

import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';
import type { AgentContext } from './types.js';
import type { SessionState } from './session-checkpoint.types.js';

const CHECKPOINT_TTL_HOURS = 24;

class SessionCheckpointService {
  /** Save a checkpoint of the current agent loop state. Non-blocking. */
  async checkpoint(context: AgentContext, state: SessionState): Promise<string | null> {
    try {
      const pool = getInternalDbPool();
      if (!pool) {
        logger.debug('Checkpoint skipped — internal DB not configured');
        return null;
      }

      const expiresAt = new Date(Date.now() + CHECKPOINT_TTL_HOURS * 60 * 60 * 1000).toISOString();
      const createdAt = new Date().toISOString();

      // Upsert: one checkpoint per session+agent (latest wins)
      const { rows } = await pool.query(
        `INSERT INTO session_checkpoints (session_id, org_id, agent_name, state, created_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (session_id, agent_name)
         DO UPDATE SET org_id = EXCLUDED.org_id, state = EXCLUDED.state,
           created_at = EXCLUDED.created_at, expires_at = EXCLUDED.expires_at
         RETURNING id`,
        [
          context.sessionId,
          context.orgId,
          state.agentName,
          JSON.stringify(state),
          createdAt,
          expiresAt,
        ],
      );

      logger.debug('Checkpoint saved', {
        session: context.sessionId,
        agent: state.agentName,
        iteration: state.iterationIndex,
      });

      return rows[0]?.id || null;
    } catch (err) {
      logger.warn('Checkpoint save exception', { error: String(err) });
      return null;
    }
  }

  /** Recover the most recent checkpoint for a session. Returns null if none or expired. */
  async recover(sessionId: string, orgId: string, agentName: string): Promise<SessionState | null> {
    try {
      const pool = getInternalDbPool();
      if (!pool) return null;

      const { rows } = await pool.query(
        `SELECT state, expires_at FROM session_checkpoints
         WHERE session_id = $1 AND org_id = $2 AND agent_name = $3
         ORDER BY created_at DESC
         LIMIT 1`,
        [sessionId, orgId, agentName],
      );
      const data = rows[0];

      if (!data) return null;

      // Check expiry
      if (new Date(data.expires_at) < new Date()) {
        logger.debug('Checkpoint expired', { session: sessionId, agent: agentName });
        return null;
      }

      const state: SessionState =
        typeof data.state === 'string' ? JSON.parse(data.state) : data.state;

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
      const pool = getInternalDbPool();
      if (!pool) return;

      await pool.query(
        `DELETE FROM session_checkpoints WHERE session_id = $1 AND agent_name = $2`,
        [sessionId, agentName],
      );

      logger.debug('Checkpoint cleared', { session: sessionId, agent: agentName });
    } catch (err) {
      logger.warn('Checkpoint clear failed', { error: String(err) });
    }
  }
}

/** Singleton checkpoint service instance */
export const checkpointService = new SessionCheckpointService();
