-- Payment Integration Migration
-- Adds payment provider fields to subscriptions and payment event tracking
-- Supports Revolut Business (EU) and PayPal Business (Global)

-- ============================================================================
-- SUBSCRIPTION TABLE UPDATES
-- ============================================================================

-- Add payment provider tracking to subscriptions table
-- Note: Using IF NOT EXISTS style checks for idempotency

DO $$
BEGIN
    -- Add payment_provider column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'payment_provider'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN payment_provider VARCHAR(20);
        COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment provider: revolut or paypal';
    END IF;

    -- Add provider_subscription_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'provider_subscription_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN provider_subscription_id VARCHAR(255);
        COMMENT ON COLUMN subscriptions.provider_subscription_id IS 'Subscription ID from payment provider (PayPal subscription ID)';
    END IF;

    -- Add provider_customer_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' AND column_name = 'provider_customer_id'
    ) THEN
        ALTER TABLE subscriptions ADD COLUMN provider_customer_id VARCHAR(255);
        COMMENT ON COLUMN subscriptions.provider_customer_id IS 'Customer ID from payment provider';
    END IF;
END $$;

-- Create index for provider subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_subscription_id 
    ON subscriptions(provider_subscription_id) 
    WHERE provider_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_provider 
    ON subscriptions(payment_provider) 
    WHERE payment_provider IS NOT NULL;

-- ============================================================================
-- PAYMENT EVENTS TABLE (Audit Log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to subscription (optional - some events may not have subscription yet)
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Payment provider info
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('revolut', 'paypal')),
    event_type VARCHAR(100) NOT NULL,
    
    -- Payment details
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Provider-specific IDs
    provider_event_id VARCHAR(255),
    
    -- Raw webhook payload for debugging/audit
    raw_payload JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payment events
CREATE INDEX IF NOT EXISTS idx_payment_events_subscription_id 
    ON payment_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_provider 
    ON payment_events(provider);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type 
    ON payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at 
    ON payment_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_events_provider_event_id 
    ON payment_events(provider_event_id) 
    WHERE provider_event_id IS NOT NULL;

-- Comments
COMMENT ON TABLE payment_events IS 'Audit log of all payment webhook events from Revolut and PayPal';
COMMENT ON COLUMN payment_events.provider IS 'Payment provider: revolut or paypal';
COMMENT ON COLUMN payment_events.event_type IS 'Webhook event type (e.g., payment_request.completed, BILLING.SUBSCRIPTION.ACTIVATED)';
COMMENT ON COLUMN payment_events.raw_payload IS 'Full webhook payload for debugging and compliance';

-- ============================================================================
-- SUBSCRIPTION PLANS TABLE (Optional - for dynamic plan management)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Plan identification
    tier VARCHAR(20) NOT NULL UNIQUE CHECK (tier IN ('free', 'pro', 'enterprise')),
    name VARCHAR(100) NOT NULL,
    
    -- Pricing
    price_monthly_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_annual_eur DECIMAL(10,2),  -- Optional annual pricing
    
    -- Limits
    agent_calls_per_month INTEGER NOT NULL DEFAULT 100,  -- -1 for unlimited
    edge_devices INTEGER NOT NULL DEFAULT 0,
    
    -- Features (JSON array of feature strings)
    features JSONB DEFAULT '[]'::jsonb,
    
    -- Support level
    support_type VARCHAR(50) DEFAULT 'Community',
    
    -- PayPal plan IDs (for subscription linking)
    paypal_plan_id_monthly VARCHAR(100),
    paypal_plan_id_annual VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default plans
INSERT INTO subscription_plans (tier, name, price_monthly_eur, agent_calls_per_month, edge_devices, features, support_type)
VALUES 
    ('free', 'Free', 0, 100, 0, 
     '["100 agent calls/month", "Basic dashboard access", "Community support"]'::jsonb, 
     'Community'),
    ('pro', 'Pro', 499, 10000, 5, 
     '["10,000 agent calls/month", "5 edge devices", "Email support", "API access", "Carbon tracking"]'::jsonb, 
     'Email'),
    ('enterprise', 'Enterprise', 2499, -1, 50, 
     '["Unlimited agent calls", "50+ edge devices", "Dedicated Slack channel", "Custom integrations", "Priority support", "SLA guarantee"]'::jsonb, 
     'Dedicated Slack')
ON CONFLICT (tier) DO UPDATE SET
    name = EXCLUDED.name,
    price_monthly_eur = EXCLUDED.price_monthly_eur,
    agent_calls_per_month = EXCLUDED.agent_calls_per_month,
    edge_devices = EXCLUDED.edge_devices,
    features = EXCLUDED.features,
    support_type = EXCLUDED.support_type,
    updated_at = NOW();

