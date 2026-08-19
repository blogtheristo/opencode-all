# Aegis — Code Correctness Report (Phase 1)

Branch: `claude/aegis-release-readiness-audit`
Worktree: `/home/user/worktrees/aegis-release-readiness-audit`
Commit at audit start: `0982f6b1edd873b123a69ccb609a1caa263367a5`
Date: 2026-08-19

## Scope covered

- `dws10.com/aegis/` (index.html + fi/de/fr/sv variants + hackathlon.html), `dws10.com/products/aegis.html`, and their `landing-pages/dws10-com` mirrors.
- `dws10.com/config/products.json` + mirror.
- `src/agents/aegis.agent.ts`, `src/agents/routes.ts`, `src/agents/index.ts`, `src/middleware/auth.middleware.ts`.
- `Store/PRODUCT_AEGIS.md`, `PRODUCT_AEGIS_IMPLEMENTATION.md`, `PRODUCT_AEGIS_PILOT.md`.
- `sales-package-v1.0/aegis-customer-orientation.md`, `aegis-demo-pilot-path.md`.

## Commands run (evidence)

```
npm install --no-audit --no-fund        # OK, 367 packages, EBADENGINE warning (Node 22.22.2 vs required >=24.17.0)
npx tsc -p tsconfig.json --noEmit       # 0 errors
npm run build (tsc -p tsconfig.json)    # OK, no errors
npx vitest run src/__tests__/agents/aegis-vesta.test.ts   # 1 file, 9 tests passed
node --check <every inline <script> and shared-assets JS the Aegis pages load>
```

`npm run lint` is `echo "No linter configured"` (`package.json`) — no linter exists to run. This is a repo-wide gap, not fixed here (out of scope: fixing it would be a scope expansion beyond Aegis).

## Findings

### FINDING-01 — BLOCKER — FIXED

**File:** `dws10.com/shared-assets/vertical-lang-bar.js:89` (+ mirror `landing-pages/dws10-com/shared-assets/vertical-lang-bar.js:89`)
**Observed:** Unescaped apostrophe in the French Aegis translation string (`...et l'exposition à la juridiction américaine...`) terminated the single-quoted JS string literal early, producing `SyntaxError: Unexpected identifier 'exposition'`. Verified with `node --check` on the extracted file — reproducible, not an artifact of the browser sandbox.
**Impact:** The entire `vertical-lang-bar.js` script fails to parse, so **none** of its code runs on any page that loads it — `grep -rl "vertical-lang-bar.js" dws10.com --include=*.html | wc -l` = **42 HTML files**, including all 5 Aegis language variants and `hackathlon.html`. This is the language-switcher bar shown on every marketing page; it silently disappears site-wide, not only on Aegis pages. Confirmed live via Playwright: `PAGEERROR: Unexpected identifier 'exposition'` fired on every Aegis language-bar page before the fix; gone after.
**Fix:** Escaped the apostrophe (`l\'exposition`). Re-ran `node --check` on both the root file and the landing-pages mirror — both pass. Re-ran the Playwright smoke — `PAGEERROR` no longer appears on any page.
**Test that proves the fix:** `node --check dws10.com/shared-assets/vertical-lang-bar.js` (exit 0) and `node --check landing-pages/dws10-com/shared-assets/vertical-lang-bar.js` (exit 0); `playwright-evidence/results-raw.json` shows no `PAGEERROR` entries post-fix (compare to `playwright-evidence/results.json`, the pre-fix run).
**Commit:** `233bbb37`

### FINDING-02 — HIGH — NOT FIXED (out of Aegis scope, needs deploy-config verification)

**File:** `dws10.com/products/aegis.html:45` — `<link rel="stylesheet" href="../static/css/style.css" />`
**Observed:** `dws10.com/static/css/style.css` does not exist anywhere in the repo (`find dws10.com -iname style.css` returns nothing). The reference resolves to a 404 when served statically (`Failed to load resource: 404` on `/static/css/style.css` in the Playwright smoke).
**Scope:** Not Aegis-specific — `grep -rl 'static/css/style.css' dws10.com --include=*.html | wc -l` = 50 files reference the same missing path. This is a pre-existing site-wide asset gap that happens to also break the Aegis product page's base stylesheet.
**Impact:** Unknown severity in production — if a build/CDN step generates or aliases `static/css/style.css` at deploy time (not present in this repo), production is unaffected; if not, all 50 pages including `products/aegis.html` serve without base CSS. Could not verify the deploy pipeline from this worktree (no CDN/build config for `dws10.com` static hosting found under `scripts/` beyond `sync-landing-pages.js`, which only mirrors folders, not builds CSS).
**Why not fixed:** This is a repo-wide static-hosting question outside the Aegis surface named in scope; unilaterally adding a stylesheet file/content would risk masking a real deploy-pipeline gap rather than fixing it, and touching 50 unrelated pages violates the "surgical changes" / no-scope-expansion rule.
**Recommendation:** BLOCKED pending HIC confirmation of how `dws10.com` static assets are actually built/served (CDN config, Cloudflare Pages build step, Nginx alias, etc.). If no such step exists, this is a release-blocking HIGH for the whole site, not only Aegis.

### FINDING-03 — HIGH — content/architecture, not fixed (flagged per audit instructions)

