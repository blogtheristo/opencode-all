# PR #2044: DWS10 i18n 25-Industry Dictionary

**PR Link:** https://github.com/blogtheristo/dws6/pull/2044  
**Merge Date:** 2026-09-17  
**Status:** Merged  

## Summary

Expanded the DWS internationalization (i18n) dictionary to cover 25 industries, enabling multi-language product catalog support across 5 languages (EN/FI/SV/DE/FR).

## Key Work

- **Dictionary Expansion:** Added 25-industry DWS terminology dictionary for i18n reference
- **Construction Validation:** Construction industry case used to test dictionary completeness
- **Language Support:** EN/FI/SV/DE/FR multi-language routing infrastructure
- **Product Integration:** Dictionary feeds product pages and marketing copy localization

## Technical Details

- Handoff notes: `docs/handoffs/087-live-1.0.5.md`
- Related skill: `kb/raw/articles/` (this entry)
- KYA integration: kya-jev v0.5+ advisory routing
- Code version: 1.0.5 per DWS_DOCUMENT_STANDARD §19

## Impact

- Enables consistent terminology across 25 industries in 5 languages
- Reduces manual translation work via dictionary-driven localization
- Foundation for multi-language sales outreach (see PR #2038)

## Related PRs

- PR #2027: 5-language product pages (depends on this dictionary)
- PR #2038: TED construction leads (uses i18n dictionary for lead descriptions)
