# DWS Language Standard

## VERSION AND AGENT HISTORY

Version: 1.0
Date: 2026-09-13
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active

## 1. Purpose

This document establishes the canonical language and translation standards for all DWS IQ content, including products, blogs, pages, and documentation. It defines the infrastructure and processes for five-language publishing consistent with the DWS truth standards.

## 2. Core Principles

### 2.1 Translation as Data (Option B - JSON-based)
- Translation is data, not markup manipulation
- Human translators receive JSON arrays of text nodes in document order
- Translators never see HTML and cannot break the structure
- The builder reassembles the content deterministically from translated strings
- All translations must have the same string count as the master or the build fails loudly

### 2.2 Five-Language Publishing Pattern
- Single source of truth: English version (master)
- Translations generated from structured JSON data
- All language versions built from the same infrastructure
- Consistent handling of metadata (og:title, twitter:title, descriptions, etc.)

## 3. Translation Infrastructure

### 3.1 JSON-based Translation Files
Create JSON files with the following structure:
```json
{
  "version": "1.0",
  "language": "fi",
  "source": "en",
  "strings": [
    "Main heading text",
    "Paragraph content text",
    "Button text",
    "Meta title",
    "Meta description"
  ],
  "metadata": {
    "og:title": "Translated og:title",
    "twitter:title": "Translated twitter:title",
    "description": "Translated description",
    "og:description": "Translated og:description"
  }
}
```

### 3.2 Generic Translation Pipeline
The translation pipeline works with any product, blog, or page using:
- `scripts/i18n/build-i18n-pages.cjs` - Main builder script
- `docs/localization/aegis-glossary.json` - Terminology dictionary (reusable across all content)
- `scripts/i18n/<product>/en-strings.json` - Product-specific English strings
- `scripts/i18n/<product>/<lang>-strings.json` - Language-specific translations

### 3.3 Language Bar and Menu Integration
All translated content must integrate with:
- `onelifetime.world/blog` language bar (vertical language switching)
- `lifetime.fi` navigation menu bar (cross-reference handling)
- Consistent language switching behavior across all domains
- DWS-IQ platform-wide language consistency

## 4. Implementation Process

### 4.1 For New Products
1. Create `scripts/i18n/<product>/en-strings.json` with all English text content
2. Create `docs/localization/<product>-glossary.json` with terminology terms
3. Use the generic build script to generate 4 language versions with hreflang tags and language footer rows
4. Update the English original with hreflang links
5. Ensure language bar integration with `onelifetime.world/blog` and `lifetime.fi` navigation

### 4.2 For Existing Content
1. Extract all text content to JSON strings
2. Add metadata to `meta.json` file 
3. Create translation files for each target language
4. Update existing content with hreflang links
5. Verify language bar integration with cross-referenced domains

## 5. Glossary Management

### 5.1 Term Structure
Terms follow this structure:
```json
{
  "term_key": {
    "en": "English term",
    "fi": "Finnish translation",
    "sv": "Swedish translation",
    "de": "German translation", 
    "fr": "French translation"
  }
}
```

### 5.2 Reusability
The glossary system is designed to be reusable across all 109 products, blogs, and pages:
- Terms are stored in `docs/localization/<product>-glossary.json`
- Common terms are shared across products
- Version control ensures consistent terminology
- Translation tools can work with the structured data

## 6. Quality Assurance

### 6.1 Build Validation
- String count validation: translation must match master exactly
- Metadata validation: all required meta fields present
- HTML structure validation: no broken links or malformed markup
- Content consistency: translations maintain message integrity

### 6.2 Machine Translation Guidelines
- Use machine translation for content that has been reviewed for regulatory terms
- Human review not required for standard product copy
- Native speaker and legal review required for blog posts, marketing copy, and regulatory documents
- All machine-translated content must display appropriate AI disclosure when required (EU AI Act Article 50)

## 7. Compliance Requirements

### 7.1 EU AI Act Compliance
- Apply Article 50 obligations to all machine-translated content
- Display AI-generated content labels on public surfaces
- EU Icons are optional but labeling is mandatory
- No single language version should be treated as more authoritative than the others

### 7.2 Data Sovereignty
- All language versions must be generated from the same source
- Consistent handling of sensitive material in all languages
- Metadata and structure consistency across language versions

## 8. Future Expansion

This infrastructure is designed to scale to all 109 products, blogs, and pages:
- Same JSON pattern applies to all content types
- Batch build scripts for processing multiple products
- Automation for generating entire language sets
- Extensible to additional languages as needed

## 9. Maintenance

### 9.1 Glossary Updates
- Update `docs/localization/<product>-glossary.json` with new terms as they emerge
- Maintain version control for all glossary files
- Ensure consistency across all language versions

### 9.2 Translation Updates
- Regular review of translation quality and consistency
- Updates to terminology databases as needed
- Automated testing for consistency and accuracy

## 10. References

- DWS_TRUTH_STANDARD.md - Canonical source for product terms and definitions
- CLAUDE.md - Operational rules for AI agents and implementation
- DWS_DOCUMENT_STANDARD.md - Documentation formatting standards
- DWS_DEPLOYMENT_STANDARD.md - Deployment and publishing standards

---
Document Status:
- Created: 2026-09-13
- Last Modified: 2026-09-13
- Language: English
- Publication Status: ACTIVE
- Document Type: Standard / Implementation Guidelines