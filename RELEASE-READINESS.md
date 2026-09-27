# DWS IQ Aegis — Release Readiness Audit

Branch: `claude/aegis-release-readiness-audit`
Worktree: `/home/user/worktrees/aegis-release-readiness-audit`
Audit start commit: `0982f6b1edd873b123a69ccb609a1caa263367a5`
Final commit (as of this report): `233bbb375794bf284a53958b28bba440757f165b`
Date: 2026-08-19

## Phase status

| Phase                | Status      |
| -------------------- | ----------- |
| 1 — Code correctness | **PARTIAL** |
| 2 — Playwright       | **PARTIAL** |
| 3 — HIC controls     | **BLOCKED** |

Full detail: `CODE-QUALITY-REPORT.md`, `PLAYWRIGHT-REPORT.md`, `HIC-REPORT.md`, evidence in `playwright-evidence/`.

## Release-blocking issues

1. **FINDING-01 (BLOCKER, FIXED)** — `dws10.com/shared-assets/vertical-lang-bar.js` had an unescaped apostrophe causing a JS `SyntaxError` that broke the language bar on 42 pages site-wide, including every Aegis page. Fixed, synced to the `landing-pages/dws10-com` mirror, verified via `node --check` and a before/after Playwright run. Commit `233bbb37`.
2. **FINDING-02 (HIGH, OPEN)** — `dws10.com/products/aegis.html` (and 49 other pages) link a stylesheet (`static/css/style.css`) that does not exist in the repo. Cannot determine from this worktree whether a deploy/CDN step supplies it. **Needs HIC confirmation of the static-hosting build pipeline.**
3. **FINDING-03 (HIGH, OPEN — content/architecture)** — The only backend code entity named `aegis` (`src/agents/aegis.agent.ts`, reachable at `POST /api/agents/aegis/execute`) is a Vulnerability & Patch SLA triage agent, unrelated to the product `Store/PRODUCT_AEGIS.md` describes (Argus/SovereigntyMonitor/Article12Logger/KYA/ComplianceAgent). **Needs HIC decision**: rename the internal agent, or explicitly document the two "Aegis"es are different things.
4. **HIC Phase 3 (BLOCKED)** — Every HIC control row is PARTIAL or BLOCKED (see `HIC-REPORT.md`). Notably: no replay/nonce/TOCTOU protection found; no tamper-evident audit-log integrity mechanism found; the offline/degraded-mode operation the product doc requires has no corresponding implementation found in this repo; the Article12Logger that exists is not wired into the `aegis` agent's execution path.

## Known risks / unaccepted assumptions

- The 5 Aegis-language index pages could not reach a clean `load`/`networkidle` Playwright state in this sandbox because of proxy-blocked external hosts (Google Fonts, and the page's absolute-URL fetch of its own domain's `products.json`). Screenshots confirm correct rendering despite this; treated as an environment artifact, not a defect — but not independently re-verified against the real `dws10.com` origin.
- The demo/orientation → pilot → order path has no live hyperlinks connecting the public site to `sales-package-v1.0/*.md` — that path exists only as separate documents, not as a clickable flow. Not fixed (content/nav decision, flagged as FINDING-04, MEDIUM).
- No auth/session, form, or backend-integration testing was possible — no running API/DB/Redis instance was available, and per the ground rules no substitute was fabricated.
- `npm run lint` is a no-op stub repo-wide; no lint pass was possible.
- Node version mismatch: repo requires `>=24.17.0`, this environment ran `22.22.2` (build/test still passed).

## Required manual checks (HIC)

