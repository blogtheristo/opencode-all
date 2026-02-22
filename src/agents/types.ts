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
  /** Sandbox isolation settings (optional — applied when SANDBOX_STAGE is set) */
  sandbox?: SandboxContext;
}

/** Sandbox isolation context attached to agent executions */
export interface SandboxContext {
  /** Current isolation stage: 1 = SDK sandbox, 2 = Cloud Run ephemeral, 3 = persistent container */
  stage: '1' | '2' | '3';
  /** Tenant subscription tier */
  tier: 'sandbox' | 'professional' | 'enterprise';
  /** Whether EU data residency is enforced */
  euDataResidency: boolean;
  /** Allowed filesystem paths for this tenant */
  allowedPaths: string[];
  /** Allowed network domains for this tenant */
  allowedDomains: string[];
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

// ============ GOVERNANCE POLICY ENGINE ============

/** Policy types for agent governance (extracted from awesome-llm-apps governance pattern) */
export type PolicyType = 'rate-limit' | 'cost-limit' | 'approval-required' | 'data-boundary' | 'autonomy-tier';

/** A single governance policy applied to agent execution */
export interface GovernancePolicy {
  /** Unique policy identifier */
  id: string;
  /** Policy type */
  type: PolicyType;
  /** Which agents this policy applies to ('*' = all) */
  agentPattern: string;
  /** Policy configuration */
  config: Record<string, unknown>;
  /** Whether this policy is enforced or advisory */
  enforcement: 'enforced' | 'advisory';
}

/** Result of a governance policy check */
export interface PolicyCheckResult {
  policyId: string;
  allowed: boolean;
  reason: string;
  enforcement: 'enforced' | 'advisory';
}

/** Governance audit log entry */
export interface GovernanceAuditEntry {
  timestamp: string;
  agent_name: string;
  user_id: string;
  org_id: string;
  policies_checked: number;
  policies_passed: number;
  policies_failed: number;
  blocked: boolean;
  details: PolicyCheckResult[];
}
