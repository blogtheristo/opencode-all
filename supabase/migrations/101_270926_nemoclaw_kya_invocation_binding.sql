-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-6-luna Agent=OpenClaw-Phase2 Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/101_270926_nemoclaw_kya_invocation_binding.sql
-- Bind each NemoClaw command to a single Themis-issued KYA authorization.
-- The authorization ID is included in the append-only hash chain and unique
-- across command invocations, so replay cannot dispatch a second time.

ALTER TABLE public.command_audit_log
  ADD COLUMN IF NOT EXISTS authorization_id TEXT;

ALTER TABLE public.command_audit_log
  ADD COLUMN IF NOT EXISTS hash_version SMALLINT NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS command_audit_log_authorization_id_uidx
  ON public.command_audit_log (authorization_id)
  WHERE event_type = 'command.invoke' AND authorization_id IS NOT NULL;

COMMENT ON COLUMN public.command_audit_log.authorization_id IS
  'Single-use identifier from a short-lived, request-scoped Themis KYA verdict; included in event_hash.';

COMMENT ON COLUMN public.command_audit_log.hash_version IS
  'Canonical event-hash format version: existing rows remain v1; inserts after migration are v2.';

CREATE OR REPLACE FUNCTION public.command_audit_log_chain()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  last_hash TEXT;
  canonical TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('command_audit_log_chain'));

  SELECT event_hash INTO last_hash
  FROM public.command_audit_log
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := COALESCE(last_hash, repeat('0', 64));
  NEW.hash_version := 2;

  canonical := concat_ws('|',
    NEW.hash_version::text,
    NEW.event_id::text,
    NEW.event_type,
    NEW.bridge,
    NEW.trace_id::text,
    NEW.agent_id,
    COALESCE(NEW.operator_id, ''),
    COALESCE(NEW.org_id, ''),
    COALESCE(NEW.kya_session_id, ''),
    COALESCE(NEW.authorization_id, ''),
    NEW.skill,
    COALESCE(NEW.input_digest, ''),
    COALESCE(NEW.output_digest, ''),
    COALESCE(NEW.decision, ''),
    COALESCE(NEW.success::text, ''),
    to_char(NEW.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
  );

  NEW.event_hash := encode(digest(NEW.prev_hash || canonical, 'sha256'), 'hex');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS command_audit_log_chain_trg ON public.command_audit_log;
CREATE TRIGGER command_audit_log_chain_trg
  BEFORE INSERT ON public.command_audit_log
  FOR EACH ROW EXECUTE FUNCTION public.command_audit_log_chain();
