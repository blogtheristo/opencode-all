# Locked Decisions Index — DWS IQ 6

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/audit-boardy-roles-neTFn | Date: 16.04.2026 | Changes: Initial creation — immutable audit index of all locked architectural, product, and compliance decisions. Categories: PRODUCT, FEATURE, LWM, ARCHITECTURE, DATA, SECURITY, EU-AI-ACT, NIS2, OBSERVABILITY. Use cases: customer feature audit, LWM change tracking, EU AI Act Article 12, NIS 2 incident log, observability governance, hack recovery.

Document Status:

- Created: 16.04.2026
- Last Modified: 16.04.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL — Governance
- Document Type: Decision Registry / Audit Index

***

## Purpose

This file is the **immutable audit index** of all locked decisions in DWS IQ 6. A "locked decision" is any architectural, product, compliance, or security choice that:

1. **Cannot be reversed without explicit human approval** (Risto or Marcus)
2. **Has regulatory or audit implications** (EU AI Act Article 12, NIS 2, GDPR)
3. **Affects customer-facing behavior** (product tiers, feature availability, LWM responses)
4. **Is a post-incident control** (security rules established after a breach or near-miss)

### Why This Exists

| Use Case                      | How This Index Helps                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| Customer wants feature update | Look up FEATURE-tagged decisions to see what is locked and when  |
| Customer LWM change request   | Look up LWM-tagged decisions; any change needs LD audit trail    |
| EU AI Act Article 12 audit    | All EU-AI-ACT decisions are timestamped for notified body review |
| NIS 2 incident response       | SECURITY + NIS2 decisions show what controls are mandatory       |
| Observability audit           | OBSERVABILITY decisions define what MUST be logged               |
| Black hat / hack recovery     | SECURITY decisions list all permanent bans and hardening rules   |

---

## Decision Index

