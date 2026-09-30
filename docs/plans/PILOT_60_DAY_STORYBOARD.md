# Pilot Delivery — 60-Day Storyboard (28.09.2026 → 27.11.2026)

---

# VERSION AND AGENT HISTORY

Version: 1.1 [Latest]

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: Added the buyer track from Boardy's review (HIC-forwarded 28.09.2026): Aegis M0–M3 money and evidence track, Track B Decision Transfer (B1–B3), the pinned order starting with three named owners, and Aegis capacity evidence as the M2 gap. Days 3, 14, 21, 30, 35, 40, 49 carry the buyer milestones.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: HIC 28.09.2026 "write 60 days storyboard with every day milestones. we begin the journey now." One milestone per day, day 0 to day 60, for the payable pilots of price list v1.33.

Document Status:

- Created: 28.09.2026
- Language: English
- Classification: INTERNAL
- Status: ACTIVE — journey started 28.09.2026

---

## How to read this

- **Why and how:** `docs/field-notes/2026-09-28-pilot-delivery-model-60-days.md`. **Which pilots and in
  what order:** `docs/plans/PILOT_PRODUCT_READINESS_PRIORITY.md`. **What each gate means:** G0–G10 in
  `docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md`.
- **Pilots:** Aegis = `DWS-AEGIS-PILOT-001` (customer-owned infrastructure), AIS =
  `AIS-OUTCOME-PILOT`, EU = `DWS-EU-PILOT`, US = `DWS-US-PILOT` (starts when a slot frees),
  Ontology = `LF-ONTOLOGY-PILOT` (last; scoring criteria only in these 60 days).
- **Shared work first:** EU, US and AIS are configurations of one platform (Chapter 3: tenant,
  deployment, entitlements, sovereignty policy, onboarding, SLOs, metering, rollback). Aegis is
  Chapter 4 (offline execution, identity/capability policy, kill authority, tamper-evident audit,
  maintenance entitlement, fail-safe). Building Chapter 3 once moves three pilots.
- **Owners:** **C** = Claude Code (writes specs whose checks fail today, reviews, merges hourly,
  security/RED work). **L** = `opencode-loop` on the DGX (builds each spec until the done gate says
  DONE, opens the PR). **H** = HIC (decides, reviews on Sundays, sends every customer message).
- **Rhythm:** Monday specs for the week · Tuesday–Friday loop builds, Claude reviews and merges ·
  Saturday loop runs, watch only · **Sunday HIC batch**: readiness score per pilot, decisions.
- **A day is done** when its check passes — a command result, never a summary. Readiness numbers
  come from the scorer, not from a model.
- **Day 60 = ready to deploy:** G0–G9 passed and the G10 _staging rehearsal_ done on cloud and on a
  customer-owned device. Customer sign-off happens in a paid pilot, after a contract.

## Two tracks: build and buyer (added 28.09.2026 after Boardy's review)

The weekly tables below are the **build track** (G0–G10). They cannot finish a pilot on their own:
a pilot is paid and converted on the **buyer track**, and that track is gated by people, not code.
Three pilots at once is a people limit before it is a build limit.

**The order (pinned):** three named owners, one per active pilot → Aegis gates with a KPI written in
the buyer's words → first acceptance evidence → first verified path → first learning delta.

### Track A — Aegis, the money and evidence track

| Milestone | What it is                                                                                                                           | Target                  | Build dependency                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ------------------------------------------ |
| **M0**    | One owner holding the decision right; scope signed; one control-room workflow with local identity, evidence log and outage behaviour | Day 14 (11.10)          | G1–G2 (days 3–4)                           |
| **M1**    | Gates cleared; one acceptance KPI written in the buyer's words                                                                       | Day 30 (28.10)          | G3–G6 for Aegis                            |
| **M2**    | Acceptance evidence in hand, **witnessed by the buyer's risk owner, not by us**                                                      | After day 60 — needs M0 | G10 rehearsal (day 52) + capacity evidence |
| **M3**    | The credited pilot turns into the deployment decision (€19,990 credited against the €59,990 licence)                                 | After M2                | —                                          |

**Aegis's real gap is capacity evidence**, which is exactly what the buyer probes at M2. More
automation does not move it: it needs a measured run on the buyer's reference hardware, with a method
their risk owner can repeat. Day 40 and day 52 carry it.

