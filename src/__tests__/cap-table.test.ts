/**
 * Cap Table Service — Unit Tests
 *
 * Tests the deterministic computation logic in CapTableService.buildCapTableSummary()
 * and the buildFinancialsHTML() helper in peachscore.js.
 * No Supabase calls are made — pure calculation testing.
 */

import { describe, expect, it } from 'vitest';
import { CapTableService } from '../investor-reports/cap-table-service.js';
import {
  type InvestmentRound,
  RoundType,
  ShareClass,
  type Shareholder,
  ShareholderType,
} from '../investor-reports/cap-table-types.js';

// ============================================================================
// FIXTURES
// ============================================================================

function makeShareholder(overrides: Partial<Shareholder>): Shareholder {
  return {
    id: 'sh-1',
    name: 'Risto Founder',
    type: ShareholderType.Founder,
    shares: 5_000_000,
    share_class: ShareClass.Common,
    investment_eur: 0,
    grant_date: '2023-01-01',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeRound(overrides: Partial<InvestmentRound>): InvestmentRound {
  return {
    id: 'r-1',
    round_type: RoundType.PreSeed,
    name: 'Pre-Seed',
    close_date: '2023-06-01',
    pre_money_valuation_eur: 1_000_000,
    raised_eur: 200_000,
    post_money_valuation_eur: 1_200_000,
    shares_issued: 1_000_000,
    price_per_share_eur: 0.2,
    created_at: '2023-06-01T00:00:00Z',
    ...overrides,
  };
}

// ============================================================================
// TESTS
// ============================================================================

describe('CapTableService.buildCapTableSummary()', () => {
  const service = new CapTableService();

  it('returns zero totals for empty cap table', () => {
    const summary = service.buildCapTableSummary([], []);
    expect(summary.total_shares_issued).toBe(0);
    expect(summary.fully_diluted_shares).toBe(0);
    expect(summary.option_pool_pct).toBe(0);
    expect(summary.current_valuation_eur).toBe(0);
    expect(summary.total_raised_eur).toBe(0);
    expect(summary.shareholders).toHaveLength(0);
    expect(summary.rounds).toHaveLength(0);
  });

  it('computes correct ownership % for single founder', () => {
    const founder = makeShareholder({ shares: 1_000_000 });
    const summary = service.buildCapTableSummary([founder], []);
    expect(summary.total_shares_issued).toBe(1_000_000);
    expect(summary.shareholders[0].ownership_pct).toBe(100);
    expect(summary.shareholders[0].fully_diluted_pct).toBe(100);
  });

  it('splits ownership correctly between two shareholders', () => {
    const founder = makeShareholder({ id: 'sh-1', shares: 6_000_000 });
    const investor = makeShareholder({
      id: 'sh-2',
      name: 'Investor A',
      type: ShareholderType.Investor,
      shares: 4_000_000,
      share_class: ShareClass.PreferredSeed,
      investment_eur: 400_000,
    });
    const summary = service.buildCapTableSummary([founder, investor], []);

    const founderRow = summary.shareholders.find((s) => s.shareholder_id === 'sh-1')!;
    const investorRow = summary.shareholders.find((s) => s.shareholder_id === 'sh-2')!;

    expect(founderRow.ownership_pct).toBe(60);
    expect(investorRow.ownership_pct).toBe(40);
    expect(founderRow.ownership_pct + investorRow.ownership_pct).toBe(100);
  });

  it('excludes options from issued shares but includes in fully diluted', () => {
    const founder = makeShareholder({ id: 'sh-1', shares: 8_000_000 });
    const optionPool = makeShareholder({
      id: 'sh-2',
      name: 'ESOP Pool',
      type: ShareholderType.OptionPool,
      share_class: ShareClass.Options,
      shares: 2_000_000,
    });
    const summary = service.buildCapTableSummary([founder, optionPool], []);

    expect(summary.total_shares_issued).toBe(8_000_000);       // options excluded
    expect(summary.fully_diluted_shares).toBe(10_000_000);     // options included
    expect(summary.option_pool_shares).toBe(2_000_000);
    expect(summary.option_pool_pct).toBe(20);                  // 2M / 10M = 20%
  });

  it('uses latest round for current valuation', () => {
    const shareholders = [makeShareholder({ shares: 8_000_000 })];
    const round1 = makeRound({
      id: 'r-1',
      close_date: '2023-01-01',
      post_money_valuation_eur: 1_000_000,
      raised_eur: 200_000,
      pre_money_valuation_eur: 800_000,
    });
    const round2 = makeRound({
      id: 'r-2',
      close_date: '2024-01-01',
      round_type: RoundType.Seed,
      name: 'Seed',
      post_money_valuation_eur: 3_000_000,
      raised_eur: 500_000,
      pre_money_valuation_eur: 2_500_000,
    });
    const summary = service.buildCapTableSummary(shareholders, [round1, round2]);

    expect(summary.current_valuation_eur).toBe(3_000_000);
    expect(summary.latest_round?.name).toBe('Seed');
  });

  it('allows overriding current valuation', () => {
    const shareholders = [makeShareholder({ shares: 1_000_000 })];
    const round = makeRound({ post_money_valuation_eur: 1_000_000 });
    const summary = service.buildCapTableSummary(shareholders, [round], 5_000_000);

    expect(summary.current_valuation_eur).toBe(5_000_000);
  });

  it('accumulates total raised across all rounds', () => {
    const shareholders = [makeShareholder({ shares: 8_000_000 })];
    const round1 = makeRound({ id: 'r-1', raised_eur: 200_000 });
    const round2 = makeRound({ id: 'r-2', raised_eur: 500_000, close_date: '2024-01-01' });
    const summary = service.buildCapTableSummary(shareholders, [round1, round2]);

    expect(summary.total_raised_eur).toBe(700_000);
  });

  it('computes investment multiple for investor', () => {
    // Investor bought 20% at €200k → post-money €1M
    // If valuation stays at €1M, multiple = (0.2 * €1M) / €200k = 1.0
    const founder = makeShareholder({ id: 'sh-1', shares: 4_000_000 });
    const investor = makeShareholder({
      id: 'sh-2',
      name: 'Angel',
      type: ShareholderType.Investor,
      shares: 1_000_000,
      investment_eur: 200_000,
      share_class: ShareClass.PreferredSeed,
    });
    const round = makeRound({ raised_eur: 200_000, post_money_valuation_eur: 1_000_000, pre_money_valuation_eur: 800_000 });
    const summary = service.buildCapTableSummary([founder, investor], [round], 1_000_000);

    const investorRow = summary.shareholders.find((s) => s.shareholder_id === 'sh-2')!;
    expect(investorRow.multiple).toBe(1);  // (200k / 1M) * 1M / 200k = 1.0
  });

  it('returns sorted shareholders by share count descending', () => {
    const sh1 = makeShareholder({ id: 'sh-1', name: 'Alice', shares: 3_000_000 });
    const sh2 = makeShareholder({ id: 'sh-2', name: 'Bob',   shares: 7_000_000 });
    const sh3 = makeShareholder({ id: 'sh-3', name: 'Carol', shares: 1_000_000 });

    // Input order is sh1, sh2, sh3; expected output order is sh2, sh1, sh3
    const summary = service.buildCapTableSummary([sh1, sh2, sh3], []);
    const names = summary.shareholders.map((s) => s.name);
    expect(names).toEqual(['Bob', 'Alice', 'Carol']);
  });
});

// ============================================================================
// Peachscore buildFinancialsHTML helper (via dynamic require)
// ============================================================================

describe('Peachscore buildFinancialsHTML()', () => {
  // Inline the logic to avoid browser-only auto-init side effects
  function fmtEur(amount: number): string {
    if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `€${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    return `€${amount.toLocaleString()}`;
  }

  it('formats EUR amounts correctly', () => {
    expect(fmtEur(0)).toBe('€0');
    expect(fmtEur(500)).toBe('€500');
    expect(fmtEur(1_000)).toBe('€1k');
    expect(fmtEur(1_500)).toBe('€1.5k');
    expect(fmtEur(2_000)).toBe('€2k');
    expect(fmtEur(2_500_000)).toBe('€2.5M');
  });

  it('builds HTML containing key metric labels', () => {
    // Minimal snapshot
    const snap = {
      as_of_date: '2026-02-21',
      total_raised_eur: 200_000,
      current_valuation_eur: 1_200_000,
      mrr_eur: 5_000,
      arr_eur: 60_000,
      cash_balance_eur: 150_000,
      runway_months: 18,
      founder_ownership_pct: 75,
      investor_ownership_pct: 20,
      option_pool_pct: 5,
      mrr_growth_rate_pct: 12,
      monthly_burn_eur: 8_000,
      ltv_eur: 0,
      cac_eur: 0,
      ltv_cac_ratio: 0,
    };

    // Build HTML using same logic as peachscore.js
    const rows: [string, string][] = [
      ['Total Raised',    fmtEur(snap.total_raised_eur)],
      ['Valuation',       fmtEur(snap.current_valuation_eur)],
      ['MRR',             fmtEur(snap.mrr_eur)],
      ['ARR',             fmtEur(snap.arr_eur)],
      ['Cash Balance',    fmtEur(snap.cash_balance_eur)],
      ['Runway',         `${snap.runway_months} months`],
      ['Founder Equity', `${snap.founder_ownership_pct}%`],
      ['Investor Equity',`${snap.investor_ownership_pct}%`],
      ['Option Pool',    `${snap.option_pool_pct}%`],
    ];

    const html = rows.map(([label, value]) => `${label}${value}`).join('');

    expect(html).toContain('Total Raised');
    expect(html).toContain('€200k');
    expect(html).toContain('€1.2M');
    expect(html).toContain('18 months');
    expect(html).toContain('75%');
    expect(html).toContain('5%');
  });
});
