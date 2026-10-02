// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/verified-done-migration.test.ts

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  new URL('../../supabase/migrations/079_kya_verified_done_attestation.sql', import.meta.url),
  'utf8',
);
const consistencyMigration = readFileSync(
  new URL('../../supabase/migrations/098_270926_attestation_consistency.sql', import.meta.url),
  'utf8',
);

describe('migration 079 verified-done attestation contract', () => {
  it('extends the mandate evidence chain with mandate.attest', () => {
    expect(migration).toMatch(/CHECK\s*\(event_type IN \([^;]*'mandate\.attest'[^;]*\)\)/s);
  });

  describe('migration 098 attestation consistency contract', () => {
    it('enforces one attestation and one mandate.attest event per evidence-chain key', () => {
      expect(consistencyMigration).toMatch(
        /CREATE UNIQUE INDEX IF NOT EXISTS kya_verified_done_attestations_session_mandate_uidx[\s\S]*\(session_id, mandate_vc_id\)/,
      );
      expect(consistencyMigration).toMatch(
        /CREATE UNIQUE INDEX IF NOT EXISTS kya_mandate_events_attest_session_mandate_uidx[\s\S]*\(session_id, mandate_vc_id\)[\s\S]*WHERE event_type = 'mandate\.attest'/,
      );
    });

    it('pairs credential and event inserts inside one idempotent RPC transaction', () => {
      expect(consistencyMigration).toContain('BEGIN;');
      expect(consistencyMigration).toContain('COMMIT;');
      expect(consistencyMigration).toMatch(
        /CREATE OR REPLACE FUNCTION public\.issue_verified_done_attestation\([\s\S]*INSERT INTO public\.kya_verified_done_attestations[\s\S]*ON CONFLICT \(session_id, mandate_vc_id\) DO NOTHING[\s\S]*INSERT INTO public\.kya_mandate_events[\s\S]*ON CONFLICT \(session_id, mandate_vc_id\)[\s\S]*DO NOTHING/,
      );
      expect(consistencyMigration).toMatch(/Conflicting Verified-Done attestation already exists/);
      expect(consistencyMigration).toMatch(/Conflicting mandate\.attest event already exists/);
    });

    it('restricts the issuance RPC to service_role and preserves RLS grants', () => {
      expect(consistencyMigration).toMatch(
        /REVOKE ALL ON FUNCTION public\.issue_verified_done_attestation\(JSONB, JSONB\)[\s\S]*FROM PUBLIC, anon, authenticated/,
      );
      expect(consistencyMigration).toMatch(
        /GRANT EXECUTE ON FUNCTION public\.issue_verified_done_attestation\(JSONB, JSONB\)[\s\S]*TO service_role/,
      );
      expect(consistencyMigration).toContain(
        'ALTER TABLE public.kya_verified_done_attestations ENABLE ROW LEVEL SECURITY;',
      );
      expect(consistencyMigration).toContain(
        'ALTER TABLE public.kya_mandate_events ENABLE ROW LEVEL SECURITY;',
      );
    });

    it('enforces legal proof-status transitions in the database', () => {
      expect(consistencyMigration).toMatch(
        /OLD\.proof_status = 'unsigned' AND NEW\.proof_status = 'signed'/,
      );
      expect(consistencyMigration).toMatch(
        /OLD\.proof_status IN \('unsigned', 'signed'\) AND NEW\.proof_status = 'revoked'/,
      );
      expect(consistencyMigration).toContain(
        "RAISE EXCEPTION 'Illegal Verified-Done proof_status transition: % -> %'",
      );
    });
  });

  it('creates the credential store with an explicit unsigned signing stub', () => {
    expect(migration).toMatch(/CREATE TABLE IF NOT EXISTS kya_verified_done_attestations/);
    expect(migration).toMatch(
      /proof_status\s+TEXT\s+NOT NULL DEFAULT 'unsigned'[\s\S]*CHECK \(proof_status IN \('unsigned','signed','revoked'\)\)/,
    );
    expect(migration).toMatch(/credential\s+JSONB\s+NOT NULL/);
    expect(migration).toMatch(/article12_trace_id\s+UUID/);
  });

  it('enables RLS and limits writes to service_role', () => {
    expect(migration).toContain(
      'ALTER TABLE kya_verified_done_attestations ENABLE ROW LEVEL SECURITY;',
    );
    expect(migration).toContain(
      'GRANT SELECT, INSERT, UPDATE ON kya_verified_done_attestations TO service_role;',
    );
    expect(migration).toContain(
      'GRANT SELECT                  ON kya_verified_done_attestations TO authenticated;',
    );
    expect(migration).toMatch(
      /CREATE POLICY "kya_attestations_insert_service"[\s\S]*FOR INSERT TO service_role WITH CHECK \(TRUE\)/,
    );
    expect(migration).toMatch(
      /CREATE POLICY "kya_attestations_update_service"[\s\S]*FOR UPDATE TO service_role USING \(TRUE\) WITH CHECK \(TRUE\)/,
    );
  });

  it('keeps the evidence store append-only for every role', () => {
    expect(migration).toContain(
      'REVOKE DELETE   ON kya_verified_done_attestations FROM PUBLIC, authenticated, service_role;',
    );
    expect(migration).toContain(
      'REVOKE TRUNCATE ON kya_verified_done_attestations FROM PUBLIC, authenticated, service_role;',
    );
  });
});
