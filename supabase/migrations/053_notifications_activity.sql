-- Migration 053: Notifications, notification preferences, and activity events
--
-- VERSION AND AGENT HISTORY
--   Code-Version: 1.0.0
--   Introduced-In: claude/build-mvp-features-Eq6py (post PR-913 hardening)
--   Owner: Claude (MVP feature hardening)
--   Date: 2026-04-05
--
-- Creates the 3 tables that the PR-913 routes query against but don't exist yet:
--   - notification_preferences : user's per-channel notification toggles
--   - notifications            : in-app notification inbox
--   - activity_events          : activity stream (SSE + dashboard feed)
--
-- All tables use RLS: service_role has FULL access; authenticated users can
-- read/write only their own rows (organization_members for org-visible events).
--
-- Rollback:
--   DROP TABLE IF EXISTS public.activity_events CASCADE;
--   DROP TABLE IF EXISTS public.notifications CASCADE;
--   DROP TABLE IF EXISTS public.notification_preferences CASCADE;

BEGIN;

-- ============ notification_preferences ============

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_alerts          BOOLEAN NOT NULL DEFAULT true,
  compliance_deadlines  BOOLEAN NOT NULL DEFAULT true,
  carbon_thresholds     BOOLEAN NOT NULL DEFAULT true,
  report_ready          BOOLEAN NOT NULL DEFAULT true,
  weekly_digest         BOOLEAN NOT NULL DEFAULT true,
  agent_completions     BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role full access notification_preferences"
  ON public.notification_preferences;
CREATE POLICY "service_role full access notification_preferences"
  ON public.notification_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "users manage own notification_preferences"
  ON public.notification_preferences;
CREATE POLICY "users manage own notification_preferences"
  ON public.notification_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============ notifications ============

CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  severity     TEXT NOT NULL DEFAULT 'info'
                 CHECK (severity IN ('info','success','warning','error','critical')),
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  read         BOOLEAN NOT NULL DEFAULT false,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, read) WHERE read = false;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role full access notifications"
  ON public.notifications;
CREATE POLICY "service_role full access notifications"
  ON public.notifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "users read own notifications" ON public.notifications;
CREATE POLICY "users read own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users update own notifications" ON public.notifications;
CREATE POLICY "users update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============ activity_events ============

CREATE TABLE IF NOT EXISTS public.activity_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id  UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  type             TEXT NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  severity         TEXT NOT NULL DEFAULT 'info'
                     CHECK (severity IN ('info','success','warning','error','critical')),
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  visibility       TEXT NOT NULL DEFAULT 'user'
                     CHECK (visibility IN ('user','org','public')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_user_created
  ON public.activity_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_org_created
  ON public.activity_events (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_type_created
  ON public.activity_events (type, created_at DESC);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role full access activity_events"
  ON public.activity_events;
CREATE POLICY "service_role full access activity_events"
  ON public.activity_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "users read own activity_events" ON public.activity_events;
CREATE POLICY "users read own activity_events"
  ON public.activity_events
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'public'
    OR (visibility = 'user' AND user_id = auth.uid())
    OR (visibility = 'org' AND organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    ))
  );

-- ============ updated_at trigger for notification_preferences ============

CREATE OR REPLACE FUNCTION public.touch_notification_prefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notification_prefs_updated_at
  ON public.notification_preferences;
CREATE TRIGGER trg_notification_prefs_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.touch_notification_prefs_updated_at();

COMMIT;

-- Verify (manual, post-apply):
--   SELECT count(*) FROM public.notification_preferences;
--   SELECT count(*) FROM public.notifications;
--   SELECT count(*) FROM public.activity_events;
--   SELECT rowsecurity FROM pg_tables
--     WHERE schemaname='public'
--       AND tablename IN ('notification_preferences','notifications','activity_events');
