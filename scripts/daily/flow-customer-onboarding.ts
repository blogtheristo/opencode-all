/**
 * Flow: Customer Onboarding
 * Auto-discovered by day-runner.sh in scripts/daily/
 *
 * Drives the Day 0/3/7 email sequence for new customers:
 *   New conversion → Day 0 welcome email (Lucille)
 *   3 days old → Day 3 nudge email
 *   7 days old → Day 7 check-in email
 *   Completed + < 30d → Marcus technical setup check
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import {
  initSupabase,
  createDailyTasks,
  logFlowRun,
  daysSince,
  type FlowTask,
  type FlowRunStats,
} from '../lib/flow-utils.js';
import { sendEmail } from '../../src/utils/send-email.js';

const FLOW = 'flow-customer-onboarding';
const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';

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

  // 1. New conversions without onboarding record → create + Day 0
  const { data: convertedThreads, error: convError } = await supabase
    .from('v_outreach_enriched')
    .select('*')
    .eq('pipeline', 'customer')
    .eq('status', 'converted');

  if (convError) {
    stats.errors.push(`converted query: ${convError.message}`);
  } else if (convertedThreads) {
    for (const thread of convertedThreads) {
      const { data: existing } = await supabase
        .from('customer_onboarding')
        .select('id')
        .eq('company_name', thread.org_name || '')
        .limit(1);

      if (!existing || existing.length === 0) {
        const name = `${thread.person_first_name || ''} ${thread.person_last_name || ''}`.trim();
        const email = thread.person_email || null;

        if (email) {
          await sendEmail({
            from: FROM,
            to: email,
            subject: 'Welcome to DWS IQ 6 — Your compliance journey starts now',
            text: `Hi ${name || 'there'},\n\nWelcome to DWS IQ 6. Your account is ready.\n\nFirst step: Run your first CSRD assessment — it takes under 2 minutes.\n\nWe're here if you need anything.\n\nBest,\nThe DWS IQ Team`,
            html: `<p>Hi ${name || 'there'},</p><p>Welcome to DWS IQ 6. Your account is ready.</p><p><strong>First step:</strong> Run your first CSRD assessment — it takes under 2 minutes.</p><p>We're here if you need anything.</p><p>Best,<br>The DWS IQ Team</p>`,
          });
          console.log(`[${FLOW}] Day 0 welcome sent to ${email}`);
        }

        tasks.push({
          pipeline: 'customer',
          thread_id: thread.id,
          task_description: `DAY 0: Welcome email sent to ${name} (${thread.org_name || 'unknown org'})`,
          assigned_to: 'Lucille',
        });
        stats.threads_processed++;
      }
    }
  }

  // 2. Onboarding records — Day 3 nudge
  const { data: allOnboarding, error: onbError } = await supabase
    .from('customer_onboarding')
    .select('*')
    .is('completed_at', null);

  if (onbError) {
    stats.errors.push(`customer_onboarding query: ${onbError.message}`);
  } else if (allOnboarding) {
    for (const row of allOnboarding) {
      const age = daysSince(row.created_at);

      if (age >= 3 && age < 5) {
        // Day 3 nudge
        tasks.push({
          pipeline: 'customer',
          task_description: `DAY 3 NUDGE: ${row.company_name} — ${age}d since signup, no assessment completed`,
          context: `Industry: ${row.industry}, Regulations: ${(row.regulations || []).join(', ')}`,
          assigned_to: 'Lucille',
        });
        stats.threads_processed++;
      } else if (age >= 7 && age < 10) {
        // Day 7 check-in
        tasks.push({
          pipeline: 'customer',
          task_description: `DAY 7 CHECK-IN: ${row.company_name} — ${age}d, still not completed onboarding`,
          context: `Consider: personal call, feature walkthrough, or data connection help`,
          assigned_to: 'Lucille',
        });
        stats.threads_processed++;
      }
    }
  }

  // 3. Completed onboarding < 30d → Marcus technical setup check
  const { data: completedOnboarding, error: compError } = await supabase
    .from('customer_onboarding')
    .select('*')
    .not('completed_at', 'is', null);

  if (compError) {
    stats.errors.push(`completed_onboarding query: ${compError.message}`);
  } else if (completedOnboarding) {
    for (const row of completedOnboarding) {
      const age = daysSince(row.completed_at);

      if (age >= 0 && age <= 30 && row.erp_connection) {
        const erp = typeof row.erp_connection === 'object' ? row.erp_connection : {};
        const erpType = (erp as Record<string, unknown>).type || 'unknown';
        const verified = (erp as Record<string, unknown>).verified || false;

        if (!verified) {
          tasks.push({
            pipeline: 'customer',
            task_description: `TECH SETUP: ${row.company_name} — ERP ${erpType} connected but not verified`,
            context: `Completed ${age}d ago. Verify ERP data sync and first report generation.`,
            assigned_to: 'Marcus',
          });
          stats.threads_processed++;
        }
      }
    }
  }

  // 4. Persist tasks
  if (tasks.length > 0) {
    stats.tasks_created = await createDailyTasks(tasks, supabase);
  }

  // No pipeline summary for onboarding — just log
  console.log(`[${FLOW}] ${tasks.length} onboarding tasks generated`);

  logFlowRun(stats);
}

main().catch((err) => {
  console.error(`[${FLOW}] FATAL:`, err);
  process.exit(1);
});
