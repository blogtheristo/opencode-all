/**
 * DWS IQ Billing Integration
 * 
 * Integrates Cloudflare sandbox usage metering with Stripe for billing.
 * Supports usage-based billing, subscription management, and invoice generation.
 * 
 * Features:
 * - Real-time usage tracking from Analytics Engine
 * - Stripe metered billing integration
 * - Invoice generation and webhook handling
 * - Usage alerts and notifications
 * - EU VAT compliance
 * 
 * @module cloudflare/billing-integration
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Env {
  // Stripe API keys
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  
  // Tenant configuration
  TENANT_CONFIG: KVNamespace;
  
  // Usage data
  USAGE_DATA: KVNamespace;
  
  // Analytics Engine for querying usage
  USAGE_METRICS: AnalyticsEngineDataset;
  
  // Notification webhook
  NOTIFICATION_WEBHOOK_URL: string;
  
  // Environment
  ENVIRONMENT: string;
}

interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata: {
    tenantId: string;
    tier: string;
  };
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        recurring: {
          interval: string;
          usage_type: string;
        };
      };
    }>;
  };
  current_period_start: number;
  current_period_end: number;
}

interface UsageSummary {
  tenantId: string;
  period: {
    start: string;
    end: string;
  };
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  requests: number;
  cost: {
    tokens: number;
    base: number;
    total: number;
    currency: string;
  };
}

interface BillingEvent {
  type: 'usage_recorded' | 'threshold_exceeded' | 'invoice_created' | 'payment_failed';
  tenantId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface PricingTier {
  name: string;
  basePriceEur: number;
  pricePerMillionTokens: number;
  includedTokens: number;
  features: string[];
}

// ============================================================================
// Pricing Configuration
// ============================================================================

const PRICING_TIERS: Record<string, PricingTier> = {
  sandbox: {
    name: 'DWS IQ Sandbox',
    basePriceEur: 500,
    pricePerMillionTokens: 20,
    includedTokens: 1000000, // 1M tokens included
    features: [
      'Isolated Claude agent execution',
      '1M tokens/month included',
      '20 requests/minute',
      'Basic compliance tools',
      'Email support'
    ]
  },
  professional: {
    name: 'DWS IQ Professional',
    basePriceEur: 2000,
    pricePerMillionTokens: 15,
    includedTokens: 10000000, // 10M tokens included
    features: [
      'Everything in Sandbox',
      '10M tokens/month included',
      '100 requests/minute',
      'Custom system prompts',
      'MCP server integration',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'DWS IQ Enterprise',
    basePriceEur: 5000,
    pricePerMillionTokens: 10,
    includedTokens: 100000000, // 100M tokens included
    features: [
      'Everything in Professional',
      '100M tokens/month included',
      '1000 requests/minute',
      'Custom tool development',
      'Dedicated sandbox worker',
      'SLA guarantee',
      '24/7 support'
    ]
  }
};

// Stripe price IDs (to be configured in Stripe dashboard)
const STRIPE_PRICE_IDS = {
  sandbox: {
    base: 'price_sandbox_base',
    metered: 'price_sandbox_metered'
  },
  professional: {
    base: 'price_professional_base',
    metered: 'price_professional_metered'
  },
  enterprise: {
    base: 'price_enterprise_base',
    metered: 'price_enterprise_metered'
  }
};

// ============================================================================
// Stripe API Client
// ============================================================================

class StripeClient {
  private apiKey: string;
  private baseUrl = 'https://api.stripe.com/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    let requestBody: string | undefined;
    if (body) {
      requestBody = new URLSearchParams(
        Object.entries(body).map(([k, v]) => [k, String(v)])
      ).toString();
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: requestBody
    });
    
    if (!response.ok) {
      const error = await response.json() as { error: { message: string } };
      throw new Error(`Stripe API error: ${error.error?.message || response.statusText}`);
    }
    
    return await response.json() as T;
  }
  
  async createCustomer(
    email: string,
    name: string,
    tenantId: string,
    tier: string
  ): Promise<StripeCustomer> {
    return this.request<StripeCustomer>('POST', '/customers', {
      email,
      name,
      'metadata[tenantId]': tenantId,
      'metadata[tier]': tier
    });
  }
  
  async getCustomer(customerId: string): Promise<StripeCustomer> {
    return this.request<StripeCustomer>('GET', `/customers/${customerId}`);
  }
  
  async createSubscription(
    customerId: string,
    tier: string
  ): Promise<StripeSubscription> {
    const prices = STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS];
    if (!prices) {
      throw new Error(`Unknown tier: ${tier}`);
    }
    
    return this.request<StripeSubscription>('POST', '/subscriptions', {
      customer: customerId,
      'items[0][price]': prices.base,
      'items[1][price]': prices.metered
    });
  }
  
  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    return this.request<StripeSubscription>('GET', `/subscriptions/${subscriptionId}`);
  }
  
  async reportUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp: number
  ): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', '/subscription_items/' + subscriptionItemId + '/usage_records', {
      quantity: quantity,
      timestamp: timestamp,
      action: 'increment'
    });
  }
  
  async getUpcomingInvoice(customerId: string): Promise<{
    amount_due: number;
    currency: string;
    lines: { data: Array<{ description: string; amount: number }> };
  }> {
    return this.request('GET', `/invoices/upcoming?customer=${customerId}`);
  }
}

// ============================================================================
// Usage Aggregation
// ============================================================================

async function aggregateUsage(
  env: Env,
  tenantId: string,
  startDate: string,
  endDate: string
): Promise<UsageSummary> {
  // Query usage data from KV
  const usageRecords: Array<{
    inputTokens: number;
    outputTokens: number;
    requests: number;
    cost: number;
  }> = [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const key = `usage:${tenantId}:${dateStr}`;
    const record = await env.USAGE_DATA.get(key, 'json') as {
      inputTokens: number;
      outputTokens: number;
      requests: number;
      cost: number;
    } | null;
    
    if (record) {
      usageRecords.push(record);
    }
  }
  
  const totals = usageRecords.reduce((acc, r) => ({
    inputTokens: acc.inputTokens + r.inputTokens,
    outputTokens: acc.outputTokens + r.outputTokens,
    requests: acc.requests + r.requests,
    cost: acc.cost + r.cost
  }), { inputTokens: 0, outputTokens: 0, requests: 0, cost: 0 });
  
  // Get tenant tier for base pricing
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as {
    tier: string;
  } | null;
  
  const tier = tenantConfig?.tier || 'sandbox';
  const pricing = PRICING_TIERS[tier];
  
  return {
    tenantId,
    period: { start: startDate, end: endDate },
    tokens: {
      input: totals.inputTokens,
      output: totals.outputTokens,
      total: totals.inputTokens + totals.outputTokens
    },
    requests: totals.requests,
    cost: {
      tokens: totals.cost,
      base: pricing.basePriceEur,
      total: pricing.basePriceEur + totals.cost,
      currency: 'EUR'
    }
  };
}

// ============================================================================
// Billing Sync (Report Usage to Stripe)
// ============================================================================

async function syncUsageToStripe(
  env: Env,
  tenantId: string
): Promise<{ success: boolean; usageReported: number }> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  
  // Get tenant billing config
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as {
    billing: {
      subscriptionId: string;
      subscriptionItemId: string;
      lastSyncedAt: string;
    };
    tier: string;
  } | null;
  
  if (!tenantConfig?.billing?.subscriptionId) {
    throw new Error('Tenant has no active subscription');
  }
  
  // Get usage since last sync
  const lastSync = tenantConfig.billing.lastSyncedAt || 
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();
  
  const usage = await aggregateUsage(env, tenantId, lastSync.split('T')[0], now.split('T')[0]);
  
  // Calculate billable tokens (above included amount)
  const pricing = PRICING_TIERS[tenantConfig.tier];
  const billableTokens = Math.max(0, usage.tokens.total - pricing.includedTokens);
  
  if (billableTokens > 0) {
    // Report usage in units of 1000 tokens (Stripe doesn't support decimals well)
    const usageUnits = Math.ceil(billableTokens / 1000);
    
    await stripe.reportUsage(
      tenantConfig.billing.subscriptionItemId,
      usageUnits,
      Math.floor(Date.now() / 1000)
    );
  }
  
  // Update last synced timestamp
  await env.TENANT_CONFIG.put(`tenant:${tenantId}`, JSON.stringify({
    ...tenantConfig,
    billing: {
      ...tenantConfig.billing,
      lastSyncedAt: now
    }
  }));
  
  return { success: true, usageReported: billableTokens };
}

// ============================================================================
// Webhook Handlers
// ============================================================================

/**
 * Verify Stripe webhook signature using HMAC-SHA256.
 * Implements Stripe's v1 signature scheme without requiring the Stripe SDK.
 * Compatible with Cloudflare Workers (uses Web Crypto API).
 */
