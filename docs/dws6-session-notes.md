<!--
VERSION AND AGENT HISTORY
Document: DGX sovereign-workspace bootstrap — session notes
Version: 1.0
Date: 2026-07-31
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/redact-aegis-customer-names (continuation of the
       2026-07-26 boss-session PR-backlog cleanup)
Purpose: Document the DGX sovereign-workspace bootstrap tooling (scripts/bootstrap_dgx_sovereign.sh,
         tools/policy_router.py, tools/dws*) and the git-hygiene incident that produced
         PRs #1774/#1775 so the actual intent isn't lost among the noise.
-->

# DGX sovereign-workspace bootstrap — session notes

## What this is

A local-machine bootstrap (`scripts/bootstrap_dgx_sovereign.sh`) for the DGX Spark box
(`gn100-cb5d`), plus a small CLI (`tools/dws`, `tools/dws-local`, `tools/dws-cloud`) and a
policy router (`tools/policy_router.py`) that route a prompt to either local Ollama
(`qwen2.5-coder:14b` by default) or GitHub Copilot CLI, based on two signals:

1. **Working directory** — anything under `~/workspace/sovereign/` always routes local.
2. **Prompt content** — a regex sweep for secret/credential markers, export-control terms
   (ITAR/EAR/CUI), and regulated-data terms (PII/PHI/GDPR/HIPAA/PCI) forces local routing
   regardless of directory.

The bootstrap also installs `gitleaks`, sets a global `~/.gitignore_global` excluding
`.env`/`*.pem`/`*.key`/`secrets.*`, and writes two VS Code workspace files (`open` = Copilot
enabled, `sovereign` = Copilot fully disabled) so the editor-level and prompt-level gates
line up.

## Why this exists

Non-sensitive engineering work can use GitHub Copilot CLI directly; work touching sovereign,
export-controlled, or regulated content should never leave the local box. This gives that
split a mechanical default instead of relying on remembering to switch tools per task.

## Usage

```bash
~/workspace/tools/policy_router.py --repo-path ~/workspace/sovereign --prompt "your task"
# or, once scripts/bootstrap_dgx_sovereign.sh has run and PATH includes ~/bin:
dws "your task"          # auto-routes
dws-local "your task"    # force local
dws-cloud "your task"    # force Copilot (non-sensitive only)
```

## The PR #1774/#1775 incident

The first attempt to commit this tooling (PR #1774, "bootstrap sovereign workspace + dws
local/cloud skill commands") did not actually contain any of the five files above — it
picked up ~100 unrelated, pre-existing uncommitted modifications that were already sitting
dirty in the shared `dws6` checkout (leftovers from an earlier, unrelated session), none of
which are the sovereign-workspace tooling. A follow-up attempt (PR #1775, same title) was
created from a stale base and never got the actual cherry-pick step run, so it shipped
empty. A third branch (`copilot/fix-pr-1775-conflicts`) turned out to be branched from a
merge-base roughly three months stale — merging it would have reverted a large amount of
unrelated repository history, so it was abandoned rather than used.

This PR is the clean redo: five files, sourced directly from where they actually live on
the DGX box (`~/bootstrap_dgx_sovereign.sh`, `~/workspace/tools/policy_router.py`,
`~/bin/dws`, `~/bin/dws-local`, `~/bin/dws-cloud`), nothing else. PRs #1774 and #1775 are
closed as superseded by this one.
