/**
 * MCP Agent Server — DWS IQ 6/7
 *
 * Exposes all registered DWS IQ agents as MCP tools, enabling external
 * ADEs (Claude Code, Cursor, Codex, VS Code) to interact with the
 * agent system via the Model Context Protocol.
 *
 * Fix #5 from DWS7 modernization: MCP is no longer vapor.
 *
 * Protocol: MCP Streamable HTTP Transport (2025 spec)
 * Each agent becomes a tool with:
 *   - name: "dws_{agent-name}" (e.g., "dws_compliance", "dws_sitesense")
 *   - description: agent's description
 *   - inputSchema: agent's expected input shape
 *
 * Also exposes meta-tools:
 *   - dws_list_agents: Discover available agents
 *   - dws_discover: Find agents by capability
 *   - dws_workflow: Trigger a multi-agent workflow
 */

import { type Request, type Response, Router } from 'express';
import { randomUUID } from 'crypto';
import logger from '../utils/logger.js';
import { agentRegistry } from '../agents/index.js';
import { eventBus } from '../agents/event-bus.js';
import { memoryService } from '../agents/memory.service.js';
import { factExtractionService } from '../agents/fact-extraction.service.js';
import { telemetryService } from '../agents/telemetry.service.js';
import { checkpointService } from '../agents/session-checkpoint.service.js';
import type { AgentContext } from '../agents/types.js';
import type { ToolSafetyState } from '../agents/types.js';
import type { MemoryType } from '../agents/memory.types.js';
import { MCPToolRegistry, ToolColor } from './security/tool-colors.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { contentMcpTools } from '../contentms/index.js';

// ============ SUPPORTED WORKFLOWS REGISTRY ============
// Single source of truth — used in tool descriptions, validation, and error messages.
const SUPPORTED_WORKFLOWS = ['compliance-assessment', 'construction-full', 'seo-pipeline'] as const;
export type SupportedWorkflow = (typeof SUPPORTED_WORKFLOWS)[number];

// ============ MCP PROTOCOL TYPES ============

interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

const mcpToolSafetyBySession = new Map<string, ToolSafetyState>();
const issuedMcpSessions = new Map<string, Set<string>>();

function getMcpSessionNamespace(userId: string, orgId: string): string {
  return `${orgId}:${userId}`;
}

function issueMcpSessionId(userId: string, orgId: string): string {
  const namespace = getMcpSessionNamespace(userId, orgId);
  const sessionId = `mcp-${randomUUID()}`;
  const sessions = issuedMcpSessions.get(namespace) ?? new Set<string>();
  sessions.add(sessionId);
  issuedMcpSessions.set(namespace, sessions);
  return sessionId;
}

function applyMcpSessionToolSafety(
  toolName: string,
  context: AgentContext,
): { allowed: boolean; reason?: string } {
  const color = MCPToolRegistry.getToolColor(toolName);
  const priorRedTools = context.toolSafety?.taintedRedTools ?? [];

  if (priorRedTools.length > 0 && color === ToolColor.BLUE) {
    return {
      allowed: false,
      reason:
        `LETHAL TRIFECTA DETECTED ACROSS MCP SESSION!\n` +
        `Prior RED tools (untrusted input): ${priorRedTools.join(', ')}\n` +
        `Current BLUE tool (critical action): ${toolName}\n\n` +
        `A prior RED tool tainted this MCP session, so this BLUE action is blocked.`,
    };
  }

  if (color === ToolColor.RED) {
    context.toolSafety = {
      taintedRedTools: Array.from(new Set([...priorRedTools, toolName])),
    };
  }

  return { allowed: true };
}

function getExposedToolColor(toolName: string): ToolColor {
  switch (toolName) {
    case 'dws_list_agents':
    case 'dws_discover':
    case 'dws_workflow':
    case 'dws_memory_recall':
    case 'dws_memory_profile':
    case 'dws_tool_telemetry':
    case 'dws_session_checkpoint':
    case 'dws_extract_facts':
      return ToolColor.GREEN;
    case 'dws_events':
      return ToolColor.RED;
    case 'dws_memory_store':
    case 'dws_memory_forget':
      return ToolColor.BLUE;
    default:
      throw new Error(`Unknown MCP tool classification: ${toolName}`);
  }
}

