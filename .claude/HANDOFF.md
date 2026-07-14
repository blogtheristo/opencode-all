# Session Handoff Log

Cross-session memory for Claude Code cloud sessions. Containers are ephemeral —
these files are the only working memory that survives them, because they are
committed to git.

## Layout (v2 — per-branch files)

- **`.claude/handoffs/<branch>.md`** — one file per branch, mirroring the
  branch name as the path (e.g. branch `claude/foo-bar-x1` →
  `.claude/handoffs/claude/foo-bar-x1.md`). This is the mutable "current
  state" doc — task, state, next steps, blockers — owned exclusively by
  sessions on that branch. `session-start.sh` auto-detects the current
  branch and injects that file's content into context at session start.
  Safe to overwrite freely: no other branch ever touches it, so no
  cross-branch merge conflicts.
- **This file (`HANDOFF.md`)** — append-only cross-branch history log
  (below) plus this protocol note. Not branch-specific, so edits here should
  only ever _append_ a line, never rewrite existing content — that keeps
  concurrent-branch collisions on this file rare (worst case: two sessions
  finishing at the exact same moment both append, which is a normal,
  easily-resolved git conflict, unlike the old design where every single
  checkpoint on every branch rewrote the same 20 lines).

### v1 → v2 migration note (07.07.2026)

