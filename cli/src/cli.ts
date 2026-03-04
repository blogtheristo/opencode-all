#!/usr/bin/env node
/**
 * DWS IQ CLI — Built for Agents
 *
 * Zero dependencies. Pure Node.js. Pipeable. JSON-native.
 *
 * Usage:
 *   dws agents                          # List all agents
 *   dws run compliance --input '{...}'  # Execute an agent
 *   dws discover carbon                 # Find agents by capability
 *   dws workflow compliance-assessment  # Trigger a workflow
 *   dws workflows                       # List available workflows
 *   dws events                          # Show recent events
 *   dws events --pattern "compliance.*" # Filter events
 *   dws health                          # Server health check
 *   dws mcp tools                       # List MCP tools
 *
 * Piping:
 *   dws run emissions-data-analyst --input '{"query":"total scope 1"}' | jq .result
 *   echo '{"industry":"steel"}' | dws run compliance --stdin
 *   dws discover compliance | dws run --first --input '{"regulations":["ets"]}'
 *
 * Config:
 *   DWS_API_URL   — Backend URL (default: http://localhost:8080)
 *   DWS_API_TOKEN — JWT token for authentication
 *   DWS_PROJECT   — Default project ID
 *   DWS_SESSION   — Default session ID
 */

// ============ CONFIG ============

const API_URL = process.env.DWS_API_URL || 'http://localhost:8080';
const API_TOKEN = process.env.DWS_API_TOKEN || '';
const PROJECT_ID = process.env.DWS_PROJECT || 'cli-session';
const SESSION_ID = process.env.DWS_SESSION || `cli-${Date.now()}`;

// ============ HTTP CLIENT ============

async function api(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: unknown,
): Promise<unknown> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMsg: string;
    try {
      const parsed = JSON.parse(text);
      errorMsg = parsed.message || parsed.error || text;
    } catch {
      errorMsg = text;
    }
    throw new Error(`${response.status} ${response.statusText}: ${errorMsg}`);
  }

  return response.json();
}

async function mcpCall(method: string, params?: Record<string, unknown>): Promise<unknown> {
  const result = await api('/mcp', 'POST', {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  }) as { result?: unknown; error?: { message: string } };

  if (result.error) {
    throw new Error(`MCP error: ${result.error.message}`);
  }
  return result.result;
}

// ============ STDIN READER ============

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

// ============ OUTPUT ============

function output(data: unknown): void {
  // Always JSON — agents can parse it, humans can pipe to jq
  console.log(JSON.stringify(data, null, 2));
}

function error(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

// ============ COMMANDS ============

async function cmdAgents(): Promise<void> {
  const result = await api('/api/agents') as {
    agents: Array<{ name: string; description: string; capabilities: string[]; model: string }>;
  };
  output(result.agents);
}

async function cmdAgent(name: string): Promise<void> {
  const result = await api(`/api/agents/${name}`);
  output(result);
}

async function cmdRun(name: string, inputJson: string, useStdin: boolean): Promise<void> {
  let input: Record<string, unknown>;

  if (useStdin) {
    const stdinData = await readStdin();
    if (!stdinData) error('--stdin specified but no data on stdin');
    try {
      input = JSON.parse(stdinData);
    } catch {
      error(`Invalid JSON on stdin: ${stdinData.slice(0, 100)}`);
    }
  } else if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error(`Invalid JSON in --input: ${inputJson.slice(0, 100)}`);
    }
  } else {
    input = {};
  }

  const result = await api(`/api/agents/${name}/execute`, 'POST', {
    context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
    input,
  });
  output(result);
}

async function cmdDiscover(capability: string): Promise<void> {
  const result = await api(`/api/agents/discover/${encodeURIComponent(capability)}`);
  output(result);
}

async function cmdWorkflows(): Promise<void> {
  const result = await api('/api/agents/workflows');
  output(result);
}

async function cmdWorkflow(name: string, inputJson: string, useStdin: boolean): Promise<void> {
  let input: Record<string, unknown>;

  if (useStdin) {
    const stdinData = await readStdin();
    if (!stdinData) error('--stdin specified but no data on stdin');
    try {
      input = JSON.parse(stdinData);
    } catch {
      error(`Invalid JSON on stdin`);
    }
  } else if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error(`Invalid JSON in --input`);
    }
  } else {
    input = {};
  }

  const result = await api(`/api/agents/workflow/${encodeURIComponent(name)}`, 'POST', {
    context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
    input,
  });
  output(result);
}

async function cmdEvents(pattern?: string, limit?: number): Promise<void> {
  const params = new URLSearchParams();
  if (pattern) params.set('pattern', pattern);
  if (limit) params.set('limit', limit.toString());
  const qs = params.toString();
  const result = await api(`/api/agents/events${qs ? '?' + qs : ''}`);
  output(result);
}

async function cmdHealth(): Promise<void> {
  const [backendHealth, mcpHealth] = await Promise.allSettled([
    api('/health'),
    api('/mcp/health'),
  ]);

  output({
    backend: backendHealth.status === 'fulfilled' ? backendHealth.value : { error: (backendHealth as PromiseRejectedResult).reason?.message },
    mcp: mcpHealth.status === 'fulfilled' ? mcpHealth.value : { error: (mcpHealth as PromiseRejectedResult).reason?.message },
  });
}

