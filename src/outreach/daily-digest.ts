/**
 * Daily Outreach Digest
 *
 * One email at 06:00 Helsinki, Mon-Fri.
 * Reads outreach_threads only (no activity scanning). All state lives on the thread.
 *
 * Structure: bucket-first, pipelines within each bucket.
 *   1. OVERDUE — next_action_date < today, sorted by date asc (oldest fire first)
 *   2. TODAY — next_action_date = today, sorted by next_action_type then last_outbound_at asc
 *   3. WAITING — status in (intro_made, contacted), sorted by waiting_days desc (longest wait first)
 *   4. ACTIVE DEALS — status in (responded, meeting_booked, in_negotiation), always shown
 *   5. UPCOMING — next_action_date > today, count per pipeline
 *
 * Within each bucket, threads are grouped by pipeline (INVESTOR, CUSTOMER, PARTNER).
 */

import logger from '../utils/logger.js';
import { getNudgeTemplate, isMaxedOut } from './cadence.js';
import type {
  EnrichedThread,
  OutreachPipeline,
  OutreachStatus,
  StatusBucket,
  DigestThread,
  DigestPipelineSection,
} from './types.js';

const PIPELINES: OutreachPipeline[] = ['investor', 'customer', 'partner'];
const PIPELINE_LABELS: Record<OutreachPipeline, string> = {
  investor: 'INVESTOR',
  customer: 'CUSTOMER',
  partner: 'PARTNER',
};

const OPEN_STATUSES: OutreachStatus[] = ['new', 'researched', 'intro_requested', 'intro_made', 'contacted'];
const ACTIVE_STATUSES: OutreachStatus[] = ['responded', 'meeting_booked', 'in_negotiation'];
const WAITING_STATUSES: OutreachStatus[] = ['intro_made', 'contacted'];

function getBucket(status: OutreachStatus): StatusBucket {
  if (OPEN_STATUSES.includes(status)) return 'open';
  if (ACTIVE_STATUSES.includes(status)) return 'active';
  return 'closed';
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// ============================================================================
// SUPABASE — one query, threads only
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
      Prefer: 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase error (${response.status}): ${body}`);
  }

  return response.json();
}

async function getAllActiveThreads(): Promise<EnrichedThread[]> {
  return supabaseFetch(
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&order=pipeline.asc,next_action_date.asc`
  );
}

// ============================================================================
// DERIVE & BUCKET
// ============================================================================

interface BucketedThread extends DigestThread {
  pipeline: OutreachPipeline;
  next_action_date: string | null;
  last_outbound_at: string | null;
}

function toBucketedThread(t: EnrichedThread, today: string): BucketedThread {
  const name = [t.first_name, t.last_name].filter(Boolean).join(' ');
  const waitingDays = t.waiting_since ? daysBetween(t.waiting_since, today) : null;

  return {
    name,
    org: t.org_name,
    status: t.status,
    bucket: getBucket(t.status),
    next_action: t.next_action,
    next_action_type: t.next_action_type,
    overdue: !!t.next_action_date && t.next_action_date < today,
    due_today: t.next_action_date === today,
    waiting_days: waitingDays,
    nudge_count: t.nudge_count || 0,
    linkedin_url: t.linkedin_url,
    pipeline: t.pipeline,
    next_action_date: t.next_action_date,
    last_outbound_at: t.last_outbound_at,
  };
}

interface DigestBuckets {
  overdue: BucketedThread[];
  today: BucketedThread[];
  waiting: BucketedThread[];
  active_deals: BucketedThread[];
  upcoming: BucketedThread[];
  totals: Record<OutreachPipeline, { total: number; open: number; active: number }>;
}

