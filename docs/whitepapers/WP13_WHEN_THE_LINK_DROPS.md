# When the Link Drops

## Acceptance and evidence for an industrial AI agent — DWS IQ 7 Aegis

**A Lifetime Oy Whitepaper · WP13 · 2026**

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/aegis-disclosure-depth | Date: 01.10.2026 | Changes: Framed digest signature, erasable command body outside the chain, redaction record, scope of the lock (advisor review audited, rows 53–57).
- Version: 1.0 | Tool: Claude Code | Session: claude/aegis-fi-copy-buyer-definition | Date: 01.10.2026 | Changes: Initial whitepaper (HIC 01.10.2026: move acceptance and evidence detail from the public pages into a whitepaper available on request). Content moved from `Store/PRODUCT_AEGIS_PILOT.md` FI v2.0.22 (Hyväksymistesti, Tarkistettavuus) and the evidence task spec `.claude/done/opencode/aegis-evidence-ten-year-verify.json`; claims audited in `docs/field-notes/2026-10-01-boardy-claims-audit.md`.

Document Status:

- Created: 01.10.2026
- Last Modified: 01.10.2026
- Author: Risto Anton Päärni, Founder, CEO, Lifetime Oy
- Language: English
- Languages Available: English (request page in English, Suomi, Svenska, Deutsch, Français)
- Distribution: on request only (Truth Standard §2J). Not published as a public file.
- Publication Status: DRAFT — HIC review before first distribution
- Harness: Claude Code (web) + CLAUDE.md + DWS_TRUTH_STANDARD.md §2J
- HIC-approved-drift: none

---

## Executive summary

An AI agent working in a production control room must keep working when the network goes down, must stop when an operator says so, and must leave a record that someone other than the vendor can check years later. DWS IQ 7 Aegis is built to that brief, and the paid pilot proves it on the customer's own hardware with a test the customer runs.

This paper explains how. It is written for the people who approve the architecture (CIO), the security posture (CISO) and the audit trail (internal audit, the authority's inspector, the customer's lawyer). It states plainly what the evidence proves and what it does not.

**Status of the implementation (01.10.2026).** The pilot kit already runs offline, records a signed hash chain, seals it, exports a bundle and stops agents on a signed operator command. The items marked _(in build)_ below — operator signatures inside the ledger, the frozen format specification and test vectors, the independent Python verifier, scheduled and event-triggered seals with overdue alerts, the anchor export, and digest-only copies for locked storage — are being implemented and must pass their acceptance checks before the first customer delivery.

---

## 1. The acceptance test

The customer runs the test and cuts the connection with its own method above the Aegis stack (switch, firewall or hypervisor). Three conditions, all must pass:

1. **Offline continuity.** The workflow reaches its defined done-state with the uplink cut.
2. **Ledger integrity.** The record has no gap across the cut.
3. **Stop authority.** An operator stops a running agent with the operator's own key, and the stop is verified from the signed ledger, not from the agent's own report.

A failed test is a usable result and is reported. A workflow without a defined done-state cannot be tested; that is found in Phase 0, before anything is paid.

## 2. The record

- **Format.** One JSON object per line (UTF-8, LF). Each event is canonicalised (keys sorted, no whitespace) and chained: `event_hash = SHA-256(prev_hash ‖ canonical_event)`. The site key signs each event with Ed25519 (RFC 8032).
- **Operator signatures** _(in build)_. Every stop (`human.override`) and decision (`human.decide`) carries the operator's signed command, the operator credential id and the signature. A verifier checks that every field of the signed command equals the ledger event it is attached to; a valid signature on a different command is rejected.
- **Seals.** The chain is sealed at test start and end. From install onwards — during the pilot and in production — it is also sealed after every operator stop and configuration change, at every shift change on 24/7 sites, and at least daily elsewhere. An overdue seal raises an alert and writes an incident event _(in build)_.
- **Anchor export** _(in build)_. After every seal, `{site, segment, head hash, seal digest, time}` goes to a customer-owned sink (RFC 5424 syslog over TLS and an append-only file for SIEM pickup). A failed export is an incident, retried from a persisted queue in order; the gap is reported. It never blocks the seal.

## 3. Copies the box cannot change

The site key sits in the same box as the write access, so before a seal whoever holds both can rewrite the chain. The defence is copies outside that hand:

