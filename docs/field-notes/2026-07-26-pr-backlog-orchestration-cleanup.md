<!--
VERSION AND AGENT HISTORY
Document: PR Backlog Orchestration Cleanup — 131 open PRs, boss-role fleet
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 4.8), session claude/ollama-orchestration-merge-047pj7
Purpose: HIC Learning Outcome (DWS Learning Standard) for the session that
         triaged and began clearing the dws6 open-PR backlog using a subagent
         fleet under an orchestrator ("boss") role, after the requested Ollama
         orchestration proved unreachable from the cloud environment.
-->

# Field Note — PR Backlog Orchestration Cleanup (dws6, 131 open PRs)

**Scope:** Institutional record of a large PR-backlog cleanup run as a boss/orchestrator over a subagent fleet. Captures what was decided, what shipped, the reusable process, and the conflicts surfaced for HIC decision.

## 1. Trigger & framing

Request: act as the "boss/orchestrator of Ollama models", put the most suitable model on each PR, verify step by step, and clean up + merge ~131 open PRs.

**Reality check (fail loud):** the Ollama models live on the on-prem DGX Spark and are **unreachable from this ephemeral cloud session** — `ssh` is not installed, no route to `dgx-spark`, `OLLAMA_BASE_URL` unset. So literal Ollama routing could not run here. The orchestration was executed with the model that *is* available (Claude Opus 4.8) as boss + `general-purpose` subagents as the fleet. This is the designed fallback of `src/agents/model-selector.ts` (`isProviderAvailable('ollama-local')` gates on the env var) — a feature, not a bug.

## 2. What shipped

- **Merged to main (10 doc-only, each verified doc-only + clean + content-safe):** #1672, #1689, #1530, #1462, #1434, #1433, #1431, #1430, #1320, #1660.
- **Aspire 13.4.6 bump → PR #1757** (supersedes #1557 which went `dirty`; also supersedes #1124). Latest stable of `microsoft/aspire` is **13.4.6** (13.5.0 is preview — pinned stable). Breaking-change audit: zero migration surface for the dashboard-only DGX footprint.
- **Closed 11 (superseded/expired/empty), each with a reason comment:** #1432 (also flagged: closed by a subagent without authorization — see §4), #1557, #1124, #1403, #1699, #1686, #1539, #1236, #1422, #1395, #1379.
- **63 "next-prompt v2" redo prompts** written for stale/tangled branches too old to rebase (REBASE bucket 26 + CODE bucket 37) → `scratchpad/next-prompts/` + delivered bundle.

## 3. Triage outcome (131 PRs)

| Bucket | Count | Disposition |
| --- | --- | --- |
| Merged (doc-only) | 10 | done |
| Aspire bump | 1 | PR #1757 |
| Closed (superseded/dead) | 11 | done |
| V2_PROMPT (redo fresh) | 63 | prompts written; branches still open pending close-and-redo |
| KEEP_REVIEW (real code) | 30 | review begun (partial — session limit) |
| BLOCKED (draft/empty/wrong-base) | remainder | recommendations recorded |
| HELD (sender policy) | #1698, #1664 | pending HIC sender decision |

## 4. What did not survive verification / process learnings

- **"doc-only + clean" is NOT automatically safe.** #1698 (KEENON) is doc-only and clean but its letter used `risto.paarni2024@` as `From:` — a sender-identity violation. Held, not merged. Gate added: content-safety pass before any doc merge.
- **Two-pass mergeability.** GitHub returns `mergeable_state=="unknown"` on first `get` (lazy compute); a second `get` returns the real `clean`/`dirty`. All triage now re-polls.
- **Subagents must be READ-ONLY for triage.** One batch agent **closed #1432 and posted a comment without authorization** because the prompt did not forbid mutations. Fix applied: every triage/review fleet prompt now says "STRICTLY READ-ONLY: no close/merge/comment/push". #1432's closure was later ratified by the HIC ("close list holds").
- **No required CI checks in the repo** (legacy status = none); failing check-runs seen (`submit-pypi`, `Claude PR Review`, `Verify audit chain`) are non-blocking/phantom. Merge safety therefore rests on doc-only + no-conflict + content-safety, not CI.

## 5. Concrete defects the fleet surfaced (highest-value output)

- **Security:** #1453 critical Dependabot RCE (vitest UI, shell-quote) — redo prompt written; #1283 real Shai-Hulud hardening (SES `eval`→argv, GPG, IOC script); **#1213 contains disabled security scans**; #1716 KYA EdDSA/JWS crypto; #1125 payment webhook-signature surface.
- **Supabase grant rule:** migrations **070 (#1528)**, **063 (#1208)** ship tables with RLS/policies but **no table `GRANT`** to `service_role`/`authenticated` → `42501` risk under the rule enforced 2026-10-30. #1674's migration number **075 collides** with `075_public_schema_grants.sql` on main.
- **Sender bugs:** #1643, #1644, #1657 use `paarni2024@` in outbound signatures → redo prompts fix to `risto.paarni@`.
- **Over-broad permissions:** #1644, #1655, #1686 add wide `.claude/settings.local.json` grants (e.g. `Bash(cat > *)`).

## 6. Sender-identity conflict (surfaced, not resolved — HIC decision)

GWS check via the authenticated Gmail mailbox (login = `risto.paarni2024@lifetime.fi`): in 2026, **actual outbound to partners/investors (KTH Törngren, LUT Smolander, investor Würl) is sent FROM `risto.paarni2024@lifetime.fi`.** `risto.paarni@lifetime.fi` has **no send in the last year** (last as `From:` in 2019–2020); it receives everything via the Proton catch-all. The GWS "Send mail as" setting could not be read via API.

This is the **inverse** of the current CLAUDE.md rule (which bans `2024@` from outbound and mandates `risto.paarni@` for outreach). The rule is aspirational; reality is `2024@`. **Do not "fix" held PRs to `risto.paarni@` until that address is a verified GWS "Send mail as" alias** — otherwise the letters become unsendable. Decision required (see §8).

## 7. The reusable process (boss/orchestrator pattern)

1. Enumerate PRs; split into batches.
2. Fan out READ-ONLY subagents; each: `get` (two-pass mergeable) → `get_files`/`get_diff` → verdict.
3. Buckets: MERGE (doc-only+clean+content-safe) / REBASE-trivial / **V2_PROMPT** (too old → fresh redo prompt) / CODE→KEEP_REVIEW / CLOSE / BLOCKED.
4. Boss executes only the authorized mutations (merge/close), verifying each just-in-time.
5. Persist prompts to files; deliver as one bundle.

## 8. HIC question (EU AI Act Art. 14)

> **Which is the canonical outbound sender identity — (a) keep the CLAUDE.md rule and set up `risto.paarni@lifetime.fi` as a verified GWS "Send mail as" alias (then fix #1698/#1664 to it), or (b) update CLAUDE.md to recognise `risto.paarni2024@lifetime.fi` as a legitimate outbound address (matching current reality)?** This unblocks #1698, #1664 and every future outreach draft.

## 9. Learning Standard — five-step status

1. **kb update** — `N/A this session — session token limit hit (resets 8am UTC); folded into the next-session prompt.`
2. **Field note** — ✅ this file.
3. **`Learn/` HTML** — `N/A — session limit; `scripts/render-doc.sh` deferred to next session.`
4. **Drive export** — `N/A — Drive MCP intermittently disconnected this session; repo remains source-of-truth.`
5. **HIC question** — ✅ §8.

---

_Follows DWS Document Standard and the DWS Learning Standard (HIC Learning Outcome)._