async function cmdMcpTools(): Promise<void> {
  const result = await mcpCall('tools/list') as { tools: unknown[] };
  output(result.tools);
}

async function cmdMcpCall(toolName: string, argsJson: string): Promise<void> {
  let args: Record<string, unknown> = {};
  if (argsJson) {
    try {
      args = JSON.parse(argsJson);
    } catch {
      error(`Invalid JSON in --args`);
    }
  }

  const result = await mcpCall('tools/call', { name: toolName, arguments: args });
  output(result);
}

// ============ HELP ============

const HELP = `
dws — DWS IQ CLI. Built for agents.

COMMANDS:
  dws agents                              List all registered agents
  dws agent <name>                        Get agent details
  dws run <name> --input '{...}'          Execute an agent
  dws run <name> --stdin                  Execute with JSON from stdin
  dws discover <capability>               Find agents by capability tag
  dws workflows                           List available workflows
  dws workflow <name> --input '{...}'     Trigger a multi-agent workflow
  dws events [--pattern <p>] [--limit N]  Show recent events
  dws health                              Backend + MCP health check
  dws mcp tools                           List MCP tools
  dws mcp call <tool> --args '{...}'      Call an MCP tool directly

ENVIRONMENT:
  DWS_API_URL     Backend URL (default: http://localhost:8080)
  DWS_API_TOKEN   JWT authentication token
  DWS_PROJECT     Default project ID (default: cli-session)
  DWS_SESSION     Default session ID (default: cli-<timestamp>)

PIPING:
  dws run compliance --input '{"industry":"steel"}' | jq '.result.gaps'
  echo '{"query":"scope 1 total"}' | dws run emissions-data-analyst --stdin
  dws discover carbon | jq '.[0].name' | xargs -I{} dws run {} --input '{}'

EXAMPLES:
  # Check EU compliance for a steel company
  dws run compliance --input '{"projectId":"demo","industry":"steel","regulations":["ets","cbam","csrd"],"currentMeasures":{"carbonReporting":true,"emissionsMonitoring":false,"supplyChainDueDiligence":false,"aiSystemLogging":false},"annualEmissions":50000,"importValue":200000}'

  # Run full construction assessment workflow
  dws workflow construction-full --input '{"temperature":28,"humidity":75,"windSpeed":15,"workerCount":50}'

  # Find all compliance-related agents
  dws discover compliance

  # Monitor agent events in real-time
  watch -n 5 'dws events --pattern "agent.*" --limit 10'
`.trim();

// ============ ARGUMENT PARSER ============

function parseArgs(argv: string[]): {
  command: string;
  subcommand?: string;
  flags: Record<string, string>;
  positional: string[];
} {
  const args = argv.slice(2); // skip node + script
  const flags: Record<string, string> = {};
  const positional: string[] = [];

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      // Boolean flag (--stdin) or value flag (--input '{...}')
      if (key === 'stdin' || key === 'help') {
        flags[key] = 'true';
      } else {
        i++;
        flags[key] = args[i] || '';
      }
    } else {
      positional.push(arg);
    }
    i++;
  }

  return {
    command: positional[0] || 'help',
    subcommand: positional[1],
    flags,
    positional: positional.slice(1),
  };
}

// ============ MAIN ============

async function main(): Promise<void> {
  const { command, subcommand, flags, positional } = parseArgs(process.argv);

  if (flags.help || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  try {
    switch (command) {
      case 'agents':
        await cmdAgents();
        break;

      case 'agent':
        if (!subcommand) error('Usage: dws agent <name>');
        await cmdAgent(subcommand);
        break;

      case 'run':
        if (!subcommand) error('Usage: dws run <agent-name> --input \'{...}\' or --stdin');
        await cmdRun(subcommand, flags.input || '', flags.stdin === 'true');
        break;

      case 'discover':
        if (!subcommand) error('Usage: dws discover <capability>');
        await cmdDiscover(subcommand);
        break;

      case 'workflows':
        await cmdWorkflows();
        break;

      case 'workflow':
        if (!subcommand) error('Usage: dws workflow <name> --input \'{...}\'');
        await cmdWorkflow(subcommand, flags.input || '', flags.stdin === 'true');
        break;

      case 'events':
        await cmdEvents(flags.pattern, flags.limit ? parseInt(flags.limit) : undefined);
        break;

      case 'health':
        await cmdHealth();
        break;

      case 'mcp':
        if (subcommand === 'tools') {
          await cmdMcpTools();
        } else if (subcommand === 'call') {
          const toolName = positional[1];
          if (!toolName) error('Usage: dws mcp call <tool-name> --args \'{...}\'');
          await cmdMcpCall(toolName, flags.args || '');
        } else {
          error('Usage: dws mcp [tools|call <tool> --args \'{...}\']');
        }
        break;

      default:
        error(`Unknown command: ${command}. Run 'dws help' for usage.`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(msg);
  }
}

main();