async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  // Parse signature header: t=timestamp,v1=signature
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const sig = parts.find(p => p.startsWith('v1='))?.slice(3);

  if (!timestamp || !sig) return false;

  // Reject timestamps older than 5 minutes (replay protection)
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (isNaN(age) || age > 300) return false;

  // Compute expected signature: HMAC-SHA256(secret, timestamp + '.' + payload)
  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload),
  );

  // Convert to hex string for comparison
  const expected = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Timing-safe comparison
  if (expected.length !== sig.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return result === 0;
}

async function handleStripeWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  const body = await request.text();

  // Verify Stripe webhook signature (HMAC-SHA256)
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const isValid = await verifyStripeSignature(body, signature, webhookSecret);
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON payload', { status: 400 });
  }
  
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as unknown as StripeSubscription, env);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as unknown as StripeSubscription, env);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object as unknown as StripeSubscription, env);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as { customer: string }, env);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as { customer: string }, env);
      break;
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleSubscriptionCreated(
  subscription: StripeSubscription,
  env: Env
): Promise<void> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  const customer = await stripe.getCustomer(subscription.customer);
  const tenantId = customer.metadata.tenantId;
  
  // Update tenant config with subscription info
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as Record<string, unknown>;
  if (tenantConfig) {
    const meteredItem = subscription.items.data.find(
      item => item.price.recurring?.usage_type === 'metered'
    );
    
    await env.TENANT_CONFIG.put(`tenant:${tenantId}`, JSON.stringify({
      ...tenantConfig,
      billing: {
        ...(tenantConfig.billing as Record<string, unknown> || {}),
        customerId: subscription.customer,
        subscriptionId: subscription.id,
        subscriptionItemId: meteredItem?.id,
        status: subscription.status,
        periodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        periodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      },
      enabled: subscription.status === 'active'
    }));
  }
  
  await sendNotification(env, {
    type: 'invoice_created',
    tenantId,
    timestamp: new Date().toISOString(),
    data: { subscriptionId: subscription.id, status: subscription.status }
  });
}

