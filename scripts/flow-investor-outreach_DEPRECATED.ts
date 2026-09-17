/**
 * DEPRECATED 2026-09-13 — removed from scripts/daily/ so day-runner.sh no longer
 * auto-discovers this job. sendFlowDigest emails are OFF.
 *
 * Sole daily triage owners:
 *   - Mission Control + Grok (anonymized / HIC-redacted only)
 *   - OpenCode local / DGX EU (raw threads, via Option A soft failover)
 * Docs: docs/handovers/grok-bot-daily-ops-handover.md
 *       .claude/handoffs/claude/mission-control-ops.md
 *
 * Manual re-run (HIC only — will email digests): npx tsx scripts/<this-file>
 *
 * --- original script below (no longer scheduled) ---
 */

import 'dotenv/config';
import {
  initSupabase,
  queryDueThreads,
  queryStaleThreads,
  queryPipelineSummary,
  createDailyTasks,
  sendFlowDigest,
  logFlowRun,
  contactName,
  daysSince,
  type FlowTask,
  type FlowRunStats,
} from './lib/flow-utils.js';

const FLOW = 'flow-investor-outreach';


async function main() {
  console.error('[DEPRECATED] This flow was removed from scripts/daily/ on 2026-09-13.');
  console.error('Daily triage owns Mission Control / Grok / OpenCode — not sendFlowDigest.');
  console.error('Set ALLOW_DEPRECATED_FLOW_DIGEST=1 to force a one-shot manual run.');
  if (process.env.ALLOW_DEPRECATED_FLOW_DIGEST !== '1') {
    process.exit(0);
  }
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

  // 1. Due follow-ups → Risto sends
  const dueThreads = await queryDueThreads('investor', supabase);
  for (const thread of dueThreads) {
    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);

    tasks.push({
      pipeline: 'investor',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `Follow up with ${name} — ${days}d since last outbound`,
      context: thread.our_angle || thread.next_action || undefined,
      assigned_to: 'Risto',
    });
    stats.threads_processed++;
  }

  // 2. Captain inquiries (new) → Lucille welcome
  const { data: captainInquiries, error: captainError } = await supabase
    .from('captain_inquiries')
    .select('*')
    .eq('status', 'new');

  if (captainError) {
    stats.errors.push(`captain_inquiries: ${captainError.message}`);
  } else if (captainInquiries && captainInquiries.length > 0) {
    for (const inquiry of captainInquiries) {
      tasks.push({
        pipeline: 'investor',
        task_description: `Welcome Captain inquiry: ${inquiry.name} (${inquiry.email}) — ${inquiry.seat_level} seat, ${inquiry.industry}`,
        context: inquiry.message || undefined,
        assigned_to: 'Lucille',
      });
    }
  }

  // 3. Stale threads > 7d → Risto nudge
  const staleThreads = await queryStaleThreads('investor', 7, supabase);
  for (const thread of staleThreads) {
    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);

    // Skip if already has a due follow-up task
    if (dueThreads.some((t) => t.id === thread.id)) continue;

    tasks.push({
      pipeline: 'investor',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `NUDGE: ${name} — ${days}d no response (nudge #${thread.nudge_count + 1})`,
      context: thread.our_angle || undefined,
      assigned_to: 'Risto',
    });
    stats.threads_processed++;
  }

  // 4. Meeting booked → Sofia DD prep
  const { data: meetingThreads, error: meetingError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'investor')
    .eq('status', 'meeting_booked');

  if (meetingError) {
    stats.errors.push(`meeting_booked query: ${meetingError.message}`);
  } else if (meetingThreads) {
    for (const thread of meetingThreads) {
      const name = contactName(thread);
      tasks.push({
        pipeline: 'investor',
        thread_id: thread.id,
        person_id: thread.person_id || undefined,
        org_id: thread.org_id || undefined,
        task_description: `DD PREP for meeting with ${name} — ${thread.investor_type || 'investor'}`,
        context: `Check size: ${thread.check_size || 'unknown'}. Angle: ${thread.our_angle || 'none'}`,
        assigned_to: 'Sofia',
      });
      stats.threads_processed++;
    }
  }

  // 5. Persist tasks and send digest
  if (tasks.length > 0) {
    stats.tasks_created = await createDailyTasks(tasks, supabase);
  }

  const summaries = await queryPipelineSummary(supabase);
  const investorSummary = summaries.find((s) => s.pipeline === 'investor') || null;

  await sendFlowDigest(FLOW, tasks, investorSummary);

  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
