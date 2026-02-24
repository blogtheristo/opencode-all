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

import { Router, Request, Response } from 'express';
import logger from '../utils/logger.js';
import { agentRegistry } from '../agents/index.js';
import { eventBus } from '../agents/event-bus.js';
import type { AgentContext } from '../agents/types.js';

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

// ============ MCP SERVER ============

/**
 * Build the list of MCP tools from the agent registry.
 * Each agent becomes a callable tool.
 */
function buildToolList(): MCPToolDefinition[] {
  const agents = agentRegistry.listAgents();
  const tools: MCPToolDefinition[] = [];

  // Meta-tool: list agents
  tools.push({
    name: 'dws_list_agents',
    description: 'List all available DWS IQ agents with their capabilities and models.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  });

  // Meta-tool: discover by capability
  tools.push({
    name: 'dws_discover',
    description: 'Find DWS IQ agents by capability tag (e.g., "compliance", "carbon", "construction").',
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
  tools.push({
    name: 'dws_workflow',
    description: 'Trigger a multi-agent workflow. Available workflows: compliance-assessment, construction-full, seo-pipeline.',
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
  tools.push({
    name: 'dws_events',
    description: 'Get recent events from the DWS IQ event bus. Useful for monitoring agent activity and compliance events.',
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

  // Agent tools — one per registered agent
  for (const agent of agents) {
    tools.push({
      name: `dws_${agent.name.replace(/-/g, '_')}`,
      description: `[DWS IQ Agent] ${agent.description}. Capabilities: ${agent.capabilities.join(', ')}. Model: ${agent.model}.`,
      inputSchema: {
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

  return tools;
}

/**
 * Handle an MCP JSON-RPC request.
 */
async function handleMCPRequest(
  request: MCPRequest,
  userId: string,
  orgId: string,
): Promise<MCPResponse> {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize': {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
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

      // Build execution context
      const context: AgentContext = {
        projectId: (toolArgs.projectId as string) || 'mcp-session',
        userId,
        orgId,
        sessionId: `mcp-${id}`,
      };

      try {
        const result = await executeToolCall(toolName, toolArgs, context);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{
              type: 'text',
              text: JSON.stringify(result, null, 2),
            }],
          },
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: msg }),
            }],
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

  // Agent tools — strip "dws_" prefix and convert underscores back to hyphens
  if (toolName.startsWith('dws_')) {
    const agentName = toolName.slice(4).replace(/_/g, '-');
    const input = (args.input as Record<string, unknown>) || args;
    return agentRegistry.executeAgent(agentName, context, input);
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
      throw new Error(`Unknown workflow: ${workflowName}. Available: compliance-assessment, construction-full, seo-pipeline`);
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
    const request = req.body as MCPRequest;

    if (!request.jsonrpc || !request.method) {
      res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Invalid JSON-RPC request' },
      });
      return;
    }

    // Extract user identity from JWT or default for MCP sessions
    const userId = req.userId || 'mcp-anonymous';
    const orgId = req.organizationId || 'default';

    logger.info('MCP request', {
      method: request.method,
      id: request.id,
      userId,
    });

    const response = await handleMCPRequest(request, userId, orgId);
    res.json(response);
  });

  // MCP Server-Sent Events for streaming (optional)
  router.get('/sse', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Subscribe to all agent events and forward via SSE
    const unsubscribe = eventBus.subscribe('*', async (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
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
