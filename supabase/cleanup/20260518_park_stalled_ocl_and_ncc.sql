-- =============================================================================
-- RUNBOOK: Park stalled "Old One Click LCA" + "NCC Sustainability Manager"
-- File:    supabase/cleanup/20260518_park_stalled_ocl_and_ncc.sql
-- Author:  claude/one-click-lca-partnership-MIYvn
-- Purpose: Remove these two entries from the morning brief by setting
--          status = 'parked' (the brief excludes converted/passed/parked).
--
-- Why parked, not passed/deleted:
--   - One Click LCA: stalled v1.0 thread is being SUPERSEDED by a new
--     active thread for Suzana Delanghe (CRO). Park the old one so it
--     stops surfacing in the brief, but keep the audit trail.
--   - NCC Sustainability Manager: revisit later candidate. Park, not pass.
--
-- Schema (per 023_outreach_contacts.sql):
--   outreach_threads(person_id, org_id, pipeline, status, ...)
--   persons(id, first_name, last_name, title, ...)
--   outreach_orgs(id, name, domain, ...)
--
-- Safety:
--   - Fail-fast guards: aborts if matches > 3 per tag (sanity cap)
--     or if Suzana's new thread accidentally matches.
--   - Single transaction with BEGIN/COMMIT.
--   - Preview SELECTs before any UPDATE so you can ROLLBACK if surprised.
--
-- How to run:
--   1) Open Supabase SQL editor (production).
--   2) Paste this entire file in ONE shot (so BEGIN/COMMIT is honored).
--   3) Read every PREVIEW SELECT before COMMIT.
--   4) If anything looks wrong, change COMMIT → ROLLBACK at the bottom.
--   5) If correct, COMMIT.
--
-- Verification after COMMIT:
--   SELECT thread_token, status, pipeline, org_name, first_name, last_name
--   FROM v_outreach_enriched ve
--   WHERE ve.id IN (SELECT thread_id FROM _targets);
--   -- expected: status = 'parked' for both
-- =============================================================================

BEGIN;

-- 0) Resolve targets into a temp table so all guards reference the same set
CREATE TEMP TABLE _targets ON COMMIT DROP AS
SELECT
  ot.id            AS thread_id,
  ot.person_id,
  ot.pipeline,
  ot.status        AS current_status,
  o.name           AS org_name,
  p.first_name,
  p.last_name,
  p.title          AS person_title,
  CASE
    WHEN LOWER(o.name) IN ('one click lca', 'oneclicklca', 'bionova oy', 'bionova')
      THEN 'OCL_STALLED'
    WHEN LOWER(o.name) LIKE 'ncc%'
     AND LOWER(COALESCE(p.title, '')) LIKE '%sustainability%manager%'
      THEN 'NCC_SUSTAINABILITY_MANAGER'
  END AS target_tag
FROM outreach_threads ot
JOIN persons p ON p.id = ot.person_id
LEFT JOIN outreach_orgs o ON o.id = ot.org_id
WHERE
  -- Only consider threads the brief currently surfaces
  ot.status NOT IN ('converted', 'passed', 'parked')
  AND (
        -- OCL: old stalled v1.0 thread (warm intro via Simon Sim → Panu)
        (
          LOWER(o.name) IN ('one click lca', 'oneclicklca', 'bionova oy', 'bionova')
          AND NOT (
            LOWER(p.first_name) = 'suzana'
            AND LOWER(p.last_name) = 'delanghe'
          )
        )
     OR -- NCC sustainability manager
        (
          LOWER(o.name) LIKE 'ncc%'
          AND LOWER(COALESCE(p.title, '')) LIKE '%sustainability%manager%'
        )
  );

-- ── PREVIEW 1: see what we matched ──────────────────────────────────────────
SELECT target_tag,
       thread_id,
       pipeline,
       current_status,
       org_name,
       first_name,
       last_name,
       person_title
FROM _targets
ORDER BY target_tag, org_name, last_name;

-- ── FAIL-FAST GUARDS ────────────────────────────────────────────────────────

-- Guard 1: each target_tag matches at least one row.
-- If both are zero, abort (nothing to do, surface that).
DO $$
DECLARE
  v_ocl  INT;
  v_ncc  INT;
BEGIN
  SELECT COUNT(*) INTO v_ocl FROM _targets WHERE target_tag = 'OCL_STALLED';
  SELECT COUNT(*) INTO v_ncc FROM _targets WHERE target_tag = 'NCC_SUSTAINABILITY_MANAGER';

  IF v_ocl = 0 THEN
    RAISE NOTICE 'No stalled One Click LCA thread found — already parked or never existed.';
  END IF;
  IF v_ncc = 0 THEN
    RAISE NOTICE 'No NCC Sustainability Manager thread found — already parked or never existed.';
  END IF;
  IF v_ocl = 0 AND v_ncc = 0 THEN
    RAISE EXCEPTION 'No matching threads for either target. Nothing to do — check person/org records.';
  END IF;

  -- Sanity: small per-tag cap. If more, something's wrong with the filter.
  IF v_ocl > 3 THEN
    RAISE EXCEPTION 'Unexpected OCL match count: % (>3). Inspect _targets before proceeding.', v_ocl;
  END IF;
  IF v_ncc > 3 THEN
    RAISE EXCEPTION 'Unexpected NCC match count: % (>3). Inspect _targets before proceeding.', v_ncc;
  END IF;
END $$;

-- Guard 2: refuse to park Suzana's new thread if it accidentally matched.
DO $$
DECLARE v_suzana INT;
BEGIN
  SELECT COUNT(*) INTO v_suzana
  FROM _targets t
  JOIN persons p ON p.id = t.person_id
  WHERE LOWER(p.first_name) = 'suzana' AND LOWER(p.last_name) = 'delanghe';
  IF v_suzana > 0 THEN
    RAISE EXCEPTION 'Suzana Delanghe matched the OCL filter — refusing to park the active thread.';
  END IF;
END $$;

-- ── PREVIEW 2: what the UPDATE will do ──────────────────────────────────────
SELECT thread_id,
       current_status,
       'parked'::outreach_status AS new_status,
       org_name,
       first_name || ' ' || COALESCE(last_name, '') AS person,
       person_title,
       target_tag
FROM _targets
ORDER BY target_tag;

-- ── STEP 1: Park the threads ────────────────────────────────────────────────

UPDATE outreach_threads ot
SET status = 'parked',
    boardy_notes = COALESCE(boardy_notes || E'\n', '') ||
            '[' || NOW()::TEXT || '] Parked via 20260518 cleanup '
            || '(superseded — see claude/one-click-lca-partnership-MIYvn).'
FROM _targets t
WHERE ot.id = t.thread_id;

-- ── VERIFICATION ────────────────────────────────────────────────────────────

-- Expect: every target row now has status = 'parked'
SELECT t.target_tag,
       t.thread_id,
       t.org_name,
       t.first_name || ' ' || COALESCE(t.last_name, '') AS person,
       ot.status AS final_status
FROM _targets t
JOIN outreach_threads ot ON ot.id = t.thread_id
ORDER BY t.target_tag;

-- Expect: zero rows here (none should still appear in the brief feed)
SELECT ve.id, ve.status, ve.pipeline, ve.org_name
FROM v_outreach_enriched ve
WHERE ve.id IN (SELECT thread_id FROM _targets)
  AND ve.status NOT IN ('converted', 'passed', 'parked');

-- ── If everything checks out, COMMIT. Otherwise change to ROLLBACK. ────────
COMMIT;
-- ROLLBACK;
