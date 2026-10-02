/**
 * Aegis Durable Store — durability + failure-handling tests
 *
 * Closes RELEASE-READINESS.md BLOCKED item 1. Run against a REAL local
 * Postgres 16 instance (not a mock) so "survives a process restart" is
 * actually proven, not assumed.
 *
 * Set AEGIS_DURABILITY_TEST_DB_URL to a Postgres connection string with
 * infrastructure/dgx-spark/migrations/023_aegis_audit_chain.sql already
 * applied (same schema DGX Spark's dws-postgres runs) to run this suite for
 * real. Skipped (not failed) otherwise, so `npm test` stays green in an
 * environment without a real Postgres available — see RELEASE-READINESS.md
 * for the exact command used to run this suite in this session.
 *
 * "Restart" is simulated the only way that is actually meaningful for a
 * *durable* store: by throwing away the in-process `AegisDurableStore`
 * object and reading back through a brand-new one — proving the state lived
 * in Postgres, not in any JS closure. Pool injection (constructor / test-
 * only `setPoolForTests`) is used instead of env-var/module-cache tricks so
 * "which pool a store instance is using" is explicit at every step,
 * including the mid-operation-failure and reconnection tests.
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { AegisDurableStore } from '../../agents/aegis-durable-store.js';

const TEST_DB_URL = process.env.AEGIS_DURABILITY_TEST_DB_URL;

describe.skipIf(!TEST_DB_URL)('AegisDurableStore — real Postgres durability', () => {
  let realPool: Pool;

  beforeAll(() => {
    realPool = new Pool({ connectionString: TEST_DB_URL });
  });

  afterAll(async () => {
    await realPool.end();
  });

  beforeEach(async () => {
    // Clean slate per test — DELETE, not TRUNCATE (append-only table in
    // production; DELETE is also revoked from PUBLIC there — this test role
    // has broader grants than dws_backend specifically so tests can reset).
    await realPool.query('DELETE FROM aegis_audit_chain');
  });

  it('writes entries that are still readable and verifiable after the store instance is thrown away', async () => {
    const store1 = new AegisDurableStore(realPool);

    const r1 = await store1.reserve('sess-a', 'compliance', 'fp-1');
    if (r1.replay) throw new Error('unreachable');
    const e1 = await store1.finalize(r1.handle, 'first decision');
    expect(e1.durable).toBe(true);

    const r2 = await store1.reserve('sess-a', 'sovereignty', 'fp-2');
    if (r2.replay) throw new Error('unreachable');
    const e2 = await store1.finalize(r2.handle, 'second decision');
    expect(e2.durable).toBe(true);
    expect(e2.prevHash).toBe(e1.entryHash);

    // Simulate a process restart: discard store1 entirely. A fresh
    // AegisDurableStore has no state of its own — its only path to the data
    // is the pool, connected to the same Postgres database.
    const store2 = new AegisDurableStore(realPool);
    const chain = await store2.getChain();

    expect(chain.length).toBe(2);
    expect(chain[0].requestFingerprint).toBe('fp-1');
    expect(chain[1].requestFingerprint).toBe('fp-2');
    expect(chain[1].prevHash).toBe(chain[0].entryHash);

    const verification = await store2.verifyChain();
    expect(verification.valid).toBe(true);
    expect(verification.durable).toBe(true);
    expect(verification.brokenAtSeq).toBeNull();
  });

  it('rejects a replayed fingerprint durably, including across a fresh store instance', async () => {
    const store1 = new AegisDurableStore(realPool);
    const r1 = await store1.reserve('sess-b', 'compliance', 'fp-replay');
    if (r1.replay) throw new Error('unreachable');
    await store1.finalize(r1.handle, 'summary');

    // Same fingerprint, brand-new store instance (simulating a fresh process
    // or a second horizontally-scaled instance reading the same Postgres).
    const store2 = new AegisDurableStore(realPool);
    const r2 = await store2.reserve('sess-b', 'compliance', 'fp-replay');
    expect(r2.replay).toBe(true);
  });

  it('detects tampering performed directly against the Postgres row (not just the JS object)', async () => {
    const store1 = new AegisDurableStore(realPool);
    const r1 = await store1.reserve('sess-c', 'compliance', 'fp-tamper');
    if (r1.replay) throw new Error('unreachable');
    await store1.finalize(r1.handle, 'original summary');

    // Tamper via a raw SQL UPDATE — proves verifyChain() reads the real row
    // back from Postgres each time, not a cached JS object.
    await realPool.query(
      "UPDATE aegis_audit_chain SET result_summary = 'tampered' WHERE seq = $1",
      [r1.handle.seq],
    );

    const store2 = new AegisDurableStore(realPool);
    const verification = await store2.verifyChain();
    expect(verification.valid).toBe(false);
    expect(verification.brokenAtSeq).toBe(r1.handle.seq);
    expect(verification.durable).toBe(true);
  });

  it('two concurrent instances against the same Postgres never fork the chain', async () => {
    const storeA = new AegisDurableStore(realPool);
    const storeB = new AegisDurableStore(realPool);

    const [ra, rb] = await Promise.all([
      storeA.reserve('sess-concurrent', 'compliance', 'fp-concurrent-a'),
      storeB.reserve('sess-concurrent', 'sovereignty', 'fp-concurrent-b'),
    ]);
    if (ra.replay || rb.replay) throw new Error('unreachable');
    await Promise.all([
      storeA.finalize(ra.handle, 'a-summary'),
      storeB.finalize(rb.handle, 'b-summary'),
    ]);

    const chain = await new AegisDurableStore(realPool).getChain();
    expect(chain.length).toBe(2);
    // Whichever order the advisory lock serialized them in, the chain must
    // be a single unbroken line — no two entries sharing a prevHash.
    const verification = await new AegisDurableStore(realPool).verifyChain();
    expect(verification.valid).toBe(true);
  });

  it('startup with an unreachable Postgres degrades to the in-memory fallback instead of crashing', async () => {
    // A pool pointed at a port nothing listens on — connect() will reject.
    const deadPool = new Pool({
      host: '127.0.0.1',
      port: 1,
      database: 'dws_test',
      user: 'dws_test',
      connectionTimeoutMillis: 500,
    });
    const store = new AegisDurableStore(deadPool);

    const reservation = await store.reserve('sess-d', 'compliance', 'fp-degrade');
    expect(reservation.replay).toBe(false);
    if (reservation.replay) throw new Error('unreachable');
    expect(reservation.handle.durable).toBe(false); // fell back, did not throw

    const entry = await store.finalize(reservation.handle, 'degraded-mode summary');
    expect(entry.durable).toBe(false);
    expect(entry.resultSummary).toBe('degraded-mode summary'); // not silently dropped

    const chain = await store.getChain();
    expect(chain.length).toBe(1);
    const verification = await store.verifyChain();
    expect(verification.valid).toBe(true);
    expect(verification.durable).toBe(false);

    await deadPool.end().catch(() => {});
  });

  it('a mid-operation failure between reserve() and finalize() still preserves the entry (fails loud, not silently)', async () => {
    const store = new AegisDurableStore(realPool);
    const r1 = await store.reserve('sess-e', 'compliance', 'fp-mid-fail');
    if (r1.replay) throw new Error('unreachable');

    // Simulate the DB becoming unreachable strictly between reserve() and
    // finalize() by swapping this store's pool to a dead one mid-flight.
    const deadPool = new Pool({ host: '127.0.0.1', port: 1, connectionTimeoutMillis: 500 });
    store.setPoolForTests(deadPool);

    // finalize() targets the durable row via handle.durable === true, so it
    // still attempts the durable UPDATE path (and this proves the failure
    // is caught and reported, not thrown/dropped) even though the pool that
    // reserved it is no longer the one available.
    const entry = await store.finalize(r1.handle, 'summary written despite mid-op failure');
    expect(entry.resultSummary).toBe('summary written despite mid-op failure'); // not dropped
    expect(entry.entryHash).toBeTruthy(); // hash still computed and returned to the caller
    // The completion write itself did not persist — surfaced honestly as
    // durable:false, even though the bare reservation row (used only for
    // replay-dedup) does exist in Postgres.
    expect(entry.durable).toBe(false);

    await deadPool.end().catch(() => {});

    // The reservation row exists (reserve() succeeded against the real
    // pool) but is NOT yet a valid chain entry — entry_hash is still NULL,
    // so getChain() correctly excludes it until an operator re-finalizes it.
    const verifyStore = new AegisDurableStore(realPool);
    const chain = await verifyStore.getChain();
    expect(chain.find((e) => e.requestFingerprint === 'fp-mid-fail')).toBeUndefined();

    const rawRow = await realPool.query(
      'SELECT entry_hash FROM aegis_audit_chain WHERE request_fingerprint = $1',
      ['fp-mid-fail'],
    );
    expect(rawRow.rows[0]).toBeTruthy();
    expect(rawRow.rows[0].entry_hash).toBeNull();
  });

  it('recovers automatically once Postgres becomes reachable again after an outage', async () => {
    const deadPool = new Pool({ host: '127.0.0.1', port: 1, connectionTimeoutMillis: 500 });
    const store = new AegisDurableStore(deadPool);

    const duringOutage = await store.reserve('sess-f', 'compliance', 'fp-outage');
    if (duringOutage.replay) throw new Error('unreachable');
    expect(duringOutage.handle.durable).toBe(false);
    await store.finalize(duringOutage.handle, 'written during outage');

    await deadPool.end().catch(() => {});

    // Postgres is reachable again — point the SAME store instance at the
    // real pool (simulating the pool recovering / DNS resolving again) and
    // confirm the next request is durable, without needing a process restart.
    store.setPoolForTests(realPool);
    const afterRecovery = await store.reserve('sess-f', 'compliance', 'fp-recovered');
    if (afterRecovery.replay) throw new Error('unreachable');
    expect(afterRecovery.handle.durable).toBe(true);
    const entry = await store.finalize(afterRecovery.handle, 'written after recovery');
    expect(entry.durable).toBe(true);

    const chain = await new AegisDurableStore(realPool).getChain();
    expect(chain.some((e) => e.requestFingerprint === 'fp-recovered')).toBe(true);
  });
});
