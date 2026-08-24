/**
 * Flow: Sales Outreach
 * Auto-discovered by day-runner.sh in scripts/daily/
 *
 * Routes customer pipeline threads to team agents:
 *   Due follow-ups → Antti (enterprise sequencing, Top 30)
 *   In negotiation → Sofia (pricing) | Converted → onboarding trigger
 *   Stale > 14d → Antti (re-engagement)
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
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
} from '../lib/flow-utils.js';

const FLOW = 'flow-sales-outreach';

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

  // 1. Due follow-ups → Antti
  const dueThreads = await queryDueThreads('customer', supabase);
  for (const thread of dueThreads) {
    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);

    tasks.push({
      pipeline: 'customer',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `Follow up with ${name} — ${days}d since last outbound — ${thread.customer_segment || 'enterprise'}`,
      context: thread.our_angle || thread.next_action || undefined,
      assigned_to: 'Antti',
    });
    stats.threads_processed++;
  }

  // 2. In negotiation → Sofia pricing tasks
  const { data: negotiationThreads, error: negError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'customer')
    .eq('status', 'in_negotiation');

  if (negError) {
    stats.errors.push(`in_negotiation query: ${negError.message}`);
  } else if (negotiationThreads) {
    for (const thread of negotiationThreads) {
      const name = contactName(thread);
      tasks.push({
        pipeline: 'customer',
        thread_id: thread.id,
        person_id: thread.person_id || undefined,
        org_id: thread.org_id || undefined,
        task_description: `PRICING: Prepare proposal for ${name} — ${thread.customer_segment || 'enterprise'}`,
        context: `Segment: ${thread.customer_segment || 'unknown'}. Angle: ${thread.our_angle || 'none'}`,
        assigned_to: 'Sofia',
      });
      stats.threads_processed++;
    }
  }

  // 3. Converted with no onboarding record → trigger onboarding
  const { data: convertedThreads, error: convError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'customer')
    .eq('status', 'converted');

  if (convError) {
    stats.errors.push(`converted query: ${convError.message}`);
  } else if (convertedThreads) {
    for (const thread of convertedThreads) {
      // Check if onboarding record exists
      const { data: onboardingRow } = await supabase
        .from('customer_onboarding')
        .select('id')
        .eq('company_name', thread.org_name || '')
        .limit(1);

      if (!onboardingRow || onboardingRow.length === 0) {
        const name = contactName(thread);
        tasks.push({
          pipeline: 'customer',
          thread_id: thread.id,
          person_id: thread.person_id || undefined,
          org_id: thread.org_id || undefined,
          task_description: `ONBOARD: ${name} converted but no onboarding record — create welcome sequence`,
          context: `Segment: ${thread.customer_segment || 'unknown'}`,
          assigned_to: 'Lucille',
        });
      }
    }
  }

  // 4. Stale > 14d → Antti re-engagement
  const staleThreads = await queryStaleThreads('customer', 14, supabase);
  for (const thread of staleThreads) {
    if (dueThreads.some((t) => t.id === thread.id)) continue;

    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);

    tasks.push({
      pipeline: 'customer',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `RE-ENGAGE: ${name} — ${days}d silent — consider new angle or park`,
      context: thread.our_angle || undefined,
      assigned_to: 'Antti',
    });
    stats.threads_processed++;
  }

  // 5. Persist and send digest
  if (tasks.length > 0) {
    stats.tasks_created = await createDailyTasks(tasks, supabase);
  }

  const summaries = await queryPipelineSummary(supabase);
  const customerSummary = summaries.find((s) => s.pipeline === 'customer') || null;

  await sendFlowDigest(FLOW, tasks, customerSummary);

  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
