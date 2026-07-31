---
Document: SESSION HANDOFF — DWS Hub Audit + Time Ledger + ROI System
Supersedes: v2 (claude.ai chat export, 2026-04-18)
Code-Version: v3.0
Branch: claude/relaxed-jones-a7e9dc
Commit: pending
Date: 2026-04-18
Owner: Risto Anton Päärni (CEO, Lifetime Oy)
Classification: Internal — DWS Methodology
Introduced-In: PR-pending
---

# SESSION HANDOFF — DWS Hub Audit + Time Ledger + ROI System (v3)

## VERSION AND AGENT HISTORY

| Version | Date       | Agent       | Change                                                                                                                                                                                 |
| ------- | ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1      | 2026-04-17 | Claude.ai   | Initial chat plan — 7-gap EV ranking for dws-hub remediation                                                                                                                           |
| v2      | 2026-04-18 | Claude.ai   | Added Sprint 0A ledger bootstrap + session observability protocol                                                                                                                      |
| v3      | 2026-04-18 | Claude Code | Audit of v2; added customer/product/phase dimensions, ROI formula, HIL role rate card, Sprint 0C dashboard, CSV→Supabase migration path, grant export schemas, `/timelog` skill hook |

## Executive summary

v2 bootstraps a CSV time ledger and a read-only hub audit. It is correct as a
sprint kickoff but thin as a foundation for Lifetime Oy's three-year roadmap:
100 enterprise customers, 32 products in the DWS IQ catalog, consulting hours,
and new HIL hires. v3 extends v2 into a durable finance and operations system
with these concrete additions:

1. Customer and product dimensions in the ledger, joinable to
   `dws10.com/config/products.json` (32 SKUs).
2. Formal ROI definition per sprint and per customer: payback months,
   NPV(12 mo) at 10% WACC, gross margin after HIL.
3. HIL role rate card with five roles sourced to Finnish benchmarks.
4. CSV → Supabase `project_time` table migration trigger at 5,000 rows or
   90 days, whichever first.
5. Dashboard stub at `dws6.com/admin/finance/` (read-only Supabase views).
6. Pre-built grant export schemas for EIB SESI, Horizon Europe, ISO 27001.
7. `/timelog` skill registration so every DWS agent can write its own rows.
8. Concurrency protection (single-writer lockfile + session_id uniqueness).
9. Crash recovery (startup scan for unterminated sessions).
10. Fallbacks for state-header fields Claude Code does not expose.

No code runs until the founder approves each sprint's exit gate.
Claude Code's $250 Pro tier is spent under per-sprint budget caps measured
against ROI, not hypotheses.

## Table of contents

