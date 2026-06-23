---
title: "DWS IQ Themis"
price: "14990.00"
currency: "EUR"
sku: "DWS-THEMIS-001"
availability: "preorder"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/firehorse-aegis-head.png"
brand: "DWS IQ"
storeCategory: "platform"
type: "one-time"
priceNote: "€14,990 one-time control-plane deployment + €499/mo subscription. Enterprise pricing on request. Included at no extra cost in DWS IQ Aegis (Tier 1)."
mpn: "DWS-THEMIS-2026"
---

# DWS IQ Themis

**The Aegis Control Plane — Sovereign AI Governance for EU AI Act Article 12**

_Part of the DWS IQ Industrial Intelligence suite — the governance control plane for the Aegis dual-use tier._

## One-Liner

Themis — the Aegis Control Plane. DWS's proprietary implementation of the open KYA standard: identity attribution, Article 12 logging, Annex III systems registry, and policy gating bundled into one sovereign control plane, shipping with every Aegis deployment.

## Why Now

**EU AI Act enforcement for high-risk systems: 2 August 2026.** Your AI needs automatic, tamper-evident record-keeping with six-month minimum retention (Art. 26(6)), Annex III classification, deployer evidence (Art. 26), and post-market monitoring integration (Art. 72). Themis ships this as one product.

## What Themis Is

A drop-in control plane that turns any DWS IQ deployment — or any open-standard-KYA-compliant system — into an Article 12-ready, audit-defensible AI operation. Themis is DWS's productisation of the KYA open standard's sovereign control plane (KYA-S §11 Systems Inventory & Policy Gate + DWS_ARTICLE_12_LOGGING_STANDARD.md logging pipeline).

## What Customers Get

| Capability                      | Detail                                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Article 12 Logging Pipeline** | OpenTelemetry → Collector (hashing + redaction) → hash-chained append-only ledger on Aiven Postgres → KYA-attested events         |
| **Annex III Systems Registry**  | `ai_systems_registry` table with risk classification, conformity state, data lineage, deployment approvals                        |
| **Policy Gate (runtime)**       | Every inference call passes policy DSL evaluation before hitting the model; allow / deny / escalate with 24h human-review SLA     |
| **KYA Policy Proxy**            | Identity attribution (KYC-verified operator), capability-manifest enforcement, memory-mutation attestation (KYA-S §10)            |
| **Reporting Portal**            | Firehorse Report Engine — auditor JSON export under 10 business days; CSRD, NIS2, and Art. 72 post-market monitoring plug-ins     |
| **Retention**                   | 6-month floor (Art. 26(6)); 5-year for memory audit and identity events (KYA-S §10.4); 10-year for serious incidents (Art. 73)    |
| **Tier portability**            | Runs on Aegis sovereign infra (UpCloud / Hetzner), Tier 2 clouds (Red Hat OpenShift, Azure AI Foundry EU), or Tier 3 hyperscalers |

## Features

- **KYA-compliant** — implements the open KYA standard; no vendor lock-in on the protocol layer
- **Defence-grade audit** — hash-chained append-only ledger with per-event SHA-256 chain, court-defensible tamper evidence
- **Cross-tier portable** — same control plane runs on Aegis Tier 1 sovereign infra, Tier 2 EU clouds, or Tier 3 hyperscalers
- **EU-built, zero CLOUD Act** — no US-incorporated vendor in the Aegis-tier data path
- **2 Aug 2026 ready** — ships before EU AI Act high-risk enforcement
- **Bundled with Aegis** — zero additional cost for DWS IQ Aegis (Tier 1) customers; standalone SKU for Tier 2 Sovereign Infra customers

## Tier Positioning

| Tier                         | Themis Delivery                                                                  | Price                              |
| ---------------------------- | -------------------------------------------------------------------------------- | ---------------------------------- |
| **Aegis (Tier 1)**           | Included in platform — runs on UpCloud, single-tenant, zero CLOUD Act            | Bundled in €59,990 + €999/mo       |
| **Sovereign Infra (Tier 2)** | Standalone SKU — customer brings own EU cloud (Scaleway, OVH, Red Hat OpenShift) | **€14,990 one-time + €499/mo**     |
| **Connect (Tier 3)**         | SaaS — customer chooses underlying cloud                                         | Enterprise pricing — contact sales |

## Who It's For

- **Defence and dual-use manufacturers** needing Article 12 + Annex III evidence before 2 August 2026
- **Government agencies** requiring zero CLOUD Act exposure in their AI audit trail
- **Regulated EU enterprises** (CSRD, NIS2, CER, CBAM) who want EU AI Act compliance on infra they already run
- **AI system operators** whose existing governance tools (Credo AI, OneTrust, IBM Watsonx) would create US-parent sovereignty violations

## What Makes Themis Different

1. **KYA-native identity** — every event cryptographically bound to a KYC-verified human operator. No other Article 12 product does this (Credo AI / OneTrust treat the agent as an opaque actor).
2. **Hash-chained ledger** — cryptographic tamper evidence exceeds Article 26(6) minimum; court-defensible before Schmidberger-style cross-border audit disputes.
3. **Same control plane, three tiers** — no architectural rewrite when a customer moves between sovereignty tiers; only vendor substitution.
4. **EU-built, EU-incorporated** — at Tier 1 (Aegis), no US-parent vendor anywhere in the Themis data path.

## Demo Availability

**Named sovereign pilots:** live demo environment on UpCloud Helsinki, Q2 2026 — reference customers available under NDA on request. Request access via `risto@onelifetime.world`.

**General availability:** Q2 2026, targeted before 2 August 2026 EU AI Act high-risk enforcement.

## Related Documents

- `Legal/KYA_STANDARD_v1.md` — KYA open-standard parent document
- `Legal/KYA_SECURITY_v1.2.md` §11 — Systems Inventory & Policy Gate specification
- `Legal/KYA_SECURITY_v1.2.md` §10 — Memory Audit Trail (prerequisite)
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` — Article 12 Logging Pipeline open architecture
- `docs/PRODUCT_TIERS.md` — Aegis / Sovereign Infra / Connect tier model
- `dws10.com/products/themis.html` — public product page

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Business ID:** 0772407-9 · **VAT:** FI07724079
