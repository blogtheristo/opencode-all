-- Peachscore Accelerator — Cap Table & Financials
-- Shareholders, share classes, investment rounds, ownership views.

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE share_class AS ENUM (
  'common',
  'preferred_seed',
  'preferred_series_a',
  'preferred_series_b',
  'preferred_series_c',
  'warrant_pool',
  'options',
  'convertible'
);

CREATE TYPE shareholder_type AS ENUM (
  'founder',
  'investor',
  'employee',
  'advisor',
  'option_pool'
);

CREATE TYPE investment_round_type AS ENUM (
  'friends_family_fools',
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'series_c',
  'bridge',
  'safe_note',
  'convertible_note'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Investment rounds (must exist before shareholders for FK)
CREATE TABLE cap_table_investment_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  round_type investment_round_type NOT NULL,
  name VARCHAR(100) NOT NULL,

  -- Dates
  close_date DATE NOT NULL,

  -- Valuation
  pre_money_valuation_eur DECIMAL(15,2) NOT NULL DEFAULT 0,
  raised_eur              DECIMAL(15,2) NOT NULL DEFAULT 0,
  post_money_valuation_eur DECIMAL(15,2) GENERATED ALWAYS AS (pre_money_valuation_eur + raised_eur) STORED,
  shares_issued           BIGINT NOT NULL DEFAULT 0,
  price_per_share_eur     DECIMAL(15,6) DEFAULT 0,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cap_rounds_close_date ON cap_table_investment_rounds(close_date DESC);

-- ============================================================================

-- Shareholders / cap table entries
CREATE TABLE cap_table_shareholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name            VARCHAR(255) NOT NULL,
  type            shareholder_type NOT NULL,
  email           VARCHAR(255),
  shares          BIGINT NOT NULL DEFAULT 0,
  share_class     share_class NOT NULL DEFAULT 'common',
  investment_eur  DECIMAL(15,2) NOT NULL DEFAULT 0,
  grant_date      DATE NOT NULL,

  -- Link to funding round (nullable for founders)
  round_id UUID REFERENCES cap_table_investment_rounds(id) ON DELETE SET NULL,

  -- Vesting schedule
  vesting_months       INT,
  vesting_cliff_months INT,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cap_shareholders_type ON cap_table_shareholders(type);
CREATE INDEX idx_cap_shareholders_round  ON cap_table_shareholders(round_id);

-- ============================================================================
-- VIEWS (ownership percentages — security_invoker = true enforces RLS)
-- ============================================================================

-- Total issued shares (excludes unexercised options / warrants)
CREATE OR REPLACE VIEW v_cap_table_issued_shares
  WITH (security_invoker = true)
AS
SELECT
  COALESCE(SUM(shares), 0) AS total_issued
FROM cap_table_shareholders
WHERE share_class NOT IN ('options', 'warrant_pool');

-- Fully diluted share count (all share classes)
CREATE OR REPLACE VIEW v_cap_table_fully_diluted
  WITH (security_invoker = true)
AS
SELECT
  COALESCE(SUM(shares), 0) AS total_fully_diluted
FROM cap_table_shareholders;

-- Per-shareholder ownership (issued basis and fully diluted basis)
CREATE OR REPLACE VIEW v_cap_table_ownership
  WITH (security_invoker = true)
AS
WITH totals AS (
  SELECT
    COALESCE(SUM(CASE WHEN share_class NOT IN ('options', 'warrant_pool') THEN shares ELSE 0 END), 0) AS issued,
    COALESCE(SUM(shares), 0) AS fully_diluted
  FROM cap_table_shareholders
),
latest_round AS (
  SELECT post_money_valuation_eur
  FROM cap_table_investment_rounds
  ORDER BY close_date DESC
  LIMIT 1
)
SELECT
  s.id                AS shareholder_id,
  s.name,
  s.type,
  s.shares,
  s.share_class,
  s.investment_eur,
  r.name              AS round_name,
  -- Ownership on issued basis
  CASE WHEN t.issued > 0
       THEN ROUND((s.shares::NUMERIC / t.issued) * 100, 2)
       ELSE 0 END     AS ownership_pct,
  -- Ownership on fully-diluted basis
  CASE WHEN t.fully_diluted > 0
       THEN ROUND((s.shares::NUMERIC / t.fully_diluted) * 100, 2)
       ELSE 0 END     AS fully_diluted_pct,
  -- Current value using latest post-money valuation
  CASE WHEN t.fully_diluted > 0 AND lr.post_money_valuation_eur IS NOT NULL
       THEN ROUND((s.shares::NUMERIC / t.fully_diluted) * lr.post_money_valuation_eur)
       ELSE 0 END     AS current_value_eur,
  -- Investment multiple
  CASE WHEN s.investment_eur > 0 AND t.fully_diluted > 0 AND lr.post_money_valuation_eur IS NOT NULL
       THEN ROUND(((s.shares::NUMERIC / t.fully_diluted) * lr.post_money_valuation_eur) / s.investment_eur, 2)
       ELSE 0 END     AS investment_multiple
FROM cap_table_shareholders s
CROSS JOIN totals t
LEFT JOIN cap_table_investment_rounds r ON r.id = s.round_id
LEFT JOIN latest_round lr ON true
ORDER BY s.shares DESC;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE cap_table_shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cap_table_investment_rounds ENABLE ROW LEVEL SECURITY;

-- Service role (backend) can read and write
CREATE POLICY "service_role_cap_table_shareholders"
  ON cap_table_shareholders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_cap_table_rounds"
  ON cap_table_investment_rounds
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read (read-only investor access)
CREATE POLICY "authenticated_read_cap_table_shareholders"
  ON cap_table_shareholders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_read_cap_table_rounds"
  ON cap_table_investment_rounds
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Recalculate price_per_share_eur on insert/update of a round
CREATE OR REPLACE FUNCTION update_round_price_per_share()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  total_shares_before BIGINT;
BEGIN
  -- Price per share = pre-money valuation / shares outstanding before this round
  SELECT COALESCE(SUM(shares), 0)
    INTO total_shares_before
    FROM cap_table_shareholders
   WHERE round_id IS DISTINCT FROM NEW.id
     AND share_class NOT IN ('options', 'warrant_pool');

  IF total_shares_before > 0 THEN
    NEW.price_per_share_eur := ROUND(NEW.pre_money_valuation_eur::NUMERIC / total_shares_before, 6);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_round_price_per_share
  BEFORE INSERT OR UPDATE ON cap_table_investment_rounds
  FOR EACH ROW
  EXECUTE FUNCTION update_round_price_per_share();

-- Auto-update updated_at on shareholder record changes
CREATE OR REPLACE FUNCTION update_cap_shareholder_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cap_shareholder_updated_at
  BEFORE UPDATE ON cap_table_shareholders
  FOR EACH ROW
  EXECUTE FUNCTION update_cap_shareholder_updated_at();
