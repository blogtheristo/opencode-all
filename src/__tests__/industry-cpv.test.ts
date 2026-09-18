import { describe, expect, it } from 'vitest';
import {
  buildTedExpertCpvClause,
  cpvToIndustry,
  industryIdsCoveredByCpvMap,
  TED_SEARCH_CPV_CODES,
} from '../agents/data/industry-cpv.js';
import { INDUSTRIES_SERVED_TOTAL } from '../agents/data/industry-registry.js';
import {
  buildExpertQuery,
  buildV3SearchQuery,
  DEFAULT_QUERY_CONFIG,
  v3NoticeToTedNotice,
} from '../construction-leads/ted-api.js';

describe('industry CPV map', () => {
  it('covers all 25 canonical industries', () => {
    expect(industryIdsCoveredByCpvMap()).toEqual(
      Array.from({ length: INDUSTRIES_SERVED_TOTAL }, (_, i) => i + 1),
    );
  });

  it('maps known CPV prefixes to the expected industry', () => {
    expect(cpvToIndustry('45000000-7')?.id).toBe(8);
    expect(cpvToIndustry('24111600')?.id).toBe(25);
    expect(cpvToIndustry('34700000')?.id).toBe(5);
    expect(cpvToIndustry('66000000')?.id).toBe(20);
    expect(cpvToIndustry('90000000')?.id).toBe(10);
  });

  it('uses all-industry CPV parents and does not force works-only', () => {
    expect(DEFAULT_QUERY_CONFIG.cpvCodes).toEqual([...TED_SEARCH_CPV_CODES]);
    expect(DEFAULT_QUERY_CONFIG.worksOnly).toBe(false);
    const q = buildExpertQuery(DEFAULT_QUERY_CONFIG);
    expect(q).toContain('CPV=45000000');
    expect(q).toContain('CPV=24000000');
    expect(q).not.toContain('NC=1');
    expect(buildTedExpertCpvClause()).toContain('CPV=09300000');
  });

  it('keeps works-only when explicitly requested', () => {
    const q = buildExpertQuery({ ...DEFAULT_QUERY_CONFIG, worksOnly: true });
    expect(q).toContain('NC=1');
  });

  it('builds a TED v3 POST query (IN + ISO3 + publication-date>=)', () => {
    const q = buildV3SearchQuery(DEFAULT_QUERY_CONFIG);
    expect(q).toContain('classification-cpv IN (');
    expect(q).toContain('45000000');
    expect(q).toContain('buyer-country IN (');
    expect(q).toContain('FIN');
    expect(q).toMatch(/publication-date>=\d{8}/);
    expect(q).not.toContain('NC=1');
    expect(q).not.toContain('PD=[');
  });

  it('maps a TED v3 notice payload into the legacy TedNotice shape', () => {
    const notice = v3NoticeToTedNotice({
      'publication-number': '626124-2026',
      'notice-title': { eng: 'Finland – Electrical installation work' },
      'buyer-name': { fin: ['Vantaan kaupunki'] },
      'buyer-country': ['FIN'],
      'classification-cpv': ['45310000'],
      'publication-date': '2026-09-11+02:00',
    });
    expect(notice.ND).toBe('626124-2026');
    expect(notice.AA).toBe('Vantaan kaupunki');
    expect(notice.CY).toBe('FI');
    expect(notice.CPV).toBe('45310000');
    expect(notice.TI).toContain('Electrical installation');
  });
});
