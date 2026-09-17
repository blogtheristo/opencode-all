# Handoff: Full 5-Language Coverage for Aegis Product Pages

**Branch:** `feat/aegis-5lang-translation` (create from main, rebase if #2012 merges first)  
**Date saved:** 2026-09-13  
**Status:** Planning complete, ready for implementation  
**Next step:** Execute the 7-step plan in `.claude/plans/lazy-roaming-church.md`

## Quick Summary

Translate `dws10.com/products/aegis.html` + 3 SKU detail pages (`dws-aegis-001.html`, `dws-aegis-pilot-001.html`, `dws-aegis-impl-001.html`) into full FI/SV/DE/FR coverage using the established site pattern (separate full HTML files per language, matching `claude-code-coaching-*.html` naming). Create the missing `docs/localization/aegis-glossary.json` as the terminology foundation, cross-checked against existing `/aegis/index.{fi,sv,de,fr}.html` and `DWS_TRUTH_STANDARD.md` locked claims. Fix 2 broken `detailsUrl` values in `products.json` (same area). Mirror everything into `landing-pages/dws10-com/` per dual-folder rule. 16 new files + 2 JSON fixes + 4 EN source updates (hreflang + language-row links).

## Key Files

- **Source EN pages** (get hreflang + language-row updates): `dws10.com/products/aegis.html`, `dws-aegis-001.html`, `dws-aegis-pilot-001.html`, `dws-aegis-impl-001.html`
- **New translated files** (16 total): `aegis-{fi,sv,de,fr}.html`, `dws-aegis-001-{fi,sv,de,fr}.html`, `dws-aegis-pilot-001-{fi,sv,de,fr}.html`, `dws-aegis-impl-001-{fi,sv,de,fr}.html`
- **Terminology dictionary** (create): `docs/localization/aegis-glossary.json` (EN/FI/SV/DE/FR terms)
- **Bug fix**: `dws10.com/config/products.json` — correct 2 `detailsUrl` entries + mirror to `landing-pages/`
- **Dual-folder mirror**: all touched files also go into `landing-pages/dws10-com/products/` and `landing-pages/dws10-com/config/`

## Terminology Reference

- **Existing multi-language precedent**: `/aegis/index.{fi,sv,de,fr}.html` (approved DWS sovereign/defence wording)
- **English locked claims**: `DWS_TRUTH_STANDARD.md` (e.g., Aegis tiers: Standard/Defence/Sovereign, "21 EU-regulated industries", EDIP Article 9 eligibility)
- **KYA glossary** (FI only, not for reuse here): `docs/blog-drafts/kya-s1-sanasto-glossary.fi.md`
- **Glossary structure**: JSON object, one top-level key per term (e.g. `{"sovereign": {en: "Sovereign", fi: "Suvereeni", sv: "Souverän", de: "Souverän", fr: "Souverain"}, ...}`)

## Pattern to Follow

Each translated file:

1. `<html lang="xx">` with correct locale
2. Fully translated `<title>`, `meta[name=description]`, keywords, OG + Twitter tags
3. `<link rel="canonical">` pointing to itself + full `hreflang` set (en/fi/sv/de/fr + x-default) — copy exact pattern from `/aegis/index.html`
4. All body content translated: headings, tables, badges, CTAs, bullets, ecosystem block, 25-industry grid
5. Flag-emoji language row (`🇫🇮/🇸🇪/🇩🇪/🇫🇷/🇬🇧`) near footer, matching coaching-page pattern

## Execution Checklist

- [ ] Step 1: Create `docs/localization/aegis-glossary.json` (seed from `/aegis/index.{fi,sv,de,fr}.html` + DWS_TRUTH_STANDARD.md)
- [ ] Step 2: Translate `aegis.html` → `aegis-{fi,sv,de,fr}.html` (use glossary, include hreflang + language-row)
- [ ] Step 3: Translate the 3 SKU pages the same way
- [ ] Step 4: Update 4 EN originals (add hreflang + language-row)
- [ ] Step 5: Fix `products.json` detailsUrl bug (2 lines)
- [ ] Step 6: Mirror all files into `landing-pages/dws10-com/`
- [ ] Step 7: Commit + push to branch + open PR (do NOT auto-merge)

## Coordination Notes

- PR #2012 (GitHub Copilot, security fixes) is in flight — low collision risk, but rebase `main` before PR and re-check after #2012 lands
- Dual-folder rule: `diff -rq dws10.com/ landing-pages/dws10-com/` on touched files must show zero diffs
- Verification: hreflang links work, language-row links all 4 languages + English, glossary terms identical across all files per page, JSON valid

## Next Step

Run the 7-step execution plan from `.claude/plans/lazy-roaming-church.md`.
