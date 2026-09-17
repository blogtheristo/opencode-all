-- Migration 047: Database-enforced dedup on (company_name, tender_id)
-- tender_id tracks the TED notice id; company_name is normalized buyer (contracting authority).
-- Trigger keeps keys in sync with buyer_name + ted_notice_id so cron retries cannot duplicate rows.

BEGIN;

-- ---------------------------------------------------------------------------
-- Columns (filled by trigger; backfilled for existing rows)
-- ---------------------------------------------------------------------------
ALTER TABLE construction_leads
  ADD COLUMN IF NOT EXISTS company_name VARCHAR(500) NOT NULL DEFAULT '';

ALTER TABLE construction_leads
  ADD COLUMN IF NOT EXISTS tender_id VARCHAR(100);

UPDATE construction_leads
SET
  company_name = COALESCE(NULLIF(trim(buyer_name), ''), ''),
  tender_id = ted_notice_id
WHERE tender_id IS NULL OR company_name = '';

ALTER TABLE construction_leads
  ALTER COLUMN tender_id SET NOT NULL;

-- ---------------------------------------------------------------------------
-- Drop standalone unique on ted_notice_id (replaced by composite)
-- ---------------------------------------------------------------------------
ALTER TABLE construction_leads DROP CONSTRAINT IF EXISTS construction_leads_ted_notice_id_key;

DROP INDEX IF EXISTS idx_construction_leads_ted_id;

CREATE INDEX IF NOT EXISTS idx_construction_leads_ted_notice_id
  ON construction_leads (ted_notice_id);

-- ---------------------------------------------------------------------------
-- Composite unique: survives cron restarts and application retries
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS construction_leads_company_tender_uidx;

CREATE UNIQUE INDEX construction_leads_company_tender_uidx
  ON construction_leads (company_name, tender_id);

COMMENT ON INDEX construction_leads_company_tender_uidx IS
  'Dedup key: normalized buyer + TED notice id. Not application-level.';

COMMENT ON COLUMN construction_leads.company_name IS
  'Normalized contracting authority name for dedup; sync from buyer_name via trigger.';
COMMENT ON COLUMN construction_leads.tender_id IS
  'Business tender key; equals ted_notice_id for TED pipeline.';

-- ---------------------------------------------------------------------------
-- Trigger: always align dedup keys before constraint checks
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION construction_leads_set_dedup_keys()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.company_name := COALESCE(NULLIF(trim(NEW.buyer_name), ''), '');
  NEW.tender_id := NEW.ted_notice_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_construction_leads_dedup_keys ON construction_leads;
CREATE TRIGGER trg_construction_leads_dedup_keys
  BEFORE INSERT OR UPDATE ON construction_leads
  FOR EACH ROW
  EXECUTE FUNCTION construction_leads_set_dedup_keys();

-- ---------------------------------------------------------------------------
-- Refresh view so new columns appear in ted_leads
-- ---------------------------------------------------------------------------
-- 046 (canonical, matches production) creates ted_leads as a real TABLE; this
-- view-alias block predates that. DROP VIEW IF EXISTS is fatal against a table
-- (42809), so only alias when ted_leads is absent or already a view.
-- (CI soak catch, blank-slate replay.)
DO $tl$
BEGIN
  IF to_regclass('public.ted_leads') IS NULL
     OR EXISTS (SELECT 1 FROM information_schema.views
                WHERE table_schema = 'public' AND table_name = 'ted_leads') THEN
    EXECUTE 'DROP VIEW IF EXISTS ted_leads';
    EXECUTE 'CREATE VIEW ted_leads AS SELECT * FROM construction_leads';
    EXECUTE $c$COMMENT ON VIEW ted_leads IS 'Alias for construction_leads (TED pipeline). Dedup: (company_name, tender_id).'$c$;
  ELSE
    RAISE NOTICE '047: ted_leads exists as a table (046) — skipping view alias';
  END IF;
END $tl$;

COMMIT;
