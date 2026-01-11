# DWS IQ Cloudflare Integration

**Secure AI Agent Execution in Cloudflare Sandboxes**

This module provides a hybrid architecture that combines Claude Agent SDK with Cloudflare's sandboxed execution environment for secure, scalable, multi-tenant AI agent deployment.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE (Global)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  MCP Gateway    │  │  Claude Agent   │  │  Tenant Sandbox │              │
│  │  (mcp-gateway)  │  │  (worker-agent) │  │  (tenant-sandbox)│             │
│  │                 │  │                 │  │                 │              │
│  │  • OAuth auth   │  │  • Agent SDK    │  │  • Multi-tenant │              │
│  │  • Rate limit   │  │  • Tool calls   │  │  • Isolation    │              │
│  │  • Caching      │  │  • Streaming    │  │  • Per-customer │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                │                                             │
│  ┌─────────────────────────────┴─────────────────────────────┐              │
│  │                    Billing Integration                     │              │
│  │  • Usage metering • Stripe integration • Invoice generation│              │
│  └───────────────────────────────────────────────────────────┘              │
├─────────────────────────────────────────────────────────────────────────────┤
│                         CLOUDFLARE TUNNEL                                    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                         DOCKER ORIGIN (EU Data Center)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   MCP Hub       │  │  Temporal.io    │  │  PostgreSQL     │              │
│  │   (port 8765)   │  │  (port 7233)    │  │  + pgvector     │              │
│  │                 │  │                 │  │  (port 5433)    │              │
│  │  • Orchestration│  │  • Workflows    │  │  • Context      │              │
│  │  • Agent coord  │  │  • Fan-out      │  │  • EU rules     │              │
│  │  • MCP protocol │  │  • Reflection   │  │  • Carbon calc  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Claude Agent Worker (`worker-agent.ts`)

The main AI agent execution worker that runs Claude models in a secure V8 isolate.

**Features:**
- Claude Agent SDK integration
- DWS IQ climate intelligence system prompt
- Built-in tools for carbon calculation, compliance checking
- Rate limiting per tenant
- Usage metering for billing

**Endpoints:**
- `POST /` - Execute agent request
- `GET /health` - Health check

### 2. MCP Edge Gateway (`mcp-gateway.ts`)

Routes MCP protocol requests from edge to origin with authentication and caching.

**Features:**
- OAuth token validation
- Request caching for read operations
- SSE streaming for long-running operations
- Rate limiting per tenant
- Tenant routing to dedicated workers

**Endpoints:**
- `POST /mcp` - MCP JSON-RPC endpoint
- `POST /mcp/stream` - SSE streaming endpoint
- `GET /.well-known/mcp.json` - Server discovery
- `GET /health` - Health check

### 3. Tenant Sandbox Manager (`tenant-sandbox.ts`)

Multi-tenant isolation using Workers for Platforms.

**Features:**
- Tenant configuration management
- Dynamic worker generation
- Resource limits per tier
- Admin API for tenant CRUD

**Endpoints:**
- `POST /sandbox/execute` - Execute in tenant sandbox
- `POST /admin/tenants` - Create tenant
- `GET /admin/tenants/:id` - Get tenant config
- `PUT /admin/tenants/:id` - Update tenant
- `GET /admin/tenants/:id/usage` - Get usage report
- `GET /health` - Health check

### 4. Billing Integration (`billing-integration.ts`)

Stripe integration for usage-based billing.

**Features:**
- Usage aggregation from Analytics Engine
- Stripe metered billing
- Webhook handling
- Usage threshold alerts

**Endpoints:**
- `GET /pricing` - Get pricing tiers
- `GET /usage/:tenantId` - Get usage summary
- `POST /sync/:tenantId` - Sync usage to Stripe
- `GET /invoice/:tenantId` - Get upcoming invoice
- `POST /webhooks/stripe` - Stripe webhook

---

## Pricing Tiers

| Tier | Base Price | Per Million Tokens | Included Tokens | Rate Limit |
|------|------------|-------------------|-----------------|------------|
| **Sandbox** | €500/month | €20 | 1M | 20/min |
| **Professional** | €2,000/month | €15 | 10M | 100/min |
| **Enterprise** | €5,000/month | €10 | 100M | 1000/min |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account with Workers plan
- Wrangler CLI (`npm install -g wrangler`)
- Anthropic API key

### Installation

```bash
# Navigate to cloudflare directory
cd src/cloudflare

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login
```

### Create KV Namespaces

```bash
# Create all required KV namespaces
npm run kv:create
```

### Set Secrets

```bash
# Set all required secrets
npm run secrets:set
```

### Local Development

```bash
# Run all workers in development mode
npm run dev

# Or run specific workers
npm run dev:gateway
npm run dev:sandbox
npm run dev:billing
```

### Deploy to Cloudflare

