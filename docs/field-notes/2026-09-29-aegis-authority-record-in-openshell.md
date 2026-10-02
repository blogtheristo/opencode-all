# Aegis Pilot — decision-authority record proven with OpenShell containment

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 29.09.2026 | Changes: Created. #2229 merged into the #2230 branch ahead of time; combined real-gateway rehearsal result. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 29.09.2026
- Status: PENDING_REVIEW

---

## What happened

PR #2229 (decision-authority record, stop tombstone, credential digest bound at grant) and PR #2230 (OpenShell containment) each touched the runbook §6 and `src/aegis/pilot/index.ts`, so whichever merged second would conflict. #2229's branch was merged into #2230's branch and the two conflicts were resolved: the runbook keeps step 6 (authority record) followed by §6.1 (OpenShell setup), and the index exports both modules. Either PR can now merge first.

The combined code was rehearsed against the real OpenShell gateway, inside `unshare --net`:

| Measure                                                   | Result                                             |
| --------------------------------------------------------- | -------------------------------------------------- |
| Acceptance outcome                                        | PASS; reconcile replayed; ledger and record verify |
| Operator stop command accepted                            | 99 ms                                              |
| Sandboxed stop-test agent terminated (deletion confirmed) | 5,298 ms                                           |
| Work events from the stopped agent after the stop         | 0 (refused attempts: 0)                            |
| Credential file matches the digest written at grant       | yes, for both agents                               |
| Tests                                                     | 75 pass                                            |

## The insight

The record now answers the buyer's question end to end for an agent running under real containment. Who held authority is the grant with its credential digest. What followed is completed for the workflow agent and stopped for the stop-test agent. The negative evidence is that nothing was recorded after the halt moment, and termination was confirmed by the sandbox's absence. That combination is what the offer's Appendix A describes. It is now demonstrated rather than only designed.

## Next steps

1. The HIC merges #2228–#2231.
2. M4: the same rehearsal on the pilot's edge hardware, with a witness (target 25.10).
3. C4 remainder: OCSF events into the ledger, prover result in the record.

## Learning outcome steps

1. KB: N/A. This is implementation evidence for a branch whose field notes (`2026-09-28-nvidia-openshell-aegis-c4.md`) are already the KB source. It will be ingested at merge.
2. Field note: this file.
3. Learn HTML: `Learn/2026-09-29-aegis-authority-record-in-openshell.html` (rendered with Python-Markdown; pandoc is not installed in this container).
4. Drive export: N/A. No Drive connector write in this session; the repository is the source of truth.
5. HIC decision: which hardware runs M4 (DGX Spark or GN100), and which router takes the deny-all rule?
6. Calendar: N/A. No new dated commitment; the 02.10, 15.10, 30.11 and 31.12 entries already exist.
