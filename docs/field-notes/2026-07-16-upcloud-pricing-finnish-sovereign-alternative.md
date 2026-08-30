# UpCloud Pricing — Finnish EU-Sovereign Alternative to Scaleway

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/scaleway-pricing-update-19g8df | Date: 16.07.2026 | Changes: Initial — captured UpCloud (Helsinki, Finnish-owned) pricing as a maximal-sovereignty alternative; side-by-side vs Scaleway post-01.06.2026 increase; zero-egress advantage; serverless / GPU gap; recommendation to keep Scaleway primary and add UpCloud as evaluated Finnish-stack option for always-on + egress-heavy + maximal-sovereignty customers

Session Links & References:

- Source: https://upcloud.com/pricing/ (fixed prices, zero-cost data transfer)
- Cost calculator: https://calc.upcloud.com/cloud-servers?currency=EUR
- Block storage pricing: https://upcloud.com/docs/products/block-storage/pricing/
- Object storage pricing: https://upcloud.com/docs/products/managed-object-storage/pricing/
- Managed PostgreSQL: https://upcloud.com/docs/products/managed-postgresql/pricing/
- Companion note: docs/field-notes/2026-07-16-scaleway-pricing-increase-june-2026-impact.md
- Customer pricing surface: dws10.com/products/cloud-pricing.html (EU Sovereign stack)

Document Status:

- Created: 16.07.2026
- Last Modified: 16.07.2026
- Language: English
- Publication Status: ACTIVE (private — vendor evaluation)

***

**Type:** Field Note / Vendor Pricing Evaluation
**Scope:** EU Sovereign compute/storage/DB alternatives; provider diversification
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## Why UpCloud

UpCloud is **Helsinki-headquartered and Finnish-owned**, with Helsinki data
centres (`fi-hel1`, `fi-hel2`) among ~10 global regions. For Lifetime Oy — a
Finnish company selling _EU data residency (Finland)_ — UpCloud is the most
literal expression of that claim: a Finnish provider, on Finnish soil, zero
CLOUD Act exposure. Paired with **Aiven** (also Finnish) it forms a maximally
sovereign Finnish stack for the most residency-sensitive buyers (public sector,
defence-adjacent, VPK).

Two structural differentiators matter for our workloads:

1. **Zero-cost data transfer** — no egress fees. Decisive for evidence-heavy /
   report-delivery workloads (signed CSRD PDFs, Art.12 log exports).
2. **Fixed, predictable pricing** — no metered surprises; no just-announced
   increase (contrast Scaleway 01.06.2026).

Plus **MaxIOPS** storage (in-house tech, up to ~100k IOPS) and a 99.99% SLA.

## Captured pricing (EUR, July 2026)

### Cloud servers

| Family                  | Entry                                 | Notes                                                                                |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| **Developer / Starter** | from **€3/mo** (1×CPU-1GB-10GB)       | Standard SSD, prev-gen AMD; e.g. 2×CPU-4GB **€18/mo**                                |
| **Premium**             | from **€5/mo**                        | 5th Gen AMD EPYC 9575F "Turin"; General Purpose 2×CPU-2GB ≈ €0.026785/h (~€18–19/mo) |
| Top-end                 | PREMIUM-80×CPU-512GB **€2,772.26/mo** | 80 vCPU / 512 GB / 500 GB                                                            |

Up to 16 storage devices / 64 TB per server. _(Exact full ladder lives in the
cost calculator — anchors above are confirmed data points, not the whole table.)_

### Storage

| Product             | Price                                            | vs Scaleway (post-01.06.2026)                                                                                  |
| ------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Block — **MaxIOPS** | €0.220 /GB/mo                                    | Premium NVMe-class (100k IOPS); Scaleway has no direct equal                                                   |
| Block — Standard    | €0.085 /GB/mo                                    | Scaleway SSD ≈ €0.095 /GB/mo → **UpCloud cheaper + fixed**                                                     |
| Block — Archive     | €0.056 /GB/mo                                    | Cold datasets                                                                                                  |
| **Object Storage**  | €0.02 /GB/mo (250 GB steps), from €5/mo, ~€20/TB | Scaleway Multi-AZ ≈ €0.016 /GB/mo at rest — cheaper _at rest_, but **metered egress** vs UpCloud's free egress |

