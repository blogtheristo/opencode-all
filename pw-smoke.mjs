import { chromium } from 'playwright';
import fs from 'fs';

const pages = ['/aegis/index.html','/aegis/index.fi.html','/aegis/index.de.html','/aegis/index.fr.html','/aegis/index.sv.html','/aegis/hackathlon.html','/products/aegis.html'];
const base = 'http://localhost:8099';
const results = [];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const p of pages) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push('PAGEERROR: ' + err.message));
  page.on('requestfailed', req => failedRequests.push(req.url() + ' :: ' + (req.failure()?.errorText||'')));
  const resp = await page.goto(base + p, { waitUntil: 'load', timeout: 20000 }).catch(e => ({error: e.message}));
  const status = resp && resp.status ? resp.status() : 'ERR:' + JSON.stringify(resp);
  const title = await page.title().catch(()=>'ERR');
  const fname = 'playwright-evidence/' + p.replace(/\//g,'_').replace(/^_/,'') + '.png';
  await page.screenshot({ path: '/home/user/worktrees/aegis-release-readiness-audit/' + fname, fullPage: true }).catch(()=>{});
  // mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  const fnameMobile = 'playwright-evidence/' + p.replace(/\//g,'_').replace(/^_/,'') + '.mobile.png';
  await page.screenshot({ path: '/home/user/worktrees/aegis-release-readiness-audit/' + fnameMobile }).catch(()=>{});
  results.push({ page: p, status, title, consoleErrors, failedRequests });
  await context.close();
}
await browser.close();
fs.writeFileSync('/home/user/worktrees/aegis-release-readiness-audit/playwright-evidence/results.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
