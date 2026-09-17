-- ============================================================================
-- Firehorse Document Templates - Supabase Schema
-- European Construction Document Template Standards
-- Version: 1.0
-- Date: December 30, 2025
-- ============================================================================

-- ============================================================================
-- === Standard grants for a new public table ===
-- Copy this block after every CREATE TABLE in the public schema.
-- Supabase dropped the implicit Data API grants on 2026-05-30 (new projects)
-- and enforces the same on all existing projects on 2026-10-30. Without an
-- explicit GRANT, PostgREST / supabase-js / GraphQL return 42501 even when
-- RLS would allow the row. RLS is the row gate; GRANT is the table gate.
-- Backfill of record: supabase/migrations/075_public_schema_grants.sql.
-- ============================================================================
-- Replace <table_name>. Add anon lines only if RLS permits public access.
-- grant select, insert, update, delete on public.<table_name>
--   to authenticated, service_role;
-- alter table public.<table_name> enable row level security;
--
-- -- Opt-in per role (only if a policy targets that role):
-- -- grant select on public.<table_name> to anon;
-- -- grant insert on public.<table_name> to anon;
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CARBON FACTORS DATABASE (EN 15978)
-- ============================================================================

-- Carbon factors for materials and processes
CREATE TABLE carbon_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Material identification
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL, -- Concrete, Steel, Timber, etc.
  material_subcategory TEXT, -- Reinforced concrete, structural steel, etc.
  
  -- Carbon data (EN 15978 life cycle stages)
  gwp_a1a3 DECIMAL(10,4), -- Global Warming Potential A1-A3 (kg CO2-eq per unit)
  gwp_a4 DECIMAL(10,4), -- Transport to site (kg CO2-eq per unit per km)
  gwp_a5 DECIMAL(10,4), -- Construction process (kg CO2-eq per unit)
  gwp_c1c4 DECIMAL(10,4), -- End of life (kg CO2-eq per unit)
  gwp_d DECIMAL(10,4), -- Benefits beyond system boundary (kg CO2-eq per unit)
  
  -- Additional environmental indicators
  odp DECIMAL(10,8), -- Ozone Depletion Potential
  ap DECIMAL(10,4), -- Acidification Potential
  ep DECIMAL(10,4), -- Eutrophication Potential
  pocp DECIMAL(10,4), -- Photochemical Ozone Creation Potential
  adp_elements DECIMAL(10,4), -- Abiotic Depletion Potential - elements
  adp_fossil DECIMAL(10,4), -- Abiotic Depletion Potential - fossil fuels
  pe_renewable DECIMAL(10,2), -- Primary Energy - renewable (MJ)
  pe_non_renewable DECIMAL(10,2), -- Primary Energy - non-renewable (MJ)
  
  -- Measurement
  unit TEXT NOT NULL, -- kg, m3, m2, m, pcs, etc.
  density DECIMAL(10,4), -- For unit conversions (kg/m3)
  
  -- Data source and quality
  data_source TEXT, -- EPD, Ökobaudat, ICE, etc.
  epd_number TEXT, -- EPD registration number
  data_quality TEXT CHECK (data_quality IN ('High', 'Medium', 'Low')),
  uncertainty_percentage DECIMAL(5,2),
  
  -- Geographic and temporal validity
  region TEXT, -- Nordic, Central Europe, EU, etc.
  country_code TEXT, -- FI, SE, NO, DK, DE, AT, CH, NL, BE
  valid_from DATE,
  valid_to DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  notes TEXT,
  
  -- Indexing
  CONSTRAINT carbon_factors_material_region_key UNIQUE (material_name, region, valid_from)
);

CREATE INDEX idx_carbon_factors_category ON carbon_factors(material_category);
CREATE INDEX idx_carbon_factors_region ON carbon_factors(region);
CREATE INDEX idx_carbon_factors_validity ON carbon_factors(valid_from, valid_to);

-- ============================================================================
-- PROJECT CARBON TRACKING
-- ============================================================================