1. Confirm how `dws10.com/static/css/style.css` is actually served in production (CDN, build step, Nginx alias) — resolve FINDING-02.
2. Decide the `aegis` agent-naming collision (FINDING-03) and instruct on the fix.
3. Re-run the Playwright suite from a network-unrestricted machine against the real `dws10.com` origin to confirm the 5 index pages load cleanly end-to-end.
4. Stand up a test API/DB/Redis instance with a seeded JWT so Phase 3 (HIC controls) can be tested rather than only code-reviewed.
5. Confirm whether the offline/degraded-mode control-room requirement in `Store/PRODUCT_AEGIS.md` is expected to exist in this repo yet, or is intentionally not-yet-built pre-GA (product doc states GA is September 2026, pre-revenue).

## Reproducible commands

```bash
cd /home/user/worktrees/aegis-release-readiness-audit
npm install --no-audit --no-fund
npx tsc -p tsconfig.json --noEmit
npm run build
npx vitest run src/__tests__/agents/aegis-vesta.test.ts
node --check dws10.com/shared-assets/vertical-lang-bar.js
diff -rq dws10.com/aegis landing-pages/dws10-com/aegis
npx http-server dws10.com -p 8099 -s &
node pw-smoke.mjs   # requires playwright npm package + /opt/pw-browsers/chromium
```

## Recommendation: **NO RELEASE**

One BLOCKER was found and fixed in this session, but two HIGH findings remain open (one needs information this worktree cannot obtain — the deploy pipeline; one needs an HIC naming decision) and Phase 3 (HIC controls) is BLOCKED, not PASS or PARTIAL-with-confidence — several required controls (replay/nonce protection, tamper-evident audit log, offline/degraded-mode execution, Article-12 integration with the `aegis` agent) have no implementation found to test. Per the audit's own release gate, RELEASE is only permitted when no release-affecting BLOCKER or HIGH is open across all three phases — that condition is not met.

### Priority order for corrective work

1. Resolve FINDING-02 (missing stylesheet) — determine if it's a real production gap or a build-step artifact this repo doesn't show.
2. Resolve FINDING-03 (agent naming collision) — HIC decision needed before any customer-facing "run the Aegis agent" automation is safe to build on top of.
3. Wire `Article12Logger` (or its intended replacement) into whichever agent/orchestrator is decided to be the real "Aegis" backend, so the Live compliance-evidence claim in `PRODUCT_AEGIS.md` has a code path that actually produces one.
4. Add replay/nonce and tamper-evident audit-log controls before any Aegis-branded agent handles consequential (non-read-only) actions.
5. Stand up a test environment so Phase 3 can be genuinely tested, not only code-reviewed.
6. Link the live site to the orientation/pilot sales documents (FINDING-04) so the demo→pilot→order path is an actual navigable flow.

---

## Addendum — 2026-08-19: `aegis.agent.ts` built, FINDING-03 resolved

Commit `4a8d4941` renamed the name-colliding agent
(`VulnPatchSlaTriageAgent`, id `vuln-patch-sla-triage`), freeing `aegis`.
`src/agents/aegis.agent.ts` (`AegisAgent`) now exists as the real orchestrator
of `ArgusAgent` / `SovereigntyMonitorAgent` / `ComplianceAgent`, registered
in `src/agents/index.ts`. Full detail: `CODE-QUALITY-REPORT.md` and
`HIC-REPORT.md` addenda.

### Updated phase status

