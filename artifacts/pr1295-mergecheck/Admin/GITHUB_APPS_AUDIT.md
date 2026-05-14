# DWS6 GitHub Apps — Audit & Recommendations

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/ci-hygiene-audit-vBYGo | Date: 22.04.2026 | Changes: Initial audit of 9 installed GitHub Apps; keep / review / remove recommendations

Document Status:

- Created: 22.04.2026
- Last Modified: 22.04.2026
- Language: English
- Publication Status: ✅ ACTIVE
- Audience: Risto (admin) — single-decision audit, not ongoing operational doc

---

## Why this audit

Surface area question: every installed GitHub App can read PRs, post status
checks, comment on issues, and (depending on permissions) push branches. We
shipped **local-first CI** in PR #1155 and need to remove duplicate /
unused integrations so the surface stays minimal. Also: the mystery
`submit-pypi` check fails on every PR and is suspected to come from one of
these apps.

## Current state — 9 apps installed

| App                          | Developer   | Purpose                                                         | Status posts checks?                                          | Cost                      |
| ---------------------------- | ----------- | --------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------- |
| Aikido Autofix               | AikidoSec   | Auto-PRs to fix detected vulns                                  | Yes                                                           | Paid SaaS                 |
| Aikido Security              | AikidoSec   | Vuln scanning (SAST/SCA/IaC)                                    | Yes (`pr-security-check` is theirs)                           | Paid SaaS                 |
| Claude                       | Anthropic   | Powers Claude Code's GitHub interactions (this session uses it) | Yes (review comments)                                         | Included with Claude Code |
| Cloudflare Workers and Pages | Cloudflare  | Auto-deploys to Pages on push                                   | Yes (`Cloudflare Pages: dws6`, `dws10-com`, `dws6-dashboard`) | Free tier                 |
| Continue                     | continuedev | IDE extension bridge for local LLMs                             | No                                                            | Free, OSS                 |
| Cursor                       | Cursor      | Cursor IDE features incl. Bugbot                                | Yes (`Cursor Bugbot`)                                         | Cursor Pro plan           |
| Google Integrations          | Google      | Workspace ↔ GitHub linking                                      | No (passive)                                                  | Free                      |
| Linear                       | Linear      | Issue ↔ commit linking                                          | No (passive)                                                  | Free with Linear plan     |
| Microsoft Teams for GitHub   | GitHub      | Notifies Teams channel of events                                | No (passive)                                                  | Free                      |

## Audit verdict

| App                          | Verdict       | Reason                                                                                                                                                                                                                                                             |
| ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude                       | ✅ **KEEP**   | Critical — Claude Code on web depends on it; PRs in this session prove it works                                                                                                                                                                                    |
| Cloudflare Workers and Pages | ✅ **KEEP**   | Drives Pages deploys for dws6, dws10-com, dws6-dashboard, onelifetime-world                                                                                                                                                                                        |
| Cursor                       | ✅ **KEEP**   | Cursor is the primary IDE per CLAUDE.md; Bugbot found 0 issues but the integration is in use                                                                                                                                                                       |
| Aikido Security              | 🟡 **REVIEW** | Overlaps with our local-first CI (gitleaks + npm-audit) and DGX weekly security-audit. Still complementary if it does SAST our scanners don't. **Question for Risto:** are we paying for Aikido? If yes, what's the ARR?                                           |
| Aikido Autofix               | 🟡 **REVIEW** | Auto-PR is convenient but Dependabot can do the same for free. Pair with Aikido Security verdict — if we keep one, keep both                                                                                                                                       |
| Google Integrations          | 🟡 **REVIEW** | Passive; only useful if you actually link Drive/Docs in PRs. Has any PR ever used it? If no in 90 days → remove                                                                                                                                                    |
| Continue                     | 🔴 **REMOVE** | User reports it doesn't work over SSH to Ollama on DGX Spark. The GitHub App itself does nothing useful (Continue is an IDE extension; the GH App is a bridge that's broken in our setup). Removing has zero cost. See "Replacing Continue with Claude Code" below |
| Linear                       | 🔴 **REMOVE** | We use GitHub Issues, not Linear. CLAUDE.md mentions no Linear workflow. Zero usage signal                                                                                                                                                                         |
| Microsoft Teams for GitHub   | 🔴 **REMOVE** | Lifetime Oy doesn't run a Teams channel; notifications go nowhere                                                                                                                                                                                                  |

### Likely source of `submit-pypi` failing check

Top suspects in order:

1. **Aikido Security** — runs PyPI dependency scans even when there are no
   Python packages to publish. Try removing Aikido temporarily and
   pushing one PR to see if `submit-pypi` disappears.
2. **Google Integrations** — has dependency-graph permissions; might
   trigger a PyPI-flavoured submission.
3. **Continue** — unlikely (no status-check permissions in its scope).

If `submit-pypi` survives removing Aikido + Google, escalate to GitHub
support: a phantom check usually means an old GitHub Action workflow
template is referenced from the org-level required-checks list.

## Recommended remove sequence (lowest risk first)

1. **Microsoft Teams** — passive, removing it can't break anything
2. **Linear** — passive, same
3. **Continue** — broken in our setup, no value to retain
4. **Google Integrations** — only if 90-day usage check shows no use
5. **Aikido (both)** — only if we confirm we're paying for it AND our
   local-CI + DGX-weekly covers the same scope

