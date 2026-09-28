# Aegis Pilot — Storyboard, Milestones and the Path to 95 % Readiness

# VERSION AND AGENT HISTORY

---

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code | Session: claude/aegis-pilot-readiness-plan-03ist6 | Date: 28.09.2026 | Changes: HIC adopted NVIDIA OpenShell as containment layer (C4, §5.4 decision record). Spike started: OpenShell built from source without telemetry in the cloud session. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-readiness-plan-03ist6 | Date: 28.09.2026 | Changes: C1 hard stop landed ahead of M2 (commit 63270600 on #2225): G3 0.75→0.85, G5 0.70→0.75, so readiness 70 %→71 % (7.85 / 11). The isolated rehearsal passes with a stubborn agent terminated in 5 ms; the security review verdict is PASS after one HIGH was fixed. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-readiness-plan-03ist6 | Date: 28.09.2026 | Changes: Created. Delivery storyboard for DWS-AEGIS-PILOT-001, G0–G10 gate scorecard (calibrated against the HIC's 56 %), milestone dates to 95 % and 100 %, and the implementation patch plan: six DGX loop specs plus three Claude Code security patches and three HIC/sales items. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD + DWS_ROLES_REGISTRY + DWS_COST_POLICY_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Last Modified: 28.09.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Owner: Lifetime Oy — Aegis & KYA Team

---

## 1. Summary

| Milestone                                          | Target date        | P80 date       | Readiness           |
| -------------------------------------------------- | ------------------ | -------------- | ------------------- |
| M0 — local-first kit merged (PR #2225)             | 28.09.2026         | 02.10.2026     | 70 % (71 % with C1) |
| M1 — preflight, conformance, skill, nightly run    | Sun 04.10.2026     | 11.10.2026     | 77 %                |
| M2 — hard stop, retention, export, service unit    | Sun 11.10.2026     | 18.10.2026     | 85 %                |
| M3 — commercial pack and fulfilment wiring         | Sun 18.10.2026     | 25.10.2026     | 90 %                |
| **M4 — witnessed staging acceptance on edge HW**   | **Sun 25.10.2026** | **08.11.2026** | **95 %**            |
| M5 — first customer acceptance (Phase 3, wk 10–11) | signature + 11 wk  | —              | 100 %               |

The 95 % target is achievable without a customer. The last 5 % is G10 customer acceptance, and it cannot be produced internally. It lands about 11 weeks after the first customer signs: a signature by 16.11.2026 gives an acceptance run around 01.02.2027. This fits the 14–18 week "deployment evidence" band in `PILOT_PRODUCT_READINESS_PRIORITY.md` only if the customer signs in October.

## 2. How readiness is scored

The model scores the eleven G0–G10 gates from `PRODUCT_PRODUCTION_READINESS_PROGRAM.md`. Gates are weighted equally, each takes a value from 0 to 1, and a value moves only when a file, command or test backs it.

**Calibration.** The same scoring applied to the state before PR #2225 gives 6.05 / 11 = **55 %**. The HIC scored the pilot at 56 %, so the method reproduces the existing score.

| Gate                 |  Before #2225   |   Now (#2225)   |      At 95 %       | What moves it (evidence)                                                                                         |
| -------------------- | :-------------: | :-------------: | :----------------: | ---------------------------------------------------------------------------------------------------------------- |
| G0 Lifecycle truth   |      1.00       |      1.00       |        1.00        | Registry, lifecycle, owner — already in `config/truth/`                                                          |
| G1 Buyer and outcome |      0.90       |      0.90       |        1.00        | Named R-IDs per storyboard panel (§3); binary KPI already in catalogue                                           |
| G2 Commercial        |      0.85       |      0.85       |        1.00        | H1: acceptance-protocol annex + Phase 0 scope/signoff template (HIC-approved)                                    |
| G3 Working delivery  |      0.30       |      0.75       |        1.00        | Kit (#2225) → C1 hard stop, A3 handler conformance                                                               |
| G4 Agent access      |      0.20       |      0.60       |        0.95        | CLI + JSON (#2225) → A6 skill registration; MCP exposure deferred (0.05 left)                                    |
| G5 Security          |      0.50       |      0.70       |        1.00        | Security review PASS (#2225) → C3 threat model, A1 doctor, C2 retention                                          |
| G6 Verification      |      0.20       |      0.80       |        1.00        | 40 tests + netns run (#2225) → A1/A2/A3 suites, A4 nightly rehearsal                                             |
| G7 Operations        |      0.10       |      0.30       |        0.95        | A2 export bundle, A5 systemd unit + health timer, C2 ledger segments/retention, A4 nightly                       |
| G8 Fulfilment        |      0.80       |      0.80       |        1.00        | H2: fulfilment runbook row points to the kit runbook and a provisioning checklist                                |
| G9 Product surface   |      0.90       |      0.90       |        1.00        | Five-language page exists; truth-check of page claims against what the test demonstrates per isolation rung      |
| G10 Acceptance evid. |      0.00       |      0.10       |        0.60        | H3: witnessed staging acceptance on DGX Spark/GN100, `router-deny-all` rung, bundle verified on a second machine |
| **Total**            | **6.05 → 55 %** | **7.70 → 70 %** | **10.50 → 95.5 %** |                                                                                                                  |

## 3. Storyboard — one pilot, start to decision

Each panel lists who is in the room (Roles Registry R-ID), what they see, and the evidence left behind. The panels follow `Store/PRODUCT_AEGIS_PILOT.md`, and each one maps to a runbook section.

| #   | When       | Scene                               | Who                                                                 | What happens                                                                                                                                                                             | Evidence left behind                                                      |
| --- | ---------- | ----------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Week −2    | "What happens when the link drops?" | R11 Plant Director, R15 CISO                                        | The buyer reads the Aegis Pilot page. The question is testable, and €19,990 fixed is below the approval threshold for a hardware programme.                                              | Checkout order or quote request; acknowledged within 1 business day       |
| 2   | Week 0–2   | Scoping workshop                    | R11 (workflow owner), R16 Head of InfoSec, shift operator, Lifetime | Every workflow step is marked core or non-core. `validate-scope` rejects any core step that needs the network. The isolation rung is chosen and the customer's admin is named.           | Signed scope with the site key id pinned (runbook §3)                     |
| 3   | Week 3–5   | The box on site                     | R14 Head of IT, operator                                            | `init` and `issue-operator` run on the customer's hardware. `doctor` passes. The rehearsal runs with the uplink already down: the four locals are shown.                                 | Ledger genesis; first rehearsal record: PASS or a week-5 platform finding |
| 4   | Week 6–9   | Their workflow, our substrate       | R11, R09 Application Engineering                                    | Customer handlers are written, `check-handlers` shows they honour the stop, and the workflow runs online. The owner accepts each decision point.                                         | `agent.decide` events with input/output digests                           |
| 5   | Week 10    | Rehearsal                           | Lifetime, operator                                                  | A short outage window is run. Problems are expected here; they are fixed.                                                                                                                | Rehearsal record                                                          |
| 6   | Week 11    | **The cable moment**                | R12 Operations Director (witness), customer admin, operator         | The admin applies the signed block. Egress is attempted and fails. The workflow completes. The operator types `stop`, and the agent stops and writes nothing more. The record is signed. | Acceptance record: PASS or NEGATIVE_RESULT; ledger head hash handed over  |
| 7   | Week 11    | Reconnect                           | Customer admin                                                      | The uplink is restored. Deferred sync work replays in the agreed order. Any tampered entry would be quarantined, not replayed.                                                           | `system.reconcile` events                                                 |
| 8   | Week 12–13 | Decision                            | R12, R23 CFO, R20 CPO                                               | Sizing is based on measured load, and the deployment mode is confirmed. If they proceed, €19,990 is credited and €40,000 of onboarding remains.                                          | Report citing the record id; evidence bundle                              |
| 9   | +3 years   | The auditor                         | R06 Head of Legal, external auditor                                 | `verify-bundle --expect-key-id` runs on a laptop with no DWS access. It shows what was demonstrated and which isolation rung was used.                                                   | Independent verification output                                           |

## 4. Current usage (what exists today)

- **Sales surface:** `dws10.com/products/dws-aegis-pilot-001.html` in EN, FI, SV, DE and FR. The catalogue entry carries the binary `acceptanceKpi`.
- **Payment:** `/checkout/?product=DWS-AEGIS-PILOT-001` through the generic Revolut/PayPal fallback. There is no dedicated payment link (see `config/truth/product-fulfilment.json`).
- **Fulfilment:** Chapter 4 row in `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md`. The owner is the Aegis & KYA Team, with a 1-business-day acknowledgement.
- **Delivery:** since PR #2225, `npm run aegis:pilot` and `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`. Before it there was no executable delivery path for the KPI.
- **Sales pack:** `sales-package-v1.0/aegis-sales-package.md` and the private and public variants.

## 5. Implementation patches

Ownership follows the CLAUDE.md Coding Delegation Rule. Multi-file coding goes to `opencode-loop` on the DGX. Security-sensitive changes to stop authority and evidence integrity are coded by Claude Code. Customer-facing text needs HIC approval.

### 5.1 DGX loop (specs in `.claude/done/opencode/`; every check was confirmed failing on today's code)

| ID  | Branch                                     | Gate(s) | Delivers                                                                                  | Milestone |
| --- | ------------------------------------------ | ------- | ----------------------------------------------------------------------------------------- | --------- |
| A1  | `opencode/aegis-pilot-doctor`              | G5, G7  | `doctor`: state-dir/key modes, local FS, ledger verify, key pin, isolation tool           | M1        |
| A3  | `opencode/aegis-pilot-handler-conformance` | G3, G6  | `check-handlers`: registered, honours abort within 500 ms, typed network errors           | M1        |
| A4  | `opencode/aegis-pilot-nightly-rehearsal`   | G6, G7  | `scripts/daily/aegis-pilot-rehearsal.sh` — real isolated rehearsal every night on the DGX | M1        |
| A6  | `opencode/aegis-pilot-skill`               | G4      | `skills/aegis-pilot/SKILL.md` + manifest entry                                            | M1        |
| A2  | `opencode/aegis-pilot-export-bundle`       | G7, G10 | `export` / `verify-bundle`: signed, hash-manifested auditor bundle, no private keys       | M2        |
| A5  | `opencode/aegis-pilot-service-unit`        | G7      | Hardened systemd unit + health timer + service-user layout                                | M2        |

### 5.2 Claude Code (security; must land before the cloud-agent block on 12.10.2026)

`DWS_COST_POLICY_STANDARD.md` blocks cloud agents from 12.10.2026. Anything below that is not merged by 11.10 moves to a DGX-local session.

| ID  | Gate(s)    | Delivers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Milestone |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| C1  | G3, G5     | **✅ Done 28.09.2026 (`63270600`, in #2225). Hard stop.** Each step runs in a `worker_threads` worker that the kill authority terminates. This closes the "cooperative inside a step" limit in runbook §8. Condition (iii) then holds even for a handler that ignores its signal.                                                                                                                                                                                                                                                                                                              | M2        |
| C2  | G5, G7     | **Ledger segments and retention.** The ledger is sealed and rolled at a size or age limit, and each new segment chains to the previous head. Retention classes follow Article 12 Logging Standard §4: 6 months by default, 5 years for identity and `human.override` events.                                                                                                                                                                                                                                                                                                                   | M2        |
| C3  | G5         | **Threat model** document for the kit, covering state-dir writer, key custody, isolation spoofing and operator impersonation. It links the security-review findings and their tests.                                                                                                                                                                                                                                                                                                                                                                                                           | M2        |
| C4  | G3, G5, G6 | **Containment with NVIDIA OpenShell (HIC 28.09.2026: adopt).** Each step runs in an OpenShell sandbox. Its policy is generated from the signed scope: core steps get no network, and files are limited per step. OpenShell's OCSF security events become signed ledger entries, and the prover result goes into the acceptance record. Built without telemetry, with the version pinned. Sites without Linux 6.2+ and Landlock, or without a container runtime, fall back to thread isolation, and the record names the lower containment level. Estimate 6–9 working days; spike in progress. | M4        |

### 5.3 HIC and sales

| ID  | Gate(s) | Delivers                                                                                                                                                               | Milestone |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| H1  | G1, G2  | Acceptance-protocol annex and a Phase 0 scope/signoff template for the contract. Drafted by Claude Code; the HIC approves via the Approval Request Rule. R-IDs per §3. | M3        |
| H2  | G8, G9  | Fulfilment runbook row points to the kit runbook and a provisioning checklist. Page claims are truth-checked against what each isolation rung demonstrates.            | M3        |
| H3  | G10     | **Witnessed staging acceptance.** DGX Spark or GN100 edge node, `router-deny-all` rung at a real router, HIC as witness. The bundle is verified on a second machine.   | M4        |

### 5.4 Why OpenShell (decision record, 28.09.2026)

- **Market:** NVIDIA launched the Open Agent Safety Platform on 28.09.2026 with about 100 partners. They include all three enterprise Linux distributions, most of the security market, and Siemens, Schneider Electric, SAP and Dassault. The runtime layer is becoming the de facto standard, so buyers will ask for it.
- **Fit:** OpenShell is Apache 2.0, runs on arm64 and x86, has documented air-gapped installs, and is driven from its CLI or SDK. It supplies the containment the kit lacks (runbook §8, "stopping is not containing") without our building a sandbox.
- **What stays ours:** the Article 12 ledger, operator stop authority, the severed-uplink acceptance test and the signed record. The partner wall has no EU sovereign-cloud provider and no Nordic industrial group, so that layer remains open. This is PhD §14.55, H14.55.
- **Risks:**
  - It is 0.1.x, so we pin the version.
  - It needs Linux 6.2+ with Landlock and a container runtime, which becomes a Phase 0 check.
  - It has default telemetry, which is compiled out.
  - The project is NVIDIA-led; Apache 2.0 means we can fork it.

## 6. Cadence and risks

- **Cadence** (from `PILOT_PRODUCT_READINESS_PRIORITY.md`): the HIC reviews and merges loop PRs in Sunday batches. The loop gets 1–2 h on weekday mornings. Six loop specs over two weeks means 3 per week, which is within recent loop throughput.
- **Risk: cloud-agent cutoff on 12.10.** If C1 or C2 slips past 11.10, move it to a DGX-local Claude Code or OpenCode session. That costs about one week.
- **Risk: the loop blocks twice on a task.** Under the delegation rule, Claude Code takes the task over. Budget: one week. This is the main reason the P80 date is 08.11.
- **Risk: staging hardware and router.** M4 needs an edge node and a router where a deny-all rule can be applied by someone other than the system under test. If only host-level isolation is available, G10 stays at 0.4 and readiness caps at about 94 % (10.30 / 11).
- **Dependency:** PR #2225 must merge before any loop spec runs. This PR is stacked on it for that reason.

## 7. Related

- `Store/PRODUCT_AEGIS_PILOT.md` — the offer
- `docs/runbooks/AEGIS_PILOT_RUNBOOK.md` — delivery steps
- `docs/plans/PILOT_PRODUCT_READINESS_PRIORITY.md` — P0 slot and cadence
- `docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md` — G0–G10 definitions

---

**Document version:** v1.2 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.**
