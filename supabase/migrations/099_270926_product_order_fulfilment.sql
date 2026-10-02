-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/099_270926_product_order_fulfilment.sql
-- Review status: REVIEWED, NOT APPLIED. HIC must apply this migration explicitly.
-- Durable catalogue order intents, exact-SKU fulfilment jobs, and idempotent event outbox.

BEGIN;

CREATE TABLE public.product_order_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text NOT NULL UNIQUE CHECK (char_length(idempotency_key) BETWEEN 8 AND 128),
  buyer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id text NOT NULL CHECK (char_length(product_id) BETWEEN 1 AND 100),
  product_name text NOT NULL CHECK (char_length(product_name) BETWEEN 1 AND 300),
  unit_amount_cents bigint NOT NULL CHECK (unit_amount_cents > 0),
  expected_payment_amount_cents bigint NOT NULL CHECK (expected_payment_amount_cents > 0 AND expected_payment_amount_cents <= unit_amount_cents),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  buyer_email text NOT NULL CHECK (char_length(buyer_email) BETWEEN 3 AND 254),
  buyer_name text NOT NULL CHECK (char_length(buyer_name) BETWEEN 1 AND 200),
  buyer_company text CHECK (buyer_company IS NULL OR char_length(buyer_company) <= 200),
  buyer_country text NOT NULL CHECK (buyer_country ~ '^[A-Z]{2}$'),
  payment_provider text NOT NULL CHECK (payment_provider IN ('revolut', 'paypal', 'stripe')),
  checkout_reference text CHECK (checkout_reference IS NULL OR char_length(checkout_reference) <= 200),
  payment_reference text CHECK (payment_reference IS NULL OR char_length(payment_reference) <= 200),
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  fulfilment_status text NOT NULL DEFAULT 'pending'
    CHECK (fulfilment_status IN ('pending', 'queued', 'in_progress', 'fulfilled', 'failed', 'cancelled')),
  fulfilment_owner text,
  checkout_url text,
  payment_review_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_review_notification_status IN ('pending', 'sent', 'failed')),
  payment_review_notification_attempts integer NOT NULL DEFAULT 0 CHECK (payment_review_notification_attempts >= 0),
  payment_review_notification_error text,
  payment_review_notified_at timestamptz,
  operations_notification_status text NOT NULL DEFAULT 'pending'
    CHECK (operations_notification_status IN ('pending', 'sent', 'failed')),
  operations_notification_attempts integer NOT NULL DEFAULT 0 CHECK (operations_notification_attempts >= 0),
  operations_notification_error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  paid_at timestamptz,
  fulfilment_queued_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (payment_provider, checkout_reference),
  UNIQUE (payment_provider, payment_reference)
);

CREATE TABLE public.product_fulfilment_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_intent_id uuid NOT NULL UNIQUE REFERENCES public.product_order_intents(id) ON DELETE RESTRICT,
  product_id text NOT NULL CHECK (char_length(product_id) BETWEEN 1 AND 100),
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'in_progress', 'fulfilled', 'failed', 'cancelled')),
  owner text,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.product_order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_intent_id uuid NOT NULL REFERENCES public.product_order_intents(id) ON DELETE RESTRICT,
  product_id text NOT NULL CHECK (char_length(product_id) BETWEEN 1 AND 100),
  event_type text NOT NULL CHECK (event_type IN ('sales.payment_review_requested', 'sales.purchase', 'sales.fulfilment_requested')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(payload) = 'object'),
  dispatch_status text NOT NULL DEFAULT 'pending'
    CHECK (dispatch_status IN ('pending', 'dispatched', 'failed')),
  dispatch_attempts integer NOT NULL DEFAULT 0 CHECK (dispatch_attempts >= 0),
  last_error text,
  dispatched_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_intent_id, event_type)
);

CREATE TABLE public.product_payment_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_intent_id uuid NOT NULL UNIQUE REFERENCES public.product_order_intents(id) ON DELETE RESTRICT,
  payment_provider text NOT NULL CHECK (payment_provider IN ('revolut', 'paypal', 'stripe')),
  provider_transaction_reference text NOT NULL CHECK (char_length(provider_transaction_reference) BETWEEN 3 AND 200),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  verified_by text NOT NULL CHECK (char_length(verified_by) BETWEEN 3 AND 200),
  verification_method text NOT NULL CHECK (verification_method IN ('stripe_webhook', 'admin_manual')),
  verified_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  UNIQUE (payment_provider, provider_transaction_reference)
);