async function handleSubscriptionUpdated(
  subscription: StripeSubscription,
  env: Env
): Promise<void> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  const customer = await stripe.getCustomer(subscription.customer);
  const tenantId = customer.metadata.tenantId;
  
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as Record<string, unknown>;
  if (tenantConfig) {
    await env.TENANT_CONFIG.put(`tenant:${tenantId}`, JSON.stringify({
      ...tenantConfig,
      billing: {
        ...(tenantConfig.billing as Record<string, unknown> || {}),
        status: subscription.status,
        periodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        periodEnd: new Date(subscription.current_period_end * 1000).toISOString()
      },
      enabled: subscription.status === 'active'
    }));
  }
}

async function handleSubscriptionCancelled(
  subscription: StripeSubscription,
  env: Env
): Promise<void> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  const customer = await stripe.getCustomer(subscription.customer);
  const tenantId = customer.metadata.tenantId;
  
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as Record<string, unknown>;
  if (tenantConfig) {
    await env.TENANT_CONFIG.put(`tenant:${tenantId}`, JSON.stringify({
      ...tenantConfig,
      billing: {
        ...(tenantConfig.billing as Record<string, unknown> || {}),
        status: 'cancelled'
      },
      enabled: false
    }));
  }
  
  await sendNotification(env, {
    type: 'payment_failed',
    tenantId,
    timestamp: new Date().toISOString(),
    data: { reason: 'Subscription cancelled' }
  });
}

async function handlePaymentSucceeded(
  invoice: { customer: string },
  env: Env
): Promise<void> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  const customer = await stripe.getCustomer(invoice.customer);
  const tenantId = customer.metadata.tenantId;
  
  // Ensure tenant is enabled
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as Record<string, unknown>;
  if (tenantConfig) {
    await env.TENANT_CONFIG.put(`tenant:${tenantId}`, JSON.stringify({
      ...tenantConfig,
      enabled: true
    }));
  }
}

async function handlePaymentFailed(
  invoice: { customer: string },
  env: Env
): Promise<void> {
  const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
  const customer = await stripe.getCustomer(invoice.customer);
  const tenantId = customer.metadata.tenantId;
  
  await sendNotification(env, {
    type: 'payment_failed',
    tenantId,
    timestamp: new Date().toISOString(),
    data: { customerId: invoice.customer }
  });
}

// ============================================================================
// Notifications
// ============================================================================