-- Real-time carbon emissions tracking by project and life cycle stage
CREATE TABLE project_carbon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project reference
  project_id UUID NOT NULL, -- References projects table
  project_phase TEXT, -- Design, Construction, Operations
  
  -- Life cycle stage (EN 15978)
  life_cycle_stage TEXT NOT NULL CHECK (life_cycle_stage IN (
    'A1', 'A2', 'A3', 'A1-A3', 'A4', 'A5',
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
    'C1', 'C2', 'C3', 'C4', 'D'
  )),
  
  -- Material/activity details
  material_id UUID REFERENCES carbon_factors(id),
  material_name TEXT,
  activity_description TEXT,
  
  -- Quantity
  quantity DECIMAL(12,2) NOT NULL,
  unit TEXT NOT NULL,
  
  -- Carbon emissions
  carbon_factor DECIMAL(10,4), -- kg CO2-eq per unit
  carbon_emission DECIMAL(12,4) NOT NULL, -- Total kg CO2-eq
  
  -- Additional environmental impacts
  odp_emission DECIMAL(10,8),
  ap_emission DECIMAL(10,4),
  ep_emission DECIMAL(10,4),
  pocp_emission DECIMAL(10,4),
  
  -- Data quality and source
  data_quality TEXT CHECK (data_quality IN ('High', 'Medium', 'Low')),
  data_source TEXT,
  calculation_method TEXT,
  
  -- Temporal tracking
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_date DATE, -- When the activity occurred
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  notes TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  verified_at TIMESTAMP
);

CREATE INDEX idx_project_carbon_project ON project_carbon(project_id);
CREATE INDEX idx_project_carbon_stage ON project_carbon(life_cycle_stage);
CREATE INDEX idx_project_carbon_date ON project_carbon(calculation_date);

-- ============================================================================
-- CARBON BUDGET
-- ============================================================================

-- Carbon budget tracking and alerts
CREATE TABLE carbon_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project reference
  project_id UUID NOT NULL UNIQUE, -- One budget per project
  
  -- Budget targets
  target_carbon DECIMAL(12,2), -- Total kg CO2-eq
  target_intensity DECIMAL(8,2), -- kg CO2-eq/m2
  target_by_stage JSONB, -- Target breakdown by life cycle stage
  
  -- Current status
  current_carbon DECIMAL(12,2) DEFAULT 0,
  current_intensity DECIMAL(8,2) DEFAULT 0,
  current_by_stage JSONB, -- Current breakdown by life cycle stage
  
  -- Budget utilization
  budget_utilization_percentage DECIMAL(5,2), -- % of budget used
  budget_status TEXT CHECK (budget_status IN (
    'On Track', 'At Risk', 'Over Budget', 'Optimized'
  )),
  
  -- Project area for intensity calculation
  gross_floor_area DECIMAL(10,2), -- m2
  
  -- Alerts
  alert_threshold_percentage DECIMAL(5,2) DEFAULT 90.0, -- Alert at 90%
  alert_triggered BOOLEAN DEFAULT FALSE,
  last_alert_date TIMESTAMP,
  
  -- Benchmarking
  benchmark_intensity DECIMAL(8,2), -- Industry benchmark kg CO2-eq/m2
  benchmark_comparison TEXT, -- Better, Similar, Worse
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_calculation TIMESTAMP,
  
  -- Compliance
  fit_for_55_compliant BOOLEAN,
  eu_taxonomy_aligned BOOLEAN
);

CREATE INDEX idx_carbon_budget_project ON carbon_budget(project_id);
CREATE INDEX idx_carbon_budget_status ON carbon_budget(budget_status);

-- ============================================================================
-- CARBON REPORTS
-- ============================================================================

-- Generated carbon reports (EN 15978 and other formats)
CREATE TABLE carbon_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project reference
  project_id UUID NOT NULL,
  
  -- Report details
  report_type TEXT NOT NULL CHECK (report_type IN (
    'EN 15978 Full Report',
    'EN 15978 Executive Summary',
    'EN 15978 Monthly Progress',
    'Fit for 55 Compliance',
    'CSRD Sustainability Report',
    'Client Custom Report'
  )),
  report_name TEXT NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reporting_period_start DATE,
  reporting_period_end DATE,
  
  -- Carbon data summary
  total_carbon DECIMAL(12,2), -- kg CO2-eq
  carbon_intensity DECIMAL(8,2), -- kg CO2-eq/m2
  carbon_by_stage JSONB, -- Breakdown by life cycle stage
  environmental_indicators JSONB, -- ODP, AP, EP, POCP, etc.
  
  -- Report content
  report_data JSONB, -- Full report structure
  executive_summary TEXT,
  recommendations TEXT,
  
  -- Files
  pdf_url TEXT, -- Supabase Storage URL
  docx_url TEXT,
  json_url TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verifier_name TEXT,
  verifier_organization TEXT,
  verification_date DATE,
  verification_certificate_url TEXT,
  
  -- Compliance
  fit_for_55_compliant BOOLEAN,
  eu_taxonomy_aligned BOOLEAN,
  dnsh_assessment_passed BOOLEAN, -- Do No Significant Harm
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  template_id UUID, -- References document_templates table
  
  -- Version control
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES carbon_reports(id),
  
  -- Status
  status TEXT CHECK (status IN (
    'Draft', 'Review', 'Approved', 'Published', 'Archived'
  )) DEFAULT 'Draft'
);

