-- Investor Reporting - Financial Data Layer
-- Monthly/Quarterly Investor Reports, MRR/ARR Tracking, Runway Analysis

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE customer_status AS ENUM (
  'trial',
  'active',
  'paused',
  'churned',
  'expansion'
);

CREATE TYPE contract_status AS ENUM (
  'draft',
  'sent',
  'signed',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE subscription_billing_cycle AS ENUM (
  'monthly',
  'quarterly',
  'annual'
);

CREATE TYPE transaction_type AS ENUM (
  'cash_in',
  'cash_out',
  'revenue',
  'expense',
  'investment',
  'loan'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Customers (CRM + Revenue Tracking)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core info
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  country VARCHAR(2), -- ISO 3166-1 alpha-2
  website VARCHAR(255),

  -- Contact
  primary_contact_name VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(50),

  -- Business metrics
  status customer_status NOT NULL DEFAULT 'trial',
  contract_start_date DATE,
  contract_end_date DATE,

  -- Revenue tracking
  current_mrr DECIMAL(10,2) DEFAULT 0,
  current_arr DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,

  -- Linked to Firehorse (if came from sales pipeline)
  firehorse_lead_id UUID REFERENCES firehorse_leads(id) ON DELETE SET NULL,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  churned_at TIMESTAMPTZ
);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_country ON customers(country);
CREATE INDEX idx_customers_firehorse_lead_id ON customers(firehorse_lead_id);

-- Contracts (signed deals, SOWs, MSAs)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  -- Contract details
  contract_number VARCHAR(50) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status contract_status NOT NULL DEFAULT 'draft',

  -- Financial
  total_value DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  term_months INTEGER, -- Contract duration in months

  -- Dates
  sent_date DATE,
  signed_date DATE,
  start_date DATE,
  end_date DATE,

  -- Documents
  document_url TEXT, -- Link to signed PDF (Google Drive, S3, etc.)

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_contract_value CHECK (total_value >= 0),
  CONSTRAINT valid_term CHECK (term_months > 0)
);
CREATE INDEX idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_signed_date ON contracts(signed_date);

-- Subscriptions (recurring revenue tracking)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,

  -- Subscription details
  product_name VARCHAR(255) NOT NULL,
  billing_cycle subscription_billing_cycle NOT NULL DEFAULT 'monthly',

  -- Pricing
  monthly_amount DECIMAL(10,2) NOT NULL, -- Normalized to monthly (annual/12)
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Dates
  start_date DATE NOT NULL,
  end_date DATE, -- NULL for evergreen subscriptions
  next_billing_date DATE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_monthly_amount CHECK (monthly_amount >= 0)
);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);

-- Revenue Recognition (monthly MRR/ARR snapshots)
CREATE TABLE revenue_recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Time period
  month DATE NOT NULL, -- First day of month (YYYY-MM-01)

  -- Core metrics
  mrr DECIMAL(10,2) NOT NULL DEFAULT 0, -- Monthly Recurring Revenue
  arr DECIMAL(10,2) NOT NULL DEFAULT 0, -- Annual Recurring Revenue (MRR * 12)

  -- MRR Movement
  new_mrr DECIMAL(10,2) DEFAULT 0, -- New customers
  expansion_mrr DECIMAL(10,2) DEFAULT 0, -- Upsells/cross-sells
  contraction_mrr DECIMAL(10,2) DEFAULT 0, -- Downgrades
  churned_mrr DECIMAL(10,2) DEFAULT 0, -- Lost customers

  -- Customer counts
  active_customers INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  churned_customers INTEGER DEFAULT 0,

  -- Calculated metrics
  churn_rate DECIMAL(5,2), -- Percentage (e.g., 5.00 = 5%)
  net_mrr_growth_rate DECIMAL(5,2), -- Percentage

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(month)
);
CREATE INDEX idx_revenue_recognition_month ON revenue_recognition(month);

-- Runway Tracking (cash + burn rate)
CREATE TABLE runway_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Time period
  month DATE NOT NULL, -- First day of month (YYYY-MM-01)

  -- Cash position
  cash_balance DECIMAL(12,2) NOT NULL, -- End of month cash

  -- Burn metrics
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  monthly_expenses DECIMAL(10,2) DEFAULT 0,
  net_burn DECIMAL(10,2), -- expenses - revenue

  -- Runway
  runway_months DECIMAL(4,1), -- Calculated: cash / net_burn

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(month)
);
CREATE INDEX idx_runway_tracking_month ON runway_tracking(month);

-- Transactions (detailed cash flow tracking)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Transaction details
  type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Links
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,

  -- Description
  description TEXT NOT NULL,
  category VARCHAR(100), -- e.g., "SaaS Revenue", "Salaries", "AWS", "Marketing"

  -- Dates
  transaction_date DATE NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_category ON transactions(category);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Current MRR breakdown by customer
