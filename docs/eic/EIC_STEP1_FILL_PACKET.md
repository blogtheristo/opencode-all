# EIC Accelerator Step 1 — Chrome Fill Packet (paste-ready by form field)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version        | 2.0                                                                                                                                                                                                                       |
| Date           | 2026-07-17                                                                                                                                                                                                                |
| Author         | Lifetime Oy                                                                                                                                                                                                               |
| Owner          | risto-001                                                                                                                                                                                                                 |
| Status         | Active — fill aid for the Step 1 online form (CONTINUOUS deadline 17.12.2026 17:00 Brussels)                                                                                                                              |
| Classification | Internal                                                                                                                                                                                                                  |
| Branch         | claude/dl-18-7-delivery-7m1hnj                                                                                                                                                                                            |
| Framing        | **DWS IQ / Aegis as hero** (founder decision 2026-07-17). Funded innovation = agents that act & transact under bounded, revocable, audited authority. KYA = the live trust engine (component), not a standalone standard. |
| Decisions      | Grant-only €2.5M; applicant = Lifetime Oy (FI)                                                                                                                                                                            |

---

## How to fill

Match each on-screen field label to the closest block below (F1–F14 + structured fields). Watch the character counter; if a field is tighter than the text, trim from the END, never mid-claim. Structured/numeric fields are at the bottom. Do not submit until deck + video are uploaded and reviewed.

> Confirm exact field labels/limits against the downloaded Guide v6.0 template. Where the live form splits/merges a question, split/merge the matching block.

---

## F1 — Project title (short field)

AEGIS — sovereign, on-premise AI agents that act and transact for regulated Europe: DWS IQ on the customer's own NVIDIA DGX, where data and model weights never leave the building.

## F2 — Acronym

AEGIS

## F3 — Keywords

sovereign AI agents; agentic compliance; DWS IQ; agent identity & mandate; revocable authority; EU AI Act Article 12; eIDAS 2.0; EUDI Wallet; digital euro; sovereign on-prem inference (DGX); regulated industry; agentic commerce.

---

## F4 — Abstract / summary of the innovation

DWS IQ is an EU-sovereign platform whose AI agents do compliance, reporting and operations for regulated European industry. At its core is the **KYA engine — Know Your Agent** — agent identity binding, live session trust scoring, TC-4 "Leash Snap" revocation, and EU AI Act **Article-12** append-only audit. KYA runs in our production EU deployment today; it is the asset this project builds on. **DWS IQ Aegis (€59,990)**, the single-tenant sovereign **dual-use** tier, packages KYA to run on the customer's own **NVIDIA DGX** — an on-premise "S2" deployment where inference, data and model weights stay on customer hardware. Aegis reaches **general availability in September 2026**; a cloud tier (S1 — EU-resident) and hybrid tier (S3) run the same agent brain at different sovereignty postures. Today those agents _analyse and report_. The funded leap — the frontier for regulated Europe — is agents that _act and transact_ (file declarations, post journal entries, trigger payments) under authority that is bounded, revocable and fully audited, **on this sovereign substrate**. No US-custodial answer (Visa, Google AP2, Coinbase x402, Stripe) binds the agent rather than the human's card, or runs inside the customer's building. This project takes the capability from **TRL 5 completed, entering TRL 6, to TRL 8**: the trust-and-mandate layer (the production KYA engine + a standardized mandate credential and selective-disclosure proof), certification-grade hardening, and cross-border pilots — before the AI Act's high-risk obligations begin in December 2027.

---

## F5 — The innovation: what it is & why now

**In one line:** KYA v2 introduces tier-aware sovereignty profiles with cryptographic attestation, making EU AI Act compliance machine-verifiable across cloud, edge, and air-gapped deployments.

