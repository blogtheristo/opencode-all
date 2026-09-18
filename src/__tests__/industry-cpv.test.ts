import { describe, expect, it } from 'vitest';
import {
  TED_SEARCH_CPV_CODES,
  buildTedExpertCpvClause,
  cpvToIndustry,
  industryIdsCoveredByCpvMap,
} from '../agents/data/industry-cpv.js';
import { INDUSTRIES_SERVED_TOTAL } from '../agents/data/industry-registry.js';
import { buildExpertQuery, DEFAULT_QUERY_CONFIG } from '../construction-leads/ted-api.js';

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
});
