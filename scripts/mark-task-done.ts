/**
 * CLI: Mark outreach_daily_tasks as done or snoozed
 *
 * Usage:
 *   npx tsx scripts/mark-task-done.ts <task-id>              # mark single task done
 *   npx tsx scripts/mark-task-done.ts <task-id> --snooze 1d  # snooze 1 day
 *   npx tsx scripts/mark-task-done.ts --today --done         # mark all today's tasks done
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);

async function markDone(taskId: string) {
  const { error } = await supabase
    .from('outreach_daily_tasks')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) {
    console.error(`Failed to mark ${taskId}: ${error.message}`);
    return false;
  }
  console.log(`Done: ${taskId}`);
  return true;
}

async function snoozeTask(taskId: string, days: number) {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  const newDateStr = newDate.toISOString().split('T')[0];

  const { error } = await supabase
    .from('outreach_daily_tasks')
    .update({ task_date: newDateStr })
    .eq('id', taskId);

  if (error) {
    console.error(`Failed to snooze ${taskId}: ${error.message}`);
    return false;
  }
  console.log(`Snoozed ${taskId} → ${newDateStr}`);
  return true;
}

async function markAllTodayDone() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('outreach_daily_tasks')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('task_date', today)
    .eq('completed', false)
    .select('id');

  if (error) {
    console.error(`Failed: ${error.message}`);
    process.exit(1);
  }
  console.log(`Marked ${data?.length || 0} tasks done for ${today}`);
}

async function main() {
  if (args.includes('--today') && args.includes('--done')) {
    await markAllTodayDone();
    return;
  }

  const taskId = args[0];
  if (!taskId) {
    console.error('Usage: npx tsx scripts/mark-task-done.ts <task-id> [--snooze Nd]');
    process.exit(1);
  }

  const snoozeIdx = args.indexOf('--snooze');
  if (snoozeIdx !== -1) {
    const daysStr = args[snoozeIdx + 1] || '1d';
    const days = parseInt(daysStr.replace('d', ''), 10) || 1;
    await snoozeTask(taskId, days);
  } else {
    await markDone(taskId);
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
