-- Migration 073: ERP Integration Tables
-- Date: 2026-07-02
-- Author: Claude Code (supabase/aiven audit)
-- Purpose: Backfill the schema for src/integrations/erp/service.ts, which reads
--   and writes erp_integrations, erp_webhook_events, and erp_sync_operations but
--   had no corresponding migration since the ERP connector module (Monitor, IFS,
--   Dynamics 365, SAP, Visma, Jeeves) was added 2026-05-17. Without this, every
--   write from the ERP service falls through to its in-memory-only fallback path.

BEGIN;

-- ─── erp_integrations ──────────────────────────────────────────────────────
-- One row per organization+provider pair. Written by
-- ERPIntegrationService.configureIntegration() (upsert on organization_id,provider)
-- and .updateLastSync(); read by .getIntegrations().

CREATE TABLE IF NOT EXISTS erp_integrations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider         TEXT        NOT NULL CHECK (provider IN ('monitor', 'ifs', 'dynamics365', 'sap', 'visma', 'jeeves')),
  config           JSONB       NOT NULL DEFAULT '{}'::jsonb,
  sync_settings    JSONB       NOT NULL DEFAULT '{}'::jsonb,
  field_mappings   JSONB       NOT NULL DEFAULT '[]'::jsonb,
  status           TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  error_message    TEXT,
  last_sync_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, provider)
);

CREATE INDEX IF NOT EXISTS erp_integrations_org_idx ON erp_integrations (organization_id);

COMMENT ON TABLE erp_integrations IS
  'Per-organization ERP connector configuration (Monitor/IFS/Dynamics365/SAP/Visma/Jeeves). Written by ERPIntegrationService.configureIntegration().';

-- ─── erp_webhook_events ─────────────────────────────────────────────────────
-- Inbound webhook events from ERP systems. Written by
-- ERPIntegrationService.handleWebhook(). Note: application-generated ids are
-- `${Date.now()}-${random}` strings, not UUIDs — id column is TEXT to match.

CREATE TABLE IF NOT EXISTS erp_webhook_events (
  id            TEXT        PRIMARY KEY,
  provider      TEXT        NOT NULL CHECK (provider IN ('monitor', 'ifs', 'dynamics365', 'sap', 'visma', 'jeeves')),
  event_type    TEXT        NOT NULL,
  entity_type   TEXT        NOT NULL,
  entity_id     TEXT        NOT NULL,
  timestamp     TIMESTAMPTZ NOT NULL,
  payload       JSONB       NOT NULL DEFAULT '{}'::jsonb,
  processed     BOOLEAN     NOT NULL DEFAULT FALSE,
  processed_at  TIMESTAMPTZ,
  error         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS erp_webhook_events_provider_idx ON erp_webhook_events (provider);
CREATE INDEX IF NOT EXISTS erp_webhook_events_unprocessed_idx ON erp_webhook_events (processed) WHERE NOT processed;

COMMENT ON TABLE erp_webhook_events IS
  'Inbound webhook events from ERP systems. Written by ERPIntegrationService.handleWebhook().';

-- ─── erp_sync_operations ────────────────────────────────────────────────────
-- Sync operation history, mirroring the SyncOperation shape in
-- src/integrations/erp/types.ts. Read by ERPIntegrationService.getSyncHistory();
-- note the current codebase constructs SyncOperation records in-memory
-- (base-connector.ts createSyncOperation/createSyncResult) but does not yet
-- persist them here — this table makes that persistence possible once wired up.

CREATE TABLE IF NOT EXISTS erp_sync_operations (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider           TEXT        NOT NULL CHECK (provider IN ('monitor', 'ifs', 'dynamics365', 'sap', 'visma', 'jeeves')),
  direction          TEXT        NOT NULL CHECK (direction IN ('to_erp', 'from_erp')),
  entity_type        TEXT        NOT NULL,
  status             TEXT        NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'partially_synced')),
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at       TIMESTAMPTZ,
  records_processed  INTEGER     NOT NULL DEFAULT 0,
  records_failed     INTEGER     NOT NULL DEFAULT 0,
  error_messages     TEXT[],
  metadata           JSONB       DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS erp_sync_operations_org_started_idx ON erp_sync_operations (organization_id, started_at DESC);
CREATE INDEX IF NOT EXISTS erp_sync_operations_provider_idx ON erp_sync_operations (provider);

COMMENT ON TABLE erp_sync_operations IS
  'ERP sync operation history. Read by ERPIntegrationService.getSyncHistory().';

-- ─── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE erp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_sync_operations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_erp_integrations" ON erp_integrations;
CREATE POLICY "service_role_all_erp_integrations" ON erp_integrations
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "org_members_read_erp_integrations" ON erp_integrations;
CREATE POLICY "org_members_read_erp_integrations" ON erp_integrations
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));

-- Webhook events are internal ingestion only — no direct end-user access.
DROP POLICY IF EXISTS "service_role_all_erp_webhook_events" ON erp_webhook_events;
CREATE POLICY "service_role_all_erp_webhook_events" ON erp_webhook_events
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "service_role_all_erp_sync_operations" ON erp_sync_operations;
CREATE POLICY "service_role_all_erp_sync_operations" ON erp_sync_operations
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "org_members_read_erp_sync_operations" ON erp_sync_operations;
CREATE POLICY "org_members_read_erp_sync_operations" ON erp_sync_operations
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));

COMMIT;
