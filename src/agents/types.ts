/**
 * Shared Types for DWS IQ 6 AI Agent System
 *
 * Defines the core interfaces used across all agents:
 * - AgentContext: Execution context (who, where, session)
 * - AgentResponse: Standardized agent output
 * - AgentConfig: Agent registration metadata
 * - AgentExecutionLog: Supabase persistence shape
 */

// ============ AGENT CONTEXT ============

/** Execution context passed to every agent invocation */
export interface AgentContext {
  /** Project identifier (e.g., construction project, compliance project) */
  projectId: string;
  /** Authenticated user ID from JWT */
  userId: string;
  /** Organization / tenant ID */
  orgId: string;
  /** Unique session ID for tracing a conversation or workflow */
  sessionId: string;
}

// ============ AGENT RESPONSE ============

/** Standardized response returned by every agent */
export interface AgentResponse {
  /** Name of the agent that produced this response */
  agentName: string;
  /** Primary result payload (agent-specific shape) */
  result: Record<string, unknown>;
  /** Confidence score 0-1 indicating how reliable the result is */
  confidence: number;
  /** Human-readable explanation of the reasoning process */
  reasoning: string;
  /** Actionable recommendations list */
  recommendations: string[];
  /** Optional metadata (timings, model info, token usage, etc.) */
  metadata: Record<string, unknown>;
}

// ============ AGENT CONFIG ============

/** Registration metadata for an agent */
export interface AgentConfig {
  /** Unique machine-readable name (kebab-case) */
  name: string;
  /** Human-readable description */
  description: string;
  /** List of capability tags for discovery */
  capabilities: string[];
  /** LLM model identifier used by this agent */
  model: string;
}

// ============ AGENT EXECUTION LOG ============

/** Shape persisted to Supabase agent_executions table */
export interface AgentExecutionLog {
  agent_name: string;
  user_id: string;
  org_id: string;
  session_id: string;
  project_id: string;
  input: Record<string, unknown>;
  output: AgentResponse | null;
  status: 'started' | 'completed' | 'error';
  error_message?: string;
  duration_ms: number;
  created_at: string;
}
