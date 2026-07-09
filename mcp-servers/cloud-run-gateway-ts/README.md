# DWS MCP Gateway — Cloud Run (TypeScript)

This replaces `cloud-run-gateway/server.py` with **`@modelcontextprotocol/sdk`** Streamable HTTP on **`POST /mcp`** / **`GET /mcp`** (SSE session continuation).

Supabase + GitHub tools match the Python gateway surface (`gateway_health`, `supabase_*`, `github_*`).

## Local stdio (Win11 / Claude `.mcp.json`)

After `npm install && npm run build` in this directory:

```powershell
node dist/server.js --transport stdio
```

## GCP operator principal

Use **`admin@dws.com`** as the human GCP Console / `gcloud` identity when deploying and administering Artifact Registry + Cloud Run. Runtime workloads continue to use a dedicated service account from IAM (`mcp-gateway@${PROJECT_ID}.iam.gserviceaccount.com` in Cloud Build examples).

## Build image locally

```powershell
cd mcp-servers\cloud-run-gateway-ts
docker build -t dws-mcp-gateway-ts:local .
```

## Deploy (Artifact Registry + Cloud Run)

From repo root:

```text
gcloud builds submit --config=mcp-servers/cloud-run-gateway-ts/cloudbuild.yaml `
  --substitutions=SHORT_SHA=manual-${sanitized-branch-name}
```

After deploy, point **`mcp-hub-ts`** at this service with **`DWS_GATEWAY_URL`** (Cloud Run HTTPS URL for `mcp-gateway`).

## Secrets

Same Secret Manager bindings as the Python gateway: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `GITHUB_TOKEN`, `MCP_GATEWAY_API_KEY`.

## Deploy on DGX Spark (priority 1 — zero marginal cost, EU-sovereign)

Per `docs/CLOUD_ENVIRONMENTS.md` §12.9, DGX Spark is the preferred host for this gateway ahead of Cloud Run. This container is now defined as the `mcp-gateway` service in `infrastructure/dgx-spark/docker-compose.yml` and starts automatically with the rest of the DGX stack — no code change needed to bring it up. Two things remain, both outside this repo:

1. **Set the four secrets above in the DGX host's `.env`** (the same file `docker-compose.yml` already loads via `env_file`). Until `MCP_GATEWAY_API_KEY` is set, the gateway logs a warning and **accepts unauthenticated requests** — that's fine while it's only reachable inside the DGX Docker network (no host port is published), but it is **not safe to expose publicly until this is set**.
2. **Create the public ingress**, only once you're ready to let mobile Claude Code reach it:
   - In the Cloudflare Zero Trust dashboard, create a Tunnel and copy its token.
   - Add `CLOUDFLARE_TUNNEL_TOKEN=<token>` to the DGX host's `.env`.
   - In the tunnel's public-hostname config, route a hostname (e.g. `mcp-gateway.dws10.com`) to `http://mcp-gateway:8080` (the compose service name — the tunnel container shares the same Docker network).
   - Start the tunnel with `docker compose --profile gateway up -d cloudflare-tunnel` (it's profile-gated so it never starts by accident before the token exists).
   - Point the Claude Code MCP config at the new hostname (same `"type": "url"` shape documented in `docs/CLOUD_ENVIRONMENTS.md` §12.5), then retire the Cloud Run `mcp-gateway` service once verified.
