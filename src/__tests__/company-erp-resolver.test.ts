/**
 * DWS IQ 6 - Company ERP Resolver Tests
 *
 * Verifies company → ERP provider mapping for Nordic construction companies.
 */

import { describe, expect, it } from 'vitest';
import {
  listRegisteredCompanies,
  resolveCompanyERP,
  resolveCompanyERPBatch,
} from '../integrations/erp/company-erp-resolver';
import { ERPProvider } from '../integrations/erp/types';
import { resolveErpForBuyer } from '../construction-leads/company-erp-resolver.js';

describe('Company ERP Resolver', () => {
  describe('resolveCompanyERP', () => {
    it('Skanska AB → SAP (exact match)', () => {
      const result = resolveCompanyERP('Skanska AB');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.SAP);
      expect(result.matchType).toBe('exact');
    });

    it('NCC Building → SAP (exact match)', () => {
      const result = resolveCompanyERP('NCC Building');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.SAP);
      expect(result.matchType).toBe('exact');
    });

    it('Sweco Finland → IFS (exact match)', () => {
      const result = resolveCompanyERP('Sweco Finland');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.IFS);
      expect(result.matchType).toBe('exact');
    });

    it('SRV Rakennus → Visma (exact match)', () => {
      const result = resolveCompanyERP('SRV Rakennus');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.VISMA);
      expect(result.matchType).toBe('exact');
    });

    it('Random Corp → null (unknown company)', () => {
      const result = resolveCompanyERP('Random Corp');
      expect(result.found).toBe(false);
      expect(result.erpProvider).toBeNull();
      expect(result.warning).toContain('Random Corp');
      expect(result.warning).toContain('Tarkista käsin');
    });

    it('case-insensitive exact match', () => {
      const result = resolveCompanyERP('skanska ab');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.SAP);
    });

    it('alias match: "ncc" → SAP', () => {
      const result = resolveCompanyERP('ncc');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.SAP);
      expect(result.matchType).toBe('alias');
    });

    it('alias match: "srv" → Visma', () => {
      const result = resolveCompanyERP('srv');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.VISMA);
      expect(result.matchType).toBe('alias');
    });

    it('alias match: "sweco" → IFS', () => {
      const result = resolveCompanyERP('sweco');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.IFS);
      expect(result.matchType).toBe('alias');
    });

    it('trims whitespace', () => {
      const result = resolveCompanyERP('  Skanska AB  ');
      expect(result.found).toBe(true);
      expect(result.erpProvider).toBe(ERPProvider.SAP);
    });
  });

  describe('resolveCompanyERPBatch', () => {
    it('resolves all 5 companies correctly', () => {
      const results = resolveCompanyERPBatch([
        'Skanska AB',
        'NCC Building',
        'Sweco Finland',
        'SRV Rakennus',
        'Random Corp',
      ]);

      expect(results).toHaveLength(5);
      expect(results[0].erpProvider).toBe(ERPProvider.SAP);
      expect(results[1].erpProvider).toBe(ERPProvider.SAP);
      expect(results[2].erpProvider).toBe(ERPProvider.IFS);
      expect(results[3].erpProvider).toBe(ERPProvider.VISMA);
      expect(results[4].erpProvider).toBeNull();
      expect(results[4].found).toBe(false);
    });
  });

  describe('listRegisteredCompanies', () => {
    it('returns all registered companies', () => {
      const companies = listRegisteredCompanies();
      expect(companies.length).toBeGreaterThanOrEqual(4);
      expect(companies.map((c) => c.name)).toContain('Skanska AB');
      expect(companies.map((c) => c.name)).toContain('SRV Rakennus');
    });

    it('returns a copy (not the original array)', () => {
      const a = listRegisteredCompanies();
      const b = listRegisteredCompanies();
      expect(a).not.toBe(b);
    });
  });

  describe('resolveErpForBuyer', () => {
    it('matches known contractor patterns', () => {
      expect(resolveErpForBuyer('STRABAG AG', 'DE')).toBe('SAP');
      expect(resolveErpForBuyer('Skanska Sverige', 'SE')).toBe('IFS');
    });

    it('falls back to country hint', () => {
      expect(resolveErpForBuyer('Some Municipality', 'FI')).toBe('IFS');
    });

    it('returns unknown when no signal', () => {
      expect(resolveErpForBuyer('Obscure Buyer Ltd', 'ZZ')).toBe('unknown');
    });
  });
});
