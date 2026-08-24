# Aegis Pricing Study

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-03-26
Author: Claude Code (claude/cli-agent-management-RsURY)
Owner: Lifetime Oy
Status: Active
---

## Context

DWS IQ Aegis is a single-tenant sovereign AI platform deployed on UpCloud Managed Kubernetes (Helsinki DC). This study validates the EUR 59,990 + EUR 999/mo pricing against infrastructure cost and competitive positioning.

## Infrastructure Cost (UpCloud Helsinki, per customer)

| Component | Spec | EUR/mo |
|-----------|------|--------|
| UKS Production control plane | Up to 120 nodes | ~60 |
| 3x Worker nodes (General Purpose) | 4xCPU-8GB, 160GB MaxIOPS each | 156 |
| Managed PostgreSQL (2-node HA) | 4GB RAM/node, 50GB storage, 7-day backup | ~100 |
| Managed Valkey/Redis (single node) | ~2GB RAM | ~30 |
| Managed Load Balancer (Production S) | 2 nodes, 50k sessions | 30 |
| Egress | Zero cost (UpCloud Essentials) | 0 |
| **Total** | | **~376/mo** |

Conservative range: EUR 350-420/mo depending on exact plans.

Dev control plane option (free, up to 30 nodes): would reduce to ~EUR 316/mo, but Production control plane recommended for enterprise customers.

## Margin Analysis

### Per customer, EUR 999/mo subscription

| Metric | EUR/mo |
|--------|--------|
| Subscription revenue | 999 |
| UpCloud infra cost | ~376 |
| **Infra gross margin** | **623 (62%)** |

### Including one-time fee (amortized)

| Metric | Value |
|--------|-------|
| One-time fee | EUR 59,990 |
| Amortized over 5 years | EUR 1,000/mo |
| Effective monthly revenue | EUR 1,999/mo |
| Infra cost | EUR 376/mo |
| **Effective margin** | **EUR 1,623/mo (81%)** |

### Including support overhead

Assuming 0.5 FTE support engineer at EUR 5,000/mo per 10-15 customers:

| Scale | Infra | Support/cust | Total COGS | Margin on EUR 999 | Margin % |
|-------|-------|-------------|------------|-------------------|----------|
| 5 customers | 376 | ~500 | ~876 | +123 | 12% |
| 10 customers | 376 | ~250 | ~626 | +373 | 37% |
| 20 customers | 376 | ~125 | ~501 | +498 | 50% |
| 30 customers | 376 | ~83 | ~459 | +540 | 54% |

**Breakeven on subscription alone: ~5 customers** (vs ~20 at EUR 599/mo).

## Competitive Pricing Comparison

### Palantir (primary competitor for government/defence AI)

Source: SEC filings, public contract records, earnings reports.

| Metric | Palantir (FY 2025) |
|--------|-------------------|
| Total revenue | $4.475B |
| Customers | 954 |
| Average revenue per customer | ~$4.7M/year (~EUR 4.3M) |
| Top 20 customer average | $94M/year (~EUR 86M) |
| Minimum viable deal | ~$1M/year (~EUR 920K) |
| Net dollar retention | 139% |
| Adj operating margin | 50% |

Known contracts:
- US Army Enterprise Agreement: $10B cap
- US DoD Project Maven: $1.3B
- UK MoD: GBP 240M (3 years)
- UK NHS: GBP 330M (7 years)

### Price Gap Analysis

| | Palantir (min) | **Aegis** | Ratio |
|---|---|---|---|
| Year 1 | ~EUR 920K | EUR 72K (59,990 + 11,988) | **13x cheaper** |
| Annual (ongoing) | ~EUR 920K | EUR 11,988 (999/mo) | **77x cheaper** |
| 5-year TCO | ~EUR 4.6M | EUR 120K (59,990 + 60K) | **38x cheaper** |

### Other competitors

| Competitor | Typical price | Aegis advantage |
|-----------|--------------|-----------------|
| Palantir AIP | EUR 920K+/yr | 13-77x cheaper, EU-sovereign |
| Anduril Lattice | Custom (US DoD only) | EU-available, compliance focus |
| C3.ai | $250K-$1M+/yr | Agent outcomes not dashboards |
| Big 4 consulting | EUR 500K-2M/project | Software not advisory |
| SAP Sustainability | EUR 50-200K/yr | Agent-native, not forms |

## Palantir's EU Weakness (DWS Opportunity)

- International commercial growth: only 8% YoY (vs 137% US commercial)
- Denmark actively exiting Palantir
- UK rethinking procurement (The Register, March 2026)
- CLOUD Act = structural blocker for EU AI Act compliance
- No EU-sovereign deployment option

## Pricing Decision

**EUR 59,990 one-time + EUR 999/mo is the correct price point.**

Rationale:
1. **62% infra gross margin** on subscription — healthy from customer #1
2. **Breakeven at 5 customers** including support — achievable within 6 months of launch
3. **13x cheaper than Palantir's floor** — massive price advantage for EU mid-market
4. **Uncontested price band** — no EU-sovereign enterprise AI between EUR 5K (DWS IQ 6 SaaS) and EUR 920K (Palantir minimum)
5. **One-time fee covers implementation** — no cash flow pressure from deployment costs
6. **EUR 999/mo is psychologically below EUR 1K/mo** — enterprise budget threshold

### Price sensitivity notes

- EUR 999/mo could increase to EUR 1,499 or EUR 1,999 for customers requiring GPU nodes (LLM inference adds ~EUR 200-600/mo infra cost)
- Enterprise tier (custom pricing) should target EUR 3K-5K/mo for dedicated support + SLA
- Government tier: cost-plus model, typically 2-3x enterprise pricing

## UpCloud vs Alternative Infra Cost

| Provider | Same stack | EUR/mo | Sovereignty |
|----------|-----------|--------|-------------|
| UpCloud (Helsinki) | Managed K8s + PG + Redis | ~376 | Finnish (Tesi) |
| Scaleway (Paris) | Serverless + PG + Redis | ~200-300 | French (Iliad) |
| Hetzner (Helsinki) | VMs + self-managed | ~150-200 | German (family) |
| Google Cloud Run (Finland) | Cloud Run + Cloud SQL | ~400-600 | US (CLOUD Act) |
| AWS (Frankfurt) | EKS + RDS + ElastiCache | ~800-1200 | US (CLOUD Act) |

UpCloud is cost-competitive. Only Hetzner is cheaper, but requires self-managing everything (no managed K8s, no managed DB).

## References

- UpCloud pricing: upcloud.com/pricing/
- Palantir Q4 2025 earnings: businesswire.com (Feb 2026)
- Palantir 10-K: SEC filing FY 2024
- UK MoD contract: TechRadar (Dec 2025)
- UK rethinking Palantir: The Register (March 2026)
- AGENTS.md Section 20: Deployment Architecture