function ensureMCPToolClassification(toolName: string): ToolColor {
  try {
    return MCPToolRegistry.getToolColor(toolName);
  } catch {
    const agentName = toolName.startsWith('dws_') ? toolName.slice(4) : '';
    if (agentName && agentRegistry.getAgent(agentName)) {
      MCPToolRegistry.registerTool(toolName, ToolColor.GREEN);
      return ToolColor.GREEN;
    }

    const color = getExposedToolColor(toolName);
    MCPToolRegistry.registerTool(toolName, color);
    return color;
  }
}

// ============ MCP SERVER ============

/**
 * Build the list of MCP tools from the agent registry.
 * Each agent becomes a callable tool.
 */
function buildToolList(): MCPToolDefinition[] {
  const agents = agentRegistry.listAgents();
  const tools: MCPToolDefinition[] = [];
  const registerTool = (tool: MCPToolDefinition): void => {
    try {
      ensureMCPToolClassification(tool.name);
      tools.push(tool);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown MCP tool classification';
      logger.warn('Skipping MCP tool registration until classification is explicit', {
        tool: tool.name,
        error: message,
      });
    }
  };

  // Meta-tool: list agents
  registerTool({
    name: 'dws_list_agents',
    description: 'List all available DWS IQ agents with their capabilities and models.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  });

  // Meta-tool: discover by capability
  registerTool({
    name: 'dws_discover',
    description:
      'Find DWS IQ agents by capability tag (e.g., "compliance", "carbon", "construction").',
    inputSchema: {
      type: 'object',
      properties: {
        capability: {
          type: 'string',
          description: 'Capability tag to search for',
        },
      },
      required: ['capability'],
    },
  });

  // Meta-tool: trigger workflow
  registerTool({
    name: 'dws_workflow',
    description: `Trigger a multi-agent workflow. Available workflows: ${SUPPORTED_WORKFLOWS.join(', ')}.`,
    inputSchema: {
      type: 'object',
      properties: {
        workflow: {
          type: 'string',
          description: 'Workflow name to trigger',
        },
        input: {
          type: 'object',
          description: 'Workflow input payload',
        },
      },
      required: ['workflow', 'input'],
    },
  });

  // Meta-tool: event history
  registerTool({
    name: 'dws_events',
    description:
      'Get recent events from the DWS IQ event bus. Useful for monitoring agent activity and compliance events.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Event type pattern to filter (e.g., "compliance.*", "agent.*")',
        },
        limit: {
          type: 'number',
          description: 'Maximum events to return (default: 20)',
        },
      },
    },
  });

  // Memory tools
  registerTool({
    name: 'dws_memory_store',
    description:
      'Store a fact, preference, or knowledge as a persistent agent memory. Memories are embedded for vector search and scoped to the organization.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The content/text to remember' },
        memory_type: {
          type: 'string',
          description: 'Type of memory: preference, knowledge, procedure, episode, fact, profile',
        },
        source: { type: 'string', description: 'Source identifier (e.g., conversation, document)' },
        metadata: { type: 'object', description: 'Additional metadata tags' },
      },
      required: ['content'],
    },
  });

  registerTool({
    name: 'dws_memory_recall',
    description:
      'Search stored memories using hybrid search (vector similarity + text matching). Returns the most relevant memories for the query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language search query' },
        memory_type: { type: 'string', description: 'Filter by memory type (optional)' },
        limit: { type: 'number', description: 'Maximum results (default: 5)' },
        similarity_threshold: {
          type: 'number',
          description: 'Minimum similarity 0-1 (default: 0.5)',
        },
      },
      required: ['query'],
    },
  });

  registerTool({
    name: 'dws_memory_forget',
    description:
      'Soft-delete a memory by ID. Marked as expired for audit compliance, not hard-deleted.',
    inputSchema: {
      type: 'object',
      properties: {
        memory_id: { type: 'string', description: 'UUID of the memory to forget' },
        reason: { type: 'string', description: 'Reason for forgetting (audit trail)' },
      },
      required: ['memory_id', 'reason'],
    },
  });

  registerTool({
    name: 'dws_memory_profile',
    description:
      'Get an aggregated profile built from stored memories for a customer or organization. Returns facts, preferences, and recent context.',
    inputSchema: {
      type: 'object',
      properties: {
        entity_id: { type: 'string', description: 'Customer UUID or organization ID' },
        entity_type: {
          type: 'string',
          description: 'Entity type: customer or organization',
          enum: ['customer', 'organization'],
        },
      },
      required: ['entity_id', 'entity_type'],
    },
  });

  // ASTA Phase 1: Tool telemetry
  registerTool({
    name: 'dws_tool_telemetry',
    description:
      'Get aggregated tool-use metrics for an agent (invocation rate, skip rate, failure rate, partial failures). Part of the ASTA adaptation framework.',
    inputSchema: {
      type: 'object',
      properties: {
        agent_name: { type: 'string', description: 'Agent name to get metrics for' },
        window_hours: { type: 'number', description: 'Time window in hours (default: 24)' },
      },
      required: ['agent_name'],
    },
  });

  // ASTA Phase 1: Session checkpoints
  registerTool({
    name: 'dws_session_checkpoint',
    description:
      'Recover or inspect a session checkpoint for an interrupted agent session. Returns the saved state if available.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string', description: 'Session ID to recover' },
        agent_name: { type: 'string', description: 'Agent name' },
      },
      required: ['session_id', 'agent_name'],
    },
  });

  // Fact extraction tool
  registerTool({
    name: 'dws_extract_facts',
    description:
      'Extract structured facts (subject-predicate-value triples) from text using LLM. Facts are persisted as memories for later recall and profile building.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to extract facts from (conversation, document, etc.)',
        },
        source: {
          type: 'string',
          description: 'Source identifier (e.g., conversation, email, document)',
        },
        persist: {
          type: 'boolean',
          description: 'Whether to store extracted facts as memories (default: true)',
        },
        min_confidence: {
          type: 'number',
          description: 'Minimum confidence to persist a fact (0-1, default: 0.7)',
        },
        customer_id: {
          type: 'string',
          description: 'Optional customer ID to scope extracted facts',
        },
      },
      required: ['text'],
    },
  });

  // Agent tools — one per registered agent
  // When an agent defines inputSchema, expose its properties directly for better
  // IDE autocomplete and client validation. Otherwise fall back to generic {input}.
  for (const agent of agents) {
    const hasSchema = agent.inputSchema && Object.keys(agent.inputSchema.properties).length > 0;

    registerTool({
      name: `dws_${agent.name.replace(/-/g, '_')}`,
      description: `[DWS IQ Agent] ${agent.description}. Capabilities: ${agent.capabilities.join(', ')}. Model: ${agent.model}.`,
      inputSchema: hasSchema
        ? {
            type: 'object',
            properties: {
              ...agent.inputSchema!.properties,
              projectId: {
                type: 'string',
                description: 'Project identifier (optional, defaults to "mcp-session")',
              },
            },
            required: agent.inputSchema!.required,
          }
        : {
            type: 'object',
            properties: {
              input: {
                type: 'object',
                description: `Input payload for the ${agent.name} agent. Structure depends on the agent.`,
              },
              projectId: {
                type: 'string',
                description: 'Project identifier (optional, defaults to "mcp-session")',
              },
            },
            required: ['input'],
          },
    });
  }

  // Content DMS tools — Evidence Vault: upload, search, HIL review, publish.
  // NOTE: these are not yet present in MCPToolRegistry.TOOL_CLASSIFICATIONS
  // (src/mcp/security/tool-colors.ts), so registerTool() will currently skip
  // them with a warning until each tool gets an explicit RED/BLUE/GREEN risk
  // classification — see PR-1208 follow-up.
  for (const tool of contentMcpTools) {
    registerTool({
      name: tool.name,
      description: `[DWS Content DMS] ${tool.description}`,
      inputSchema: tool.inputSchema as MCPToolDefinition['inputSchema'],
    });
  }

  return tools;
}

