import logger from './logger.js';
/**
 * GTM Client Utility — DWS IQ 6/7
 *
 * Client-side helper to push events to Google Tag Manager data layer.
 * Initializes GTM container and provides type-safe event helpers.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 1)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

export interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

type DataLayerEntry = GTMEvent | IArguments;

export type DataLayer = DataLayerEntry[];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

class GTMClient {
  private containerId: string;
  private initialized = false;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  /**
   * Initialize GTM container and data layer
   * Call once on page load before pushing events
   */
  init(): void {
    if (this.initialized) return;

    // Initialize data layer
    const dataLayer = (window.dataLayer = window.dataLayer || []);

    // Inject GTM script
    const scriptId = 'gtm-container';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.containerId}`;
      document.head.appendChild(script);
    }

    // Configure gtag
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        dataLayer.push(args);
      });
    window.gtag('js', new Date());
    window.gtag('config', this.containerId, {
      send_page_view: false, // we'll send custom page_view events
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    this.initialized = true;
  }

  /**
   * Push a generic event to the data layer
   */
  push(event: GTMEvent): void {
    if (!this.initialized) {
      logger.warn('GTMClient not initialized — call init() first');
      return;
    }
    window.dataLayer.push(event);
  }

  /**
   * Page view event
   */
  pageView(options: { page_type: string; page_title?: string; user_segment?: string }): void {
    this.push({
      event: 'page_view',
      page_type: options.page_type,
      page_title: options.page_title || document.title,
      user_segment: options.user_segment || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Product view event (product details page or product card)
   */
  productView(options: {
    product_id: string;
    product_name: string;
    price_eur: number;
    category?: string;
  }): void {
    this.push({
      event: 'product_view',
      product_id: options.product_id,
      product_name: options.product_name,
      price_eur: options.price_eur,
      category: options.category || 'unknown',
      currency: 'EUR',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add to cart event
   */
  addToCart(options: {
    product_id: string;
    product_name?: string;
    quantity: number;
    price_eur?: number;
    discount_tier?: string;
  }): void {
    this.push({
      event: 'add_to_cart',
      product_id: options.product_id,
      product_name: options.product_name,
      quantity: options.quantity,
      price_eur: options.price_eur,
      discount_tier: options.discount_tier,
      currency: 'EUR',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * View cart event
   */
  viewCart(options: {
    cart_value_eur: number;
    item_count: number;
    bundle_discount?: number;
  }): void {
    this.push({
      event: 'view_cart',
      cart_value_eur: options.cart_value_eur,
      item_count: options.item_count,
      bundle_discount: options.bundle_discount || 0,
      currency: 'EUR',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Begin checkout event
   */
  beginCheckout(options: {
    cart_value_eur: number;
    item_count: number;
    bundle_discount?: number;
  }): void {
    this.push({
      event: 'begin_checkout',
      cart_value_eur: options.cart_value_eur,
      item_count: options.item_count,
      bundle_discount: options.bundle_discount || 0,
      currency: 'EUR',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add shipping info event (email entered in checkout)
   */
  addShippingInfo(options: { shipping_country?: string }): void {
    this.push({
      event: 'add_shipping_info',
      shipping_country: options.shipping_country || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add payment method event (payment form opens)
   */
  addPaymentMethod(): void {
    this.push({
      event: 'add_payment_method',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Purchase (conversion) event — typically fired from backend via webhook
   * but can also be called on success page
   */
  purchase(options: {
    transaction_id: string;
    revenue_eur: number;
    currency?: string;
    shipping_cost_eur?: number;
    discount_amount_eur?: number;
    tax_amount_eur?: number;
  }): void {
    this.push({
      event: 'purchase',
      transaction_id: options.transaction_id,
      revenue: options.revenue_eur,
      currency: options.currency || 'EUR',
      shipping: options.shipping_cost_eur || 0,
      discount: options.discount_amount_eur || 0,
      tax: options.tax_amount_eur || 0,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Custom event — for tracking not covered by standard helpers
   */
  customEvent(name: string, data?: Record<string, unknown>): void {
    this.push({
      event: name,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance — container ID loaded from environment or DOM
const getContainerId = (): string => {
  // Try to get from meta tag (set in HTML)
  const meta = document.querySelector('meta[name="gtm-container-id"]');
  if (meta) {
    return meta.getAttribute('content') || 'GTM-XXXXXXX';
  }
  // Fallback to environment variable
  return process.env.VITE_GTM_CONTAINER_ID || 'GTM-XXXXXXX';
};

export const gtmClient = new GTMClient(getContainerId());