```bash
# Build all workers
npm run build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

---

## Configuration

### Wrangler Configuration Files

- `wrangler.toml` - Main Claude agent worker
- `wrangler.gateway.toml` - MCP gateway worker
- `wrangler.sandbox.toml` - Tenant sandbox manager
- `wrangler.billing.toml` - Billing integration

### Environment Variables

**Required Secrets (set via `wrangler secret put`):**

| Secret | Worker | Description |
|--------|--------|-------------|
| `ANTHROPIC_API_KEY` | agent, sandbox | Claude API key |
| `MCP_HUB_API_KEY` | gateway | Backend authentication |
| `OAUTH_CLIENT_ID` | gateway | OAuth client ID |
| `OAUTH_CLIENT_SECRET` | gateway | OAuth client secret |
| `ADMIN_API_KEY` | sandbox | Admin API authentication |
| `STRIPE_SECRET_KEY` | billing | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | billing | Stripe webhook signing |

---

## Hybrid Deployment

The hybrid deployment combines Cloudflare edge workers with Docker-based origin services.

### Start Origin Services

```bash
# From project root
docker-compose -f docker-compose.hybrid.yml up -d

# With monitoring
docker-compose -f docker-compose.hybrid.yml --profile monitoring up -d
```

### Deploy Edge Workers

```bash
cd src/cloudflare
npm run deploy:production
```

### Configure Cloudflare Tunnel

For secure connection between Cloudflare and origin:

1. Create tunnel in Cloudflare Zero Trust dashboard
2. Get tunnel token
3. Set `CLOUDFLARE_TUNNEL_TOKEN` in `.env.mcp`
4. Enable tunnel service:

```bash
docker-compose -f docker-compose.hybrid.yml --profile production up -d cloudflare-tunnel
```

---

## Security

### Isolation Model

- **V8 Isolates**: Each request runs in isolated V8 context
- **VM Sandboxes**: Full VM isolation for untrusted code execution
- **Network Isolation**: Separate network stacks per tenant
- **Resource Limits**: CPU, memory, and disk quotas

### Authentication

- **OAuth 2.0**: For enterprise customers
- **API Keys**: For internal/development use
- **JWT Tokens**: For session management

### EU Data Residency

All workers are configured with `placement.mode = "smart"` to prefer EU edge nodes. Origin services run in EU data centers (Finland/Germany).

---

## Monitoring

### Logs

```bash
# Tail worker logs
npm run tail         # Main agent
npm run tail:gateway # MCP gateway
npm run tail:sandbox # Sandbox manager
npm run tail:billing # Billing
```

### Metrics

Cloudflare Analytics Engine captures:
- Request counts per tenant
- Token usage (input/output)
- Execution times
- Cache hit rates
- Error rates

Access via Cloudflare dashboard or GraphQL API.

---

## Integration with MCP Hub

The Cloudflare workers integrate with the existing MCP Hub via:

1. **HTTP API**: Workers call MCP Hub origin for complex operations
2. **MCP Protocol**: Full JSON-RPC 2.0 over HTTPS
3. **Cloudflare Tunnel**: Secure connection without public IP

### Routing Logic

```
Customer Request
       │
       ▼
┌──────────────────┐
│  MCP Gateway     │ ── Cache hit? ──▶ Return cached
│  (Cloudflare)    │
└────────┬─────────┘
         │
    Has dedicated sandbox?
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Tenant      Shared
Sandbox     MCP Hub
(Cloudflare) (Docker)
```

---

## API Examples

### Execute Agent Request

```bash
curl -X POST https://agent.dws10.com/ \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: vinci-construction" \
  -d '{
    "prompt": "Calculate embodied carbon for 1000kg of concrete C30/37",
    "config": {
      "model": "claude-sonnet-4-20250514",
      "maxTokens": 4096
    },
    "tools": ["carbon_calculate"]
  }'
```

### Create Tenant

```bash
curl -X POST https://sandbox.dws10.com/admin/tenants \
  -H "Content-Type: application/json" \
  -H "X-Admin-API-Key: your-admin-key" \
  -d '{
    "tenantId": "vinci-construction",
    "tenantName": "Vinci Construction",
    "tier": "enterprise",
    "customerId": "cus_xxx"
  }'
```

### Get Usage Report

```bash
curl https://billing.dws10.com/usage/vinci-construction?start=2026-01-01&end=2026-01-31 \
  -H "Authorization: Bearer your-token"
```

---

## Troubleshooting

### Worker Not Responding

1. Check worker logs: `npm run tail`
2. Verify secrets are set: `wrangler secret list`
3. Check KV namespace bindings in wrangler.toml

### Rate Limiting Issues

1. Check tenant configuration: `GET /admin/tenants/:id`
2. Verify rate limit KV entries
3. Upgrade tenant tier if needed

### Billing Sync Failures

1. Verify Stripe API key is correct
2. Check subscription status in Stripe dashboard
3. Review billing worker logs

---

## License

Proprietary - Lifetime Oy

Contact: risto@lifetime.fi

Repository: https://github.com/blogtheristo/dws6
