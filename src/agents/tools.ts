/**
 * Agent Tool Runtime — DWS IQ 6/7
 *
 * Provides the tool execution layer that enables agents to:
 *   - Query databases (Supabase)
 *   - Delegate to other agents (agent-to-agent)
 *   - Fetch external data (HTTP with SSRF protection)
 *   - Emit events to the event bus
 *
 * Fix #2 (tool use) and Fix #4 (agent-to-agent) from DWS7 modernization.
 */

import logger from '../utils/logger.js';
import { telemetryService } from './telemetry.service.js';
import type { ToolTelemetryEvent } from './telemetry.types.js';
import { MCPToolRegistry, ToolColor } from '../mcp/security/tool-colors.js';
import { authorizeToolCall } from '../security/runtime-auth.js';
import { currentTraceIds } from '../observability/tracing.js';
import type {
  AgentContext,
  ToolCall,
  ToolDefinition,
  ToolResult,
} from './types.js';

// ============ TOOL EXECUTOR ============

/** Registry of executable tool handlers */
export type ToolHandler = (
  args: Record<string, unknown>,
  context: AgentContext,
) => Promise<unknown>;

const toolHandlers: Map<string, ToolHandler> = new Map();

/** Register a tool handler */
export function registerToolHandler(name: string, handler: ToolHandler): void {
  toolHandlers.set(name, handler);
  logger.debug('Tool handler registered', { tool: name });
}

/** Default tool execution timeout (30s) */
const TOOL_TIMEOUT_MS = 30_000;

/**
 * Execute a tool call and return the result.
 * ASTA Phase 1: Records telemetry, enforces timeout.
 *
 * @param call - The tool call from the LLM
 * @param context - Agent execution context
 * @param meta - Optional chain metadata for telemetry (set by executeTools)
 */
