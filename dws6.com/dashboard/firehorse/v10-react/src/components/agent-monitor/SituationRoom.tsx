/**
 * Situation Room View
 * Executive overview with large metrics, alert panels,
 * team activity timeline, and critical status indicators.
 */

import type { MonitorAgent, SystemHealth, AgentActivity } from './types';

interface SituationRoomProps {
  agents: MonitorAgent[];
  health: SystemHealth;
  activities: AgentActivity[];
}

function BigMetric({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-fg-muted/10/60 border border-border/50 rounded-lg p-4 text-center">
      <div className="text-[10px] text-fg-muted uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-bold font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-[10px] text-fg-muted mt-1">{sub}</div>}
    </div>
  );
}

function TeamRoster({ agents }: { agents: MonitorAgent[] }) {
  return (
    <div className="bg-fg-muted/10/60 border border-border/50 rounded-lg p-4">
      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">Team Roster</h4>
      <div className="space-y-2">
        {agents.map(agent => {
          const statusColor: Record<string, string> = {
            working: 'text-green-400',
            idle: 'text-yellow-400',
            break: 'text-orange-400',
            offline: 'text-fg-muted',
            alert: 'text-red-400',
          };

          const statusBg: Record<string, string> = {
            working: 'bg-green-400',
            idle: 'bg-yellow-400',
            break: 'bg-orange-400',
            offline: 'bg-fg-muted',
            alert: 'bg-red-400',
          };

          return (
            <div key={agent.id} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: agent.avatar.color }}
                  >
                    {agent.avatar.initials}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-border ${statusBg[agent.status]} ${agent.status === 'working' ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{agent.name}</div>
                  <div className="text-[9px] text-fg-muted capitalize">{agent.role.replace('-', ' ')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-medium capitalize ${statusColor[agent.status]}`}>
                  {agent.status}
                </div>
                {agent.currentTask && (
                  <div className="text-[9px] text-fg-muted max-w-[120px] truncate">{agent.currentTask.title}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertPanel({ activities }: { activities: AgentActivity[] }) {
  const alerts = activities.filter(a => a.severity !== 'info');
  const criticals = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');

  return (
    <div className="bg-fg-muted/10/60 border border-border/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Active Alerts</h4>
        <div className="flex items-center gap-2">
          {criticals.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-red-900/40 text-red-400 rounded">
              {criticals.length} CRITICAL
            </span>
          )}
          {warnings.length > 0 && (
            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-yellow-900/40 text-yellow-400 rounded">
              {warnings.length} WARNING
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-green-400 text-lg mb-1">All Clear</div>
          <div className="text-[10px] text-fg-muted">No active alerts</div>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-lg border ${
                alert.severity === 'critical'
                  ? 'bg-red-950/30 border-red-800/40'
                  : 'bg-yellow-950/30 border-yellow-800/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`text-[11px] font-medium leading-tight ${
                    alert.severity === 'critical' ? 'text-red-300' : 'text-yellow-300'
                  }`}>
                    {alert.action}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-fg-muted">
                      {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[9px] text-fg-muted">
                      Agent: {alert.agentId}
                    </span>
                  </div>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                  alert.severity === 'critical' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Timeline({ activities }: { activities: AgentActivity[] }) {
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
    <div className="bg-fg-muted/10/60 border border-border/50 rounded-lg p-4">
      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">Activity Timeline</h4>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-fg-muted/20" />

        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 pl-1">
              {/* Timeline dot */}
              <div className="relative z-10">
                <div
                  className="w-2.5 h-2.5 rounded-full border-2 border-border mt-1"
                  style={{ backgroundColor: agentColors[activity.agentId] || '#6b7280' }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-fg-muted leading-tight">{activity.action}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-fg-muted font-mono">
                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[9px] font-medium" style={{ color: agentColors[activity.agentId] || '#6b7280' }}>
                    {activity.agentId}
                  </span>
                  {activity.severity !== 'info' && (
                    <span className={`text-[8px] px-1 py-0.5 rounded ${
                      activity.severity === 'critical' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {activity.severity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SituationRoom({ agents, health, activities }: SituationRoomProps) {
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgCpu = Math.round(agents.reduce((s, a) => s + a.cpu, 0) / agents.length);
  const healthColor = health.overallStatus === 'healthy' ? '#22c55e' : health.overallStatus === 'degraded' ? '#eab308' : '#ef4444';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      {/* Situation room header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: healthColor }} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Situation Room</h3>
          <span className="text-[10px] text-fg-muted font-mono">
            {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-fg-muted uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Big metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <BigMetric
          label="Active Agents"
          value={`${health.activeAgents}/${health.totalAgents}`}
          sub="currently working"
          color="#22c55e"
        />
        <BigMetric
          label="Tasks Completed"
          value={totalTasks.toLocaleString()}
          sub="all-time total"
          color="#3b82f6"
        />
        <BigMetric
          label="Avg CPU Load"
          value={`${avgCpu}%`}
          sub="across all agents"
          color={avgCpu > 70 ? '#f59e0b' : '#22c55e'}
        />
        <BigMetric
          label="Alerts"
          value={health.alertCount.toString()}
          sub={health.overallStatus === 'healthy' ? 'non-critical' : 'requires attention'}
          color={health.alertCount > 3 ? '#ef4444' : '#f59e0b'}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Team roster */}
        <TeamRoster agents={agents} />

        {/* Center: Alert panel */}
        <AlertPanel activities={activities} />

        {/* Right: Timeline */}
        <Timeline activities={activities} />
      </div>
    </div>
  );
}
