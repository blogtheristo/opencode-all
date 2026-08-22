/**
 * Agent Monitor Dashboard
 * Parent component with tab navigation between three views:
 * 1. Digital Office — visual office floor with agents at workstations
 * 2. Control Room — NOC-style monitoring grid with system health
 * 3. Situation Room — executive overview with alerts and timeline
 */

import { useState, useEffect, useCallback } from 'react';
import { DigitalOffice } from './DigitalOffice';
import { ControlRoom } from './ControlRoom';
import { SituationRoom } from './SituationRoom';
import { AgentRunner } from './AgentRunner';
import { ConfidenceDriftView } from './ConfidenceDriftView';
import { ALL_AGENTS as INITIAL_AGENTS, getSystemHealth, getAllActivities } from './agentData';
import type { ViewMode, MonitorAgent } from './types';

const TABS: { id: ViewMode; label: string; description: string }[] = [
  { id: 'office', label: 'Digital Office', description: 'Visual office floor' },
  { id: 'control', label: 'Control Room', description: 'System monitoring' },
  { id: 'situation', label: 'Situation Room', description: 'Executive overview' },
  { id: 'runner', label: 'Agent Runner', description: 'Execute agents' },
  { id: 'drift', label: 'Drift', description: 'Confidence timeline' },
];

interface AgentMonitorDashboardProps {
  onClose: () => void;
}

export function AgentMonitorDashboard({ onClose }: AgentMonitorDashboardProps) {
  const [view, setView] = useState<ViewMode>('office');
  const [agents, setAgents] = useState<MonitorAgent[]>(INITIAL_AGENTS);
  const [tick, setTick] = useState(0);

  // Simulate live updates every 5 seconds
  const simulateTick = useCallback(() => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.status !== 'working' || !agent.currentTask) return agent;

        // Advance progress slightly
        const newProgress = Math.min(
          agent.currentTask.progress + Math.floor(Math.random() * 4),
          100,
        );

        // Fluctuate CPU/memory
        const cpuDelta = Math.floor(Math.random() * 11) - 5;
        const memDelta = Math.floor(Math.random() * 7) - 3;

        return {
          ...agent,
          cpu: Math.max(1, Math.min(99, agent.cpu + cpuDelta)),
          memory: Math.max(10, Math.min(95, agent.memory + memDelta)),
          lastActive: new Date(),
          currentTask: {
            ...agent.currentTask,
            progress: newProgress,
          },
        };
      }),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateTick();
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [simulateTick]);

  const health = getSystemHealth();
  const activities = getAllActivities();

  // Suppress unused variable warning — tick forces re-render for health/activities recalculation
  void tick;

  return (
    <div className="space-y-4">
      {/* Dashboard header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Agent Monitor</h2>
          <p className="text-xs text-fg-muted">
            Real-time view of all AI agents and their work status
          </p>
        </div>
        <button onClick={onClose} className="btn-secondary text-sm">
          Back to Dashboard
        </button>
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-1 bg-border rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === tab.id
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-fg-muted hover:text-foreground'
            }`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[10px] font-normal opacity-60">{tab.description}</span>
          </button>
        ))}
      </div>

      {/* Active view */}
      {view === 'office' && <DigitalOffice agents={agents} />}
      {view === 'control' && (
        <ControlRoom agents={agents} health={health} activities={activities} />
      )}
      {view === 'situation' && (
        <SituationRoom agents={agents} health={health} activities={activities} />
      )}
      {view === 'runner' && <AgentRunner />}
      {view === 'drift' && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Confidence Drift</h3>
            <p className="text-[10px] text-fg-muted">
              Daily mean confidence per agent — highlights inflection dates
            </p>
          </div>
          <ConfidenceDriftView />
        </div>
      )}
    </div>
  );
}
