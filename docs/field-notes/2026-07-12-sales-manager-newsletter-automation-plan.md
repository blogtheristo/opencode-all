# Field Note: Sales Manager Newsletter — Automation Plan

**Date:** 2026-07-12
**Author:** Claude Code (Sonnet 5), session claude/cv-senior-ai-engineer-msjheo
**Context:** `docs/market-research/sales-manager.md` v1.0 was created manually this session
(HIC-supplied content). HIC then relayed implementation advice from Grok (xAI) on how to
automate future editions and asked for concrete instructions, committed to the repo.

## Correcting Grok's advice for this repo specifically

Grok's suggestions are generic to its own sandbox and don't know this codebase. Two are
flat wrong here, the rest map onto components that already exist under different names:

- **"GitHub integration... not directly executable, manual copy-paste required."** Not true
  for Claude Code in this environment — this session has direct `git`/GitHub write access
  (every fix this session was committed and pushed directly, no copy-paste step).
- **"Pandoc executable in the sandbox if installed."** Already resolved this session:
  `infrastructure/dgx-spark/first-boot.sh` (step 3a) installs pandoc permanently on DGX
  Spark; `scripts/render-doc.sh` is the standing wrapper (see `DWS_DOCUMENT_STANDARD.md` §22).

| Grok suggested                            | Already exists in this repo as                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `web_search`/`open_page` tools            | No such tool exists on `BaseAgent` (`src/agents/tools.ts` `BUILTIN_TOOLS` has `fetch_external` — fetch one known URL, not search). The real pattern here is direct `curl` against public RSS/APIs, e.g. `scripts/daily/news-to-signal.sh` (Google News RSS) and `scripts/collect_market_research.py` (competitor sites) — both respect `DWS_MARKET_RESEARCH_STANDARD.md` §11 (robots.txt, 1 req/sec rate limit). Any new scanner must follow this pattern, not assume agent-callable search. |
| File tools, bash execution                | Native (Read/Write/Edit/Bash) — no gap.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| docx/pdf skill                            | `scripts/render-doc.sh` (this session).                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| "Custom skill creation"                   | Matches CLAUDE.md's Skill Codification Rule exactly — see Stage 4 below.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| "AI orchestration, multi-agent"           | `BaseAgent` architecture already has 68 registered agents (`src/agents/`, `AGENT_ROSTER.json`). New work needed = one new synthesis agent, not a new framework.                                                                                                                                                                                                                                                                                                                              |
| "Script periodic runs"                    | Already solved: `day-runner.sh` auto-discovers every `scripts/{daily,weekly,hourly}/*.{sh,ts}` unconditionally (see `Cron-works.md`) — no new scheduler needed, just a script in the right folder.                                                                                                                                                                                                                                                                                           |
| "Data sovereignty, local/edge processing" | Already the default: DGX Spark Ollama is a supported `BaseAgent` LLM backend.                                                                                                                                                                                                                                                                                                                                                                                                                |

## The one real gap

`market_signals` (Supabase table, `DWS_MARKET_RESEARCH_STANDARD.md` §4.3) already has a
`signal_type = 'regulation'` value in its check constraint — the schema was designed for
this. But nothing populates it with live EU regulatory-pipeline data. This is the same gap
the repo's own `regulatory-radar` skill (`.claude/commands/regulatory-radar.md`) already
admits to: "does NOT yet do live EUR-Lex / DG ENER / EFRAG / CINEA pipeline scanning for
new, not-yet-known instruments — that ingestion layer is still unbuilt."

`sales-manager.md`'s content (CSRD/ESRS, CBAM, Sovereign Cloud/CADA, Fit for 55) is exactly
what this missing ingestion layer would feed. Building it is real, scoped work — not
something to rush in the same turn as writing this plan, because `DWS_MARKET_RESEARCH_STANDARD.md`'s
scraping discipline (robots.txt, rate limits, source allowlist) deserves care, not a quick
unreviewed scraper.

## Staged build plan

**Stage 1 — data (not yet built).** `scripts/collect_regulatory_signals.py`, sibling to
`scripts/collect_market_research.py`, following the same robots.txt/rate-limit discipline.
Sources: EUR-Lex RSS (OJ + legislative procedure feeds), EC press corner RSS, Euractiv RSS.
Writes to `market_signals` with `signal_type='regulation'`, `impact_score` 1-5,
`action_required` flag.

