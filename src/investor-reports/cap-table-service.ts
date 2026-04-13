/**
 * Peachscore Accelerator — Cap Table Service
 *
 * Manages shareholder records, investment rounds, and computes
 * ownership percentages, dilution, and valuation metrics.
 * All financial figures are in EUR.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  type CapTableSummary,
  type CreateInvestmentRoundRequest,
  type CreateShareholderRequest,
  type FinancialsSnapshot,
  type InvestmentRound,
  ShareClass,
  type Shareholder,
  type ShareholderSummary,
  ShareholderType,
} from './cap-table-types.js';

// ============================================================================
// SERVICE
// ============================================================================

export class CapTableService {
  private _supabase: SupabaseClient | null = null;

  private get supabase(): SupabaseClient {
    if (!this._supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
      }

      this._supabase = createClient(supabaseUrl, supabaseKey);
    }
    return this._supabase;
  }

  // ==========================================================================
  // SHAREHOLDERS
  // ==========================================================================

  /**
   * Fetch all shareholders ordered by shares descending.
   */
  async getShareholders(): Promise<Shareholder[]> {
    const { data, error } = await this.supabase
      .from('cap_table_shareholders')
      .select('*')
      .order('shares', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch shareholders: ${error.message}`);
    }

    return (data || []) as Shareholder[];
  }

  /**
   * Add a new shareholder (founder, investor, employee, option pool entry).
   */
  async addShareholder(req: CreateShareholderRequest): Promise<Shareholder> {
    const { data, error } = await this.supabase
      .from('cap_table_shareholders')
      .insert({
        ...req,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to add shareholder: ${error.message}`);
    }

    return data as Shareholder;
  }

  // ==========================================================================
  // INVESTMENT ROUNDS
  // ==========================================================================

  /**
   * Fetch all investment rounds ordered by close date ascending.
   */
  async getInvestmentRounds(): Promise<InvestmentRound[]> {
    const { data, error } = await this.supabase
      .from('cap_table_investment_rounds')
      .select('*')
      .order('close_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch investment rounds: ${error.message}`);
    }

    return (data || []) as InvestmentRound[];
  }

  /**
   * Add a new investment round and compute derived fields.
   * Price per share = raised_eur / shares_issued (new shares issued at this round's price).
   */
  async addInvestmentRound(req: CreateInvestmentRoundRequest): Promise<InvestmentRound> {
    const postMoney = req.pre_money_valuation_eur + req.raised_eur;
    // Price per share is derived from how much was raised per new share issued
    const pricePerShare =
      req.shares_issued > 0 ? req.raised_eur / req.shares_issued : 0;

    const { data, error } = await this.supabase
      .from('cap_table_investment_rounds')
      .insert({
        ...req,
        post_money_valuation_eur: postMoney,
        price_per_share_eur: pricePerShare,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to add investment round: ${error.message}`);
    }

    return data as InvestmentRound;
  }

  // ==========================================================================
  // CAP TABLE SUMMARY (pure computation, no DB call)
  // ==========================================================================

  /**
   * Build the full cap table summary from shareholders + rounds.
   * Computes ownership %, dilution, current values.
   */
  buildCapTableSummary(
    shareholders: Shareholder[],
    rounds: InvestmentRound[],
    currentValuationEur?: number,
  ): CapTableSummary {
    // Total issued shares (excluding unexercised options/warrants)
    const issuedShares = shareholders
      .filter((s) => s.share_class !== ShareClass.Options && s.share_class !== ShareClass.WarrantPool)
      .reduce((sum, s) => sum + s.shares, 0);

    // Fully diluted = issued + options + warrants
    const fullyDilutedShares = shareholders.reduce((sum, s) => sum + s.shares, 0);

    const optionPoolShares = shareholders
      .filter((s) => s.share_class === ShareClass.Options || s.share_class === ShareClass.WarrantPool)
      .reduce((sum, s) => sum + s.shares, 0);

    const optionPoolPct = fullyDilutedShares > 0
      ? (optionPoolShares / fullyDilutedShares) * 100
      : 0;

    // Latest round
    const sortedRounds = [...rounds].sort(
      (a, b) => new Date(b.close_date).getTime() - new Date(a.close_date).getTime(),
    );
    const latestRound = sortedRounds[0];

    // Valuation: use latest round post-money if not overridden
    const valuation = currentValuationEur ?? latestRound?.post_money_valuation_eur ?? 0;

    // Price per share for current valuation
    const currentPricePerShare = fullyDilutedShares > 0 ? valuation / fullyDilutedShares : 0;

    // Total raised across all rounds
    const totalRaisedEur = rounds.reduce((sum, r) => sum + r.raised_eur, 0);

    // Build round lookup for shareholder enrichment
    const roundById = new Map(rounds.map((r) => [r.id, r]));

    // Compute shareholder summaries (sorted by shares descending)
    const shareholderSummaries: ShareholderSummary[] = [...shareholders]
      .sort((a, b) => b.shares - a.shares)
      .map((s) => {
      const ownershipPct = issuedShares > 0 ? (s.shares / issuedShares) * 100 : 0;
      const fullyDilutedPct = fullyDilutedShares > 0 ? (s.shares / fullyDilutedShares) * 100 : 0;
      const currentValueEur = s.shares * currentPricePerShare;
      const multiple =
        s.investment_eur > 0 ? currentValueEur / s.investment_eur : 0;
      const round = s.round_id ? roundById.get(s.round_id) : undefined;

      return {
        shareholder_id: s.id,
        name: s.name,
        type: s.type,
        shares: s.shares,
        share_class: s.share_class,
        ownership_pct: Math.round(ownershipPct * 100) / 100,
        fully_diluted_pct: Math.round(fullyDilutedPct * 100) / 100,
        investment_eur: s.investment_eur,
        current_value_eur: Math.round(currentValueEur),
        multiple: Math.round(multiple * 100) / 100,
        round_name: round?.name,
      };
    });

    return {
      total_shares_issued: issuedShares,
      fully_diluted_shares: fullyDilutedShares,
      option_pool_shares: optionPoolShares,
      option_pool_pct: Math.round(optionPoolPct * 100) / 100,
      latest_round: latestRound
        ? {
            name: latestRound.name,
            round_type: latestRound.round_type,
            close_date: latestRound.close_date,
            pre_money_valuation_eur: latestRound.pre_money_valuation_eur,
            post_money_valuation_eur: latestRound.post_money_valuation_eur,
            raised_eur: latestRound.raised_eur,
            price_per_share_eur: latestRound.price_per_share_eur,
          }
        : undefined,
      current_valuation_eur: valuation,
      total_raised_eur: totalRaisedEur,
      shareholders: shareholderSummaries,
      rounds: sortedRounds,
    };
  }

  /**
   * Fetch shareholders + rounds and return full cap table summary.
   */
  async getCapTableSummary(currentValuationEur?: number): Promise<CapTableSummary> {
    const [shareholders, rounds] = await Promise.all([
      this.getShareholders(),
      this.getInvestmentRounds(),
    ]);

    return this.buildCapTableSummary(shareholders, rounds, currentValuationEur);
  }

  // ==========================================================================
  // FINANCIALS SNAPSHOT
  // ==========================================================================

  /**
   * Build a financials snapshot combining cap table data with investor
   * reporting metrics for the Peachscore accelerator dashboard.
   */
  async getFinancialsSnapshot(): Promise<FinancialsSnapshot> {
    // Fetch cap table summary
    const capTable = await this.getCapTableSummary();

    // Fetch runway / cash / MRR from existing investor reporting tables (best-effort)
    const [runwayRow, revenueRow] = await Promise.all([
      this.supabase
        .from('runway_tracking')
        .select('cash_balance, net_burn, runway_months')
        .order('month', { ascending: false })
        .limit(1)
        .maybeSingle(),
      this.supabase
        .from('revenue_recognition')
        .select('mrr, arr, net_mrr_growth_rate')
        .order('month', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const runway = runwayRow.data;
    const revenue = revenueRow.data;

    // Aggregate ownership groups from cap table
    const founderShares = capTable.shareholders
      .filter((s) => s.type === ShareholderType.Founder)
      .reduce((sum, s) => sum + s.shares, 0);
    const investorShares = capTable.shareholders
      .filter((s) => s.type === ShareholderType.Investor)
      .reduce((sum, s) => sum + s.shares, 0);
    const fullyDiluted = capTable.fully_diluted_shares;

    const founderPct = fullyDiluted > 0 ? (founderShares / fullyDiluted) * 100 : 0;
    const investorPct = fullyDiluted > 0 ? (investorShares / fullyDiluted) * 100 : 0;

    const latestRound = capTable.latest_round;

    return {
      as_of_date: new Date().toISOString().split('T')[0],
      total_raised_eur: capTable.total_raised_eur,
      current_valuation_eur: capTable.current_valuation_eur,
      last_round_type: latestRound?.round_type,
      last_round_date: latestRound?.close_date,
      mrr_eur: revenue?.mrr ?? 0,
      arr_eur: revenue?.arr ?? 0,
      mrr_growth_rate_pct: revenue?.net_mrr_growth_rate ?? 0,
      cash_balance_eur: runway?.cash_balance ?? 0,
      monthly_burn_eur: runway?.net_burn ?? 0,
      runway_months: runway?.runway_months ?? 0,
      // Unit economics placeholder — override via env or dedicated table
      ltv_eur: parseFloat(process.env.LTV_EUR || '0'),
      cac_eur: parseFloat(process.env.CAC_EUR || '0'),
      ltv_cac_ratio:
        parseFloat(process.env.CAC_EUR || '0') > 0
          ? parseFloat(process.env.LTV_EUR || '0') / parseFloat(process.env.CAC_EUR || '0')
          : 0,
      founder_ownership_pct: Math.round(founderPct * 100) / 100,
      investor_ownership_pct: Math.round(investorPct * 100) / 100,
      option_pool_pct: capTable.option_pool_pct,
    };
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
}

// Export singleton instance
export const capTableService = new CapTableService();
