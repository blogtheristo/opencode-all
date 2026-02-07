/**
 * Revolut Checkout Worker - Creates orders via Merchant API
 *
 * Route: api.dws10.com/checkout/*
 * Deploy: npx wrangler deploy -c wrangler.revolut.toml
 * Secret: npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml
 *
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

interface Env {
  REVOLUT_SECRET_KEY: string;
  REVOLUT_API_URL: string;
  ENVIRONMENT: string;
}

interface OrderRequest {
  productId: string;
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
}

const ALLOWED_ORIGINS = [
  'https://dws10.com',
  'https://www.dws10.com',
  'https://dws10-com.pages.dev',
];

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    // Parse URL path
    const url = new URL(request.url);
    if (!url.pathname.endsWith('/create-order')) {
      return jsonResponse({ error: 'Not found' }, 404, origin);
    }

    try {
      const body: OrderRequest = await request.json();

      // Validate required fields
      if (!body.amount || !body.currency || !body.description) {
        return jsonResponse(
          { error: 'Missing required fields: amount, currency, description' },
          400,
          origin
        );
      }

      // Validate amount is positive integer (minor currency units)
      if (!Number.isInteger(body.amount) || body.amount <= 0) {
        return jsonResponse(
          { error: 'Amount must be a positive integer in minor currency units' },
          400,
          origin
        );
      }

      // Validate currency
      if (!/^[A-Z]{3}$/.test(body.currency)) {
        return jsonResponse({ error: 'Invalid currency code' }, 400, origin);
      }

      const apiUrl = env.REVOLUT_API_URL || 'https://merchant.revolut.com/api';

      // Create order via Revolut Merchant API
      const revolutResponse = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.REVOLUT_SECRET_KEY}`,
          'Revolut-Api-Version': '2024-09-01',
        },
        body: JSON.stringify({
          amount: body.amount,
          currency: body.currency,
          description: body.description,
          merchant_order_ext_ref: body.productId || undefined,
          customer_email: body.customerEmail || undefined,
        }),
      });

      if (!revolutResponse.ok) {
        const errorText = await revolutResponse.text();
        console.error('Revolut API error:', revolutResponse.status, errorText);
        return jsonResponse(
          { error: 'Payment provider error' },
          502,
          origin
        );
      }

      const order: Record<string, unknown> = await revolutResponse.json();

      // Return only public-safe fields
      return jsonResponse(
        {
          token: order.token,
          checkout_url: order.checkout_url,
          order_id: order.id,
        },
        200,
        origin
      );
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500, origin);
    }
  },
};
