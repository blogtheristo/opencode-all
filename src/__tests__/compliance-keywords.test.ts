import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  matchComplianceKeywords,
  passesComplianceFilter,
} from '../construction-leads/compliance-keywords.js';
import type { TedNotice } from '../construction-leads/types.js';

describe('compliance keywords', () => {
  const base: TedNotice = {
    ND: 'test-1',
    PD: '2026-01-01',
    TI: 'Hospital renovation with energy efficiency and climate targets',
    CPV: '45200000',
  };

  beforeEach(() => {
    delete process.env.TED_COMPLIANCE_FILTER;
  });

  afterEach(() => {
    delete process.env.TED_COMPLIANCE_FILTER;
  });

  it('matches climate/energy stems', () => {
    const hits = matchComplianceKeywords(base);
    expect(hits.length).toBeGreaterThan(0);
    expect(passesComplianceFilter(base)).toBe(true);
  });

  it('strict mode excludes unrelated titles', () => {
    const plain: TedNotice = {
      ...base,
      TI: 'Paint fence',
    };
    process.env.TED_COMPLIANCE_FILTER = 'strict';
    expect(passesComplianceFilter(plain)).toBe(false);
  });

  it('off mode includes all', () => {
    process.env.TED_COMPLIANCE_FILTER = 'off';
    const plain: TedNotice = { ...base, TI: 'Paint fence' };
    expect(passesComplianceFilter(plain)).toBe(true);
  });
});
