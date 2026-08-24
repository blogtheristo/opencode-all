# DIGITAL-2026-AI-DATA-10-COMPLIANCE — Part B Proposal Skeleton

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| Version        | 0.1 (skeleton)                                                 |
| Date           | 2026-07-15                                                     |
| Author         | Lifetime Oy                                                    |
| Owner          | risto-001                                                      |
| Status         | Skeleton — headers + prompts, unfilled                         |
| Classification | Internal                                                       |
| Introduced-In  | PR-TBD                                                         |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                |
| Target         | Submit before 01 Oct 2026, 17:00 Brussels                      |
| Companion      | `docs/EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` (call brief v1.1) |

---

## How to use this file

This is the **structure**, not the submission. It mirrors the Digital Europe
standard application form **Part B** and its three award criteria — **Relevance**,
**Implementation**, **Impact** — each scored 0–5, threshold typically 3/5 and
overall ≥ the call minimum. Under each heading:

- **Prompt** = what the evaluator must be able to answer after reading.
- **Evidence hooks** = concrete DWS IQ 6 assets to cite (from the call brief's
  14-point scope-fit table). `✓` = in production, `~` = partial/roadmap.
- `[FILL]` = to be written once go/no-go and consortium (brief §5 rows 1–3) land.

Page budget: DIGITAL Part B is typically capped (~ tens of pages incl. tables) —
confirm the exact limit from the downloaded template (brief §5 row 2) before
drafting prose. Do **not** exceed it; over-length pages are not evaluated.

---

## 0. Cover / abstract

- **[FILL]** Project acronym + title.
- **[FILL]** 1-paragraph abstract: "DWS IQ 6 automates regulatory reporting via
  trusted, privacy-preserving compliance-data sharing across [sector pilot]."
- **[FILL]** Consortium one-liner (lead + partners) — blocked on brief §5 row 3.

---

## 1. Relevance

### 1.1 Background & general objectives

- **Prompt:** Why does automated, trusted compliance-data sharing matter now, and
  how does the proposal serve DIGITAL SO2 (reinforce EU core AI capacities)?
- **Evidence hooks:** thesis match — "automate regulatory reporting through
  trusted data sharing" _is_ the DWS IQ 6 product definition; deterministic
  scoring across ETS, CBAM, CSRD, EPBD, ESR, LULUCF, ReFuelEU, NIS2, CER, EU AI
  Act (✓).
- `[FILL]`

### 1.2 Scope — alignment with the call topic

- **Prompt:** Map each Commission requirement to the delivered capability. Reuse
  the 14-row table in the call brief §3; convert `~` rows into concrete WPs.
- **Evidence hooks:** privacy-preserving (KYA hardware-attested isolation, Aiwen
  Article-12 logging ~); comprehensive APIs (`/mcp` JSON-RPC 2.0, `dws` CLI ✓);
  European data-space catalogue entries (ESRS registry — 82 disclosures,
  `emission-factors.ts` ✓); no overlap with DPP/customs (✓).
- `[FILL]`

### 1.3 EU added value & sectoral focus

- **Prompt:** Why EU-level (not national)? Which 1–2 sectors pilot?
- **Decision needed:** sector pick — **energy/ETS** (deepest DWS data) vs
  **environment/CSRD** (broadest). Recommend energy/ETS + manufacturing/CBAM
  (brief §4 gap 5).
- **Evidence hooks:** EU-resident Supabase (FI/DE), zero CLOUD Act exposure,
  sovereign-by-construction — the EU added-value spine.
- `[FILL]`

### 1.4 Needs analysis & target groups

- **Prompt:** Which reporting entities and authorities feel the pain; how the
  pilot removes administrative burden.
- **Evidence hooks:** `regulatory-radar` (EUR-Lex / DG ENER / EFRAG / CINEA scans
  ~); onboarding wizard shipped Mar 2026 (✓).
- `[FILL]`

---

## 2. Implementation

### 2.1 Work plan & work packages

- **Prompt:** WP breakdown, deliverables, milestones, PERT/Gantt. Lump-sum MGA →
  each WP is a fixed-price lump with clear completion criteria.
- **Draft WP spine (`[FILL]` details):**
  - WP1 Management & coordination.
  - WP2 Privacy-preserving data capture + trusted sharing (closes brief gap 3).
  - WP3 Compliance-core engine + deterministic scoring (✓ — hardening + APIs).
  - WP4 Data-space interoperability (Simpl alignment ~; closes brief gap re: row 8).
  - WP5 Sector pilot(s) + regulatory-authority channel (~; closes gap re: row 5).
  - WP6 Open-source release of the compliance core (closes gap 2).
  - WP7 Dissemination, exploitation, sustainability.
- `[FILL]`

### 2.2 Consortium

- **Prompt:** Who does what; why this set is necessary and sufficient.
- **Blocked (brief §5 row 3, critical path):** need ≥1 industrial reporting
  entity, ≥1 regulatory authority or sandbox, ≥1 data-space provider
  (Simpl-aligned). **Decision:** DWS **lead vs partner** (brief §7 Q1).
- `[FILL]`

### 2.3 Resources & budget (lump sum)

- **Prompt:** Person-months + costs per WP, justified against the lump-sum
  template (DEP LSII).
- **Open (brief §7 Q5):** confirm co-funding rate for DIGITAL-LS (typically 50%,
  can be 100% for coordination) from the call document.
- `[FILL — use downloaded DEP LSII table, brief §5 row 5]`

---

## 3. Impact

### 3.1 Outcomes & wider impact

- **Prompt:** Quantified reduction in reporting burden; who benefits and how it
  scales beyond the pilot.
- **Evidence hooks:** deterministic, quantifiable compliance metrics assessable
  by analytics (✓); scalable (Supabase + pgvector, Cloudflare Workers edge, DGX
  Spark on-prem, 37 CI/CD workflows ✓).
- `[FILL]`

### 3.2 Dissemination, exploitation & communication

- **Prompt:** Open-source strategy + commercial exploitation path (they can
  coexist: OSS core, enterprise layer above).
- **Decision (brief §7 Q4):** licence stack **locked** (KYA v2 spec CC-BY 4.0 · ref impl + SDKs Apache-2.0 · compliance core EUPL-1.2 · Themis proprietary).
- **Evidence hooks:** onelifetime.world / dws10.com channels; LSJ monthly;
  existing blog cadence.
- `[FILL]`

### 3.3 Sustainability & EU strategic autonomy

- **Prompt:** Life after the grant; contribution to EU digital sovereignty.
- **Evidence hooks:** sovereign cloud layer, EU-resident data, KYA/Zero-Trust —
  the sustainability + autonomy narrative.
- `[FILL]`

---

## 4. Cross-cutting / mandatory annexes (checklist)

- [ ] Ethics & security self-assessment (dual-use, personal data → GDPR).
- [ ] Do-no-significant-harm / green + digital alignment.
- [ ] Gender/inclusion where applicable to the form.
- [ ] Financial capacity + participant registration (PIC) for each partner.
- [ ] Letters of intent / support from consortium partners.

---

## 5. Blockers before prose can start (from call brief §5 / §7)

1. **Go/no-go + lead-vs-partner** (Risto, target 2026-07-20).
2. **Consortium secured** — the binding critical path (target 2026-08-15).
3. **Sector pilot chosen** (energy/ETS + manufacturing/CBAM recommended).
4. **OSS licence decided** (EUPL vs Apache-2.0).
5. **Co-funding rate confirmed** from the downloaded call document.

---

**End of skeleton.**