DWS IQ already makes agents accountable, in production: (1) agent identity binding, (2) a live session trust score that gates actions, (3) revocable authority via the TC-4 "Leash Snap" primitive, (4) Article-12 append-only audit — this is the **KYA engine**, running today. The funded innovation extends it from _action-gating_ to _action-and-transaction under mandate_: a signed, bounded **mandate credential** (spend caps, scope, validity) and a **selective-disclosure proof** that an action is within mandate without revealing the mandate or the principal (**deep tech**, rooted in cutting-edge zero-knowledge cryptography and agentic-systems research — transformative, not incremental tooling) — so a DWS IQ agent can file a CBAM declaration, post a GL journal entry, or settle a payment, and any auditor or regulator can reconstruct exactly what it did and under whose authority. Because DWS IQ ships in three sovereignty postures (S1 cloud, S2 on-prem DGX, S3 hybrid), the trust layer is **deployment-sovereignty-aware**: a KYA Sovereignty Profile binds key custody, evidence residency and trust scoring to the tier (on-prem, air-gap-safe, no phone-home for S2) — and, the funded standards contribution, every mandate and evidence entry carries a signed **Sovereignty Attestation**: a machine-verifiable claim of jurisdiction, data-residency, model-weight ownership and air-gap status. Sovereignty stops being a promise and becomes cryptographically auditable. Why now: the EU AI Act became generally applicable in **August 2026** — Article 50 transparency duties already reach agentic systems per Commission guidance — and Articles 12/14/72 begin for high-risk systems in **December 2027** (Annex III, as deferred by the Digital Omnibus on AI, Council-approved 29 June 2026; Annex I embedded systems August 2028), exactly as agentic commerce arrives — and Europe is building the sovereign rails for it (EUDI Wallet is law from 12/2026, the ECB **Digital Euro** enters its pilot in H2 2027, issuance targeted ~2029). Agents that transact on EU-sovereign identity and payment rails will need an EU-sovereign trust-and-mandate layer; US-custodial card-rail answers cannot plug into it. Agents that transact inside regulated industries have no European trust layer today. DWS IQ becomes it.

---

## F6 — Technology readiness & evidence

**TRL 5 completed, entering TRL 6.** The claim is anchored on the **KYA engine**, which is running code in a real EU deployment — not slideware, and not a lab demo:

- **KYA trust engine live:** agent identity binding, live session trust scoring, and TC-4 "Leash Snap" revocation exposed on the production API — gating destructive agent actions today.
- **EU AI Act Article-12 logging live:** append-only, RLS-enforced audit tables correlated to agent/session identity, deployed in the production database.
- An agent fleet spanning the **21 EU-regulated industries in Aegis scope** (of 25 platform-wide); agent-initiated actions carry originating-agent audit trails by architecture rule.
- Per-agent sandbox isolation with tiered capability gating is implemented at the software layer; **hardware-level Firecracker MicroVM isolation is specified and forms part of the funded hardening**.
- Agentic-commerce reference architecture specified; payments on tokenized rails — card data never enters our systems.
- EU-only identity processing and a DPA are contracted with an EU-resident identity-verification provider.
- **Sovereign deployment (S2):** Aegis is architected to run on the customer's own NVIDIA DGX, with a self-hosted data overlay so data stays on the box, an air-gap option, and 100% customer ownership of model weights. **First-run hardware validation of the fully sovereign stack is inside the funded work (TRL 6→7).** The current production tier runs on EU-resident managed infrastructure.

This **completes TRL 5** — validation in a relevant environment — via the production KYA engine and Article-12 audit layer. **DWS IQ Aegis, the sovereign dual-use tier that packages this, reaches general availability in September 2026 and is pre-revenue today.** We state that plainly: the grant funds the leap, and a finished product would not need it.

**Funded TRL 6→8 gap:** the standardized mandate credential + within-mandate selective-disclosure proof, a conformance/test suite, first-run sovereign-hardware validation, cross-border pilot validation, and certification-grade hardening.

---

## F6b — IP strategy & freedom to operate

