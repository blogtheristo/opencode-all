# Field note — Language-aware navigation, a regenerable hero, and what a 12-part series exposed

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-post-1-swb4k4 | Date: 10.08.2026 | Changes: Initial field note — typo correction across 16 published pages, hero image regenerated from a checked-in source at 4K, language-aware prev/next in the nav injector, language bar v1.2, PR #1818.

Document Status:

- Created: 10.08.2026
- Last Modified: 10.08.2026
- Language: English

---

## What happened

The KYA-S1 series went from one published post to sixteen, and publishing at that width broke three things that were invisible at one post per language.

**Prev/next crossed languages.** `scripts/inject-blog-nav.cjs` walked a flat `posts` array, so the English part 1's "next" was the Finnish part 1, whose next was Swedish, then German, then French. A reader following "read next" got the same article five times in five languages before reaching part 2. The injector now derives language from the filename and picks neighbours from the same-language subsequence only.

**The language bar said nothing about the page it was on.** It showed a fixed per-language tagline about the blog in general, and every row looked clickable even where no translation existed — clicking did nothing at all, because the redirect is conditional on an `hreflang` alternate. v1.2 makes the heading the post's own title, dims and disables languages with no alternate (labelled "ei vielä saatavilla / not yet available"), and takes the active language from `<html lang>` rather than a stored preference, so a Finnish post stops highlighting English.

**The hero image was a raster that could not be corrected.** The supplied `Blogisarja.jpg` showed twelve cards for eleven parts — part 8 appeared twice — at 1024×559 against a 3840 px floor. Text was burned into pixels, so no edit was possible without redrawing.

Six typos in the Ground Truth were also corrected, on an explicit HIC ruling, across every draft and published page.

## The insight

**A raster deliverable is a dead end; a rendered one is an edit.** The replacement hero is `scripts/assets/kya-s1-series-hero-fi.html` rendered through `scripts/screenshot.mjs` at width 1280 × scale 3. Adding part 13, fixing a title, or producing EN/SV/DE/FR versions is now a text change and one command, not a redraw and a re-upload. The 4K floor in the PNG Export Rule is satisfied by construction rather than by remembering.

The same shape covers the typos. Correcting them in the drafts alone would have left sixteen published pages wrong, because the HTML was generated once and then edited in place by the injector. The fix had to sweep drafts and published pages together — which is a symptom worth naming: **generated artefacts that are subsequently mutated in place stop being regenerable.** The nav injector mutates published HTML, so those pages cannot simply be rebuilt from their drafts without losing nav. That is a latent cost the next 44 pages will pay.

**Scale is what makes navigation defects visible.** Both nav bugs existed before this series; with one or two translated posts they looked like ordinary adjacency. Eleven parts in one language plus one part in five languages made the flat walk obviously wrong. Nothing detected it — no test asserts that a post's neighbours share its language.

## What shipped

- Six Ground Truth typos corrected across all drafts and 16 published pages, plus stale `/11` part counts now the series has 12 parts.
- `static/images/blog/kya-s1-series-01-hero-fi.png` — 3840×2001, twelve distinct cards, generated from a checked-in HTML source. Superseded images renamed `_OLD` per Rule 6.
- `scripts/inject-blog-nav.cjs` — `langOf()` and `neighbours()`; prev/next stays within one language, and the console log reports the same neighbours the page receives.
- `olw-vertical-lang-bar.js` v1.1 → v1.2, mirrored to `landing-pages/`.
- PR [#1818](https://github.com/blogtheristo/dws6/pull/1818) opened covering the whole series arc.

## What is still open

- **44 translation pages** — parts 2–12 × EN/SV/DE/FR. The language bar now labels these honestly instead of hiding the gap.
- **The wallet / IDV-4 question is still unanswered.** Whether wallet-anchored IDV can meet IDV-4's 60-second revocation at KYA-AL3 is a specification question, not an editorial one, and the approved part 11 does not mention it.
- **A hook false positive worth fixing.** `session-stop.sh` flags `kya-kyc-seven-questions.fi.html` and `kya-s1-sanasto-glossary.fi.html` as published without a draft. Both drafts exist as `<slug>.fi.md`; the hook looks for `<slug>.md` and does not strip the language suffix. The other eight flagged posts are pre-existing and genuinely undrafted — those are real.
- **No test covers the neighbour invariant.** A post's prev/next should share its language; nothing asserts it, so the next injector edit can silently reintroduce the bug.

## Next steps

1. Translate and publish parts 2–12 in EN, then SV, DE, FR, in batches.
2. Fix the `session-stop.sh` language-suffix match so real Rule 13 violations are not buried in false positives.
3. Decide the wallet / IDV-4 question at specification level.

## Learning-outcome steps

1. KB update — N/A: no new KB-shaped concept; the canon is in `Legal/KYA_S1.md` and `ONTOLOGY.md` §16, both updated in-session.
2. Field note — this file.
3. `Learn/` HTML — rendered alongside.
4. Drive export — N/A: no Drive tool call made in this session; the repo remains source of truth and the export is outstanding.
5. HIC question — asked in session: whether to subscribe to PR #1818 for CI and review activity.
6. Calendar — N/A: this session produced no dated external commitment.
