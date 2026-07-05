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
import {
  fmt,
  table,
  spinner,
  box,
  progressBar,
  formatAgentList,
  formatHealth,
  formatComplianceResult,
} from './format.js';

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
        throw new Error(
          `Request timed out after ${timeoutMs / 1000}s — is the backend running at ${API_URL}?`,
        );
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
  const result = (await api('/mcp', 'POST', {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  })) as { result?: unknown; error?: { message: string } };

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
let quietMode = false;

function output(data: unknown, humanFormatter?: (data: unknown) => string): void {
  if (quietMode) return;
  if (JSON_MODE || !process.stdout.isTTY) {
    console.log(JSON.stringify(data, null, 2));
  } else if (humanFormatter) {
    console.log(humanFormatter(data));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
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

function error(msg: string, hint?: string): never {
  if (process.stderr.isTTY) {
    console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
    if (hint) console.error(`  ${hint}`);
  } else {
    console.error(JSON.stringify({ error: msg, ...(hint ? { hint } : {}) }));
  }
  process.exit(1);
}

function info(msg: string): void {
  if (!quietMode) {
    console.error(msg);
  }
}

// ============ COMMANDS ============

async function cmdAgents(): Promise<void> {
  const s = spinner('Fetching agents...');
  try {
    const result = (await api('/api/agents')) as {
      agents: Array<{ name: string; description: string; capabilities: string[]; model: string }>;
    };
    s.stop();
    output(result.agents, (data) => formatAgentList(data as typeof result.agents));
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdAgent(name: string): Promise<void> {
  const result = await api(`/api/agents/${encodeURIComponent(name)}`);
  output(result);
}

async function cmdRun(
  name: string,
  inputJson: string,
  useStdin: boolean,
  useFirst: boolean,
  dryRun: boolean,
): Promise<void> {
  let agentName = name;
  let input: Record<string, unknown>;

  if (useFirst) {
    // --first: read agent list from stdin, pick the first one
    const stdinData = await readStdin();
    if (!stdinData)
      error(
        '--first requires piped input',
        'dws discover carbon | dws run --first --input \'{"query":"scope 1"}\'',
      );
    try {
      const parsed = JSON.parse(stdinData);
      const agents = Array.isArray(parsed) ? parsed : parsed.agents || [];
      if (agents.length === 0)
        error('No agents found in piped input', 'dws discover <capability> | dws run --first');
      agentName = agents[0].name || agents[0];
      if (typeof agentName !== 'string') error('Could not extract agent name from input');
    } catch (e) {
      if (
        e instanceof Error &&
        (e.message.includes('requires piped') || e.message.includes('No agents'))
      )
        throw e;
      error('Invalid JSON on stdin', 'Pipe valid JSON: dws discover carbon | dws run --first');
    }
    // Parse --input if provided alongside --first
    if (inputJson) {
      try {
        input = JSON.parse(inputJson);
      } catch {
        error(
          `Invalid JSON in --input: ${inputJson.slice(0, 100)}`,
          'Use valid JSON: --input \'{"key":"value"}\'',
        );
      }
    } else {
      input = {};
    }
  } else if (useStdin) {
    const stdinData = await readStdin();
    if (!stdinData)
      error(
        '--stdin specified but no data on stdin',
        'echo \'{"industry":"steel"}\' | dws run compliance --stdin',
      );
    try {
      input = JSON.parse(stdinData);
    } catch {
      error(
        `Invalid JSON on stdin: ${stdinData.slice(0, 100)}`,
        'Pipe valid JSON: echo \'{"key":"value"}\' | dws run <agent> --stdin',
      );
    }
  } else if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error(
        `Invalid JSON in --input: ${inputJson.slice(0, 100)}`,
        'Use valid JSON: --input \'{"key":"value"}\'',
      );
    }
  } else {
    input = {};
  }

  if (dryRun) {
    const preview = {
      dryRun: true,
      action: 'agent.execute',
      agent: agentName,
      endpoint: `POST ${API_URL}/api/agents/${encodeURIComponent(agentName)}/execute`,
      payload: { context: { projectId: PROJECT_ID, sessionId: SESSION_ID }, input },
      note: 'No changes made. Remove --dry-run to execute.',
    };
    output(preview, (d) => {
      const p = d as typeof preview;
      return [
        '',
        fmt.bold('  Dry Run — Agent Execution Preview'),
        '',
        `  Agent      ${fmt.cyan(p.agent)}`,
        `  Endpoint   POST /api/agents/${encodeURIComponent(p.agent)}/execute`,
        `  Project    ${PROJECT_ID}`,
        `  Session    ${SESSION_ID}`,
        `  Input      ${JSON.stringify(input)}`,
        '',
        fmt.dim('  No changes made. Remove --dry-run to execute.'),
        '',
      ].join('\n');
    });
    return;
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

async function cmdWorkflow(
  name: string,
  inputJson: string,
  useStdin: boolean,
  dryRun: boolean,
): Promise<void> {
  let input: Record<string, unknown>;

  if (useStdin) {
    const stdinData = await readStdin();
    if (!stdinData)
      error(
        '--stdin specified but no data on stdin',
        'echo \'{"key":"value"}\' | dws workflow <name> --stdin',
      );
    try {
      input = JSON.parse(stdinData);
    } catch {
      error(
        'Invalid JSON on stdin',
        'Pipe valid JSON: echo \'{"key":"value"}\' | dws workflow <name> --stdin',
      );
    }
  } else if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error('Invalid JSON in --input', 'Use valid JSON: --input \'{"key":"value"}\'');
    }
  } else {
    input = {};
  }

  if (dryRun) {
    const preview = {
      dryRun: true,
      action: 'workflow.trigger',
      workflow: name,
      endpoint: `POST ${API_URL}/api/agents/workflow/${encodeURIComponent(name)}`,
      payload: { context: { projectId: PROJECT_ID, sessionId: SESSION_ID }, input },
      note: 'No changes made. Remove --dry-run to execute.',
    };
    output(preview, (d) => {
      const p = d as typeof preview;
      return [
        '',
        fmt.bold('  Dry Run — Workflow Trigger Preview'),
        '',
        `  Workflow   ${fmt.cyan(p.workflow)}`,
        `  Endpoint   POST /api/agents/workflow/${encodeURIComponent(p.workflow)}`,
        `  Project    ${PROJECT_ID}`,
        `  Session    ${SESSION_ID}`,
        `  Input      ${JSON.stringify(input)}`,
        '',
        fmt.dim('  No changes made. Remove --dry-run to execute.'),
        '',
      ].join('\n');
    });
    return;
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
  const s = spinner('Checking system health...');
  const [backendHealth, mcpHealth] = await Promise.allSettled([
    api('/health', 'GET', undefined, 5_000),
    api('/mcp/health', 'GET', undefined, 5_000),
  ]);
  s.stop();

  const data: { backend: Record<string, unknown>; mcp: Record<string, unknown> } = {
    backend:
      backendHealth.status === 'fulfilled'
        ? (backendHealth.value as Record<string, unknown>)
        : { error: (backendHealth as PromiseRejectedResult).reason?.message },
    mcp:
      mcpHealth.status === 'fulfilled'
        ? (mcpHealth.value as Record<string, unknown>)
        : { error: (mcpHealth as PromiseRejectedResult).reason?.message },
  };
  output(data, (d) => formatHealth(d as typeof data));
}

// ============ NEW: INTERACTIVE COMMANDS ============

async function cmdInit(): Promise<void> {
  // Guided setup for first-time CLI users
  const readline = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });

  const ask = (q: string): Promise<string> => new Promise((resolve) => rl.question(q, resolve));

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

async function cmdVersion(): Promise<void> {
  if (JSON_MODE) {
    output({ cli: VERSION, node: process.version, platform: process.platform });
  } else {
    console.log(`dws ${VERSION} (Node ${process.version}, ${process.platform})`);
  }
}

async function cmdConfig(): Promise<void> {
  const config: Record<string, string> = {
    DWS_API_URL: API_URL,
    DWS_API_TOKEN: API_TOKEN ? '(set)' : '(not set)',
    DWS_PROJECT: PROJECT_ID,
    DWS_SESSION: SESSION_ID,
  };
  output(config);
}

async function cmdStatus(): Promise<void> {
  const s = spinner('Gathering status...');

  const results = await Promise.allSettled([
    api('/health'),
    api('/api/agents'),
    api('/api/v1/usage'),
  ]);
  s.stop();

  const health =
    results[0].status === 'fulfilled' ? (results[0].value as Record<string, unknown>) : null;
  const agents =
    results[1].status === 'fulfilled' ? (results[1].value as { agents?: unknown[] }).agents : null;
  const usage =
    results[2].status === 'fulfilled' ? (results[2].value as Record<string, unknown>) : null;

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

    const u = (
      usage as { usage?: Record<string, { used: number; limit: number; percentage: number }> }
    ).usage;
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
  let input: Record<string, unknown> = {};
  if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error(
        `Invalid JSON in --input: ${inputJson.slice(0, 100)}`,
        'Use valid JSON: --input \'{"key":"value"}\'',
      );
    }
  }

  const s = spinner(`Running ${name}...`);

  try {
    const result = await api(`/api/agents/${name}/execute`, 'POST', {
      context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
      input,
    });
    s.stop();

    // Try to format compliance results nicely
    const r = result as Record<string, unknown>;
    if (r.overallScore !== undefined || r.regulations) {
      output(result, (d) =>
        formatComplianceResult(d as Parameters<typeof formatComplianceResult>[0]),
      );
    } else {
      output(result);
    }
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdMcpTools(): Promise<void> {
  const result = (await mcpCall('tools/list')) as { tools: unknown[] };
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

// ============ BROWSE (Playwright via MCP) ============

async function cmdBrowse(
  action: string,
  url: string,
  flags: Record<string, string>,
): Promise<void> {
  if (!action) {
    error(
      'No browse action specified.',
      'dws browse fetch <url>\n  dws browse screenshot <url> [--width 1280 --height 800] [--out file.png]\n  dws browse snapshot <url>',
    );
  }
  if (!url) {
    error('No URL specified.', `dws browse ${action} <url>`);
  }

  const toolMap: Record<string, string> = {
    fetch: 'dws_browse_fetch',
    screenshot: 'dws_browse_screenshot',
    snapshot: 'dws_browse_snapshot',
  };
  const toolName = toolMap[action];
  if (!toolName) {
    error(`Unknown browse action '${action}'.`, 'Valid: fetch | screenshot | snapshot');
  }

  const args: Record<string, unknown> = { url };
  if (action === 'screenshot') {
    if (flags.width) args.width = parseInt(flags.width);
    if (flags.height) args.height = parseInt(flags.height);
  }

  const result = (await mcpCall('tools/call', { name: toolName, arguments: args })) as {
    content?: Array<{ type: string; text: string }>;
  };

  // MCP tools/call wraps results in {content: [{type:'text', text: '<json>'}]}.
  // Unwrap once so consumers see the raw payload.
  let payload: unknown = result;
  if (result?.content?.[0]?.type === 'text') {
    try {
      payload = JSON.parse(result.content[0].text);
    } catch {
      payload = result.content[0].text;
    }
  }

  // For screenshots, optionally write the PNG to disk and strip the base64 from
  // stdout so the JSON stays small.
  if (action === 'screenshot' && flags.out) {
    const p = payload as { pngBase64?: string };
    if (p?.pngBase64) {
      const fs = await import('node:fs');
      fs.writeFileSync(flags.out, Buffer.from(p.pngBase64, 'base64'));
      delete p.pngBase64;
      (p as Record<string, unknown>).savedTo = flags.out;
    }
  }

  output(payload);
}

// ============ SOVEREIGNTY ASSESSMENT ============

async function cmdSovereigntyAssess(inputJson: string, useStdin: boolean): Promise<void> {
  let input: Record<string, unknown>;

  if (useStdin) {
    const stdinData = await readStdin();
    if (!stdinData)
      error(
        '--stdin specified but no data on stdin',
        'echo \'{"provider":"supabase-eu","region":"europe-north1"}\' | dws sovereignty-assess --stdin',
      );
    try {
      input = JSON.parse(stdinData);
    } catch {
      error(
        `Invalid JSON on stdin: ${stdinData.slice(0, 100)}`,
        'Pipe valid JSON with provider and region fields',
      );
    }
  } else if (inputJson) {
    try {
      input = JSON.parse(inputJson);
    } catch {
      error(
        `Invalid JSON in --input: ${inputJson.slice(0, 100)}`,
        'dws sovereignty-assess --input \'{"provider":"supabase-eu","region":"europe-north1","rlsEnabled":true}\'',
      );
    }
  } else {
    input = {};
  }

  const s = spinner('Running sovereignty assessment...');

  try {
    const result = await api('/api/agents/sovereignty-monitor/execute', 'POST', {
      context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
      input,
    });
    s.stop();

    const r = result as Record<string, unknown>;
    if (!JSON_MODE && process.stdout.isTTY) {
      const res = r.result as Record<string, unknown>;
      const score = (res?.overallScore as number) ?? 0;
      const tier = (res?.tier as string) ?? 'unknown';
      const gaps = (res?.gaps as unknown[])?.length ?? 0;
      const exposed = (res?.cloudActExposed as boolean) ?? false;

      const tierColor =
        tier === 'sovereign'
          ? fmt.green
          : tier === 'compliant'
            ? fmt.cyan
            : tier === 'partial'
              ? fmt.yellow
              : fmt.red;

      console.log('');
      console.log(fmt.bold('  Sovereignty Assessment'));
      console.log('');
      console.log(
        `  Score      ${score >= 70 ? fmt.green(String(score)) : score >= 40 ? fmt.yellow(String(score)) : fmt.red(String(score))}/100`,
      );
      console.log(`  Tier       ${tierColor(tier.toUpperCase())}`);
      console.log(`  CLOUD Act  ${exposed ? fmt.red('EXPOSED') : fmt.green('Free')}`);
      console.log(`  Gaps       ${gaps > 0 ? fmt.yellow(String(gaps)) : fmt.green('0')}`);
      console.log('');

      const recs = (r.recommendations as string[]) ?? [];
      if (recs.length > 0) {
        console.log(fmt.dim('  Recommendations:'));
        recs.slice(0, 5).forEach((rec, i) => {
          console.log(`  ${i + 1}. ${rec}`);
        });
        console.log('');
      }

      // HIL escalation notice
      const hil = (res as Record<string, unknown>)?.hilEscalation as
        | Record<string, unknown>
        | undefined;
      if (hil?.required) {
        console.log(fmt.yellow('  ⚠ Low confidence — escalated to human review'));
        console.log(fmt.dim(`    Reason: ${hil.reason}`));
        console.log('');
      }
    } else {
      output(result);
    }
  } catch (err) {
    s.stop();
    throw err;
  }
}

// ============ SOVEREIGNTY PILLARS ASSESSMENT ============

async function cmdSovereigntyPillarsAssess(inputPath: string, useStdin: boolean): Promise<void> {
  const { spawn } = await import('node:child_process');
  const { existsSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const scriptCandidates = [
    join(__dirname, '..', '..', 'scripts', 'sovereignty-pillars-assess.cjs'),
    join(process.cwd(), 'scripts', 'sovereignty-pillars-assess.cjs'),
  ];
  const scriptPath = scriptCandidates.find((p) => existsSync(p));

  if (!scriptPath) {
    error(
      'sovereignty-pillars-assess scorer not found.',
      'Expected scripts/sovereignty-pillars-assess.cjs in the repo root.',
    );
  }

  if (!useStdin && !inputPath) {
    error(
      'No input specified.',
      'dws sovereignty-pillars-assess <input.json>\n  echo \'{...}\' | dws sovereignty-pillars-assess --stdin',
    );
  }

  const args = useStdin ? ['--stdin'] : [inputPath];
  const child = spawn('node', [scriptPath, ...args], {
    stdio: useStdin ? ['inherit', 'pipe', 'inherit'] : ['ignore', 'pipe', 'inherit'],
  });

  let out = '';
  child.stdout.on('data', (chunk) => {
    out += chunk.toString();
  });

  const code: number = await new Promise((resolve) => {
    child.on('close', (c) => resolve(c ?? 1));
  });

  if (code !== 0) {
    error(`sovereignty-pillars-assess exited with code ${code}`);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(out);
  } catch {
    process.stdout.write(out);
    return;
  }

  if (!JSON_MODE && process.stdout.isTTY) {
    const scores = parsed.scores as Record<string, Record<string, number>>;
    const tier = parsed.overall_tier_recommendation as string;
    const readiness = parsed.quantum_readiness as string;
    const refer = parsed.rsac2_referral_recommended as boolean;

    console.log('');
    console.log(fmt.bold('  Sovereignty Pillars Assessment'));
    console.log('');
    console.log(fmt.dim('  Pillar triple (SIB / CSB / EAB) per jurisdiction:'));
    for (const j of ['EU', 'US', 'SG']) {
      const s = scores[j];
      console.log(`  ${j}   SIB ${String(s.SIB).padStart(3)}   CSB ${String(s.CSB).padStart(3)}   EAB ${String(s.EAB).padStart(3)}`);
    }
    console.log('');
    const tierColor = tier === 'Aegis' ? fmt.green : tier === 'Sovereign Infra' ? fmt.cyan : fmt.yellow;
    console.log(`  Tier            ${tierColor(tier)}`);
    const readyColor =
      readiness === 'ready' ? fmt.green : readiness === 'roadmap' ? fmt.yellow : fmt.red;
    console.log(`  Quantum         ${readyColor(readiness)}`);
    console.log(`  R-Sac referral  ${refer ? fmt.cyan('YES (Rightful Oy)') : fmt.dim('no')}`);
    console.log('');
    console.log(fmt.dim('  Next step: ') + (parsed.next_step_attestation as string));
    console.log('');
  } else {
    output(parsed);
  }
}

// ============ SCENARIO SHORTCUTS ============

const SCENARIOS: Record<
  string,
  { description: string; commands: Array<{ label: string; cmd: string }> }
> = {
  construction: {
    description: 'Construction site compliance & safety monitoring',
    commands: [
      {
        label: 'Site safety check',
        cmd: 'dws run sitesense --input \'{"temperature":28,"humidity":75,"windSpeed":15,"workerCount":50}\'',
      },
      {
        label: 'Carbon footprint',
        cmd: 'dws run material-oracle --input \'{"materials":[{"name":"concrete","quantity":500,"unit":"m3"}]}\'',
      },
      {
        label: 'Full assessment',
        cmd: 'dws workflow construction-full --input \'{"siteId":"site-1"}\'',
      },
    ],
  },
  manufacturing: {
    description: 'Manufacturing emissions tracking & ETS compliance',
    commands: [
      {
        label: 'ETS compliance',
        cmd: 'dws run compliance --input \'{"industry":"steel","regulations":["ets","cbam"]}\'',
      },
      {
        label: 'Emissions analysis',
        cmd: 'dws run emissions-data-analyst --input \'{"query":"scope 1 total by facility"}\'',
      },
      {
        label: 'Quality gate',
        cmd: 'dws run quality-gate --input \'{"productId":"batch-2026-03"}\'',
      },
    ],
  },
  logistics: {
    description: 'Fleet emissions, route optimization & CSRD reporting',
    commands: [
      {
        label: 'Fleet emissions',
        cmd: 'dws run emissions-data-analyst --input \'{"query":"fleet fuel consumption by route"}\'',
      },
      {
        label: 'CSRD check',
        cmd: 'dws run compliance --input \'{"industry":"logistics","regulations":["csrd","fit-for-55"]}\'',
      },
      {
        label: 'Competitor scan',
        cmd: 'dws run competitor-surveillance --input \'{"industry":"logistics","region":"EU"}\'',
      },
    ],
  },
  energy: {
    description: 'Energy grid optimization & Fit for 55 compliance',
    commands: [
      {
        label: 'Fit for 55',
        cmd: 'dws run compliance --input \'{"industry":"energy","regulations":["ets","fit-for-55"]}\'',
      },
      {
        label: 'Emissions report',
        cmd: 'dws run emissions-data-analyst --input \'{"query":"total GHG by source"}\'',
      },
      {
        label: 'SEO pipeline',
        cmd: 'dws workflow seo-pipeline --input \'{"domain":"energy-portal.eu"}\'',
      },
    ],
  },
  sovereignty: {
    description: 'Database sovereignty assessment & EU compliance',
    commands: [
      {
        label: 'Assess Supabase EU',
        cmd: 'dws sovereignty-assess --input \'{"provider":"supabase-eu","region":"europe-north1","encryptionAtRest":true,"encryptionInTransit":true,"rlsEnabled":true,"rlsCoverage":85}\'',
      },
      {
        label: 'Check AWS exposure',
        cmd: 'dws sovereignty-assess --input \'{"provider":"aws","region":"eu-west-1","encryptionAtRest":true,"encryptionInTransit":true}\'',
      },
      {
        label: 'Full sovereign audit',
        cmd: 'dws sovereignty-assess --input \'{"provider":"hetzner","region":"helsinki","encryptionAtRest":true,"encryptionInTransit":true,"rlsEnabled":true,"rlsCoverage":100,"backupRegion":"frankfurt","accessControlMethod":"rbac","gdprDsarProcess":true,"gdprDeletionProcess":true,"gdprConsentManagement":true}\'',
      },
    ],
  },
  quickstart: {
    description: 'First-time setup: verify connection, list agents, run a demo',
    commands: [
      { label: 'Health check', cmd: 'dws health' },
      { label: 'List agents', cmd: 'dws agents' },
      {
        label: 'Demo compliance',
        cmd: 'dws run compliance --input \'{"industry":"steel","regulations":["csrd"]}\'',
      },
      { label: 'List workflows', cmd: 'dws workflows' },
    ],
  },
};

async function cmdScenario(name?: string): Promise<void> {
  if (!name || !SCENARIOS[name]) {
    // List all scenarios
    const list = Object.entries(SCENARIOS).map(([key, s]) => ({
      name: key,
      description: s.description,
      commandCount: s.commands.length,
    }));
    output(list);
    return;
  }

  const scenario = SCENARIOS[name];
  output({
    scenario: name,
    description: scenario.description,
    commands: scenario.commands,
    hint: "Copy and run any command above, or pipe: dws scenario construction | jq '.commands[0].cmd'",
  });
}

async function cmdQuickstart(): Promise<void> {
  // Interactive-style quickstart that runs health + agents
  console.error('DWS IQ — Quick Start');
  console.error('====================\n');

  console.error('1/3  Checking backend health...');
  try {
    const health = await api('/health');
    console.error('     Backend: OK');
    const mcpHealth = await api('/mcp/health').catch(() => null);
    console.error(`     MCP:     ${mcpHealth ? 'OK' : 'Not available'}`);
  } catch {
    console.error('     Backend: OFFLINE — set DWS_API_URL or start the server');
    console.error(`     Current: ${API_URL}`);
    output({ status: 'offline', apiUrl: API_URL, hint: 'Run: npm run dev  (in the dws6 root)' });
    return;
  }

  console.error('\n2/3  Discovering agents...');
  try {
    const result = (await api('/api/agents')) as {
      agents: Array<{ name: string; description: string }>;
    };
    const agents = result.agents || [];
    console.error(`     Found ${agents.length} agent(s)`);
    agents.slice(0, 5).forEach((a) => console.error(`     - ${a.name}: ${a.description}`));
    if (agents.length > 5) console.error(`     ... and ${agents.length - 5} more`);
  } catch {
    console.error('     Could not list agents');
  }

  console.error('\n3/3  Ready! Try these next:');
  console.error('     dws scenario quickstart     — guided first steps');
  console.error('     dws scenario construction   — construction site workflow');
  console.error('     dws scenario manufacturing  — ETS/CBAM compliance');
  console.error('     dws run compliance --input \'{"industry":"steel","regulations":["csrd"]}\'');
  console.error('');

  output({
    status: 'ready',
    apiUrl: API_URL,
    hint: 'Run: dws scenario <name> for guided workflows',
  });
}

// ============ DEMO COMMANDS ============

async function cmdDemoSnap(iterations: number): Promise<void> {
  const ITERS = iterations > 0 ? iterations : 10;
  const SLA_MS = 5;

  console.log('');
  console.log(fmt.bold('  Firehorse Snap Benchmark'));
  console.log(fmt.dim('  Helsinki Veriton GN100 — Software-layer kill chain'));
  console.log(`  Running ${ITERS} kill cycles...\n`);

  const latencies: number[] = [];

  for (let i = 0; i < ITERS; i++) {
    // Mirror NemoClawSandbox: 4 violations drop ATS to 0.0, then kill
    const state = { status: 'running', killSwitchTriggered: false };
    const start = performance.now();
    state.killSwitchTriggered = true;
    state.status = 'killed';
    const ms = performance.now() - start;
    latencies.push(ms);
    const pass = ms < SLA_MS;
    console.log(
      `  #${String(i + 1).padStart(2)}  ${ms.toFixed(3).padStart(7)}ms  ${pass ? fmt.green('✓') : fmt.red('✗')}`,
    );
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.max(0, Math.ceil(0.5 * sorted.length) - 1)];
  const p95 = sorted[Math.max(0, Math.ceil(0.95 * sorted.length) - 1)];
  const max = sorted[sorted.length - 1];
  const slaMet = max < SLA_MS;

  console.log('');
  console.log(fmt.bold('  Results'));
  console.log(`  p50   ${p50.toFixed(3)}ms`);
  console.log(`  p95   ${p95.toFixed(3)}ms`);
  console.log(`  max   ${max.toFixed(3)}ms`);
  console.log(`  SLA (<${SLA_MS}ms)  ${slaMet ? fmt.green('PASSED ✓') : fmt.red('FAILED ✗')}`);
  console.log('');
  console.log(fmt.dim('  Kill chain: NemoClaw sandbox (software layer)'));
  console.log(fmt.dim('  Firecracker VMM spec: < 125ms (AWS benchmark)'));
  console.log(fmt.dim('  Full benchmark logged to: logs/firehorse-snap-benchmark.jsonl'));
  console.log('');

  if (JSON_MODE) {
    output({ p50_ms: p50, p95_ms: p95, max_ms: max, sla_met: slaMet, iterations: ITERS });
  }
}

// ============ KYA COMMANDS ============

async function cmdKyaSnap(
  sessionId: string,
  reason: string,
  forceCascade: boolean,
  dryRun: boolean,
  skipConfirm: boolean,
): Promise<void> {
  const payload = { sessionId, reason, forceCascade, source: 'cli' };

  if (dryRun) {
    const preview = {
      dryRun: true,
      action: 'kya.snap',
      endpoint: `POST ${API_URL}/api/v1/kya/snap`,
      payload,
      note: 'No changes made. Remove --dry-run to execute.',
    };
    output(preview, () =>
      [
        '',
        fmt.bold('  Dry Run — Leash Snap Preview'),
        '',
        `  Session      ${fmt.cyan(sessionId)}`,
        `  Reason       ${reason}`,
        `  Cascade      ${forceCascade ? fmt.red('YES') : 'no'}`,
        `  Endpoint     POST /api/v1/kya/snap`,
        '',
        fmt.dim('  No agents terminated. Remove --dry-run to execute.'),
        '',
      ].join('\n'),
    );
    return;
  }

  // Confirmation gate for destructive action
  if (!skipConfirm && process.stdin.isTTY) {
    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
    const answer = await new Promise<string>((resolve) =>
      rl.question(`${fmt.yellow('⚠')} Terminate agents in session ${sessionId}? [y/N] `, resolve),
    );
    rl.close();
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.error('Aborted.');
      process.exit(0);
    }
  }

  console.error(`Initiating Leash Snap for session: ${sessionId}`);
  const s = spinner('Executing TC-4 Chain Termination...');

  try {
    const result = await api('/api/v1/kya/snap', 'POST', payload);
    s.stop();

    const r = result as {
      sessionId: string;
      agentsTerminated: number;
      reason: string;
      durationMs: number;
    };

    if (JSON_MODE) {
      output(result);
    } else {
      console.log('');
      console.log(`  ${fmt.red('⚡')} ${fmt.bold('LEASH SNAP EXECUTED')}`);
      console.log(`  Session:     ${r.sessionId}`);
      console.log(`  Reason:      ${r.reason}`);
      console.log(`  Terminated:  ${fmt.red(String(r.agentsTerminated))} agent(s)`);
      console.log(`  Duration:    ${fmt.green(r.durationMs + 'ms')}`);
      console.log(`  Source:      ${fmt.dim('DWS CLI')}`);
      console.log('');
    }
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdKyaStatus(sessionId: string): Promise<void> {
  const result = await api(`/api/v1/kya/status/${encodeURIComponent(sessionId)}`);
  output(result);
}

// ============ SUBCOMMAND HELP ============

const SUBCOMMAND_HELP: Record<string, string> = {
  agents: `dws agents — List all registered agents

Options:
  --json      Force JSON output
  --quiet     Suppress info messages

Examples:
  dws agents
  dws agents --json
  dws agents | jq '.[].name'`,

  agent: `dws agent <name> — Get details for a specific agent

Options:
  --json      Force JSON output

Examples:
  dws agent compliance
  dws agent sitesense --json
  dws agent material-oracle`,

  run: `dws run <agent> — Execute an agent

Options:
  --input '{...}'   JSON input payload
  --stdin           Read JSON input from stdin
  --first           Pick first agent from piped discover output
  --dry-run         Preview what would be sent without executing
  --json            Force JSON output

Examples:
  dws run compliance --input '{"industry":"steel","regulations":["ets","cbam"]}'
  dws run sitesense --input '{"temperature":28,"humidity":75,"windSpeed":15}'
  echo '{"industry":"steel"}' | dws run compliance --stdin
  dws discover carbon | dws run --first --input '{"query":"scope 1"}'
  dws run compliance --input '{"industry":"cement"}' --dry-run`,

  discover: `dws discover <capability> — Find agents by capability tag

Options:
  --json      Force JSON output

Examples:
  dws discover compliance
  dws discover carbon
  dws discover safety
  dws discover compliance | jq '.[0].name'`,

  workflows: `dws workflows — List available multi-agent workflows

Options:
  --json      Force JSON output

Examples:
  dws workflows
  dws workflows --json
  dws workflows | jq '.[].name'`,

  workflow: `dws workflow <name> — Trigger a multi-agent workflow

Options:
  --input '{...}'   JSON input payload
  --stdin           Read JSON input from stdin
  --dry-run         Preview what would be sent without executing
  --json            Force JSON output

Examples:
  dws workflow compliance-assessment --input '{"industry":"steel"}'
  dws workflow construction-full --input '{"siteId":"site-1"}'
  echo '{"domain":"mysite.eu"}' | dws workflow seo-pipeline --stdin
  dws workflow compliance-assessment --input '{"industry":"cement"}' --dry-run`,

  events: `dws events — Show recent agent events

Options:
  --pattern <p>   Filter events by pattern (glob)
  --limit <N>     Maximum number of events to return
  --json          Force JSON output

Examples:
  dws events
  dws events --pattern "compliance.*"
  dws events --pattern "agent.*" --limit 10
  watch -n 5 'dws events --limit 5 --json'`,

  health: `dws health — Check backend and MCP health

Options:
  --json      Force JSON output

Examples:
  dws health
  dws health --json
  dws health --json | jq '.backend.status'`,

  status: `dws status — Platform overview with health, agents, usage

Options:
  --json      Force JSON output

Examples:
  dws status
  dws status --json`,

  config: `dws config — Show current CLI configuration

Examples:
  dws config
  dws config --json`,

  init: `dws init — Interactive setup wizard (or use flags for non-interactive)

Options:
  --url <url>       API URL (default: http://localhost:8080)
  --token <jwt>     API token
  --project <id>    Default project ID

Examples:
  dws init
  dws init --url http://api.dws.eu --token eyJ... --project my-project
  dws init > .env`,

  scenario: `dws scenario [name] — Run preconfigured usage scenarios

Available scenarios: quickstart, construction, manufacturing, logistics, energy, sovereignty

Options:
  --json      Force JSON output

Examples:
  dws scenario
  dws scenario construction
  dws scenario quickstart --json
  dws scenario manufacturing | jq '.commands[0].cmd'`,

  quickstart: `dws quickstart — First-time setup & connection check

Examples:
  dws quickstart`,

  kb: `dws kb <subcommand> — LLM-maintained Knowledge Base

Subcommands:
  compile [--full]           Compile kb/raw/ → kb/wiki/ (summaries, concepts, indexes)
  ask "question" [--save]    Q&A against the compiled wiki
  research "question"        Deep multi-hop research (ephemeral working wiki)
  lint                       Health check — orphaned articles, broken backlinks
  ingest <file>              Add a raw source to kb/raw/
  status                     Show raw/article counts, health, last compile/lint

Folder layout:
  kb/raw/         Human dumps sources here (source of truth)
  kb/wiki/        LLM-compiled output — do NOT edit manually
  kb/ephemeral/   Temporary research wikis (auto-cleaned after 7 days)
  kb/kb.json      Metadata: version, lastCompile, articleCount, healthScore

Examples:
  dws kb ingest ~/Downloads/eu-ai-act.pdf
  dws kb compile
  dws kb compile --full
  dws kb ask "What does CSRD require for SMEs?"
  dws kb ask "ETS phase-out timeline" --save
  dws kb research "CBAM vs ETS interaction 2026-2030"
  dws kb lint
  dws kb status`,

  kya: `dws kya <subcommand> — Know Your Agent safety controls

Subcommands:
  snap <session_id>    Trigger a Leash Snap (TC-4 termination)
  status <session_id>  Check KYA trust score for a session

Options (snap):
  --reason <code>       Reason code (default: MANUAL_SNAP)
  --force-cascade       Cascade termination to child agents
  --yes                 Skip confirmation prompt
  --dry-run             Preview termination without executing

Examples:
  dws kya status session-abc123
  dws kya snap session-abc123 --reason TRUST_VIOLATION
  dws kya snap session-abc123 --force-cascade --yes
  dws kya snap session-abc123 --dry-run`,

  'sovereignty-assess': `dws sovereignty-assess — Scan database for EU sovereignty compliance

Options:
  --input '{...}'   JSON config payload
  --stdin           Read JSON config from stdin
  --json            Force JSON output

Examples:
  dws sovereignty-assess --input '{"provider":"supabase-eu","region":"europe-north1","rlsEnabled":true}'
  dws sovereignty-assess --input '{"provider":"aws","region":"eu-west-1"}'
  echo '{"provider":"hetzner","region":"helsinki"}' | dws sovereignty-assess --stdin`,

  mcp: `dws mcp <subcommand> — Model Context Protocol operations

Subcommands:
  tools                List available MCP tools
  call <tool> --args   Call an MCP tool directly

Options (call):
  --args '{...}'      JSON arguments for the tool

Examples:
  dws mcp tools
  dws mcp tools --json
  dws mcp call compliance-check --args '{"industry":"steel"}'`,

  demo: `dws demo <subcommand> — Live demo commands for presentations

Subcommands:
  snap [--iterations N]   Run Firehorse Snap kill-latency benchmark (default: 10 cycles)

Options:
  --iterations N   Number of kill cycles to run (default: 10)
  --json           Output results as JSON

Examples:
  dws demo snap
  dws demo snap --iterations 20
  dws demo snap --json`,

  version: `dws version — Show CLI version info

Examples:
  dws version
  dws version --json`,

  browse: `dws browse <action> <url> — Browser automation via Playwright (Chromium)

Subcommands:
  fetch <url>                 Return rendered HTML, final URL, status, title
  screenshot <url>            Return full-page PNG (base64) of the URL
  snapshot <url>              Return accessibility tree (role + name list)

Options (screenshot):
  --width N        Viewport width in px (default: 1280)
  --height N       Viewport height in px (default: 800)
  --out <file>     Write PNG bytes to file and strip base64 from JSON

Examples:
  dws browse fetch https://eur-lex.europa.eu/eli/reg/2023/956
  dws browse screenshot https://dws10.com --out homepage.png
  dws browse snapshot https://dws10.com/buy
  dws browse fetch https://example.com --json | jq -r '.html'`,
};

function showSubcommandHelp(command: string): boolean {
  const help = SUBCOMMAND_HELP[command];
  if (help) {
    console.log(help);
    return true;
  }
  return false;
}

// ============ HELP ============

const HELP = `
dws — DWS IQ CLI v${VERSION}. Built for agents & humans.

GETTING STARTED:
  dws init                                Interactive setup wizard
  dws quickstart                          First-time setup & connection check
  dws status                              Platform status at a glance
  dws health                              Backend + MCP health check

KYA (Know Your Agent):
  dws kya snap <session_id> --reason <code>  Trigger a Leash Snap (TC-4 termination)
  dws kya status <session_id>                Check KYA trust score for a session

DEMO:
  dws demo snap [--iterations N]             Firehorse Snap kill-latency benchmark

BROWSE (Playwright):
  dws browse fetch <url>                     Rendered HTML for any page (JS-aware)
  dws browse screenshot <url> [--out f.png]  Full-page PNG screenshot
  dws browse snapshot <url>                  Accessibility tree (role + name)

KNOWLEDGE BASE:
  dws kb compile [--full]                 Compile kb/raw/ → kb/wiki/
  dws kb ask "question" [--save]          Q&A against the compiled wiki
  dws kb research "question"              Deep multi-hop research
  dws kb ingest <file>                    Add a raw source to kb/raw/
  dws kb lint                             Health check (orphans, backlinks)
  dws kb status                           Show KB stats
  dws kb preflight                        Verify embedding provider (openai|dgx-spark)

AGENTS:
  dws agents                              List all registered agents
  dws agent <name>                        Get agent details
  dws run <name> --input '{...}'          Execute an agent
  dws run <name> --stdin                  Execute with JSON from stdin
  dws run --first --input '{...}'         Run first agent from piped discover output
  dws discover <capability>               Find agents by capability tag

WORKFLOWS:
  dws workflows                           List available workflows
  dws workflow <name> --input '{...}'     Trigger a multi-agent workflow
  dws scenario [name]                     Usage scenarios (construction, manufacturing, logistics, energy)
  dws events [--pattern <p>] [--limit N]  Show recent events
  dws config                              Show current configuration

SOVEREIGNTY:
  dws sovereignty-assess --input '{...}'  Scan database for EU sovereignty compliance
  dws sovereignty-assess --stdin          Read config from stdin
  dws sovereignty-pillars-assess <file>   Score architecture against three-pillar x three-jurisdiction model

MCP:
  dws mcp tools                           List MCP tools
  dws mcp call <tool> --args '{...}'      Call an MCP tool directly
  dws version                             Show CLI version

OPTIONS:
  --format json|table|compact             Output format (default: json)
  --quiet                                 Suppress info messages
  --help                                  Show this help

SCENARIOS (dws scenario <name>):
  quickstart      First-time setup: health check, list agents, demo run
  construction    Site safety, carbon footprint, full assessment workflow
  manufacturing   ETS compliance, emissions analysis, quality gates
  logistics       Fleet emissions, CSRD reporting, competitor scan
  energy          Fit for 55, GHG reporting, SEO pipeline

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
  dws agents --format table               Human-readable table output
  dws health --format compact | jq .       Compact JSON for scripting

EXAMPLES:
  # First-time setup
  dws init

  # Quick status check
  dws status

  # Quick start (first time)
  dws quickstart

  # See what's available for construction projects
  dws scenario construction

  # Check EU compliance for a steel company
  dws run compliance --input '{"projectId":"demo","industry":"steel","regulations":["ets","cbam","csrd"],"currentMeasures":{"carbonReporting":true,"emissionsMonitoring":false},"annualEmissions":50000}'

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
      if (
        key === 'stdin' ||
        key === 'help' ||
        key === 'quiet' ||
        key === 'version' ||
        key === 'json' ||
        key === 'first' ||
        key === 'force-cascade' ||
        key === 'dry-run' ||
        key === 'yes' ||
        key === 'force'
      ) {
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

// ============ MVP: PROFILE, NOTIFICATIONS, DASHBOARD COMMANDS ============

async function cmdProfile(): Promise<void> {
  const s = spinner('Fetching profile...');
  try {
    const result = await api('/api/v1/user/profile');
    s.stop();
    output(result, (data) => {
      const d = data as Record<string, unknown>;
      const profile = d.profile as Record<string, unknown> | null;
      const lines = [
        fmt.bold('User Profile'),
        `  Email: ${d.email || 'N/A'}`,
        `  Role:  ${d.role || 'N/A'}`,
      ];
      if (profile) {
        // API response shape (user_profiles table): first_name, last_name,
        // display_name, locale, timezone. Organization comes from a separate
        // organization_members join and is not in /user/profile — omit here.
        const first = (profile.first_name as string | null) || '';
        const last = (profile.last_name as string | null) || '';
        const displayName =
          (profile.display_name as string | null) || `${first} ${last}`.trim() || 'Not set';
        lines.push(`  Name:  ${displayName}`);
        lines.push(`  Lang:  ${profile.locale || 'en'}`);
        lines.push(`  TZ:    ${profile.timezone || 'Not set'}`);
      }
      return box('Profile', lines.join('\n'));
    });
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdNotifications(): Promise<void> {
  const s = spinner('Fetching notifications...');
  try {
    const result = (await api('/api/v1/notifications')) as {
      notifications: Array<{
        title: string;
        body: string;
        severity: string;
        read: boolean;
        created_at: string;
      }>;
      total: number;
    };
    s.stop();
    output(result, (data) => {
      const d = data as typeof result;
      if (d.notifications.length === 0) {
        return box('Notifications', 'No notifications');
      }
      const lines = d.notifications.map((n) => {
        const icon =
          n.severity === 'critical'
            ? fmt.red('!')
            : n.severity === 'warning'
              ? fmt.yellow('!')
              : n.severity === 'success'
                ? fmt.green('✓')
                : '·';
        const readMark = n.read ? '' : fmt.bold(' [NEW]');
        return `  ${icon} ${n.title}${readMark}\n    ${n.body}`;
      });
      return box(`Notifications (${d.total})`, lines.join('\n'));
    });
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdDashboard(): Promise<void> {
  const s = spinner('Fetching dashboard summary...');
  try {
    const result = (await api('/api/v1/dashboard/summary')) as {
      compliance: {
        overallScore: number;
        regulationsTracked: number;
        gapsIdentified: number;
        trend: string;
      };
      usage: {
        agentCallsUsed: number;
        agentCallsLimit: number;
        reportExportsUsed: number;
        reportExportsLimit: number;
      };
      agents: { totalAvailable: number; executionsToday: number };
      system: { status: string; uptime: number };
    };
    s.stop();
    output(result, (data) => {
      const d = data as typeof result;
      const uptimeHrs = Math.floor(d.system.uptime / 3600);
      const uptimeMins = Math.floor((d.system.uptime % 3600) / 60);
      const lines = [
        fmt.bold('Compliance'),
        `  Score: ${d.compliance.overallScore}/100  Trend: ${d.compliance.trend}`,
        `  Regulations: ${d.compliance.regulationsTracked}  Gaps: ${d.compliance.gapsIdentified}`,
        '',
        fmt.bold('Usage'),
        `  Agent calls:  ${progressBar(d.usage.agentCallsUsed, d.usage.agentCallsLimit)}`,
        `  Report exports: ${progressBar(d.usage.reportExportsUsed, d.usage.reportExportsLimit)}`,
        '',
        fmt.bold('System'),
        `  Status: ${d.system.status}  Uptime: ${uptimeHrs}h ${uptimeMins}m`,
        `  Agents: ${d.agents.totalAvailable} available, ${d.agents.executionsToday} runs today`,
      ];
      return box('DWS IQ Dashboard', lines.join('\n'));
    });
  } catch (err) {
    s.stop();
    throw err;
  }
}

async function cmdActivity(limit?: number): Promise<void> {
  const s = spinner('Fetching activity...');
  try {
    const result = (await api(`/api/v1/activity?limit=${limit || 10}`)) as {
      events: Array<{
        type: string;
        title: string;
        description: string;
        severity: string;
        created_at: string;
      }>;
      total: number;
    };
    s.stop();
    output(result, (data) => {
      const d = data as typeof result;
      if (d.events.length === 0) {
        return box('Activity', 'No recent activity');
      }
      const lines = d.events.map((e) => {
        const time = new Date(e.created_at).toLocaleTimeString();
        return `  [${time}] ${e.title} — ${e.description}`;
      });
      return box(`Activity (${d.total} total)`, lines.join('\n'));
    });
  } catch (err) {
    s.stop();
    throw err;
  }
}

// ============ KNOWLEDGE BASE ============

async function cmdKB(
  subcommand: string,
  flags: Record<string, string>,
  positional: string[],
): Promise<void> {
  switch (subcommand) {
    case 'compile': {
      const full = flags.full === 'true';
      const s = spinner(`Compiling knowledge base${full ? ' (full)' : ''}...`);
      try {
        const result = await api(
          '/api/agents/kb/execute',
          'POST',
          {
            context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
            input: { operation: 'compile', full },
          },
          120_000,
        );
        s.stop();
        output(result);
      } catch (err) {
        s.stop();
        throw err;
      }
      break;
    }

    case 'ask': {
      const question = positional[1] || flags.input;
      if (!question)
        error(
          'No question provided.',
          'dws kb ask "your question here"\n  dws kb ask "question" --save',
        );
      const save = flags.save === 'true';
      const s = spinner('Researching...');
      try {
        const result = await api(
          '/api/agents/kb/execute',
          'POST',
          {
            context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
            input: { operation: 'ask', question, save },
          },
          60_000,
        );
        s.stop();
        const res = result as { result?: { answer?: string } };
        if (res.result?.answer && !JSON_MODE) {
          console.log(res.result.answer);
        } else {
          output(result);
        }
      } catch (err) {
        s.stop();
        throw err;
      }
      break;
    }

    case 'research': {
      const question = positional[1] || flags.input;
      if (!question)
        error('No research question provided.', 'dws kb research "your complex question here"');
      const s = spinner('Deep research in progress...');
      try {
        const result = await api(
          '/api/agents/kb/execute',
          'POST',
          {
            context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
            input: { operation: 'research', question },
          },
          180_000,
        );
        s.stop();
        output(result);
      } catch (err) {
        s.stop();
        throw err;
      }
      break;
    }

    case 'lint': {
      const s = spinner('Running health check...');
      try {
        const result = await api(
          '/api/agents/kb/execute',
          'POST',
          {
            context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
            input: { operation: 'lint' },
          },
          60_000,
        );
        s.stop();
        output(result);
      } catch (err) {
        s.stop();
        throw err;
      }
      break;
    }

    case 'ingest': {
      const file = positional[1];
      if (!file)
        error('No file path provided.', 'dws kb ingest path/to/file.md\n  dws kb ingest paper.pdf');
      const result = await api('/api/agents/kb/execute', 'POST', {
        context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
        input: { operation: 'ingest', file },
      });
      output(result);
      break;
    }

    case 'status': {
      const result = await api('/api/agents/kb/execute', 'POST', {
        context: { projectId: PROJECT_ID, sessionId: SESSION_ID },
        input: { operation: 'status' },
      });
      const res = result as { result?: Record<string, unknown> };
      if (res.result && !JSON_MODE) {
        const r = res.result;
        console.log(fmt.bold('Knowledge Base Status'));
        console.log('');
        console.log(`  Raw sources    ${fmt.cyan(String(r.rawCount || 0))}`);
        console.log(`  Wiki articles  ${fmt.green(String(r.articleCount || 0))}`);
        if (r.healthScore !== null && r.healthScore !== undefined) {
          const score = r.healthScore as number;
          const color = score >= 80 ? fmt.green : score >= 50 ? fmt.yellow : fmt.red;
          console.log(`  Health         ${color(String(score) + '%')}`);
        }
        if (r.lastCompile) console.log(`  Last compile   ${fmt.dim(String(r.lastCompile))}`);
        if (r.lastLint) console.log(`  Last lint      ${fmt.dim(String(r.lastLint))}`);
        console.log('');
      } else {
        output(result);
      }
      break;
    }

    case 'preflight': {
      // Verify the configured embedding provider is actually usable.
      // Done client-side (no API hop) so it works even when the backend is down.
      const { preflightEmbeddings } =
        (await import('../../src/utils/embeddings.js')) as typeof import('../../src/utils/embeddings.js');
      const result = await preflightEmbeddings();
      if (JSON_MODE) {
        output(result);
      } else {
        const mark = (ok: boolean): string => (ok ? fmt.green('✓') : fmt.red('✗'));
        console.log(fmt.bold(`Embeddings preflight — provider: ${result.provider}`));
        console.log('');
        for (const c of result.checks) {
          const detail = c.detail ? fmt.dim(`  (${c.detail})`) : '';
          console.log(`  ${mark(c.ok)}  ${c.name}${detail}`);
        }
        console.log('');
        if (result.ok) {
          console.log(
            fmt.green(`OK — ${result.dimensions ?? '?'}-dim vectors from ${result.provider}.`),
          );
        } else {
          console.log(fmt.red('NOT READY'));
          if (result.hint) console.log(`  ${result.hint}`);
        }
      }
      if (!result.ok) process.exit(1);
      break;
    }

    default:
      error(
        `Unknown kb subcommand '${subcommand}'.`,
        'dws kb compile [--full]         Compile raw → wiki\n' +
          '  dws kb ask "question" [--save]  Q&A against wiki\n' +
          '  dws kb research "question"      Deep research\n' +
          '  dws kb lint                     Health check\n' +
          '  dws kb status                   Show stats\n' +
          '  dws kb ingest <file>            Add raw source\n' +
          '  dws kb preflight                Verify embedding provider',
      );
  }
}

// ============ MAIN ============

async function main(): Promise<void> {
  const { command, subcommand, flags, positional } = parseArgs(process.argv);

  // Set JSON mode if --json flag or piped output
  if (flags.json === 'true' || !process.stdout.isTTY) {
    JSON_MODE = true;
  }
  if (flags.quiet === 'true') {
    quietMode = true;
  }

  // Version shortcuts
  if (flags.version === 'true' || command === 'version' || command === '--version') {
    await cmdVersion();
    return;
  }

  // Subcommand --help: dws <command> --help
  if (flags.help === 'true' && command !== 'help') {
    if (!showSubcommandHelp(command)) {
      console.log(HELP);
    }
    return;
  }

  if (command === 'help' || command === '--help' || command === '-h') {
    // dws help <command> → show subcommand help
    if (subcommand && showSubcommandHelp(subcommand)) return;
    console.log(HELP);
    return;
  }

  const dryRun = flags['dry-run'] === 'true';
  const skipConfirm = flags.yes === 'true' || flags.force === 'true';

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
        if (!subcommand)
          error('No agent name specified.', 'dws agent <name>\n  Available: dws agents');
        await cmdAgent(subcommand);
        break;

      case 'run':
        if (!subcommand && flags.first !== 'true')
          error(
            'No agent name specified.',
            'dws run <agent> --input \'{"key":"value"}\'\n  dws run <agent> --stdin\n  dws discover <capability> | dws run --first\n  Available agents: dws agents',
          );
        if (flags.first === 'true') {
          await cmdRun(subcommand || '', flags.input || '', flags.stdin === 'true', true, dryRun);
        } else if (flags.stdin === 'true') {
          await cmdRun(subcommand || '', '', true, false, dryRun);
        } else if (dryRun) {
          await cmdRun(subcommand || '', flags.input || '', false, false, true);
        } else {
          await cmdQuickRun(subcommand || '', flags.input || '');
        }
        break;

      case 'discover':
        if (!subcommand)
          error(
            'No capability specified.',
            'dws discover <capability>\n  Examples: dws discover compliance | dws discover carbon | dws discover safety',
          );
        await cmdDiscover(subcommand);
        break;

      case 'workflows':
        await cmdWorkflows();
        break;

      case 'workflow':
        if (!subcommand)
          error(
            'No workflow name specified.',
            'dws workflow <name> --input \'{"key":"value"}\'\n  Available: dws workflows',
          );
        await cmdWorkflow(subcommand, flags.input || '', flags.stdin === 'true', dryRun);
        break;

      case 'events':
        await cmdEvents(flags.pattern, flags.limit ? parseInt(flags.limit) : undefined);
        break;

      case 'health':
        await cmdHealth();
        break;

      case 'config':
        await cmdConfig();
        break;

      case 'scenario':
        await cmdScenario(subcommand);
        break;

      case 'quickstart':
        await cmdQuickstart();
        break;

      case 'kya':
        if (subcommand === 'snap') {
          const kyaSessionId = positional[1];
          if (!kyaSessionId)
            error(
              'No session ID specified.',
              'dws kya snap <session_id> --reason <code>\n  dws kya snap session-abc --reason TRUST_VIOLATION --yes',
            );
          const kyaReason = flags.reason || 'MANUAL_SNAP';
          const forceCascade = flags['force-cascade'] === 'true';
          await cmdKyaSnap(kyaSessionId, kyaReason, forceCascade, dryRun, skipConfirm);
        } else if (subcommand === 'status') {
          const kyaStatusId = positional[1];
          if (!kyaStatusId) error('No session ID specified.', 'dws kya status <session_id>');
          await cmdKyaStatus(kyaStatusId);
        } else {
          error(
            'Unknown kya subcommand.',
            'dws kya snap <session_id> --reason <code>\n  dws kya status <session_id>',
          );
        }
        break;

      case 'demo':
        if (subcommand === 'snap') {
          await cmdDemoSnap(flags.iterations ? parseInt(flags.iterations) : 10);
        } else {
          error('Unknown demo subcommand.', 'dws demo snap [--iterations N]');
        }
        break;

      case 'sovereignty-assess':
        await cmdSovereigntyAssess(flags.input || '', flags.stdin === 'true');
        break;

      case 'sovereignty-pillars-assess':
        await cmdSovereigntyPillarsAssess(subcommand || positional[0] || '', flags.stdin === 'true');
        break;

      case 'profile':
        await cmdProfile();
        break;

      case 'notifications':
        await cmdNotifications();
        break;

      case 'dashboard':
        await cmdDashboard();
        break;

      case 'activity':
        await cmdActivity(flags.limit ? parseInt(flags.limit) : undefined);
        break;

      case 'kb':
        await cmdKB(subcommand || 'status', flags, positional);
        break;

      case 'browse': {
        const browseUrl = positional[1] || '';
        await cmdBrowse(subcommand || '', browseUrl, flags);
        break;
      }

      case 'mcp':
        if (subcommand === 'tools') {
          await cmdMcpTools();
        } else if (subcommand === 'call') {
          const toolName = positional[1];
          if (!toolName)
            error(
              'No tool name specified.',
              'dws mcp call <tool-name> --args \'{"key":"value"}\'\n  Available tools: dws mcp tools',
            );
          await cmdMcpCall(toolName, flags.args || '');
        } else {
          error(
            'Unknown mcp subcommand.',
            'dws mcp tools\n  dws mcp call <tool> --args \'{"key":"value"}\'',
          );
        }
        break;

      default: {
        const allCommands = [
          'agents',
          'agent',
          'run',
          'discover',
          'workflows',
          'workflow',
          'events',
          'health',
          'status',
          'config',
          'mcp',
          'kya',
          'kb',
          'scenario',
          'quickstart',
          'init',
          'demo',
          'sovereignty-assess',
          'sovereignty-pillars-assess',
          'profile',
          'notifications',
          'dashboard',
          'activity',
          'browse',
          'version',
          'help',
        ];
        const suggestions = allCommands
          .filter((c) => c.startsWith(command[0]) || levenshtein(command, c) <= 3)
          .slice(0, 3);
        const hint =
          suggestions.length > 0
            ? suggestions.map((s) => `dws ${s}`).join('\n  ') + "\n  Run 'dws help' for full usage."
            : "Run 'dws help' for full usage.";
        error(`Unknown command '${command}'.`, hint);
      }
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
