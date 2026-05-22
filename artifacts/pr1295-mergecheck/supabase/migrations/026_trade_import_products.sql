-- ============================================================================
-- Migration 026: Trade Import Products
-- Philippine climate & food product imports to EU
-- ============================================================================

-- Enums
CREATE TYPE trade_product_category AS ENUM (
  'food', 'climate_material', 'sustainable_fiber', 'circular_economy'
);

CREATE TYPE trade_product_status AS ENUM (
  'draft', 'active', 'suspended', 'discontinued'
);

CREATE TYPE import_compliance_status AS ENUM (
  'not_assessed', 'compliant', 'pending_review', 'non_compliant'
);

CREATE TYPE tariff_scheme AS ENUM (
  'gsp_plus', 'mfn', 'fta', 'zero'
);

CREATE TYPE cbam_status AS ENUM (
  'not_applicable', 'monitoring', 'reporting_required', 'declaration_filed'
);

CREATE TYPE carbon_impact_rating AS ENUM (
  'carbon_negative', 'low', 'medium', 'high'
);

CREATE TYPE shipment_status AS ENUM (
  'planned', 'in_transit', 'at_customs', 'cleared', 'delivered', 'rejected'
);

CREATE TYPE transport_mode AS ENUM (
  'sea', 'air', 'rail', 'road'
);

CREATE TYPE supplier_status AS ENUM (
  'active', 'pending_audit', 'suspended'
);

-- ============================================================================
-- Trade Suppliers
-- ============================================================================

CREATE TABLE trade_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(2) NOT NULL,
  region VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  certifications TEXT[] DEFAULT '{}',
  sustainability_score DECIMAL(3,1),
  last_audit_date DATE,
  status supplier_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Trade Products
-- ============================================================================

CREATE TABLE trade_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category trade_product_category NOT NULL,
  status trade_product_status NOT NULL DEFAULT 'draft',

  -- Origin
  origin_country VARCHAR(2) NOT NULL,
  origin_region VARCHAR(255),
  supplier_id UUID REFERENCES trade_suppliers(id),
  supplier_certifications TEXT[] DEFAULT '{}',

  -- Trade classification
  hs_code VARCHAR(20) NOT NULL,
  cn_code VARCHAR(20),
  taric_code VARCHAR(20),

  -- Tariff & pricing
  tariff_scheme tariff_scheme NOT NULL DEFAULT 'mfn',
  tariff_rate DECIMAL(6,2) NOT NULL DEFAULT 0,
  mfn_tariff_rate DECIMAL(6,2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  unit VARCHAR(20) NOT NULL,

  -- Carbon & climate
  carbon_footprint_kg_co2e_per_unit DECIMAL(8,3) NOT NULL DEFAULT 0,
  carbon_impact_rating carbon_impact_rating NOT NULL DEFAULT 'medium',
  cbam_status cbam_status NOT NULL DEFAULT 'not_applicable',
  lifecycle_stages JSONB,
  climate_notes TEXT,

  -- EU compliance (stored as JSONB for flexibility)
  import_compliance_status import_compliance_status NOT NULL DEFAULT 'not_assessed',
  gsp_plus_eligible BOOLEAN DEFAULT false,
  eu_deforestation_regulation BOOLEAN DEFAULT false,
  eu_organic_certified BOOLEAN DEFAULT false,
  eu_organic_cert_body VARCHAR(255),
  reach_compliant BOOLEAN,
  required_documents TEXT[] DEFAULT '{}',
  compliance_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Import Shipments
-- ============================================================================

CREATE TABLE import_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number VARCHAR(50) NOT NULL UNIQUE,
  product_id UUID NOT NULL REFERENCES trade_products(id),
  supplier_id UUID REFERENCES trade_suppliers(id),
  quantity DECIMAL(12,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  total_weight_kg DECIMAL(12,2) NOT NULL,

  -- Logistics
  origin_port VARCHAR(255) NOT NULL,
  destination_port VARCHAR(255) NOT NULL,
  shipping_line VARCHAR(255),
  container_number VARCHAR(20),
  estimated_departure_date DATE,
  estimated_arrival_date DATE,
  actual_arrival_date DATE,

  -- Costs
  fob_value_eur DECIMAL(12,2) NOT NULL,
  cif_value_eur DECIMAL(12,2) NOT NULL,
  duty_amount_eur DECIMAL(12,2) DEFAULT 0,
  vat_amount_eur DECIMAL(12,2),

  -- Carbon tracking
  transport_co2e_kg DECIMAL(10,2) DEFAULT 0,
  transport_mode transport_mode NOT NULL DEFAULT 'sea',
  transport_distance_km DECIMAL(10,0) DEFAULT 0,

  -- Status & declarations
  status shipment_status NOT NULL DEFAULT 'planned',
  customs_declaration_number VARCHAR(50),
  cbam_declaration_id VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_trade_products_category ON trade_products(category);
CREATE INDEX idx_trade_products_origin ON trade_products(origin_country);
CREATE INDEX idx_trade_products_hs_code ON trade_products(hs_code);
CREATE INDEX idx_trade_products_carbon_rating ON trade_products(carbon_impact_rating);
CREATE INDEX idx_trade_products_status ON trade_products(status);

CREATE INDEX idx_import_shipments_product ON import_shipments(product_id);
CREATE INDEX idx_import_shipments_status ON import_shipments(status);
CREATE INDEX idx_import_shipments_arrival ON import_shipments(estimated_arrival_date);

CREATE INDEX idx_trade_suppliers_country ON trade_suppliers(country);

-- ============================================================================
-- Updated_at triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_trade_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_trade_products_updated_at
  BEFORE UPDATE ON trade_products
  FOR EACH ROW EXECUTE FUNCTION update_trade_updated_at();

CREATE TRIGGER trg_import_shipments_updated_at
  BEFORE UPDATE ON import_shipments
  FOR EACH ROW EXECUTE FUNCTION update_trade_updated_at();

CREATE TRIGGER trg_trade_suppliers_updated_at
  BEFORE UPDATE ON trade_suppliers
  FOR EACH ROW EXECUTE FUNCTION update_trade_updated_at();

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE trade_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_suppliers ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY trade_products_service_all ON trade_products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY import_shipments_service_all ON import_shipments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY trade_suppliers_service_all ON trade_suppliers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users can read
CREATE POLICY trade_products_auth_read ON trade_products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY import_shipments_auth_read ON import_shipments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY trade_suppliers_auth_read ON trade_suppliers
  FOR SELECT TO authenticated USING (true);
