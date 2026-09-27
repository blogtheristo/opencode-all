-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/100_270926_product_order_idempotency_conflict.sql
-- Review status: REVIEWED, NOT APPLIED. Repair migration 099's ambiguous PL/pgSQL conflict target.

BEGIN;

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
  ON CONFLICT ON CONSTRAINT product_order_intents_idempotency_key_key DO NOTHING
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

REVOKE ALL ON FUNCTION public.create_product_order_intent(text, text, text, bigint, bigint, text, text, text, text, text, text, uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_product_order_intent(text, text, text, bigint, bigint, text, text, text, text, text, text, uuid, jsonb) TO service_role;

COMMIT;
