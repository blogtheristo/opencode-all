# EIC Accelerator Step 1 — Draft Narrative (12 pages)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                             |
| -------------- | ----------------------------------------------------------------- |
| Version        | 0.91 (advisor review fixes — two [DECIDE] markers open)           |
| Date           | 2026-07-15                                                        |
| Author         | Lifetime Oy                                                       |
| Owner          | risto-001                                                         |
| Status         | Draft — for founder review before Aug 4 batch                     |
| Classification | Internal                                                          |
| Introduced-In  | PR-TBD                                                            |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                   |
| Target         | EIC Step 1, **Aug 4 2026 batch** (submit by ~Aug 1); Step 2 Nov 4 |
| Companion      | `EU_FUNDING_EIC_ACCELERATOR_2026.md` (v1.3 — criteria mapping)    |

**How to use:** each "page" below maps to the Step 1 online form fields
(12-page equivalent). Text is paste-ready prose; trim to the platform's
per-field character limits once the actual form (Guide v6.0 template) is open.
`[DECIDE]` = founder decision still open. `[VERIFY]` = check figure before
submission. All pricing claims are aligned to `dws10.com/config/products.json`
(single source of truth) and to `investor-outreach/V4.3-DWS-IQ6-InvestorPD_2026.md`
so EIC and investor materials never contradict each other.

---

## PAGE 1 — Abstract / Summary

**Project title:** KYA v2 — the European trust standard for AI agents that
transact.

**Acronym:** KYA-2 (Know Your Agent, version 2)

