# EU Funding Brief — DIGITAL-2026-AI-DATA-10 (AI Continent / Compliance)

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| Version        | 1.2                                                            |
| Date           | 2026-07-15                                                     |
| Author         | Lifetime Oy                                                    |
| Owner          | risto-001                                                      |
| Status         | Active — proposal drafting                                     |
| Classification | Internal                                                       |
| Introduced-In  | PR-TBD                                                         |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                |
| Source         | EU Funding & Tenders Portal (topic page, retrieved 2026-04-22) |

**v1.1 (2026-07-15):** Refreshed Next-Steps dates against today; status
Draft→Active. Added context: this call is the **live pivot target** after
verifying NGI Sargasso is closed (project ended 2025-12-31; final call OC5 closed
2024-11-24). Added cross-refs to the new Part B skeleton and the equity-free
bridge shortlist. Companion docs:

- `docs/DIGITAL-2026-AI-DATA-10_PART-B_SKELETON.md` — proposal skeleton.
- `docs/EU_FUNDING_EQUITY_FREE_BRIDGE_2026.md` — NLnet / NGI0 bridge options.

**v1.2 (2026-07-15):** §7 Q4 closed — licence stack **locked** by founder
(CC-BY 4.0 spec / Apache-2.0 ref impl / EUPL-1.2 compliance core / proprietary
Themis; preconditions: CLA-to-Lifetime + patents-before-publication, pending
IPR counsel review). Grant-deliverable OSS ships under EUPL-1.2.

---

## 1. Call Identification

| Field             | Value                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| Programme         | Digital Europe Programme (DIGITAL)                                      |
| Call              | AI Continent                                                            |
| Call ID           | DIGITAL-2026-AI-DATA-10                                                 |
| Topic ID          | DIGITAL-2026-AI-DATA-10-COMPLIANCE                                      |
| Type of action    | DIGITAL-LS — DIGITAL Lump Sum Grants                                    |
| Type of MGA       | DIGITAL Lump Sum Grant [DIGITAL-AG-LS]                                  |
| Deadline model    | Single-stage                                                            |
| Opening date      | 21 April 2026                                                           |
| Deadline          | 01 October 2026, 17:00 Brussels time                                    |
| Expected projects | 3–4 funded                                                              |
| Policy anchor     | Specific Objective 2 (SO2) of DIGITAL — reinforce EU core AI capacities |
| Strategy anchor   | Apply AI Strategy (upcoming)                                            |

---

## 2. Objective (verbatim from topic page)

Deliver 3–4 projects that demonstrate **streamlining of regulatory reporting through automated and trusted sharing of compliance data**. Each project must address governance, technical, legal, and processing aspects.

Programme-level goal: reduce administrative burden on enterprises by applying advanced digital technologies to automate the reporting process — targeting regulatory reporting requirements from aggregate data (balance sheets) to detailed data (transactions, events, product registrations). Strong focus on **privacy-preserving technologies** to ensure trust between reporting entity and regulatory authority.

---

## 3. Scope Requirements — Mapped to DWS IQ 6

Commission requirement on the left; existing DWS IQ 6 capability on the right. `✓` = in production, `~` = partial / roadmap, `✗` = gap.

