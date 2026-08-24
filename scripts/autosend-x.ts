#!/usr/bin/env npx tsx
/**
 * Autosend to X.com — CLI script
 *
 * Usage:
 *   npx tsx scripts/autosend-x.ts "Your tweet text here"
 *
 * Requires either: xurl CLI configured, or env vars X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 */

import { autosendToX, isXConfigured } from '../src/social-scheduler/x-publisher.js';

async function main(): Promise<void> {
  const text = process.argv.slice(2).join(' ').trim();

  if (!text) {
    console.error(JSON.stringify({
      success: false,
      error: 'No tweet text provided. Usage: npx tsx scripts/autosend-x.ts "Your tweet"',
    }));
    process.exit(1);
  }

  if (text.length > 280) {
    console.error(JSON.stringify({
      success: false,
      error: `Tweet exceeds 280 characters (${text.length} chars)`,
    }));
    process.exit(1);
  }

  if (!(await isXConfigured())) {
    console.error(JSON.stringify({
      success: false,
      error: 'X API not configured. Either install xurl (npm i -g @xdevplatform/xurl) or set env vars: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET',
    }));
    process.exit(1);
  }

  console.log(JSON.stringify({ status: 'sending', text, chars: text.length }));

  const result = await autosendToX(text);
  console.log(JSON.stringify(result));

  process.exit(result.success ? 0 : 1);
}

main();
