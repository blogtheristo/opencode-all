-- 080_agent_executions_governance_fields.sql
-- =============================================================================
-- PROPOSAL — REVIEWABLE ARTIFACT, NOT YET APPLIED.
--
-- Do NOT run this via psql / supabase db push / supabase migration up without
-- explicit human review and sign-off (RED zone). It is authored so the schema
-- change needed to compute Monthly Governed Decisions (MGD) is reviewable as
-- text, per the dominant-game recipe step 6 (INSTRUMENT):
--   docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md §3
--   DWS_TRUTH_STANDARD.md §2 row 29
--
-- WHY: MGD counts a decision ONLY when it (a) flows through the governed
-- outcome layer, (b) carries full Article 12 reasoning lineage, and (c) is
-- audit-grade. The current agent_executions table
-- (030_agent_logging_tables.sql) persists none of these three facts as
-- queryable columns, so scripts/compute-mgd.mjs FAILS LOUD instead of counting
-- a proxy (CLAUDE.md Rule 12). This migration adds the MINIMUM fields to close
-- that gap — nothing more (Rule 2/3: no speculative columns, no platform
-- refactor).
--
-- SCOPE: three columns + one partial index. This is deliberately NOT the full
-- LedgerNativeAgentOutput contract (journalEntries, regulatoryArtifact) from
-- AI_AGENT_GUIDELINES.md — only what MGD needs to count. Those remain a
-- separate, later change.
-- =============================================================================

-- (a) Did the decision flow through the governed outcome layer?
ALTER TABLE agent_executions
  ADD COLUMN IF NOT EXISTS governed_outcome_layer boolean NOT NULL DEFAULT false;

-- (b) Full EU AI Act Article 12 reasoning lineage. Shape (enforced in app +
--     scripts/compute-mgd.mjs isValidLineage(), not by a DB constraint here):
--       { "sources": ["EUTL:FI-000123", ...],   -- non-empty DataSourceRef[]
--         "reasoning": "model trace / prompt chain",
--         "signed_by": "sovereignty-layer:<key>" } -- Full Sovereignty signature
--     Nullable: legacy + ungoverned runs carry no lineage and are excluded
--     from MGD by design.
ALTER TABLE agent_executions
  ADD COLUMN IF NOT EXISTS article12_lineage jsonb;

-- (c) Would the decision survive regulator / internal-audit scrutiny?
ALTER TABLE agent_executions
  ADD COLUMN IF NOT EXISTS audit_grade boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN agent_executions.governed_outcome_layer IS
  'MGD criterion (a): decision flowed through the governed outcome layer. Populated by src/agents/base.agent.ts logExecution() from the AgentResponse (LedgerNativeAgentOutput). Field-note 2026-07-05 §3.';
COMMENT ON COLUMN agent_executions.article12_lineage IS
  'MGD criterion (b): EU AI Act Article 12 reasoning lineage { sources[], reasoning, signed_by }. Populated by base.agent.ts logExecution() from AgentResponse lineage. Counts only when sources[] non-empty AND reasoning AND signed_by present.';
COMMENT ON COLUMN agent_executions.audit_grade IS
  'MGD criterion (c): decision is audit-grade (would survive regulator / internal-audit scrutiny). Populated by base.agent.ts logExecution(). Field-note 2026-07-05 §3.';

-- Supports the MGD count query (governed + audit-grade completed decisions,
-- grouped by org_id over a time window).
CREATE INDEX IF NOT EXISTS idx_agent_executions_mgd
  ON agent_executions (org_id, created_at DESC)
  WHERE governed_outcome_layer AND audit_grade AND status = 'completed';

-- WHERE POPULATED (review note, not applied here):
--   src/agents/base.agent.ts → logExecution(log: AgentExecutionLog).
--   AgentExecutionLog (src/agents/types.ts) must gain governed_outcome_layer,
--   article12_lineage, audit_grade, sourced from the AgentResponse of
--   operational (non-exempt) agents per the Ledger-Native Output Contract.
--   That app-side wiring is a SEPARATE change, gated on this migration's review.

-- ROLLBACK (manual, if ever applied):
--   DROP INDEX IF EXISTS idx_agent_executions_mgd;
--   ALTER TABLE agent_executions
--     DROP COLUMN IF EXISTS audit_grade,
--     DROP COLUMN IF EXISTS article12_lineage,
--     DROP COLUMN IF EXISTS governed_outcome_layer;

-- SELECT 'Migration 080 is a PROPOSAL — not applied automatically' AS status;