### Managed database / LB / K8s

| Product                                        | Price                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Managed Database (MySQL / PostgreSQL / Valkey) | from ~**€8/mo** (1–3 nodes)                                                    |
| Managed Load Balancer                          | Essentials €0 · Development €10/mo · Production S €30/mo · Production M €75/mo |
| Managed Kubernetes (UKS)                       | Available                                                                      |
| GPU / managed inference                        | **None comparable** — see gap below                                            |

## Head-to-head vs Scaleway (after the June increase)

| Dimension                      | Scaleway (post-01.06)       | UpCloud                     | Read                                                                 |
| ------------------------------ | --------------------------- | --------------------------- | -------------------------------------------------------------------- |
| **Egress**                     | Metered                     | **Free**                    | UpCloud wins for evidence/report delivery                            |
| Standard block                 | ~€0.095 /GB/mo              | €0.085 /GB/mo fixed         | UpCloud slightly cheaper + predictable                               |
| Object at rest                 | ~€0.016 /GB/mo              | €0.02 /GB/mo                | Scaleway cheaper at rest; flips once egress counts                   |
| Load Balancer                  | GP-S ≈ €20/mo (rose 44%)    | Production S €30/mo fixed   | Scaleway cheaper nominal; UpCloud fixed & just got relatively closer |
| **Serverless (scale-to-zero)** | ✅ Serverless Containers    | ❌ Always-on instances only | **Scaleway wins** for bursty/low-traffic — our current model         |
| **Managed inference / GPU**    | ✅ Gen APIs + H100/L40S/L4  | ❌ None                     | **Scaleway wins** for LLM path                                       |
| Sovereignty (Finnish)          | FR-owned, FR/NL DCs         | **FI-owned, Helsinki DCs**  | UpCloud is the stronger _Finnish_ story                              |
| Price stability                | Just raised (first in 3 yr) | Fixed, no egress            | UpCloud more predictable                                             |

## Strategic read

- **Keep Scaleway as primary EU compute + inference.** Its serverless
  scale-to-zero and Generative APIs / GPU rental have no UpCloud equivalent, and
  our live footprint is a low-traffic serverless container — the model Scaleway
  is built for and UpCloud is not.
- **Add UpCloud as an evaluated Finnish-sovereign option** for three specific
  cases where its advantages dominate:
  1. **Always-on production instances** at enterprise / dedicated tiers (fixed
     pricing beats metered serverless once a workload runs 24/7).
  2. **Egress-heavy evidence delivery** (zero data-transfer cost vs Scaleway's
     metered egress on signed-PDF / Art.12 export volume).
  3. **Maximal-sovereignty customers** who want a wholly-Finnish stack
     (UpCloud + Aiven, both Helsinki).
- **The Scaleway June increase narrows Scaleway's price lead** on block storage
  and networking, making UpCloud's fixed + zero-egress model relatively more
  attractive for steady-state workloads — worth a real pilot before the next
  enterprise/dedicated quote.

## Decision & follow-ups

- **No customer pricing change.** This is a supply-side diversification note;
  `products.json` / `cloud-pricing.html` unchanged. Note that
  `cloud-pricing.html` already lists "Hetzner Cloud / Scaleway" as EU compute —
  UpCloud is a candidate to add to that line once piloted, not a swap.
- [ ] Spin up a 2×CPU-4GB UpCloud instance + 100 GB MaxIOPS + Managed PG in
      `fi-hel1`; benchmark vs the fr-par container for an always-on profile.
- [ ] Price a real enterprise/dedicated tier both ways (Scaleway metered vs
      UpCloud fixed+zero-egress) at realistic evidence-export volume.
- [ ] Confirm UpCloud DPA / SCC / ISO 27001 posture for the Partners due-diligence page.
- [ ] Decide whether the fully-Finnish (UpCloud + Aiven) stack becomes a named
      "Finnish Sovereign" sub-option for public-sector buyers.

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
