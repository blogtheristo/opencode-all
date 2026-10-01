# Aegis Pilot — Evidence Format v1 (frozen)

---

# VERSION AND AGENT HISTORY

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/aegis-evidence-impl | Date: 01.10.2026 | Changes: Pre-publication corrections from Copilot review #2324, before any v1 bundle shipped: replayed command is a named failure (§5.3 step 0); erasure writes the WORM tombstone before anything irreversible (§5.5); WORM records name the segment of their issued-against head, and only a head in a pruned segment is unverifiable (§7); anchor export progress is kept per destination (§9); header block per DWS_DOCUMENT_STANDARD §2.1. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/aegis-evidence-impl | Date: 01.10.2026 | Changes: Created. Frozen description of the Aegis pilot evidence bundle so an auditor can verify every stop and decision in ten years, in any language, without Lifetime code (field note 2026-10-01-boardy-claims-audit.md rows 36–39; task aegis-evidence-ten-year-verify; spec amendment A–D, HIC thread 01.10.2026). | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Session Links & References:

- Claude Code (claude/aegis-evidence-impl): https://github.com/blogtheristo/dws6/tree/claude/aegis-evidence-impl
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/aegis/EVIDENCE_FORMAT_v1.md

Document Status:

- Created: 01.10.2026
- Last Modified: 01.10.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — FROZEN (changes only by a new major version, `EVIDENCE_FORMAT_v2.md`)
- Classification: CUSTOMER-FACING — format specification for auditors and independent verifiers
- Owner: Lifetime Oy — Aegis & KYA Team

---

## 0. Purpose and conformance

This document is the whole of what a verifier needs. It describes the bytes of an Aegis pilot evidence bundle and the checks that make it evidence. A verifier written from this document alone, in any language, must reach the same result as the two reference verifiers:

| Verifier             | Where                                                               | Depends on                                                |
| -------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Kit (TypeScript)     | `scripts/aegis-pilot.ts verify-bundle`, `src/aegis/pilot/bundle.ts` | Node.js `node:crypto`                                     |
| Independent (Python) | `tools/aegis-verify-py/verify.py`                                   | Python 3 standard library + `cryptography` (Ed25519 only) |

Conformance is shown with the test vectors in `docs/aegis/evidence-test-vectors/` (§11): reproduce every canonical string, hash and signature in `expected.json`, accept the bundle, and reject every negative case with the named failure.

The words MUST, MUST NOT and SHOULD are used as in RFC 2119.

Not part of v1: trusted timestamping (RFC 3161) — under evaluation, not implemented.

## 1. Files

A bundle is a directory. Every path is relative, with `/` separators. A bundle holds exactly these files and no others (no links, no other file types):

| Path                                      | Content                                                  | Section |
| ----------------------------------------- | -------------------------------------------------------- | ------- |
| `manifest.json`                           | file list with hashes, ledger head, newest seal digest   | §6      |
| `manifest.sig`                            | site signature over the manifest                         | §6      |
| `site/site.json`                          | site public key                                          | §3.3    |
| `credentials/<credentialId>.json`         | operator and agent credentials (public parts)            | §5.4    |
| `ledger/segments/NNNNNN.jsonl`            | sealed ledger segment `NNNNNN` (6 digits, from `000000`) | §4      |
| `ledger/segments/NNNNNN.seal.json`        | the seal of that segment                                 | §4.4    |
| `ledger/article12.jsonl`                  | the active (unsealed) segment                            | §4      |
| `command-bodies/<command_digest>.json`    | signed operator command bodies, while not erased         | §5.2    |
| `acceptance/<name>.json`                  | signed acceptance records                                | §6.3    |
| `anchor/queue.jsonl`, `anchor/state.json` | seal anchors and their export status                     | §9      |
| `AUDITOR_GUIDE.md`                        | the reading guide, with a `Version:` line                | §6.3    |

The state directory's `kill/` and `decide/` inboxes (raw command files) are never exported; everything an auditor needs from a command is in the ledger and in `command-bodies/`.

