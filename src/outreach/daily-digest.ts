/**
 * Daily Outreach Digest Generator
 *
 * Queries Supabase for the highest-priority thread across each pipeline
 * (investor, customer, partner) and generates 3 daily tasks.
 *
 * Uses v_outreach_enriched view (joins threads + persons + orgs).
 * Also checks outreach_activities.next_followup_at for activity-driven tasks.
 *
 * Emails the digest to risto@lifetime.fi every weekday at 07:00 Helsinki time.
 */

import logger from '../utils/logger.js';
import type {
  EnrichedThread,
  OutreachPipeline,
  DailyDigest,
  OutreachDailyTask,
  PipelineSummary,
} from './types.js';

const PIPELINES: OutreachPipeline[] = ['investor', 'customer', 'partner'];

// ============================================================================
// SUPABASE QUERIES
// ============================================================================

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: options.method === 'POST' ? 'return=representation' : 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase error (${response.status}): ${body}`);
  }

  return response.json();
}

/**
 * Get the top thread needing action for a given pipeline.
 * Queries v_outreach_enriched (joins thread + person + org + primary email).
 * Priority: (1) overdue next_action_date, (2) high priority, (3) newest.
 */
async function getTopThreadForPipeline(
  pipeline: OutreachPipeline
): Promise<EnrichedThread | null> {
  const today = new Date().toISOString().split('T')[0];

  // First: threads with overdue or due-today actions
  const due: EnrichedThread[] = await supabaseFetch(
    `v_outreach_enriched?pipeline=eq.${pipeline}` +
      `&status=not.in.(converted,passed,parked)` +
      `&next_action_date=lte.${today}` +
      `&order=priority.asc,next_action_date.asc` +
      `&limit=1`
  );

  if (due.length > 0) return due[0];

  // Fallback: any active thread in this pipeline
  const fallback: EnrichedThread[] = await supabaseFetch(
    `v_outreach_enriched?pipeline=eq.${pipeline}` +
      `&status=not.in.(converted,passed,parked)` +
      `&order=priority.asc,created_at.desc` +
      `&limit=1`
  );

  return fallback.length > 0 ? fallback[0] : null;
}

/**
 * Get pipeline summary counts.
 */
async function getPipelineSummary(): Promise<PipelineSummary[]> {
  try {
    return await supabaseFetch('v_outreach_pipeline_summary');
  } catch {
    return [];
  }
}

// ============================================================================
// TASK GENERATION
// ============================================================================

function generateTaskForThread(
  pipeline: OutreachPipeline,
  thread: EnrichedThread | null
): OutreachDailyTask {
  const pipelineLabels: Record<OutreachPipeline, string> = {
    investor: 'INVESTOR',
    customer: 'CUSTOMER',
    partner: 'PARTNER',
  };

  if (!thread) {
    return {
      id: crypto.randomUUID(),
      task_date: new Date().toISOString().split('T')[0],
      pipeline,
      thread_id: null,
      person_id: null,
      org_id: null,
      task_description: `[${pipelineLabels[pipeline]}] Add new contacts to the ${pipeline} pipeline. Check Boardy, LinkedIn, and conference lists.`,
      context: `No active threads in the ${pipeline} pipeline. Time to source.`,
      completed: false,
    };
  }

  const name = [thread.first_name, thread.last_name].filter(Boolean).join(' ');
  const orgLine = thread.org_name ? ` at ${thread.org_name}` : '';

  return {
    id: crypto.randomUUID(),
    task_date: new Date().toISOString().split('T')[0],
    pipeline,
    thread_id: thread.id,
    person_id: thread.person_id,
    org_id: thread.org_id || null,
    task_description: `[${pipelineLabels[pipeline]}] ${thread.next_action || `Follow up with ${name}${orgLine}`}`,
    context: thread.our_angle || `${name}${orgLine} — Status: ${thread.status}`,
    completed: false,
  };
}

// ============================================================================
// EMAIL FORMATTING
// ============================================================================

function formatDigestEmail(digest: DailyDigest): { subject: string; html: string } {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Daily Outreach: 3 tasks for ${dateStr}`;

  const taskRows = digest.tasks
    .map(
      (t) => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #2a2a2a;">
        <div style="font-size: 14px; font-weight: 600; color: #e0e0e0; margin-bottom: 4px;">
          ${escapeHtml(t.task_description)}
        </div>
        <div style="font-size: 12px; color: #888;">
          ${escapeHtml(t.context || '')}
        </div>
      </td>
    </tr>`
    )
    .join('');

  const summaryRows = digest.pipeline_summary
    .map(
      (s) => `
    <tr>
      <td style="padding: 8px 12px; color: #e0e0e0; text-transform: capitalize;">${s.pipeline}</td>
      <td style="padding: 8px 12px; color: #888; text-align: center;">${s.total}</td>
      <td style="padding: 8px 12px; color: #888; text-align: center;">${s.active_count}</td>
      <td style="padding: 8px 12px; color: #888; text-align: center;">${s.due_today}</td>
    </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111;">
    <tr>
      <td style="padding: 24px; background-color: #1a1a1a; border-bottom: 2px solid #00d4aa;">
        <h1 style="margin: 0; font-size: 20px; color: #00d4aa;">DWS IQ — Daily Outreach</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #888;">${dateStr}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <h2 style="margin: 0 0 12px; font-size: 16px; color: #e0e0e0;">Your 3 tasks today</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px;">
          ${taskRows}
        </table>
      </td>
    </tr>
    ${
      digest.pipeline_summary.length > 0
        ? `
    <tr>
      <td style="padding: 0 24px 24px;">
        <h2 style="margin: 0 0 12px; font-size: 16px; color: #e0e0e0;">Pipeline overview</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px;">
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <th style="padding: 8px 12px; color: #888; text-align: left; font-size: 12px;">Pipeline</th>
            <th style="padding: 8px 12px; color: #888; text-align: center; font-size: 12px;">Total</th>
            <th style="padding: 8px 12px; color: #888; text-align: center; font-size: 12px;">Active</th>
            <th style="padding: 8px 12px; color: #888; text-align: center; font-size: 12px;">Due</th>
          </tr>
          ${summaryRows}
        </table>
      </td>
    </tr>`
        : ''
    }
    <tr>
      <td style="padding: 16px 24px; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #555;">
          DWS IQ 6 Outreach System — Focused on sales.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// MAIN: Generate and send daily digest
// ============================================================================

export async function generateDailyDigest(): Promise<DailyDigest> {
  logger.info('Generating daily outreach digest');

  const [investor, customer, partner] = await Promise.all(
    PIPELINES.map((p) => getTopThreadForPipeline(p))
  );

  const tasks = [
    generateTaskForThread('investor', investor),
    generateTaskForThread('customer', customer),
    generateTaskForThread('partner', partner),
  ];

  const pipeline_summary = await getPipelineSummary();

  return {
    date: new Date().toISOString().split('T')[0],
    tasks,
    pipeline_summary,
  };
}

export async function sendDailyDigestEmail(): Promise<void> {
  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';

  const digest = await generateDailyDigest();
  const { subject, html } = formatDigestEmail(digest);

  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const fromAddress = process.env.EMAIL_FROM || 'noreply@dws6.com';

  if (resendKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject,
        html,
      }),
    });

    if (response.ok) {
      logger.info('Daily digest sent via Resend', { to: recipient });
      await saveDailyTasks(digest);
      return;
    }
    logger.warn('Resend failed, trying SendGrid fallback');
  }

  if (sendgridKey) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendgridKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient }] }],
        from: { email: fromAddress },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (response.ok || response.status === 202) {
      logger.info('Daily digest sent via SendGrid', { to: recipient });
      await saveDailyTasks(digest);
      return;
    }
  }

  // No provider — log to console
  logger.warn('No email provider configured. Printing digest to console.');
  console.log('\n' + '='.repeat(60));
  console.log(`DAILY OUTREACH DIGEST — ${digest.date}`);
  console.log('='.repeat(60));
  digest.tasks.forEach((t, i) => {
    console.log(`\n${i + 1}. ${t.task_description}`);
    if (t.context) console.log(`   -> ${t.context}`);
  });
  console.log('\n' + '='.repeat(60));

  await saveDailyTasks(digest);
}

async function saveDailyTasks(digest: DailyDigest): Promise<void> {
  try {
    const tasksToSave = digest.tasks.map((t) => ({
      task_date: t.task_date,
      pipeline: t.pipeline,
      thread_id: t.thread_id,
      person_id: t.person_id,
      org_id: t.org_id,
      task_description: t.task_description,
      context: t.context,
    }));

    await supabaseFetch('outreach_daily_tasks', {
      method: 'POST',
      body: JSON.stringify(tasksToSave),
    });
    logger.info('Daily tasks saved to Supabase');
  } catch (err) {
    logger.warn('Failed to save daily tasks to Supabase', {
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }
}
