/**
 * Agent Monitor Types
 * Type definitions for the Agent Monitoring Dashboard views.
 */

export type AgentStatus = 'working' | 'idle' | 'break' | 'offline' | 'alert';

export type AgentRole =
  | 'site-monitor'
  | 'scheduler'
  | 'materials'
  | 'customer'
  | 'finance'
  | 'compliance'
  | 'carbon'
  | 'security';

export interface AgentTask {
  id: string;
  title: string;
  progress: number; // 0-100
  startedAt: Date;
  estimatedCompletion?: Date;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  action: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
}

export interface MonitorAgent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: {
    color: string;
    initials: string;
    emoji: string;
  };
  status: AgentStatus;
  currentTask: AgentTask | null;
  tasksCompleted: number;
  uptime: number; // hours
  cpu: number; // percentage
  memory: number; // percentage
  lastActive: Date;
  recentActivities: AgentActivity[];
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  activeAgents: number;
  totalAgents: number;
  alertCount: number;
  tasksThroughput: number; // tasks/hour
  avgResponseTime: number; // ms
}

export type ViewMode = 'office' | 'control' | 'situation';
