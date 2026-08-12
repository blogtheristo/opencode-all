# Handoff — claude/ollama-orchestration-merge-047pj7

**Updated:** 2026-07-26 · **Owner:** Risto Anton Päärni · **Agent:** Claude Code (Opus 4.8)

## What this branch/session did

Boss-role cleanup of the dws6 open-PR backlog (~131). Ollama-on-DGX-Spark was unreachable from the cloud session, so orchestration ran as Opus + `general-purpose` subagent fleet. Full record: `docs/field-notes/2026-07-26-pr-backlog-orchestration-cleanup.md`.

## State on this branch

- Carries: Aspire 13.4.6 bump (`docker-compose.yml`, field note §3.8, `Admin/ADMIN_MANUAL.md`) → **PR #1757 open**. Plus this handoff + the 2026-07-26 field note.
- `npm install` completed (exit 0) — `npm run build` (`tsc`) and `npm test` (`vitest`) are runnable next session.

## Done

- Merged (doc-only): #1672 #1689 #1530 #1462 #1434 #1433 #1431 #1430 #1320 #1660.
- Closed (superseded): #1432 #1557 #1124 #1403 #1699 #1686 #1539 #1236 #1422 #1395 #1379.
- 63 redo prompts in `scratchpad/next-prompts/` (ephemeral — regenerate from PR bodies if the container reset; the bundle was delivered to the HIC).

## NOT done — next session (HIC said "yes" to all four)

1. **Close the 63 V2-source branches** (comment: "superseded — idea carried to next-prompt-v2; redo against current main"). List = the V2_PROMPT PRs in the field note buckets.
2. **KEEP_REVIEW (30) → review + fix + test + compile + merge.** Partial review done: **#1503 MERGE_READY**; **#1528 FIX (add table GRANTs to migration 070)**; #1548 #1526 #1504 #1498 REBASE. Re-run the review fleet for the other ~24 (R1/R3/R4/R5 died on session limit). CEO review where flagged: #1553 (Aiven CLOUD-Act legal wording), #1287 (Aegis hackathon public page), #1122 (Captain-tier pricing), #1708 (lifetime.fi homepage swap).
3. ~~**Sender decision** (field note §8)~~ **RESOLVED 2026-07-26 (HIC chose (b)):** CLAUDE.md now recognises `risto.paarni2024@lifetime.fi` as a legitimate outbound address (the Workspace account live threads send from). #1698 and #1664 are therefore **compliant as-is** — no sender fix needed; they can be merged/redone normally.
4. **dws7** — same treatment (still untouched).
5. **DGX: wire the tiered Ollama-boss routing** into `src/agents/model-selector.ts` (boss=qwen2.5:72b local, workers=qwen2.5:7b local, escalate→claude-opus-5 via API key, never Pro). Prompt: `docs/pr-cleanup/next-prompts/DGX-model-selector-routing-v2.md`. Rationale + corrected cost model: `docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md`. Billing fact-check: the June-2026 two-pool split was cancelled; Pro = Sonnet-only, Opus 5 needs API key or Max.

## Guardrails learned (apply next session)

