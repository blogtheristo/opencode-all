<!-- Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Agent=ox-alpha Date=2026-08-24 -->

# Field Note — opencode-all Living Engine + Risk-Tiered HIC PR Review

**Date:** 2026-08-24
**Session:** OpenCode, model `opencode/x-preview-f-free` (ox-alpha), dws6 primary checkout
**Status:** Implemented and tested; PR open for review

***

## What was built

1. **Claude Code → OpenCode session migration** — `scripts/claude-sessions-to-opencode.mjs`
   Converts Claude Code JSONL session transcripts (`~/.claude/projects/`) into OpenCode import format and imports them (`opencode import`). 10 sessions imported on first run. Import is idempotent (deterministic session IDs from source UUIDs).

2. **opencode-open-all** — `scripts/opencode-open-all.sh`
   Opens every session that needs continuation (last transcript message authored by the assistant) in a named tmux window, plus post-merge handoff prompts from `.claude/handoffs/`. Dry-run supported.

3. **Batch cleanup worker (the living engine)** — `scripts/opencode-batch-worker.mjs`
   ACP-based (Agent Client Protocol over stdio to `opencode acp`; verified `loadSession`/`resume` capability). Commands:
   - `enqueue` — detects halted sessions, builds `.workflows/opencode-all/queue.jsonl`
   - `run [--batch N] [--loop] [--lifetime-days 30]` — resumes each queued session via `session/load` + `session/prompt`, instructing it to finish GREEN-zone work and write a standard handoff; worker guarantees a handoff file exists even when the agent omits one (fallback Status: NEEDS-HUMAN)
   - `status` / `lifecycle` — living-engine states: `rest | in-use | updating | fixing`, transitions logged with `[OPENCODE-ALL]:<STATE>:<session>:<timestamp>` signals to `lifecycle.jsonl`
   - Engine lifetime fixed at 30 days (HIC instruction); deadline persisted in `engine.json` so restarts keep the same horizon.

4. **Evidence tooling**
   - `scripts/evidence-audit.mjs` — fails CI-style when code files lack the Evidence header (accepts `//` and `#` comment prefixes)
   - `scripts/evidence-stamp.mjs` — update engine: stamps code/markdown/HTML artifacts with provenance; refuses thesis files (RED zone) unless `--force-thesis`

5. **Standard: Code Evidence Layer** — added to `CLAUDE.md` (see below).

## Decisions taken this session

| # | Decision | Where recorded |
|---|----------|----------------|
| D1 | Code Evidence Layer mandatory on agent code (EU AI Act Art. 12–14; ISO/IEC 25012 quality fields) | `CLAUDE.md` → Code Evidence Layer |
| D2 | Risk-tiered HIC PR review (3 tiers; see LD-2026-016) | **LD-2026-016**, approved by HIC 2026-08-24 |
| D3 | ox-alpha free preview used as engine model; window ends ~2026-08-27 → switch or fall back before then | This note |
| D4 | opencode-all engine lifetime = 30 days from 2026-08-24 | `engine.json` |

## Impact on investor outreach / sales material

**None material.** No pricing, seat-tier, industry-count, jurisdiction, or product-claim text was changed. Governance impact only: under D2 tier 1, any future PR modifying public pages, blog entries, or investor/sales collateral requires explicit HIC sign-off at the merge gate (generalizes Non-Negotiable Rule 13 beyond blogs). Existing collateral needs no rewrite.

## Model expiry watch (D3)

Ox Alpha Free (`x-preview-f-free`) launched 2026-08-20 as a ~one-week free stealth preview; multiple secondary sources converge on **~2026-08-27** as the likely end. Unverified directly against Anthropic/OpenCode pricing pages (Rule 12 fail-loud). The batch worker's per-session runs will surface auth/model errors after expiry; requeue with a fallback model (e.g. DGX-local qwen3-coder) if that happens.

**Merge record (HIC, 2026-08-24, on PR #1878):** GREEN for current internal ops scope; OPEN — fallback-model validation must run before 2026-08-27, else engine is marked NEEDS-HUMAN; no approval to modify public materials under this work without the separate tier-1 HIC gate.

## Learning Outcome steps

1. KB update: N/A — pending KB API authentication (same blocker as 2026-08-05 note).
2. Field note: this file.
3. Learn/ HTML: N/A — internal ops note, no publication intent.
4. Drive export: N/A — internal ops note.
5. HIC question: resolved — HIC set the fallback deadline condition (above).
6. Calendar: N/A — Google Calendar tooling not available in this OpenCode session; deadline enforced via engine kill criteria (`engine.json`) instead.

## Test evidence

- Converter: syntax-checked, 10/11+1 sessions imported (2 empty transcripts skipped)
- Worker: `enqueue` (28 detected), `status`, `lifecycle` (28 transitions logged), `run --dry-run`, live ACP run end-to-end on `ses_004c81d90ffe0457NK6HHNCaYu` (done + guaranteed handoff)
- Audit/stamp: round-trip stamp→audit passes; bash `#` prefix accepted; thesis refusal works
- Known limitation: ACP `session/prompt` result returns no parseable `stopReason` in 1.18.21 — completion is labeled PROVISIONAL when undefined (per boardy review); handoff existence is not proof of correct completion.
