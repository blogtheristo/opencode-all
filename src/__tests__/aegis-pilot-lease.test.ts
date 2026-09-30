// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-lease.test.ts
/**
 * KYA-S1 TRS-4 single-use lease token (Legal/KYA_S1.md §TRS-4; finding
 * 2026-09-30 in docs/plans/KNOWLEDGE_LOOP_FINDINGS.md): expiry alone does not
 * stop replay inside the validity window, so the token is consumed atomically
 * at execution time and a second use never executes.
 */

import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EvidenceLedger, SiteAuthority, statePaths } from '../aegis/pilot/index.js';
import { issueLease, LEASE_MAX_TTL_MS, LeaseAuthority } from '../aegis/pilot/lease.js';

let dir: string;
let site: SiteAuthority;
const T0 = new Date('2026-10-01T08:00:00.000Z');
const bind = 'a'.repeat(64);
const want = { action: 'valve.close', bind };

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'aegis-lease-'));
  site = SiteAuthority.init(join(dir, 's'), 'lease-site', T0);
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const authority = (now = T0) => LeaseAuthority.load(join(dir, 's'), () => new Date(now));
const lease = (ttlMs = 60_000) => issueLease(site, { ...want, ttlMs, now: T0 });

describe('single-use lease token (KYA-S1 TRS-4)', () => {
  it('executes once and refuses the second use as a replay, without running the action', async () => {
    const l = lease();
    let runs = 0;
    const first = await authority().consumeAndExecute(l, want, () => ++runs);
    expect(first).toEqual({ ok: true, value: 1 });
    const second = await authority().consumeAndExecute(l, want, () => ++runs);
    expect(second).toMatchObject({ ok: false, reason: expect.stringMatching(/already consumed/) });
    expect(runs).toBe(1);
  });

  it('lets exactly one of two concurrent consumers execute (atomic consume)', async () => {
    const l = lease();
    let runs = 0;
    const a = authority();
    const b = authority();
    const results = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        (i % 2 ? a : b).consumeAndExecute(l, want, async () => {
          runs++;
          await new Promise((r) => setTimeout(r, 5));
        }),
      ),
    );
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(runs).toBe(1);
  });

  it('refuses an expired lease and one issued in the future', async () => {
    const l = lease(1_000);
    const late = await authority(new Date(T0.getTime() + 1_001)).consumeAndExecute(
      l,
      want,
      () => 1,
    );
    expect(late).toMatchObject({ ok: false, reason: expect.stringMatching(/expired/) });
    const early = await authority(new Date(T0.getTime() - 10 * 60_000)).consumeAndExecute(
      l,
      want,
      () => 1,
    );
    expect(early).toMatchObject({ ok: false, reason: expect.stringMatching(/not yet valid/) });
    // Neither refusal consumed it.
    expect((await authority().consumeAndExecute(l, want, () => 1)).ok).toBe(true);
  });

  it('refuses a tampered lease and one bound to a different action or subject', async () => {
    const l = lease();
    const tampered = { ...l, action: 'valve.open' };
    expect(
      await authority().consumeAndExecute(tampered, { ...want, action: 'valve.open' }, () => 1),
    ).toMatchObject({ ok: false, reason: expect.stringMatching(/signature/) });
    expect(
      await authority().consumeAndExecute(l, { ...want, action: 'valve.open' }, () => 1),
    ).toMatchObject({ ok: false, reason: expect.stringMatching(/different action/) });
    expect(
      await authority().consumeAndExecute(l, { ...want, bind: 'b'.repeat(64) }, () => 1),
    ).toMatchObject({ ok: false, reason: expect.stringMatching(/different subject/) });
  });

  it("refuses a lease signed by another site's key", async () => {
    const other = SiteAuthority.init(join(dir, 'other'), 'lease-site', T0);
    const foreign = issueLease(other, { ...want, ttlMs: 60_000, now: T0 });
    expect(await authority().consumeAndExecute(foreign, want, () => 1)).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/issuer/),
    });
  });

  it('keeps the lease consumed when the action fails, so it is never retried automatically', async () => {
    const l = lease();
    await expect(
      authority().consumeAndExecute(l, want, () => {
        throw new Error('actuator fault');
      }),
    ).rejects.toThrow(/actuator fault/);
    let ran = false;
    const retry = await authority().consumeAndExecute(l, want, () => (ran = true));
    expect(retry.ok).toBe(false);
    expect(ran).toBe(false);
  });

  it('refuses malformed leases (schema, path-unsafe id) and over-long validity at issue', async () => {
    const l = lease();
    for (const bad of [null, {}, { ...l, leaseId: '../../x' }, { ...l, v: 2 }])
      expect((await authority().consumeAndExecute(bad, want, () => 1)).ok).toBe(false);
    expect(() => issueLease(site, { ...want, ttlMs: LEASE_MAX_TTL_MS + 1, now: T0 })).toThrow(
      /validity/,
    );
  });

  it('records consumption before the action runs, and in the ledger when given one', async () => {
    const l = lease();
    const ledger = EvidenceLedger.open(statePaths(join(dir, 's')).ledger, {
      siteId: site.manifest.siteId,
      orgId: 'org-test',
      signer: (h) => site.sign(h),
      publicKey: site.publicKey,
      now: () => T0,
    });
    let seenBefore = 0;
    await authority().consumeAndExecute(
      l,
      want,
      () => {
        seenBefore = readdirSync(join(dir, 's', 'leases', 'consumed')).length;
      },
      { ledger, traceId: 't-lease' },
    );
    ledger.close();
    expect(seenBefore).toBe(1);
    const events = readFileSync(statePaths(join(dir, 's')).ledger, 'utf8')
      .trim()
      .split('\n')
      .map((x) => JSON.parse(x));
    expect(events.at(-1)).toMatchObject({
      event_type: 'tool.invoke',
      trace_id: 't-lease',
      detail: { lease_id: l.leaseId, action: 'valve.close', bind },
    });
  });
});
