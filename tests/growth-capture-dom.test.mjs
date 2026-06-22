// Functional DOM verification of the growth-system capture points (jsdom).
// Executes the real footer + free-audit JS, mocks fetch, asserts payloads.
import fs from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

let failures = 0;
const ok = (c, m) => {
  console.log(`  ${c ? '✓' : '✗'} ${m}`);
  if (!c) failures++;
};

function makeDom(html, url) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', () => {}); // ignore external-script load errors (GTM/nav not fetched)
  const dom = new JSDOM(html, {
    url,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const calls = [];
  dom.window.fetch = (u, opts) => {
    calls.push({ u, opts });
    return Promise.resolve({ ok: true, status: 201 });
  };
  return { dom, calls };
}
const dispatch = (win, el, type) =>
  el.dispatchEvent(new win.Event(type, { bubbles: true, cancelable: true }));
const wait = () => new Promise((r) => setTimeout(r, 20));

// ---- 1. Footer newsletter band ----
console.log('Footer newsletter (ironclad-footer.js):');
{
  const js = fs.readFileSync('dws10.com/shared-assets/footer/ironclad-footer.js', 'utf8');
  const { dom, calls } = makeDom(
    '<!doctype html><html lang="en"><body></body></html>',
    'https://dws10.com/',
  );
  const { window } = dom;
  window.eval(js); // registers DOMContentLoaded listener
  await wait(); // let jsdom fire DOMContentLoaded -> init() injects footer

  const band = window.document.querySelector('.ironclad-footer-news');
  ok(!!band, 'newsletter band injected into footer');
  const form = window.document.getElementById('ironclad-news-form');
  const input = form && form.querySelector('input[type=email]');
  ok(!!input, 'email input present');

  // invalid email -> no fetch, error message
  input.value = 'not-an-email';
  await dispatch(window, form, 'submit');
  await wait();
  ok(calls.length === 0, 'invalid email blocked (no network call)');
  ok(
    window.document.getElementById('ironclad-news-msg').className.includes('err'),
    'invalid email shows error',
  );

  // valid email -> fetch to web_leads with source newsletter
  input.value = 'buyer@acme.eu';
  await dispatch(window, form, 'submit');
  await wait();
  ok(calls.length === 1, 'valid email triggers one fetch');
  const c = calls[0] || {};
  ok(String(c.u).endsWith('/rest/v1/web_leads'), 'POSTs to /rest/v1/web_leads');
  const body = c.opts && JSON.parse(c.opts.body);
  ok(body && body.source === 'newsletter', 'payload source = newsletter');
  ok(body && body.email === 'buyer@acme.eu', 'payload carries email');
  ok(body && body.consent === true, 'payload records consent');
  ok(
    window.document.getElementById('ironclad-news-msg').className.includes('ok'),
    'success message shown',
  );
}

// ---- 2. Free-audit page ----
console.log('\nFree-audit page (/free-audit/index.html):');
{
  const html = fs.readFileSync('dws10.com/free-audit/index.html', 'utf8');
  const { dom, calls } = makeDom(html, 'https://dws10.com/free-audit/');
  const { window } = dom;
  await wait(); // let inline scripts wire up

  const form = window.document.getElementById('fa-form');
  ok(!!form, 'audit form present');

  // missing required fields -> blocked
  await dispatch(window, form, 'submit');
  await wait();
  ok(calls.length === 0, 'empty form blocked (no network call)');

  // fill valid -> fetch with source free_audit + industry
  window.document.getElementById('fa-name').value = 'Jane Buyer';
  window.document.getElementById('fa-email').value = 'jane@steelco.eu';
  window.document.getElementById('fa-industry').value = 'Iron & Steel';
  await dispatch(window, form, 'submit');
  await wait();
  ok(calls.length === 1, 'valid form triggers one fetch');
  const c = calls[0] || {};
  ok(String(c.u).endsWith('/rest/v1/web_leads'), 'POSTs to /rest/v1/web_leads');
  const body = c.opts && JSON.parse(c.opts.body);
  ok(body && body.source === 'free_audit', 'payload source = free_audit');
  ok(body && body.industry === 'Iron & Steel', 'payload carries industry');
  ok(
    Array.isArray(window.dataLayer) && window.dataLayer.some((e) => e.event === 'lead_free_audit'),
    'GTM lead_free_audit event pushed',
  );
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
