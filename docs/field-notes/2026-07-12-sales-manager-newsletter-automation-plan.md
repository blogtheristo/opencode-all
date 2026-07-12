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

This is the plan, not the build. Stages 1-3 are unbuilt as of this commit. Next action, if
approved: build Stage 1 (the regulatory-signal collector) first, since Stages 2-3 depend on
it having real data to synthesize from.
