-- Supabase Advisor Critical Fixes
-- Addresses common Security/Performance Advisor issues (unindexed FKs, etc.)
-- Run after: supabase db push or apply via SQL Editor
-- Reference: https://supabase.com/docs/guides/database/database-advisors

-- ============================================================================
-- 1. UNINDEXED FOREIGN KEYS (lint 0001 - PERFORMANCE)
-- ============================================================================
-- Add indexes on FK columns that may be missing for join performance

-- subscriptions.contract_id (006)
CREATE INDEX IF NOT EXISTS idx_subscriptions_contract_id 
  ON subscriptions(contract_id) 
  WHERE contract_id IS NOT NULL;

-- transactions.contract_id (006)
CREATE INDEX IF NOT EXISTS idx_transactions_contract_id 
  ON transactions(contract_id) 
  WHERE contract_id IS NOT NULL;

-- import_shipments.supplier_id (026 duplicate-prefix file, now archived — the
-- table exists in production but not in blank-slate replays; guard accordingly)
DO $do$
BEGIN
  IF to_regclass('public.import_shipments') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_import_shipments_supplier_id
      ON import_shipments(supplier_id)
      WHERE supplier_id IS NOT NULL;
    COMMENT ON INDEX idx_import_shipments_supplier_id IS 'Advisor fix: index FK for join performance';
  END IF;
END $do$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON INDEX idx_subscriptions_contract_id IS 'Advisor fix: index FK for join performance';
COMMENT ON INDEX idx_transactions_contract_id IS 'Advisor fix: index FK for join performance';

SELECT 'Migration 031_supabase_advisor_fixes.sql completed' as status;
