/**
 * Control Room View
 * NOC-style monitoring grid with real-time agent status panels,
 * activity feed, and system health indicators.
 */

import type { MonitorAgent, SystemHealth, AgentActivity } from './types';

interface ControlRoomProps {
  agents: MonitorAgent[];
  health: SystemHealth;
  activities: AgentActivity[];
}

function HealthBar({ label, value, max, color, unit }: { label: string; value: number; max: number; color: string; unit: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-fg-muted">{label}</span>
        <span className="text-fg-muted font-mono">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-fg-muted/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: MonitorAgent }) {
  const statusConfig: Record<string, { bg: string; dot: string; text: string }> = {
    working: { bg: 'border-green-500/30', dot: 'bg-green-400 animate-pulse', text: 'text-green-400' },
    idle: { bg: 'border-yellow-500/30', dot: 'bg-yellow-400', text: 'text-yellow-400' },
    break: { bg: 'border-orange-500/30', dot: 'bg-orange-400', text: 'text-orange-400' },
    offline: { bg: 'border-border', dot: 'bg-fg-muted', text: 'text-fg-muted' },
    alert: { bg: 'border-red-500/30', dot: 'bg-red-400 animate-pulse', text: 'text-red-400' },
  };

  const cfg = statusConfig[agent.status];

  return (
    <div className={`bg-fg-muted/10/80 border ${cfg.bg} rounded-lg p-3 hover:bg-fg-muted/10 transition-colors`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ backgroundColor: agent.avatar.color }}
          >
            {agent.avatar.initials}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{agent.name}</div>
            <div className="text-[10px] text-fg-muted capitalize">{agent.role.replace('-', ' ')}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-[10px] font-medium capitalize ${cfg.text}`}>{agent.status}</span>
        </div>
      </div>

      {/* Current task */}
      {agent.currentTask ? (
        <div className="mb-2">
          <div className="text-[10px] text-fg-muted truncate mb-1">{agent.currentTask.title}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-fg-muted/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${agent.currentTask.progress}%`, backgroundColor: agent.avatar.color }}
              />
            </div>
            <span className="text-[10px] text-fg-muted font-mono w-8 text-right">{agent.currentTask.progress}%</span>
          </div>
        </div>
      ) : (
        <div className="mb-2 text-[10px] text-fg-muted italic">No active task</div>
      )}

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-1">
        <div className="text-center">
          <div className="text-[9px] text-fg-muted">CPU</div>
          <div className={`text-[11px] font-mono font-bold ${agent.cpu > 80 ? 'text-red-400' : agent.cpu > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
            {agent.cpu}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-fg-muted">MEM</div>
          <div className={`text-[11px] font-mono font-bold ${agent.memory > 80 ? 'text-red-400' : agent.memory > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
            {agent.memory}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-fg-muted">Tasks</div>
          <div className="text-[11px] font-mono font-bold text-fg-muted">{agent.tasksCompleted}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-fg-muted">Up</div>
          <div className="text-[11px] font-mono font-bold text-fg-muted">{agent.uptime}h</div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: AgentActivity[] }) {
  const agentColors: Record<string, string> = {
    sitesense: '#10b981',
    schedulegenius: '#3b82f6',
    materialoracle: '#f59e0b',
    customersat: '#a855f7',
    viability: '#f43f5e',
    compliancebot: '#06b6d4',
    carbontracker: '#22c55e',
    datasentinel: '#64748b',
  };

  return (
    <div className="bg-fg-muted/10/80 border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Live Activity Feed</h4>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-fg-muted">LIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-2 py-1 border-b border-border/50 last:border-0">
            <div
              className="w-1 h-1 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: agentColors[activity.agentId] || '#6b7280' }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-fg-muted leading-tight truncate">{activity.action}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-fg-muted">
                  {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {activity.severity !== 'info' && (
                  <span className={`text-[8px] px-1 py-0.5 rounded ${
                    activity.severity === 'critical' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {activity.severity.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ControlRoom({ agents, health, activities }: ControlRoomProps) {
  const healthColor = health.overallStatus === 'healthy' ? '#22c55e' : health.overallStatus === 'degraded' ? '#eab308' : '#ef4444';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      {/* System health banner */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: healthColor }} />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">System Status</h3>
          </div>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded capitalize"
            style={{
              backgroundColor: `${healthColor}20`,
              color: healthColor,
            }}
          >
            {health.overallStatus}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white font-mono">{health.activeAgents}/{health.totalAgents}</div>
            <div className="text-[9px] text-fg-muted uppercase">Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white font-mono">{health.alertCount}</div>
            <div className="text-[9px] text-fg-muted uppercase">Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white font-mono">{health.tasksThroughput}</div>
            <div className="text-[9px] text-fg-muted uppercase">Tasks/hr</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white font-mono">{health.avgResponseTime}ms</div>
            <div className="text-[9px] text-fg-muted uppercase">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agent cards — 2 columns on left */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* System resources */}
          <div className="bg-fg-muted/10/80 border border-border rounded-lg p-3">
            <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">System Resources</h4>
            <div className="space-y-3">
              <HealthBar label="Avg CPU Load" value={Math.round(agents.reduce((s, a) => s + a.cpu, 0) / agents.length)} max={100} color="#3b82f6" unit="%" />
              <HealthBar label="Avg Memory" value={Math.round(agents.reduce((s, a) => s + a.memory, 0) / agents.length)} max={100} color="#a855f7" unit="%" />
              <HealthBar label="Throughput" value={health.tasksThroughput} max={200} color="#22c55e" unit="/hr" />
              <HealthBar label="Response Time" value={health.avgResponseTime} max={1000} color="#f59e0b" unit="ms" />
            </div>
          </div>

          {/* Activity feed */}
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