### Track B — Decision Transfer (no sale, no licence)

Runs alongside and does not wait for Aegis: observation → ownership unclear → transfer recommended →
owner acknowledged. It can come from an existing relationship (for example Kemira).

| Milestone                         | What it is                                                                         | Target         |
| --------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| **B1 Decision Transfer Verified** | One observed decision, ownership unclear, transfer recommended, owner acknowledged | Day 21 (19.10) |
| **B2 First verified journey**     | The acknowledged decision followed end to end with evidence                        | Day 35 (02.11) |
| **B3 First learning delta**       | What changed in the model or the process because of the journey                    | Day 49 (16.11) |

## Week 1 — Foundations (Day 0–6, 28.09–04.10)

| Day | Date      | Milestone                                                                                                       | Owner | Done when                                             |
| --- | --------- | --------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------- |
| 0   | Mon 28.09 | Journey starts: delivery model, storyboard, calendar (day 30, 45, 60)                                           | H C   | Field note and this storyboard on the branch          |
| 1   | Tue 29.09 | #2210 merged — done gate runs ESLint, blog §16 tasks queued                                                     | H C   | `agent-done-gate --full` includes lint on `main`      |
| 2   | Wed 30.09 | G0 lifecycle truth for Aegis, AIS, EU, US: owner, state, dependencies                                           | C     | Lifecycle registry rows complete; scorer G0 = pass ×4 |
| 3   | Thu 01.10 | **Three named owners, one per active pilot** (Aegis owner hunt starts); G1 buyer, problem and outcome per pilot | H C   | Three names with decision right; G1 cards approved    |
| 4   | Fri 02.10 | G2 commercial contract: terms from price list v1.33, acceptance criteria, cancellation                          | C     | Scorer G2 = pass ×4; prices only from `products.json` |
| 5   | Sat 03.10 | Chapter 3 spec pack written: tenant model, deployment, entitlements (3 loop specs)                              | C     | Specs in `.claude/done/`, every check fails today     |
| 6   | Sun 04.10 | HIC batch 1: baseline readiness per pilot; approve the Chapter 3 specs                                          | H     | Baseline recorded in the storyboard log below         |

## Week 2 — Chapter 3 core (Day 7–13, 05.10–11.10)

| Day | Date      | Milestone                                                                      | Owner | Done when                                         |
| --- | --------- | ------------------------------------------------------------------------------ | ----- | ------------------------------------------------- |
| 7   | Mon 05.10 | Loop starts Chapter 3: shared tenant and deployment model                      | L     | Loop PR opened, gate DONE                         |
| 8   | Tue 06.10 | Entitlements: pilot vs starter vs licence as configuration, not forks          | L C   | Entitlement tests pass in CI                      |
| 9   | Wed 07.10 | Sovereignty policy: EU-only data residency enforced for the EU pilot           | L C   | Residency test fails on a non-EU region           |
| 10  | Thu 08.10 | Chapter 4 spec pack: offline execution, kill authority, tamper-evident audit   | C     | Specs with failing checks; security review booked |
| 11  | Fri 09.10 | Onboarding flow: tenant created from an order, entitlement attached            | L     | End-to-end test: order → tenant                   |
| 12  | Sat 10.10 | Metering: usage recorded per tenant for monthly billing                        | L     | Metering test passes                              |
| 13  | Sun 11.10 | HIC batch 2: Chapter 3 demo in staging; pilot one-pagers approved for outreach | H     | Readiness delta logged                            |

## Week 3 — G3 working delivery (Day 14–20, 12.10–18.10)

| Day | Date      | Milestone                                                                                                          | Owner | Done when                                       |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------ | ----- | ----------------------------------------------- |
| 14  | Mon 12.10 | **M0 Aegis** — owner with decision right, scope signed, one control-room workflow agreed; EU pilot G3 provisioning | H L C | Signed scope; repeatable provisioning run twice |
| 15  | Tue 13.10 | AIS G3: outcome definition and KPI measurement wired to evidence                                                   | L     | KPI read from data, not typed in                |
| 16  | Wed 14.10 | AIS refund trigger: KPI not moved → refund case opened                                                             | L C   | Test: unmoved KPI opens refund case             |
| 17  | Thu 15.10 | Aegis G3: offline execution — agent runs with uplink cut                                                           | L C   | Severed-uplink test passes on the DGX           |
| 18  | Fri 16.10 | Aegis kill authority: human stop takes effect within the stated time                                               | L C   | Kill test measured and logged                   |
| 19  | Sat 17.10 | Rollback: every pilot deployment can be rolled back                                                                | L     | Rollback test per pilot                         |
| 20  | Sun 18.10 | HIC batch 3: G3 status ×3; first pilot proposals drafted for HIC to send                                           | H C   | Drafts in `docs/sales/`, sent by HIC only       |