| ID          | Date       | Time UTC | Topic                                                                                                                                                                             | Category     | Status                    | Owner | File                                                                             |
| ----------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------- | ----- | -------------------------------------------------------------------------------- |
| LD-2024-001 | 2024-03-16 | —        | Product tiers locked (3-tier pricing structure, V3 era)                                                                                                                           | PRODUCT      | LOCKED                    | Risto | _(predates field-notes archive)_                                                 |
| LD-2026-001 | 2026-01-08 | —        | ADR-2026-001: dws6.com as Admin Portal, /login for end users                                                                                                                      | ARCHITECTURE | LOCKED                    | Risto | `Admin/ADMIN_MANUAL_DWS6_COM.md`                                                 |
| LD-2026-002 | 2026-01-28 | —        | 100% EU data residency, zero US sub-processors, GDPR by design                                                                                                                    | ARCHITECTURE | LOCKED                    | Risto | `docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md`           |
| LD-2026-003 | 2026-02-21 | —        | CORS: no `allow_origins=["*"]`; Shell: no `exec()` with string interpolation; SRI hashes on all CDN deps                                                                          | SECURITY     | LOCKED                    | Risto | `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md` |
| LD-2026-004 | 2026-03-08 | —        | EU AI Act Article 12 — sovereignty audit logging layer as audit-proof backbone for high-risk AI logging                                                                           | EU-AI-ACT    | LOCKED                    | Risto | `docs/field-notes/2026-03-08-eu-ai-act-omnibus-optimus-v3-article-12.md`         |
| LD-2026-005 | 2026-03-10 | —        | Aiven Developer ($5/mo) + Startup ($75/mo) for V1 EU-sovereign PostgreSQL migration                                                                                               | DATA         | LOCKED                    | Risto | `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`                          |
| LD-2026-006 | 2026-03-13 | —        | Aiven-first mandate locked; TimescaleDB 2.25.x Hypercore approved standard; pg_duckdb BLOCKED                                                                                     | DATA         | LOCKED                    | Risto | `DWS_DATA_STANDARD.md`                                                           |
| LD-2026-007 | 2026-03-15 | —        | Investor seat tiers: Fleet Admiral €500K / Captain €150K / Industry Captain €50K×8 / Deputy unlimited                                                                             | PRODUCT      | SUPERSEDED by LD-2026-014 | Risto | `docs/field-notes/2026-03-15-investor-materials-audit.md`                        |
| LD-2026-008 | 2026-03-26 | —        | Resend SDK permanently banned (Clawdbot C2 incident); Amazon SES SMTP only; no RESEND_API_KEY ever                                                                                | SECURITY     | LOCKED                    | Risto | `CLAUDE.md`, `Admin/ADMIN_MANUAL.md`                                             |
| LD-2026-009 | 2026-03-26 | —        | CLI-first architecture post-Clawdbot; Cursor removed; Docker MCP retired                                                                                                          | SECURITY     | LOCKED                    | Risto | `docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`               |
| LD-2026-010 | 2026-03-26 | —        | Default sender: risto@onelifetime.world; NEVER noreply@; verified domain: onelifetime.world only                                                                                  | SECURITY     | LOCKED                    | Risto | `CLAUDE.md`                                                                      |
| LD-2026-011 | 2026-04-02 | —        | Shufti DPA: EU-only processing/storage; GCP locked to EEA; 30-day sub-processor notice                                                                                            | NIS2         | LOCKED                    | Risto | `docs/field-notes/2026-04-05-shufti-dpa-compliance-resolution.md`                |
| LD-2026-012 | 2026-04-13 | —        | Partners stub overwrite incident response: stub-protection hook, pre-commit guard on partner files                                                                                | SECURITY     | LOCKED                    | Risto | `docs/field-notes/2026-04-13-security-incident-partners-stub-overwrite.md`       |
| LD-2026-013 | 2026-04-16 | —        | CBAM all 6 Annex I sectors covered: Vulcan/Talos/Gaia/Ceres/Prometheus/Helios; 66 CN codes; 1 agent per sector                                                                    | FEATURE      | LOCKED                    | Risto | `docs/field-notes/2026-04-16-cbam-sector-coverage-complete.md`                   |
| LD-2026-014 | 2026-07-31 | —        | Investor seat tiers reconciled to the Boardy pack: Fleet Admiral €200K / Captain €50K×9 (or €150K triple bundle) / Deputy €5K. Supersedes LD-2026-007.                            | PRODUCT      | LOCKED                    | Risto | `docs/field-notes/2026-07-31-investor-captain-tier-pricing-reconciliation.md`    |
| LD-2026-015 | 2026-07-31 | —        | USA (Arizona, Texas) added as a third Sales Jurisdiction (Non-EU/Connect tier) — regulatory anchor, US entity, USD pricing, US contracting, and ITAR/EAR screening all still open | PRODUCT      | LOCKED                    | Risto | `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md`   |
| LD-2026-016 | 2026-08-24 | —        | Risk-tiered HIC PR review: HIC approval required for PRs touching ledger/RLS/KYA/autonomy/public-content/evidence-standard; weekly digest for other agent PRs; Code Evidence Layer headers mandatory on agent code | EU-AI-ACT    | LOCKED                    | Risto | `docs/field-notes/2026-08-24-opencode-all-living-engine.md`                      |

---

## Categories

| Code              | Meaning                                                        | Regulatory Driver                                  |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| **PRODUCT**       | Customer-facing product tier, feature, or pricing decisions    | Contract, investor commitments                     |
| **FEATURE**       | Feature lock or feature removal decisions affecting customers  | Customer SLA                                       |
| **LWM**           | Lifetime World Model behavioral or data changes                | EU AI Act Art 9 (risk mgmt), Art 13 (transparency) |
| **ARCHITECTURE**  | System architecture, cloud, sovereignty decisions              | GDPR, SCHREMS II                                   |
| **DATA**          | Database engine, storage, retention, extension decisions       | GDPR Art 32, DWS_DATA_STANDARD                     |
| **SECURITY**      | Post-incident controls, permanent bans, hardening rules        | NIS 2 Art 21, DWS_SECURITY_STANDARD                |
| **EU-AI-ACT**     | EU AI Act compliance decisions (Art 12, Art 9, Art 13, Art 72) | Regulation (EU) 2024/1689                          |
| **NIS2**          | NIS 2 Directive incident response and supply chain decisions   | Directive (EU) 2022/2555                           |
| **OBSERVABILITY** | What must be logged, how long, and by whom                     | EU AI Act Art 12, NIS 2 Art 23                     |

---

## Locked Decision Detail Records

Each locked decision has a detail record below for audit purposes.

---

### LD-2024-001 — Product Tiers (V3 Era)

| Field           | Value                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Date Locked** | 2024-03-16                                                                                   |
| **Category**    | PRODUCT                                                                                      |
| **Status**      | LOCKED — superseded in scope by LD-2026-007 (investor tiers), but core 3-tier model retained |
| **Owner**       | Risto Päärni                                                                                 |
| **File**        | _(predates field-notes archive; original V3 product specification)_                          |

