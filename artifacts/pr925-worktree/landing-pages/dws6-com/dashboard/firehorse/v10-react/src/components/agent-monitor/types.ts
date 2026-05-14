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
  | 'security'
  // Climate IQ Pantheon — workflow orchestrators
  | 'orchestrator'
  | 'intel'
  | 'logistics'
  | 'content'
  // Climate IQ Industry Specialists — per-sector agents
  | 'industry-steel'
  | 'industry-energy'
  | 'industry-maritime'
  | 'industry-agriculture'
  | 'industry-hydrogen'
  | 'industry-construction'
  | 'industry-cement';

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

export type ViewMode = 'office' | 'control' | 'situation' | 'runner' | 'drift';

export interface AgentCatalogEntry {
  name: string;
  description: string;
  capabilities: string[];
  inputSchema: Record<string, AgentInputField>;
}

export interface AgentInputField {
  type: 'string' | 'number' | 'boolean' | 'select';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export interface AgentExecutionResult {
  agentName: string;
  status: 'success' | 'error';
  confidence: number;
  reasoning: string;
  recommendations: string[];
  result: Record<string, unknown>;
  durationMs: number;
  timestamp: string;
}
