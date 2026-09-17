-- Migration 080: LWM ontology — 25 industries + European enterprise registry
-- (renumbered from the original 070 draft — main's 070 slot was taken by
-- 070_web_leads.sql by the time this PR merged)
--
-- Purpose:
--   Persists the "25 industries x ~200 enterprises" company list (the source
--   that feeds the LWM V1 sovereign training cascade, Stage 2) into the
--   database so agents, CI lints, edge functions, and frontends can query it
--   instead of parsing JSON/markdown.
--
--   Canonical taxonomy: ontology/enterprises/enterprise-registry.json (v2.1,
--   "revised manufacturing taxonomy"). This migration mirrors that registry.
--
-- Tables:
--   ontology_industries   — the 25-industry taxonomy (id, slug, name, target)
--   ontology_enterprises  — enterprises, FK to ontology_industries
--
-- Data completeness (FAIL-LOUD note — Rule 12):
--   The registry target is 200 enterprises/industry = 5,000 total. This seed
--   loads the VERIFIED CORE only: the leading, real, checkable European
--   enterprises per industry (~20-26 each, ~560 rows). It does NOT fabricate
--   rows to reach 200/industry — that gap is closed by the Orbis/Eurostat/CBAM
--   data pipeline described in docs/plans/2026-06-22-lwm-ontology-v1-500-
--   enterprises.md (Stage 1). Industry 8 (Power Generation & Nuclear) carries
--   full financials sourced from ontology/.../01-power-heat-generation.json;
--   all other rows seed the high-confidence fields (name + hq_country) and
--   leave revenue_eur_m / employees NULL for pipeline backfill.
--   Per-industry progress is tracked in ontology_industries.seeded_count vs
--   target_count so the shortfall is visible in-band, never hidden.
--
-- RLS posture:
--   anon            — SELECT only (public reference data: company names + HQ).
--   service_role    — full access (pipeline backfill, agent writes).
--
-- Sovereignty:
--   Target the Tier-1 sovereign Supabase instance (Aiven Helsinki / Scaleway
--   Paris). Verify SUPABASE_URL before applying in prod.
--
-- Additive only — no destructive changes; reversible by DROP TABLE.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- ============================================================
-- ontology_industries
-- ============================================================
CREATE TABLE IF NOT EXISTS ontology_industries (
  id            int PRIMARY KEY,                 -- matches registry industry id 1..25
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  target_count  int  NOT NULL DEFAULT 200,
  seeded_count  int  NOT NULL DEFAULT 0,         -- maintained by trigger below
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE ontology_industries IS
  'The 25-industry LWM taxonomy. Mirror of ontology/enterprises/enterprise-registry.json v2.1.';

-- ============================================================
-- ontology_enterprises
-- ============================================================
CREATE TABLE IF NOT EXISTS ontology_enterprises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id   int  NOT NULL REFERENCES ontology_industries(id) ON DELETE CASCADE,
  name          text NOT NULL,
  hq_country    text,                            -- ISO-3166 alpha-2 (e.g. 'DE')
  revenue_eur_m numeric,                         -- NULL until pipeline backfill
  employees     int,                             -- NULL until pipeline backfill
  eu_countries        text[] NOT NULL DEFAULT '{}',
  regulatory_exposure text[] NOT NULL DEFAULT '{}',
  csrd_reporting boolean,
  verified      boolean NOT NULL DEFAULT true,   -- false = synthetic/needs review
  source        text NOT NULL DEFAULT 'seed-080',
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (industry_id, name)
);

CREATE INDEX IF NOT EXISTS idx_ontology_enterprises_industry
  ON ontology_enterprises (industry_id);

CREATE INDEX IF NOT EXISTS idx_ontology_enterprises_country
  ON ontology_enterprises (hq_country);

COMMENT ON TABLE ontology_enterprises IS
  'European enterprises per industry. Verified core seeded in 080; remainder backfilled by Orbis/Eurostat pipeline.';