**Decision:** DWS IQ 6 operates a 3-tier product structure. The tiers establish different capability, compliance depth, and support levels. This decision predates the current repository but remains the foundational product architecture.

**Why locked:** Customer contracts reference the tier structure. Changing tiers without audit trail breaks contractual commitments.

**Change process:** Requires Risto approval + customer notification + update to `products.json` + new LD entry.

---

### LD-2026-001 — Portal Architecture (ADR-2026-001)

| Field           | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| **Date Locked** | 2026-01-08                                                       |
| **Category**    | ARCHITECTURE                                                     |
| **Status**      | LOCKED — IMPLEMENTED                                             |
| **Owner**       | Risto Päärni                                                     |
| **File**        | `Admin/ADMIN_MANUAL_DWS6_COM.md` §"Portal Architecture Decision" |

**Decision:** dws6.com = Administration Portal (system admins, DevOps). dws6.com/login = User Login (end users, customers). These URLs serve distinct audiences and must not be conflated.

**Why locked:** Authentication architecture. Mixing admin and user entry points is a security risk.

**Change process:** Architecture review (Marcus) + security review + new ADR entry + new LD entry.

---

### LD-2026-002 — EU Data Residency Mandate

| Field           | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **Date Locked** | 2026-01-28                                                             |
| **Category**    | ARCHITECTURE                                                           |
| **Status**      | LOCKED                                                                 |
| **Owner**       | Risto Päärni                                                           |
| **File**        | `docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md` |

**Decision:** 100% EU data residency (Finland, Germany, Netherlands). Zero US sub-processors. GDPR by design. SCHREMS II compliant. No US hyperscaler dependency.

**Why locked:** EU AI Act compliance, CSRD customer contracts, government validation requirements.

**Change process:** Requires SCHREMS II analysis + DPA review + new LD entry. Risto + legal approval.

---

### LD-2026-003 — Security Coding Rules (Post-OpenClaw Assessment)

| Field           | Value                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Date Locked** | 2026-02-21                                                                                                   |
| **Category**    | SECURITY                                                                                                     |
| **Status**      | LOCKED                                                                                                       |
| **Owner**       | Risto Päärni                                                                                                 |
| **File**        | `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md`, `DWS_SECURITY_STANDARD.md` |

**Decision:** (1) Never `exec()` with string interpolation — always `execFile()` with argument arrays. (2) Never `allow_origins=["*"]` — explicit allowed origins only. (3) All CDN deps must have SRI `integrity` hash + `crossorigin="anonymous"`. These are permanent rules.

**Why locked:** Direct code-injection vulnerability vectors identified in security assessment.

**NIS 2 mapping:** Art 21(2)(a) — policies on information security; Art 21(2)(e) — supply chain security.

**Change process:** Any exception requires Marcus security review + NIS 2 risk acceptance log + new LD entry.

---

### LD-2026-004 — EU AI Act Article 12 Logging (Sovereignty Audit Layer)

| Field           | Value                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| **Date Locked** | 2026-03-08                                                               |
| **Category**    | EU-AI-ACT                                                                |
| **Status**      | LOCKED                                                                   |
| **Owner**       | Risto Päärni                                                             |
| **File**        | `docs/field-notes/2026-03-08-eu-ai-act-omnibus-optimus-v3-article-12.md` |

**Decision:** The sovereignty audit logging layer is the DWS implementation of EU AI Act Article 12 (automatic event recording for high-risk AI). Logging must cover: risk identification, substantial modifications, post-market monitoring, operation monitoring (Art 72, Art 26(5), Art 79(1)).

**Why locked:** Notified body CE mark requirement for high-risk AI. Non-compliance = regulatory block.

**Observability requirement:** All sovereignty audit logs retained for system lifetime + 10 years minimum per Art 12(1).

**Change process:** Any reduction in logging scope requires EU AI Act legal review + new LD entry.

---

### LD-2026-005 — Aiven V1 Database Plan

| Field           | Value                                                   |
| --------------- | ------------------------------------------------------- |
| **Date Locked** | 2026-03-10                                              |
| **Category**    | DATA                                                    |
| **Status**      | LOCKED                                                  |
| **Owner**       | Risto Päärni                                            |
| **File**        | `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md` |