CREATE INDEX idx_carbon_reports_project ON carbon_reports(project_id);
CREATE INDEX idx_carbon_reports_type ON carbon_reports(report_type);
CREATE INDEX idx_carbon_reports_date ON carbon_reports(report_date);
CREATE INDEX idx_carbon_reports_status ON carbon_reports(status);

-- ============================================================================
-- DOCUMENT TEMPLATES
-- ============================================================================

-- Template library for all European standards
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Template identification
  template_name TEXT NOT NULL,
  template_code TEXT UNIQUE, -- e.g., 'FI-RT-10-11224'
  template_category TEXT NOT NULL, -- Nordic, Central Europe, Pan-European
  
  -- Standard reference
  standard_type TEXT NOT NULL, -- RT, AMA, NS, VOB, ÖNORM, SIA, etc.
  standard_number TEXT, -- e.g., 'RT 10-11224', 'NS 8405'
  standard_title TEXT,
  
  -- Geographic scope
  region TEXT NOT NULL, -- Nordic, Central Europe, Pan-European
  country_code TEXT, -- FI, SE, NO, DK, DE, AT, CH, NL, BE
  
  -- Template content
  template_structure JSONB NOT NULL, -- Template field definitions
  default_values JSONB, -- Default field values
  validation_rules JSONB, -- Field validation rules
  
  -- Files
  docx_template_url TEXT, -- Word template
  pdf_template_url TEXT, -- PDF form
  html_template_url TEXT, -- HTML template
  json_schema_url TEXT, -- JSON schema
  
  -- Metadata
  description TEXT,
  usage_instructions TEXT,
  
  -- Language support
  languages TEXT[] DEFAULT ARRAY['en'], -- Supported languages
  
  -- Carbon reporting
  carbon_reporting_enabled BOOLEAN DEFAULT FALSE,
  carbon_sections JSONB, -- EN 15978 sections in template
  
  -- BIM integration
  bim_enabled BOOLEAN DEFAULT FALSE,
  ifc_mapping JSONB, -- IFC property mappings
  
  -- Customization
  customizable BOOLEAN DEFAULT TRUE,
  custom_fields JSONB, -- Client-specific custom fields
  
  -- Version control
  version TEXT NOT NULL DEFAULT '1.0',
  version_date DATE DEFAULT CURRENT_DATE,
  previous_version_id UUID REFERENCES document_templates(id),
  
  -- Status
  status TEXT CHECK (status IN (
    'Draft', 'Review', 'Approved', 'Active', 'Deprecated'
  )) DEFAULT 'Draft',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP
);

CREATE INDEX idx_document_templates_category ON document_templates(template_category);
CREATE INDEX idx_document_templates_standard ON document_templates(standard_type);
CREATE INDEX idx_document_templates_region ON document_templates(region);
CREATE INDEX idx_document_templates_status ON document_templates(status);

-- ============================================================================
-- GENERATED REPORTS
-- ============================================================================

-- All generated reports (not just carbon)
CREATE TABLE generated_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project reference
  project_id UUID NOT NULL,
  
  -- Template reference
  template_id UUID REFERENCES document_templates(id),
  template_name TEXT,
  
  -- Report details
  report_title TEXT NOT NULL,
  report_type TEXT NOT NULL, -- Technical, Compliance, Quality, Safety, etc.
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reporting_period_start DATE,
  reporting_period_end DATE,
  
  -- Report content
  report_data JSONB NOT NULL, -- Complete report data
  
  -- Files
  pdf_url TEXT,
  docx_url TEXT,
  html_url TEXT,
  
  -- Language
  language TEXT DEFAULT 'en',
  
  -- Status
  status TEXT CHECK (status IN (
    'Draft', 'Review', 'Approved', 'Published', 'Archived'
  )) DEFAULT 'Draft',
  
  -- Approval workflow
  submitted_by UUID,
  submitted_at TIMESTAMP,
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  approved_by UUID,
  approved_at TIMESTAMP,
  
  -- Distribution
  recipients TEXT[], -- Email addresses
  distributed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Version control
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES generated_reports(id)
);