-- ============================================================
-- seeded_count maintenance (keeps the shortfall visible in-band)
-- ============================================================
CREATE OR REPLACE FUNCTION ontology_refresh_seeded_count()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE ontology_industries i
     SET seeded_count = (
       SELECT count(*) FROM ontology_enterprises e WHERE e.industry_id = i.id
     )
   WHERE i.id = COALESCE(NEW.industry_id, OLD.industry_id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_ontology_refresh_seeded_count ON ontology_enterprises;
CREATE TRIGGER trg_ontology_refresh_seeded_count
  AFTER INSERT OR DELETE OR UPDATE OF industry_id ON ontology_enterprises
  FOR EACH ROW EXECUTE FUNCTION ontology_refresh_seeded_count();

-- ============================================================
-- Seed: industries (registry v2.1 manufacturing taxonomy)
-- ============================================================
INSERT INTO ontology_industries (id, slug, name) VALUES
  (1,  'steel-metallurgy',                'Steel & Metallurgy'),
  (2,  'forestry-pulp-paper',             'Forestry, Pulp & Paper'),
  (3,  'automotive-heavy-transport',      'Automotive & Heavy Transport Manufacturing'),
  (4,  'aerospace-defence',               'Aerospace & Defence'),
  (5,  'chemical-processing',             'Chemical Processing'),
  (6,  'pharma-bio-manufacturing',        'Pharmaceutical & Bio-Manufacturing'),
  (7,  'maritime-shipbuilding',           'Maritime & Shipbuilding'),
  (8,  'power-generation-nuclear',        'Power Generation & Nuclear'),
  (9,  'renewable-energy-infra',          'Renewable Energy Infrastructure'),
  (10, 'mining-mineral-extraction',       'Mining & Mineral Extraction'),
  (11, 'industrial-automation-robotics',  'Industrial Automation & Robotics'),
  (12, 'construction-civil-infra',        'Construction & Civil Infrastructure'),
  (13, 'food-beverage-manufacturing',     'Food & Beverage Manufacturing'),
  (14, 'glass-ceramics-building-materials','Glass, Ceramics & Building Materials'),
  (15, 'electronics-semiconductor-fab',   'Electronics & Semiconductor Fabrication'),
  (16, 'oil-gas-refining',                'Oil & Gas Refining'),
  (17, 'textiles-industrial-fabrics',     'Textiles & Industrial Fabrics'),
  (18, 'water-treatment-waste-mgmt',      'Water Treatment & Waste Management'),
  (19, 'agricultural-machinery-mfg',      'Agricultural Machinery Manufacturing'),
  (20, 'telecom-infrastructure',          'Telecom Infrastructure'),
  (21, 'medical-devices-mfg',             'Medical Devices Manufacturing'),
  (22, 'high-speed-rail-transport',       'High-Speed Rail & Transport Infrastructure'),
  (23, 'datacenter-infra-thermal',        'Datacenter Infrastructure & Thermal Management'),
  (24, 'battery-energy-storage-mfg',      'Battery & Energy Storage Cell Manufacturing'),
  (25, 'marine-offshore-subsea',          'Marine & Offshore Subsea Engineering')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: enterprises (verified core). hq_country = ISO alpha-2.
-- ============================================================

-- 1. Steel & Metallurgy
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (1,'ArcelorMittal','LU'),(1,'Thyssenkrupp','DE'),(1,'Salzgitter','DE'),
  (1,'Voestalpine','AT'),(1,'SSAB','SE'),(1,'Tata Steel Nederland','NL'),
  (1,'Acerinox','ES'),(1,'Aperam','LU'),(1,'Outokumpu','FI'),
  (1,'Celsa Group','ES'),(1,'Marcegaglia','IT'),(1,'Riva Group','IT'),
  (1,'Liberty Steel Group','GB'),(1,'British Steel','GB'),(1,'Stahl-Holding-Saar (SHS)','DE'),
  (1,'Ovako','SE'),(1,'Feralpi Group','IT'),(1,'Ferriere Nord','IT'),
  (1,'Sidenor','ES'),(1,'Georgsmarienhütte','DE'),(1,'NLMK Europe','BE'),
  (1,'Megasa','ES'),(1,'Saarstahl','DE')
ON CONFLICT DO NOTHING;

-- 2. Forestry, Pulp & Paper
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (2,'Stora Enso','FI'),(2,'UPM-Kymmene','FI'),(2,'Metsä Group','FI'),
  (2,'Smurfit WestRock','IE'),(2,'Mondi','GB'),(2,'Sappi Europe','NL'),
  (2,'Holmen','SE'),(2,'Billerud','SE'),(2,'Norske Skog','NO'),
  (2,'Navigator Company','PT'),(2,'Burgo Group','IT'),(2,'SCA (Svenska Cellulosa)','SE'),
  (2,'Essity','SE'),(2,'Koehler Group','DE'),(2,'Sofidel','IT'),
  (2,'Ahlstrom','FI'),(2,'Progroup','DE'),(2,'Prinzhorn Group','AT'),
  (2,'Lecta','ES'),(2,'Metsä Board','FI'),(2,'DS Smith','GB')
ON CONFLICT DO NOTHING;

-- 3. Automotive & Heavy Transport Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (3,'Volkswagen Group','DE'),(3,'Mercedes-Benz Group','DE'),(3,'BMW Group','DE'),
  (3,'Stellantis','NL'),(3,'Renault Group','FR'),(3,'Volvo Cars','SE'),
  (3,'AB Volvo','SE'),(3,'Daimler Truck','DE'),(3,'Traton Group','DE'),
  (3,'Scania','SE'),(3,'Iveco Group','IT'),(3,'CNH Industrial','NL'),
  (3,'Porsche AG','DE'),(3,'Ferrari','IT'),(3,'Robert Bosch','DE'),
  (3,'Continental','DE'),(3,'ZF Friedrichshafen','DE'),(3,'Valeo','FR'),
  (3,'Forvia','FR'),(3,'Schaeffler','DE'),(3,'Brembo','IT'),
  (3,'Pirelli','IT'),(3,'Michelin','FR'),(3,'OPmobility','FR')
ON CONFLICT DO NOTHING;

-- 4. Aerospace & Defence
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (4,'Airbus','FR'),(4,'Safran','FR'),(4,'Thales','FR'),
  (4,'Leonardo','IT'),(4,'BAE Systems','GB'),(4,'Rolls-Royce Holdings','GB'),
  (4,'Dassault Aviation','FR'),(4,'Saab','SE'),(4,'Rheinmetall','DE'),
  (4,'MTU Aero Engines','DE'),(4,'Hensoldt','DE'),(4,'KNDS','FR'),
  (4,'Diehl Defence','DE'),(4,'Naval Group','FR'),(4,'thyssenkrupp Marine Systems','DE'),
  (4,'Kongsberg Gruppen','NO'),(4,'Indra Sistemas','ES'),(4,'Babcock International','GB'),
  (4,'QinetiQ','GB'),(4,'Patria','FI'),(4,'Nammo','NO'),
  (4,'MBDA','FR'),(4,'Fincantieri','IT')
ON CONFLICT DO NOTHING;

-- 5. Chemical Processing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (5,'BASF','DE'),(5,'Bayer','DE'),(5,'Covestro','DE'),
  (5,'Evonik Industries','DE'),(5,'Lanxess','DE'),(5,'Linde','DE'),
  (5,'Air Liquide','FR'),(5,'Solvay','BE'),(5,'Syensqo','BE'),
  (5,'Arkema','FR'),(5,'AkzoNobel','NL'),(5,'DSM-Firmenich','NL'),
  (5,'INEOS','GB'),(5,'LyondellBasell','NL'),(5,'Wacker Chemie','DE'),
  (5,'Clariant','CH'),(5,'Sika','CH'),(5,'Yara International','NO'),
  (5,'OCI Global','NL'),(5,'Borealis','AT'),(5,'Versalis (Eni)','IT'),
  (5,'Symrise','DE'),(5,'Brenntag','DE')
ON CONFLICT DO NOTHING;

-- 6. Pharmaceutical & Bio-Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (6,'Novo Nordisk','DK'),(6,'Roche','CH'),(6,'Novartis','CH'),
  (6,'Sanofi','FR'),(6,'GSK','GB'),(6,'AstraZeneca','GB'),
  (6,'Boehringer Ingelheim','DE'),(6,'Merck KGaA','DE'),(6,'Lonza','CH'),
  (6,'Novonesis','DK'),(6,'Grifols','ES'),(6,'Ipsen','FR'),
  (6,'Servier','FR'),(6,'UCB','BE'),(6,'Galapagos','BE'),
  (6,'Orion','FI'),(6,'Recordati','IT'),(6,'Chiesi Farmaceutici','IT'),
  (6,'Menarini','IT'),(6,'Almirall','ES'),(6,'Fresenius Kabi','DE'),
  (6,'STADA Arzneimittel','DE'),(6,'Krka','SI'),(6,'Gedeon Richter','HU'),
  (6,'H. Lundbeck','DK'),(6,'Genmab','DK')
ON CONFLICT DO NOTHING;

-- 7. Maritime & Shipbuilding
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (7,'A.P. Moller-Maersk','DK'),(7,'Hapag-Lloyd','DE'),(7,'CMA CGM','FR'),
  (7,'Fincantieri','IT'),(7,'Chantiers de l''Atlantique','FR'),(7,'Meyer Werft','DE'),
  (7,'Damen Shipyards','NL'),(7,'Naval Group','FR'),(7,'Wärtsilä','FI'),
  (7,'Cargotec','FI'),(7,'Kongsberg Maritime','NO'),(7,'Royal IHC','NL'),
  (7,'Navantia','ES'),(7,'Ulstein Group','NO'),(7,'Vard','NO'),
  (7,'DFDS','DK'),(7,'Grimaldi Group','IT'),(7,'Stena AB','SE'),
  (7,'Color Line','NO'),(7,'Wallenius Wilhelmsen','NO'),(7,'DNV','NO'),
  (7,'Bureau Veritas','FR')
ON CONFLICT DO NOTHING;

-- 8. Power Generation & Nuclear (full financials from per-industry JSON)
INSERT INTO ontology_enterprises
  (industry_id, name, hq_country, revenue_eur_m, employees, eu_countries, regulatory_exposure, csrd_reporting) VALUES
  (8,'EDF (Electricite de France)','FR',113300,175000,'{FR,GB,IT,BE}','{ETS,CSRD,RED III,EED}',true),
  (8,'E.ON SE','DE',89000,72000,'{DE,GB,SE,HU,CZ,RO,NL,IT}','{ETS,CSRD,RED III,EED}',true),
  (8,'Enel SpA','IT',73000,61000,'{IT,ES,RO,GR}','{ETS,CSRD,RED III,EED}',true),
  (8,'ENGIE SA','FR',71900,98000,'{FR,BE,NL,DE,IT,ES,PT,RO,CZ}','{ETS,CBAM,CSRD,RED III,EED}',true),
  (8,'Uniper SE','DE',70000,7000,'{DE,NL,SE,GB,HU}','{ETS,CBAM,CSRD,RED III,EED}',true),
  (8,'Iberdrola SA','ES',46000,42000,'{ES,GB,PT,DE,FR,GR,IT}','{ETS,CSRD,RED III,EED}',true),
  (8,'EnBW Energie Baden-Wurttemberg AG','DE',38600,31500,'{DE}','{ETS,CSRD,RED III,EED}',true),
  (8,'Endesa SA','ES',26000,9000,'{ES,PT}','{ETS,CSRD,RED III,EED}',true),
  (8,'RWE AG','DE',24000,21000,'{DE,NL,GB,PL,IE}','{ETS,CBAM,CSRD,RED III,EED}',true),
  (8,'Vattenfall AB','SE',21000,21000,'{SE,DE,NL,DK,GB,FI}','{ETS,CSRD,RED III,EED}',true),
  (8,'EDP - Energias de Portugal SA','PT',17300,12000,'{PT,ES,PL,RO,IT,FR,BE}','{ETS,CSRD,RED III,EED}',true),
  (8,'National Grid plc','GB',24000,31700,'{GB}','{ETS,CSRD}',true),
  (8,'CEZ Group','CZ',14500,33600,'{CZ,DE,HU,PL,RO,SK,BG}','{ETS,CBAM,CSRD,RED III,EED}',true),
  (8,'SSE plc','GB',15500,15800,'{GB,IE}','{ETS,CSRD,RED III,EED}',true),
  (8,'PGE Polska Grupa Energetyczna SA','PL',14000,42000,'{PL}','{ETS,CBAM,CSRD,RED III,EED}',true),
  (8,'Fortum Oyj','FI',5400,5200,'{FI,SE,NO,DK}','{ETS,CSRD,RED III,EED}',true),
  (8,'Orsted A/S','DK',9800,8000,'{DK,DE,GB,NL,IE}','{ETS,CSRD,RED III}',true),
  (8,'Verbund AG','AT',8000,4400,'{AT,DE}','{ETS,CSRD,RED III,EED}',true),
  (8,'Statkraft AS','NO',7500,7000,'{NO,SE,DE,GB,IE,FI,NL,FR,ES,IT}','{ETS,CSRD,RED III}',true),
  (8,'TotalEnergies SE (Power & Renewables)','FR',165000,100000,'{FR,BE,DE,GB,NL,ES,IT}','{ETS,CBAM,CSRD,RED III,EED}',true)
ON CONFLICT DO NOTHING;

-- 9. Renewable Energy Infrastructure
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (9,'Orsted','DK'),(9,'Vestas Wind Systems','DK'),(9,'Siemens Energy','DE'),
  (9,'Siemens Gamesa','ES'),(9,'Nordex','DE'),(9,'EDP Renováveis','ES'),
  (9,'Enel Green Power','IT'),(9,'Acciona Energía','ES'),(9,'Neoen','FR'),
  (9,'Encavis','DE'),(9,'Energiekontor','DE'),(9,'ABO Energy','DE'),
  (9,'PNE','DE'),(9,'BayWa r.e.','DE'),(9,'Voltalia','FR'),
  (9,'Scatec','NO'),(9,'Eni Plenitude','IT'),(9,'Meyer Burger','CH'),
  (9,'Corio Generation','GB'),(9,'Ocean Winds','PT'),(9,'RWE Renewables','DE')
ON CONFLICT DO NOTHING;

-- 10. Mining & Mineral Extraction
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (10,'Glencore','CH'),(10,'Anglo American','GB'),(10,'Rio Tinto','GB'),
  (10,'Boliden','SE'),(10,'KGHM Polska Miedź','PL'),(10,'LKAB','SE'),
  (10,'Eramet','FR'),(10,'Lundin Mining','SE'),(10,'Imerys','FR'),
  (10,'Terrafame','FI'),(10,'Vulcan Energy Resources','DE'),(10,'Keliber','FI'),
  (10,'European Lithium','AT'),(10,'Sotkamo Silver','SE'),(10,'Almonty Industries','GB'),
  (10,'Sandvik','SE'),(10,'Epiroc','SE'),(10,'Metso','FI'),
  (10,'Zinkgruvan Mining','SE'),(10,'Euromax Resources','BE')
ON CONFLICT DO NOTHING;

-- 11. Industrial Automation & Robotics
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (11,'Siemens','DE'),(11,'ABB','CH'),(11,'Schneider Electric','FR'),
  (11,'KUKA','DE'),(11,'Bosch Rexroth','DE'),(11,'Festo','DE'),
  (11,'SICK','DE'),(11,'Beckhoff Automation','DE'),(11,'Pilz','DE'),
  (11,'Comau','IT'),(11,'Dürr','DE'),(11,'Stäubli','CH'),
  (11,'Pepperl+Fuchs','DE'),(11,'WAGO','DE'),(11,'Phoenix Contact','DE'),
  (11,'Endress+Hauser','CH'),(11,'Datalogic','IT'),(11,'Universal Robots','DK'),
  (11,'Mobile Industrial Robots','DK'),(11,'Trumpf','DE'),(11,'DMG Mori','DE'),
  (11,'Krones','DE')
ON CONFLICT DO NOTHING;

-- 12. Construction & Civil Infrastructure
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (12,'Vinci','FR'),(12,'Bouygues','FR'),(12,'Eiffage','FR'),
  (12,'ACS Group','ES'),(12,'Ferrovial','NL'),(12,'Acciona','ES'),
  (12,'Hochtief','DE'),(12,'Strabag','AT'),(12,'Skanska','SE'),
  (12,'Bilfinger','DE'),(12,'NCC','SE'),(12,'Peab','SE'),
  (12,'Webuild','IT'),(12,'Royal BAM Group','NL'),(12,'Heijmans','NL'),
  (12,'Balfour Beatty','GB'),(12,'Kier Group','GB'),(12,'Implenia','CH'),
  (12,'Porr','AT'),(12,'FCC Construcción','ES'),(12,'Sacyr','ES'),
  (12,'OHLA','ES'),(12,'YIT','FI'),(12,'Colas','FR')
ON CONFLICT DO NOTHING;

-- 13. Food & Beverage Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (13,'Nestlé','CH'),(13,'Unilever','GB'),(13,'Danone','FR'),
  (13,'Anheuser-Busch InBev','BE'),(13,'Heineken','NL'),(13,'Carlsberg Group','DK'),
  (13,'Diageo','GB'),(13,'Pernod Ricard','FR'),(13,'Lactalis','FR'),
  (13,'Danish Crown','DK'),(13,'Arla Foods','DK'),(13,'FrieslandCampina','NL'),
  (13,'Ferrero','IT'),(13,'Barilla','IT'),(13,'Associated British Foods','GB'),
  (13,'Südzucker','DE'),(13,'Nomad Foods','GB'),(13,'Oatly','SE'),
  (13,'Valio','FI'),(13,'Orkla','NO'),(13,'Vion Food Group','NL'),
  (13,'Tate & Lyle','GB')
ON CONFLICT DO NOTHING;

-- 14. Glass, Ceramics & Building Materials
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (14,'Saint-Gobain','FR'),(14,'Holcim','CH'),(14,'Heidelberg Materials','DE'),
  (14,'CRH','IE'),(14,'Buzzi','IT'),(14,'Vicat','FR'),
  (14,'Schott','DE'),(14,'NSG Group (Pilkington)','GB'),(14,'Vetropack','CH'),
  (14,'Verallia','FR'),(14,'Ardagh Group','LU'),(14,'Wienerberger','AT'),
  (14,'Rockwool','DK'),(14,'Knauf','DE'),(14,'Kingspan Group','IE'),
  (14,'Etex','BE'),(14,'Villeroy & Boch','DE'),(14,'Mapei','IT'),
  (14,'Forterra','GB'),(14,'Ibstock','GB'),(14,'Owens-Illinois Europe','IT')
ON CONFLICT DO NOTHING;

-- 15. Electronics & Semiconductor Fabrication
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (15,'ASML','NL'),(15,'Infineon Technologies','DE'),(15,'STMicroelectronics','CH'),
  (15,'NXP Semiconductors','NL'),(15,'ASM International','NL'),(15,'BE Semiconductor (Besi)','NL'),
  (15,'Soitec','FR'),(15,'X-Fab Silicon Foundries','BE'),(15,'Nordic Semiconductor','NO'),
  (15,'ams-OSRAM','AT'),(15,'Melexis','BE'),(15,'Siltronic','DE'),
  (15,'Aixtron','DE'),(15,'Carl Zeiss SMT','DE'),(15,'Elmos Semiconductor','DE'),
  (15,'GlobalFoundries Dresden','DE'),(15,'Bosch Semiconductors','DE'),(15,'SUSS MicroTec','DE'),
  (15,'IQE','GB'),(15,'Nexperia','NL')
ON CONFLICT DO NOTHING;

-- 16. Oil & Gas Refining
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (16,'Shell','GB'),(16,'TotalEnergies','FR'),(16,'BP','GB'),
  (16,'Eni','IT'),(16,'Repsol','ES'),(16,'OMV','AT'),
  (16,'Equinor','NO'),(16,'Galp Energia','PT'),(16,'Neste','FI'),
  (16,'PKN Orlen','PL'),(16,'MOL Group','HU'),(16,'Preem','SE'),
  (16,'Varo Energy','CH'),(16,'Saras','IT'),(16,'Moeve (Cepsa)','ES'),
  (16,'Wintershall Dea','DE'),(16,'HelleniQ Energy','GR'),(16,'Motor Oil Hellas','GR'),
  (16,'Aker BP','NO'),(16,'Rompetrol (KMG)','RO')
ON CONFLICT DO NOTHING;

-- 17. Textiles & Industrial Fabrics
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (17,'Inditex','ES'),(17,'H&M Group','SE'),(17,'adidas','DE'),
  (17,'Puma','DE'),(17,'Hugo Boss','DE'),(17,'Benetton Group','IT'),
  (17,'Marzotto Group','IT'),(17,'Lenzing','AT'),(17,'Freudenberg','DE'),
  (17,'Autoneum','CH'),(17,'Sioen Industries','BE'),(17,'Calzedonia Group','IT'),
  (17,'OVS','IT'),(17,'Fenix Outdoor','SE'),(17,'Amer Sports','FI'),
  (17,'Oerlikon','CH'),(17,'Trützschler','DE'),(17,'Andritz Nonwoven','AT'),
  (17,'Klopman International','IT'),(17,'Carrington Textiles','GB')
ON CONFLICT DO NOTHING;

-- 18. Water Treatment & Waste Management
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (18,'Veolia','FR'),(18,'Suez','FR'),(18,'Saur','FR'),
  (18,'Remondis','DE'),(18,'FCC Environment','ES'),(18,'Urbaser','ES'),
  (18,'Renewi','GB'),(18,'Biffa','GB'),(18,'Séché Environnement','FR'),
  (18,'Paprec Group','FR'),(18,'Indaver','BE'),(18,'Tomra Systems','NO'),
  (18,'Befesa','LU'),(18,'Derichebourg','FR'),(18,'Hera Group','IT'),
  (18,'A2A','IT'),(18,'Iren','IT'),(18,'Aquafin','BE'),
  (18,'Severn Trent','GB'),(18,'United Utilities','GB'),(18,'Pennon Group','GB')
ON CONFLICT DO NOTHING;

-- 19. Agricultural Machinery Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (19,'CNH Industrial','NL'),(19,'CLAAS','DE'),(19,'AGCO/Fendt','DE'),
  (19,'SDF Group (Same Deutz-Fahr)','IT'),(19,'Krone','DE'),(19,'Amazone','DE'),
  (19,'Pöttinger','AT'),(19,'Lemken','DE'),(19,'Kverneland Group','NO'),
  (19,'Väderstad','SE'),(19,'Grimme','DE'),(19,'Horsch','DE'),
  (19,'Kuhn Group','FR'),(19,'Bucher Industries','CH'),(19,'Maschio Gaspardo','IT'),
  (19,'Argo Tractors (Landini)','IT'),(19,'Antonio Carraro','IT'),(19,'Manitou Group','FR'),
  (19,'Merlo','IT'),(19,'JCB','GB')
ON CONFLICT DO NOTHING;

-- 20. Telecom Infrastructure
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (20,'Nokia','FI'),(20,'Ericsson','SE'),(20,'Deutsche Telekom','DE'),
  (20,'Orange','FR'),(20,'Telefónica','ES'),(20,'Vodafone Group','GB'),
  (20,'Telecom Italia (TIM)','IT'),(20,'Telia Company','SE'),(20,'Telenor','NO'),
  (20,'BT Group','GB'),(20,'Swisscom','CH'),(20,'KPN','NL'),
  (20,'Proximus','BE'),(20,'Tele2','SE'),(20,'Elisa','FI'),
  (20,'A1 Telekom Austria','AT'),(20,'Iliad','FR'),(20,'Cellnex Telecom','ES'),
  (20,'Vantage Towers','DE'),(20,'Eutelsat','FR'),(20,'SES','LU')
ON CONFLICT DO NOTHING;

-- 21. Medical Devices Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (21,'Siemens Healthineers','DE'),(21,'Philips','NL'),(21,'Getinge','SE'),
  (21,'Fresenius Medical Care','DE'),(21,'B. Braun','DE'),(21,'Drägerwerk','DE'),
  (21,'Sartorius','DE'),(21,'Straumann','CH'),(21,'Sonova','CH'),
  (21,'Demant','DK'),(21,'Coloplast','DK'),(21,'Ambu','DK'),
  (21,'Carl Zeiss Meditec','DE'),(21,'Smith & Nephew','GB'),(21,'Elekta','SE'),
  (21,'Mölnlycke','SE'),(21,'Ottobock','DE'),(21,'Biotronik','DE'),
  (21,'GN Store Nord','DK'),(21,'Tecan','CH'),(21,'Planmeca','FI')
ON CONFLICT DO NOTHING;

-- 22. High-Speed Rail & Transport Infrastructure
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (22,'Alstom','FR'),(22,'Siemens Mobility','DE'),(22,'Stadler Rail','CH'),
  (22,'CAF','ES'),(22,'Talgo','ES'),(22,'Knorr-Bremse','DE'),
  (22,'Vossloh','DE'),(22,'Hitachi Rail (Europe)','GB'),(22,'Škoda Transportation','CZ'),
  (22,'Voith','DE'),(22,'Plasser & Theurer','AT'),(22,'Colas Rail','FR'),
  (22,'Rhomberg Sersa','AT'),(22,'Strukton','NL'),(22,'Deutsche Bahn','DE'),
  (22,'SNCF','FR'),(22,'Trenitalia (FS)','IT'),(22,'Renfe','ES'),
  (22,'Network Rail','GB'),(22,'Tatravagónka','SK')
ON CONFLICT DO NOTHING;

-- 23. Datacenter Infrastructure & Thermal Management
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (23,'Schneider Electric','FR'),(23,'Legrand','FR'),(23,'Interxion (Digital Realty)','NL'),
  (23,'Data4','FR'),(23,'atNorth','IS'),(23,'Green Mountain','NO'),
  (23,'Bulk Infrastructure','NO'),(23,'EcoDataCenter','SE'),(23,'Northern Data','DE'),
  (23,'Hetzner','DE'),(23,'OVHcloud','FR'),(23,'Scaleway','FR'),
  (23,'Aruba S.p.A.','IT'),(23,'IONOS','DE'),(23,'Colt DCS','GB'),
  (23,'Kao Data','GB'),(23,'Stulz','DE'),(23,'Rittal','DE'),
  (23,'Munters','SE'),(23,'Asetek','DK'),(23,'Submer','ES'),(23,'Iceotope','GB')
ON CONFLICT DO NOTHING;

-- 24. Battery & Energy Storage Cell Manufacturing
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (24,'Northvolt','SE'),(24,'Automotive Cells Company (ACC)','FR'),(24,'Verkor','FR'),
  (24,'FREYR Battery','NO'),(24,'Morrow Batteries','NO'),(24,'InoBat','SK'),
  (24,'Customcells','DE'),(24,'PowerCo','DE'),(24,'Leclanché','CH'),
  (24,'Saft','FR'),(24,'Varta','DE'),(24,'Hoppecke','DE'),
  (24,'Skeleton Technologies','EE'),(24,'AMTE Power','GB'),(24,'Nexeon','GB'),
  (24,'Vianode','NO'),(24,'Talga Group','SE'),(24,'Elkem','NO'),
  (24,'Umicore','BE'),(24,'BASF Battery Materials','DE')
ON CONFLICT DO NOTHING;

-- 25. Marine & Offshore Subsea Engineering
INSERT INTO ontology_enterprises (industry_id, name, hq_country) VALUES
  (25,'TechnipFMC','GB'),(25,'Subsea7','GB'),(25,'Saipem','IT'),
  (25,'Aker Solutions','NO'),(25,'DOF Group','NO'),(25,'Solstad Offshore','NO'),
  (25,'Boskalis','NL'),(25,'Van Oord','NL'),(25,'DEME Group','BE'),
  (25,'Jan De Nul','BE'),(25,'Seaway7','NO'),(25,'Cadeler','DK'),
  (25,'Fred. Olsen Windcarrier','NO'),(25,'Prysmian','IT'),(25,'Nexans','FR'),
  (25,'NKT','DK'),(25,'Hellenic Cables','GR'),(25,'Sif Group','NL'),
  (25,'Smulders','BE'),(25,'Bladt Industries','DK')
ON CONFLICT DO NOTHING;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE ontology_industries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ontology_enterprises ENABLE ROW LEVEL SECURITY;

-- Table-level grants (the Data API gate — RLS is the row gate, GRANT is the
-- table gate; without this PostgREST returns 42501 even when RLS would
-- allow). authenticated/service_role also land automatically via 075's
-- ALTER DEFAULT PRIVILEGES, but are granted explicitly here for clarity and
-- so this file is correct standalone. anon does NOT inherit a default grant
-- — 076 flipped anon to a strict opt-in model, and this migration lands
-- after that cutover, so the anon SELECT these tables' RLS policies grant
-- must be opened explicitly at the table level too (076 already anticipated
-- this exact pair under "070 anon read (true) — landing-page taxonomy").
GRANT SELECT, INSERT, UPDATE, DELETE ON ontology_industries, ontology_enterprises TO service_role;
GRANT SELECT                         ON ontology_industries, ontology_enterprises TO authenticated;
GRANT SELECT                         ON ontology_industries, ontology_enterprises TO anon;

DROP POLICY IF EXISTS "anon read ontology_industries" ON ontology_industries;
CREATE POLICY "anon read ontology_industries"
  ON ontology_industries FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "service_role full ontology_industries" ON ontology_industries;
CREATE POLICY "service_role full ontology_industries"
  ON ontology_industries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon read ontology_enterprises" ON ontology_enterprises;
CREATE POLICY "anon read ontology_enterprises"
  ON ontology_enterprises FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "service_role full ontology_enterprises" ON ontology_enterprises;
CREATE POLICY "service_role full ontology_enterprises"
  ON ontology_enterprises FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMIT;