Before this, there was a single mutable `## CURRENT HANDOFF` section in this
file, shared across every branch. It had two real failure modes, not
theoretical ones: (1) a session starting on branch A would read whatever
branch B's last session had written, since the section wasn't branch-scoped
— this happened in practice (see HANDOFF HISTORY below, 2026-07-07 KYA
entry); (2) two branches editing the same section produced an actual git
merge conflict on this file (also in this repo's history, commit `d93e8fc`).
Per-branch files fix both: injection is keyed to the actual current branch,
and files never collide across branches.

## Update protocol (every agent, every session)

1. **Read** your branch's handoff file before starting work — the
   session-start hook already shows it to you if one exists for the current
   branch. If none exists, you're starting fresh on this branch; check
   `HANDOFF HISTORY` below for related work on other branches if relevant.
2. **Create or overwrite** `.claude/handoffs/<your-branch>.md` at every
   significant checkpoint (Rule 10) and always before ending a session —
   commit it together with the work it describes, on the same branch. Use
   the field shape: Task / State / Next steps / Blockers.
3. **Append** a one-line entry to `HANDOFF HISTORY` below when a task
   completes or is handed off. Keep history to the newest 20 lines; delete
   older ones when appending would exceed that.
4. Keep each per-branch file under ~40 lines. This is a baton, not a
   journal — detail lives in commits, PRs, and `.claude/clawdbot/` queue
   files.
5. Never put secrets, tokens, or customer PII here (Non-Negotiable Rule 1).
6. When a branch merges or is abandoned, its handoff file can be deleted in
   the same PR/commit that merges it — it's done its job once the work
   lands. Leaving it is harmless too (it just won't be read again unless
   someone recreates that exact branch name).

---

## HANDOFF HISTORY

- 2026-07-14 | claude/eu-nato-funding-recovery-lsogw2 | Recovered the EU Commission + NATO DIANA research pack lost 2026-07-13 (`docs/lut/eu-nato-instruments-research-2026-07.md`); verified a founder-supplied Gemini draft against official sources and corrected several figures — EDF's deadline (was "mid-2027", is actually 29 Sep 2026, live now), EIC equity ceiling (€30M claimed → €10M actual), Digital Europe budget/rate, two non-existent cascade calls (replaced with NGI Sargasso + AI4Gov-X), NATO DIANA cycle framing. `docs/lut/fundraising-roadmap-2026-2027.md` §0/§3 updated, v1.0→1.1.
- 2026-07-12 | claude/claude-vs-dgx-agents-vi5aum | Added `AGENTS.md` §8 "Managed Agent Backends — Claude Managed Agents vs. DGX Managed Agents": comparison table + phased implementation plan (pilot on one Ledger-Native-exempt sales agent, KYA/Article-12 guardrails before wider rollout). Flags researched session-hour pricing as unverified pending direct Anthropic docs check. AGENTS.md → v1.1.
- 2026-07-09 | claude/dws-sovereign-intelligence-wwho6h | Coinability/GTM audit of "Sovereign Intelligence" corrected the same-day promotion below: dropped the "(SI)" abbreviation (collided with pre-existing "NVIDIA SI = System Integrator" usage in the same standard), dropped "DWS coined this" framing (Sovereign Intelligence, LLC has held the exact name since ~2013; StirlingX/Octostar use near-identical phrasing in 2026). `DWS_MARKET_RESEARCH_STANDARD.md` §8.3 → v1.5, `DWS_TRUTH_STANDARD.md` row 27 → v3.0. Full audit: `docs/field-notes/2026-07-09-sovereign-intelligence-coinability-gtm-audit.md`.
- 2026-07-09 | claude/dws-sovereign-intelligence-wwho6h | Promoted "Sovereign Intelligence (SI)" from draft field note to canonical positioning thesis: `DWS_MARKET_RESEARCH_STANDARD.md` §8.3 (v1.4) + `DWS_TRUTH_STANDARD.md` row 27 (v2.9). Not a new product tier — narrative name for existing `DWS_SOVEREIGNTY_STANDARD.md` architecture. Public-site publication still gated behind `/truth-check` + brand sign-off.
- 2026-07-09 | claude/typescript-7-repo-impact-u4ec7m | TypeScript 7 (GA 2026-07-08) repo-impact field note: full package/tsconfig/CI survey, sovereignty-neutral verdict (TS is a Microsoft/US devDependency, §17.5 scoped to hosted infra not build tooling); flagged CI type-check gap (5 packages have no CI tsc gate).
- 2026-07-07 | claude/kya-mandate-evidence-migration-mq7hnp | Migrated the handoff mechanism from a single shared CURRENT HANDOFF section to per-branch files under `.claude/handoffs/<branch>.md`, fixing the stale-read + merge-conflict failure modes hit in this session (see v1→v2 migration note above).
- 2026-07-07 | claude/kya-mandate-evidence-migration-mq7hnp | KYA §14.5 evidence-chain migration (074) authored, not applied, NOT live-verified (Docker registries + DGX ssh + local initdb all blocked in this sandbox); §14 synced into KYA_SECURITY §12, KYA_OPTIMIZATION §13, DWS_SECURITY_STANDARD §18.4 G7. Handoff prompt written for next session/tool.
- 2026-07-06 | claude/agent-infrastructure-ideas-1jtgms | Isenberg 21-answers field note + 13 LSJ signals; KYA v1.8→v1.9.1 (§14 mandate gating) + ATS spend gate implemented w/ 21 tests.
- 2026-07-07 | claude/aspire-development-evolution-16fxg0 | Hakimi critique → KYAVerdict span attrs shipped; thesis v3.79; Orkia partner outreach record drafted (reply staged, not sent).
- 2026-07-07 | claude/aspire-development-evolution-16fxg0 | Aspire PR#1500→main evolution field note + DWS lessons; adoption options re-scored.
- 2026-07-06 | claude/aiven-partnership-intro-vm1fgk | Aiven track full state: record v1.12, NDA envelope f7382f1c SENT via DocuSign, §8b reply sent; WAITING on Aiven (partner-org intro, UpCloud, DPA, Wärtsilä link); DocuSign needs local .env keys.
- 2026-07-06 | claude/aiven-partnership-intro-vm1fgk | Aiven partner record v1.1: Leevi Lindfors contact + reply draft (human sends).
- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).
- 2026-07-08 | claude/sessions-without-prs-dc9d06 | Backfilled + merged all 67 PR-less session branches (#1568–#1634, #1635 merged separately by Risto); fixed a pre-existing conflict-marker corruption baked into `main`'s docs/BLOG_STANDARD.md; caught+fixed one missed merge (#1583) on final audit. Next: npm build/tsc verify (no node_modules in this sandbox), confirm KYA-verdict tracing (d235f6ee) wires into tools.ts's executeTool(), skill-manifest drift check, orphaned gbrain skills decision. See `.claude/handoffs/claude/sessions-without-prs-dc9d06.md`.
