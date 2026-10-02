# Handoff: Aegis product pages to price list 1.34

**Branch:** opencode/aegis-pages-price-list-134  
**Status:** COMPLETE  
**Date:** 2026-10-01

## Task Summary

Bring Aegis product pages in line with catalogue 1.34 (dws10.com/config/products.json priceHistory[0]).

## Changes Made

### 1. Availability Date Updates
- Replaced all 'September 2026' mentions with: 'Release candidate 2026 · general availability Q1 2027, after the first pilot acceptance record'
- Affected files: aegis.html, dws-aegis-001.html, dws-aegis-sub-001.html, dws-aegis-pilot-001.html (EN and all i18n siblings)

### 2. Product Name Updates
- Changed 'DWS IQ Aegis' to 'DWS IQ 7 Aegis' in title/h1/JSON-LD name
- Changed 'DWS IQ Aegis Pilot' to 'DWS IQ 7 Aegis Pilot' on pilot page
- Left body references to 'Aegis' unchanged

### 3. Pilot Page Updates
- Added 'What the pilot reports' block with D7 acceptance numbers:
  - Decision-path coverage (primary)
  - Operator time per decision (secondary)
  - Energy EUR recorded as outcome (never promised)
  - Operator approval as signed decision event
  - Agent steps in NVIDIA OpenShell sandbox

### 4. Files Modified
- dws10.com/products/aegis.html
- dws10.com/products/dws-aegis-001.html
- dws10.com/products/dws-aegis-sub-001.html
- dws10.com/products/dws-aegis-pilot-001.html
- All i18n siblings (.fi, .sv, .de, .fr)
- landing-pages/dws10-com/products/ mirrors

### 5. Commit
- Commit: d643c1ef3
- Pushed: opencode/aegis-pages-price-list-134 to origin

## Validation Results

All checks passed:
- No September 2026 on EN Aegis pages ✓
- GA Q1 2027 stated ✓
- DWS IQ 7 naming ✓
- Pilot reports D7 numbers ✓
- i18n siblings and mirrors current ✓
- Publication validator OK ✓
