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

---

## Addendum — 2026-08-19: Aegis component inventory + orchestrator build

FINDING-03 above is resolved: `src/agents/aegis.agent.ts` was renamed to
`src/agents/vuln-patch-sla-triage.agent.ts` / `VulnPatchSlaTriageAgent` /
registry id `vuln-patch-sla-triage` (commit `4a8d4941`), freeing the `aegis`
name for the real product agent below.

### Component inventory (read against actual code, not doc claims)

Store/PRODUCT_AEGIS.md's "Agents Included" table names five core components.
Each was checked by reading the file, not by trusting the doc or prior
report text.

| Component          | Claim in doc                         | Finding                                                                                                                                                                                                                                                                                                                                                                | File                                      |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Argus              | "Live" (orbital SAR labeling)        | **Real, working code.** 756-line `ArgusAgent extends BaseAgent`, full `execute()`, SAR/AOI pipeline logic, no TODO/stub markers.                                                                                                                                                                                                                                       | `src/agents/argus.agent.ts`               |
| SovereigntyMonitor | "Live"                               | **Real, working code.** 614-line `SovereigntyMonitorAgent extends BaseAgent`, scoring across weighted dimensions, tier classification, no TODO/stub markers.                                                                                                                                                                                                           | `src/agents/sovereignty-monitor.agent.ts` |
| Article12Logger    | "Live"                               | **Real, working code**, but requires a live `INTERNAL_DB_URL` Postgres connection to function — throws at construction time if unset. 188 lines, two-phase pre-flight/post-flight audit write, no TODO/stub markers. Not previously wired into any agent named `aegis`.                                                                                                | `src/agents/article12-logger.ts`          |
| KYA Engine         | "Live" (part of the governance loop) | **Real, working code.** `src/identity/kya-engine.ts` implements the Shanghai Model policy engine (`evaluateSignal`) mapping Shufti AML webhook signals to `UPDATE_SCORE` / `TERMINATE_CHAIN` / `REVAL_LEASH`. Separate `kya-standard-conformance.test.ts` exists and is in the passing suite. Not orchestrated by anything named `aegis` prior to this session.        | `src/identity/kya-engine.ts`              |
| ComplianceAgent    | "Live"                               | **Real, working code.** 580-line `ComplianceAgent extends BaseAgent` (dual-use export control + EU climate compliance gaps), no TODO/stub markers except two explicit doc-string gap notes (`'Carbon reporting not implemented'`, `'EU AI Act Article 12 automatic logging not implemented'` — these are _findings the agent itself reports_, not missing agent code). | `src/agents/compliance.agent.ts`          |

**Correction to the task brief's premise:** all five documented Aegis
components already existed as real, non-stub code before this session. What
did **not** exist was a single agent, registered under the `aegis` name,
that composed them into one entry point — that name was occupied by the
unrelated vulnerability-triage tool (FINDING-03). The task was therefore
"build the orchestrator and close the HIC-control gaps," not "build five
components from nothing."

### What was built this session

- **`src/agents/aegis.agent.ts`** — `AegisAgent extends BaseAgent`, registered
  in `src/agents/index.ts` as `this.register(new AegisAgent())`, id `aegis`.
  Composes `ArgusAgent`, `SovereigntyMonitorAgent`, `ComplianceAgent` per
  action (`orbital-intelligence` / `sovereignty` / `compliance` / `assess`).
  Scoped strictly to the product doc's "Live" row — the Physical
  perception/action layer (Planned, 2026 Q4) is not implemented.
- **Replay/nonce protection** — `sha256(sessionId + action + JSON(input))`
  fingerprint, rejected on repeat within the same process.
  **LIMITATION (PARTIAL, not PASS):** in-memory `Set`, per-process only —
  does not survive a restart or dedupe across horizontally scaled
  instances. A durable store (Redis/Postgres) is required for production.
