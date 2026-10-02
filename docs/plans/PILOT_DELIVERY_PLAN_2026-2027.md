# Pilot Delivery Plan — Any Pilot SKU to a Paying Customer, User Demo in 6 Months

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/youthful-hopper-uqvhua | Date: 27.09.2026 | Changes: First version. Read PR #2173 (138-SKU fulfilment portfolio) against the catalogue on its head `dfda033`. Found that pilot is a SKU (8 rows) but only one has a pilot-grade acceptance KPI, and that the 47 capacity-evidence gaps are not in Aegis, hardware or Kubernetes. Defines one delivery contract for any pilot and a 6-month path to a user demo built from real pilot evidence. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Publication Status: INTERNAL — plan, not for public-site publication
- Document Type: Delivery Plan
- Status: PENDING_REVIEW (HIC decisions in §8)

Standards loaded: `docs/system-config/STANDARDS_ROUTING.md`, `DWS_ROLES_REGISTRY.md` (R-IDs in §4). `DWS_TRUTH_STANDARD.md` rows 42–45 are cited through the PR's generated truth files, not re-derived.

---

## 0. Answer in one paragraph

A pilot is a real row in the 138. There are eight pilot SKUs, in chapters 3, 4, 8 and 13 — not chapters 2 and 8. The problem is not the SKU. It is the acceptance contract behind it. Seven of the eight carry the generic acceptance KPI of their chapter template ("buyer can log in", "agent activated"). Only the Aegis Pilot carries a KPI that measures the outcome the buyer pays for. The worst case is `AIS-OUTCOME-PILOT`: it promises a refund if the named KPI does not move, but its acceptance record checks only that a tenant is provisioned. On a first enterprise order, that gap decides the refund dispute. This plan closes it before the first order, not after.

## 1. Ground truth (read from the repository, 27.09.2026)