CREATE INDEX idx_generated_reports_project ON generated_reports(project_id);
CREATE INDEX idx_generated_reports_template ON generated_reports(template_id);
CREATE INDEX idx_generated_reports_type ON generated_reports(report_type);
CREATE INDEX idx_generated_reports_date ON generated_reports(report_date);
CREATE INDEX idx_generated_reports_status ON generated_reports(status);

-- ============================================================================
-- TEMPLATE CUSTOMIZATIONS
-- ============================================================================

-- Client-specific template customizations
CREATE TABLE template_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Base template
  base_template_id UUID REFERENCES document_templates(id),
  
  -- Client reference
  client_id UUID, -- References clients table
  client_name TEXT NOT NULL,
  
  -- Customization details
  customization_name TEXT NOT NULL,
  custom_fields JSONB, -- Additional fields
  field_overrides JSONB, -- Override default values
  branding JSONB, -- Logo, colors, fonts
  
  -- Files
  custom_docx_url TEXT,
  custom_pdf_url TEXT,
  custom_html_url TEXT,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX idx_template_customizations_base ON template_customizations(base_template_id);
CREATE INDEX idx_template_customizations_client ON template_customizations(client_id);

-- ============================================================================
-- REPORT AUTOMATION
-- ============================================================================

-- Automated report generation schedules
CREATE TABLE report_automation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project reference
  project_id UUID NOT NULL,
  
  -- Template reference
  template_id UUID REFERENCES document_templates(id),
  template_name TEXT,
  
  -- Schedule
  frequency TEXT CHECK (frequency IN (
    'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Phase Completion', 'On Demand'
  )),
  schedule_day INTEGER, -- Day of week (1-7) or month (1-31)
  schedule_time TIME, -- Time of day
  
  -- Recipients
  recipients TEXT[] NOT NULL, -- Email addresses
  cc_recipients TEXT[],
  
  -- Alerts
  alert_enabled BOOLEAN DEFAULT FALSE,
  alert_conditions JSONB, -- Conditions that trigger alerts
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX idx_report_automation_project ON report_automation(project_id);
CREATE INDEX idx_report_automation_next_run ON report_automation(next_run);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Project carbon summary view
CREATE VIEW v_project_carbon_summary AS
SELECT 
  p.project_id,
  COUNT(*) as total_entries,
  SUM(CASE WHEN p.life_cycle_stage IN ('A1', 'A2', 'A3', 'A1-A3') THEN p.carbon_emission ELSE 0 END) as carbon_a1a3,
  SUM(CASE WHEN p.life_cycle_stage = 'A4' THEN p.carbon_emission ELSE 0 END) as carbon_a4,
  SUM(CASE WHEN p.life_cycle_stage = 'A5' THEN p.carbon_emission ELSE 0 END) as carbon_a5,
  SUM(CASE WHEN p.life_cycle_stage LIKE 'B%' THEN p.carbon_emission ELSE 0 END) as carbon_b1b7,
  SUM(CASE WHEN p.life_cycle_stage LIKE 'C%' THEN p.carbon_emission ELSE 0 END) as carbon_c1c4,
  SUM(CASE WHEN p.life_cycle_stage = 'D' THEN p.carbon_emission ELSE 0 END) as carbon_d,
  SUM(p.carbon_emission) as total_carbon,
  MAX(p.calculation_date) as last_updated
FROM project_carbon p
GROUP BY p.project_id;

-- Carbon budget status view
CREATE VIEW v_carbon_budget_status AS
SELECT 
  cb.project_id,
  cb.target_carbon,
  cb.current_carbon,
  cb.target_intensity,
  cb.current_intensity,
  cb.budget_utilization_percentage,
  cb.budget_status,
  cb.alert_triggered,
  cb.fit_for_55_compliant,
  cb.eu_taxonomy_aligned,
  cb.updated_at
FROM carbon_budget cb;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update carbon budget
CREATE OR REPLACE FUNCTION update_carbon_budget(p_project_id UUID)
RETURNS void AS $$
DECLARE
  v_total_carbon DECIMAL(12,2);
  v_gross_floor_area DECIMAL(10,2);
  v_intensity DECIMAL(8,2);
  v_target DECIMAL(12,2);
  v_utilization DECIMAL(5,2);
  v_status TEXT;
