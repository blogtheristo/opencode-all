# Migration 062 (Draft) — `press_subscribers`

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: iceye-jgi-deforestation-PSzCd | Date: 23.04.2026 | Changes: Drafted migration SQL for press/blog subscribe forms (ICEYE-style). RED zone — human must move file into supabase/migrations/ and apply.

Session Links & References:

- Claude Code (iceye-jgi-deforestation-PSzCd): Branch claude/iceye-jgi-deforestation-PSzCd

Document Status:

- Created: 23.04.2026
- Last Modified: 23.04.2026
- Language: English
- Publication Status: PRIVATE (migration draft — agent cannot author migrations directly; hook blocks writes to supabase/migrations/)

---

## 1. Status — RED ZONE (human action required)

Claude's `protect-files.sh` hook blocks direct writes to `supabase/migrations/`. This is by design — DB migrations must be human-authored and human-applied.

**To ship this migration:**

1. Human copies the SQL block in §3 below to `supabase/migrations/062_press_subscribers.sql`.
2. Human runs `psql "$SUPABASE_DB_URL" -f supabase/migrations/062_press_subscribers.sql` (or applies via Supabase Studio).
3. Human confirms RLS is on the `press_subscribers` table and that the `subscribe_press` RPC is callable by the `anon` key.
4. Human commits the migration and updates `DWS_DATA_STANDARD.md` migration log.

Until then the **subscribe forms on `dws10.com/press-releases/` and `onelifetime.world/press/` will gracefully fail** with `subscribe.disabled` — the forms are deployed but show a "coming soon" state when the RPC responds `404` / not found.

## 2. Rationale

The ICEYE press-release page inspired the DWS redesign. ICEYE ships a **Subscribe to ICEYE press releases** block at the bottom of every release. To match (and to start capturing press + blog subscribers for `dws10.com` and `onelifetime.world`), we need:

- One table, keyed on `(email, site)` so the same address can subscribe independently to both.
- Double opt-in friendly: `confirmation_token` column and `confirmed_at` timestamp (actual confirmation email flow ships later via Amazon SES — see `src/services/email.service.ts`; **no Resend** per CLAUDE.md permanent rule).
- Public insert via `SECURITY DEFINER` RPC (`subscribe_press`) so the `anon` key can write without exposing the full row to SELECT.
- No scraping: `REVOKE ALL … FROM anon, authenticated;` ensures the email list cannot be read by anyone except the service role.
- GDPR fields: `consent_version`, `unsubscribed_at`, hashed IP, user agent.

## 3. Migration SQL (copy to `supabase/migrations/062_press_subscribers.sql`)

```sql
-- ============================================================
-- Migration 062: press_subscribers table
-- ------------------------------------------------------------
-- Code-Version: 1.0
-- Introduced-In: PR-TBD (iceye-jgi-deforestation)
-- Branch: claude/iceye-jgi-deforestation-PSzCd
-- Date: 2026-04-23
-- Owner: Lifetime Oy
--
-- Purpose: Opt-in subscribers for DWS press releases and
--          onelifetime.world blog digests. One row per unique
--          (email, site) pair. GDPR-compliant double opt-in.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.press_subscribers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text NOT NULL,
  site               text NOT NULL CHECK (site IN ('dws10.com', 'onelifetime.world')),
  source_page        text,
  language           text CHECK (language IN ('en', 'fi', 'sv', 'de', 'fr')),
  consent_version    text NOT NULL DEFAULT '2026-04-23',
  confirmed_at       timestamptz,
  confirmation_token text UNIQUE,
  unsubscribed_at    timestamptz,
  ip_hash            text,
  user_agent         text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT press_subscribers_email_site_unique UNIQUE (email, site)
);

CREATE INDEX IF NOT EXISTS idx_press_subscribers_email
  ON public.press_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_press_subscribers_site
  ON public.press_subscribers (site);
CREATE INDEX IF NOT EXISTS idx_press_subscribers_created_at
  ON public.press_subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_subscribers_confirmed
  ON public.press_subscribers (confirmed_at)
  WHERE confirmed_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.press_subscribers_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_press_subscribers_updated_at ON public.press_subscribers;
CREATE TRIGGER trg_press_subscribers_updated_at
  BEFORE UPDATE ON public.press_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.press_subscribers_set_updated_at();

ALTER TABLE public.press_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY press_subscribers_service_all
  ON public.press_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- anon/authenticated cannot SELECT (prevents email scraping).
-- All writes flow through subscribe_press() SECURITY DEFINER RPC.
REVOKE ALL ON public.press_subscribers FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.subscribe_press(
  p_email       text,
  p_site        text,
  p_source_page text DEFAULT NULL,
  p_language    text DEFAULT 'en'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_token text;
  v_row   public.press_subscribers%ROWTYPE;
BEGIN
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  IF p_site NOT IN ('dws10.com', 'onelifetime.world') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_site');
  END IF;

  v_token := encode(gen_random_bytes(24), 'hex');

  INSERT INTO public.press_subscribers (email, site, source_page, language, confirmation_token)
  VALUES (lower(trim(p_email)), p_site, p_source_page, COALESCE(p_language, 'en'), v_token)
  ON CONFLICT (email, site) DO UPDATE
    SET source_page = EXCLUDED.source_page,
        language    = EXCLUDED.language,
        updated_at  = now()
  RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'ok', true,
    'id', v_row.id,
    'confirmed', v_row.confirmed_at IS NOT NULL
  );
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.subscribe_press(text, text, text, text) TO anon, authenticated;

COMMENT ON TABLE public.press_subscribers IS
  'Opt-in subscribers for DWS press releases and OLW blog digests. RLS locked — public insert via subscribe_press RPC only.';

COMMENT ON FUNCTION public.subscribe_press IS
  'Public-callable subscribe endpoint for press/blog lists. Idempotent on (email, site). Returns {ok, id, confirmed}.';

COMMIT;
```

## 4. Client-side call shape (already wired in this PR)

The `dws10.com/press-releases/index.html` and `onelifetime.world/press/index.html` pages use a shared subscribe widget located at `dws10.com/shared-assets/press-subscribe.js` and `onelifetime.world/shared-assets/press-subscribe.js`. The widget calls:

```js
await supabase.rpc("subscribe_press", {
  p_email: email,
  p_site: "dws10.com", // or 'onelifetime.world'
  p_source_page: window.location.pathname,
  p_language: localStorage.getItem("dws-lang") || "en",
});
```

If the RPC is not yet deployed, the widget falls back to a `mailto:press@onelifetime.world?subject=...` handoff so users aren't dropped on the floor.

## 5. Confirmation email (follow-up work — not in this PR)

Send double-opt-in email via Amazon SES (CLAUDE.md rule: SES only, never Resend). Template lives in `src/services/email.service.ts` alongside existing DWS templates. Trigger: Supabase database webhook on `press_subscribers` INSERT where `confirmed_at IS NULL`.
