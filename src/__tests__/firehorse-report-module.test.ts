/**
 * Firehorse Report Module Tests
 *
 * Tests for FirehorseReportModule: report generation logic and markdown conversion.
 * Supabase calls are mocked — these are pure unit tests of business logic.
 */

import { describe, expect, it, vi } from 'vitest';
import type { GeneratedReport, ReportSection } from '../firehorse/report-module.js';

// ============================================================================
// Mock Supabase (report-module calls it to persist reports)
// ============================================================================
vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => null, // No persistence in unit tests
}));

// ============================================================================
// Mock compliance/scoring-engine to return deterministic values
// ============================================================================
vi.mock('../compliance/scoring-engine.js', () => ({
  scoreCompliance: (_input: unknown) => ({
    overallScore: 72,
    complianceStatus: 'partially-compliant',
    dataCompleteness: 45,
    gaps: [
      { id: 'CSRD-1', description: 'Missing transition plan', priority: 'HIGH' },
      { id: 'CBAM-1', description: 'No embedded emissions data', priority: 'MEDIUM' },
    ],
    recommendations: ['Implement transition plan', 'Install emissions monitoring'],
    costBreakdown: { csrd: 0, ets: 3250000, cbam: 65000 },
  }),
}));

// ============================================================================
// Mock ETS and CBAM calculators
// ============================================================================
vi.mock('../compliance/ets-calculator.js', () => ({
  estimateETSCost: (_tonnes: number, _free: number) => ({
    estimatedCost: 3250000,
    surrenderObligation: 50000,
  }),
}));

