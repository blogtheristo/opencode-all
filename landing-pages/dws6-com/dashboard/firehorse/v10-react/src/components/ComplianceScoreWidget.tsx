/**
 * Compliance Score Widget — Enhanced V2
 *
 * Multi-panel compliance dashboard inspired by NCC Building Nordics requirements.
 * Features: animated score ring, regulatory timeline, EN 15978 lifecycle breakdown,
 * cost waterfall, multi-jurisdiction tabs, and EPBD/ETS2/Fit for 55 coverage.
 *
 * Code-Version: 2.0
 * Introduced-In: PR-TBD (claude/enhance-compliance-calculator)
 * Date: 2026-04-02
 * Owner: Lifetime Oy
 */

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

// ============ TYPES ============

interface RegulationScore {
  id: string;
  name: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  gaps: number;
}

interface CostBreakdown {
  etsCostEur: number;
  cbamCostEur: number;
  csrdReportingCostEur: number;
  ets2CostEur?: number;
  epbdCostEur?: number;
  totalCostEur: number;
}

interface LifecycleStage {
  stage: string;
  label: string;
  kgCO2e: number;
  kgCO2ePerM2: number;
  percentage: number;
}

interface DeadlineItem {
  regulation: string;
  milestone: string;
  daysRemaining: number;
  urgency: 'overdue' | 'critical' | 'urgent' | 'upcoming' | 'planned';
  countdown: string;
}

interface ComplianceOverview {
  overallScore: number;
  previousScore: number;
  lastAssessment: string;
  regulations: RegulationScore[];
  totalGaps: number;
  criticalGaps: number;
  dataSource?: 'database' | 'benchmark';
  benchmark?: {
    sector: string;
    emissionsVsSector: string;
    csrdVsSector: string;
  };
  costBreakdown?: CostBreakdown;
  lifecycleStages?: LifecycleStage[];
  deadlines?: DeadlineItem[];
  jurisdiction?: string;
  dataQuality?: number;
}

type TabId = 'overview' | 'timeline' | 'lifecycle' | 'costs';

// ============ SUBCOMPONENTS ============

function ScoreRing({ score, size = 140, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#22c55e' :
    score >= 60 ? '#f59e0b' :
    score >= 40 ? '#f97316' :
    '#ef4444';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-foreground"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: RegulationScore['status'] }) {
  const styles = {
    compliant: 'bg-green-500/20 text-green-400',
    partial: 'bg-amber-500/20 text-amber-400',
    'non-compliant': 'bg-red-500/20 text-red-400',
  };
  const labels = {
    compliant: 'OK',
    partial: 'Partial',
    'non-compliant': 'Gaps',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: DeadlineItem['urgency'] }) {
  const styles: Record<string, string> = {
    overdue: 'bg-red-500/20 text-red-400',
    critical: 'bg-red-500/15 text-red-300',
    urgent: 'bg-amber-500/20 text-amber-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    planned: 'bg-background0/20 text-fg-muted',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${styles[urgency]}`}>
      {urgency}
    </span>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        active
          ? 'bg-fg-muted/20 text-white'
          : 'text-fg-muted hover:text-foreground hover:bg-fg-muted/10/50'
      }`}
    >
      {label}
    </button>
  );
}

function DataQualityBar({ quality }: { quality: number }) {
  const color = quality >= 80 ? 'bg-green-500' : quality >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-fg-muted w-16">Data quality</span>
      <div className="flex-1 bg-fg-muted/10 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${quality}%` }}
        />
      </div>
      <span className="text-[10px] text-fg-muted w-8 text-right">{quality}%</span>
    </div>
  );
}

// ============ TAB PANELS ============

