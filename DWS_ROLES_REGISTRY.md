# DWS Roles Registry

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code (claude-sonnet-5) | Session: claude/outokumpu-customer-strategy-p01zeu | Date: 01.07.2026 | Changes: R11 Plant Director notes cell updated to add Kemi as a third Outokumpu instance alongside Tornio + Avesta, following identification of Henri Simpanen (VP Kemi mine) as a second, independent door into the Outokumpu account. Detail in `docs/field-notes/2026-07-01-outokumpu-henri-simpanen-kemi-mine-second-door.md`. Append-only correction per §6 maintenance rule; no role or stage renumbering.
- Version: 1.3 | Tool: Claude Code (Opus 4.8) | Session: claude/nvidia-halos-robotics-suqayg | Date: 23.06.2026 | Changes: Appended a "Robotics / Physical AI" industry variant to §4 (Door #1 R12 Operations Director — throughput lever; wedge: functional-safety conformity under Machinery Regulation 2023/1230 + EU AI Act embedded high-risk). Triggered by the NVIDIA Halos for Robotics launch (2026-06-22) as a market signal; full wedge matrix in `docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md`. Append, not a replacement.
- Version: 1.2 | Tool: Claude Code (Opus 4.8) | Session: claude/santander-ai-governance-mhd8rj | Date: 22.06.2026 | Changes: Appended a second financial-services industry variant to §4 — "Financial services — AI governance" (Door #1 R15 CISO, wedge: EU AI Act high-risk AI decisions). Triggered by the SantanderAI open-source release as a market signal; full wedge matrix in `docs/regulatory-radar/SANTANDER_AI_GOVERNANCE_BRIEF.md`. The existing financed-emissions (SFDR) variant is unchanged — this is an append, not a replacement.
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/exa-openclaw-integration-YnDpO | Date: 25.05.2026 | Changes: Boardy usability audit shipped to §5 — added naming patterns (`/<domain>-<artifact>-standard` for skills, `/<domain>-<artifact>-gate` for workflows), revenue-lever rule ("lead with the role that has the strongest revenue or cost lever, not the role with the most authority"), and CBAM Disclosure Standard worked example (Boardy fill, verbatim). R26 Business-line/Commercial Owner explicitly deferred per Boardy ("avoid registry getting muddy").
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/exa-openclaw-integration-YnDpO | Date: 25.05.2026 | Changes: Initial canonical registry. Extracted from sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md (Outokumpu case, 2026-05-18) — the 14 grouped roles split into 25 distinct titles. Registered in DWS_TRUTH_STANDARD.md §2. Each standard's optional Roles & Responsibilities chapter pulls from this list.

Document Status:

- Created: 25.05.2026
- Last Modified: 01.07.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Canonical Registry
- Owner: Risto Päärni (interim) — Standards & Compliance Advisor when named

---

## 1. Purpose

Canonical 25-role enterprise taxonomy for DWS sales motions, standards, skills, and workflows. Sourced from the Outokumpu case (`sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md`) where the wedge-by-role matrix was first developed. Promoted to a registry so every standard and outreach motion pulls from one list instead of re-inventing roles per document.

**Binding for:** DWS standards (Skill/Workflow/Roles chapters), sales outreach (per-role wedge matrices), agent skills that target specific buyers, investor materials that name the customer side of a deal.

> **Canonical registry — single source of truth.** Registered in `DWS_TRUTH_STANDARD.md` §2 row 15. All other documents must reconcile against this file.

---

## 2. The 5 Buying-Journey Stages

Roles are grouped by **when they enter a deal**, not alphabetically. Each stage has a verb that names what the roles in it actually do.

| #   | Stage                  | Verb               | What roles in this stage do                                                                                               |
| --- | ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Strategic sponsors** | _Open the door_    | Have the authority to mandate a new platform and the strongest reason to want one. Picked as door #1 in any sales motion. |
| 2   | **Operational owners** | _Run the workflow_ | Run the daily process the platform changes. Their pain is the most tangible; their success metric is the cleanest.        |
| 3   | **Tech approvers**     | _Clear the stack_  | Gatekeep procurement, security, and integration. Block deals if the technical posture isn't right.                        |
| 4   | **Commercial drivers** | _Prove the value_  | Translate the platform into revenue, win-rate, cost reduction, supplier leverage. The "show me the number" stage.         |
| 5   | **Executive sponsors** | _Sign the deal_    | Approve the budget, the strategy, and the board narrative. Sponsor visibility, not daily contact.                         |

**Diagonal win-win rule** (from the Outokumpu source): each role's _"what you win"_ must light up someone else's _"win you create for the rest of the company"_. Same headline lands for every role; each becomes an internal advocate.

---

## 3. The 25 Canonical Roles

Each entry has: ID, title, stage, default ownership scope, and notes for when the role gets split (e.g. CIO + Head of IT are listed separately for orgs where they are distinct people).

| ID  | Role                               | Stage                 | Default ownership scope                                               | Notes                                                                    |
| --- | ---------------------------------- | --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| R01 | Patent Director                    | 1 — Strategic sponsor | Patent portfolio, prosecution calendar                                | Often combined with IP Director (R02) in mid-sized orgs                  |
| R02 | IP Director                        | 1 — Strategic sponsor | Trade-secret governance, IP-disclosure approval                       | Outokumpu door #1 (Ari Hirvonen). The IP-vs-disclosure gap is the wedge. |
| R03 | Head of R&D                        | 1 — Strategic sponsor | Active research themes, project pipeline                              | Combined with CTO (R04) in many industrial orgs                          |
| R04 | CTO                                | 1 — Strategic sponsor | Technology roadmap, architecture decisions                            | Often the inventor-side of the IP function                               |
| R05 | General Counsel                    | 1 — Strategic sponsor | Corporate legal, contracts, regulatory exposure                       | Combined with Legal (R06) in smaller orgs                                |
| R06 | Head of Legal                      | 1 — Strategic sponsor | Operational legal: TPRM, DPIA, audit response                         | Often a deputy to GC in large orgs                                       |
| R07 | CSO (Chief Sustainability Officer) | 2 — Operational owner | Sustainability strategy, ESG ratings, CSRD                            | Combined with Head of Sustainability (R08) in mid-size orgs              |
| R08 | Head of Sustainability             | 2 — Operational owner | CSRD / CBAM / ESRS day-to-day execution                               | Deputy or peer to CSO                                                    |
| R09 | Head of Application Engineering    | 2 — Operational owner | Per-customer technical specification                                  | Often combined with Customer Engineering (R10)                           |
| R10 | Head of Customer Engineering       | 2 — Operational owner | Customer-facing technical fulfillment, Scope 3 forms                  | The "manual fulfilment desk" pain in the Outokumpu case                  |
| R11 | Plant Director                     | 2 — Operational owner | Single-plant operations                                               | Multiple per company (Outokumpu: Tornio, Avesta, Kemi)                   |
| R12 | Operations Director                | 2 — Operational owner | Multi-plant or operational-network leadership                         | Often above Plant Director, below COO                                    |
| R13 | CIO                                | 3 — Tech approver     | Enterprise architecture, vendor consolidation, IT strategy            | Combined with Head of IT (R14) in smaller orgs                           |
| R14 | Head of IT                         | 3 — Tech approver     | IT operations, integration, helpdesk, day-to-day infrastructure       | Deputy or peer to CIO                                                    |
| R15 | CISO                               | 3 — Tech approver     | Security strategy, NIS2 obligations, board-facing                     | Combined with Head of InfoSec (R16) in mid-size orgs                     |
| R16 | Head of InfoSec                    | 3 — Tech approver     | Security operations, AI-attack-surface, agent-action monitoring       | Deputy to CISO                                                           |
| R17 | Head of Sales Engineering          | 4 — Commercial driver | Pre-sales technical, quote-to-disclosure                              | Combined with Head of Commercial (R18) in some orgs                      |
| R18 | Head of Commercial                 | 4 — Commercial driver | Commercial terms, contract structures, deal desk                      | Often above Sales Engineering                                            |
| R19 | CRO (Chief Revenue Officer)        | 4 — Commercial driver | Revenue strategy, pricing power, win-rate                             | Sometimes combined with CCO in mid-size orgs                             |
| R20 | Chief Procurement Officer          | 4 — Commercial driver | Strategic procurement, supplier strategy, TPRM                        | Combined with Head of Procurement (R21) in mid-size orgs                 |
| R21 | Head of Procurement                | 4 — Commercial driver | Procurement operations, supplier-compliance scoring                   | Deputy or peer to CPO                                                    |
| R22 | CEO                                | 5 — Executive sponsor | Margin / revenue / moat — all three P&L lines                         | Often combined with CFO (R23) in board narratives                        |
| R23 | CFO                                | 5 — Executive sponsor | Capital allocation, board reporting, investor narrative grounding     | Peer to CEO; co-sponsors most enterprise platform decisions              |
| R24 | Head of Investor Relations         | 5 — Executive sponsor | Analyst-day messaging, ESG rating responses (MSCI/Sustainalytics/ISS) | The "make it analyst-credible" function                                  |
| R25 | Board ESG Committee Chair          | 5 — Executive sponsor | Board-level oversight materials, ESG narrative, audit-readiness       | Triggers top-down policy mandate                                         |

---

## 4. Standard Industry Variants

The 25 roles are stable; their **emphasis** shifts per industry. Document these variants when developing per-industry sales motions; do not re-invent the role list.

| Industry pattern                       | Door #1 (R-ID)          | Wedge                                                                | Roles with elevated emphasis |
| -------------------------------------- | ----------------------- | -------------------------------------------------------------------- | ---------------------------- |
| **Steel / heavy industry** (Outokumpu) | R02 IP Director         | CBAM disclosures as IP filings                                       | R02, R07, R11, R19           |
| **Chemicals & petrochemicals**         | R03 / R04 R&D / CTO     | REACH + CBAM + H2 mandates                                           | R03, R04, R05, R07           |
| **Construction & buildings**           | R12 Operations Director | EPBD embodied carbon                                                 | R12, R09, R17, R20           |
| **Manufacturing cross-sector**         | R13 CIO                 | Digital Product Passports (ESPR)                                     | R13, R07, R09                |
| **Robotics / Physical AI**             | R12 Operations Director | Functional-safety conformity (Machinery Reg 2027 + AI Act embedded)  | R12, R06, R15, R19, R23      |
| **Financial services**                 | R23 CFO                 | Financed emissions (SFDR)                                            | R23, R24, R05                |
| **Financial services — AI governance** | R15 CISO                | EU AI Act high-risk AI decisions (credit scoring, insurance pricing) | R15, R06, R13, R19, R23      |
| **Maritime / shipbuilding**            | R12 Operations Director | FuelEU Maritime + ETS Maritime                                       | R12, R20, R07                |
| **Public sector**                      | R05 General Counsel     | NIS2 + sovereign procurement                                         | R05, R13, R15                |
| **Data centres**                       | R15 CISO                | EED + Data Centre Energy Reporting                                   | R15, R13, R07                |

Add new variants here when a new industry sales motion is developed. Do not fork the 25-role list itself.

---

## 5. How to Use This Registry

### In DWS standards (optional Skill/Workflow/Roles template)

Each standard MAY include a `## Roles & Responsibilities` chapter using this template:

```
| Stage | Role(s) | What they own for this standard | What they get from it |
|---|---|---|---|
| 1 — Sponsor   | R02 IP Director              | Authority over standard adoption                          | <win>            |
| 2 — Owner     | R07 CSO + R08 Head of Sustainability | Day-to-day execution                                | <win>            |
| 3 — Approver  | R13 CIO + R15 CISO           | Technical clearance + security posture                    | <win>            |
| 4 — Driver    | R19 CRO                      | Translates standard into commercial outcome               | <win>            |
| 5 — Sign-off  | R22 CEO + R23 CFO            | Budget approval + board narrative                         | <win>            |
```

- **Always reference roles by R-ID** so a future rename in this registry propagates correctly.
- **Skip stages that don't apply.** A standard with no commercial dimension (e.g. `DWS_DOCUMENT_STANDARD.md`) may have only Sponsor + Owner + Approver populated.
- **Use multiple roles per stage when realistic** (CSO + Head of Sustainability is normal).

### In sales outreach (per-customer wedge matrices)

For each named customer outreach (e.g. `sales-outreach/INTRO_*.md`), build the wedge matrix using:

1. The 5 stages from §2 (not custom stage names).
2. The 25 roles by R-ID where applicable; named individuals in parentheses.
3. The diagonal win-win construction from §2: every role's "what you win" creates someone else's "win you create".

### In skills

When a skill targets specific buyers (e.g. `/investor-outreach` targets R22 + R23 + R24), declare the target R-IDs in the skill metadata so the agent can pull the right role-specific framing from the wedge matrix.

### Naming patterns

When a standard adopts the Skill/Workflow/Roles template, use these naming conventions:

- **Skill:** `/<domain>-<artifact>-standard` — keeps the skill linked to the standard that governs it. Examples: `/cbam-disclosure-standard`, `/truth-check-standard`, `/kya-trust-score-standard`.
- **Workflow:** `/<domain>-<artifact>-gate` — the `-gate` suffix makes the blocking intent obvious. Examples: `/cbam-declaration-gate`, `/lint-truth-claims-gate`, `/deploy-sovereignty-gate`.

The pattern keeps every operationalized standard discoverable: searching `grep -r "/cbam-" docs/DWS_*.md` returns every skill and workflow tied to the CBAM domain.

### Lead with the revenue lever

When filling an operational standard's Roles chapter, **lead with the role that has the strongest revenue or cost lever — not the role with the most authority.**

- CFO sponsors the budget but doesn't move the pilot; the **business-line owner** moves the pilot.
- CEO signs off on company posture but doesn't run daily compliance; the **compliance lead** runs it.
- General Counsel approves the contract but doesn't carry the deadline; the **account manager** carries the deadline.

Match the role to the action, not the org chart. The Sponsor row is for the person with skin in the P&L of this specific standard's outcome — not for the most senior name in the building. Authority-led fills produce templates that look correct and never get used.

### Worked example — CBAM Disclosure Standard (Boardy fill, 2026-05-25)

A standard whose skill turns verified steel data into a compliant CBAM annual declaration. Operational standard, sales-facing, regulatory exposure. Use as the reference fill for any standard with a similar shape (per-product-line, deadline-bound, regulator-facing).

**Skill**

- `/cbam-disclosure-standard` — turns verified steel data into a compliant CBAM annual declaration, with signed disclosure and Article 12 logging.

**Workflow**

- `/cbam-declaration-gate` — blocks sign-off until source data, emission factors, reviewer approval, and audit trail are in place.

**Roles & Responsibilities**

- **Sponsors** | business-line or commercial owner | owns the customer pilot and revenue case | gets faster regulated deals and less back-and-forth.
- **Owners** | compliance or sustainability lead | owns source data quality, emission factor logic, and declaration readiness | gets less manual evidence chasing.
- **Approvers** | CFO or controller | owns margin, auditability, and final financial signoff | gets cleaner numbers and fewer rework loops.
- **Drivers** | account manager or ops lead | owns collection, handoffs, and deadline tracking | gets a repeatable process and fewer fire drills.
- **Sign-off** | legal, risk, or DPO | owns policy guardrails and final approval | gets traceability and less veto friction.

**Why this fill works** (per usability audit, 2026-05-25): commercial buyer leads Sponsor (not CEO); role categories beat named persons; CFO is the money-gate Approver (not CIO/Legal); sign-off goes to whoever bears per-artifact liability (not CEO again). Demonstrates the revenue-lever rule above.

---

## 6. Maintenance

**Owner:** Risto Päärni (interim).

**Review cadence:** When a new sales motion surfaces a role that doesn't fit the 25 (add as R26, R27, … with rationale), or when a stage definition needs refinement based on real deal patterns. Industry variants in §4 are append-only.

**Source-of-truth conflict rule:** Per `DWS_TRUTH_STANDARD.md` §3, if any document disagrees with this registry on role names, stage assignments, or ownership scopes, this file wins. Downstream documents are corrected, not the registry.

**Drift log:**

| Date       | Symptom                                                                                                                                                                                                         | Resolution                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-25 | 25 enterprise roles lived only in `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md`. No canonical registry meant the next outreach would either copy-paste or re-invent.                                         | Initial creation of this file; registered in `DWS_TRUTH_STANDARD.md` §2 row 15.                                           |
| 2026-06-22 | Financial services had only the financed-emissions (SFDR) wedge, but the EU AI Act + the SantanderAI open-source signal opened a distinct AI-governance buying motion with a different Door #1 (CISO, not CFO). | Appended "Financial services — AI governance" as a second §4 variant (append-only per §6); did not fork the 25-role list. |
