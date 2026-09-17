/**
 * MemoryDashboard Component
 * Agent memory analytics: confidence decay curves, type distribution,
 * audit trail, and consolidation stats.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (memory-decay-audit-final)
 * Date: 2026-03-23
 * Owner: Lifetime Oy
 */

import { useEffect, useState, useCallback } from 'react';
import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { supabase } from '../lib/supabase';

// ============ TYPES ============

interface MemoryStats {
  totalMemories: number;
  activeMemories: number;
  expiredMemories: number;
  avgConfidence: number;
  lowConfidenceCount: number;
  typeDistribution: { type: string; count: number }[];
  confidenceDistribution: { range: string; count: number }[];
  decayCurve: { day: number; confidence: number }[];
  recentAudit: AuditEntry[];
  accessPatterns: { date: string; stores: number; recalls: number; forgets: number }[];
}

interface AuditEntry {
  id: string;
  operation: string;
  agent_id: string;
  memory_id: string | null;
  reason: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: '#94a3b8',
};

const TYPE_COLORS: Record<string, string> = {
  preference: CHART_COLORS.primary,
  knowledge: CHART_COLORS.secondary,
  procedure: CHART_COLORS.success,
  episode: CHART_COLORS.warning,
  fact: CHART_COLORS.info,
  profile: CHART_COLORS.danger,
};

// ============ DATA FETCHING ============

async function fetchMemoryStats(): Promise<MemoryStats> {
  // Fetch all active memories
  const { data: memories, error: memErr } = await supabase
    .from('semantic_memories')
    .select('id, memory_type, confidence, access_count, created_at, accessed_at, expired_at');

  // Fetch recent audit log
  const { data: auditLog, error: auditErr } = await supabase
    .from('memory_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (memErr) console.error('Memory fetch error:', memErr);
  if (auditErr) console.error('Audit fetch error:', auditErr);

  const allMemories = memories || [];
  const active = allMemories.filter(m => !m.expired_at);
  const expired = allMemories.filter(m => m.expired_at);

  // Type distribution
  const typeCounts = new Map<string, number>();
  for (const m of active) {
    typeCounts.set(m.memory_type, (typeCounts.get(m.memory_type) || 0) + 1);
  }
  const typeDistribution = Array.from(typeCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Confidence distribution (histogram buckets)
  const buckets = [
    { range: '0.0-0.2', min: 0, max: 0.2, count: 0 },
    { range: '0.2-0.4', min: 0.2, max: 0.4, count: 0 },
    { range: '0.4-0.6', min: 0.4, max: 0.6, count: 0 },
    { range: '0.6-0.8', min: 0.6, max: 0.8, count: 0 },
    { range: '0.8-1.0', min: 0.8, max: 1.01, count: 0 },
  ];
  for (const m of active) {
    const bucket = buckets.find(b => m.confidence >= b.min && m.confidence < b.max);
    if (bucket) bucket.count++;
  }
  const confidenceDistribution = buckets.map(b => ({ range: b.range, count: b.count }));

  // Average confidence
  const avgConfidence = active.length > 0
    ? active.reduce((sum, m) => sum + m.confidence, 0) / active.length
    : 0;

  // Low confidence count (below 0.3)
  const lowConfidenceCount = active.filter(m => m.confidence < 0.3).length;

  // Theoretical decay curve: confidence * (halfLife / (halfLife + days))
  const halfLife = 90;
  const decayCurve = Array.from({ length: 13 }, (_, i) => {
    const day = i * 30; // 0, 30, 60, ..., 360 days
    const confidence = Number((halfLife / (halfLife + day)).toFixed(3));
    return { day, confidence };
  });

  // Access patterns (last 7 days from audit log)
  const audit = auditLog || [];
  const now = new Date();
  const accessPatterns = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().slice(0, 10);
    const dayEntries = audit.filter(a =>
      a.created_at.slice(0, 10) === dateStr
    );
    return {
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      stores: dayEntries.filter(a => a.operation === 'store').length,
      recalls: dayEntries.filter(a => a.operation === 'extract').length,
      forgets: dayEntries.filter(a => a.operation === 'forget').length,
    };
  });

  return {
    totalMemories: allMemories.length,
    activeMemories: active.length,
    expiredMemories: expired.length,
    avgConfidence: Number(avgConfidence.toFixed(3)),
    lowConfidenceCount,
    typeDistribution,
    confidenceDistribution,
    decayCurve,
    recentAudit: audit.slice(0, 20) as AuditEntry[],
    accessPatterns,
  };
}