function buildBuckets(threads: EnrichedThread[], today: string): DigestBuckets {
  const all = threads.map((t) => toBucketedThread(t, today));

  // Sorting helpers
  const pipelineOrder = (p: OutreachPipeline) => PIPELINES.indexOf(p);
  const ACTION_TYPE_ORDER = ['schedule', 'nudge', 'research', 'prep', 'push_to_decision'];
  const actionTypeOrder = (t: string | null) => {
    const idx = ACTION_TYPE_ORDER.indexOf(t || '');
    return idx >= 0 ? idx : 99;
  };
  const STATUS_ORDER = ['in_negotiation', 'meeting_booked', 'responded'];
  const statusOrder = (s: OutreachStatus) => {
    const idx = STATUS_ORDER.indexOf(s);
    return idx >= 0 ? idx : 99;
  };

  // OVERDUE: date asc → pipeline → last_outbound_at asc (nulls first)
  const overdue = all
    .filter((t) => t.overdue && t.bucket !== 'active')
    .sort((a, b) => {
      const dateCompare = (a.next_action_date || '').localeCompare(b.next_action_date || '');
      if (dateCompare !== 0) return dateCompare;
      const plCompare = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (plCompare !== 0) return plCompare;
      return (a.last_outbound_at || '').localeCompare(b.last_outbound_at || '');
    });

  // TODAY: action_type → pipeline → last_outbound_at asc
  const todayList = all
    .filter((t) => t.due_today && t.bucket !== 'active')
    .sort((a, b) => {
      const typeCompare = actionTypeOrder(a.next_action_type) - actionTypeOrder(b.next_action_type);
      if (typeCompare !== 0) return typeCompare;
      const plCompare = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (plCompare !== 0) return plCompare;
      return (a.last_outbound_at || '').localeCompare(b.last_outbound_at || '');
    });

  // WAITING: waiting_days desc → pipeline → waiting_since asc
  const waiting = all
    .filter(
      (t) =>
        WAITING_STATUSES.includes(t.status) &&
        !t.overdue &&
        !t.due_today &&
        t.waiting_days !== null
    )
    .sort((a, b) => {
      const daysCompare = (b.waiting_days ?? 0) - (a.waiting_days ?? 0);
      if (daysCompare !== 0) return daysCompare;
      const plCompare = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (plCompare !== 0) return plCompare;
      return 0;
    });

  // ACTIVE DEALS: status (in_negotiation first) → pipeline → always shown, cap 10 per pipeline
  const MAX_ACTIVE_PER_PIPELINE = 10;
  const active_deals_raw = all
    .filter((t) => t.bucket === 'active')
    .sort((a, b) => {
      const statusCompare = statusOrder(a.status) - statusOrder(b.status);
      if (statusCompare !== 0) return statusCompare;
      return pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
    });
  // Cap per pipeline
  const activeCountByPipeline: Record<string, number> = {};
  const active_deals = active_deals_raw.filter((t) => {
    const count = activeCountByPipeline[t.pipeline] || 0;
    if (count >= MAX_ACTIVE_PER_PIPELINE) return false;
    activeCountByPipeline[t.pipeline] = count + 1;
    return true;
  });

  // UPCOMING: future date, not active, not waiting. Sort by date → pipeline → action_type
  const upcoming = all
    .filter(
      (t) =>
        !t.overdue &&
        !t.due_today &&
        t.bucket !== 'active' &&
        !WAITING_STATUSES.includes(t.status) &&
        t.next_action_date &&
        t.next_action_date > today
    )
    .sort((a, b) => {
      const dateCompare = (a.next_action_date || '').localeCompare(b.next_action_date || '');
      if (dateCompare !== 0) return dateCompare;
      const plCompare = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (plCompare !== 0) return plCompare;
      return actionTypeOrder(a.next_action_type) - actionTypeOrder(b.next_action_type);
    });

  // Pipeline totals
  const totals = {} as Record<OutreachPipeline, { total: number; open: number; active: number }>;
  for (const p of PIPELINES) {
    const pt = all.filter((t) => t.pipeline === p);
    totals[p] = {
      total: pt.length,
      open: pt.filter((t) => t.bucket === 'open').length,
      active: pt.filter((t) => t.bucket === 'active').length,
    };
  }

  return { overdue, today: todayList, waiting, active_deals, upcoming, totals };
}

// ============================================================================
// PLAIN TEXT FORMATTING
// ============================================================================

function threadLine(t: BucketedThread, prefix: string): string {
  const org = t.org ? ` (${t.org})` : '';
  const status = t.status.replace(/_/g, ' ');
  const pl = PIPELINE_LABELS[t.pipeline];

  let action = t.next_action || `Follow up with ${t.name}`;

  if (isMaxedOut(t.pipeline, t.nudge_count) && (t.overdue || t.due_today)) {
    action = `Consider parking — ${t.nudge_count} nudges, no response`;
  } else if (t.nudge_count > 0 && (t.overdue || t.due_today)) {
    action = getNudgeTemplate(t.pipeline, t.nudge_count);
  }

  return `  ${prefix} [${pl}] ${t.name}${org} — ${status} → ${action}`;
}

