# Handoff — claude/github-actions-dgx-migration-7droip

- Task: evaluate Preloop (preloopdev/preloop) for moving GHA onto DGX.
- State: research done → docs/field-notes/2026-09-23-preloop-gha-to-dgx-evaluation.md (PENDING_REVIEW).
- Recommendation: no replacement of existing dgx-spark runner; 1-day pilot as agent pre-push local CI.
- Decision (HIC 2026-09-23): Preloop deferred until 1.0. Open: interim runner hardening (§5a).
- 2026-09-23 update: CVE-2026-80521 (Ubuntu container escape, unpatched) → §5a added; pilot raised to security priority; interim runner hardening listed.
- 2026-09-23: hardened ephemeral runner drafted (setup-github-runner.sh v2 + gh-runner/). Next: HIC creates PAT, runs setup on DGX, verifies one PR check per workflow.
