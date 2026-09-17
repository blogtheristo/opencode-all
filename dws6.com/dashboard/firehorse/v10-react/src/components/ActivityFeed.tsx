/**
 * Activity Feed Widget
 * Shows recent platform events and agent activity.
 * MVP Feature #4
 */

import { useState, useEffect } from 'react';

interface ActivityItem {
  id: string;
  type: 'agent_run' | 'compliance' | 'report' | 'login' | 'alert';
  title: string;
  detail?: string;
  timestamp: Date;
}

const TYPE_CONFIG: Record<ActivityItem['type'], { icon: string; color: string }> = {
  agent_run: { icon: '\u2699', color: 'bg-blue-100 text-blue-700' },
  compliance: { icon: '\u2611', color: 'bg-green-100 text-green-700' },
  report: { icon: '\u{1F4C4}', color: 'bg-purple-100 text-purple-700' },
  login: { icon: '\u{1F464}', color: 'bg-border text-fg-muted' },
  alert: { icon: '\u26A0', color: 'bg-amber-100 text-amber-700' },
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Seed data — replaced by real events once API is connected
function generateSeedActivity(): ActivityItem[] {
  const now = Date.now();
  return [
    {
      id: '1',
      type: 'agent_run',
      title: 'SiteSense agent completed',
      detail: 'Safety score: 87/100 — Helsinki site',
      timestamp: new Date(now - 5 * 60_000),
    },
    {
      id: '2',
      type: 'compliance',
      title: 'CSRD compliance check passed',
      detail: 'Score: 78/100 — 3 recommendations',
      timestamp: new Date(now - 22 * 60_000),
    },
    {
      id: '3',
      type: 'report',
      title: 'Carbon footprint report generated',
      detail: 'Q1 2026 — 12,450 kgCO2e total',
      timestamp: new Date(now - 2 * 3600_000),
    },
    {
      id: '4',
      type: 'alert',
      title: 'ETS threshold warning',
      detail: 'Emissions at 89% of annual allowance',
      timestamp: new Date(now - 5 * 3600_000),
    },
    {
      id: '5',
      type: 'login',
      title: 'Session started',
      detail: 'Web dashboard — Chrome',
      timestamp: new Date(now - 8 * 3600_000),
    },
  ];
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    setActivities(generateSeedActivity());
    // Re-render time-ago labels every minute
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <span className="text-xs text-fg-muted">{activities.length} events</span>
      </div>

      <div className="space-y-1">
        {activities.map((item, idx) => {
          const config = TYPE_CONFIG[item.type];
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-2 ${
                idx < activities.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs shrink-0 ${config.color}`}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{item.title}</p>
                {item.detail && (
                  <p className="text-xs text-fg-muted truncate">{item.detail}</p>
                )}
              </div>
              <span className="text-xs text-fg-muted shrink-0 whitespace-nowrap">
                {timeAgo(item.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
