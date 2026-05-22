-- Test Script for Migration 012: Firehorse Signals
-- Run this AFTER deploying 012_firehorse_signals.sql

-- ============================================================================
-- TEST 1: Verify table exists
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'firehorse_signals'
  ) THEN
    RAISE EXCEPTION 'FAIL: Table firehorse_signals does not exist';
  ELSE
    RAISE NOTICE 'PASS: Table firehorse_signals exists';
  END IF;
END $$;

-- ============================================================================
-- TEST 2: Verify enums exist
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'signal_source') THEN
    RAISE EXCEPTION 'FAIL: Enum signal_source does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'signal_type') THEN
    RAISE EXCEPTION 'FAIL: Enum signal_type does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'signal_status') THEN
    RAISE EXCEPTION 'FAIL: Enum signal_status does not exist';
  END IF;

  RAISE NOTICE 'PASS: All enums exist';
END $$;

-- ============================================================================
-- TEST 3: Verify views exist
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'firehorse_signals_ultra') THEN
    RAISE EXCEPTION 'FAIL: View firehorse_signals_ultra does not exist';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'firehorse_signals_high') THEN
    RAISE EXCEPTION 'FAIL: View firehorse_signals_high does not exist';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'firehorse_signals_pending_approval') THEN
    RAISE EXCEPTION 'FAIL: View firehorse_signals_pending_approval does not exist';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'firehorse_signals_metrics') THEN
    RAISE EXCEPTION 'FAIL: View firehorse_signals_metrics does not exist';
  END IF;

  RAISE NOTICE 'PASS: All views exist';
END $$;

-- ============================================================================
-- TEST 4: Verify functions exist
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_proc WHERE proname = 'get_signals_by_company'
  ) THEN
    RAISE EXCEPTION 'FAIL: Function get_signals_by_company does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_proc WHERE proname = 'get_top_companies_by_signals'
  ) THEN
    RAISE EXCEPTION 'FAIL: Function get_top_companies_by_signals does not exist';
  END IF;

  RAISE NOTICE 'PASS: All functions exist';
END $$;

-- ============================================================================
-- TEST 5: Test insert and select
-- ============================================================================

DO $$
DECLARE
  test_id UUID;
BEGIN
  -- Insert test record
  INSERT INTO firehorse_signals (
    signal_source,
    signal_type,
    signal_date,
    company_name,
    signal_content,
    correlation_score,
    correlation_reason
  ) VALUES (
    'manual',
    'other',
    NOW(),
    'Test Company for Migration',
    'Test signal content',
    5,
    'Test reason'
  ) RETURNING id INTO test_id;

  -- Verify insert
  IF test_id IS NULL THEN
    RAISE EXCEPTION 'FAIL: Insert failed (no ID returned)';
  END IF;

  -- Verify select
  IF NOT EXISTS (SELECT 1 FROM firehorse_signals WHERE id = test_id) THEN
    RAISE EXCEPTION 'FAIL: Cannot select inserted record';
  END IF;

  -- Verify default values
  IF NOT EXISTS (
    SELECT 1 FROM firehorse_signals
    WHERE id = test_id
      AND status = 'detected'
      AND created_at IS NOT NULL
      AND updated_at IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'FAIL: Default values not set correctly';
  END IF;

  -- Clean up
  DELETE FROM firehorse_signals WHERE id = test_id;

  RAISE NOTICE 'PASS: Insert/select/delete works correctly';
END $$;

-- ============================================================================
-- TEST 6: Test trigger (updated_at auto-update)
-- ============================================================================

DO $$
DECLARE
  test_id UUID;
  original_updated_at TIMESTAMPTZ;
  new_updated_at TIMESTAMPTZ;
BEGIN
  -- Insert test record
  INSERT INTO firehorse_signals (
    signal_source,
    signal_type,
    signal_date,
    company_name,
    signal_content,
    correlation_score
  ) VALUES (
    'manual',
    'other',
    NOW(),
    'Trigger Test Company',
    'Test content',
    3
  ) RETURNING id, updated_at INTO test_id, original_updated_at;

  -- Wait a moment
  PERFORM pg_sleep(0.1);

  -- Update record
  UPDATE firehorse_signals
  SET correlation_score = 4
  WHERE id = test_id
  RETURNING updated_at INTO new_updated_at;

  -- Verify updated_at changed
  IF new_updated_at <= original_updated_at THEN
    RAISE EXCEPTION 'FAIL: Trigger did not update updated_at (% vs %)', new_updated_at, original_updated_at;
  END IF;

  -- Clean up
  DELETE FROM firehorse_signals WHERE id = test_id;

  RAISE NOTICE 'PASS: Trigger updates updated_at correctly';
END $$;

-- ============================================================================
-- TEST 7: Test view filtering (ULTRA signals)
-- ============================================================================

DO $$
DECLARE
  test_id_ultra UUID;
  test_id_low UUID;
  view_count INTEGER;
BEGIN
  -- Insert ULTRA signal (should appear in view)
  INSERT INTO firehorse_signals (
    signal_source,
    signal_type,
    signal_date,
    company_name,
    signal_content,
    correlation_score,
    status
  ) VALUES (
    'manual',
    'other',
    NOW(),
    'View Test ULTRA',
    'Test',
    5,
    'analyzed'
  ) RETURNING id INTO test_id_ultra;

  -- Insert LOW signal (should NOT appear in view)
  INSERT INTO firehorse_signals (
    signal_source,
    signal_type,
    signal_date,
    company_name,
    signal_content,
    correlation_score,
    status
  ) VALUES (
    'manual',
    'other',
    NOW(),
    'View Test LOW',
    'Test',
    2,
    'analyzed'
  ) RETURNING id INTO test_id_low;

  -- Check view
  SELECT COUNT(*) INTO view_count
  FROM firehorse_signals_ultra
  WHERE company_name IN ('View Test ULTRA', 'View Test LOW');

  IF view_count != 1 THEN
    RAISE EXCEPTION 'FAIL: View filtering incorrect (expected 1, got %)', view_count;
  END IF;

  -- Clean up
  DELETE FROM firehorse_signals WHERE id IN (test_id_ultra, test_id_low);

  RAISE NOTICE 'PASS: View filtering works correctly';
END $$;

-- ============================================================================
-- TEST 8: Test function get_signals_by_company
-- ============================================================================

DO $$
DECLARE
  test_id UUID;
  result_count INTEGER;
BEGIN
  -- Insert test signal
  INSERT INTO firehorse_signals (
    signal_source,
    signal_type,
    signal_date,
    company_name,
    signal_content,
    correlation_score
  ) VALUES (
    'manual',
    'other',
    NOW(),
    'Function Test Company XYZ',
    'Test',
    4
  ) RETURNING id INTO test_id;

  -- Call function
  SELECT COUNT(*) INTO result_count
  FROM get_signals_by_company('Function Test Company XYZ');

  IF result_count != 1 THEN
    RAISE EXCEPTION 'FAIL: Function returned % rows (expected 1)', result_count;
  END IF;

  -- Clean up
  DELETE FROM firehorse_signals WHERE id = test_id;

  RAISE NOTICE 'PASS: Function get_signals_by_company works';
END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ALL TESTS PASSED ✅';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration 012 deployed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run Python signal collector (scripts/collect_signals.py)';
  RAISE NOTICE '2. Test TypeScript services';
  RAISE NOTICE '3. Deploy dashboard UI';
END $$;
