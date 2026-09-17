# Field Note — Skill Usage Audit: Do We Need Them All?

Date: 2026-08-20

## Method and its limit (read this before the table)

There is no real usage telemetry for skills/commands in this repo — `.claude/command-log.txt` is raw bash shell history, not a slash-command invocation log. The only available proxy is **textual evidence**: literal `/<name>` mentions in `docs/field-notes/*.md`, `CHANGELOG.md`, `.claude/handoffs/**/*.md`, `docs/backlog/*.md` — i.e., places a session wrote down that it ran something.

**This undercounts real usage.** A skill run live in a terminal or chat session that never got written up in a field note shows as "0 mentions" here even if it's used weekly. Treat "likely-dust" below as "no evidence found in our written records," not "confirmed unused." The honest fix is the same one flagged in the provenance audit: build a real usage counter (`skill-cleaner` already exists as a meta-tool — see Recommendation).

## Findings

**Experimental (formal not-fully-live flag):** `dream-on` (command + pack) — already marked `experimental` in `skills/manifest.json`, not a surprise.

**No thin scaffolding found** — every `SKILL.md` has real content (≥50 lines), none are bare templates.

**Confirmed chain dependency:** `clawdbot` → `dream-on` → `promote-proposal` (documented in `dream-on/SKILL.md` as the reflection pipeline). These three keep each other alive regardless of individual mention counts.

**Duplicate/overlapping coverage** — same functional area registered more than once:

| Area                                                                                                                                                                 | Entries                                                                        | Note                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cron                                                                                                                                                                 | `cron` (slash), `cron-command`, `cron-pack`, `cron-scheduler-pack`             | 4-way. `cron-scheduler-pack` has zero direct mentions and isn't referenced by `cron`/`cron-command` — looks like a genuine orphan, not an intentional command+pack pair. |
| sovereignty                                                                                                                                                          | `sovereignty-assess` (9 mentions), `sovereignty-pillars-assess` (8 mentions)   | Both used, but overlapping scope — worth confirming they're not redundant.                                                                                               |
| compliance                                                                                                                                                           | `compliance` (62 mentions), `compliance-check` (2 mentions), `compliance-pack` | `compliance-check` looks like the weaker sibling of `compliance`.                                                                                                        |
| Most others (`clawdbot`, `dream-on`, `promote-proposal`, `mgd-report`, `hilma-watch`, `autoresearch`, `human-capital`, `token-capital`, `edge-control-room-capital`) | command + pack pair                                                            | This is the manifest's intentional dual-transport pattern (slash-cli surface vs skill-pack-cli surface) — not overlap, by design.                                        |

## Full table

Verdict key: **keep** = clear usage evidence or structural necessity (gate/hub) · **investigate** = overlap or thin signal worth a second look · **likely-dust** = zero textual evidence found, no cross-refs, no structural role (see method caveat above).

