#!/usr/bin/env node
/**
 * scripts/html-to-pdf.mjs — render a local HTML file to PDF via the pre-installed
 * Chromium (Playwright). Mirrors the chromium auto-detection in screenshot.mjs.
 *
 * Usage: node scripts/html-to-pdf.mjs <input.html> <output.pdf>
 */
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node scripts/html-to-pdf.mjs <input.html> <output.pdf>');
  process.exit(1);
}

function detectChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!base || !existsSync(base)) return null;
  const dirs = readdirSync(base)
    .filter((d) => d.startsWith('chromium-'))
    .sort()
    .reverse();
  for (const d of dirs) {
    const candidates = [
      join(base, d, 'chrome-linux', 'chrome'),
      join(base, d, 'chrome-linux', 'headless_shell'),
    ];
    for (const c of candidates) if (existsSync(c)) return c;
  }
  return null;
}

async function loadChromium() {
  for (const mod of ['playwright', 'playwright-core']) {
    try {
      const { chromium } = await import(mod);
      return chromium;
    } catch {
      /* try next */
    }
  }
  throw new Error("Neither 'playwright' nor 'playwright-core' is installed. Run `npm install`.");
}

const chromium = await loadChromium();
const launchOpts = { headless: true, args: ['--no-sandbox'] };
const exe = detectChromium();
if (exe) launchOpts.executablePath = exe;

let browser;
try {
  browser = await chromium.launch(launchOpts);
} catch (err) {
  if (exe) {
    delete launchOpts.executablePath;
    browser = await chromium.launch(launchOpts);
  } else {
    throw err;
  }
}

const page = await browser.newPage();
await page.goto(pathToFileURL(resolve(input)).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: resolve(output),
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log('PDF written:', resolve(output));
