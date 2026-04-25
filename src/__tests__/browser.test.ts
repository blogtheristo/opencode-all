/**
 * Browser Utility Tests
 *
 * Validates the URL guard and the page-orchestration shape without launching
 * a real Chromium binary — Playwright is mocked. This keeps CI fast and
 * avoids requiring `npx playwright install` in the test environment.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- Playwright mock ------------------------------------------------------
// `withPage` does `await import('playwright')`, so we intercept that.
const goto = vi.fn(async () => ({ status: () => 200 }));
const content = vi.fn(async () => '<html><body>hi</body></html>');
const title = vi.fn(async () => 'Example');
const url = vi.fn(() => 'https://example.com/final');
const screenshot = vi.fn(async () => Buffer.from('PNGBYTES'));
const accessibilitySnapshot = vi.fn(async () => ({
  role: 'WebArea',
  name: '',
  children: [
    { role: 'heading', name: 'Welcome', level: 1 },
    { role: 'link', name: 'About' },
  ],
}));
const setDefaultNavigationTimeout = vi.fn();
const newPage = vi.fn(async () => ({
  goto,
  content,
  title,
  url,
  screenshot,
  accessibility: { snapshot: accessibilitySnapshot },
  setDefaultNavigationTimeout,
}));
const close = vi.fn();
const newContext = vi.fn(async () => ({ newPage, close }));
const launch = vi.fn(async () => ({ newContext, close }));

vi.mock('playwright', () => ({
  chromium: { launch },
}));

// Import AFTER the mock is registered.
import { browseFetch, browseScreenshot, browseSnapshot } from '../utils/browser.js';

beforeEach(() => {
  goto.mockClear();
  content.mockClear();
  title.mockClear();
  screenshot.mockClear();
  accessibilitySnapshot.mockClear();
  newPage.mockClear();
  newContext.mockClear();
  launch.mockClear();
  close.mockClear();
});

describe('browser util — URL validation', () => {
  it('rejects non-http(s) URLs', async () => {
    await expect(browseFetch('file:///etc/passwd')).rejects.toThrow(/Only http\(s\)/);
    await expect(browseFetch('javascript:alert(1)')).rejects.toThrow(/Only http\(s\)/);
    await expect(browseScreenshot('ftp://example.com')).rejects.toThrow(/Only http\(s\)/);
    await expect(browseSnapshot('not a url')).rejects.toThrow(/Invalid URL/);
  });

  it('accepts http and https URLs', async () => {
    await expect(browseFetch('https://example.com')).resolves.toBeDefined();
    await expect(browseFetch('http://example.com')).resolves.toBeDefined();
  });
});

describe('browseFetch', () => {
  it('returns rendered HTML, title, status, and final URL', async () => {
    const result = await browseFetch('https://example.com');
    expect(result.url).toBe('https://example.com');
    expect(result.finalUrl).toBe('https://example.com/final');
    expect(result.status).toBe(200);
    expect(result.title).toBe('Example');
    expect(result.html).toContain('hi');
    expect(typeof result.durationMs).toBe('number');
  });

  it('always closes the browser, even on error', async () => {
    goto.mockRejectedValueOnce(new Error('net::ERR'));
    await expect(browseFetch('https://example.com')).rejects.toThrow('net::ERR');
    expect(close).toHaveBeenCalled();
  });
});

describe('browseScreenshot', () => {
  it('returns base64-encoded PNG bytes and viewport size', async () => {
    const result = await browseScreenshot('https://example.com', { width: 800, height: 600 });
    expect(result.pngBase64).toBe(Buffer.from('PNGBYTES').toString('base64'));
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
  });
});

describe('browseSnapshot', () => {
  it('flattens the accessibility tree to {role,name,level} nodes', async () => {
    const result = await browseSnapshot('https://example.com');
    expect(result.title).toBe('Example');
    expect(result.nodes).toEqual([
      { role: 'heading', name: 'Welcome', level: 1 },
      { role: 'link', name: 'About' },
    ]);
  });
});
