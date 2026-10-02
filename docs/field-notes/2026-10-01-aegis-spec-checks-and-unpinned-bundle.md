# Aegis Pilot Day 5: tighter A1/A3 checks, unpinned bundle warning

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/adoring-noether-7yqv5h | Date: 01.10.2026 | Changes: Created. | Harness: Claude Code + CLAUDE.md

Document Status:

- Created: 01.10.2026
- Status: PENDING_REVIEW

---

## What happened

PR [#2315](https://github.com/blogtheristo/dws6/pull/2315).

- The A1 (doctor) and A3 (handler-conformance) task checks matched any `"ok": true` in the output and ignored exit codes. A broken top-level result could pass. The HIC asked me to tighten them myself, because the spec lock stops agents editing task specs.
- The new checks parse the JSON and assert exit code and top-level `ok`, plus negatives (world-writable state dir, 0644 key, tampered ledger, unpinned scope, read-only state tree, abort-ignoring and empty registries).
- `verify-bundle` without `--expect-key-id` now reports `keyPinned: false` and `authenticity: "unpinned — authenticity not established"`, and warns on stderr. `ok` stays integrity-only.

## Insight

The tightened A3 negatives fail on current code: `check-handlers` ignores `--handlers` and always uses the reference registry. A customer's handlers cannot be checked today, which contradicts the A3 spec.

## Next steps

- Fix `check-handlers` to honour `--handlers`, tests first.
- Change runbook §6.2 step 12 (stale: "until A2 is merged"); HIC will do it.
- Merge #2315 with `--allow-spec-edit` on the done gate.
- Set the M4 date.

## Decision (HIC, 01.10.2026: yes)

The HIC chose non-zero. `verify-bundle` without a pin now exits 4; `--allow-unpinned` gives an integrity-only exit 0 and still labels the result unpinned. `check-handlers` now honours `--handlers` (tests first, 2 CLI tests). Status: DECIDED. The old question was:

Should `verify-bundle` exit non-zero when unpinned, instead of only warning? A warning keeps existing callers working; a non-zero exit stops an unpinned result being mistaken for "verified".

Sales Score: N/A — internal engineering hardening, no buyer signal.
KB, Drive export, calendar: N/A — session was spec/CLI hardening; the HIC's M4 date is still unset, so nothing to calendar.