After each removal, push one no-op PR and check whether `submit-pypi`
still appears in the check runs. The one whose removal makes it disappear
was the source.

## What our local-first CI replaces

For context — the apps we considered "essential security" before may now
be redundant:

| App previously did           | Now done by                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Aikido SAST scan             | `scripts/local-ci.sh` (gitleaks-full) + DGX weekly `bandit`/`safety`         |
| Aikido SCA / dependency scan | `scripts/local-ci.sh` (npm-audit-root) + `scripts/daily/dependabot-audit.sh` |
| Aikido Autofix PRs           | Native Dependabot (free; turn on in Settings → Code security)                |
| Continue (local LLM in IDE)  | Claude Code with Bash/SSH access to DGX Spark Ollama (see below)             |
| Linear PR linking            | GitHub Issues + native PR linking (`Closes #N`)                              |
| Teams notifications          | None (we don't use Teams)                                                    |

---

## Replacing Continue with Claude Code

**Question:** "Continue does not work with SSH to Ollama on DGX Spark. Can
we use Claude Code instead?"

**Short answer:** Yes — and Claude Code already does more than Continue
ever did. Two complementary patterns:

### Pattern A — Claude Code is the agent (default)

You're already doing this. Claude Code (web or desktop) drives the
session, calling Anthropic's hosted models for reasoning. The Bash tool
lets it `ssh dgx-spark <command>` to run anything on the Spark — including
querying local Ollama models. No GitHub App, no IDE extension required.

```bash
# Inside a Claude Code session, ask it to run:
ssh dgx-spark "curl -s http://localhost:11434/api/generate \
  -d '{\"model\":\"llama3.1:70b\",\"prompt\":\"...\",\"stream\":false}' | jq -r .response"
```

That gives you full Ollama access from Claude Code without Continue.

### Pattern B — Claude Code calls local Ollama for sensitive prompts

For workloads where you don't want any data leaving DGX Spark (PII, GDPR,
EU AI Act high-risk), wire a small wrapper:

```bash
# scripts/ollama-spark.sh — proxies to DGX Spark Ollama
#!/usr/bin/env bash
ssh dgx-spark "ollama run \"$1\" \"$2\""
```

Then in a Claude Code session, ask: "Use `scripts/ollama-spark.sh
llama3.1:70b 'classify this CSRD disclosure: ...'`". Claude Code
orchestrates, Ollama on Spark does the inference, no cloud egress.

### Why this beats Continue

| Capability                | Continue            | Claude Code                   |
| ------------------------- | ------------------- | ----------------------------- |
| Local LLM inference       | ✅ (when SSH works) | ✅ via Bash (always works)    |
| Read repo files           | ✅                  | ✅                            |
| Edit repo files           | ✅                  | ✅                            |
| Run shell commands        | ❌                  | ✅                            |
| Open PRs / comment        | ❌                  | ✅ via mcp**github**          |
| Run tests, lint, build    | ❌                  | ✅                            |
| Audit log of every action | ❌                  | ✅ via `.claude/hooks/audit/` |
| Works over SSH to DGX     | ❌ (per Risto)      | ✅                            |

**Verdict:** uninstall Continue. Use Claude Code in the IDE-driven flow
(Cursor opens it via `Ctrl+Esc`) or in standalone mode (web /
`claude.ai/code`). Both routes give you everything Continue offered plus
the full toolchain.

### One missing piece: in-line autocomplete

Continue did real-time tab-complete suggestions in the editor. Claude
Code does request/response in a chat panel. If you want autocomplete:

- **Cursor's built-in Tab AI** already does this (using Cursor's models)
- **GitHub Copilot** (separate paid product) is the other choice
- Claude Code is not a replacement for autocomplete — it's a replacement
  for "Continue's chat panel + tools"

So the right pairing is: \*\*Cursor (Tab autocomplete) + Claude Code (chat

- tools) + Ollama on DGX Spark (local-only inference path)\*\*. Continue
  adds nothing on top of that.

---

## Action items

- [ ] **Risto:** confirm Aikido subscription status (paying or free trial?)
- [ ] **Risto:** remove Microsoft Teams app — Settings → Integrations → Microsoft Teams for GitHub → Configure → Suspend / Uninstall
- [ ] **Risto:** remove Linear app (same path)
- [ ] **Risto:** remove Continue app (same path) — broken in our setup
- [ ] **After each removal:** push one no-op PR, check whether `submit-pypi` disappeared (binary-search for the source)
- [ ] **If kept:** document Aikido, Google Integrations in `Admin/SECURITY_COMPLIANCE.md` Section 13 (vendor risk)
- [ ] Decide on Pattern A vs Pattern B (or both) for replacing Continue's local-LLM workflow

## Related documents

- `Admin/ADMIN_MANUAL.md` — main admin runbook
- `Admin/ADMIN_MANUAL_AUDIT.md` — external-auditor manual
- `Admin/SECURITY_COMPLIANCE.md` — Section 13 vendor risk
- `docs/CI_AUDIT.md` — local-first CI spec (replaces Aikido scope)
- `docs/field-notes/2026-04-22-ci-hygiene-audit.md` — `submit-pypi` diagnosis