**Decision:** Aiven Developer ($5/mo) for dev/staging. Aiven Startup ($75/mo, 99.99% SLA) for production. Aiven is Finnish, ISO 27001, no CLOUD Act exposure.

**Why locked:** EU sovereignty requirement for V1 migration. Total ~$80/mo for database layer.

**Change process:** Any database provider change requires CLOUD Act analysis + GDPR DPA update + new LD entry.

---

### LD-2026-006 — Data Standard: Aiven-First + TimescaleDB

| Field           | Value                       |
| --------------- | --------------------------- |
| **Date Locked** | 2026-03-13                  |
| **Category**    | DATA                        |
| **Status**      | LOCKED                      |
| **Owner**       | Risto Päärni                |
| **File**        | `DWS_DATA_STANDARD.md` v2.0 |

**Decision:** Aiven is the primary PostgreSQL provider (pre-approved). TimescaleDB 2.25.x Hypercore is the approved columnar standard. pg_duckdb and pg_mooncake are BLOCKED on Aiven. Two-tier HTAP: Aiven (primary) + GN100 edge.

**Why locked:** Extension whitelist ensures EU sovereignty + production stability.

**Change process:** New extensions require Aiven compatibility check + DWS_DATA_STANDARD update + Marcus review + new LD entry.

---

### LD-2026-007 — Investor Seat Tiers

| Field           | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| **Date Locked** | 2026-03-15                                                     |
| **Category**    | PRODUCT                                                        |
| **Status**      | LOCKED                                                         |
| **Owner**       | Risto Päärni                                                   |
| **File**        | `docs/field-notes/2026-03-15-investor-materials-audit.md` v1.1 |

**Decision:** Four investor/partner tiers: (1) Fleet Admiral €500K, (2) Captain €150K, (3) Industry Captain €50K × 8 slots, (4) Deputy — unlimited seats. Replaces conflicting 3-price structure (€150K / €500K / €2M).

**Why locked:** Investor term sheet commitments. Changing after SAFE is signed requires amendment.

**Change process:** Any tier change requires Risto approval + legal review of existing SAFEs + new LD entry.

---

### LD-2026-008 — Resend Permanent Ban (Clawdbot C2 Incident)

| Field           | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| **Date Locked** | 2026-03-26                                                   |
| **Category**    | SECURITY                                                     |
| **Status**      | LOCKED — PERMANENT                                           |
| **Owner**       | Risto Päärni                                                 |
| **File**        | `CLAUDE.md`, `Admin/ADMIN_MANUAL.md` (Clawdbot/Resend entry) |

**Decision:** Resend SDK and resend.com are permanently banned from all DWS systems. `RESEND_API_KEY` must never appear in any config. Amazon SES SMTP is the only approved email transport. Reason: Resend was used as a C2 exfiltration channel in the Clawdbot incident (suspected via Cursor MCP).

**Why locked:** Active security incident. Resend was a confirmed exfiltration vector.

**NIS 2 mapping:** Art 23 (incident reporting); Art 21(2)(b) — incident handling.

**Hack recovery note:** If Resend appears in any branch, treat as compromise indicator — rotate all credentials immediately.

**Change process:** PERMANENT BAN. Cannot be reversed.

---

### LD-2026-009 — CLI-First Architecture (Post-Clawdbot)

| Field           | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Date Locked** | 2026-03-26                                                         |
| **Category**    | SECURITY                                                           |
| **Status**      | LOCKED                                                             |
| **Owner**       | Risto Päärni                                                       |
| **File**        | `docs/field-notes/2026-03-26-post-incident-cli-first-migration.md` |

**Decision:** CLI-first architecture. Cursor IDE removed. Docker MCP retired. Claude Code CLI is primary development environment. No GUI tools that create hidden network connections.

**Why locked:** Clawdbot post-incident containment. GUI tool MCP connections were attack surface.

**Change process:** Any new IDE or MCP tool requires security review + new LD entry.

---

### LD-2026-010 — Email Sender Rules

| Field           | Value                           |
| --------------- | ------------------------------- |
| **Date Locked** | 2026-03-26                      |
| **Category**    | SECURITY                        |
| **Status**      | LOCKED                          |
| **Owner**       | Risto Päärni                    |
| **File**        | `CLAUDE.md` Email Rules section |