| Phase                | Status      | Change                                                                                                                                      |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Code correctness | **PARTIAL** | unchanged (addendum added; no new BLOCKER)                                                                                                  |
| 2 — Playwright       | **PARTIAL** | unchanged (new agent's browser/API surface still needs a live backend to test)                                                              |
| 3 — HIC controls     | **PARTIAL** | upgraded from BLOCKED — 2 of 3 named gaps (replay/nonce, tamper-evident audit log) closed to PARTIAL; offline/degraded-mode remains BLOCKED |

### Release-blocking issues — updated

1. **FINDING-01 (BLOCKER, FIXED)** — unchanged, see above.
2. **FINDING-02 (HIGH, OPEN)** — unchanged, still needs HIC confirmation of the static-hosting build pipeline.
3. **FINDING-03 (HIGH, RESOLVED this session)** — `aegis` id now points to `AegisAgent`, the real product orchestrator. No longer a release blocker.
4. **HIC Phase 3 (upgraded BLOCKED → PARTIAL)** — replay/nonce protection and a tamper-evident audit chain are now implemented and unit-tested (`src/__tests__/agents/aegis.test.ts`, 9/9 passing), but both are **in-memory/per-process only** — not durable across a restart or multiple instances. Article 12 logging is wired into `AegisAgent` but was never exercised against a live Postgres in this sandbox (`INTERNAL_DB_URL` unset — degrades gracefully, confirmed by test, but unproven end-to-end). Offline/degraded-mode control-room operation remains **BLOCKED** — it is an edge-deployment/infrastructure requirement outside what a backend Node agent class can satisfy, and no edge/offline test environment exists in this sandbox.

### New known risks / unaccepted assumptions (this session)

- Replay-protection and audit-chain fingerprint/entry stores are `Set`/`Array` fields on the `AegisAgent` class, scoped to one Node process. A production deployment with more than one instance, or any process restart, loses all replay history and audit-chain continuity. **Must be backed by Redis/Postgres before this can be called a production control.**
- `Article12Logger` integration was verified only in its degraded-mode (no-DB) branch. The actual write path (`logPreFlight`/`logPostFlight` against a real `article12_audit_log` table) has zero live-environment verification in this repo's history for the `aegis` agent specifically.
- No new capability/permission-boundary enforcement was added at the route level — `POST /api/agents/aegis/execute` is still gated only by JWT auth + rate limit, not by a per-caller capability allowlist. Out of scope for this session (pre-existing gap, not new).

### Verification commands added this session

```bash
cd /home/user/worktrees/aegis-release-readiness-audit
npx tsc --noEmit -p .
npm run build
npx vitest run src/__tests__/agents/aegis.test.ts   # 9 passed
npx vitest run src/__tests__                         # 1176 passed, 3 skipped,
                                                       # 1 pre-existing unrelated
                                                       # failure (confirmed present
                                                       # before this session via
                                                       # git stash)
```

## Recommendation: **NO RELEASE** (unchanged)

FINDING-03 is resolved and two of three named HIC gaps moved from BLOCKED to
PARTIAL, but per this audit's own release gate, RELEASE requires no open
BLOCKER or HIGH across all three phases. FINDING-02 (HIGH) is still open,
and Phase 3 still has one BLOCKED row (offline/degraded-mode) plus multiple
PARTIAL rows with real, documented durability gaps (in-memory replay/audit
state; unverified live-DB Article 12 write path). The updated priority order
for corrective work:

1. Resolve FINDING-02 (missing stylesheet) — unchanged, needs deploy-pipeline info.
2. Back the replay-protection fingerprint set and the audit chain with a durable store (Redis/Postgres) before any Aegis-branded workflow relies on them in production.
3. Provision a test `INTERNAL_DB_URL` Postgres instance and exercise `Article12Logger`'s actual write path end-to-end for the `aegis` agent — the degraded-mode fallback is proven, the happy path is not.
4. Decide (HIC) whether offline/degraded-mode control-room operation is required before GA (per `Store/PRODUCT_AEGIS.md`, GA is September 2026) or is intentionally deferred — this backend repo cannot build edge/offline infrastructure on its own.
5. Stand up a live API+DB+Redis+JWT test environment so the Playwright/HIC-level tests currently BLOCKED can finally run end-to-end.
6. Link the live site to the orientation/pilot sales documents (FINDING-04) — unchanged.

---

## Addendum — 2026-08-19 (session 2): items 1 and 2 closed for DGX Spark deployment (item 3 stays BLOCKED, NOT validated)

**HIC scope decision (19.08.2026):** close BLOCKED items 1 (durable replay/audit-chain store) and 2 (live Article12Logger Postgres write path) only, targeting DGX Spark as the deployment. Item 3 (offline/degraded-mode edge control-room operation, Jetson Orin-class hardware) is explicitly OUT OF SCOPE for this session and stays BLOCKED.

### Item 1 — Durable replay/audit-chain store: CLOSED, verified against a real Postgres

The in-memory `Set`/`Array` implementation on `AegisAgent` was replaced with `AegisDurableStore` (`src/agents/aegis-durable-store.ts`), backed by Postgres via `src/config/internal-db.ts` and a new table `aegis_audit_chain` (`infrastructure/dgx-spark/migrations/023_aegis_audit_chain.sql`). The hash-chain formula is byte-for-byte unchanged — only the persistence layer moved.

**Why Postgres, not Redis** — the repo already uses `ioredis` elsewhere (`redis-rate-limiter.service.ts`, `redis-token-blacklist.service.ts`), but both of those are ephemeral/TTL'd data where losing a key is expected. A hash-chained Article 12 audit trail needs permanent, ordered, never-evicted rows, which is exactly what this repo's existing durable-audit convention (`article12_audit_log`, `command_audit_log`) already uses Postgres for. Documented as a deliberate choice in the store's file header (Rule 7).

**Real evidence, not assumed:** this sandbox turned out to have PostgreSQL 16 and Redis installed locally with root access, so rather than mocking `pg`, the full store was proven end-to-end against a real local Postgres 16 instance with the exact production schema applied (`021_fix_partial_runs_article12.sql` + `023_aegis_audit_chain.sql`) and a `dws_backend`-equivalent role. New suite `src/__tests__/agents/aegis-durable-store.test.ts` (7 tests, all passing against the real DB — `skipIf` when `AEGIS_DURABILITY_TEST_DB_URL` is unset, so normal `npm test`/CI stays green without a live Postgres):

- writes entries, discards the store instance, reads back through a brand-new one, confirms all entries + hash-chain intact and `verifyChain()` valid — **process-restart survival proven, not assumed**.
- rejects a replayed fingerprint durably, including from a second store instance (simulates horizontal scaling).
- detects tampering performed via a raw SQL `UPDATE` against the Postgres row (not a JS-object mutation) — proves `verifyChain()` really re-reads from Postgres each time.
- two concurrent store instances reserving simultaneously never fork the chain (advisory-lock serialization) — found and fixed a real concurrency bug during this work (see below).
- startup with an unreachable Postgres degrades to the in-memory fallback instead of crashing (`durable: false` surfaced, nothing thrown).
- a mid-operation failure between `reserve()` and `finalize()` still preserves the entry and reports it honestly as `durable: false` (Rule 12 — never silently dropped).
- recovers automatically once Postgres becomes reachable again after an outage, without a process restart.

**Bug found and fixed during this work:** the first design resolved `prevHash` at `reserve()` time from the "last row"; under concurrency, two reservations racing ahead of their `finalize()` calls could both read the same not-yet-completed row and fork the chain (caught live by the concurrency test, which failed until fixed). Fixed by moving `prevHash` resolution into `finalize()`, under the same Postgres advisory lock, from the last row that has actually _completed_ (`entry_hash IS NOT NULL`) rather than the last one reserved. `getChain()`/`verifyChain()` exclude still-mid-flight rows (`entry_hash IS NULL`) from the chain.

`src/__tests__/agents/aegis.test.ts` (the original 9 tests) still passes unmodified in behavior — updated only to `await` the now-async `getAuditChain()`/`verifyAuditChain()` — confirming degraded-mode (no `INTERNAL_DB_URL`) behavior is unregressed.

### Item 2 — Live Article12Logger Postgres write path: PARTIALLY CLOSED — proven against production schema locally, DGX Spark run still pending

New suite `src/__tests__/agents/article12-logger.test.ts` (4 tests, all passing) runs `logPreFlight()`/`logPostFlight()` for real against the same local Postgres 16 with the exact `article12_audit_log` schema from migration `021_fix_partial_runs_article12.sql` applied:

- `logPreFlight()` inserts a real, readable row before egress with post-flight fields correctly `NULL`.
- `logPostFlight()` completes the _same_ row via `trace_id` (not a second row) — real thinking-block hashing confirmed (raw text never stored).
- the `decision_summary` 500-char `CHECK` constraint is real at the DB layer, not only app-side truncation.
- `PUBLIC` genuinely cannot `UPDATE`/`DELETE`/`TRUNCATE` the table — checked via `has_table_privilege()` against the live catalog, not by reading the migration SQL and assuming it applied.

**What this does NOT close:** these tests ran against a local Postgres 16 instance in the audit sandbox (which this session discovered has real Postgres/Redis available, unlike the prior session's fully network-isolated sandbox) — **not against DGX Spark's actual `dws-postgres` container over the real `dws-network`.** Per the HIC's own scoping request, item 2 is marked **BLOCKED-IN-SANDBOX for the DGX-specific half** — the write path is proven correct against the production schema, but the actual DGX Spark deployment has not been exercised in this session.

**Exact command a human or DGX-side agent must run on DGX Spark to close this for real:**

```bash
# On DGX Spark, after deploying this branch (see "DGX Spark deployment" below):
cd /path/to/dws6/infrastructure/dgx-spark
docker compose exec dws-backend sh -c '
  export AEGIS_DURABILITY_TEST_DB_URL="$INTERNAL_DB_URL"
  cd /app && npx vitest run \
    src/__tests__/agents/article12-logger.test.ts \
    src/__tests__/agents/aegis-durable-store.test.ts \
    src/__tests__/agents/aegis.test.ts
'
# Expect: 4 + 7 + 9 = 20 passed, 0 skipped (both durability suites skip
# automatically when AEGIS_DURABILITY_TEST_DB_URL is unset — seeing them
# run, not skip, is itself part of the proof).
```

### DGX Spark deployment config (prepared, not deployed — no host access from this session)

- `infrastructure/dgx-spark/docker-compose.yml`: added the `dws-postgres` service block for real (`postgres:16-alpine`, migrations auto-applied on first boot via `/docker-entrypoint-initdb.d`, no host port, `dws-postgres-data` volume). **Finding:** the v1.4.0 changelog entry already in this file claimed this service existed and that `dws-backend`/`dws-cron` already `depend_on` it — that was inaccurate; the service block was never actually present. Documented as a superseded/corrected changelog entry (Rule 12), not silently rewritten.
- `dws-backend` and `dws-cron` now genuinely `depends_on: dws-postgres` (`condition: service_healthy`).
- `infrastructure/dgx-spark/.env.example`: added `INTERNAL_DB_URL` / `POSTGRES_PASSWORD` with a note that `env_file` values are literal (Compose does not expand `${VARS}` inside `.env` contents), so the password must be written out in full, identically, in both variables.
- Validated with `docker compose config -q` (exit 0, using a copy of `.env.example` with the placeholder password filled in) — confirms the compose file is syntactically and referentially valid. **Not deployed** — this session has no access to the actual DGX Spark host.

**Exact deployment steps for a human (or DGX-side agent) with DGX Spark access:**

```bash
# 1. On DGX Spark:
cd /path/to/dws6
git fetch origin && git checkout claude/aegis-release-readiness-audit && git pull

# 2. Generate the internal Postgres password and fill in .env (NOT committed):
openssl rand -base64 24   # use this value for BOTH POSTGRES_PASSWORD and
                          # the password segment of INTERNAL_DB_URL in
                          # infrastructure/dgx-spark/.env

# 3. Bring up dws-postgres first, confirm healthy, then the rest:
cd infrastructure/dgx-spark
docker compose up -d dws-postgres
docker compose ps dws-postgres   # wait for "healthy"
docker compose up -d --build dws-backend dws-cron

# 4. Confirm migrations applied (021 + 023 among them):
docker compose exec dws-postgres psql -U dws_backend -d dws_internal -c "\dt"

# 5. Run the verification command from "Item 2" above.
```

### Item 3 — Offline/edge control-room operation: explicitly NOT VALIDATED, out of scope this session

**Offline/edge control-room operation is NOT validated in this release. Do not claim offline or degraded-edge readiness. Requires a Jetson Orin-class hardware test path (separate workstream, HIC-scoped 19.08.2026).**

Nothing in this session's changes claims otherwise. `AegisDurableStore`'s "degraded mode" (falling back to an in-memory buffer when Postgres is unreachable) is a _networked-cloud resilience_ behavior — surviving a transient DB outage on a persistent, network-connected host — and must not be conflated with genuine offline/edge operation on disconnected hardware, which is a materially different requirement (no network reachability at all, different failure/recovery model, different hardware constraints) that this session did not build, test, or validate.

### Updated verification commands (this session)

```bash
cd /home/user/worktrees/aegis-release-readiness-audit
npx tsc --noEmit -p .                                  # clean
npm run build                                           # clean
npx vitest run src/__tests__/agents/aegis.test.ts       # 9 passed (degraded mode, no DB)
AEGIS_DURABILITY_TEST_DB_URL="postgres://<test-role>@127.0.0.1:5432/<test-db>" \
  npx vitest run \
    src/__tests__/agents/aegis.test.ts \
    src/__tests__/agents/aegis-durable-store.test.ts \
    src/__tests__/agents/article12-logger.test.ts        # 9 + 7 + 4 = 20 passed
npx vitest run                                           # 1181 passed, 10 skipped,
                                                           # 1 pre-existing unrelated
                                                           # failure (agent-registry.test.ts,
                                                           # confirmed present before this
                                                           # session via git stash — not
                                                           # touched, out of scope)
python3 -c "import yaml; yaml.safe_load(open('infrastructure/dgx-spark/docker-compose.yml'))"
docker compose -f infrastructure/dgx-spark/docker-compose.yml config -q   # exit 0
```

## Recommendation — updated: **NO RELEASE for offline/edge deployment. CONDITIONAL RELEASE for networked cloud/hybrid deployment (DGX Spark or equivalent) — item 2's DGX-specific run still pending.**

Scoped exactly as the HIC requested:

- **Applies only to** networked cloud/hybrid deployment (DGX Spark or equivalent) with durable replay/audit persistence and live Article12Logger DB writes.
- Item 1 (durable replay/audit-chain store) is **CLOSED** — proven with real, passing tests against a real Postgres instance running the production schema, including process-restart survival, concurrency safety, and failure/recovery behavior.
- Item 2 (live Article12Logger DB write path) is **PARTIALLY CLOSED** — the write path is proven correct against the production schema locally; the DGX Spark-specific run (`INTERNAL_DB_URL` pointed at the real `dws-postgres` container over the real `dws-network`) is **BLOCKED-IN-SANDBOX**, pending the human/DGX-side verification command given above.
- Item 3 (offline/edge control-room operation) is **NOT VALIDATED** — see the boundary statement above. This is a known, documented limitation for a separate future workstream, not a regression.
- No marketing language ("production-ready", "compliant", "audited") is used anywhere in this addendum without the specific code + test evidence cited alongside it.

### Updated priority order for corrective work

1. Run the DGX Spark verification command (Item 2, above) and update this file's item-2 status from PARTIALLY CLOSED to CLOSED once it passes for real against `dws-postgres`.
2. Resolve FINDING-02 (missing stylesheet) — unchanged, still needs deploy-pipeline info.
3. Resolve the pre-existing, unrelated `agent-registry.test.ts` failure (`version-audit` autonomy-phase allowlist) — confirmed present before this session, not touched here (out of scope).
4. Scope and schedule the Jetson Orin-class hardware test path for item 3 (separate workstream, per the HIC decision).
5. Link the live site to the orientation/pilot sales documents (FINDING-04) — unchanged.
