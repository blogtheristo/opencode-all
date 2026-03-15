-- Migration 043: Custom report templates for Firehorse Template Editor
-- Purpose: Store user-created report templates (JSON) for the Report Engine.
--          The Firehorse Report Engine reads built-in templates from files;
--          this table holds custom templates editable via the dashboard UI.

-- ============================================================
-- REPORT_TEMPLATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS report_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Template identity (matches Firehorse template_config.schema.json)
    template_id     TEXT NOT NULL UNIQUE,
    template_name   TEXT NOT NULL,
    template_version TEXT DEFAULT '1.0',

    -- Full template config (JSON)
    config          JSONB NOT NULL,

    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_templates_org ON report_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_id ON report_templates(template_id);

-- RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates in their org"
    ON report_templates FOR SELECT
    TO authenticated
    USING (
        org_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
        OR org_id IS NULL
    );

CREATE POLICY "Users can insert templates in their org"
    ON report_templates FOR INSERT
    TO authenticated
    WITH CHECK (
        org_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
        OR org_id IS NULL
    );

CREATE POLICY "Users can update templates in their org"
    ON report_templates FOR UPDATE
    TO authenticated
    USING (
        org_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete templates in their org"
    ON report_templates FOR DELETE
    TO authenticated
    USING (
        org_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role full access on report_templates"
    ON report_templates FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE report_templates IS 'Custom Firehorse report templates (JSON config). Editable via dashboard Template Editor.';
