/**
 * Browser Utility — Playwright wrapper for DWS agents
 *
 * Generic, agent-facing browser capability. Three operations:
 *   - fetch:      navigate + return rendered HTML and final URL
 *   - screenshot: navigate + return PNG bytes (base64 in JSON output)
 *   - snapshot:   navigate + return accessibility tree (text + role for each node)
 *
 * Consumers: regulatory-radar, competitor-surveillance, seo-audit,
 * `/browse` skill, MCP tools (dws_browse_*), CLI (`dws browse`).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy
 * Branch: claude/add-playwright-implementation-Rg5Jy
 * Date: 2026-04-25
 * Owner: DWS IQ Platform
 *
 * Security:
 *   - Only http(s) URLs are accepted (validated at the boundary).
 *   - Browser launched with no shared state per call (fresh context).
 *   - Hard navigation timeout (30s) prevents hanging agents.
 *   - Returned HTML is NOT executed — agents parse it as untrusted input.
 */

import type { Browser, BrowserContext, Page } from 'playwright';

const NAV_TIMEOUT_MS = 30_000;
const DEFAULT_VIEWPORT = { width: 1280, height: 800 };
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; DWS-IQ-Agent/1.0; +https://dws10.com)';

export interface BrowseFetchResult {
  url: string;
  finalUrl: string;
  status: number | null;
  title: string;
  html: string;
  durationMs: number;
}

export interface BrowseScreenshotResult {
  url: string;
  finalUrl: string;
  pngBase64: string;
  width: number;
  height: number;
  durationMs: number;
}

export interface BrowseSnapshotNode {
  role: string;
  name: string;
  level?: number;
}

export interface BrowseSnapshotResult {
  url: string;
  finalUrl: string;
  title: string;
  nodes: BrowseSnapshotNode[];
  durationMs: number;
}

function assertHttpUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Only http(s) URLs are allowed, got: ${parsed.protocol}`);
  }
}

async function withPage<T>(
  fn: (page: Page) => Promise<T>,
  opts: { viewport?: { width: number; height: number } } = {},
): Promise<T> {
  // Lazy import so the module is loadable in environments where Playwright
  // browsers are not installed (e.g., CI unit tests that mock this util).
  const { chromium } = await import('playwright');
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: opts.viewport ?? DEFAULT_VIEWPORT,
      userAgent: DEFAULT_USER_AGENT,
    });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    return await fn(page);
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

export async function browseFetch(url: string): Promise<BrowseFetchResult> {
  assertHttpUrl(url);
  const start = Date.now();
  return withPage(async (page) => {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const title = await page.title();
    return {
      url,
      finalUrl: page.url(),
      status: response?.status() ?? null,
      title,
      html,
      durationMs: Date.now() - start,
    };
  });
}

export async function browseScreenshot(
  url: string,
  viewport: { width: number; height: number } = DEFAULT_VIEWPORT,
): Promise<BrowseScreenshotResult> {
  assertHttpUrl(url);
  const start = Date.now();
  return withPage(
    async (page) => {
      await page.goto(url, { waitUntil: 'networkidle' });
      const buf = await page.screenshot({ fullPage: true, type: 'png' });
      return {
        url,
        finalUrl: page.url(),
        pngBase64: buf.toString('base64'),
        width: viewport.width,
        height: viewport.height,
        durationMs: Date.now() - start,
      };
    },
    { viewport },
  );
}

export async function browseSnapshot(url: string): Promise<BrowseSnapshotResult> {
  assertHttpUrl(url);
  const start = Date.now();
  return withPage(async (page) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    // Flatten the accessibility tree to a list of (role, name) pairs.
    // Agents use this to locate elements without parsing raw HTML.
    type AxNode = { role?: string; name?: string; level?: number; children?: AxNode[] };
    const root = (await page.accessibility.snapshot({ interestingOnly: true })) as AxNode | null;
    const nodes: BrowseSnapshotNode[] = [];
    const walk = (n: AxNode | null): void => {
      if (!n) return;
      if (n.role && (n.name || n.role === 'heading')) {
        nodes.push({
          role: n.role,
          name: n.name ?? '',
          ...(typeof n.level === 'number' ? { level: n.level } : {}),
        });
      }
      for (const c of n.children ?? []) walk(c);
    };
    walk(root);
    return {
      url,
      finalUrl: page.url(),
      title,
      nodes,
      durationMs: Date.now() - start,
    };
  });
}
