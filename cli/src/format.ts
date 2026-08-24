/**
 * CLI Rich Formatter — Human-readable output with colors, tables, spinners.
 * Zero dependencies. Pure Node.js ANSI escape sequences.
 *
 * Usage:
 *   import { fmt, table, spinner, progressBar, box } from './format.js';
 *
 *   fmt.bold('Title')          // Bold text
 *   fmt.green('OK')            // Green text
 *   table(headers, rows)       // Formatted table
 *   const s = spinner('Loading...')  // Animated spinner
 *   s.stop('Done')
 */

// ============ ANSI CODES ============

const isColorSupported = process.env.NO_COLOR === undefined && process.stdout.isTTY;

function wrap(code: string, text: string): string {
  if (!isColorSupported) return text;
  return `\x1b[${code}m${text}\x1b[0m`;
}

export const fmt = {
  bold: (t: string) => wrap('1', t),
  dim: (t: string) => wrap('2', t),
  italic: (t: string) => wrap('3', t),
  underline: (t: string) => wrap('4', t),

  red: (t: string) => wrap('31', t),
  green: (t: string) => wrap('32', t),
  yellow: (t: string) => wrap('33', t),
  blue: (t: string) => wrap('34', t),
  magenta: (t: string) => wrap('35', t),
  cyan: (t: string) => wrap('36', t),
  white: (t: string) => wrap('37', t),
  gray: (t: string) => wrap('90', t),

  bgRed: (t: string) => wrap('41', t),
  bgGreen: (t: string) => wrap('42', t),
  bgYellow: (t: string) => wrap('43', t),
  bgBlue: (t: string) => wrap('44', t),

  // Semantic
  success: (t: string) => wrap('32', `✓ ${t}`),
  error: (t: string) => wrap('31', `✗ ${t}`),
  warn: (t: string) => wrap('33', `⚠ ${t}`),
  info: (t: string) => wrap('36', `ℹ ${t}`),

  // Score coloring
  score: (value: number, max = 100): string => {
    const pct = (value / max) * 100;
    const text = `${value}`;
    if (pct >= 80) return wrap('32', text); // green
    if (pct >= 60) return wrap('33', text); // yellow
    if (pct >= 40) return wrap('33', text); // orange-ish
    return wrap('31', text); // red
  },

  // Status badge
  status: (s: string): string => {
    switch (s.toLowerCase()) {
      case 'compliant':
      case 'ok':
      case 'green':
      case 'healthy':
        return wrap('42;30', ` ${s.toUpperCase()} `);
      case 'partial':
      case 'amber':
      case 'warning':
        return wrap('43;30', ` ${s.toUpperCase()} `);
      case 'non-compliant':
      case 'red':
      case 'critical':
      case 'error':
        return wrap('41;37', ` ${s.toUpperCase()} `);
      default:
        return wrap('100', ` ${s.toUpperCase()} `);
    }
  },
} as const;

// ============ TABLE ============

export function table(headers: string[], rows: string[][]): string {
  const allRows = [headers, ...rows];
  const colWidths = headers.map((_, i) =>
    Math.max(...allRows.map(row => stripAnsi(row[i] || '').length)),
  );

  const pad = (text: string, width: number): string => {
    const stripped = stripAnsi(text);
    return text + ' '.repeat(Math.max(0, width - stripped.length));
  };

  const separator = colWidths.map(w => '─'.repeat(w + 2)).join('┼');
  const headerLine = headers.map((h, i) => ` ${pad(fmt.bold(h), colWidths[i])} `).join('│');
  const dataLines = rows.map(row =>
    row.map((cell, i) => ` ${pad(cell, colWidths[i])} `).join('│'),
  );

  return [headerLine, separator, ...dataLines].join('\n');
}

function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

// ============ SPINNER ============

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function spinner(message: string) {
  if (!process.stdout.isTTY) {
    process.stderr.write(`${message}\n`);
    return {
      update: (_msg: string) => {},
      stop: (msg?: string) => { if (msg) process.stderr.write(`${msg}\n`); },
    };
  }

  let frame = 0;
  let currentMessage = message;

  const interval = setInterval(() => {
    process.stderr.write(
      `\r\x1b[K${fmt.cyan(SPINNER_FRAMES[frame % SPINNER_FRAMES.length])} ${currentMessage}`,
    );
    frame++;
  }, 80);

  return {
    update(msg: string) {
      currentMessage = msg;
    },
    stop(msg?: string) {
      clearInterval(interval);
      process.stderr.write(`\r\x1b[K`);
      if (msg) process.stderr.write(`${msg}\n`);
    },
  };
}

// ============ PROGRESS BAR ============

