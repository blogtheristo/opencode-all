#!/usr/bin/env node
import { chromium } from 'playwright';

const url = 'https://tarjouspalvelu.fi/UX/TP/EditoiTarjousta?p=2235&tarjpyynid=616172&tarjousid=5101501';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 Fetching:', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

    // Wait a bit for content to load
    await page.waitForTimeout(2000);

    // Extract all text
    const text = await page.innerText('body');
    console.log('\n📋 PAGE CONTENT:\n');
    console.log(text);

    console.log('\n✅ Page fetched successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
