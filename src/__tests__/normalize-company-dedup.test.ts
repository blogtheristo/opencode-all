import { describe, expect, it } from 'vitest';
import { normalizeCompanyNameForDedup } from '../construction-leads/lead-processor.js';

describe('normalizeCompanyNameForDedup', () => {
  it('trims whitespace', () => {
    expect(normalizeCompanyNameForDedup('  Acme Oy  ')).toBe('Acme Oy');
  });

  it('maps null/undefined to empty string for composite key', () => {
    expect(normalizeCompanyNameForDedup(null)).toBe('');
    expect(normalizeCompanyNameForDedup(undefined)).toBe('');
  });
});
