# Handoff — Aegis Pilot day 2 (claude/aegis-pilot-implementation-03ist6)

**Task:** DWS IQ 7 Aegis Pilot (DWS-AEGIS-PILOT-001) toward 95 % readiness. HIC 28.09.2026: in 2026 only the Aegis Pilot is delivered; all focus on it until done.

**State (29.09.2026):** Day 1 is merged to `main` (HIC 29.09.2026):

| PR    | What                                                                                                | Merge commit |
| ----- | --------------------------------------------------------------------------------------------------- | ------------ |
| #2228 | PhD §14.55, sales pipeline 1.2 (rows 14.55, 14.56)                                                  | `a16aaff`    |
| #2229 | Decision-authority record, stop tombstone, credential digest bound at grant                         | `b62a165`    |
| #2230 | OpenShell containment (C4) on a real build; offers (generic v1.5, Kemira, Outokumpu, one-pager)     | `d8bd21d`    |
| #2231 | 2026 proof-year criteria v1.3; Aegis roadmap 1.4 (KM1–KM5, target industries, beside-the-loop rule) | `4d6b233`    |

Real-gateway rehearsal (authority record + OpenShell): PASS; operator command 99 ms, sandbox termination 5,298 ms, 0 events after the stop, credential digest matches. Evidence: `docs/field-notes/2026-09-29-aegis-authority-record-in-openshell.md`, `docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md` §5–§6, runbook §6.1.

**HIC decisions 29.09.2026:**

- **M4 hardware: DGX Spark** (the dev machine).
- **Router deny-all: not needed.** The HIC does not see a need for it. Use `isolation.method: physical-disconnect` (runbook §6, the strongest rung: the HIC unplugs the uplink cable and disables Wi-Fi). It is stronger than `router-deny-all` and is applied by someone other than the system under test, so it satisfies H3/G10 in `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md`. Update the plan's H3 row and risk line to say so.

**Next (in order):**

1. M4 on DGX Spark (target 25.10, P80 08.11): rebuild OpenShell per runbook §6.1 on the Spark (arm64; container images must be arm64), run the rehearsal, then the witnessed run with `physical-disconnect`, HIC as witness; verify the bundle on a second machine.
2. C4 remainder: OCSF events into the ledger, prover result in the record. Hardening candidates: kill-before-delete (stop latency ~5.2 s is Docker's SIGTERM grace), sealed result channel, disk limits.
3. C2 retention, C3 threat model before the 12.10 cloud-agent block (CLAUDE.md rule 14). After 12.10 this work moves to the DGX (opencode-loop).
4. PhD §14.56 (Hugging Face signal), four-file lockstep; #2228 is merged, so it is unblocked.
5. C5 candidate (network budget, egress digests): HIC decision open.

**HIC decisions still open:**

- Outokumpu offer out this week (`sales-package-v1.0/aegis-pilot-tarjous-outokumpu-fi.md`, DRAFT). Kemira: ask Maria who owns the carbon-figure approval first (`…-kemira-fi.md`, DRAFT; recipient email missing).
- Catalogue rename to "DWS IQ 7 Aegis"; other products "not available in 2026" (Store change, RED).
- Patria letter → Aegis Pilot form?
- Pilot contract target 02.10, hard limit 15.10 (calendar entries exist).

## Next-session prompt

```
Aegis Pilot day 2. Branch claude/aegis-pilot-implementation-03ist6 (from main). Read .claude/handoffs/claude/aegis-pilot-implementation-03ist6.md, docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md, docs/runbooks/AEGIS_PILOT_RUNBOOK.md §6–§6.1.
HIC decided 29.09: M4 runs on DGX Spark; no router deny-all, use physical-disconnect.
1. Update the readiness plan H3 row and staging-hardware risk to DGX Spark + physical-disconnect.
2. Write the M4 checklist for DGX Spark (arm64 OpenShell build, images, rehearsal, witnessed run, second-machine verify) into the runbook.
3. C4 remainder: OCSF events into the ledger, prover result in the authority record; tests first.
4. PhD §14.56 (Hugging Face signal) four-file lockstep.
Do not send outreach, publish the blog, or change Store/catalogue without explicit HIC approval.
Finish with node scripts/agent-done-gate.mjs --full output.
```
