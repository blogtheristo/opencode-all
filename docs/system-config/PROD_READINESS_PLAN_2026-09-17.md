# Agent Infrastructure — Production Readiness Plan

**Status:** DRAFT — for OpenCode to execute (full git/GH authority per CLAUDE.md Runtime Policy).
**Source:** 2026-09-17 agent infrastructure audit (`docs/field-notes/2026-09-17-agent-infra-audit.md`).
**Owner:** Risto Anton Päärni, Founder, CEO, Lifetime Oy.

Each section: current state → target → concrete steps → acceptance criteria. OpenCode executes
top-to-bottom by priority (P0 first). Claude Code stays on standby for YELLOW/RED-gated items
(migration application, outbound email, blog publish) per the Runtime Policy — those are called
out explicitly below.

---

## P0 — Safe file access + Code execution (the sandbox): pilot → prod

**Current state (40% / 45%):** `src/sandbox/index.ts` implements a real 3-stage factory
(SDK sandbox → Cloud Run ephemeral → persistent+gVisor/Firecracker), wired into `base.agent.ts`
(imported by all 76 agents via `buildSDKSandboxConfig`/`getSandboxStage`). Stage 3 is a documented
stub that silently falls back to Stage 2. **Zero test files** exist for `src/sandbox/*`,
`src/cloudflare/tenant-sandbox.ts`, or `mcp-hub/sandbox.py`. `docs/CLOUDFLARE_SANDBOX_PILOT.md` is
a GTM/customer-onboarding doc, not an engineering readiness doc — it documents the business pilot
process, not what "production" means for the isolation layer itself.

**Target:** `SANDBOX_STAGE=2` (Cloud Run ephemeral, europe-north1) is the default for any real
customer traffic; Stage 3 either ships or is removed from the public stage list; every sandbox
module has test coverage; NIS2/tenant-isolation checks are enforced by CI, not just at runtime.

**Steps (OpenCode):**

