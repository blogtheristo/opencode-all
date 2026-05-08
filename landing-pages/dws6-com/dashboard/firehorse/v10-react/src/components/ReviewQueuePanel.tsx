/**
 * Review Queue Panel — Human-in-the-Loop Escalation UI
 *
 * Shows agents outputs that require human review before they take effect.
 * Covers: financial decisions, legal text, customer-facing outputs, low-confidence runs.
 *
 * Connects to: review_queue Supabase table (migration 065)
 * API: GET /api/v1/agents/review-queue   (pending items)
 *      POST /api/v1/agents/review-queue/:id/approve
 *      POST /api/v1/agents/review-queue/:id/reject
 *      POST /api/v1/agents/review-queue/:id/override
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'overridden';
type ReviewCategory = 'financial' | 'legal' | 'customer' | 'low_confidence' | 'governance';

interface ReviewItem {
  id: string;
  agent_name: string;
  category: ReviewCategory;
  input_summary: string | null;
  output_summary: string | null;
  confidence: number | null;
  reason: string | null;
  status: ReviewStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface QueueResponse {
  items: ReviewItem[];
  total: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<ReviewCategory, { label: string; color: string }> = {
  financial: { label: 'Financial', color: 'bg-amber-500/20 text-amber-400' },
  legal: { label: 'Legal', color: 'bg-red-500/20 text-red-400' },
  customer: { label: 'Customer', color: 'bg-blue-500/20 text-blue-400' },
  low_confidence: { label: 'Low confidence', color: 'bg-gray-500/20 text-gray-400' },
  governance: { label: 'Governance', color: 'bg-purple-500/20 text-purple-400' },
};

const STATUS_CONFIG: Record<ReviewStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400' },
  approved: { label: 'Approved', color: 'text-green-400' },
  rejected: { label: 'Rejected', color: 'text-red-400' },
  overridden: { label: 'Overridden', color: 'text-blue-400' },
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: ReviewCategory }) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.low_confidence;
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[10px] text-gray-600">—</span>;
  const pct = Math.round(value * 100);
  const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 bg-gray-800 rounded-full h-1">
        <div className={`h-1 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-gray-400">{pct}%</span>
    </div>
  );
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Action buttons ───────────────────────────────────────────────────────────

interface ActionButtonsProps {
  item: ReviewItem;
  onAction: (id: string, action: 'approve' | 'reject') => Promise<void>;
  busy: boolean;
}

function ActionButtons({ item, onAction, busy }: ActionButtonsProps) {
  if (item.status !== 'pending') {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <span className={`text-[11px] font-medium ${cfg.color}`}>
        {cfg.label}
        {item.reviewed_at && (
          <span className="text-gray-600 ml-1">· {timeAgo(item.reviewed_at)}</span>
        )}
      </span>
    );
  }

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        disabled={busy}
        onClick={() => onAction(item.id, 'approve')}
        className="px-2.5 py-1 text-[11px] font-medium bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded transition-colors"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAction(item.id, 'reject')}
        className="px-2.5 py-1 text-[11px] font-medium bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded transition-colors"
      >
        Reject
      </button>
    </div>
  );
}

// ─── Queue item row ───────────────────────────────────────────────────────────

interface QueueRowProps {
  item: ReviewItem;
  expanded: boolean;
  onToggle: () => void;
  onAction: (id: string, action: 'approve' | 'reject') => Promise<void>;
  busy: boolean;
}

function QueueRow({ item, expanded, onToggle, onAction, busy }: QueueRowProps) {
  return (
    <div
      className={`border rounded-lg transition-colors ${
        item.status === 'pending'
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-gray-800 bg-gray-900/50'
      }`}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <div
          className="shrink-0 w-1.5 h-1.5 rounded-full mt-0.5 bg-current
          ${item.status === 'pending' ? 'text-amber-400' : 'text-gray-600'}"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-gray-200">{item.agent_name}</span>
            <CategoryBadge category={item.category} />
          </div>
          <p className="text-[11px] text-gray-500 truncate">
            {item.reason ?? item.input_summary ?? 'No summary'}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <ConfidenceBar value={item.confidence} />
          <span className="text-[10px] text-gray-600">{timeAgo(item.created_at)}</span>
        </div>
        <span className="shrink-0 text-gray-600 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-800/60 pt-2.5 space-y-2.5">
          {item.input_summary && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Input</p>
              <p className="text-xs text-gray-300 bg-gray-800/50 rounded px-2 py-1.5 font-mono leading-relaxed">
                {item.input_summary}
              </p>
            </div>
          )}
          {item.output_summary && (
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Agent Output
              </p>
              <p className="text-xs text-gray-300 bg-gray-800/50 rounded px-2 py-1.5 font-mono leading-relaxed">
                {item.output_summary}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-600">ID: {item.id.slice(0, 8)}</span>
            <ActionButtons item={item} onAction={onAction} busy={busy} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = 'pending' | 'all';

function FilterTabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            active ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 text-gray-300'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function ReviewQueuePanel() {
  const { execute } = useApi<QueueResponse>();
  const { execute: executeAction } = useApi<{ ok: boolean }>();

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await execute('/api/v1/agents/review-queue?limit=50');
    if (result?.items) setItems(result.items);
    setLoading(false);
  }, [execute]);

  useEffect(() => {
    load();
    // Refresh every 60s so new escalations appear without page reload
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleAction = useCallback(
    async (id: string, action: 'approve' | 'reject') => {
      setBusyId(id);
      await executeAction(`/api/v1/agents/review-queue/${id}/${action}`, { method: 'POST' });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: action === 'approve' ? 'approved' : 'rejected',
                reviewed_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setBusyId(null);
    },
    [executeAction],
  );

  const displayed = filter === 'pending' ? items.filter((i) => i.status === 'pending') : items;

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  if (loading && items.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">Review Queue</h3>
          <p className="text-[10px] text-gray-500">
            Human oversight — financial · legal · customer
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-3 p-0.5 bg-gray-800/50 rounded-lg">
        <FilterTabButton
          active={filter === 'pending'}
          label="Pending"
          count={pendingCount}
          onClick={() => setFilter('pending')}
        />
        <FilterTabButton active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
      </div>

      {/* Queue list */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
        {displayed.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              {filter === 'pending' ? 'No pending items' : 'No review items yet'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Agent outputs flagged for financial, legal, or customer impact appear here
            </p>
          </div>
        ) : (
          displayed.map((item) => (
            <QueueRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
              onAction={handleAction}
              busy={busyId === item.id}
            />
          ))
        )}
      </div>

      {/* Footer */}
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