**File:** `src/agents/aegis.agent.ts` (registered as `this.register(new AegisAgent())` in `src/agents/index.ts:322`, comment: `// Vulnerability & patch SLA triage`)
**Observed:** The backend agent named `aegis` (reachable at `POST /api/agents/aegis/execute`, JWT-protected, per `src/agents/routes.ts`) is a **Vulnerability & Patch Governance Agent** — it triages Dependabot/npm-audit findings against a remediation SLA. It has no relationship to the product described in `Store/PRODUCT_AEGIS.md` — "DWS IQ Aegis: Sovereign Industrial Intelligence Platform for Dual-Use Manufacturing" — whose "Agents Included" table lists `ArgusAgent`, `SovereigntyMonitor`, `Article12Logger`, `KYA Engine`, `ComplianceAgent`. Those five agents do exist in the codebase (`src/agents/argus.agent.ts`, `sovereignty-monitor.agent.ts`, `article12-logger.ts`, `compliance.agent.ts`, `src/identity/kya-engine.ts`), but there is no single orchestrator or route named `aegis` that composes them — the name `aegis` in `src/agents/` is a same-name but unrelated internal ops tool.
**Impact:** Any engineer, integration partner, or automated caller who invokes agent `aegis` expecting the marketed product's behavior (orbital intelligence, sovereignty scoring, Article 12 logging, dual-use compliance) gets vulnerability-SLA triage instead — a functional mismatch between the sales/product documentation and the only backend entity that shares the product's name. This is a naming collision that will cause real confusion in API consumption, onboarding, and any future "run the Aegis agent" automation.
**Fix not applied:** Renaming `AegisAgent` is a functioning, tested internal security tool (9 passing tests) used elsewhere (`src/agents/consultant/*` reference "air-gapped Aegis" in comments, suggesting deliberate reuse of the name for edge/air-gap tooling) — renaming it is a behavior change beyond "audit and fix correctness" and risks breaking whatever currently calls it by that name. Flagging as a content/naming BLOCKER for HIC decision: either (a) rename `AegisAgent` → e.g. `PatchGovernanceAgent` and free the `aegis` slot, or (b) add explicit product documentation distinguishing "Aegis (product)" from "aegis (internal SLA-triage agent)".

### FINDING-04 — MEDIUM — not fixed

**File:** `dws10.com/aegis/hackathlon.html`
**Observed:** No page under `dws10.com/aegis/` or `dws10.com/products/aegis.html` links to `hackathlon.html`; it is reachable only by direct URL. `sales-package-v1.0/aegis-customer-orientation.md` and `aegis-demo-pilot-path.md` do not reference the live site at all (no `dws10.com/aegis` URLs found in either file).
**Impact:** The demo/orientation → pilot → order path described in scope has no actual hyperlinked path from the public Aegis site to the orientation/pilot sales documents, or vice versa — they are two disconnected systems (static site vs. sales-package markdown) with no cross-linking. A prospect reading the live site has no way to reach the orientation → pilot flow from it.
**Fix not applied:** Adding navigation would be a content/scope decision (what to link, in what language, where) beyond a mechanical bug fix — flagged for HIC.

### FINDING-05 — LOW — informational, not fixed

**Observed:** `package.json` requires Node `>=24.17.0`; this environment runs Node `v22.22.2` (`npm warn EBADENGINE`). `npm run lint` is a no-op stub. Neither blocks build/typecheck/test, which all passed on Node 22, but CI/production Node-version mismatch should be confirmed by the HIC before release.

## Verified consistent (no finding)

- **Dual-folder sync:** `diff -q` of every Aegis HTML file, `products/aegis.html`, and `config/products.json` between `dws10.com/` and `landing-pages/dws10-com/` — all byte-identical (pre-fix; re-verified post-fix for the one file changed).
- **Pricing:** `dws10.com/config/products.json` SKUs `DWS-AEGIS-001` (€59,990 + €999/1,999/4,999 mo tiers), `DWS-AEGIS-PILOT-001` (€19,990), `DWS-AEGIS-IMPL-001` (€45,000) match `Store/PRODUCT_AEGIS*.md` frontmatter and match the prices rendered in `dws10.com/aegis/index.html` (`&euro;59,990`, `&euro;999/mo`, `&euro;1,999/mo`, `&euro;4,999/mo`).
- **Internal links** on `aegis/index.html` (`/dual-use/`, `/contact/`, language variants) all resolve to existing files.
- **No debug artifacts:** no `console.log`/`debugger` statements in the Aegis HTML files.
- **TypeScript build/typecheck:** clean, 0 errors.
- **Auth:** `POST /api/agents/:name/execute` is gated by `authenticateToken` (JWT, Redis-blacklist aware) and `express-validator` input validation (`projectId`, `sessionId`, `context`, `input` required) plus a 30 req/min rate limiter — standard, no gaps found in this route for the `aegis` agent specifically.

## Status: **PARTIAL**

Typecheck, build, and the aegis-scoped unit tests are green. One BLOCKER (site-wide JS syntax error) was found and fixed with a proof-of-fix. Two HIGH findings (missing stylesheet asset, agent-name collision) remain open — one requires deploy-pipeline information this worktree cannot see, the other requires an HIC naming decision. Proceeding to Phase 2 with these two HIGHs carried forward as open blockers.