export function progressBar(current: number, total: number, width = 30, label = ''): string {
  const pct = Math.min(current / total, 1);
  const filled = Math.round(width * pct);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const pctStr = `${Math.round(pct * 100)}%`;

  const color = pct >= 0.8 ? fmt.green : pct >= 0.5 ? fmt.yellow : fmt.red;

  return `${label ? label + ' ' : ''}${color(bar)} ${pctStr}`;
}

// ============ BOX ============

export function box(title: string, content: string, width = 50): string {
  const lines = content.split('\n');
  const maxLen = Math.max(width, stripAnsi(title).length + 4, ...lines.map(l => stripAnsi(l).length + 4));

  const top = `╭${'─'.repeat(maxLen)}╮`;
  const titleLine = `│ ${fmt.bold(title)}${' '.repeat(maxLen - stripAnsi(title).length - 2)} │`;
  const sep = `├${'─'.repeat(maxLen)}┤`;
  const bottom = `╰${'─'.repeat(maxLen)}╯`;

  const bodyLines = lines.map(l => {
    const stripped = stripAnsi(l);
    return `│ ${l}${' '.repeat(Math.max(0, maxLen - stripped.length - 2))} │`;
  });

  return [top, titleLine, sep, ...bodyLines, bottom].join('\n');
}

// ============ AGENT LIST FORMATTER ============

export function formatAgentList(agents: Array<{ name: string; description: string; capabilities?: string[]; model?: string }>): string {
  const lines: string[] = [
    fmt.bold('DWS IQ Agents'),
    fmt.dim(`${agents.length} agents available`),
    '',
  ];

  for (const agent of agents) {
    lines.push(`  ${fmt.cyan(agent.name)}`);
    lines.push(`  ${fmt.dim(agent.description)}`);
    if (agent.capabilities?.length) {
      lines.push(`  ${fmt.dim('tags:')} ${agent.capabilities.map(c => fmt.yellow(c)).join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ============ HEALTH FORMATTER ============

export function formatHealth(health: { backend: Record<string, unknown>; mcp: Record<string, unknown> }): string {
  const lines: string[] = [
    fmt.bold('System Health'),
    '',
  ];

  // Backend
  const beStatus = (health.backend as { status?: string })?.status;
  lines.push(`  Backend    ${beStatus === 'ok' ? fmt.status('healthy') : fmt.status('error')}`);

  if (health.backend && typeof health.backend === 'object') {
    const services = (health.backend as { services?: Record<string, boolean> }).services;
    if (services) {
      for (const [name, available] of Object.entries(services)) {
        lines.push(`    ${available ? fmt.green('●') : fmt.red('○')} ${name}`);
      }
    }
    const mem = (health.backend as { memory?: { rss: number; heapUsed: number } }).memory;
    if (mem) {
      lines.push(`    ${fmt.dim(`Memory: ${mem.rss}MB RSS, ${mem.heapUsed}MB heap`)}`);
    }
  }

  lines.push('');

  // MCP
  const mcpStatus = (health.mcp as { status?: string })?.status;
  lines.push(`  MCP        ${mcpStatus === 'ok' ? fmt.status('healthy') : fmt.status('error')}`);

  return lines.join('\n');
}

// ============ COMPLIANCE RESULT FORMATTER ============

export function formatComplianceResult(result: {
  overallScore?: number;
  industry?: string;
  regulations?: Array<{ regulation: string; score: number; status: string; gaps?: string[] }>;
  recommendations?: string[];
}): string {
  const lines: string[] = [
    fmt.bold('Compliance Assessment Result'),
    '',
  ];

  if (result.industry) {
    lines.push(`  Industry: ${fmt.cyan(result.industry)}`);
  }

  if (result.overallScore !== undefined) {
    lines.push(`  Overall Score: ${fmt.score(result.overallScore)} / 100`);
    lines.push(`  ${progressBar(result.overallScore, 100, 25)}`);
    lines.push('');
  }

  if (result.regulations?.length) {
    lines.push(fmt.bold('  Regulation Breakdown'));
    for (const reg of result.regulations) {
      const scoreFmt = fmt.score(reg.score);
      lines.push(`    ${reg.regulation.padEnd(12)} ${scoreFmt.padStart(3)}/100  ${fmt.status(reg.status)}`);
      if (reg.gaps?.length) {
        for (const gap of reg.gaps) {
          lines.push(`      ${fmt.dim('•')} ${gap}`);
        }
      }
    }
    lines.push('');
  }

  if (result.recommendations?.length) {
    lines.push(fmt.bold('  Recommendations'));
    for (const rec of result.recommendations) {
      lines.push(`    ${fmt.yellow('→')} ${rec}`);
    }
  }

  return lines.join('\n');
}
