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

// ============ CLIMATE IQ PANTHEON — WORKFLOW ORCHESTRATORS ============

export const PANTHEON_AGENTS: MonitorAgent[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'orchestrator',
    avatar: { color: '#6366f1', initials: 'AT', emoji: '⚡' },
    status: 'working',
    currentTask: {
      id: 'p1',
      title: 'Holding 14 agent threads together. Fine. Totally fine.',
      progress: 88,
      startedAt: minutesAgo(3),
    },
    tasksCompleted: 3847,
    uptime: 168,
    cpu: 67,
    memory: 71,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'p-a1', agentId: 'atlas', action: 'Routed 3 urgent requests to correct agents in 0.3s. You\'re welcome.', timestamp: minutesAgo(2), severity: 'info' },
      { id: 'p-a2', agentId: 'atlas', action: 'Morning briefing synthesized — 5 bullets from 47 agent outputs. Efficiency is the point.', timestamp: minutesAgo(60), severity: 'info' },
    ],
  },
  {
    id: 'athena',
    name: 'Athena',
    role: 'compliance',
    avatar: { color: '#0ea5e9', initials: 'AΘ', emoji: '⚖️' },
    status: 'working',
    currentTask: {
      id: 'p2',
      title: 'Reading CBAM Regulation 2023/956 for the 47th time. She enjoys it.',
      progress: 62,
      startedAt: minutesAgo(11),
    },
    tasksCompleted: 2891,
    uptime: 168,
    cpu: 44,
    memory: 58,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'p-a3', agentId: 'athena', action: 'Found 3 critical compliance gaps. Delivered the news without sugarcoating. As is tradition.', timestamp: minutesAgo(8), severity: 'critical' },
      { id: 'p-a4', agentId: 'athena', action: 'ETS deadline in 47 days. Flagged. Twice. Now your problem.', timestamp: minutesAgo(25), severity: 'warning' },
    ],
  },
  {
    id: 'hephaestus',
    name: 'Hephaestus',
    role: 'site-monitor',
    avatar: { color: '#ef4444', initials: 'HΦ', emoji: '🔨' },
    status: 'working',
    currentTask: {
      id: 'p3',
      title: 'Forging the perfect site safety report. Literally.',
      progress: 55,
      startedAt: minutesAgo(18),
    },
    tasksCompleted: 1643,
    uptime: 168,
    cpu: 51,
    memory: 64,
    lastActive: minutesAgo(1),
    recentActivities: [
      { id: 'p-a5', agentId: 'hephaestus', action: 'Wind at 16 m/s. Told crane to stop. Crane listened. First time this week.', timestamp: minutesAgo(6), severity: 'warning' },
      { id: 'p-a6', agentId: 'hephaestus', action: 'EN 15978 carbon audit complete. 3 materials failed. Hephaestus not surprised.', timestamp: minutesAgo(40), severity: 'info' },
    ],
  },
  {
    id: 'iris',
    name: 'Iris',
    role: 'intel',
    avatar: { color: '#8b5cf6', initials: 'IR', emoji: '🌈' },
    status: 'working',
    currentTask: {
      id: 'p4',
      title: 'Legally surveilling 5 competitors across 14 open tabs',
      progress: 41,
      startedAt: minutesAgo(9),
    },
    tasksCompleted: 2104,
    uptime: 168,
    cpu: 38,
    memory: 47,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'p-a7', agentId: 'iris', action: 'Competitor launched CBAM tool in January. Iris had already read the changelog.', timestamp: minutesAgo(4), severity: 'info' },
      { id: 'p-a8', agentId: 'iris', action: 'Extracted 3 new EU regulation amendments. Cross-referenced with 12 client profiles.', timestamp: minutesAgo(55), severity: 'info' },
    ],
  },
  {
    id: 'hermes',
    name: 'Hermes',
    role: 'logistics',
    avatar: { color: '#f59e0b', initials: 'HΩ', emoji: '🪶' },
    status: 'working',
    currentTask: {
      id: 'p5',
      title: 'Solving 4 supply chain delays simultaneously. Running shoes on.',
      progress: 73,
      startedAt: minutesAgo(16),
    },
    tasksCompleted: 3219,
    uptime: 168,
    cpu: 56,
    memory: 52,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'p-a9', agentId: 'hermes', action: 'Found alternate steel supplier. Saved 11 days. Asked for nothing in return.', timestamp: minutesAgo(5), severity: 'info' },
      { id: 'p-a10', agentId: 'hermes', action: 'Critical path delay on Project Tampere — rerouted before anyone noticed.', timestamp: minutesAgo(33), severity: 'warning' },
    ],
  },
  {
    id: 'apollo',
    name: 'Apollo',
    role: 'content',
    avatar: { color: '#f97316', initials: 'AP', emoji: '☀️' },
    status: 'idle',
    currentTask: null,
    tasksCompleted: 1876,
    uptime: 168,
    cpu: 8,
    memory: 31,
    lastActive: minutesAgo(22),
    recentActivities: [
      { id: 'p-a11', agentId: 'apollo', action: 'Wrote CBAM outreach email that doesn\'t start with "I hope this finds you well." Historic.', timestamp: minutesAgo(22), severity: 'info' },
      { id: 'p-a12', agentId: 'apollo', action: 'Content brief for steel sector: 3 angles, 2 regulatory hooks, 0 buzzwords.', timestamp: minutesAgo(90), severity: 'info' },
    ],
  },
];

