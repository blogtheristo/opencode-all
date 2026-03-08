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

import {
  fmt, table, spinner, box, progressBar,
  formatAgentList, formatHealth, formatComplianceResult,
} from './format.js';

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

// --json flag = machine output, otherwise human-friendly
let JSON_MODE = false;

function output(data: unknown, humanFormatter?: (data: unknown) => string): void {
  if (JSON_MODE || !process.stdout.isTTY) {
    console.log(JSON.stringify(data, null, 2));
  } else if (humanFormatter) {
    console.log(humanFormatter(data));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

function error(msg: string): never {
  if (process.stderr.isTTY) {
    console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
  } else {
    console.error(`error: ${msg}`);
  }
  process.exit(1);
}

// ============ COMMANDS ============

async function cmdAgents(): Promise<void> {
  const s = spinner('Fetching agents...');
  const result = await api('/api/agents') as {
    agents: Array<{ name: string; description: string; capabilities: string[]; model: string }>;
  };
  s.stop();
  output(result.agents, (data) => formatAgentList(data as typeof result.agents));
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
  const s = spinner('Checking system health...');
  const [backendHealth, mcpHealth] = await Promise.allSettled([
    api('/health'),
    api('/mcp/health'),
  ]);
  s.stop();

  const data = {
    backend: backendHealth.status === 'fulfilled' ? backendHealth.value : { error: (backendHealth as PromiseRejectedResult).reason?.message },
    mcp: mcpHealth.status === 'fulfilled' ? mcpHealth.value : { error: (mcpHealth as PromiseRejectedResult).reason?.message },
  };
  output(data, (d) => formatHealth(d as typeof data));
}

// ============ NEW: INTERACTIVE COMMANDS ============

async function cmdInit(): Promise<void> {
  // Guided setup for first-time CLI users
  const readline = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });

  const ask = (q: string): Promise<string> =>
    new Promise(resolve => rl.question(q, resolve));

  console.error(box('DWS IQ Setup', 'Configure your CLI connection to the DWS IQ platform.'));
  console.error('');

  const url = await ask(`${fmt.cyan('?')} API URL ${fmt.dim(`(${API_URL})`)}: `);
  const token = await ask(`${fmt.cyan('?')} API Token ${fmt.dim('(paste JWT)')}: `);
  const project = await ask(`${fmt.cyan('?')} Default Project ID ${fmt.dim(`(${PROJECT_ID})`)}: `);
  rl.close();

  const config = {
    DWS_API_URL: url.trim() || API_URL,
    DWS_API_TOKEN: token.trim() || '',
    DWS_PROJECT: project.trim() || PROJECT_ID,
  };

  // Output as env vars the user can export
  console.error('');
  console.error(fmt.success('Configuration ready! Add these to your shell profile:'));
  console.error('');

  for (const [key, value] of Object.entries(config)) {
    if (value) {
      console.log(`export ${key}="${value}"`);
    }
  }

  console.error('');
  console.error(fmt.dim('# Or create a .env file: dws init > .env'));
}

async function cmdStatus(): Promise<void> {
  const s = spinner('Gathering status...');

  const results = await Promise.allSettled([
    api('/health'),
    api('/api/agents'),
    api('/api/v1/usage'),
  ]);
  s.stop();

  const health = results[0].status === 'fulfilled' ? results[0].value as Record<string, unknown> : null;
  const agents = results[1].status === 'fulfilled'
    ? (results[1].value as { agents?: unknown[] }).agents
    : null;
  const usage = results[2].status === 'fulfilled' ? results[2].value as Record<string, unknown> : null;

  if (JSON_MODE) {
    output({ health, agents: agents?.length, usage });
    return;
  }

  const lines: string[] = [
    fmt.bold('DWS IQ Status'),
    '',
    `  Server     ${health ? fmt.status('healthy') : fmt.status('error')}  ${fmt.dim(API_URL)}`,
    `  Agents     ${agents ? fmt.green(String(agents.length)) : fmt.red('?')} registered`,
  ];

  if (usage) {
    const tier = (usage as { tierName?: string }).tierName || 'Free';
    lines.push(`  Plan       ${fmt.cyan(tier)}`);

    const u = (usage as { usage?: Record<string, { used: number; limit: number; percentage: number }> }).usage;
    if (u) {
      for (const [key, metric] of Object.entries(u)) {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        lines.push(`  ${label.padEnd(12)} ${progressBar(metric.used, metric.limit, 20)}`);
      }
    }
  }

  if (health) {
    const uptime = (health as { uptime?: number }).uptime;
    if (uptime) {
      const hours = Math.floor(uptime / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      lines.push(`  Uptime     ${fmt.dim(`${hours}h ${mins}m`)}`);
    }
  }

  lines.push('');
  console.log(lines.join('\n'));
}

async function cmdQuickRun(name: string, inputJson: string): Promise<void> {
  const s = spinner(`Running ${name}...`);

  let input: Record<string, unknown> = {};
  if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      s.stop();
      error(`Invalid JSON in --input`);
    }
  }

  const result = await api(`/api/agents/${name}/execute`, 'POST', {
    context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
    input,
  });
  s.stop();

  // Try to format compliance results nicely
  const r = result as Record<string, unknown>;
  if (r.overallScore !== undefined || r.regulations) {
    output(result, (d) => formatComplianceResult(d as Parameters<typeof formatComplianceResult>[0]));
  } else {
    output(result);
  }
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
dws — DWS IQ CLI. Built for agents & humans.

GETTING STARTED:
  dws init                                Interactive setup wizard
  dws status                              Platform status at a glance
  dws health                              Backend + MCP health check

AGENTS:
  dws agents                              List all registered agents
  dws agent <name>                        Get agent details
  dws run <name> --input '{...}'          Execute an agent
  dws run <name> --stdin                  Execute with JSON from stdin
  dws discover <capability>               Find agents by capability tag

WORKFLOWS:
  dws workflows                           List available workflows
  dws workflow <name> --input '{...}'     Trigger a multi-agent workflow
  dws events [--pattern <p>] [--limit N]  Show recent events

MCP:
  dws mcp tools                           List MCP tools
  dws mcp call <tool> --args '{...}'      Call an MCP tool directly

OPTIONS:
  --json        Force JSON output (default when piped)
  --help        Show this help message

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
  # First-time setup
  dws init

  # Quick status check
  dws status

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
      if (key === 'stdin' || key === 'help' || key === 'json' || key === 'first') {
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

  // Set JSON mode if --json flag or piped output
  if (flags.json === 'true' || !process.stdout.isTTY) {
    JSON_MODE = true;
  }

  if (flags.help || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  try {
    switch (command) {
      case 'init':
        await cmdInit();
        break;

      case 'status':
        await cmdStatus();
        break;

      case 'agents':
        await cmdAgents();
        break;

      case 'agent':
        if (!subcommand) error('Usage: dws agent <name>');
        await cmdAgent(subcommand);
        break;

      case 'run':
        if (!subcommand) error('Usage: dws run <agent-name> --input \'{...}\' or --stdin');
        if (flags.stdin === 'true') {
          await cmdRun(subcommand, '', true);
        } else {
          await cmdQuickRun(subcommand, flags.input || '');
        }
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
