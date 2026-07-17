# EIC Accelerator Step 1 — Chrome Fill Packet (paste-ready by form field)

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Version        | 1.0                                                                   |
| Date           | 2026-07-17                                                            |
| Author         | Lifetime Oy                                                           |
| Owner          | risto-001                                                             |
| Status         | Active — fill aid for the Step 1 online form (Aug 4 batch)            |
| Classification | Internal                                                             |
| Branch         | claude/dl-18-7-delivery-7m1hnj                                        |
| Source         | `docs/EIC_STEP1_DRAFT_KYA_2026.md` v0.91 (trimmed to per-field limits) |
| Decisions      | Grant-only €2.5M; applicant = Lifetime Oy (FI) — founder-set 2026-07-17 |

***

## How to fill with Claude for Chrome

1. In **your own** Chrome, log into the **EU Funding & Tenders portal** (EU Login) and open the **EIC Accelerator Step 1** proposal form for the Aug 4 2026 batch.
2. Invoke **Claude for Chrome** on that tab and instruct: *"Fill each form field from the matching block in this packet. Match the on-screen field label to the packet's field label. If a field's character counter is below the pasted text, trim from the end of the block, never cut a claim mid-sentence. Do NOT click Submit — stop after the last field so I can review."*
3. Watch the live **character counter** on each field — EIC Step 1 fields are typically capped near **1,000 characters**; each block below is pre-trimmed to sit under that, but the portal is the source of truth.
4. Structured/numeric fields (funding, TRL, duration) are in **§ Structured fields** at the bottom — enter those manually.
5. After fill: run a final read-through, then upload the **10-slide deck** and **3-min video** (separate deliverables), and **stop before Submit** — founder review first.

> **Field labels below approximate the Guide v6.0 form.** Confirm exact labels/limits against the downloaded template (DL 18.7, Next-Steps row 1). Where the live form splits or merges a question, split/merge the matching block.

***

## F1 — Project title (short field)

KYA v2 — the European trust standard for AI agents that transact.

## F2 — Acronym

KYA-2

## F3 — Keywords

AI agents; agentic commerce; agent identity; revocable mandate; EU AI Act Article 12; eIDAS 2.0; KYC for agents; conformance standard; EU-sovereign infrastructure; audit trail.

***

## F4 — Abstract / summary of the innovation

