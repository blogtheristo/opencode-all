# Dictionary, ontology and SEO tags from one vocabulary — 2026-09-23

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/blog-drafts-review | Date: 23.09.2026 | Changes: Initial note — KYA-S1 terms into the dictionary, ONTOLOGY §4.1 LWM layers, dictionary-driven SEO tags, copied JSON-LD headlines fixed, whitepaper and blog-draft corrections, master's §10.34.

Document Status:

- Created: 23.09.2026
- Last Modified: 23.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-23
- **Author:** Claude Code, on behalf of Lifetime Oy
- **Location:** DWS6 repository, cloud session
- **Context:** HIC requests 23.09.2026: check dictionary and ontology for blog terms; SEO tags; KB and thesis if needed; check whitepapers; review blog drafts for publication.

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > Industrial AI governance; Web products for SMEs
- **Entities:** KYA-S1, Lifetime World Model (LWM), DWS IQ, Lifetime Oy
- **Systems:** `scripts/i18n/generate-dws-dictionary.cjs`, `scripts/blog/seo-tags.mjs`, `ONTOLOGY.md` §4.1 / §16.6
- **Temporal Context:** 2026-Q3
- **Confidence:** High for repository facts; no traffic or ranking outcome is claimed.

## The Story

1. **Dictionary.** The generator gained the HIC-approved five-language KYA-S1 table (21 terms), LWM (two layers), Skilled Agent, process-model terms and the three domain taglines. Regenerating first showed that 13 keys existed only in the hand-edited JSON. They were ported into the generator unchanged; otherwise they would have been lost.
2. **Ontology v1.8.** §4.1 names the two LWM layers: model base (TRUTH line 20) and state register and memory (IDV/TRS/PRV, KYA-S1 part 9). This resolves the term conflict that was blocking the LWM blog draft.
3. **SEO tags.** `scripts/blog/seo-tags.mjs` writes `keywords`, `article:tag` and JSON-LD `keywords` from the terms a post actually uses, in its language. 162 of 191 post files were tagged.
4. **Copied JSON-LD.** 36 post files carried the headline and description of "KYA-S1 — One Signed Page". Each now has its own `<h1>` and meta description.
5. **KYA Finnish term.** The dictionary said "Tiedä agenttisi" (used on no page). It now says "Tunne agenttisi" (series title, 19 pages).
6. **Whitepapers.** All seven are in English. Three new v1.1 files were made; each v1.0 is kept:
   - Sovereign Industrial Intelligence: DWS IQ 6 is €4,999 one-time, not /yr.
   - KYA IDV-CERT and Shufti: "KYA Standard" becomes "KYA Specification" (TRUTH row 35), and the company location Helsinki becomes Espoo.
7. **Blog drafts.**
   - sovereign-cloud: hardware prices corrected to products.json, and "zero CLOUD Act exposure" reworded.
   - hic-hallintamalli: the Article 14 wording was corrected.
   - Of the 16 files listed as unpublished, 10 texts are truly unpublished. They are in one approval Artifact.
8. **Thesis.**
   - Master's EN/FI: new §10.34.
   - PhD EN/FI: lockstep-only bump to 4.12.
   - `Learn/` HTML generated.

## The Insight

One controlled vocabulary now drives translations, ontology terms and search tags. A term changes in one place. The two defects (lost hand edits, copied structured data) share one cause: generated or templated output was edited by hand and never compared again.

## HIC Learning Outcome — Six Steps

| #   | Step                  | Status                                                                                                                                                                |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | KB update             | Raw source added: `kb/raw/articles/2026-09-23-dictionary-seo-tags.md`. Compile N/A: `dws kb compile` needs the KB API and DGX, which this cloud session cannot reach. |
| 2   | Field note            | This file                                                                                                                                                             |
| 3   | HTML to `Learn/`      | Thesis v4.12 HTML generated. This note: N/A. `scripts/render-doc.sh` renders on DGX over SSH, which is not reachable from this cloud session.                         |
| 4   | Drive export          | N/A. No Drive write was requested, and the repo is the source of truth.                                                                                               |
| 5   | HIC decision question | Asked in chat, synchronous: which lever from `context/2026-09-23-seo-terms-to-sales.md` §3 to build next.                                                             |
| 6   | Calendar              | N/A. No dated commitments were made.                                                                                                                                  |

## Next Steps

- HIC approves blog drafts by number, then publish per `docs/BLOG_STANDARD.md` and run `seo-tags.mjs --write`.
- ThinkingBox (5 languages) exists only in `landing-pages/onelifetime-world/posts/`, not in the root folder. Confirm which folder is served before relying on it.
- Add Product/Offer JSON-LD to the two web-product pages after PR #2085 and the price-injection decision.
- Changed and flagged (Rule 7): `docs/localization/aegis-glossary.json` `kya.fi` is now "Tunne agenttisi" (was "Tiedä agenttisi"). The Aegis page build reads it on its next run; no HTML page contained the old form.
