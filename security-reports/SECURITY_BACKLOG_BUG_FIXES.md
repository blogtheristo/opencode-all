# Security Backlog — Dependabot Alert Triage (Aegis SLA)

**Owner:** Vulnerability & Patch Owner (currently Risto Paarni) — see `docs/SECURITY_ROLES_AND_GUIDANCE.md` role 1.
**Classifier:** `Aegis` agent (`src/agents/aegis.agent.ts`), fed by `scripts/weekly/security-audit.sh`'s Dependabot Alert SLA triage step.
**Linked from:** `.github/workflows/security-check-pr.yml`, `security-scan-weekly.yml`, `security-scan-biweekly.yml` — this file previously did not exist even though those workflows already pointed at it.

## SLA (must match `src/agents/aegis.agent.ts`'s `SLA_DAYS` constant)

| Severity | Remediation SLA |
| -------- | --------------- |
| Critical | 2 days          |
| High     | 7 days          |
| Moderate | 30 days         |
| Low      | 90 days         |

## 2026-07-04 baseline — what is verified vs. not

`.github/dependabot.yml` went from a 0-byte file to fully populated (13 npm ecosystems + root pip + GitHub Actions, all weekly) in commit `936dc86`. GitHub's Security tab is reporting 432 open Dependabot alerts on `main`. This entry records what could and could not be verified from this session, in the open per CLAUDE.md Rule 12 ("fail loud — surface uncertainty, never hide it").

**Verified clean (local `npm audit`, run 2026-07-04):** all 10 directories with a `package-lock.json` — root, `Firehorse/mobile-app`, `dws6.com/dashboard/firehorse/v10-react`, `dws6.com/tools/content-pipeline`, both `landing-pages/dws6-com/...` mirrors, `mobile-dashboard`, `src/cloudflare`, `cli`, `mcp-hub-ts`, `mcp-servers/cloud-run-gateway-ts` — reported **0 vulnerabilities at every severity**. `lambda/ses-inbound-parser` and `infrastructure/dgx-spark/bumblebee` have no lockfile, so `npm audit` cannot run there.

**Partially verified — real severity breakdown, no per-alert detail yet:** the 432-alert figure itself could not be reconciled from this session (no `gh` CLI, and the connected GitHub MCP server does not expose the `dependabot/alerts` endpoint). But `git push`'s own remote output on 2026-07-04 reported GitHub's live count directly: **279 open vulnerabilities — 6 critical, 102 high, 137 moderate, 34 low**. That is authoritative (straight from GitHub, not a guess) but has no per-package/per-alert first-seen dates attached, so individual SLA-breach status (critical >2d / high >7d) cannot be computed yet — only that 6 critical + 102 high alerts exist and need per-alert triage now. A clean local `npm audit` does not contradict this: GitHub's count spans the full Advisory DB across all three enrolled ecosystems (npm, pip, github-actions) and transitive dependencies, none of which a point-in-time `npm audit` against current lockfiles reproduces.

**Immediate action implied by the 6 critical / 102 high split:** per the SLA table above, every critical alert older than 2 days and every high alert older than 7 days is already a breach the moment its `created_at` is checked. Until the `gh api` pull below runs, treat all 6 critical alerts as top priority for this week's triage pass.

**Action required (human, Vulnerability & Patch Owner):** pull the real list and run it through Aegis's SLA math:

```bash
gh api "repos/blogtheristo/dws6/dependabot/alerts" -X GET -f state=open --paginate \
  -q '.[] | {number, severity: .security_advisory.severity, package: .dependency.package.name, ecosystem: .dependency.package.ecosystem, created_at}' \
  > security-reports/dependabot-alerts-raw.jsonl
```

then classify each row against the SLA table above (critical >2d old / high >7d / moderate >30d / low >90d = breach) and record breaches below. `scripts/weekly/security-audit.sh` now does this automatically wherever `gh` is available (e.g. the DGX Spark weekly runner) and posts the breach/at-risk counts into the `weekly-scan`-labeled GitHub issue — this file should be updated from that output each week it runs.

## Weekly Dependabot PR triage runbook

`.github/dependabot.yml` opens weekly PRs (minor/patch grouped per ecosystem, `open-pull-requests-limit` 5–10). For each PR that lands:

1. Read the severity GitHub assigns (from the linked alert, if the PR closes one) or treat unlabeled version bumps as "moderate" by default.
2. Check CI (`security-check-pr.yml` runs on every PR touching `**.py/**.ts/**.js`).
3. Minor/patch grouped PRs with green CI: merge promptly — no new risk, closes the SLA clock for anything they fix.
4. Major/breaking-version PRs: route to human review within the SLA window for the highest-severity alert they close; do not let them age silently.
5. If a PR is deferred past its SLA, log it below as an explicit risk-acceptance (not a silent skip) with a reason and a re-review date.

## Triage log

| Date       | Alert/PR # | Package                | Severity | SLA deadline | Status   | Decision                                                                                                   | Owner        |
| ---------- | ---------- | ---------------------- | -------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------- | ------------ |
| 2026-07-04 | —          | (all npm-audited dirs) | n/a      | n/a          | on-track | Baseline confirmed clean via local `npm audit`; live alert-by-alert triage pending the `gh api` pull above | Risto Paarni |

_Add one row per alert/PR as it is triaged going forward. Do not delete rows — this is the SLA-breach audit trail._