Encoding of every text file: UTF-8, no byte-order mark, LF line endings. `.jsonl` files hold one JSON object per line, each line terminated by LF, including the last. A final line without LF is a torn write and makes the file invalid. JSON files other than `.jsonl` are pretty-printed for humans; their formatting carries no meaning, because every hash and signature is over the canonical form (§2), except the file hashes in the manifest, which are over the exact bytes.

## 2. Canonical JSON

Every hash and signature in this format is computed over the **canonical JSON** of a value:

1. `null`, `true`, `false` as written.
2. **Strings** exactly as ECMAScript `JSON.stringify` writes them (ES2019 and later): `"` → `\"`, `\` → `\\`, U+0008 → `\b`, U+000C → `\f`, U+000A → `\n`, U+000D → `\r`, U+0009 → `\t`; every other code point below U+0020 → `\u00XX` with **lowercase** hex; an unpaired surrogate → `\uDXXX` in lowercase hex; every other character (including U+007F, U+2028, U+2029 and all non-ASCII) as itself in UTF-8. No `/` escaping.
3. **Arrays**: `[` elements joined by `,` `]`, order kept.
4. **Objects**: members sorted by key, compared as sequences of **UTF-16 code units** (not code points: a key with a character above U+FFFF sorts by its high surrogate, below U+E000–U+FFFF); written `{"key":value,...}` with `,` and `:` and no whitespace anywhere. Keys are written as strings (rule 2).
5. **Numbers** exactly as ECMAScript `Number.prototype.toString` (which is what `JSON.stringify` writes): the shortest decimal that round-trips the IEEE 754 double; integer form up to 21 digits (`1e21` is written `1e+21`); `0.000001` stays decimal but `1e-7` is exponential; exponent written `e+N` / `e-N`; `-0` is written `0`; NaN and ±Infinity are written `null`. An integer outside ±2^53 is first rounded to the nearest double, as an ECMAScript parser would.
6. A member whose value is `undefined` (possible only for in-memory objects, never in parsed JSON) is dropped.

Parsing: a verifier MUST parse with a parser that keeps every number as a double (or reproduces rule 5 for integers it keeps exact), and SHOULD reject duplicate keys and the non-JSON literals `NaN`/`Infinity`. The kit never writes duplicate keys.

**Relation to RFC 8785 (JCS).** For every value a v1 bundle holds — JSON parsed from the files, without duplicate keys, lone surrogates or non-finite numbers (I-JSON) — this canonical form is **byte-identical to RFC 8785**: JCS also sorts keys by UTF-16 code units, serialises numbers with the ECMAScript algorithm, and strings with the ECMAScript `JSON.stringify` rules. It differs only outside I-JSON, where JCS refuses the input: an unpaired surrogate is escaped here (JCS: error), NaN/Infinity become `null` here (JCS: error), duplicate keys keep the last value in an ECMAScript parser (JCS: error). An RFC 8785 library is therefore a conforming implementation of §2 for any bundle the kit writes; it is not named as the definition because the kit's implementation (`src/aegis/pilot/crypto.ts` `canonicalJSON`) predates this check.

Vectors: `expected.json` → `canonicalization` (key order, escapes, number forms).

## 3. Hashes, signatures and keys

### 3.1 Hash

`sha256(x)` is SHA-256 of the UTF-8 bytes of `x`, written as 64 **lowercase** hex characters.

### 3.2 Signature

`sign(payload, key)` is Ed25519 (RFC 8032, pure, no context) over the UTF-8 bytes of `canonical(payload)`, written **base64url without padding** (RFC 4648 §5). Note: when the payload is a string — an event hash — its canonical form includes the double quotes: the signed bytes of an event hash `ab12…` are the 66 bytes `"ab12…"`.

### 3.3 Keys

Public keys are Ed25519 SubjectPublicKeyInfo in PEM (`-----BEGIN PUBLIC KEY-----`). The **key id** of a key is the first 16 hex characters of `sha256(PEM with leading and trailing whitespace removed)`.

- **Site key** — `site/site.json`: `{siteId, keyId, publicKeyPem, createdAt}`. The verifier MUST compute the key id from `publicKeyPem` and compare **that** with the key id the customer recorded outside the bundle (the signed scope). A bundle checked only against the key it carries proves integrity, not authenticity.
- **Operator keys and roles** — `credentials/<id>.json` (§5.4): each operator credential binds the operator's public key (`subjectPublicKeyPem`) and role (`role`), and is signed by the site key. The operator's private key never enters the site.

A verifier needs nothing else: the site public key, then the operator public keys and roles from credentials that verify under it.

## 4. The ledger

### 4.1 Event

Each line of a segment file is one event object with these members (the kit writes them in this order; order carries no meaning):

| Member                                                                       | Type           | Meaning                                                                 |
| ---------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `seq`                                                                        | integer        | position in its segment, from 0                                         |
| `event_id`                                                                   | string         | UUID                                                                    |
| `event_type`                                                                 | string         | §4.5                                                                    |
| `timestamp`                                                                  | string         | ISO 8601 UTC, millisecond precision                                     |
| `site_id`, `org_id`                                                          | string         |                                                                         |
| `trace_id`                                                                   | string         |                                                                         |
| `agent_id`, `operator_id`                                                    | string or null | pseudonymous subject ids from credentials                               |
| `capability_manifest_hash`, `model_version`, `input_digest`, `output_digest` | string or null |                                                                         |
| `confidence`                                                                 | number or null |                                                                         |
| `detail`                                                                     | object         | type-specific; digests, ids and short operational detail only           |
| `prev_hash`                                                                  | string         | `event_hash` of the previous event in the segment; 64 zeros for `seq` 0 |
| `event_hash`                                                                 | string         | §4.2                                                                    |
| `sig`                                                                        | string         | `sign(event_hash, site key)` (§3.2)                                     |

### 4.2 Event hash

`event_hash = sha256(prev_hash + canonical(body))`, where `+` is string concatenation and `body` is the event object **with exactly the members `event_hash` and `sig` removed** — every other member present in the line is hashed, including any not listed above.

### 4.3 Chain rules (per segment)

For event `i` of a segment: `seq == i`; `prev_hash` equals the previous `event_hash` (64 zeros for `i = 0`); `event_hash` recomputes; `sig` verifies under the site key (no unsigned events); `timestamp` parses and never decreases. **Tombstone:** after a `human.override` whose `detail.agents_stopped` lists an agent id, no `agent.decide` or `tool.invoke` event with that `agent_id` may follow in the segment.

### 4.4 Segments and seals

Segments are numbered from `000000`. The last event of a sealed segment is `system.segment_seal`. The next segment's genesis (`seq` 0, `system.genesis`) carries `detail.prev_segment = {index, head_hash, seal_digest}` of the previous seal. The active segment's genesis links to the newest seal; with no seals it carries no `prev_segment`.

A seal file is the object `{v: 1, format: "aegis-pilot-segment/1", siteId, keyId, index, file, sha256, bytes, count, firstTimestamp, lastTimestamp, headHash, sealedAt, reason, prevSeal, retention: {classes, retainUntil}, sig}`:

- `sha256`/`bytes`: of the exact bytes of the segment file; `count`/`headHash`: its event count and last `event_hash`;
- `seal_digest = sha256(canonical(seal without sig))`; `prevSeal` is the previous seal's digest (null for 0);
- `sig = sign(seal without sig, site key)`; `keyId` is the site key id; `index` equals the file name.

A sealed segment file may be missing only when `retention.retainUntil` is in the past at verification time (pruned); before that, it is evidence loss. The seal stays after pruning, so the seal chain still verifies.

### 4.5 Event types used by this format

`system.genesis`, `system.segment_seal`, `system.segment_pruned`, `agent.decide` (a recommendation has `detail.recommendation = true`), `tool.invoke`, `human.override` (an accepted stop), `human.decide` (an accepted decision), `evidence.redacted` (§5.5), `incident`, `authority.grant`, `authority.revoke`, `acceptance.record`, `outcome.record`, and operational `system.*` / `workflow.*` events. A verifier MUST NOT reject an unknown event type.

## 5. Operator evidence (stops and decisions)

Every accepted stop (`human.override`) and decision (`human.decide`) is signed by the operator's own key, not only by the site, and bound field by field to its event.

### 5.1 Command, digest and frame

The operator signs a **command body** (JSON object). Stop: `{v: 1, commandId, target, reason, issuedAt, operatorCredentialId}`. Decision: `{v: 1, commandId, recommendationSeq, recommendationHash, verdict, reason, issuedAt, operatorCredentialId}` plus, when present, `capture` (`manual_entry`; absent means live), `occurredAt` (manual entries) and `modificationDigest` (verdict `modify`).

- `command_digest = sha256(canonical(body))`
- `operator_signature = sign(body, operator key)` — covers the body while it exists
- the **frame** `{domain: "dws.aegis.operator-command.v1", command_id, command_kind, role, issued_at, command_digest}`, with `command_kind` `"stop"` or `"decide"`, `role` the credential's role or `null`, `issued_at` = `issuedAt`;
- `digest_signature = sign(frame, operator key)` — made at issue time, and what remains verifiable after the body is erased.

### 5.2 What the event carries, and the erasable body

The hash-chained event MUST NOT contain the command body or its free-text reason. It carries, in `detail`: `command_id`, `command_kind`, `command_digest`, `issued_at`, `role`, `operator_credential_id`, `digest_signature`, `operator_signature`, and the event's own fields — stop: `action: "agent.stop"`, `target`, `agents_stopped`; decision: `action: "decision"`, `verdict`, `decision_by` (= role), `recommendation_seq`, `recommendation_hash`, `modification_digest`, `capture`, `decided_at`, `signed_at` (= `issued_at`). The event's `operator_id` is the credential's `subjectId`.

The signed body (body plus `signature`) is stored outside the chain as `command-bodies/<command_digest>.json`, so it can be erased (§5.5) without breaking the chain. A body file MUST hash (body without `signature` and `digestSignature`) to its file name, and MUST be referenced by an operator event.

### 5.3 Verification of each `human.override` / `human.decide` (normative order)

A verifier reports the **first** failure, with its code. Codes are part of the format.

0. **Replay.** Across the whole bundle, in segment order, a second operator event of the same type with the same `command_id` or `command_digest` as an earlier one is `OPERATOR_COMMAND_REPLAYED` (a command is executed once, however well its signatures verify); the remaining steps are not run for it.
1. `detail` has `command_digest` (64 hex), `command_id`, `command_kind`, `issued_at`, `role` (string or null), `operator_credential_id`, `digest_signature`, `operator_signature` — else `OPERATOR_EVIDENCE_MISSING`.
2. `command_kind` is `stop` for `human.override`, `decide` for `human.decide` — else `OPERATOR_BINDING_MISMATCH:command_kind`.
3. If the body is present: it hashes to `command_digest` (else `COMMAND_BODY_INVALID`), and its `operatorCredentialId` equals `operator_credential_id` (else `OPERATOR_BINDING_MISMATCH:operator_credential_id`).
4. `credentials/<operator_credential_id>.json` exists — else `OPERATOR_CREDENTIAL_MISSING`.
5. The credential is `v: 1`, its `credentialId` is the file id, `kind` is `operator` with a `subjectPublicKeyPem`, `siteId` is the site, `issuerKeyId` is the site key id, its signature (over the credential without `signature`) verifies under the site key, and its `capabilities` include `agent.stop` (stop) or `decision.record` (decision) — else `OPERATOR_CREDENTIAL_INVALID`.
6. `digest_signature` verifies over the frame rebuilt from the event's fields — else `OPERATOR_SIGNATURE_INVALID`.
7. `issued_at` is within the credential's validity: `issuedAt − 5 min ≤ issued_at < expiresAt` — else `OPERATOR_CREDENTIAL_EXPIRED`.
8. The credential's `subjectId` equals the event's `operator_id` (else `…MISMATCH:operator_id`); its role (or null) equals `role` (else `…MISMATCH:role`).
9. Stop: `action` is `agent.stop`. Decision: `action` is `decision`; `decision_by` equals `role` (a string); `signed_at` equals `issued_at`; the event at `recommendation_seq` in the same segment has `event_hash` = `recommendation_hash` (else `…MISMATCH:<field>`, `…MISMATCH:recommendation`).
10. If the body is absent: valid only if an `evidence.redacted` event anywhere in the bundle carries this `command_digest` — else `COMMAND_BODY_MISSING`.
11. If the body is present: its `signature` equals `operator_signature` and verifies over the body (else `…MISMATCH:operator_signature` / `OPERATOR_SIGNATURE_INVALID`); `v` is 1; `commandId`, `issuedAt` equal `command_id`, `issued_at`; stop: `target`; decision: `verdict`, `recommendationSeq`, `recommendationHash`, `modificationDigest`, `capture` (absent = `live`) equal the event fields, and `decided_at` is the same instant as `occurredAt` (manual entry) or `issuedAt` (live) — else `OPERATOR_BINDING_MISMATCH:<event field>`.

Reported as `CODE: <segment label> seq <n> <event_type>: <message>`. Why the binding: a valid operator signature is not enough, because the site key holder could re-sign a ledger whose event says something other than what the operator signed (Copilot review #2321). The negative vectors are exactly that attack.

### 5.4 Credential

`{v: 1, credentialId, kind: "agent"|"operator", subjectId, subjectName, siteId, issuerKeyId, capabilities (sorted), subjectPublicKeyPem?, role?, issuedAt, expiresAt, signature}`, `signature = sign(credential without signature, site key)`. `subjectName` is the only personal field in the bundle; the ledger holds only `subjectId`.

### 5.5 Erasure

Erasing a body deletes `command-bodies/<digest>.json` and appends `evidence.redacted` with `detail = {command_digest, erased_at, reason_code}`, `reason_code` one of `data-subject-request`, `retention-ended`, `data-minimisation`, `legal-order` — no free text, no link from key to person. The same tombstone is in the operator's WORM mirror (§7) **before** anything irreversible happens (`erase-command-body`):

1. **Stage.** The tombstone is written durably to `<state>/redaction-outbox/<digest>.redacted.json`; `erased_at` is the time the erasure is decided and never changes on a retry.
2. **Hand off.** It is written to `<wormDir>/<digest>.redacted.json`. In a correctly isolated deployment the site-key holder cannot write the mirror: the command then stops with exit 3 and nothing erased, and the mirror's holder copies the staged file in unchanged. A mirror holding a different tombstone for the digest is refused.
3. **Erase.** Run again: once the mirror holds exactly the staged tombstone, `evidence.redacted` is appended (once, even after a crash) and the body and staged file are deleted durably. After erasure the stop or decision still verifies by its frame (§5.3 steps 1–10); what can no longer be verified is the body itself — the target or verdict as the operator wrote it and the reason.

## 6. Manifest and bundle checks

### 6.1 Manifest

`manifest.json` is `{v: 1, siteId, keyId, createdAt, ledgerHead: {count, hash}, lastSealDigest, files: [{path, sha256, bytes}]}`; `manifest.sig` holds `sign(manifest, site key)` (the file may end without a newline; surrounding whitespace is ignored). `ledgerHead` is the active segment's event count and last `event_hash`; `lastSealDigest` the newest seal's digest or null.

### 6.2 Checks

A verifier MUST check: every manifest path matches the layout of §1; the key id computed from `site/site.json` equals `site.json.keyId`, `manifest.keyId` and the externally recorded pin; `manifest.siteId` equals `site.json.siteId`; the manifest signature; the files on disk are exactly the manifest's files (none missing, none extra, none a link), each with matching `sha256` and `bytes`; the segment and seal chain (§4); `ledgerHead` and `lastSealDigest`; the auditor guide is present with a `Version:` line; acceptance records (§6.3); operator evidence (§5.3); and every body file is referenced.

### 6.3 Acceptance records

`acceptance/*.json` is `{record, signature}` with `signature = sign(record, site key)`, and an `acceptance.record` event in the ledger with `detail.record_id = record.recordId` and `output_digest = sha256(canonical(record))`.

## 7. Operator copies and WORM records (anchoring level 1)

The site key is in the box; the operator's key is not. The operator CLI keeps what it signed, outside the state directory, in a place the site-key holder cannot write (configured per site in `site/anchoring.json` → `operatorCopies`; default `~/.aegis-operator/commands/` and `~/.aegis-operator/worm/` of the operator). Copies carry no site signature.

- **Full copy** `<commandId>.json`: `{format: "aegis-operator-copy/1", command_kind, command: <body + signature + digestSignature>, issued_against: {segment, seq, event_hash}}` — the active ledger head the operator saw when signing.
- **WORM record** `<command_digest>.json` (for the locked mirror; personal-data safe): exactly `{command_digest, command_id, command_kind, role, issued_at, operator_credential_id, digest_signature, ledger_segment, ledger_seq, event_hash}` — never the body or reason. `ledger_segment`/`ledger_seq`/`event_hash` are the issued-against head (`seq` counts within a segment).
- **Tombstone** `<command_digest>.redacted.json`: `{command_digest, erased_at, reason_code}`.

`verify-bundle --operator-copies DIR` (and `verify.py bundle --operator-copies DIR`) checks every `*.json` in DIR against the verified bundle:

| Code                              | When                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPERATOR_COPY_UNMATCHED`         | no operator event carries the copy's digest (deleted history), or no `evidence.redacted` matches a tombstone. A copy whose digest appears in a `*-command-rejected` incident is listed as `rejected`, not failed.                                                                                                                            |
| `OPERATOR_COPY_DIFFERS`           | the event differs from the copy (full copy: §5.3 run with the copy's body; WORM: any framed field)                                                                                                                                                                                                                                           |
| `OPERATOR_COPY_SIGNATURE_INVALID` | a WORM `digest_signature` does not verify under the credential's key                                                                                                                                                                                                                                                                         |
| `OPERATOR_COPY_HISTORY_MISSING`   | the issued-against `event_hash` is not in the chain at that segment and `seq` (history before the command was rewritten). Reported as unverifiable instead **only when the segment the copy names was pruned** (§4.4); a missing head in a retained segment fails whatever else was pruned, and a copy naming no segment is never downgraded |
| `OPERATOR_COPY_INVALID`           | unreadable or unrecognised file                                                                                                                                                                                                                                                                                                              |

The retention lock of the WORM mirror is storage configuration, not code: `doctor` reports it as unverified unless `operatorCopies.lock` names `{target, retention, lockHolderRole}`, and warns when the copy directory is writable by the state-directory owner.

## 8. Seal schedule

Configured in `site/anchoring.json` → `sealSchedule: {shiftChanges: ["HH:MM" UTC …], maxAgeDays ≤ 1}`; written with defaults at `init` and applied when the file is absent — there is no pilot-mode exception. A seal is due after any `human.override` or configuration change (`authority.grant`, `authority.revoke`) since the last seal, at each shift change, and when the last seal (or, before the first seal, the active segment's first event) is `maxAgeDays` old. `aegis-pilot seal --scheduled` runs one tick (seal if due, then export anchors) and is meant for a timer, for example every 15 minutes:

```
*/15 * * * *  node --import tsx scripts/aegis-pilot.ts seal --scheduled --state-dir /var/lib/aegis
```

A seal cannot be taken while a run holds the ledger; the tick retries. `seal-status` and `doctor` report the age of the last seal; past `maxAgeDays` + 1 h it is **overdue**: exit code 5 (alert), and one `incident` `{kind: "seal-overdue"}` per overdue period. The seal's `reason` names the trigger (`scheduled: …`).

## 9. Anchor export

After every seal the anchor `{siteId, index, head_hash, seal_digest, sealedAt}` is appended to `anchor/queue.jsonl` (canonical JSON per line) and exported to customer-owned sinks configured in `anchorExport`:

- an **append-only file** for SIEM pickup: one canonical anchor per line;
- **RFC 5424 syslog over TCP**, TLS per RFC 5425 (plain TCP only for a loopback test sink; `doctor` warns), octet-counted framing (RFC 6587): `<133>1 <export time> <siteId> aegis-pilot - SEAL_ANCHOR - <BOM><canonical anchor>`.

The sinks MUST be administered by a different person than the box (`anchorExport.administeredBy`, a role; `doctor` warns when absent). A failed export never blocks a seal: it is recorded as an `incident` `{kind: "anchor-export-failed"}` at the start of an outage and `{kind: "anchor-export-recovered", first_failed_at, first_success_at, backfilled}` when the link returns; the queue is persisted and backfilled in order (at-least-once: a sink deduplicates by `siteId` + `index`). Progress is kept per **destination** (`file:<absolute path>`, `syslog:<host>:<port>:tls|tcp`), not per sink name: a changed destination starts again from the first anchor and is recorded as `incident {kind: "anchor-sink-changed", sink, backfill}`. `anchor/state.json` holds per-sink progress and the closed gaps `{sink, firstFailedAt, firstSuccessAt, backfilled}`; it travels in the bundle and `seal-status` reports it (exit 5 while a sink is failing).

An auditor compares the sink's anchors with the bundle: every `seal_digest` in the sink must be a seal in the bundle (`segments --expect-seal DIGEST` for one anchor). A missing or different seal means segments were rolled back or rewritten after export.

## 10. What the anchors cover (scope of the lock)

- The **WORM lock** (§7) covers **operator commands and stops only**: each stop and decision, by digest and the operator's framed signature, and each erasure.
- The **rest of the event stream before a seal** rests on the hash chain and the site key alone: the holder of the site key can rewrite and re-sign unsealed events that no operator signed.
- **After a seal**, the event stream rests on the **exported seal digests** (§9) held by the customer's sink administrator: rewriting a sealed segment changes its seal digest, which no longer matches the exported anchor.
- Not covered: the time between an event and the next seal export (bounded by §8), and the content of erased bodies (§5.5).

## 11. Test vectors

`docs/aegis/evidence-test-vectors/` is generated deterministically by `node scripts/aegis-evidence-test-vectors.mjs` (node:crypto only; it does not import the kit). All keys are **TEST-ONLY**: each private key is the Ed25519 seed `sha256("aegis-evidence-test-vectors/v1 <name> TEST-ONLY")` and is public.

| Path                                | What                                                                                                                                                                                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bundle/`                           | site `vector-site`; operator A (role `shift-supervisor`, decides) and B (no role, stops); sealed segment `000000` of 6 events — genesis, recommendation, `human.decide`, `human.override`, `authority.revoke`, `system.segment_seal` — its seal, an active segment, both command bodies, manifest |
| `operator-copies/`                  | full copies and WORM records of both commands                                                                                                                                                                                                                                                     |
| `variants/redacted-stop-body.jsonl` | the segment with `evidence.redacted` for the stop body; verifies with that body absent                                                                                                                                                                                                            |
| `negative/*.jsonl`                  | the segment re-signed with the site key after a forgery: `changed-target`, `changed-verdict`, `changed-reason` (+ `changed-reason.bodies/`), `replayed-stop`, `swapped-credential`, `framed-role-swap`, `framed-command-id-swap`, `missing-body`                                                  |
| `negative-copies/*/`                | one WORM record each, naming a head that is not in the chain: in retained segment 0 (fails although segment 5 is pruned) and in pruned segment 5 (unverifiable) — `expected.json` → `copy_cases`                                                                                                  |
| `expected.json`                     | keys, canonicalization vectors, every credential, command, frame, event, seal and manifest canonical string with its hash and signature, and `cases`: each case's ledger, bodies to omit/add, and the expected first failure code (or `PASS`)                                                     |

A case is verified with the bundle's `site/site.json`, `credentials/` and `command-bodies/` (minus `omit_bodies`, plus `extra_bodies`, restricted to bodies the case ledger references): the chain MUST verify (the forgery is well-formed) and §5.3 MUST report exactly the expected code.

## 12. Versioning

This is format 1: ledger `aegis-pilot-ledger/1`, segment `aegis-pilot-segment/1`, manifest `v: 1`, frame domain `dws.aegis.operator-command.v1`. Any change to a byte a verifier hashes or signs is a new major version, described in a new document; v1 verifiers remain valid for v1 bundles.
