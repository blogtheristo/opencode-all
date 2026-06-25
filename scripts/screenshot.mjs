#!/usr/bin/env node
/**
 * scripts/screenshot.mjs — standalone PNG renderer for any session.
 *
 * Why this exists: the `/browse` skill and src/utils/browser.ts route through the
 * `dws` CLI / backend MCP, which is not running in headless / remote / CI sessions.
 * This helper drives the pre-installed Chromium directly via Playwright so PNG
 * rendering works everywhere, with no backend.
 *
 * It mirrors the browse SSRF contract: private / loopback hosts are refused unless
 * BROWSE_ALLOW_PRIVATE=1 (the canonical policy lives in src/utils/url-guard.ts).
 * When --serve is used the target is your own local dir, so private access is
 * allowed automatically for that run.
 *
 * Usage:
 *   node scripts/screenshot.mjs <url|path> [options]
 *
 * Options:
 *   --out <file>        Output PNG path (default: ./screenshot.png)
 *   --serve <dir>       Serve <dir> on a local port and resolve <url|path> against it
 *   --width <n>         Viewport width (default 1280)
 *   --height <n>        Viewport height (default 900)
 *   --scale <n>         deviceScaleFactor — raise for crisp zoom (default 2)
 *   --selector <css>    Screenshot only this element (tight crop; great for zoom)
 *   --no-full           Viewport-only instead of full page
 *   --text [selector]   Also print innerText of selector (default: body) to stdout
 *   --wait <ms>         Extra settle time after load (default 600)
 *
 * Examples:
 *   node scripts/screenshot.mjs https://dws10.com/products/aegis.html --out aegis.png
 *   node scripts/screenshot.mjs /products/claude-code-coaching-fi.html \
 *        --serve dws10.com --out fi.png --scale 3 --text .container
 *   node scripts/screenshot.mjs ./local.html --selector ".hero" --out hero.png --scale 3
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

// ---- arg parsing -----------------------------------------------------------
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  console.log(
    'Usage: node scripts/screenshot.mjs <url|path> [--out f.png] [--serve dir] [--width n] [--height n] [--scale n] [--selector css] [--no-full] [--text [sel]] [--wait ms]',
  );
  process.exit(argv.length === 0 ? 1 : 0);
}
const target = argv[0];
function flag(name, def) {
  const i = argv.indexOf(name);
  if (i === -1) return def;
  const next = argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}
const opts = {
  out: flag('--out', 'screenshot.png'),
  serve: flag('--serve', null),
  width: Number(flag('--width', 1280)),
  height: Number(flag('--height', 900)),
  scale: Number(flag('--scale', 2)),
  selector: flag('--selector', null),
  full: !argv.includes('--no-full'),
  text: argv.includes('--text') ? flag('--text', 'body') : null,
  wait: Number(flag('--wait', 600)),
};

// ---- SSRF guard (mirrors src/utils/url-guard.ts policy) ---------------------
function isPrivateHost(host) {
  if (!host) return true;
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  if (h === '::1' || h === '0.0.0.0') return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false; // hostnames resolve later; we only hard-block obvious literals
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

// ---- tiny static server (only used with --serve) ---------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};
async function startStaticServer(rootDir) {
  const root = resolve(rootDir);
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let fsPath = join(root, p);
      // prevent path traversal outside root
      if (!resolve(fsPath).startsWith(root + sep) && resolve(fsPath) !== root) {
        res.writeHead(403).end('forbidden');
        return;
      }
      let s = await stat(fsPath).catch(() => null);
      if (s && s.isDirectory()) {
        fsPath = join(fsPath, 'index.html');
        s = await stat(fsPath).catch(() => null);
      }
      if (!s) {
        res.writeHead(404).end('not found');
        return;
      }
      const body = await readFile(fsPath);
      res.writeHead(200, { 'content-type': MIME[extname(fsPath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(500).end('error');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { server, port };
}

// ---- chromium executable auto-detection ------------------------------------
function detectChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!base || !existsSync(base)) return null;
  // newest chromium-<rev> dir → chrome-linux/chrome
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
  // Prefer the declared dependency (playwright), fall back to playwright-core.
  for (const mod of ['playwright', 'playwright-core']) {
    try {
      const { chromium } = await import(mod);
      return chromium;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "Neither 'playwright' nor 'playwright-core' is installed. Run `npm install` (playwright is a declared dependency).",
  );
}

// ---- main ------------------------------------------------------------------
async function main() {
  let serverHandle = null;
  let url;

  if (opts.serve) {
    serverHandle = await startStaticServer(opts.serve);
    const path = target.startsWith('/') ? target : '/' + target;
    url = `http://127.0.0.1:${serverHandle.port}${path}`;
  } else if (/^https?:\/\//i.test(target)) {
    url = target;
    const host = new URL(url).hostname;
    if (isPrivateHost(host) && process.env.BROWSE_ALLOW_PRIVATE !== '1') {
      throw new Error(
        `Refusing private/loopback host "${host}". Set BROWSE_ALLOW_PRIVATE=1 to allow, or use --serve <dir>.`,
      );
    }
  } else {
    // local file path
    url = pathToFileURL(resolve(target)).href;
  }

  const chromium = await loadChromium();
  const launchOpts = { headless: true, args: ['--no-sandbox'] };
  const exe = detectChromium();
  if (exe) launchOpts.executablePath = exe;

  let browser;
  try {
    browser = await chromium.launch(launchOpts);
  } catch (err) {
    // retry without explicit executablePath (let Playwright resolve)
    if (exe) {
      delete launchOpts.executablePath;
      browser = await chromium.launch(launchOpts);
    } else {
      throw err;
    }
  }

  const page = await browser.newPage({
    viewport: { width: opts.width, height: opts.height },
    deviceScaleFactor: opts.scale,
  });
  const resp = await page.goto(url, { waitUntil: 'networkidle' }).catch(() => null);
  if (opts.wait) await page.waitForTimeout(opts.wait);

  const outPath = resolve(opts.out);
  if (opts.selector) {
    const el = await page.$(opts.selector);
    if (!el) throw new Error(`Selector not found: ${opts.selector}`);
    await el.screenshot({ path: outPath, type: 'png' });
  } else {
    await page.screenshot({ path: outPath, fullPage: opts.full, type: 'png' });
  }

  let text = null;
  if (opts.text) {
    text = await page
      .$eval(opts.text, (e) => e.innerText)
      .catch(() => '(selector not found: ' + opts.text + ')');
  }

  await browser.close();
  if (serverHandle) serverHandle.server.close();

  console.log(
    JSON.stringify(
      {
        url,
        status: resp ? resp.status() : null,
        savedTo: outPath,
        width: opts.width,
        height: opts.height,
        scale: opts.scale,
        selector: opts.selector || null,
        chromium: exe || '(playwright-resolved)',
      },
      null,
      2,
    ),
  );
  if (text !== null) {
    console.log('\n----- text (' + opts.text + ') -----\n' + text);
  }
}

main().catch((err) => {
  console.error('screenshot.mjs error:', err.message);
  process.exit(1);
});
