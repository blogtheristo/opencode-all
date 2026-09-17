---
name: hilma-watch
description: "Scan Finnish public procurement (Hilma / hankintailmoitukset.fi) for tenders matching a watch profile (keywords + CPV codes + regions) and score them deterministically for DWS IQ fit. Use for 'check Hilma', 'any AI tenders', 'tarjouspyynnöt', tender monitoring."
argument-hint: "optional: a config path, or a search term to override the default profile"
allowed-tools: [Bash, Read, WebFetch]
---

# hilma-watch — Public Tender Scanner (Hilma / Mercell)

**Domain:** Finnish & EU public procurement monitoring
**Platform:** `hankintailmoitukset.fi` (Hilma) + `tarjouspalvelu.fi`, the Mercell e-tendering network
**Driver:** Playwright/Chromium via the agent proxy
**Script:** `skills/hilma-watch/hilma-watch.mjs`
**Profile:** `skills/hilma-watch/profile.json` (the watch config — keywords, CPV codes, regions)

## What this skill does

A **parameterized** procedure: the skill describes the process; the config supplies the world
(search terms, CPV codes, regions). It queries Hilma's ContractNotices search per term, dedupes
notices by URL, and scores each one **deterministically** — keyword + CPV overlap, no model in the
scoring loop (Rule 5). Output is JSON + a ranked Markdown table.

This is the codified form of the manual scan first done by hand; see `Coach/tender-watch-profile.md`
for the source profile and the DWS IQ product mapping it feeds.

## Inputs

| Input         | Where          | Default                                            |
| ------------- | -------------- | -------------------------------------------------- |
| `searchTerms` | `profile.json` | 8 AI + training + public-sector terms              |
| `keywords`    | `profile.json` | 29 terms (industrial + public-sector AI)           |
| `cpvCodes`    | `profile.json` | 12 codes (training + personnel + IT + consultancy) |
| `regions`     | `profile.json` | all 19 Finnish regions + Åland (informational)     |

Override the whole profile with `--config <path>` to watch a different opportunity set
(e.g. a construction-only or sovereignty-only watch) — **don't** clone the skill per watch
(Skill Codification Rule: one skill, arguments supply the world).

## How to run

```bash
# Playwright resolves via the global module; symlink once if needed:
#   ln -sfn /opt/node22/lib/node_modules skills/hilma-watch/node_modules
cd skills/hilma-watch
node hilma-watch.mjs                       # default profile
node hilma-watch.mjs --config my-watch.json --top 50
node hilma-watch.mjs --headful             # debug, see the browser
```

Outputs `out/hilma-results.json` and `out/hilma-results.md`.

## Scoring

`score = min(100, keywordHits×10 + cpvHits×15)`. Bands for triage:

| Score | Meaning                          |
| ----: | -------------------------------- |
|  ≥ 60 | Strong fit — review for bid      |
| 40–59 | Relevant — worth a look          |
|  1–39 | Weak signal — keyword brush only |
|     0 | No profile overlap               |

## Failure behaviour (Rule 12 — fail loud)

If the egress policy blocks `hankintailmoitukset.fi` (HTTP 403 on CONNECT) and **zero** notices are
collected, the script exits **non-zero** and prints the blocked host. Do **not** report this as
"0 tenders found" — report the blocked host and that access is required. A partial run (some terms
blocked) is flagged `partialRun: true` in the output and `⚠️ PARTIAL RUN` in the Markdown.

> Network note: as of this writing both procurement domains are egress-blocked in the cloud session.
> The skill runs wherever those hosts are reachable (e.g. an allowed-policy session or local machine).

## When NOT to use

- Drafting the actual bid / outreach letter → see `sales-outreach/` + `DWS_ROLES_REGISTRY.md`.
- EU regulatory pipeline (not tenders) → use `/regulatory-radar`.
- Generic web research → use `/deep-research` or `/browse`.
