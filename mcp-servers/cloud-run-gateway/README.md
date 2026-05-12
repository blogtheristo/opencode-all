# MCP Gateway — Cloud Run

Hosts MCP tools over **Streamable HTTP** on Google Cloud Run so Claude Code
mobile sessions can use Supabase and GitHub MCP tools without local processes.

## Scope (May 2026 update)

Since Google Cloud now ships first-party MCP servers for its native services
(Cloud Run, BigQuery, GCS, Cloud Logging, Maps Grounding Lite, …), this
gateway is no longer the place to add new GCP-native tools. See
`docs/MCP_CONFIGURATION.md` section 4 and `mcp.google-managed.example.json`
at the repo root.

This gateway keeps:

- Supabase tools (DWS-specific, not a Google service)
- DWS agent surface (`dws_*` tools)
- GitHub passthrough for non-Claude clients (Claude Code uses its built-in
  GitHub MCP via OAuth)

Do not add new thin GCP wrappers here — use the Google-managed MCP for
those in the client's `.mcp.json` instead.

## Problem

Claude Code on mobile (web) cannot spawn local MCP server processes via stdio.
This gateway runs on Cloud Run and exposes the same MCP tools over HTTP.

## Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│  Claude Code Mobile  │──HTTP──▶│  MCP Gateway (Cloud Run) │
│  (web session)       │         │  europe-north1            │
└─────────────────────┘         │                          │
                                │  ┌─────────────┐         │
┌─────────────────────┐         │  │ Supabase     │ tools   │
│  Claude Code Desktop │──HTTP──▶│  │ GitHub       │ tools   │
│  (also works)        │         │  └─────────────┘         │
└─────────────────────┘         │                          │
                                │  Secrets from GCP        │
                                │  Secret Manager          │
                                └──────────────────────────┘
```

## Available Tools

### Supabase

- `supabase_query` — Query any table with filters, ordering, limits
- `supabase_insert` — Insert rows
- `supabase_update` — Update rows matching filters
- `supabase_rpc` — Call PostgreSQL functions
- `supabase_list_tables` — List all tables

### GitHub

- `github_list_repos` — List repos for user/org
- `github_get_repo` — Get repo details
- `github_list_issues` — List issues with filters
- `github_list_prs` — List pull requests
- `github_get_file` — Read file contents
- `github_search_code` — Search code across repos
- `github_create_issue` — Create new issues

### Gateway

- `gateway_health` — Health check for all connected services

## Setup

### 1. Provision secrets

From a machine with `gcloud` CLI:

```bash
# Provision all keys from .env and .env.mcp to Google Secret Manager
./scripts/provision-secrets.sh

# Or dry-run first
./scripts/provision-secrets.sh --dry-run

# Also create gateway-specific secrets
echo -n "your-gateway-api-key" | gcloud secrets create mcp-gateway-api-key \
  --data-file=- --replication-policy="automatic"

echo -n "ghp_your-github-token" | gcloud secrets create github-token \
  --data-file=- --replication-policy="automatic"
```

### 2. Create service account

```bash
export PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts create mcp-gateway \
  --display-name="MCP Gateway Service Account"

# Grant Secret Manager access
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:mcp-gateway@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Deploy to Cloud Run

```bash
gcloud builds submit \
  --config=mcp-servers/cloud-run-gateway/cloudbuild.yaml \
  .
```

### 4. Configure Claude Code

Get the Cloud Run URL:

```bash
export MCP_URL=$(gcloud run services describe mcp-gateway \
  --region=europe-north1 --format='value(status.url)')
echo $MCP_URL
```

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "dws-gateway": {
      "type": "url",
      "url": "https://mcp-gateway-XXXXX-ew.a.run.app/mcp"
    }
  }
}
```

See `mcp-config.example.json` for full examples.

## Local Development

```bash
# Install deps
pip install -r requirements.txt

# Run locally with stdio (for testing with Claude Code desktop)
python server.py --transport stdio

# Run locally with HTTP (for testing the HTTP endpoint)
python server.py --transport streamable-http --port 8080
```

## Cost

| Resource                  | Estimate        |
| ------------------------- | --------------- |
| Cloud Run (scale-to-zero) | ~€2-5/month     |
| Secret Manager            | ~€0.50/month    |
| Artifact Registry         | ~€0.50/month    |
| **Total**                 | **~€3-6/month** |
