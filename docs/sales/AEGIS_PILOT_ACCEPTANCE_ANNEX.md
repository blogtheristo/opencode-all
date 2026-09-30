# Aegis Pilot — Acceptance-Protocol Annex and Phase 0 Scope Template (DWS-AEGIS-PILOT-001)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/festive-mccarthy-h6y6yu | Date: 30.09.2026 | Changes: Created from the H1 approval Artifact (https://claude.ai/artifact/VJocu2RWt8CxE8aFye8cha), approved by the HIC 30.09.2026 together with the proposed answers to its decisions: safe halt in condition (iii), one retake within 10 business days after NOT_TAKEN or INVALID, and KYA-S1 TC4-6. Readiness plan H1, gates G1 and G2. Price, credit and scope are unchanged and stay in `Store/PRODUCT_AEGIS_PILOT.md`. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD + DWS_ROLES_REGISTRY | HIC-approved-drift: none

Document Status:

- Created: 30.09.2026
- Last Modified: 30.09.2026
- Language: English
- Publication Status: ACTIVE (contract attachment)
- Classification: CUSTOMER-FACING — attach to the pilot order
- Owner: Lifetime Oy — Aegis & KYA Team

---

## Attachment A — Severed-Uplink Acceptance Protocol

### A1 Purpose

This annex defines how the acceptance test in Phase 3 of the Aegis Pilot is prepared, run, judged and recorded. It turns the binary acceptance KPI into steps both parties can check. The signed Phase 0 scope (Attachment B) supplies the site-specific values.

### A2 Definitions

| Term              | Meaning                                                                                                                                                                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Acceptance window | The agreed period during which the uplink is severed. Its length and date are set in the signed scope.                                                                                                                                                                                                          |
| Isolation method  | How the uplink is severed. The method is chosen from the ranked ladder (physical disconnect, deny-all egress at the edge router, VLAN isolation, host-level egress block) and recorded with what it does and does not demonstrate. It is enforced by the Customer's administrator, above the system under test. |
| Core step         | A workflow step that must complete while the uplink is severed. Non-core steps may be deferred and reconciled after reconnect, in the order set in the scope.                                                                                                                                                   |
| Operator          | The Customer's named person who holds stop authority, using a credential issued for this site. The Operator performs the stop personally.                                                                                                                                                                       |
| Witness           | The Customer's named person who observes the acceptance run and co-signs the record (the Operations Director or equivalent).                                                                                                                                                                                    |
| Evidence record   | The Article 12 ledger written on site during the run. Every entry is hash-chained and signed with the site key that is pinned in the signed scope.                                                                                                                                                              |
| Acceptance record | The signed document the system produces at the end of the run. It states the outcome, the three condition results, the isolation method and the ledger head hash.                                                                                                                                               |

### A3 Preconditions

The acceptance run does not start until all of the following hold:

1. The Phase 0 scope is signed by both parties, and the site key id recorded in it matches the key installed on site.
2. The Phase 1 exit gate has passed: an agent runs, is identified, writes a record and can be stopped with the uplink already down.
3. The site health check (`doctor`) passes on the day, including state-directory permissions, local storage for the evidence record and the key pin.
4. At least one rehearsal run has been completed, and its findings have been fixed or accepted in writing.
5. The Operator's credential has been issued and the Witness is present.

### A4 Procedure

1. The Customer's administrator applies the isolation method.
2. The system attempts egress to the targets listed in the scope. Every attempt must fail. If any attempt succeeds, no test is taken (outcome NOT_TAKEN).
3. The window starts. The piloted workflow runs. Egress is re-attempted periodically throughout the window.
4. A stop-test agent is started. The Operator issues the stop with their own credential. The system confirms the agent has terminated, records the stop, and revokes the agent's credential.
5. The run holds until the end of the agreed window. Egress is attempted once more.
6. The system writes and signs the acceptance record. The Witness and the Operator read the outcome on screen. The ledger head hash is written down on the sign-off sheet by hand.
7. The administrator restores the uplink. Deferred work replays in the order set in the scope. An entry that has been tampered with is quarantined and never replayed.

### A5 Pass criteria

The run passes only if all three conditions hold. Each is judged from the evidence record, not from what the running software reports about itself.

| Condition                            | Passes when                                                                                                                                                                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (i) Workflow completes               | The workflow reaches its completion state and every core step is done, with the uplink severed.                                                                                                                                               |
| (ii) Record written locally          | The evidence record verifies end to end, every entry is signed, no interval inside the window exceeds the maximum gap set in the scope, and the record is stored on local disk.                                                               |
| (iii) Operator stops a running agent | An accepted stop from the Operator is on record. The agent's termination is confirmed. The agent writes nothing to the record after the stop. The agent's credential no longer verifies, so it cannot resume without a new grant (safe halt). |

### A6 Outcomes

