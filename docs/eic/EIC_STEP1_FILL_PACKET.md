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

**Civil — evidenced and primary.** ETS/CBAM/CSRD compliance for regulated EU industry is the documented core: deterministic ETS/CBAM/carbon calculators under test, a 25-industry taxonomy, two contracted Q1/2026 enterprise pilots, and active discussions with Outokumpu and Kemira. This is where revenue comes from first.

**Defence / dual-use — design-partner stage, honestly stated.** DWS IQ Aegis secures and optimises the **physical production facilities and supply chains** that serve both civil industry and Europe's defence industrial base — **it does not touch the tactical frontline**. Defence and dual-use supply chains carry the same EU obligations as civil ones (CSRD, CBAM, NIS2, CER Directive, CRM Act) **plus** export control and data sovereignty; no platform serves that intersection across the 21 in-scope industries. Concretely: **Aegis was specified against a defence-industry prime's requirement set** (that engagement is under NDA; the counterparty is not named here without its written consent), and a **submission to NATO DIANA is in preparation at DIANA's own request** — they asked for a pitch video and deck. We have **no defence reference customer and no defence LOI yet**, and we do not claim one. The wedge we lead with is structural sovereignty, not defence traction.

**Why the pairing is real, not retrofitted:** the same trust-and-mandate primitive — who is this agent, what may it do, can we prove it — is what a CBAM filing and a defence-supply-chain action both require. One engine, two markets, one certification path.

---

## F6c — Export control & classification (dual-use declaration)

Declaring dual-use invites export-control scrutiny, so we address it up front.

**Nothing in this application describes a controlled item.** The SAR / orbital change-detection module, counter-UAS and radio-transcription capabilities that exist elsewhere in the product roadmap are **deliberately out of scope for this project** and are not described anywhere in this submission — so there is nothing here requiring classification before submitting.

The **funded** cryptography is a mandate credential, an evidence-chain signature and a within-mandate selective-disclosure proof — i.e. **authentication and digital signature**, which carry a long-standing decontrol under Reg. (EU) 2021/821 Annex I 5A002/5D002. It is also at TRL 2–3: nothing is built, and nothing is exported.

**Founder decision 2026-07-29 — no expedited handling.** The classification request goes in through normal channels, not as a rush job, on the reasoning that the product it would classify is itself still in development (Aegis GA September 2026). A rushed opinion on a moving target would need re-doing; a normal-course opinion arrives in time for Step 2 and for first shipment, which is when it is actually needed.

**Sequenced actions (none blocks Step 1 submission):**

- **Before shipping any release containing the SAR / orbital module:** obtain a written classification opinion from the Finnish Ministry for Foreign Affairs export-control unit. Ask it as two separate questions — (a) does software analysing *commercially procured* SAR imagery for industrial-facility change detection fall under Annex I Category 6, noting we neither build the sensor nor task the satellite; (b) does the selective-disclosure / post-quantum signature path fall under 5A002/5D002, invoking the authentication-and-digital-signature decontrol.
- **Now, as hygiene:** reword "target detection / target labeling" phrasing in product code and marketing to **industrial-facility change detection**; keep Virve radio transcription out of all external material pending legal review.
- **Before Step 2 / grant agreement:** revisit classification once the funded cryptography is actually implemented.

Nothing in this application is classified or security-marked.