**Decision:** (1) Never `noreply@` — all emails from replyable address. (2) Default sender: `risto@onelifetime.world`. (3) Verified domain: `onelifetime.world` only — never `dws6.com` or other domains. (4) Every outbound email logged to `logs/email-audit.jsonl` with callerStack + PID.

**Why locked:** Post-Clawdbot email hardening. Audit trail required for NIS 2 compliance.

**NIS 2 mapping:** Art 23 — incident reporting via verified channels only.

**Observability requirement:** `logs/email-audit.jsonl` must be retained ≥90 days.

---

### LD-2026-011 — Shufti DPA EU-Only Processing

| Field           | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| **Date Locked** | 2026-04-02                                                        |
| **Category**    | NIS2                                                              |
| **Status**      | LOCKED                                                            |
| **Owner**       | Risto Päärni                                                      |
| **File**        | `docs/field-notes/2026-04-05-shufti-dpa-compliance-resolution.md` |

**Decision:** Shufti DPA locked with: EU-only processing/storage, GCP locked to EEA-only region, 30-day sub-processor notification period, explicit EU-only clause in DPA body, Programmers Force removed as sub-processor.

**Why locked:** GDPR Art 28 (processor contracts), NIS 2 Art 21(2)(d) — supply chain security.

**Change process:** Any Shufti sub-processor change requires 30-day notice + DPA addendum + new LD entry.

---

### LD-2026-012 — Partners Stub Protection (Post-Overwrite Incident)

| Field           | Value                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| **Date Locked** | 2026-04-13                                                                 |
| **Category**    | SECURITY                                                                   |
| **Status**      | LOCKED                                                                     |
| **Owner**       | Risto Päärni                                                               |
| **File**        | `docs/field-notes/2026-04-13-security-incident-partners-stub-overwrite.md` |

**Decision:** Partner file stub protection: pre-commit guard on partner files prevents accidental overwrite. Hook-based protection added to `.claude/hooks/`.

**Why locked:** Active incident where a partner profile was overwritten by an agent.

**NIS 2 mapping:** Art 21(2)(i) — human resources security and access control.

**Change process:** Hook updates require Marcus review + security audit + new LD entry.

---

### LD-2026-013 — CBAM All 6 Annex I Sectors Covered

| Field           | Value                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **Date Locked** | 2026-04-16                                                                                          |
| **Category**    | FEATURE                                                                                             |
| **Status**      | LOCKED (5/6 merged PR #996; Talos pending claude/cbam-alignment-pr-6as8L)                           |
| **Owner**       | Risto Päärni                                                                                        |
| **File**        | `src/synthetic-data/cbam-schema.ts`, `docs/field-notes/2026-04-16-cbam-sector-coverage-complete.md` |

**Decision:** DWS IQ 6 covers all 6 CBAM Annex I sectors (EU Regulation 2023/956) with one dedicated agent per sector. Architecture: one agent = one sector, each with dynamic CN code range checker.

| Sector       | Agent      | File                                               | CN Codes | Key Emission Factor                                 | Status         |
| ------------ | ---------- | -------------------------------------------------- | -------- | --------------------------------------------------- | -------------- |
| Steel & Iron | Vulcan     | `src/agents/workflow/industry/vulcan.agent.ts`     | 42       | Blast furnace ~2.0 tCO2e/t vs EAF ~0.5 tCO2e/t      | Merged PR #996 |
| Aluminium    | Talos      | `src/agents/workflow/industry/talos.agent.ts`      | 16       | Hall-Héroult ~15 MWh/t; indirect emissions included | Pending merge  |
| Cement       | Gaia       | `src/agents/workflow/industry/gaia.agent.ts`       | 3        | Clinker calcination ~0.62 tCO2e/t                   | Merged PR #996 |
| Fertilizers  | Ceres      | `src/agents/workflow/industry/ceres.agent.ts`      | 3        | Haber-Bosch ammonia ~1.6 tCO2e/t                    | Merged PR #996 |
| Hydrogen     | Prometheus | `src/agents/workflow/industry/prometheus.agent.ts` | 1        | Grey H2 ~9.2 tCO2e/t vs green ~0                    | Merged PR #996 |
| Electricity  | Helios     | `src/agents/workflow/industry/helios.agent.ts`     | 1        | Zero free allowances; RED III 42.5% by 2030         | Merged PR #996 |

**Total: 66 CN codes. Source of truth: `src/synthetic-data/cbam-schema.ts` (`CBAM_CN_CODES`).**

**Critical notes:**

- Aluminium is the **only sector** where indirect emissions (grid electricity) are included in CBAM
- Steel & Iron: zero free allowances from 2026
- Electricity: zero free allowances for energy producers

**Why locked:** Any change to sector coverage, CN code ranges, or emission factors must be traceable to EU 2023/956 Annex I. Customer CBAM declarations depend on this mapping — a silent change breaks compliance calculations.

**Change process:** CN code or emission factor changes require: (1) EUR-Lex regulation diff, (2) update `cbam-schema.ts`, (3) Marcus review, (4) new LD entry with regulation citation.

---

### LD-2026-014 — Investor Seat Tiers Reconciled (Supersedes LD-2026-007)

| Field           | Value                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| **Date Locked** | 2026-07-31                                                                    |
| **Category**    | PRODUCT                                                                       |
| **Status**      | LOCKED — supersedes LD-2026-007                                               |
| **Owner**       | Risto Päärni                                                                  |
| **File**        | `docs/field-notes/2026-07-31-investor-captain-tier-pricing-reconciliation.md` |

**Decision:** Three investor/partner tiers, replacing LD-2026-007's four-tier structure: (1) Fleet Admiral €200,000, 1 seat; (2) Captain €50,000, 9 seats — a €150,000 "triple" bundles 3 seats under one SAFE; (3) Deputy Captain €5,000, unlimited. The separate "Industry Captain" label is retired — it named the same €50K seat as "Captain," and the two had drifted into three conflicting documents (LD-2026-007's €150K Captain / €50K×8 Industry Captain; the live site's matching 4-line version; and the 2026-07-29 Boardy investor pack's 3-tier version actually used at the last real investor meeting). This entry adopts the Boardy pack as canonical because it is the most recent and the one actually presented to investors.