- **PASS** — All three conditions hold. Phase 3 is complete.
- **NEGATIVE_RESULT** — At least one condition failed while isolation held. This is a valid result of the pilot, not a defect, and the acceptance record states which condition failed and why. Phase 4 goes ahead on that basis.
- **NOT_TAKEN** — Egress succeeded before the run, so isolation was not in effect and no test was taken.
- **INVALID** — Isolation lapsed during the window, or the containment policy that ran differs from the proven one. The results cannot be attributed to an isolated site.

After NOT_TAKEN or INVALID, one retake is run within 10 business days at no additional fee. A further retake is scheduled by mutual agreement.

### A7 What the record demonstrates

The acceptance record names the isolation method used, what that method demonstrates and what it does not. It also names the containment level of the workload (sandboxed per step, or thread isolation where the host cannot run sandboxes). A weaker isolation method proves less about the network boundary and the same about the workload. A reader of the record years later can tell which applies.

### A8 Evidence handover

1. The signed acceptance record, and the ledger head hash written on the sign-off sheet.
2. An evidence bundle: the record, the ledger with its sealed segments, the site public key and a signed file manifest. Private keys are never included.
3. The Customer can verify the bundle on a separate computer, with no access to Lifetime systems, against the key id pinned in the signed scope.

_Internal note, remove before sending:_ clause A8.2 depends on the A2 bundle export (PR #2256), which has not merged and still leaves out sealed segments. Promise A8.2 only once that is fixed.

### A9 Data

The evidence record is pseudonymous. It holds credential ids, never names. The mapping from credential id to person stays with the Customer. The record contains digests of inputs and outputs, never the raw process data.

### A10 Sign-off

| Signatory                                     | Name, role                       | Date |
| --------------------------------------------- | -------------------------------- | ---- |
| Witness (Customer)                            |                                  |      |
| Operator (Customer)                           |                                  |      |
| Customer administrator (isolation applied by) |                                  |      |
| For Lifetime Oy                               | Risto Anton Päärni, Founder, CEO |      |

Ledger head hash (written by hand): `________________________________`

---

## Attachment B — Phase 0 Scope and Sign-off

One page, signed at the end of week 2. The acceptance conditions are written in the Customer's operational language. Fields marked with a role use the role ids of the DWS Roles Registry.

### B1 Site and deployment

| Field                           | Value                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Site name and address           |                                                                                                                     |
| Site id (lowercase, 2–63 chars) |                                                                                                                     |
| Site key id (pinned)            | Filled in at `init`, before signature                                                                               |
| Deployment mode                 | Local / Edge · Hybrid · EU-Sovereign Cloud — and why                                                                |
| Host check                      | Linux ≥ 6.2 with Landlock · container runtime · local disk for the record → sandboxed per step, or thread isolation |

### B2 Workflow

The workflow is a terminating sequence with a defined completion state. If no such sequence exists, Phase 0 fails and says so here.

| Step id | What it does | Core / non-core | Needs network         | Reconcile order |
| ------- | ------------ | --------------- | --------------------- | --------------- |
|         |              | core            | no (core steps never) | —               |
|         |              | non-core        | yes / no              | 1               |

Completion state: `________`

### B3 Isolation and window

| Field                               | Value                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Isolation method (rank)             | Physical disconnect · router deny-all · VLAN isolation · host egress block |
| Enforced by (Customer admin)        |                                                                            |
| Demonstrates / does not demonstrate | From the ladder, copied verbatim                                           |
| Egress targets probed               | host:port list                                                             |
| Window: date, length                |                                                                            |
| Maximum gap in the record           | Seconds (at least 2 heartbeats)                                            |

### B4 Acceptance conditions, in site language

| Condition | Wording                                                           |
| --------- | ----------------------------------------------------------------- |
| (i)       | e.g. "the shift report is complete and on the control-room share" |
| (ii)      |                                                                   |
| (iii)     |                                                                   |

### B5 People

| Role                               | Registry id                     | Name |
| ---------------------------------- | ------------------------------- | ---- |
| Workflow owner                     | R11 Plant Director              |      |
| Technical contact                  | R14 Head of IT                  |      |
| Security approver                  | R15 CISO or R16 Head of InfoSec |      |
| Operator(s) with stop authority    | —                               |      |
| Witness                            | R12 Operations Director         |      |
| Customer administrator (isolation) | —                               |      |

### B6 Out of scope

As on the offer: LWM integration; hardware procurement or appliance supply; multi-site rollout; industries beyond the one piloted; custom ERP, BIM or SCADA integrations; the Aegis Implementation Programme (DWS-AEGIS-IMPL-001).

### B7 Signatures

| Signatory        | Name, role, date                 |
| ---------------- | -------------------------------- |
| For the Customer |                                  |
| For Lifetime Oy  | Risto Anton Päärni, Founder, CEO |

---

**Lifetime Oy** · Business ID 0772407-9 · VAT FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
**Founder, CEO:** Risto Anton Päärni · risto.paarni@lifetime.fi · +358 400 319 010
