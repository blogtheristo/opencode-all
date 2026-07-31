/**
 * Nudge Persistence — Supabase-backed Integration Tests
 *
 * The unit suite (proactive-agents.test.ts) only covers the in-memory
 * fallback. This suite exercises the REAL Postgres paths that migration
 * 069_agent_nudges.sql creates:
 *
 *   1. The partial unique index `uq_agent_nudges_pending` — at most one
 *      pending nudge per (org_id, signal_key, entity_id).
 *   2. The DB-counted rate limit (countRecent → COUNT over created_at),
 *      which must hold across instances, not just in-process memory.
 *
 * GATED: only runs when ENABLE_SUPABASE_IN_TESTS=true AND real Supabase
 * service-role creds are configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)
 * pointing at an instance where migration 069 has been applied. Otherwise
 * skipped, so default CI stays self-contained.
 *
 *   ENABLE_SUPABASE_IN_TESTS=true SUPABASE_URL=... SUPABASE_SERVICE_KEY=... \
 *     npx vitest run src/__tests__/integration/nudge-persistence.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';

const RUN =
  process.env.ENABLE_SUPABASE_IN_TESTS === 'true' &&
  !!process.env.SUPABASE_URL &&
  !!(process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

// Unique org namespace per run so parallel runs / leftover rows never collide.
const ORG = `itest-nudge-${randomUUID()}`;

describe.skipIf(!RUN)('Nudge persistence (Supabase-backed)', () => {
  // Imported dynamically AFTER the gate so the in-memory suite is unaffected
  // and the module captures a real client at load.
  let nudgeService: typeof import('../../agents/nudge.service.js').nudgeService;
  let supabase: NonNullable<
    ReturnType<typeof import('../../config/supabase.js').getSupabaseClient>
  >;

  const base = {
    orgId: ORG,
    agentName: 'itest-agent',
    signalKey: 'site_safety_low',
    entityId: 'site-A',
    recipientRole: 'Site Manager',
    tier: 'threshold' as const,
    gateDecision: 'act_now' as const,
    channels: ['in_app' as const],
    subject: 'Integration test nudge',
    body: 'Safety score low. Confirm or override?',
    actionOptions: ['Confirm', 'Override'],
  };

  beforeAll(async () => {
    const cfg = await import('../../config/supabase.js');
    const client = cfg.getSupabaseClient();
    if (!client)
      throw new Error('Expected a real Supabase client when ENABLE_SUPABASE_IN_TESTS=true');
    supabase = client;
    nudgeService = (await import('../../agents/nudge.service.js')).nudgeService;
  });

  afterAll(async () => {
    if (supabase) {
      await supabase.from('agent_nudges').delete().eq('org_id', ORG);
    }
  });

  it('persists a nudge as a real row and dedups the same signal+entity', async () => {
    const entityId = `dedup-${randomUUID()}`;

    const first = await nudgeService.createNudge({ ...base, entityId });
    expect(first.created).toBe(true);
    expect(first.nudgeId).toBeDefined();

    // Row is really in Postgres.
    const { data: row } = await supabase
      .from('agent_nudges')
      .select('id,status,org_id')
      .eq('id', first.nudgeId!)
      .single();
    expect(row?.status).toBe('pending');
    expect(row?.org_id).toBe(ORG);

    // Second identical signal+entity is deduped (findPending hits the DB).
    const second = await nudgeService.createNudge({ ...base, entityId });
    expect(second.created).toBe(false);
    expect(second.reason).toBe('duplicate');
    expect(second.nudgeId).toBe(first.nudgeId);
  });

  it('enforces the dedup unique index on a concurrent double-insert', async () => {
    const entityId = `race-${randomUUID()}`;
    const mkRow = () => ({
      id: randomUUID(),
      org_id: ORG,
      signal_key: 'race_signal',
      entity_id: entityId,
      agent_name: base.agentName,
      recipient_role: base.recipientRole,
      tier: base.tier,
      gate_decision: base.gateDecision,
      channels: ['in_app'],
      status: 'pending',
      subject: base.subject,
      body: base.body,
      action_options: base.actionOptions,
      created_at: new Date().toISOString(),
      escalate_at: new Date(Date.now() + 3600_000).toISOString(),
      metadata: {},
    });

    const ok = await supabase.from('agent_nudges').insert(mkRow());
    expect(ok.error).toBeNull();

    // Second pending row for the same (org, signal, entity) must violate
    // uq_agent_nudges_pending (Postgres unique_violation = 23505).
    const dup = await supabase.from('agent_nudges').insert(mkRow());
    expect(dup.error).not.toBeNull();
    expect(dup.error?.code).toBe('23505');

    // After resolving the first, a new pending row IS allowed (partial index).
    await supabase
      .from('agent_nudges')
      .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
      .eq('org_id', ORG)
      .eq('signal_key', 'race_signal')
      .eq('entity_id', entityId);
    const afterResolve = await supabase.from('agent_nudges').insert(mkRow());
    expect(afterResolve.error).toBeNull();
  });

  it('rate-limits from the DB count, not in-process memory', async () => {
    const agentName = `rl-${randomUUID()}`;
    const notify = { channels: ['in_app' as const], maxPerHour: 2, maxPerDay: 50 };

    const a = await nudgeService.createNudge({ ...base, agentName, entityId: 'e1', notify });
    const b = await nudgeService.createNudge({ ...base, agentName, entityId: 'e2', notify });
    const c = await nudgeService.createNudge({ ...base, agentName, entityId: 'e3', notify });

    expect(a.created).toBe(true);
    expect(b.created).toBe(true);
    expect(c.created).toBe(false);
    expect(c.reason).toBe('rate_limited');

    // The count that drove the limit is a real COUNT(*) over created_at.
    const { count } = await supabase
      .from('agent_nudges')
      .select('*', { count: 'exact', head: true })
      .eq('agent_name', agentName)
      .eq('org_id', ORG)
      .gte('created_at', new Date(Date.now() - 3600_000).toISOString());
    expect(count).toBe(2);
  });
});
