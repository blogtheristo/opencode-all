---
name: lsj-publish
version: 1.0
date: 2026-04-19
description: Drafts the next issue of Lifetime Scope Monthly (the LinkedIn newsletter of Lifetime Scope Journal). Picks the best blog entry of the month from onelifetime.world/blog, builds 3 runner-up cards, drafts the Editor's Note and Agentic Lens block, and produces a LinkedIn-ready copy-paste. Use when user says "lsj publish", "draft scope monthly", "best blog of the month", "lifetime scope monthly", "linkedin newsletter draft", or "prepare LSJ issue".
---

Draft the next issue of **Lifetime Scope Monthly** — the LinkedIn newsletter layer of Lifetime Scope Journal (LSJ).

Usage: `/lsj-publish <month>` — e.g. `/lsj-publish 2026-04` (defaults to current month).

Input: $ARGUMENTS

## What it produces

Two artefacts per run:

1. **HTML blog post** at `onelifetime.world/posts/lifetime-scope-monthly-<yyyy-mm>.html` (+ synced mirror in `landing-pages/onelifetime-world/posts/`). Uses the existing post template + prev/next nav + share block + store cards.
2. **LinkedIn copy-paste block** — single fenced code block, no markdown, no `<>` around URLs, ready to paste into the LinkedIn newsletter composer. Follows the CLAUDE.md Copy-Paste Output Rule and Social Media Output Rule.

## Four-block format (fixed)

Every issue contains exactly these four blocks, in order:

1. **Editor's Note** — ~150 words from Risto. Thesis of the month. Why this entry matters _now_.
2. **The Best Entry** — full republish of the single best LSJ post of the month. Title, canonical URL, date, tags, lede paragraph, then the full body (or the first ~800 words with a "continue reading" link if the original is longer).
3. **The Runners-Up** — 3 cards (title / one-line takeaway / link to the post on onelifetime.world/blog/).
4. **Agentic Lens** — exactly one 80-word paragraph: _"If you used DWS IQ 6 agents this month, here is what they found."_ Ties editorial to Alpha-Share outcomes (anonymised aggregates). Never a product pitch.

## Steps

1. Parse `<month>` from $ARGUMENTS (default: current month in `YYYY-MM`).
2. **Inventory posts of the month.** Read `onelifetime.world/posts/*.html` and `onelifetime.world/posts/en/day-*.html`; filter by `<meta property="article:published_time">` within the target month. Log the count.
3. **Rank candidates** by this priority order (matches the strategy doc at `docs/field-notes/2026-04-19-lifetime-scope-journal-media-layer-strategy.md`):
   1. Time-on-page (if analytics data available; otherwise skip)
   2. Qualified-lead attribution (if CRM hint file `data/lsj-attribution-<yyyy-mm>.json` exists; otherwise skip)
   3. Share velocity (inbound LinkedIn reshares; skip if unknown)
   4. **Editorial judgement** — differentiation, timeliness, depth, customer relevance
   Pick **one** Best Entry. Pick **three** Runners-Up.
4. **Draft Editor's Note** (~150 words). Must name the thesis, not summarise. Active voice. One sentence per idea. No adjective stacking.
5. **Draft Agentic Lens** (exactly 80 words). Must cite at least one verified outcome (Alpha-Share %, hours saved, CO2 reduced, compliance-gate passes). If no real aggregate is available, state _"No verified outcomes this month — see next issue."_ Never fabricate numbers (CLAUDE.md Validated Mock Data Rule).
6. **Generate the HTML post** using `onelifetime.world/posts/_template-en.html` — fill in `{{TITLE}}`, `{{DESCRIPTION}}`, `{{DATE_ISO}}`, `{{CATEGORY}}="Monthly Highlights"`, prev/next links, share block, three store cards (DWS IQ Platform €4,999 / Climate Reporting Bundle €6,500 / Firehorse Omnichannel €499 — same set used in existing LSJ posts).
7. **Sync to `landing-pages/onelifetime-world/posts/`** in the same commit (dual-folder-sync discipline skill).
8. **Update post registry** per `docs/BLOG_STANDARD.md` Section 3 — add entry, update prev/next on the neighbouring posts.
9. **Emit the LinkedIn copy-paste block** last. One fenced code block. Plain text only. URLs include `https://` protocol. No angle brackets, no backticks, no markdown link syntax. Contains: title, editor's note, link to full Best Entry on onelifetime.world, three runner-up bullets with URLs, Agentic Lens paragraph, subscribe CTA (`https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7191306524177154048`), sign-off.
10. **Commit + push** on the current branch with message `LSJ Monthly <yyyy-mm>: <Best Entry short title>`. Do not auto-post to LinkedIn — the Editor in Chief sends manually.

## Acceptance checks

- [ ] HTML validates (no unclosed tags).
- [ ] `diff onelifetime.world/posts/lifetime-scope-monthly-<yyyy-mm>.html landing-pages/onelifetime-world/posts/lifetime-scope-monthly-<yyyy-mm>.html` is empty.
- [ ] Editor's Note between 120–180 words.
- [ ] Agentic Lens is exactly 80 words ±5.
- [ ] LinkedIn block has zero `<`, `>`, backticks, or `[text](url)` markdown.
- [ ] All URLs in LinkedIn block start with `https://`.
- [ ] No fabricated metrics in Agentic Lens.

## When NOT to use

- **For any non-LSJ newsletter** — this is Lifetime Scope Monthly only.
- **Without editorial review** — always pause before the commit step to let the Editor in Chief (Risto) approve the Best Entry pick and the Editor's Note.
- **On a month with < 3 published posts** — tell the user and stop. Monthly issue needs 1 best + 3 runners-up (minimum 4 posts).
- **When no real outcome aggregate exists** — the Agentic Lens must say "No verified outcomes this month" rather than invent a number. If that is unacceptable, delay the issue.

## Related

- Strategy: `docs/field-notes/2026-04-19-lifetime-scope-journal-media-layer-strategy.md`
- Blog standard: `docs/BLOG_STANDARD.md`
- Homepage + blog hero CTA: `onelifetime.world/index.html`, `onelifetime.world/blog/index.html`
- Copy-Paste Output Rule + Social Media Output Rule: `CLAUDE.md`
