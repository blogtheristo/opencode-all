---
name: multilingual
version: "1.0"
date: "2026-04-17"
description: "Use when adding or auditing EU language bars, hero translations, or FI/SV/DE/FR content for DWS pages."
---

Add or audit EU multilingual content — vertical language bar, hero translations, product card strips.

Usage: `/multilingual <page-or-scope>`

Input: $ARGUMENTS (page path, site name, or "audit")

## Offering Strength

DWS speaks 5 EU languages natively — competitive differentiator no Nordic SaaS competitor matches.

| Site | Languages | Bar file |
|------|-----------|----------|
| dws10.com | FI · SV · DE · FR · EN | `/shared-assets/vertical-lang-bar.js` |
| onelifetime.world | FI · SV · EN | `/shared-assets/olw-vertical-lang-bar.js` |

Architecture: vertical rows with language name left, native hero text centre, country flag **right**.
PAGE ELEMENT — never inside ironclad-nav or any menu/nav component.

## Steps

1. **Identify scope** from `$ARGUMENTS` — single page, site-wide, or "audit"
2. **If audit**: read each language page H1 (`/fi/`, `/sv/`, `/de/`, `/fr/`) and compare against
   `LANGS[].home` in `vertical-lang-bar.js` — flag any mismatch
3. **If adding to a page**:
   - dws10.com pages: `<script src="/shared-assets/vertical-lang-bar.js"></script>`
   - onelifetime.world pages: `<script src="/shared-assets/olw-vertical-lang-bar.js"></script>`
   - Store pages already have `<meta name="dws-lang-stay" content="true">` — bar stays in-place, no redirect
4. **If adding a new language** (e.g. adding DE to OLW): add entry to `LANGS` in the relevant bar JS,
   create the language subdirectory page, add `hreflang` links
5. **For product cards** — `window.dwsVlbCardHTML()` must be called in `createProductCard()` in `buy/index.html`
6. **Dual-folder sync** — always update root folder AND `landing-pages/` mirror in the same commit

## Current Hero Texts (dws10.com — `home` context)

| Code | Name | Hero text |
|------|------|-----------|
| fi | Suomi 🇫🇮 | Pohjoismainen teollisuus-AI. Rakennettu Suomessa, Pohjoismaille. |
| sv | Svenska 🇸🇪 | Nordisk industri-AI. Byggd i Finland, för Norden. |
| de | Deutsch 🇩🇪 | Gestalte, wie Europas Industrial IQ Compliance-Schwungrad sich dreht. |
| fr | Français 🇫🇷 | Façonnez la dynamique du volant d'inertie Industrial IQ Compliance en Europe. |
| en | English 🇬🇧 | Nordic Industrial AI. Built in Finland, for the Nordics. |

## Current Hero Texts (onelifetime.world)

| Code | Name | Hero text |
|------|------|-----------|
| fi | Suomi 🇫🇮 | Siirry nopeammin vanhoista toiminnoista älykkääseen päätöksentekoon. |
| sv | Svenska 🇸🇪 | Gå snabbare från äldre processer till intelligent beslutsfattande. |
| en | English 🇬🇧 | Move faster from legacy operations to intelligent decisioning. |

## When NOT to use

- Full page body translation → translate the relevant language page `/fi/` `/sv/` etc. directly
- Language redirects (already handled by bar click handler automatically)
- Store locale/VAT switching → `/shared-assets/vat-locale.js` handles that separately
