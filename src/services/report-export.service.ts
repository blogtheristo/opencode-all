/**
 * Report Export Service
 *
 * Generates downloadable compliance reports in JSON and CSV formats.
 * Supports scheduled report generation for recurring regulatory filings.
 *
 * MVP Feature 3 — Compliance Report Export & Scheduling
 */

import logger from '../utils/logger.js';
import { scoreCompliance, type ComplianceScoringInput } from '../compliance/scoring-engine.js';
import { generateReport } from '../compliance/report-generator.js';

export interface ExportRequest {
  companyName: string;
  industry: string;
  country: string;
  format: 'json' | 'csv';
  includeGaps?: boolean;
  includeRecommendations?: boolean;
}

export interface ScheduleConfig {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  country: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  format: 'json' | 'csv';
  recipientEmail: string;
  nextRunAt: string;
  enabled: boolean;
  createdAt: string;
}

export interface ExportResult {
  filename: string;
  contentType: string;
  data: string;
  generatedAt: string;
  recordCount: number;
}

// In-memory schedule store (production: Supabase table)
const schedules = new Map<string, ScheduleConfig>();

// Convert a compliance report object to CSV
function reportToCSV(report: any): string {
  const lines: string[] = [];

  // Header section
  lines.push('DWS IQ Compliance Report');
  lines.push(`Company,${csvEscape(report.company?.name || '')}`);
  lines.push(`Industry,${csvEscape(report.company?.industry || '')}`);
  lines.push(`Country,${csvEscape(report.company?.country || '')}`);
  lines.push(`Generated,${report.generatedAt || new Date().toISOString()}`);
  lines.push(`Overall Score,${report.scores?.overall ?? ''}`);
  lines.push('');

  // Regulation scores
  lines.push('Regulation,Score,Status,Risk Level');
  if (report.scores?.regulations) {
    for (const [reg, data] of Object.entries(report.scores.regulations)) {
      const d = data as any;
      lines.push(
        `${csvEscape(reg)},${d.score ?? ''},${csvEscape(d.status || '')},${csvEscape(d.riskLevel || '')}`,
      );
    }
  }
  lines.push('');

  // Gaps
  if (report.gaps && report.gaps.length > 0) {
    lines.push('Gap ID,Regulation,Description,Priority,Effort');
    for (const gap of report.gaps) {
      lines.push(
        `${csvEscape(gap.id || '')},${csvEscape(gap.regulation || '')},${csvEscape(gap.description || '')},${csvEscape(gap.priority || '')},${csvEscape(gap.effort || '')}`,
      );
    }
    lines.push('');
  }

  // Recommendations
  if (report.recommendations && report.recommendations.length > 0) {
    lines.push('Recommendation,Category,Impact');
    for (const rec of report.recommendations) {
      lines.push(
        `${csvEscape(rec.text || rec.description || '')},${csvEscape(rec.category || '')},${csvEscape(rec.impact || '')}`,
      );
    }
  }

  return lines.join('\n');
}

function csvEscape(value: string): string {
  if (!value) return '';
  // Escape values containing commas, quotes, or newlines
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export const ReportExportService = {
  /**
   * Generate and export a compliance report.
   */
  async generateExport(input: ExportRequest): Promise<ExportResult> {
    const { companyName, industry, country, format, includeGaps = true, includeRecommendations = true } = input;

    logger.info('Generating compliance export', { companyName, industry, format });

    // Run compliance scoring
    const scoringInput: ComplianceScoringInput = {
      industry,
      dataPoints: [],
      annualEmissions: 0,
      importValue: 0,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: false,
      hasSupplyChainDD: false,
    };

    const result = scoreCompliance(scoringInput);
    const report = generateReport(result, { name: companyName, industry, country });

    // Filter content based on options
    const exportData: any = { ...report };
    if (!includeGaps) delete exportData.gaps;
    if (!includeRecommendations) delete exportData.recommendations;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    if (format === 'csv') {
      const csv = reportToCSV(exportData);
      return {
        filename: `dws-compliance-${companyName.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: csv,
        generatedAt: now.toISOString(),
        recordCount: (exportData.gaps?.length || 0) + (exportData.recommendations?.length || 0),
      };
    }

    // JSON format
    const json = JSON.stringify(exportData, null, 2);
    return {
      filename: `dws-compliance-${companyName.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.json`,
      contentType: 'application/json; charset=utf-8',
      data: json,
      generatedAt: now.toISOString(),
      recordCount: (exportData.gaps?.length || 0) + (exportData.recommendations?.length || 0),
    };
  },

  /**
   * Create a scheduled report configuration.
   */
  async createSchedule(
    userId: string,
    config: Omit<ScheduleConfig, 'id' | 'userId' | 'createdAt' | 'nextRunAt'>,
  ): Promise<ScheduleConfig> {
    const id = `sched_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();

    // Calculate next run based on frequency
    const nextRun = new Date(now);
    switch (config.frequency) {
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(1);
        break;
      case 'quarterly':
        nextRun.setMonth(nextRun.getMonth() + 3);
        nextRun.setDate(1);
        break;
      case 'annually':
        nextRun.setFullYear(nextRun.getFullYear() + 1);
        nextRun.setMonth(0);
        nextRun.setDate(1);
        break;
    }

    const schedule: ScheduleConfig = {
      id,
      userId,
      companyName: config.companyName,
      industry: config.industry,
      country: config.country,
      frequency: config.frequency,
      format: config.format,
      recipientEmail: config.recipientEmail,
      nextRunAt: nextRun.toISOString(),
      enabled: config.enabled,
      createdAt: now.toISOString(),
    };

    schedules.set(id, schedule);
    logger.info('Report schedule created', { userId, scheduleId: id, frequency: config.frequency });

    return schedule;
  },

  /**
   * List schedules for a user.
   */
  async listSchedules(userId: string): Promise<ScheduleConfig[]> {
    return Array.from(schedules.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  /**
   * Delete a schedule.
   */
  async deleteSchedule(userId: string, scheduleId: string): Promise<boolean> {
    const schedule = schedules.get(scheduleId);
    if (!schedule || schedule.userId !== userId) return false;

    schedules.delete(scheduleId);
    logger.info('Report schedule deleted', { userId, scheduleId });
    return true;
  },

  /**
   * Toggle schedule enabled/disabled.
   */
  async toggleSchedule(userId: string, scheduleId: string): Promise<ScheduleConfig | null> {
    const schedule = schedules.get(scheduleId);
    if (!schedule || schedule.userId !== userId) return null;

    schedule.enabled = !schedule.enabled;
    logger.info('Report schedule toggled', { userId, scheduleId, enabled: schedule.enabled });
    return schedule;
  },
};

export default ReportExportService;
