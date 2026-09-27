/**
 * Temporal Activities — Firehorse Report Schedule (Use case #4)
 *
 * Splits src/firehorse/report-scheduler.ts's processSchedule() into two
 * Activities plus a claim step, so Temporal's history — not an in-memory
 * Promise — is the record of "did this period's report actually send."
 */
import { ApplicationFailure } from '@temporalio/activity';
import { getSupabaseClient } from '../../config/supabase.js';
import ReportExportService from '../../services/report-export.service.js';
import { escapeHtml, sendEmail } from '../../utils/send-email.js';
import logger from '../../utils/logger.js';

export interface ReportScheduleRow {
  id: string;
  company_name: string;
  industry: string;
  country: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  format: 'json' | 'csv';
  recipient_email: string;
  next_run_at: string;
}

function advanceSingleNormalizedPeriod(
  current: Date,
  frequency: ReportScheduleRow['frequency'],
): Date {
  const next = new Date(current);
  switch (frequency) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1, 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3, 1);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1, 0, 1);
      break;
  }
  return next;
}

export function advanceNextRun(current: Date, frequency: ReportScheduleRow['frequency']): Date {
  const now = new Date();
  let next = advanceSingleNormalizedPeriod(current, frequency);
  while (next <= now) next = advanceSingleNormalizedPeriod(next, frequency);
  return next;
}

/**
 * Compare-and-swap claim of a due schedule row, keyed by its current
 * next_run_at — prevents two concurrent workflow executions (e.g. a
 * duplicate Schedule trigger) from both processing the same period.
 */
export async function claimReportScheduleActivity(schedule: ReportScheduleRow): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw ApplicationFailure.create({
      message: 'Supabase unavailable — cannot claim report schedule',
      type: 'DependencyUnavailable',
      nonRetryable: false,
    });
  }

  const claimedNextRun = advanceNextRun(
    new Date(schedule.next_run_at),
    schedule.frequency,
  ).toISOString();

  const { data, error } = await supabase
    .from('report_schedules')
    .update({ next_run_at: claimedNextRun, updated_at: new Date().toISOString() })
    .eq('id', schedule.id)
    .eq('enabled', true)
    .eq('next_run_at', schedule.next_run_at)
    .select('id')
    .maybeSingle();

  if (error) {
    throw ApplicationFailure.create({
      message: `Failed to claim report schedule ${schedule.id}: ${error.message}`,
      type: 'SupabaseError',
      nonRetryable: false,
    });
  }

  return !!data;
}

/**
 * Fetches rows due now (mirrors the old node-cron poll's query), capped at
 * 20 per run — same safety cap as the original report-scheduler.ts.
 */
export async function fetchDueReportSchedulesActivity(): Promise<ReportScheduleRow[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw ApplicationFailure.create({
      message: 'Supabase unavailable — cannot fetch due report schedules',
      type: 'DependencyUnavailable',
      nonRetryable: false,
    });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('report_schedules')
    .select('id, company_name, industry, country, frequency, format, recipient_email, next_run_at')
    .eq('enabled', true)
    .lte('next_run_at', now)
    .limit(20);

  if (error) {
    throw ApplicationFailure.create({
      message: `Failed to fetch due report schedules: ${error.message}`,
      type: 'SupabaseError',
      nonRetryable: false,
    });
  }

  return (data || []) as ReportScheduleRow[];
}

export interface GeneratedReport {
  data: string;
}

export async function generateReportActivity(
  schedule: ReportScheduleRow,
): Promise<GeneratedReport> {
  const result = await ReportExportService.generateExport({
    companyName: schedule.company_name,
    industry: schedule.industry,
    country: schedule.country,
    format: schedule.format,
    includeGaps: true,
    includeRecommendations: true,
  });
  return { data: result.data };
}

export async function emailReportActivity(input: {
  schedule: ReportScheduleRow;
  report: GeneratedReport;
}): Promise<void> {
  const { schedule, report } = input;
  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const subject = `DWS IQ Compliance Report — ${schedule.company_name} (${schedule.frequency})`;
  const safeCompany = escapeHtml(schedule.company_name);
  const safeFrequency = escapeHtml(schedule.frequency);
  const safeFormat = escapeHtml(schedule.format.toUpperCase());

  const html = `
    <h2>DWS IQ Compliance Report</h2>
    <p>Your scheduled <strong>${safeFrequency}</strong> compliance report for
       <strong>${safeCompany}</strong> is attached as a ${safeFormat} file.</p>
    <p>Generated: ${new Date().toUTCString()}</p>
    <hr>
    <p style="font-size:12px;color:#666;">
      DWS IQ 6 — Firehorse Report Engine<br>
      Lifetime Oy · FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
    </p>
  `;
  const text = `DWS IQ Compliance Report — ${schedule.company_name} (${schedule.frequency})\n\n${report.data}`;

  const { ok, error } = await sendEmail({
    from,
    to: schedule.recipient_email,
    subject,
    html,
    text,
  });

  if (!ok) {
    throw ApplicationFailure.create({
      message: `Report email delivery failed for schedule ${schedule.id}: ${error}`,
      type: 'EmailDeliveryError',
      nonRetryable: false,
    });
  }

  logger.info('Report delivered via Temporal activity', {
    scheduleId: schedule.id,
    recipient: schedule.recipient_email,
  });
}
