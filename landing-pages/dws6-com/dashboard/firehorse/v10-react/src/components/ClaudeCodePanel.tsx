/**
 * ClaudeCodePanel — Repo Engineering Health Dashboard
 * Shows Five Pillars status + Repository Gap Analysis TODO list
 * Each gap item includes a ready-to-paste Claude Code prompt.
 */

import { useState } from 'react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

type PillarStatus = 'active' | 'partial' | 'missing';

interface Pillar {
  name: string;
  icon: string;
  status: PillarStatus;
  detail: string;
  meta: string;
}

const PILLARS: Pillar[] = [
  {
    name: 'CLAUDE.md',
    icon: '🧠',
    status: 'active',
    detail: 'Project memory — standards, constraints, guardrails',
    meta: '2 000+ lines · 17 sections · read by every session',
  },
  {
    name: 'Skills',
    icon: '⚡',
    status: 'active',
    detail: '.claude/commands/ — reusable workflow components',
    meta: '7 skills: compliance-check, agent-run, workflow, discover-agents, site-safety, carbon-analysis, email',
  },
  {
    name: 'Hooks',
    icon: '🔒',
    status: 'active',
    detail: '.claude/hooks/ + .githooks/ — automated quality enforcement',
    meta: 'pre-bash-safety.sh (PreToolUse) + git pre-push branch validator',
  },
  {
    name: 'Subagents',
    icon: '🤖',
    status: 'active',
    detail: 'Explore, Plan, general-purpose, background — context isolation',
    meta: 'Parallel execution · prevents context window exhaustion',
  },
  {
    name: 'MCP',
    icon: '🔌',
    status: 'partial',
    detail: 'mcp-hub running · mcp-servers/ implemented · mcp.json uncommitted',
    meta: '⚠ mcp.json not in repo — new contributors must create manually',
  },
];

type GapPriority = 'critical' | 'high' | 'medium' | 'low';
type GapStatus = 'open' | 'in-progress' | 'done';

interface GapItem {
  id: string;
  title: string;
  priority: GapPriority;
  status: GapStatus;
  description: string;
  prompt: string;
}

const GAPS: GapItem[] = [
  {
    id: 'mcp-json',
    title: 'mcp.json not committed to repo',
    priority: 'critical',
    status: 'open',
    description: 'New contributors cannot start without manually creating mcp.json from scratch. Blocks onboarding.',
    prompt: `Commit a safe default .mcp.json.example to the repo root so new contributors don't need to create it manually. Include placeholder values for SUPABASE_URL, SUPABASE_ANON_KEY, REDIS_URL, and MCP_HUB_ENDPOINT. Add a note in CLAUDE.md under "Development Commands" to run: cp .mcp.json.example .mcp.json and fill in real values. Never commit the real .mcp.json (it must stay in .gitignore).`,
  },
  {
    id: 'pre-commit-hook',
    title: 'No pre-commit TypeScript / lint hook',
    priority: 'high',
    status: 'open',
    description: 'Type errors and lint violations reach commits uncaught. Only git push is guarded, not git commit.',
    prompt: `Add a .githooks/pre-commit hook that runs fast checks only on staged files:
1. If any .ts or .tsx files are staged in dws6.com/dashboard/firehorse/v10-react/ — run: cd dws6.com/dashboard/firehorse/v10-react && npx tsc --noEmit
2. If any .ts/.tsx files are staged in src/ — run: npm run lint -- --max-warnings 0
Keep it under 15 seconds. Exit 1 on failure to block the commit. Update .claude/hooks/README.md with this new hook documentation.`,
  },
  {
    id: 'mcp-tools-doc',
    title: 'No consolidated docs/MCP_TOOLS.md',
    priority: 'medium',
    status: 'open',
    description: 'MCP tools scattered across mcp-hub/, mcp-servers/, and Express endpoints with no unified reference.',
    prompt: `Create docs/MCP_TOOLS.md documenting every available MCP tool in the DWS6 repository. For each tool include: name, description, input schema (Zod or JSON Schema), example call (curl or JSON-RPC), and which file implements it. Scan mcp-hub/, mcp-servers/, and the /mcp Express endpoint in src/app.ts. Follow DWS Document Standard with VERSION AND AGENT HISTORY block. Add to CLAUDE.md Required Reading table.`,
  },
  {
    id: 'supabase-mcp-stub',
    title: 'Supabase MCP server is stub only',
    priority: 'medium',
    status: 'in-progress',
    description: 'mcp-servers/supabase returns placeholder data. Real queries not implemented.',
    prompt: `Implement actual Supabase query tools in mcp-servers/supabase/. Add these tools: get_projects (list all with status/SPI/CPI), get_portfolio_metrics (aggregated KPIs), get_compliance_status (per-project EU reg status), run_sql_query (admin only — validate against allowlist). Each tool: validate inputs with Zod, use Supabase JS SDK from lib/supabase.ts, return structured JSON with error field on failure. Add integration test in src/__tests__/.`,
  },
  {
    id: 'dev-launcher',
    title: 'No unified dev server launcher',
    priority: 'low',
    status: 'open',
    description: 'Developers must manually start 3+ processes in separate terminals (backend, frontend, MCP hub).',
    prompt: `Create scripts/dev.sh that starts all development services in parallel with colored output per service:
- Backend Express (port 3001): npm run dev
- Dashboard Vite (port 5173): cd dws6.com/dashboard/firehorse/v10-react && npm run dev
- MCP Hub (port 3002): cd mcp-hub && npm run dev
Handle Ctrl+C gracefully (kill all child processes). Prefix each line with [BACKEND], [DASHBOARD], [MCP-HUB] in different colors. Update ADMIN_MANUAL.md Section 27 operational checklist and CLAUDE.md Development Commands section.`,
  },
];

