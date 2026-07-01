---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Added §2.1 — Mapping to DWS 3-Tier Product Line. Red Hat OpenShift Sovereign Cloud and Microsoft Azure AI Foundry added as explicit Tier 2 matches (per user direction). Documented the tier-continuity pattern: the same Aegis/Sovereign Infra/Connect 3-tier mapping applies to observability, identity, data platforms, and inference — not just cloud infrastructure
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Initial field note — sovereign cloud provider landscape research triggered by the Aiwen→Aiven typo sweep discovering that 81 references were actually describing sovereign-cloud infrastructure (not the Aiven Postgres SaaS). User clarified sovereign cloud partner is UpCloud; this note surveys the broader non-US-owned cloud landscape for Aegis-level partnerships and proposes disambiguation for the repo

Document Status:

- Created: 23.04.2026
- Last Modified: 23.04.2026
- Language: English
- Publication Status: ACTIVE (private field note)

---

# Sovereign Cloud Providers — Aegis Partner Research

## 1. Why This Note Exists

The Aiwen → Aiven typo sweep (session `claude/kya-memory-binding-RuJ0G`, 2026-04-23) fixed 116 files but surfaced a deeper confusion: **~1920 "Aiven" references in the repo are legitimate Postgres-partner mentions, while ~81 describe a "sovereign compliance cloud" layer — and those 81 are semantically wrong, regardless of spelling.**

Aiven is a managed-database SaaS (PostgreSQL, Kafka, Redis, OpenSearch, ClickHouse) that runs on top of hyperscalers and sovereign clouds. Aiven is not itself a cloud infrastructure provider. Text like "Aiven layer for EU AI Act Article 12 logging" or "Aiven (EU AI Act) — Planned Q2 2026" is describing a **sovereign cloud environment**, which is a different category.

