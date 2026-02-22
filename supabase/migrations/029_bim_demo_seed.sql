-- Seed: Demo BIM data for construction teaser
-- Purpose: Realistic Finnish construction project data so the pipeline
--          returns believable numbers from Day 1. Based on a ~12,000 m²
--          mixed-use office building in Helsinki (loosely modeled on
--          typical NCC/YIT projects reported to CSRD).
--
-- Run AFTER 028_bim_pipeline.sql

-- ============================================================
-- 1. Emission Factors (Finnish defaults from CO2data.fi / ecoinvent)
-- ============================================================
INSERT INTO emission_factors (material, category, kg_co2e_per_kg, kg_co2e_per_m3, data_source, country) VALUES
    ('concrete_c30_37',     'structural',  0.130,  312.00,  'co2data.fi',  'FI'),
    ('concrete_c50_60',     'structural',  0.160,  384.00,  'co2data.fi',  'FI'),
    ('reinforcing_steel',   'structural',  1.990,  NULL,    'ecoinvent',   'FI'),
    ('structural_steel',    'structural',  2.450,  NULL,    'ecoinvent',   'FI'),
    ('clt_timber',          'structural',  -0.550, -247.50, 'co2data.fi',  'FI'),  -- negative = carbon sequestration
    ('glulam',              'structural',  -0.480, -216.00, 'co2data.fi',  'FI'),
    ('flat_glass',          'envelope',    1.200,  NULL,    'ecoinvent',   'FI'),
    ('mineral_wool',        'envelope',    1.050,  42.00,   'ecoinvent',   'FI'),
    ('aluminium_facade',    'envelope',    8.240,  NULL,    'ecoinvent',   'FI'),
    ('gypsum_board',        'finishes',    0.390,  NULL,    'ecoinvent',   'FI'),
    ('ceramic_tiles',       'finishes',    0.780,  NULL,    'ecoinvent',   'FI'),
    ('copper_pipes',        'MEP',         3.810,  NULL,    'ecoinvent',   'FI'),
    ('pvc_pipes',           'MEP',         2.410,  NULL,    'ecoinvent',   'FI'),
    ('bitumen_waterproof',  'envelope',    0.490,  NULL,    'ecoinvent',   'FI')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. Demo BIM Project — Helsinki Kalasatama Office Tower
