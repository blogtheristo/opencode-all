# Temporal on DGX Spark — Wiring + Cost

Status: PENDING_REVIEW
Date: 2026-09-23
Author: Claude Code (Sonnet 5)
Follow-up to: `docs/dws-use-cases.md`, `docs/field-notes/2026-09-22-temporal-use-cases.md`

## What was wired

Added to `infrastructure/dgx-spark/docker-compose.yml` (v1.5.0 → v1.6.0):

- `temporal-postgres` — dedicated Postgres for Temporal's own schema, deliberately
  separate from `dws-postgres` (Tier 1 internal-ops data) so a Temporal
  server/schema issue can never touch agent memory or the Aegis audit chain.
- `temporal` — `temporalio/auto-setup:1.25.2`, applies its own schema on first boot
  against `temporal-postgres`. No host port — reachable only inside `dws-network` at
  `temporal:7233`.
- `temporal-ui` — `temporalio/ui:2.34.0`, opt-in via `docker compose --profile
temporal-ui up -d`, exposed on `:8088` for HIC-visible workflow/retry/error
  inspection.
- `dws-temporal-worker` — new `infrastructure/dgx-spark/Dockerfile.temporal-worker`,
  runs `src/temporal/worker.ts` (the six task queues from the prior session).

## What this session could NOT do

This Claude Code session runs in an isolated cloud sandbox with no route to the DGX
Spark host (a private LAN address) — no `ssh` binary is even present, and outbound
egress to `temporal.io` is blocked by this sandbox's network policy (confirmed: a
pricing-page fetch returned `EGRESS_BLOCKED`). So:

- **Not deployed.** The compose changes are committed to git; nothing has run on the
  actual DGX Spark box. Whoever has real SSH access (OpenCode primary runtime, or HIC
  directly) needs to run the activation steps below.
- **Temporal Cloud pricing not independently verified this session** — see the cost
  section; flagged rather than stated as confirmed fact, per DWS truth standard.

## Activation steps (run from a session/terminal with real DGX Spark SSH access)

1. Add one new secret this stack needs to `infrastructure/dgx-spark/.env` on the DGX
   host (that file is gitignored — never commit it): a `TEMPORAL_POSTGRES_PASSWORD`
   entry, value generated fresh, following the same convention already used for
   `POSTGRES_PASSWORD` in that same file.

2. Pull this branch (or main, once merged) and bring the new services up:

   ```bash
   ./infrastructure/dgx-spark/deploy.sh          # picks up new compose services automatically
   # — or, more narrowly, from the DGX host directly:
   cd infrastructure/dgx-spark && docker compose up -d temporal-postgres temporal dws-temporal-worker
   ```

3. One-time Schedule setup (creates the hourly report-schedule poll — use case #8).
   Run from inside the `dws-temporal-worker` container's environment (it already has
   `TEMPORAL_ADDRESS` set), or locally with `TEMPORAL_ADDRESS` pointed at the DGX host's
   LAN address on port 7233 if port-forwarded:

   ```bash
   npm run temporal:schedules:setup
   ```

4. Optional: Temporal Web UI for HIC-visible inspection:

   ```bash
   cd infrastructure/dgx-spark && docker compose --profile temporal-ui up -d
   ```

   Then browse the DGX host's LAN address on port 8088 (or tunnel it via the existing
   SSH `LocalForward` pattern already documented in `deploy.sh --ssh-config`).

Nothing in `src/app.ts` or any live route calls into Temporal yet — the worker will sit
idle (polling empty task queues) until a caller starts a Workflow/Activity execution.
That caller-side wiring (e.g. swapping `social-scheduler`'s direct publish call for a
`socialPublishWorkflow` start) is the next, separate change — not done this session,
to keep this step scoped to "stand the server up and prove the worker connects."

## Costs

### Self-hosted on DGX Spark (the path taken — Rule 14, DGX-first)

- **Marginal dollar cost: effectively $0.** DGX Spark (Acer Veriton GN100, 128GB) is
  already-owned, already-running hardware carrying the rest of the stack (backend,
  cron, NemoClaw, Ollama, Aspire). The four new containers add resource _reservations_
  of roughly 1G+2G+256M+1G ≈ 4.25 GB RAM (each service's `deploy.resources.reservations`
  in the compose diff) against a 128GB box already running comfortably — no new bill,
  no per-action metering, no new vendor.
- **What is not free:** DGX Spark's own power/amortization cost line, which already
  exists independent of this change (see `docs/CLOUD_ENVIRONMENTS.md` §3.2.2). This adds
  incremental load to an existing line item, not a new one.
- **Disk:** Temporal's own Postgres volume grows with workflow history retention
  (default 30-90 days depending on namespace config); at DWS6's current/projected volume
  (single-digit workflows per hour across all six use cases) this is megabytes, not a
  capacity planning concern yet.

### Temporal Cloud (the path NOT taken)

**Not independently verified this session** — `temporal.io` is blocked by this
sandbox's egress policy, so the numbers below are recalled from general knowledge, not
confirmed against the live pricing page. Before quoting these to anyone outside the
team, HIC should verify at temporal.io/pricing directly.

- Billed per **Action** (roughly: each workflow/activity state transition), historically
  on the order of tens of dollars per million Actions, plus a retained-storage
  component and typically a monthly minimum. Volume discounts apply at scale.
- At DWS6's current single-digit-workflows-per-hour volume this would likely land
  in Temporal Cloud's minimum-spend tier regardless of the per-Action rate — i.e. cost
  is dominated by the minimum, not usage, at this stage.
- **Ruled out independent of price**: Temporal Cloud is US-hosted SaaS. Rule 14
  (DGX-first) already prefers self-hosting, and any customer-PII-bearing workflow would
  first need a CLOUD Act exposure review (`/sovereignty-assess`) before Temporal Cloud
  could even be considered — self-hosting on DGX Spark sidesteps that review entirely
  by keeping data in the sovereign tier.

**Bottom line:** self-hosting was already the right call on sovereignty grounds; on
cost it's also effectively free at DWS6's current scale, since the marginal resource
draw fits inside hardware you already run. Temporal Cloud pricing only becomes worth a
verified, sourced number if HIC decides to actually evaluate it later — no reason to
chase that number now.

## HIC decision needed

1. Approve the DGX Spark activation steps above (who runs them — OpenCode, or HIC
   directly over SSH — since this Claude Code session cannot reach the host)?
2. Once the worker is confirmed connected, approve wiring the first real caller (which
   of #1-#6/#8 goes live first — recommend the same order already used to build them:
   social scheduler first).

## N/A items (Rule 12)

- KB update: N/A — infra not yet live; update `/kb` once the worker is confirmed
  connected on DGX Spark.
- Calendar entry: N/A — no dated commitment; depends on who's assigned the activation
  steps above and when.