/* ─── Sub-components ────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<PillarStatus, { bg: string; dot: string; label: string }> = {
  active:  { bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Active' },
  partial: { bg: 'bg-amber-50 border-amber-200',     dot: 'bg-amber-400',   label: 'Partial' },
  missing: { bg: 'bg-red-50 border-red-200',          dot: 'bg-red-500',     label: 'Missing' },
};

const PRIORITY_CONFIG: Record<GapPriority, { badge: string; label: string }> = {
  critical: { badge: 'bg-red-100 text-red-700',      label: 'Critical' },
  high:     { badge: 'bg-orange-100 text-orange-700', label: 'High' },
  medium:   { badge: 'bg-amber-100 text-amber-700',   label: 'Medium' },
  low:      { badge: 'bg-border text-fg-muted',     label: 'Low' },
};

const GAP_STATUS_CONFIG: Record<GapStatus, { label: string; cls: string }> = {
  'open':        { label: 'Open',        cls: 'bg-border text-fg-muted' },
  'in-progress': { label: 'In Progress', cls: 'bg-blue-100 text-blue-600' },
  'done':        { label: 'Done',        cls: 'bg-emerald-100 text-emerald-600' },
};

function PillarRow({ pillar }: { pillar: Pillar }) {
  const cfg = STATUS_CONFIG[pillar.status];
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg}`}>
      <span className="text-xl leading-none mt-0.5">{pillar.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-foreground">{pillar.name}</span>
          <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-xs text-fg-muted">{cfg.label}</span>
        </div>
        <p className="text-xs text-fg-muted leading-snug">{pillar.detail}</p>
        <p className="text-xs text-fg-muted mt-0.5 leading-snug">{pillar.meta}</p>
      </div>
    </div>
  );
}

function GapCard({
  gap,
  onStatusChange,
}: {
  gap: GapItem;
  onStatusChange: (id: string, status: GapStatus) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pCfg = PRIORITY_CONFIG[gap.priority];
  const sCfg = GAP_STATUS_CONFIG[gap.status];

  function copyPrompt() {
    navigator.clipboard.writeText(gap.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const nextStatus: Record<GapStatus, GapStatus> = {
    'open': 'in-progress',
    'in-progress': 'done',
    'done': 'open',
  };

  return (
    <div className={`rounded-lg border bg-surface p-3 transition-shadow hover:shadow-sm ${gap.status === 'done' ? 'opacity-60' : ''}`}>
      {/* Top row */}
      <div className="flex items-start gap-2">
        <button
          onClick={() => onStatusChange(gap.id, nextStatus[gap.status])}
          className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            gap.status === 'done'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : gap.status === 'in-progress'
              ? 'border-blue-400 bg-blue-50'
              : 'border-border bg-surface'
          }`}
          title="Cycle status"
        >
          {gap.status === 'done' && <span className="text-white text-xs leading-none">✓</span>}
          {gap.status === 'in-progress' && <span className="text-blue-400 text-xs leading-none">›</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${pCfg.badge}`}>
              {pCfg.label}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${sCfg.cls}`}>
              {sCfg.label}
            </span>
          </div>
          <p className={`text-sm font-medium text-foreground leading-snug ${gap.status === 'done' ? 'line-through' : ''}`}>
            {gap.title}
          </p>
          <p className="text-xs text-fg-muted mt-0.5 leading-snug">{gap.description}</p>
        </div>
      </div>

      {/* Prompt section */}
      <div className="mt-2 ml-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <span>{expanded ? '▾' : '▸'}</span>
          {expanded ? 'Hide prompt' : 'Show Claude prompt'}
        </button>

        {expanded && (
          <div className="mt-2 relative">
            <pre className="text-xs bg-background border border-border rounded p-2.5 whitespace-pre-wrap leading-relaxed text-foreground max-h-40 overflow-y-auto">
              {gap.prompt}
            </pre>
            <button
              onClick={copyPrompt}
              className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded transition-colors ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-surface border border-border text-fg-muted hover:bg-background'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Panel ────────────────────────────────────────────────────────────── */

export function ClaudeCodePanel() {
  const [gaps, setGaps] = useState<GapItem[]>(GAPS);
  const [filter, setFilter] = useState<GapStatus | 'all'>('all');

  function handleStatusChange(id: string, status: GapStatus) {
    setGaps(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  }

  const activePillars = PILLARS.filter(p => p.status === 'active').length;
  const openGaps = gaps.filter(g => g.status !== 'done').length;
  const filtered = filter === 'all' ? gaps : gaps.filter(g => g.status === filter);

  return (
    <div className="card flex flex-col gap-0 p-0 overflow-hidden">
      {/* Panel header */}
      <div className="bg-gradient-to-r from-surface to-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <div>
              <h3 className="text-sm font-semibold text-white leading-none">Repo Engineering Health</h3>
              <p className="text-xs text-fg-muted mt-0.5">Claude Code · Five Pillars · Gap Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full">
              {activePillars}/5 pillars
            </span>
            <span className={`px-2 py-0.5 rounded-full ${openGaps > 0 ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300'}`}>
              {openGaps} gaps open
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-220px)] flex flex-col gap-5">
        {/* ── Five Pillars ──────────────────────────────────────────── */}
        <section>
          <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">
            Five Pillars
          </h4>
          <div className="flex flex-col gap-2">
            {PILLARS.map(p => <PillarRow key={p.name} pillar={p} />)}
          </div>
        </section>

        {/* ── Gap Analysis TODO ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
              Gap Analysis — ToDo
            </h4>
            <div className="flex items-center gap-1">
              {(['all', 'open', 'in-progress', 'done'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2 py-0.5 rounded transition-colors ${
                    filter === f
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-fg-muted hover:text-fg-muted'
                  }`}
                >
                  {f === 'all' ? 'All' : GAP_STATUS_CONFIG[f].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map(gap => (
              <GapCard
                key={gap.id}
                gap={gap}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-fg-muted text-center py-4">No items in this filter</p>
            )}
          </div>

          <p className="text-xs text-fg-muted mt-3 text-center leading-relaxed">
            Click checkbox to cycle Open → In Progress → Done.<br />
            Expand any item to copy its Claude Code prompt.
          </p>
        </section>
      </div>
    </div>
  );
}
