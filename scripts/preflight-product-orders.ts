// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/preflight-product-orders.ts
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    'FAIL: SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required.',
  );
  process.exit(1);
}

try {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/product_order_schema_preflight`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: '{}',
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.toLowerCase().includes('application/json')) {
    console.error(
      `FAIL: product-order schema preflight returned HTTP ${response.status}; apply migration 099 before deployment.`,
    );
    process.exit(1);
  }

  const ready: unknown = await response.json();
  if (ready !== true) {
    console.error(
      'FAIL: required product-order tables/functions are missing; do not deploy checkout.',
    );
    process.exit(1);
  }

  console.log('PASS: product-order schema is ready for checkout deployment.');
} catch (error) {
  console.error('FAIL: product-order schema preflight could not reach Supabase.', error);
  process.exit(1);
}
