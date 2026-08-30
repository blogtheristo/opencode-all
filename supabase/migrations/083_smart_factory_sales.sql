-- Migration 083: Smart Factory for Sales
-- Firehorse Omnichannel — automated prospect matching, multi-channel outreach
-- (email / WhatsApp / LinkedIn / Facebook) and call booking against a customer
-- product catalog of ANY size.
--
-- Tables:
--   smart_factory_campaigns   — one row per customer/go-to-market campaign, holds the
--                               normalized product catalog (any number of products)
--                               and channel configuration + daily send cap
--   smart_factory_prospects   — prospects sourced + matched to specific products,
--                               with contact channels and pipeline status
--   smart_factory_messages    — per-channel outbound message log (audit trail)
--   smart_factory_daily_send  — UTC-day counter for atomic rate capping
--
-- RPCs:
--   smart_factory_reserve_send(p_cap)  — atomically reserve one send slot (pre-send)
--   smart_factory_release_send()       — roll back one reservation after failed send
--
-- Follows the ted_outreach_reserve_send pattern (migrations_archived_duplicates/048).
-- Service-role only: RLS enabled, no anon/authenticated policies.

BEGIN;

-- ===========================================================================
-- CAMPAIGNS
-- ===========================================================================

CREATE TABLE IF NOT EXISTS smart_factory_campaigns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  -- Normalized catalog: [{ id, name, description, features[], keywords[], price, currency }]
  catalog       JSONB NOT NULL DEFAULT '[]',
  channels      TEXT[] NOT NULL DEFAULT '{email}',
  daily_cap     INT NOT NULL DEFAULT 30 CONSTRAINT valid_sf_cap CHECK (daily_cap BETWEEN 1 AND 500),
  status        TEXT NOT NULL DEFAULT 'active' CONSTRAINT valid_sf_campaign_status CHECK (status IN ('active', 'paused', 'completed')),
  booking_service_id UUID,  -- optional FK resolved at runtime (booking_services may not exist in replay order)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sf_campaigns_status ON smart_factory_campaigns(status);

-- ===========================================================================
-- PROSPECTS
-- ===========================================================================

CREATE TABLE IF NOT EXISTS smart_factory_prospects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES smart_factory_campaigns(id) ON DELETE CASCADE,
  org_name         TEXT NOT NULL,
  domain           TEXT,
  country_code     TEXT,
  industry         TEXT,
  contact_name     TEXT,
  email            TEXT,
  phone            TEXT,
  linkedin_url     TEXT,
  facebook_url     TEXT,
  source           TEXT NOT NULL DEFAULT 'eu_universe',
  -- Matched products: [{ productId, productName, score, reason }] — any count, best first
  matched_products JSONB NOT NULL DEFAULT '[]',
  fit_score        NUMERIC(4,3) NOT NULL DEFAULT 0 CONSTRAINT valid_sf_fit CHECK (fit_score >= 0 AND fit_score <= 1),
  -- new | matched | contacted | replied | call_booked | unqualified
  status           TEXT NOT NULL DEFAULT 'new' CONSTRAINT valid_sf_prospect_status CHECK (status IN ('new','matched','contacted','replied','call_booked','unqualified')),
  last_channel     TEXT,
  dedup_key        TEXT NOT NULL,  -- coalesce(domain, email, linkedin_url, org_name) lowercased by app layer
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sf_dedup_unique UNIQUE (campaign_id, dedup_key)
);

