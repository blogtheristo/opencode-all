# EIC Accelerator Step 1 — Chrome Fill Packet (paste-ready by form field)

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Version        | 2.0                                                                   |
| Date           | 2026-07-17                                                            |
| Author         | Lifetime Oy                                                           |
| Owner          | risto-001                                                             |
| Status         | Active — fill aid for the Step 1 online form (Aug 4 batch)            |
| Classification | Internal                                                             |
| Branch         | claude/dl-18-7-delivery-7m1hnj                                        |
| Framing        | **DWS IQ / Aegis as hero** (founder decision 2026-07-17). Funded innovation = agents that act & transact under bounded, revocable, audited authority. KYA = the live trust engine (component), not a standalone standard. |
| Decisions      | Grant-only €2.5M; applicant = Lifetime Oy (FI)                        |

***

## How to fill

Match each on-screen field label to the closest block below (F1–F14 + structured fields). Watch the character counter; if a field is tighter than the text, trim from the END, never mid-claim. Structured/numeric fields are at the bottom. Do not submit until deck + video are uploaded and reviewed.

> Confirm exact field labels/limits against the downloaded Guide v6.0 template. Where the live form splits/merges a question, split/merge the matching block.

***

## F1 — Project title (short field)

AEGIS — sovereign, on-premise AI agents that act and transact for regulated Europe: DWS IQ on the customer's own NVIDIA DGX, where data and model weights never leave the building.

## F2 — Acronym

AEGIS

## F3 — Keywords

sovereign AI agents; agentic compliance; DWS IQ; agent identity & mandate; revocable authority; EU AI Act Article 12; eIDAS 2.0; EUDI Wallet; digital euro; sovereign on-prem inference (DGX); regulated industry; agentic commerce.

***

## F4 — Abstract / summary of the innovation

DWS IQ is a live, EU-sovereign platform where a fleet of 50 production AI agents does compliance, reporting and operations for regulated European industry. Its flagship, **DWS IQ Aegis (€59,990)**, runs on the customer's own **NVIDIA DGX (2×/4×)** — an on-premise "S2" deployment where inference, data and model weights never leave the building: **sovereignty guaranteed by physics, not policy**, and physically free of the US CLOUD Act. A cloud tier (S1 — EU-sovereign Scaleway/UpCloud + Aiven) and a hybrid tier (S3) run the same agent brain by sovereignty posture. 6 paying customers, €7k MRR, zero churn. Today those agents *analyse and report*. The funded leap — the frontier for regulated Europe — is agents that *act and transact* (file declarations, post journal entries, trigger payments) under authority that is bounded, revocable and fully audited, **on this sovereign substrate**. No US-custodial answer (Coinbase x402, Google AP2, Stripe agent toolkit) can run inside the customer's building or settle on emerging EU rails. This project takes the capability from **TRL 6–7 to TRL 8**: the trust-and-mandate layer (our production KYA engine + a standardized mandate credential and selective-disclosure proof), certification-grade hardening, and cross-border pilots — before the AI Act's high-risk obligations begin in August 2027.

***

## F5 — The innovation: what it is & why now

DWS IQ already makes agents accountable, in production: (1) agent identity binding, (2) a live session trust score that gates actions, (3) revocable authority via the TC-4 "Leash Snap" primitive, (4) Article-12 append-only audit — this is the **KYA engine**, running today. The funded innovation extends it from *action-gating* to *action-and-transaction under mandate*: a signed, bounded **mandate credential** (spend caps, scope, validity) and a **selective-disclosure proof** that an action is within mandate without revealing the mandate or the principal — so a DWS IQ agent can file a CBAM declaration, post a GL journal entry, or settle a payment, and any auditor or regulator can reconstruct exactly what it did and under whose authority. Because DWS IQ ships in three sovereignty postures (S1 cloud, S2 on-prem DGX, S3 hybrid), the trust layer is **deployment-sovereignty-aware**: a KYA Sovereignty Profile binds key custody, evidence residency and trust scoring to the tier (on-prem, air-gap-safe, no phone-home for S2) — and, the funded standards contribution, every mandate and evidence entry carries a signed **Sovereignty Attestation**: a machine-verifiable claim of jurisdiction, data-residency, model-weight ownership and air-gap status. Sovereignty stops being a promise and becomes cryptographically auditable. Why now: EU AI Act Articles 12/14/72 begin enforcement for high-risk systems in **August 2027**, exactly as agentic commerce arrives — and Europe is building the sovereign rails for it (EUDI Wallet is law from 12/2026, the ECB **Digital Euro** enters its pilot in H2 2027, issuance targeted ~2029). Agents that transact on EU-sovereign identity and payment rails will need an EU-sovereign trust-and-mandate layer; US-custodial card-rail answers cannot plug into it. Agents that transact inside regulated industries have no European trust layer today. DWS IQ becomes it.

