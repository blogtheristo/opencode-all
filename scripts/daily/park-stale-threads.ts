/**
 * Auto-Park Stale Outreach Threads
 *
 * Closes the loop that previously required a human reply to bump each thread.
 * Without this, threads with stale next_action_date or maxed-out nudge counts
 * appeared in the morning brief OVERDUE bucket every day forever.
 *
 * Park rules (any one is enough):
 *   1. nudge_count >= CADENCE[pipeline].maxNudges AND status in (intro_made, contacted)
 *      → cadence rule from src/outreach/cadence.ts was previously documented-but-unimplemented.
 *   2. next_action_date < today - PARK_STALE_DAYS (default 30) AND status in OPEN_STATUSES
 *      → catch-all for forgotten threads.
 *
 * Excludes:
 *   - status='new' with no last_outbound_at → handled by RESEARCH BACKLOG bucket, not parking.
 *   - status in (responded, meeting_booked, in_negotiation, converted, passed, parked) → terminal/active.
 *
 * Writes:
 *   - PATCH outreach_threads: status='parked', next_action_date=null, next_action_type=null,
 *     next_action='Auto-parked: <reason>'.
 *   - INSERT outreach_activities: activity_type='auto_park', outcome='no_response',
 *     created_by='auto_park'.
 *
 * Environment:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY (required)
 *   DRY_RUN=true   → log what would change, write nothing
 *   PARK_STALE_DAYS=30 (default)
 *
 * Schedule: registered in infrastructure/dgx-spark/cron-runner.ts at 03:30 UTC Mon-Sat,
 * 30 min before the morning brief at 04:00.
 *
 * Code-Version: 1.0
 * Owner: Lifetime Oy
 */

import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CADENCE } from '../../src/outreach/cadence.js';

type Pipeline = 'investor' | 'customer' | 'partner';

interface StaleThread {
  id: string;
  pipeline: Pipeline;
  status: string;
  nudge_count: number;
  next_action_date: string | null;
  last_outbound_at: string | null;
  person_id: string | null;
  org_id: string | null;
  first_name: string | null;
  last_name: string | null;
  org_name: string | null;
}

const DRY_RUN = process.env.DRY_RUN === 'true';
const PARK_STALE_DAYS = Number(process.env.PARK_STALE_DAYS || 30);

const OPEN_STATUSES = ['new', 'researched', 'intro_requested', 'intro_made', 'contacted'];
const WAITING_STATUSES = ['intro_made', 'contacted'];

function initSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.warn('[park-stale-threads] SUPABASE_URL or SUPABASE_SERVICE_KEY missing — exiting');
    return null;
  }
  return createClient(url, key);
}

function contactName(t: StaleThread): string {
  const name = [t.first_name, t.last_name].filter(Boolean).join(' ').trim();
  return name || t.org_name || `thread:${t.id.slice(0, 8)}`;
}

async function findStaleThreads(supabase: SupabaseClient): Promise<{
  maxedOut: StaleThread[];
  ancient: StaleThread[];
}> {
  // Pull every open thread once, then partition locally — fewer round-trips than per-rule queries.
  const { data, error } = await supabase
    .from('v_outreach_enriched')
    .select(
      'id, pipeline, status, nudge_count, next_action_date, last_outbound_at, person_id, org_id, first_name, last_name, org_name',
    )
    .in('status', OPEN_STATUSES);

  if (error) {
    throw new Error(`v_outreach_enriched query failed: ${error.message}`);
  }

  const rows = (data || []) as StaleThread[];
  const today = new Date().toISOString().split('T')[0];
  const staleCutoff = new Date(Date.now() - PARK_STALE_DAYS * 86_400_000)
    .toISOString()
    .split('T')[0];

  const maxedOut: StaleThread[] = [];
  const ancient: StaleThread[] = [];
  const seen = new Set<string>();

  for (const t of rows) {
    // Skip uncontacted "new" threads — they belong in RESEARCH BACKLOG, not the park.
    if (t.status === 'new' && !t.last_outbound_at) continue;

    const cadence = CADENCE[t.pipeline];
    const maxed =
      !!cadence &&
      (t.nudge_count ?? 0) >= cadence.maxNudges &&
      WAITING_STATUSES.includes(t.status);
    const tooOld = !!t.next_action_date && t.next_action_date < staleCutoff;

    if (maxed && !seen.has(t.id)) {
      maxedOut.push(t);
      seen.add(t.id);
    } else if (tooOld && !seen.has(t.id) && t.next_action_date && t.next_action_date < today) {
      ancient.push(t);
      seen.add(t.id);
    }
  }

  return { maxedOut, ancient };
}

async function parkThread(
  supabase: SupabaseClient,
  t: StaleThread,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  // 1. PATCH outreach_threads
  const { error: updateErr } = await supabase
    .from('outreach_threads')
    .update({
      status: 'parked',
      next_action_date: null,
      next_action_type: null,
      next_action: `Auto-parked: ${reason}`,
    })
    .eq('id', t.id);

  if (updateErr) {
    return { ok: false, error: `update: ${updateErr.message}` };
  }

  // 2. Log to outreach_activities for audit. Best-effort — don't fail the park.
  try {
    await supabase.from('outreach_activities').insert({
      thread_id: t.id,
      person_id: t.person_id,
      org_id: t.org_id,
      pipeline: t.pipeline,
      channel: 'system',
      activity_type: 'auto_park',
      description: `Auto-parked: ${reason}`,
      outcome: 'no_response',
      source: 'manual',
      created_by: 'auto_park',
    });
  } catch (err) {
    console.warn(
      `[park-stale-threads] activity log failed for ${t.id}: ${(err as Error).message}`,
    );
  }

  return { ok: true };
}

async function main(): Promise<void> {
  const startedAt = new Date().toISOString();
  console.log(
    `[park-stale-threads] start utc=${startedAt} dry_run=${DRY_RUN} stale_days=${PARK_STALE_DAYS}`,
  );

  const supabase = initSupabase();
  if (!supabase) {
    process.exit(1);
  }

  const { maxedOut, ancient } = await findStaleThreads(supabase);
  console.log(
    `[park-stale-threads] candidates: max_nudges=${maxedOut.length} stale_${PARK_STALE_DAYS}d=${ancient.length}`,
  );

  let parked = 0;
  const errors: string[] = [];

  for (const t of maxedOut) {
    const cadence = CADENCE[t.pipeline];
    const reason = `${t.nudge_count} nudges sent (max=${cadence.maxNudges}), no response`;
    console.log(`  [MAX_NUDGES] ${t.pipeline} ${contactName(t)} — ${reason}`);
    if (DRY_RUN) continue;
    const result = await parkThread(supabase, t, reason);
    if (result.ok) parked++;
    else errors.push(`${t.id}: ${result.error}`);
  }

  for (const t of ancient) {
    const reason = `next_action_date ${t.next_action_date} is older than ${PARK_STALE_DAYS}d`;
    console.log(`  [STALE] ${t.pipeline} ${contactName(t)} — ${reason}`);
    if (DRY_RUN) continue;
    const result = await parkThread(supabase, t, reason);
    if (result.ok) parked++;
    else errors.push(`${t.id}: ${result.error}`);
  }

  const total = maxedOut.length + ancient.length;
  console.log(
    `[park-stale-threads] done parked=${parked}/${total} errors=${errors.length} dry_run=${DRY_RUN}`,
  );
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ERROR: ${e}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[park-stale-threads] fatal:', err);
  process.exit(1);
});