**Why locked:** Investor-facing pricing; a PR (#1122) proposing a different fix to the same conflict was open and needed a resolved source of truth before any document could be trusted.

**Change process:** Any tier change requires Risto approval + legal review of existing SAFEs + new LD entry, same as LD-2026-007.

**Known remaining drift (not fixed by this entry):** `docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md` uses yet another variant (Fleet Admiral €250K, Deputy €25K) — flagged, not reconciled here; scope was limited to the files PR #1122 and the investor-relations site touched.

---

### LD-2026-015 — USA Added as Sales Jurisdiction (Connect Tier)

| Field           | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| **Date Locked** | 2026-07-31                                                                     |
| **Category**    | PRODUCT                                                                        |
| **Status**      | LOCKED                                                                         |
| **Owner**       | Risto Päärni                                                                   |
| **File**        | `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md` |

**Decision:** USA (Arizona, Texas) is added to the Non-EU Tier (Connect) Sales/Regulatory Jurisdiction set in `DWS_DEPLOYMENT_STANDARD.md` §Sales/Regulatory Jurisdiction, alongside UAE and Singapore. Trigger: the Dayna Blackwell US Industrial Captain deal. Per Risto's explicit instruction ("add US as Sales Jurisdiction"), which is the RED-zone sign-off `DWS_DEPLOYMENT_STANDARD.md` itself requires for any Sales Jurisdiction scope change.

**Why locked:** Sales Jurisdiction scope is a deploy-gate prerequisite (Connect-tier deploys must declare their jurisdiction before `deploy.applied`); a silent or undocumented addition would leave deploys unable to validate against a declared scope.

**What this does NOT resolve — deliberately, per the linked plan:** the USA regulatory anchor (no direct federal analogue to CSRD/CBAM/ETS for AZ/TX industrial buyers — a real product-market-fit question, not just a documentation gap), US legal entity, USD price list, US contract/ToS/DPA, and ITAR/EAR screening. All five are open, tracked in `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md` §2 and §4, and in `DWS_DEPLOYMENT_STANDARD.md` §11.2. This entry locks the jurisdiction _declaration_ only — it is not a claim that DWS IQ is ready to sell or deliver in the US market.

**Change process:** Any further Sales Jurisdiction change (adding a state-level distinction, moving USA to a different tier, or reversing this addition) requires Risto approval + a new LD entry, same as LD-2026-007/014.

---

### LD-2026-016 — Risk-Tiered HIC PR Review + Code Evidence Layer (EU AI Act Art. 12–14)

| Field           | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| **Date Locked** | 2026-08-24                                                                     |
| **Category**    | EU-AI-ACT                                                                       |
| **Status**      | LOCKED                                                                          |
| **Owner**       | Risto Päärni                                                                    |
| **File**        | `docs/field-notes/2026-08-24-opencode-all-living-engine.md`                     |

**Decision:** HIC approved (2026-08-24) a risk-tiered pull-request review model for agent-authored code, implementing EU AI Act Article 14 human oversight at the merge gate:

1. **HIC approval required before merge** — PRs touching the carbon ledger, RLS/auth, KYA/autonomy gates, public-facing content, or the evidence standard itself.
2. **Weekly digest + veto window** — all other agent-authored PRs are reported to the HIC with per-file evidence provenance.
3. **Agent-only, sampled in audit** — mechanical fixes and generated state.

Companion control: the **Code Evidence Layer** (`CLAUDE.md` → Code Evidence Layer) mandates a provenance header (`Tool`, `Model`, `Agent`, ISO 8601 `Date`, audit-trail pointer) on every code file an agent creates or substantively modifies — accuracy/completeness/timeliness/traceability per ISO/IEC 25012, enforced by `scripts/evidence-audit.mjs`. This is the code-side counterpart of the Document Standard tool+model block and feeds the Article 12 hash-chain log via git history.

**Why locked:** Unreviewed auto-merge of all agent output would hollow out Article 14 oversight; the tiering keeps oversight effective where regulatory exposure exists without bottlenecking mechanical work. The evidence header makes the oversight scalable (Art. 13 transparency).

**Investor/sales material impact:** None to pricing, seat tiers (LD-2026-014), industry counts, or jurisdiction scope. Governance only: PRs modifying public pages, blog, or outreach collateral now explicitly require HIC sign-off in tier 1 (previously implied by Non-Negotiable Rule 13 for blogs; now generalized). No rewrite of existing sales/investor collateral is required.

**Change process:** Tier boundaries or the evidence-header schema may only change with Risto approval + a new LD entry.

---

## Adding New Locked Decisions

When a decision is locked, add it to the index table AND create a detail record:

```
### LD-YYYY-NNN — [Short Topic]

| Field | Value |
|-------|-------|
| **Date Locked** | YYYY-MM-DD |
| **Time UTC** | HH:MM UTC (if known) |
| **Category** | [PRODUCT/FEATURE/LWM/ARCHITECTURE/DATA/SECURITY/EU-AI-ACT/NIS2/OBSERVABILITY] |
| **Status** | LOCKED |
| **Owner** | [Name] |
| **File** | [file path] |

**Decision:** [What was decided]

**Why locked:** [Why this cannot be changed without approval]

**Change process:** [Who approves + what evidence is required]
```

**ID format:** `LD-YYYY-NNN` where NNN is zero-padded sequence per year.

**Timestamp requirement:** All new entries from 2026-04-16 onward MUST include Time UTC if the decision was made in a Claude Code session (check session logs).

---

## Observability Requirements Summary

Per LD-2026-004 (EU AI Act Article 12) and LD-2026-010 (Email audit):

| Log Target             | Retention                  | Where                       |
| ---------------------- | -------------------------- | --------------------------- |
| Sovereignty audit log  | System lifetime + 10 years | `sovereignty_audit/` tables |
| Email audit            | ≥90 days                   | `logs/email-audit.jsonl`    |
| Migration audit        | Indefinite                 | `supabase/migrations/`      |
| Pre-commit hook blocks | ≥30 days                   | `.claude/hooks/audit/`      |
| PR review decisions    | Indefinite                 | GitHub PR history           |
| Locked decisions       | Indefinite                 | `docs/LOCKED_DECISIONS.md`  |

---

## Hack Recovery Checklist

If a security incident occurs, check these locked decisions first:

1. **LD-2026-008** — Is Resend or resend.com present anywhere? → Immediate compromise indicator
2. **LD-2026-009** — Are unauthorized IDE/MCP tools installed? → Check `.mcp.json` and tool installs
3. **LD-2026-003** — Are CORS or exec() rules violated in recent commits? → Check git log
4. **LD-2026-010** — Are emails going through unverified domains? → Check `logs/email-audit.jsonl`
5. **LD-2026-002** — Is any data leaving EU jurisdiction? → Check Supabase region + sub-processor list

Post-incident: Add new LD entry documenting the incident response decision within 24 hours (NIS 2 Art 23 timeline).
