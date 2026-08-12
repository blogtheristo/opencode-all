#!/usr/bin/env npx tsx
/**
 * Morning Brief V2 — One email, six sections
 *
 * Replaces 5 separate morning emails with a single combined brief.
 * Designed for Win11 HIL (Human-in-the-Loop) morning session.
 *
 * Sections:
 *   1. METRICS STRIP      — MRR, conversations, commits, MVP ETA
 *   2. PIPELINE DASHBOARD — All pipelines from flow tasks + outreach threads
 *   3. CAPTAIN & INQUIRIES — Seat count, inquiry status, captain calls
 *   4. REGULATION SIGNALS — EU regulatory news (external RSS)
 *   5. MEDIA BOARD        — Published posts, drafts, autonomous post audit
 *   6. SOCIAL QUEUE       — LinkedIn drafts pending approval
 *   7. CAMPAIGN POSTS     — 800-day campaign status, today's post
 *   8. CONSTRUCTION LEADS — TED tender leads, upcoming deadlines
 *   9. MARKET RESEARCH    — Weekly competitor signals (Monday only)
 *  10. HIL CHECKLIST      — Win11 session completion checklist
 *
 * Replaces: send-morning-briefing.ts, send-outreach-digest.ts,
 *           send-captain-briefing.ts, send-regulation-digest.ts,
 *           send-social-digest.ts, flow-orchestrator-digest.ts
 *
 * Does NOT replace: send-campaign-newsletter.ts (Friday, different audience)
 *                   send-weekly-report-email.ts (Monday)
 *
 * Usage:
 *   npx tsx scripts/send-morning-brief-v2.ts
 *
 * Required env vars:
 *   SMTP_HOST + SMTP_USER + SMTP_PASS (Amazon SES)
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY
 *
 * Code-Version: 3.0
 * Introduced-In: PR-replace-actions-with-cron
 * Date: 2026-04-08
 * Owner: Claude Opus 4.6
 */

import dotenv from 'dotenv';
dotenv.config();

import { collectCockpitData } from '../src/morning-briefing/data-collectors.js';
import { generateDailyDigest } from '../src/outreach/daily-digest.js';
import { collectCaptainBriefingData } from '../src/captain-briefing/data-collectors.js';
import { buildCaptainBriefingPlainText } from '../src/captain-briefing/briefing-template.js';
import { fetchRegulationNews } from '../src/regulation-monitor/fetcher.js';
import { generateTodaysDraft } from '../src/social-scheduler/content-generator.js';
import { enqueueDraft, getPendingDrafts } from '../src/social-scheduler/queue.js';
import {
  getLeadsSummary,
  getNewLeads,
  getUpcomingDeadlines,
} from '../src/construction-leads/lead-processor.js';
import { escapeHtml, sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
const REPLY_TO = process.env.OUTREACH_REPLY_TO_EMAIL || FROM;

// ---------------------------------------------------------------------------
// Helsinki time guard
// ---------------------------------------------------------------------------

function checkHelsinkiTime(): boolean {
  const utcNow = new Date().toISOString();
  if (process.env.SKIP_TIME_CHECK === 'true') {
    console.log(`[time-guard] SKIP_TIME_CHECK=true, bypassing Helsinki time guard (utc=${utcNow})`);
    return true;
  }
  const helsinkiString = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Helsinki',
    hour: 'numeric',
    hour12: false,
  });
  const helsinkiHour = parseInt(helsinkiString, 10);
  console.log(
    `[time-guard] utc=${utcNow} helsinkiHourRaw="${helsinkiString}" helsinkiHour=${helsinkiHour} window=05-07`,
  );
  if (Number.isNaN(helsinkiHour) || helsinkiHour < 5 || helsinkiHour > 7) {
    console.log(
      `[time-guard] SKIPPING: Helsinki hour is ${helsinkiHour}, expected 5-7. Set SKIP_TIME_CHECK=true to override.`,
    );
    return false;
  }
  console.log('[time-guard] PASS');
  return true;
}

