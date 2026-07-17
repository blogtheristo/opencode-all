# Excellence — IP Strategy (KYA-2 / DWS IQ)

> EIC Accelerator Step 1 companion — the "IP strategy" element of the Excellence criterion, with a realistic execution roadmap from 2026 onward. Feeds Step 1 field **F6b** and the Step 2 FTO annex.

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| Version        | 1.0                                                                      |
| Date           | 2026-07-17                                                               |
| Author         | Lifetime Oy                                                              |
| Owner          | risto-001                                                                |
| Status         | Active — Step 1 preparation (Aug 4 batch)                                |
| Classification | Internal                                                                 |
| Branch         | claude/dl-18-7-delivery-7m1hnj                                           |
| Companion      | `EIC_STEP1_FILL_PACKET.md` (F6b), `EU_FUNDING_EIC_ACCELERATOR_2026.md`   |
| Legal entity   | Lifetime Oy · Business ID 0772407-9 · Espoo, Finland                     |

***

## 1. Principle — layered IP, moat where it counts

KYA-2 is deliberately **open at the edges, proprietary at the core**. Openness buys adoption and standard-setting position; the proprietary core and the patent/trade-secret layer keep the defensible value with Lifetime Oy. Nothing is published before the covering IP is secured.

| Layer                          | Instrument            | Why this instrument                                                                 |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------------------- |
| KYA-2 **specification**        | **CC-BY 4.0**         | A standard anyone can implement → adoption + category ownership.                    |
| **Reference impl + SDKs**      | **Apache-2.0**        | Frictionless adoption surface; carries an explicit patent grant.                   |
| **Compliance core**            | **EUPL-1.2**          | "Communication to the public" copyleft blocks hyperscaler strip-mining; one-way GPL/AGPL compatibility lets code flow upstream (GNU Taler). |
| **Themis (enterprise impl)**   | **Proprietary**       | The commercial product; where trade secrets + patents live.                        |
| Trust-scoring model, evidence-chain architecture | **Patents + trade secret** | The genuinely novel, defensible invention layer.                     |

**Non-negotiable rule (founder-decided):** (a) copyright on the EUPL core stays with **Lifetime Oy under a CLA** — preserves the dual-licensing revenue door; (b) **patents filed or scoped to the proprietary layer BEFORE any covering code is published** — both EUPL and Apache carry patent grants, so publishing first would donate the invention.

***

## 2. What is protected by what

- **Patentable (file first):** the **signed Sovereignty Attestation** — a machine-verifiable claim of {deployment tier, jurisdiction, data-residency, model-weight ownership, air-gap status} bound into every mandate/evidence entry. **This is the primary patent claim and the differentiator no other agent-governance framework has** — file it before the KYA-2 spec publishes. Then the continuously-updated **session trust-scoring model** and the **append-only privacy-preserving evidence-chain** ("within-mandate" selective-disclosure proof). These are the technical inventions a competitor cannot design around trivially.
- **Trade secret (never published):** scoring weights/features, training/tuning data, threshold-calibration heuristics — kept inside Themis, protected by the FI Trade Secrets Act (595/2018, implementing EU 2016/943) and access controls.
- **Copyright + CLA:** all first-party code; contributor licensing so Lifetime Oy can dual-license the EUPL core.
- **Trademarks:** word marks **KYA**, **Themis**, **DWS IQ** (EUIPO, class 9/42) to protect the standard's and product's names.
- **Open standard (CC-BY):** the spec itself — the asset here is category authorship and the conformance-testing choke point, not exclusion.
- **Design freedom (FTO):** identity/mandate primitives build on open standards (eIDAS 2.0, W3C VC/DID) + own production code — no third-party IP dependency blocks exploitation (formal FTO analysis is a Step 2 deliverable).

***

## 3. Roadmap — realistic, 2026 onward

Dates are anchored to what is actually controllable now. The hard constraint that orders everything: **priority patent filing must precede first code publication** (EIC M6 spec is CC-BY-only and carries no implementation; the Apache/EUPL code lands at M12, comfortably after filing).

### Phase 0 — Foundation (Jul–Sep 2026)

| When        | Action                                                                                      | Owner            | Cost / funding                              | Depends on                     |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------- | ------------------------------ |
| **Jul 22**  | **Apply EUIPO SME Fund 2026 Voucher 3 (Patents)** — up to €3,500 reimbursement (50–75%)     | Risto            | Grant decision **must precede** any cost    | First-come; Vouchers 1–2 gone  |
| **Jul 31**  | Shortlist + book intro with IPR counsel (Berggren / Kolster / Papula-Nevinpat / Boco IP; LUT innovation services as academic route) | Risto | Intro calls free                            | —                              |
| Aug         | Draft **invention disclosures** (trust-scoring, evidence-chain); start **trade-secret register** + access-control policy | Risto + counsel | within Voucher 3 scope                      | Voucher 3 decision             |
| Aug–Sep     | Put **CLA** in place (individual + entity) before any external contribution to the EUPL core | Risto            | template + review                           | —                              |
| **Aug 4**   | EIC Step 1 submitted (IP strategy = this doc, condensed into F6b)                            | Risto            | —                                           | fill packet ready              |

> **Sequencing rule:** sign the counsel **engagement only after the Voucher 3 grant decision**, so attorney drafting fees are reimbursable. Intro calls before are fine.

### Phase 1 — Priority filings (Q4 2026)