**Stage 2 — synthesis agent (not yet built).** `src/agents/sales-manager-newsletter.agent.ts`,
a `BaseAgent` (matches `outreach-lead-finder.agent.ts`'s shape). Input: recent
`market_signals` (regulation type, last 7 days) + `logs/news-signals/*.jsonl` (industrial
incidents, already live via `news-to-signal.sh`). Output: the Story → Key Takeaway → Sales
Opportunity structure, mapping to a sales-target universe (reuse/extend the
`EU_TARGET_UNIVERSE` pattern already in `outreach-lead-finder.agent.ts` rather than
inventing a second one).

**Stage 3 — scheduling + output (not yet built).** `scripts/weekly/sales-manager-newsletter.sh`,
auto-discovered by `day-runner.sh` like every other weekly script. Runs Stage 1 collector →
invokes Stage 2 agent via `cd cli && npx tsx src/cli.ts run sales-manager-newsletter --input '...'`
(same CLI invocation pattern as `scripts/daily/outreach-lead-pipeline.sh`) → writes the
result into `docs/market-research/sales-manager.md` (version-bumped per
`DWS_DOCUMENT_STANDARD.md` §5) and upserts to Supabase `knowledge_base` → git commits and
pushes directly (mirrors the existing self-commit pattern already in
`scripts/weekly/market-research.sh`).

**Stage 4 — skill registration (only after Stage 1-3 have produced 3-10 good manual/automated
editions, per the Skill Codification Rule in CLAUDE.md — "asked twice = failure," not
"built once = skill").** Register `skills/sales-manager-newsletter/SKILL.md` +
`skills/manifest.json` entry, so a HIC can also trigger an ad-hoc edition interactively via
`/sales-manager-newsletter <topic>` between scheduled runs.

## Every generated edition carries the Provenance disclaimer

Same rule applied to v1.0 of `sales-manager.md`: company names, prices, and regulatory dates
in a generated edition are unverified external signal until routed through `/truth-check`.
The synthesis agent's output template must include this disclaimer by default, not as an
afterthought — do not let automation quietly drop it.

## Status

- **Stage 1 — DONE (2026-07-12).** `scripts/collect_regulatory_signals.py` +
  `scripts/weekly/collect-regulatory-signals.sh` (auto-discovered by `day-runner.sh`,
  registered in `Cron-works.md`). Verified: Python syntax, full dependency install in an
  isolated venv, CLI arg parsing (`--dry-run`, `--topic`), rate-limiting/robots.txt/retry/
  dedup logic all execute cleanly. **Not verified:** actual RSS content end-to-end — this
  Claude Code cloud session's outbound gateway returns 403 on `news.google.com:443` by
  policy (confirmed via `$HTTPS_PROXY/__agentproxy/status`: `connect_rejected`, not a
  Google-side or code-side failure). First real content will only be seen once this runs
  on DGX Spark's unrestricted network path — recommend a manual
  `bash scripts/weekly/collect-regulatory-signals.sh --dry-run` (or the Python script
  directly with `--dry-run --topic CBAM`) over SSH on DGX as the first verification step,
  before trusting the live (non-dry-run) weekly schedule.
- **Stage 2 — DONE (2026-07-12).** `src/agents/sales-manager-newsletter.agent.ts`,
  registered in `src/agents/index.ts`. Reads `market_signals` (`signal_type='regulation'`)
  - `logs/news-signals/*.jsonl`; refuses to synthesize an edition below `minStories`
    (default 3) rather than fabricate one. Sales targets constrained to the existing
    `EU_TARGET_UNIVERSE` (exported from `outreach-lead-finder.agent.ts` for reuse — no second
    target list) — the LLM cannot invent company names. Verified: `tsc --noEmit` clean across
    the whole project (0 errors) after this change. **Not verified:** an actual LLM call,
    since that needs DGX Spark Ollama (same constraint as Stage 1's network access).
- **Stage 3 — DONE (2026-07-12).** `scripts/weekly/sales-manager-newsletter.ts` (plain
  `.ts`, day-runner.sh runs `.ts` files directly via `npx tsx` — no `.sh` wrapper needed,
  unlike Stage 1's Python collector). Calls the agent via the CLI's HTTP API
  (`cli/src/cli.ts run sales-manager-newsletter`, requires `dws-backend` running — same
  dependency `scripts/daily/outreach-lead-pipeline.sh` already has). On success: replaces
  content between new `<!-- EDITION-CONTENT-START/END -->` markers added to
  `sales-manager.md`, bumps the document version (+0.1), inserts a history entry, writes a
  new `knowledge_base` row (one per edition — history preserved, not overwritten), commits
  and pushes to `main` directly (mirrors `market-research.sh`'s existing self-commit
  pattern). If the agent reports `insufficientData`, exits cleanly with no write — a quiet
  week produces no edition, not a fake one. **Verified:** the marker-replacement /
  version-bump / history-insertion logic was tested standalone against a real copy of
  `sales-manager.md` and produced correct output (version 1.0→1.1, history entry inserted,
  content correctly bounded by markers). **Not verified:** the full path end-to-end
  (agent call → backend → LLM → file write → git push) — needs `dws-backend` and Ollama,
  neither reachable from this session.
- **Stage 4 (skill registration) — not yet built**, gated on Stages 1-3 per the Skill
  Codification Rule.