| Skill/command                                       | Mentions | Status           | Verdict                                                                                                                      |
| --------------------------------------------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| kya                                                 | 84       | active           | keep                                                                                                                         |
| kb                                                  | 53       | active           | keep                                                                                                                         |
| truth-check                                         | 49       | active           | keep                                                                                                                         |
| compliance                                          | 62       | active           | keep                                                                                                                         |
| email                                               | 33       | active           | keep                                                                                                                         |
| workflow                                            | 24       | active           | keep                                                                                                                         |
| autoresearch (+pack)                                | 25       | active           | keep                                                                                                                         |
| review                                              | 20       | active           | keep                                                                                                                         |
| learn                                               | 16       | active           | keep                                                                                                                         |
| ollama-spark                                        | 11       | active (dgx)     | keep                                                                                                                         |
| investor-outreach                                   | 10       | active           | keep                                                                                                                         |
| token-capital (+pack)                               | 10       | active           | keep                                                                                                                         |
| cron (+command, +pack)                              | 10       | active           | **investigate** — 4-way overlap, `cron-scheduler-pack` orphaned                                                              |
| sovereignty-assess                                  | 9        | active           | keep                                                                                                                         |
| sovereignty-pillars-assess                          | 8        | active           | **investigate** — overlaps sovereignty-assess                                                                                |
| retro                                               | 8        | active           | keep                                                                                                                         |
| reports (+pack)                                     | 8        | active           | keep                                                                                                                         |
| edge-control-room-capital (+pack)                   | 7        | active           | keep                                                                                                                         |
| human-capital (+pack)                               | 7        | active           | keep                                                                                                                         |
| agent-run                                           | 7        | active           | keep                                                                                                                         |
| blog-draft                                          | 7        | active           | keep                                                                                                                         |
| dialog                                              | 6        | active           | keep                                                                                                                         |
| factory-route                                       | 6        | active           | keep                                                                                                                         |
| contentms                                           | 5        | active           | keep                                                                                                                         |
| discover-agents                                     | 5        | active           | keep                                                                                                                         |
| remote-control                                      | 5        | active           | keep                                                                                                                         |
| clawdbot (+command, +pack)                          | 4        | active           | keep (chain hub)                                                                                                             |
| coaching                                            | 4        | active           | keep                                                                                                                         |
| lsj-publish                                         | 4        | active           | keep                                                                                                                         |
| eu-data                                             | 3        | active           | keep                                                                                                                         |
| case-run                                            | 3        | active           | keep                                                                                                                         |
| regulatory-radar                                    | 3        | active           | keep                                                                                                                         |
| qa                                                  | 3        | active           | keep                                                                                                                         |
| browse                                              | 2        | active           | keep                                                                                                                         |
| compliance-check (+pack)                            | 2        | active           | **investigate** — weak sibling of `compliance`                                                                               |
| material-oracle                                     | 2        | active           | keep                                                                                                                         |
| mgd-report (+pack)                                  | 2        | active           | keep                                                                                                                         |
| plan-review                                         | 2        | active           | keep                                                                                                                         |
| query                                               | 2        | active           | keep                                                                                                                         |
| risto                                               | 2        | active           | keep                                                                                                                         |
| sitesense                                           | 2        | active           | keep                                                                                                                         |
| swarm                                               | 2        | active           | keep                                                                                                                         |
| gcr-skill                                           | 1        | active (admin)   | **investigate** — thin evidence                                                                                              |
| dream-on (+pack)                                    | 1        | **experimental** | keep-experimental (chain hub)                                                                                                |
| loop                                                | 1        | active           | **investigate**                                                                                                              |
| maintain                                            | 1        | active           | **investigate**                                                                                                              |
| promote-proposal (+command, +pack)                  | 1        | active           | keep (chain target)                                                                                                          |
| ship                                                | 1        | active           | **investigate** (see caveat — `/ship` is a core gstack release step, low count is likely a methodology artifact, not disuse) |
| signature                                           | 1        | active           | **investigate**                                                                                                              |
| site-safety                                         | 1        | active           | **investigate**                                                                                                              |
| skillpack-check                                     | 1        | active           | keep (meta-tool; used to produce part of this audit)                                                                         |
| brain-ops                                           | 0        | active           | likely-dust                                                                                                                  |
| carbon-analysis                                     | 0        | active           | likely-dust                                                                                                                  |
| citation-fixer                                      | 0        | active           | likely-dust                                                                                                                  |
| cron-scheduler (pack)                               | 0        | active           | **investigate** — orphaned overlap with `cron`                                                                               |
| daily-task-manager                                  | 0        | active           | likely-dust                                                                                                                  |
| enrich                                              | 0        | active           | likely-dust                                                                                                                  |
| firehorse-report                                    | 0        | active           | likely-dust                                                                                                                  |
| fix-dual-folder-api-connectivity                    | 0        | active           | likely-dust                                                                                                                  |
| flow-status                                         | 0        | active           | likely-dust                                                                                                                  |
| gh-to-mcp                                           | 0        | active           | likely-dust                                                                                                                  |
| helpdesk-triage                                     | 0        | active           | likely-dust                                                                                                                  |
| hilma-watch (+pack)                                 | 0        | active           | likely-dust                                                                                                                  |
| ingest                                              | 0        | active           | likely-dust                                                                                                                  |
| multilingual                                        | 0        | active           | likely-dust                                                                                                                  |
| outreach-agents                                     | 0        | active           | likely-dust                                                                                                                  |
| product-page-polish                                 | 0        | active           | likely-dust                                                                                                                  |
| sign-document                                       | 0        | active           | likely-dust                                                                                                                  |
| signal-detector                                     | 0        | active           | likely-dust                                                                                                                  |
| simplify                                            | 0        | active           | likely-dust                                                                                                                  |
| skill-cleaner                                       | 0        | active           | keep (meta-tool, this is _the_ dedicated audit skill — see Recommendation)                                                   |
| skill-creator                                       | 0        | active           | likely-dust                                                                                                                  |
| soul-audit                                          | 0        | active           | likely-dust                                                                                                                  |
| supermetrics-seo-sync                               | 0        | active           | likely-dust                                                                                                                  |
| train-model (+pack)                                 | 0        | active (dgx)     | likely-dust                                                                                                                  |
| design-first / dual-folder-sync / verification-gate | 0        | active (gate)    | keep — gates auto-invoke, never show as `/name` mentions by design                                                           |

**Tally:** 42 keep, 9 investigate, 24 likely-dust (of 88 registered entries; gates and command/pack pairs counted once).

## Recommendation

Two separate decisions, don't conflate them:

1. **The 9 "investigate" items** are mostly genuine overlap (cron 4-way, sovereignty pair, compliance pair) — worth a quick "which one is canonical, retire the other" pass, not a usage question.
2. **The 24 "likely-dust" items** need a decision from the HIC, not a delete from me (Non-Negotiable Rule 6: no destructive action without explicit intent). For each: keep as-is, prune to `_<name>_OLD` (repo convention already used elsewhere, e.g. `firehorse-report-annual_DEPRECATED`), or — better — instrument real usage first. There's already a dedicated `skill-cleaner` skill pack registered for exactly this job; it has zero mention-evidence itself but that's expected for a meta-tool run interactively rather than referenced in field notes. Running `skill-cleaner` directly (rather than this ad-hoc textual proxy) would give a more authoritative answer before anything is pruned.

## Verdict

No skill is provably dead — the evidence is textual-record absence, not confirmed non-use. 24 of 88 registered skills have zero written trace of ever running; 9 more show real overlap worth consolidating. Nothing here should be deleted without the HIC's say-so per Rule 6.