| #   | Commission Requirement                                                                                       | DWS IQ 6 Today                                                                                                                   | Fit |
| --- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1   | Privacy-preserving technologies, data capturing, automatic transmission, analysis, cloud storage, encryption | Aiwen sovereign cloud layer (Q2 2026), KYA hardware-attested agent isolation, EU-resident Supabase (Finland/Germany)             | ~   |
| 2   | Comprehensive APIs for real-time compliance and self-compliance checks                                       | `/mcp` JSON-RPC 2.0 endpoint, `dws` CLI with structured JSON output, 50 production agents (18 exposed via MCP `tools/list`)      | ✓   |
| 3   | Machine learning for automated monitoring and reporting                                                      | Claude / Gemini / Groq / Ollama routing; compliance agent scores CSRD, CBAM, ETS, EPBD deterministically                         | ✓   |
| 4   | Deterministic data collection using Common European Data Space catalogue entries                             | ESRS registry (82 disclosures mapped), emission-factors.ts (EU ETS Benchmark 2021-2025, CBAM defaults Reg. 2023/1773, IPCC 2006) | ✓   |
| 5   | Direct communication channels with regulatory authorities; machine-readable reporting requirements           | `regulatory-radar` skill scans EUR-Lex / DG ENER / EFRAG / CINEA; requirements modelled as executable rules                      | ~   |
| 6   | Robust access control and audit trails                                                                       | EU AI Act Article 12 logging (Aiwen), RLS on every Supabase table, `logs/email-audit.jsonl`, PR-traceable code versioning        | ✓   |
| 7   | European Digital Identity Wallet integration (when available)                                                | Planned — roadmap entry `DWS7_ROADMAP.md` §Phase 4.5 "eIDAS 2.0 & Trust Services" (call-conditional, triggered by EUDI LSP GA)   | ~   |
| 8   | Collaboration with data-space providers, emphasis on open source (e.g. Simpl)                                | Simpl alignment possible; repo is TypeScript + Python, large parts of platform are open architecture                             | ~   |
| 9   | Open source, interoperable with existing government data systems, European standards                         | Private repo today; open-source release of compliance core feasible as grant deliverable                                         | ~   |
| 10  | Scalable to large volumes and high transaction rates                                                         | Supabase + pgvector, Cloudflare Workers edge, DGX Spark on-prem inference, 37 CI/CD workflows                                    | ✓   |
| 11  | End-user-focused, accessible                                                                                 | Customer onboarding wizard (shipped March 2026), compliance scoring UI                                                           | ✓   |
| 12  | Comprehensive data governance (quality, stewardship, lifecycle)                                              | DWS_DATA_STANDARD.md covers storage governance, columnar/row policy, extension registry, retention, EU compliance                | ✓   |
| 13  | Quantifiable compliance metrics assessable by analytics                                                      | Deterministic scoring per regulation (ETS, CBAM, CSRD, EPBD, ESR, LULUCF, ReFuelEU, NIS2, CER, EU AI Act)                        | ✓   |
| 14  | No overlap with ongoing initiatives (Digital Product Passport, Customs reform)                               | Scope is **reporting automation**, not DPP or customs — no overlap                                                               | ✓   |

Sectors the call wants to explore: **agriculture, environment, manufacturing, healthcare, energy**. DWS IQ 6 already operates in **manufacturing, energy, environment, construction**, with agent coverage across 20 EU-regulated industries.

---

## 4. Strategic Fit Assessment

**Why this call is a priority for DWS IQ 6:**

- Exact thesis match: "automate regulatory reporting through trusted data sharing" is the DWS IQ 6 product definition.
- Sectoral match: call explicitly names environment, manufacturing, energy — three of DWS's four primary verticals.
- Lump sum MGA lowers audit overhead compared to actual-cost Horizon grants.
- Opening 21 Apr 2026 → deadline 01 Oct 2026 gives ~5 months to build a consortium and submit.
- Complements the **EIC Accelerator** track (Step 2 cut-offs verified 2026-07-15: **Sep 2 / Nov 4 2026** — the "Oct 2026 cut-off" in v1.0 was stale); the two applications can share technical annexes. See `docs/EU_FUNDING_EIC_ACCELERATOR_2026.md`.
- **Do not conflate the two tracks' terms:** DIGITAL = €2–5M lump sum at 75% for SMEs, consortium required; EIC = ≤€2.5M grant at 70% + optional equity, single applicant.

**Gaps to close before submission:**

