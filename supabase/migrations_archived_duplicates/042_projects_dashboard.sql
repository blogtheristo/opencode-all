-- Migration 042: Projects table for dashboard portfolio view
-- Purpose: Stores project portfolio data for the DWS IQ dashboard (SPI, CPI, carbon, compliance).
--          Idempotent: creates table if not exists, adds columns if missing.

-- ============================================================
-- PROJECTS TABLE (create or alter)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL DEFAULT '',
    project_code    TEXT,
    location        TEXT,
    status          TEXT DEFAULT 'green' CHECK (status IN ('green', 'amber', 'red')),
    spi             DECIMAL(5,2) DEFAULT 1.00,
    cpi             DECIMAL(5,2) DEFAULT 1.00,
    carbon_footprint DECIMAL(14,2) DEFAULT 0,
    budget          DECIMAL(14,2),
    spent           DECIMAL(14,2),
    start_date      DATE,
    end_date        DATE,
    compliance_status JSONB DEFAULT '{"csrd":false,"epbd":false,"ets":false,"cbam":false,"last_check":null}'::jsonb,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if table existed with different schema
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'budget') THEN
        ALTER TABLE projects ADD COLUMN budget DECIMAL(14,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'spi') THEN
        ALTER TABLE projects ADD COLUMN spi DECIMAL(5,2) DEFAULT 1.00;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'cpi') THEN
        ALTER TABLE projects ADD COLUMN cpi DECIMAL(5,2) DEFAULT 1.00;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'carbon_footprint') THEN
        ALTER TABLE projects ADD COLUMN carbon_footprint DECIMAL(14,2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'compliance_status') THEN
        ALTER TABLE projects ADD COLUMN compliance_status JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_code') THEN
        ALTER TABLE projects ADD COLUMN project_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'location') THEN
        ALTER TABLE projects ADD COLUMN location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'start_date') THEN
        ALTER TABLE projects ADD COLUMN start_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'end_date') THEN
        ALTER TABLE projects ADD COLUMN end_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'spent') THEN
        ALTER TABLE projects ADD COLUMN spent DECIMAL(14,2);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view projects in their org" ON projects;
CREATE POLICY "Users can view projects in their org"
    ON projects FOR SELECT
    TO authenticated
    USING (
        org_id IS NULL OR org_id IN (
            SELECT organization_id FROM organization_members
            WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Service role full access on projects" ON projects;
CREATE POLICY "Service role full access on projects"
    ON projects FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated to read projects with no org (demo data)
DROP POLICY IF EXISTS "Allow read projects with no org" ON projects;
CREATE POLICY "Allow read projects with no org"
    ON projects FOR SELECT
    TO authenticated
    USING (org_id IS NULL);

COMMENT ON TABLE projects IS 'Portfolio projects for dashboard (SPI, CPI, carbon, compliance). Feeds v10-react dashboard.';
