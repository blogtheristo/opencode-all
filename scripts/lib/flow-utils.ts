/**
 * Flow Utilities — Shared functions for all 5 business process flows
 * Used by scripts/daily/flow-*.ts scripts on DGX Spark
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { escapeHtml, sendEmail } from '../../src/utils/send-email.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Pipeline = 'investor' | 'customer' | 'partner';
export type AgentName =
  | 'Rocky'
  | 'Adrian'
  | 'Marcus'
  | 'Sofia'
  | 'Antti'
  | 'Emily'
  | 'Risto'
  | 'Lucille';

export interface FlowTask {
  pipeline: Pipeline;
  thread_id?: string;
  person_id?: string;
  org_id?: string;
  task_description: string;
  context?: string;
  assigned_to: AgentName;
}

export interface DueThread {
  id: string;
  pipeline: Pipeline;
  priority: string;
  status: string;
  next_action_date: string;
  next_action: string | null;
  next_action_type: string | null;
  our_angle: string | null;
  waiting_since: string | null;
  nudge_count: number;
  last_outbound_at: string | null;
  investor_type: string | null;
  partnership_type: string | null;
  customer_segment: string | null;
  person_first_name: string | null;
  person_last_name: string | null;
  org_name: string | null;
  org_domain: string | null;
  person_id: string | null;
  org_id: string | null;
  activity_count: number;
}

export interface PipelineSummary {
  pipeline: Pipeline;
  total: number;
  new_count: number;
  active_count: number;
  meetings_count: number;
  converted_count: number;
  due_today: number;
}

export interface FlowRunStats {
  flow: string;
  tasks_created: number;
  threads_processed: number;
  errors: string[];
  started_at: string;
  finished_at?: string;
}

// ---------------------------------------------------------------------------
// Supabase Init
// ---------------------------------------------------------------------------

export function initSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.warn(
      '[flow-utils] SUPABASE_URL or SUPABASE_SERVICE_KEY missing — running in dry-run mode',
    );
    return null;
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Query Helpers
// ---------------------------------------------------------------------------

export async function queryDueThreads(
  pipeline: Pipeline,
  supabase: SupabaseClient,
): Promise<DueThread[]> {
  const { data, error } = await supabase
    .from('v_outreach_due_today')
    .select('*')
    .eq('pipeline', pipeline)
    .order('priority', { ascending: true });

  if (error) {
    console.error(`[flow-utils] queryDueThreads(${pipeline}) error:`, error.message);
    return [];
  }

  return (data as DueThread[]) || [];
}

export async function queryStaleThreads(
  pipeline: Pipeline,
  staleDays: number,
  supabase: SupabaseClient,
): Promise<DueThread[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - staleDays);
  const cutoffISO = cutoff.toISOString();

  const { data, error } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', pipeline)
    .not('status', 'in', '("converted","passed","parked")')
    .lt('last_outbound_at', cutoffISO)
    .order('last_outbound_at', { ascending: true });

  if (error) {
    console.error(
      `[flow-utils] queryStaleThreads(${pipeline}, ${staleDays}d) error:`,
      error.message,
    );
    return [];
  }

  return (data as DueThread[]) || [];
}

export async function queryPipelineSummary(supabase: SupabaseClient): Promise<PipelineSummary[]> {
  const { data, error } = await supabase.from('v_outreach_pipeline_summary').select('*');

  if (error) {
    console.error('[flow-utils] queryPipelineSummary error:', error.message);
    return [];
  }

  return (data as PipelineSummary[]) || [];
}

// ---------------------------------------------------------------------------
// Task Creation
// ---------------------------------------------------------------------------

export async function createDailyTask(task: FlowTask, supabase: SupabaseClient): Promise<boolean> {
  const { error } = await supabase.from('outreach_daily_tasks').insert({
    task_date: new Date().toISOString().split('T')[0],
    pipeline: task.pipeline,
    thread_id: task.thread_id || null,
    person_id: task.person_id || null,
    org_id: task.org_id || null,
    task_description: task.task_description,
    context: task.context ? `[${task.assigned_to}] ${task.context}` : `[${task.assigned_to}]`,
    created_by: `flow-${task.pipeline}`,
  });

  if (error) {
    console.error(`[flow-utils] createDailyTask error:`, error.message);
    return false;
  }

  return true;
}

export async function createDailyTasks(
  tasks: FlowTask[],
  supabase: SupabaseClient,
): Promise<number> {
  let created = 0;
  for (const task of tasks) {
    const ok = await createDailyTask(task, supabase);
    if (ok) created++;
  }
  return created;
}

// ---------------------------------------------------------------------------
// Digest Email
// ---------------------------------------------------------------------------

export async function sendFlowDigest(
  flowName: string,
  tasks: FlowTask[],
  summary: PipelineSummary | null,
  recipient: string = 'risto@lifetime.fi',
): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  if (tasks.length === 0 && !summary) {
    console.log(`[${flowName}] No tasks today — skipping digest email`);
    return true;
  }

  // Group tasks by agent
  const byAgent = new Map<AgentName, FlowTask[]>();
  for (const t of tasks) {
    const list = byAgent.get(t.assigned_to) || [];
    list.push(t);
    byAgent.set(t.assigned_to, list);
  }

  let text = `${flowName.toUpperCase()} DAILY DIGEST — ${today}\n`;
  text += `Tasks: ${tasks.length}\n`;

  if (summary) {
    text += `\nPIPELINE: ${summary.total} total | ${summary.due_today} due today`;
    text += ` | ${summary.meetings_count} meetings | ${summary.converted_count} converted\n`;
  }

  text += '\n';

  for (const [agent, agentTasks] of byAgent) {
    text += `${agent} (${agentTasks.length} tasks):\n`;
    for (const t of agentTasks) {
      const org = t.org_id ? ` [${t.org_id}]` : '';
      text += `  - ${t.task_description}${org}\n`;
    }
    text += '\n';
  }

  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: recipient,
    subject: `[${flowName.toUpperCase()}] ${tasks.length} tasks — ${today}`,
    text,
    html: `<pre style="font-family: monospace; font-size: 13px; line-height: 1.5;">${escapeHtml(text)}</pre>`,
  });

  if (!result.ok) {
    console.error(`[${flowName}] Digest email failed:`, result.error);
    return false;
  }

  console.log(`[${flowName}] Digest sent to ${recipient}`);
  return true;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

export function logFlowRun(stats: FlowRunStats): void {
  stats.finished_at = new Date().toISOString();
  console.log(
    `[${stats.flow}] Completed: ${stats.tasks_created} tasks, ${stats.threads_processed} threads processed`,
  );
  if (stats.errors.length > 0) {
    console.error(`[${stats.flow}] Errors:`, stats.errors);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

export function contactName(thread: DueThread): string {
  const first = thread.person_first_name || '';
  const last = thread.person_last_name || '';
  const org = thread.org_name || thread.org_domain || '';
  const name = `${first} ${last}`.trim();
  return name ? `${name} (${org})` : org || thread.id.slice(0, 8);
}
