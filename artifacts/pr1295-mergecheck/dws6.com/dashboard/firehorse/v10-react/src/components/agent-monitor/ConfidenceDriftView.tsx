/**
 * Confidence Drift View — "When Did It Start Being Wrong?"
 *
 * Reads the latest drift report from /api/v1/agents/confidence-timeline
 * and visualises per-agent confidence trends with inflection point markers.
 *
 * Three panels:
 *   1. Alert strip — agents with detected drift, severity badge, inflection date
 *   2. Timeline grid — mini sparkline bars per agent (last 21 days)
 *   3. Detail drawer — click an agent to see full stats + input samples
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';

// ─── Types (mirror drift-detector.ts output) ──────────────────────────────────

interface DailyStats {
  date: string;
  meanConfidence: number;
  runCount: number;
  errorCount: number;
  p10: number;
  p90: number;
}

interface AgentDriftResult {
  agentName: string;
  timeline: DailyStats[];
  currentMean: number;
  baselineMean: number;
  dropFraction: number;
  severity: 'ok' | 'warn' | 'alert';
  inflectionDate: string | null;
  inflectionSamples: string[];
}

interface DriftReport {
  generatedAt: string;
  windowDays: number;
  baselineDays: number;
  agents: AgentDriftResult[];
  summary: { total: number; ok: number; warn: number; alert: number };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<AgentDriftResult['severity'], string> = {
  ok: 'bg-green-500/20 text-green-400',
  warn: 'bg-amber-500/20 text-amber-400',
  alert: 'bg-red-500/20 text-red-400',
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function shortDate(iso: string): string {
  return iso.slice(5); // MM-DD
}

// ─── Sparkline — CSS bars for the last N days ─────────────────────────────────

function Sparkline({
  timeline,
  inflectionDate,
  severity,
}: {
  timeline: DailyStats[];
  inflectionDate: string | null;
  severity: AgentDriftResult['severity'];
}) {
  // Show newest-right (timeline is newest-first, so reverse)
  const days = [...timeline].reverse().slice(-21);
  if (days.length === 0) {
    return <span className="text-[10px] text-gray-600 italic">no data</span>;
  }

  return (
    <div className="flex items-end gap-px h-8" title="Daily mean confidence (last 21 days)">
      {days.map((d, i) => {
        const height = Math.round(d.meanConfidence * 100);
        const isInflection = d.date === inflectionDate;
        const barColor = isInflection
          ? 'bg-red-400'
          : severity === 'ok'
            ? 'bg-green-500/60'
            : severity === 'warn'
              ? 'bg-amber-500/60'
              : 'bg-red-500/60';

        return (
          <div
            key={i}
            className="flex-1 min-w-[3px] relative group"
            style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}
          >
            <div
              className={`w-full rounded-sm transition-all ${barColor} ${isInflection ? 'ring-1 ring-red-400' : ''}`}
              style={{ height: `${Math.max(height, 4)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 pointer-events-none">
              <div className="bg-gray-800 border border-gray-700 rounded px-1.5 py-1 text-[10px] text-gray-200 whitespace-nowrap">
                {shortDate(d.date)}: {(d.meanConfidence * 100).toFixed(0)}%
                {d.runCount > 0 && <span className="text-gray-500"> ({d.runCount} runs)</span>}
                {isInflection && <span className="text-red-400 ml-1">← drift start</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Agent row ────────────────────────────────────────────────────────────────

function AgentRow({
  agent,
  selected,
  onSelect,
}: {
  agent: AgentDriftResult;
  selected: boolean;
  onSelect: () => void;
}) {
  const dropPct = (agent.dropFraction * 100).toFixed(1);
  const currentPct = (agent.currentMean * 100).toFixed(0);
  const basePct = (agent.baselineMean * 100).toFixed(0);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        selected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
      }`}
    >
      {/* Agent name + severity */}
      <div className="w-36 shrink-0">
        <p className="text-xs font-medium text-gray-200 truncate">{agent.agentName}</p>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${SEVERITY_STYLE[agent.severity]}`}
        >
          {agent.severity}
        </span>
      </div>

      {/* Sparkline */}
      <div className="flex-1">
        <Sparkline
          timeline={agent.timeline}
          inflectionDate={agent.inflectionDate}
          severity={agent.severity}
        />
      </div>

      {/* Stats */}
      <div className="w-28 shrink-0 text-right space-y-0.5">
        <p className="text-xs font-mono text-gray-200">
          {currentPct}%
          {agent.severity !== 'ok' && <span className="text-red-400 ml-1">↓{dropPct}%</span>}
        </p>
        <p className="text-[10px] text-gray-600">baseline {basePct}%</p>
      </div>
    </button>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function DetailDrawer({ agent }: { agent: AgentDriftResult }) {
  const recentDays = [...agent.timeline].reverse().slice(-14);

  return (
    <div className="border-t border-gray-800 pt-3 space-y-3">
      {/* Inflection */}
      {agent.inflectionDate && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <span className="text-red-400 text-xs font-semibold">Drift start detected</span>
          <span className="text-red-300 text-xs">{agent.inflectionDate}</span>
        </div>
      )}

      {/* Input samples at inflection */}
      {agent.inflectionSamples.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider px-3 mb-1">
            Inputs at inflection
          </p>
          {agent.inflectionSamples.map((s, i) => (
            <p key={i} className="text-[11px] text-gray-400 px-3 py-0.5 font-mono truncate">
              "{s}"
            </p>
          ))}
        </div>
      )}

      {/* 14-day table */}
      <div className="px-3">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
          14-day confidence log
        </p>
        <div className="space-y-1">
          {recentDays.map((d) => (
            <div key={d.date} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 w-12 shrink-0">
                {shortDate(d.date)}
              </span>
              <div className="flex-1 bg-gray-800 rounded h-1.5">
                <div
                  className={`h-1.5 rounded transition-all ${
                    d.date === agent.inflectionDate
                      ? 'bg-red-500'
                      : d.meanConfidence >= 0.75
                        ? 'bg-green-500'
                        : d.meanConfidence >= 0.55
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                  }`}
                  style={{ width: `${d.meanConfidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400 w-8 text-right shrink-0">
                {(d.meanConfidence * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-gray-600 w-12 text-right shrink-0">
                {d.runCount}r {d.errorCount > 0 ? `${d.errorCount}e` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Summary strip ────────────────────────────────────────────────────────────

function SummaryStrip({
  summary,
  generatedAt,
}: {
  summary: DriftReport['summary'];
  generatedAt: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex gap-2">
        {summary.alert > 0 && (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-[11px] font-bold rounded-full">
            {summary.alert} alert
          </span>
        )}
        {summary.warn > 0 && (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full">
            {summary.warn} warn
          </span>
        )}
        {summary.alert === 0 && summary.warn === 0 && (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-[11px] font-bold rounded-full">
            all clear
          </span>
        )}
      </div>
      <span className="text-[10px] text-gray-600 ml-auto">
        {summary.total} agents · updated {timeAgo(generatedAt)}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConfidenceDriftView() {
  const { execute } = useApi<DriftReport>();
  const [report, setReport] = useState<DriftReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'issues'>('issues');

  const load = useCallback(async () => {
    setLoading(true);
    const result = await execute('/api/v1/agents/confidence-timeline');
    if (result) setReport(result);
    setLoading(false);
  }, [execute]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !report) {
    return (
      <div className="space-y-2 animate-pulse p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-800 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-500">No drift data yet</p>
        <p className="text-xs text-gray-600 mt-1">
          Drift reports are generated daily once agent logs accumulate (≥21 days).
        </p>
        <button
          type="button"
          onClick={load}
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayed =
    filterSeverity === 'issues' ? report.agents.filter((a) => a.severity !== 'ok') : report.agents;

  return (
    <div>
      <SummaryStrip summary={report.summary} generatedAt={report.generatedAt} />

      {/* Filter */}
      <div className="flex gap-1 mb-3 p-0.5 bg-gray-800/50 rounded-lg">
        {(['issues', 'all'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilterSeverity(f)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterSeverity === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {f === 'issues'
              ? `Issues (${report.summary.alert + report.summary.warn})`
              : `All (${report.summary.total})`}
          </button>
        ))}
      </div>

      {/* Agent list */}
      <div className="space-y-0.5 max-h-[380px] overflow-y-auto">
        {displayed.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">No issues detected</p>
        ) : (
          displayed.map((agent) => (
            <div key={agent.agentName}>
              <AgentRow
                agent={agent}
                selected={selectedAgent === agent.agentName}
                onSelect={() =>
                  setSelectedAgent((prev) => (prev === agent.agentName ? null : agent.agentName))
                }
              />
              {selectedAgent === agent.agentName && <DetailDrawer agent={agent} />}
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={load}
        className="w-full mt-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}