1. **Consortium partners** — need ≥1 reporting entity (industrial), ≥1 regulatory authority or sandbox, ≥1 data-space provider (preferably Simpl-aligned).
2. **Open-source commitment** — define which compliance-core modules ship OSS as a grant deliverable (candidates: `emission-factors.ts`, `esrs-registry.ts`, MCP compliance server).
3. **Privacy-preserving tech evidence** — document KYA + Aiwen attestation and map to call requirement 1.
4. **eIDAS 2.0 wallet plan** — done: `DWS7_ROADMAP.md` §Phase 4.5 "eIDAS 2.0 & Trust Services" (PRs TBD, call-conditional on EUDI Wallet LSP GA in FI/DE).
5. **Sector pick** — choose 1–2 sectors to pilot (recommend: energy/ETS + manufacturing/CBAM — DWS has deepest data).

---

## 5. Next Steps

Dates refreshed 2026-07-15 against the **01 Oct 2026, 17:00 Brussels** deadline
(~11 weeks out). Items 1–3 from v1.0 lapsed unactioned; the partner search
(row 3) is now the binding critical path.

| #   | Action                                                                                                            | Owner      | Target date |
| --- | ----------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 1   | Confirm go/no-go **and lead-vs-partner** with CEO                                                                 | Risto      | 2026-07-20  |
| 2   | Download call document + Part B form + Lump Sum budget template from Submission System                            | Risto      | 2026-07-22  |
| 3   | **[critical path]** Secure ≥2 industrial reporting entities + 1 regulatory/sandbox + 1 data-space (Simpl) partner | Sales      | 2026-08-15  |
| 4   | Draft Part B §1–3 (Excellence, Impact, Implementation) from the skeleton                                          | Risto + AI | 2026-08-31  |
| 5   | Detailed budget table (DEP LSII template) — lump-sum work packages                                                | Risto      | 2026-09-07  |
| 6   | Internal review + external reader                                                                                 | External   | 2026-09-20  |
| 7   | Submit via Funding & Tenders Portal (buffer before 01 Oct 17:00 CEST)                                             | Risto      | 2026-09-26  |

---

## 6. Reference Documents

- Call page: Funding & Tenders Portal — topic `DIGITAL-2026-AI-DATA-10-COMPLIANCE`
- Application form: Standard application form (DEP), in Submission System
- Budget template: Detailed budget table (DEP LSII)
- Model Grant Agreement: Lump Sum MGA
- Regulation: Regulation (EU) 2021/694 of 29 April 2021 establishing the Digital Europe Programme (OJ L 166, 11.5.2021, p. 1); EU Financial Regulation 2024/2509
- Related internal docs:
  - `DWS7_ROADMAP.md` §EU Funding Programs
  - `docs/INVESTOR_ROADMAP_2026.md`
  - `docs/briefs/construction-compliance-brief.md`
  - `README.md` §Regulatory Layer coverage table
  - `src/compliance/emission-factors.ts`, `src/compliance/eu-benchmarks.ts`, `src/compliance/esrs-registry.ts`

---

## 7. Open Questions

1. Consortium size — is DWS lead applicant or partner? (Lead = more work, more credit; Partner = faster submission.)
2. Which sector pilot gives strongest narrative — energy/ETS (deepest DWS data) or environment/CSRD (broadest applicability)?
3. Does the Simpl programme alignment require code-level integration by submission, or is a letter of intent sufficient?
4. **DECIDED (founder, 2026-07-15)** — licence stack locked across all three
   funding tracks (canonical statement: `EU_FUNDING_EIC_ACCELERATOR_2026.md`
   §8 Q3): KYA v2 spec **CC-BY 4.0** · reference implementation + SDKs
   **Apache-2.0** · compliance core **EUPL-1.2** (SaaS copyleft moat +
   one-way GPLv3/AGPLv3 compatibility) · Themis **proprietary**.
   Non-negotiable preconditions before any code publication: CLA/copyright
   stays with Lifetime Oy (preserves dual-licensing); patent-track claims
   filed or scoped to Themis first (decided pending IPR counsel review).
   For this call: the grant-deliverable OSS release (`emission-factors.ts`,
   `esrs-registry.ts`, MCP compliance server) ships under **EUPL-1.2**.
5. Co-funding rate for DIGITAL-LS lump sum — to be confirmed from call document (typically 50%, can be 100% for coordination actions).

---

**End of brief.**
