# Copilot $210 credit and the DGX Persistence Rule — 2026-09-27

# VERSION AND AGENT HISTORY

---

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/copilot-pro-bonus-credits-9jptij | Date: 27.09.2026 | Changes: HIC delegated the §5 decision to the agent; answer recorded.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/copilot-pro-bonus-credits-9jptij | Date: 27.09.2026 | Changes: Initial note. HIC decision on the Copilot promotional credit and the DGX Persistence Rule.

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Status: PENDING_REVIEW

---

## 1. What happened

- GitHub gave Copilot Pro+ a one-time **$210.00 promotional credit** (21,000 AI credits). It expires on 30.09.2026 at 23:59 UTC according to the email, and on 01.10.2026 according to the billing page. The billing page showed **$0 applied** on 27.09 (HIC screenshot).
- The first task list for Copilot (26.09) was checked against the repo on 27.09. Two of its three items were stale:
  - #2064 and #2002 were no longer open.
  - The KYA gate and the attestation stub already had tests.
  - The third item, the dashboard role gap, already had three open PRs (#2016, #2035, #2075).
- A corrected work order is in `.claude/handoffs/copilot-bonus-credits-2026-09-30.md`. Its lanes:
  - A: server-owned dashboard roles
  - B: PR backlog
  - C: test coverage
  - D: move persistent cloud work to DGX
- **HIC decision (27.09.2026):** use the credit in full. Anything a cloud agent builds that has to keep running must be implemented on DGX. This is recorded in `docs/DWS_COST_POLICY_STANDARD.md` v1.1. PR #2133.

## 2. The insight

- Free credit is only worth what reaches `main` as reviewed code. The limit is review capacity, not credits. Every Copilot item is one PR, never auto-merged.
- A task list goes stale within a day in a repo with more than 45 open PRs. Check it against live PR state before handing it to an agent.
- Cloud agents are fine for one-off output. A capability that lives in a cloud runtime ties DWS to that vendor and keeps costing money after the free credit ends. The Persistence Rule closes that gap.

## 3. Next steps

1. HIC merges PR #2133.
2. On 29.09, check the Copilot promotional credit line on the billing page. If it is still near $0, Copilot is not drawing on the credit.
3. After 30.09, check every PR Copilot claims against the PR list. Earlier Copilot summaries contained made-up PR numbers.
4. Lane D output (the inventory of scheduled workflows and their DGX cron targets) goes to OpenCode for DGX deployment.

## 4. Session Learning Outcome steps

- Field note: this file.
- Learn/ HTML: rendered with `scripts/render-doc.sh`.
- KB update: N/A — this cloud session has no DGX KB access. Queued for the next OpenCode `/kb` run.
- Drive export: N/A — the Google Drive connector is not authorised for writes in this session. The repo is the source of truth.
- Calendar: N/A — the 29.09 check-in is an HIC action in PR #2133. No meeting is involved.
- HIC decision question: asked in chat on 27.09.2026 (see §5).

## 5. Open HIC question

If Copilot has spent under $100 of the credit by 29.09 at 18:00 UTC, should the rest go to Lane D (moving cloud work to DGX) ahead of the remaining Lane B backlog items?

**Answer (HIC delegated the decision to the agent, 27.09.2026):** Yes. Lane A stays first. If less than $100 is spent by 29.09 at 18:00 UTC, the remaining credit goes to Lane D before the remaining Lane B items.

Reasons:

1. Lane D has lasting value. Each workflow moved to DGX stops recurring GitHub Actions runs. `pr-auto-merge` alone ran 1,002 times in 14 days (`.claude/handoffs/pr-backlog-2026-09-25.md` §1).
2. Lane B is merge maintenance. OpenCode on DGX can do it at no cloud cost after the credit window.
3. The Persistence Rule (cost policy v1.1) points the same way. Credit spent on moving work to DGX lowers cost after 01.10.