| Fact                           | Value                                                                                                                                                                                                                                                                                                                                               | Source                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Payable SKUs                   | 138 — but only on the PR branch. Not on `main`.                                                                                                                                                                                                                                                                                                     | PR #2173 head `dfda033`, `dws10.com/config/products.json`                                                         |
| Public                         | 72 public records, 65 BLUE, 1 archived. The price list shows 81 rows.                                                                                                                                                                                                                                                                               | `config/truth/product-readiness-backlog.json` (PR branch); `.claude/handoffs/claude/price-list-a5-campaign.md:31` |
| PR #2173                       | Open. 1,227 files, +106,266 / −7,629.                                                                                                                                                                                                                                                                                                               | GitHub PR #2173                                                                                                   |
| CI on PR #2173                 | **Not green. Not run.** 11 GitHub Actions checks queued since 13:52 UTC, 27.09.2026, with no runner picking them up. The two Cursor agents returned `neutral`. The "1,837 tests passed" figure is a local run, not CI.                                                                                                                              | PR #2173 check runs                                                                                               |
| Migration 099                  | `099_270926_product_order_fulfilment.sql` plus `100_…_idempotency_conflict.sql`: reviewed, **not applied**. Checkout fails closed until they are applied and `npm run preflight:product-orders` passes.                                                                                                                                             | PR #2173 body; field note `2026-09-27-payable-product-fulfilment-portfolio.md`                                    |
| **Migration number collision** | `main` already holds a different `099_270926_nemoclaw_kya_invocation_binding.sql` (merged in `5d506e5`, #2175). The PR branch renames it to `101_…` **and its content differs** from main's. If main's 099 is already applied in production, merging as-is will re-run the NemoClaw migration under a new number.                                   | `git ls-tree` on both refs; `diff` of the two files                                                               |
| Readiness backlog              | 185 open items: 138 automation-depth (one per SKU) + 47 capacity-evidence.                                                                                                                                                                                                                                                                          | `config/truth/product-readiness-backlog.json` `summary`                                                           |
| Where the 47 sit               | Ch 8: 11 · Ch 9: 9 · Ch 10: 12 · Ch 11: 9 · Ch 1: 3 · Ch 2, 3, 4: 1 each · **Ch 6 (hardware): 0 · Ch 7 (Kubernetes/DOCA): 0**. 41 of 47 are on BLUE (non-public) agent tiers. The 6 public ones: `DWS-AEGIS-SUB-001`, `DWS-IQ-ESS-SETUP`, `LIFETIME-IT-TUKI-10H`, `LIFETIME-WEB-STARTER`, `LIFETIME-WEBSTORE-MINI`, `sovereignty-cloud-consulting`. | same file, grouped by `chapter`                                                                                   |

**Correction to the working assumption.** The capacity-evidence gaps are not concentrated in Aegis/KYA, sovereign hardware or Kubernetes/DOCA. Those chapters look clean because they carry a filled capacity profile, and the generator counts field presence, not evidence. The one enterprise-relevant capacity gap is `DWS-AEGIS-SUB-001` — the maintenance subscription the Aegis pilot converts into. It sits on the conversion path, one step after the pilot.

## 2. The eight pilot SKUs and their acceptance contract

| SKU                   | Ch  | State  | Price                    | Acceptance KPI today                                                                                    | Pilot-grade?                   |
| --------------------- | --- | ------ | ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `DWS-AEGIS-PILOT-001` | 4   | public | €19,990 / 3 months       | Uplink severed: workflow completes, Art. 12 record written locally, operator can stop an agent. Binary. | **Yes**                        |
| `AIS-OUTCOME-PILOT`   | 3   | public | €9,990 / 6 weeks         | Chapter 3 template: tenant provisioned, tier limits active. Page promises refund on KPI miss.           | **No — contradicts the offer** |
| `DWS-EU-PILOT`        | 3   | public | €1,499/mo + €3,990 setup | Chapter 3 template: tenant provisioned. Page says "prove compliance ROI".                               | No                             |
| `DWS-US-PILOT`        | 3   | public | €799/mo + €2,490 setup   | Chapter 3 template. Page says "prove ROI before scaling".                                               | No                             |
| `CMP-T0`              | 8   | BLUE   | €1/mo, 60 days           | Chapter 8 template: agent active, first case human-reviewed.                                            | No; capacity gap               |
| `SS-T0`               | 8   | BLUE   | €1/mo, 30 days           | Chapter 8 template.                                                                                     | No; capacity gap               |
| `MO-T0`               | 8   | BLUE   | €1/mo, 60 days           | Chapter 8 template.                                                                                     | No; capacity gap               |
| `LAND-OPS`            | 13  | BLUE   | €109,990 Y1              | Chapter 13 template: first weekly gate reached with a go/no-go decision.                                | Partial                        |

"Pilot-grade" means: the KPI names the business outcome, has a baseline, a threshold and a measurement window, and can be evidenced from our own logs at close. The template KPIs prove delivery happened. They do not prove the pilot worked. For a pilot, the buyer is paying for the second thing.

## 3. The rule for any pilot: no Pilot Acceptance Record, no invoice

Every pilot, whatever the SKU, runs on one contract object: the **Pilot Acceptance Record (PAR)**. It replaces the chapter-template KPI for that order only. The catalogue template stays as the delivery floor.

A PAR is signed by the buyer's operational owner and our programme lead **before** payment is taken. It has nine fields:

1. **Outcome** — one named KPI in the buyer's words (for example "CSRD data-collection cycle time, days").
2. **Baseline method** — how the current value is measured, from which system, by whom.
3. **Baseline value** — measured in weeks 0–2 of the pilot, not quoted from memory. The PAR is countersigned when this value is filled in.
4. **Threshold** — the change that counts as pass (absolute or %).
5. **Window** — the dates the after-value is measured over.
6. **Evidence source** — which of our logs proves the after-value: KYA verified-done attestation (`kya_verified_done_attestations`, migration 079), Art. 12 log, agent run records, buyer system export.
7. **Negative-result clause** — a failed KPI is a valid result, and states what the buyer gets (Aegis: full report and sizing; AIS: refund).
8. **Conversion term** — the SKU it converts into, the credit and the credit expiry.
9. **Signatories** — buyer-side operational owner and executive sponsor; Lifetime Oy programme lead.

Three hard rules:

- **No PAR, no payment link.** The checkout for a pilot SKU is sent only after the PAR is agreed. The public Buy button stays live (HIC decision: never unpublish); the order intent then waits in `pending` until the PAR is attached.
- **No baseline, no measurement.** If the baseline cannot be measured by week 2, the pilot pauses and the buyer gets the choice to fix access or stop with a pro-rata refund. We do not guess a baseline.
- **Evidence is generated, not written.** The close report pulls from logs. A number that cannot be traced to a log line is marked `unverified` in the report.

## 4. Delivery gates (the same six gates for every pilot)

| Gate        | When                          | Exit condition                                                                                                                         | Owner (ours)      | Buyer roles (R-ID)                      |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------- |
| G0 Qualify  | before quote                  | One workflow, one site, one named outcome; data access plausible within 2 weeks; security review path known.                           | Founder / sales   | R12 Operations Dir., R04 CTO            |
| G1 Contract | week 0                        | PAR fields 1, 2, 4–9 agreed; DPA signed; order intent created; payment verified (Stripe webhook, or managed check for Revolut/PayPal). | Programme lead    | R18 Head of Commercial, R21 Procurement |
| G2 Baseline | weeks 0–2                     | Baseline measured and countersigned; security review passed; access working.                                                           | Delivery engineer | R10/R14 IT, R15 CISO                    |
| G3 Build    | weeks 2–6 (AIS) / 2–8 (Aegis) | Agent(s) running on buyer data under KYA; kill authority tested; Art. 12 log written.                                                  | Delivery engineer | R09/R10 Engineering                     |
| G4 Measure  | final 2–4 weeks               | KPI measured over the PAR window from the named evidence source.                                                                       | Delivery engineer | Operational owner                       |
| G5 Close    | last week                     | Evidence pack issued; pass or negative result recorded; conversion decision (buy / extend / stop) in writing.                          | Programme lead    | R22 CEO or R23 CFO                      |

The **evidence pack** at G5 is the product of the pilot. It contains: the signed PAR, baseline and after-value with log references, KYA attestations, Art. 12 log export, the kill-authority test record, sizing for production, and the conversion quote. It is generated by one script (to be built in month 1, §5) from the tables already in the schema.

## 5. Six months to a user demo — October 2026 to March 2027

The demo in month 6 is a **replay of a real pilot's evidence pack**, shown by the customer's operational owner where possible. It is not a scripted product tour. That is the version both a buyer and an investor can check.

### Month 1 — October 2026: make one pilot deliverable end to end

1. **Fix the migration numbering before #2173 merges.** Confirm in production whether main's `099_…_nemoclaw_kya_invocation_binding.sql` is applied. If yes, #2173 must keep it as 099 and renumber its own two files to 101–102. (HIC, RED zone for the check against production.)
2. **Get CI to actually run on #2173.** The 11 checks are queued with no runner. Register the DGX runner for these jobs (per #2164/#2165) and require a real green run on the head commit. Local green does not count.
3. **Apply 099/100 (renumbered) in production**, run `npm run preflight:product-orders`, require PASS, then deploy backend, then checkout — the order in the PR body. (HIC, RED.)
4. **Replace the acceptance KPI of `AIS-OUTCOME-PILOT`, `DWS-EU-PILOT` and `DWS-US-PILOT`** with a `pilotAcceptance: "per-order PAR"` contract that points to §3, so the product page no longer promises one thing and certifies another. Catalogue change → price-list version bump and the truth generators, per the price-list handoff.
5. **Build the PAR template** (one page, EN/FI) and **the evidence-pack generator** (`scripts/pilot/evidence-pack.mjs`, JSON + HTML) reading KYA attestations, Art. 12 logs and order intent status.
6. **Customer zero.** Run a two-week internal pilot on DGX with Lifetime Oy as the buyer, through all six gates, to prove the generator produces a complete pack. Record gaps as issues.

Exit: one pilot SKU can be sold, paid, delivered and evidenced with no manual step undocumented.

### Month 2 — November 2026: sign design-partner pilot #1

- Lead SKU: `DWS-AEGIS-PILOT-001` for an enterprise with a control room, or `AIS-OUTCOME-PILOT` for a mid-market buyer with one measurable workflow. Pick from warm channels in `docs/sales/` with a live trigger (4★–5★ per the Market Signal rule).
- G0–G1 closed; G2 baseline started.
- Parallel: pipeline of three further qualified pilots (G0 passed).

### Month 3 — December 2026: pilot #1 build, pilot #2 signed

- Pilot #1 at G3. Weekly written status to the buyer, generated from the same logs.
- Pilot #2 at G1–G2. Different SKU from pilot #1, so the plan is tested on two shapes.
- Close `DWS-AEGIS-SUB-001` capacity-evidence gap (the conversion step for Aegis) before any Aegis pilot reaches G5.

### Month 4 — January 2027: measurement

- Pilot #1 at G4. Mid-point review with the buyer's executive sponsor: is the KPI moving, and is the evidence traceable?
- Pilot #2 at G3.

### Month 5 — February 2027: first close

- Pilot #1 at G5: evidence pack issued, conversion decision in writing. A negative result is published internally with the same rigour as a pass.
- Pilot #2 at G4.
- Build the demo from pilot #1's evidence pack: the buyer's own before/after, the Art. 12 trail, the kill test.

### Month 6 — March 2027: user demo

- User demo delivered to (a) the next pipeline buyers and (b) investors, from real evidence. Customer co-presents if they agree.
- Pilot #2 at G5.
- Retro: which gates slipped, which evidence was missing, what to automate first (this is where the 138 automation-depth items get prioritised — by what the two pilots actually needed, not by chapter).

## 6. What is deferred, on purpose

- **Automation depth (138 items).** Pilots are delivered by named people. Automate only what the two real pilots show is repeated.
- **Capacity evidence on BLUE agent tiers (41 items).** These are not public and not on the pilot path.
- **The €1 T0 pilots (`CMP-T0`, `SS-T0`, `MO-T0`).** A €1 pilot with a template KPI costs a delivery engineer's time and yields no evidence a buyer will pay for. Keep them BLUE until they carry a PAR, or fold them into `AIS-OUTCOME-PILOT` as the KPI options they already are (CSRD cycle time, site-safety rate, LCA turnaround).

## 7. Risks, ranked for order one

| #   | Risk                                                                           | Effect                                                    | Control                                    |
| --- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------ |
| 1   | Pilot sold with a template KPI; outcome disputed at close                      | Refund, lost reference, lost conversion                   | §3 PAR before payment; §5 M1 step 4        |
| 2   | Migration number collision re-runs NemoClaw migration in production            | Failed deploy or duplicate objects; checkout stays closed | §5 M1 step 1                               |
| 3   | #2173 merged on local-only green                                               | Regressions reach the live storefront                     | §5 M1 step 2                               |
| 4   | Baseline data not accessible in weeks 0–2                                      | Pilot runs with nothing to measure against                | G2 pause rule                              |
| 5   | Aegis converts, but the subscription step has no capacity evidence             | Enterprise procurement stalls after a passed pilot        | Close `DWS-AEGIS-SUB-001` gap in M3        |
| 6   | Aegis pilot credit lapses 6 months after the pilot; slow procurement misses it | Buyer pays twice or walks                                 | Conversion term and expiry in PAR field 8  |
| 7   | Cloud-agent budget window ends 11.10.2026                                      | Delivery tooling stalls                                   | Run pilot tooling on DGX from M1 (Rule 14) |

## 8. HIC decisions needed

1. **Lead pilot SKU for pilot #1:** Aegis Pilot (enterprise, KPI ready today) or Outcome Pilot (mid-market, faster close, needs the M1 KPI fix)? Recommendation: Aegis first — its acceptance KPI is already pilot-grade and evidence-ready.
2. **Approve the PAR rule** (§3): pilot checkout link sent only after the PAR is agreed, while the public Buy button stays live.
3. **Migration 099 in production:** confirm whether main's NemoClaw 099 is applied, so #2173 can be renumbered correctly before merge.
4. **€1 T0 pilots:** keep BLUE until they carry a PAR, or fold them into `AIS-OUTCOME-PILOT`?

---

**Document version:** v1.0 · **Date:** 27.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.**
