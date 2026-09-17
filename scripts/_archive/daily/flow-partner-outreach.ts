/**
 * Flow: Partner Outreach
 * Auto-discovered by day-runner.sh in scripts/daily/
 *
 * Routes partner pipeline threads to team agents:
 *   Due follow-ups → Risto (strategic) or Antti (construction)
 *   In negotiation → Sofia (deal structuring)
 *   Architecture review → Adrian | Stale > 21d → escalation
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

const FLOW = 'flow-partner-outreach';
const CONSTRUCTION_TYPES = ['Reseller', 'reseller'];

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

  // 1. Due follow-ups → Risto (strategic) or Antti (construction/reseller)
  const dueThreads = await queryDueThreads('partner', supabase);
  for (const thread of dueThreads) {
    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);
    const isConstruction = CONSTRUCTION_TYPES.includes(thread.partnership_type || '');

    tasks.push({
      pipeline: 'partner',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `Follow up with ${name} — ${days}d — ${thread.partnership_type || 'partner'}`,
      context: thread.our_angle || thread.next_action || undefined,
      assigned_to: isConstruction ? 'Antti' : 'Risto',
    });
    stats.threads_processed++;
  }

  // 2. In negotiation → Sofia deal structuring
  const { data: negotiationThreads, error: negError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'partner')
    .eq('status', 'in_negotiation');

  if (negError) {
    stats.errors.push(`in_negotiation query: ${negError.message}`);
  } else if (negotiationThreads) {
    for (const thread of negotiationThreads) {
      const name = contactName(thread);
      tasks.push({
        pipeline: 'partner',
        thread_id: thread.id,
        person_id: thread.person_id || undefined,
        org_id: thread.org_id || undefined,
        task_description: `DEAL STRUCTURE: ${name} — ${thread.partnership_type || 'partner'} terms`,
        context: `Type: ${thread.partnership_type || 'unknown'}. Angle: ${thread.our_angle || 'none'}`,
        assigned_to: 'Sofia',
      });
      stats.threads_processed++;
    }
  }

  // 3. Technology/Integration partners → Adrian architecture review
  const { data: techPartners, error: techError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'partner')
    .in('partnership_type', ['Technology', 'Integration'])
    .in('status', ['contacted', 'responded', 'meeting_booked']);

  if (techError) {
    stats.errors.push(`tech_partners query: ${techError.message}`);
  } else if (techPartners) {
    for (const thread of techPartners) {
      const name = contactName(thread);
      tasks.push({
        pipeline: 'partner',
        thread_id: thread.id,
        person_id: thread.person_id || undefined,
        org_id: thread.org_id || undefined,
        task_description: `ARCH REVIEW: ${name} — integration compatibility assessment`,
        context: `Type: ${thread.partnership_type}. Check: MCP/API compatibility, data flow, EU residency`,
        assigned_to: 'Adrian',
      });
      stats.threads_processed++;
    }
  }

  // 4. Stale > 21d → escalation
  const staleThreads = await queryStaleThreads('partner', 21, supabase);
  for (const thread of staleThreads) {
    if (dueThreads.some((t) => t.id === thread.id)) continue;

    const name = contactName(thread);
    const days = daysSince(thread.last_outbound_at);

    tasks.push({
      pipeline: 'partner',
      thread_id: thread.id,
      person_id: thread.person_id || undefined,
      org_id: thread.org_id || undefined,
      task_description: `ESCALATE: ${name} — ${days}d stale — escalate or park`,
      context: thread.our_angle || undefined,
      assigned_to: 'Risto',
    });
    stats.threads_processed++;
  }

  // 5. Persist and send digest
  if (tasks.length > 0) {
    stats.tasks_created = await createDailyTasks(tasks, supabase);
  }

  const summaries = await queryPipelineSummary(supabase);
  const partnerSummary = summaries.find((s) => s.pipeline === 'partner') || null;

  await sendFlowDigest(FLOW, tasks, partnerSummary);

  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
