-- Migration 028: BIM Pipeline Tables
-- Purpose: Store BIM extraction data, EN 15978 carbon calculations,
--          and Situation Room reports fed by the MCP Hub pipeline.
-- 
-- Data flow: MCP Hub /pipelines/bim-carbon → backend /api/bim/* → these tables
--            → backend /api/situation-room/report → situation_room_reports
--            → frontend CarbonTrackingPage + SituationRoomPanel poll these

-- ============================================================
-- 1. BIM Projects — IFC file metadata and extraction results
-- ============================================================
CREATE TABLE IF NOT EXISTS bim_projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    project_name    TEXT NOT NULL,
    project_code    TEXT,                           -- e.g. "PRJ-001"
    country         CHAR(2) NOT NULL DEFAULT 'FI',  -- ISO 3166-1
    location        TEXT,                           -- city / site name
    bim_file_url    TEXT NOT NULL,
    file_format     TEXT DEFAULT 'ifc',             -- ifc, ifczip, bcf, json
    gross_floor_area_m2  DECIMAL(12,2),
    building_type   TEXT,                           -- residential, commercial, industrial, infrastructure
    status          TEXT DEFAULT 'pending'          -- pending, extracting, extracted, error
        CHECK (status IN ('pending', 'extracting', 'extracted', 'error')),
    extraction_data JSONB DEFAULT '{}'::jsonb,      -- raw geometry/material output
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bim_projects_org ON bim_projects(org_id);
CREATE INDEX idx_bim_projects_status ON bim_projects(status);

-- ============================================================
-- 2. Carbon Calculations — EN 15978 stage-by-stage results
-- ============================================================
CREATE TABLE IF NOT EXISTS carbon_calculations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bim_project_id  UUID NOT NULL REFERENCES bim_projects(id) ON DELETE CASCADE,
    
    -- EN 15978 lifecycle stages (kg CO2e)
    a1_raw_materials        DECIMAL(12,2) DEFAULT 0,
    a2_transport             DECIMAL(12,2) DEFAULT 0,
    a3_manufacturing         DECIMAL(12,2) DEFAULT 0,
    a4_transport_to_site     DECIMAL(12,2) DEFAULT 0,
    a5_construction          DECIMAL(12,2) DEFAULT 0,
    b1_use                   DECIMAL(12,2) DEFAULT 0,
    b2_maintenance           DECIMAL(12,2) DEFAULT 0,
    b3_repair                DECIMAL(12,2) DEFAULT 0,
    b4_replacement           DECIMAL(12,2) DEFAULT 0,
    b5_refurbishment         DECIMAL(12,2) DEFAULT 0,
    b6_operational_energy    DECIMAL(12,2) DEFAULT 0,
    b7_operational_water     DECIMAL(12,2) DEFAULT 0,
    c1_deconstruction        DECIMAL(12,2) DEFAULT 0,
    c2_transport_eol         DECIMAL(12,2) DEFAULT 0,
    c3_waste_processing      DECIMAL(12,2) DEFAULT 0,
    c4_disposal              DECIMAL(12,2) DEFAULT 0,
    d_reuse_recovery         DECIMAL(12,2) DEFAULT 0,
    
    -- Aggregates
    total_kg_co2e            DECIMAL(14,2) GENERATED ALWAYS AS (
        a1_raw_materials + a2_transport + a3_manufacturing +
        a4_transport_to_site + a5_construction +
        b1_use + b2_maintenance + b3_repair + b4_replacement +
        b5_refurbishment + b6_operational_energy + b7_operational_water +
        c1_deconstruction + c2_transport_eol + c3_waste_processing + c4_disposal +
        d_reuse_recovery
    ) STORED,
    kg_co2e_per_m2           DECIMAL(10,2),         -- normalised to GFA
    
    -- Compliance status
    csrd_status     TEXT DEFAULT 'pending' CHECK (csrd_status IN ('compliant', 'non-compliant', 'pending')),
    ets_status      TEXT DEFAULT 'pending' CHECK (ets_status IN ('compliant', 'non-compliant', 'pending')),
    cbam_status     TEXT DEFAULT 'pending' CHECK (cbam_status IN ('compliant', 'non-compliant', 'pending')),
    fit55_score     DECIMAL(5,2),                   -- 0-100 compliance score
    
    -- Material breakdown (JSONB for flexibility)
    materials_breakdown JSONB DEFAULT '[]'::jsonb,  -- [{material, kg_co2e, percentage}]
    
    calculation_method  TEXT DEFAULT 'en15978',
    calculated_at       TIMESTAMPTZ DEFAULT now(),
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_carbon_calc_project ON carbon_calculations(bim_project_id);

-- ============================================================
-- 3. Situation Room Reports — pipeline output for dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS situation_room_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
    project_id      TEXT NOT NULL,                  -- matches bim_project_id or external ref
    report_type     TEXT NOT NULL DEFAULT 'bim-carbon',  -- bim-carbon, safety, schedule, etc.
    title           TEXT,
    status          TEXT DEFAULT 'active'           -- active, archived, error
        CHECK (status IN ('active', 'archived', 'error')),
    
    -- Pipeline results payload
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Summary fields for fast dashboard queries
    total_kg_co2e   DECIMAL(14,2),
    fit55_score     DECIMAL(5,2),
    compliance_rag  TEXT DEFAULT 'amber'            -- red, amber, green
        CHECK (compliance_rag IN ('red', 'amber', 'green')),
    country         CHAR(2) DEFAULT 'FI',
    
    -- Metadata
    pipeline_workflow_id TEXT,                       -- links back to MCP Hub workflow
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sr_reports_org ON situation_room_reports(org_id);
CREATE INDEX idx_sr_reports_project ON situation_room_reports(project_id);
CREATE INDEX idx_sr_reports_type ON situation_room_reports(report_type);
CREATE INDEX idx_sr_reports_created ON situation_room_reports(created_at DESC);

-- ============================================================
-- 4. Emission Factors — lookup table for carbon calculations
-- ============================================================
CREATE TABLE IF NOT EXISTS emission_factors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material        TEXT NOT NULL,                   -- concrete, steel, timber, glass, etc.
    category        TEXT,                            -- structural, envelope, finishes, MEP
    kg_co2e_per_kg  DECIMAL(8,4) NOT NULL,          -- emission factor
    kg_co2e_per_m3  DECIMAL(10,2),                  -- volumetric factor (if applicable)
    data_source     TEXT DEFAULT 'ecoinvent',        -- ecoinvent, EPD, national database
    country         CHAR(2) DEFAULT 'FI',            -- country-specific factor
    valid_from      DATE DEFAULT CURRENT_DATE,
    valid_to        DATE,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_emission_factors_material ON emission_factors(material);
CREATE INDEX idx_emission_factors_country ON emission_factors(country);

-- ============================================================
-- 5. RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE bim_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE situation_room_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;

-- Org-scoped read for authenticated users
CREATE POLICY "Users can view own org BIM projects"
    ON bim_projects FOR SELECT
    USING (org_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND status = 'active'
    ));

CREATE POLICY "Users can view own org carbon calculations"
    ON carbon_calculations FOR SELECT
    USING (bim_project_id IN (
        SELECT id FROM bim_projects WHERE org_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND status = 'active'
        )
    ));

CREATE POLICY "Users can view own org situation room reports"
    ON situation_room_reports FOR SELECT
    USING (org_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND status = 'active'
    ));

-- Emission factors are public read
CREATE POLICY "Anyone can read emission factors"
    ON emission_factors FOR SELECT
    USING (true);

-- Service role can insert/update everything (backend uses service key)
CREATE POLICY "Service role full access on bim_projects"
    ON bim_projects FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on carbon_calculations"
    ON carbon_calculations FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on situation_room_reports"
    ON situation_room_reports FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on emission_factors"
    ON emission_factors FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================
-- 6. Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bim_projects_updated_at
    BEFORE UPDATE ON bim_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_situation_room_reports_updated_at
    BEFORE UPDATE ON situation_room_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