## Week 4 — G4 agent access, G5 security (Day 21–27, 19.10–25.10)

| Day | Date      | Milestone                                                                     | Owner | Done when                                      |
| --- | --------- | ----------------------------------------------------------------------------- | ----- | ---------------------------------------------- |
| 21  | Mon 19.10 | **B1 Decision Transfer Verified** (Track B); G4 CLI with typed JSON per pilot | H L   | Owner acknowledgement recorded; CLI smoke test |
| 22  | Tue 20.10 | G4: MCP tool and registered skill per pilot                                   | L C   | `skills/manifest.json` entries; MCP call test  |
| 23  | Wed 21.10 | G5 threat model per pilot (Aegis: full; cloud pilots: shared)                 | C     | Threat models reviewed by security agent       |
| 24  | Thu 22.10 | G5: auth, RLS, secrets from environment only, data class per pilot            | C L   | RLS tests; gitleaks clean                      |
| 25  | Fri 23.10 | G5: KYA verdict and Article 12 log on every agent action in the pilots        | L C   | Audit record per action in tests               |
| 26  | Sat 24.10 | Aegis tamper-evident audit: hash chain verified after restart                 | L     | Chain verification test                        |
| 27  | Sun 25.10 | HIC batch 4: security review results; decide any RED-zone items               | H     | Decisions logged                               |

## Week 5 — G6 verification, day-30 check (Day 28–34, 26.10–01.11)

| Day | Date      | Milestone                                                                                          | Owner | Done when                                             |
| --- | --------- | -------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------- |
| 28  | Mon 26.10 | G6: unit, contract and integration tests complete for P0 pilots                                    | L     | Coverage of pilot code paths ≥ agreed floor           |
| 29  | Tue 27.10 | G6: end-to-end test per P0 pilot in staging                                                        | L C   | Three E2E runs green                                  |
| 30  | Wed 28.10 | **Day-30 check + M1 Aegis:** P0 pilots at G0–G6; Aegis acceptance KPI written in the buyer's words | H C   | Scorer output; KPI text signed off by the buyer owner |
| 31  | Thu 29.10 | US pilot activated if a slot is free (configuration of Chapter 3)                                  | C L   | US pilot at G3 on US cloud                            |
| 32  | Fri 30.10 | Aegis maintenance entitlement: updates only with a valid entitlement                               | L     | Entitlement check test                                |
| 33  | Sat 31.10 | Aegis fail-safe: defined safe state on fault                                                       | L     | Fault-injection test                                  |
| 34  | Sun 01.11 | HIC batch 5: readiness ×4; outreach status (signed pilots needed for G10 sign-off)                 | H     | Pipeline logged                                       |

## Week 6 — G7 operations (Day 35–41, 02.11–08.11)

| Day | Date      | Milestone                                                                                                 | Owner | Done when                                                   |
| --- | --------- | --------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------- |
| 35  | Mon 02.11 | **B2 first verified journey** (Track B); G7 deployment pipeline per target                                | H L C | Journey evidence; deploy from `main` to each staging target |
| 36  | Tue 03.11 | Health checks and telemetry per pilot                                                                     | L     | Health endpoint and dashboard                               |
| 37  | Wed 04.11 | Alerts and SLOs written and wired                                                                         | C L   | Alert fires in a drill                                      |
| 38  | Thu 05.11 | Backup and restore tested                                                                                 | L     | Restore drill passes                                        |
| 39  | Fri 06.11 | Incident runbook per pilot in `Admin/`                                                                    | C     | Runbook reviewed                                            |
| 40  | Sat 07.11 | **Aegis capacity evidence:** measured run on reference hardware, method the buyer's risk owner can repeat | L C   | Capacity report with raw measurements                       |
| 41  | Sun 08.11 | HIC batch 6: G7 status; confirm the day-45 hardware                                                       | H     | Hardware named                                              |