1. Add `src/__tests__/sandbox/` with unit tests for:
   - `sdk-sandbox.ts` — `buildSDKSandboxConfig()` produces correct per-tier config; `validateNIS2Compliance()` catches known violation classes (see existing function's checks).
   - `cloudrun-ephemeral.ts` — `executeInEphemeralContainer()` against a mocked Cloud Run client; assert timeout/region/tenant params are passed through, not hardcoded.
   - `opensandbox.ts` — `runAgentInOpenSandbox()` network-policy allowlist is enforced (deny-by-default asserted, not just documented).
   - `index.ts` — stage selection from `SANDBOX_STAGE` env var, including the Stage 3 → Stage 2 fallback logged as a `logger.warn`, and the invalid-stage-value fallback to `'1'`.
2. Add a tenant-isolation integration test: two tenant IDs run concurrently, assert no cross-tenant data/config leakage in the returned `AgentExecutionResult`.
3. Resolve the Stage 3 stub: either (a) implement persistent-container + gVisor/Firecracker per the doc comment, or (b) remove `'3'` from `SandboxStage` and `getSandboxStage()` until it's real — a stage that silently downgrades is a governance gap (Rule 12, Fail Loud), not a feature.
4. Wire `validateNIS2Compliance()` failures into the CI gate (`scripts/local-ci.sh`) as a blocking check when `src/sandbox/**` changes, so a compliance regression can't merge silently.
5. Update `docs/CLOUDFLARE_SANDBOX_PILOT.md` §"Risk Mitigation" → "Sandbox Isolation Failure" row to cite the new test suite instead of "security audit" (vague, unfalsifiable claim per Truth Standard).
6. Set `SANDBOX_STAGE=2` in the production environment config (Cloud Run, `europe-north1`) — **this line is a deploy config change, GREEN under the Trust Boundary** (feature-branch config, reviewable). Do not flip it in a shared prod env var store without confirming no live tenant is mid-session on Stage 1.

**Acceptance criteria:** `npm run test:unit -- src/__tests__/sandbox` green; `SANDBOX_STAGE` documented in `.env.example` with the 3 valid values and what each costs/guarantees; Stage 3 either real or removed; CI blocks on NIS2 violations.

---

## P1 — Shell commands: hooks-only → dedicated abstraction (in progress)

**Current state (20%, now improving):** `src/security/safe-shell.ts` was added 2026-09-17
(commit `78da24f`) — `execFile`-only (no shell interpolation), binary allowlist, subcommand
restriction, shell-metacharacter rejection, routed through `runtime-auth.ts`
(`shell_exec_read`/`shell_exec_write` policies). 7 tests passing. Not yet wired into any live
agent — it exists but nothing calls `safeExec()` yet.

**Steps (OpenCode):**

1. Push the `claude/agents-code-audit-tv2bli` branch (blocked earlier this session by a missing
   `gitleaks` binary in the sandboxed dev container — not a real secret finding, confirmed by
   reading `scripts/local-ci.sh:312-319`). OpenCode has YELLOW-zone `git push` authority; either
   install `gitleaks` in its environment first (real fix) or push if its container already has it.
2. Wire `safeExec()` into at least one real agent path that currently shells out unsafely or not
   at all — audit candidates: any agent under `scripts/{daily,weekly,hourly,on-deploy}/` that
   invokes external CLIs (grep those dirs for direct `child_process` use first).
3. Expand `COMMAND_POLICIES` in `safe-shell.ts` only as real call sites need new binaries —
   don't pre-allowlist speculatively (Discipline Rule 2, Simplicity First).
4. Open the PR for `78da24f` + this plan; request Claude Approvals / human review per repo convention.

**Acceptance criteria:** PR merged; at least one production code path uses `safeExec()` instead of
raw `child_process`; `git log -- src/security/safe-shell.ts` shows real callers, not just tests.

---

## P1 — Background agents: implicit → named subsystem

**Current state (15%):** No dedicated module. Async/scheduled behavior lives inside individual
agents (`memory.scheduler.ts`, `autonomy.ts`) with no shared task registry, no way to list
"what's running in the background right now" across agents.

**Steps (OpenCode):**

1. Design (don't build yet) a minimal `src/agents/background-task-registry.ts`: a single
   in-process map of `{ taskId, agentName, startedAt, status, cancel() }`, no new infra — this
   is a bookkeeping layer over what already exists (`memory.scheduler.ts` et al.), not a new
   execution engine (Discipline Rule 2).
2. Migrate `memory.scheduler.ts` to register/deregister through it first, as the proof case —
   one caller, verify the abstraction earns its keep before adding a second.
3. Expose a read-only `GET /internal/background-tasks` route (mirrors `src/routes/memory.routes.ts`
   pattern) for observability — this is the concrete "success rate" evidence future audits need.
4. Do not build a persistent job queue (Redis/BullMQ) unless a real requirement demands
   surviving process restarts — that's speculative scope per Rule 2 until proven necessary.

**Acceptance criteria:** one real scheduler visibly registers/deregisters through the new
module; a test asserts the registry reflects actual running/completed state, not just intent.

---

## P2 — Planning: per-agent → shared reasoning-loop abstraction

**Current state (55%):** Planning logic is duplicated per-agent (`chronos.agent.ts`,
`daedalus.agent.ts`, `world-model/world-model-loop.agent.ts`) with no common interface.

**Steps (OpenCode):**

1. Before writing any shared abstraction: read all three files and extract the actual common
   shape (loop-until-done? plan-then-execute? re-plan-on-failure?) — do not guess a design,
   verify one from what exists (Discipline Rule 1).
2. If a real common shape exists, extract a thin `PlanningLoop` interface in `src/agents/` and
   migrate one agent as proof; if the three implementations solve genuinely different problems,
   leave them separate and close this item — premature abstraction is worse than duplication
   (Rule 2).

**Acceptance criteria:** either a merged PR showing one agent migrated to a shared interface with
passing tests, or a one-paragraph field note explaining why unification was rejected.

---

## P2 — Code execution churn: DEPRECATED dirs cleanup

**Current state (45%):** `Archive/deprecated-2026-08/mcp-hub_DEPRECATED/services/opensandbox_mcp.py`
sits alongside the live `mcp-hub/services/opensandbox_mcp.py` — confirm the deprecated copy has
zero remaining importers before this plan closes the sandbox item above.

**Steps (OpenCode):** `grep -rn "mcp-hub_DEPRECATED"` across the repo (excluding `Archive/`); if
zero hits, this is already inert — no action needed beyond confirming in the next audit.

---

## P3 — Observability: confirm real OTel vs. custom wrapper

**Current state (65%):** `src/observability/tracing.ts` + `src/__tests__/otel-tracing.test.ts`
exist, but a keyword grep for `opentelemetry`/`OTel` inside `tracing.ts` came up empty in the
prior audit — meaning it may be a custom span format that merely looks like OTel.

**Steps (OpenCode):**

1. `grep -n "opentelemetry\|@opentelemetry" src/observability/tracing.ts package.json` — confirm
   or deny the dependency is real.
2. If custom: either adopt `@opentelemetry/api` for real span export (Jaeger/Grafana Tempo
   compatibility) or rename the module/exports so nothing implies OTel compliance it doesn't have
   (Truth Standard — no false provenance).

**Acceptance criteria:** one paragraph in a field note stating which is true, with `file:line`
evidence, and either a real OTel dependency in `package.json` or corrected naming.

---

## P3 — Evaluations: extend autoresearch/eval-runner coverage

**Current state (60%):** `src/evals/eval-runner.ts` + `src/autoresearch/*` + cron-scheduled evals
work for at least one customer-facing case (Santander). Coverage across all ~93 skills/agents is
unconfirmed.

**Steps (OpenCode):** Run `scripts/daily/run-evals.sh --list` (or read it) to get the actual list
of agents currently under eval; compare against `skills/manifest.json`'s ~93 entries; report the
gap count in the next field note. Do not build new eval scaffolding speculatively — first measure
the real gap (Rule 1).

---

## Already adequate — no action this cycle

- **Human approval (75%)** — `blog-draft-gate.sh` hook is real and enforced.
- **Memory (80%)** — 4 test files + API route; strongest category.
- **Skills (75%)** — manifest matches live skill list.
- **Governance/KYA (70%)** — 4 dedicated test files, flagship doc coverage.
- **Tools (70%)** — `tools.ts` consumed by 76 agents via `BaseAgent`.

---

## Sequencing for OpenCode

1. P0 sandbox tests + Stage 3 resolution (this is the literal "go to prod with sandbox, update
   it" ask — do this first).
2. P1 shell-commands: push existing branch, wire `safeExec()` into one real call site.
3. P1 background-agent registry (design doc → one migrated caller).
4. P2/P3 items as time allows; each ends in either a merged PR or a field note explaining why not.

Every item above that touches `src/sandbox/**`, `src/security/**`, or CI config is GREEN under
the current Trust Boundary (feature-branch code + reviewable CI config). Nothing here requires
migration application, outbound email, or blog publish — so nothing in this plan needs to route
to Claude Code's RED-gated standby role. HIC sign-off is only needed before any _production_
tenant is actually cut over from Stage 1 to Stage 2 traffic (a business/customer-impact decision,
not a code change).