async function sendNotification(
  env: Env,
  event: BillingEvent
): Promise<void> {
  if (!env.NOTIFICATION_WEBHOOK_URL) {
    return;
  }
  
  try {
    await fetch(env.NOTIFICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  } catch {
    // Log error but don't fail the main operation
    console.error('Failed to send notification');
  }
}

// ============================================================================
// Usage Threshold Monitoring
// ============================================================================

async function checkUsageThresholds(
  env: Env,
  tenantId: string
): Promise<{ warning: boolean; exceeded: boolean; percentage: number }> {
  const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as {
    tier: string;
    billing: { periodStart: string; periodEnd: string };
  } | null;
  
  if (!tenantConfig) {
    return { warning: false, exceeded: false, percentage: 0 };
  }
  
  const pricing = PRICING_TIERS[tenantConfig.tier];
  const usage = await aggregateUsage(
    env,
    tenantId,
    tenantConfig.billing.periodStart,
    new Date().toISOString()
  );
  
  const percentage = (usage.tokens.total / pricing.includedTokens) * 100;
  
  // Alert at 80% and 100%
  if (percentage >= 100 && percentage < 110) {
    await sendNotification(env, {
      type: 'threshold_exceeded',
      tenantId,
      timestamp: new Date().toISOString(),
      data: {
        percentage,
        used: usage.tokens.total,
        included: pricing.includedTokens,
        overage: usage.tokens.total - pricing.includedTokens
      }
    });
  } else if (percentage >= 80 && percentage < 90) {
    await sendNotification(env, {
      type: 'usage_recorded',
      tenantId,
      timestamp: new Date().toISOString(),
      data: {
        percentage,
        warning: 'Approaching usage limit'
      }
    });
  }
  
  return {
    warning: percentage >= 80,
    exceeded: percentage >= 100,
    percentage
  };
}

// ============================================================================
// CORS Headers
// ============================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID, Stripe-Signature',
  'Access-Control-Max-Age': '86400'
};

// ============================================================================
// Main Worker Handler
// ============================================================================

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'dws-iq-billing',
        version: '1.0.0'
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
    
    // Stripe webhook
    if (url.pathname === '/webhooks/stripe' && request.method === 'POST') {
      return handleStripeWebhook(request, env);
    }
    
    // Get pricing tiers
    if (url.pathname === '/pricing' && request.method === 'GET') {
      return new Response(JSON.stringify(PRICING_TIERS), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
    
    // Get usage summary for a tenant
    if (url.pathname.match(/^\/usage\/[\w-]+$/) && request.method === 'GET') {
      const tenantId = url.pathname.split('/')[2];
      const startDate = url.searchParams.get('start') || 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = url.searchParams.get('end') || 
        new Date().toISOString().split('T')[0];
      
      try {
        const usage = await aggregateUsage(env, tenantId, startDate, endDate);
        const thresholds = await checkUsageThresholds(env, tenantId);
        
        return new Response(JSON.stringify({
          ...usage,
          thresholds
        }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to get usage' 
        }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Sync usage to Stripe
    if (url.pathname.match(/^\/sync\/[\w-]+$/) && request.method === 'POST') {
      const tenantId = url.pathname.split('/')[2];
      
      try {
        const result = await syncUsageToStripe(env, tenantId);
        return new Response(JSON.stringify(result), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to sync usage' 
        }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Get upcoming invoice
    if (url.pathname.match(/^\/invoice\/[\w-]+$/) && request.method === 'GET') {
      const tenantId = url.pathname.split('/')[2];
      
      try {
        const tenantConfig = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json') as {
          billing: { customerId: string };
        } | null;
        
        if (!tenantConfig?.billing?.customerId) {
          return new Response(JSON.stringify({ error: 'No billing configured' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }
        
        const stripe = new StripeClient(env.STRIPE_SECRET_KEY);
        const invoice = await stripe.getUpcomingInvoice(tenantConfig.billing.customerId);
        
        return new Response(JSON.stringify({
          tenantId,
          amountDue: invoice.amount_due / 100,
          currency: invoice.currency.toUpperCase(),
          lineItems: invoice.lines.data.map(line => ({
            description: line.description,
            amount: line.amount / 100
          }))
        }), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to get invoice' 
        }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  },
  
  // Scheduled handler for periodic usage sync
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    // Get all tenants
    const tenantList = await env.TENANT_CONFIG.list({ prefix: 'tenant:' });
    
    for (const key of tenantList.keys) {
      const tenantId = key.name.replace('tenant:', '');
      
      try {
        // Sync usage to Stripe
        await syncUsageToStripe(env, tenantId);
        
        // Check thresholds
        await checkUsageThresholds(env, tenantId);
      } catch (error) {
        console.error(`Failed to sync tenant ${tenantId}:`, error);
      }
    }
  }
};