## Week 7 — G8 fulfilment, hardware (Day 42–48, 09.11–15.11)

| Day | Date      | Milestone                                                       | Owner | Done when                             |
| --- | --------- | --------------------------------------------------------------- | ----- | ------------------------------------- |
| 42  | Mon 09.11 | G8: quote or checkout per pilot from `products.json`            | L C   | Checkout/quote test per SKU           |
| 43  | Tue 10.11 | Order → CRM handoff → tenant and entitlement                    | L     | End-to-end order test                 |
| 44  | Wed 11.11 | Invoice (Lifetime Oy identifiers), renewal and support path     | C L   | Test invoice matches legal identity   |
| 45  | Thu 12.11 | **DGX / edge node reserved for own-infrastructure staging**     | H     | Device named and reachable            |
| 46  | Fri 13.11 | Aegis own-device install: from package to running, offline      | L C   | Install script on the reserved device |
| 47  | Sat 14.11 | Ontology pilot: scoring criteria defined (maturation, no build) | C     | Criteria doc; scorer can score it     |
| 48  | Sun 15.11 | HIC batch 7: G8 status; pilot pages ready for review            | H     | Review list                           |

## Week 8 — G9 product surface, G10 rehearsals (Day 49–55, 16.11–22.11)

| Day | Date      | Milestone                                                                | Owner | Done when                                       |
| --- | --------- | ------------------------------------------------------------------------ | ----- | ----------------------------------------------- |
| 49  | Mon 16.11 | **B3 first learning delta** (Track B); G9 pilot pages, five languages    | H L C | Delta recorded; truth-lint clean                |
| 50  | Tue 17.11 | **G10 rehearsal — EU cloud**                                             | L C   | Staging rehearsal passed, evidence pack written |
| 51  | Wed 18.11 | **G10 rehearsal — AIS on EU cloud** (KPI + refund path)                  | L C   | Evidence pack                                   |
| 52  | Thu 19.11 | **G10 rehearsal — own infrastructure (Aegis on the device, uplink cut)** | L C   | Severed-uplink evidence automated               |
| 53  | Fri 20.11 | **G10 rehearsal — US cloud** (if activated)                              | L C   | Evidence pack                                   |
| 54  | Sat 21.11 | Rollback and stop drill on every target                                  | L     | Drill logs                                      |
| 55  | Sun 22.11 | HIC batch 8: read the evidence packs                                     | H     | Findings list                                   |

## Week 9 — Close (Day 56–60, 23.11–27.11)

| Day | Date      | Milestone                                                                    | Owner | Done when                                     |
| --- | --------- | ---------------------------------------------------------------------------- | ----- | --------------------------------------------- |
| 56  | Mon 23.11 | Fix HIC findings from the evidence packs                                     | L C   | Findings closed or accepted                   |
| 57  | Tue 24.11 | Handover pack per pilot: install, operate, stop, support                     | C     | Pack in `docs/pilots/`                        |
| 58  | Wed 25.11 | Final scorer run; readiness report per pilot                                 | C     | Report from the scorer                        |
| 59  | Thu 26.11 | HIC review of the readiness report                                           | H     | Decisions recorded                            |
| 60  | Fri 27.11 | **Day 60: pilots ready to deploy — cloud and customer-owned infrastructure** | H     | G0–G9 pass + G10 rehearsal evidence per pilot |

## Storyboard log

Each Sunday the HIC batch adds one line: date, readiness per pilot (scorer), decisions.

| Date                   | Aegis | AIS | EU  | US  | Ontology   | Owners named                         | Buyer track                                   | Decisions                                                    |
| ---------------------- | ----- | --- | --- | --- | ---------- | ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| 28.09 (day 0)          | 56%   | 55% | 55% | 55% | not scored | 0 / 3                                | M0 and B1 not started                         | Journey started; 60-day target set by HIC; buyer track added |
| 28.09 (day 0, evening) | 56%   | 55% | 55% | 55% | not scored | 0 / 3 (Aegis profile hunt by Boardy) | B1: Kemira observation sent (VP product line) | HIC: hunt owners now                                         |
