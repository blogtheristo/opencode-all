# PR #2027: Product i18n — 5-Language Pages

**PR Link:** https://github.com/blogtheristo/dws6/pull/2027  
**Merge Date:** 2026-09-17  
**Status:** Merged  

## Summary

Deployed multi-language product pages for dws10.com across 5 languages (EN/FI/SV/DE/FR), implementing a scalable i18n architecture for product catalog and marketing content.

## Key Work

- **Product Page Localization:** Generated product detail pages for all SKUs in 5 languages
- **Language Routing:** Implemented language detection and URL routing (`.en.html`, `.fi.html`, etc.)
- **Content Parity:** Maintained feature/benefit parity across all 5 language variants
- **Product Coverage:** THEMIS, AC365-T3, and additional SKUs localized

## Technical Details

- File structure: `dws10.com/products/PRODUCT-*.{en,fi,sv,de,fr}.html`
- Dual-folder sync: Root `dws10.com/products/` mirrored to `landing-pages/dws10-com/products/`
- Dictionary source: PR #2044 i18n dictionary
- Landing pages: Deployed to production static sites

## Impact

- Direct market reach expansion to Sweden, Germany, France
- Reduced friction for non-English users in buyer journey
- Enables localized sales outreach (see PR #2038)
- Sets standard for all future product/marketing content

## Related PRs

- PR #2044: Dictionary source (prerequisite)
- PR #2038: TED leads use localized product descriptions

## Compliance

- DWS_DOCUMENT_STANDARD: Landing-pages dual-folder sync per Non-Negotiable Rule 5
- Article 50 marking: AI-drafted content carries EU AI marking (see DWS_BLOG_STANDARD §3)
