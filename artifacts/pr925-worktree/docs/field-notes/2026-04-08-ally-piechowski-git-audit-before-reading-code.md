# Field Note: Ally Piechowski's Git Audit — 5 Commands Before Reading Any Code

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/github-audit-lab-notes-eJTj8 | Date: 20.04.2026 | Changes: Initial field note documenting Ally Piechowski's 5 diagnostic git commands for codebase audits. Operationalised as weekly cron in scripts/weekly/git-audit-diagnostics.sh

Document Status:

- Created: 20.04.2026
- Last Modified: 20.04.2026
- Language: English
- Publication Status: ACTIVE (Private — docs/field-notes/)

---

**Date:** 2026-04-08 (article published)
**Session:** claude/github-audit-lab-notes-eJTj8
**Context:** Operationalising git-based codebase diagnostics for DWS6 weekly audits

---

## Summary

Before opening a single file in a new codebase, Ally Piechowski runs 5 git commands that reveal where the project hurts: which files change constantly, who built what, where bugs cluster, whether momentum is rising or falling, and how often the team firefights. A 2005 Microsoft Research study found churn-based metrics predicted defects more reliably than complexity metrics alone. We adopt these commands as a weekly automated audit for the dws6 repo.

## The Five Commands

### 1. What Changes the Most (Churn Hotspots)

```bash
git log --format=format: --name-only --since="1 year ago" | sort | uniq -c | sort -nr | head -20
```

The 20 most-changed files in the last year. The file at the top is almost always the one people warn you about. High churn alone is not bad — it can mean active development. But high churn on a file nobody wants to own is codebase drag: every change is a patch on a patch, blast radius is unpredictable, and the team pads estimates.

Cross-reference the top 5 against the bug hotspot command below. A file that is high-churn AND high-bug is your single biggest risk.

### 2. Who Built This (Bus Factor)

```bash
git shortlog -sn --no-merges
```

Every contributor ranked by commit count. If one person accounts for 60%+ of commits, that is your bus factor. If they left 6 months ago, it is a crisis. Compare against the recent window:

```bash
git shortlog -sn --no-merges --since="6 months ago"
```

If the top contributor from the all-time list does not appear in the 6-month window, flag it immediately. Also look at the tail — 30 contributors but only 3 active in the last year means the people who built this system are not the people maintaining it.

**Caveat:** Squash-merge workflows compress authorship. If the team squashes every PR into a single commit, this output reflects who merged, not who wrote. Ask about the merge strategy before drawing conclusions.

### 3. Where Do Bugs Cluster (Bug Hotspots)

```bash
git log -i -E --grep="fix|bug|broken" --name-only --format='' | sort | uniq -c | sort -nr | head -20
```

Same shape as the churn command, filtered to commits with bug-related keywords. Files appearing on both the churn list and this list are the highest-risk code — they keep breaking and keep getting patched, but never get properly fixed.

This depends on commit message discipline. If the team writes "update stuff" for every commit, you get nothing. But even a rough map of bug density beats no map.

### 4. Is This Project Accelerating or Dying (Velocity)

```bash
git log --format='%ad' --date=format:'%Y-%m' | sort | uniq -c
```

Commit count by month for the entire repo history. Scan for shapes:

- **Steady rhythm** — healthy
- **Count drops by half in one month** — someone left
- **Declining curve over 6-12 months** — team losing momentum
- **Periodic spikes then quiet** — batched releases instead of continuous shipping

This is team data, not code data. One CTO saw their commit velocity chart and said "that's when we lost our second senior engineer" — they hadn't connected the timeline before.

### 5. How Often Is the Team Firefighting (Crisis Patterns)

```bash
git log --oneline --since="1 year ago" | grep -iE 'revert|hotfix|emergency|rollback'
```

Revert and hotfix frequency. A handful over a year is normal. Reverts every couple of weeks means the team does not trust its deploy process — unreliable tests, missing staging, or a deploy pipeline that makes rollbacks harder than they should be. Zero results is also a signal: either the team is stable, or nobody writes descriptive commit messages.

## Cross-Reference Play

The most valuable signal comes from overlaying command 1 (churn) and command 3 (bugs). Files appearing in both top-20 lists are the highest-risk code in the repo. These are files that change constantly and keep breaking — the definition of technical debt that actively costs the team.

## DWS Application

These 5 commands are operationalised as a weekly cron job:

- **Script:** `scripts/weekly/git-audit-diagnostics.sh`
- **Output:** `logs/weekly-git-audit.json` (structured JSON report)
- **Schedule:** Auto-discovered by `day-runner.sh`, runs Sunday ~04:00 UTC
- **Key signals tracked weekly:**
  - Top-churned file and commit count
  - Bus factor percentage (top contributor share)
  - Bus factor drift (all-time vs 6-month contributor lists)
  - High-risk file count (churn intersection with bug hotspots)
  - Revert/hotfix count (firefighting frequency)

Trending these signals weekly lets us detect drift (bus factor creeping up, churn concentrating, reverts increasing) before it becomes a crisis.

## Caveats

1. **Squash-merge compression** — authorship data reflects merger, not author, in squash workflows
2. **Commit message discipline** — bug hotspot and firefighting commands depend on descriptive commit messages; "update stuff" yields nothing
3. **Churn is not badness** — active development on a well-owned file is healthy churn; only churn without ownership is drag
4. **These commands take minutes** — they are a starting point, not a complete audit; the rest of the week is reading the code they point you toward

## Source

Ally Piechowski, _The Git Commands I Run Before Reading Any Code_, Apr 8, 2026 (4 min read). Cites Microsoft Research (2005) churn-predicts-defects study by Nagappan & Ball.

---

## Ontology Tags

- **Geography:** Global (git best practices, universally applicable)
- **Sector:** Software Engineering > DevOps > Codebase Auditing
- **Entities:** Ally Piechowski, Microsoft Research (Nagappan & Ball 2005), DWS IQ 6
- **Temporal Context:** 2026-04-08 (article publication), 2026-04-20 (operationalised)
- **Confidence:** High
