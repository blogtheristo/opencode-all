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
import type {
  ToolDefinition,
  ToolCall,
  ToolResult,
  AgentContext,
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

/** Execute a tool call and return the result */
export async function executeTool(
  call: ToolCall,
  context: AgentContext,
): Promise<ToolResult> {
  const handler = toolHandlers.get(call.name);
  if (!handler) {
    return {
      toolCallId: call.id,
      name: call.name,
      result: { error: `Unknown tool: ${call.name}` },
      isError: true,
    };
  }

  const startTime = Date.now();
  try {
    const result = await handler(call.arguments, context);
    const durationMs = Date.now() - startTime;
    logger.debug('Tool executed', { tool: call.name, durationMs });
    return {
      toolCallId: call.id,
      name: call.name,
      result: result as Record<string, unknown>,
      isError: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Tool execution failed', { tool: call.name, error: msg });
    return {
      toolCallId: call.id,
      name: call.name,
      result: { error: msg },
      isError: true,
    };
  }
}

/** Execute multiple tool calls in parallel */
export async function executeTools(
  calls: ToolCall[],
  context: AgentContext,
): Promise<ToolResult[]> {
  return Promise.all(calls.map((call) => executeTool(call, context)));
}

// ============ BUILT-IN TOOL DEFINITIONS ============

/**
 * Tool definitions that agents can use in their tool lists.
 * These are JSON Schema descriptions sent to the LLM.
 */

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
    const filters = (args.filters as Array<{ column: string; operator: string; value: unknown }>) || [];

    let query = client.from(table).select(select).limit(limit);

    for (const f of filters) {
      switch (f.operator) {
        case 'eq': query = query.eq(f.column, f.value); break;
        case 'gt': query = query.gt(f.column, f.value); break;
        case 'lt': query = query.lt(f.column, f.value); break;
        case 'gte': query = query.gte(f.column, f.value); break;
        case 'lte': query = query.lte(f.column, f.value); break;
        case 'like': query = query.like(f.column, f.value as string); break;
        case 'in': query = query.in(f.column, f.value as unknown[]); break;
      }
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    return { rows: data, count: data?.length || 0 };
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
        ...(args.headers as Record<string, string> || {}),
      },
      ...(method === 'POST' && args.body ? { body: JSON.stringify(args.body) } : {}),
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json')) {
      return await response.json();
    }
    const text = await response.text();
    // Truncate large responses
    return { text: text.slice(0, 10_000) };
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
    });
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

  logger.info('Built-in tool handlers registered', {
    tools: ['query_database', 'fetch_external', 'emit_event', 'memory_store', 'memory_recall', 'memory_forget', 'delegate_to_agent'],
  });
}