Autonomous AI agents are beginning to act — and pay — on behalf of people and
enterprises. Europe regulates the humans (KYC, eIDAS) and the models (AI Act),
but nothing regulates the **agent**: no standard identity, no bounded mandate,
no revocation, no audit trail that carries legal weight. Every enterprise
deploying agents in a regulated industry hits this wall, and every current
answer (Coinbase x402, Google AP2, Stripe's agent toolkit) is US-custodial,
card-rail, and privacy-poor — it binds the human, not the agent.

Lifetime Oy has built KYA (Know Your Agent): agent identity-binding, trust
scoring, revocable authority ("Leash Snap"), and EU-AI-Act Article-12
audit logging — running in production inside DWS IQ 6, an EU-sovereign
agent platform with 6 paying customers across regulated industries (€7k MRR,
zero churn). KYA-2 turns this production capability into **the open European
conformance standard for agentic AI** — agent-level identity, capability
manifests, revocable spending mandates, and privacy-preserving audit —
published as an open standard (CC-BY 4.0) with an Apache-2.0 reference
implementation, an EUPL-1.2 compliance core, and a commercial enterprise
implementation (Themis).

EIC funding takes the platform from TRL 6–7 to TRL 8: hardened standard +
conformance suite, the agentic-commerce mandate layer, cross-border pilots
(Finland → Sweden via Lifetime AB), and the certification path that makes
KYA-2 the reference infrastructure for AI Act enforcement, which begins for
high-risk systems in August 2027. Regulation creates the demand; we are asking
the EIC to fund the European answer before a US-custodial default fills it.

---

## PAGE 2 — Company

**Lifetime Oy** — Espoo, Finland. Business ID 0772407-9. Founded and led by
Risto Anton Päärni (Founder, CEO). SME, single applicant.

Lifetime Oy builds **DWS IQ**, an EU-sovereign platform where a fleet of ~50
production AI agents performs compliance, reporting, and operations work for
customers in regulated industries (energy, manufacturing, construction,
logistics, environment — 25 EU-regulated industries covered by the agent
taxonomy). The platform is live as public-cloud SaaS with EU-resident data
(Finland/Germany), zero CLOUD-Act exposure in its sovereign tier, and an
edge line (NVIDIA-based Control Room / Situation Room hardware) for
customers who need on-premise inference.

Commercial status (live catalogue, single pricing source):

- 6 paying customers, €7k MRR, **100% retention since launch** `[VERIFY:
state the month window in final text — "0% churn over N months"]`.
- Flagship deployment: DWS IQ Aegis, €59,990 one-time.
- Recurring agent subscriptions €499–€2,999/mo (typical starter tier €999/mo);
  outcome-priced metered SKUs from €49.
- Nordic expansion vehicle in place: **Lifetime AB (Sweden)**.

Partnerships: NVIDIA Connect partner, IBM Business Partner, AWS Advanced
Consulting Partner. Delivery is reinforced by the **Lifetime Certified
Partners** network (see Page 9).

---

## PAGE 3 — The Innovation

**What it is.** KYA-2 is a conformance standard plus running infrastructure
that makes an AI agent a first-class, accountable economic actor:

1. **Agent identity** — cryptographic identity-binding of an agent instance to
   its human/organisational principal (eIDAS-2.0-aligned), with a capability
   manifest declaring what the agent may do.
2. **Trust scoring** — a continuously updated, auditable session trust score
   that gates what actions the agent may take (already in production).
3. **Revocable mandate** — a signed, bounded authority: spend caps,
   merchant/category scope, validity window. Instantly revocable via the
   TC-4 "Leash Snap" chain-termination primitive (already in production for
   non-payment actions; KYA-2 extends it to transactions).
4. **Article-12-native audit** — append-only, privacy-preserving evidence
   chains that let a principal, auditor, or regulator reconstruct what an
   agent did and under whose authority — without exposing the principal to
   the counterparty.

**The core innovation (funded).** KYA-2 makes the trust layer
_deployment-sovereignty-aware_. A **tier-aware Sovereignty Profile** binds key
custody, evidence residency, and trust scoring to the deployment tier (S1
EU-cloud, S2 on-prem DGX / air-gapped, S3 hybrid); and every mandate and
evidence entry carries a **Signed Sovereignty Attestation** — a
machine-verifiable claim of {deployment tier, jurisdiction, data-residency,
model-weight ownership, air-gap status}. In one line: _KYA v2 introduces
tier-aware sovereignty profiles with cryptographic attestation, making EU AI
Act compliance machine-verifiable across cloud, edge, and air-gapped
deployments._ This is the differentiator no other agent-governance framework
has — and the lead patent claim (filed before the spec publishes).

**Why now.** EU AI Act record-keeping and human-oversight obligations
(Articles 12/14/72) begin enforcement for high-risk systems in **August
2027**. Agentic commerce is simultaneously arriving (x402, AP2, agentic
checkout). The intersection — _agents that transact inside regulated
industries_ — has no European standard. KYA-2 is that standard, extracted
from a system that already runs it.

**Dual-track IP (locked):** open standard under **CC-BY 4.0**; reference
implementation + SDKs under **Apache-2.0**; compliance core under **EUPL-1.2**
(the SaaS copyleft prevents closed re-hosting by hyperscalers; one-way
GPL/AGPL compatibility lets core components flow into adjacent FOSS payment
infrastructure such as GNU Taler); enterprise implementation (**Themis**)
proprietary. Patent-track candidates (trust-scoring model, evidence-chain
architecture) are filed or scoped to the proprietary layer **before** any
covering code is published (pending IPR counsel review — scheduled, does not
gate this application).

---

## PAGE 4 — Technology Readiness & Evidence

**Current TRL: 6–7.** The claim rests on production evidence, not lab demos:

- KYA engine live: session trust scoring, identity binding, TC-4 Leash Snap
  revocation — production API (`/api/v1/kya/*`), used to gate destructive
  agent actions today.
- EU AI Act Article-12 logging pipeline live: append-only audit tables,
  RLS-enforced, correlated to agent/session identity.
- Agent isolation: Firecracker MicroVM sandboxing operational.
- 50 production agents (canonical truth-registry count; 18 exposed via the
  MCP `tools/list` interface) operating for paying customers in 25 regulated
  industry verticals; agent-initiated actions carry originating-agent audit
  trails by architecture rule.
- Agentic-commerce reference architecture specified (ACP/AP2-style checkout
  with mandatory agent audit trail); payment mirror runs on tokenized rails —
  card data never enters our systems.
- EU-only identity processing already contracted (KYC provider addendum,
  EU-only processing in force) — the KYA identity layer inherits the
  strictest residency requirement in the stack.

**What is NOT yet built (the funded work):** the standardized mandate
credential and its selective-disclosure proof ("this payment is within
mandate" without revealing the mandate or principal), the public conformance
suite, cross-border pilot validation, and certification-grade hardening.
That is the TRL 6→8 gap this grant closes.

---

## PAGE 5 — Market & Problem

**The problem, sized from the buyer's seat.** Every EU enterprise that deploys
AI agents in a regulated process faces the same three questions from its
compliance function: _who is this agent, what exactly is it allowed to do, and
can we prove it afterwards?_ Today the answers are bespoke, per-vendor, and
non-portable. From August 2027, for high-risk systems, wrong answers become
enforceable violations (AI Act penalties up to 7% of global turnover).

**Target market.** Primary: EU enterprises in regulated industries deploying
agentic AI (energy, manufacturing, construction, logistics, finance,
healthcare — the 25 verticals DWS already maps). Secondary: agent-platform
vendors and system integrators who need a conformance standard to sell
against; payment institutions adding agent-initiated transactions.

**Beachhead → expansion.** We sell KYA-2 conformance where we already have
revenue: compliance-driven mid-market and enterprise in the Nordics
(Finland live, Sweden via Lifetime AB), expanding along our partner
channels (NVIDIA/IBM/AWS ecosystems). The open standard is the wedge: it
creates the category, and Themis (our implementation) is the reference
product in it.

`[VERIFY]` Quantified TAM/SAM/SOM to be finalized for Step 2 from
`DWS_MARKET_RESEARCH_STANDARD.md` methodology; Step 1 uses the qualitative
regulatory-demand argument plus live traction.

---

## PAGE 6 — Competition & USP

**Competitive field (agent payments/identity):**

- **Coinbase x402** — crypto-rail micropayments for agents. Custodial,
  US-centric, no agent mandate concept, no EU compliance surface.
- **Google Agent Payments Protocol (AP2)** — card/wallet rails, binds the
  human account, agent acts as a shopping proxy. Surveillance-friendly by
  design; no revocable bounded mandate; US governance.
- **Stripe agent toolkit / model-vendor agentic checkout** — convenience
  layers on existing card rails; KYC binds the human; agent identity is an
  API key, not an accountable identity.
- **Identity/KYC incumbents** (Shufti, Onfido, iDenfy…) — verify humans and
  companies, not agents; no capability manifests, no runtime trust scoring.

**Nobody in this field can be simultaneously (a) EU-sovereign, (b)
agent-native, and (c) compliance-native.** US players cannot credibly offer
(a) — CLOUD Act; identity incumbents lack (b); crypto rails lack (c).

**Our USP:** the only production system where agent identity, bounded
revocable authority, and Article-12 audit exist _today_, packaged as an open
European standard others can adopt — with the sovereign infrastructure to run
it inside the EU and at the edge. Compliance is not our cost; it is the
product.

---

## PAGE 7 — Business Model & Commercialisation

**Model (validated in the live catalogue):**

1. **Platform subscriptions** — DWS IQ agent SKUs €499–€2,999/mo per agent
   line; industry pods €999–€1,499/mo; workforce bundles up to €19,990/mo.
2. **Flagship deployments** — DWS IQ Aegis €59,990 one-time + edge hardware
   line (Control Room €5,294 → IGX Orin €11,990).
3. **Outcome-priced metered SKUs** — e.g. compliance gap analysis €999–€2,499
   per outcome.
4. **KYA-2 conformance layer (new, grant-enabled):** certification &
   conformance testing for third-party agent vendors; enterprise licences of
   the EUPL core for copyleft-averse integrators (dual-licensing — copyright
   held by Lifetime Oy under CLA); Themis enterprise implementation.

**Traction as evidence the model prices correctly:** €7k MRR, 6 paying
customers, zero churn, 12-month roadmap to €60k MRR (investor materials,
V4.3). The KYA-2 standard multiplies this: every conformant third-party
vendor becomes a channel, not a competitor.

**Route to market:** direct (existing regulated-industry pipeline) + partner
channels (NVIDIA/IBM/AWS) + the standard itself as demand generator (AI Act
enforcement makes conformance procurable).

---

## PAGE 8 — Broad Impact

- **EU strategic autonomy.** Agent-transaction infrastructure is being
  defined _now_, by US platforms, on US rails, under US jurisdiction. KYA-2
  is the European alternative: sovereign, GDPR-native, eIDAS-2.0-aligned,
  CLOUD-Act-free. Infrastructure, not just a product.
- **AI Act implementation.** KYA-2 operationalizes Articles 12 (records),
  14 (human oversight — the mandate/revocation primitive _is_ oversight),
  and 72 (post-market monitoring) for agentic systems — giving regulators
  and notified bodies something concrete to certify against.
- **Ecosystem creation.** Open standard (CC-BY 4.0) + Apache-2.0 SDKs mean
  EU startups and integrators build on it without permission; EUPL-1.2 on
  the core keeps improvements European and open.
- **Jobs & growth.** Nordic-first scale-up (FI+SE), partner-network delivery
  (100+ engineers across two contracted partners), targeted headcount growth
  in Finland for standard governance, certification, and enterprise support.
  `[VERIFY]` exact hiring plan numbers for Step 2.
- **Trust in AI.** The societal blocker for agentic AI is accountability.
  A revocable, auditable, privacy-preserving mandate makes "my agent did it"
  legally and commercially meaningful — and safe to allow.

---

## PAGE 9 — Team & Execution Capacity

**Founder-led, partner-delivered, agent-multiplied.** This is a distributed
delivery model, not a solo-founder risk:

- **Risto Anton Päärni, Founder & CEO** — 35+ years ICT infrastructure;
  chief architect of the DWS IQ platform and the KYA framework; NVIDIA
  Connect, IBM Business Partner, AWS Advanced Consulting Partner
  relationships; doctoral candidate (LUT), research track on agentic
  commerce, KYA as trust primitive, and quantum-safe transaction primitives
  — the scientific base of this proposal.
- **Lifetime Certified Partners consortium — 100+ engineers across two
  contracted partners** (NDA'd, actively delivering in a live public-sector
  bid): Cubet Techno Labs (ca. 70 engineers, AI/LLM engineering, est. 2013)
  and 9series Solutions (60+ developers). Development under EU controls: no
  customer/registry data leaves EU/EEA, EU-based maintenance handover, core
  R&D and IP remain with Lifetime Oy in Finland.
- **AI agent fleet as operational multiplier** — 50 production agents run
  compliance analysis, reporting, QA, and content operations; the
  architecture scales execution without linear headcount. The company is
  itself the reference deployment of the technology it sells.
- **Nordic expansion vehicle:** Lifetime AB (Sweden) for cross-border pilot
  and first-expansion market.
- **To add for Step 2:** named EU-side scientific advisors (KTH / LUT /
  SRC network) and key-hire plan funded by the grant.

---

## PAGE 10 — Funding Need & Use of Funds

**Ask:** `[DECIDE — recommended]` **Grant-only, €2.5M** (70% of a €3.57M
24-month innovation budget; 30% own contribution from operating revenue and
committed investor capital). Grant-only preserves the non-dilutive thesis
and is permitted under EIC Open. `[ALTERNATIVE: blended finance — adds
€1–10M equity; decide before submission, the form requires it.]`
`[VERIFY: EIC own-contribution eligibility rules from Guide v6.0 — state
whether the SAFE is closed or in progress; do not write "open SAFE round"
in the application.]`

**Why the market does not fund this (need for Union support):** VC returns
require proprietary capture; open standards, conformance suites, and
sovereignty-as-public-good create ecosystem-wide value that no single
investor can monetize. Banks do not lend against pre-standard IP. The
result is that the only privately funded answers to agent accountability
are US-custodial platform plays. This is precisely the non-bankable,
high-risk/high-impact deep-tech gap the EIC exists to close.

**Use of funds (24 months, WP structure for Step 2):**

- **WP1 — KYA-2 standard + conformance suite** (spec, test harness,
  reference vectors; CC-BY 4.0 + Apache-2.0).
- **WP2 — Agentic-commerce mandate layer** (mandate credential,
  selective-disclosure within-mandate proof, revocation propagation —
  the hard cryptographic core; highest technical risk).
- **WP3 — Certification-grade hardening** (security audit, quantum-safe
  transition path, notified-body engagement).
- **WP4 — Cross-border pilots** (2–3 regulated-industry pilots FI+SE via
  Lifetime AB; measurable: agent transactions under mandate with full
  Article-12 reconstruction).
- **WP5 — Standardization & ecosystem** (CEN/CENELEC + eIDAS alignment,
  developer relations, third-party conformance onboarding).

---

## PAGE 11 — Risk

- **Technical (high, funded):** the selective-disclosure mandate proof is
  unsolved engineering — named honestly as the core funded risk (WP2).
  Mitigation: production fallback (server-side mandate enforcement already
  works; ZK disclosure is the privacy upgrade), partner cryptography
  expertise, staged milestones.
- **Market timing (medium):** AI Act enforcement could slip. Mitigation:
  demand exists pre-enforcement (compliance functions buy ahead of
  deadlines — our €7k MRR is pre-enforcement revenue); the mandate primitive
  has commercial value (fraud/liability control) independent of regulation.
- **Standard adoption (medium):** a standard nobody adopts is a product.
  Mitigation: dual-track design — Themis is a viable proprietary product
  even if the standard stalls; open licensing + conformance-as-channel
  lowers adoption friction; regulatory pull from Article 12/14 gives
  notified bodies a reason to reference it.
- **Execution (low-medium):** small core team. Mitigation: contracted
  100+-engineer partner pool with live delivery track record, agent-fleet
  operational multiplier, grant-funded key hires.
- **Financial (low):** revenue-generating (€7k MRR, zero churn), no debt,
  SAFE round in progress; 30% co-funding covered.

---

## PAGE 12 — Milestones & The Ask

**24-month arc (grant period):**

- **M6:** KYA-2 **spec v1.0 published (CC-BY 4.0), including the tier-aware
  Sovereignty Profile**; conformance suite alpha; first mandate-bound agent
  action end-to-end in staging.
- **M12:** **Signed Sovereignty Attestation in production**; reference
  implementation GA (Apache-2.0); EUPL-1.2 core released (CLA in place;
  patents filed/scoped first); pilot 1 live (FI).
- **M18:** Selective-disclosure mandate proof in production; pilot 2 live
  (SE via Lifetime AB); ≥3 third-party vendors in conformance testing.
- **M24 (TRL 8):** certification path established with a notified body;
  10+ conformant implementations; KYA-2 submitted into formal
  standardization (CEN/CENELEC workshop agreement); commercial target
  €60k+ MRR baseline per investor roadmap.

**The ask:** €2.5M grant `[DECIDE: grant-only vs blended]` to build the
European trust standard for AI agents that transact — before the default is
set elsewhere. The technology runs today; the traction is real and paying;
the regulation that makes it mandatory has a date. What is missing is the
standard, the proof, and the certification path — exactly the TRL 6→8 work
the EIC Accelerator funds.

---

## Submission checklist (Step 1 package)

- [ ] This narrative trimmed into the online form fields (character limits
      from the actual platform — download template first, Next-Steps row 1).
- [ ] 10-slide pitch deck — build from `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md` + `V4.3-DWS-IQ6-InvestorPD_2026.md`; claims must match this narrative.
- [ ] 3-minute video — founder to camera + product capture (KYA trust score,
      Leash Snap, Article-12 log reconstruction make good screen material).
- [ ] `[DECIDE]` grant-only vs blended finance (form requires it).
- [ ] `[DECIDE]` applicant entity: Lifetime Oy (FI) with Lifetime AB as
      expansion narrative (recommended) vs group structure.
- [ ] `[VERIFY]` TAM/SAM/SOM figures (Step 2 blocker, not Step 1).
- [ ] `[VERIFY]` hiring-plan numbers for Page 8/9 claims.
- [ ] Final `/truth-check` pass on all public-facing claims before upload.

---

**End of draft.**
