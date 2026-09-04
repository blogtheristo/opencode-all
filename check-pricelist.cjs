const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://dws10.com/price-list/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);
  
  const html = await page.content();
  
  const docVersion = html.match(/dws-doc-version" content="([^"]+)"/)?.[1];
  const headerVersion = html.match(/Version: ([0-9.]+)/)?.[1];
  const jsCheck = html.match(/publicProducts\.length !== (\d+)/)?.[1];
  const portfolioNote = html.match(/contains (\d+) non-BLUE/)?.[1];
  
  console.log('=== LIVE dws10.com/price-list/ ===');
  console.log('dws-doc-version meta:', docVersion || 'NOT FOUND');
  console.log('Header Version:', headerVersion || 'NOT FOUND');
  console.log('Portfolio note count:', portfolioNote || 'NOT FOUND');
  console.log('JS product count check:', jsCheck || 'NOT FOUND');
  
  const errorDiv = await page.$('.error');
  if (errorDiv) {
    const errorText = await errorDiv.textContent();
    console.log('JS ERROR on page:', errorText.trim());
  } else {
    console.log('JS status: NO ERROR');
  }
  
  const productRows = await page.$$('.price-table tbody tr');
  console.log('Rendered product rows:', productRows.length);
  
  const jsonResp = await page.evaluate(async () => {
    try {
      const r = await fetch('/config/products.json', { cache: 'no-store' });
      const d = await r.json();
      return {
        version: d.priceList?.version,
        total: Object.keys(d.products || {}).length,
        blue: Object.values(d.products || {}).filter(p => p.deploymentColor === 'blue').length,
        serious: d.commercialPortfolio?.seriousProductIds?.length
      };
    } catch(e) { return { error: e.message }; }
  });
  console.log('products.json via JS fetch:', JSON.stringify(jsonResp));
  
  await page.goto('https://lifetime.fi/price-list/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  const lfHtml = await page.content();
  const lfVersion = lfHtml.match(/dws-doc-version" content="([^"]+)"/)?.[1];
  const lfHeader = lfHtml.match(/id="version">([^<]+)/)?.[1];
  console.log('\n=== LIVE lifetime.fi/price-list/ ===');
  console.log('dws-doc-version meta:', lfVersion || 'NOT FOUND');
  console.log('Header version:', lfHeader || 'NOT FOUND');
  
  await browser.close();
})();