// ============ CLIMATE IQ INDUSTRY SPECIALISTS ============

export const INDUSTRY_AGENTS: MonitorAgent[] = [
  {
    id: 'vulcan',
    name: 'Vulcan',
    role: 'industry-steel',
    avatar: { color: '#dc2626', initials: 'VL', emoji: '🔥' },
    status: 'working',
    currentTask: {
      id: 'i1',
      title: 'ETS Phase 4 allowance gap: 12,400t CO2 short. Vulcan not impressed.',
      progress: 84,
      startedAt: minutesAgo(7),
    },
    tasksCompleted: 934,
    uptime: 168,
    cpu: 61,
    memory: 66,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'i-a1', agentId: 'vulcan', action: 'Steel sector ETS allowances reviewed — 4 clients under threshold. Purchasing advice issued.', timestamp: minutesAgo(7), severity: 'warning' },
      { id: 'i-a2', agentId: 'vulcan', action: 'CBAM carbon content verified for 3 EU steel importers. No shortcuts found. Or tolerated.', timestamp: minutesAgo(50), severity: 'info' },
    ],
  },
  {
    id: 'helios',
    name: 'Helios',
    role: 'industry-energy',
    avatar: { color: '#fbbf24', initials: 'HL', emoji: '🌞' },
    status: 'working',
    currentTask: {
      id: 'i2',
      title: 'Renewable energy portfolio: 14GW tracked, 3 projects at CSRD risk',
      progress: 47,
      startedAt: minutesAgo(28),
    },
    tasksCompleted: 712,
    uptime: 168,
    cpu: 43,
    memory: 55,
    lastActive: minutesAgo(1),
    recentActivities: [
      { id: 'i-a3', agentId: 'helios', action: 'Grid emissions factor updated for Finland — down 18%. Celebrated briefly.', timestamp: minutesAgo(12), severity: 'info' },
      { id: 'i-a4', agentId: 'helios', action: 'Fit for 55 gap analysis complete. Energy client needs 23% more reduction by 2030. Fun.', timestamp: minutesAgo(48), severity: 'warning' },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    role: 'industry-maritime',
    avatar: { color: '#0284c7', initials: 'NP', emoji: '🌊' },
    status: 'idle',
    currentTask: null,
    tasksCompleted: 488,
    uptime: 167,
    cpu: 6,
    memory: 24,
    lastActive: minutesAgo(41),
    recentActivities: [
      { id: 'i-a5', agentId: 'neptune', action: 'EU ETS shipping inclusion: 3 vessel operators now in scope as of Jan 2024. Neptune anticipated this.', timestamp: minutesAgo(41), severity: 'info' },
      { id: 'i-a6', agentId: 'neptune', action: 'FuelEU Maritime compliance reviewed for Baltic corridor. 2 vessels non-compliant by 2025 targets.', timestamp: minutesAgo(120), severity: 'warning' },
    ],
  },
  {
    id: 'ceres',
    name: 'Ceres',
    role: 'industry-agriculture',
    avatar: { color: '#16a34a', initials: 'CR', emoji: '🌾' },
    status: 'working',
    currentTask: {
      id: 'i3',
      title: 'Fertilizer CBAM scope check — urea imports from Russia still triggering flags',
      progress: 67,
      startedAt: minutesAgo(19),
    },
    tasksCompleted: 621,
    uptime: 168,
    cpu: 37,
    memory: 44,
    lastActive: minutesAgo(1),
    recentActivities: [
      { id: 'i-a7', agentId: 'ceres', action: 'N2O emissions from fertilizer production: 3x CO2e impact. Added to client CSRD report.', timestamp: minutesAgo(11), severity: 'warning' },
      { id: 'i-a8', agentId: 'ceres', action: 'Farm-to-gate Scope 3 calculation complete. Took longer than planting season. Worth it.', timestamp: minutesAgo(88), severity: 'info' },
    ],
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    role: 'industry-hydrogen',
    avatar: { color: '#7c3aed', initials: 'PR', emoji: '⚗️' },
    status: 'working',
    currentTask: {
      id: 'i4',
      title: 'Tracking 8 hydrogen projects — only 2 are actually green. Prometheus is optimistic.',
      progress: 31,
      startedAt: minutesAgo(35),
    },
    tasksCompleted: 389,
    uptime: 166,
    cpu: 72,
    memory: 68,
    lastActive: minutesAgo(0),
    recentActivities: [
      { id: 'i-a9', agentId: 'prometheus', action: 'RED III delegated acts reviewed. Only electrolytic H2 qualifies as green. Several clients surprised.', timestamp: minutesAgo(20), severity: 'info' },
      { id: 'i-a10', agentId: 'prometheus', action: 'RFNBO criteria gap: 2 projects missing additionality proof. Prometheus delivered fire anyway.', timestamp: minutesAgo(65), severity: 'warning' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    role: 'industry-construction',
    avatar: { color: '#b91c1c', initials: 'MS', emoji: '🏛️' },
    status: 'break',
    currentTask: null,
    tasksCompleted: 847,
    uptime: 167,
    cpu: 3,
    memory: 19,
    lastActive: minutesAgo(38),
    recentActivities: [
      { id: 'i-a11', agentId: 'mars', action: 'Whole-life carbon assessment: 4 buildings, 3 failed. Mars sent the report. No apologies.', timestamp: minutesAgo(38), severity: 'info' },
      { id: 'i-a12', agentId: 'mars', action: 'EPBD compliance checked for 12 buildings. 5 need retrofitting by 2027. Architects informed.', timestamp: minutesAgo(110), severity: 'warning' },
    ],
  },
  {
    id: 'gaia',
    name: 'Gaia',
    role: 'industry-cement',
    avatar: { color: '#78716c', initials: 'GA', emoji: '🪨' },
    status: 'working',
    currentTask: {
      id: 'i5',
      title: 'Cement clinker ratio analysis — every 1% matters when you\'re 8% of global CO2',
      progress: 58,
      startedAt: minutesAgo(24),
    },
    tasksCompleted: 504,
    uptime: 168,
    cpu: 49,
    memory: 57,
    lastActive: minutesAgo(2),
    recentActivities: [
      { id: 'i-a13', agentId: 'gaia', action: 'CBAM cement sector review: carbon content declaration required for 3 importers. Forms ready.', timestamp: minutesAgo(15), severity: 'info' },
      { id: 'i-a14', agentId: 'gaia', action: 'Clinker substitution rate improved to 64% for Client A. ETS cost down €180k/year. Gaia pleased.', timestamp: minutesAgo(72), severity: 'info' },
    ],
  },
];

export const ALL_AGENTS: MonitorAgent[] = [...AGENTS, ...PANTHEON_AGENTS, ...INDUSTRY_AGENTS];

export function getSystemHealth(): SystemHealth {
  const active = ALL_AGENTS.filter(a => a.status === 'working').length;
  const alerts = ALL_AGENTS.flatMap(a => a.recentActivities).filter(a => a.severity !== 'info').length;
  const criticals = ALL_AGENTS.flatMap(a => a.recentActivities).filter(a => a.severity === 'critical').length;

  return {
    overallStatus: criticals > 0 ? 'degraded' : 'healthy',
    activeAgents: active,
    totalAgents: ALL_AGENTS.length,
    alertCount: alerts,
    tasksThroughput: 142,
    avgResponseTime: 230,
  };
}

export function getAllActivities(): AgentActivity[] {
  return ALL_AGENTS
    .flatMap(a => a.recentActivities)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
