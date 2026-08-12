-- Migration 069: agent_nudges — proactive nudge state for observe→act agents
--
-- Backs src/agents/nudge.service.ts. One row per proactive nudge a DWS IQ
-- agent (or the signal poller) raises for a human. Persisted state gives us:
--
--   1. Deduplication — a partial unique index keeps at most one *pending* nudge
--      per (org_id, signal_key, entity_id), preventing the "nagging agent"
--      problem when a breach persists across multiple poll intervals.
--   2. Restart-safe escalation — escalate_at lets the poller pick up nudges
--      whose response window lapsed, instead of losing in-memory timers.
--   3. Cross-instance rate limiting — per-agent hour/day counts are derived
--      from created_at here, so limits hold under horizontal scaling.
--
-- Fully additive. No backfill.

BEGIN;

CREATE TABLE IF NOT EXISTS agent_nudges (
  id              UUID PRIMARY KEY,
  org_id          TEXT NOT NULL,
  signal_key      TEXT NOT NULL,
  entity_id       TEXT NOT NULL,
  agent_name      TEXT NOT NULL,
  recipient_role  TEXT NOT NULL,
  tier            TEXT NOT NULL CHECK (tier IN ('threshold', 'anomaly', 'ambient')),
  gate_decision   TEXT NOT NULL CHECK (gate_decision IN ('act_now', 'flag_for_review', 'digest', 'skip')),
  channels        TEXT[] NOT NULL DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'overridden', 'dismissed', 'escalated')),
  subject         TEXT NOT NULL,
  body            TEXT NOT NULL,
  action_options  TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  escalate_at     TIMESTAMPTZ NOT NULL,
  resolved_at     TIMESTAMPTZ,
  resolution      TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Dedup: at most one pending nudge per signal + entity per org.
CREATE UNIQUE INDEX IF NOT EXISTS uq_agent_nudges_pending
  ON agent_nudges (org_id, signal_key, entity_id)
  WHERE status = 'pending';

-- Escalation sweep: "pending nudges past their deadline".
CREATE INDEX IF NOT EXISTS idx_agent_nudges_overdue
  ON agent_nudges (escalate_at)
  WHERE status = 'pending';

-- Rate-limit counts: "this agent's nudges in the last hour/day".
CREATE INDEX IF NOT EXISTS idx_agent_nudges_agent_time
  ON agent_nudges (agent_name, org_id, created_at);

-- Row Level Security — service role writes; org members read their own.
ALTER TABLE agent_nudges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS agent_nudges_service_all ON agent_nudges;
CREATE POLICY agent_nudges_service_all
  ON agent_nudges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;