vi.mock('../compliance/cbam-calculator.js', () => ({
  estimateCBAMCost: (_tonnes: number, _industry: string) => ({
    estimatedCost: 65000,
    embeddedEmissions: 1328,
    covered: true,
  }),
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// ============================================================================
// Import after mocks are registered
// ============================================================================
const { FirehorseReportModule } = await import('../firehorse/report-module.js');

// ============================================================================
// Helper: build a minimal GeneratedReport for toMarkdown tests
// ============================================================================
function makeReport(overrides: Partial<GeneratedReport> = {}): GeneratedReport {
  return {
    id: 'rpt-test-001',
    format: 'compliance-summary',
    title: 'EU Regulatory Compliance Assessment',
    organizationId: 'org-test',
    period: { start: '2025-01-01', end: '2025-12-31' },
    generatedAt: '2026-04-16T10:00:00.000Z',
    sections: [],
    metadata: {
      dataSourceCount: 3,
      complianceScore: 72,
      industry: 'manufacturing',
      currency: 'EUR',
    },
    ...overrides,
  };
}

// ============================================================================
// toMarkdown tests — pure synchronous, no mocks needed beyond the object
// ============================================================================

describe('FirehorseReportModule.toMarkdown', () => {
  it('includes report title as H1', () => {
    const md = FirehorseReportModule.toMarkdown(makeReport());
    expect(md).toContain('# EU Regulatory Compliance Assessment');
  });

  it('includes organization ID', () => {
    const md = FirehorseReportModule.toMarkdown(makeReport());
    expect(md).toContain('org-test');
  });

  it('includes compliance score when present', () => {
    const md = FirehorseReportModule.toMarkdown(makeReport());
    expect(md).toContain('72/100');
  });

  it('omits compliance score line when null', () => {
    const md = FirehorseReportModule.toMarkdown(
      makeReport({
        metadata: { dataSourceCount: 1, complianceScore: null, industry: 'steel', currency: 'EUR' },
      }),
    );
    expect(md).not.toContain('/100');
  });

  it('renders KPI section with bullet list', () => {
    const sections: ReportSection[] = [
      {
        title: 'Compliance Score',
        type: 'kpi',
        data: { overallScore: 72, complianceStatus: 'partially-compliant' },
      },
    ];
    const md = FirehorseReportModule.toMarkdown(makeReport({ sections }));
    expect(md).toContain('## Compliance Score');
    expect(md).toContain('**overallScore:** 72');
    expect(md).toContain('**complianceStatus:** partially-compliant');
  });

  it('renders text section with summary and action items', () => {
    const sections: ReportSection[] = [
      {
        title: 'Executive Summary',
        type: 'text',
        data: {
          summary: 'Board summary text.',
          actionItems: ['Item A', 'Item B'],
        },
      },
    ];
    const md = FirehorseReportModule.toMarkdown(makeReport({ sections }));
    expect(md).toContain('Board summary text.');
    expect(md).toContain('- Item A');
    expect(md).toContain('- Item B');
  });

  it('renders table section, skipping raw array keys', () => {
    const sections: ReportSection[] = [
      {
        title: 'ETS Cost',
        type: 'table',
        data: {
          annualCost: 3250000,
          currency: 'EUR',
          operations: [{ id: '1' }, { id: '2' }], // should be skipped
        },
      },
    ];
    const md = FirehorseReportModule.toMarkdown(makeReport({ sections }));
    expect(md).toContain('**annualCost:** 3250000');
    expect(md).not.toContain('"id"');
  });

  it('renders summary section', () => {
    const sections: ReportSection[] = [
      {
        title: 'ESRS Status',
        type: 'summary',
        data: { mandatoryDisclosures: 82, disclosuresCovered: 59, gaps: 23 },
      },
    ];
    const md = FirehorseReportModule.toMarkdown(makeReport({ sections }));
    expect(md).toContain('**mandatoryDisclosures:** 82');
    expect(md).toContain('**gaps:** 23');
  });

  it('includes DWS footer', () => {
    const md = FirehorseReportModule.toMarkdown(makeReport());
    expect(md).toContain('Firehorse Report Module');
    expect(md).toContain('Lifetime Oy');
  });
});

// ============================================================================
// generate() tests — async, uses mocked scoring + calculators
// ============================================================================

describe('FirehorseReportModule.generate', () => {
  const baseRequest = {
    organizationId: 'org-test',
    format: 'compliance-summary' as const,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    industry: 'manufacturing',
  };

  it('returns a report with correct format and title', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    expect(report.format).toBe('compliance-summary');
    expect(report.title).toBe('EU Regulatory Compliance Assessment');
    expect(report.organizationId).toBe('org-test');
  });

  it('generates a unique ID for each report', async () => {
    const r1 = await FirehorseReportModule.generate(baseRequest);
    const r2 = await FirehorseReportModule.generate(baseRequest);
    expect(r1.id).not.toBe(r2.id);
    expect(r1.id).toMatch(/^rpt-/);
  });

  it('sets period from request', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    expect(report.period.start).toBe('2025-01-01');
    expect(report.period.end).toBe('2025-12-31');
  });

  it('includes compliance score section', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    const kpi = report.sections.find((s) => s.type === 'kpi');
    expect(kpi).toBeDefined();
    expect(kpi?.data.overallScore).toBe(72);
  });

  it('includes ETS cost section', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    const ets = report.sections.find((s) => s.title === 'EU ETS Cost Exposure');
    expect(ets).toBeDefined();
    expect(ets?.data.annualCost).toBe(3250000);
  });

  it('includes CBAM section', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    const cbam = report.sections.find((s) => s.title === 'CBAM Import Exposure');
    expect(cbam).toBeDefined();
    expect(cbam?.data.sectorCovered).toBe(true);
  });

  it('marks sections as ESTIMATE when no orgData provided', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    const kpi = report.sections.find((s) => s.type === 'kpi');
    expect(kpi?.title).toContain('ESTIMATE');
    expect(kpi?.data.dataQuality).toBe('ESTIMATE');
  });

  it('does not mark as ESTIMATE when orgData provided', async () => {
    const report = await FirehorseReportModule.generate({
      ...baseRequest,
      orgData: {
        annualEmissions: 12000,
        importValue: 800000,
        hasTransitionPlan: true,
        hasEmissionsMonitoring: true,
        hasSupplyChainDD: false,
      },
    });
    const kpi = report.sections.find((s) => s.type === 'kpi');
    expect(kpi?.title).not.toContain('ESTIMATE');
    expect(kpi?.data.dataQuality).toBe('ORG_DATA');
  });

  it('includes executive summary for board-pack format', async () => {
    const report = await FirehorseReportModule.generate({
      ...baseRequest,
      format: 'board-pack',
    });
    const summary = report.sections.find((s) => s.title === 'Executive Summary');
    expect(summary).toBeDefined();
    expect(summary?.data.summary).toContain('manufacturing');
  });

  it('includes ESRS section for annual-report format', async () => {
    const report = await FirehorseReportModule.generate({
      ...baseRequest,
      format: 'annual-report',
    });
    const esrs = report.sections.find((s) => s.title === 'ESRS Disclosure Status');
    expect(esrs).toBeDefined();
    expect(esrs?.data.mandatoryDisclosures).toBe(82);
  });

  it('respects currency option', async () => {
    const report = await FirehorseReportModule.generate({
      ...baseRequest,
      options: { currency: 'SEK' },
    });
    expect(report.metadata.currency).toBe('SEK');
    const ets = report.sections.find((s) => s.title === 'EU ETS Cost Exposure');
    expect(ets?.data.currency).toBe('SEK');
  });

  it('metadata contains expected fields', async () => {
    const report = await FirehorseReportModule.generate(baseRequest);
    expect(report.metadata.industry).toBe('manufacturing');
    expect(typeof report.metadata.dataSourceCount).toBe('number');
    expect(report.metadata.dataSourceCount).toBeGreaterThan(0);
  });
});

// ============================================================================
// listReports tests — mocked Supabase returns null → empty array
// ============================================================================

describe('FirehorseReportModule.listReports', () => {
  it('returns empty array when Supabase unavailable', async () => {
    const reports = await FirehorseReportModule.listReports('org-test');
    expect(reports).toEqual([]);
  });
});