// Generate demo data when Supabase has no memory data
function generateDemoStats(): MemoryStats {
  return {
    totalMemories: 247,
    activeMemories: 218,
    expiredMemories: 29,
    avgConfidence: 0.742,
    lowConfidenceCount: 14,
    typeDistribution: [
      { type: 'knowledge', count: 82 },
      { type: 'fact', count: 56 },
      { type: 'preference', count: 34 },
      { type: 'episode', count: 22 },
      { type: 'procedure', count: 16 },
      { type: 'profile', count: 8 },
    ],
    confidenceDistribution: [
      { range: '0.0-0.2', count: 8 },
      { range: '0.2-0.4', count: 14 },
      { range: '0.4-0.6', count: 31 },
      { range: '0.6-0.8', count: 67 },
      { range: '0.8-1.0', count: 98 },
    ],
    decayCurve: Array.from({ length: 13 }, (_, i) => {
      const day = i * 30;
      return { day, confidence: Number((90 / (90 + day)).toFixed(3)) };
    }),
    recentAudit: [
      { id: '1', operation: 'store', agent_id: 'compliance-agent', memory_id: 'mem-1', reason: null, created_at: new Date().toISOString(), metadata: { memory_type: 'knowledge' } },
      { id: '2', operation: 'supersede', agent_id: 'carbon-agent', memory_id: 'mem-2', reason: 'temporal_supersede', created_at: new Date(Date.now() - 3600000).toISOString(), metadata: { confidence_delta: 0.15 } },
      { id: '3', operation: 'forget', agent_id: 'system', memory_id: 'mem-3', reason: 'confidence_decay', created_at: new Date(Date.now() - 7200000).toISOString(), metadata: {} },
      { id: '4', operation: 'extract', agent_id: 'sitesense-agent', memory_id: null, reason: null, created_at: new Date(Date.now() - 10800000).toISOString(), metadata: { facts_extracted: 3 } },
      { id: '5', operation: 'store', agent_id: 'lead-agent', memory_id: 'mem-5', reason: null, created_at: new Date(Date.now() - 14400000).toISOString(), metadata: { memory_type: 'preference' } },
    ],
    accessPatterns: [
      { date: 'Mon', stores: 12, recalls: 34, forgets: 2 },
      { date: 'Tue', stores: 8, recalls: 28, forgets: 1 },
      { date: 'Wed', stores: 15, recalls: 41, forgets: 3 },
      { date: 'Thu', stores: 11, recalls: 36, forgets: 0 },
      { date: 'Fri', stores: 9, recalls: 22, forgets: 4 },
      { date: 'Sat', stores: 3, recalls: 8, forgets: 0 },
      { date: 'Sun', stores: 2, recalls: 5, forgets: 1 },
    ],
  };
}

// ============ MAIN COMPONENT ============

export function MemoryDashboard() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadStats = useCallback(async () => {
    setLoading(true);
    const data = await fetchMemoryStats();
    // Fall back to demo data if DB is empty
    if (data.totalMemories === 0 && data.recentAudit.length === 0) {
      setStats(generateDemoStats());
    } else {
      setStats(data);
    }
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [loadStats]);

  if (loading || !stats) {
    return <MemoryLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Memory</h2>
          <p className="text-sm text-fg-muted mt-1">
            Confidence decay, audit trail, and memory health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-fg-muted">
            Updated {lastRefresh.toLocaleTimeString()}
          </span>
          <button onClick={loadStats} className="btn-secondary text-sm">
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Memories"
          value={stats.totalMemories.toLocaleString()}
          detail={`${stats.activeMemories} active`}
          color="primary"
        />
        <StatCard
          label="Avg Confidence"
          value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
          detail={stats.avgConfidence >= 0.7 ? 'Healthy' : 'Needs attention'}
          color={stats.avgConfidence >= 0.7 ? 'success' : 'warning'}
        />
        <StatCard
          label="Expired"
          value={stats.expiredMemories.toLocaleString()}
          detail="Soft-deleted"
          color="muted"
        />
        <StatCard
          label="Low Confidence"
          value={stats.lowConfidenceCount.toLocaleString()}
          detail="Below 0.3 threshold"
          color={stats.lowConfidenceCount > 20 ? 'danger' : 'info'}
        />
      </div>

      {/* Charts Row 1: Decay Curve + Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DecayCurveChart data={stats.decayCurve} />
        <TypeDistributionChart data={stats.typeDistribution} />
      </div>

      {/* Charts Row 2: Confidence Histogram + Access Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceHistogram data={stats.confidenceDistribution} />
        <AccessPatternsChart data={stats.accessPatterns} />
      </div>

      {/* Audit Trail */}
      <AuditTrailTable entries={stats.recentAudit} />
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function StatCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  color: keyof typeof CHART_COLORS;
}) {
  const colorMap = {
    primary: 'border-sky-200 bg-sky-50',
    secondary: 'border-violet-200 bg-violet-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-red-200 bg-red-50',
    info: 'border-cyan-200 bg-cyan-50',
    muted: 'border-border bg-background',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-sm text-fg-muted">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
      <p className="text-xs text-fg-muted mt-1">{detail}</p>
    </div>
  );
}

