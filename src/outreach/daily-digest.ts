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
import { sendEmail } from '../utils/send-email.js';
import { getNudgeTemplate, isMaxedOut } from './cadence.js';
import type {
  DigestThread,
  EnrichedThread,
  OutreachPipeline,
  OutreachStatus,
  StatusBucket,
} from './types.js';

const PIPELINES: OutreachPipeline[] = ['investor', 'customer', 'partner'];
const PIPELINE_LABELS: Record<OutreachPipeline, string> = {
  investor: 'INVESTOR',
  customer: 'CUSTOMER',
  partner: 'PARTNER',
};
const PIPELINE_TAGS: Record<OutreachPipeline, string> = {
  investor: 'INV',
  customer: 'CUST',
  partner: 'PART',
};

const OPEN_STATUSES: OutreachStatus[] = [
  'new',
  'researched',
  'intro_requested',
  'intro_made',
  'contacted',
];
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

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<unknown> {
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
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&order=pipeline.asc,next_action_date.asc`,
  ) as Promise<EnrichedThread[]>;
}

// ============================================================================
// DERIVE & BUCKET
// ============================================================================

interface BucketedThread extends DigestThread {
  thread_id: string;
  token: string; // T:xxxxx — stable reply token
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
    thread_id: t.id,
    token: t.thread_token,
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
  active_deals_overflow: number;
  upcoming: BucketedThread[];
  upcoming_overflow: number;
  /** status='new' with no outbound sent — research not started yet. Kept out of OVERDUE noise. */
  research_backlog: BucketedThread[];
  totals: Record<OutreachPipeline, { total: number; open: number; active: number }>;
}

/** A thread that has never been contacted (status=new, no last_outbound_at) isn't "overdue"; it's an un-started research task. */
function isResearchBacklog(t: BucketedThread): boolean {
  return t.status === 'new' && !t.last_outbound_at;
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
  // Stable tiebreaker: linkedin_url is unique per person, prevents day-to-day jitter
  const tiebreak = (a: BucketedThread, b: BucketedThread) =>
    a.linkedin_url.localeCompare(b.linkedin_url);

  // RESEARCH BACKLOG: status='new' with no outbound — extract first so they don't show as OVERDUE.
  // Date asc (oldest first) → pipeline → tiebreaker.
  const research_backlog = all.filter(isResearchBacklog).sort((a, b) => {
    const d = (a.next_action_date || '9999-12-31').localeCompare(
      b.next_action_date || '9999-12-31',
    );
    if (d !== 0) return d;
    const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
    if (p !== 0) return p;
    return tiebreak(a, b);
  });

  // OVERDUE: date asc → pipeline → last_outbound_at asc → tiebreaker
  // Excludes research-backlog (uncontacted new threads) — those have their own bucket.
  const overdue = all
    .filter((t) => t.overdue && t.bucket !== 'active' && !isResearchBacklog(t))
    .sort((a, b) => {
      const d = (a.next_action_date || '').localeCompare(b.next_action_date || '');
      if (d !== 0) return d;
      const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (p !== 0) return p;
      const o = (a.last_outbound_at || '').localeCompare(b.last_outbound_at || '');
      if (o !== 0) return o;
      return tiebreak(a, b);
    });

  // TODAY: action_type → pipeline → last_outbound_at asc → tiebreaker
  // Excludes research-backlog so an uncontacted "new" thread doesn't show here either.
  const todayList = all
    .filter((t) => t.due_today && t.bucket !== 'active' && !isResearchBacklog(t))
    .sort((a, b) => {
      const t2 = actionTypeOrder(a.next_action_type) - actionTypeOrder(b.next_action_type);
      if (t2 !== 0) return t2;
      const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (p !== 0) return p;
      const o = (a.last_outbound_at || '').localeCompare(b.last_outbound_at || '');
      if (o !== 0) return o;
      return tiebreak(a, b);
    });

  // WAITING: waiting_days desc → pipeline → tiebreaker
  const waiting = all
    .filter(
      (t) =>
        WAITING_STATUSES.includes(t.status) &&
        !t.overdue &&
        !t.due_today &&
        t.waiting_days !== null,
    )
    .sort((a, b) => {
      const d = (b.waiting_days ?? 0) - (a.waiting_days ?? 0);
      if (d !== 0) return d;
      const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (p !== 0) return p;
      return tiebreak(a, b);
    });

  // ACTIVE DEALS: status (in_negotiation first) → pipeline → tiebreaker. Cap 10 per pipeline.
  const MAX_ACTIVE_PER_PIPELINE = 10;
  const active_deals_all = all
    .filter((t) => t.bucket === 'active')
    .sort((a, b) => {
      const s = statusOrder(a.status) - statusOrder(b.status);
      if (s !== 0) return s;
      const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (p !== 0) return p;
      return tiebreak(a, b);
    });
  const activeCountByPipeline: Record<string, number> = {};
  const active_deals = active_deals_all.filter((t) => {
    const count = activeCountByPipeline[t.pipeline] || 0;
    if (count >= MAX_ACTIVE_PER_PIPELINE) return false;
    activeCountByPipeline[t.pipeline] = count + 1;
    return true;
  });
  const active_deals_overflow = active_deals_all.length - active_deals.length;

  // UPCOMING: date asc → pipeline → action_type → tiebreaker. Cap at 15.
  const MAX_UPCOMING = 15;
  const upcoming_all = all
    .filter(
      (t) =>
        !t.overdue &&
        !t.due_today &&
        t.bucket !== 'active' &&
        !WAITING_STATUSES.includes(t.status) &&
        !isResearchBacklog(t) &&
        t.next_action_date &&
        t.next_action_date > today,
    )
    .sort((a, b) => {
      const d = (a.next_action_date || '').localeCompare(b.next_action_date || '');
      if (d !== 0) return d;
      const p = pipelineOrder(a.pipeline) - pipelineOrder(b.pipeline);
      if (p !== 0) return p;
      const t2 = actionTypeOrder(a.next_action_type) - actionTypeOrder(b.next_action_type);
      if (t2 !== 0) return t2;
      return tiebreak(a, b);
    });
  const upcoming = upcoming_all.slice(0, MAX_UPCOMING);
  const upcoming_overflow = upcoming_all.length - upcoming.length;

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

  return {
    overdue,
    today: todayList,
    waiting,
    active_deals,
    active_deals_overflow,
    upcoming,
    upcoming_overflow,
    research_backlog,
    totals,
  };
}

// ============================================================================
// PLAIN TEXT FORMATTING — flat list with [INV]/[CUST]/[PART] tags per line
// ============================================================================

/** Render a bucket as flat list with pipeline tag per line */
function renderBucketPlainText(
  lines: string[],
  title: string,
  threads: BucketedThread[],
  lineFormatter: (t: BucketedThread) => string,
  overflow?: number,
): void {
  if (threads.length === 0) return;

  lines.push('');
  lines.push(`${title} (${threads.length}${overflow ? ` + ${overflow} more` : ''})`);
  lines.push('-'.repeat(40));

  for (const t of threads) {
    lines.push(`  T:${t.token} [${PIPELINE_TAGS[t.pipeline]}] ${lineFormatter(t)}`);
  }

  if (overflow && overflow > 0) {
    lines.push(`  +${overflow} more not shown`);
  }
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

  // RESEARCH BACKLOG (uncontacted new threads — needs human/agent research, not a nudge)
  renderBucketPlainText(lines, 'RESEARCH BACKLOG', buckets.research_backlog, (t) => {
    const org = t.org ? ` (${t.org})` : '';
    const action = t.next_action || `Research ${t.name} → prepare first-touch outreach`;
    return `${t.name}${org} — new → ${action}`;
  });

  // OVERDUE
  renderBucketPlainText(lines, 'OVERDUE', buckets.overdue, (t) => {
    const org = t.org ? ` (${t.org})` : '';
    let action = t.next_action || `Follow up with ${t.name}`;
    if (isMaxedOut(t.pipeline, t.nudge_count)) {
      action = `Consider parking — ${t.nudge_count} nudges, no response`;
    } else if (t.nudge_count > 0) {
      action = getNudgeTemplate(t.pipeline, t.nudge_count);
    }
    return `${t.name}${org} — ${t.status.replace(/_/g, ' ')} → ${action}`;
  });

  // TODAY
  renderBucketPlainText(lines, 'TODAY', buckets.today, (t) => {
    const org = t.org ? ` (${t.org})` : '';
    let action = t.next_action || `Follow up with ${t.name}`;
    if (isMaxedOut(t.pipeline, t.nudge_count)) {
      action = `Consider parking — ${t.nudge_count} nudges, no response`;
    } else if (t.nudge_count > 0) {
      action = getNudgeTemplate(t.pipeline, t.nudge_count);
    }
    return `${t.name}${org} — ${t.status.replace(/_/g, ' ')} → ${action}`;
  });

  // WAITING
  renderBucketPlainText(lines, 'WAITING', buckets.waiting, (t) => {
    const org = t.org ? ` (${t.org})` : '';
    const days = t.waiting_days ?? 0;
    const action = t.next_action || 'Awaiting response';
    return `${t.name}${org} — ${t.status.replace(/_/g, ' ')}, ${days}d → ${action}`;
  });

  // ACTIVE DEALS (with OVERDUE/DUE date flag for threads with action date <= today)
  renderBucketPlainText(
    lines,
    'ACTIVE DEALS',
    buckets.active_deals,
    (t) => {
      const org = t.org ? ` (${t.org})` : '';
      const action = t.next_action || 'Keep momentum';
      let dueFlag = '';
      if (t.overdue && t.next_action_date) {
        dueFlag = `OVERDUE ${t.next_action_date} `;
      } else if (t.due_today) {
        dueFlag = `DUE ${t.next_action_date} `;
      }
      return `${dueFlag}${t.name}${org} — ${t.status.replace(/_/g, ' ')} → ${action}`;
    },
    buckets.active_deals_overflow,
  );

  // UPCOMING (count per pipeline, capped at 15)
  if (buckets.upcoming.length > 0) {
    const byPipeline = PIPELINES.map((p) => {
      const count = buckets.upcoming.filter((t) => t.pipeline === p).length;
      return count > 0 ? `${PIPELINE_LABELS[p]}: ${count}` : null;
    }).filter(Boolean);
    const overflow = buckets.upcoming_overflow > 0 ? ` (+${buckets.upcoming_overflow} more)` : '';
    lines.push('');
    lines.push(`UPCOMING: ${byPipeline.join(', ')}${overflow}`);
  }

  // Empty state
  const totalAction =
    buckets.overdue.length +
    buckets.today.length +
    buckets.active_deals.length +
    buckets.research_backlog.length;
  if (totalAction === 0 && buckets.waiting.length === 0) {
    lines.push('');
    lines.push('All pipelines quiet. Source new contacts via Boardy, LinkedIn, or conferences.');
  }

  lines.push('');
  lines.push('—');
  lines.push('Reply to this email with ONE line (first line only).');
  lines.push('Use the thread token at the start of the line.');
  lines.push('');
  lines.push('Examples:');
  lines.push('  T:8F3K2P9Q status responded');
  lines.push('  T:8F3K2P9Q next 2026-02-10 type nudge');
  lines.push('  T:8F3K2P9Q park');
  lines.push('');
  lines.push('Rules:');
  lines.push('  1) Put the token first (T:XXXX)');
  lines.push('  2) One command per reply');
  lines.push('  3) Only the first non-quoted line is processed');
  lines.push("  4) If the format is wrong, you'll get an error reply with the valid examples");
  lines.push('');
  lines.push('DWS IQ 6 Outreach');

  return lines.join('\n');
}

// ============================================================================
// HTML FORMATTING
// ============================================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function htmlThreadRow(
  t: BucketedThread,
  flag: string,
  flagColor: string,
  extraFlag?: string,
): string {
  const org = t.org ? ` (${escapeHtml(t.org)})` : '';
  const tag = PIPELINE_TAGS[t.pipeline];
  let action = t.next_action || `Follow up with ${t.name}`;

  if (isMaxedOut(t.pipeline, t.nudge_count) && (t.overdue || t.due_today)) {
    action = `Consider parking — ${t.nudge_count} nudges, no response`;
  } else if (t.nudge_count > 0 && (t.overdue || t.due_today)) {
    action = getNudgeTemplate(t.pipeline, t.nudge_count);
  }

  const flagHtml = flag
    ? `<span style="color: ${flagColor}; font-weight: 600;">${flag}</span> `
    : '';
  const extraFlagHtml = extraFlag
    ? `<span style="color: #ffaa00; font-weight: 600;">${extraFlag}</span> `
    : '';

  return `
    <div style="padding: 8px 0; border-bottom: 1px solid #222;">
      <div style="font-size: 13px; color: #e0e0e0;">
        ${flagHtml}${extraFlagHtml}<span style="color: #555; font-size: 10px; font-family: monospace;">T:${t.token}</span> <span style="color: #00d4aa; font-size: 11px;">[${tag}]</span> <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
      </div>
      <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
    </div>`;
}

/** Render an HTML bucket section — flat list with [INV]/[CUST]/[PART] inline tags */
function htmlBucketSection(
  title: string,
  threads: BucketedThread[],
  rowRenderer: (t: BucketedThread) => string,
  overflow?: number,
  extraInfo?: string,
): string {
  if (threads.length === 0 && !extraInfo) return '';

  let content = '';
  for (const t of threads) {
    content += rowRenderer(t);
  }

  if (overflow && overflow > 0) {
    content += `<p style="margin: 8px 0 0; font-size: 12px; color: #666;">+${overflow} more not shown</p>`;
  }

  return `
    <tr><td style="padding: 16px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 4px; font-size: 14px; color: #00d4aa;">${title}</h3>
      ${content}
      ${extraInfo || ''}
    </td></tr>`;
}

function formatHtml(buckets: DigestBuckets, dateStr: string): string {
  // Pipeline summary
  const summaryParts = PIPELINES.map((p) => {
    const s = buckets.totals[p];
    return `${PIPELINE_LABELS[p]}: ${s.total} (${s.open} open, ${s.active} active)`;
  }).join(' &nbsp;|&nbsp; ');

  const upcomingOverflow =
    buckets.upcoming_overflow > 0 ? ` (+${buckets.upcoming_overflow} more)` : '';
  const upcomingInfo =
    buckets.upcoming.length > 0
      ? `<p style="margin: 0; font-size: 12px; color: #666;">${buckets.upcoming.length} threads scheduled${upcomingOverflow}</p>`
      : '';

  const sections = [
    htmlBucketSection(
      `RESEARCH BACKLOG (${buckets.research_backlog.length})`,
      buckets.research_backlog,
      (t) => htmlThreadRow(t, 'RESEARCH', '#8888ff'),
    ),
    htmlBucketSection(`OVERDUE (${buckets.overdue.length})`, buckets.overdue, (t) =>
      htmlThreadRow(t, 'OVERDUE', '#ff4444'),
    ),
    htmlBucketSection(`TODAY (${buckets.today.length})`, buckets.today, (t) =>
      htmlThreadRow(t, 'TODAY', '#ffaa00'),
    ),
    htmlBucketSection(`WAITING (${buckets.waiting.length})`, buckets.waiting, (t) => {
      const days = t.waiting_days ?? 0;
      const org = t.org ? ` (${escapeHtml(t.org)})` : '';
      const tag = PIPELINE_TAGS[t.pipeline];
      const action = t.next_action || 'Awaiting response';
      return `
          <div style="padding: 8px 0; border-bottom: 1px solid #222;">
            <div style="font-size: 13px; color: #e0e0e0;">
              <span style="color: #888; font-weight: 600;">${days}d</span>
              <span style="color: #555; font-size: 10px; font-family: monospace;">T:${t.token}</span>
              <span style="color: #00d4aa; font-size: 11px;">[${tag}]</span>
              <strong>${escapeHtml(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
            </div>
            <div style="font-size: 12px; color: #aaa; margin-top: 2px;">→ ${escapeHtml(action)}</div>
          </div>`;
    }),
    htmlBucketSection(
      `ACTIVE DEALS (${buckets.active_deals.length}${buckets.active_deals_overflow > 0 ? ` + ${buckets.active_deals_overflow}` : ''})`,
      buckets.active_deals,
      (t) => {
        let dueFlag: string | undefined;
        if (t.overdue && t.next_action_date) {
          dueFlag = `OVERDUE ${t.next_action_date}`;
        } else if (t.due_today && t.next_action_date) {
          dueFlag = `DUE ${t.next_action_date}`;
        }
        return htmlThreadRow(t, '', '#00d4aa', dueFlag);
      },
      buckets.active_deals_overflow,
    ),
    buckets.upcoming.length > 0 ? htmlBucketSection('UPCOMING', [], () => '', 0, upcomingInfo) : '',
  ]
    .filter(Boolean)
    .join('');

  // Empty state
  const totalAction =
    buckets.overdue.length +
    buckets.today.length +
    buckets.active_deals.length +
    buckets.research_backlog.length;
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
      <td style="padding: 16px; border-top: 1px solid #222;">
        <p style="margin: 0 0 6px; font-size: 12px; color: #888;">Reply to this email with ONE line (first line only). Use the thread token at the start of the line.</p>
        <p style="margin: 0 0 4px; font-size: 11px; color: #666; font-family: monospace;">T:XXXXXXXX status responded</p>
        <p style="margin: 0 0 4px; font-size: 11px; color: #666; font-family: monospace;">T:XXXXXXXX next 2026-02-10 type nudge</p>
        <p style="margin: 0 0 8px; font-size: 11px; color: #666; font-family: monospace;">T:XXXXXXXX park</p>
        <p style="margin: 0; font-size: 10px; color: #444;">1) Put the token first (T:XXXX) 2) One command per reply 3) Only the first non-quoted line is processed</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 16px; text-align: center;">
        <p style="margin: 0; font-size: 10px; color: #333;">DWS IQ 6 Outreach</p>
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
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const replyToAddress = process.env.OUTREACH_REPLY_TO_EMAIL || fromAddress;

  const { buckets, plainText, html } = await generateDailyDigest();

  // Nothing live to report — don't send an empty digest every day. This is
  // the same root cause as the CEO Cockpit's stalled sections: outreach_threads
  // has had no new rows since 2026-03-29 (found during 2026-07-12 audit).
  // Skip rather than pad the inbox with a repeated no-op email.
  const isEmpty =
    buckets.overdue.length === 0 &&
    buckets.today.length === 0 &&
    buckets.waiting.length === 0 &&
    buckets.active_deals.length === 0 &&
    buckets.upcoming.length === 0 &&
    buckets.research_backlog.length === 0;
  if (isEmpty) {
    logger.info('Daily outreach digest: no active threads — skipping send', {
      lastActivityHint: 'check outreach_threads for stale pipeline data',
    });
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `Outreach ${dateStr}`;

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text: plainText,
    replyTo: replyToAddress,
    source: 'outreach',
    templateType: 'daily_digest',
    metadata: { recipientCount: 1 },
  });

  if (!result.ok) {
    logger.error('Daily digest SES SMTP send failed', {
      error: result.error || 'Unknown SES SMTP failure',
    });
    throw new Error(result.error || 'SES SMTP send failed');
  }

  logger.info('Daily digest sent via SES SMTP', {
    transport: result.transport || 'ses',
    recipientCount: 1,
  });
}