The defensible IP is the trust-and-mandate technology inside DWS IQ: the **signed Sovereignty Attestation (the primary patent claim — the differentiator no other agent-governance framework has)**, the **session trust-scoring model**, and the **evidence-chain / within-mandate selective-disclosure proof** — patent-tracked and kept in the proprietary **DWS IQ Aegis / Themis** layer, filed or scoped **before** any covering code or spec is published (IPR counsel review scheduled; EUIPO SME Fund Voucher 3 sequenced to fund drafting). Around that core, an open layer drives adoption: the **KYA conformance interface** under **CC-BY 4.0**, reference **SDKs under Apache-2.0**, a **compliance core under EUPL-1.2** (copyleft moat against hyperscaler re-hosting; one-way GPL/AGPL compatibility toward FOSS payment infrastructure such as GNU Taler), while the enterprise product (DWS IQ Aegis) stays proprietary. Copyright on the EUPL core is held by **Lifetime Oy under a CLA**, preserving dual-licensing. Freedom to operate: identity/mandate primitives build on open standards (eIDAS 2.0, W3C VC/DID) and our own production code; no third-party IP dependency blocks commercial exploitation.

---

## F7 — Market & problem

DWS IQ sells today into EU enterprises in regulated industries (energy, manufacturing, construction, logistics, finance, healthcare — 25 verticals mapped) that must file under ETS/CBAM/CSRD and increasingly want to automate it. Their compliance functions ask three questions of any agent that would act for them: _who is it, what may it do, and can we prove it?_ The AI Act has applied since August 2026; from December 2027, for high-risk systems, wrong answers are enforceable violations (AI Act penalties up to 7% of global turnover).

**Total market (Impact criterion):** the adjacent carbon/compliance-software market alone is ~$24.3B (2025) growing to ~$191.2B by 2035 (22.9% CAGR); on top sits a new agentic-AI trust/action category. **Realistic share:** near-term SOM is the EU regulated-industry mid-market/enterprise base we already sell into; a modest low-single-digit % of the EU serviceable market over the grant horizon. `[Full TAM/SAM/SOM breakdown → Step 2.]`

**Primary market:** the regulated-industry mid-market/enterprise DWS IQ already serves (Finland live, Sweden via Lifetime AB). **Secondary:** agent-platform vendors and integrators who need a trusted action layer; payment institutions adding agent-initiated transactions.

**Beachhead → expansion:** upsell mandate-based autonomous action into the existing Aegis customer base, then expand along NVIDIA/IBM/AWS partner channels. The live product is the wedge; the open conformance layer creates the category around it.

---

## F7b — Dual-use business case (civil + defence)

The EIC dual-use route requires a credible case on **both** sides. Ours is asymmetric today, and we say so.

**Civil — evidenced and primary.** ETS/CBAM/CSRD compliance for regulated EU industry is the documented core: deterministic ETS/CBAM/carbon calculators under test, a 25-industry taxonomy, two contracted Q1/2026 enterprise pilots, and filed offers pending with Outokumpu and Kemira. This is where revenue comes from first.

**Defence / dual-use — design-partner stage, honestly stated.** DWS IQ Aegis secures and optimises the **physical production facilities and supply chains** that serve both civil industry and Europe's defence industrial base — **it does not touch the tactical frontline**. Defence and dual-use supply chains carry the same EU obligations as civil ones (CSRD, CBAM, NIS2, CER Directive, CRM Act) **plus** export control and data sovereignty; no platform serves that intersection across the 21 in-scope industries. Concretely: **Aegis was specified against a defence-industry prime's requirement set** (that engagement is under NDA; the counterparty is not named here without its written consent), and a **submission to NATO DIANA is in preparation at DIANA's own request** — they asked for a pitch video and deck. We have **no defence reference customer and no defence LOI yet**, and we do not claim one. The wedge we lead with is structural sovereignty, not defence traction.

**Why the pairing is real, not retrofitted:** the same trust-and-mandate primitive — who is this agent, what may it do, can we prove it — is what a CBAM filing and a defence-supply-chain action both require. One engine, two markets, one certification path.

---

## F6c — Export control & classification (dual-use declaration)