- **Tamper-evident audit chain** — `AegisAgent.getAuditChain()` /
  `verifyAuditChain()`, SHA-256 hash-chained entries (`prevHash` linkage),
  exposed via `action: 'audit-chain'`. Verified in
  `src/__tests__/agents/aegis.test.ts` including a positive tamper-detection
  test (mutating a stored entry breaks `verifyAuditChain()`).
  **LIMITATION (PARTIAL, not PASS):** in-memory, per-process — does not
  survive a restart. Durable, cross-restart tamper-evidence for the
  platform-wide claim still depends on `Article12Logger`'s Postgres store.
- **Best-effort Article 12 logging** — `AegisAgent` calls
  `Article12Logger.logPreFlight`/`logPostFlight` (via `scrubObject()` for
  the required `ScrubManifest`) on every composed execution. In this
  sandbox `INTERNAL_DB_URL` is unset, so this call throws by design; Aegis
  catches it, marks `metadata.article12.logged = false` with the error, and
  still returns the sub-agent results and local audit-chain entry —
  **BLOCKED in this environment** (no reachable Postgres), **implemented
  and wired** in code for a production environment where `INTERNAL_DB_URL`
  is set.
- **`src/__tests__/agents/aegis.test.ts`** — 9 deterministic unit tests
  (routing, replay rejection, cross-session non-collision, audit-chain
  build + verify, tamper detection, Article-12 degraded-mode flag,
  `audit-chain` action). No LLM mocking required — sub-agent LLM calls fall
  back to `BaseAgent`'s documented "no provider configured" placeholder
  path in this environment, same pattern as
  `vuln-patch-sla-triage-vesta.test.ts`.

### Still open / BLOCKED

- **Article 12 persistence** — requires a live `INTERNAL_DB_URL` Postgres
  instance not available in this sandbox. Code path exists and is tested
  for its degraded-mode behavior; the actual write was never exercised
  end-to-end here.
- **Durable replay/audit-chain store** — current implementation is
  in-memory/per-process by design (no Redis/Postgres credential available
  here to build against). Flagged PARTIAL in both this report and
  `HIC-REPORT.md`; not claimed as PASS.
- **Offline/degraded control-room mode** (network-independent operation
  described in `Store/PRODUCT_AEGIS.md`) — out of scope for this backend
  orchestrator; that is an edge-deployment/infrastructure requirement, not
  something a Node.js agent class can satisfy on its own. Remains BLOCKED,
  see `HIC-REPORT.md` addendum.

### Verification run this session

```
npx tsc --noEmit -p .        # 0 errors
npm run build                # clean (tsc -p tsconfig.json)
npx vitest run src/__tests__/agents/aegis.test.ts   # 9 passed
npx vitest run src/__tests__                         # 1176 passed, 1 pre-existing
                                                       # unrelated failure
                                                       # (agent-registry.test.ts,
                                                       # confirmed present on
                                                       # this branch BEFORE this
                                                       # session's changes via
                                                       # git stash), 3 skipped
```

---

## Addendum — 2026-08-19 (session 2): durable store built, live-DB write path proven locally

HIC scope decision (19.08.2026): close the two BLOCKED items above that
depend on a database — durable replay/audit-chain store and live
Article12Logger persistence — targeting DGX Spark as the deployment.
Offline/degraded control-room mode stays BLOCKED, explicitly out of scope
(see `RELEASE-READINESS.md` and `HIC-REPORT.md` addenda for the full
boundary statement — do not treat this session's networked-cloud
resilience work as edge/offline readiness).

### New code

- **`src/agents/aegis-durable-store.ts`** — replaces the in-memory
  `Set`/`Array` on `AegisAgent` with a Postgres-backed store
  (`aegis_audit_chain`), same hash-chain formula, reserve/finalize two-phase
  API (replay-check before side-effecting work runs; hash computed once the
  result summary is known). Falls back to the old in-memory behavior,
  flagged `durable: false`, if Postgres is unreachable at any point.
- **`infrastructure/dgx-spark/migrations/023_aegis_audit_chain.sql`** — new
  table, following the same append-only/column-scoped-GRANT convention as
  `019_command_audit_log.sql` and `021_fix_partial_runs_article12.sql`.
