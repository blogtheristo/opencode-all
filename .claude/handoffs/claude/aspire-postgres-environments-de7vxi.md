# Handoff: claude/aspire-postgres-environments-de7vxi

## What this branch does

Adds a `.NET Aspire` AppHost (`aspire/apphost.cs`, single-file Aspire 13 format) that orchestrates:

- **dev** (default): a local Postgres container (`dws-postgres` / db `dws_dev`) + pgAdmin, plus the
  existing Node backend launched as an executable resource, for local dev-loop convenience and
  schema exploration.
- **stage/prod**: reference-only parameter wiring (no provisioning, no deploy) — Cloud Run +
  Supabase EU remain the real infra per `docs/CLOUD_ENVIRONMENTS.md`.

Also added `aspire/scripts/seed-dev-postgres.sh` to apply `supabase/migrations/*.sql` to the local
dev container, and `aspire/README.md` documenting scope and non-goals.

## Why this shape

User explicitly chose (via AskUserQuestion): Aspire should define a **new dev/stage/prod
environment topology**, with Postgres as a **new local-only container** (never the real Supabase
DB). Confirmed via Microsoft Learn docs search that Aspire's deploy targets are Azure-only (no GCP
Cloud Run publisher exists), so stage/prod in the AppHost is necessarily reference-only, not a real
deployment mechanism — this repo's actual stage/prod stay on GCP/DGX Spark/Cloudflare.

## Verification status — NOT YET BUILT OR RUN

**No dotnet SDK exists in the sandbox that authored this** (`dotnet --version`: command not found).
`apphost.cs` was written against live Microsoft Learn doc searches (confirmed: Aspire 13.0
single-file AppHost format, `AddPostgres`/`AddDatabase`/`WithDataVolume`/`WithPgAdmin`,
`AddParameter`, `AddContainer`). One call — `AddExecutable(name, command, workingDirectory, args...)`
for launching the Node backend — could not be confirmed against current docs; it's a long-standing
core Aspire API but the exact current overload wasn't verifiable here.

**Next session / the user (who has the Aspire CLI + dotnet SDK installed on Windows) must:**

1. `cd aspire && aspire run` — fix any compile errors (file-based AppHost gives clear MSBuild
   errors on first restore).
2. If `AddExecutable(...)` doesn't compile, check current Aspire docs/IntelliSense and adjust —
   intent is unchanged (run `npm run dev` from repo root as an orchestrated process).
3. Confirm the Postgres container starts, then run `aspire/scripts/seed-dev-postgres.sh` against it
   and confirm all 86 `supabase/migrations/*.sql` files apply cleanly.
4. Report back / update this handoff once verified so the next session doesn't re-derive this.

## Non-goals confirmed with user before building

- Not touching Supabase EU (the real database) — local-only Postgres container, explicit user choice.
- Not making Aspire a GCP/Cloud Run deploy mechanism — Aspire has no GCP publisher.
- Not rewiring `src/` off `supabase-js` onto raw Postgres — out of scope, application-level change.
