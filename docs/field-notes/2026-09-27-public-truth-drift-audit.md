# Weekly Public Truth Drift Audit

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/fix-selected-issues-2099-2058-1847-1846-1833 | Date: 27.09.2026 | Changes: Implemented the DGX-primary weekly truth, technology, partner-evidence, and public-folder mirror audit with heartbeat-gated GitHub Actions failover. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Session Links & References:

- Issue: https://github.com/blogtheristo/dws6/issues/1846
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-09-27-public-truth-drift-audit.md

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-27
- **Author:** GitHub Copilot CLI, on behalf of Lifetime Oy
- **Location:** DWS6 repository, isolated local worktree
- **Context:** Issue #1846; weekly public truth, technology, partner, and mirror drift detection

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > Governance Automation
- **Entities:** DWS Truth Standard, DGX Spark, GitHub Actions, KYA-S1
- **Systems:** `scripts/weekly/public-truth-drift-audit.mjs`, `config/truth/tech-and-partners-registry.json`, `Cron-works.md`
- **Temporal Context:** 2026-Q3
- **Confidence:** High; the checks are deterministic and run against repository state.

## The Story

Issue #1846 described a weekly audit, but current `main` had no audit engine, registry, runner, workflow, or schedule entry. The implementation now uses the existing truth-claim linter, environment-pin checker, and governed product-publication validator. It adds canonical-source and structured-value assertions for KYA, A2A, Aspire, Node.js, TypeScript, React, Python, legal identity, industry counts, and production runtime; verifies named partner evidence files; and compares all four public root folders with their landing-page mirrors.

DGX Spark is primary through `scripts/weekly/` auto-discovery. GitHub Actions runs at 04:20 UTC on Sunday only when the DGX heartbeat is unavailable; manual dispatch always runs. Drift is reported in one deduplicated GitHub issue with a recommended fix branch.

The registry records Scaleway as a retired production runtime provider, not an active deployment target. This corrects the August issue description against the 26 September DGX production cutover.

## The Insight

A drift audit must call existing deterministic validators and canonical sources. Re-encoding pricing, terminology, or version rules inside a new script would create another source of truth and guarantee future disagreement.

## Learning Outcome Status

1. **KB:** N/A — this is an operational control, already registered in the Truth Standard.
2. **Field note:** Complete.
3. **Learn HTML:** Generated from this note.
4. **Drive export:** N/A — no Drive tool is available in this session.
5. **HIC decision:** Pending below.
6. **Calendar:** N/A — the recurring schedule is code-managed in DGX and GitHub Actions, not a personal commitment.

## Next Steps

- [ ] HIC Q2 (two-way door): keep the current policy that any warning opens/updates the drift issue, or limit issue creation to errors. **Recommendation: keep warnings actionable; the current repository already has known public-copy warnings that should remain visible.**
- [ ] After merge, manually dispatch `public-truth-drift-audit.yml` once to verify GitHub issue permissions and heartbeat bypass.

---

Version 1.0 · 27.09.2026
Copyright © 2026 Lifetime Oy
Classification: INTERNAL