export async function executeTool(
  call: ToolCall,
  context: AgentContext,
  meta?: { chainPosition: number; chainLength: number; iterationIndex: number; agentName: string },
): Promise<ToolResult> {
  const handler = toolHandlers.get(call.name);
  if (!handler) {
    // Record unknown tool as error telemetry
    if (meta) {
      telemetryService.recordInvocation({
        agentName: meta.agentName,
        toolName: call.name,
        orgId: context.orgId,
        sessionId: context.sessionId,
        outcome: 'error',
        durationMs: 0,
        errorMessage: `Unknown tool: ${call.name}`,
        isRetry: false,
        retryCount: 0,
        chainPosition: meta.chainPosition,
        chainLength: meta.chainLength,
        iterationIndex: meta.iterationIndex,
        timestamp: new Date().toISOString(),
      });
    }
    return {
      toolCallId: call.id,
      name: call.name,
      result: { error: `Unknown tool: ${call.name}` },
      isError: true,
    };
  }

  const authDecision = authorizeToolCall(call, {
    agentName: meta?.agentName ?? 'unknown',
    orgId: context.orgId,
    sessionId: context.sessionId,
  });
  if (authDecision.decision !== 'allow') {
    if (meta) {
      const ids = currentTraceIds();
      telemetryService.recordInvocation({
        agentName: meta.agentName,
        toolName: call.name,
        orgId: context.orgId,
        sessionId: context.sessionId,
        outcome: 'error',
        durationMs: 0,
        errorMessage: `runtime_auth:${authDecision.decision}:${authDecision.reason}`,
        isRetry: false,
        retryCount: 0,
        chainPosition: meta.chainPosition,
        chainLength: meta.chainLength,
        iterationIndex: meta.iterationIndex,
        timestamp: new Date().toISOString(),
        traceId: ids.traceId,
        spanId: ids.spanId,
      });
    }
    return {
      toolCallId: call.id,
      name: call.name,
      result: {
        error: `runtime_auth:${authDecision.decision}`,
        reason: authDecision.reason,
        actionClass: authDecision.actionClass,
        blastRadius: authDecision.blastRadius,
        approvalId: authDecision.approvalId,
      },
      isError: true,
    };
  }

  const startTime = Date.now();
  let outcome: ToolTelemetryEvent['outcome'] = 'success';
  let errorMessage: string | undefined;

  try {
    // Timeout wrapper: prevents hung tools from blocking the chain
    const result = await Promise.race([
      handler(call.arguments, context),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Tool ${call.name} timed out after ${TOOL_TIMEOUT_MS}ms`)), TOOL_TIMEOUT_MS),
      ),
    ]);
    const durationMs = Date.now() - startTime;
    logger.debug('Tool executed', { tool: call.name, durationMs });

    // Record success telemetry
    if (meta) {
      telemetryService.recordInvocation({
        agentName: meta.agentName,
        toolName: call.name,
        orgId: context.orgId,
        sessionId: context.sessionId,
        outcome: 'success',
        durationMs,
        isRetry: false,
        retryCount: 0,
        chainPosition: meta.chainPosition,
        chainLength: meta.chainLength,
        iterationIndex: meta.iterationIndex,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      toolCallId: call.id,
      name: call.name,
      result: result as Record<string, unknown>,
      isError: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const durationMs = Date.now() - startTime;
    outcome = msg.includes('timed out') ? 'timeout' : 'error';
    errorMessage = msg;
    logger.error('Tool execution failed', { tool: call.name, error: msg, outcome });

    // Record failure telemetry
    if (meta) {
      telemetryService.recordInvocation({
        agentName: meta.agentName,
        toolName: call.name,
        orgId: context.orgId,
        sessionId: context.sessionId,
        outcome,
        durationMs,
        errorMessage,
        isRetry: false,
        retryCount: 0,
        chainPosition: meta.chainPosition,
        chainLength: meta.chainLength,
        iterationIndex: meta.iterationIndex,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      toolCallId: call.id,
      name: call.name,
      result: { error: msg },
      isError: true,
    };
  }
}

/**
 * Execute multiple tool calls using Promise.allSettled for partial failure resilience.
 * ASTA Phase 1: passes chain metadata for telemetry, handles partial failures gracefully.
 */
export async function executeTools(
  calls: ToolCall[],
  context: AgentContext,
  meta?: { iterationIndex: number; agentName: string; allowedTools?: Set<string> },
): Promise<ToolResult[]> {
  const disallowedTools = meta?.allowedTools
    ? calls.filter((call) => !meta.allowedTools?.has(call.name)).map((call) => call.name)
    : [];
  if (disallowedTools.length > 0) {
    const reason = `Tool call rejected because it was not offered to the model: ${disallowedTools.join(', ')}`;
    logger.warn('Blocked disallowed tool call', {
      tools: disallowedTools,
      allowedTools: meta?.allowedTools ? Array.from(meta.allowedTools) : [],
      agentName: meta?.agentName,
      sessionId: context.sessionId,
    });

    return calls.map((call) => ({
      toolCallId: call.id,
      name: call.name,
      result: { error: reason },
      isError: true,
    }));
  }

  const safety = MCPToolRegistry.validateToolCombination(new Set(calls.map((call) => call.name)));
  if (!safety.isSafe) {
    logger.warn('Blocked unsafe tool combination', {
      tools: calls.map((call) => call.name),
      reason: safety.reason,
      agentName: meta?.agentName,
      sessionId: context.sessionId,
    });

    return calls.map((call) => ({
      toolCallId: call.id,
      name: call.name,
      result: { error: safety.reason },
      isError: true,
    }));
  }

  const currentRedTools = calls
    .filter((call) => MCPToolRegistry.getToolColor(call.name) === ToolColor.RED)
    .map((call) => call.name);
  const currentBlueTools = calls
    .filter((call) => MCPToolRegistry.getToolColor(call.name) === ToolColor.BLUE)
    .map((call) => call.name);
  const priorRedTools = context.toolSafety?.taintedRedTools ?? [];

  if (priorRedTools.length > 0 && currentBlueTools.length > 0) {
    const reason =
      `LETHAL TRIFECTA DETECTED ACROSS EXECUTION CHAIN!\n` +
      `Prior RED tools (untrusted input): ${priorRedTools.join(', ')}\n` +
      `Current BLUE tools (critical actions): ${currentBlueTools.join(', ')}\n\n` +
      `A prior RED tool tainted this session, so later BLUE actions are blocked.`;

    logger.warn('Blocked tainted blue tool execution', {
      priorRedTools,
      currentBlueTools,
      agentName: meta?.agentName,
      sessionId: context.sessionId,
    });

    return calls.map((call) => ({
      toolCallId: call.id,
      name: call.name,
      result: { error: reason },
      isError: true,
    }));
  }

  if (currentRedTools.length > 0) {
    context.toolSafety = {
      taintedRedTools: Array.from(new Set([...priorRedTools, ...currentRedTools])),
    };
  }

  const chainLength = calls.length;
  const results = await Promise.allSettled(
    calls.map((call, idx) =>
      executeTool(call, context, meta ? {
        chainPosition: idx,
        chainLength,
        iterationIndex: meta.iterationIndex,
        agentName: meta.agentName,
      } : undefined),
    ),
  );

  return results.map((settled, idx) => {
    if (settled.status === 'fulfilled') {
      return settled.value;
    }
    // Promise.allSettled rejection — shouldn't happen since executeTool catches internally,
    // but handle defensively
    const msg = settled.reason instanceof Error ? settled.reason.message : 'Unknown error';
    return {
      toolCallId: calls[idx].id,
      name: calls[idx].name,
      result: { error: msg },
      isError: true,
    };
  });
}

// ============ BUILT-IN TOOL DEFINITIONS ============

/**
 * Tool definitions that agents can use in their tool lists.
 * These are JSON Schema descriptions sent to the LLM.
 */

// ============ QUERY RESULT COMPRESSION (R2) ============
//
// Tool output is context. A raw `{ rows, count }` dump puts every cell of every
// row into the model's window, burying the signal. Following the "Building a
// Good Vertical Agent" field note, query_database results are instead:
//   - schema-compressed: column names + inferred types reported once, not per row
//   - losslessly collapsed: columns that are constant across all rows move to a
//     `constants` legend and are dropped from per-row output
//   - sampled: large result sets show a deterministic head sample + an omitted
//     tally instead of dumping N rows
//   - consequence-reporting: a `review` section flags empty results, all-null or
//     partially-null columns, error sentinels, and limit-truncated results — the
//     "here's the part you probably got wrong" linter on the agent's own query.

/** Default number of rows rendered before sampling kicks in. */
const QUERY_SAMPLE_LIMIT = 15;

/** Values that almost always indicate a broken cell rather than real data. */
const ERROR_SENTINELS = new Set(['#REF!', '#ERROR!', '#N/A', 'NaN', 'Infinity', '-Infinity']);

export interface QueryColumnInfo {
  name: string;
  type: string;
  /** Number of null/undefined values in this column across all matched rows. */
  nullCount?: number;
}

export interface QueryReviewFlag {
  level: 'info' | 'warn';
  issue: string;
  column?: string;
  count?: number;
}

export interface CompressedQueryResult {
  /** Total rows matched by the query (post-limit). */
  count: number;
  /** Inferred schema — reported once instead of repeating keys on every row. */
  columns: QueryColumnInfo[];
  /** Columns whose value is identical across every row, collapsed losslessly. */
  constants?: Record<string, unknown>;
  /** Per-row data with constant columns removed; sampled when large. */
  rows: Record<string, unknown>[];
  /** True when `rows` is a sample of a larger result. */
  sampled?: boolean;
  /** Number of rows matched but not included in `rows`. */
  omitted?: number;
  /** Consequence reporting: things the agent probably needs to look at. */
  review?: QueryReviewFlag[];
}

function inferType(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value; // 'string' | 'number' | 'boolean' | 'object'
}

/**
 * Compress a raw row array into a token-efficient, consequence-reporting shape.
 * Pure and deterministic — exported for unit testing.
 *
 * @param data   Rows returned by the query (may be null/empty).
 * @param opts.limit       The `limit` applied to the query, used to detect truncation.
 * @param opts.sampleLimit Rows to render before sampling (default QUERY_SAMPLE_LIMIT).
 */
export function compressRows(
  data: Record<string, unknown>[] | null | undefined,
  opts: { limit?: number; sampleLimit?: number } = {},
): CompressedQueryResult {
  const rows = Array.isArray(data) ? data : [];
  const count = rows.length;
  const sampleLimit = opts.sampleLimit ?? QUERY_SAMPLE_LIMIT;
  const review: QueryReviewFlag[] = [];

  if (count === 0) {
    review.push({ level: 'info', issue: 'Query matched 0 rows' });
    return { count: 0, columns: [], rows: [], review };
  }

  // Union of keys across all rows (rows may be heterogeneous).
  const keys: string[] = [];
  for (const row of rows) {
    if (row && typeof row === 'object') {
      for (const k of Object.keys(row)) if (!keys.includes(k)) keys.push(k);
    }
  }

  // Per-column analysis: type, null count, constant detection, error sentinels.
  const constants: Record<string, unknown> = {};
  const columns: QueryColumnInfo[] = [];

  for (const key of keys) {
    let nullCount = 0;
    let firstNonNull: unknown;
    let sawNonNull = false;
    let isConstant = true;
    let constantValue: unknown;
    let constantSet = false;
    let errorCount = 0;

    for (const row of rows) {
      const v = row?.[key];
      if (v === null || v === undefined) {
        nullCount++;
      } else {
        if (!sawNonNull) {
          firstNonNull = v;
          sawNonNull = true;
        }
        if (typeof v === 'string' && ERROR_SENTINELS.has(v)) errorCount++;
      }
      if (!constantSet) {
        constantValue = v;
        constantSet = true;
      } else if (!Object.is(constantValue, v)) {
        isConstant = false;
      }
    }

    columns.push({
      name: key,
      type: inferType(firstNonNull),
      ...(nullCount > 0 ? { nullCount } : {}),
    });

    if (errorCount > 0) {
      review.push({
        level: 'warn',
        column: key,
        issue: 'Column contains error sentinel values',
        count: errorCount,
      });
    }
    if (nullCount === count) {
      review.push({ level: 'warn', column: key, issue: 'Column is entirely null' });
    } else if (nullCount > 0) {
      review.push({
        level: 'info',
        column: key,
        issue: 'Column has null values',
        count: nullCount,
      });
    }

    // Lossless collapse: a column constant across all rows is reported once.
    // Only collapse when there is more than one row (no point for singletons).
    if (isConstant && count > 1) {
      constants[key] = constantValue;
    }
  }

  const constantKeys = new Set(Object.keys(constants));
  const projected = rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      if (constantKeys.has(key)) continue;
      out[key] = row?.[key];
    }
    return out;
  });

  const sampled = count > sampleLimit;
  const renderedRows = sampled ? projected.slice(0, sampleLimit) : projected;

  // Truncation detection: a full page strongly implies more rows exist upstream.
  if (opts.limit && count >= opts.limit) {
    review.push({
      level: 'info',
      issue: `Result hit the row limit (${opts.limit}); more rows may exist — refine filters or raise limit`,
    });
  }
  if (sampled) {
    review.push({
      level: 'info',
      issue: `Showing first ${sampleLimit} of ${count} rows`,
      count: count - sampleLimit,
    });
  }

  return {
    count,
    columns,
    ...(Object.keys(constants).length > 0 ? { constants } : {}),
    rows: renderedRows,
    ...(sampled ? { sampled: true, omitted: count - sampleLimit } : {}),
    ...(review.length > 0 ? { review } : {}),
  };
}

// ============ EXTERNAL FETCH COMPRESSION (R2) ============
//
// Blind `text.slice(0, 10_000)` is the amateur move the field note warns about:
// the model silently receives a cut string and cannot tell it is missing data.
// summarizeFetchedText keeps the same byte budget but reports the consequence —
// the full length and an explicit `truncated` flag — so the agent knows when it
// is reasoning over a partial response.

/** Default character budget for a fetched text body. */
const FETCH_TEXT_LIMIT = 10_000;

export interface FetchedTextSummary {
  charCount: number;
  truncated: boolean;
  /** The budget the text was cut to, present only when truncated. */
  truncatedAt?: number;
  text: string;
}

/**
 * Cap a fetched text body to a budget while reporting truncation explicitly.
 * Pure and deterministic — exported for unit testing.
 */
export function summarizeFetchedText(text: string, limit = FETCH_TEXT_LIMIT): FetchedTextSummary {
  const truncated = text.length > limit;
  return {
    charCount: text.length,
    truncated,
    ...(truncated ? { truncatedAt: limit } : {}),
    text: truncated ? text.slice(0, limit) : text,
  };
}


export const BUILTIN_TOOLS: Record<string, ToolDefinition> = {
  /** Delegate work to another agent in the registry */
  delegate_to_agent: {
    name: 'delegate_to_agent',
    description:
      'Delegate a sub-task to another DWS IQ agent. Use this when you need specialized analysis (e.g., ask emissions-data-analyst for data, ask compliance for regulatory assessment, ask material-oracle for carbon calculations).',
    parameters: {
      type: 'object',
      properties: {
        agent_name: {
          type: 'string',
          description: 'Name of the agent to delegate to (e.g., "emissions-data-analyst", "compliance", "material-oracle")',
        },
        task_input: {
          type: 'object',
          description: 'Input payload for the delegated agent',
        },
        reason: {
          type: 'string',
          description: 'Why this delegation is needed for the current task',
        },
      },
      required: ['agent_name', 'task_input'],
    },
  },

  /** Query the Supabase database */
  query_database: {
    name: 'query_database',
    description:
      'Query the DWS IQ Supabase database for emissions data, compliance records, agent execution history, or project data. Use SQL-like filters.',
    parameters: {
      type: 'object',
      properties: {
        table: {
          type: 'string',
          description: 'Table name (e.g., "agent_executions", "emissions_data", "compliance_records")',
        },
        select: {
          type: 'string',
          description: 'Columns to select (e.g., "*" or "id, agent_name, status")',
        },
        filters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column: { type: 'string' },
              operator: { type: 'string', enum: ['eq', 'gt', 'lt', 'gte', 'lte', 'like', 'in'] },
              value: {},
            },
            required: ['column', 'operator', 'value'],
          },
          description: 'Filter conditions',
        },
        limit: {
          type: 'number',
          description: 'Maximum rows to return (default: 50)',
        },
      },
      required: ['table'],
    },
  },

  /** Fetch data from an external API */
  fetch_external: {
    name: 'fetch_external',
    description:
      'Fetch data from an approved external API (EU regulatory databases, carbon price feeds, weather data). URLs must match the tenant allowlist.',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Full URL to fetch from (must be HTTPS, must match allowlist)',
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST'],
          description: 'HTTP method (default: GET)',
        },
        headers: {
          type: 'object',
          description: 'Additional headers to send',
        },
        body: {
          type: 'object',
          description: 'Request body for POST requests',
        },
      },
      required: ['url'],
    },
  },

  /** Store a memory for later recall */
  memory_store: {
    name: 'memory_store',
    description:
      'Store a fact, preference, or knowledge as a persistent memory. Memories are embedded for vector search and scoped to the organization.',
    parameters: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The content/text to remember',
        },
        memory_type: {
          type: 'string',
          enum: ['preference', 'knowledge', 'procedure', 'episode', 'fact', 'profile'],
          description: 'Type of memory (default: knowledge)',
        },
        source: {
          type: 'string',
          description: 'Source of this memory (e.g., "conversation", "document", "manual")',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata tags',
        },
      },
      required: ['content'],
    },
  },

  /** Recall memories by semantic/hybrid search */
  memory_recall: {
    name: 'memory_recall',
    description:
      'Search stored memories using hybrid search (vector similarity + text matching). Returns the most relevant memories for the query.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Natural language search query',
        },
        memory_type: {
          type: 'string',
          enum: ['preference', 'knowledge', 'procedure', 'episode', 'fact', 'profile'],
          description: 'Filter by memory type (optional)',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return (default: 5)',
        },
        similarity_threshold: {
          type: 'number',
          description: 'Minimum similarity score 0-1 (default: 0.5)',
        },
      },
      required: ['query'],
    },
  },

  /** Soft-delete a memory */
  memory_forget: {
    name: 'memory_forget',
    description:
      'Soft-delete a memory by ID. The memory is marked as expired (not hard-deleted) for audit compliance.',
    parameters: {
      type: 'object',
      properties: {
        memory_id: {
          type: 'string',
          description: 'UUID of the memory to forget',
        },
        reason: {
          type: 'string',
          description: 'Reason for forgetting this memory (logged for audit)',
        },
      },
      required: ['memory_id', 'reason'],
    },
  },

  /** Extract structured facts from text */
  extract_facts: {
    name: 'extract_facts',
    description:
      'Extract structured facts (subject-predicate-value triples) from conversation text, documents, or any unstructured input. Facts are persisted as memories for later recall and profile building.',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to extract facts from (conversation, document, etc.)',
        },
        source: {
          type: 'string',
          description: 'Source identifier (e.g., "conversation", "email", "document")',
        },
        persist: {
          type: 'boolean',
          description: 'Whether to store extracted facts as memories (default: true)',
        },
        min_confidence: {
          type: 'number',
          description: 'Minimum confidence to persist a fact (0-1, default: 0.7)',
        },
      },
      required: ['text'],
    },
  },

  /** Supersede a memory with newer information (contradiction resolution) */
  memory_supersede: {
    name: 'memory_supersede',
    description:
      'Replace an existing memory with newer, more accurate information. Implements temporal contradiction resolution with KYA governance: if the confidence difference exceeds 0.3, human review is required before the supersede is applied.',
    parameters: {
      type: 'object',
      properties: {
        old_memory_id: {
          type: 'string',
          description: 'UUID of the memory to supersede',
        },
        new_content: {
          type: 'string',
          description: 'Updated content that replaces the old memory',
        },
        new_confidence: {
          type: 'number',
          description: 'Confidence score for the new memory (0-1, default: 1.0)',
        },
        new_source: {
          type: 'string',
          description: 'Source of the new information (e.g., "annual-report-2025", "conversation")',
        },
        reason: {
          type: 'string',
          description: 'Reason for superseding (e.g., "temporal_supersede: newer source with higher confidence")',
        },
      },
      required: ['old_memory_id', 'new_content'],
    },
  },

  /** Send a proactive nudge to a human stakeholder */
  send_notification: {
    name: 'send_notification',
    description:
      'Send a proactive nudge to a human stakeholder when you observe something worth interrupting them about. Requires the agent to be at autonomy phase "advisor" or higher. Keep the body to one sentence of context plus one recommended action. Always offer override options so the human stays in control.',
    parameters: {
      type: 'object',
      properties: {
        signal_key: {
          type: 'string',
          description: 'Stable signal key from the catalogue (e.g. "site_safety_low", "emissions_budget_breach"). Used for deduplication.',
        },
        entity_id: {
          type: 'string',
          description: 'The thing the signal is about (siteId, customerId, projectId). Used for deduplication so the same breach is not nudged twice.',
        },
        recipient_role: {
          type: 'string',
          description: 'Role to notify (R-ID or role name from DWS_ROLES_REGISTRY, e.g. "Site Manager", "CFO / ESG Lead")',
        },
        subject: {
          type: 'string',
          description: 'Short nudge headline',
        },
        body: {
          type: 'string',
          description: 'One sentence of context + recommended action (max 280 chars)',
        },
        channel: {
          type: 'array',
          items: { type: 'string', enum: ['email', 'teams', 'slack', 'in_app'] },
          description: 'Delivery channels (default: agent notify config)',
        },
        action_options: {
          type: 'array',
          items: { type: 'string' },
          description: 'Response buttons. Threshold breaches use ["Confirm","Override","More detail"]; anomalies use ["View Analysis","Dismiss"].',
        },
        urgency: {
          type: 'string',
          enum: ['high', 'low'],
          description: 'Urgency for the worth-interrupting gate (default: high)',
        },
        confidence: {
          type: 'string',
          enum: ['high', 'low'],
          description: 'Confidence for the worth-interrupting gate (default: high)',
        },
      },
      required: ['recipient_role', 'subject', 'body'],
    },
  },

  /** Emit an event to the event bus */
  emit_event: {
    name: 'emit_event',
    description:
      'Emit an event to the DWS IQ event bus for downstream processing (e.g., trigger a compliance workflow, notify the situation room, update a dashboard).',
    parameters: {
      type: 'object',
      properties: {
        event_type: {
          type: 'string',
          description: 'Event type (e.g., "compliance.gap_detected", "emissions.threshold_exceeded", "agent.task_complete")',
        },
        payload: {
          type: 'object',
          description: 'Event payload data',
        },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high', 'critical'],
          description: 'Event priority (default: normal)',
        },
      },
      required: ['event_type', 'payload'],
    },
  },
};

// ============ BUILT-IN TOOL HANDLERS ============

/** SSRF-safe domain allowlist for fetch_external */
const FETCH_ALLOWLIST = [
  'api.carbonintensity.org.uk',
  'ember-climate.org',
  'ec.europa.eu',
  'data.europa.eu',
  'co2data.fi',
  'api.eex.com',
  'api.weather.gov',
  'openweathermap.org',
];

/** Initialize built-in tool handlers */
export function registerBuiltinTools(): void {
  // Database query handler
  registerToolHandler('query_database', async (args, _context) => {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return { error: 'Supabase not configured' };

    const client = createClient(url, key);
    const table = args.table as string;
    const select = (args.select as string) || '*';
    const limit = (args.limit as number) || 50;
    const filters =
      (args.filters as Array<{ column: string; operator: string; value: unknown }>) || [];

    let query = client.from(table).select(select).limit(limit);

    for (const f of filters) {
      switch (f.operator) {
        case 'eq':
          query = query.eq(f.column, f.value);
          break;
        case 'gt':
          query = query.gt(f.column, f.value);
          break;
        case 'lt':
          query = query.lt(f.column, f.value);
          break;
        case 'gte':
          query = query.gte(f.column, f.value);
          break;
        case 'lte':
          query = query.lte(f.column, f.value);
          break;
        case 'like':
          query = query.like(f.column, f.value as string);
          break;
        case 'in':
          query = query.in(f.column, f.value as unknown[]);
          break;
      }
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    return compressRows(data as unknown as Record<string, unknown>[] | null, { limit });
  });

  // External fetch handler with SSRF protection
  registerToolHandler('fetch_external', async (args, context) => {
    const url = args.url as string;
    const method = (args.method as string) || 'GET';

    // SSRF protection: validate against allowlist
    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return { error: 'Invalid URL' };
    }

    if (!FETCH_ALLOWLIST.some((d) => hostname.endsWith(d))) {
      // Also check tenant sandbox allowlist
      const tenantDomains = context.sandbox?.allowedDomains || [];
      if (!tenantDomains.some((d) => hostname.endsWith(d))) {
        return { error: `Domain ${hostname} not in allowlist` };
      }
    }

    if (!url.startsWith('https://')) {
      return { error: 'Only HTTPS URLs are allowed' };
    }

    const response = await fetch(url, {
      method,
      headers: {
        'User-Agent': 'DWS-IQ-Agent/7.0',
        ...((args.headers as Record<string, string>) || {}),
      },
      ...(method === 'POST' && args.body ? { body: JSON.stringify(args.body) } : {}),
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json')) {
      const json = await response.json();
      // Compress JSON like query results: an array of objects routes through
      // compressRows (schema once, sampled, consequence-reported); a top-level
      // array of objects nested under a common key is unwrapped first. Anything
      // else is size-budgeted with an explicit `truncated` flag so the model is
      // never handed a silently-cut blob.
      if (
        Array.isArray(json) &&
        json.every((x) => x && typeof x === 'object' && !Array.isArray(x))
      ) {
        return {
          contentType,
          status: response.status,
          json: compressRows(json as Record<string, unknown>[]),
        };
      }
      const serialized = JSON.stringify(json);
      if (serialized.length > FETCH_TEXT_LIMIT) {
        return {
          contentType,
          status: response.status,
          json: summarizeFetchedText(serialized),
          note: 'JSON payload exceeded the size budget and was serialized + truncated; refine the request to narrow it.',
        };
      }
      return { contentType, status: response.status, json };
    }
    const text = await response.text();
    // Cap large responses but report truncation explicitly (consequence reporting).
    return { contentType, status: response.status, ...summarizeFetchedText(text) };
  });

  // Event emission handler (wired to event bus in event-bus.ts)
  registerToolHandler('emit_event', async (args, context) => {
    const { eventBus } = await import('./event-bus.js');
    const eventType = args.event_type as string;
    const payload = args.payload as Record<string, unknown>;
    const priority = (args.priority as string) || 'normal';

    await eventBus.emit({
      type: eventType,
      source: `agent:${context.userId}`,
      payload,
      priority: priority as 'low' | 'normal' | 'high' | 'critical',
      timestamp: new Date().toISOString(),
      orgId: context.orgId,
      sessionId: context.sessionId,
    });

    return { emitted: true, eventType };
  });

  // Proactive notification handler (KYA phase-gated, dedup + rate-limited)
  registerToolHandler('send_notification', async (args, context) => {
    const { nudgeService } = await import('./nudge.service.js');
    const { isPhaseAtLeast } = await import('./autonomy.js');
    const { getSignal, evaluateGate, CONFIRM_OVERRIDE_ACTIONS } = await import('./signal-catalogue.js');

    const runtime = context.agentRuntime;
    // KYA gate: enforced here regardless of which tools were offered to the model.
    if (!runtime || !isPhaseAtLeast(runtime.autonomyPhase, 'advisor')) {
      return {
        error: 'send_notification blocked: agent autonomy phase is below "advisor" (KYA gate)',
        blocked: true,
      };
    }

    const signalKey = (args.signal_key as string) || 'agent_adhoc';
    const catalogue = getSignal(signalKey);
    const confidence = (args.confidence as 'high' | 'low') || catalogue?.confidence || 'high';
    const urgency = (args.urgency as 'high' | 'low') || catalogue?.urgency || 'high';
    const channels = (args.channel as Array<'email' | 'teams' | 'slack' | 'in_app'>)
      || runtime.notify?.channels
      || catalogue?.channels
      || ['in_app'];

    const result = await nudgeService.createNudge({
      orgId: context.orgId,
      agentName: runtime.name,
      signalKey,
      entityId: (args.entity_id as string) || context.projectId,
      recipientRole: args.recipient_role as string,
      tier: catalogue?.tier ?? 'threshold',
      gateDecision: evaluateGate(confidence, urgency),
      channels,
      subject: args.subject as string,
      body: args.body as string,
      actionOptions: (args.action_options as string[]) || catalogue?.actionOptions || CONFIRM_OVERRIDE_ACTIONS,
      notify: runtime.notify,
    });

    return result;
  });

  // Memory store handler
  registerToolHandler('memory_store', async (args, context) => {
    const { memoryService } = await import('./memory.service.js');
    const content = args.content as string;
    const memoryType = (args.memory_type as string) || 'knowledge';
    const source = (args.source as string) || 'agent';
    const metadata = (args.metadata as Record<string, unknown>) || {};

    const result = await memoryService.store({
      content,
      memoryType: memoryType as 'preference' | 'knowledge' | 'procedure' | 'episode' | 'fact' | 'profile',
      orgId: context.orgId,
      source,
      metadata,
    });

    return result;
  });

  // Memory recall handler
  registerToolHandler('memory_recall', async (args, context) => {
    const { memoryService } = await import('./memory.service.js');
    const query = args.query as string;
    const memoryType = args.memory_type as string | undefined;
    const limit = (args.limit as number) || 5;
    const threshold = (args.similarity_threshold as number) || 0.5;

    const result = await memoryService.recall({
      query,
      memoryType: memoryType as 'preference' | 'knowledge' | 'procedure' | 'episode' | 'fact' | 'profile' | undefined,
      orgId: context.orgId,
      limit,
      similarityThreshold: threshold,
    });

    return {
      memories: result.memories.map((m) => ({
        id: m.id,
        content: m.content,
        type: m.memoryType,
        similarity: m.similarity,
        confidence: m.confidence,
        source: m.source,
      })),
      totalMatches: result.totalMatches,
      searchMethod: result.searchMethod,
      durationMs: result.durationMs,
    };
  });

  // Memory forget handler
  registerToolHandler('memory_forget', async (args, context) => {
    const { memoryService } = await import('./memory.service.js');
    const memoryId = args.memory_id as string;
    const reason = args.reason as string;

    return memoryService.forget({
      memoryId,
      orgId: context.orgId,
      reason,
      agentId: context.userId || 'agent',
    });
  });

  // Memory supersede handler (contradiction resolution)
  registerToolHandler('memory_supersede', async (args, context) => {
    const { memoryService } = await import('./memory.service.js');
    const oldMemoryId = args.old_memory_id as string;
    const newContent = args.new_content as string;
    const newConfidence = (args.new_confidence as number) ?? 1.0;
    const newSource = (args.new_source as string) || 'agent';
    const reason = (args.reason as string) || 'temporal_supersede';

    const result = await memoryService.supersede({
      oldMemoryId,
      newContent,
      orgId: context.orgId,
      newConfidence,
      newSource,
      reason,
      agentId: context.userId || 'agent',
    });

    return {
      newMemoryId: result.newMemoryId,
      requiresReview: result.requiresReview,
      confidenceDelta: result.confidenceDelta,
      kyaDecision: result.kyaDecision,
    };
  });

  // Fact extraction handler
  registerToolHandler('extract_facts', async (args, context) => {
    const { factExtractionService } = await import('./fact-extraction.service.js');
    const text = args.text as string;
    const source = (args.source as string) || 'agent';
    const persist = args.persist !== false;
    const minConfidence = (args.min_confidence as number) || 0.7;

    const result = await factExtractionService.extract({
      text,
      orgId: context.orgId,
      source,
      persist,
      minConfidence,
    });

    return {
      facts: result.facts,
      persisted: result.persisted,
      skipped: result.skipped,
      memoryIds: result.memoryIds,
      durationMs: result.durationMs,
    };
  });

  // Agent delegation handler (wired to registry)
  registerToolHandler('delegate_to_agent', async (args, context) => {
    // Lazy import to avoid circular dependency
    const { agentRegistry } = await import('./index.js');
    const agentName = args.agent_name as string;
    const taskInput = (args.task_input as Record<string, unknown>) || {};

    try {
      const result = await agentRegistry.executeAgent(agentName, context, taskInput);
      return {
        agent: agentName,
        confidence: result.confidence,
        result: result.result,
        reasoning: result.reasoning,
        recommendations: result.recommendations,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      return { error: `Agent delegation failed: ${msg}`, agent: agentName };
    }
  });

  // Knowledge Base tool handlers
  import('./kb.agent.js').then(({ registerKBToolHandlers }) => {
    registerKBToolHandlers();
  }).catch((err) => {
    logger.debug('KB tool handlers not available (optional)', { error: err.message });
  });

  // Industry tool handlers (Tool Plan Phases 2 & 3)
  import('./industry-tools.js')
    .then(({ registerIndustryToolHandlers }) => {
      registerIndustryToolHandlers();
    })
    .catch((err) => {
      logger.debug('Industry tool handlers not available (optional)', { error: err.message });
    });


  logger.info('Built-in tool handlers registered', {
    tools: ['query_database', 'fetch_external', 'emit_event', 'send_notification', 'memory_store', 'memory_recall', 'memory_forget', 'memory_supersede', 'extract_facts', 'delegate_to_agent', 'kb_*'],
  });
}