CREATE INDEX product_order_intents_product_id_idx ON public.product_order_intents(product_id);
CREATE INDEX product_order_intents_payment_status_idx ON public.product_order_intents(payment_status);
CREATE INDEX product_order_intents_fulfilment_status_idx ON public.product_order_intents(fulfilment_status);
CREATE INDEX product_order_intents_created_at_idx ON public.product_order_intents(created_at DESC);
CREATE INDEX product_fulfilment_jobs_status_idx ON public.product_fulfilment_jobs(status, queued_at);
CREATE INDEX product_order_events_pending_idx ON public.product_order_events(dispatch_status, created_at)
  WHERE dispatch_status <> 'dispatched';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_order_intents TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_fulfilment_jobs TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_order_events TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_payment_verifications TO authenticated, service_role;

ALTER TABLE public.product_order_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_fulfilment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_payment_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_order_intents_service_role_all ON public.product_order_intents
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY product_order_intents_authenticated_select_own ON public.product_order_intents
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = buyer_user_id);

CREATE POLICY product_fulfilment_jobs_service_role_all ON public.product_fulfilment_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY product_fulfilment_jobs_authenticated_select_own ON public.product_fulfilment_jobs
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.product_order_intents intent
      WHERE intent.id = product_fulfilment_jobs.order_intent_id AND intent.buyer_user_id = (SELECT auth.uid()))
  );

CREATE POLICY product_order_events_service_role_all ON public.product_order_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY product_order_events_authenticated_select_own ON public.product_order_events
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.product_order_intents intent
      WHERE intent.id = product_order_events.order_intent_id AND intent.buyer_user_id = (SELECT auth.uid()))
  );

CREATE POLICY product_payment_verifications_service_role_all ON public.product_payment_verifications
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY product_payment_verifications_authenticated_select_own ON public.product_payment_verifications
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.product_order_intents intent
      WHERE intent.id = product_payment_verifications.order_intent_id
        AND intent.buyer_user_id = (SELECT auth.uid()))
  );

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.product_order_intents FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.product_fulfilment_jobs FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.product_order_events FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.product_payment_verifications FROM authenticated;

