// Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
// Audit trail: git log -- src/agents/workflow-v2/pipeline.ts
/**
 * Workflow v2 — Pipeline view (the HIC's control panel, Chapter 14).
 *
 * Answers, from the market-signal registry (docs/market-signals/*.md):
 *   What does the market say? → What do we believe? → What did we change? → Did it work?
 *
 * Deliberately dependency-free: the registry front matter is a constrained YAML
 * subset (scalars, inline lists, inline maps, block lists of scalars or inline
 * maps) parsed here so the view needs no new package and runs in tests offline.
 * The repo file is the source of truth; Supabase `market_signals` is a mirror.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type SignalStatus =
  | 'observed'
  | 'signal'
  | 'dismissed'
  | 'deferred'
  | 'accepted'
  | 'implemented'
  | 'closed';

export type ImpactStatus = 'not started' | 'in progress' | 'done';

export interface ImpactRow {
  target: string;
  status: ImpactStatus | string;
  note?: string;
}

export interface MarketSignal {
  signal_id: string;
  reality?: string;
  observation?: string;
  signal?: string;
  insight?: string;
  hypothesis?: string;
  decision?: string;
  source?: string;
  date?: string;
  observer?: string;
  confidence?: 'low' | 'medium' | 'high' | string;
  occurrences: number;
  affected: string[];
  status: SignalStatus | string;
  impact: ImpactRow[];
  comprehension?: string;
  /** The only object that changes system behaviour (jev-kya plan, 'three deltas, one decision'). */
  applicationDecision?: ApplicationDecision;
  evaluation?: string | null;
  /** Temporal trail: when each rung was reached (ISO dates). */
  timeline: Partial<Record<TimelineKey, string>>;
  file: string;
}

export interface ApplicationDecision {
  applies_to: string[];
  does_not_apply_to: string[];
  basis: string[];
  valid_until?: string;
  affects: string[];
}

export type TimelineKey =
  | 'observed_at'
  | 'signal_at'
  | 'insight_at'
  | 'decided_at'
  | 'implemented_at'
  | 'evaluated_at'
  | 'kb_updated_at';

const TIMELINE_KEYS: TimelineKey[] = [
  'observed_at',
  'signal_at',
  'insight_at',
  'decided_at',
  'implemented_at',
  'evaluated_at',
  'kb_updated_at',
];

export interface PipelineView {
  generatedAt: string;
  counters: {
    observed: number;
    signals: number;
    insights: number;
    decisions: number;
    implemented: number;
    contentUpdates: number;
    offerUpdates: number;
    evaluated: number;
  };
  observations: MarketSignal[];
  activeSignals: MarketSignal[];
  decisions: MarketSignal[];
  impact: Array<{ signal_id: string; decision?: string; rows: ImpactRow[] }>;
  outcomes: MarketSignal[];
}

const CONTENT_TARGETS = new Set(['lifetime.fi', 'onelifetime.world', 'linkedin', 'meta']);
const OFFER_TARGETS = new Set(['dws10.com', 'buy', 'dws10.com/buy']);