Declaring dual-use invites export-control scrutiny, so we address it up front. The **funded** cryptography is a mandate credential, an evidence-chain signature and a selective-disclosure proof — i.e. **authentication and digital signature**, which carry a long-standing decontrol under Reg. (EU) 2021/821 Annex I 5A002/5D002. **Action before submission:** obtain a written classification opinion from the Finnish Ministry for Foreign Affairs export-control unit covering (a) the SAR / orbital change-detection module and (b) the post-quantum / selective-disclosure path, and reword any "target detection / target labeling" phrasing to **industrial-facility change detection**. Nothing in this application is classified or security-marked.

---

## F8 — Competition & USP

Agent-payment/identity players, now shipping: **Visa Intelligent Commerce / Agent Ready** — live for merchant transactions across Europe since July 2026 with ~30 European issuers (Revolut, ING, Commerzbank, Klarna, CaixaBank, Nexi…), where Payment Passkeys bind each agent-initiated payment to a _verified human instruction_ under SCA; **Google AP2** (open protocol with ~60 partners; its cryptographically-signed **mandates** evidence the user's instruction on card rails, under US governance); **Mastercard Agent Pay**; **Coinbase x402** (crypto-rail, custodial, US); **Stripe agent toolkit** (API-key identity on card rails); **KYC incumbents** (Shufti/Onfido/iDenfy — verify humans, not agents).

**What none of them does:** these bind the _human's card and the human's instruction_ for consumer checkout. None issues the **agent** a durable identity with bounded, revocable, autonomous authority; none carries a selective-disclosure proof or a jurisdiction/residency/air-gap attestation; none runs inside the customer's building; and none extends past payment to the regulated-industry actions that matter here — filing a CBAM declaration, posting a GL journal entry. Notably, Europe's own institutions are adopting these US-governed rails because no European alternative exists — Revolut integrated Google's AP2 in January 2026. Horizontal AI platforms (Snowflake Cortex, Databricks, Palantir) stop at the answer, not the action.

**None is simultaneously (a) EU-sovereign, (b) agent-native, (c) compliance-native, and (d) already in production for paying regulated-industry customers. DWS IQ Aegis is.**

**USP (the sovereignty wedge):** the only live European platform where agent identity, bounded revocable authority, and Article-12 audit run in production today — and the only one extending that to signed, auditable agent _action and transaction_. US players cannot follow: they cannot run inference on-premise inside the customer's building (CLOUD Act), and they cannot settle natively on emerging EU-sovereign rails (EUDI Wallet, Digital Euro). Aegis's S2 Sovereign-DGX deployment and EU-rail readiness can. Compliance and sovereignty are not our cost; they are the product.

---

## F9 — Business model & commercialisation

**Validated in the live catalogue:**

1. **Flagship deployments** — DWS IQ Aegis €59,990 one-time + edge hardware (Control Room €5,294 → IGX Orin €11,990).
2. **Platform subscriptions** — agent SKUs €499–€2,999/mo per line; industry pods €999–€1,499/mo; workforce bundles up to €19,990/mo.
3. **Outcome-priced metered SKUs** — e.g. compliance gap analysis €999–€2,499 per outcome.
4. **Grant-enabled autonomous-action tier (new):** a premium mandate/transaction layer on top of Aegis; conformance certification for third-party agents; enterprise EUPL-core licences for copyleft-averse integrators (dual-licensing, CLA to Lifetime Oy).

**Traction (stated conservatively — every figure is reconcilable to bookkeeping):** Lifetime Oy is **revenue-generating and operates at cash break-even**, which de-risks execution without investor dependence. That revenue comes from **Lifetime Fleet**, the founder's established licensed transport operation serving Traficom-regulated dispatch operators — **it is transport revenue, not platform revenue, and we never present it as software traction.** Its relevance here is threefold: it funds the company, it proves we run regulated operations to a compliance standard, and its vehicles are the first physical nodes of the EU-resident edge fleet the sovereign tier builds on. **Two DWS IQ enterprise pilots were contracted in Q1/2026 (€29,950 each).** Enterprise offers are filed and pending with **Outokumpu** (CBAM/CSRD/Scope 3) and **Kemira** (Climate Intelligence). **DWS IQ Aegis is pre-revenue** ahead of its September 2026 GA — we do not present it otherwise. **Route to market:** convert the filed enterprise pipeline, then upsell the autonomous-action tier into that base; NVIDIA/IBM/AWS partner channels; the open conformance layer as demand generator.

---

## F10 — Broad impact

- **EU strategic autonomy.** Agent-transaction infrastructure is being defined now, by US platforms, on US rails, under US jurisdiction. DWS IQ is the European alternative in production: sovereign, GDPR-native, eIDAS-2.0-aligned, CLOUD-Act-free — **directly reducing the Union's strategic dependency on US-jurisdiction AI and payment infrastructure** — with an on-premise S2 Sovereign-DGX option and readiness for EU-native rails (EUDI Wallet, Digital Euro) so the entire identity→action→settlement chain can stay inside the EU.
- **AI Act implementation.** DWS IQ operationalizes Articles 12 (records), 14 (human oversight — the mandate/revocation primitive _is_ oversight), and 72 (post-market monitoring) for agentic systems — something regulators and notified bodies can certify against.
- **Ecosystem creation.** Open conformance interface (CC-BY 4.0) + Apache-2.0 SDKs let EU startups and integrators build on the trusted action layer; EUPL-1.2 on the core keeps improvements European and open.
- **Jobs & growth.** Nordic-first scale-up (FI+SE), partner-network delivery, targeted Finnish headcount for certification, standards governance, and enterprise support.
- **Trust in AI.** A revocable, auditable, privacy-preserving mandate makes "my agent did it" legally and commercially meaningful — and safe to allow.
- **Cross-domain pull (external validation & expansion).** The same "who is in control?" problem now sits at the centre of chip design: NVIDIA's and Si2's DAC 2026 panel _Agentic AI in EDA: Who's in Control?_ (Jul 2026) frames securing IP and compliance when autonomous agents operate across hybrid environments, and trust/accountability for emergent multi-agent decisions — exactly agent identity, mandate revocation and Article-12 logging. EDA is strategically critical to EU sovereignty (chip design); DWS IQ's S2 on-prem tier — where design IP never leaves the building — is a natural post-grant expansion vertical.

---

## F11 — Team & execution capacity

**Founder-led, partner-delivered, agent-multiplied — a distributed delivery model, not solo-founder risk:**

- **Risto Anton Päärni, Founder & CEO** — 35+ years ICT infrastructure; chief architect of the DWS IQ platform and the KYA trust engine; NVIDIA Connect ISV Partner, IBM Business Partner, Amazon (AWS) Consulting Partner; in doctoral discussions with LUT University (Prof. Kari Smolander) on agentic commerce, KYA as trust primitive, and quantum-safe transaction primitives.
- **Lifetime Certified Partners consortium — Cubet Techno Labs**, whose CEO **John Lovegin** joins as consortium delivery lead: a standing bench of around 20 engineers (AI/ML, data engineering, DevOps, GenAI architecture) able to commit FTEs and sustain cover with no key-person risk, ramping within 15 days — drawn from the partners' 100+ combined engineering capacity (Cubet ca. 70 + 9series 60+). An NDA between Lifetime Oy and Cubet is in force. Development under EU controls: no customer/registry data leaves EU/EEA; EU-based maintenance handover; core R&D and IP stay with Lifetime Oy in Finland. `[Source: bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md. Confirmation request SENT to Lovegin 2026-07-17 — awaiting his written reply ("...engaged as a contracted delivery partner for Lifetime Oy's DWS IQ platform, providing engineering resources under NDA") + representative photo. Title confirmed: CEO, Cubet.]`
- **AI agent fleet as operational multiplier** — 50 production agents run compliance, reporting, QA, and content ops; the company is the reference deployment of what it sells.
- **Academic anchoring — three complementary partners:** **LUT University** (quantum-safe / KYA trust primitives; WP2/WP5 — doctoral coupling in discussion with Prof. Kari Smolander, no formal position yet); **KTH TECoSA** (safety-argumentation & assurance for trustworthy autonomous systems; WP3/WP4 — active dialogue); **Metropolia** (engineering-talent pipeline & teaching validation — Risto's 5/5 master's, supervised by Varteva/Räsänen). Distinct, non-overlapping roles (research depth · safety assurance · applied talent). Partnerships to be formalized (LOIs) for Step 2.
- **Nordic expansion vehicle:** Lifetime AB (Sweden).
- **Skills gaps, governance & investor traction (EIC criterion):** the core team is **two people** — founder/CEO and Office Chief (operations) — deliberately extended by a contracted engineering bench under NDA and multiplied by our own agent fleet. We state the raw number rather than dress it up; grant-funded hires are precisely what converts a two-person core into a certifiable organisation, and gender balance is a stated hiring objective. Two competence gaps identified — applied cryptography (selective-disclosure / ZK) and conformance/certification — filled by grant-funded key hires. Early investor traction: **€650K SAFE round in progress at a €3.8M cap, targeting EU/EEA-domiciled investors**; NVIDIA / IBM / AWS partner relationships. Financing requirement exceeds what market actors can finance alone (see F12).

---

## F12 — Funding need & why EIC support (Grant-only €2.5M)

**Ask: grant-only €2.5M** — 70% of a €3.57M, 24-month innovation budget; 30% own contribution from operating revenue and committed investor capital. Grant-only preserves the non-dilutive thesis and is permitted under EIC Accelerator (the Open/Challenge choice is made at full-proposal stage, not at Step 1).

**Why the market does not fund this (need for Union support):** the autonomous-action layer's value — signed mandates, conformance, sovereignty-as-public-good — accrues ecosystem-wide and cannot be captured by a single investor the way a proprietary SaaS can; banks do not lend against pre-certification deep-tech. The only privately funded answers to agent accountability are therefore US-custodial platform plays. This is exactly the non-bankable, high-risk/high-impact deep-tech gap the EIC exists to close — and Lifetime already has the live product, the customers, and the revenue to de-risk execution.

> Applicant entity: **Lifetime Oy (FI)**, single SME; Lifetime AB (SE) is the cross-border expansion vehicle, not a co-applicant.

---

## F13 — Risk

- **Technical (high, funded):** the within-mandate selective-disclosure proof is unsolved engineering — the core funded risk (WP2). Mitigation: production fallback (server-side mandate enforcement already works in DWS IQ; ZK disclosure is the privacy upgrade), partner cryptography expertise, staged milestones.
- **Market timing (medium):** AI Act enforcement could slip. Mitigation: compliance functions buy ahead of deadlines — our €7k MRR is pre-enforcement revenue; the mandate primitive has fraud/liability value independent of regulation.
- **Adoption (medium):** mitigation — the capability ships inside a product customers already buy (Aegis upsell), so adoption does not depend on a new standard succeeding; open conformance + Article 12/14 lower friction further.
- **Execution (low-medium):** small core team, mitigated by the contracted partner bench (~20 engineers, no key-person risk), the agent-fleet multiplier, and grant-funded key hires.
- **Financial (low):** revenue-generating, no debt, 30% co-funding covered.

---

## F14 — Milestones & the ask

**24-month grant arc:**

- **M6:** KYA spec v1.0 with the **tier-aware Sovereignty Profile**; mandate credential v1 + within-mandate proof alpha; first mandate-bound agent action end-to-end in DWS IQ staging (e.g. a filing / journal entry).
- **M12:** **Signed Sovereignty Attestation in production**; autonomous-action tier GA in DWS IQ Aegis; EUPL-1.2 core + Apache-2.0 SDKs released (CLA in place, patents filed first); pilot 1 live (FI).
- **M18:** selective-disclosure proof in production; pilot 2 live (SE via Lifetime AB); ≥3 third-party agents in conformance testing.
- **M24 (TRL 8):** certification path established with a notified body; 10+ conformant integrations; €60k+ MRR baseline.

**The ask:** €2.5M grant to make Europe's live sovereign agentic-compliance platform able to _act and transact_ under trusted, revocable, audited authority — before the default is set elsewhere. The platform runs today; the traction is real and paying; the regulation that makes it mandatory has a date.

---

## Structured fields (enter manually)

| Portal field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Applicant / legal entity     | Lifetime Oy                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Country                      | Finland                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Business ID (Y-tunnus)       | 0772407-9                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| SME status                   | Yes — single SME applicant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Funding type                 | **Grant-only** (no equity/blended)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Grant requested              | €2,500,000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Total innovation budget      | €3,570,000 (grant 70% + 30% own contribution)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Current TRL                  | **5 completed, entering 6** (anchored on the production KYA engine + Article-12 audit)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Target TRL (end of project)  | 8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Project duration             | 24 months                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Innovation activities        | TRL 6–8 (EIC Accelerator scope)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Part A dual-use tick box** | **YES — dual-use** (founder decision 2026-07-29, reversing the 2026-07-17 civil-only position on its own "revisit if a defence buyer appears" condition). Basis: EIC opened to dual-use 17 June 2026; Aegis is canonically the dual-use tier (`Store/PRODUCT_AEGIS.md`); Aegis was specified against a defence-industry requirement set; NATO DIANA submission in preparation **at DIANA's request** (video + deck requested). ⚠️ Preconditions: (a) log the DIANA request per §24 — it is the citable artifact; (b) do **not** name the defence prime without written consent (NDA covers negotiations/partnerships, €100k penalty); (c) obtain an export-control classification opinion from the Finnish MFA on the SAR/orbital module before submission. |

---

## Uploads (separate deliverables — not text fields)

- [ ] **10-slide pitch deck** — build from `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md` + `V4.3-DWS-IQ6-InvestorPD_2026.md`; every claim must match this packet. Lead with DWS IQ Aegis (live product) → the autonomous-action leap.
- [ ] **3-minute video** — **solo founder** (EIC allows 1–3). **Risto Anton Päärni** to camera + product capture: DWS IQ Aegis, KYA trust score, Leash Snap, an agent action with Article-12 log reconstruction.
- [ ] **Partner card** (deck team slide): **John Lovegin, CEO, Cubet** — photo (with his consent) + factual capacity line only (standing bench ~20 engineers, no key-person risk). **No endorsement quote.** Requires photo-usage consent only.
- Apply entry point (verified 2026-07-17): F&T portal topic **HORIZON-EIC-2026-ACCELERATOR-01** → Step 1 platform (EU Login). One EIC Accelerator application at a time.

## Before Submit (founder review)

- [ ] Confirm exact field labels/limits against downloaded Guide v6.0 template (DL 18.7).
- [x] SAFE wording confirmed: "€650K SAFE round in progress at a €3.8M cap, targeting EU/EEA-domiciled investors" (no named investors).
- [ ] `/truth-check` on all public-facing claims.
- [x] Retention wording confirmed: "100% retention across 6 paying customers since first paid deployment (Dec 2025)" — no bare "zero churn" (avoids time-window ambiguity).
- [x] Gender-balance wording confirmed: "team includes women and men across engineering, product, and operations roles".
- [ ] **Do not click Submit** until deck + video are uploaded and reviewed. **Operative deadline = 17.12.2026 17:00 Brussels — CONTINUOUS (no batch, no first-Tuesday, no cut-off).** Submit any time before the deadline; recommend submitting well ahead, not at the cap. The 18 July milestone (download Guide v6.0 + template) is **done**.
- [ ] **Participant Register:** Lifetime Oy registered → **PIC obtained + validated** by the Central Validation Service (mandatory in the submission wizard; validation before grant signature). Confirm EU Login contact person who both **creates and submits**.

---

**End of fill packet.**
