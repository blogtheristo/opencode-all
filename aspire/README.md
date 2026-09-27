# Aspire AppHost — dev/stage/prod orchestration

Orchestration entry point for local dev, wired to the DWS 7 four-tier environment strategy
already documented in `docs/CLOUD_ENVIRONMENTS.md` §5.2. This directory does **not** change how
DWS6 actually deploys — Cloud Run + Supabase EU remain the real stage/prod infrastructure.

## What this does

| DWS_ENV          | What Aspire does                                                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dev` (default)  | Runs a local Postgres container (`dws-postgres` / db `dws_dev`) + pgAdmin, and launches the existing Node/Express backend (`npm run dev`) as an orchestrated process. Aspire dashboard shows logs/traces for both.                   |
| `stage` / `prod` | Provisions nothing. Wires two reference parameters (`supabase-url`, `backend-url`) into a placeholder container purely so the Aspire dashboard can display which real endpoint each environment points at. No deploy, no migrations. |

## Why the local Postgres container isn't the backend's datastore

`src/` talks to Supabase through the `supabase-js` client (`SUPABASE_URL` / `SUPABASE_SERVICE_KEY`),
not a raw Postgres connection string. Rewiring the backend to a generic `pg` connection is an
application-level change outside this task's scope — see CLAUDE.md's surgical-changes rule. The
local Postgres container exists for schema exploration, migration dry-runs, and pgAdmin access
against a disposable copy of the schema (seeded via `scripts/seed-dev-postgres.sh`), independent of
whatever the backend itself is configured to talk to in your `.env`.

## Prerequisites (not available in the sandbox that authored this)

- .NET SDK (Aspire 13 targets net10.0) + Aspire CLI (you already installed this — see the
  `aspire.dev/install.ps1` output that kicked off this change).
- Docker Desktop or another OCI-compliant container runtime, running.
- Node 22 (already required by the rest of the repo).

## Running it

```powershell
cd aspire
aspire run
```

Defaults to `DWS_ENV=dev`. To point the dashboard at stage/prod reference info instead:

```powershell
$env:DWS_ENV = "stage"
aspire run
```

## Verification status — READ BEFORE TRUSTING THIS

This was authored in a cloud sandbox with **no dotnet SDK available** (`dotnet --version` fails),
so `apphost.cs` has not been built or run. It was written against Microsoft Learn docs confirmed
live during authoring (Aspire 13.0 single-file AppHost format, `AddPostgres`/`AddDatabase`/
`WithDataVolume`/`WithPgAdmin`, `AddParameter`, `AddContainer`). The one call I could **not**
confirm against current docs is `AddExecutable(name, command, workingDirectory, args...)` for
launching the Node backend — it's a long-standing core Aspire API but I could not pull a
doc example to check today's exact parameter order/overload. Before relying on this:

1. Run `aspire run` from `aspire/` and fix any compile errors — the file-based AppHost restores
   packages on first run, so most one-off mistakes surface immediately as clear MSBuild errors.
2. If `AddExecutable(...)` doesn't compile, check IntelliSense/`aspire.dev` docs for the current
   signature and adjust — the intent (run `npm run dev` from the repo root as an orchestrated
   process) should carry over even if the exact call changes.
3. Confirm the Postgres container comes up and `scripts/seed-dev-postgres.sh` applies cleanly
   against it before treating this as done.

## Non-goals

- Does not deploy to GCP Cloud Run, Azure, or anywhere else — Aspire's built-in deploy targets
  (`aspire deploy`, `azd`) are Azure-only; this repo's real stage/prod stay on the existing
  GCP/DGX Spark/Cloudflare stack per `docs/CLOUD_ENVIRONMENTS.md`.
- Does not apply migrations to Supabase. Applying migrations against real infra is a RED-zone,
  human-executed action per this repo's trust boundary.