CREATE VIEW current_mrr_by_customer AS
SELECT
  c.id,
  c.name,
  c.status,
  c.current_mrr,
  c.current_arr,
  c.contract_start_date,
  COUNT(s.id) as active_subscriptions,
  SUM(s.monthly_amount) as subscription_mrr
FROM customers c
LEFT JOIN subscriptions s ON c.id = s.customer_id AND s.is_active = TRUE
WHERE c.status IN ('active', 'trial', 'expansion')
GROUP BY c.id, c.name, c.status, c.current_mrr, c.current_arr, c.contract_start_date
ORDER BY c.current_mrr DESC;

-- Monthly metrics summary (last 12 months)
CREATE VIEW monthly_metrics_summary AS
SELECT
  rr.month,
  rr.mrr,
  rr.arr,
  rr.new_mrr,
  rr.expansion_mrr,
  rr.churned_mrr,
  rr.active_customers,
  rr.churn_rate,
  rt.cash_balance,
  rt.net_burn,
  rt.runway_months
FROM revenue_recognition rr
LEFT JOIN runway_tracking rt ON rr.month = rt.month
ORDER BY rr.month DESC
LIMIT 12;

-- Contracts pending signature
CREATE VIEW contracts_pending_signature AS
SELECT
  ct.id,
  ct.contract_number,
  ct.title,
  ct.total_value,
  ct.status,
  ct.sent_date,
  c.name as customer_name,
  c.primary_contact_email,
  CURRENT_DATE - ct.sent_date as days_pending
FROM contracts ct
JOIN customers c ON ct.customer_id = c.id
WHERE ct.status IN ('sent')
ORDER BY ct.sent_date ASC;

-- Active subscriptions expiring soon (next 90 days)
CREATE VIEW subscriptions_expiring_soon AS
SELECT
  s.id,
  s.product_name,
  s.monthly_amount,
  s.end_date,
  c.name as customer_name,
  c.primary_contact_email,
  s.end_date - CURRENT_DATE as days_until_expiry
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
WHERE s.is_active = TRUE
  AND s.end_date IS NOT NULL
  AND s.end_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY s.end_date ASC;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update customer MRR/ARR from active subscriptions
CREATE OR REPLACE FUNCTION update_customer_revenue()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET
    current_mrr = (
      SELECT COALESCE(SUM(monthly_amount), 0)
      FROM subscriptions
      WHERE customer_id = NEW.customer_id AND is_active = TRUE
    ),
    current_arr = (
      SELECT COALESCE(SUM(monthly_amount), 0) * 12
      FROM subscriptions
      WHERE customer_id = NEW.customer_id AND is_active = TRUE
    ),
    updated_at = NOW()
  WHERE id = NEW.customer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update customer revenue when subscription changes
CREATE TRIGGER trigger_update_customer_revenue
AFTER INSERT OR UPDATE OR DELETE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_customer_revenue();

-- Calculate monthly revenue recognition metrics
CREATE OR REPLACE FUNCTION calculate_monthly_metrics(target_month DATE)
RETURNS void AS $$
DECLARE
  prev_month DATE;
  current_mrr DECIMAL(10,2);
  previous_mrr DECIMAL(10,2);
  new_mrr_val DECIMAL(10,2);
  expansion_val DECIMAL(10,2);
  contraction_val DECIMAL(10,2);
  churned_val DECIMAL(10,2);
  active_count INTEGER;
  new_count INTEGER;
  churned_count INTEGER;
  churn_pct DECIMAL(5,2);
  growth_pct DECIMAL(5,2);
