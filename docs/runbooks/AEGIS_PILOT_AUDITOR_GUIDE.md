# Aegis Pilot — Auditor's Guide to an Evidence Bundle

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/festive-mccarthy-h6y6yu | Date: 30.09.2026 | Changes: Created (readiness plan C6, HIC 30.09.2026). Shipped inside every evidence bundle as `AUDITOR_GUIDE.md`; its version is written into each signed acceptance record, and verification fails when the bundled guide is older than the one a record names. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 30.09.2026
- Last Modified: 30.09.2026
- Language: English
- Publication Status: ACTIVE
- Classification: CUSTOMER-FACING — ships in every evidence bundle
- Owner: Lifetime Oy — Aegis & KYA Team

---

This guide is for someone who has never spoken to Lifetime. You need this bundle, the key id written in the signed Phase 0 scope (keep your own copy: a key id copied from the bundle proves nothing), a computer that has never held the site's state directory, and Node.js 20 or later with the Aegis pilot kit at the commit named in the record.

## 1. Check the bundle as a whole

```
node --import tsx scripts/aegis-pilot.ts verify-bundle --bundle <bundle> --expect-key-id <key id from the signed scope>
```

The command exits 0 and prints `"ok": true` only when all of the following hold. Any failure is listed by name.

| Check                                                                                                     | What it rules out                                     |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| The key id computed from `site/site.json` equals the id you supplied                                      | A different site key presented as the customer's      |
| `manifest.sig` verifies over `manifest.json` with that key                                                | An edited list of files                               |
| The files are exactly those in the manifest, with the listed sha256 and size                              | Removed, added or changed files                       |
| Every sealed segment, seal and link verifies; a missing segment is accepted only after its retention date | Deleted or rewritten history                          |
| The ledger head and newest seal equal the values in the signed manifest                                   | A ledger swapped after export                         |
| Every acceptance record is signed by the site key and recorded in the ledger under its digest             | A record inserted, edited or taken from another run   |
| This guide is not older than the guide each record names                                                  | Reading a record with instructions that do not fit it |

## 2. Read the acceptance record

Open `acceptance/<record id>.json`. The `record` object is what was signed.

1. **What governed the run** — `record.provenance`: `standards.kyaS1` (the KYA-S1 specification revision), `documents.runbook`, `documents.auditorGuide`, `documents.acceptanceAnnex`, and `kit.commit` (the exact kit source). `kit.dirty: true` means the kit had uncommitted changes at run time; the record lists that as a finding.
2. **Hardware attestation** — `record.provenance.attestation`. In the pilot all four are off (`tpmQuote`, `measuredBoot`, `hardwareKeys` false, `rimVersion` null): the stop record is a software record signed with the site key, not a hardware-attested one.
3. **The outcome** — `record.outcome` is PASS, NEGATIVE_RESULT, NOT_TAKEN or INVALID. The contract annex (A6) defines each.
4. **The isolation method** — `record.isolation`: the method, who enforced it, and what it does and does not demonstrate.
5. **The three conditions** — `record.conditions`. For the stop, `operatorStop.safeHalt` must show `terminated`, `quiescent` and `disarmed` all true.

## 3. Walk the ledger

`ledger/segments/*.jsonl` (oldest first) and `ledger/article12.jsonl` are one hash chain. Each line is one event. Useful event types:

| Event                 | Meaning                                                                          |
| --------------------- | -------------------------------------------------------------------------------- |
| `authority.grant`     | A credential issued, with its capabilities and the digest of the credential file |
| `agent.decide`        | A workflow step's decision, with input and output digests (never raw data)       |
| `human.override`      | The operator's stop, with the operator's credential id and the command id        |
| `authority.revoke`    | The stopped agent disarmed; carries the operator id                              |
| `human.decide`        | The operator's accept, modify, reject or defer on a recommendation               |
| `system.uplink_probe` | An egress attempt and its result                                                 |
| `acceptance.record`   | The digest of the acceptance record, chaining it into the ledger                 |

Names are not in the ledger. A credential id maps to a person only through the customer's own credential register.

## 4. What this bundle does not show

- Anything about the physical process the agent may have steered. That safe state belongs to the customer's safety system.
- Network paths that were not in the probe list. The record's `isolation.doesNotDemonstrate` says what the chosen method leaves open.
- Hardware attestation, unless `provenance.attestation` says otherwise.