***

## F6 — Technology readiness & evidence

**Current TRL 6–7** for the autonomous-action capability, evidenced by the live platform, not lab demos:

- DWS IQ Aegis in production with 6 paying customers across regulated verticals.
- 50 production agents across 25 regulated industries; agent-initiated actions carry originating-agent audit trails by architecture rule.
- KYA trust engine live: session scoring, identity binding, TC-4 Leash Snap revocation via production API — gating destructive agent actions today.
- EU AI Act Article-12 logging live: append-only, RLS-enforced audit tables correlated to agent/session identity.
- Firecracker MicroVM agent isolation operational.
- Agentic-commerce reference architecture specified; payments on tokenized rails — card data never enters our systems.
- EU-only identity processing already contracted.
- **Sovereign deployment (S2) — the platform's spine:** Aegis runs on the customer's own NVIDIA DGX (2×/4×); `deploy-dgx-spark.yml` auto-deploys on merge; self-hosted Supabase overlay authored so data never leaves the box; air-gap option (no public ingress); customer owns 100% of model weights. Full first-run hardware validation of the self-hosted stack is part of the funded hardening (TRL 6→7). Cloud (S1 — Scaleway/UpCloud + Aiven) and hybrid (S3) tiers run the same image.

**Funded TRL 6→8 gap:** the standardized mandate credential + within-mandate selective-disclosure proof, a conformance/test suite, cross-border pilot validation, and certification-grade hardening.

***

## F6b — IP strategy & freedom to operate

The defensible IP is the trust-and-mandate technology inside DWS IQ: the **session trust-scoring model** and the **evidence-chain / within-mandate selective-disclosure proof** — patent-tracked and kept in the proprietary **DWS IQ Aegis / Themis** layer, filed or scoped **before** any covering code is published (IPR counsel review scheduled; EUIPO SME Fund Voucher 3 sequenced to fund drafting). Around that core, an open layer drives adoption: the **KYA conformance interface** under **CC-BY 4.0**, reference **SDKs under Apache-2.0**, a **compliance core under EUPL-1.2** (copyleft moat against hyperscaler re-hosting; one-way GPL/AGPL compatibility toward FOSS payment infrastructure such as GNU Taler), while the enterprise product (DWS IQ Aegis) stays proprietary. Copyright on the EUPL core is held by **Lifetime Oy under a CLA**, preserving dual-licensing. Freedom to operate: identity/mandate primitives build on open standards (eIDAS 2.0, W3C VC/DID) and our own production code; no third-party IP dependency blocks commercial exploitation.

***

## F7 — Market & problem

DWS IQ sells today into EU enterprises in regulated industries (energy, manufacturing, construction, logistics, finance, healthcare — 25 verticals mapped) that must file under ETS/CBAM/CSRD and increasingly want to automate it. Their compliance functions ask three questions of any agent that would act for them: *who is it, what may it do, and can we prove it?* From August 2027, for high-risk systems, wrong answers are enforceable violations (AI Act penalties up to 7% of global turnover).

**Primary market:** the regulated-industry mid-market/enterprise DWS IQ already serves (Finland live, Sweden via Lifetime AB). **Secondary:** agent-platform vendors and integrators who need a trusted action layer; payment institutions adding agent-initiated transactions.

**Beachhead → expansion:** upsell mandate-based autonomous action into the existing Aegis customer base, then expand along NVIDIA/IBM/AWS partner channels. The live product is the wedge; the open conformance layer creates the category around it.

***

## F8 — Competition & USP

Emerging agent-payment/identity players: **Coinbase x402** (crypto-rail, custodial, US, no mandate), **Google AP2** (card rails, binds the human account, US governance), **Stripe agent toolkit** (API-key identity on card rails), **KYC incumbents** (Shufti/Onfido/iDenfy — verify humans, not agents). Horizontal AI platforms (Snowflake Cortex, Databricks, Palantir) stop at the answer, not the action.

**None is simultaneously (a) EU-sovereign, (b) agent-native, (c) compliance-native, and (d) already in production for paying regulated-industry customers. DWS IQ Aegis is.**

