# Aegis — Playwright Browser Report (Phase 2)

Chromium: `/opt/pw-browsers/chromium` (pinned, per instructions — installed `playwright` npm package is 1.59.1 vs `package.json`'s `^1.49.0`, so the pinned binary was used explicitly rather than `playwright install`).
Server: `npx http-server dws10.com -p 8099 -s` (static file server against the worktree's own `dws10.com/` tree — this is a real static-site smoke test, not a mock; the marketing site has no backend dependency).
Script: `pw-smoke.mjs` (repo root of the worktree).
Evidence: `playwright-evidence/` — screenshots (desktop 1280×full-page, mobile 390×844) for every page, plus `results-prefix.json` (pre-fix run) and `results-postfix.json` (post-fix run).

## Pages covered

`/aegis/index.html`, `/aegis/index.fi.html`, `/aegis/index.de.html`, `/aegis/index.fr.html`, `/aegis/index.sv.html`, `/aegis/hackathlon.html`, `/products/aegis.html`.

## What this environment could and could not test

This sandbox's outbound network is proxied and blocks non-allowlisted external hosts (`fonts.googleapis.com`, and the site's own absolute-URL fetch of `https://dws10.com/config/products.json`, both return `ERR_TUNNEL_CONNECTION_FAILED` / `ERR_CONNECTION_RESET` here). These failures are **environment artifacts, not product bugs** — in real production the pages are served from `dws10.com` itself, so the absolute-URL fetch is same-origin and Google Fonts is reachable. I did not fabricate a substitute for these — they are visible in `results-*.json` as `failedRequests` and are called out explicitly rather than hidden. No real backend was mocked: the marketing site has no backend calls in scope other than the pricing JSON fetch, which is static.

Because of the blocked font host, `waitUntil: 'networkidle'` never resolves (a pending font request never settles) — I switched the smoke script to `waitUntil: 'load'` for the second run; the 5 index pages still hit a `load` timeout for the same reason (the browser waits on the blocked font stylesheet before firing `load`). `hackathlon.html` and `products/aegis.html` don't reference the blocked Plex-Sans URL in the same blocking way and loaded (HTTP 200) cleanly. **This means the automated run could not reach the "no console errors, page fully idle" bar for the 5 index pages in this network-restricted sandbox** — screenshots and DOM did render correctly (visible in the captured PNGs) despite the pending network calls, confirming the page itself is not broken, only this environment's proxy is restrictive.

## Result: the one real bug found and fixed

Before the fix (`results-prefix.json`), every page including `vertical-lang-bar.js` reported:

```
PAGEERROR: Unexpected identifier 'exposition'
```

This is `FINDING-01` in `CODE-QUALITY-REPORT.md` — a genuine JS syntax error, confirmed independently via `node --check`, not a sandbox artifact. After the fix (`results-postfix.json`), **no page reports a `PAGEERROR`** — only the pre-existing, environment-caused `failedRequests` (fonts, absolute-URL JSON fetch) remain, and those are unaffected by the code, present with or without a real network.

## Per-page detail

| Page                   | HTTP status                                                                               | Title correct? | PAGEERROR (pre-fix) | PAGEERROR (post-fix) | Screenshot                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------- | -------------- | ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| /aegis/index.html      | 200 (goto reports `load` timeout due to blocked font, but body rendered — see screenshot) | Yes, EN        | Yes                 | **No**               | `aegis_index.html.png` / `.mobile.png`                                                                             |
| /aegis/index.fi.html   | same                                                                                      | Yes, FI        | Yes                 | **No**               | `aegis_index.fi.html.png`                                                                                          |
| /aegis/index.de.html   | same                                                                                      | Yes, DE        | Yes                 | **No**               | `aegis_index.de.html.png`                                                                                          |
| /aegis/index.fr.html   | same                                                                                      | Yes, FR        | Yes                 | **No**               | `aegis_index.fr.html.png`                                                                                          |
| /aegis/index.sv.html   | same                                                                                      | Yes, SV        | Yes                 | **No**               | `aegis_index.sv.html.png`                                                                                          |
| /aegis/hackathlon.html | 200                                                                                       | Yes            | Yes (shared script) | **No**               | `aegis_hackathlon.html.png`                                                                                        |
| /products/aegis.html   | 200                                                                                       | Yes            | Yes (shared script) | **No**               | `products_aegis.html.png`; also shows the 404 for `/static/css/style.css` (FINDING-02, pre-existing site-wide gap) |

Language bar (`vertical-lang-bar.js`) is present as a `<script defer>` on all 7 pages, so this single fix restores it site-wide, not only on Aegis pages.

## Not tested / explicitly out of reach in this run

- **Forms:** none exist on any Aegis page (`grep -c "<form"` = 0 across all 7 files) — there is no orientation/pilot/order form embedded in the live site to test valid/missing/invalid submission against. The demo/orientation → pilot → order path lives entirely in `sales-package-v1.0/*.md`, which is not a web flow and has no browser surface to click through (see FINDING-04, no live links between the site and those docs).
- **Auth/session paths:** the Aegis marketing site has none (static, public, no login). The only authenticated surface touching "aegis" is the backend `/api/agents/aegis/execute` route, which is a JWT API endpoint, not a browser page — not testable with a UI Playwright flow without a running API server, DB, and a valid JWT, none of which are available in this worktree. **Not tested — BLOCKED, needs a running backend + credentials the HIC controls.**
- **Keyboard/accessibility deep pass:** not run beyond what the screenshots show (visible focus/skip-link behavior would need an interactive session, not a scripted screenshot). Static `alt=` audit: `dws10.com/aegis/index.html` has 0 `<img>` tags (confirmed via `grep -c "<img"` = 0), so no missing-alt-text risk on that page; other pages not separately audited for images.
- **Link status/target audit:** only same-repo relative links were checked by reading the HTML (`/dual-use/`, `/contact/`, language variants — all resolve to existing files). External links (fonts, canonical URLs) were not live-checked beyond what the proxy allowed.

## Status: **PARTIAL**

The one reproducible browser-visible bug (site-wide `PAGEERROR`) is fixed and proven fixed via before/after Playwright runs. The 5 index pages could not reach a fully clean `load`/`networkidle` state in this sandboxed network — that ceiling is a documented environment limitation, not a product defect (screenshots confirm correct rendering). Forms, auth/session, and the sales-doc portion of the demo→pilot path have no live browser surface to exercise and are marked BLOCKED, not assumed passing.