1. [Audit of v2 — 15 findings](#1-audit-of-v2--15-findings)
2. [Role, environment, budget caps](#2-role-environment-budget-caps)
3. [Painful truths (revised)](#3-painful-truths-revised)
4. [Session observability protocol (with fallbacks)](#4-session-observability-protocol-with-fallbacks)
5. [Sprint 0A — Ledger bootstrap (revised)](#5-sprint-0a--ledger-bootstrap-revised)
6. [Sprint 0B — Code-verified hub audit](#6-sprint-0b--code-verified-hub-audit)
7. [Sprint 0C — Dashboard stub + catalog join (new)](#7-sprint-0c--dashboard-stub--catalog-join-new)
8. [Sprint 1 — Hub remediation (re-priced gates)](#8-sprint-1--hub-remediation-re-priced-gates)
9. [Appendix A — ROI formula](#appendix-a--roi-formula)
10. [Appendix B — HIL role rate card](#appendix-b--hil-role-rate-card)
11. [Appendix C — Grant export schemas](#appendix-c--grant-export-schemas)
12. [Appendix D — CSV → Supabase migration path](#appendix-d--csv--supabase-migration-path)
13. [Appendix E — `/timelog` skill spec](#appendix-e--timelog-skill-spec)

---

## 1. Audit of v2 — 15 findings

| #   | Finding                                                                                       | Severity | Impact                                                              |
| --- | --------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| 1   | No customer or product dimension in timelog.csv                                               | HIGH     | Blocks 100-enterprise billing; can't bill per SKU                   |
| 2   | "EV ratio" used without formal ROI definition                                                 | HIGH     | Grant reviewers (EIB SESI) will reject; no NPV/payback              |
| 3   | Single `review_hil` role at €120/h — too coarse                                               | MEDIUM   | Legal, safety, compliance, eng, arch all priced the same            |
| 4   | CSV has no migration trigger to Supabase                                                      | MEDIUM   | Will corrupt at ~10k rows; no query layer for dashboard             |
| 5   | No dashboard design — user explicitly asked for one                                           | HIGH     | Dark data; no real-time HIL cost visibility                         |
| 6   | Concurrent writes to CSV are not atomic                                                       | HIGH     | Two parallel Claude sessions will corrupt rows                      |
| 7   | State header requires `session_id` and `tokens_in/out` that Claude Code doesn't expose inline | MEDIUM   | Header partially unfillable; need fallback + sidecar                |
| 8   | Claude Code tokens self-reported, not reconciled from session export                          | MEDIUM   | Numbers will drift from Anthropic billing                           |
| 9   | "No code changes" in Sprint 0B self-conflicts with creating files in 0A                       | LOW      | Inconsistent framing; fixed by re-scoping 0A as GREEN-zone code     |
| 10  | rates.yaml values are unsourced                                                               | MEDIUM   | €95/h floor needs benchmark anchor (see Appendix B)                 |
| 11  | Grant export formats not specified                                                            | MEDIUM   | Three distinct schemas needed (EIB SESI / Horizon Europe / ISO)     |
| 12  | Monthly close is manual — violates CLAUDE.md Script Automation Rule                           | HIGH     | Will be forgotten; needs Windows Task Scheduler entry               |
| 13  | No crash recovery — unterminated sessions go unnoticed                                        | MEDIUM   | Ledger drifts from reality across crashes                           |
| 14  | No skill registration — violates "Build for Agents" rule                                      | MEDIUM   | Other DWS agents can't invoke ledger via CLI/MCP                    |
| 15  | Remediation table re-priced but not risk-ranked by customer/grant deal blockage               | MEDIUM   | Unclear which gaps block which revenue                              |

---

## 2. Role, environment, budget caps

**Role.** Chief Architect and Senior Engineer for Lifetime Oy's DWS IQ 6
platform. Build safely. Research-backed. Every recommendation carries
runway and ROI calculus.

**Environment.**
- OS: Windows 11 Pro. PowerShell-compatible commands only.
- Repo: `F:\2026\Repos2026\dws6` (private). Running inside worktree
  `.claude\worktrees\relaxed-jones-a7e9dc`.
- Founder: solo technical. Mobile-aware; defer heavy ops to desktop.
- Document standard: DWS format — metadata block, executive summary,
  linked TOC, revision history, "© 2026 Lifetime Oy" footer.
- Permission zones (from SessionStart hook): GREEN (Read/Edit/Write, git on
  feature branches) — ledger writes live here.

**Budget caps per sprint.**

| Sprint | Scope                     | Cap (USD, Claude Code API) | Cap (founder HIL min) |
| ------ | ------------------------- | -------------------------- | --------------------- |
| 0A     | Ledger bootstrap          | 10                         | 60                    |
| 0B     | Hub audit (read-only)     | 40                         | 180                   |
| 0C     | Dashboard + catalog join  | 50                         | 240                   |
| 1.1    | LiteLLM gateway + budget  | 60                         | 240                   |
| 1.2    | Agent registry + HITL     | 50                         | 240                   |
| 1.3    | Langfuse + OTel SDK       | 30                         | 120                   |

Total $250 Pro tier covers through Sprint 1.3. If any sprint exceeds its cap
by >20%, STOP and reconcile before continuing. Log the overage row in
`timelog.csv` with `activity="budget_overage"`.

---

## 3. Painful truths (revised)

1. Chat-derived cost estimates (€95/h × N) are unaudited fiction until the
   ledger backs them. Every euro number is a hypothesis to validate.
2. Human-in-the-loop time is the most expensive and least-tracked ingredient
   in this project. Log it per HIL checkpoint, not per day.
3. There is currently no CSV project-time ledger. EIB SESI, Horizon Europe,
   and ISO 27001 will all require one.
4. Claude Code tracks tokens, not wall-clock HIL minutes. The ledger is the
   repo's responsibility, not the tool's.
5. **(NEW)** 100 enterprise customers × 32 products = a billing system, not
   a dev log. The ledger is the foundation — invoicing, SLA credits, and
   grant time-allocation all derive from these rows.
6. **(NEW)** The founder's time has two rates: opportunity cost (building)
   and market rate (consulting). Mixing them will produce nonsense ROI.
   Keep both in `rates.yaml` and pick per row.

---

## 4. Session observability protocol (with fallbacks)

Every response begins with a one-line state header:

```
[surface: Claude Code · cwd: <path> · branch: <name> ·
 this turn writes: <paths or "nothing"> · session_id: <id|"unknown"> ·
 elapsed_min: <n|"unknown"> · tokens_in/out: <a>/<b>|"unknown"/"unknown"]
```

**Fallback rules** for fields Claude Code does not expose inline:

| Field         | If unavailable, use                                                   |
| ------------- | --------------------------------------------------------------------- |
| `session_id`  | SHA-256(first 200 chars of session) truncated to 12 chars; log as "unknown" on first turn and backfill in reconciliation row |
| `elapsed_min` | Track via first tool call timestamp written to `ops/timelog/sessions/<date>_<session_id>.md` sidecar; `"unknown"` allowed on turn 1 only |
| `tokens_in/out` | Mark `"unknown"` inline. Reconcile from Claude Code session export JSON (`~/.claude/logs/`) at session end and write one reconciliation row with actual counts |

The ledger itself is the authority. The header is a courtesy.

---

## 5. Sprint 0A — Ledger bootstrap (revised)

**Objective.** Stand up a repo-local CSV ledger plus its support files.
Every subsequent session writes to it. GREEN-zone code change.

**Files to create.**

```
ops\timelog\README.md
ops\timelog\rates.yaml
ops\timelog\timelog.csv                 (header row + 2 bootstrap rows)
ops\timelog\customers.csv               (id, name, tier, country, notes)
ops\timelog\products.csv                (generated from dws10.com/config/products.json)
ops\timelog\sessions\.gitkeep
ops\timelog\reports\.gitkeep
ops\timelog\exports\.gitkeep
ops\timelog\.lock                       (empty; single-writer guard)
ops\timelog\Write-TimelogRow.ps1        (append helper with lockfile)
ops\timelog\New-MonthlyClose.ps1        (monthly reconciliation report)
ops\timelog\Export-GrantReport.ps1      (grant export templates)
ops\timelog\Sync-Products.ps1           (regenerate products.csv from products.json)
```

Plus one entry in `Install-DailyTasks.ps1` to run `New-MonthlyClose.ps1` on
the first business day of the month (satisfies CLAUDE.md Script Automation
Rule).

**rates.yaml initial content.**

```yaml
# Rates anchored to Finnish senior contractor median (Statistics Finland 2025)
# plus solo-founder risk premium. Review quarterly. Edit if wrong, do not leave blank.
founder_engineering_eur_per_hour: 100     # opportunity cost floor (2026 revision)
founder_architecture_eur_per_hour: 150    # market rate for architecture
founder_consulting_eur_per_hour: 250      # external billable rate (DWS consulting engagements)
founder_review_hil_eur_per_hour: 120      # HIL review of agent output
hil_legal_eur_per_hour: 250               # external counsel; Lifetime does not employ
hil_safety_eur_per_hour: 140              # TUKES/CE compliance reviewer
hil_compliance_eur_per_hour: 160          # CSRD/ISO auditor
hil_engineering_eur_per_hour: 110         # employed engineer (target Q3 2026)
hil_architecture_eur_per_hour: 180        # employed architect (target 2027)
claude_code_usd_per_m_tokens_in: 3.00     # claude-opus-4-7 input
claude_code_usd_per_m_tokens_out: 15.00   # claude-opus-4-7 output
eur_usd: 0.92                             # ECB daily spot; update weekly
wacc: 0.10                                # discount rate for NPV
notes: "Rates set 2026-04-18. Source: Tilastokeskus/Statistics Finland palkat 2025 + contractor median. Founder rates reflect opportunity cost, not contractor-market rate."
```

**timelog.csv columns (exact order).**

```
session_id,date,start_utc,end_utc,duration_min,actor,role,activity,
sprint,task_id,customer_id,product_sku,phase,
claude_code_tokens_in,claude_code_tokens_out,claude_cost_usd,
hil_minutes,hil_role,hil_rate_eur,hil_cost_eur,
billable,revenue_eur,notes
```

New columns vs. v2 (bold):
- **customer_id** — FK to `customers.csv` (`internal`, `grant_eib_sesi`,
  `grant_horizon`, or `cust_<slug>`)
- **product_sku** — FK to `products.csv` (one of 32 SKUs or `none`)
- **phase** — `discovery` | `build` | `test` | `deploy` | `support` |
  `maintenance` | `sales` | `admin`
- **revenue_eur** — billed amount if any (blank for internal)

**Enumerations.**
- `actor`: `claude_code` | `founder` | `external`
- `role`: `engineering` | `architecture` | `review_hil` | `admin` |
  `consulting` | `sales` | `legal_hil` | `safety_hil` | `compliance_hil`
- `billable`: `internal` | `customer_<id>` | `grant_<id>` | `pitch`

**Write-TimelogRow.ps1** (append helper — atomic, lockfile-protected):

1. Acquire `.lock` (timeout 10s; if held >10s, error and write `.lock.failed.<pid>`).
2. Validate row against schema (column count, enum values, customer_id FK, product_sku FK).
3. Append row to `timelog.csv` via `.NET [System.IO.File]::AppendAllText` (atomic on NTFS for lines <4KB).
4. Release `.lock`.
5. If validation fails, write to `timelog.rejected.jsonl` with reason.

**Exit gate for 0A.**

- ☐ All files exist and are committed on branch `sprint-0-bootstrap`.
- ☐ `products.csv` has 32 rows joined from `dws10.com/config/products.json`.
- ☐ First three rows written to `timelog.csv`:
  1. session_start for `claude_code`
  2. session_start for `founder`
  3. activity="bootstrap" logging the time spent creating the ledger itself
- ☐ `Write-TimelogRow.ps1 -Test` runs green (writes + rejects + validates).
- ☐ `Install-DailyTasks.ps1` contains entry for monthly close.
- ☐ 5-line summary: wall clock + tokens + estimated founder review minutes,
  printed for HIL approval.

STOP after 0A. Wait for founder "go" before Sprint 0B.

---

## 6. Sprint 0B — Code-verified hub audit

Read-only. No code changes. Produces `docs/STD-008-hub-audit-2026-04.md`.

Tasks (identical to v2 with two additions):

0. Baseline capture (git HEAD, branch, log -20)
1. MCP tool inventory (all columns from v2)
2. Naming & annotation audit
3. Transport verification (streamable HTTP stateless JSON)
4. Auth posture verification (OAuth 2.1 DCR, SPIRE if deployed)
5. Observability baseline (Level 1–5 with evidence)
6. Remediation table — RE-PRICED with customer/grant blockage mapping (NEW)
7. Sprint 1 readiness map
8. **(NEW)** Risk-rank each remediation item against:
   - Customer deals it blocks (by customer_id)
   - Grants it blocks (by grant_id)
   - Audits it blocks (ISO 27001, SOC 2)
9. **(NEW)** Write `ops/timelog/reports/sprint-0b-cost-vs-hypothesis.md`:
   hypothesized €/item vs. measured €/item, delta %, root cause of any >20% delta.

**Exit gates for 0B.**

- ☐ Every registered MCP tool in inventory, all columns filled.
- ☐ Transport + auth verified against live processes (not just source).
- ☐ Observability level justified with grep evidence.
- ☐ STD-008 committed on branch `sprint-0-audit`.
- ☐ timelog.csv has complete session coverage; reconciliation row written.
- ☐ Cost-vs-hypothesis report shows delta % for every line item.

---

## 7. Sprint 0C — Dashboard stub + catalog join (new)

**Objective.** Give the founder (and eventual CFO/ops hire) a read-only view
into the ledger. Path: `dws6.com/admin/finance/`. Private, not on Cloudflare
edge; served from backend Express + Supabase.

**Scope (stub only).**

1. Create Supabase migration `supabase/migrations/<date>_project_time.sql`:
   - `project_time` table mirroring `timelog.csv` columns with proper types
   - `customers` table
   - `products` table
   - RLS enabled; only `service_role` or authenticated `admin` role can read
2. Create `scripts/sync-timelog-to-supabase.ps1`:
   - Idempotent upsert from `timelog.csv` into `project_time`
   - Runs hourly via Windows Task Scheduler
   - Writes own rows to ledger
3. Create minimal page `dws6.com/admin/finance/index.html`:
   - Four tiles: month-to-date HIL cost (€), Claude Code cost ($),
     billable utilization (%), gross margin (%)
   - One table: last 50 rows
   - Reads via `/api/finance/summary` (backend Express)
4. Create backend route `src/routes/finance.ts`:
   - `GET /api/finance/summary` — MTD aggregates
   - `GET /api/finance/rows?limit=50` — recent rows
   - JWT-gated; admin role only

**Exit gates for 0C.**

- ☐ Migration applied to dws6-production Supabase, RLS verified.
- ☐ First sync succeeds; row counts match CSV.
- ☐ Dashboard loads at `localhost:3000/admin/finance` with real data.
- ☐ No secrets in committed files; all via `.env`.
- ☐ Row count after sync logged in ledger as a measurement.

---

## 8. Sprint 1 — Hub remediation (re-priced gates)

Seven items from chat-derived plan. Priced and risk-ranked AFTER 0B measures
reality. Table below is the hypothesis to validate.

| #   | Item                                        | Hypothesis (v2) | Re-priced at 0B | Blocks                         | EV    |
| --- | ------------------------------------------- | --------------- | --------------- | ------------------------------ | ----- |
| 1   | LiteLLM gateway + per-tenant budget cap     | €2,000          | TBD             | Any multi-tenant customer      | 2.3–6.8× |
| 2   | Agent registry (YAML) + HITL enforcement    | €1,520          | TBD             | ISO 27001, EU AI Act           | 131×  |
| 3   | Langfuse free tier + OpenTelemetry SDK      | €760            | TBD             | All enterprise deals (auditability) | 6.7× |
| 4   | Prompt firewall / tool-color classifier     | €1,900          | TBD             | EU AI Act Article 15 (resilience) | 52×  |
| 5   | OAuth 2.1 DCR + SPIFFE/SPIRE verification   | €1,140          | TBD             | Federal, healthcare, finance   | uncapped |
| 6   | Tool naming + MCP annotation audit          | €380            | TBD             | GTM trust, AI marketplace listings | trust |
| 7   | Streamable HTTP stateless-JSON verification | €380            | TBD             | Horizontal scaling gate        | scaling |

Each item requires its own sprint with ROI measured post-hoc (see Appendix A).

---

## Appendix A — ROI formula

Per sprint and per customer. Computed in `New-MonthlyClose.ps1` from ledger rows.

**Cost (€) =** sum of `claude_cost_usd × eur_usd` + sum of `hil_cost_eur`
(filtered by sprint or customer or date range).

**Revenue (€) =** sum of `revenue_eur` in the same filter.

**Gross margin (€) =** Revenue − Cost.

**Gross margin (%) =** Gross margin / Revenue. Undefined if Revenue=0.

**Payback (months) =** Cost / (monthly recurring revenue attributable).
For one-shot projects, payback is "delivered" if GM% ≥ 0.

**NPV(12 mo)** at `wacc` (default 10%) =
  Σ [ monthly_cash_flow_t / (1 + wacc/12)^t ] for t=1..12 − upfront_cost.

**IRR** solved numerically (Newton-Raphson, 20 iter max) over 12-month cash
flows. Reported as annualized %.

**Per-product ROI.** For every `product_sku`, roll up Cost and Revenue to
answer: which of the 32 products actually pays for itself?

**Per-HIL ROI.** For every `hil_role`, compute hours billed vs. cost to
answer: which HIL hire has positive gross margin?

---

## Appendix B — HIL role rate card

Sourced to Finnish market benchmarks (Tilastokeskus 2025, contractor surveys).
All rates include employer overhead unless noted.

| Role              | EUR/h | Source / rationale                                                         |
| ----------------- | ----- | -------------------------------------------------------------------------- |
| founder_engineering | 100 | Opportunity cost floor — founder could freelance at this rate (2026)        |
| founder_architecture | 150 | Market rate for senior architect (Helsinki, 2025 median)                   |
| founder_consulting | 250  | External billable rate for DWS consulting engagements (senior enterprise)  |
| founder_review_hil | 120 | HIL review of agent output — between engineering and architecture         |
| hil_legal         | 250   | External counsel, not employed (e.g. NDA review, contract negotiation)    |
| hil_safety        | 140   | TUKES/CE compliance reviewer (Finland-specific)                           |
| hil_compliance    | 160   | CSRD / ISO 27001 / SOC 2 auditor                                          |
| hil_engineering   | 110   | Target rate for first employed engineer (Q3 2026 hire)                    |
| hil_architecture  | 180   | Target rate for employed architect (2027 hire)                            |

Review quarterly. Corrections go in a new `rates.yaml` version with a
`notes:` history line.

---

## Appendix C — Grant export schemas

Three targets. All produced by `Export-GrantReport.ps1 -Format <eib|horizon|iso>`.

### EIB SESI (European Investment Bank Scaling Energy & Sustainability Innovation)

Filter: `billable == "grant_eib_sesi"`. Columns:

```
work_package,task,person_months,cost_eur,category,evidence_file
```

- `person_months` = duration_min / (60 × 160) — 160 = Finnish monthly work hours average
- `category` ∈ {personnel, subcontracting, equipment, other_direct, indirect}
- `evidence_file` = path to session markdown in `ops/timelog/sessions/`

### Horizon Europe

Filter: `billable == "grant_horizon"`. Columns:

```
reporting_period,beneficiary,work_package,activity_type,person_months,
personnel_cost_eur,other_direct_cost_eur
```

- `reporting_period` ∈ {RP1, RP2, RP3}
- `activity_type` ∈ {RIA, IA, CSA, management, dissemination}

### ISO 27001 audit log

Filter: all rows in audit window. Columns:

```
date,control,actor,activity,evidence,risk_assessment_link
```

- `control` mapped from activity — e.g. "A.8.25 Secure development lifecycle"
- `evidence` = session markdown + git commit SHA
- Used by ISO auditor to verify time spent on each control

---

## Appendix D — CSV → Supabase migration path

**Triggers.** Either condition fires the migration:

- `timelog.csv` exceeds 5,000 rows, OR
- 90 days have passed since bootstrap (2026-07-17).

**Migration steps.**

1. Freeze writes (acquire `.lock` with no release).
2. Run `scripts/sync-timelog-to-supabase.ps1 -FullLoad` — replay every CSV row.
3. Verify row counts match: `SELECT count(*) FROM project_time` == wc -l timelog.csv - 1.
4. Switch `Write-TimelogRow.ps1` to write to Supabase primary, CSV as backup.
5. After 30 days of parallel writes, CSV becomes archive-only.
6. Aiven replica (per 23.03.2026 architecture) receives hourly sync from Supabase.

**Rollback.** If Supabase writes fail, keep appending to CSV; nightly job
reconciles. Never drop the CSV.

---

## Appendix E — `/timelog` skill spec

Per CLAUDE.md "Build for Agents" rule: every capability is a skill.

**File.** `.claude/commands/timelog.md`

**Frontmatter.**

```yaml
---
name: timelog
version: 1.0
date: 2026-04-18
description: Write or query rows in ops/timelog/timelog.csv. Use for session_start, session_reconciliation, HIL checkpoint, budget_overage, and ad-hoc measurements. Enforces lockfile, schema validation, and customer/product FK joins.
---
```

**Usage.**

```
/timelog start                          # session_start row
/timelog hil <minutes> <role>           # HIL checkpoint row
/timelog reconcile                      # session_reconciliation row
/timelog report <sprint|customer|month> # on-demand summary
/timelog export <eib|horizon|iso> <range> # grant export
```

**Steps.** Delegates to `ops/timelog/Write-TimelogRow.ps1` and
`New-MonthlyClose.ps1`. Registered in `docs/DWS_SKILLS_GUIDE.md` in the
same commit as Sprint 0A.

**When NOT to use.** Never log rows retroactively without `activity="correction"`
and a `notes:` pointer to the session being corrected. Never edit past rows
in place.

---

## Hard constraints

- No writes outside `F:\2026\Repos2026\dws6\docs\`, `F:\...\ops\timelog\`,
  `F:\...\supabase\migrations\`, `F:\...\scripts\`, `F:\...\src\routes\`,
  `F:\...\.claude\commands\`, and `F:\...\dws6.com\admin\finance\`.
- No force-push. No main commits. Branch-per-sprint.
- No `npm install` or `pip install` without approval.
- If the hub must run locally, describe ports and processes and ASK FIRST.
- Redact credentials and `.env` content in all artifacts.
- PDFs under 10 MB.

## When each sprint is complete

Summarize in <300 words. List the top three deltas between hypothesis and
measurement. Stop and wait for go/no-go on the next sprint.

---

© 2026 Lifetime Oy. All rights reserved.
