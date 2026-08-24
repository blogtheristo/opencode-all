# Cloudflare Sandbox – Value Proposition

**Use Case:** Investor Deck · Construction Business Case · Grant/Partner Applications

---

## 🎯 Board & Investor Version

> **Paste this first in investor materials**

### Enterprise Sandbox Value (Board-Ready)

Strengthens enterprise security posture for Tier 1 construction customers by keeping sensitive climate and financial models in isolated, EU-hosted sandboxes. Opens a new high-margin revenue stream via private customer sandboxes and reduces infrastructure cost through pay-per-use instead of fixed hosting. Fits our hybrid edge/cloud model with the NVIDIA fleet and reinforces DWS IQ 6 as the de facto platform for Fit for 55 compliance across 8–16 regulated industries.

**Key Investor Takeaways:**

| Benefit | Impact |
|---------|--------|
| **Security** | EU-hosted isolation → Tier 1 enterprise trust |
| **Revenue** | New sandbox subscription tier → €2,000–€5,000/mo per customer |
| **Cost** | Pay-per-use model → 40–60% infra savings vs. fixed hosting |
| **Positioning** | De facto platform for Fit for 55 compliance |

---

## 📐 Technical Appendix

> **For architects, technical due diligence, and engineering partners**

### Sandbox Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers (Edge)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Tenant A    │  │ Tenant B    │  │ Tenant C    │  ...         │
│  │ Sandbox     │  │ Sandbox     │  │ Sandbox     │              │
│  │ (V8 Isolate)│  │ (V8 Isolate)│  │ (V8 Isolate)│              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MCP Gateway (Coordination)                   │
│  - Authentication (OAuth2/OIDC)                                  │
│  - Tenant routing & rate limiting                                │
│  - Usage metering → Stripe billing                               │
│  - Temporal orchestration for long-running workflows             │
└─────────────────────────────────────────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MCP Hub (Backend)                            │
│  - Claude Agent SDK integration                                  │
│  - Customer-specific system prompts                              │
│  - Tool execution (carbon_calculate, compliance_check, etc.)     │
│  - Agent memory persistence (Supabase)                           │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Hybrid Edge/Cloud Infrastructure                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐    │
│  │ Cloudflare    │    │ GCP Cloud Run │    │ NVIDIA Edge   │    │
│  │ Workers (Edge)│ ←→ │ (EU-west1)    │ ←→ │ Fleet (On-prem)│   │
│  │ Low-latency   │    │ Heavy compute │    │ Sensitive data│    │
│  └───────────────┘    └───────────────┘    └───────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Value Drivers

#### 1. Security Posture Enhancement

- **V8 Isolate Sandboxing**: Each tenant runs in isolated V8 context
- **EU Data Residency**: All data processed in EU-hosted workers
- **Zero-Trust Architecture**: Per-request authentication, no shared state
- **Audit Trail**: Complete logging for CSRD/GDPR compliance

#### 2. MCP Hub Integration

- **Model Context Protocol**: Open standard for AI agent interoperability
- **Fan-out Workflows**: Parallel agent execution across sandboxes
- **Reflection Patterns**: Self-correcting compliance checks
- **Sequential Pipelines**: BIM → Carbon → Report generation

#### 3. Temporal Orchestration (Long-Running Workflows)

- **Durable Execution**: Workflows survive infrastructure failures
- **State Persistence**: Resume complex calculations after interruption
- **Retry Logic**: Automatic retry for external API calls (SAP, BIM systems)
- **Timeouts**: Configurable per-tenant execution limits

#### 4. Billing Integration

- **Usage Metering**: Token-level tracking per tenant
- **Stripe Integration**: Automated invoicing, subscription management
- **Tier Enforcement**: Rate limits by subscription level
- **Cost Allocation**: Per-project/per-sandbox billing visibility

### Infrastructure Cost Model

| Model | Monthly Cost (10 customers) | Notes |
|-------|----------------------------|-------|
| **Fixed Hosting** | €8,000–€12,000 | Reserved instances, always-on |
| **Cloudflare Pay-per-Use** | €3,000–€5,000 | Workers + KV + Durable Objects |
| **Savings** | **40–60%** | Scale to 0 when idle |

### Technical Integration Points

```typescript
// Tenant Sandbox Configuration
interface TenantConfig {
  tenantId: string;
  tenantName: string;
  tier: 'professional' | 'enterprise';
  customSystemPrompt: string;
  enabledTools: string[];
  mcpServers?: MCPServerConfig[];
  euDataResidency: boolean;
  webhookUrl?: string;
}

// MCP Gateway Request Flow
// 1. Authenticate tenant (OAuth2)
// 2. Route to sandbox (Cloudflare Worker)
// 3. Execute agent (Claude SDK)
// 4. Log usage (Analytics Engine)
// 5. Bill tenant (Stripe metered)
```

### Compliance Mapping

| Requirement | Sandbox Feature |
|-------------|-----------------|
| GDPR Art. 32 | Isolated processing, EU residency |
| CSRD Audit Trail | Complete request/response logging |
| ISO 27001 | Access controls, encryption at rest |
| SOC 2 Type II | Monitoring, incident response |

---

## 📋 Usage Guide

### For Investor Deck (Slide 6 - Product/Tech)

Add after "MCP-Native Platform Architecture":

> **Enterprise Sandbox**  
> Strengthens security for Tier 1 construction customers with EU-hosted isolation. Opens new sandbox subscription revenue (€2,000–€5,000/mo) and reduces infra costs 40–60% via pay-per-use.

### For Construction Business Case

Add to "Why DWS IQ for Construction" section:

> Your carbon models and financial projections stay in your isolated environment, never shared with other tenants. Full audit trail for CSRD compliance. EU-hosted infrastructure meets your data sovereignty requirements.

### For Grant/Partner Applications (Technical Section)

Reference the Technical Appendix for:
- Architecture diagrams
- Security posture details
- Billing integration overview
- Compliance mapping table

---

**Document Version:** 1.0  
**Created:** January 4, 2026  
**Author:** Lifetime Oy  
**Status:** Ready for Integration