function buildMorningBriefHtml(subject: string, dateStr: string, text: string): string {
  // Email-safe HTML: light background, table-based layout, no <body> background.
  // Outlook strips background-color from <body>; many mail apps downgrade dark themes
  // to plain-text rendering. Light + table layout renders consistently across clients.
  const body = text
    .split('\n')
    .map((line) => {
      if (!line.trim()) {
        return '<tr><td style="height:6px;line-height:6px;">&nbsp;</td></tr>';
      }
      if (/^═+$/u.test(line)) {
        return '<tr><td style="border-top:2px solid #0a3d62;padding:6px 0 0;"></td></tr>';
      }
      if (/^─+$/u.test(line)) {
        return '<tr><td style="border-top:1px solid #dfe4e8;padding:4px 0 0;"></td></tr>';
      }
      if (/^MORNING BRIEF V2/.test(line)) {
        return `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#0a3d62;padding:6px 0;">${escapeHtml(line)}</td></tr>`;
      }
      if (/^\d+\.\s+[A-Z]/.test(line)) {
        return `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#0a3d62;padding:10px 0 4px;">${escapeHtml(line)}</td></tr>`;
      }
      const isCodey = /T:[A-Z0-9]{8}|https?:\/\//.test(line);
      const fontFamily = isCodey
        ? "Consolas,'Liberation Mono',Menlo,monospace"
        : 'Arial,Helvetica,sans-serif';
      return `<tr><td style="font-family:${fontFamily};font-size:13px;line-height:1.5;color:#1a1a1a;padding:1px 0;white-space:pre-wrap;">${escapeHtml(line)}</td></tr>`;
    })
    .join('\n');

  // Use a single outer table with explicit width — Outlook needs this.
  // No <body> background — Outlook strips it and the email looks broken on white default.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f8;">
    <tr>
      <td align="center" style="padding:18px 12px;">
        <table role="presentation" width="760" cellpadding="0" cellspacing="0" border="0" style="max-width:760px;width:100%;background:#ffffff;border:1px solid #dfe4e8;">
          <tr>
            <td style="padding:14px 20px;border-bottom:3px solid #0a3d62;background:#ffffff;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6b7785;letter-spacing:0.5px;text-transform:uppercase;">Morning Brief</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;color:#0a3d62;margin-top:2px;">${escapeHtml(dateStr)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px;background:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${body}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 20px;background:#f4f6f8;border-top:1px solid #dfe4e8;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6b7785;">
              DWS IQ 6 — Morning Brief V2 · Lifetime Oy · Helsinki
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Supabase helper (for flow tasks query)
// ---------------------------------------------------------------------------

async function queryTodayFlowTasks(): Promise<{
  tasks: FlowDailyTask[];
  overdue: FlowDailyTask[];
}> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { tasks: [], overdue: [] };

  const today = new Date().toISOString().split('T')[0];
  const headers = {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  const [todayRes, overdueRes] = await Promise.all([
    fetch(
      `${url}/rest/v1/outreach_daily_tasks?task_date=eq.${today}&order=pipeline.asc,created_at.asc`,
      { headers },
    ),
    fetch(
      `${url}/rest/v1/outreach_daily_tasks?task_date=lt.${today}&completed=eq.false&order=task_date.asc&limit=20`,
      { headers },
    ),
  ]);

  const tasks = todayRes.ok ? ((await todayRes.json()) as FlowDailyTask[]) : [];
  const overdue = overdueRes.ok ? ((await overdueRes.json()) as FlowDailyTask[]) : [];

  return { tasks, overdue };
}

interface FlowDailyTask {
  id: string;
  task_date: string;
  pipeline: string;
  task_description: string;
  context: string | null;
  completed: boolean;
  created_by: string;
}

// ---------------------------------------------------------------------------
// Captain discovery
// ---------------------------------------------------------------------------

async function findTodaysCaptains(): Promise<string[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return [];

  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(
      `${url}/rest/v1/v_outreach_enriched?next_action_date=eq.${today}&status=in.(responded,meeting_booked,in_negotiation)&select=person_name&order=next_action_date.asc`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      },
    );

    if (!response.ok) return [];
    const rows = (await response.json()) as Array<{ person_name: string }>;
    return [...new Set(rows.map((r) => r.person_name).filter(Boolean))];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

async function buildMetricsStrip(): Promise<string> {
  let section = '';
  try {
    const data = await collectCockpitData();
    section += `1. METRICS STRIP\n`;
    section += `${'─'.repeat(50)}\n`;

    // Extract key metrics from cockpit data — the data object varies by implementation
    // but always has these top-level fields
    const d = data as Record<string, unknown>;
    const mrr = d.mrr ?? d.mrrEur ?? process.env.MRR_EUR ?? '—';
    const commits = d.weeklyCommits ?? d.weekly_commits ?? process.env.WEEKLY_COMMITS ?? '—';
    const mvpEta = d.mvpEta ?? d.mvp_eta ?? process.env.MVP_ETA ?? '—';
    const conversations = d.activeConversations ?? d.active_conversations ?? '—';

    section += `  MRR: €${mrr} | Active: ${conversations} | Commits/wk: ${commits} | MVP ETA: ${mvpEta}\n`;

    // Pipeline totals if available
    if (d.pipelineSummary || d.pipeline_summary) {
      const ps = (d.pipelineSummary || d.pipeline_summary) as Array<{
        pipeline: string;
        total: number;
        due_today: number;
      }>;
      if (Array.isArray(ps)) {
        const parts = ps.map((p) => `${p.pipeline.toUpperCase()}: ${p.total} (${p.due_today} due)`);
        section += `  Pipelines: ${parts.join(' | ')}\n`;
      }
    }
  } catch (err) {
    section += `1. METRICS STRIP\n`;
    section += `${'─'.repeat(50)}\n`;
    section += `  (Data collection failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }
  section += '\n';
  return section;
}

async function buildPipelineDashboard(): Promise<string> {
  let section = `2. PIPELINE DASHBOARD\n`;
  section += `${'─'.repeat(50)}\n`;

  // Part A: Outreach thread buckets (reply-token system preserved)
  try {
    const { buckets } = await generateDailyDigest();
    const researchBacklog = buckets.research_backlog?.length ?? 0;
    const totalThreads =
      buckets.overdue.length +
      buckets.today.length +
      buckets.waiting.length +
      buckets.active_deals.length +
      buckets.upcoming.length +
      researchBacklog;

    section += `  Threads: ${totalThreads} total | ${buckets.overdue.length} overdue | ${buckets.today.length} today | ${buckets.active_deals.length} active deals | ${researchBacklog} research backlog\n\n`;

    // Render straight from buckets (was: regex-grepping the digest plainText, which broke
    // when a new bucket was added before OVERDUE).
    const formatRow = (t: {
      token: string;
      pipeline: string;
      name: string;
      org: string | null;
      status: string;
      next_action: string | null;
    }) => {
      const tag = t.pipeline.slice(0, 4).toUpperCase();
      const org = t.org ? ` (${t.org})` : '';
      const action = t.next_action || `Follow up with ${t.name}`;
      return `  T:${t.token} [${tag}] ${t.name}${org} — ${t.status.replace(/_/g, ' ')} → ${action}`;
    };

    // Research backlog first — uncontacted leads need research, not nudges.
    if (researchBacklog > 0) {
      section += `  RESEARCH BACKLOG (${researchBacklog}):\n`;
      for (const t of buckets.research_backlog.slice(0, 10)) {
        section += `  ${formatRow(t)}\n`;
      }
      if (researchBacklog > 10) {
        section += `  ... +${researchBacklog - 10} more\n`;
      }
      section += '\n';
    }

    if (buckets.overdue.length > 0) {
      section += `  OVERDUE (${buckets.overdue.length}):\n`;
      for (const t of buckets.overdue.slice(0, 10)) {
        section += `  ${formatRow(t)}\n`;
      }
      if (buckets.overdue.length > 10) {
        section += `  ... +${buckets.overdue.length - 10} more\n`;
      }
      section += '\n';
    }

    if (buckets.today.length > 0) {
      section += `  TODAY (${buckets.today.length}):\n`;
      for (const t of buckets.today.slice(0, 10)) {
        section += `  ${formatRow(t)}\n`;
      }
      if (buckets.today.length > 10) {
        section += `  ... +${buckets.today.length - 10} more\n`;
      }
      section += '\n';
    }

    // Reply instructions (preserving T:XXXXXXXX token system)
    section += `  Reply: T:XXXXXXXX status responded | T:XXXXXXXX next DATE type nudge | T:XXXXXXXX park\n`;
  } catch (err) {
    section += `  (Outreach digest failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  // Part B: Flow tasks (from 5 autonomous flows)
  try {
    const { tasks, overdue } = await queryTodayFlowTasks();

    if (tasks.length > 0) {
      section += `\n  FLOW TASKS (${tasks.length} today):\n`;

      // Group by pipeline
      const byPipeline = new Map<string, FlowDailyTask[]>();
      for (const task of tasks) {
        const list = byPipeline.get(task.pipeline) || [];
        list.push(task);
        byPipeline.set(task.pipeline, list);
      }

      for (const [pipeline, pTasks] of byPipeline) {
        section += `  ${pipeline.toUpperCase()} (${pTasks.length}):\n`;
        for (const task of pTasks.slice(0, 5)) {
          const agent = (task.context || '').match(/^\[(\w+)\]/)?.[1] || '?';
          section += `    [${agent}] ${task.task_description}\n`;
        }
        if (pTasks.length > 5) {
          section += `    ... +${pTasks.length - 5} more\n`;
        }
      }
    }

    if (overdue.length > 0) {
      section += `\n  OVERDUE FLOW TASKS (${overdue.length}):\n`;
      for (const task of overdue.slice(0, 5)) {
        section += `    ${task.task_date} | ${task.pipeline} | ${task.task_description}\n`;
      }
      if (overdue.length > 5) {
        section += `    ... +${overdue.length - 5} more\n`;
      }
    }
  } catch (err) {
    section += `  (Flow tasks query failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildCaptainCalls(): Promise<string> {
  let section = `3. CAPTAIN & INQUIRIES\n`;
  section += `${'─'.repeat(50)}\n`;

  // Always show Captain inquiry snapshot (even if 0 new today)
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (url && key) {
      const headers = {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      };

      // Total seat inquiries + new today
      const [totalRes, newRes] = await Promise.all([
        fetch(`${url}/rest/v1/captain_inquiries?select=id,seat_level`, { headers }),
        fetch(
          `${url}/rest/v1/captain_inquiries?status=eq.new&select=id,name,email,seat_level,industry`,
          { headers },
        ),
      ]);

      const allInquiries = totalRes.ok ? ((await totalRes.json()) as unknown[]) : [];
      const newInquiries = newRes.ok
        ? ((await newRes.json()) as Array<{
            name: string;
            email: string;
            seat_level: string;
            industry: string;
          }>)
        : [];

      // Seat breakdown
      const seatCounts = new Map<string, number>();
      for (const inq of allInquiries as Array<{ seat_level: string }>) {
        const seat = inq.seat_level || 'unknown';
        seatCounts.set(seat, (seatCounts.get(seat) || 0) + 1);
      }
      const seatBreakdown = [...seatCounts.entries()]
        .map(([seat, count]) => `${seat}: ${count}`)
        .join(' | ');

      section += `  CAPTAIN INQUIRIES: ${allInquiries.length} total | ${newInquiries.length} new today\n`;
      section += `  Seats: ${seatBreakdown || 'none'}\n`;

      if (newInquiries.length > 0) {
        section += `\n  NEW TODAY:\n`;
        for (const inq of newInquiries) {
          section += `    ${inq.name} (${inq.email}) — ${inq.seat_level} seat, ${inq.industry}\n`;
        }
      }
      section += '\n';
    }
  } catch {
    section += `  Captain inquiries: (query failed)\n\n`;
  }

  // Captain calls due today
  try {
    const captains = await findTodaysCaptains();

    if (captains.length === 0) {
      section += `  CALLS: No captain calls scheduled today.\n`;
    } else {
      section += `  CALLS: ${captains.length} captain(s) with actions due:\n\n`;

      for (const name of captains) {
        try {
          const data = await collectCaptainBriefingData(name);
          const text = buildCaptainBriefingPlainText(data);

          // Extract key lines from the briefing (compact version)
          const lines = text.split('\n');
          section += `  ${name}\n`;

          // Find status, talking points, and suggested action
          let inTalkingPoints = false;
          let inSuggestedAction = false;
          for (const line of lines) {
            if (line.includes('Status:') || line.includes('Last Contact:')) {
              section += `    ${line.trim()}\n`;
            }
            if (line.includes('TALKING POINTS')) inTalkingPoints = true;
            if (line.includes('SUGGESTED ACTION')) {
              inTalkingPoints = false;
              inSuggestedAction = true;
            }
            if (inTalkingPoints && line.trim().startsWith('-')) {
              section += `    ${line.trim()}\n`;
            }
            if (inSuggestedAction && line.trim() && !line.includes('SUGGESTED ACTION')) {
              section += `    ACTION: ${line.trim()}\n`;
              inSuggestedAction = false;
            }
          }
          section += '\n';
        } catch {
          section += `  ${name} — (briefing data unavailable)\n\n`;
        }
      }
    }
  } catch (err) {
    section += `  (Captain discovery failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildRegulationSignals(): Promise<string> {
  let section = `4. REGULATION SIGNALS\n`;
  section += `${'─'.repeat(50)}\n`;

  try {
    const digest = await fetchRegulationNews();

    if (digest.items.length === 0) {
      section += `  No regulatory news today.\n`;
    } else {
      section += `  ${digest.items.length} items (${digest.urgentItems.length} urgent)\n\n`;

      // Urgent items first
      if (digest.urgentItems.length > 0) {
        section += `  URGENT:\n`;
        for (const item of digest.urgentItems.slice(0, 3)) {
          const tags = (item.regulations || []).join(', ');
          section += `    [${tags}] ${item.title}\n`;
          if (item.url) section += `    ${item.url}\n`;
        }
        section += '\n';
      }

      // Regulation breakdown
      const regs = Object.entries(digest.byRegulation as Record<string, unknown[]>);
      if (regs.length > 0) {
        section += `  By regulation: ${regs.map(([r, items]) => `${r}: ${items.length}`).join(' | ')}\n`;
      }

      // Top 3 non-urgent for awareness
      const nonUrgent = digest.items
        .filter((i: Record<string, unknown>) => !digest.urgentItems.includes(i))
        .slice(0, 3);
      if (nonUrgent.length > 0) {
        section += `\n  LATEST:\n`;
        for (const item of nonUrgent) {
          section += `    ${item.title}\n`;
        }
      }
    }
  } catch (err) {
    section += `  (Regulation feed failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildMediaBoard(): Promise<string> {
  const SITE_URL = 'https://onelifetime.world';
  let section = `5. MEDIA BOARD (Lifetime Scope Journal)\n`;
  section += `${'─'.repeat(50)}\n`;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    section += `  (No Supabase connection — skipping media board)\n\n`;
    return section;
  }

  const headers = {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  try {
    // Fetch recent published, drafts/scheduled, and all-time totals in parallel
    const [publishedRes, draftsRes, totalRes] = await Promise.all([
      fetch(
        `${url}/rest/v1/content_calendar?status=eq.published&post_date=gte.${sevenDaysAgo}&order=post_date.desc&limit=10`,
        { headers },
      ),
      fetch(
        `${url}/rest/v1/content_calendar?status=in.(draft,scheduled)&order=post_date.asc&limit=10`,
        { headers },
      ),
      fetch(`${url}/rest/v1/content_calendar?select=id,status`, { headers }),
    ]);

    const published = publishedRes.ok
      ? ((await publishedRes.json()) as Array<{
          title: string;
          slug: string;
          post_date: string;
          language: string;
          pillar: string;
          platform: string;
        }>)
      : [];
    const drafts = draftsRes.ok
      ? ((await draftsRes.json()) as Array<{
          title: string;
          slug: string;
          post_date: string;
          status: string;
          language: string;
          pillar: string;
        }>)
      : [];
    const allPosts = totalRes.ok ? ((await totalRes.json()) as Array<{ status: string }>) : [];

    // Totals
    const totalPublished = allPosts.filter((p) => p.status === 'published').length;
    const totalDrafts = allPosts.filter((p) => p.status === 'draft').length;
    const totalScheduled = allPosts.filter((p) => p.status === 'scheduled').length;

    section += `  Total: ${totalPublished} published | ${totalDrafts} drafts | ${totalScheduled} scheduled\n\n`;

    // PUBLISHED (last 7 days)
    section += `  PUBLISHED (last 7 days):\n`;
    if (published.length === 0) {
      section += `    (none)\n`;
    } else {
      for (const post of published) {
        const lang = post.language || 'en';
        const slug = post.slug || 'untitled';
        const isAutoGenerated = slug.startsWith('day-');
        const postUrl =
          lang === 'fi'
            ? `${SITE_URL}/posts/fi/${slug}.html`
            : slug.includes('day-')
              ? `${SITE_URL}/posts/en/${slug}.html`
              : `${SITE_URL}/posts/${slug}.html`;
        const autoTag = isAutoGenerated ? ' [AUTO]' : '';
        section += `    ${post.post_date} | ${post.title || slug}${autoTag}\n`;
        section += `      ${postUrl}\n`;
      }
    }
    section += '\n';

    // IN PREPARATION (drafts + scheduled)
    section += `  IN PREPARATION:\n`;
    if (drafts.length === 0) {
      section += `    (none — content gap risk)\n`;
    } else {
      for (const post of drafts) {
        const status = post.status.toUpperCase();
        section += `    [${status}] ${post.post_date} | ${post.title || post.slug || 'untitled'} (${post.pillar || '—'})\n`;
      }
    }
    section += '\n';

    // AUTONOMOUS POSTS TO INSPECT (auto-generated, published in last 7 days)
    const autoPosts = published.filter((p) => (p.slug || '').startsWith('day-'));
    section += `  AUTONOMOUS POSTS — INSPECT (${autoPosts.length}):\n`;
    if (autoPosts.length === 0) {
      section += `    No auto-generated posts in last 7 days.\n`;
    } else {
      section += `  These were published by Claude without human review.\n`;
      section += `  [ ] Read each. Flag factual errors, broken links, tone issues.\n\n`;
      for (const post of autoPosts) {
        const lang = post.language || 'en';
        const postUrl =
          lang === 'fi'
            ? `${SITE_URL}/posts/fi/${post.slug}.html`
            : `${SITE_URL}/posts/en/${post.slug}.html`;
        section += `    ${post.post_date} | ${post.title || post.slug}\n`;
        section += `      ${postUrl}\n`;
        section += `      Pillar: ${post.pillar || '—'} | Lang: ${lang.toUpperCase()}\n`;
      }
    }
  } catch (err) {
    section += `  (Media board failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildSocialQueue(): Promise<string> {
  let section = `6. SOCIAL QUEUE\n`;
  section += `${'─'.repeat(50)}\n`;

  try {
    // Generate today's draft if weekday
    const dow = new Date().getDay(); // 0=Sun, 6=Sat
    if (dow >= 1 && dow <= 5) {
      const draft = generateTodaysDraft();
      if (draft) {
        const postId = await enqueueDraft(draft);
        if (postId) {
          section += `  Generated: ${draft.category} draft enqueued\n`;
        }
      }
    }

    const pending = await getPendingDrafts();

    if (pending.length === 0) {
      section += `  No posts pending approval.\n`;
    } else {
      section += `  ${pending.length} post(s) pending approval:\n\n`;
      for (let i = 0; i < pending.length; i++) {
        const post = pending[i] as Record<string, unknown>;
        const category = post.category || post.content_category || '—';
        const content = String(post.content || post.body || '').slice(0, 120);
        section += `    ${i + 1}. [${category}] ${content}${String(post.content || '').length > 120 ? '...' : ''}\n`;
      }
      section += `\n  Reply: approve N | edit N: changes | reject N\n`;
    }
  } catch (err) {
    section += `  (Social queue failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildCampaignPosts(): Promise<string> {
  let section = `7. CAMPAIGN POSTS (800-Day)\n`;
  section += `${'─'.repeat(50)}\n`;

  const CAMPAIGN_START = '2026-03-16';
  const startMs = new Date(CAMPAIGN_START).getTime();
  const todayMs = new Date(new Date().toISOString().split('T')[0]).getTime();
  const dayNum = Math.floor((todayMs - startMs) / 86400000) + 1;

  if (dayNum < 1 || dayNum > 800) {
    section += `  Campaign not active (day ${dayNum} is outside 1-800 range).\n\n`;
    return section;
  }

  const pillar = ((dayNum - 1) % 10) + 1;
  const phase =
    dayNum <= 100
      ? 'Foundation'
      : dayNum <= 300
        ? 'Depth'
        : dayNum <= 500
          ? 'Engagement'
          : 'Authority';

  section += `  Day ${dayNum} of 800 | Pillar ${pillar}/10 | Phase: ${phase}\n`;
  section += `  Progress: ${Math.round((dayNum / 800) * 100)}% (${'#'.repeat(Math.round((dayNum / 800) * 20))}${'·'.repeat(20 - Math.round((dayNum / 800) * 20))})\n\n`;

  // Check Supabase for today's post status
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (url && key) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const headers = {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      };

      const res = await fetch(
        `${url}/rest/v1/content_calendar?post_date=eq.${today}&select=title,slug,status,language&order=language.asc`,
        { headers },
      );

      if (res.ok) {
        const posts = (await res.json()) as Array<{
          title: string;
          slug: string;
          status: string;
          language: string;
        }>;

        if (posts.length === 0) {
          section += `  TODAY: No posts generated yet — check scripts/daily/generate-campaign-post.sh\n`;
        } else {
          section += `  TODAY (${posts.length} posts):\n`;
          for (const post of posts) {
            const icon = post.status === 'published' ? 'OK' : post.status.toUpperCase();
            section += `    [${icon}] ${post.language.toUpperCase()} — ${post.title || post.slug}\n`;
          }
        }
      }
    } catch {
      section += `  (Supabase query failed)\n`;
    }
  } else {
    section += `  (No Supabase — cannot check post status)\n`;
  }

  section += '\n';
  return section;
}

async function buildConstructionLeads(): Promise<string> {
  let section = `8. CONSTRUCTION LEADS\n`;
  section += `${'─'.repeat(50)}\n`;

  // Skip weekends
  const dow = new Date().getDay(); // 0=Sun, 6=Sat
  if (dow === 0) {
    section += `  Sunday — no TED tenders scraped today.\n\n`;
    return section;
  }

  try {
    const summary = await getLeadsSummary();
    const newLeads = await getNewLeads(); // Uses the lead processor's default "new" window
    const deadlines = await getUpcomingDeadlines(); // Uses the lead processor's default upcoming-deadlines window

    if (summary) {
      section += `  New leads (summary): ${summary.new_count} | Deadlines this week: ${summary.deadlines_this_week}\n`;
    } else {
      section += `  New (24h): ${newLeads.length} | Deadlines (7d): ${deadlines.length}\n`;
    }
    section += '\n';

    if (newLeads.length > 0) {
      section += `  NEW LEADS:\n`;
      for (const lead of newLeads.slice(0, 5)) {
        const value = lead.estimated_value
          ? ` | ${(lead.estimated_value / 1000000).toFixed(1)}M ${lead.currency || 'EUR'}`
          : '';
        section += `    ${lead.country_code} | ${lead.title.slice(0, 60)}${value}\n`;
      }
      if (newLeads.length > 5) {
        section += `    ... +${newLeads.length - 5} more\n`;
      }
      section += '\n';
    }

    if (deadlines.length > 0) {
      section += `  UPCOMING DEADLINES:\n`;
      for (const dl of deadlines.slice(0, 5)) {
        section += `    ${dl.deadline_date} | ${dl.country_code} | ${dl.title.slice(0, 50)}\n`;
      }
      if (deadlines.length > 5) {
        section += `    ... +${deadlines.length - 5} more\n`;
      }
    }
  } catch (err) {
    section += `  (Construction leads query failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

async function buildMarketResearch(): Promise<string> {
  // Monday only — market research runs weekly
  const dow = new Date().getDay();
  let section = `9. MARKET RESEARCH (Weekly)\n`;
  section += `${'─'.repeat(50)}\n`;

  if (dow !== 1) {
    section += `  Runs Mondays only\n\n`;
    return section;
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    section += `  (No Supabase — cannot query market research)\n\n`;
    return section;
  }

  const headers = {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  try {
    // Query latest market research signals from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `${url}/rest/v1/market_research_signals?collected_at=gte.${sevenDaysAgo}&order=collected_at.desc&limit=20`,
      { headers },
    );

    if (res.ok) {
      const signals = (await res.json()) as Array<{
        competitor: string;
        signal_type: string;
        summary: string;
        collected_at: string;
        impact: string;
      }>;

      if (signals.length === 0) {
        section += `  No signals collected this week — check scripts/weekly/market-research.sh\n`;
      } else {
        // Group by competitor
        const byCompetitor = new Map<string, typeof signals>();
        for (const s of signals) {
          const list = byCompetitor.get(s.competitor) || [];
          list.push(s);
          byCompetitor.set(s.competitor, list);
        }

        section += `  ${signals.length} signals from ${byCompetitor.size} competitors:\n\n`;

        for (const [competitor, sigs] of byCompetitor) {
          section += `  ${competitor.toUpperCase()} (${sigs.length}):\n`;
          for (const s of sigs.slice(0, 3)) {
            const impact = s.impact ? ` [${s.impact}]` : '';
            section += `    ${s.signal_type}${impact}: ${(s.summary || '').slice(0, 80)}\n`;
          }
          if (sigs.length > 3) {
            section += `    ... +${sigs.length - 3} more\n`;
          }
        }
      }
    } else {
      section += `  (Query failed: HTTP ${res.status})\n`;
    }
  } catch (err) {
    section += `  (Market research query failed: ${err instanceof Error ? err.message : 'unknown'})\n`;
  }

  section += '\n';
  return section;
}

function buildHilChecklist(overdueFlowCount: number): string {
  let section = `10. HIL SESSION CHECKLIST (Win11)\n`;
  section += `${'─'.repeat(50)}\n`;
  section += `  Complete before closing your morning session:\n\n`;

  section += `  INVESTOR:\n`;
  section += `  [ ] Review follow-up tasks — send/skip/snooze each\n`;
  section += `  [ ] Check Captain inbox (captain.com dashboard)\n`;
  section += `  [ ] If meeting booked → confirm calendar + DD doc\n\n`;

  section += `  SALES:\n`;
  section += `  [ ] Review enterprise follow-ups — approve/edit sequences\n`;
  section += `  [ ] Check converted leads → trigger onboarding if needed\n\n`;

  section += `  PARTNER:\n`;
  section += `  [ ] Review strategic + construction partner threads\n`;
  section += `  [ ] Approve/reject architecture reviews\n\n`;

  section += `  MEDIA:\n`;
  section += `  [ ] Publish today's post if flagged missing\n`;
  section += `  [ ] Inspect autonomous posts in Media Board (section 5)\n`;
  section += `  [ ] Review LinkedIn draft in Social Queue (section 6)\n\n`;

  section += `  CUSTOMER:\n`;
  section += `  [ ] Review Day 0/3/7 onboarding emails\n\n`;

  section += `  SESSION CLOSE:\n`;
  section += `  [ ] Mark done: npx tsx scripts/mark-task-done.ts --today --done\n`;
  section += `  [ ] Snooze: npx tsx scripts/mark-task-done.ts <id> --snooze 1d\n`;
  section += `  [ ] git pull origin main\n`;
  if (overdueFlowCount > 0) {
    section += `  [ ] CLEAR ${overdueFlowCount} OVERDUE tasks from previous days\n`;
  }

  return section;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Flags:
  //   --preview              Write HTML to logs/morning-brief-preview.html and exit (no email)
  //   --force                Bypass Helsinki time guard AND the same-day lock
  //   --html-out=path        Custom path for --preview output
  // Env equivalents: BRIEF_PREVIEW=1, BRIEF_FORCE=1, BRIEF_HTML_OUT=path
  const args = process.argv.slice(2);
  const previewMode = args.includes('--preview') || process.env.BRIEF_PREVIEW === '1';
  const forceMode = args.includes('--force') || process.env.BRIEF_FORCE === '1';
  const htmlOutArg = args.find((a) => a.startsWith('--html-out='));
  const htmlOutPath =
    htmlOutArg?.split('=')[1] || process.env.BRIEF_HTML_OUT || 'logs/morning-brief-preview.html';

  console.log(
    `[morning-brief] start pid=${process.pid} node=${process.version} utc=${new Date().toISOString()}`,
  );
  console.log(
    `[morning-brief] env: SMTP_HOST=${process.env.SMTP_HOST ? 'set' : 'MISSING'} ` +
      `SUPABASE_URL=${process.env.SUPABASE_URL ? 'set' : 'MISSING'} ` +
      `EMAIL_FROM=${FROM} TO=${TO} preview=${previewMode} force=${forceMode}`,
  );

  if (forceMode) {
    process.env.SKIP_TIME_CHECK = 'true';
  }

  if (!previewMode && !checkHelsinkiTime()) {
    process.exit(0);
  }

  if (!previewMode && !process.env.SMTP_HOST) {
    console.error('ERROR: SMTP_HOST not configured. Amazon SES (SMTP) is required.');
    process.exit(1);
  }

  console.log('Building Morning Brief V2...');
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Build all sections in parallel where possible
  const [
    metricsStrip,
    pipelineDashboard,
    captainCalls,
    regulationSignals,
    mediaBoard,
    socialQueue,
    campaignPosts,
    constructionLeads,
    marketResearch,
    flowData,
  ] = await Promise.all([
    buildMetricsStrip(),
    buildPipelineDashboard(),
    buildCaptainCalls(),
    buildRegulationSignals(),
    buildMediaBoard(),
    buildSocialQueue(),
    buildCampaignPosts(),
    buildConstructionLeads(),
    buildMarketResearch(),
    queryTodayFlowTasks(),
  ]);

  const hilChecklist = buildHilChecklist(flowData.overdue.length);

  // Compose the full brief
  let text = `MORNING BRIEF V2 — ${today}\n`;
  text += `${'═'.repeat(50)}\n\n`;

  text += metricsStrip;
  text += pipelineDashboard;
  text += captainCalls;
  text += regulationSignals;
  text += mediaBoard;
  text += socialQueue;
  text += campaignPosts;
  text += constructionLeads;
  text += marketResearch;
  text += hilChecklist;

  text += `\n${'─'.repeat(50)}\n`;
  text += `Generated by Morning Brief V2 at ${new Date().toISOString()}\n`;
  text += `Reply to this email to update thread status (T:XXXXXXXX commands)\n`;

  // Count urgent/action items for subject line
  const urgentCount = text.match(/URGENT/gi)?.length || 0;
  const overdueCount = flowData.overdue.length;
  const urgentTag = urgentCount > 0 ? ` [${urgentCount} URGENT]` : '';
  const overdueTag = overdueCount > 0 ? ` [${overdueCount} overdue]` : '';

  const subject = `Morning Brief ${dateStr}${urgentTag}${overdueTag}`;

  const html = buildMorningBriefHtml(subject, dateStr, text);

  if (previewMode) {
    const { mkdir, writeFile } = await import('fs/promises');
    const { dirname } = await import('path');
    await mkdir(dirname(htmlOutPath), { recursive: true }).catch(() => {});
    await writeFile(htmlOutPath, html, 'utf8');
    const txtOutPath = htmlOutPath.replace(/\.html?$/i, '.txt') || `${htmlOutPath}.txt`;
    await writeFile(txtOutPath, text, 'utf8').catch(() => {});
    console.log(`[preview] wrote HTML → ${htmlOutPath} (${html.length} bytes)`);
    console.log(`[preview] wrote TEXT → ${txtOutPath} (${text.length} bytes)`);
    console.log('[preview] open the HTML file in a browser to verify rendering. No email sent.');
    process.exit(0);
  }

  console.log(`Sending: "${subject}" → ${TO}`);
  console.log(text);

  const result = await sendEmail({
    from: FROM,
    to: TO,
    subject,
    text,
    html,
    replyTo: REPLY_TO,
    source: 'admin',
    templateType: 'morning_brief_v2',
    metadata: {
      recipientCount: 1,
      urgentCount,
      overdueCount,
    },
    headers: {
      'X-DWS-Email-Type': 'morning-brief-v2',
    },
  });

  if (result.ok) {
    console.log(`Morning Brief V2 sent via ${result.transport}`);
  } else {
    console.error(`Failed to send: ${result.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Morning Brief V2 failed:', err);
  process.exit(1);
});