function scalar(raw: string): string | number | null {
  const v = raw.trim().replace(/^["']|["']$/g, '');
  if (v === '' || v === 'null' || v === '~') return null;
  if (/^-?\d+$/.test(v)) return Number(v);
  return v;
}

function inlineList(raw: string): string[] {
  return raw
    .slice(1, -1)
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

/** `{key: value, key2: value with, commas}` — keys are word tokens, values run to the next key. */
function inlineMap(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const body = raw.slice(1, -1);
  const keys = [...body.matchAll(/(?:^|,)\s*([A-Za-z_][\w.-]*):\s*/g)];
  keys.forEach((k, i) => {
    const start = (k.index ?? 0) + k[0].length;
    const end = i + 1 < keys.length ? (keys[i + 1].index ?? body.length) : body.length;
    out[k[1]] = String(scalar(body.slice(start, end).replace(/,\s*$/, '')) ?? '');
  });
  return out;
}

/** Parses the registry front matter subset. Exported for tests. */
export function parseFrontMatter(text: string): Record<string, unknown> {
  const m = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!m) return {};
  const out: Record<string, unknown> = {};
  // Prettier wraps long inline maps across lines; re-join until braces balance.
  const lines: string[] = [];
  for (const raw of m[1].split('\n')) {
    const prev = lines[lines.length - 1];
    const open = (t: string, a: string, b: string) => t.split(a).length > t.split(b).length;
    const valueOnNextLine = prev !== undefined && /:\s*$/.test(prev) && /^\s*[[{]/.test(raw);
    if (prev !== undefined && (open(prev, '{', '}') || open(prev, '[', ']') || valueOnNextLine)) {
      lines[lines.length - 1] = `${prev} ${raw.trim()}`;
    } else {
      lines.push(raw);
    }
  }
  let listKey: string | null = null;
  let mapKey: string | null = null;
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (mapKey && /^\s+[A-Za-z_][\w.-]*:/.test(line)) {
      const i2 = line.indexOf(':');
      const k2 = line.slice(0, i2).trim();
      const v2 = line.slice(i2 + 1).trim();
      (out[mapKey] as Record<string, unknown>)[k2] = v2.startsWith('[')
        ? inlineList(v2)
        : scalar(v2);
      continue;
    }
    mapKey = null;
    if (listKey && /^\s+-\s/.test(line)) {
      const item = line.replace(/^\s+-\s/, '').trim();
      (out[listKey] as unknown[]).push(item.startsWith('{') ? inlineMap(item) : scalar(item));
      continue;
    }
    listKey = null;
    const idx = line.indexOf(':');
    if (idx < 0 || /^\s/.test(line)) continue;
    const key = line.slice(0, idx).trim();
    const rest = line.slice(idx + 1).trim();
    if (rest === '' && key === 'application_decision') {
      out[key] = {};
      mapKey = key;
    } else if (rest === '') {
      out[key] = [];
      listKey = key;
    } else if (rest.startsWith('[')) {
      out[key] = inlineList(rest);
    } else if (rest.startsWith('{')) {
      out[key] = inlineMap(rest);
    } else {
      out[key] = scalar(rest);
    }
  }
  return out;
}

export function parseSignalFile(file: string, text: string): MarketSignal {
  const fm = parseFrontMatter(text);
  const str = (k: string) => (fm[k] === null || fm[k] === undefined ? undefined : String(fm[k]));
  const impactRaw = Array.isArray(fm.impact) ? (fm.impact as unknown[]) : [];
  return {
    signal_id: str('signal_id') ?? file.replace(/\.md$/, ''),
    reality: str('reality'),
    observation: str('observation'),
    signal: str('signal'),
    insight: str('insight'),
    hypothesis: str('hypothesis'),
    decision: str('decision'),
    source: str('source'),
    date: str('date'),
    observer: str('observer'),
    confidence: str('confidence'),
    occurrences: typeof fm.occurrences === 'number' ? fm.occurrences : 1,
    affected: Array.isArray(fm.affected) ? (fm.affected as string[]) : [],
    status: str('status') ?? 'observed',
    impact: impactRaw
      .filter((r): r is Record<string, string> => typeof r === 'object' && r !== null)
      .map((r) => ({ target: r.target ?? '', status: r.status ?? 'not started', note: r.note })),
    comprehension: str('comprehension'),
    applicationDecision: parseApplicationDecision(fm.application_decision),
    evaluation:
      fm.evaluation === null || fm.evaluation === undefined ? null : String(fm.evaluation),
    timeline: Object.fromEntries(
      TIMELINE_KEYS.filter((k) => str(k) !== undefined).map((k) => [k, str(k) as string]),
    ),
    file,
  };
}

function parseApplicationDecision(raw: unknown): ApplicationDecision | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const r = raw as Record<string, unknown>;
  const list = (k: string) => (Array.isArray(r[k]) ? (r[k] as string[]) : []);
  return {
    applies_to: list('applies_to'),
    does_not_apply_to: list('does_not_apply_to'),
    basis: list('basis'),
    valid_until:
      r.valid_until === undefined || r.valid_until === null ? undefined : String(r.valid_until),
    affects: list('affects'),
  };
}

/** Pure aggregation — the six blocks of the control panel plus header counters. */
export function buildPipelineView(signals: MarketSignal[], now = new Date()): PipelineView {
  const by = (...s: string[]) => signals.filter((x) => s.includes(x.status));
  const decided = by('accepted', 'implemented', 'closed');
  const impactRows = decided.flatMap((s) => s.impact);
  const doneTargets = (set: Set<string>) =>
    impactRows.filter((r) => set.has(r.target) && r.status === 'done').length;
  return {
    generatedAt: now.toISOString(),
    counters: {
      observed: signals.length,
      signals: signals.filter((s) => s.signal && s.status !== 'dismissed').length,
      insights: signals.filter((s) => s.insight).length,
      decisions: decided.length,
      implemented: by('implemented', 'closed').length,
      contentUpdates: doneTargets(CONTENT_TARGETS),
      offerUpdates: doneTargets(OFFER_TARGETS),
      evaluated: signals.filter((s) => s.evaluation).length,
    },
    observations: by('observed', 'signal'),
    activeSignals: signals
      .filter((s) => s.signal && !['dismissed', 'closed'].includes(s.status))
      .sort((a, b) => b.occurrences - a.occurrences),
    decisions: decided,
    impact: decided.map((s) => ({ signal_id: s.signal_id, decision: s.decision, rows: s.impact })),
    outcomes: signals.filter((s) => s.evaluation || s.status === 'closed'),
  };
}

export const DEFAULT_REGISTRY_DIR = 'docs/market-signals';

export async function loadRegistry(dir = DEFAULT_REGISTRY_DIR): Promise<MarketSignal[]> {
  const files = (await readdir(dir)).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f)).sort();
  return Promise.all(
    files.map(async (f) => parseSignalFile(f, await readFile(join(dir, f), 'utf-8'))),
  );
}