CREATE OR REPLACE FUNCTION public.create_product_order_intent(
  p_idempotency_key text, p_product_id text, p_product_name text,
  p_unit_amount_cents bigint, p_expected_payment_amount_cents bigint, p_currency text, p_buyer_email text,
  p_buyer_name text, p_buyer_company text, p_buyer_country text,
  p_payment_provider text, p_buyer_user_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  id uuid, idempotency_key text, product_id text, product_name text,
  unit_amount_cents bigint, expected_payment_amount_cents bigint, currency text, buyer_email text, buyer_name text,
  buyer_company text, buyer_country text, payment_provider text,
  checkout_reference text, payment_reference text, checkout_url text, payment_status text, fulfilment_status text,
  payment_review_notification_status text, operations_notification_status text, created boolean
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_created boolean := false;
  v_existing public.product_order_intents%ROWTYPE;
BEGIN
  INSERT INTO public.product_order_intents (
    idempotency_key, buyer_user_id, product_id, product_name, unit_amount_cents,
    expected_payment_amount_cents, currency, buyer_email, buyer_name, buyer_company, buyer_country, payment_provider, metadata
  ) VALUES (
    p_idempotency_key, p_buyer_user_id, p_product_id, p_product_name, p_unit_amount_cents,
    p_expected_payment_amount_cents, upper(p_currency), lower(p_buyer_email), p_buyer_name, p_buyer_company,
    upper(p_buyer_country), p_payment_provider, p_metadata
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING product_order_intents.id INTO v_id;

  IF v_id IS NULL THEN
    SELECT * INTO v_existing FROM public.product_order_intents intent
      WHERE intent.idempotency_key = p_idempotency_key;
    IF v_existing.product_id <> p_product_id
      OR v_existing.buyer_email <> lower(p_buyer_email)
      OR v_existing.payment_provider <> p_payment_provider THEN
      RAISE EXCEPTION 'Idempotency key already belongs to a different order' USING ERRCODE = '23505';
    END IF;
    v_id := v_existing.id;
  ELSE
    v_created := true;
  END IF;

  RETURN QUERY SELECT intent.id, intent.idempotency_key, intent.product_id, intent.product_name,
    intent.unit_amount_cents, intent.expected_payment_amount_cents, intent.currency, intent.buyer_email, intent.buyer_name,
    intent.buyer_company, intent.buyer_country, intent.payment_provider,
    intent.checkout_reference, intent.payment_reference, intent.checkout_url, intent.payment_status, intent.fulfilment_status,
    intent.payment_review_notification_status, intent.operations_notification_status, v_created
  FROM public.product_order_intents intent WHERE intent.id = v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_product_order_payment(
  p_order_intent_id uuid, p_payment_reference text, p_checkout_url text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.product_order_intents
  SET checkout_reference = p_payment_reference,
      checkout_url = COALESCE(p_checkout_url, checkout_url), updated_at = now()
  WHERE id = p_order_intent_id
    AND payment_status = 'pending'
    AND (checkout_reference IS NULL OR checkout_reference = p_payment_reference);
  IF NOT FOUND THEN RAISE EXCEPTION 'Pending product order intent not found'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.queue_product_order_payment_review(
  p_order_intent_id uuid, p_payment_reference text
)
RETURNS SETOF public.product_order_intents
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_intent public.product_order_intents%ROWTYPE;
BEGIN
  UPDATE public.product_order_intents
  SET checkout_reference = COALESCE(checkout_reference, p_payment_reference), updated_at = now()
  WHERE id = p_order_intent_id
    AND payment_status = 'pending'
    AND (checkout_reference IS NULL OR checkout_reference = p_payment_reference)
  RETURNING * INTO v_intent;
  IF v_intent.id IS NULL THEN RAISE EXCEPTION 'Pending product order intent not found or reference mismatch'; END IF;
  IF v_intent.payment_provider NOT IN ('revolut', 'paypal') THEN
    RAISE EXCEPTION 'Payment review queue only accepts external manual-review providers';
  END IF;

  INSERT INTO public.product_order_events (order_intent_id, product_id, event_type, payload)
  VALUES (v_intent.id, v_intent.product_id, 'sales.payment_review_requested',
    jsonb_build_object('order_intent_id', v_intent.id, 'product_id', v_intent.product_id,
      'payment_provider', v_intent.payment_provider, 'checkout_reference', p_payment_reference,
      'expected_amount_cents', v_intent.expected_payment_amount_cents,
      'currency', v_intent.currency, 'instruction', 'verify provider payment before fulfilment'))
  ON CONFLICT (order_intent_id, event_type) DO NOTHING;

  RETURN NEXT v_intent;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_product_order_payment(
  p_order_intent_id uuid, p_payment_provider text, p_payment_reference text,
  p_amount_cents bigint, p_currency text, p_verified_by text, p_verification_method text
)
RETURNS SETOF public.product_order_intents
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_intent public.product_order_intents%ROWTYPE;
BEGIN
  SELECT * INTO v_intent FROM public.product_order_intents intent
  WHERE (p_order_intent_id IS NOT NULL AND intent.id = p_order_intent_id)
     OR (p_order_intent_id IS NULL AND intent.payment_provider = p_payment_provider
       AND intent.payment_reference = p_payment_reference)
  ORDER BY (intent.id = p_order_intent_id) DESC LIMIT 1 FOR UPDATE;

  IF v_intent.id IS NULL THEN RAISE EXCEPTION 'Product order intent not found'; END IF;
  IF v_intent.payment_provider <> p_payment_provider THEN RAISE EXCEPTION 'Payment provider mismatch'; END IF;
  IF v_intent.payment_reference IS NOT NULL AND v_intent.payment_reference <> p_payment_reference THEN
    RAISE EXCEPTION 'Payment reference mismatch';
  END IF;
  IF p_amount_cents IS NULL OR p_amount_cents <= 0 THEN RAISE EXCEPTION 'Verified amount is required'; END IF;
  IF p_currency IS NULL OR p_currency !~ '^[A-Za-z]{3}$' THEN RAISE EXCEPTION 'Verified currency is required'; END IF;
  IF char_length(trim(p_verified_by)) < 3 THEN RAISE EXCEPTION 'Verification actor is required'; END IF;
  IF p_verification_method NOT IN ('stripe_webhook', 'admin_manual') THEN RAISE EXCEPTION 'Invalid verification method'; END IF;
  IF v_intent.expected_payment_amount_cents <> p_amount_cents THEN
    RAISE EXCEPTION 'Paid amount does not match immutable expected order amount';
  END IF;
  IF v_intent.currency <> upper(p_currency) THEN
    RAISE EXCEPTION 'Paid currency does not match immutable order currency';
  END IF;

  INSERT INTO public.product_payment_verifications (
    order_intent_id, payment_provider, provider_transaction_reference,
    amount_cents, currency, verified_by, verification_method
  ) VALUES (
    v_intent.id, p_payment_provider, p_payment_reference,
    p_amount_cents, upper(p_currency), trim(p_verified_by), p_verification_method
  )
  ON CONFLICT (order_intent_id) DO NOTHING;

  IF EXISTS (
    SELECT 1 FROM public.product_payment_verifications verification
    WHERE verification.order_intent_id = v_intent.id
      AND (verification.payment_provider <> p_payment_provider
        OR verification.provider_transaction_reference <> p_payment_reference
        OR verification.amount_cents <> p_amount_cents
        OR verification.currency <> upper(p_currency))
  ) THEN
    RAISE EXCEPTION 'Payment verification conflicts with immutable audit record';
  END IF;

  UPDATE public.product_order_intents
  SET payment_reference = COALESCE(payment_reference, p_payment_reference), payment_status = 'paid',
      fulfilment_status = CASE WHEN fulfilment_status = 'pending' THEN 'queued' ELSE fulfilment_status END,
      paid_at = COALESCE(paid_at, now()), fulfilment_queued_at = COALESCE(fulfilment_queued_at, now()),
      updated_at = now()
  WHERE product_order_intents.id = v_intent.id AND payment_status IN ('pending', 'paid')
  RETURNING * INTO v_intent;
  IF v_intent.id IS NULL THEN RAISE EXCEPTION 'Order cannot transition to paid'; END IF;

  INSERT INTO public.product_fulfilment_jobs (order_intent_id, product_id, status, metadata)
  VALUES (v_intent.id, v_intent.product_id, 'queued',
    jsonb_build_object('payment_provider', p_payment_provider, 'payment_reference', p_payment_reference))
  ON CONFLICT (order_intent_id) DO NOTHING;

  INSERT INTO public.product_order_events (order_intent_id, product_id, event_type, payload)
  VALUES
    (v_intent.id, v_intent.product_id, 'sales.purchase',
      jsonb_build_object('order_intent_id', v_intent.id, 'product_id', v_intent.product_id,
        'payment_provider', p_payment_provider, 'payment_reference', p_payment_reference,
        'amount_cents', p_amount_cents, 'product_amount_cents', v_intent.unit_amount_cents, 'currency', v_intent.currency)),
    (v_intent.id, v_intent.product_id, 'sales.fulfilment_requested',
      jsonb_build_object('order_intent_id', v_intent.id, 'product_id', v_intent.product_id,
        'fulfilment_status', 'queued'))
  ON CONFLICT (order_intent_id, event_type) DO NOTHING;

  RETURN NEXT v_intent;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_product_order_review_notification(
  p_order_intent_id uuid, p_status text, p_error text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_status NOT IN ('sent', 'failed') THEN RAISE EXCEPTION 'Invalid payment review notification status'; END IF;
  UPDATE public.product_order_intents
  SET payment_review_notification_status = p_status,
      payment_review_notification_attempts = payment_review_notification_attempts + 1,
      payment_review_notification_error = p_error,
      payment_review_notified_at = CASE WHEN p_status = 'sent' THEN now() ELSE payment_review_notified_at END,
      updated_at = now()
  WHERE id = p_order_intent_id AND payment_status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Pending product order intent not found'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_product_order_operations_notification(
  p_order_intent_id uuid, p_status text, p_error text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_status NOT IN ('sent', 'failed') THEN RAISE EXCEPTION 'Invalid operations notification status'; END IF;
  UPDATE public.product_order_intents
  SET operations_notification_status = p_status,
      operations_notification_attempts = operations_notification_attempts + 1,
      operations_notification_error = p_error, updated_at = now()
  WHERE id = p_order_intent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Product order intent not found'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.product_order_schema_preflight()
RETURNS boolean LANGUAGE sql STABLE SET search_path = public
AS $$
  SELECT
    to_regclass('public.product_order_intents') IS NOT NULL
    AND to_regclass('public.product_fulfilment_jobs') IS NOT NULL
    AND to_regclass('public.product_order_events') IS NOT NULL
    AND to_regclass('public.product_payment_verifications') IS NOT NULL
    AND to_regprocedure('public.create_product_order_intent(text,text,text,bigint,bigint,text,text,text,text,text,text,uuid,jsonb)') IS NOT NULL
    AND to_regprocedure('public.attach_product_order_payment(uuid,text,text)') IS NOT NULL
    AND to_regprocedure('public.queue_product_order_payment_review(uuid,text)') IS NOT NULL
    AND to_regprocedure('public.confirm_product_order_payment(uuid,text,text,bigint,text,text,text)') IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'product_order_intents'
        AND column_name = 'expected_payment_amount_cents'
    );
$$;

REVOKE ALL ON FUNCTION public.product_order_schema_preflight() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_product_order_intent(text, text, text, bigint, bigint, text, text, text, text, text, text, uuid, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.attach_product_order_payment(uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.queue_product_order_payment_review(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.confirm_product_order_payment(uuid, text, text, bigint, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_product_order_review_notification(uuid, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_product_order_operations_notification(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.product_order_schema_preflight() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_product_order_intent(text, text, text, bigint, bigint, text, text, text, text, text, text, uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.attach_product_order_payment(uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.queue_product_order_payment_review(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.confirm_product_order_payment(uuid, text, text, bigint, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_product_order_review_notification(uuid, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_product_order_operations_notification(uuid, text, text) TO service_role;

COMMIT;