The user identified **UpCloud** (https://upcloud.com/) as the current sovereign cloud partner. Before renaming 81 references, this note surveys the broader non-US-owned, non-CLOUD-Act-exposed sovereign cloud landscape so that the rename is grounded and the architecture doc is not locked to a single vendor.

---

## 2. The Category: EU / Non-US Sovereign Clouds

A "sovereign cloud" for Aegis-level work (defence, critical infrastructure, regulated industries under EU AI Act / NIS2 / CER) has to satisfy at minimum:

- **No US parent company** → outside US CLOUD Act and FISA §702 reach
- **EU-only staff access** (or equivalent scoped access) for admin operations
- **EU data residency** (DCs in Member States)
- **Verified compliance certification** — SecNumCloud (FR), C5 (DE), ISO 27001 at minimum; ideally Gaia-X-compliant

Providers that meet these tests as of April 2026:

| Provider                           | HQ          | Key Certs                                                  | Aegis-Level Fit                                                                                                                                                            |
| ---------------------------------- | ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UpCloud**                        | Finland     | ISO 27001; EU-only staff; Finnish-owned                    | ✅ High — current DWS partner; Helsinki + Tuusula DCs; strong sovereignty story; lower profile than French incumbents                                                      |
| **OVHcloud**                       | France      | **SecNumCloud (IaaS Private Cloud)**; ISO 27001; HDS       | ✅ Highest — Europe's largest sovereign cloud; 43 DCs, 9 countries; listed on Euronext Paris; hosts French gov workloads                                                   |
| **Scaleway**                       | France      | ISO 27001; Gaia-X; HDS                                     | ✅ High — owned by Iliad (Xavier Niel); Paris/Amsterdam/Warsaw DCs; Kubernetes (Kapsule); SecNumCloud in application                                                       |
| **3DS Outscale**                   | France      | **SecNumCloud**; ISO 27001                                 | ✅ Highest — Dassault Systèmes subsidiary; enterprise + defence                                                                                                            |
| **Cloud Temple**                   | France      | **SecNumCloud**                                            | ✅ Highest — sovereign-by-design; niche enterprise                                                                                                                         |
| **S3NS**                           | France      | **SecNumCloud (Dec 2025)**                                 | ⚠️ Mixed — Thales + Google Cloud joint venture; technically sovereign under French control, but inherits some Google stack — requires case-by-case due diligence for Aegis |
| **Exoscale**                       | Switzerland | ISO 27001; FINMA-aligned                                   | ✅ High — A1 Digital subsidiary; 7 DCs across CH/AT/DE/HR/BG; strong Swiss neutrality story                                                                                |
| **IONOS**                          | Germany     | C5; ISO 27001; SecNumCloud partner (via Outscale alliance) | ✅ High — part of United Internet; German-owned; strong DACH presence                                                                                                      |
| **STACKIT**                        | Germany     | C5; ISO 27001; SecNumCloud pursuing                        | ✅ Medium-High — part of Schwarz Group (Lidl/Kaufland parent); late entrant but capitalised                                                                                |
| **T-Systems / Open Telekom Cloud** | Germany     | C5; ISO 27001                                              | ✅ High — Deutsche Telekom subsidiary; OpenStack-based; German sovereignty default                                                                                         |
| **Hetzner**                        | Germany     | ISO 27001                                                  | ⚠️ Medium — cost-leader; less certification depth; fits dev/staging, less Aegis-level                                                                                      |
| **Cleura**                         | Sweden      | ISO 27001; Gaia-X                                          | ✅ Medium-High — Swedish sovereign cloud (formerly City Network); OpenStack                                                                                                |
| **Elastx**                         | Sweden      | ISO 27001                                                  | ✅ Medium — Swedish sovereign; strong local presence                                                                                                                       |
| **Infomaniak**                     | Switzerland | ISO 27001; Swiss data residency                            | ✅ Medium — Swiss neutrality; ecological positioning                                                                                                                       |
| **Aruba.it**                       | Italy       | ISO 27001; AgID-qualified                                  | ✅ Medium — Italian sovereign cloud; strong in IT government contracts                                                                                                     |

**Franco-German doctrine (March 2026):** ANSSI (FR) and BSI (DE) published a joint statement harmonising sovereignty criteria. SecNumCloud + C5 are converging; a provider qualified under one will have a faster path to the other. This reduces the "which certification to pursue" question for DWS.

---

## 2.1 Mapping to the DWS 3-Tier Product Line

`docs/PRODUCT_TIERS.md` defines three product tiers segmented by sovereignty posture: **Aegis** (Tier 1, full sovereign, zero CLOUD Act), **Sovereign Infra** (Tier 2, EU-sovereign, US-parent SaaS tolerated if contractually EU-hosted), **Connect** (Tier 3, global). The cloud/platform partners survey above maps onto those tiers as follows:

| DWS Tier                                    | Sovereignty Posture                                                  | Eligible Cloud / Platform Partners                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tier 1 — Aegis** (Full Sovereign)         | EU-incorporated vendor; no US parent in the data path; defence-grade | **UpCloud** (FI), **OVHcloud** (FR), **Scaleway** (FR), **3DS Outscale** (FR), **Cloud Temple** (FR), **Exoscale** (CH), **IONOS** (DE), **T-Systems / Open Telekom Cloud** (DE), **Cleura** (SE)                                                                                                    |
| **Tier 2 — Sovereign Infra** (EU-Sovereign) | EU-resident hosting; US-parent permitted if GDPR-covered + EU region | All Tier 1 providers (cheaper on Tier 2), **STACKIT** (DE), **Hetzner** (DE), **Elastx** (SE), **Infomaniak** (CH), **Aruba.it** (IT); **Red Hat OpenShift Sovereign Cloud** (US-parent, EU-operated); **Microsoft Azure AI Foundry** (US-parent, EU data boundary); **S3NS** (FR, Thales+Google JV) |
| **Tier 3 — Connect** (Global)               | No sovereignty constraint                                            | AWS, Azure, GCP, NVIDIA DGX Cloud, Alibaba Cloud, G42 — plus any Tier 1/Tier 2 provider serving a customer with no EU residency need                                                                                                                                                                 |

**Red Hat OpenShift Sovereign Cloud — Tier 2 match.** Red Hat is IBM-owned (US parent), so it is **not Aegis-eligible**. On Tier 2, Red Hat offers OpenShift + OpenShift AI deployed on sovereign EU infrastructure, with Red Hat operating as an EU-contracted service provider. This fits customers who want OpenShift's governance/policy layer on top of Tier 1 sovereign hosts (UpCloud, OVH, Scaleway). Already referenced in `docs/PHD_FIREHORSE_EN.md` (Red Hat AgentOps partnership, hybrid cloud imperative).

**Microsoft Azure AI Foundry — Tier 2 match.** Foundry provides agent orchestration with built-in content safety, evaluation, and tracing. EU-hosted deployments (Azure EU data boundary, Microsoft-announced EU sovereignty package) are Tier 2-eligible. **Not Aegis-eligible** because Microsoft is a US parent and the platform is built on Azure. Complements `docs/PRODUCT_TIERS.md` Connect-tier Microsoft Founders Hub relationship.

**Tier continuity pattern.** This table exists so we don't invent new terminology for each partner category. The same Aegis/Sovereign Infra/Connect tiers apply to observability (see companion field note `2026-04-23-eu-ai-act-compliance-layer-research.md` §5), identity verification (Shufti vs. iDenfy vs. EUDI Wallet), data platforms (Aiven vs. Supabase), and LLM inference (NVIDIA GN-100 edge vs. Groq vs. Mistral vs. Anthropic). Every partner category has a natural 3-tier mapping.

> *Frame note (2026-05-28).* This three-tier product segmentation is the EU-origin enterprise's operational expression of the universal three-pillar (Data / Technology / Operational) × three-jurisdiction (EU / US / Singapore) sovereignty model. See Sovereignty Field Note #2 (`https://onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html`) for the taxonomy and `DWS_TRUTH_STANDARD.md` Row 16 for the canonical reference.

---

## 3. What Aiven Actually Is (and Isn't)

**Aiven** is not a sovereign cloud. It is a **managed open-source data platform** (PostgreSQL, MySQL, ClickHouse, Kafka, Redis, OpenSearch, Cassandra, M3DB, Flink, Grafana) delivered as SaaS. Aiven is Finnish-HQ (Helsinki), but the customer workload runs on underlying infrastructure chosen by Aiven — which can be AWS, GCP, Azure, **or** European sovereign providers (including UpCloud).

Where DWS references "Aiven" correctly (~1920 lines across `DWS_DATA_STANDARD.md`, `DWS_SECURITY_STANDARD.md`, `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md`, etc.) → these describe the **Postgres/TimescaleDB SaaS layer** we consume. No change needed.

Where DWS references "Aiven" in infrastructure/compliance context (~81 lines) → these are describing something else entirely — an **EU AI Act Article 12 compliance environment**, the "overlay cloud" concept originally written as "Aiwen". This was never a real Aiven product. The rename should credit the **infrastructure partner** (UpCloud today, potentially multi-vendor tomorrow) or use a **partner-neutral descriptor**.

---

## 4. Proposed Disambiguation for the 81 Lines

Three options, ranked by portability:

### Option A — Partner-Neutral (RECOMMENDED)

Rename "Aiven layer" → **"EU Compliance Layer"** or **"Sovereign Compliance Cloud"**.

- **Pros:** infrastructure-agnostic; lets us change sovereign-cloud vendors without rewriting standards; describes function (EU AI Act Article 12 reasoning lineage + audit trails), not brand
- **Cons:** less concrete than a named partner; marketing copy may want a specific vendor name for credibility

### Option B — UpCloud-Specific

Rename "Aiven layer" → **"UpCloud Compliance Layer"** or **"UpCloud (EU AI Act)"**.

- **Pros:** credits the actual current sovereign partner; concrete in marketing/sales conversations; aligns with existing `Store/PRODUCT_AEGIS.md` references to UpCloud UKS
- **Cons:** locks the architecture doc to one vendor; every time a second sovereign partner is added (OVH, Scaleway) the docs need another rewrite

### Option C — Delete the Concept

If the "Aiven layer" / "sovereign compliance cloud" was itself a hallucinated environment that was never actually planned as a separate runtime, the right move is to strip the concept and fold Article 12 logging into the **existing EU Cloud** documentation (no separate environment).

- **Pros:** honest; removes an architectural fiction from the roadmap
- **Cons:** requires deciding whether a dedicated EU AI Act compliance environment is actually planned (product decision, not a rename)

### Recommendation

**Hybrid A + B:**

- Use **"EU Compliance Layer"** as the architectural name in standards, roadmaps, and thesis (infrastructure-agnostic)
- In product/marketing copy (Aegis page, investor memos, store), say **"UpCloud-hosted EU Compliance Layer"** — concrete when the audience wants a vendor name
- Maintain a **sovereign cloud partner matrix** (Section 2 above) so product decisions can add OVH / Scaleway / Exoscale partnerships without doc-wide rewrites

This also matches the Aegis narrative — "Finnish-owned infrastructure, Aegis-level sovereignty" — while keeping the door open to multi-region EU expansion.

---

## 5. Known In-Repo Conflicts (Before Rename)

| File                                                                  | Current Text                                | Recommended                                                       |
| --------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `CLAUDE.md` L18                                                       | "US/EU/Aiven clouds"                        | "US/EU/Compliance Layer clouds" (or rework the three-cloud table) |
| `CLAUDE.md` L485                                                      | "Aiven audit table mutations"               | "EU Compliance Layer audit table mutations"                       |
| `docs/CLOUD_ENVIRONMENTS.md` §3.3                                     | "Aiven (EU AI Act) — Planned Q2 2026"       | "EU Compliance Layer (UpCloud-hosted, Planned Q2 2026)"           |
| `DWS7_ROADMAP.md` L56, L63, L1390                                     | "Aiven layer"                               | "EU Compliance Layer"                                             |
| `DWS8_ROADMAP.md` L196                                                | "Every ledger entry signed via Aiven layer" | "Every ledger entry signed via EU Compliance Layer"               |
| `DWS_SOVEREIGNTY_STANDARD.md` L174                                    | "Aiven (EU-infra) = TASO 1"                 | "UpCloud (EU-infra) = TASO 1" — this one is infra, specific       |
| `README.md` L43, L403                                                 | "Aiven layer Q2 2026"                       | "EU Compliance Layer Q2 2026"                                     |
| `.claude/hooks/sql-safety-guard.sh` L4, L170–173                      | "Aiven Article 12 immutability"             | "EU Compliance Layer Article 12 immutability"                     |
| `AgentFoundry/Product-Agents/dws10_product_agents.md` L855–862        | "Aiven EU AI Act Article 12 logging"        | "EU Compliance Layer for AI Act Article 12 logging"               |
| `docs/2026-AI-TRENDS-STRATEGY.md` §"Aiven EU AI Act Compliance Layer" | section name + copy                         | "EU Compliance Layer" section; mention UpCloud as infra partner   |
| `docs/CLOUD_ENVIRONMENTS.md` (diagram)                                | "AIVEN (Planned Q2 2026)"                   | "EU COMPLIANCE LAYER (UpCloud-hosted, Planned Q2 2026)"           |
| Thesis v3.38 (4 files)                                                | "EU Cloud + GN-100 edge + Aiven overlay"    | "EU Cloud + GN-100 edge + EU Compliance Layer overlay"            |

---

## 6. Decision Requested

Before executing the rename, confirm:

1. **Naming:** A (neutral), B (UpCloud-specific), or hybrid A+B (recommended)?
2. **Scope:** All 81 infra-context lines in one sweep, or phased (standards first, then roadmaps, then marketing copy)?
3. **Thesis handling:** Does a "typo correction + rename to EU Compliance Layer" warrant another v3.38 → v3.39 bump (lockstep across all 4 thesis files), or should it be rolled into the next substantive thesis update to avoid thrash?
4. **`DWS_SOVEREIGNTY_STANDARD.md` L174:** The "TASO 1" table entry maps a TIER to a provider. Should that stay vendor-specific (UpCloud) to preserve the sovereignty-tier precision?
5. **Gaia-X / multi-cloud positioning:** Should the compliance-layer architecture be documented as explicitly multi-cloud-capable (UpCloud + OVH + Scaleway as interchangeable backends), or pinned to UpCloud for now?

---

## 7. Sources

- [Commission advances cloud sovereignty through strategic procurement (EU Commission, 2026-04-17)](https://commission.europa.eu/news-and-media/news/commission-advances-cloud-sovereignty-through-strategic-procurement-2026-04-17_en)
- [Digital Sovereignty of Europe: Choosing the EU Cloud Provider (2026 Guide) — Gart Solutions](https://gartsolutions.com/digital-sovereignty-of-europe-choosing-the-eu-cloud-provider/)
- [Comparing European Cloud Providers and Open Source Alternatives to US Platforms — SoftwareSeni](https://www.softwareseni.com/comparing-european-cloud-providers-and-open-source-alternatives-to-us-platforms/)
- [7 European Cloud Providers vs AWS: Real Pricing (2026) — From Europe With Love](https://www.fromeuropewithlove.eu/en/blog/european-cloud-providers-vs-aws-comparison-2026)
- [Top 5 best European cloud providers — Clever Cloud](https://www.clever.cloud/blog/company/2025/10/03/best-european-cloud-providers/)
- [SecNumCloud: ANSSI Security Visa — OVHcloud](https://www.ovhcloud.com/en/compliance/secnumcloud/)
- [Certification SecNumCloud ANSSI: Guide Complet 2026 — Legiscope](https://www.legiscope.com/blog/certification-secnumcloud-anssi.html)
- [SecNumCloud Qualification by ANSSI: The Ultimate Guide — Scalingo](https://scalingo.com/blog/secnumcloud-qualification-anssi-guide)
- [Prestataires SecNumCloud — ANSSI (official list)](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/services-de-securite-evalue/solutions-en-cours-de-qualification/prestataires-secnumcloud/)
- [UpCloud — Sovereign Cloud Partner](https://upcloud.com/)
- [Aiven — Managed Open Source Data Platform](https://aiven.io/)

---

## 8. Status

- ✅ Research complete
- ⏸ No rename executed — awaiting user decision on §6 Options
- 📝 Field note committed to `claude/kya-memory-binding-RuJ0G` branch for reference
- 🔜 Follow-up session should also finish the 5 remaining non-historical Aiwen → Aiven typo fixes (`.claude/hooks/README.md`, `Learn/DWS7_ROADMAP.md` + HTML, 2 investor HTMLs) — small and independent of the rename decision