-- ============================================================
INSERT INTO bim_projects (
    id, project_name, project_code, country, location,
    bim_file_url, file_format, gross_floor_area_m2, building_type, status,
    extraction_data
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Kalasatama Office Tower',
    'PRJ-KOT-2026',
    'FI',
    'Helsinki, Kalasatama',
    'https://demo-bim.dws6.com/kalasatama-office-tower.ifc',
    'ifc',
    12400.00,
    'commercial',
    'extracted',
    '{
        "ifc_schema": "IFC4",
        "building_storeys": 8,
        "elements": {
            "IfcWall": 342,
            "IfcSlab": 96,
            "IfcColumn": 128,
            "IfcBeam": 216,
            "IfcWindow": 480,
            "IfcDoor": 164,
            "IfcStair": 16,
            "IfcRoof": 4,
            "IfcCurtainWall": 48
        },
        "total_elements": 1494,
        "materials_summary": {
            "concrete_c30_37": {"volume_m3": 2840, "mass_kg": 6816000},
            "concrete_c50_60": {"volume_m3": 620, "mass_kg": 1488000},
            "reinforcing_steel": {"mass_kg": 186000},
            "structural_steel": {"mass_kg": 94000},
            "clt_timber": {"volume_m3": 180, "mass_kg": 81000},
            "flat_glass": {"mass_kg": 48000},
            "mineral_wool": {"volume_m3": 960, "mass_kg": 38400},
            "aluminium_facade": {"mass_kg": 12000},
            "gypsum_board": {"mass_kg": 64000}
        },
        "site_area_m2": 3200,
        "building_height_m": 32.5,
        "structural_system": "hybrid_concrete_timber",
        "energy_class": "A"
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Carbon Calculations — realistic EN 15978 numbers
-- ============================================================
-- Based on Finnish carbon footprint benchmarks:
-- Commercial buildings: ~350-500 kg CO2e/m² (A1-A5 + B6 + C1-C4)
-- This project: ~420 kg CO2e/m² (hybrid concrete-timber = better than pure concrete)

INSERT INTO carbon_calculations (
    bim_project_id,
    a1_raw_materials, a2_transport, a3_manufacturing,
    a4_transport_to_site, a5_construction,
    b1_use, b2_maintenance, b3_repair, b4_replacement, b5_refurbishment,
    b6_operational_energy, b7_operational_water,
    c1_deconstruction, c2_transport_eol, c3_waste_processing, c4_disposal,
    d_reuse_recovery,
    kg_co2e_per_m2,
    csrd_status, ets_status, cbam_status, fit55_score,
    materials_breakdown,
    calculation_method
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    -- A: Product + Construction stage
    1842600.00,   -- A1: Raw materials (concrete 1258k + steel 600k + timber -44k + glass 58k + etc)
    148200.00,    -- A2: Transport to factory
    312000.00,    -- A3: Manufacturing
    86400.00,     -- A4: Transport to site (Helsinki local)
    124000.00,    -- A5: Construction process
    -- B: Use stage (50-year reference period)
    18600.00,     -- B1: Use
    186000.00,    -- B2: Maintenance
    62000.00,     -- B3: Repair
    248000.00,    -- B4: Replacement (windows, HVAC at year 25)
    0.00,         -- B5: Refurbishment
    1488000.00,   -- B6: Operational energy (district heating Helsinki, energy class A)
    24800.00,     -- B7: Operational water
    -- C: End of life
    62000.00,     -- C1: Deconstruction
    37200.00,     -- C2: Transport (EOL)
    124000.00,    -- C3: Waste processing
    86400.00,     -- C4: Disposal
    -- D: Beyond system boundary
    -186000.00,   -- D: Reuse/recovery (timber + steel recycling credits)
    -- Normalised
    420.18,       -- kg CO2e per m² (total / 12400)
    -- Compliance
    'compliant',  -- CSRD: full lifecycle disclosure
    'compliant',  -- ETS: building sector not directly in ETS but materials sourcing compliant
    'pending',    -- CBAM: steel import verification pending
    78.50,        -- Fit for 55 score (good but not perfect — timber hybrid helps)
    -- Material breakdown
    '[
        {"material": "Concrete C30/37", "kg_co2e": 886320, "percentage": 17.0},
        {"material": "Concrete C50/60", "kg_co2e": 238080, "percentage": 4.6},
        {"material": "Reinforcing steel", "kg_co2e": 370140, "percentage": 7.1},
        {"material": "Structural steel", "kg_co2e": 230300, "percentage": 4.4},
        {"material": "CLT timber", "kg_co2e": -44550, "percentage": -0.9},
        {"material": "Flat glass", "kg_co2e": 57600, "percentage": 1.1},
        {"material": "Mineral wool", "kg_co2e": 40320, "percentage": 0.8},
        {"material": "Aluminium facade", "kg_co2e": 98880, "percentage": 1.9},
        {"material": "Other", "kg_co2e": 3287110, "percentage": 63.1}
    ]'::jsonb,
    'en15978'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. Situation Room Report — pre-populated so dashboard renders
-- ============================================================
INSERT INTO situation_room_reports (
    project_id, report_type, title, status,
    total_kg_co2e, fit55_score, compliance_rag, country,
    pipeline_workflow_id,
    payload
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'bim-carbon',
    'Kalasatama Office Tower — BIM Carbon Assessment',
    'active',
    5208200.00,
    78.50,
    'amber',
    'FI',
    'bim_carbon_demo_seed',
    '{
        "project_name": "Kalasatama Office Tower",
        "project_code": "PRJ-KOT-2026",
        "location": "Helsinki, Kalasatama",
        "gross_floor_area_m2": 12400,
        "building_storeys": 8,
        "structural_system": "hybrid_concrete_timber",
        "energy_class": "A",
        "total_kg_co2e": 5208200,
        "kg_co2e_per_m2": 420.18,
        "compliance": {
            "csrd": "compliant",
            "ets": "compliant",
            "cbam": "pending",
            "fit55_score": 78.5
        },
        "top_contributors": [
            {"stage": "A1", "label": "Raw materials", "kg_co2e": 1842600, "pct": 35.4},
            {"stage": "B6", "label": "Operational energy", "kg_co2e": 1488000, "pct": 28.6},
            {"stage": "A3", "label": "Manufacturing", "kg_co2e": 312000, "pct": 6.0},
            {"stage": "B4", "label": "Replacement", "kg_co2e": 248000, "pct": 4.8}
        ],
        "recommendations": [
            "Switch remaining C50/60 concrete to low-carbon alternative (potential -15% on A1)",
            "Verify CBAM declarations for imported reinforcing steel",
            "Consider ground-source heat pump to reduce B6 operational energy by ~30%",
            "Increase CLT usage in upper floors — current hybrid design already saves ~44 tonnes CO2e"
        ],
        "pipeline_version": "2.0.0",
        "calculated_at": "2026-02-15T12:00:00Z"
    }'::jsonb
) ON CONFLICT DO NOTHING;