COMMENT ON TABLE subscription_plans IS 'Available subscription plans with pricing and limits';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on payment_events (admins only can see all, users can see their own)
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS payment_events_service_all ON payment_events;
CREATE POLICY payment_events_service_all ON payment_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated users can view events for their subscriptions
-- (requires joining through subscriptions -> customers)
DROP POLICY IF EXISTS payment_events_user_select ON payment_events;
CREATE POLICY payment_events_user_select ON payment_events
    FOR SELECT
    TO authenticated
    USING (
        subscription_id IN (
            SELECT s.id FROM subscriptions s
            JOIN customers c ON s.customer_id = c.id
            WHERE c.primary_contact_email = auth.email()
        )
    );

-- Enable RLS on subscription_plans (public read, admin write)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read plans
DROP POLICY IF EXISTS subscription_plans_public_select ON subscription_plans;
CREATE POLICY subscription_plans_public_select ON subscription_plans
    FOR SELECT
    TO public
    USING (is_active = TRUE);

-- Policy: Only service role can modify plans
DROP POLICY IF EXISTS subscription_plans_service_all ON subscription_plans;
CREATE POLICY subscription_plans_service_all ON subscription_plans
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Recent payment events summary
CREATE OR REPLACE VIEW recent_payment_events AS
SELECT 
    pe.id,
    pe.provider,
    pe.event_type,
    pe.amount,
    pe.currency,
    pe.created_at,
    s.product_name,
    c.name as customer_name,
    c.primary_contact_email as customer_email
FROM payment_events pe
LEFT JOIN subscriptions s ON pe.subscription_id = s.id
LEFT JOIN customers c ON s.customer_id = c.id
ORDER BY pe.created_at DESC
LIMIT 100;

-- View: Subscription with plan details
CREATE OR REPLACE VIEW subscription_details AS
SELECT 
    s.id,
    s.customer_id,
    s.product_name,
    s.billing_cycle,
    s.monthly_amount,
    s.currency,
    s.start_date,
    s.end_date,
    s.next_billing_date,
    s.is_active,
    s.payment_provider,
    s.provider_subscription_id,
    s.cancelled_at,
    s.cancellation_reason,
    s.created_at,
    s.updated_at,
    c.name as customer_name,
    c.primary_contact_email as customer_email,
    c.status as customer_status
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
ORDER BY s.created_at DESC;

-- View: Monthly payment summary
CREATE OR REPLACE VIEW monthly_payment_summary AS
SELECT 
    DATE_TRUNC('month', pe.created_at) as month,
    pe.provider,
    COUNT(*) FILTER (WHERE pe.event_type LIKE '%completed%' OR pe.event_type LIKE '%ACTIVATED%') as successful_payments,
    COUNT(*) FILTER (WHERE pe.event_type LIKE '%failed%' OR pe.event_type LIKE '%FAILED%') as failed_payments,
    SUM(pe.amount) FILTER (WHERE pe.event_type LIKE '%completed%' OR pe.event_type LIKE '%ACTIVATED%') as total_revenue,
    pe.currency
FROM payment_events pe
WHERE pe.amount IS NOT NULL
GROUP BY DATE_TRUNC('month', pe.created_at), pe.provider, pe.currency
ORDER BY month DESC, provider;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Update subscription from webhook event
CREATE OR REPLACE FUNCTION update_subscription_from_payment(
    p_subscription_id UUID,
    p_provider VARCHAR(20),
    p_provider_subscription_id VARCHAR(255),
    p_status BOOLEAN,
    p_next_billing_date DATE DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE subscriptions
    SET 
        payment_provider = p_provider,
        provider_subscription_id = p_provider_subscription_id,
        is_active = p_status,
        next_billing_date = COALESCE(p_next_billing_date, next_billing_date),
        updated_at = NOW()
    WHERE id = p_subscription_id;
    
    -- Also update customer status if subscription is active
    IF p_status THEN
        UPDATE customers
        SET 
            status = 'active',
            updated_at = NOW()
        WHERE id = (SELECT customer_id FROM subscriptions WHERE id = p_subscription_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_subscription_from_payment IS 'Update subscription status after payment webhook';

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment provider used: revolut (EU) or paypal (global)';
COMMENT ON COLUMN subscriptions.provider_subscription_id IS 'External subscription ID from payment provider';
COMMENT ON COLUMN subscriptions.provider_customer_id IS 'External customer ID from payment provider';
