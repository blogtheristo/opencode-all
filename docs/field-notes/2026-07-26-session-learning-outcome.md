<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — 2026-07-26 session
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ollama-orchestration-merge-047pj7
Purpose: DWS Learning Standard closing record for a session that ran from PR-backlog
         orchestration to a product-strategy inflection, a published blog post, five
         translated product pages and three pricing/positioning bug fixes.
         Legal basis: EU AI Act Article 14 (human oversight) — HIC = Human-In-Command.
-->

# HIC Learning Outcome — 2026-07-26

## 1. What the session was, and what it became

It started as PR-backlog cleanup ("125 PR open, act as the boss of the Ollama models") and
became a **product-strategy correction** — because the cleanup surfaced that the strategy the
repository documented was not the strategy the hardware could support.

**The arc:** Ollama unreachable from cloud → orchestrate with subagents instead → triage 131
PRs → find the LWM 55B-training claim → verify it against the hardware → discover Cosmos 3
Edge → reframe build→adopt → propagate to thesis, products, price list, blog, and five
languages.

## 2. The five-step Learning Standard record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/wiki/concepts/adopt-the-base-own-the-loop.md` — the reusable rule extracted from this session |
| 2 | **Field note** | ✅ five, incl. this one: PR-backlog orchestration, LWM training-hardware reality, Cosmos 3 Edge inflection, Ollama-boss cost architecture |
| 3 | **`Learn/` HTML** | ❌ **N/A — pandoc is not installed in this container**, so `scripts/render-doc.sh` cannot run. Also blocked: `scripts/gen-thesis-html.cjs` writes files named with a stale version (v3.83) while the sources are at 3.91 — a real bug, logged below, not worked around |
| 4 | **Drive export** | ❌ **N/A — see §6**, recorded rather than silently skipped |
| 5 | **HIC question** | ✅ §7 |

## 3. What was verified, not assumed

- **The 55B LWM plan does not fit the hardware.** GN-100 = 128 GB unified = inference budget; training needs ~8–16× the inference footprint. PR #1720 already found no pipeline code and no such node.
- **Cosmos 3 Edge is real and fits.** 4B + 2B Nemotron reasoner, DGX-Spark-native, released 15.07.2026 — verified against NVIDIA's primary announcement, not taken from a tweet.
- **The Claude billing "two-pool split" does not exist.** It was cancelled before launch; Pro runs Sonnet only; Opus 5 needs Max or an API key. The cost model built on the imagined $20 pool was void.
- **`products.json` was correct; the generator was wrong.** 52 monthly SKUs rendered as annual prices on the customer-facing list.

## 4. Bugs found by doing the work (not by looking for them)

| Bug | Impact | Fix |
| --- | --- | --- |
| Price-list generator mapped `subscription → 'per year'` | **52 products advertised at annual prices** (e.g. €19,990/mo shown as a year) | `unitLabel()` resolves priceUnit → billingPeriod → type |
| Required subscriptions absent from the price list | Buyer never saw the mandatory €499/mo | Render the `subscriptions` key |
| Aegis pages implied bundled hardware | Procurement could read a hardware bundle into a software price | Per-tier hardware statement on all three buyer surfaces |
| Language bar swapped only the hero | German hero over an English body once per-language files existed | Hero pinned per file; bar navigates |
| The i18n builder was not idempotent | Second run read its own output | Normalise before extract; its own guard caught it |

## 5. Process learnings (carry to the next session)

1. **Triage subagents must be READ-ONLY.** One closed a PR unprompted because the prompt did not forbid mutation. Every later fleet prompt said "STRICTLY READ-ONLY".
2. **Two-pass mergeability.** GitHub returns `mergeable_state: unknown` on first read.
3. **"Doc-only + clean" is not "safe".** A doc-only PR carried a sender-identity violation.
4. **Separate the data from the markup.** Translators produced JSON string arrays; deterministic code touched the HTML. They could not break the page.
5. **A build step that can silently misalign should refuse to run.** The i18n builder's string-count guard caught a real defect the same hour it was written.

## 6. Fail-loud register (what did NOT happen)

- `Learn/` HTML not regenerated — no pandoc; and `gen-thesis-html.cjs` mislabels output versions. **Open action.**
- Drive export not performed — the connector was intermittently disconnected across this session and the repo remains source of record.
- **KEEP_REVIEW bucket (30 code PRs) not merged.** Reviewed and classified, not shipped: many are `dirty`, several carry migrations without the mandatory Supabase GRANTs (#1528, #1208, #1674 — with a migration-number collision on 075), and #1213 disables security scans. Merging them needs build+test per PR on a machine with the toolchain. **This is the honest state — not "done".**
- Two-layer architecture **not** published to the public Aegis page: the physical layer is *Planned Q4*, and publishing a roadmap capability on a sales page is the exact artifact-legitimacy overclaim this programme documents. Left for an HIC decision.
- FI/SV/DE/FR pages are machine translations built to canonical regulatory terms; **no native or legal review yet**.

## 7. HIC question (EU AI Act Article 14)

> **The 55B pretraining plan is retired and the moat is now declared to be the owned loop
> (evals + RL + fleet data + KYA). That loop is currently a claim, not an instrument: there
> is no published private-eval set and no RL environment in the repository. Which comes
> first — standing up the private-eval harness that makes the moat measurable, or exercising
> the non-NVIDIA fallback (R-01) that makes the supply position auditable?**

Both are named as top open actions; only one can be first, and each answers a different
buyer. The eval harness answers "why you"; the fallback answers "what if NVIDIA stops".

## 8. Session output

Merged to main: 10 doc PRs. Closed: 11. Opened: #1757 (Aspire 13.4.6). Written: 63 redo
prompts, 5 field notes, 1 KB concept, 1 risk register, 1 blog post (#43, live as Text of the
Day), 5 translated product pages. Thesis 3.87 → 3.91 in lockstep across all four files.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._
