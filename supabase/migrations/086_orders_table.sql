-- Migration 086: Orders table for Stripe payments integration
-- Adds orders table to track purchase lifecycle with Stripe invoice ID as key
-- Enables mark_order_paid RPC function for atomic paid state change

BEGIN;

-- ===========================================================================
-- ORDERS TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_invoice_id TEXT UNIQUE NOT NULL, -- Unique Stripe invoice ID
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  session_id TEXT,
  amount_eur NUMERIC(12,2) NOT NULL, -- Total amount paid in EUR
  status TEXT DEFAULT 'pending' CONSTRAINT valid_order_status CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  product_id TEXT, -- FK to products table
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ, -- When payment was confirmed
  cancelled_at TIMESTAMPTZ, -- When order was cancelled
  metadata JSONB -- Custom fields for invoice items, etc.
);

-- ===========================================================================
-- INDEXES
-- ===========================================================================

CREATE INDEX IF NOT EXISTS idx_orders_stripe_invoice_id ON orders(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_org_id ON orders(org_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders table (to be customized)
-- service_role: full access
-- authenticated: only own orders (custom policy can be added later if needed)
CREATE POLICY "service_role_all" ON orders FOR ALL USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;

-- ===========================================================================
-- RPC: mark_order_paid
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.mark_order_paid(p_order_id UUID)
RETURNS TABLE(order_id UUID, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  UPDATE orders
  SET status = 'paid',
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = p_order_id
  RETURNING id INTO v_order_id;

  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  RETURN QUERY
    SELECT o.id, o.status
    FROM orders o
    WHERE o.id = p_order_id;
END;
$$;

-- Grant execute to service_role only
REVOKE ALL ON FUNCTION public.mark_order_paid(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_order_paid(UUID) TO service_role;

COMMENT ON FUNCTION public.mark_order_paid(UUID) IS
  'Mark order as paid, update timestamps, and verify order exists';

COMMIT;