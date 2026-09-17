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
 * Code-Version: 1.1.0
 * Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy
 * Branch: claude/add-playwright-implementation-Rg5Jy
 * Date: 2026-04-25
 * Owner: DWS IQ Platform
 *
 * Security:
 *   - Only http(s) URLs are accepted (validated at the boundary).
 *   - SSRF defense: assertPublicUrl() blocks private / loopback / link-local /
 *     cloud-metadata IP ranges, BOTH for the user-supplied URL AND for any
 *     redirect / sub-resource Chromium tries to load (via page.route).
 *   - Browser launched with no shared state per call (fresh context).
 *   - Hard navigation timeout (30s) prevents hanging agents.
 *   - Returned HTML is NOT executed — agents parse it as untrusted input.
 */

import type { Browser, BrowserContext, Page, Route } from 'playwright';
import { assertPublicUrl, SsrfBlockedError } from './url-guard.js';

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

interface AccessibilitySnapshotNode {
  role?: string;
  name?: string;
  level?: number;
  children?: AccessibilitySnapshotNode[];
}

interface LegacyAccessibilityPage {
  accessibility?: {
    snapshot?: () => Promise<AccessibilitySnapshotNode | null | undefined>;
  };
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

    // SSRF defense layer 2: re-check every request Chromium makes,
    // including redirects, iframes, and sub-resources. The pre-goto
    // assertPublicUrl() check covers the user-supplied URL; this
    // catches anything Chromium tries to fetch afterwards.
    await page.route('**/*', async (route: Route) => {
      const requestUrl = route.request().url();
      try {
        await assertPublicUrl(requestUrl);
        await route.continue();
      } catch (err) {
        if (err instanceof SsrfBlockedError) {
          await route.abort('blockedbyclient');
        } else {
          await route.abort('failed');
        }
      }
    });

    return await fn(page);
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

export async function browseFetch(url: string): Promise<BrowseFetchResult> {
  await assertPublicUrl(url);
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
  await assertPublicUrl(url);
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
  await assertPublicUrl(url);
  const start = Date.now();
  return withPage(async (page) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    let nodes: BrowseSnapshotNode[];

    if (typeof page.locator === 'function') {
      // Flatten semantic DOM elements to a list of (role, name) pairs.
      nodes = await page
        .locator('h1, h2, h3, h4, h5, h6, button, a, input, textarea, select, [role]')
        .evaluateAll((elements) =>
          elements
            .map((el) => {
              const tagName = el.tagName.toLowerCase();
              const role =
                el.getAttribute('role') || (/^h[1-6]$/.test(tagName) ? 'heading' : tagName);
              const name = (el.textContent || el.getAttribute('aria-label') || '').trim();
              const level =
                role === 'heading' && /^h[1-6]$/.test(tagName)
                  ? Number(tagName.substring(1))
                  : undefined;
              return { role, name, ...(level !== undefined ? { level } : {}) };
            })
            .filter((n) => n.name || n.role === 'heading'),
        );
    } else {
      const legacyPage = page as Page & LegacyAccessibilityPage;
      const snapshot = await legacyPage.accessibility?.snapshot?.();
      nodes = flattenAccessibilitySnapshot(snapshot);
    }

    return {
      url,
      finalUrl: page.url(),
      title,
      nodes,
      durationMs: Date.now() - start,
    };
  });
}

function flattenAccessibilitySnapshot(
  root: AccessibilitySnapshotNode | null | undefined,
): BrowseSnapshotNode[] {
  if (!root) {
    return [];
  }

  const nodes: BrowseSnapshotNode[] = [];
  const stack: AccessibilitySnapshotNode[] = [...(root.children || [])];

  while (stack.length > 0) {
    const node = stack.shift();
    if (!node) {
      continue;
    }

    if (node.role && (node.name || node.role === 'heading')) {
      nodes.push({
        role: node.role,
        name: node.name || '',
        ...(node.level !== undefined ? { level: node.level } : {}),
      });
    }

    if (node.children?.length) {
      stack.unshift(...node.children);
    }
  }

  return nodes;
}
