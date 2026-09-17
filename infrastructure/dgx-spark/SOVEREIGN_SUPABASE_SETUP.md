# Sovereign Supabase on the DGX — Setup Runbook (Scenario S2)

**Owner:** Lifetime Oy · risto.paarni@lifetime.fi
**Goal:** run the whole Supabase stack ON the DGX so the backend's Supabase
client talks to a local instance, not Supabase Cloud (US). Same app code; data
never leaves the box. This closes the last US link in the DGX sovereignty chain
(see `infrastructure/DEPLOYMENT_SCENARIOS.md`).

> **Status:** the overlay + gateway config were authored in-repo but **not
> executed or validated here** (no Docker in the authoring environment). Treat
> this as a first-run checklist to perform on the DGX; confirm each step's output.

## Files

- `docker-compose.supabase.yml` — the Supabase stack (db, kong, auth, rest,
  storage, meta, studio), opt-in overlay on `dws-network`.
- `supabase/kong.yml` — gateway routes (template; env-rendered at kong start).
- `supabase/env.sovereign.example` — the `.env` vars to add.

## 1 — Generate secrets (on the DGX)

```bash
# Postgres password and JWT secret
openssl rand -base64 48   # -> POSTGRES_PASSWORD
openssl rand -base64 48   # -> JWT_SECRET
```

## 2 — Generate the anon + service_role API keys

Both are JWTs signed HS256 with `JWT_SECRET`, 10-year expiry, differing only by
`role`. Generate with node (no extra deps beyond `jsonwebtoken`, already a repo
dependency) — run from the repo root on the DGX:

```bash
JWT_SECRET='<paste JWT_SECRET>' node -e '
const jwt=require("jsonwebtoken"); const s=process.env.JWT_SECRET;
const iat=Math.floor(Date.now()/1000), exp=iat+10*365*24*3600;
for(const role of ["anon","service_role"])
  console.log(role, jwt.sign({role,iss:"supabase",iat,exp}, s));
'
```

Copy the `anon` token → `SUPABASE_ANON_KEY`, the `service_role` token →
`SUPABASE_SERVICE_KEY`. (The service_role key bypasses RLS — treat as a secret.)

## 3 — Add the vars to `.env`

Append the block from `supabase/env.sovereign.example` to
`infrastructure/dgx-spark/.env` with the generated values, including:

```
SUPABASE_URL=http://supabase-kong:8000
SUPABASE_ANON_KEY=<anon jwt>
SUPABASE_SERVICE_KEY=<service_role jwt>
```

This repoints `dws-backend`, `dws-cron`, and `mcp-gateway` (all use `env_file:
.env`) at the local Supabase — **no code change**.

## 4 — Bring up the stack

```bash
cd infrastructure/dgx-spark
docker compose -f docker-compose.yml -f docker-compose.supabase.yml up -d
docker compose -f docker-compose.yml -f docker-compose.supabase.yml ps
```

## 5 — Apply the schema (the local DB starts empty)

The repo's migrations live in `supabase/migrations/`. Apply them to the local DB
before pointing production traffic at it:

```bash
# Option A — Supabase CLI (if installed on the DGX):
supabase db push --db-url "postgres://supabase_admin:<POSTGRES_PASSWORD>@localhost:5432/postgres"

# Option B — psql apply in order:
for f in ../../supabase/migrations/*.sql; do
  psql "postgres://supabase_admin:<POSTGRES_PASSWORD>@localhost:5432/postgres" -f "$f" || break
done
```

**Optional data migration** (only if preserving existing Cloud data): `pg_dump`
from the Supabase Cloud project → restore into the local DB. Do this during a
maintenance window; it is a human, one-time step.

## 6 — Verify

```bash
docker exec supabase-db pg_isready -U supabase_admin           # accepting connections
curl -s http://localhost:8000/auth/v1/health                    # GoTrue via Kong
curl -s http://localhost:8000/rest/v1/ -H "apikey: <ANON_KEY>"  # PostgREST via Kong
curl -sf http://localhost:8080/health                           # backend still healthy
```

Studio (admin UI) is on `http://localhost:3001` (localhost only). Then restart
the app services so they pick up the new `.env`:

```bash
docker compose up -d --force-recreate dws-backend dws-cron mcp-gateway
```

## 7 — Ingress (choose per sovereignty need)

- **Air-gapped / single-tenant Aegis:** no public ingress — nothing to do.
- **Public backend on the DGX:** repoint the frontends' API base URL from the
  scw.cloud endpoint to the DGX ingress hostname. For maximal sovereignty prefer
  an **EU reverse proxy on a static EU IP** over Cloudflare Tunnel (US transit).

## Rollback

Point `.env` back at the Supabase Cloud/Aiven URL + keys, `--force-recreate` the
app services, then `docker compose -f docker-compose.yml -f
docker-compose.supabase.yml down` (keep the volumes if you want the local data).

## Notes / caveats

- **Image tags** in `docker-compose.supabase.yml` are pinned to a recent stable
  set but were not run here — confirm each against the official Supabase
  self-hosted release before first boot (arm64/Grace Blackwell is supported).
- The base stack is unaffected until you pass `-f docker-compose.supabase.yml`.
- Realtime, imgproxy, functions, and analytics are intentionally omitted (not
  used by the backend today) — add them if a workload needs them.
