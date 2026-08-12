/**
 * Quick Actions Widget
 * One-click agent actions for the dashboard.
 * MVP Feature #3
 */

import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  agent: string;
  icon: string;
  color: string;
  input: Record<string, unknown>;
}

const ACTIONS: QuickAction[] = [
  {
    id: 'compliance-check',
    label: 'Compliance Check',
    description: 'Run CSRD compliance assessment',
    agent: 'compliance',
    icon: '\u2611',
    color: 'from-blue-500 to-blue-700',
    input: { regulation: 'CSRD', industry: 'manufacturing', country: 'FI' },
  },
  {
    id: 'site-safety',
    label: 'Site Safety',
    description: 'Assess construction site safety',
    agent: 'sitesense',
    icon: '\u26D1',
    color: 'from-amber-500 to-orange-600',
    input: { temperature: 15, humidity: 60, wind_speed: 8, worker_count: 25 },
  },
  {
    id: 'carbon-calc',
    label: 'Carbon Estimate',
    description: 'Calculate material emissions',
    agent: 'material-oracle',
    icon: '\u2618',
    color: 'from-green-500 to-emerald-700',
    input: { materials: [{ name: 'Concrete C30/37', quantity: 100, unit: 'm3' }] },
  },
  {
    id: 'seo-audit',
    label: 'SEO Audit',
    description: 'Quick site SEO assessment',
    agent: 'seo-audit',
    icon: '\u{1F50D}',
    color: 'from-purple-500 to-indigo-700',
    input: { url: 'https://dws10.com', depth: 'quick' },
  },
  {
    id: 'memory-stats',
    label: 'Memory Health',
    description: 'Check agent memory status',
    agent: 'memory',
    icon: '\u{1F9E0}',
    color: 'from-cyan-500 to-teal-700',
    input: {},
  },
];

interface ActionResult {
  actionId: string;
  loading: boolean;
  data: unknown;
  error: string | null;
}

export function QuickActions() {
  const [results, setResults] = useState<Record<string, ActionResult>>({});

  const runAction = useCallback(async (action: QuickAction) => {
    setResults((prev) => ({
      ...prev,
      [action.id]: { actionId: action.id, loading: true, data: null, error: null },
    }));

    try {
      const isMemoryAction = action.agent === 'memory';
      const endpoint = isMemoryAction
        ? `${API_BASE}/api/v1/memory/stats`
        : `${API_BASE}/api/agents/${action.agent}/execute`;
      const res = await fetch(endpoint, {
        method: isMemoryAction ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(isMemoryAction ? {} : { body: JSON.stringify({ input: action.input }) }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setResults((prev) => ({
        ...prev,
        [action.id]: { actionId: action.id, loading: false, data, error: null },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed';
      setResults((prev) => ({
        ...prev,
        [action.id]: { actionId: action.id, loading: false, data: null, error: message },
      }));
    }
  }, []);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {ACTIONS.map((action) => {
          const result = results[action.id];
          const isLoading = result?.loading;

          return (
            <button
              key={action.id}
              onClick={() => runAction(action)}
              disabled={isLoading}
              className={`relative text-left p-3 rounded-lg bg-gradient-to-br ${action.color}
                text-white transition-all hover:opacity-90 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-wait`}
            >
              <span className="text-lg">{action.icon}</span>
              <p className="text-xs font-semibold mt-1">{action.label}</p>
              <p className="text-[10px] opacity-80">{action.description}</p>
              {isLoading && (
                <span className="absolute top-2 right-2 w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {result?.error && (
                <span className="absolute top-2 right-2 text-xs bg-red-800/80 px-1.5 py-0.5 rounded">
                  offline
                </span>
              )}
              {!!result?.data && !isLoading && (
                <span className="absolute top-2 right-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                  done
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
