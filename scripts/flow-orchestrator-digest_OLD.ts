/**
 * Flow: Orchestrator Digest
 * Auto-discovered by day-runner.sh in scripts/daily/
 * Runs AFTER all 5 flow scripts (alphabetical order: flow-c, flow-i, flow-m, flow-o, flow-p, flow-s)
 *
 * Compiles all daily tasks from 5 flows into one combined email.
 * Sends to risto@lifetime.fi + lucille@lifetime.fi
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import {
  initSupabase,
  queryPipelineSummary,
  logFlowRun,
  type AgentName,
  type FlowRunStats,
} from '../lib/flow-utils.js';
import { sendEmail } from '../../src/utils/send-email.js';

const FLOW = 'flow-orchestrator-digest';
const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const RECIPIENTS = ['risto@lifetime.fi', 'lucille@lifetime.fi'];

interface DailyTask {
  id: string;
  task_date: string;
  pipeline: string;
  task_description: string;
  context: string | null;
  completed: boolean;
  created_by: string;
}

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

  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch all tasks generated today by flow scripts
  const { data: allTasks, error: taskError } = await supabase
    .from('outreach_daily_tasks')
    .select('*')
    .eq('task_date', today)
    .order('pipeline', { ascending: true })
    .order('created_at', { ascending: true });

  if (taskError) {
    stats.errors.push(`daily_tasks query: ${taskError.message}`);
    logFlowRun(stats);
    process.exit(1);
  }

  const tasks = (allTasks as DailyTask[]) || [];

  if (tasks.length === 0) {
    console.log(`[${FLOW}] No tasks today — skipping digest`);
    logFlowRun(stats);
    return;
  }

  // 2. Fetch pipeline summaries
  const summaries = await queryPipelineSummary(supabase);

  // 3. Group tasks by pipeline
  const byPipeline = new Map<string, DailyTask[]>();
  for (const task of tasks) {
    const list = byPipeline.get(task.pipeline) || [];
    list.push(task);
    byPipeline.set(task.pipeline, list);
  }

  // 4. Extract agent assignments from context field [AgentName]
  const byAgent = new Map<string, number>();
  for (const task of tasks) {
    const match = (task.context || '').match(/^\[(\w+)\]/);
    const agent = match ? match[1] : 'Unassigned';
    byAgent.set(agent, (byAgent.get(agent) || 0) + 1);
  }

  // 5. Check overdue tasks from previous days
  const { data: overdueTasks } = await supabase
    .from('outreach_daily_tasks')
    .select('*')
    .lt('task_date', today)
    .eq('completed', false)
    .order('task_date', { ascending: true })
    .limit(20);

  const overdueCount = overdueTasks?.length || 0;

  // 6. Build digest
  let text = `DWS IQ DAILY ORCHESTRATOR DIGEST — ${today}\n`;
  text += `${'='.repeat(50)}\n\n`;

  // Summary line
  text += `TODAY: ${tasks.length} tasks across ${byPipeline.size} pipeline(s)\n`;
  if (overdueCount > 0) {
    text += `OVERDUE: ${overdueCount} uncompleted tasks from previous days\n`;
  }
  text += '\n';

  // Pipeline summaries
  if (summaries.length > 0) {
    text += `PIPELINE STATUS:\n`;
    for (const s of summaries) {
      text += `  ${s.pipeline.toUpperCase()}: ${s.total} total | ${s.due_today} due | ${s.meetings_count} meetings | ${s.converted_count} converted\n`;
    }
    text += '\n';
  }

  // Agent workload
  text += `AGENT WORKLOAD:\n`;
  const sortedAgents = [...byAgent.entries()].sort((a, b) => b[1] - a[1]);
  for (const [agent, count] of sortedAgents) {
    text += `  ${agent}: ${count} task(s)\n`;
  }
  text += '\n';

  // Tasks by pipeline
  for (const [pipeline, pipelineTasks] of byPipeline) {
    text += `${pipeline.toUpperCase()} (${pipelineTasks.length} tasks):\n`;
    for (const task of pipelineTasks) {
      const agent = (task.context || '').match(/^\[(\w+)\]/)?.[1] || '?';
      text += `  [${agent}] ${task.task_description}\n`;
    }
    text += '\n';
  }

  // Overdue section
  if (overdueTasks && overdueTasks.length > 0) {
    text += `OVERDUE TASKS:\n`;
    for (const task of overdueTasks) {
      text += `  ${task.task_date} | ${task.pipeline} | ${task.task_description}\n`;
    }
    text += '\n';
  }

  // 6b. HIL (Human-in-the-Loop) session checklist — Win11
  text += `HIL SESSION CHECKLIST (Win11):\n`;
  text += `  Complete these before closing your morning session:\n\n`;

  // Investor pipeline
  text += `  INVESTOR PIPELINE:\n`;
  text += `  [ ] Review follow-up tasks above — send/skip/snooze each\n`;
  text += `  [ ] Check Captain inbox for new inquiries (captain.com dashboard)\n`;
  text += `  [ ] Mark completed tasks: npx tsx scripts/mark-task-done.ts <task-id>\n`;
  text += `  [ ] If meeting booked → confirm calendar + DD doc exists\n\n`;

  // Sales pipeline
  text += `  SALES PIPELINE:\n`;
  text += `  [ ] Review Antti's enterprise follow-ups — approve/edit sequences\n`;
  text += `  [ ] Check any converted leads → trigger onboarding if not auto\n`;
  text += `  [ ] Update deal stage in Supabase if status changed\n\n`;

  // Partner pipeline
  text += `  PARTNER PIPELINE:\n`;
  text += `  [ ] Review strategic partner threads (Risto-assigned)\n`;
  text += `  [ ] Check construction partner threads (Antti-assigned)\n`;
  text += `  [ ] Approve/reject any architecture reviews (Adrian)\n\n`;

  // Media / content
  text += `  MEDIA & CONTENT:\n`;
  text += `  [ ] Publish today's post if flagged missing\n`;
  text += `  [ ] Review LinkedIn draft if Tue/Wed/Thu\n`;
  text += `  [ ] Friday: approve newsletter content\n\n`;

  // Customer onboarding
  text += `  CUSTOMER ONBOARDING:\n`;
  text += `  [ ] Review Day 0/3/7 emails queued by Lucille\n`;
  text += `  [ ] Check Marcus technical setup flags\n\n`;

  // Session close
  text += `  SESSION CLOSE:\n`;
  text += `  [ ] Mark all actioned tasks done (batch: npx tsx scripts/mark-task-done.ts --today --done)\n`;
  text += `  [ ] Snooze deferred items: npx tsx scripts/mark-task-done.ts <id> --snooze 1d\n`;
  text += `  [ ] git pull origin main (sync any agent commits)\n`;
  if (overdueCount > 0) {
    text += `  [ ] CLEAR OVERDUE: ${overdueCount} tasks from previous days need action or snooze\n`;
  }
  text += '\n';

  text += `---\nGenerated by ${FLOW} at ${new Date().toISOString()}\n`;

  // 7. Send to all recipients
  for (const recipient of RECIPIENTS) {
    const result = await sendEmail({
      from: FROM,
      to: recipient,
      subject: `[DWS IQ DAILY] ${tasks.length} tasks | ${overdueCount > 0 ? `${overdueCount} overdue | ` : ''}${today}`,
      text,
      html: `<pre style="font-family: monospace; font-size: 13px; line-height: 1.5;">${text}</pre>`,
    });

    if (result.ok) {
      console.log(`[${FLOW}] Digest sent to ${recipient}`);
    } else {
      stats.errors.push(`Email to ${recipient}: ${result.error}`);
    }
  }

  stats.threads_processed = tasks.length;
  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