function OverviewPanel({
  overview,
  animatedScore,
}: {
  overview: ComplianceOverview;
  animatedScore: number;
}) {
  const trend = overview.overallScore - overview.previousScore;
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-fg-muted';
  const trendIcon = trend > 0 ? '+' : '';

  return (
    <>
      {/* Score + Gaps row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Ring */}
        <div className="relative shrink-0">
          <ScoreRing score={overview.overallScore} size={100} strokeWidth={8} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{animatedScore}</span>
            <span className="text-[10px] text-fg-muted">/ 100</span>
          </div>
        </div>
        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${trendColor}`}>
              {trendIcon}{trend} pts
            </span>
            <span className="text-[10px] text-fg-muted">vs previous</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-fg-muted/10/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-foreground">{overview.totalGaps}</p>
              <p className="text-[10px] text-fg-muted">Gaps</p>
            </div>
            <div className="bg-fg-muted/10/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-red-400">{overview.criticalGaps}</p>
              <p className="text-[10px] text-fg-muted">Critical</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regulation scores */}
      <div className="space-y-1.5 mb-3">
        {overview.regulations.map(reg => (
          <div key={reg.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs font-medium text-fg-muted w-14 shrink-0">{reg.name}</span>
              <div className="flex-1 bg-fg-muted/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    reg.score >= 80 ? 'bg-green-500' :
                    reg.score >= 60 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${reg.score}%` }}
                />
              </div>
              <span className="text-xs text-fg-muted w-7 text-right shrink-0">{reg.score}</span>
            </div>
            <StatusBadge status={reg.status} />
          </div>
        ))}
      </div>

      {/* Data source */}
      {overview.dataSource && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-fg-muted/10/30 rounded-lg mb-3">
          <span className={`w-1.5 h-1.5 rounded-full ${overview.dataSource === 'database' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-[10px] text-fg-muted">
            {overview.dataSource === 'database'
              ? 'Live company data'
              : `Sector benchmark (${overview.benchmark?.sector || 'manufacturing'})`}
          </span>
        </div>
      )}

      {overview.dataQuality !== undefined && (
        <DataQualityBar quality={overview.dataQuality} />
      )}
    </>
  );
}

function TimelinePanel({ deadlines }: { deadlines: DeadlineItem[] }) {
  if (!deadlines || deadlines.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-fg-muted">No deadline data available</p>
        <p className="text-xs text-fg-muted mt-1">Run an assessment to populate the regulatory timeline</p>
      </div>
    );
  }

  // Show future deadlines first, then overdue
  const future = deadlines.filter(d => d.daysRemaining >= 0).slice(0, 6);
  const overdue = deadlines.filter(d => d.daysRemaining < 0).slice(0, 2);
  const display = [...overdue, ...future];

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-fg-muted uppercase tracking-wider mb-2">Regulatory Deadlines</p>
      {display.map((d, i) => (
        <div
          key={i}
          className={`flex items-start justify-between gap-2 px-2 py-1.5 rounded-lg ${
            d.urgency === 'overdue' ? 'bg-red-500/10 border border-red-500/20' :
            d.urgency === 'critical' ? 'bg-red-500/5 border border-red-500/10' :
            'bg-fg-muted/10/30'
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold text-fg-muted">{d.regulation}</span>
              <UrgencyBadge urgency={d.urgency} />
            </div>
            <p className="text-[11px] text-fg-muted truncate">{d.milestone}</p>
          </div>
          <span className={`text-xs font-mono shrink-0 ${
            d.daysRemaining < 0 ? 'text-red-400' :
            d.daysRemaining <= 90 ? 'text-amber-400' :
            'text-fg-muted'
          }`}>
            {d.countdown}
          </span>
        </div>
      ))}
    </div>
  );
}

function LifecyclePanel({ stages }: { stages: LifecycleStage[] }) {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-fg-muted">No lifecycle data</p>
        <p className="text-xs text-fg-muted mt-1">Available for construction projects with EN 15978 assessment</p>
      </div>
    );
  }

  const maxKg = Math.max(...stages.map(s => Math.abs(s.kgCO2e)));

  // Color map for lifecycle stages
  const stageColors: Record<string, string> = {
    'A1-A3': 'bg-blue-500',
    'A4': 'bg-blue-400',
    'A5': 'bg-blue-300',
    'B1-B7': 'bg-amber-500',
    'C1-C4': 'bg-orange-500',
    'D': 'bg-green-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-fg-muted uppercase tracking-wider">EN 15978 Lifecycle</p>
        <p className="text-[10px] text-fg-muted">kgCO2e/m2</p>
      </div>
      {stages.map((s) => {
        const isNegative = s.kgCO2e < 0;
        const barWidth = maxKg > 0 ? (Math.abs(s.kgCO2e) / maxKg) * 100 : 0;
        const color = stageColors[s.stage] || 'bg-background0';

        return (
          <div key={s.stage} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-fg-muted w-12 shrink-0">{s.stage}</span>
            <div className="flex-1 relative h-4">
              <div
                className={`h-4 rounded ${isNegative ? 'bg-green-500/60' : color} transition-all duration-700`}
                style={{ width: `${Math.max(barWidth, 2)}%` }}
              />
            </div>
            <div className="text-right shrink-0 w-16">
              <span className={`text-[11px] font-medium ${isNegative ? 'text-green-400' : 'text-fg-muted'}`}>
                {isNegative ? '' : ''}{s.kgCO2ePerM2}
              </span>
            </div>
            <span className="text-[10px] text-fg-muted w-10 text-right">{s.percentage}%</span>
          </div>
        );
      })}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-fg-muted">A1-A3 = Materials | B = Use | C = End-of-life | D = Recovery</span>
        </div>
      </div>
    </div>
  );
}

