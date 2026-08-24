# DWS IQ Developer Program

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-03-25
Author: Risto Päärni
Agent: Claude Code (Opus 4.6)
Branch: claude/wellness-platform-analysis-SCnPS
Status: DRAFT

---

## 1. Overview

The DWS IQ Developer Program gives external developers access to the DWS IQ 6 platform — APIs, MCP tools, AI agents, and compliance engines — to build integrations, extensions, and vertical solutions for EU-regulated industries.

**URL:** https://dws10.com/developers

## 2. Program Tiers

### Free Tier — Explorer

- Access to DWS IQ API sandbox (rate-limited)
- MCP tool discovery endpoint (`tools/list`)
- Public documentation and SDK
- Community support (GitHub Discussions)
- 1,000 API calls/month

### Standard Tier — Builder (EUR 99/month)

- Full API access (50,000 calls/month)
- Access to all 16+ AI agents via MCP
- Staging environment with Supabase test database
- Email support (48h response)
- Developer dashboard with usage analytics
- Pre-built ERP connector templates (SAP, IFS, Dynamics)

### Enterprise Tier — Architect (Custom pricing)

- Unlimited API calls
- Dedicated sandbox environment (EU-sovereign, europe-north1)
- Priority support (4h response SLA)
- Co-development sprints with Lifetime Oy engineers
- Early access to new agents and MCP tools
- Joint go-to-market for vertical solutions
- Custom compliance scoring models

## 3. What You Can Build

| Category | Examples | APIs/Tools |
|----------|----------|------------|
| ERP Integrations | SAP add-on, IFS connector, Visma plugin | `src/integrations/erp/` patterns |
| Compliance Tools | CSRD reporter, CBAM calculator, ETS dashboard | Compliance agents via MCP |
| Vertical AI Agents | Construction safety, logistics optimizer, quality gate | Agent SDK + MCP registration |
| Analytics Dashboards | Carbon analytics, ESG scoring, fleet monitoring | Supabase Realtime + pgvector |
| Workflow Automation | Onboarding flows, approval chains, report generation | Temporal.io + event bus |

## 4. Technical Access

### API Endpoint

```
https://api.dws10.com/v1/
```

### MCP Integration

```bash
# Discover available tools
curl -X POST https://api.dws10.com/mcp \
  -H "Authorization: Bearer $DWS_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### SDK (TypeScript)

```typescript
import { DWSClient } from '@lifetime-oy/dws-sdk';

const client = new DWSClient({
  apiKey: process.env.DWS_API_KEY,
  region: 'eu-north1' // EU-sovereign by default
});

// Run a compliance check
const result = await client.agents.run('compliance', {
  regulation: 'CSRD',
  industry: 'construction'
});
```

### CLI

```bash
npx dws agents                              # List all agents
npx dws run compliance --input '{"reg":"CSRD"}'
npx dws workflow compliance-assessment
```

## 5. EU Sovereignty Requirements

All developer integrations MUST comply with:

- **Data residency:** EU only (Finland/Germany — europe-north1)
- **GDPR:** Data processing agreements required for Standard+ tiers
- **EU AI Act:** Agent outputs must include reasoning lineage (sovereignty audit layer)
- **No CLOUD Act exposure:** No US-jurisdiction data processing

## 6. Developer Resources

| Resource | Location |
|----------|----------|
| API Documentation | https://dws10.com/developers/docs |
| SDK Repository | https://github.com/lifetime-oy/dws-sdk (coming) |
| MCP Specification | JSON-RPC 2.0 at `/mcp` endpoint |
| Agent Catalog | 16+ agents — `dws agents` or MCP `tools/list` |
| Sample Integrations | `src/integrations/` patterns in DWS6 repo |
| Community | GitHub Discussions |

## 7. Onboarding Process

1. **Apply** — Submit application at https://dws10.com/developers
2. **Review** — Lifetime Oy reviews use case and compliance fit (2-5 business days)
3. **Sandbox access** — API key + staging environment provisioned
4. **Build** — Develop integration using SDK, MCP, or REST API
5. **Certify** — Submit for security and compliance review
6. **Launch** — Listed in DWS Marketplace (Architect tier)

## 8. Revenue Sharing

| Tier | Revenue Share | Marketplace Listing |
|------|--------------|---------------------|
| Explorer | — | No |
| Builder | 70/30 (developer/Lifetime) | Optional |
| Architect | Custom | Featured |

## 9. Contact

- **Program Lead:** Risto Päärni, CEO — risto.paarni@lifetime.fi
- **Technical:** developers@lifetime.fi
- **Partners page:** https://dws10.com/partners
- **Captain investment:** https://dws10.com/captain

---

Lifetime Oy | Business ID: 0772407-9 | Espoo, Finland
