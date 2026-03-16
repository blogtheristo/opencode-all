/**
 * Peachscore Accelerator — Cap Table & Financials Types
 * Shareholders, share classes, investment rounds, dilution calculations.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum ShareClass {
  Common = 'common',
  PreferredSeed = 'preferred_seed',
  PreferredSeriesA = 'preferred_series_a',
  PreferredSeriesB = 'preferred_series_b',
  PreferredSeriesC = 'preferred_series_c',
  WarrantPool = 'warrant_pool',
  Options = 'options',
  Convertible = 'convertible',
}

export enum ShareholderType {
  Founder = 'founder',
  Investor = 'investor',
  Employee = 'employee',
  Advisor = 'advisor',
  OptionPool = 'option_pool',
}

export enum RoundType {
  FFF = 'friends_family_fools',
  PreSeed = 'pre_seed',
  Seed = 'seed',
  SeriesA = 'series_a',
  SeriesB = 'series_b',
  SeriesC = 'series_c',
  Bridge = 'bridge',
  SAFENote = 'safe_note',
  ConvertibleNote = 'convertible_note',
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Shareholder {
  id: string;
  name: string;
  type: ShareholderType;
  email?: string;
  shares: number;
  share_class: ShareClass;
  /** Investment amount in EUR (0 for founder equity) */
  investment_eur: number;
  /** ISO date string when shares were granted/acquired */
  grant_date: string;
  round_id?: string;
  vesting_months?: number;
  vesting_cliff_months?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentRound {
  id: string;
  round_type: RoundType;
  name: string;
  /** Close date (ISO date string) */
  close_date: string;
  /** Pre-money valuation in EUR */
  pre_money_valuation_eur: number;
  /** Total raised in this round in EUR */
  raised_eur: number;
  /** Post-money valuation = pre_money + raised */
  post_money_valuation_eur: number;
  /** New shares issued in this round */
  shares_issued: number;
  /** Price per share in EUR */
  price_per_share_eur: number;
  notes?: string;
  created_at: string;
}

export interface CapTableShareClass {
  id: string;
  name: string;
  share_class: ShareClass;
  liquidation_preference: number;  // multiplier, e.g. 1.0 = 1x
  anti_dilution: boolean;
  participating: boolean;
  description?: string;
  created_at: string;
}

// ============================================================================
// CALCULATED VIEWS
// ============================================================================

export interface ShareholderSummary {
  shareholder_id: string;
  name: string;
  type: ShareholderType;
  shares: number;
  share_class: ShareClass;
  ownership_pct: number;
  fully_diluted_pct: number;
  investment_eur: number;
  current_value_eur: number;
  multiple: number;
  round_name?: string;
}

export interface CapTableSummary {
  total_shares_issued: number;
  fully_diluted_shares: number;
  option_pool_shares: number;
  option_pool_pct: number;
  latest_round?: {
    name: string;
    round_type: RoundType;
    close_date: string;
    pre_money_valuation_eur: number;
    post_money_valuation_eur: number;
    raised_eur: number;
    price_per_share_eur: number;
  };
  current_valuation_eur: number;
  total_raised_eur: number;
  shareholders: ShareholderSummary[];
  rounds: InvestmentRound[];
}

// ============================================================================
// FINANCIALS SNAPSHOT (for Peachscore integration)
// ============================================================================

export interface FinancialsSnapshot {
  /** Snapshot date */
  as_of_date: string;

  /** Fundraising */
  total_raised_eur: number;
  current_valuation_eur: number;
  last_round_type?: RoundType;
  last_round_date?: string;

  /** Revenue */
  mrr_eur: number;
  arr_eur: number;
  mrr_growth_rate_pct: number;

  /** Cash & Runway */
  cash_balance_eur: number;
  monthly_burn_eur: number;
  runway_months: number;

  /** Unit Economics */
  ltv_eur: number;
  cac_eur: number;
  ltv_cac_ratio: number;

  /** Ownership */
  founder_ownership_pct: number;
  investor_ownership_pct: number;
  option_pool_pct: number;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateShareholderRequest {
  name: string;
  type: ShareholderType;
  email?: string;
  shares: number;
  share_class: ShareClass;
  investment_eur: number;
  grant_date: string;
  round_id?: string;
  vesting_months?: number;
  vesting_cliff_months?: number;
  notes?: string;
}

export interface CreateInvestmentRoundRequest {
  round_type: RoundType;
  name: string;
  close_date: string;
  pre_money_valuation_eur: number;
  raised_eur: number;
  shares_issued: number;
  notes?: string;
}

export interface GetCapTableResponse {
  success: boolean;
  data: CapTableSummary;
  timestamp: string;
}

export interface GetFinancialsResponse {
  success: boolean;
  data: FinancialsSnapshot;
  timestamp: string;
}
