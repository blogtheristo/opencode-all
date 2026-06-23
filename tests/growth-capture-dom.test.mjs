/**
 * Functional DOM tests for the growth-system lead-capture points.
 * Executes the real footer + free-audit JS in jsdom, mocks fetch, and asserts
 * validation, the web_leads payload, consent, and the GTM conversion event.
 */
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
import { describe, expect, it } from 'vitest';

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

describe('footer newsletter capture (ironclad-footer.js)', () => {
  async function setup() {
    const js = readFileSync('dws10.com/shared-assets/footer/ironclad-footer.js', 'utf8');
    const { dom, calls } = makeDom(
      '<!doctype html><html lang="en"><body></body></html>',
      'https://dws10.com/',
    );
    dom.window.eval(js); // registers DOMContentLoaded listener
    await wait(); // let jsdom fire DOMContentLoaded -> init() injects footer
    return { window: dom.window, calls };
  }

  it('injects the newsletter band with an email field', async () => {
    const { window } = await setup();
    expect(window.document.querySelector('.ironclad-footer-news')).toBeTruthy();
    expect(window.document.querySelector('#ironclad-news-form input[type=email]')).toBeTruthy();
  });

  it('blocks an invalid email without a network call', async () => {
    const { window, calls } = await setup();
    const form = window.document.getElementById('ironclad-news-form');
    form.querySelector('input[type=email]').value = 'not-an-email';
    await dispatch(window, form, 'submit');
    await wait();
    expect(calls).toHaveLength(0);
    expect(window.document.getElementById('ironclad-news-msg').className).toContain('err');
  });

  it('posts a valid email to web_leads with source=newsletter and consent', async () => {
    const { window, calls } = await setup();
    const form = window.document.getElementById('ironclad-news-form');
    form.querySelector('input[type=email]').value = 'buyer@acme.eu';
    await dispatch(window, form, 'submit');
    await wait();
    expect(calls).toHaveLength(1);
    expect(String(calls[0].u)).toMatch(/\/rest\/v1\/web_leads$/);
    const body = JSON.parse(calls[0].opts.body);
    expect(body.source).toBe('newsletter');
    expect(body.email).toBe('buyer@acme.eu');
    expect(body.consent).toBe(true);
    expect(window.document.getElementById('ironclad-news-msg').className).toContain('ok');
  });
});

describe('free-audit lead magnet (/free-audit/index.html)', () => {
  function setup() {
    const html = readFileSync('dws10.com/free-audit/index.html', 'utf8');
    return makeDom(html, 'https://dws10.com/free-audit/');
  }

  it('blocks an empty submission without a network call', async () => {
    const { dom, calls } = setup();
    await wait();
    const form = dom.window.document.getElementById('fa-form');
    await dispatch(dom.window, form, 'submit');
    await wait();
    expect(calls).toHaveLength(0);
  });

  it('posts a valid request to web_leads with source=free_audit and fires the GTM event', async () => {
    const { dom, calls } = setup();
    await wait();
    const { window } = dom;
    window.document.getElementById('fa-name').value = 'Jane Buyer';
    window.document.getElementById('fa-email').value = 'jane@steelco.eu';
    window.document.getElementById('fa-industry').value = 'Iron & Steel';
    await dispatch(window, window.document.getElementById('fa-form'), 'submit');
    await wait();
    expect(calls).toHaveLength(1);
    expect(String(calls[0].u)).toMatch(/\/rest\/v1\/web_leads$/);
    const body = JSON.parse(calls[0].opts.body);
    expect(body.source).toBe('free_audit');
    expect(body.industry).toBe('Iron & Steel');
    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(window.dataLayer.some((e) => e.event === 'lead_free_audit')).toBe(true);
  });
});
