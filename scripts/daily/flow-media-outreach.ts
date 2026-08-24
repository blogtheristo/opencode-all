/**
 * Flow: Media Outreach (Lifetime Scope Journal)
 * Auto-discovered by day-runner.sh in scripts/daily/
 *
 * Reads content_calendar table (migration 057) to track publishing cadence:
 *   Missing today's post → flag for Risto review
 *   Friday → newsletter task | < 7 posts/week → content gap alert
 *   Tue/Wed/Thu → LinkedIn post reminder
 *
 * GAP: No journalist/PR agent yet — content calendar automation only
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import {
  initSupabase,
  createDailyTasks,
  sendFlowDigest,
  logFlowRun,
  type FlowTask,
  type FlowRunStats,
} from '../lib/flow-utils.js';

const FLOW = 'flow-media-outreach';

async function main() {
  console.log(`[${FLOW}] Starting...`);
  const stats: FlowRunStats = {
    flow: FLOW,
    tasks_created: 0,
    threads_processed: 0,
    errors: [],
    started_at: new Date().toISOString(),
  };

  const supabase = initSupabase();
  if (!supabase) {
    console.log(`[${FLOW}] Dry-run mode — no Supabase connection`);
    logFlowRun(stats);
    return;
  }

  const tasks: FlowTask[] = [];
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const dayOfWeek = today.getUTCDay(); // 0=Sun, 1=Mon, ... 5=Fri, 6=Sat

  // 1. Check today's post status
  const { data: todayPosts, error: todayError } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('post_date', todayISO);

  if (todayError) {
    stats.errors.push(`today posts query: ${todayError.message}`);
  } else if (!todayPosts || todayPosts.length === 0) {
    tasks.push({
      pipeline: 'customer', // media uses customer pipeline for task tracking
      task_description: `NO POST PLANNED for ${todayISO} — add to content_calendar or mark as skipped`,
      assigned_to: 'Risto',
    });
  } else {
    for (const post of todayPosts) {
      if (post.status !== 'published') {
        tasks.push({
          pipeline: 'customer',
          task_description: `POST NOT PUBLISHED: "${post.title || post.slug || 'untitled'}" (${post.language}) — status: ${post.status}`,
          context: `Pillar: ${post.pillar}. 24h auto-publish gate applies.`,
          assigned_to: 'Risto',
        });
      }
    }
    stats.threads_processed += todayPosts.length;
  }

  // 2. Weekly post count check (Mon-Sun window)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getUTCDay()); // Start of week (Sunday)
  const weekStartISO = weekStart.toISOString().split('T')[0];

  const { data: weekPosts, error: weekError } = await supabase
    .from('content_calendar')
    .select('id')
    .gte('post_date', weekStartISO)
    .lte('post_date', todayISO)
    .eq('status', 'published');

  if (weekError) {
    stats.errors.push(`week posts query: ${weekError.message}`);
  } else if (weekPosts && weekPosts.length < dayOfWeek) {
    // Should have roughly 1 post per day passed this week
    tasks.push({
      pipeline: 'customer',
      task_description: `CONTENT GAP: ${weekPosts.length} posts published this week, expected ~${dayOfWeek}`,
      context: `Target: 7 posts/week (1/day). ${7 - weekPosts.length} behind schedule.`,
      assigned_to: 'Risto',
    });
  }

  // 3. Friday → newsletter task
  if (dayOfWeek === 5) {
    tasks.push({
      pipeline: 'customer',
      task_description: `NEWSLETTER: Friday — prepare weekly digest (7 posts, 1 per pillar, EN + FI)`,
      context: `Send at 08:00 Helsinki time. Check newsletter_subscribers for GDPR double opt-in.`,
      assigned_to: 'Risto',
    });
  }

  // 4. Tue/Wed/Thu → LinkedIn post reminder
  if (dayOfWeek >= 2 && dayOfWeek <= 4) {
    // Check if today's published post has been shared on LinkedIn
    const unshared = (todayPosts || []).filter(
      (p) => p.status === 'published' && !p.linkedin_posted,
    );
    if (unshared.length > 0) {
      tasks.push({
        pipeline: 'customer',
        task_description: `LINKEDIN: ${unshared.length} published post(s) not yet shared on LinkedIn`,
        context: unshared.map((p) => `"${p.title || p.slug}" (${p.pillar})`).join(', '),
        assigned_to: 'Risto',
      });
    }
  }

  // 5. Persist and send digest
  if (tasks.length > 0) {
    stats.tasks_created = await createDailyTasks(tasks, supabase);
  }

  await sendFlowDigest(FLOW, tasks, null);

  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