- **`infrastructure/dgx-spark/docker-compose.yml`** — added the `dws-postgres`
  service block that a prior session's changelog entry (v1.4.0) had claimed
  already existed but did not; `dws-backend`/`dws-cron` now genuinely
  `depends_on` it. `.env.example` updated with the required vars.
- **`src/agents/aegis.agent.ts`** — updated to use the new store; the static
  `getAuditChain()`/`verifyAuditChain()` accessors are now `async` (callers
  in `src/__tests__/agents/aegis.test.ts` updated to `await` them — no
  behavioral change to the 9 original tests, all still pass).

### Real evidence, not mocked

This session's sandbox had PostgreSQL 16 and Redis installed locally with
root access — used to run all new tests against a **real** database with
the **exact production schema** applied, rather than mocking `pg`:

- `src/__tests__/agents/aegis-durable-store.test.ts` — 7/7 passing:
  process-restart survival, durable replay rejection across store
  instances, tamper detection via a raw SQL `UPDATE`, concurrency safety
  (two instances reserving simultaneously never fork the chain — this test
  caught and drove the fix for a real race-condition bug, see below),
  graceful degradation on an unreachable DB, a mid-operation failure that
  still preserves the entry, and automatic recovery after an outage.
- `src/__tests__/agents/article12-logger.test.ts` — 4/4 passing: real
  `logPreFlight()`/`logPostFlight()` writes against the production
  `article12_audit_log` schema, the DB-level `decision_summary` length
  `CHECK` constraint, and the `PUBLIC` cannot `UPDATE`/`DELETE`/`TRUNCATE`
  grants verified against the live catalog via `has_table_privilege()`.

**Bug found and fixed:** the first design resolved a new entry's `prevHash`
at reservation time from the "last row"; under concurrency this let two
reservations racing ahead of their completions both link to the same
not-yet-finished row and fork the chain — caught live by the new
concurrency test (it failed until fixed). Fixed by resolving `prevHash` at
completion time instead, under a Postgres advisory lock, from the last row
that has actually finished — not the last one merely reserved.

### Still open / BLOCKED

- **Article 12 persistence — DGX Spark run** — the write path is now
  proven against the production schema on a local Postgres, but not yet
  against DGX Spark's actual `dws-postgres` container over the real
  `dws-network`. Marked **BLOCKED-IN-SANDBOX** for that specific half —
  exact verification command in `RELEASE-READINESS.md`.
- **Durable replay/audit-chain store — DGX Spark run** — same caveat:
  proven locally, DGX-specific run pending.
- **Offline/degraded control-room mode** — unchanged, explicitly out of
  scope this session per the HIC's 19.08.2026 decision. Remains BLOCKED.
  This session's Postgres-outage fallback/recovery testing is networked-
  cloud resilience, not edge/offline readiness — do not conflate the two.

### Verification run this session

```
npx tsc --noEmit -p .        # 0 errors
npm run build                # clean
npx vitest run src/__tests__/agents/aegis.test.ts   # 9 passed (degraded mode, no DB)
AEGIS_DURABILITY_TEST_DB_URL="postgres://<test-role>@127.0.0.1:5432/<test-db>" \
  npx vitest run \
    src/__tests__/agents/aegis.test.ts \
    src/__tests__/agents/aegis-durable-store.test.ts \
    src/__tests__/agents/article12-logger.test.ts    # 9 + 7 + 4 = 20 passed
npx vitest run                # 1181 passed, 10 skipped, 1 pre-existing unrelated
                               # failure (agent-registry.test.ts, confirmed
                               # present before this session via git stash —
                               # not touched, out of scope)
python3 -c "import yaml; yaml.safe_load(open('infrastructure/dgx-spark/docker-compose.yml'))"
docker compose -f infrastructure/dgx-spark/docker-compose.yml config -q   # exit 0
```

## Status: **PARTIAL** (unchanged headline; addendum adds the orchestrator work above)
