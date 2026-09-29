# Handoff — claude/aegis-pilot-openshell-03ist6

**Task:** Aegis Pilot (DWS-AEGIS-PILOT-001) toward 95 % readiness. HIC 28.09.2026: in 2026 only the DWS IQ 7 Aegis Pilot is delivered; all focus on it until done.

**State (28.09.2026, 22:10 UTC):**

| PR    | Branch                                       | What                                                                                                                  | State                               |
| ----- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| #2225 | —                                            | Pilot kit, hard stop, severed-uplink acceptance                                                                       | Merged                              |
| #2226 | —                                            | 95 % readiness plan + 6 loop specs                                                                                    | Merged (HIC, 19:48 UTC)             |
| #2228 | `claude/nvidia-agent-safety-signal-03ist6`   | PhD §14.55, sales pipeline 1.2 (rows 14.55, 14.56)                                                                    | Green; waiting on HIC merge         |
| #2229 | `claude/aegis-pilot-authority-record-03ist6` | Decision-authority record, stop tombstone, credential digest at grant                                                 | Green; waiting on HIC merge         |
| #2230 | this branch                                  | OpenShell containment (C4) verified on a real build; offers (generic v1.5, Kemira, Outokumpu, one-pager); field notes | Green; security re-review PASS; HIC |
| #2231 | `claude/proof-year-2026-03ist6`              | 2026 proof-year criteria v1.3; Aegis roadmap 1.4 (KM1–KM5, target industries, beside-the-loop rule)                   | Green; waiting on HIC merge         |

**C4 result:** severed-uplink rehearsal PASS with steps and the stop-test agent in OpenShell sandboxes (OpenShell built from source, local gateway, Docker driver). Stop: command 27–44 ms, sandbox deletion confirmed about 5.2 s, 0 ticks after termination. Security review FAIL → fixed → PASS. Details: `docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md` §5–§6; setup: runbook §6.1.

**Container is ephemeral.** Lost on restart: OpenShell build (`/tmp/claude-0/openshell`), images `aegis-pilot-node:22-os` and `aegis/openshell-supervisor:local`, gateway config under the scratchpad. Rebuild per runbook §6.1 before the next real-binary run.

**Next (in order):**

1. HIC decisions (below). Nothing outbound is sent without them.
2. M4 witnessed staging acceptance on edge hardware (target 25.10, P80 08.11): needs the HIC's hardware choice.
3. C4 remainder: OCSF events into the ledger, prover result in the record. Hardening candidates: sealed result channel, kill-before-delete (stop latency), disk limits.
4. C2 retention, C3 threat model before the 12.10 cloud-agent block (CLAUDE.md rule 14).
5. After #2228 merges: PhD §14.56 (HF signal), four-file lockstep.

**HIC decisions open:**

- Merge #2228, #2229, #2230, #2231.
- M4 hardware (DGX Spark or GN100) and the router for the deny-all rule.
- First offer out this week (Outokumpu recommended; replaces the May zero-cost pilot). Kemira: ask Maria who owns the carbon-figure approval before offering.
- Catalogue: rename to "DWS IQ 7 Aegis"; other products "not available in 2026" or hidden (Store/catalogue change, RED).
- Patria letter → Aegis Pilot form?
- Pilot contract target 02.10, hard limit 15.10 for KM1 in 2026 (calendar entries exist).

## Next-session prompt

```
Continue Aegis Pilot on branch claude/aegis-pilot-openshell-03ist6. Read .claude/handoffs/claude/aegis-pilot-openshell-03ist6.md, docs/plans/2026_PROOF_YEAR_CRITERIA.md (PR #2231) and docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md §5–§6.
1. Check PRs #2228–#2231: CI, review threads, merge state; fix any red check.
2. Act on the HIC decisions listed in the handoff that have been answered; ask for the rest in one message.
3. Next engineering item: C4 remainder (OCSF events into the ledger, prover result in the record), then C2 retention and C3 threat model before 12.10.
4. Do not send outreach, publish the blog, or change Store/catalogue without explicit HIC approval.
Finish with node scripts/agent-done-gate.mjs --full output.
```
