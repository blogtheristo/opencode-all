#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/tarjouspalvelu-fetch.mjs

/**
 * Tarjouspalvelu Opportunity Fetcher
 *
 * Logs into tarjouspalvelu.fi and fetches opportunity details
 * using Playwright browser automation.
 *
 * Usage:
 *   node scripts/tarjouspalvelu-fetch.mjs <tarjousid>
 *
 * Environment:
 *   TARJOUSPALVELU_EMAIL
 *   TARJOUSPALVELU_PASSWORD (will be redacted in logs)
 */

import { chromium } from 'playwright';
import 'dotenv/config.js';

const email = process.env.CLOUDIA_USER_NAME;
const pwd = process.env.CLOUDIA_PASSWORD;
const tarjousId = process.argv[2];

if (!tarjousId) {
  console.error('Usage: node scripts/tarjouspalvelu-fetch.mjs <tarjousid>');
  process.exit(1);
}

if (!email || !pwd) {
  console.error('❌ Missing CLOUDIA_USER_NAME or CLOUDIA_PASSWORD in .env');
  process.exit(1);
}

async function loginAndFetch() {
  console.log(`🔐 Starting tarjouspalvelu.fi login flow for opportunity ${tarjousId}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Step 1: Navigate to login page
    console.log('📄 Loading tarjouspalvelu.fi...');
    await page.goto('https://tarjouspalvelu.fi', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000); // Wait for form rendering

    // Step 2: Fill credentials
    console.log('🔑 Entering credentials...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', pwd);

    // Step 3: Submit login
    console.log('⏳ Submitting login...');
    await page.click('button[type="submit"]');

    // Step 4: Wait for post-login navigation
    console.log('⏳ Waiting for authentication...');
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });

    console.log('✅ Authentication successful\n');

    // Step 5: Navigate to opportunity
    const url = `https://tarjouspalvelu.fi/UX/TP/EditoiTarjousta?p=2235&tarjpyynid=616172&tarjousid=${tarjousId}`;
    console.log(`🔍 Fetching opportunity: ${tarjousId}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // Step 6: Extract content
    const fullText = await page.innerText('body');
    console.log('\n📋 OPPORTUNITY DETAILS:\n');
    console.log('='.repeat(80));
    console.log(fullText);
    console.log('='.repeat(80));

    return { success: true, tarjousId };
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

loginAndFetch().then((result) => {
  process.exit(result.success ? 0 : 1);
});
