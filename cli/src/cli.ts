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
 *   dws status                          # Quick environment + connection status
 *   dws config                          # Show current configuration
 *   dws mcp tools                       # List MCP tools
 *   dws version                         # Show CLI version
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

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ============ VERSION ============

function getVersion(): string {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '1.1.0';
  }
}

const VERSION = getVersion();

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
  timeoutMs = 30_000,
): Promise<unknown> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      signal: controller.signal,
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
      throw new Error(`HTTP ${response.status}: ${errorMsg}`);
    }

    return response.json();
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs / 1000}s — is the backend running at ${API_URL}?`);
      }
      // Improve connection refused errors
      if (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        throw new Error(
          `Cannot connect to ${API_URL}\n` +
          `  Possible fixes:\n` +
          `  1. Start the backend: npm run dev\n` +
          `  2. Set DWS_API_URL if using a different host/port\n` +
          `  3. Check if the server is behind a firewall`,
        );
      }
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
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

type OutputFormat = 'json' | 'table' | 'compact';

let outputFormat: OutputFormat = 'json';
let quietMode = false;

function output(data: unknown): void {
  if (quietMode) return;

  if (outputFormat === 'compact') {
    console.log(JSON.stringify(data));
    return;
  }

  if (outputFormat === 'table' && Array.isArray(data)) {
    printTable(data);
    return;
  }

  // Default: pretty JSON — agents can parse it, humans can pipe to jq
  console.log(JSON.stringify(data, null, 2));
}

function printTable(rows: Record<string, unknown>[]): void {
  if (rows.length === 0) {
    console.log('(no results)');
    return;
  }

  // Collect columns from first row
  const columns = Object.keys(rows[0]);
  const widths: Record<string, number> = {};

  for (const col of columns) {
    widths[col] = col.length;
  }

  // Measure widths
  for (const row of rows) {
    for (const col of columns) {
      const val = formatCell(row[col]);
      if (val.length > widths[col]) widths[col] = Math.min(val.length, 60);
    }
  }

  // Header
  const header = columns.map((col) => col.toUpperCase().padEnd(widths[col])).join('  ');
  console.log(header);
  console.log(columns.map((col) => '─'.repeat(widths[col])).join('  '));

  // Rows
  for (const row of rows) {
    const line = columns.map((col) => formatCell(row[col]).padEnd(widths[col])).join('  ');
    console.log(line);
  }
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).slice(0, 60);
}

function error(msg: string): never {
  console.error(`dws: ${msg}`);
  process.exit(1);
}

function info(msg: string): void {
  if (!quietMode) {
    console.error(msg);
  }
}

// ============ COMMANDS ============

async function cmdVersion(): Promise<void> {
  if (outputFormat === 'json') {
    output({ cli: VERSION, node: process.version, platform: process.platform });
  } else {
    console.log(`dws ${VERSION} (Node ${process.version}, ${process.platform})`);
  }
}

async function cmdStatus(): Promise<void> {
  info('Checking DWS IQ status...\n');

  const status: Record<string, unknown> = {
    cli_version: VERSION,
    api_url: API_URL,
    api_token: API_TOKEN ? `${API_TOKEN.slice(0, 8)}...` : '(not set)',
    project_id: PROJECT_ID,
  };

  // Check backend
  try {
    const health = await api('/health', 'GET', undefined, 5_000) as Record<string, unknown>;
    status.backend = 'connected';
    status.backend_version = health.version || 'unknown';
  } catch {
    status.backend = 'unreachable';
  }

  // Check MCP
  try {
    const mcpHealth = await api('/mcp/health', 'GET', undefined, 5_000) as Record<string, unknown>;
    status.mcp = 'connected';
    status.mcp_agents = mcpHealth.agents || 0;
  } catch {
    status.mcp = 'unreachable';
  }

  output(status);
}

async function cmdConfig(): Promise<void> {
  const config: Record<string, string> = {
    DWS_API_URL: API_URL,
    DWS_API_TOKEN: API_TOKEN ? '(set)' : '(not set)',
    DWS_PROJECT: PROJECT_ID,
    DWS_SESSION: SESSION_ID,
  };

  if (outputFormat === 'table') {
    const rows = Object.entries(config).map(([key, value]) => ({ variable: key, value }));
    printTable(rows);
  } else {
    output(config);
  }
}

async function cmdAgents(): Promise<void> {
  const result = await api('/api/agents') as {
    agents: Array<{ name: string; description: string; capabilities: string[]; model: string }>;
  };
  output(result.agents);
}

async function cmdAgent(name: string): Promise<void> {
  const result = await api(`/api/agents/${encodeURIComponent(name)}`);
  output(result);
}

async function cmdRun(name: string, inputJson: string, useStdin: boolean, useFirst: boolean): Promise<void> {
  let agentName = name;
  let input: Record<string, unknown>;

  if (useFirst) {
    // --first: read agent list from stdin, pick the first one
    const stdinData = await readStdin();
    if (!stdinData) error('--first requires piped input (e.g., dws discover carbon | dws run --first)');
    try {
      const parsed = JSON.parse(stdinData);
      const agents = Array.isArray(parsed) ? parsed : parsed.agents || [];
      if (agents.length === 0) error('--first: no agents found in input');
      agentName = agents[0].name || agents[0];
      if (typeof agentName !== 'string') error('--first: could not extract agent name from input');
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('--first')) throw e;
      error(`--first: invalid JSON on stdin`);
    }
    // Parse --input if provided alongside --first
    if (inputJson) {
      try {
        input = JSON.parse(inputJson);
      } catch {
        error(`Invalid JSON in --input: ${inputJson.slice(0, 100)}`);
      }
    } else {
      input = {};
    }
  } else if (useStdin) {
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

  info(`Running agent: ${agentName}...`);
  const result = await api(`/api/agents/${encodeURIComponent(agentName)}/execute`, 'POST', {
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

  info(`Running workflow: ${name}...`);
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
    api('/health', 'GET', undefined, 5_000),
    api('/mcp/health', 'GET', undefined, 5_000),
  ]);

  output({
    backend: backendHealth.status === 'fulfilled' ? backendHealth.value : { status: 'unreachable', error: (backendHealth as PromiseRejectedResult).reason?.message },
    mcp: mcpHealth.status === 'fulfilled' ? mcpHealth.value : { status: 'unreachable', error: (mcpHealth as PromiseRejectedResult).reason?.message },
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
dws — DWS IQ CLI v${VERSION}. Built for agents.

COMMANDS:
  dws agents                              List all registered agents
  dws agent <name>                        Get agent details
  dws run <name> --input '{...}'          Execute an agent
  dws run <name> --stdin                  Execute with JSON from stdin
  dws run --first --input '{...}'         Run first agent from piped discover output
  dws discover <capability>               Find agents by capability tag
  dws workflows                           List available workflows
  dws workflow <name> --input '{...}'     Trigger a multi-agent workflow
  dws events [--pattern <p>] [--limit N]  Show recent events
  dws health                              Backend + MCP health check
  dws status                              Quick environment + connection check
  dws config                              Show current configuration
  dws mcp tools                           List MCP tools
  dws mcp call <tool> --args '{...}'      Call an MCP tool directly
  dws version                             Show CLI version

OPTIONS:
  --format json|table|compact             Output format (default: json)
  --quiet                                 Suppress info messages
  --help                                  Show this help

ENVIRONMENT:
  DWS_API_URL     Backend URL (default: http://localhost:8080)
  DWS_API_TOKEN   JWT authentication token
  DWS_PROJECT     Default project ID (default: cli-session)
  DWS_SESSION     Default session ID (default: cli-<timestamp>)

PIPING:
  dws run compliance --input '{"industry":"steel"}' | jq '.result.gaps'
  echo '{"query":"scope 1 total"}' | dws run emissions-data-analyst --stdin
  dws discover carbon | jq '.[0].name' | xargs -I{} dws run {} --input '{}'
  dws agents --format table               Human-readable table output
  dws health --format compact | jq .       Compact JSON for scripting

EXAMPLES:
  # Check EU compliance for a steel company
  dws run compliance --input '{"projectId":"demo","industry":"steel","regulations":["ets","cbam","csrd"],"currentMeasures":{"carbonReporting":true,"emissionsMonitoring":false,"supplyChainDueDiligence":false,"aiSystemLogging":false},"annualEmissions":50000,"importValue":200000}'

  # Run full construction assessment workflow
  dws workflow construction-full --input '{"temperature":28,"humidity":75,"windSpeed":15,"workerCount":50}'

  # Find all compliance-related agents
  dws discover compliance

  # Quick connection test
  dws status

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
    if (arg === '-v' || arg === '-V') {
      // Short version flags
      positional.unshift('version');
      i++;
      continue;
    }
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      // Boolean flags
      if (key === 'stdin' || key === 'help' || key === 'quiet' || key === 'version' || key === 'first') {
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

  // Apply global flags
  if (flags.format) {
    if (['json', 'table', 'compact'].includes(flags.format)) {
      outputFormat = flags.format as OutputFormat;
    } else {
      error(`Unknown format: ${flags.format}. Use json, table, or compact.`);
    }
  }
  if (flags.quiet === 'true') {
    quietMode = true;
  }

  // Version shortcuts
  if (flags.version === 'true' || command === 'version' || command === '--version') {
    await cmdVersion();
    return;
  }

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
        if (!subcommand && flags.first !== 'true') error('Usage: dws run <agent-name> --input \'{...}\' or --stdin or --first');
        await cmdRun(subcommand || '', flags.input || '', flags.stdin === 'true', flags.first === 'true');
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

      case 'status':
        await cmdStatus();
        break;

      case 'config':
        await cmdConfig();
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
        console.error(`dws: unknown command '${command}'\n`);
        console.error('Did you mean one of these?');
        // Simple fuzzy suggestion
        const commands = ['agents', 'agent', 'run', 'discover', 'workflows', 'workflow', 'events', 'health', 'status', 'config', 'mcp', 'version', 'help'];
        const suggestions = commands
          .filter((c) => c.startsWith(command[0]) || levenshtein(command, c) <= 3)
          .slice(0, 3);
        if (suggestions.length > 0) {
          for (const s of suggestions) {
            console.error(`    dws ${s}`);
          }
        }
        console.error(`\nRun 'dws help' for full usage.`);
        process.exit(1);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(msg);
  }
}

// Simple Levenshtein distance for typo suggestions
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[m][n];
}

main();