Autonomous AI agents are beginning to act — and pay — on behalf of people and enterprises. Europe regulates the humans (KYC, eIDAS) and the models (AI Act), but nothing regulates the **agent**: no standard identity, no bounded mandate, no revocation, no audit trail with legal weight. Every current answer (Coinbase x402, Google AP2, Stripe's agent toolkit) is US-custodial, card-rail, and binds the human, not the agent.

Lifetime Oy has built KYA (Know Your Agent): agent identity-binding, trust scoring, revocable authority ("Leash Snap"), and EU-AI-Act Article-12 audit logging — live in production inside DWS IQ 6, an EU-sovereign agent platform with 6 paying customers in regulated industries (€7k MRR, zero churn). KYA-2 turns this into **the open European conformance standard for agentic AI**. EIC funding takes it from TRL 6–7 to TRL 8 before a US-custodial default fills the gap.

***

## F5 — The innovation: what it is & why now

KYA-2 is a conformance standard plus running infrastructure that makes an AI agent a first-class, accountable economic actor:

1. **Agent identity** — cryptographic binding of an agent instance to its principal (eIDAS-2.0-aligned) with a capability manifest.
2. **Trust scoring** — a continuously updated, auditable session trust score that gates actions (in production today).
3. **Revocable mandate** — signed, bounded authority (spend caps, scope, validity), instantly revocable via the TC-4 "Leash Snap" primitive.
4. **Article-12-native audit** — append-only, privacy-preserving evidence chains that let a principal, auditor, or regulator reconstruct what an agent did and under whose authority.

**Why now:** EU AI Act Articles 12/14/72 begin enforcement for high-risk systems in **August 2027**, exactly as agentic commerce arrives. The intersection — agents that transact inside regulated industries — has no European standard. KYA-2 is that standard, extracted from a system already running it.

***

## F6 — Technology readiness & evidence

**Current TRL 6–7**, evidenced by production, not lab demos:

- KYA engine live: session trust scoring, identity binding, TC-4 Leash Snap revocation via production API, gating destructive agent actions today.
- EU AI Act Article-12 logging live: append-only, RLS-enforced audit tables correlated to agent/session identity.
- Agent isolation: Firecracker MicroVM sandboxing operational.
- 50 production agents across 25 regulated verticals; agent-initiated actions carry originating-agent audit trails by architecture rule.
- Agentic-commerce reference architecture specified; payments on tokenized rails — card data never enters our systems.
- EU-only identity processing already contracted.

**Funded TRL 6→8 gap:** the standardized mandate credential and its selective-disclosure proof ("within mandate" without revealing mandate or principal), the public conformance suite, cross-border pilot validation, and certification-grade hardening.

***

## F7 — Market & problem

Every EU enterprise deploying AI agents in a regulated process faces three questions from compliance: *who is this agent, what may it do, and can we prove it afterwards?* Today the answers are bespoke, per-vendor, non-portable. From August 2027, for high-risk systems, wrong answers become enforceable violations (AI Act penalties up to 7% of global turnover).

**Primary market:** EU enterprises in regulated industries deploying agentic AI (energy, manufacturing, construction, logistics, finance, healthcare — the 25 verticals DWS already maps). **Secondary:** agent-platform vendors and integrators needing a conformance standard; payment institutions adding agent-initiated transactions.

**Beachhead → expansion:** sell KYA-2 conformance where we already have revenue — compliance-driven mid-market/enterprise in the Nordics (Finland live, Sweden via Lifetime AB) — expanding along NVIDIA/IBM/AWS partner channels. The open standard creates the category; Themis is the reference product in it.

***

## F8 — Competition & USP

**Field (agent payments/identity):**
- **Coinbase x402** — crypto-rail agent micropayments. Custodial, US-centric, no agent mandate, no EU compliance surface.
- **Google AP2** — card/wallet rails; binds the human account; no revocable bounded mandate; US governance.
- **Stripe agent toolkit / vendor agentic checkout** — convenience on card rails; agent identity is an API key, not an accountable identity.
- **KYC incumbents (Shufti, Onfido, iDenfy)** — verify humans/companies, not agents; no manifests, no runtime trust scoring.

**Nobody is simultaneously (a) EU-sovereign, (b) agent-native, (c) compliance-native.** US players cannot credibly offer (a) — CLOUD Act; identity incumbents lack (b); crypto rails lack (c).

**USP:** the only production system where agent identity, bounded revocable authority, and Article-12 audit exist *today*, packaged as an open European standard others can adopt — with sovereign infrastructure to run it in the EU and at the edge. Compliance is not our cost; it is the product.

***

## F9 — Business model & commercialisation

**Model (validated in the live catalogue):**
1. **Platform subscriptions** — agent SKUs €499–€2,999/mo per line; industry pods €999–€1,499/mo; workforce bundles up to €19,990/mo.
2. **Flagship deployments** — DWS IQ Aegis €59,990 one-time + edge hardware (Control Room €5,294 → IGX Orin €11,990).
3. **Outcome-priced metered SKUs** — e.g. compliance gap analysis €999–€2,499 per outcome.
4. **KYA-2 conformance layer (grant-enabled):** certification & conformance testing for third-party agent vendors; enterprise EUPL-core licences for copyleft-averse integrators (dual-licensing, CLA to Lifetime Oy); Themis enterprise implementation.

**Traction:** €7k MRR, 6 paying customers, zero churn; 12-month roadmap to €60k MRR. Every conformant third-party vendor becomes a channel, not a competitor. **Route to market:** direct regulated-industry pipeline + NVIDIA/IBM/AWS channels + the standard itself as demand generator.

***

## F10 — Broad impact

- **EU strategic autonomy.** Agent-transaction infrastructure is being defined now, by US platforms, on US rails, under US jurisdiction. KYA-2 is the European alternative: sovereign, GDPR-native, eIDAS-2.0-aligned, CLOUD-Act-free.
- **AI Act implementation.** KYA-2 operationalizes Articles 12 (records), 14 (human oversight — the mandate/revocation primitive *is* oversight), and 72 (post-market monitoring), giving regulators and notified bodies something concrete to certify against.
- **Ecosystem creation.** Open standard (CC-BY 4.0) + Apache-2.0 SDKs let EU startups and integrators build without permission; EUPL-1.2 on the core keeps improvements European and open.
- **Jobs & growth.** Nordic-first scale-up (FI+SE), partner-network delivery (100+ engineers across two contracted partners), targeted Finnish headcount for standard governance, certification, and enterprise support.
- **Trust in AI.** A revocable, auditable, privacy-preserving mandate makes "my agent did it" legally and commercially meaningful — and safe to allow.

***

## F11 — Team & execution capacity

**Founder-led, partner-delivered, agent-multiplied — a distributed delivery model, not solo-founder risk:**

- **Risto Anton Päärni, Founder & CEO** — 35+ years ICT infrastructure; chief architect of the DWS IQ platform and the KYA framework; NVIDIA Connect, IBM Business Partner, AWS Advanced Consulting Partner relationships; doctoral candidate (LUT) on agentic commerce, KYA as trust primitive, and quantum-safe transaction primitives.
- **Lifetime Certified Partners consortium — 100+ engineers across two contracted partners** (NDA'd, live in a public-sector bid): Cubet Techno Labs (ca. 70 engineers) and 9series Solutions (60+ developers). Development under EU controls: no customer/registry data leaves EU/EEA; EU-based maintenance handover; core R&D and IP stay with Lifetime Oy in Finland.
- **AI agent fleet as operational multiplier** — 50 production agents run compliance, reporting, QA, and content ops; the company is the reference deployment of what it sells.
- **Nordic expansion vehicle:** Lifetime AB (Sweden).

***

## F12 — Funding need & why EIC support (Grant-only €2.5M)

**Ask: grant-only €2.5M** — 70% of a €3.57M, 24-month innovation budget; 30% own contribution from operating revenue and committed investor capital. Grant-only preserves the non-dilutive thesis and is permitted under EIC Open.

**Why the market does not fund this (need for Union support):** VC returns require proprietary capture; open standards, conformance suites, and sovereignty-as-public-good create ecosystem-wide value no single investor can monetize. Banks do not lend against pre-standard IP. The result is that the only privately funded answers to agent accountability are US-custodial platform plays. This is exactly the non-bankable, high-risk/high-impact deep-tech gap the EIC exists to close.

> Applicant entity: **Lifetime Oy (FI)**, single SME; Lifetime AB (SE) is the cross-border expansion vehicle, not a co-applicant.

***

## F13 — Risk

- **Technical (high, funded):** the selective-disclosure mandate proof is unsolved engineering — named honestly as the core funded risk (WP2). Mitigation: production fallback (server-side mandate enforcement already works; ZK disclosure is the privacy upgrade), partner cryptography expertise, staged milestones.
- **Market timing (medium):** AI Act enforcement could slip. Mitigation: compliance functions buy ahead of deadlines — our €7k MRR is pre-enforcement revenue; the mandate primitive has fraud/liability value independent of regulation.
- **Standard adoption (medium):** Mitigation — dual-track design (Themis is viable proprietary product if the standard stalls); open licensing + conformance-as-channel lower friction; Article 12/14 give notified bodies a reason to reference it.
- **Execution (low-medium):** small core team; mitigated by the contracted 100+-engineer partner pool, agent-fleet multiplier, and grant-funded key hires.
- **Financial (low):** revenue-generating, no debt, 30% co-funding covered.

***

## F14 — Milestones & the ask

**24-month grant arc:**
- **M6:** KYA-2 spec v1.0 published (CC-BY 4.0); conformance suite alpha; first mandate-bound agent transaction end-to-end in staging.
- **M12:** Reference implementation GA (Apache-2.0); EUPL-1.2 core released (CLA in place; patents filed/scoped first); pilot 1 live (FI).
- **M18:** Selective-disclosure mandate proof in production; pilot 2 live (SE via Lifetime AB); ≥3 third-party vendors in conformance testing.
- **M24 (TRL 8):** certification path established with a notified body; 10+ conformant implementations; KYA-2 submitted into formal standardization (CEN/CENELEC workshop agreement); €60k+ MRR baseline.

**The ask:** €2.5M grant to build the European trust standard for AI agents that transact — before the default is set elsewhere. The technology runs today; the traction is real and paying; the regulation that makes it mandatory has a date.

***

## Structured fields (enter manually)

| Portal field                    | Value                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| Applicant / legal entity        | Lifetime Oy                                                  |
| Country                         | Finland                                                      |
| Business ID (Y-tunnus)          | 0772407-9                                                    |
| SME status                      | Yes — single SME applicant                                   |
| Funding type                    | **Grant-only** (no equity/blended)                           |
| Grant requested                 | €2,500,000                                                   |
| Total innovation budget         | €3,570,000 (grant 70% + 30% own contribution)                |
| Current TRL                     | 6–7                                                          |
| Target TRL (end of project)     | 8                                                            |
| Project duration                | 24 months                                                    |
| Innovation activities           | TRL 6–8 (EIC Accelerator scope)                              |

***

## Uploads (separate deliverables — not text fields)

- [ ] **10-slide pitch deck** — build from `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md` + `V4.3-DWS-IQ6-InvestorPD_2026.md`; every claim must match this packet.
- [ ] **3-minute video** — founder to camera + product capture (KYA trust score, Leash Snap, Article-12 log reconstruction).

## Before Submit (founder review)

- [ ] Confirm exact field labels/limits against downloaded Guide v6.0 template (DL 18.7).
- [ ] Confirm SAFE-round phrasing — state "in progress", never "open SAFE round".
- [ ] Run `/truth-check` on all public-facing claims.
- [ ] Confirm the `[VERIFY]` MRR window wording (e.g. "0% churn over N months").
- [ ] **Do not click Submit** until the deck + video are uploaded and reviewed. Target batch: **Aug 4 2026** (submit by ~Aug 1).

***

**End of fill packet.**
