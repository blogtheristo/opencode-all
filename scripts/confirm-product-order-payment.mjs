#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/confirm-product-order-payment.mjs
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';

export function validateConfirmation(input) {
  const orderId = input.orderId?.trim();
  const provider = input.provider?.trim().toLowerCase();
  const reference = input.reference?.trim();
  const actor = input.actor?.trim();
  const currency = input.currency?.trim().toUpperCase();
  const amountCents = Number(input.amountCents);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId ?? '')) {
    throw new Error('Order intent ID must be a UUID');
  }
  if (!['revolut', 'paypal'].includes(provider)) throw new Error('Provider must be revolut or paypal');
  if (!reference || reference.length > 200 || !/^[A-Za-z0-9._:/-]+$/.test(reference)) {
    throw new Error('A valid provider transaction reference is required');
  }
  if (!Number.isSafeInteger(amountCents) || amountCents < 1 || amountCents > 10_000_000_000) {
    throw new Error('Amount must be a positive integer number of cents');
  }
  if (!/^[A-Z]{3}$/.test(currency ?? '')) throw new Error('Currency must be a three-letter code');
  if (!actor || actor.length < 3 || actor.length > 200) throw new Error('An operator ID is required');

  return { orderId, provider, reference, amountCents, currency, actor };
}

const localConfirmation = `
let raw = '';
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw);
if (!process.env.ADMIN_API_KEY) throw new Error('ADMIN_API_KEY is not configured in dws-backend');
const response = await fetch('http://127.0.0.1:8080/v1/orders/' + input.orderId + '/confirm-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Key': process.env.ADMIN_API_KEY,
    'X-Operator-Id': input.actor,
  },
  body: JSON.stringify({
    payment_provider: input.provider,
    transaction_reference: input.reference,
    amount_cents: input.amountCents,
    currency: input.currency,
  }),
});
const result = await response.json();
if (!response.ok) {
  console.error('Payment confirmation rejected:', response.status, result.error || result.message || 'unknown error');
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    order_intent_id: result.order_intent_id,
    product_id: result.product_id,
    payment_status: result.payment_status,
    fulfilment_status: result.fulfilment_status,
  }));
}
`;

export async function runConfirmation(input) {
  const confirmation = validateConfirmation(input);
  const child = spawn('docker', ['exec', '-i', 'dws-backend', 'node', '--input-type=module', '-e', localConfirmation], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  child.stdin.end(JSON.stringify(confirmation));
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code) => code === 0 ? resolve() : reject(new Error(`Local payment confirmation exited ${code}`)));
  });
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Payment confirmation requires an interactive operator on the DGX host');
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let input;
  let approved;
  try {
    input = validateConfirmation({
      orderId: await rl.question('Order intent UUID: '),
      provider: await rl.question('Verified provider (revolut/paypal): '),
      reference: await rl.question('Verified provider transaction reference: '),
      amountCents: await rl.question('Verified amount (cents): '),
      currency: await rl.question('Verified currency (e.g. EUR): '),
      actor: await rl.question('Operator ID: '),
    });
    approved = await rl.question('After checking the provider ledger and amount, type VERIFIED to queue fulfilment: ');
  } finally {
    rl.close();
  }
  if (approved !== 'VERIFIED') throw new Error('Payment confirmation cancelled');
  await runConfirmation(input);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
