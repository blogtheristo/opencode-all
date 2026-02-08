/**
 * Daily Outreach Digest
 *
 * One email at 06:00 Helsinki, Mon-Fri.
 * Reads outreach_threads only (via v_outreach_enriched for names).
 * No activity scanning. All state lives on the thread.
 *
 * Email sections per pipeline:
 *   1. OVERDUE — next_action_date < today
 *   2. TODAY — next_action_date = today
 *   3. WAITING — status in (intro_made, contacted), shows "waiting Xd" from waiting_since
 *   4. ACTIVE DEALS — status in (responded, meeting_booked, in_negotiation), always shown
 *   5. UPCOMING — future next_action_date (count only)
 *
 * Sends to risto@lifetime.fi via Resend (primary) / SendGrid (fallback).
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
// SUPABASE QUERY — threads only, one query
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
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&order=pipeline.asc,priority.asc,next_action_date.asc`
  );
}

// ============================================================================
// GROUP THREADS INTO DIGEST SECTIONS
// ============================================================================

function toDigestThread(t: EnrichedThread, today: string): DigestThread {
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
  };
}

function buildPipelineSections(threads: EnrichedThread[], today: string): DigestPipelineSection[] {
  return PIPELINES.map((pipeline) => {
    const pipelineThreads = threads.filter((t) => t.pipeline === pipeline);
    const digestThreads = pipelineThreads.map((t) => toDigestThread(t, today));

    const overdue = digestThreads.filter((t) => t.overdue);
    const due_today = digestThreads.filter((t) => t.due_today && !t.overdue);

    // WAITING: status in (intro_made, contacted), not overdue/today, has waiting_since
    const waiting = digestThreads.filter(
      (t) =>
        WAITING_STATUSES.includes(t.status) &&
        !t.overdue &&
        !t.due_today &&
        t.waiting_days !== null
    );

    // ACTIVE DEALS: always shown regardless of dates
    const active_deals = digestThreads.filter((t) => t.bucket === 'active');

    // UPCOMING: everything else with a future date
    const upcoming = digestThreads.filter(
      (t) =>
        !t.overdue &&
        !t.due_today &&
        t.bucket !== 'active' &&
        !WAITING_STATUSES.includes(t.status)
    );

    return {
      pipeline,
      overdue,
      due_today,
      waiting,
      active_deals,
      upcoming,
      total: pipelineThreads.length,
      summary: {
        open: digestThreads.filter((t) => t.bucket === 'open').length,
        active: digestThreads.filter((t) => t.bucket === 'active').length,
        closed: 0,
      },
    };
  });
}

// ============================================================================
// EMAIL FORMATTING
// ============================================================================

function formatThreadLine(t: DigestThread, pipeline: OutreachPipeline, section: string): string {
  const org = t.org ? ` (${t.org})` : '';
  const status = t.status.replace(/_/g, ' ');

  let action = t.next_action || `Follow up with ${t.name}`;

  // Nudge logic: if maxed out suggest parking, otherwise show pipeline-specific template
  if (isMaxedOut(pipeline, t.nudge_count) && (t.overdue || t.due_today)) {
    action = `Consider parking — ${t.nudge_count} nudges sent, no response`;
  } else if (t.nudge_count > 0 && (t.overdue || t.due_today)) {
    action = getNudgeTemplate(pipeline, t.nudge_count);
  }

  // Section-specific prefixes
  if (section === 'overdue') {
    return `[OVERDUE] ${t.name}${org} — ${status} → ${action}`;
  }
  if (section === 'today') {
    return `[TODAY] ${t.name}${org} — ${status} → ${action}`;
  }
  if (section === 'waiting') {
    const days = t.waiting_days ?? 0;
    return `${t.name}${org} — ${status}, waiting ${days}d → ${action}`;
  }
  if (section === 'active_deal') {
    return `${t.name}${org} — ${status} → ${action}`;
  }
  return `${t.name}${org} — ${status}`;
}

function formatDigestPlainText(sections: DigestPipelineSection[], dateStr: string): string {
  const lines: string[] = [];
  lines.push(`DWS IQ — Daily Outreach — ${dateStr}`);
  lines.push('='.repeat(50));

  let hasAnyAction = false;

  for (const s of sections) {
    const label = s.pipeline.toUpperCase();
    const counts = `${s.total} threads (${s.summary.open} open, ${s.summary.active} active)`;

    lines.push('');
    lines.push(`${label} — ${counts}`);
    lines.push('-'.repeat(40));

    const empty =
      s.overdue.length === 0 &&
      s.due_today.length === 0 &&
      s.waiting.length === 0 &&
      s.active_deals.length === 0 &&
      s.upcoming.length === 0;

    if (empty) {
      lines.push('  No active threads. Source new contacts.');
      continue;
    }

    if (s.overdue.length > 0) {
      hasAnyAction = true;
      for (const t of s.overdue) {
        lines.push(`  ${formatThreadLine(t, s.pipeline, 'overdue')}`);
      }
    }

    if (s.due_today.length > 0) {
      hasAnyAction = true;
      for (const t of s.due_today) {
        lines.push(`  ${formatThreadLine(t, s.pipeline, 'today')}`);
      }
    }

    if (s.waiting.length > 0) {
      for (const t of s.waiting) {
        lines.push(`  ${formatThreadLine(t, s.pipeline, 'waiting')}`);
      }
    }

    if (s.active_deals.length > 0) {
      hasAnyAction = true;
      lines.push('  ACTIVE DEALS:');
      for (const t of s.active_deals) {
        lines.push(`    ${formatThreadLine(t, s.pipeline, 'active_deal')}`);
      }
    }

    if (s.upcoming.length > 0) {
      lines.push(`  ${s.upcoming.length} more scheduled`);
    }
  }

  if (!hasAnyAction) {
    lines.push('');
    lines.push('All pipelines quiet. Add contacts via Boardy, LinkedIn, or conferences.');
  }

  lines.push('');
  lines.push('—');
  lines.push('DWS IQ 6 Outreach');

  return lines.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDigestHtml(sections: DigestPipelineSection[], dateStr: string): string {
  const pipelineBlocks = sections
    .map((s) => {
      const label = s.pipeline.toUpperCase();
      const counts = `${s.total} threads (${s.summary.open} open, ${s.summary.active} active)`;

      const empty =
        s.overdue.length === 0 &&
        s.due_today.length === 0 &&
        s.waiting.length === 0 &&
        s.active_deals.length === 0 &&
        s.upcoming.length === 0;

      if (empty) {
        return `
        <tr><td style="padding: 16px;">
          <h3 style="margin: 0 0 4px; font-size: 14px; color: #00d4aa;">${label}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${counts}</p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #888;">No active threads. Source new contacts.</p>
        </td></tr>`;
      }

      let rows = '';

      // OVERDUE + TODAY
      const urgentThreads = [...s.overdue, ...s.due_today];
      for (const t of urgentThreads) {
        const flag = t.overdue
          ? '<span style="color: #ff4444; font-weight: 600;">OVERDUE</span>'
          : '<span style="color: #ffaa00; font-weight: 600;">TODAY</span>';
        const org = t.org ? ` (${escapeHtml(t.org)})` : '';

        let action = t.next_action || `Follow up with ${t.name}`;
        if (isMaxedOut(s.pipeline, t.nudge_count) && (t.overdue || t.due_today)) {
          action = `Consider parking — ${t.nudge_count} nudges sent, no response`;
        } else if (t.nudge_count > 0) {
          action = getNudgeTemplate(s.pipeline, t.nudge_count);
        }

        rows += `
          <div style="padding: 8px 0; border-bottom: 1px solid #222;">
            <div style="font-size: 13px; color: #e0e0e0;">
              ${flag} <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
            </div>
            <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
          </div>`;
      }

      // WAITING
      for (const t of s.waiting) {
        const org = t.org ? ` (${escapeHtml(t.org)})` : '';
        const days = t.waiting_days ?? 0;
        const action = t.next_action || 'Awaiting response';
        rows += `
          <div style="padding: 8px 0; border-bottom: 1px solid #222;">
            <div style="font-size: 13px; color: #e0e0e0;">
              <span style="color: #888;">WAITING ${days}d</span> <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
            </div>
            <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
          </div>`;
      }

      // ACTIVE DEALS
      if (s.active_deals.length > 0) {
        rows += `<div style="padding: 8px 0; font-size: 11px; color: #00d4aa; text-transform: uppercase; letter-spacing: 1px;">Active Deals</div>`;
        for (const t of s.active_deals) {
          const org = t.org ? ` (${escapeHtml(t.org)})` : '';
          const action = t.next_action || 'Keep momentum';
          rows += `
            <div style="padding: 8px 0; border-bottom: 1px solid #222;">
              <div style="font-size: 13px; color: #e0e0e0;">
                <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
              </div>
              <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
            </div>`;
        }
      }

      // UPCOMING count
      const upcomingLine =
        s.upcoming.length > 0
          ? `<p style="margin: 8px 0 0; font-size: 12px; color: #666;">${s.upcoming.length} more scheduled</p>`
          : '';

      return `
        <tr><td style="padding: 16px; border-bottom: 1px solid #1a1a1a;">
          <h3 style="margin: 0 0 4px; font-size: 14px; color: #00d4aa;">${label}</h3>
          <p style="margin: 0 0 8px; font-size: 12px; color: #666;">${counts}</p>
          ${rows}
          ${upcomingLine}
        </td></tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111;">
    <tr>
      <td style="padding: 20px; background-color: #1a1a1a; border-bottom: 2px solid #00d4aa;">
        <h1 style="margin: 0; font-size: 18px; color: #00d4aa;">DWS IQ — Daily Outreach</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #888;">${dateStr}</p>
      </td>
    </tr>
    ${pipelineBlocks}
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
// MAIN: Generate and send daily digest
// ============================================================================

export async function generateDailyDigest(): Promise<{
  sections: DigestPipelineSection[];
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
  const sections = buildPipelineSections(threads, today);
  const plainText = formatDigestPlainText(sections, dateStr);
  const html = formatDigestHtml(sections, dateStr);

  return { sections, plainText, html };
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

  // No provider — print to console
  logger.warn('No email provider configured. Printing digest to console.');
  console.log('\n' + plainText);
}
