/**
 * DWS IQ 6 - ERP Company Registry Tests
 *
 * Validates company→ERP resolution for Nordic construction companies.
 */

import { describe, expect, it } from 'vitest';
import {
  COMPANY_ERP_REGISTRY,
  getAllRegisteredCompanies,
  getCompaniesByProvider,
  resolveCompanyERP,
  resolveCompanyERPBatch,
} from '../integrations/erp/company-registry';
import { ERPProvider } from '../integrations/erp/types';

describe('ERP Company Registry', () => {
  // ==========================================================================
  // Required test cases from task specification
  // ==========================================================================

  describe('required mappings', () => {
    it('Skanska AB → SAP', () => {
      const result = resolveCompanyERP('Skanska AB');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.SAP);
      expect(result.company?.companyName).toBe('Skanska AB');
      expect(result.confidence).toBe('exact');
    });

    it('NCC Building → SAP', () => {
      const result = resolveCompanyERP('NCC Building');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.SAP);
      expect(result.company?.companyName).toBe('NCC Building');
    });

    it('Sweco Finland → IFS', () => {
      const result = resolveCompanyERP('Sweco Finland');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.IFS);
      expect(result.company?.companyName).toBe('Sweco Finland');
    });

    it('SRV Rakennus → Visma', () => {
      const result = resolveCompanyERP('SRV Rakennus');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.VISMA);
      expect(result.company?.companyName).toBe('SRV Rakennus');
    });

    it('Random Corp → null (unknown, manual check)', () => {
      const result = resolveCompanyERP('Random Corp');
      expect(result.found).toBe(false);
      expect(result.provider).toBeNull();
      expect(result.company).toBeNull();
      expect(result.confidence).toBe('none');
    });
  });

  // ==========================================================================
  // Matching confidence levels
  // ==========================================================================

  describe('confidence levels', () => {
    it('exact match on canonical name', () => {
      const result = resolveCompanyERP('Skanska AB');
      expect(result.confidence).toBe('exact');
    });

    it('alias match', () => {
      const result = resolveCompanyERP('skanska');
      expect(result.confidence).toBe('alias');
      expect(result.provider).toBe(ERPProvider.SAP);
    });

    it('fuzzy substring match', () => {
      const result = resolveCompanyERP('Skanska AB Sverige');
      expect(result.found).toBe(true);
      expect(result.confidence).toBe('fuzzy');
      expect(result.provider).toBe(ERPProvider.SAP);
    });

    it('returns none for completely unknown company', () => {
      const result = resolveCompanyERP('Acme Corporation');
      expect(result.confidence).toBe('none');
      expect(result.found).toBe(false);
    });
  });

  // ==========================================================================
  // Case insensitivity & normalization
  // ==========================================================================

  describe('normalization', () => {
    it('case-insensitive matching', () => {
      const result = resolveCompanyERP('ncc building');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.SAP);
    });

    it('handles extra whitespace', () => {
      const result = resolveCompanyERP('  SRV  Rakennus  ');
      expect(result.found).toBe(true);
      expect(result.provider).toBe(ERPProvider.VISMA);
    });

    it('empty string returns not found', () => {
      const result = resolveCompanyERP('');
      expect(result.found).toBe(false);
      expect(result.confidence).toBe('none');
    });
  });

  // ==========================================================================
  // Batch resolution
  // ==========================================================================

  describe('batch resolution', () => {
    it('resolves all 5 required companies in batch', () => {
      const results = resolveCompanyERPBatch([
        'Skanska AB',
        'NCC Building',
        'Sweco Finland',
        'SRV Rakennus',
        'Random Corp',
      ]);

      expect(results).toHaveLength(5);
      expect(results[0].provider).toBe(ERPProvider.SAP);    // Skanska → SAP
      expect(results[1].provider).toBe(ERPProvider.SAP);    // NCC → SAP
      expect(results[2].provider).toBe(ERPProvider.IFS);    // Sweco → IFS
      expect(results[3].provider).toBe(ERPProvider.VISMA);  // SRV → Visma
      expect(results[4].provider).toBeNull();                // Random → null
    });
  });

  // ==========================================================================
  // Provider listing
  // ==========================================================================

  describe('provider listing', () => {
    it('lists SAP customers', () => {
      const companies = getCompaniesByProvider(ERPProvider.SAP);
      expect(companies.length).toBeGreaterThanOrEqual(2);
      expect(companies.map((c) => c.companyName)).toContain('Skanska AB');
      expect(companies.map((c) => c.companyName)).toContain('NCC Building');
    });

    it('lists IFS customers', () => {
      const companies = getCompaniesByProvider(ERPProvider.IFS);
      expect(companies.length).toBeGreaterThanOrEqual(1);
      expect(companies.map((c) => c.companyName)).toContain('Sweco Finland');
    });

    it('lists Visma customers', () => {
      const companies = getCompaniesByProvider(ERPProvider.VISMA);
      expect(companies.length).toBeGreaterThanOrEqual(1);
      expect(companies.map((c) => c.companyName)).toContain('SRV Rakennus');
    });
  });

  // ==========================================================================
  // Registry integrity
  // ==========================================================================

  describe('registry integrity', () => {
    it('all entries have required fields', () => {
      for (const entry of COMPANY_ERP_REGISTRY) {
        expect(entry.companyName).toBeTruthy();
        expect(entry.provider).toBeTruthy();
        expect(entry.country).toBeTruthy();
        expect(entry.sector).toBeTruthy();
        expect(entry.source).toBeTruthy();
        expect(Array.isArray(entry.aliases)).toBe(true);
        expect(entry.aliases.length).toBeGreaterThan(0);
      }
    });

    it('getAllRegisteredCompanies returns all entries', () => {
      const all = getAllRegisteredCompanies();
      expect(all.length).toBe(COMPANY_ERP_REGISTRY.length);
    });

    it('returns a copy, not a reference', () => {
      const all = getAllRegisteredCompanies();
      all.pop();
      expect(getAllRegisteredCompanies().length).toBe(COMPANY_ERP_REGISTRY.length);
    });
  });
});
