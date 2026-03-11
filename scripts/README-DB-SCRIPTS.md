# Database Scripts

**Run these from the repo root** (`F:\2026\Repos2026\dws6`), not from subdirectories.

## 1. Migration 042 (projects table)

### Option A: DWS Carbon API

Start the DWS Carbon API container, then use the local API tools:

```powershell
docker-compose -f docker-compose.hybrid.yml up -d carbon-api
```

The live local API on `http://localhost:8766` is a **structured table API**, not a raw SQL executor.

- `POST /tools/query` expects: `table`, optional `select`, `filters`, `limit`
- `POST /tools/insert` expects: `table`, `data`

It **cannot** apply `supabase/migrations/042_projects_dashboard.sql` by posting the SQL file to `/tools/query`.

For migration `042`, use one of these instead:

1. **Supabase SQL Editor**: paste `supabase/migrations/042_projects_dashboard.sql`
2. **npm script**: `npm run db:migrate:042`

Use the local API after that for verification and data operations.

### Option A2: Supabase Official (Docker)

Build the official Supabase MCP Docker image:

```powershell
docker build -t dws6-supabase-official-mcp:latest .\mcp-servers\supabase-official
```

Use this image from `.mcp.json` / `mcp.dws-local.example.json` with:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`

### Option B: npm script (DATABASE_URL)

```powershell
cd F:\2026\Repos2026\dws6
npm run db:migrate:042
```

**Requires:** `DATABASE_URL` in `.env.local` with SSL (`?sslmode=require`). URL‑encode password chars: `@`→`%40`, `#`→`%23`, `&`→`%26`.

### Option C: Supabase SQL Editor

Copy `supabase/migrations/042_projects_dashboard.sql` and run in **Supabase Dashboard → SQL Editor**.

## 2. Seed demo projects

```powershell
cd F:\2026\Repos2026\dws6
npm run db:seed:projects
```

**Requires:** `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env.local`.

## 3. Start dashboard

```powershell
cd F:\2026\Repos2026\dws6
cd dws6.com\dashboard\firehorse\v10-react
npm run dev
```

Or from repo root: `cd dws6.com/dashboard/firehorse/v10-react; npm run dev`
