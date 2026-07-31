/**
 * Session Checkpoint Types — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Types for agent session state persistence and recovery.
 * Enables agents to survive interruptions and resume from checkpoints.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 */

import type { LLMMessage, ToolResult } from './types.js';

/** Serializable agent session state */
export interface SessionState {
  /** Conversation messages up to the checkpoint */
  messages: LLMMessage[];
  /** Current loop iteration index */
  iterationIndex: number;
  /** Partial tool results from the current iteration (if interrupted mid-act) */
  partialResults: ToolResult[];
  /** ISO timestamp when checkpoint was created */
  checkpointedAt: string;
  /** Agent name for context */
  agentName: string;
  /** System prompt used (needed to resume without re-building) */
  systemPrompt: string;
  /** User message that started the loop */
  userMessage: string;
}

/** Checkpoint record as stored in Supabase */
export interface CheckpointRecord {
  id: string;
  session_id: string;
  org_id: string;
  agent_name: string;
  state: SessionState;
  created_at: string;
  expires_at: string;
}
