# LSJ Content Audit — Internal Quality Signal (2026-07-29)

Source: full audit of the 115 published posts under `onelifetime.world/posts/**`, run in
Claude Code session `claude/blogi-linkit-kohteet-f1j1cm` on 2026-07-29. Triggered by the
HIC asking why the LSJ blog link was missing from the dws10.com menu.

Canonical record: `docs/audits/2026-07-29-blog-content-audit.md`.
Session record: `docs/field-notes/2026-07-29-session-learning-outcome.md`.

This is an **internal quality signal about our own published surface**, not external
market intelligence. Treat the counts as point-in-time (pre-fix) measurements.

## What the audit found

| Class                                | Scale           | Root cause                                             |
| ------------------------------------ | --------------- | ------------------------------------------------------ |
| Finnish ä/ö flattened to a/o         | 22 public pages | one generator run in Mar–Apr 2026 lost UTF-8           |
| False regulatory claims              | 4 posts         | Article 12 retention, Article 50 applicability date    |
| Price drift against canon            | 1 post          | Aegis Sovereign quoted €12,999; canon is custom-priced |
| Deprecated agent count               | 15 files        | "18+ AI agents" in the shared CTA block                |
| Author identity inconsistent         | 111 files       | three spellings, incl. `Paarni` without umlauts        |
| Posts absent from sitemap            | 113 of 113      | sitemap generator never covered `/posts/`              |
| Unapproved drafts publicly reachable | 2               | `_DRAFT` files served at their live URL                |

## The transferable lessons

**A word-list lint measures the phrasings someone anticipated, not the claim.**
`scripts/lint-truth-claims.mjs` reported 0 fail / 0 warn across all 115 posts both
before and after the audit. It missed "18+ AI agents" because its deprecated list
contains only `18+ Industry Agents` — the same drift, one word apart. Every finding in
this audit came from reconciling copy against the canonical file named in
`DWS_TRUTH_STANDARD.md`, not from the automated gate. Green lint is not evidence of a
clean surface.

**Non-English surfaces rot unobserved.** The 22 broken Finnish pages had correct English
originals, so every English-first review passed over them for four months. Any locale we
publish needs a check that reads it in its own language.

**A repair pass over natural-language content needs a negative control.** The fix
(`scripts/fix-fi-diacritics.mjs`) validates each of its ~300 rules against corpora that
are _already correct_ — the clean Finnish posts and all the English posts. A rule that
fires there would corrupt correct text, so it is rejected before any file is written.
That inversion is what made an otherwise unreviewable blind rewrite safe. Reusable
pattern for any bulk content transform.

**Claims written into a field note get cited before they get verified.** The
2026-07-26 field note recorded the price list as propagated to five languages; the price
list's own document header said the same. Only English existed. Both were corrected
2026-07-29 — the field note in place, in a dated quote block, per fail-loud.

## Cross-references

- `DWS_TRUTH_STANDARD.md` rows 19 ("agent count"), 21 (moats), 31 (Article 50 labelling)
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` §4 — retention minimums (6 months, Art. 26(6))
- `Store/PRODUCT_AEGIS.md` §tier table — Aegis pricing
- `docs/BLOG_STANDARD.md` §3.3 — the draft gate the two `_DRAFT` files bypassed