| When        | Action                                                                                      | Owner            | Notes                                        |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------- |
| Oct–Nov     | File **priority patent application(s)** — **Sovereignty Attestation (lead claim)** + trust-scoring model + evidence-chain — as **FI national or direct EP** to set the priority date, **before the KYA-2 spec publishes** | Counsel + Risto  | Opens the 12-month PCT/national window       |
| Oct–Nov     | File **EUIPO trademarks** (KYA, Themis; DWS IQ if not already) — word marks, classes 9 & 42 | Counsel          | Voucher 1 rate historically covered TM; here TM is own-cost if Voucher 3 is patents-only |
| ~Nov 4      | (If GO on Step 1) begin **Step 2 full proposal** — FTO analysis + IP annex are mandatory there | Risto + AI       | reuse this doc                               |
| Q4          | Formalise **defensive-publication** list for anything non-core we want to keep free-to-use  | Risto            | prevents others patenting around us          |

### Phase 2 — Standard + publication-prep (H1 2027)

| When        | Action                                                                                      | Notes                                                              |
| ----------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| H1 2027     | **KYA-2 spec v1.0 under CC-BY 4.0** (aligns EIC M6) — spec only, no implementation code      | Safe to publish: no patent-covered code ships here                |
| H1 2027     | **Formal FTO analysis** (eIDAS 2.0, W3C VC/DID, x402/AP2 landscape, card-rail patents)       | Required for EIC Step 2; de-risks the Apache/EUPL release         |
| within 12 mo of priority | **PCT filing** (or direct national phase) to preserve international scope        | Hard deadline = priority date + 12 months                         |

### Phase 3 — Controlled code release (H2 2027 → 2028)

| When        | Action                                                                                      | Gate                                                              |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| H2 2027 (EIC M12) | **Reference implementation GA under Apache-2.0** + **EUPL-1.2 compliance core** released | **Only after** priority patents on file + CLA in place           |
| 2028        | PCT **national/regional phase** entries (EP validation + priority non-EU markets)           | budget-gated; grant + revenue                                    |
| 2028        | First **dual-licence sales** of the EUPL core to copyleft-averse enterprises                | revenue proof of the layered model                               |

### Phase 4 — Standardization + enforcement posture (2028–2029)

| When        | Action                                                                                      | Notes                                                              |
| ----------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| EIC M24 (2029) | **CEN/CENELEC Workshop Agreement** for KYA-2; align to eIDAS 2.0 / AI Act Article 12       | Category authorship → reference in notified-body certification    |
| 2028–2029   | Declare **SEP / FRAND** posture for any patent that becomes standard-essential              | Keeps the open-standard credible while retaining licensing value  |
| 2028–2029   | **Post-quantum transition** of the evidence-chain signatures → new continuation filings      | Quantum-safe claims extend the patent family's life               |
| ongoing     | **Trade-secret hygiene** audits; conformance-mark/certification trademark for "KYA-2 conformant" | Certification mark = the recurring conformance-revenue choke point |

***

## 4. Costs & funding lines (indicative)

| Item                                   | Indicative cost        | Funding line                                    |
| -------------------------------------- | ---------------------- | ----------------------------------------------- |
| Patent drafting + priority filing (1–2 families) | €8k–€20k               | **EUIPO SME Fund Voucher 3** (up to €3,500 back) + own funds; **EIC WP3** post-grant |
| PCT + national phases                  | €30k–€60k over 2–3 yrs | EIC grant (WP3 hardening) + revenue             |
| Trademarks (EUIPO, 2–3 marks)          | €2k–€4k                | own funds / SME Fund voucher where eligible     |
| FTO analysis                           | €5k–€12k               | EIC Step 2 prep; grant-eligible                 |
| CLA + trade-secret policy              | low (template + review) | own funds                                       |

***

## 5. Risks & mitigations (IP-specific)

- **Publish-before-file slip** (donates the invention) → **hard gate in the roadmap**: no Apache/EUPL code release until priority filings are on file; M6 is spec-only.
- **Voucher 3 exhausted / denied** (first-come) → apply **Jul 22**; if missed, self-fund priority filing and claim later lines via EIC WP3.
- **FTO surprise** (card-rail / crypto-payment patents) → run FTO **before** the Apache release, not after; design-around budget in WP2.
- **Standard-essential exposure** → declare FRAND early; keep the defensible value in Themis trade secrets, not in the standard.
- **Contributor IP leakage** → CLA mandatory before the first external commit to the EUPL core.

***

## 6. One-paragraph version (for F6b / pitch)

> IP is dual-track by design: KYA-2 spec under CC-BY 4.0, reference implementation + SDKs under Apache-2.0, compliance core under EUPL-1.2 (copyleft moat, one-way GPL/AGPL compatibility into GNU Taler), and a proprietary enterprise implementation (Themis). Copyright on the EUPL core is held by Lifetime Oy under a CLA, preserving dual-licensing. The genuinely novel layer — the trust-scoring model and the evidence-chain / within-mandate selective-disclosure proof — is patent-tracked and filed or scoped to the proprietary layer **before** any covering code is published. Filing is funded via the EUIPO SME Fund Voucher 3 and sequenced with IPR counsel; a formal freedom-to-operate analysis (eIDAS 2.0, W3C VC/DID, agent-payment landscape) precedes the open release. No third-party IP blocks commercial exploitation.

***

**End of IP strategy.**
