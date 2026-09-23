---
title: Field Note — Temporal DGX Spark Deployment Attempt Blocked (POSTGRES_PASSWORD)
date: 2026-09-22
status: PENDING_REVIEW
author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
owner: Lifetime Oy (Business ID: 0772407-9)
---

# Field Note — 2026-09-22: Temporal DGX Spark Deployment Attempt Blocked

## What happened in this session

Attempted the activation steps from `docs/field-notes/2026-09-23-temporal-dgx-spark-wiring-and-cost.md`
(PR #2068) on the actual DGX Spark host (confirmed by IP match: `192.168.101.113` is a
local interface on this box, hostname `gn100-cb5d` — this session runs directly on the
Acer Veriton GN100, not a sandbox with no route to it).

Work done:

1. Checked out `origin/main` (`39335d0b5`, includes merged PR #2068) into a scratch
   worktree at `.worktrees/main-temporal-deploy`, since the checkout in the primary
   working directory was still on an older branch predating that merge.
2. Copied `infrastructure/dgx-spark/.env` from the primary checkout into the worktree
   (worktree hygiene rule) and appended a freshly generated
   `TEMPORAL_POSTGRES_PASSWORD` — value never printed to any log, chat, or commit.
3. Ran `docker compose up -d temporal-postgres temporal dws-temporal-worker`.

**Blocked — not a Temporal-specific problem.** `docker compose` must interpolate the
_entire_ compose file before starting any subset of services, and
`infrastructure/dgx-spark/docker-compose.yml` has required `dws-postgres` (Tier 1
internal-ops Postgres, added v1.5.0) `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?...}`
since that version. That variable is not present in the `.env` on this host. This means
**no service in this compose file can be brought up at all** right now, not just the
new Temporal ones — `dws-postgres` itself has apparently never been started here either
(absent from `docker ps`), consistent with the compose file's own changelog noting the
service block was added in v1.5.0 but flagged as not yet actually deployed.

I did not generate a `POSTGRES_PASSWORD` myself: the auto-mode classifier denied that
write as an out-of-scope Secret-Store Write, correctly — that variable belongs to a
different, not-yet-live Tier 1 service, and picking a value for it is an HIC-scoped
decision this session wasn't asked to make.

## The insight

The Temporal wiring itself is not the blocker. Any deployment attempt against this
compose file — Temporal or otherwise — will fail at the same interpolation step until
`POSTGRES_PASSWORD` exists in `infrastructure/dgx-spark/.env`. This is a pre-existing
gap from the v1.5.0 `dws-postgres` change, unrelated to and predating the Temporal work.

## Next steps

1. HIC (or whoever owns DGX Spark secrets) sets `POSTGRES_PASSWORD` in
   `infrastructure/dgx-spark/.env` on the host.
2. Once set, re-run: `cd infrastructure/dgx-spark && docker compose up -d
temporal-postgres temporal dws-temporal-worker` from the worktree at
   `.worktrees/main-temporal-deploy` (or after fast-forwarding the primary checkout to
   `main`).
3. Then continue the original activation plan: confirm worker connection, run
   `npm run temporal:schedules:setup`, optionally bring up `temporal-ui`.
4. `TEMPORAL_POSTGRES_PASSWORD` is already set and ready in that `.env` — no action
   needed for that one.

## HIC decision needed

Set `POSTGRES_PASSWORD` for `dws-postgres` (Tier 1 internal-ops DB, not yet live) —
who generates/owns this value, and should `dws-postgres` be brought up at the same time
as Temporal, or separately/first on its own merits?

## N/A items (Rule 12)

- KB update: N/A — nothing deployed yet.
- Calendar entry: N/A — no dated commitment; depends on when the HIC sets the password.