- Triage/review subagents are **STRICTLY READ-ONLY** (no close/merge/comment/push) — a subagent closed #1432 unprompted.
- Two-pass `get` for real `mergeable_state` (first returns `unknown`).
- Doc-only+clean still needs a content-safety pass (sender identity, public-site, PII).
- Supabase: every new `CREATE TABLE` needs table `GRANT`s (#1528, #1208, #1674 offend). #1674 migration 075 collides with main.

## Multi-machine coordination (agreed 2026-07-26) — ONE writer per branch

DGX + local Claude both checked out this branch. To avoid conflicts/force-pushes,
split the lanes so only ONE machine commits to `claude/ollama-orchestration-merge-047pj7`:

| Machine | Lane | Writes to this branch? |
| --- | --- | --- |
| **DGX** | KEEP_REVIEW: review + build (`tsc`) + test (`vitest`) + merge; rebase fixes; security redos (#1453 etc.). Has node_modules, local Ollama, is deploy-adjacent. Run `docs/pr-cleanup/NEXT_SESSION_PROMPT.md` **step 2 only**. First: `git pull --rebase`, `scripts/ollama-spark.sh --list`, `export OLLAMA_BASE_URL=http://localhost:11434`. | ✅ **sole writer** |
| **Local** | Non-committing work: close the 63 V2-source branches (GitHub API only), the sender decision (§8 of the field note), and dws7 (separate repo/branch). Run `NEXT_SESSION_PROMPT.md` **steps 1, 3, 4**. | ❌ does not touch this branch |

Rule: only DGX commits/pushes here; always `git pull --rebase origin claude/ollama-orchestration-merge-047pj7` before pushing. Local's lanes (closes / dws7 / sender) write nothing to this branch, so they can't conflict. Account usage limit is shared across machines on the same account (resets 8am UTC).

## Blockers

- Session token limit hit 2026-07-26 (resets 8am UTC) — that is why steps 1–4 are deferred, not skipped.

***

## 2026-07-27 — branch restarted after #1757 merged; five-language LSJ

PR #1757 merged to `main` (`28040d0`). Per the merged-PR rule, this branch was **restarted
from fresh `origin/main` (`b01514c`)** — it no longer carries the merged history, so anything
opened from it is a **new PR**, not a reopening of #1757.

**Shipped this session:**

- LSJ #43 published in five languages (posts #44–#47). FI keeps its live URL and gains
  `hreflang` + a language switcher; EN/SV/DE/FR use the English base slug with
  `.sv/.de/.fr` suffixes.
- `scripts/i18n/build-i18n-pages.cjs` — generic, config-driven successor to
  `build-aegis-pages.cjs` (Skill Codification Rule). New target = a JSON config, not a script.
  Adds `meta.json` for attribute-borne copy (`og:*`, `twitter:*`, `description`,
  `article:section`, `aria-label`, social share title) that the text-node array misses.
- Each language's Aegis CTA now lands on the Aegis page in that language.
- `docs/BLOG_STANDARD.md` §3.2 — the multi-language convention, and why it deliberately
  differs from §3.1 (latestPosts = EN+FI only; injector = master only; §3 registry = all).
- Field note: `docs/field-notes/2026-07-27-i18n-as-data-five-language-publishing.md`.

**Verified:** 0 truth-lint failures · 3 consecutive builder runs byte-identical · 55 internal
post links resolve · dual-folder mirrors byte-identical · `inject-blog-nav.cjs` is a no-op on
all five pages.

**Explicitly NOT verified:** the SV/DE/FR/EN text is machine translation with **no native or
legal review**. That is the open HIC question in the field note §6.

**Still open from 2026-07-26** (unchanged): the KEEP_REVIEW 30, the 63 V2-source branch
closes, dws7, DGX model-selector routing, `Learn/` HTML regeneration (no pandoc +
`gen-thesis-html.cjs` version-label bug). Blog posts are also absent from `sitemap.xml`
entirely — pre-existing, deserves its own change.

***

## 2026-07-27 (close) — PR #1758: five languages, Article 50, and two enforced rules

Session closed under the DWS Learning Standard. **All five steps completed** — the first time
`Learn/` HTML and the Drive export both landed (previous sessions recorded them N/A).

| Step | Where |
| --- | --- |
| KB | `kb/wiki/concepts/make-the-compliant-state-the-default.md` |
| Field note | `docs/field-notes/2026-07-27-i18n-as-data-five-language-publishing.md` |
| `Learn/` HTML | `Learn/2026-07-27-…-v1.0.html` + `Learn/make-the-compliant-state-the-default-v1.0.html` |
| Drive | [Google Doc](https://docs.google.com/document/d/1rOpGiqEFb_NxlZSg6DPQTT6FfjsgdVycz75aBIooCJk/edit) |
| HIC question | Field note §11 — audit all 25 rules for enforceability, or fix on breakage? |

**Correction worth carrying:** `Learn/` HTML was twice recorded as "N/A — no pandoc". Wrong.
`render-doc.sh` needs pandoc, but **`scripts/gen-doc-html.cjs` was already in the repo** and renders
Markdown → branded HTML with no pandoc. Use it. The blocker was mine, not the container's.

**Shipped:** LSJ #43 in five languages (#44–#47) · generic `build-i18n-pages.cjs` · EU AI Act
Art. 50(4) registered (`DWS_TRUTH_STANDARD` §2 row 31 / §2G, v4.0) and the AI-content label shipped
on all four translations · **Non-Negotiable Rule 13** (HIC reads blog text before publication) with
`blog-draft-gate.sh`, `/blog-draft`, and `session-stop.sh` back-stops.

**Two rules now enforced by mechanism, not memory** — the AI label (builder emits it by default) and
the blog draft (hook blocks publish without approval). Both had been *written down* and *still
failed*. The extracted rule is in the KB: **a step you have to remember is a step that will be
missing on the entry that matters.**

**Next session, first thing:** the blog gate arms at session start, so *this* session never ran with
it live. Confirm it blocks on a real `Write` before trusting it.

**Still open:** KEEP_REVIEW (30 code PRs, several missing Supabase `GRANT`s) · dws7 untouched ·
DGX model-selector routing · `gen-thesis-html.cjs` version-label bug · posts absent from
`sitemap.xml` · AI disclosure absent from `og:`/`twitter:` cards · no EU Icon asset · FI/SV/DE/FR
unreviewed by a native speaker · DE/FR `og:title` vs share-title mismatch · truth-lint scoping
(anti-metric rule fires inside `VERSION AND AGENT HISTORY` blocks).