/**
 * Handle an MCP JSON-RPC request.
 */
async function handleMCPRequest(
  request: MCPRequest,
  userId: string,
  orgId: string,
  sessionId: string,
): Promise<MCPResponse> {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize': {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          sessionId,
          capabilities: {
            tools: { listChanged: true },
          },
          serverInfo: {
            name: 'dws-iq-agent-server',
            version: '7.0.0',
          },
        },
      };
    }

    case 'tools/list': {
      const tools = buildToolList();
      return {
        jsonrpc: '2.0',
        id,
        result: { tools },
      };
    }

    case 'tools/call': {
      const toolName = (params?.name as string) || '';
      const toolArgs = (params?.arguments as Record<string, unknown>) || {};
      ensureMCPToolClassification(toolName);
      const toolSafety = MCPToolRegistry.validateToolCombination(new Set([toolName]));

      if (!toolSafety.isSafe) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32000, message: toolSafety.reason },
        };
      }

      // Build execution context
      const context: AgentContext = {
        projectId: (toolArgs.projectId as string) || 'mcp-session',
        userId,
        orgId,
        sessionId,
        toolSafety: mcpToolSafetyBySession.get(sessionId),
      };

      const sessionSafety = applyMcpSessionToolSafety(toolName, context);
      if (context.toolSafety) {
        mcpToolSafetyBySession.set(sessionId, context.toolSafety);
      }
      if (!sessionSafety.allowed) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32000, message: sessionSafety.reason || 'Unsafe MCP session tool plan' },
        };
      }

      try {
        const result = await executeToolCall(toolName, toolArgs, context);
        if (context.toolSafety) {
          mcpToolSafetyBySession.set(sessionId, context.toolSafety);
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: msg }),
              },
            ],
            isError: true,
          },
        };
      }
    }

    default: {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
    }
  }
}

