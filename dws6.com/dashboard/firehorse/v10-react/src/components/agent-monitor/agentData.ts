/**
 * Agent Mock Data
 * Simulated agent data with periodic status changes.
 */

import type { MonitorAgent, AgentActivity, SystemHealth } from './types';

function minutesAgo(m: number): Date {
  return new Date(Date.now() - m * 60_000);
}

export const AGENTS: MonitorAgent[] = [
  {
    id: 'sitesense',
    name: 'SiteSense',
    role: 'site-monitor',
    avatar: { color: '#10b981', initials: 'SS', emoji: '🏗️' },
    status: 'working',
    currentTask: {
      id: 't1',
      title: 'Scanning Helsinki Kalasatama site conditions',
      progress: 72,
      startedAt: minutesAgo(14),
    },
    tasksCompleted: 847,
    uptime: 168,
    cpu: 45,
    memory: 62,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'a1', agentId: 'sitesense', action: 'Completed soil moisture analysis — Plot B7', timestamp: minutesAgo(5), severity: 'info' },
      { id: 'a2', agentId: 'sitesense', action: 'Wind load anomaly detected at crane zone', timestamp: minutesAgo(12), severity: 'warning' },
    ],
  },
  {
    id: 'schedulegenius',
    name: 'ScheduleGenius',
    role: 'scheduler',
    avatar: { color: '#3b82f6', initials: 'SG', emoji: '📅' },
    status: 'working',
    currentTask: {
      id: 't2',
      title: 'Optimizing Q2 delivery timeline for CSRD reports',
      progress: 38,
      startedAt: minutesAgo(8),
    },
    tasksCompleted: 1203,
    uptime: 168,
    cpu: 78,
    memory: 55,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'a3', agentId: 'schedulegenius', action: 'Rescheduled 3 overlapping inspections', timestamp: minutesAgo(3), severity: 'info' },
      { id: 'a4', agentId: 'schedulegenius', action: 'Critical path delay: concrete pour → 48h slip', timestamp: minutesAgo(20), severity: 'critical' },
    ],
  },
  {
    id: 'materialoracle',
    name: 'MaterialOracle',
    role: 'materials',
    avatar: { color: '#f59e0b', initials: 'MO', emoji: '🧱' },
    status: 'working',
    currentTask: {
      id: 't3',
      title: 'Evaluating low-carbon concrete alternatives EN 15978',
      progress: 91,
      startedAt: minutesAgo(45),
    },
    tasksCompleted: 562,
    uptime: 168,
    cpu: 32,
    memory: 48,
    lastActive: minutesAgo(1),
    recentActivities: [
      { id: 'a5', agentId: 'materialoracle', action: 'Carbon comparison report: GGBS vs OPC complete', timestamp: minutesAgo(2), severity: 'info' },
    ],
  },
  {
    id: 'customersat',
    name: 'CustomerSat',
    role: 'customer',
    avatar: { color: '#a855f7', initials: 'CS', emoji: '👥' },
    status: 'idle',
    currentTask: null,
    tasksCompleted: 334,
    uptime: 168,
    cpu: 5,
    memory: 22,
    lastActive: minutesAgo(15),
    recentActivities: [
      { id: 'a6', agentId: 'customersat', action: 'NPS survey batch processed — avg 8.2/10', timestamp: minutesAgo(15), severity: 'info' },
    ],
  },
  {
    id: 'viability',
    name: 'Viability',
    role: 'finance',
    avatar: { color: '#f43f5e', initials: 'VB', emoji: '💰' },
    status: 'working',
    currentTask: {
      id: 't4',
      title: 'Running Monte Carlo risk simulation on Project Oulu',
      progress: 55,
      startedAt: minutesAgo(22),
    },
    tasksCompleted: 419,
    uptime: 168,
    cpu: 92,
    memory: 78,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'a7', agentId: 'viability', action: 'High CPU: intensive financial model running', timestamp: minutesAgo(1), severity: 'warning' },
      { id: 'a8', agentId: 'viability', action: 'ROI projection updated for Helsinki Harbor project', timestamp: minutesAgo(30), severity: 'info' },
    ],
  },
  {
    id: 'compliancebot',
    name: 'ComplianceBot',
    role: 'compliance',
    avatar: { color: '#06b6d4', initials: 'CB', emoji: '📋' },
    status: 'working',
    currentTask: {
      id: 't5',
      title: 'Verifying CBAM declarations for steel imports',
      progress: 63,
      startedAt: minutesAgo(18),
    },
    tasksCompleted: 2156,
    uptime: 168,
    cpu: 41,
    memory: 53,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'a9', agentId: 'compliancebot', action: 'CSRD Article 29a check passed for Q1 report', timestamp: minutesAgo(8), severity: 'info' },
      { id: 'a10', agentId: 'compliancebot', action: 'ETS Phase 4 allowance shortfall detected', timestamp: minutesAgo(25), severity: 'critical' },
    ],
  },
  {
    id: 'carbontracker',
    name: 'CarbonTracker',
    role: 'carbon',
    avatar: { color: '#22c55e', initials: 'CT', emoji: '🌿' },
    status: 'break',
    currentTask: null,
    tasksCompleted: 723,
    uptime: 167,
    cpu: 2,
    memory: 18,
    lastActive: minutesAgo(35),
    recentActivities: [
      { id: 'a11', agentId: 'carbontracker', action: 'Scope 3 emissions aggregation complete', timestamp: minutesAgo(35), severity: 'info' },
    ],
  },
  {
    id: 'datasentinel',
    name: 'DataSentinel',
    role: 'security',
    avatar: { color: '#64748b', initials: 'DS', emoji: '🛡️' },
    status: 'working',
    currentTask: {
      id: 't6',
      title: 'Monitoring API access patterns — anomaly detection',
      progress: 100,
      startedAt: minutesAgo(0),
    },
    tasksCompleted: 5031,
    uptime: 168,
    cpu: 28,
    memory: 41,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'a12', agentId: 'datasentinel', action: 'All endpoints nominal — 0 threats', timestamp: minutesAgo(1), severity: 'info' },
      { id: 'a13', agentId: 'datasentinel', action: 'Rate limit triggered on /api/reports (resolved)', timestamp: minutesAgo(45), severity: 'warning' },
    ],
  },
];

export function getSystemHealth(): SystemHealth {
  const active = AGENTS.filter(a => a.status === 'working').length;
  const alerts = AGENTS.flatMap(a => a.recentActivities).filter(a => a.severity !== 'info').length;
  const criticals = AGENTS.flatMap(a => a.recentActivities).filter(a => a.severity === 'critical').length;

  return {
    overallStatus: criticals > 0 ? 'degraded' : 'healthy',
    activeAgents: active,
    totalAgents: AGENTS.length,
    alertCount: alerts,
    tasksThroughput: 142,
    avgResponseTime: 230,
  };
}

export function getAllActivities(): AgentActivity[] {
  return AGENTS
    .flatMap(a => a.recentActivities)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