function DecayCurveChart({ data }: { data: MemoryStats['decayCurve'] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-1">Confidence Decay Curve</h3>
      <p className="text-xs text-fg-muted mb-4">
        Exponential decay: halfLife=90 days. c(t) = halfLife / (halfLife + t)
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(d: number) => `${d}d`}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            domain={[0, 1]}
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number | string | undefined) =>
              typeof value === 'number'
                ? [`${(value * 100).toFixed(1)}%`, 'Confidence']
                : [String(value ?? '0'), 'Confidence']
            }
            labelFormatter={(label: unknown) => `Day ${String(label ?? '')}`}
          />
          <Area
            type="monotone"
            dataKey="confidence"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#decayGrad)"
            name="Confidence"
          />
          {/* Threshold line at 0.1 (auto-forget) */}
          <Line
            type="monotone"
            dataKey={() => 0.1}
            stroke={CHART_COLORS.danger}
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="Auto-forget threshold"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TypeDistributionChart({ data }: { data: MemoryStats['typeDistribution'] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Memory Type Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            label={({ payload }) => `${payload.type}: ${payload.count}`}
          >
            {data.map((entry) => (
              <Cell
                key={entry.type}
                fill={TYPE_COLORS[entry.type] || CHART_COLORS.muted}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string | undefined, name: string | undefined) => [
              `${String(value ?? 0)} memories`,
              name ?? 'Value',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[item.type] || CHART_COLORS.muted }}
            />
            <span className="text-xs text-fg-muted">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceHistogram({ data }: { data: MemoryStats['confidenceDistribution'] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Confidence Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number | string | undefined) => [`${String(value ?? 0)} memories`, 'Count']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={
                  i === 0 ? CHART_COLORS.danger
                    : i === 1 ? CHART_COLORS.warning
                    : i === 2 ? CHART_COLORS.info
                    : i === 3 ? CHART_COLORS.primary
                    : CHART_COLORS.success
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-fg-muted text-center mt-2">
        Memories below 0.1 are auto-forgotten by decay scheduler
      </p>
    </div>
  );
}

function AccessPatternsChart({ data }: { data: MemoryStats['accessPatterns'] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Memory Operations (7 days)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="stores" fill={CHART_COLORS.success} name="Stores" radius={[2, 2, 0, 0]} />
          <Bar dataKey="recalls" fill={CHART_COLORS.primary} name="Recalls" radius={[2, 2, 0, 0]} />
          <Bar dataKey="forgets" fill={CHART_COLORS.danger} name="Forgets" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AuditTrailTable({ entries }: { entries: AuditEntry[] }) {
  const opBadge = (op: string) => {
    const colors: Record<string, string> = {
      store: 'bg-green-100 text-green-800',
      supersede: 'bg-amber-100 text-amber-800',
      forget: 'bg-red-100 text-red-800',
      extract: 'bg-violet-100 text-violet-800',
    };
    return colors[op] || 'bg-border text-foreground';
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Audit Trail</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-fg-muted text-center py-8">No audit entries yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-fg-muted font-medium">Time</th>
                <th className="text-left py-2 px-3 text-fg-muted font-medium">Operation</th>
                <th className="text-left py-2 px-3 text-fg-muted font-medium">Agent</th>
                <th className="text-left py-2 px-3 text-fg-muted font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0">
                  <td className="py-2 px-3 text-fg-muted whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString('en', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${opBadge(entry.operation)}`}>
                      {entry.operation}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-foreground font-mono text-xs">
                    {entry.agent_id}
                  </td>
                  <td className="py-2 px-3 text-fg-muted text-xs truncate max-w-[200px]">
                    {entry.reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MemoryLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-3 bg-fg-muted/20 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-fg-muted/20 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-fg-muted/20 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-fg-muted/20 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-fg-muted/20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
