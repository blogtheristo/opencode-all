/**
 * Morning Briefing Scheduler — CEO Cockpit
 *
 * Runs Mon-Sat at 06:00 Helsinki time (Europe/Helsinki).
 * Sends a focused 5-minute CEO cockpit briefing:
 *   1. 3 Changes (pipeline, product, delivery)
 *   2. Today's 3 Bets
 *   3. Top Risk + next action
 *   4. Captain Momentum (who to ping + artifact)
 *   5. Metrics Strip (MRR, active convos, commits, MVP ETA)
 *   6. Send List (3-5 contacts for manual outreach)
 *
 * Uses SES SMTP delivery via sendEmail().
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import {
  buildCockpitHtml,
  buildCockpitPlainText,
  buildSalesBriefHtml,
  buildSalesBriefPlainText,
} from './briefing-template.js';
import { sendEmail } from '../utils/send-email.js';

// ============================================================================
// SEND BRIEFING
// ============================================================================

async function sendMorningBriefing(): Promise<void> {
  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const replyToAddress = process.env.OUTREACH_REPLY_TO_EMAIL || fromAddress;

  const data = await collectCockpitData();
  const html = buildCockpitHtml(data);
  const text = buildCockpitPlainText(data);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `CEO Cockpit ${dateStr}`;

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text,
    replyTo: replyToAddress,
    source: 'admin',
    templateType: 'ceo_cockpit',
    metadata: { recipientCount: 1 },
  });

  if (!result.ok) {
    logger.error('CEO Cockpit send failed', {
      error: result.error || 'Unknown SES SMTP failure',
    });
    throw new Error(result.error || 'SES SMTP send failed');
  }

  logger.info('CEO Cockpit sent via SES SMTP', {
    transport: result.transport || 'ses',
    recipientCount: 1,
  });
}

// ============================================================================
// SEND SALES BRIEF
// ============================================================================

async function sendSalesBriefing(): Promise<void> {
  const recipient =
    process.env.SALES_BRIEF_EMAIL ||
    process.env.OUTREACH_DIGEST_EMAIL ||
    'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const replyToAddress = process.env.OUTREACH_REPLY_TO_EMAIL || fromAddress;

  const data = await collectCockpitData();
  const html = buildSalesBriefHtml(data);
  const text = buildSalesBriefPlainText(data);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `Sales Brief ${dateStr}`;

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text,
    replyTo: replyToAddress,
    source: 'admin',
    templateType: 'sales_brief',
    metadata: { recipientCount: 1 },
  });

  if (!result.ok) {
    logger.error('Sales Brief send failed', {
      error: result.error || 'Unknown SES SMTP failure',
    });
    throw new Error(result.error || 'SES SMTP send failed');
  }

  logger.info('Sales Brief sent via SES SMTP', {
    transport: result.transport || 'ses',
    recipientCount: 1,
  });
}

// ============================================================================
// SCHEDULER CLASS
// ============================================================================

export class MorningBriefingScheduler {
  private cockpitJob: cron.ScheduledTask | null = null;
  private salesJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler. Registers two crons (Helsinki timezone):
   *   - 06:00 Mon-Sat → CEO Cockpit
   *   - 08:00 Mon-Fri → Sales Brief (slim, pipeline-focused)
   */
  start(): void {
    logger.info('Starting MorningBriefingScheduler');

    this.cockpitJob = cron.schedule(
      '0 6 * * 1-6',
      async () => {
        logger.info('Running CEO Cockpit briefing');
        try {
          await sendMorningBriefing();
        } catch (error) {
          logger.error('CEO Cockpit briefing failed', { error });
        }
      },
      { timezone: 'Europe/Helsinki' },
    );

    this.salesJob = cron.schedule(
      '0 8 * * 1-5',
      async () => {
        logger.info('Running Sales Brief');
        try {
          await sendSalesBriefing();
        } catch (error) {
          logger.error('Sales Brief failed', { error });
        }
      },
      { timezone: 'Europe/Helsinki' },
    );

    logger.info('MorningBriefingScheduler started', {
      cockpit: '06:00 Helsinki, Mon-Sat',
      sales: '08:00 Helsinki, Mon-Fri',
      cockpitRecipient: process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi',
      salesRecipient:
        process.env.SALES_BRIEF_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi',
    });
  }

  /**
   * Stop the scheduler.
   */
  stop(): void {
    if (this.cockpitJob) this.cockpitJob.stop();
    if (this.salesJob) this.salesJob.stop();
    logger.info('MorningBriefingScheduler stopped');
  }

  /**
   * Run the CEO Cockpit manually.
   */
  async runManually(): Promise<void> {
    logger.info('Running CEO Cockpit manually');
    await sendMorningBriefing();
  }

  /**
   * Run the Sales Brief manually.
   */
  async runSalesBriefManually(): Promise<void> {
    logger.info('Running Sales Brief manually');
    await sendSalesBriefing();
  }
}

export const morningBriefingScheduler = new MorningBriefingScheduler();

// Convenience exports for manual trigger
export async function sendBriefingNow(): Promise<void> {
  return morningBriefingScheduler.runManually();
}

export async function sendSalesBriefNow(): Promise<void> {
  return morningBriefingScheduler.runSalesBriefManually();
}
