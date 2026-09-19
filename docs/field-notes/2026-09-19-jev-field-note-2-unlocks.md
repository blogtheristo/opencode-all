<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note 2 — Jev is “sort, don’t write”: queues it unlocks

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Second Jev field note. HIC-supplied “clearest explanation” + seven unlocks + Vercel AI Gateway / Startup Ideas Pod pointer. Ideas only. Vendor economics and waitlist-skip not independently verified.

Session Links & References:

- Field note 1: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Han Xiao / LWM: `docs/field-notes/2026-09-19-lwm-ideas-han-xiao-jev.md`
- Spec: `docs/KYA_JEV_SPECIFICATION.md` (v0.6)
- Named URL in source (not fetched this session): `https://youtube.com/watch?v=4mTLpuQpB80`
- Handles in source: `@startupideaspod`, `@ryanvogel`

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — product-idea bind. No vendor Jev call. No new SKU. No 087 apply.

**Source:** HIC-pasted essay (inbox metaphor, 7 unlocks, “expensive queue”, Vercel AI Gateway waitlist skip, Startup Ideas Pod episode). **MEDIUM** on quotes and the 1,700-emails / 18-cents figure — not checked against TypeSafe, Vercel, or the YouTube page (Rule 12). Do not put those numbers on a public DWS surface.

## What the essay says Jev _is_

Not a writer. A **sorter**: look at one item, return a typed call plus confidence (“junk, 94% sure”). The inbox example is classification, not reply-drafting.

That matches the typed primitives already in `kya-jev` (`choice` / `score` / `boolean`) and the 18.09 line: code constrains, typed judge, LLM deliberates, human governs. It does **not** change the 18.09 sovereignty finding: vendor Jev is US-hosted / CLOUD Act–exposed. “Live on Vercel AI Gateway” (if true) is still a US path.

## What it unlocks (essay) vs DWS (bind only)

TL;DR in the essay: find an expensive queue and put Jev at the front.

| #   | Essay unlock                                                  | Existing DWS bind (do not treat as shipped Jev)                                                              | Gate                                              |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| 1   | Instant quotes (roofers, movers, insurance, legal intake)     | Consulting / Firehorse quote SKUs already exist in `products.json`; none is a sub-second typed quote engine. | HIC + calibration before any auto-price           |
| 2   | Lead scoring as a product                                     | `outreach-lead-finder`, `keyword-intent`, `lead-feedback` — still generative models today                    | Exempt-ish sales agents; still no vendor Jev      |
| 3   | Support triage, no support team                               | `helpdesk` agent: draft + recommend action; humans approve; never sends                                      | Same HIL as now                                   |
| 4   | Clipping / score “best moments”                               | No clipping product in catalog. Do not invent one.                                                           | Signal only                                       |
| 5   | Application piles (grants, permits, claims, jobs, loans)      | Compliance / Chronos / industry specialists read **regulatory** piles, not a generic claims inbox            | Ledger-Native → kya-jev or nothing, not US Jev    |
| 6   | Marketplace matching                                          | Store / industries / booking exist; no “match to local business in one typed call” SKU                       | Signal only                                       |
| 7   | Fast browser agents (bulk quotes, 200 forms, supplier checks) | `browser` / Browser MCP in AGENTS.md; not wired to kya-jev                                                   | KYA on tools stays; no auto-execute on confidence |

**DWS product sentence (internal):** `KYA-JEV-001` is the sovereign “front of the queue” listing (EUR 99/mo Early Access, uncalibrated, `preorder`). This essay is a **use-case menu**, not a price or volume proof.

## How to get it (essay vs us)

Essay: skip waitlist via **Vercel AI Gateway**; episode on `@startupideaspod` with `@ryanvogel`; Watch URL above.

**This session:** did not call Vercel, did not confirm waitlist policy, did not watch the video.

**DWS how-to-get-it (already decided 18.09):** do not add a TypeSafe/Vercel key. Use `makeTypedDecision()` / `adviseDictionaryTerm()` on DGX/Groq/Anthropic behind `issueKyaVerdict()`. Migration `087_kya_jev_calls.sql` is still **unapplied** (no Supabase MCP in this cloud session) even though PR #2043 is on `main`.

## Decision recorded

Keep vendor Jev as a **market signal** (System-1 sorter in front of expensive queues). Keep **kya-jev** as the only in-repo implementation. Do not publish “1,700 emails / 18 cents” or “skip the waitlist” as DWS claims.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** Which one queue (1–7) should be the next _advisory_ kya-jev consumer after `seo-audit` + dictionary — helpdesk triage (#3) or lead scoring (#2)? Not a ship-the-quote-engine question.
6. Calendar: N/A.
