/**
 * Investor Reporting - Type Definitions
 * Monthly/Quarterly Reports, MRR/ARR Tracking, Runway Analysis
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum CustomerStatus {
  Trial = 'trial',
  Active = 'active',
  Paused = 'paused',
  Churned = 'churned',
  Expansion = 'expansion',
}

export enum ContractStatus {
  Draft = 'draft',
  Sent = 'sent',
  Signed = 'signed',
  Active = 'active',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum BillingCycle {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
}

export enum TransactionType {
  CashIn = 'cash_in',
  CashOut = 'cash_out',
  Revenue = 'revenue',
  Expense = 'expense',
  Investment = 'investment',
  Loan = 'loan',
}

export enum ReportPeriod {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annual',
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  website?: string;

  // Contact
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;

  // Business metrics
  status: CustomerStatus;
  contract_start_date?: Date;
  contract_end_date?: Date;

  // Revenue tracking
  current_mrr: number;
  current_arr: number;
  lifetime_value: number;

  // Linked to Firehorse
  firehorse_lead_id?: string;

  // Metadata
  notes?: string;
  created_at: Date;
  updated_at: Date;
  churned_at?: Date;
}

export interface Contract {
  id: string;
  customer_id: string;

  // Contract details
  contract_number?: string;
  title: string;
  description?: string;
  status: ContractStatus;

  // Financial
  total_value: number;
  currency: string;
  term_months?: number;

  // Dates
  sent_date?: Date;
  signed_date?: Date;
  start_date?: Date;
  end_date?: Date;

  // Documents
  document_url?: string;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  customer_id: string;
  contract_id?: string;

  // Subscription details
  product_name: string;
  billing_cycle: BillingCycle;

  // Pricing
  monthly_amount: number;
  currency: string;

  // Dates
  start_date: Date;
  end_date?: Date;
  next_billing_date?: Date;

  // Status
  is_active: boolean;
  cancelled_at?: Date;
  cancellation_reason?: string;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface RevenueRecognition {
  id: string;
  month: Date; // First day of month

  // Core metrics
  mrr: number;
  arr: number;

  // MRR Movement
  new_mrr: number;
  expansion_mrr: number;
  contraction_mrr: number;
  churned_mrr: number;

  // Customer counts
  active_customers: number;
  new_customers: number;
  churned_customers: number;

  // Calculated metrics
  churn_rate?: number;
  net_mrr_growth_rate?: number;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface RunwayTracking {
  id: string;
  month: Date; // First day of month

  // Cash position
  cash_balance: number;

  // Burn metrics
  monthly_revenue: number;
  monthly_expenses: number;
  net_burn: number;

  // Runway
  runway_months: number;

  // Metadata
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;

  // Transaction details
  type: TransactionType;
  amount: number;
  currency: string;

  // Links
  customer_id?: string;
  contract_id?: string;

  // Description
  description: string;
  category?: string;

  // Dates
  transaction_date: Date;

  // Metadata
  created_at: Date;
}

// ============================================================================
// CALCULATED METRICS
// ============================================================================

export interface MRRMetrics {
  current_mrr: number;
  previous_month_mrr: number;
  mrr_growth: number;
  mrr_growth_rate: number; // Percentage

  // Breakdown
  new_mrr: number;
  expansion_mrr: number;
  contraction_mrr: number;
  churned_mrr: number;
  net_new_mrr: number;
}

export interface ARRMetrics {
  current_arr: number;
  previous_quarter_arr: number;
  arr_growth: number;
  arr_growth_rate: number; // Percentage
}

export interface CustomerMetrics {
  total_customers: number;
  active_customers: number;
  trial_customers: number;
  churned_customers: number;

  // Churn
  monthly_churn_count: number;
  monthly_churn_rate: number; // Percentage

  // Retention
  retention_rate: number; // Percentage
  customer_lifetime_months: number;
}

export interface PipelineMetrics {
  total_pipeline_value: number;
  qualified_pipeline_value: number;
  weighted_pipeline_value: number;

  // Conversion
  leads_count: number;
  meetings_count: number;
  proposals_count: number;
  closed_won_count: number;

  // Rates
  meeting_conversion_rate: number; // Percentage
  proposal_conversion_rate: number; // Percentage
  win_rate: number; // Percentage
}

export interface CashMetrics {
  current_cash: number;
  previous_month_cash: number;
  cash_change: number;

  // Burn
  monthly_burn_rate: number;
  average_burn_rate_3m: number;
  average_burn_rate_6m: number;

  // Runway
  runway_months: number;
  runway_date: Date;
}

export interface UnitEconomics {
  // Customer Acquisition
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  ltv_cac_ratio: number;
  payback_months: number;

  // Revenue per customer
  arpu: number; // Average Revenue Per User (monthly)
  arpa: number; // Average Revenue Per Account (monthly)
}

// ============================================================================
// INVESTOR REPORT DATA
// ============================================================================

export interface InvestorReportData {
  // Metadata
  report_period: Date; // Month or quarter start
  report_type: ReportPeriod;
  generated_at: Date;

  // Core metrics
  mrr_metrics: MRRMetrics;
  arr_metrics: ARRMetrics;
  customer_metrics: CustomerMetrics;
  pipeline_metrics: PipelineMetrics;
  cash_metrics: CashMetrics;
  unit_economics?: UnitEconomics;

  // Historical data (6-12 months)
  historical_mrr: Array<{ month: Date; value: number }>;
  historical_arr: Array<{ month: Date; value: number }>;
  historical_customers: Array<{ month: Date; count: number }>;
  historical_cash: Array<{ month: Date; balance: number }>;

  // Key events
  key_wins: KeyEvent[];
  key_losses: KeyEvent[];
  key_milestones: KeyEvent[];

  // Narrative
  founder_letter?: string;
  executive_summary?: string;
  outlook?: string;
}

export interface KeyEvent {
  date: Date;
  title: string;
  description: string;
  impact?: string; // e.g., "+€2k MRR", "Lost €1k MRR"
  category: 'customer' | 'product' | 'team' | 'funding' | 'partnership';
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportPeriod;
  language: 'en' | 'fi';

  // Template structure
  sections: ReportSection[];

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  order: number;
  content_type: 'text' | 'table' | 'chart' | 'metrics';

  // Content configuration
  config: Record<string, unknown>;
}

export interface GeneratedReport {
  id: string;
  report_data: InvestorReportData;
  template_id?: string;

  // Output formats
  pdf_url?: string;
  html_content?: string;
  json_data?: string;

  // Delivery
  sent_at?: Date;
  recipients?: string[];

  // Metadata
  created_at: Date;
}

// ============================================================================
// VIEW INTERFACES (Database Views)
// ============================================================================

export interface CurrentMRRByCustomer {
  id: string;
  name: string;
  status: CustomerStatus;
  current_mrr: number;
  current_arr: number;
  contract_start_date?: Date;
  active_subscriptions: number;
  subscription_mrr: number;
}

export interface MonthlyMetricsSummary {
  month: Date;
  mrr: number;
  arr: number;
  new_mrr: number;
  expansion_mrr: number;
  churned_mrr: number;
  active_customers: number;
  churn_rate?: number;
  cash_balance?: number;
  net_burn?: number;
  runway_months?: number;
}

export interface ContractPendingSignature {
  id: string;
  contract_number?: string;
  title: string;
  total_value: number;
  status: ContractStatus;
  sent_date?: Date;
  customer_name: string;
  primary_contact_email?: string;
  days_pending?: number;
}

export interface SubscriptionExpiringSoon {
  id: string;
  product_name: string;
  monthly_amount: number;
  end_date?: Date;
  customer_name: string;
  primary_contact_email?: string;
  days_until_expiry?: number;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface GetMetricsRequest {
  metric_type: 'mrr' | 'arr' | 'runway' | 'pipeline' | 'churn' | 'all';
  start_date?: Date;
  end_date?: Date;
}

export interface GetMetricsResponse {
  success: boolean;
  data: Partial<InvestorReportData>;
  timestamp: Date;
}

export interface GenerateReportRequest {
  report_period: Date;
  report_type: ReportPeriod;
  template_id?: string;
  recipients?: string[];
  auto_send?: boolean;
}

export interface GenerateReportResponse {
  success: boolean;
  report_id: string;
  pdf_url?: string;
  message?: string;
}

// ============================================================================
// AUTOMATION PAYLOADS
// ============================================================================

export interface MonthlyReportPayload {
  month: Date;
  auto_send: boolean;
  recipients: string[];
}

export interface RunwayAlertPayload {
  current_runway_months: number;
  threshold_months: number;
  cash_balance: number;
  monthly_burn: number;
}

export interface ChurnAlertPayload {
  customer_id: string;
  customer_name: string;
  churned_mrr: number;
  churned_at: Date;
  reason?: string;
}

export interface PipelineAlertPayload {
  current_pipeline_value: number;
  previous_pipeline_value: number;
  change_percentage: number;
}
