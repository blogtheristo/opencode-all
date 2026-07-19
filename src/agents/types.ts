/**
 * Shared Types for DWS IQ 6/7 AI Agent System
 *
 * Defines the core interfaces used across all agents:
 * - AgentContext: Execution context (who, where, session)
 * - AgentResponse: Standardized agent output
 * - AgentConfig: Agent registration metadata + tool/loop config
 * - AgentExecutionLog: Supabase persistence shape
 * - ToolDefinition / ToolCall / ToolResult: Function calling types
 * - LLMMessage / LLMResponse: Multi-turn conversation types
 * - AgentLoopConfig: Observe-think-act loop settings
 *
 * DWS7 Modernization: Added tool use, agentic loops, agent-to-agent types.
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
  /** Case ID — links agent execution to a unified Case entity (cases table) */
  caseId?: string;
  /** Session-scoped tool safety state used to block unsafe red-to-blue chains */
  toolSafety?: ToolSafetyState;
  /** Sandbox isolation settings (optional — applied when SANDBOX_STAGE is set) */
  sandbox?: SandboxContext;
  /**
   * Per-agent runtime policy injected by BaseAgent.runLoop so tool handlers
   * (e.g. send_notification) can authoritatively enforce the autonomy phase
   * gate and notification rate limits, independent of which tools were offered.
   */
  agentRuntime?: AgentRuntimeContext;
}

/**
 * Autonomy phase (KYA tier). Gates proactive action tools.
 * - silent_pilot: observe only, no outbound action
 * - advisor: may send proactive nudges (requires human confirm/override)
 * - autonomous: may act within guardrails, exception-only approval
 */
export type AutonomyPhase = 'silent_pilot' | 'advisor' | 'autonomous';

/** Proactive notification config — applied when autonomyPhase >= advisor */
export interface NotifyConfig {
  /** Delivery channels for proactive nudges */
  channels: Array<'email' | 'teams' | 'slack' | 'in_app'>;
  /** Max nudges this agent may send per rolling hour (default 5) */
  maxPerHour: number;
  /** Max nudges this agent may send per rolling day (default 20) */
  maxPerDay: number;
}

/** Runtime policy attached to AgentContext for tool-level enforcement */
export interface AgentRuntimeContext {
  name: string;
  autonomyPhase: AutonomyPhase;
  notify?: NotifyConfig;
}

/** Tracks session taint from prior RED tool calls */
export interface ToolSafetyState {
  /** RED tools already executed in this session */
  taintedRedTools: string[];
}

/** Sandbox isolation context attached to agent executions */
export interface SandboxContext {
  /** Current isolation stage: 1 = SDK sandbox, opensandbox = Acer Veriton Docker, 2 = Cloud Run ephemeral, 3 = persistent container */
  stage: '1' | 'opensandbox' | '2' | '3';
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

/** Model tier for task-aware model selection (see model-selector.ts) */
export type ModelTier = 'lite' | 'standard' | 'heavy';

/** Ollama model presets mapped to task types */
export type OllamaModelPreset = 'fast' | 'agent' | 'quality' | 'vision' | 'coding' | 'default';

/** Registration metadata for an agent */
export interface AgentConfig {
  /** Unique machine-readable name (kebab-case) */
  name: string;
  /** Human-readable description */
  description: string;
  /** List of capability tags for discovery */
  capabilities: string[];
  /** LLM model identifier used by this agent (legacy — prefer modelTier) */
  model: string;
  /**
   * Model tier for dynamic model selection.
   * When set, the model selector picks the leanest available model for this tier.
   * Overrides the static `model` field. See model-selector.ts for tier definitions.
   *
   * - lite: classification, scoring, alerts (Gemini Flash-Lite, Qwen 7B, Llama 8B)
   * - standard: compliance, synthesis, domain analysis (Haiku 4.5, Llama 70B, Gemini Flash)
   * - heavy: orchestration, novel reasoning, board reports (Sonnet 4, Qwen 32B, Gemini 3 Pro)
   */
  modelTier?: ModelTier;
  /** JSON Schema for the agent's expected input (used by MCP tooling and validation) */
  inputSchema?: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  /** Tools this agent can use (DWS7: function calling) */
  tools?: ToolDefinition[];
  /** Agentic loop configuration (DWS7: observe-think-act) */
  loop?: AgentLoopConfig;
  /**
   * Autonomy phase (KYA tier). Defaults to 'silent_pilot' when unset.
   * Agents below 'advisor' cannot send proactive notifications.
   */
  autonomyPhase?: AutonomyPhase;
  /** Proactive notification config (only honored when autonomyPhase >= advisor) */
  notify?: NotifyConfig;
}

// ============ TOOL USE / FUNCTION CALLING (DWS7) ============

/** JSON Schema-based tool definition sent to the LLM */
export interface ToolDefinition {
  /** Tool name (kebab-case, must match registered handler) */
  name: string;
  /** Human-readable description for the LLM */
  description: string;
  /** JSON Schema for the tool's parameters */
  parameters: Record<string, unknown>;
}

/** A tool call requested by the LLM */
export interface ToolCall {
  /** Unique call ID for matching results */
  id: string;
  /** Tool name to invoke */
  name: string;
  /** Parsed arguments from the LLM */
  arguments: Record<string, unknown>;
}

/** Result of executing a tool call */
export interface ToolResult {
  /** Matches the ToolCall.id */
  toolCallId: string;
  /** Tool name */
  name: string;
  /** Result data returned to the LLM */
  result: Record<string, unknown>;
  /** Whether the tool execution failed */
  isError: boolean;
}

// ============ LLM CONVERSATION TYPES (DWS7) ============

/** A message in a multi-turn LLM conversation */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Record<string, unknown>;
  /** For tool result messages: the tool call ID this result belongs to */
  toolCallId?: string;
  /** For assistant messages: tool calls the LLM wants to make */
  toolCalls?: ToolCall[];
}

/** Response from the LLM client */
export interface LLMResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Tool calls the LLM wants to execute (present when stopReason === 'tool_use') */
  toolCalls?: ToolCall[];
  /** Why the LLM stopped: 'end_turn' (done) or 'tool_use' (wants to call tools) */
  stopReason: 'end_turn' | 'tool_use';
}

// ============ AGENTIC LOOP CONFIG (DWS7) ============

/** Configuration for the observe-think-act loop */
export interface AgentLoopConfig {
  /** Maximum loop iterations before forcing termination (default: 10) */
  maxIterations: number;
  /** Whether the agent can delegate to other agents mid-loop */
  allowDelegation: boolean;
  /** Whether to log each loop iteration to Supabase */
  logIterations: boolean;
}

/** A single iteration in the agent loop (for tracing/Article 12 logging) */
export interface AgentLoopIteration {
  iteration: number;
  phase: 'observe' | 'think' | 'act';
  /** What the agent observed (input data, tool results) */
  observation?: string;
  /** The agent's reasoning for this step */
  thought?: string;
  /** Actions taken (tool calls, delegations) */
  actions?: ToolCall[];
  /** Results from actions */
  actionResults?: ToolResult[];
  /** Timestamp */
  timestamp: string;
  /** Duration of this iteration in ms */
  durationMs: number;
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