**USP (the sovereignty wedge):** the only live European platform where agent identity, bounded revocable authority, and Article-12 audit run in production today — and the only one extending that to signed, auditable agent *action and transaction*. US players cannot follow: they cannot run inference on-premise inside the customer's building (CLOUD Act), and they cannot settle natively on emerging EU-sovereign rails (EUDI Wallet, Digital Euro). Aegis's S2 Sovereign-DGX deployment and EU-rail readiness can. Compliance and sovereignty are not our cost; they are the product.

***

## F9 — Business model & commercialisation

**Validated in the live catalogue:**
1. **Flagship deployments** — DWS IQ Aegis €59,990 one-time + edge hardware (Control Room €5,294 → IGX Orin €11,990).
2. **Platform subscriptions** — agent SKUs €499–€2,999/mo per line; industry pods €999–€1,499/mo; workforce bundles up to €19,990/mo.
3. **Outcome-priced metered SKUs** — e.g. compliance gap analysis €999–€2,499 per outcome.
4. **Grant-enabled autonomous-action tier (new):** a premium mandate/transaction layer on top of Aegis; conformance certification for third-party agents; enterprise EUPL-core licences for copyleft-averse integrators (dual-licensing, CLA to Lifetime Oy).

**Traction:** €7k MRR, 6 paying customers, zero churn; 12-month roadmap to €60k MRR. **Route to market:** upsell the existing Aegis base + NVIDIA/IBM/AWS channels + the open conformance layer as demand generator.

***

## F10 — Broad impact

- **EU strategic autonomy.** Agent-transaction infrastructure is being defined now, by US platforms, on US rails, under US jurisdiction. DWS IQ is the European alternative in production: sovereign, GDPR-native, eIDAS-2.0-aligned, CLOUD-Act-free — with an on-premise S2 Sovereign-DGX option and readiness for EU-native rails (EUDI Wallet, Digital Euro) so the entire identity→action→settlement chain can stay inside the EU.
- **AI Act implementation.** DWS IQ operationalizes Articles 12 (records), 14 (human oversight — the mandate/revocation primitive *is* oversight), and 72 (post-market monitoring) for agentic systems — something regulators and notified bodies can certify against.
- **Ecosystem creation.** Open conformance interface (CC-BY 4.0) + Apache-2.0 SDKs let EU startups and integrators build on the trusted action layer; EUPL-1.2 on the core keeps improvements European and open.
- **Jobs & growth.** Nordic-first scale-up (FI+SE), partner-network delivery, targeted Finnish headcount for certification, standards governance, and enterprise support.
- **Trust in AI.** A revocable, auditable, privacy-preserving mandate makes "my agent did it" legally and commercially meaningful — and safe to allow.
- **Cross-domain pull (external validation & expansion).** The same "who is in control?" problem now sits at the centre of chip design: NVIDIA's and Si2's DAC 2026 panel *Agentic AI in EDA: Who's in Control?* (Jul 2026) frames securing IP and compliance when autonomous agents operate across hybrid environments, and trust/accountability for emergent multi-agent decisions — exactly agent identity, mandate revocation and Article-12 logging. EDA is strategically critical to EU sovereignty (chip design); DWS IQ's S2 on-prem tier — where design IP never leaves the building — is a natural post-grant expansion vertical.

***

## F11 — Team & execution capacity

**Founder-led, partner-delivered, agent-multiplied — a distributed delivery model, not solo-founder risk:**

- **Risto Anton Päärni, Founder & CEO** — 35+ years ICT infrastructure; chief architect of the DWS IQ platform and the KYA trust engine; NVIDIA Connect, IBM Business Partner, AWS Advanced Consulting Partner relationships; doctoral candidate (LUT) on agentic commerce, KYA as trust primitive, and quantum-safe transaction primitives.
- **Lifetime Certified Partners consortium — Cubet Techno Labs**, whose CEO **John Lovegin** joins as consortium delivery lead: a standing bench of around 20 engineers (AI/ML, data engineering, DevOps, GenAI architecture) able to commit FTEs and sustain cover with no key-person risk, ramping within 15 days — drawn from the partners' 100+ combined engineering capacity (Cubet ca. 70 + 9series 60+). An NDA between Lifetime Oy and Cubet is in force. Development under EU controls: no customer/registry data leaves EU/EEA; EU-based maintenance handover; core R&D and IP stay with Lifetime Oy in Finland. `[Source: bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md. VERIFY before submit: short written note from Lovegin confirming the bench is available for the AEGIS/EIC project + photo consent. Title confirmed: CEO, Cubet.]`
- **AI agent fleet as operational multiplier** — 50 production agents run compliance, reporting, QA, and content ops; the company is the reference deployment of what it sells.
- **Nordic expansion vehicle:** Lifetime AB (Sweden).

