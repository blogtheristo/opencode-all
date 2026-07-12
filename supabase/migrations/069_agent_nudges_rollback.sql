-- Rollback for Migration 069: agent_nudges
--
-- RED-ZONE: applying this DROPS the agent_nudges table and all persisted
-- proactive-nudge state. Only run to reverse 069_agent_nudges.sql. After this
-- runs, src/agents/nudge.service.ts transparently reverts to its single-instance
-- in-memory fallback (dedup + rate-limit hold per-process only).
--
-- Dropping the table removes its indexes (uq_agent_nudges_pending,
-- idx_agent_nudges_overdue, idx_agent_nudges_agent_time) and RLS policy
-- (agent_nudges_service_all) with it; they are listed explicitly for clarity.

BEGIN;

DROP POLICY IF EXISTS agent_nudges_service_all ON agent_nudges;

DROP INDEX IF EXISTS uq_agent_nudges_pending;
DROP INDEX IF EXISTS idx_agent_nudges_overdue;
DROP INDEX IF EXISTS idx_agent_nudges_agent_time;

DROP TABLE IF EXISTS agent_nudges;

COMMIT;