BEGIN
  -- Get total carbon from project_carbon
  SELECT COALESCE(SUM(carbon_emission), 0)
  INTO v_total_carbon
  FROM project_carbon
  WHERE project_id = p_project_id;
  
  -- Get gross floor area and target from carbon_budget
  SELECT gross_floor_area, target_carbon
  INTO v_gross_floor_area, v_target
  FROM carbon_budget
  WHERE project_id = p_project_id;
  
  -- Calculate intensity
  IF v_gross_floor_area > 0 THEN
    v_intensity := v_total_carbon / v_gross_floor_area;
  ELSE
    v_intensity := 0;
  END IF;
  
  -- Calculate utilization
  IF v_target > 0 THEN
    v_utilization := (v_total_carbon / v_target) * 100;
  ELSE
    v_utilization := 0;
  END IF;
  
  -- Determine status
  IF v_utilization > 100 THEN
    v_status := 'Over Budget';
  ELSIF v_utilization > 90 THEN
    v_status := 'At Risk';
  ELSE
    v_status := 'On Track';
  END IF;
  
  -- Update carbon_budget
  UPDATE carbon_budget
  SET 
    current_carbon = v_total_carbon,
    current_intensity = v_intensity,
    budget_utilization_percentage = v_utilization,
    budget_status = v_status,
    alert_triggered = (v_utilization >= alert_threshold_percentage),
    updated_at = NOW(),
    last_calculation = NOW()
  WHERE project_id = p_project_id;
  
END;
$$ LANGUAGE plpgsql;

-- Trigger to update carbon budget when project_carbon changes
CREATE OR REPLACE FUNCTION trigger_update_carbon_budget()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_carbon_budget(NEW.project_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_project_carbon_change
AFTER INSERT OR UPDATE OR DELETE ON project_carbon
FOR EACH ROW
EXECUTE FUNCTION trigger_update_carbon_budget();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE carbon_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_carbon ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_automation ENABLE ROW LEVEL SECURITY;

-- Policies (to be customized based on authentication setup)
-- Example: Allow authenticated users to read carbon factors
CREATE POLICY "Allow authenticated read on carbon_factors"
ON carbon_factors FOR SELECT
TO authenticated
USING (true);

-- Example: Allow project members to read/write project carbon data
-- (Requires projects table with member relationships)
-- CREATE POLICY "Allow project members on project_carbon"
-- ON project_carbon FOR ALL
-- TO authenticated
-- USING (project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid()));

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample carbon factors (Nordic region)
INSERT INTO carbon_factors (material_name, material_category, gwp_a1a3, unit, data_source, region, country_code, data_quality, valid_from)
VALUES
  ('Concrete C30/37', 'Concrete', 310.5, 'kg', 'Ökobaudat', 'Nordic', 'FI', 'High', '2024-01-01'),
  ('Reinforcing Steel', 'Steel', 2100.0, 'kg', 'EPD Nordic', 'Nordic', 'SE', 'High', '2024-01-01'),
  ('Structural Steel S355', 'Steel', 1850.0, 'kg', 'EPD Nordic', 'Nordic', 'NO', 'High', '2024-01-01'),
  ('Glulam Timber', 'Timber', 420.0, 'kg', 'EPD Nordic', 'Nordic', 'FI', 'High', '2024-01-01'),
  ('Brick Masonry', 'Masonry', 240.0, 'kg', 'Ökobaudat', 'Central Europe', 'DE', 'High', '2024-01-01'),
  ('Insulation Mineral Wool', 'Insulation', 1200.0, 'kg', 'EPD', 'Pan-European', NULL, 'High', '2024-01-01'),
  ('Window Double Glazed', 'Windows', 85.0, 'm2', 'EPD', 'Pan-European', NULL, 'Medium', '2024-01-01'),
  ('Asphalt Concrete', 'Pavement', 45.0, 'kg', 'InfraRYL', 'Nordic', 'FI', 'High', '2024-01-01');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE carbon_factors IS 'Carbon emission factors for materials and processes (EN 15978)';
COMMENT ON TABLE project_carbon IS 'Real-time carbon emissions tracking by project and life cycle stage';
COMMENT ON TABLE carbon_budget IS 'Carbon budget targets and status for projects';
COMMENT ON TABLE carbon_reports IS 'Generated EN 15978 carbon reports and compliance documentation';
COMMENT ON TABLE document_templates IS 'Template library for European construction standards';
COMMENT ON TABLE generated_reports IS 'All generated reports from templates';
COMMENT ON TABLE template_customizations IS 'Client-specific template customizations';
COMMENT ON TABLE report_automation IS 'Automated report generation schedules';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