function formatPlainText(buckets: DigestBuckets, dateStr: string): string {
  const lines: string[] = [];
  lines.push(`DWS IQ — Daily Outreach — ${dateStr}`);
  lines.push('='.repeat(50));

  // Pipeline summary line
  const summaryParts = PIPELINES.map((p) => {
    const s = buckets.totals[p];
    return `${PIPELINE_LABELS[p]}: ${s.total} (${s.open} open, ${s.active} active)`;
  });
  lines.push(summaryParts.join(' | '));

  // OVERDUE
  if (buckets.overdue.length > 0) {
    lines.push('');
    lines.push(`OVERDUE (${buckets.overdue.length})`);
    lines.push('-'.repeat(40));
    for (const t of buckets.overdue) {
      threadLine(t, '[OVERDUE]');
      lines.push(threadLine(t, ''));
    }
  }

  // TODAY
  if (buckets.today.length > 0) {
    lines.push('');
    lines.push(`TODAY (${buckets.today.length})`);
    lines.push('-'.repeat(40));
    for (const t of buckets.today) {
      lines.push(threadLine(t, ''));
    }
  }

  // WAITING
  if (buckets.waiting.length > 0) {
    lines.push('');
    lines.push(`WAITING (${buckets.waiting.length})`);
    lines.push('-'.repeat(40));
    for (const t of buckets.waiting) {
      const days = t.waiting_days ?? 0;
      const org = t.org ? ` (${t.org})` : '';
      const pl = PIPELINE_LABELS[t.pipeline];
      const action = t.next_action || 'Awaiting response';
      lines.push(`  [${pl}] ${t.name}${org} — ${t.status.replace(/_/g, ' ')}, ${days}d → ${action}`);
    }
  }

  // ACTIVE DEALS
  if (buckets.active_deals.length > 0) {
    lines.push('');
    lines.push(`ACTIVE DEALS (${buckets.active_deals.length})`);
    lines.push('-'.repeat(40));
    for (const t of buckets.active_deals) {
      lines.push(threadLine(t, ''));
    }
  }

  // UPCOMING
  if (buckets.upcoming.length > 0) {
    const byPipeline = PIPELINES.map((p) => {
      const count = buckets.upcoming.filter((t) => t.pipeline === p).length;
      return count > 0 ? `${PIPELINE_LABELS[p]}: ${count}` : null;
    }).filter(Boolean);
    lines.push('');
    lines.push(`UPCOMING: ${byPipeline.join(', ')}`);
  }

  // Empty state
  const totalAction = buckets.overdue.length + buckets.today.length + buckets.active_deals.length;
  if (totalAction === 0 && buckets.waiting.length === 0) {
    lines.push('');
    lines.push('All pipelines quiet. Source new contacts via Boardy, LinkedIn, or conferences.');
  }

  lines.push('');
  lines.push('—');
  lines.push('DWS IQ 6 Outreach');

  return lines.join('\n');
}

// ============================================================================
// HTML FORMATTING
// ============================================================================

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htmlThreadRow(t: BucketedThread, flag: string, flagColor: string): string {
  const org = t.org ? ` (${escapeHtml(t.org)})` : '';
  const pl = PIPELINE_LABELS[t.pipeline];
  let action = t.next_action || `Follow up with ${t.name}`;

  if (isMaxedOut(t.pipeline, t.nudge_count) && (t.overdue || t.due_today)) {
    action = `Consider parking — ${t.nudge_count} nudges, no response`;
  } else if (t.nudge_count > 0 && (t.overdue || t.due_today)) {
    action = getNudgeTemplate(t.pipeline, t.nudge_count);
  }

  return `
    <div style="padding: 8px 0; border-bottom: 1px solid #222;">
      <div style="font-size: 13px; color: #e0e0e0;">
        <span style="color: ${flagColor}; font-weight: 600;">${flag}</span>
        <span style="color: #00d4aa; font-size: 11px;">[${pl}]</span>
        <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
      </div>
      <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
    </div>`;
}

