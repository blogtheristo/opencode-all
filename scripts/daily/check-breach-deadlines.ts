/**
 * Breach Notification Deadline Checker
 * Runs daily via day-runner.sh (auto-discovered in scripts/daily/)
 *
 * Checks Supabase `breach_notifications` table for open records.
 * Calculates hours elapsed since Shufti's notification timestamp.
 * Fires alerts at 24h (internal review deadline) and 48h (last call
 * before 72h GDPR Art. 33 statutory deadline).
 * Logs all checks to Supabase `audit_log` for traceability.
 *
 * Code-Version: 1.0
 * Date: 2026-04-07
 * Owner: Lifetime Oy
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Deadline thresholds in hours
const INTERNAL_DEADLINE_H = 24; // Assess + notify Tietosuojavaltuutettu
const LAST_CALL_H = 48; // Last call before 72h statutory
const STATUTORY_DEADLINE_H = 72; // GDPR Art. 33

interface BreachRecord {
  id: string;
  source: string;
  received_at: string;
  category: string;
  art9_biometric: boolean;
  data_subjects_estimate: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dpa_notified_at: string | null;
  data_subjects_notified_at: string | null;
  resolved_at: string | null;
  notes: string | null;
}

type AlertLevel = 'OK' | 'ACTIVE' | 'WARNING' | 'CRITICAL';

interface CheckResult {
  breach_id: string;
  alert_level: AlertLevel;
  hours_elapsed: number;
  hours_remaining_internal: number;
  hours_remaining_statutory: number;
  dpa_notified: boolean;
  message: string;
}

async function auditLog(action: string, details: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('audit_log').insert({
    action,
    actor: 'cron:check-breach-deadlines',
    details,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.error(`Audit log write failed: ${error.message}`);
  }
}

async function checkBreaches(): Promise<void> {
  console.log('=== Breach Notification Deadline Check ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');

  // Fetch open (unresolved) breach notifications
  const { data: breaches, error } = await supabase
    .from('breach_notifications')
    .select('*')
    .is('resolved_at', null)
    .order('received_at', { ascending: true });

  if (error) {
    // Table might not exist yet — that's fine, no breaches
    if (error.code === '42P01') {
      console.log('OK: breach_notifications table does not exist yet.');
      console.log('    No active breach notifications. Table will be created on first incident.');
      await auditLog('breach_check_no_table', { status: 'ok' });
      return;
    }
    console.error(`ERROR: Failed to query breach_notifications: ${error.message}`);
    await auditLog('breach_check_error', { error: error.message });
    process.exit(1);
  }

  if (!breaches || breaches.length === 0) {
    console.log('OK: No active breach notifications.');
    await auditLog('breach_check_clear', { active_count: 0 });
    return;
  }

  const now = Date.now();
  const results: CheckResult[] = [];
  let criticalCount = 0;
  let warningCount = 0;

  for (const breach of breaches as BreachRecord[]) {
    const receivedAt = new Date(breach.received_at).getTime();
    const elapsedMs = now - receivedAt;
    const elapsedH = elapsedMs / (1000 * 60 * 60);
    const remainingInternalH = INTERNAL_DEADLINE_H - elapsedH;
    const remainingStatutoryH = STATUTORY_DEADLINE_H - elapsedH;
    const dpaNotified = breach.dpa_notified_at !== null;

    let alertLevel: AlertLevel;
    let message: string;

    if (dpaNotified) {
      alertLevel = 'ACTIVE';
      message = `DPA notified, awaiting resolution. ${elapsedH.toFixed(1)}h elapsed.`;
    } else if (elapsedH >= STATUTORY_DEADLINE_H) {
      alertLevel = 'CRITICAL';
      message = `72h GDPR Art.33 statutory deadline EXPIRED. REGULATORY EXPOSURE. Notify Tietosuojavaltuutettu IMMEDIATELY.`;
      criticalCount++;
    } else if (elapsedH >= LAST_CALL_H) {
      alertLevel = 'CRITICAL';
      message = `48h LAST CALL — ${remainingStatutoryH.toFixed(1)}h until statutory 72h deadline. Notify Tietosuojavaltuutettu NOW.`;
      criticalCount++;
    } else if (elapsedH >= INTERNAL_DEADLINE_H) {
      alertLevel = 'WARNING';
      message = `24h internal deadline passed. ${remainingStatutoryH.toFixed(1)}h until statutory deadline. Assess and notify.`;
      warningCount++;
    } else if (remainingInternalH <= 4) {
      alertLevel = 'WARNING';
      message = `${remainingInternalH.toFixed(1)}h until 24h internal deadline. Begin assessment now.`;
      warningCount++;
    } else {
      alertLevel = 'ACTIVE';
      message = `${elapsedH.toFixed(1)}h elapsed, ${remainingInternalH.toFixed(1)}h until internal deadline.`;
    }

    const result: CheckResult = {
      breach_id: breach.id,
      alert_level: alertLevel,
      hours_elapsed: Math.round(elapsedH * 10) / 10,
      hours_remaining_internal: Math.round(remainingInternalH * 10) / 10,
      hours_remaining_statutory: Math.round(remainingStatutoryH * 10) / 10,
      dpa_notified: dpaNotified,
      message,
    };

    results.push(result);

    const biometricTag = breach.art9_biometric ? ' [Art.9 BIOMETRIC]' : '';
    console.log(`${alertLevel}: ${breach.id} — ${message}`);
    console.log(`  Source: ${breach.source} | Severity: ${breach.severity}${biometricTag}`);
    console.log(`  Data subjects: ~${breach.data_subjects_estimate}`);
    console.log('');
  }

  console.log('--- Summary ---');
  console.log(`Active breaches: ${breaches.length}`);
  console.log(`Critical alerts: ${criticalCount}`);
  console.log(`Warnings:        ${warningCount}`);

  if (criticalCount > 0) {
    console.log('');
    console.log('ACTION REQUIRED: Breach deadline(s) exceeded.');
    console.log('Contact: Risto Anton Paarni (CEO/DPO) — risto.paarni@lifetime.fi');
    console.log('Finnish DPA: https://tietosuoja.fi/en/notification-of-a-personal-data-breach');
  }

  // Log full check to audit ledger
  await auditLog('breach_deadline_check', {
    active_count: breaches.length,
    critical_count: criticalCount,
    warning_count: warningCount,
    results,
  });

  if (criticalCount > 0) {
    process.exit(1);
  }
}

checkBreaches().catch((err) => {
  console.error('Fatal error in breach deadline check:', err);
  process.exit(1);
});
