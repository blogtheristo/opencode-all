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
 *   7. HIL CHECKLIST      — Win11 session completion checklist
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
 * Code-Version: 2.0
 * Introduced-In: PR-morning-brief-v2
 * Date: 2026-04-07
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
import { sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
const REPLY_TO = process.env.OUTREACH_REPLY_TO_EMAIL || FROM;

// ---------------------------------------------------------------------------
// Helsinki time guard
// ---------------------------------------------------------------------------

function checkHelsinkiTime(): boolean {
  if (process.env.SKIP_TIME_CHECK === 'true') {
    console.log('SKIP_TIME_CHECK=true, bypassing Helsinki time guard');
    return true;
  }
  const helsinkiHour = parseInt(
    new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Helsinki',
      hour: 'numeric',
      hour12: false,
    }),
    10,
  );
  if (helsinkiHour < 5 || helsinkiHour > 7) {
    console.log(
      `Skipping: Helsinki hour is ${helsinkiHour}, expected 5-7. Set SKIP_TIME_CHECK=true to override.`,
    );
    return false;
  }
  return true;
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
    const { plainText, buckets } = await generateDailyDigest();
    const totalThreads =
      buckets.overdue.length +
      buckets.today.length +
      buckets.waiting.length +
      buckets.active_deals.length +
      buckets.upcoming.length;

    section += `  Threads: ${totalThreads} total | ${buckets.overdue.length} overdue | ${buckets.today.length} today | ${buckets.active_deals.length} active deals\n\n`;

    // Show overdue first (most actionable)
    if (buckets.overdue.length > 0) {
      section += `  OVERDUE:\n`;
      // Extract from plainText — the bucket formatting is in the digest template
      const overdueLines = plainText
        .split('\n')
        .filter((l: string) => l.includes('OVERDUE') || l.startsWith('  T:'))
        .slice(0, 10);
      for (const line of overdueLines) {
        section += `  ${line}\n`;
      }
      if (buckets.overdue.length > 10) {
        section += `  ... +${buckets.overdue.length - 10} more\n`;
      }
      section += '\n';
    }

    // Show today's items
    if (buckets.today.length > 0) {
      section += `  TODAY:\n`;
      const todayLines = plainText
        .split('\n')
        .filter((l: string) => l.startsWith('  T:'))
        .slice(buckets.overdue.length, buckets.overdue.length + Math.min(buckets.today.length, 10));
      for (const line of todayLines) {
        section += `  ${line}\n`;
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

function buildHilChecklist(overdueFlowCount: number): string {
  let section = `7. HIL SESSION CHECKLIST (Win11)\n`;
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
  if (!checkHelsinkiTime()) {
    process.exit(0);
  }

  if (!process.env.SMTP_HOST) {
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
    flowData,
  ] = await Promise.all([
    buildMetricsStrip(),
    buildPipelineDashboard(),
    buildCaptainCalls(),
    buildRegulationSignals(),
    buildMediaBoard(),
    buildSocialQueue(),
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

  console.log(`Sending: "${subject}" → ${TO}`);
  console.log(text);

  const result = await sendEmail({
    from: FROM,
    to: TO,
    subject,
    text,
    html: `<pre style="font-family: monospace; font-size: 13px; line-height: 1.5;">${text}</pre>`,
    replyTo: REPLY_TO,
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