BEGIN
  prev_month := target_month - INTERVAL '1 month';

  -- Current MRR
  SELECT COALESCE(SUM(current_mrr), 0) INTO current_mrr
  FROM customers
  WHERE status IN ('active', 'trial', 'expansion');

  -- Previous month MRR
  SELECT COALESCE(mrr, 0) INTO previous_mrr
  FROM revenue_recognition
  WHERE month = prev_month;

  -- New customers MRR
  SELECT COALESCE(SUM(current_mrr), 0) INTO new_mrr_val
  FROM customers
  WHERE DATE_TRUNC('month', contract_start_date) = target_month;

  -- Churned customers MRR
  SELECT COALESCE(SUM(current_mrr), 0) INTO churned_val
  FROM customers
  WHERE DATE_TRUNC('month', churned_at) = target_month;

  -- Active customer count
  SELECT COUNT(*) INTO active_count
  FROM customers
  WHERE status IN ('active', 'trial', 'expansion');

  -- New customers count
  SELECT COUNT(*) INTO new_count
  FROM customers
  WHERE DATE_TRUNC('month', contract_start_date) = target_month;

  -- Churned customers count
  SELECT COUNT(*) INTO churned_count
  FROM customers
  WHERE DATE_TRUNC('month', churned_at) = target_month;

  -- Churn rate (churned MRR / previous MRR)
  IF previous_mrr > 0 THEN
    churn_pct := (churned_val / previous_mrr) * 100;
  ELSE
    churn_pct := 0;
  END IF;

  -- Net MRR growth rate
  IF previous_mrr > 0 THEN
    growth_pct := ((current_mrr - previous_mrr) / previous_mrr) * 100;
  ELSE
    growth_pct := 0;
  END IF;

  -- Insert or update revenue recognition
  INSERT INTO revenue_recognition (
    month,
    mrr,
    arr,
    new_mrr,
    expansion_mrr,
    contraction_mrr,
    churned_mrr,
    active_customers,
    new_customers,
    churned_customers,
    churn_rate,
    net_mrr_growth_rate,
    updated_at
  ) VALUES (
    target_month,
    current_mrr,
    current_mrr * 12,
    new_mrr_val,
    0, -- TODO: Calculate expansion/contraction
    0,
    churned_val,
    active_count,
    new_count,
    churned_count,
    churn_pct,
    growth_pct,
    NOW()
  )
  ON CONFLICT (month) DO UPDATE SET
    mrr = EXCLUDED.mrr,
    arr = EXCLUDED.arr,
    new_mrr = EXCLUDED.new_mrr,
    churned_mrr = EXCLUDED.churned_mrr,
    active_customers = EXCLUDED.active_customers,
    new_customers = EXCLUDED.new_customers,
    churned_customers = EXCLUDED.churned_customers,
    churn_rate = EXCLUDED.churn_rate,
    net_mrr_growth_rate = EXCLUDED.net_mrr_growth_rate,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Current Customers)
-- ============================================================================

-- Uber (Active)
INSERT INTO customers (
  name, industry, country, status,
  contract_start_date, current_mrr, current_arr,
  primary_contact_name, primary_contact_email
) VALUES (
  'Uber Finland', 'Transportation', 'FI', 'active',
  '2024-06-01', 2500.00, 30000.00,
  'Fleet Manager', 'fleet@uber.com'
);

-- Bolt (Active)
INSERT INTO customers (
  name, industry, country, status,
  contract_start_date, current_mrr, current_arr,
  primary_contact_name, primary_contact_email
) VALUES (
  'Bolt Finland', 'Transportation', 'FI', 'active',
  '2024-07-01', 2500.00, 30000.00,
  'Operations Lead', 'ops@bolt.eu'
);

-- Kela (Active)
INSERT INTO customers (
  name, industry, country, status,
  contract_start_date, current_mrr, current_arr,
  primary_contact_name, primary_contact_email
) VALUES (
  'Kela (Social Insurance Institution)', 'Public Sector', 'FI', 'active',
  '2024-08-01', 2000.00, 24000.00,
  'Project Manager', 'pm@kela.fi'
);

-- Create subscriptions for active customers
INSERT INTO subscriptions (
  customer_id, product_name, billing_cycle, monthly_amount, start_date
)
SELECT
  id,
  'DWS Platform - Enterprise',
  'monthly',
  current_mrr,
  contract_start_date
FROM customers
WHERE status = 'active';

-- Initialize revenue recognition for current month
SELECT calculate_monthly_metrics(DATE_TRUNC('month', CURRENT_DATE)::date);

-- Initialize runway tracking
INSERT INTO runway_tracking (
  month, cash_balance, monthly_revenue, monthly_expenses, net_burn, runway_months
) VALUES (
  DATE_TRUNC('month', CURRENT_DATE),
  50000.00, -- €50k cash (example)
  7000.00,  -- €7k MRR
  12000.00, -- €12k monthly burn
  5000.00,  -- €5k net burn
  10.0      -- 10 months runway
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE customers IS 'Core customer records with MRR/ARR tracking';
COMMENT ON TABLE contracts IS 'Signed contracts and SOWs';
COMMENT ON TABLE subscriptions IS 'Recurring revenue subscriptions';
COMMENT ON TABLE revenue_recognition IS 'Monthly MRR/ARR snapshots for investor reporting';
COMMENT ON TABLE runway_tracking IS 'Monthly cash position and runway analysis';
COMMENT ON TABLE transactions IS 'Detailed cash flow transactions';

COMMENT ON FUNCTION update_customer_revenue() IS 'Auto-update customer MRR/ARR when subscriptions change';
COMMENT ON FUNCTION calculate_monthly_metrics(DATE) IS 'Calculate monthly revenue recognition metrics for investor reports';
