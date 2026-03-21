/**
 * Compliance Score Widget — MVP Feature
 * Animated ring chart showing real-time compliance score,
 * regulation breakdown, trend indicator, and one-click assessment trigger.
 * Mobile-responsive, touch-friendly.
 */

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

interface RegulationScore {
  id: string;
  name: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  gaps: number;
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
}

// SVG ring chart — animated arc
function ScoreRing({ score, size = 160, strokeWidth = 12 }: { score: number; size?: number; strokeWidth?: number }) {
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
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-gray-800"
        strokeWidth={strokeWidth}
      />
      {/* Score ring */}
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

interface ComplianceScoreWidgetProps {
  onRunAssessment?: () => void;
}

export function ComplianceScoreWidget({ onRunAssessment }: ComplianceScoreWidgetProps) {
  const { execute, loading } = useApi<ComplianceOverview>();
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const loadCompliance = useCallback(async () => {
    const result = await execute('/api/v1/compliance/overview');
    if (result) {
      setOverview(result);
    }
  }, [execute]);

  useEffect(() => {
    loadCompliance();
  }, [loadCompliance]);

  // Animate score counter on load
  useEffect(() => {
    if (!overview) return;
    const target = overview.overallScore;
    const duration = 1000;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [overview]);

  if (loading && !overview) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="flex justify-center mb-4">
          <div className="w-40 h-40 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">No compliance data available</p>
        <button
          type="button"
          onClick={onRunAssessment}
          className="mt-3 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Run First Assessment
        </button>
      </div>
    );
  }

  const trend = overview.overallScore - overview.previousScore;
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const daysSinceAssessment = Math.floor(
    (Date.now() - new Date(overview.lastAssessment).getTime()) / 86400000,
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Compliance Score</h3>
          <p className="text-xs text-gray-500">
            {daysSinceAssessment === 0
              ? 'Updated today'
              : `${daysSinceAssessment}d ago`}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <span>{trendIcon}</span>
          <span>{Math.abs(trend)}pts</span>
        </div>
      </div>

      {/* Score Ring */}
      <div className="relative flex justify-center mb-4">
        <ScoreRing score={overview.overallScore} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{animatedScore}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Gap summary */}
      <div className="flex justify-center gap-4 mb-4 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900">{overview.totalGaps}</p>
          <p className="text-xs text-gray-500">Total Gaps</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div>
          <p className="text-lg font-bold text-red-500">{overview.criticalGaps}</p>
          <p className="text-xs text-gray-500">Critical</p>
        </div>
      </div>

      {/* Regulation breakdown */}
      <div className="space-y-2 mb-4">
        {overview.regulations.map(reg => (
          <div key={reg.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-gray-700 w-16 shrink-0">{reg.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    reg.score >= 80 ? 'bg-green-500' :
                    reg.score >= 60 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${reg.score}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right shrink-0">{reg.score}</span>
            </div>
            <StatusBadge status={reg.status} />
          </div>
        ))}
      </div>

      {/* Data source indicator */}
      {overview.dataSource && (
        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 bg-gray-50 rounded-lg">
          <span className={`w-2 h-2 rounded-full ${overview.dataSource === 'database' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-xs text-gray-600">
            {overview.dataSource === 'database'
              ? 'Live company data'
              : `Sector benchmark (${overview.benchmark?.sector || 'manufacturing'})`}
          </span>
          {overview.benchmark?.emissionsVsSector && overview.dataSource === 'database' && (
            <span className="ml-auto text-xs text-gray-500">
              Emissions: {overview.benchmark.emissionsVsSector}
            </span>
          )}
        </div>
      )}

      {/* Action button */}
      <button
        type="button"
        onClick={onRunAssessment}
        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Run New Assessment
      </button>
    </div>
  );
}
