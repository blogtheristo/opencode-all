/**
 * GTM Event Type Definitions — DWS IQ 6/7
 *
 * Centralized definitions for all GTM + backend events.
 * Used by both gtm-client.ts (frontend) and event-bus.ts (backend).
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 1)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

export interface SalesEventPayload {
  [key: string]: unknown;
  timestamp: string;
  source: 'gtm' | 'stripe_webhook' | 'backend';
}

export interface PageViewEvent extends SalesEventPayload {
  event: 'page_view';
  page_type: string;
  page_title?: string;
  user_segment?: string;
}

export interface ProductViewEvent extends SalesEventPayload {
  event: 'product_view';
  product_id: string;
  product_name: string;
  price_eur: number;
  category?: string;
  currency?: string;
}

export interface AddToCartEvent extends SalesEventPayload {
  event: 'add_to_cart';
  product_id: string;
  product_name?: string;
  quantity: number;
  price_eur?: number;
  discount_tier?: string;
  currency?: string;
}

export interface ViewCartEvent extends SalesEventPayload {
  event: 'view_cart';
  cart_value_eur: number;
  item_count: number;
  bundle_discount?: number;
  currency?: string;
}

export interface BeginCheckoutEvent extends SalesEventPayload {
  event: 'begin_checkout';
  cart_value_eur: number;
  item_count: number;
  bundle_discount?: number;
  currency?: string;
}

export interface AddShippingInfoEvent extends SalesEventPayload {
  event: 'add_shipping_info';
  shipping_country?: string;
}

export interface AddPaymentMethodEvent extends SalesEventPayload {
  event: 'add_payment_method';
}

export interface PurchaseEvent extends SalesEventPayload {
  event: 'purchase';
  transaction_id: string;
  revenue: number;
  currency?: string;
  shipping?: number;
  discount?: number;
  tax?: number;
}

export type SalesEvent =
  | PageViewEvent
  | ProductViewEvent
  | AddToCartEvent
  | ViewCartEvent
  | BeginCheckoutEvent
  | AddShippingInfoEvent
  | AddPaymentMethodEvent
  | PurchaseEvent;

/**
 * Map GTM event names to backend event bus event types
 * GTM events fire on frontend, are logged to Supabase via telemetry service,
 * and optionally re-emitted to event bus for backend handlers
 */
export const GTM_TO_EVENT_BUS_MAP: Record<string, string> = {
  page_view: 'sales.page_view',
  product_view: 'sales.product_view',
  add_to_cart: 'sales.add_to_cart',
  view_cart: 'sales.view_cart',
  begin_checkout: 'sales.begin_checkout',
  add_shipping_info: 'sales.add_shipping_info',
  add_payment_method: 'sales.add_payment_method',
  purchase: 'sales.purchase',
};

/**
 * Funnel step enum — maps to the 14-step workflow
 * Used for tracking progression through the sales funnel
 */
export enum FunnelStep {
  ENTRY = 'entry',
  BUNDLE_SELECT = 'bundle_select',
  DISCOUNT_CALC = 'discount_calc',
  ACTIVATION_PAYMENT = 'activation_payment',
  ENTERPRISE_FORM = 'enterprise_form',
  UPSELL_FORM = 'upsell_form',
  ORDER_REVIEW = 'order_review',
  STRIPE_INVOICE = 'stripe_invoice',
  RISTO_ALERT = 'risto_alert',
  ACCOUNTING = 'accounting',
  GAP_HANDLING = 'gap_handling',
  LICENSE_PROVISION = 'license_provision',
  ONBOARDING_EMAIL = 'onboarding_email',
  ERP_CONNECT = 'erp_connect',
  ADMIN_ROLE = 'admin_role',
}

/**
 * User segment enum — for targeting and cohort analysis
 */
export enum UserSegment {
  ANONYMOUS = 'anonymous',
  KNOWN_CONTACT = 'known_contact',
  TRIAL_USER = 'trial_user',
  CUSTOMER = 'customer',
}

/**
 * Industry vertical enum — for vertical-specific tracking
 */
export enum IndustryVertical {
  CONSTRUCTION = 'construction',
  MANUFACTURING = 'manufacturing',
  LOGISTICS = 'logistics',
  ENERGY = 'energy',
  CHEMICALS = 'chemicals',
  STEEL = 'steel',
  OTHER = 'other',
}