function CostsPanel({ costs }: { costs: CostBreakdown | undefined }) {
  if (!costs) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-fg-muted">No cost data available</p>
        <p className="text-xs text-fg-muted mt-1">Run an assessment to see regulatory cost exposure</p>
      </div>
    );
  }

  const items = [
    { label: 'ETS Allowances', value: costs.etsCostEur, color: 'bg-blue-500' },
    { label: 'CBAM Certificates', value: costs.cbamCostEur, color: 'bg-amber-500' },
    { label: 'CSRD Reporting', value: costs.csrdReportingCostEur, color: 'bg-purple-500' },
    ...(costs.ets2CostEur ? [{ label: 'ETS2 Buildings', value: costs.ets2CostEur, color: 'bg-orange-500' }] : []),
    ...(costs.epbdCostEur ? [{ label: 'EPBD Compliance', value: costs.epbdCostEur, color: 'bg-red-500' }] : []),
  ].filter(item => item.value > 0);

  const maxCost = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-fg-muted uppercase tracking-wider">Cost Waterfall (EUR)</p>
        <p className="text-sm font-bold text-foreground">
          {formatEur(costs.totalCostEur)}
        </p>
      </div>

      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[11px] text-fg-muted w-28 shrink-0 truncate">{item.label}</span>
          <div className="flex-1 bg-fg-muted/10 rounded h-3">
            <div
              className={`h-3 rounded ${item.color} transition-all duration-700`}
              style={{ width: `${(item.value / maxCost) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-fg-muted w-20 text-right">
            {formatEur(item.value)}
          </span>
        </div>
      ))}

      <div className="mt-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-fg-muted">Total Regulatory Exposure</span>
          <span className="text-sm font-bold text-amber-400">{formatEur(costs.totalCostEur)}</span>
        </div>
      </div>
    </div>
  );
}

function formatEur(value: number): string {
  if (value >= 1_000_000) return `EUR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `EUR ${(value / 1_000).toFixed(0)}K`;
  return `EUR ${value.toFixed(0)}`;
}

// ============ MAIN WIDGET ============

interface ComplianceScoreWidgetProps {
  onRunAssessment?: () => void;
}

export function ComplianceScoreWidget({ onRunAssessment }: ComplianceScoreWidgetProps) {
  const { execute, loading } = useApi<ComplianceOverview>();
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const loadCompliance = useCallback(async () => {
    const result = await execute('/api/v1/compliance/overview');
    if (result) {
      setOverview(result);
    }
  }, [execute]);

  useEffect(() => {
    loadCompliance();
  }, [loadCompliance]);

  // Animate score counter
  useEffect(() => {
    if (!overview) return;
    const target = overview.overallScore;
    const duration = 1000;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [overview]);

  if (loading && !overview) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-fg-muted/10 rounded w-32 mb-4" />
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-fg-muted/10 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-fg-muted/10 rounded" />
          <div className="h-3 bg-fg-muted/10 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 text-center">
        <p className="text-sm text-fg-muted">No compliance data available</p>
        <p className="text-xs text-fg-muted mt-1">Run your first assessment to see scores, timeline, and cost exposure</p>
        <button
          type="button"
          onClick={onRunAssessment}
          className="mt-3 px-4 py-2 bg-surface hover:bg-border text-foreground text-sm font-medium rounded-lg transition-colors"
        >
          Run First Assessment
        </button>
      </div>
    );
  }

  const daysSinceAssessment = Math.floor(
    (Date.now() - new Date(overview.lastAssessment).getTime()) / 86400000,
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">EU Compliance</h3>
          <p className="text-[10px] text-fg-muted">
            {daysSinceAssessment === 0 ? 'Updated today' : `${daysSinceAssessment}d ago`}
            {overview.jurisdiction && ` | ${overview.jurisdiction}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {overview.regulations.length >= 5 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">
              {overview.regulations.length} regs
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 p-0.5 bg-fg-muted/10/50 rounded-lg">
        <TabButton active={activeTab === 'overview'} label="Score" onClick={() => setActiveTab('overview')} />
        <TabButton active={activeTab === 'timeline'} label="Timeline" onClick={() => setActiveTab('timeline')} />
        <TabButton active={activeTab === 'lifecycle'} label="LCA" onClick={() => setActiveTab('lifecycle')} />
        <TabButton active={activeTab === 'costs'} label="Costs" onClick={() => setActiveTab('costs')} />
      </div>

      {/* Tab content */}
      <div className="min-h-[240px]">
        {activeTab === 'overview' && (
          <OverviewPanel overview={overview} animatedScore={animatedScore} />
        )}
        {activeTab === 'timeline' && (
          <TimelinePanel deadlines={overview.deadlines ?? []} />
        )}
        {activeTab === 'lifecycle' && (
          <LifecyclePanel stages={overview.lifecycleStages ?? []} />
        )}
        {activeTab === 'costs' && (
          <CostsPanel costs={overview.costBreakdown} />
        )}
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={onRunAssessment}
        className="w-full mt-3 py-2 bg-surface hover:bg-border text-foreground text-sm font-medium rounded-lg transition-colors"
      >
        Run New Assessment
      </button>
    </div>
  );
}
