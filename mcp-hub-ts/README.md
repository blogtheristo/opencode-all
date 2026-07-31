# DWS MCP Hub — TypeScript (Cloud Run / hybrid)

Preferred MCP coordination hub implementation (`express`, `zod`). Exposes `/health`, `/agent/task`, `/llm/*`, `/workflow/*`, and `/backend/*` routes aligned with the Python `mcp-hub` orchestrator.

## GCP operations identity

Deploy and operate the Cloud Run services with the **`admin@dws.com`** Google Cloud identity (console login / IAM principal). Map workload identity separately via service accounts such as `mcp-gateway@${PROJECT_ID}.iam.gserviceaccount.com` and **`mcp-hub@${PROJECT_ID}.iam.gserviceaccount.com`** for Cloud Run run-as identities — humans operate under **`admin@dws.com`**, not shared SA keys.

## Local development

```powershell
cd mcp-hub-ts
npm install
npm run dev
```

Defaults listen on port **8765** (`PORT` / `MCP_HUB_PORT` overrides).

## Docker / Cloud Build

From repo root (substitutions match Cloud Build triggers):

```text
gcloud builds submit --config=mcp-hub-ts/cloudbuild.yaml `
  --substitutions=SHORT_SHA=manual-${sanitized-branch-name}
```

## Env vars

| Variable | Purpose |
|----------|---------|
| `MCP_HUB_API_KEY` | Bearer token for authenticated routes (`/health` exempt). |
| `DWS_GATEWAY_URL` | HTTPS Cloud Run URL of **cloud-run-gateway-ts** (`agent` key `dws-gateway`). |
| `MCP_HUB_LLM_REGISTRY_JSON` | Optional path to LLM mesh registry JSON. |
| `OLLAMA_HOST` / `OLLAMA_BASE_URL` | Default mesh includes local/OSS inference when reachable. |

Redis streams, BIM pipeline, Gemini review, and OpenSandbox routes remain **503 stubs** here — use the Python `mcp-hub` behind Docker Compose where those integrations are required.
