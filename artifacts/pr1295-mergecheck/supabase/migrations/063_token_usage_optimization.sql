-- ============================================================================
-- Migration 063: Token Usage Optimization Persistence (events, budgets, alerts)
-- ============================================================================
--
-- Code-Version: 1.0.0
-- Introduced-In: PR-TBD
-- Date: 2026-04-26
-- Owner: Lifetime Oy
--
-- Purpose:
--   Persist token usage telemetry and budget controls for Claude Code /
--   GitHub Copilot optimization workflows.
--
-- Rollback:
--   DROP TABLE IF EXISTS public.token_alerts CASCADE;
--   DROP TABLE IF EXISTS public.token_budgets CASCADE;
--   DROP TABLE IF EXISTS public.token_usage_events CASCADE;
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.token_usage_events (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
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

ALTER TABLE public.token_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS token_usage_events_service_all ON public.token_usage_events;
CREATE POLICY token_usage_events_service_all
  ON public.token_usage_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS token_usage_events_auth_read ON public.token_usage_events;
CREATE POLICY token_usage_events_auth_read
  ON public.token_usage_events
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()::text
    OR (
      organization_id IS NOT NULL
      AND organization_id IN (
        SELECT organization_id
        FROM public.organization_members
        WHERE user_id = auth.uid()
          AND status = 'active'
      )
    )
  );

CREATE TABLE IF NOT EXISTS public.token_budgets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
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

ALTER TABLE public.token_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_budgets FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS token_budgets_service_all ON public.token_budgets;
CREATE POLICY token_budgets_service_all
  ON public.token_budgets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS token_budgets_auth_read ON public.token_budgets;
CREATE POLICY token_budgets_auth_read
  ON public.token_budgets
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()::text
    OR (
      organization_id IS NOT NULL
      AND organization_id IN (
        SELECT organization_id
        FROM public.organization_members
        WHERE user_id = auth.uid()
          AND status = 'active'
      )
    )
  );

CREATE TABLE IF NOT EXISTS public.token_alerts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
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

ALTER TABLE public.token_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_alerts FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS token_alerts_service_all ON public.token_alerts;
CREATE POLICY token_alerts_service_all
  ON public.token_alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS token_alerts_auth_read ON public.token_alerts;
CREATE POLICY token_alerts_auth_read
  ON public.token_alerts
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()::text
    OR (
      organization_id IS NOT NULL
      AND organization_id IN (
        SELECT organization_id
        FROM public.organization_members
        WHERE user_id = auth.uid()
          AND status = 'active'
      )
    )
  );

COMMIT;