***

## F12 — Funding need & why EIC support (Grant-only €2.5M)

**Ask: grant-only €2.5M** — 70% of a €3.57M, 24-month innovation budget; 30% own contribution from operating revenue and committed investor capital. Grant-only preserves the non-dilutive thesis and is permitted under EIC Open.

**Why the market does not fund this (need for Union support):** the autonomous-action layer's value — signed mandates, conformance, sovereignty-as-public-good — accrues ecosystem-wide and cannot be captured by a single investor the way a proprietary SaaS can; banks do not lend against pre-certification deep-tech. The only privately funded answers to agent accountability are therefore US-custodial platform plays. This is exactly the non-bankable, high-risk/high-impact deep-tech gap the EIC exists to close — and Lifetime already has the live product, the customers, and the revenue to de-risk execution.

> Applicant entity: **Lifetime Oy (FI)**, single SME; Lifetime AB (SE) is the cross-border expansion vehicle, not a co-applicant.

***

## F13 — Risk

- **Technical (high, funded):** the within-mandate selective-disclosure proof is unsolved engineering — the core funded risk (WP2). Mitigation: production fallback (server-side mandate enforcement already works in DWS IQ; ZK disclosure is the privacy upgrade), partner cryptography expertise, staged milestones.
- **Market timing (medium):** AI Act enforcement could slip. Mitigation: compliance functions buy ahead of deadlines — our €7k MRR is pre-enforcement revenue; the mandate primitive has fraud/liability value independent of regulation.
- **Adoption (medium):** mitigation — the capability ships inside a product customers already buy (Aegis upsell), so adoption does not depend on a new standard succeeding; open conformance + Article 12/14 lower friction further.
- **Execution (low-medium):** small core team, mitigated by the contracted partner bench (~20 engineers, no key-person risk), the agent-fleet multiplier, and grant-funded key hires.
- **Financial (low):** revenue-generating, no debt, 30% co-funding covered.

***

## F14 — Milestones & the ask

**24-month grant arc:**
- **M6:** mandate credential v1 + within-mandate proof alpha + **Sovereignty Attestation v1** in the evidence chain (conformance-tested); first mandate-bound agent action end-to-end in DWS IQ staging (e.g. a filing / journal entry).
- **M12:** autonomous-action tier GA in DWS IQ Aegis; EUPL-1.2 core + Apache-2.0 SDKs released (CLA in place, patents filed/scoped first); pilot 1 live (FI).
- **M18:** selective-disclosure proof in production; pilot 2 live (SE via Lifetime AB); ≥3 third-party agents in conformance testing.
- **M24 (TRL 8):** certification path established with a notified body; 10+ conformant integrations; €60k+ MRR baseline.

**The ask:** €2.5M grant to make Europe's live sovereign agentic-compliance platform able to *act and transact* under trusted, revocable, audited authority — before the default is set elsewhere. The platform runs today; the traction is real and paying; the regulation that makes it mandatory has a date.

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

- [ ] **10-slide pitch deck** — build from `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md` + `V4.3-DWS-IQ6-InvestorPD_2026.md`; every claim must match this packet. Lead with DWS IQ Aegis (live product) → the autonomous-action leap.
- [ ] **3-minute video** — **solo founder** (EIC allows 1–3). **Risto Anton Päärni** to camera + product capture: DWS IQ Aegis, KYA trust score, Leash Snap, an agent action with Article-12 log reconstruction.
- [ ] **Partner card** (deck team slide): **John Lovegin, CEO, Cubet** — photo (with his consent) + factual capacity line only (standing bench ~20 engineers, no key-person risk). **No endorsement quote.** Requires photo-usage consent only.
- Apply entry point (verified 2026-07-17): F&T portal topic **HORIZON-EIC-2026-ACCELERATOR-01** → Step 1 platform (EU Login). One EIC Accelerator application at a time.

## Before Submit (founder review)

- [ ] Confirm exact field labels/limits against downloaded Guide v6.0 template (DL 18.7).
- [ ] SAFE-round phrasing "in progress", never "open SAFE round".
- [ ] `/truth-check` on all public-facing claims.
- [ ] Confirm the MRR window wording (e.g. "0% churn over N months").
- [ ] **Do not click Submit** until deck + video are uploaded and reviewed. Target batch: **Aug 4 2026** (submit by ~Aug 1).

***

**End of fill packet.**