function resolveMcpSessionId(
  req: Request,
  request: MCPRequest,
  userId: string,
  orgId: string,
): { sessionId?: string; responseSessionId?: string; error?: string } {
  const namespace = getMcpSessionNamespace(userId, orgId);
  const providedSessionId =
    req.header('x-mcp-session-id') ||
    req.header('mcp-session-id') ||
    (request.params?.sessionId as string | undefined) ||
    ((request.params?.arguments as Record<string, unknown> | undefined)?.sessionId as
      string | undefined);

  if (request.method === 'initialize') {
    const sessionId = issueMcpSessionId(userId, orgId);
    return { sessionId: `${namespace}:${sessionId}`, responseSessionId: sessionId };
  }

  if (!providedSessionId) {
    return {
      error:
        'Missing MCP session. Call initialize first and send X-MCP-Session-ID on subsequent requests.',
    };
  }

  const knownSessions = issuedMcpSessions.get(namespace);
  if (!knownSessions?.has(providedSessionId)) {
    return { error: 'Unknown MCP session. Call initialize first to obtain a valid session ID.' };
  }

  return { sessionId: `${namespace}:${providedSessionId}`, responseSessionId: providedSessionId };
}

/**
 * Execute a tool call by routing to the appropriate handler.
 */
async function executeToolCall(
  toolName: string,
  args: Record<string, unknown>,
  context: AgentContext,
): Promise<unknown> {
  // Meta-tools
  if (toolName === 'dws_list_agents') {
    return agentRegistry.listAgents();
  }

  if (toolName === 'dws_discover') {
    const capability = args.capability as string;
    return agentRegistry.discoverAgents(capability);
  }

  if (toolName === 'dws_workflow') {
    const workflow = args.workflow as string;
    const input = args.input as Record<string, unknown>;
    return executeWorkflow(workflow, input, context);
  }

  if (toolName === 'dws_events') {
    const pattern = args.pattern as string | undefined;
    const limit = (args.limit as number) || 20;
    return eventBus.getRecentEvents(pattern, limit);
  }

  // Memory tools
  if (toolName === 'dws_memory_store') {
    return memoryService.store({
      content: args.content as string,
      memoryType: (args.memory_type as MemoryType) || 'knowledge',
      orgId: context.orgId,
      source: (args.source as string) || 'mcp',
      metadata: (args.metadata as Record<string, unknown>) || {},
    });
  }

  if (toolName === 'dws_memory_recall') {
    const result = await memoryService.recall({
      query: args.query as string,
      memoryType: args.memory_type as MemoryType | undefined,
      orgId: context.orgId,
      limit: (args.limit as number) || 5,
      similarityThreshold: (args.similarity_threshold as number) || 0.5,
    });
    return {
      memories: result.memories.map((m) => ({
        id: m.id,
        content: m.content,
        type: m.memoryType,
        similarity: m.similarity,
        confidence: m.confidence,
      })),
      totalMatches: result.totalMatches,
      searchMethod: result.searchMethod,
      durationMs: result.durationMs,
    };
  }

  if (toolName === 'dws_memory_forget') {
    return memoryService.forget({
      memoryId: args.memory_id as string,
      orgId: context.orgId,
      reason: args.reason as string,
    });
  }

  if (toolName === 'dws_memory_profile') {
    return memoryService.getProfile(
      args.entity_id as string,
      args.entity_type as 'customer' | 'organization',
      context.orgId,
    );
  }

  // ASTA: Tool telemetry
  if (toolName === 'dws_tool_telemetry') {
    const agentName = args.agent_name as string;
    const windowHours = (args.window_hours as number) || 24;
    return telemetryService.getMetrics(agentName, windowHours);
  }

  // ASTA: Session checkpoint recovery
  if (toolName === 'dws_session_checkpoint') {
    const sessionId = args.session_id as string;
    const agentName = args.agent_name as string;
    const state = await checkpointService.recover(sessionId, context.orgId, agentName);
    if (!state) {
      return { found: false, message: 'No checkpoint found or checkpoint expired' };
    }
    return {
      found: true,
      agentName: state.agentName,
      iterationIndex: state.iterationIndex,
      checkpointedAt: state.checkpointedAt,
      messageCount: state.messages.length,
      partialResultCount: state.partialResults.length,
    };
  }

  // Fact extraction
  if (toolName === 'dws_extract_facts') {
    return factExtractionService.extract({
      text: args.text as string,
      orgId: context.orgId,
      customerId: args.customer_id as string | undefined,
      source: (args.source as string) || 'mcp',
      persist: args.persist !== false,
      minConfidence: (args.min_confidence as number) || 0.7,
    });
  }

  // Agent tools — strip "dws_" prefix and convert underscores back to hyphens
  if (toolName.startsWith('dws_')) {
    const agentName = toolName.slice(4).replace(/_/g, '-');
    // Support both wrapped ({input: {...}}) and flat schema formats
    const input =
      (args.input as Record<string, unknown>) ||
      (() => {
        const { projectId: _pid, ...rest } = args;
        return rest;
      })();
    return agentRegistry.executeAgent(agentName, context, input);
  }

  // Content DMS tools — route to contentMcpTools registry by exact name match
  if (toolName.startsWith('contentms_')) {
    const tool = contentMcpTools.find((t) => t.name === toolName);
    if (!tool) throw new Error(`Unknown content tool: ${toolName}`);
    return tool.handler(args);
  }

  throw new Error(`Unknown tool: ${toolName}`);
}

