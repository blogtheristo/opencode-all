# Handoff — Aegis Pilot implementation, Day 3 → Day 4

**Date:** 30.09.2026 · **From:** Claude Code (cloud) · **Branch:** `claude/aegis-day4-handoff`
**Previous:** `.claude/handoffs/claude/optimistic-bohr-5alsp7.md` (Day 3) · **Plan:** `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` v1.5 (Day 3 = 8.25/11 = 75 %)

## Merged since Day 3

| Item                             | PR                      | Gate   |
| -------------------------------- | ----------------------- | ------ |
| A1 `doctor`                      | #2255                   | G5, G7 |
| A3 `check-handlers`              | #2257                   | G3, G6 |
| A4 nightly rehearsal             | #2258                   | G6, G7 |
| A5 systemd unit + health timer   | #2260 (sweep #2282)     | G7     |
| A6 skill + manifest              | #2261 (sweep #2282)     | G4     |
| GKE agent-sandbox policy         | #2267 (sweep #2282)     | G5     |
| Market research + C5 ledger      | #2232 (sweep #2282)     | G3, G5 |
| OpenShell review: 2 crit, 4 high | #2289 (200 tests)       | G5     |
| OpenShell review: M1, M2, M4     | #2290 (203 tests)       | G5     |
| Loop `settled` helper restored   | #2293 (loop can run A2) | —      |

#2290 detail: `internalHost` refuses octal/hex/short/integer IPv4, 192.0.0/24, 198.18/15, ≥224;
`terminateSandbox` settles a pending create before delete; `confirmSandboxGone` needs two
consecutive absent listings; a failed step does not promote its files.

## Proposed Day 4 scorecard (not yet written to the plan — Day 4 updates it to v1.6)

| Gate | Day 3 | Proposed | Evidence to cite                                     |
| ---- | :---: | :------: | ---------------------------------------------------- |
| G4   | 0.60  |   0.90   | A6 skill + manifest (#2261); MCP exposure still open |
| G5   | 0.90  |   0.95   | A1 doctor, #2289/#2290; C3 threat model still open   |
| G6   | 0.90  |   1.00   | A1/A3/A4 suites, nightly rehearsal                   |
| G7   | 0.40  |   0.75   | A4, A5, C2; A2 export bundle still open              |

Proposed total ≈ 9.05/11 → 82 %. Verify each number against the merged code before writing it.

## Open

1. **A2 export bundle** — loop PR #2256 (`opencode/aegis-pilot-export-bundle`), conflicted. Loop restart after #2293 needed on the DGX (`git pull && opencode-loop restart`). Takeover rule: if still BLOCKED/conflicted on 02.10, Claude Code codes it per `.claude/done/opencode/aegis-pilot-export-bundle.json`.
2. **C3 threat model** (G5, plan §5.2) — not started. Must cover state-dir writer, key custody, isolation spoofing, operator impersonation, OpenShell gateway trust; link #2225/#2289/#2290 findings and their tests.
3. **C4 remainder** — OCSF events from OpenShell into the Art. 12 ledger.
4. **Findings OPEN** in `docs/plans/KNOWLEDGE_LOOP_FINDINGS.md`: lease-token single-use; TC4 safe-halt (Art. 14(4)(e)); OpenShell M3 (listing positive control); OpenShell M5 (atomic, namespaced promotion).
5. **H1 acceptance annex** + Phase 0 scope/signoff template — draft for HIC approval (Approval Request Rule: Artifact link).
6. **M4 witnessed run (H3)** on DGX Spark, `physical-disconnect` — arm64 OpenShell rebuild, runbook §6.2. HIC is the witness.

## Deadlines

- 02.10 pilot contract target; 15.10 hard limit. Outokumpu and Kemira offers pending.
- M1 04.10 · M2 11.10 · M3 18.10 · M4 25.10 (P80 08.11).
- **12.10 cloud-agent block** — C3, C4 remainder, M3/M5 must merge by 11.10 or move to a DGX-local session.

## HIC decisions outstanding

1. Network allowlist: eur-lex.europa.eu, arxiv.org, doi.org, omg.org (sources for C3 and H1 citations).
2. Date for the M4 witnessed run (needs HIC at the DGX Spark to pull the cable).

## Next-session prompt

```
Aegis Pilot implementation Day 4. Read .claude/handoffs/claude/aegis-day4-handoff.md, docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md (v1.5), docs/runbooks/AEGIS_PILOT_RUNBOOK.md and docs/plans/KNOWLEDGE_LOOP_FINDINGS.md.
1. PR #2256 (A2 export bundle): check merge state, CI and loop status (opencode-loop status | grep -E 'blocked|aegis'). If conflicted or BLOCKED and the loop has not moved it by 02.10, take it over per .claude/done/opencode/aegis-pilot-export-bundle.json.
2. Security fixes, tests first, in src/aegis/pilot/: OpenShell M3 (listing positive control) and M5 (atomic, namespaced promotion); lease-token single-use; TC4 safe-halt (Art. 14(4)(e)). Close each row in KNOWLEDGE_LOOP_FINDINGS.md with its commit.
3. C3 threat model: docs/security/AEGIS_PILOT_THREAT_MODEL.md (state-dir writer, key custody, isolation spoofing, operator impersonation, OpenShell gateway trust), each threat linked to its mitigation and test (#2225, #2289, #2290).
4. C4 remainder: OpenShell OCSF events into the ledger, with tests.
5. Update the readiness plan to v1.6 with a Day 4 scorecard column; verify each gate number against merged code (handoff has proposed values).
6. Draft H1 acceptance annex + Phase 0 scope/signoff template; publish as an Artifact for HIC approval, do not merge customer-facing text without it.
Everything security-related must merge before 11.10 (cloud-agent block 12.10).
Do not send outreach, publish blog posts, or change Store/catalogue/pricing without explicit HIC approval.
Write the Day 5 handoff at .claude/handoffs/claude/<branch>.md. Finish with node scripts/agent-done-gate.mjs --full output.
```