function htmlSection(title: string, threads: string[], extraInfo?: string): string {
  if (threads.length === 0 && !extraInfo) return '';
  return `
    <tr><td style="padding: 16px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 8px; font-size: 14px; color: #00d4aa;">${title}</h3>
      ${threads.join('')}
      ${extraInfo || ''}
    </td></tr>`;
}

function formatHtml(buckets: DigestBuckets, dateStr: string): string {
  // Pipeline summary
  const summaryParts = PIPELINES.map((p) => {
    const s = buckets.totals[p];
    return `${PIPELINE_LABELS[p]}: ${s.total} (${s.open} open, ${s.active} active)`;
  }).join(' &nbsp;|&nbsp; ');

  // Sections
  const overdueRows = buckets.overdue.map((t) => htmlThreadRow(t, 'OVERDUE', '#ff4444'));
  const todayRows = buckets.today.map((t) => htmlThreadRow(t, 'TODAY', '#ffaa00'));

  const waitingRows = buckets.waiting.map((t) => {
    const days = t.waiting_days ?? 0;
    const org = t.org ? ` (${escapeHtml(t.org)})` : '';
    const pl = PIPELINE_LABELS[t.pipeline];
    const action = t.next_action || 'Awaiting response';
    return `
      <div style="padding: 8px 0; border-bottom: 1px solid #222;">
        <div style="font-size: 13px; color: #e0e0e0;">
          <span style="color: #888; font-weight: 600;">WAITING ${days}d</span>
          <span style="color: #00d4aa; font-size: 11px;">[${pl}]</span>
          <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
        </div>
        <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
      </div>`;
  });

  const activeRows = buckets.active_deals.map((t) => htmlThreadRow(t, '', '#00d4aa'));

  const upcomingInfo =
    buckets.upcoming.length > 0
      ? `<p style="margin: 0; font-size: 12px; color: #666;">${buckets.upcoming.length} threads scheduled</p>`
      : '';

  const sections = [
    htmlSection(`OVERDUE (${buckets.overdue.length})`, overdueRows),
    htmlSection(`TODAY (${buckets.today.length})`, todayRows),
    htmlSection(`WAITING (${buckets.waiting.length})`, waitingRows),
    htmlSection(`ACTIVE DEALS (${buckets.active_deals.length})`, activeRows),
    buckets.upcoming.length > 0 ? htmlSection('UPCOMING', [], upcomingInfo) : '',
  ]
    .filter(Boolean)
    .join('');

  // Empty state
  const totalAction = buckets.overdue.length + buckets.today.length + buckets.active_deals.length;
  const emptyMsg =
    totalAction === 0 && buckets.waiting.length === 0
      ? '<tr><td style="padding: 16px;"><p style="color: #888; font-size: 13px;">All pipelines quiet. Source new contacts.</p></td></tr>'
      : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111;">
    <tr>
      <td style="padding: 20px; background-color: #1a1a1a; border-bottom: 2px solid #00d4aa;">
        <h1 style="margin: 0; font-size: 18px; color: #00d4aa;">DWS IQ — Daily Outreach</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #888;">${dateStr}</p>
        <p style="margin: 4px 0 0; font-size: 11px; color: #666;">${summaryParts}</p>
      </td>
    </tr>
    ${sections}
    ${emptyMsg}
    <tr>
      <td style="padding: 12px 16px; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #444;">DWS IQ 6 — Focused on sales.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// MAIN
// ============================================================================

export async function generateDailyDigest(): Promise<{
  buckets: DigestBuckets;
  plainText: string;
  html: string;
}> {
  logger.info('Generating daily outreach digest');

  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const threads = await getAllActiveThreads();
  const buckets = buildBuckets(threads, today);
  const plainText = formatPlainText(buckets, dateStr);
  const html = formatHtml(buckets, dateStr);

  return { buckets, plainText, html };
}

export async function sendDailyDigestEmail(): Promise<void> {
  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'noreply@dws6.com';

  const { plainText, html } = await generateDailyDigest();

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `Outreach ${dateStr}`;

  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

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
        text: plainText,
      }),
    });

    if (response.ok) {
      logger.info('Daily digest sent via Resend', { to: recipient });
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
        content: [
          { type: 'text/plain', value: plainText },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (response.ok || response.status === 202) {
      logger.info('Daily digest sent via SendGrid', { to: recipient });
      return;
    }
  }

  logger.warn('No email provider configured. Printing digest to console.');
  console.log('\n' + plainText);
}
