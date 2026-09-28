# Handoff — claude/aegis-pilot-openshell-03ist6

**Task:** Aegis Pilot (DWS-AEGIS-PILOT-001) toward 95 % readiness: C4 OpenShell containment, decision-authority record, Finnish offer, GTM route.

**State (28.09.2026, end of session):**

| PR / branch                                        | What                                                                                                | State                                |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| #2225                                              | Pilot kit, hard stop, severed-uplink acceptance                                                     | Merged                               |
| #2226 `claude/aegis-pilot-readiness-plan-03ist6`   | 95 % plan v1.2 (target 25.10.2026, P80 08.11) + 6 loop specs                                        | Open; HIC said "merge" when CI green |
| #2228 `claude/nvidia-agent-safety-signal-03ist6`   | PhD §14.55 (4.15), pipeline v1.1 + row 14.56 (HF signal)                                            | Open; HIC decision to merge          |
| #2229 `claude/aegis-pilot-authority-record-03ist6` | Authority record, stop tombstone, credential digest bound at grant (58 tests)                       | Open; ready for review               |
| this branch                                        | OpenShell driver (C4), offer v1.5, blog draft rev 2 (DRAFT, Rule 13), HF field note; main merged in | PR opened this session               |

- Offer v1.5 `sales-package-v1.0/aegis-pilot-tarjous-fi.md`: short buyer part (record first, sandbox under it); Appendix A = halt boundary (writer = host-side driver, halt moment = signing of `system.agent_terminated`, bounded claim, what it does not cover, hardening phase: freeze/TPM quote extraData/measured boot/IMA/RIM); Appendix B = sovereignty mechanism.
- Code fix this session: an OpenShell step stopped during output copy-back is a stop (no copy-back after an accepted stop).
- OpenShell real-binary spike NOT run. OpenShell built from source earlier; Docker image `aegis-pilot-node:22` built locally (container is ephemeral — rebuild).

**GTM decision in progress (Boardy/Gemini, HIC 28.09.2026):** first wave = funds, not direct. Ask a fund for one named decision-authority holder (portfolio CTO/COO), not a deal. 2–3 funds, not 20–25. Waiting on HIC for the fund names.

**Next (in order):**

1. PhD §14.56 (Hugging Face allowed-traffic monitoring signal) — four-file lockstep + Learn HTML, after #2228 merges. Field note `docs/field-notes/2026-09-28-hf-openshell-allowed-traffic-monitoring.md`.
2. OpenShell real-binary spike: gateway on Docker, `npm run aegis:pilot:rehearse-isolated -- --containment openshell --image aegis-pilot-node:22`; record termination latency; security review of the driver.
3. Merge #2226 when green; watch #2228, #2229, this PR.
4. C5 candidate (HIC decides): per-step network budget + egress payload digests in the ledger.
5. C2 retention, C3 threat model before the 12.10 cloud block.

**Blockers / HIC decisions:** offer v1.5 approval; fund names (2–3); duplicate LF-DOCA-SECURITY catalogue rows (Sentry option price is a placeholder); blog publish only after OpenShell gate passes; hardware-held keys into the hardening plan.

## Next-session prompt

```
Continue Aegis Pilot on branch claude/aegis-pilot-openshell-03ist6. Read .claude/handoffs/claude/aegis-pilot-openshell-03ist6.md first, then docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md (PR #2226) and sales-package-v1.0/aegis-pilot-tarjous-fi.md Appendix A.
1. Check PRs #2226, #2228, #2229 and the OpenShell PR: CI, review threads, merge state. Merge #2226 if green (HIC approved).
2. Run the OpenShell real-binary spike (rebuild OpenShell from source and the aegis-pilot-node:22 image if the container is fresh); rehearsal with --containment openshell; put the measured termination latency into the acceptance record and the runbook; security-review openshell-handlers.ts.
3. If #2228 is merged: PhD §14.56 from docs/field-notes/2026-09-28-hf-openshell-allowed-traffic-monitoring.md (four files + Learn HTML, additive).
4. Do not send any outreach or publish the blog. Fund outreach waits for HIC names; the ask text is in the handoff session transcript and field note.
Finish with node scripts/agent-done-gate.mjs --full output.
```