/**
 * Execute a predefined multi-agent workflow.
 */
async function executeWorkflow(
  workflowName: string,
  input: Record<string, unknown>,
  context: AgentContext,
): Promise<unknown> {
  switch (workflowName) {
    case 'compliance-assessment': {
      // Sequential: emissions-data-analyst → compliance → viability
      const emissions = await agentRegistry.executeAgent('emissions-data-analyst', context, input);
      const compliance = await agentRegistry.executeAgent('compliance', context, {
        ...input,
        emissionsAnalysis: emissions.result,
      });
      return {
        workflow: workflowName,
        steps: [
          { agent: 'emissions-data-analyst', result: emissions },
          { agent: 'compliance', result: compliance },
        ],
      };
    }

    case 'construction-full': {
      // Parallel: sitesense + material-oracle + schedule-genius, then construction
      const [sitesense, material, schedule] = await Promise.all([
        agentRegistry.executeAgent('sitesense', context, input),
        agentRegistry.executeAgent('material-oracle', context, input),
        agentRegistry.executeAgent('schedule-genius', context, input),
      ]);
      const construction = await agentRegistry.executeAgent('construction', context, {
        ...input,
        sitesenseResult: sitesense.result,
        materialResult: material.result,
        scheduleResult: schedule.result,
      });
      return {
        workflow: workflowName,
        steps: [
          { agent: 'sitesense', result: sitesense },
          { agent: 'material-oracle', result: material },
          { agent: 'schedule-genius', result: schedule },
          { agent: 'construction', result: construction },
        ],
      };
    }

    case 'seo-pipeline': {
      // Sequential SEO pipeline
      const keywords = await agentRegistry.executeAgent('keyword-intent', context, input);
      const competitors = await agentRegistry.executeAgent('competitor-surveillance', context, {
        ...input,
        keywords: keywords.result,
      });
      const brief = await agentRegistry.executeAgent('content-brief', context, {
        ...input,
        keywords: keywords.result,
        competitors: competitors.result,
      });
      return {
        workflow: workflowName,
        steps: [
          { agent: 'keyword-intent', result: keywords },
          { agent: 'competitor-surveillance', result: competitors },
          { agent: 'content-brief', result: brief },
        ],
      };
    }

    default:
      throw new Error(
        `Unknown workflow: ${workflowName}. Available: ${SUPPORTED_WORKFLOWS.join(', ')}`,
      );
  }
}

