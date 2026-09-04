-- Migration 023: aegis_audit_chain
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend agent runtime
--
-- Durable backing store for the Aegis orchestrator's (src/agents/aegis.agent.ts)
-- replay/nonce dedup and tamper-evident, hash-chained audit trail. Closes
-- BLOCKED item 1 from RELEASE-READINESS.md: the prior implementation kept
-- both structures in a process-local in-memory Set/Array, lost on restart
-- and not shared across horizontally scaled instances.
--
-- Design notes:
--   - The hash-chain algorithm is UNCHANGED from the in-memory implementation:
--     entryHash = sha256(seq|timestamp|sessionId|action|requestFingerprint|prevHash|resultSummary),
--     computed in application code (src/agents/aegis-durable-store.ts), not by
--     a DB trigger. Only the persistence layer moved. This mirrors
--     019_command_audit_log.sql's tamper-evidence *intent* (append-only,
--     hash-linked) but keeps the existing app-level hash formula intact
--     rather than swapping in the DB-trigger-computed variant that table uses.
--   - request_fingerprint carries a UNIQUE constraint: this is the durable
--     replay/nonce dedup mechanism (previously an in-memory Set). A duplicate
--     INSERT raises 23505, which the store layer treats as "replay detected"
--     rather than a write failure.
--   - seq is a BIGSERIAL so ordering survives across app-process restarts;
--     the application still recomputes prev_hash from the latest row under
--     an advisory lock (see AegisDurableStore.appendEntry) to avoid two
--     concurrent instances forking the chain.
--   - Append-only: dws_backend gets SELECT + INSERT + this one UPDATE path
--     (see below) — no DELETE/TRUNCATE, same belt-and-suspenders pattern as
--     command_audit_log and article12_audit_log.
--   - Two-phase write (reserve/finalize — see AegisDurableStore): a row is
--     INSERTed at reserve() time with prev_hash/entry_hash/result_summary
--     NULL (the row's existence + UNIQUE(request_fingerprint) IS the durable
--     replay-claim), then completed by exactly one UPDATE from finalize().
--     prev_hash is resolved by finalize() under the advisory lock from the
--     last row that has already completed (entry_hash IS NOT NULL) — not
--     from the last *reserved* row — so two reservations racing ahead of
--     their finalizes can never both link to the same not-yet-completed
--     row and fork the chain.

CREATE TABLE IF NOT EXISTS aegis_audit_chain (
  seq                  BIGSERIAL   PRIMARY KEY,
  entry_timestamp      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id           TEXT        NOT NULL,
  action                TEXT        NOT NULL,
  request_fingerprint  TEXT        NOT NULL UNIQUE,
  -- Nullable: NULL until finalize() completes this row (see note above).
  prev_hash            TEXT,
  entry_hash           TEXT,
  result_summary       TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS aegis_audit_chain_session_id_idx ON aegis_audit_chain (session_id);
CREATE INDEX IF NOT EXISTS aegis_audit_chain_created_at_idx ON aegis_audit_chain (created_at DESC);

COMMENT ON TABLE aegis_audit_chain IS
  'Durable replay/nonce dedup + tamper-evident hash chain for the Aegis orchestrator (src/agents/aegis.agent.ts). Append-only. Do not delete rows. Replaces the pre-durability in-memory implementation (RELEASE-READINESS.md item 1).';
COMMENT ON COLUMN aegis_audit_chain.request_fingerprint IS
  'sha256(sessionId + action + JSON(subInput)). UNIQUE — a duplicate insert IS the replay-detection signal.';
COMMENT ON COLUMN aegis_audit_chain.entry_hash IS
  'sha256(seq|timestamp|sessionId|action|requestFingerprint|prevHash|resultSummary), computed in application code — same formula as the prior in-memory implementation.';

GRANT SELECT, INSERT ON aegis_audit_chain TO dws_backend;
-- Column-scoped UPDATE, not a blanket table UPDATE: only the three fields
-- finalize() completes (prev_hash/entry_hash/result_summary) are writable
-- after INSERT. session_id/action/request_fingerprint/entry_timestamp are
-- immutable once reserved — no grant covers them, so even dws_backend
-- cannot rewrite a row's identity after the fact.
GRANT UPDATE (prev_hash, entry_hash, result_summary) ON aegis_audit_chain TO dws_backend;
GRANT USAGE, SELECT ON SEQUENCE aegis_audit_chain_seq_seq TO dws_backend;

REVOKE DELETE   ON aegis_audit_chain FROM PUBLIC;
REVOKE TRUNCATE ON aegis_audit_chain FROM PUBLIC;
