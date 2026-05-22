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
