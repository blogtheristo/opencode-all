# Credential Brokering

## Why

Agents like OpenClaw and Hermes run in the same process tree we do. If we
hand them raw API keys (`ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`,
`GMAIL_ACCESS_TOKEN`, …) and the execution environment is compromised,
**all upstream services are owned**. There is no way to rotate, scope, or
revoke a leaked key without redeploying every caller.

Instead: agents are given **capability tokens** scoped to specific upstream
services. They send their requests to a **broker** in this codebase. The
broker exchanges the capability token for the real credential — pulled
from a vault, never written to disk near the agent — and forwards the
request.

```
  ┌──────────┐    Bearer <capability-token>    ┌────────────────┐
  │ OpenClaw │ ───────────────────────────────► │  /api/v1/broker│
  └──────────┘                                  │   (this repo)  │
                                                └───────┬────────┘
                                                        │ x-api-key: <real>
                                                        ▼
                                              ┌───────────────────┐
                                              │  api.anthropic.com │
                                              └───────────────────┘
```

## Pieces

### 1. Vault loader — `src/config/secret-loader.ts`

Pulls upstream credentials into `process.env` at boot. Supported
providers:

- **Aiven** (EU-sovereign, recommended) — Aiven PostgreSQL `app_secrets`
  table encrypted with `pgcrypto` (`pgp_sym_encrypt`, AES-256). Bootstrap
  needs `AIVEN_DATABASE_URL` + `AIVEN_VAULT_KEY` only.
- **GCP Secret Manager** — `VAULT_PROVIDER=gcp` + `GCP_PROJECT_ID`.

Priority: existing `process.env` always wins. Vault only fills holes.
Called from `src/app.ts` before `validateEnv()`.

### 2. Provider registry — `src/broker/providers.ts`

Maps a scope id to:
- where the broker forwards to (`upstreamBaseUrl`)
- the env var that holds the upstream credential (`credentialEnv`)
- how to attach the credential (`injectAuth`)

Bundled providers: `anthropic`, `openrouter`, `groq`, `telegram`, `gmail`.

### 3. Capability tokens — `src/broker/capability-tokens.ts`

Registry source: `BROKER_AGENT_TOKENS` env var (itself loadable from the
vault). JSON shape:

```json
{
  "openclaw": { "tokenSha256": "<hex sha256>", "scopes": ["anthropic","telegram"] },
  "hermes":   { "tokenSha256": "<hex sha256>", "scopes": ["anthropic","gmail"] }
}
```

The plaintext token is what the agent sends; the broker only ever stores
the SHA-256. Compare is timing-safe (`crypto.timingSafeEqual`).

Generate a token for an agent:

```bash
TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
HASH=$(node -e "console.log(require('crypto').createHash('sha256').update('$TOKEN').digest('hex'))")
echo "give to agent: $TOKEN"
echo "register hash: $HASH"
```

### 4. Audit log — `src/broker/audit-log.ts`

Every brokered call emits a structured pino event with `audit: "broker"`
and metadata (`agentId`, `providerId`, `method`, `upstreamPath`, `status`,
`durationMs`, byte counts). **Request and response bodies are never
logged.** Denials emit `audit: "broker_denied"`.

### 5. HTTP handler — `src/broker/broker.routes.ts`

Mounted at `/api/v1/broker`. Generic shape:

```
<METHOD> /api/v1/broker/:providerId/<upstream-path>
Authorization: Bearer <capability-token>
<body>
```

Flow: authenticate → scope-check → resolve upstream → inject credential
→ forward → log. The incoming `Authorization` header is stripped before
forwarding; the broker token is never sent upstream.

## Wiring an agent

1. Operator generates a token, stores the SHA-256 in `BROKER_AGENT_TOKENS`,
   gives the plaintext to the agent (out of band, one-shot).
2. Agent config: `BROKER_URL=https://your-host/api/v1/broker` and
   `BROKER_TOKEN=<plaintext>`.
3. Instead of `https://api.anthropic.com/v1/messages` the agent calls
   `${BROKER_URL}/anthropic/v1/messages` with
   `Authorization: Bearer ${BROKER_TOKEN}`.
4. Operator rotates by replacing the hash in `BROKER_AGENT_TOKENS`
   (and updating the vault). No code change.

## What the broker does NOT do (yet)

- Per-agent rate limits beyond the global `/api/` limiter.
- Streaming (SSE / chunked) responses — currently buffers the full
  upstream response before relaying. Acceptable for chat completion
  requests; will need rework for Anthropic streaming.
- Signed expiring tokens. `BROKER_SIGNING_KEY` is reserved for that.
- Per-call cost accounting. Hook into the audit log to add it.

These are deliberate omissions for V1.
