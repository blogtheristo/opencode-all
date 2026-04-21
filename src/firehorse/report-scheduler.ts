/**
 * Firehorse Report Scheduler
 *
 * Reads `report_schedules` table (migration 043) and runs due schedules.
 * For each due schedule: generates a compliance report via the export service,
 * emails it to the recipient, then advances `next_run_at` to the next period.
 *
 * Schedule frequency: checked every hour at :00.
 * Only runs schedules where `enabled = true AND next_run_at <= now()`.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-build-report-engine
 * Branch: claude/build-report-engine-Gy5Kj
 * Date: 2026-04-16
 * Owner: risto.paarni@lifetime.fi
 */

import cron from 'node-cron';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../config/supabase.js';
import ReportExportService from '../services/report-export.service.js';
import { sendEmail, escapeHtml } from '../utils/send-email.js';
import logger from '../utils/logger.js';

const exportReport = (
  ...args: Parameters<typeof ReportExportService.generateExport>
) => ReportExportService.generateExport(...args);
// ============================================================================
// Types (mirrors report_schedules table schema from migration 043)
// ============================================================================

interface ScheduleRow {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  country: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  format: 'json' | 'csv';
  recipient_email: string;
  next_run_at: string;
  enabled: boolean;
}

// ============================================================================
// Next-run date calculator
// ============================================================================

function advanceSingleNormalizedPeriod(current: Date, frequency: ScheduleRow['frequency']): Date {
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

function advanceNextRun(current: Date, frequency: ScheduleRow['frequency']): Date {
  const now = new Date();
  let next = advanceSingleNormalizedPeriod(current, frequency);

  while (next <= now) {
    next = advanceSingleNormalizedPeriod(next, frequency);
  }

  return next;
}
// ============================================================================
// Process a single due schedule
// ============================================================================

async function processSchedule(schedule: ScheduleRow): Promise<void> {
  const { id, company_name, industry, country, format, recipient_email, frequency } = schedule;

  logger.info('Processing scheduled report', { scheduleId: id, company_name, frequency, format });

  // Generate the report
  let exportResult: Awaited<ReturnType<typeof exportReport>>;
  try {
    exportResult = await exportReport({
      companyName: company_name,
      industry,
      country,
      format,
      includeGaps: true,
      includeRecommendations: true,
    });
  } catch (err) {
    logger.error('Scheduled report generation failed', {
      scheduleId: id,
      error: (err as Error).message,
    });
    return;
  }

  // Send email with report attached
  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const subject = `DWS IQ Compliance Report — ${company_name} (${frequency})`;
  const safeCompany = escapeHtml(company_name);
  const safeFrequency = escapeHtml(frequency);
  const safeFormat = escapeHtml(format.toUpperCase());

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

  // Embed report as inline text body (attachment not supported in basic sendEmail)
  // For PDF attachment support, extend sendEmail with nodemailer attachments.
  const text = `DWS IQ Compliance Report — ${company_name} (${frequency})\n\n${exportResult.data}`;

  const { ok, error: emailError } = await sendEmail({
    from,
    to: recipient_email,
    subject,
    html,
    text,
  });

  if (!ok) {
    logger.error('Scheduled report email delivery failed', {
      scheduleId: id,
      recipient: recipient_email,
      error: emailError,
    });
    // Still advance next_run_at so we don't retry infinitely
  } else {
    logger.info('Scheduled report delivered', { scheduleId: id, recipient: recipient_email });
  }
}

// ============================================================================
// Scheduler — checks every hour for due schedules
// ============================================================================

let cronTask: cron.ScheduledTask | null = null;
let activeRun: Promise<void> | null = null;

async function claimSchedule(supabase: SupabaseClient, schedule: ScheduleRow): Promise<boolean> {
  const claimedNextRun = advanceNextRun(new Date(schedule.next_run_at), schedule.frequency).toISOString();

  const { data, error } = await supabase
    .from('report_schedules')
    .update({ next_run_at: claimedNextRun, updated_at: new Date().toISOString() })
    .eq('id', schedule.id)
    .eq('enabled', true)
    .eq('next_run_at', schedule.next_run_at)
    .select('id')
    .maybeSingle();

  if (error) {
    logger.warn('Report scheduler: failed to claim schedule', {
      scheduleId: schedule.id,
      error: error.message,
    });
    return false;
  }

  return !!data;
}

async function runDueSchedulesInternal(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    logger.debug('Report scheduler: Supabase unavailable, skipping');
    return;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('report_schedules')
    .select(
      'id, user_id, company_name, industry, country, frequency, format, recipient_email, next_run_at, enabled',
    )
    .eq('enabled', true)
    .lte('next_run_at', now)
    .limit(20); // Safety cap: process at most 20 per run

  if (error) {
    logger.warn('Report scheduler: failed to fetch due schedules', { error: error.message });
    return;
  }

  if (!data || data.length === 0) {
    logger.debug('Report scheduler: no due schedules');
    return;
  }

  logger.info(`Report scheduler: processing ${data.length} due schedule(s)`);

  for (const schedule of data as ScheduleRow[]) {
    const claimed = await claimSchedule(supabase, schedule);
    if (!claimed) {
      logger.debug('Report scheduler: schedule already claimed by another runner', {
        scheduleId: schedule.id,
      });
      continue;
    }

    await processSchedule(schedule);
  }
}

async function runDueSchedules(): Promise<void> {
  if (activeRun) {
    logger.warn('Report scheduler: skipped overlapping run');
    return activeRun;
  }

  activeRun = runDueSchedulesInternal();
  try {
    await activeRun;
  } finally {
    activeRun = null;
  }
}

export const reportScheduler = {
  start(): void {
    if (cronTask) return; // Already running

    // Every hour at :00 — checks for due scheduled reports
    cronTask = cron.schedule('0 * * * *', async () => {
      try {
        await runDueSchedules();
      } catch (err) {
        logger.error('Report scheduler: unhandled error', { error: (err as Error).message });
      }
    });

    logger.info('Firehorse Report Scheduler started (hourly at :00)');
  },

  stop(): void {
    if (cronTask) {
      cronTask.stop();
      cronTask = null;
      logger.info('Firehorse Report Scheduler stopped');
    }
  },

  /**
   * Run due schedules immediately (for testing and manual trigger).
   * Also callable via POST /firehorse/jobs/reports-run.
   */
  async runNow(): Promise<void> {
    await runDueSchedules();
  },
};

export default reportScheduler;