- **Operator command copies** _(in build)_. Every operator-signed command is copied to a location the site-key holder cannot write. These copies rest on the operator's key, not the site key, so a deleted ledger event shows up as a copy without a matching event.
- **Default location.** A workstation administered by the operations organisation, with a WORM mirror beside it. The customer decides whether the WORM store is on premises or in the cloud; we recommend on premises.
- **Lock.** The retention lock covers the whole store and every object written to it, not single versions. It can be extended, never shortened or removed, not even by an administrator. A different role sets the lock than the role that writes the copies. (Cloud example: Azure immutable storage, locked time-based retention.[^az])
- **Lock content — no command bodies or names.** For each operator command the lock holds a framed record: domain tag, command id, command kind, role, issue time and the command digest, signed by the operator's key at issue time. Framing keeps the signature bound to its context and makes the id, role and time tamper-evident. The command body, including the free-text reason, is kept outside the hash chain in an erasable store referenced by its digest.
- **Erasure.** An erasure request deletes the command body and the key-to-person link, and writes a redaction record (digest, date, reason code) to the ledger and the lock. Verification then shows a lawfully erased command as a digest with a redaction record; a digest with neither a body nor a redaction record is reported as missing. Afterwards the lock still proves that a given operator key signed a given command no later than the time it was written, but no longer what the command said or who held the key _(in build)_.
- **Scope of the lock.** The lock covers operator commands and stops. The integrity of the rest of the event stream rests on the hash chain and the site key before a seal, and on the exported seal digests after it.
- **Lock length.** Default ten years, extendable. This is Lifetime Oy's recommendation, not the customer's legal obligation: under the AI Act the ten-year retention applies to the provider's documentation (Art. 18); the deployer keeps automatically generated logs for a period appropriate to the intended purpose, at least six months (Art. 26(6)).[^aia] The lock ends after ten years unless extended. Storage size and cost are the customer's; Phase 0 estimates the yearly volume.
- **Cloud and outages.** A cloud store is cut off exactly when the network fails. The box keeps sealing, but no anchor is created until the link returns; the export is buffered and backfilled, and the length of the gap is stated in the report.
- **Honest boundary.** The separation is role-based, not technical. If the box administrator also administers the copy location, the boundary does not hold, and that is recorded. On a single-person site the protection is the retention lock, not role separation, and Phase 0 says so.

## 4. Verifying without Lifetime Oy

At the end of the pilot the customer receives the evidence bundle: ledger, decision and stop events with operator signatures, the acceptance result, seal digests, a signed manifest, and every public key needed (site and operators with roles). The bundle also contains the frozen format specification and test vectors — a small example ledger whose hashes and signatures are known — so anyone can re-implement the verifier in any language and check it years later, without Lifetime Oy or an Aegis licence. An independent reference verifier in Python is supplied _(in build)_. The specification and vectors are handed over already in Phase 0, so the customer can check the record throughout the pilot.

## 5. What the evidence proves, and what it does not

**Proves:** no undetected change to the record after a seal; who signed which stop or decision in which role.

**Does not prove:** that events happened as recorded. Before a seal, whoever holds the box's write access and the site key can rewrite the chain. That is why seal digests go to the customer's own register outside the box, why operator-signed decisions cannot be altered without the operator's key, and why copies sit where the box cannot write.

## 6. Phase 0 checklist

Named in writing before the pilot starts: project lead, workflow owner, operator, technical contact, decision owner; copy location and its administrator; WORM store, lock length and lock-holder role; anchor sink and its administrator (a different person than the box administrator); seal cadence; estimated yearly volume; isolation method.

---

## Sources

[^aia]: Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12, 14, 18(1), 26(6). EUR-Lex, <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>. Summaries: European Commission AI Act Service Desk, Art. 18 and Art. 26.

[^az]: Microsoft, _Store business-critical blob data with immutable storage in a WORM state_ and _Configure immutability policies for containers_, Microsoft Learn (read 01.10.2026), <https://learn.microsoft.com/azure/storage/blobs/immutable-storage-overview>.

Further sources to be read before external circulation (BLOG*STANDARD §17.2): RFC 8032 (EdDSA); FIPS 180-4 (SHA-256); IEC 62443-3-3; B. Schneier and J. Kelsey, "Secure audit logs to support computer forensics", \_ACM Transactions on Information and System Security* 2(2), 1999; S. A. Crosby and D. S. Wallach, "Efficient data structures for tamper-evident logging", _USENIX Security Symposium_, 2009.

---

Risto Anton Päärni · Founder, CEO · Lifetime Oy · the Agent Outcome Company · risto.paarni@lifetime.fi · +358 400 319 010
