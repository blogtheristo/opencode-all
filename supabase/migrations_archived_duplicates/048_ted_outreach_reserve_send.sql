-- Migration 048: Atomic daily-cap reservation for TED outreach (concurrency-safe)
-- Replaces read-then-send-then-increment with lock + increment before send + release on failure.
-- Idempotent. Transaction-wrapped.

BEGIN;

-- ---------------------------------------------------------------------------
-- Reserve one send slot atomically (check + increment under cap) BEFORE email send.
-- Serializes concurrent runners via row lock on ted_outreach_daily_send for UTC day.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ted_outreach_reserve_send(p_cap int DEFAULT 50)
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
    RAISE EXCEPTION 'ted_outreach_reserve_send: p_cap must be between 1 and 1000';
  END IF;

  INSERT INTO ted_outreach_daily_send (bucket_utc, sent_count)
  VALUES (b, 0)
  ON CONFLICT (bucket_utc) DO NOTHING;

  SELECT sent_count INTO v FROM ted_outreach_daily_send WHERE bucket_utc = b FOR UPDATE;

  IF v IS NULL THEN
    v := 0;
  END IF;

  IF v >= p_cap THEN
    RETURN QUERY SELECT FALSE, v;
    RETURN;
  END IF;

  UPDATE ted_outreach_daily_send
  SET
    sent_count = sent_count + 1,
    updated_at = NOW()
  WHERE bucket_utc = b
  RETURNING sent_count INTO v;

  RETURN QUERY SELECT TRUE, v;
END;
$$;

REVOKE ALL ON FUNCTION public.ted_outreach_reserve_send(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ted_outreach_reserve_send(int) TO service_role;

COMMENT ON FUNCTION public.ted_outreach_reserve_send(int) IS
  'Atomically reserve one TED outreach send for UTC day (increment if under p_cap). Call before SES; if send fails, call ted_outreach_release_send().';

-- ---------------------------------------------------------------------------
-- Undo one reservation when email send fails after reserve (keeps counter honest).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ted_outreach_release_send()
RETURNS TABLE(success boolean, new_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b date := (timezone('utc', now()))::date;
  v int;
BEGIN
  INSERT INTO ted_outreach_daily_send (bucket_utc, sent_count)
  VALUES (b, 0)
  ON CONFLICT (bucket_utc) DO NOTHING;

  SELECT sent_count INTO v FROM ted_outreach_daily_send WHERE bucket_utc = b FOR UPDATE;

  IF v IS NULL OR v <= 0 THEN
    RETURN QUERY SELECT FALSE, COALESCE(v, 0);
    RETURN;
  END IF;

  UPDATE ted_outreach_daily_send
  SET
    sent_count = GREATEST(0, sent_count - 1),
    updated_at = NOW()
  WHERE bucket_utc = b
  RETURNING sent_count INTO v;

  RETURN QUERY SELECT TRUE, v;
END;
$$;

REVOKE ALL ON FUNCTION public.ted_outreach_release_send() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ted_outreach_release_send() TO service_role;

COMMENT ON FUNCTION public.ted_outreach_release_send() IS
  'Decrement daily TED outreach count by 1 after a failed send that followed ted_outreach_reserve_send.';

COMMENT ON FUNCTION public.ted_outreach_finish_send() IS
  'Legacy: increment after send (non-atomic with pre-check). Prefer ted_outreach_reserve_send + release on failure.';

COMMIT;
