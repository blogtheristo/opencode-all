import { describe, expect, it } from 'vitest';
import { buyerOrgIndustry, noticeToLead } from '../construction-leads/lead-processor.js';
import {
  noticeToSalesOutreachItem,
  storedRowToSalesOutreachItem,
  toSalesOutreachTedItem,
} from '../construction-leads/sales-queue.js';
import type { TedNotice } from '../construction-leads/types.js';

describe('sales-outreach TED queue mapper', () => {
  it('maps a TED notice into an MC Sales item', () => {
    const notice: TedNotice = {
      ND: '2026/S 038-123456',
      PD: '20260917',
      TI: 'Hospital energy retrofit',
      AA: 'HUS',
      CY: 'FI',
      CPV: '45000000',
    };
    const item = noticeToSalesOutreachItem(notice);
    expect(item.centre).toBe('sales');
    expect(item.source).toBe('ted');
    expect(item.status).toBe('ted_lead');
    expect(item.id).toBe('ted:2026/S 038-123456');
    expect(item.title).toBe('HUS · Construction & Buildings');
    expect(item.nextAction).toBe('Hospital energy retrofit');
    expect(item.country).toBe('FI');
    expect(item.cpv).toBe('45000000');
    expect(item.noDemoEnv).toBe(true);
    expect(item.tedUrl).toContain('2026%2FS%20038-123456');
  });

  it('falls back to TED buyer when the notice has no contracting authority', () => {
    const item = toSalesOutreachTedItem({
      id: 'n-1',
      title: 'Untitled works',
      buyerName: null,
      tedUrl: null,
      cpv: null,
      country: 'SE',
    });
    expect(item.title).toBe('TED buyer');
    expect(item.nextAction).toBe('Untitled works');
    expect(item.country).toBe('SE');
  });

  it('reads industryName from stored construction_leads raw_data', () => {
    const item = storedRowToSalesOutreachItem({
      id: 'uuid-1',
      title: 'Framework for district heating',
      buyer_name: 'Helen Oy',
      country_code: 'FI',
      cpv_code: '09300000',
      ted_url: 'https://ted.europa.eu/en/notice/-/detail/x',
      raw_data: { industryName: 'Energy' },
    });
    expect(item.id).toBe('ted:uuid-1');
    expect(item.title).toBe('Helen Oy · Energy');
    expect(item.nextAction).toBe('Framework for district heating');
  });

  it('sets outreach_orgs industry from mapped CPV, not construction-only', () => {
    const lead = noticeToLead({
      ND: 'n-health',
      PD: '20260911',
      TI: 'Hospital MRI framework',
      AA: 'HUS',
      CY: 'FI',
      CPV: '33100000',
    });
    expect(buyerOrgIndustry(lead)).toBe('Healthcare');
    expect(buyerOrgIndustry({ ...lead, raw_data: {} })).toBe('Construction / Public Sector');
  });
});
