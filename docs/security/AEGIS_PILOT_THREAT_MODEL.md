# Aegis Pilot Kit — Threat Model (DWS-AEGIS-PILOT-001, readiness plan C3)

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/festive-mccarthy-h6y6yu | Date: 30.09.2026 | Changes: Created (readiness plan C3, gate G5). Five threat classes asked for in the plan (state-dir writer, key custody, isolation spoofing, operator impersonation, OpenShell gateway trust) plus two found while writing it (authorization replay, resumable stop). Each threat is tied to its mitigation in `src/aegis/pilot/` and to the test that shows it; residual risks are stated, not hidden. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 30.09.2026
- Last Modified: 30.09.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Owner: Lifetime Oy — Aegis & KYA Team

---

## 1. Scope and method

**System under analysis.** The local-first pilot kit: `scripts/aegis-pilot.ts` and `src/aegis/pilot/` as merged to `main` (#2225, #2255, #2257, #2258, #2260, #2261, #2267, #2232, #2289, #2290), plus the Day 4 fixes on branch `claude/festive-mccarthy-h6y6yu`. The auditor bundle (A2, PR #2256) is not merged yet and is covered only where noted.

**Security objective.** The product sells one binary claim: with the uplink severed, (i) the workflow completes, (ii) the Article 12 record is written locally with no gap, and (iii) an operator can stop a running agent. The record of that test is signed. An attacker wins if they can make the record say PASS when one of the three did not hold, or if they can stop the stop.

**Method.** Assets, trust boundaries and attackers first; then STRIDE per threat class. Every mitigation cites the code and the test that fails if the mitigation is removed. "Residual" is what this kit does not prevent. MITRE ATLAS mapping (`DWS_SECURITY_STANDARD.md` §8.3) is left out: the threats here are against the evidence substrate, not against a model.

### 1.1 Assets

| ID  | Asset                                 | Where                                                             | Why it matters                                        |
| --- | ------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| A1  | Site signing key                      | `<state>/site/site.key` (0600)                                    | Signs every ledger event, credential, seal and record |
| A2  | Article 12 ledger and sealed segments | `<state>/ledger/article12.jsonl`, `ledger/segments/`              | Conditions (ii) and (iii) are judged from it          |
| A3  | Credentials and revocation list       | `<state>/credentials/*.json`, `site/revoked.json`                 | Who may act, stop and decide                          |
| A4  | Operator keys                         | Held by the operator; public key bound in the operator credential | A stop or decision is valid only with this signature  |
| A5  | Acceptance record                     | `<state>/acceptance/<id>.json`, digest chained into the ledger    | The customer-facing proof                             |
| A6  | Step outputs                          | Report directory, staged into later steps                         | A poisoned output steers every later step             |
| A7  | Signed scope (site key id pinned)     | Phase 0 artefact                                                  | Binds the run to the key the customer signed for      |

### 1.2 Trust boundaries

1. **Service user ↔ everyone else on the host.** The kit runs as a dedicated service user (A5 systemd unit, #2260). The service user is inside the trusted computing base: anyone who can write the state directory as that user can also read `site.key`. The kit defends the state directory against _other_ users and processes. It does not defend it against root or the service user.
2. **Kit ↔ agent code.** Handlers are untrusted. They run in worker threads (C1) or OpenShell sandboxes (C4).
3. **Kit ↔ OpenShell gateway and CLI.** Gateway output is parsed as untrusted input. The gateway's listing is still the only source for "sandbox gone" (see T5 residual).
4. **Site ↔ operator.** Stop and decision commands cross this boundary as signed files in a local inbox; no network hop.
5. **Site ↔ auditor.** The auditor verifies with the public key and the pinned key id only (`verify-bundle --expect-key-id`, A2).

### 1.3 Attackers

- **AT1 Local non-service process** — malware or another user on the edge box, possibly with write access to a misconfigured state directory.
- **AT2 Misbehaving agent** — a handler that ignores its stop signal, forges its result, or writes outside its outputs.
- **AT3 Insider with operator access** — wants a PASS without a real stop, or wants to act as a different operator.
- **AT4 Compromised or buggy gateway** — OpenShell returns misleading listings or output.
- **AT5 Vendor-side optimist** — us. Wants the record to read PASS. Condition judgments are made from the ledger, not from runtime claims, for this reason.

## 2. Threats, mitigations and tests

Test references are `file: test name`. All test files are under `src/__tests__/`.

### T1 — State-directory writer (AT1)

| #    | Threat (STRIDE)                                                               | Mitigation                                                                                                                                | Test                                                                                                                                                                                                                                                                                |
| ---- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1.1 | Edit, delete or re-hash ledger events (T)                                     | Hash chain plus a site signature on every event; a verifier refuses unsigned rewrites (`evidence-ledger.ts`)                              | `aegis-pilot.test.ts`: detects an edited event…; detects a deleted event; detects a fully re-hashed forgery through the site signature; refuses on open a ledger rewritten without signatures… (security review, high)                                                              |
| T1.2 | Remove, replace or roll back sealed segments (T, R)                           | Seals signed and chained, `prev_segment` genesis links, retention-aware verification (`ledger-segments.ts`, C2)                           | `aegis-pilot-segments.test.ts`: detects an edited sealed segment; detects a removed seal and its segment; detects an active segment replaced by a fresh, unlinked chain; detects deletion of every seal…; catches a rollback of the newest segment when an external anchor is given |
| T1.3 | Plant or replay stop/decision commands in the inbox (S)                       | Operator signature bound to the credential; commandId marked seen only after acceptance; for decisions the ledger is the replay authority | `aegis-pilot.test.ts`: does not let a forged command burn a genuine command id; `aegis-pilot-decision.test.ts`: refuses a replay even when the processed/ file is deleted…                                                                                                          |
| T1.4 | Forge or edit outbox entries so deferred work replays attacker content (T, E) | Outbox entries signed by the site key; bad entries quarantined, never replayed                                                            | `aegis-pilot.test.ts`: quarantines a forged or edited outbox entry instead of replaying it (security review, critical)                                                                                                                                                              |
| T1.5 | Swap a credential file after the grant (S, E)                                 | Credential signatures; `authority.grant` stores the credential digest                                                                     | `aegis-pilot.test.ts`: rejects a credential whose capabilities were edited after issue; `aegis-pilot-authority.test.ts`: flags a credential on file that is not the one granted                                                                                                     |
| T1.6 | Change an earlier step's output between steps (T)                             | **Day 4 (M5):** each promoted file is hashed at promotion; staging into a later step refuses a changed or missing file                    | `aegis-pilot-openshell.test.ts`: refuses to stage an earlier output into a later step after it changed on the host (M5)                                                                                                                                                             |
| T1.7 | Loose permissions let AT1 write at all (E)                                    | `doctor`: state dir not group/world-writable, `site.key` 0600, local FS (A1, #2255); service user layout (A5)                             | `aegis-pilot-doctor.test.ts`: fails when state dir is group writable / world writable; fails when site.key mode is not 0600                                                                                                                                                         |

**Residual.** `site/revoked.json` is an unsigned list. A writer with service-user rights could remove an entry and re-enable a revoked credential. That writer also holds `site.key`, so this is inside boundary 1. The ledger keeps the `authority.revoke` event, so the change is visible to `authority` and to an auditor. It is still not refused at run time. **Proposed:** a signed revocation list, M2.

### T2 — Key custody (AT1, AT3)

| #    | Threat                                                      | Mitigation                                                                                                            | Test                                                                                                                                                                                                 |
| ---- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T2.1 | Site key readable by others                                 | 0600 on creation; `doctor` fails otherwise                                                                            | `aegis-pilot-doctor.test.ts`: passes when site.key mode is 0600; fails when site.key mode is not 0600                                                                                                |
| T2.2 | Run under a different key from the one the customer signed  | Site key id pinned in the signed scope; the run refuses a mismatch                                                    | `aegis-pilot.test.ts`: refuses to run when the site key differs from the key pinned in the signed scope (security review, high); `aegis-pilot-doctor.test.ts`: fails when scope keyId does not match |
| T2.3 | Private key leaves the box in the evidence bundle           | A2 bundle copies only named public files, never `*.key` (spec `.claude/done/opencode/aegis-pilot-export-bundle.json`) | PR #2256 `aegis-pilot-bundle.test.ts`: private key never exported (**not merged**)                                                                                                                   |
| T2.4 | Site key overwritten by a second `init`                     | `init` refuses an existing site authority                                                                             | `aegis-pilot.test.ts`: refuses to overwrite an existing site authority                                                                                                                               |
| T2.5 | A key holder re-signs a chain to hide work after a stop (R) | Tombstone after `human.override` is enforced by verification, so re-signing does not hide post-stop work              | `aegis-pilot-authority.test.ts`: fails verification even when a key holder re-signs a chain with work after the stop; keeps the tombstone across a restart                                           |

**Residual.** The key is a file, not held in a TPM or HSM. A holder of the key can sign a _new_ consistent history. What stops them is the ledger head hash handed over at the cable moment (storyboard panel 6) and an external segment anchor (T1.2). Neither is automatic yet. Key rotation and compromise recovery are not specified. **Proposed:** a TPM-sealed key on the DGX Spark, M4 or later.

### T3 — Isolation spoofing (AT3, AT5)

| #    | Threat                                                        | Mitigation                                                                                                                                                                             | Test                                                                                                                                                                                                                                        |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T3.1 | Claim "uplink down" while egress works                        | Preflight, periodic and postflight probes. NOT_TAKEN before the run, INVALID on a lapse. A refused connection counts as a live path; a refusing proxy fails closed (`uplink-probe.ts`) | `aegis-pilot.test.ts`: records NOT_TAKEN when egress succeeds before the run; records INVALID when isolation lapses during the window; treats a refused connection as a live path…; fails closed on a proxy that refuses…                   |
| T3.2 | Overstate what the isolation rung proves                      | The record carries the rung with `demonstrates` and `doesNotDemonstrate` from `ISOLATION_LADDER`; M4 uses `physical-disconnect`, applied by the HIC, not by the system under test      | `aegis-pilot.test.ts`: accepts the reference scope and warns that it is unsigned and host-level                                                                                                                                             |
| T3.3 | Claim sandbox containment with a different or unproven policy | Pinned prover; each step's runtime policy digest must equal the proven one, otherwise INVALID (`openshell-prover.ts`)                                                                  | `aegis-pilot-prover.test.ts`: marks a run INVALID when a sandbox got a policy other than the proven one; refuses a missing proof and an unpinned prover under OpenShell                                                                     |
| T3.4 | Sandbox forges its own containment evidence                   | Containment evidence is built on the host; sandbox fields are dropped                                                                                                                  | `aegis-pilot-openshell.test.ts`: does not let the sandbox forge containment evidence or malformed fields                                                                                                                                    |
| T3.5 | Claim a proven stop from an empty or misshaped listing        | **Day 4 (M3):** absence counts only after a listing on the same gateway was seen to show a sandbox by name; after create the driver requires the new sandbox to be listed              | `aegis-pilot-openshell.test.ts`: never proves absence before the listing shape has been seen… (M3); does not prove a stop from a nested-name listing… (M3); refuses to run a step when the gateway listing never shows the new sandbox (M3) |
| T3.6 | Hide denied egress attempts inside the sandbox                | **Day 4 (C4):** OCSF events are collected before delete; counts, digest and deny events go into the ledger with the step, including failures and deferrals                             | `aegis-pilot-ocsf.test.ts`: records the OCSF summary with each step decision, collected before the sandbox is deleted; records the deny events of a step that failed                                                                        |

**Residual.** The probes test the targets that are listed. A covert channel that is not listed is not demonstrated, and the record says so in `doesNotDemonstrate`. The OCSF deny wording has not been checked against a live gateway (M4). OCSF is not collected on an operator stop, because the stop is never delayed for evidence.

### T4 — Operator impersonation (AT3, AT2)

| #    | Threat                                            | Mitigation                                                                                                                 | Test                                                                                                                                                                                       |
| ---- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T4.1 | Stop or decide with another operator's identity   | The command is signed by the key bound in the site-issued operator credential; a signature from a different key is refused | `aegis-pilot.test.ts`: rejects a command signed by a key other than the one bound in the credential; `aegis-pilot-decision.test.ts`: refuses a forged signature…                           |
| T4.2 | An agent grants itself stop or decision authority | `agent.stop` and `decision.record` are operator-only capabilities                                                          | `aegis-pilot.test.ts`: never grants kill authority to an agent; `aegis-pilot-decision.test.ts`: never lets an agent credential hold decision authority                                     |
| T4.3 | Stale, replayed or revoked operator commands      | 10-minute freshness window, clock-skew bound, replay set, revocation check                                                 | `aegis-pilot.test.ts`: rejects stale commands, replays, revoked operators and agent credentials; `aegis-pilot-decision.test.ts`: refuses a stale command, a replay, and a revoked operator |
| T4.4 | Automated "operator" in an acceptance run         | Acceptance requires `await-operator` mode, a hard stop and a named witness                                                 | `aegis-pilot.test.ts`: refuses an acceptance run without a witness or with an automated stop; refuses an acceptance run with the cooperative stop                                          |
| T4.5 | Rubber-stamped approvals presented as oversight   | `modify` with digest, reasons required, `manual_entry` at low strength, rubber-stamp signal (§5.1 runbook)                 | `aegis-pilot-decision.test.ts`: flags ten decisions with no rejection or modification as a possible rubber stamp; judges the review per agent…                                             |

**Residual.** Theft of the operator's key on the operator's own device is out of scope; the credential TTL limits how long a stolen key works. The ledger is pseudonymous (`aegis-pilot-authority.test.ts`: keeps the Article 12 ledger pseudonymous). Tying the pseudonym to a person needs the credential files, which is intended (GDPR).

### T5 — OpenShell gateway trust (AT2, AT4)

| #    | Threat                                                                          | Mitigation                                                                                                                                                                          | Test                                                                                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T5.1 | Forged or duplicated result line                                                | Exactly one `AEGIS_RESULT` line, schema-validated; success with a non-zero exit is refused                                                                                          | `aegis-pilot-openshell.test.ts`: refuses a step whose output carries a second, forged result line; does not accept a success claim from a process that exited non-zero                                                                   |
| T5.2 | Output escape: traversal, links, oversize (T, D)                                | Copy-back into a fresh staging directory; regular files only, links never followed, bounded count and bytes; child output capped at 8 MiB (#2289)                                   | `aegis-pilot-openshell.test.ts`: walks the copy-back without following links…; rejects the whole copy-back on one bad entry…; rejects oversized output and too many files; command runner kills a child whose output exceeds the cap     |
| T5.3 | Poisoned or overwritten outputs reach later steps (T)                           | Failed steps do not promote (#2290, M4). **Day 4 (M5):** no overwrite of an earlier output (unchanged hand-back allowed), type conflicts refused before any write, temp-then-rename | `aegis-pilot-openshell.test.ts`: does not promote the files of a step that reported failure; refuses a copy-back that would overwrite an earlier step's output (M5); refuses a file/directory type conflict before writing anything (M5) |
| T5.4 | Stop "proven" while the sandbox lives (create lands late, transient empty page) | A pending create is settled before delete; two consecutive absent listings (#2290, M2); positive control (M3, T3.5); a failed listing never counts as absence                       | `aegis-pilot-openshell.test.ts`: needs two consecutive complete listings without the sandbox; proves a stop during provisioning only after the create client has exited; does not prove a stop from an unrelated CLI error…              |
| T5.5 | Network policy reaches internal hosts under an alternate spelling               | `internalHost` refuses octal, hex, short and integer IPv4, 192.0.0/24, 198.18/15, ≥224, loopback, metadata and private ranges (#2290)                                               | `aegis-pilot-openshell.test.ts`: refuses alternate spellings of internal addresses and reserved ranges; refuses loopback, metadata and private-network endpoints                                                                         |
| T5.6 | Shell injection through names, limits or endpoints                              | Argument arrays only; random 19-character sandbox names; validated step ids and limits                                                                                              | `aegis-pilot-openshell.test.ts`: keeps sandbox names random and within the gateway limit, and refuses unsafe step ids; rejects malformed endpoints                                                                                       |

**Residual.** A compromised gateway that lies consistently can list a sandbox and then hide it while it keeps running. Two things narrow this. The local create client is killed, and condition (iii) is judged from the ledger: a stopped agent that writes anything fails the run. A sandbox that runs silently and writes nothing is still not detected. The supply chain relies on pinning OpenShell 0.1.x and building it from source without telemetry (plan §5.4); the arm64 rebuild for M4 is still open.

### T6 — Authorization replay inside the validity window (AT3, AT2)

| #    | Threat                                                   | Mitigation                                                                                                                                                                                                                                                                  | Test                                                                                                                                                                                      |
| ---- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T6.1 | Re-use a valid authorization to act twice (KYA-S1 TRS-4) | **Day 4:** `lease.ts`. The lease is single-use, signed by the site, valid for at most 15 min and bound to an action and a subject digest. `consumeAndExecute` consumes it with an O_EXCL create before the action runs, logs `tool.invoke`, and never retries automatically | `aegis-pilot-lease.test.ts`: executes once and refuses the second use as a replay…; lets exactly one of two concurrent consumers execute; keeps the lease consumed when the action fails… |

**Residual.** Nothing in the pilot workflow issues leases yet. The primitive exists and is tested, but wiring accepted decisions (`human.decide accept`) to a lease is an M2/M3 item.

### T7 — A stop that leaves a resumable agent (AT2) — EU AI Act Art. 14(4)(e)

| #    | Threat                                                    | Mitigation                                                                                                                                                                                               | Test                                                                                                                                                                         |
| ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T7.1 | The agent is stopped but can restart under the same grant | **Day 4:** safe halt. An accepted stop revokes the stopped agent's credential and logs `authority.revoke` with the operator id. Condition (iii) requires `safeHalt` = terminated, quiescent and disarmed | `aegis-pilot.test.ts`: halts in a safe state: a stopped agent is disarmed and the revocation is on record (Art. 14(4)(e)); PASSes when isolated… (asserts `safeHalt`)        |
| T7.2 | A handler ignores its stop signal                         | Hard stop: a worker thread is terminated (C1) or a sandbox deleted (C4); termination must be confirmed, not only requested                                                                               | `aegis-pilot.test.ts`: terminates a step that spins synchronously forever…; never hangs or claims a stop when termination is rejected or unconfirmed (security review, high) |

**Residual.** "Safe state" here covers the software agent only. Any physical plant state the agent was steering belongs to the customer's safety system and is named in the Phase 0 scope. The kit does not claim it.

## 3. Open items this model raises

| Item                                                                                                                         | Threat      | Owner / when                     |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------- |
| PR #2256 exports sealed segments from `<state>/segments` instead of `<state>/ledger/segments`; its test was weakened to pass | T1.2, T2.3  | Claude Code takeover rule, 02.10 |
| Signed revocation list                                                                                                       | T1 residual | M2                               |
| TPM-sealed site key on the DGX Spark; key rotation runbook                                                                   | T2 residual | M4+                              |
| Verify the OCSF deny wording on a live gateway                                                                               | T3.6        | M4 session                       |
| Wire accepted decisions to single-use leases                                                                                 | T6          | M2/M3                            |
| KYA-S1 TC4-6 "safe halt" requirement text in `Legal/KYA_S1.md`                                                               | T7          | HIC approval (Day 4 Artifact)    |

## 4. Related

- `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` — C3, gate G5
- `docs/runbooks/AEGIS_PILOT_RUNBOOK.md` — §8 limits
- `docs/plans/KNOWLEDGE_LOOP_FINDINGS.md` — M3, M5, lease, TC4 rows
- `Legal/KYA_S1.md` — TRS-4, TC4
- `DWS_SECURITY_STANDARD.md` §8

---

**Document version:** v1.0 · **Date:** 30.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.**
