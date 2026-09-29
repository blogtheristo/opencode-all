# Aegis Pilot Day 2: ledger segments and retention (C2)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/magical-hawking-3gx6fv | Date: 29.09.2026 | Changes: Day 2 patch of the DWS-AEGIS-PILOT-001 readiness plan. Picked up after the GitHub Copilot session ran out of quota while choosing the patch. C2 built, tested and security-reviewed; three loop specs extended. | Harness: Claude Code + CLAUDE.md + DWS_ARTICLE_12_LOGGING_STANDARD + DWS_SECURITY_STANDARD | HIC-approved-drift: none

Session Links & References:

- Plan: `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` §5.2 C2 (v1.3)
- Runbook: `docs/runbooks/AEGIS_PILOT_RUNBOOK.md` §4 "Ledger segments and retention" (v1.2)
- Day 1: kit `30b26eb` (#2225), field note `2026-09-28-aegis-pilot-local-first-kit.md`

Document Status:

- Created: 29.09.2026
- Status: PENDING_REVIEW

---

## 1. How the Day 2 patch was chosen

Day 1 was the kit (#2225). The readiness-plan handoff names C2 (ledger segments and retention) and C3 (threat model) as the next Claude Code items, both due before the cloud-agent block on 12.10.2026. C4 (#2230) and C5 (#2232) are already in open PRs. The six loop specs A1–A6 are on `main` and belong to `opencode-loop`; no `opencode/aegis-pilot-*` branch exists yet, so none had started. C2 was chosen because it is on the evidence-integrity path, which the delegation rule keeps in a paid session with a security review.

## 2. The gap

The ledger was one JSONL file that only grew. Deleting old lines breaks the hash chain. Keeping everything keeps operator identifiers longer than Article 12 Logging Standard §4 allows, and a file that grows without limit is an operations risk on an edge node (G7).

## 3. What was built

- `src/aegis/pilot/ledger-segments.ts`: `sealActiveSegment`, `verifySegments`, `pruneExpiredSegments`, `retentionClassOf`.
- CLI: `seal` (64 MiB or 30 days, or `--force`), `segments` (exit 4 on failure), `prune` (lists only; deletes with `--confirm`).
- `evidence-ledger.ts`: two event types (`system.segment_seal`, `system.segment_pruned`), a `genesisDetail` option and `closeHoldingLock()`. They were placed away from the lines that #2229, #2230 and #2232 change, to keep merges clean.
- Chaining: the seal event ends a segment; a site-signed seal holds the file hash, head hash and previous seal digest; the next genesis event holds `prev_segment`.
- Retention: 6 months for routine events; 5 years for stops, terminations, acceptance records, incidents, prune records and any unlisted type. Over-retaining can be corrected; under-retaining cannot.

## 4. Verification

- 20 new vitest cases (`src/__tests__/aegis-pilot-segments.test.ts`) plus the 47 existing pilot cases: 67/67 pass.
- Isolated rehearsal (`unshare --net`) returns PASS before and after a roll, and `segments` verifies afterwards.
- Done spec `.claude/done/claude/magical-hawking-3gx6fv.json`: 5/5 checks pass.
- Security review: see §6.

## 5. Work moved to opencode-loop

The loop specs were extended rather than new ones added, so the loop does the multi-file follow-on work without paid tokens:

| Spec | Addition                                                                      |
| ---- | ----------------------------------------------------------------------------- |
| A1   | `doctor` check `ledger-verifies` uses `verifySegments`                        |
| A2   | export bundle includes sealed segments and seals; `verify-bundle` checks them |
| A5   | daily `seal` timer; explicitly no `prune` timer                               |

## 6. Security review

The first verdict was FAIL: 0 critical, 3 high, 4 medium and 5 low. All high and medium findings were fixed, each with a regression test:

| ID  | Finding                                                   | Fix                                                                                                                                                                |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| H1  | Deleting every seal and segment verified as valid         | An active genesis that links to a seal must find it; one with no seals must not link                                                                               |
| H2  | Rollback of the newest segments was undetectable          | `seal` prints an anchor; `segments --expect-seal` checks it. Without the anchor this remains a documented residual (runbook §8)                                    |
| H3  | The roll was not crash-safe                               | Seal written durably (temp, fsync, rename, directory fsync); segment is a hard link; active path replaced by one rename; next `seal` completes an interrupted roll |
| M1  | Seals were read before the lock                           | Lock first, all reads under it                                                                                                                                     |
| M2  | Predictable staging name                                  | Random name, created with O_EXCL; leftovers removed under the lock                                                                                                 |
| M3  | A wrong clock could prune early                           | Confirm token for the exact listed set; refuses a clock behind the newest event; dry run shows the clock                                                           |
| M4  | Unverified seal index used in paths; malformed seal threw | Index from the file name, validated; malformed seal is a verification failure                                                                                      |
| L3  | `--max-bytes abc` silently did nothing                    | Rejected                                                                                                                                                           |

The re-review found the fixes sound (conditional PASS) and raised two new medium findings, both fixed with tests:

| ID  | Finding                                                              | Fix                                                                              |
| --- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| N1  | Recovery trusted the newest seal file without checking its signature | `seal` runs `verifySegments` first; only a verified interrupted roll may proceed |
| N2  | A planted file at the next segment path wedged sealing               | Moved aside as `quarantine-…` (never deleted) and named in the new genesis       |
| N3  | A recovery looks the same as a laundered rollback                    | `recovered_roll` is written into the signed genesis                              |
| N6  | No verification after a prune                                        | `prune` returns `verifiedAfter`                                                  |

Open, accepted: M3 (a clock that jumps forward is shown in the dry run but not blocked), N4 (no copy fallback where hard links are unsupported; fails loud), N5 (a stray seal event inside a segment is harmless).

Accepted as limits: L1 (a failed seal leaves a seal event mid-segment, fail loud), L2 (no cross-check that a pruned file has a prune event), L4 (see §7), L5 (month overflow over-retains).

## 7. Limits (Rule 12)

- A site-key holder can still rewrite everything, including seals. The key pin (`--expect-key-id`) and copying the head hash to the customer's own records remain the anchor.
- Retention is per segment, not per event. A segment with one stop event is kept 5 years. The `agent.decide` events that led up to a stop can sit in an earlier 6-month segment; there is no legal-hold flag yet (review L4).
- Customer sector law (CSRD, NIS2, CER) can require longer retention. The kit does not read it from the scope; the operator decides not to prune.

## 8. HIC decision

Should the retention classes become part of the signed Phase 0 scope (per customer, with §4 values as the minimum), or stay fixed in code for the pilot?
