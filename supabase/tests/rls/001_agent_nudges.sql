-- RLS contract tests for agent_nudges (migration 069)
--
-- Contract under test (multi-tenant safety):
--   1. RLS enabled on agent_nudges
--   2. service_role policy grants FOR ALL (and only to service_role)
--   3. anon / authenticated are default-denied (no SELECT visibility, no INSERT)
--   4. pending-dedup unique index rejects duplicate pending nudges
--
-- Run with pgTAP installed:
--   pg_prove -d "$DATABASE_URL" supabase/tests/rls/*.sql
--
-- NOTE: a TypeScript twin of this file lives at scripts/test-rls-agent-nudges.ts
-- (`npm run db:test:rls`) for environments without perl/pg_prove. Keep the two
-- in sync.

BEGIN;
SELECT plan(8);

SELECT isnt((SELECT relrowsecurity FROM pg_class WHERE relname = 'agent_nudges'),
            false, 'RLS is enabled on agent_nudges');

SELECT is(
  (SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'agent_nudges'
      AND policy_name = 'agent_nudges_service_all'
      AND cmd = 'ALL' AND roles = ARRAY['service_role']::name[]),
  1::bigint,
  'service_role policy grants FOR ALL (and only to service_role)');

INSERT INTO agent_nudges
  (id, org_id, signal_key, entity_id, agent_name, recipient_role,
   tier, gate_decision, subject, body, escalate_at)
VALUES
  (gen_random_uuid(), 'rls-test-org-a', 'test-signal', 'test-entity',
   'rls-test-agent', 'owner', 'threshold', 'flag_for_review', 't', 'b',
   now() + interval '4 hours'),
  (gen_random_uuid(), 'rls-test-org-b', 'test-signal', 'test-entity',
   'rls-test-agent', 'owner', 'threshold', 'flag_for_review', 't', 'b',
   now() + interval '4 hours');

-- 4. pending-dedup unique index
SELECT throws_ok(
  $sql$ INSERT INTO agent_nudges
          (id, org_id, signal_key, entity_id, agent_name, recipient_role,
           tier, gate_decision, subject, body, escalate_at)
        VALUES (gen_random_uuid(), 'rls-test-org-a', 'test-signal', 'test-entity',
                'rls-test-agent', 'owner', 'threshold', 'flag_for_review',
                'dup', 'dup', now() + interval '4 hours') $sql$,
  'unique constraint',
  'duplicate pending nudge rejected by unique index');

-- 5-6. anon default-deny
SET LOCAL ROLE anon;
SELECT is((SELECT count(*) FROM agent_nudges), 0::bigint,
          'anon sees zero nudges (default-deny read)');
SELECT throws_ok(
  $sql$ INSERT INTO agent_nudges
          (id, org_id, signal_key, entity_id, agent_name, recipient_role,
           tier, gate_decision, subject, body, escalate_at)
        VALUES (gen_random_uuid(), 'rls-test-org-a', 'w-s', 'w-e', 'a', 'r',
                'threshold', 'digest', 'x', 'y', now()) $sql$,
  'permission denied|new row violates row-level security',
  'anon cannot INSERT nudges');
RESET ROLE;

-- 7-8. authenticated default-deny
SET LOCAL ROLE authenticated;
SELECT is((SELECT count(*) FROM agent_nudges), 0::bigint,
          'authenticated sees zero nudges (default-deny read)');
SELECT throws_ok(
  $sql$ INSERT INTO agent_nudges
          (id, org_id, signal_key, entity_id, agent_name, recipient_role,
           tier, gate_decision, subject, body, escalate_at)
        VALUES (gen_random_uuid(), 'rls-test-org-b', 'w-s2', 'w-e2', 'a', 'r',
                'threshold', 'digest', 'x', 'y', now()) $sql$,
  'permission denied|new row violates row-level security',
  'authenticated cannot INSERT nudges');
RESET ROLE;

SELECT finish();
ROLLBACK;
