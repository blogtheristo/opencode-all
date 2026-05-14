/**
 * Dashboard V9 Type Definitions
 * TypeScript types for DWS IQ Climate Intelligence Dashboard
 */

export type RAGStatus = 'green' | 'amber' | 'red';

export type AlertSeverity = 'high' | 'medium' | 'low';

export type AlertType = 'compliance' | 'carbon' | 'schedule' | 'cost';

export interface Project {
  id: string;
  name: string;
  status: RAGStatus;
  spi: number; // Schedule Performance Index
  cpi: number; // Cost Performance Index
  carbon_footprint: number; // kg CO2e
  compliance_status: ComplianceStatus;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  spent?: number;
}

export interface ComplianceStatus {
  csrd: boolean; // Corporate Sustainability Reporting Directive
  epbd: boolean; // Energy Performance of Buildings Directive
  ets: boolean; // Emissions Trading System
  cbam: boolean; // Carbon Border Adjustment Mechanism
  last_check: string;
}

export interface PortfolioMetrics {
  total_projects: number;
  avg_spi: number;
  avg_cpi: number;
  total_carbon_saved: number; // kg CO2e
  compliance_rate: number; // percentage
  projects_green: number;
  projects_amber: number;
  projects_red: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  project_id: string;
  project_name?: string;
  created_at: string;
  acknowledged: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  company?: string;
  portfolio_id?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolInvocations?: ToolInvocation[];
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface CarbonCalculation {
  material: string;
  quantity: number;
  unit: string;
  embodied_carbon_kg: number;
  methodology: string;
  location: string;
}

export interface ComplianceCheck {
  regulation: 'CSRD' | 'EPBD' | 'ETS' | 'CBAM';
  project_id: string;
  compliant: boolean;
  issues: string[];
  recommendations: string[];
  checked_at: string;
}

export interface ReportGeneration {
  report_type: 'CSRD' | 'EPBD' | 'Carbon_Footprint';
  project_ids: string[];
  period: string;
  report_url?: string;
  generated_at: string;
  status: 'generating' | 'complete' | 'failed';
}

// Supabase response types
export interface SupabaseProject {
  id: string;
  name: string;
  status: string;
  spi: number;
  cpi: number;
  carbon_footprint: number;
  location: string;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  project_id: string;
  created_at: string;
  acknowledged: boolean;
}

// Insights Dashboard Types
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CarbonTrendData {
  month: string;
  emissions: number;
  target: number;
  savings: number;
}

export interface ComplianceTrendData {
  month: string;
  csrd: number;
  epbd: number;
  ets: number;
  cbam: number;
}

export interface PerformanceTrendData {
  month: string;
  spi: number;
  cpi: number;
}

export interface ProjectStatusDistribution {
  status: RAGStatus;
  count: number;
  percentage: number;
}

export interface InsightsData {
  carbonTrends: CarbonTrendData[];
  complianceTrends: ComplianceTrendData[];
  performanceTrends: PerformanceTrendData[];
  statusDistribution: ProjectStatusDistribution[];
  topCarbonProjects: Project[];
  riskAlerts: Alert[];
}
