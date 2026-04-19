/**
 * Report Export Service
 *
 * Generates downloadable compliance reports in JSON and CSV formats.
 * Supports scheduled report generation for recurring regulatory filings.
 *
 * Storage: Supabase `report_schedules` table (migration 043).
 * Falls back to in-memory when Supabase is unavailable.
 *
 * MVP Feature 3 — Compliance Report Export & Scheduling
 */

import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { type ComplianceScoringInput, scoreCompliance } from '../compliance/scoring-engine.js';
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

// In-memory fallback store
const memSchedules = new Map<string, ScheduleConfig>();

function reportToCSV(report: any): string {
  const lines: string[] = [];

  lines.push('DWS IQ Compliance Report');
  lines.push(`Company,${csvEscape(report.company?.name || '')}`);
  lines.push(`Industry,${csvEscape(report.company?.industry || '')}`);
  lines.push(`Country,${csvEscape(report.company?.country || '')}`);
  lines.push(`Generated,${report.generatedAt || new Date().toISOString()}`);
  lines.push(`Overall Score,${report.scores?.overall ?? ''}`);
  lines.push('');

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

  if (report.gaps && report.gaps.length > 0) {
    lines.push('Gap ID,Regulation,Description,Priority,Effort');
    for (const gap of report.gaps) {
      lines.push(
        `${csvEscape(gap.id || '')},${csvEscape(gap.regulation || '')},${csvEscape(gap.description || '')},${csvEscape(gap.priority || '')},${csvEscape(gap.effort || '')}`,
      );
    }
    lines.push('');
  }

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
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function computeNextRun(frequency: string): Date {
  const next = new Date();
  switch (frequency) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      next.setDate(1);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      next.setMonth(0);
      next.setDate(1);
      break;
  }
  return next;
}

// Map Supabase row to ScheduleConfig
function rowToSchedule(row: any): ScheduleConfig {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    industry: row.industry,
    country: row.country,
    frequency: row.frequency,
    format: row.format,
    recipientEmail: row.recipient_email,
    nextRunAt: row.next_run_at,
    enabled: row.enabled,
    createdAt: row.created_at,
  };
}

export const ReportExportService = {
  async generateExport(input: ExportRequest): Promise<ExportResult> {
    const { companyName, industry, country, format, includeGaps = true, includeRecommendations = true } = input;

    logger.info('Generating compliance export', { companyName, industry, format });

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

    const exportData: any = { ...report };
    if (!includeGaps) delete exportData.gaps;
    if (!includeRecommendations) delete exportData.recommendations;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const slug = companyName.toLowerCase().replace(/\s+/g, '-');

    if (format === 'csv') {
      const csv = reportToCSV(exportData);
      return {
        filename: `dws-compliance-${slug}-${dateStr}.csv`,
        contentType: 'text/csv; charset=utf-8',
        data: csv,
        generatedAt: now.toISOString(),
        recordCount: (exportData.gaps?.length || 0) + (exportData.recommendations?.length || 0),
      };
    }

    const json = JSON.stringify(exportData, null, 2);
    return {
      filename: `dws-compliance-${slug}-${dateStr}.json`,
      contentType: 'application/json; charset=utf-8',
      data: json,
      generatedAt: now.toISOString(),
      recordCount: (exportData.gaps?.length || 0) + (exportData.recommendations?.length || 0),
    };
  },

  async createSchedule(
    userId: string,
    config: Omit<ScheduleConfig, 'id' | 'userId' | 'createdAt' | 'nextRunAt'>,
  ): Promise<ScheduleConfig> {
    const nextRun = computeNextRun(config.frequency);
    const now = new Date().toISOString();

    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('report_schedules')
        .insert({
          user_id: userId,
          company_name: config.companyName,
          industry: config.industry,
          country: config.country,
          frequency: config.frequency,
          format: config.format,
          recipient_email: config.recipientEmail,
          next_run_at: nextRun.toISOString(),
          enabled: config.enabled,
        })
        .select()
        .single();

      if (error) {
        logger.error('Report schedule insert failed', { error: error.message });
        throw new Error('Failed to create report schedule');
      }

      logger.info('Report schedule created', { userId, scheduleId: data.id, frequency: config.frequency });
      return rowToSchedule(data);
    }

    // In-memory fallback
    const id = `sched_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
      createdAt: now,
    };

    memSchedules.set(id, schedule);
    logger.info('Report schedule created (in-memory)', { userId, scheduleId: id });
    return schedule;
  },

  async listSchedules(userId: string): Promise<ScheduleConfig[]> {
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('report_schedules')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Report schedule list failed', { error: error.message });
        return [];
      }

      return (data || []).map(rowToSchedule);
    }

    // In-memory fallback
    return Array.from(memSchedules.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async deleteSchedule(userId: string, scheduleId: string): Promise<boolean> {
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('report_schedules')
        .delete()
        .eq('id', scheduleId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) return false;
      logger.info('Report schedule deleted', { userId, scheduleId });
      return true;
    }

    // In-memory fallback
    const schedule = memSchedules.get(scheduleId);
    if (!schedule || schedule.userId !== userId) return false;
    memSchedules.delete(scheduleId);
    logger.info('Report schedule deleted (in-memory)', { userId, scheduleId });
    return true;
  },

  async toggleSchedule(userId: string, scheduleId: string): Promise<ScheduleConfig | null> {
    const sb = getSupabaseClient();

    if (sb) {
      // Get current state
      const { data: current } = await sb
        .from('report_schedules')
        .select('enabled')
        .eq('id', scheduleId)
        .eq('user_id', userId)
        .single();

      if (!current) return null;

      const { data, error } = await sb
        .from('report_schedules')
        .update({ enabled: !current.enabled, updated_at: new Date().toISOString() })
        .eq('id', scheduleId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) return null;
      logger.info('Report schedule toggled', { userId, scheduleId, enabled: data.enabled });
      return rowToSchedule(data);
    }

    // In-memory fallback
    const schedule = memSchedules.get(scheduleId);
    if (!schedule || schedule.userId !== userId) return null;
    schedule.enabled = !schedule.enabled;
    logger.info('Report schedule toggled (in-memory)', { userId, scheduleId, enabled: schedule.enabled });
    return schedule;
  },
};

export default ReportExportService;
