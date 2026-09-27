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

### Into Sales Mission Control

The scan is only useful if it reaches the HIC's daily queue. `sync-to-supabase.mjs` upserts the
results into `public.hilma_tenders` (migration `093_250926_hilma_tenders.sql`), which
`dashboard/mission-control` reads as the **Hilma lane** of the Sales Centre — gated to
`risto.paarni2024@lifetime.fi` (`mission-control.js` `ALLOWED_EMAIL`).

```bash
# On a host that can reach hankintailmoitukset.fi (DGX Spark or local — NOT a cloud session)
cd skills/hilma-watch
node hilma-watch.mjs --top 40
node sync-to-supabase.mjs --dry-run      # inspect the mapped rows first
node sync-to-supabase.mjs                # needs SUPABASE_URL + SUPABASE_SERVICE_KEY
```

Upsert key is `notice_url` (the same key the scan dedupes on). `status` and `notes` are **not**
in the payload, so a re-scan never resets an HIC triage decision back to `new`.

Lane ranking in Mission Control: deadline within 7 days **or** fit >= 60 → priority 1;
fit >= 40 → 2; otherwise 3. Deadlines are parsed from the Finnish `Määräaika:` line in the
result card; notices without a parsable deadline rank on fit alone.

**Sync refuses (exit 3) on a partial run or zero notices** — a blocked scan must never look like
"no tenders today", and must not overwrite a good prior sync with a truncated one (Rule 12).

### Scheduled run (daily)

`scripts/daily/hilma-watch.sh` runs the scan + sync once a day, Mon–Sat. It is auto-discovered by
`infrastructure/dgx-spark/day-runner.sh` (`scripts/daily/*.sh`, ~03–06:00 UTC window), so the Sales
Centre lane is current each morning. Dropping the file in that directory **is** the schedule —
there is no `cron-runner.ts` entry, and there must not be: that container is `node:24-slim` with no
Chromium, and the scan drives Playwright. It runs on the DGX **host**.

Host prerequisites: Chromium/Playwright, plus `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env`.
The script aborts with exit 2 if the keys are missing rather than running a scan it cannot store.
Sunday is skipped — Hilma publishes on business days — matching `scripts/daily/construction-leads.sh`.

Log: `logs/hilma-watch.log`. Failure modes, all non-zero and all leaving the previous rows intact:

| Exit | Meaning                                                                   |
| ---: | ------------------------------------------------------------------------- |
|    2 | Supabase env not set on the host — nothing ran                            |
|    3 | Scan hard-failed (Hilma unreachable), or sync refused a partial/empty run |
|    4 | Supabase upsert rejected the payload                                      |

**Why daily and not weekly** (HIC 2026-09-22): Finnish _national_ tenders (kansallinen hankinta)
can carry response windows as short as two weeks, so a 7-day scan gap could consume half of one
before the notice is ever seen. EU-threshold tenders have 30+ day minimums where weekly would be
adequate — but the short national ones are the DWS-sized deals. The run is idempotent (upsert on
`notice_url`, HIC triage preserved), so re-scanning the same notices daily costs one Chromium run
on free local compute and nothing else. The asymmetry decides it: a near-zero cost against losing
half a response window.

### Access rights vs. reachability

Being signed in as `risto.paarni2024@lifetime.fi` does **not** make the scan work from a cloud
session. Hilma's `ContractNotices` search is public; the blocker is the sandbox egress policy, not
authentication. The account matters for the _downstream_ steps — opening restricted notice
attachments and submitting a response on `tarjouspalvelu.fi` — and for opening Mission Control.

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
