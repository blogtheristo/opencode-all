-- Ported from supabase/migrations/063_token_usage_optimization.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- token_usage_events.organization_id originally REFERENCED
-- public.organizations(id) ON DELETE SET NULL. organizations is NOT moving to
-- dws-postgres, so the FK is dropped; the column is kept as a plain uuid.
-- Referential integrity for organization_id is now application-level only.
-- Likewise, token_budgets.organization_id and token_alerts.organization_id
-- never had an explicit FK in the source (only token_usage_events did), so
-- those two are unchanged other than RLS removal below.

BEGIN;

CREATE TABLE IF NOT EXISTS public.token_usage_events (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID,
  user_id            TEXT NOT NULL,
  event_id           TEXT,
  dedupe_key         TEXT NOT NULL,
  provider           TEXT NOT NULL CHECK (provider IN ('anthropic', 'github', 'openai', 'other')),
  product            TEXT NOT NULL CHECK (product IN ('claude-code', 'github-copilot', 'other')),
  model              TEXT NOT NULL,
  prompt_tokens      INTEGER NOT NULL CHECK (prompt_tokens >= 0),
  completion_tokens  INTEGER NOT NULL CHECK (completion_tokens >= 0),
  cached_tokens      INTEGER NOT NULL DEFAULT 0 CHECK (cached_tokens >= 0),
  cost_eur           NUMERIC(12, 6) NOT NULL CHECK (cost_eur >= 0),
  session_id         TEXT NOT NULL,
  task_id            TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT token_usage_events_user_dedupe_unique UNIQUE (user_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_token_usage_events_user_created
  ON public.token_usage_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_usage_events_org_created
  ON public.token_usage_events (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_usage_events_session_created
  ON public.token_usage_events (session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.token_budgets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID,
  user_id               TEXT NOT NULL UNIQUE,
  daily_limit_tokens    INTEGER NOT NULL CHECK (daily_limit_tokens >= 0),
  monthly_limit_tokens  INTEGER NOT NULL CHECK (monthly_limit_tokens >= 0),
  monthly_limit_eur     NUMERIC(12, 2) NOT NULL CHECK (monthly_limit_eur >= 0),
  hard_cap              BOOLEAN NOT NULL DEFAULT false,
  notify_thresholds     INTEGER[] NOT NULL DEFAULT ARRAY[50, 80, 95],
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_token_budgets_org
  ON public.token_budgets (organization_id);

CREATE TABLE IF NOT EXISTS public.token_alerts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID,
  user_id          TEXT NOT NULL,
  alert_type       TEXT NOT NULL CHECK (alert_type IN ('threshold_breach', 'hard_cap_exceeded')),
  threshold_value  INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_token_alerts_user_created
  ON public.token_alerts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_alerts_org_created
  ON public.token_alerts (organization_id, created_at DESC);

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed
-- (source policies referenced auth.uid() and public.organization_members,
-- neither of which apply to this single-consumer database).
GRANT ALL ON public.token_usage_events TO dws_backend;
GRANT ALL ON public.token_budgets TO dws_backend;
GRANT ALL ON public.token_alerts TO dws_backend;

COMMIT;
