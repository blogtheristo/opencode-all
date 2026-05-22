-- Migration 052: User Settings Table
-- Persists dashboard preferences (theme, locale, notifications) to Supabase.
-- Replaces localStorage-only storage for cross-device sync.
--
-- Code-Version: 1.0.0
-- Introduced-In: PR-912
-- Date: 2026-03-27

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'fi', 'de', 'sv')),
  notifications JSONB NOT NULL DEFAULT '{
    "emailAlerts": true,
    "complianceDeadlines": true,
    "carbonThresholds": false,
    "reportReady": true,
    "weeklyDigest": true
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_user_id_unique UNIQUE (user_id)
);

-- RLS: users can only read/write their own settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role access for backend operations
CREATE POLICY "Service role full access"
  ON public.user_settings FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.user_settings IS 'Dashboard user preferences (theme, locale, notifications) — synced from frontend';

COMMIT;