CREATE INDEX IF NOT EXISTS idx_sf_prospects_campaign_status ON smart_factory_prospects(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_sf_prospects_fit ON smart_factory_prospects(campaign_id, fit_score DESC);

-- ===========================================================================
-- MESSAGES (per-channel outbound audit trail)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS smart_factory_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id         UUID NOT NULL REFERENCES smart_factory_prospects(id) ON DELETE CASCADE,
  campaign_id         UUID NOT NULL REFERENCES smart_factory_campaigns(id) ON DELETE CASCADE,
  channel             TEXT NOT NULL CONSTRAINT valid_sf_channel CHECK (channel IN ('email','whatsapp','linkedin','facebook')),
  product_id          TEXT,
  subject             TEXT,
  body                TEXT,
  status              TEXT NOT NULL DEFAULT 'queued' CONSTRAINT valid_sf_msg_status CHECK (status IN ('queued','sent','failed','manual_pending')),
  provider_message_id TEXT,
  error               TEXT,
  sent_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sf_messages_prospect ON smart_factory_messages(prospect_id);
CREATE INDEX IF NOT EXISTS idx_sf_messages_campaign ON smart_factory_messages(campaign_id, channel, status);
CREATE INDEX IF NOT EXISTS idx_sf_messages_sent_day ON smart_factory_messages(sent_at);

-- ===========================================================================
-- DAILY SEND COUNTER + ATOMIC CAP RPCs
-- ===========================================================================

CREATE TABLE IF NOT EXISTS smart_factory_daily_send (
  bucket_utc DATE PRIMARY KEY,
  sent_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.smart_factory_reserve_send(p_cap int DEFAULT 30)
RETURNS TABLE(success boolean, new_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b date := (timezone('utc', now()))::date;
  v int;
BEGIN
  IF p_cap < 1 OR p_cap > 1000 THEN
    RAISE EXCEPTION 'smart_factory_reserve_send: p_cap must be between 1 and 1000';
  END IF;

  INSERT INTO smart_factory_daily_send (bucket_utc, sent_count)
  VALUES (b, 0)
  ON CONFLICT (bucket_utc) DO NOTHING;

  SELECT sent_count INTO v FROM smart_factory_daily_send WHERE bucket_utc = b FOR UPDATE;

  IF v IS NULL THEN
    v := 0;
  END IF;

  IF v >= p_cap THEN
    RETURN QUERY SELECT FALSE, v;
    RETURN;
  END IF;

  UPDATE smart_factory_daily_send
  SET sent_count = sent_count + 1, updated_at = NOW()
  WHERE bucket_utc = b
  RETURNING sent_count INTO v;

  RETURN QUERY SELECT TRUE, v;
END;
$$;

REVOKE ALL ON FUNCTION public.smart_factory_reserve_send(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.smart_factory_reserve_send(int) TO service_role;

COMMENT ON FUNCTION public.smart_factory_reserve_send(int) IS
  'Atomically reserve one Smart Factory send for UTC day (increment if under p_cap). Call before transport; if send fails, call smart_factory_release_send().';

CREATE OR REPLACE FUNCTION public.smart_factory_release_send()
RETURNS TABLE(success boolean, new_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b date := (timezone('utc', now()))::date;
  v int;
BEGIN
  INSERT INTO smart_factory_daily_send (bucket_utc, sent_count)
  VALUES (b, 0)
  ON CONFLICT (bucket_utc) DO NOTHING;

  SELECT sent_count INTO v FROM smart_factory_daily_send WHERE bucket_utc = b FOR UPDATE;

  IF v IS NULL OR v <= 0 THEN
    RETURN QUERY SELECT FALSE, COALESCE(v, 0);
    RETURN;
  END IF;

  UPDATE smart_factory_daily_send
  SET sent_count = GREATEST(0, sent_count - 1), updated_at = NOW()
  WHERE bucket_utc = b
  RETURNING sent_count INTO v;

  RETURN QUERY SELECT TRUE, v;
END;
$$;

REVOKE ALL ON FUNCTION public.smart_factory_release_send() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.smart_factory_release_send() TO service_role;

COMMENT ON FUNCTION public.smart_factory_release_send() IS
  'Decrement daily Smart Factory count by 1 after a failed send that followed smart_factory_reserve_send.';

-- ===========================================================================
-- RLS — service role bypasses; no policies for anon/authenticated
-- ===========================================================================

ALTER TABLE smart_factory_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_factory_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_factory_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_factory_daily_send ENABLE ROW LEVEL SECURITY;

COMMIT;
