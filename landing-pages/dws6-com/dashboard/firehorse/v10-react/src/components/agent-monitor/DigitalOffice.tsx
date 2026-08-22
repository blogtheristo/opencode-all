/**
 * Digital Office Screen
 * Visual office floor showing agents at their workstations.
 * Each agent has a desk, monitor, and avatar with status indicators.
 */

import { useState } from 'react';
import type { MonitorAgent } from './types';

interface DigitalOfficeProps {
  agents: MonitorAgent[];
}

function Workstation({ agent, onClick }: { agent: MonitorAgent; onClick: (a: MonitorAgent) => void }) {
  const isWorking = agent.status === 'working';
  const isBreak = agent.status === 'break';
  const isOffline = agent.status === 'offline';

  const statusColors: Record<string, string> = {
    working: '#22c55e',
    idle: '#eab308',
    break: '#f97316',
    offline: '#6b7280',
    alert: '#ef4444',
  };

  return (
    <button
      onClick={() => onClick(agent)}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl p-2 transition-transform hover:scale-105"
      aria-label={`${agent.name} — ${agent.status}`}
    >
      {/* Desk surface */}
      <div className="relative w-36 h-28">
        {/* Monitor */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-14 rounded-t-md border-2 border-border overflow-hidden"
          style={{ backgroundColor: isWorking ? '#1e293b' : '#334155' }}
        >
          {/* Screen content */}
          {isWorking ? (
            <div className="p-1 h-full flex flex-col gap-0.5 overflow-hidden">
              {/* Scrolling code lines */}
              <div className="animate-pulse space-y-0.5">
                <div className="h-0.5 bg-green-400/60 rounded" style={{ width: '80%' }} />
                <div className="h-0.5 bg-blue-400/40 rounded" style={{ width: '55%' }} />
                <div className="h-0.5 bg-green-400/60 rounded" style={{ width: '70%' }} />
                <div className="h-0.5 bg-purple-400/40 rounded" style={{ width: '45%' }} />
                <div className="h-0.5 bg-green-400/60 rounded" style={{ width: '90%' }} />
                <div className="h-0.5 bg-cyan-400/40 rounded" style={{ width: '35%' }} />
                <div className="h-0.5 bg-green-400/60 rounded" style={{ width: '65%' }} />
                <div className="h-0.5 bg-amber-400/40 rounded" style={{ width: '50%' }} />
              </div>
              {/* Blinking cursor */}
              <div className="mt-auto">
                <div className="w-1 h-1.5 bg-green-400 animate-[pulse_1s_steps(1)_infinite]" />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {isOffline ? (
                <div className="w-2 h-2 rounded-full bg-background0" />
              ) : (
                <div className="text-[8px] text-fg-muted font-mono">
                  {isBreak ? 'AFK' : 'IDLE'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Monitor stand */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-3 h-3 bg-fg-muted" />
        <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-8 h-1 bg-fg-muted rounded-b" />

        {/* Desk */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-amber-800/80 rounded-sm border border-amber-900/40 shadow-md" />

        {/* Desk legs */}
        <div className="absolute bottom-0 left-[18px] w-1.5 h-6 bg-amber-900/60 rounded-b" />
        <div className="absolute bottom-0 right-[18px] w-1.5 h-6 bg-amber-900/60 rounded-b" />

        {/* Keyboard */}
        {isWorking && (
          <div className="absolute bottom-[26px] left-1/2 -translate-x-1/2 w-12 h-2 bg-fg-muted/20 rounded-sm">
            {/* Typing animation dots */}
            <div className="flex justify-center gap-0.5 pt-0.5">
              <div className="w-0.5 h-0.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '600ms' }} />
              <div className="w-0.5 h-0.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '600ms' }} />
              <div className="w-0.5 h-0.5 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '600ms' }} />
            </div>
          </div>
        )}

        {/* Coffee cup (break) */}
        {isBreak && (
          <div className="absolute bottom-[26px] right-6">
            <div className="w-3 h-3 bg-surface rounded-b-sm border border-border" />
            <div className="text-[6px] leading-none text-fg-muted animate-pulse">~</div>
          </div>
        )}
      </div>

      {/* Agent avatar */}
      <div className="relative -mt-2">
        {/* Avatar body */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all ${isOffline ? 'opacity-40' : ''} ${isWorking ? 'ring-2 ring-offset-2' : ''}`}
          style={{
            backgroundColor: agent.avatar.color,
            ['--tw-ring-color' as string]: isWorking ? agent.avatar.color : undefined,
          }}
        >
          {agent.avatar.initials}
        </div>

        {/* Status indicator dot */}
        <div
          className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${agent.status === 'working' ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: statusColors[agent.status] }}
        />
      </div>

      {/* Name label */}
      <div className="mt-1.5 text-center">
        <div className="text-xs font-semibold text-foreground">{agent.name}</div>
        <div className="text-[10px] text-fg-muted capitalize">{agent.status}</div>
      </div>

      {/* Task progress bar (when working) */}
      {agent.currentTask && (
        <div className="mt-1 w-24">
          <div className="h-1 bg-fg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${agent.currentTask.progress}%`,
                backgroundColor: agent.avatar.color,
              }}
            />
          </div>
          <div className="text-[8px] text-fg-muted text-center mt-0.5">
            {agent.currentTask.progress}%
          </div>
        </div>
      )}
    </button>
  );
}

function AgentDetailPanel({ agent, onClose }: { agent: MonitorAgent; onClose: () => void }) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-xl p-5 w-80">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow"
            style={{ backgroundColor: agent.avatar.color }}
          >
            {agent.avatar.initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
            <p className="text-xs text-fg-muted capitalize">{agent.role.replace('-', ' ')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-fg-muted hover:text-fg-muted text-lg leading-none"
          aria-label="Close detail panel"
        >
          &times;
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-fg-muted">Status:</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          agent.status === 'working' ? 'bg-green-100 text-green-700' :
          agent.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
          agent.status === 'break' ? 'bg-orange-100 text-orange-700' :
          'bg-border text-fg-muted'
        }`}>
          {agent.status}
        </span>
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <div className="mb-3 p-3 bg-background rounded-lg">
          <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide mb-1">Current Task</div>
          <div className="text-xs text-foreground mb-2">{agent.currentTask.title}</div>
          <div className="h-1.5 bg-fg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${agent.currentTask.progress}%`, backgroundColor: agent.avatar.color }}
            />
          </div>
          <div className="text-[10px] text-fg-muted mt-1">{agent.currentTask.progress}% complete</div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-background rounded-lg">
          <div className="text-[10px] text-fg-muted">Tasks Done</div>
          <div className="text-sm font-bold text-foreground">{agent.tasksCompleted.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-background rounded-lg">
          <div className="text-[10px] text-fg-muted">Uptime</div>
          <div className="text-sm font-bold text-foreground">{agent.uptime}h</div>
        </div>
        <div className="p-2 bg-background rounded-lg">
          <div className="text-[10px] text-fg-muted">CPU</div>
          <div className="text-sm font-bold text-foreground">{agent.cpu}%</div>
        </div>
        <div className="p-2 bg-background rounded-lg">
          <div className="text-[10px] text-fg-muted">Memory</div>
          <div className="text-sm font-bold text-foreground">{agent.memory}%</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide mb-2">Recent Activity</div>
        <div className="space-y-1.5">
          {agent.recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start gap-2">
              <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                activity.severity === 'critical' ? 'bg-red-500' :
                activity.severity === 'warning' ? 'bg-yellow-500' :
                'bg-blue-400'
              }`} />
              <div>
                <div className="text-[11px] text-foreground leading-tight">{activity.action}</div>
                <div className="text-[9px] text-fg-muted">
                  {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DigitalOffice({ agents }: DigitalOfficeProps) {
  const [selectedAgent, setSelectedAgent] = useState<MonitorAgent | null>(null);

  const workingCount = agents.filter(a => a.status === 'working').length;

  return (
    <div className="relative">
      {/* Office header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">DWS IQ Office — Floor 1</h3>
          <p className="text-xs text-fg-muted">{workingCount} of {agents.length} agents working</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-fg-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Working</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Idle</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Break</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fg-muted" /> Offline</span>
        </div>
      </div>

      {/* Office floor */}
      <div className="relative bg-gradient-to-b from-border to-background border border-border rounded-xl p-6 min-h-[480px]">
        {/* Floor grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-xl"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, transparent 1px, transparent 40px)',
          }}
        />

        {/* Room labels */}
        <div className="absolute top-3 left-4 text-[10px] font-medium text-fg-muted uppercase tracking-widest">
          Agent Workspace
        </div>

        {/* Workstations grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center pt-4">
          {agents.map(agent => (
            <Workstation
              key={agent.id}
              agent={agent}
              onClick={setSelectedAgent}
            />
          ))}
        </div>

        {/* Water cooler area */}
        <div className="absolute bottom-3 right-4 flex items-end gap-1 opacity-30">
          <div className="w-4 h-6 bg-blue-300 rounded-t-full border border-blue-400" />
          <div className="text-[8px] text-fg-muted">Break Area</div>
        </div>
      </div>

      {/* Agent detail overlay */}
      {selectedAgent && (
        <div className="absolute top-0 right-0 z-20 mt-8 mr-2">
          <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        </div>
      )}
    </div>
  );
}