// ============ EXPRESS ROUTER ============

/**
 * Create an Express router for the MCP server.
 * Mounts at /mcp in the Express app.
 */
export function createMCPRouter(): Router {
  const router = Router();

  // MCP JSON-RPC endpoint
  router.post('/', async (req: Request, res: Response) => {
    try {
      const request = req.body as MCPRequest;

      if (
        !request ||
        request.jsonrpc !== '2.0' ||
        typeof request.method !== 'string' ||
        request.method.length === 0
      ) {
        res.status(400).json({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32600, message: 'Invalid JSON-RPC request' },
        });
        return;
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          jsonrpc: '2.0',
          id: request.id ?? null,
          error: { code: -32001, message: 'Unauthorized MCP request' },
        });
        return;
      }

      // Until JWTs carry validated organization membership, isolate MCP state
      // per authenticated user instead of falling back to a shared tenant.
      const orgId = req.organizationId || `user:${userId}`;

      logger.info('MCP request', {
        method: request.method,
        id: request.id,
        userId,
        orgId,
      });

      const session = resolveMcpSessionId(req, request, userId, orgId);
      if (!session.sessionId) {
        res.status(400).json({
          jsonrpc: '2.0',
          id: request.id ?? null,
          error: { code: -32002, message: session.error || 'Invalid MCP session' },
        });
        return;
      }

      if (session.responseSessionId) {
        res.setHeader('X-MCP-Session-ID', session.responseSessionId);
      }

      const response = await handleMCPRequest(request, userId, orgId, session.sessionId);
      if (
        request.method === 'initialize' &&
        session.responseSessionId &&
        response.result &&
        typeof response.result === 'object'
      ) {
        (response.result as Record<string, unknown>).sessionId = session.responseSessionId;
      }
      res.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal MCP error';
      logger.error('Unhandled MCP route error', { error: message });
      res.status(500).json({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message },
      });
    }
  });

  // MCP Server-Sent Events for streaming (optional)
  router.get('/sse', authenticateToken, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const orgId = req.organizationId || `user:${req.userId || 'unknown'}`;

    // Subscribe only to events belonging to the caller's tenant scope.
    const unsubscribe = eventBus.subscribe('*', async (event) => {
      if (event.orgId === orgId) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    });

    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  });

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    const agents = agentRegistry.listAgents();
    res.json({
      status: 'ok',
      server: 'dws-iq-agent-server',
      version: '7.0.0',
      agents: agents.length,
      eventSubscriptions: eventBus.getSubscriptionCount(),
      protocol: 'MCP 2024-11-05',
    });
  });

  logger.info('MCP agent server router created', {
    tools: buildToolList().length,
  });

  return router;
}
