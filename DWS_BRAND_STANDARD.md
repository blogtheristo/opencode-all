# DWS Gamma Brand Standard v1.1

**Effective Date:** February 2026
**Scope:** All DWS landing pages (dws10.com, dws6.com, onelifetime.world, lifetime.fi)
**Maintained by:** DWS Design System Team

This document is the single source of truth for DWS brand standards across all pages and products.
All AI agents (Claude Code, Cursor, Codex), VS Code, and human developers MUST follow these rules.

---

## 1. Store Category Navigation Component

Category tabs for multi-page store navigation.

**CSS Spec:**
```css
.category-nav {
    display: flex;
    justify-content: center;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}
.category-nav::-webkit-scrollbar { display: none; }
.category-btn {
    padding: 14px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(30, 41, 59, 0.7);
    color: #e2e8f0;
}
.category-btn.active {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
```
**Mobile (max-width: 768px):** horizontal scroll, `padding: 12px 18px`, `font-size: 0.875rem`

**Store Categories (4 fixed):**
| Category | Key | Page |
|----------|-----|------|
| Platform & Products | `platform` | buy/ |
| AI & Cloud Consulting | `ai-cloud` | buy/page2/ |
| Expert Advisory & Training | `advisory` | buy/page3/ |
| Digital Services | `digital` | buy/page4/ |

---

## 2. Dark Theme Variant Tokens

All DWS pages use dark theme by default.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f172a` | Page background |
| `--bg-surface` | `rgba(30, 41, 59, 0.7)` | Cards, panels |
| `--bg-nav` | `#1e293b` | Navigation, footer |
| `--border-subtle` | `rgba(255,255,255,0.1)` | Card borders |
| `--border-nav` | `#334155` | Nav borders |
| `--text-primary` | `#e2e8f0` | Body text |
| `--text-secondary` | `#94a3b8` | Muted text |
| `--text-accent` | `#60a5fa` | Links, brand accents |
| `--text-success` | `#4ade80` | Prices, positive |
| `--text-danger` | `#f87171` | Warnings, urgency |
| `--gradient-primary` | `linear-gradient(135deg, #2563eb, #1d4ed8)` | Primary buttons, active states |
| `--gradient-featured` | `linear-gradient(135deg, #f59e0b, #d97706)` | Featured badges |
| `--shadow-hover` | `0 15px 30px rgba(0,0,0,0.4)` | Card hover |
| `--color-jitsi` | `#oea5e9` | Video meeting accents |
| `--color-email` | `#8b5cf6` | Email feature accents |

---

## 3. Product Card Component

Standard product card for store pages.

**Structure:**
```html
<div class="product-card [featured] [live-payment]">
    <div class="product-image"></div>
    <div class="product-content">
        <h3 class="product-title">Title</h3>
        <div class="product-price">Price</div>
        <div class="product-price-note">per month / one-time</div>
        <p class="product-excerpt">Description</p>
        <div class="btn-group">
            <a class="btn btn-primary">Buy Now</a>
            <a class="btn btn-secondary">Details</a>
        </div>
    </div>
</div>
```

**Badges:**
- `.featured::before` — "MOST POPULAR" gold badge (top-right)
- `.live-payment::after` — "LIVE" green badge (top-left)

**Grid:** `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;`
**Mobile:** Single column `grid-template-columns: 1fr`

---

## 4. Store Category Taxonomy

Products in `config/products.json` MUST have a `storeCategory` field.

**Valid values:**
- `platform` — DWS IQ, Firehorse modules, core platform products
- `ai-cloud` — AI consulting, cloud migration, sovereignty services
- `advisory` — Expert advisory, training, consulting packages
- `digital` — Web development, email, data services, business tools
- `communication` — Video conferencing, email, collaboration (Firehorse V3)

**Adding new products:** Add to `config/products.json` with `storeCategory` field. Featured products set `featured: true`.

### Firehorse Product Family (Store Listing)

| Product | Price | storeCategory | Badge | Store |
|---------|-------|---------------|-------|-------|
| **Firehorse V3 SME** | €9.99/mo | `communication` | `.live-payment` | dws6.com |
| **Firehorse V3 Professional** | €19.99/mo | `communication` | `.featured` | dws6.com |
| **Firehorse V2 Per-Audit** | €15,000 | `platform` | — | dws10.com |
| **Firehorse V2 Subscription** | €25,000/yr | `platform` | — | dws10.com |
| **Firehorse V2 Enterprise** | €250,000/yr | `platform` | `.featured` | dws10.com |

---

## 5. Mobile Hamburger Menu (Single Source of Truth)

**CRITICAL: Only ONE version of the hamburger menu exists.**

**File:** `shared-assets/nav/hamburger-menu.js`

**Usage:** Add this single script tag to any page with `.nav-header` + `.nav-links`:
```html
<script src="/shared-assets/nav/hamburger-menu.js"></script>
```

The script auto-injects:
- Hamburger button (3 bars, animated X on toggle)
- Mobile CSS (slide-down full-width menu)
- Toggle JS with ARIA accessibility
- Outside-click-to-close behavior

**DO NOT duplicate hamburger CSS or JS inline in pages.**
**DO NOT create alternative hamburger implementations.**

**Specs:**
- Breakpoint: `768px`
- Touch target: `48px x 48px` minimum (WCAG 2.2 AAA)
- Bar color: `#e2e8f0`
- Menu background: `#1e293b`
- Menu shadow: `0 8px 16px rgba(0,0,0,0.3)`
- Animation: 0.3s ease CSS transforms (rotate bars to X)
- ARIA: `aria-label="Toggle navigation menu"`, `aria-expanded` toggled

**Requires:** Page must have elements with classes `.nav-header` and `.nav-links`

---

## 6. Sovereignty Badge System

For products and pages related to EU data sovereignty compliance.

**Badge types:**
| Badge | Color | Usage |
|-------|-------|-------|
| EU Data Residency | `#10b981` (green) | Data stays in EU |
| GAIA-X Aligned | `#2563eb` (blue) | GAIA-X Level 3 compliant |
| NIS2 Ready | `#8b5cf6` (purple) | NIS2 Directive compliant |
| EU AI Act | `#f59e0b` (amber) | EU AI Act Article 12 compliant |
| CLOUD Act Free | `#ef4444` (red accent) | No US CLOUD Act exposure |

---

## Shared Navigation Assets

| File | Purpose | Pages |
|------|---------|-------|
| `shared-assets/nav/ironclad-nav.js` | Full Gamma navigation bar | Product pages, content pages |
| `shared-assets/nav/hamburger-menu.js` | Mobile hamburger toggle | Store pages (buy/) |

---

## File Locations

This standard applies to these sites with dual folder rule:

| Site | Source | Production |
|------|--------|------------|
| dws10.com | `dws10.com/` | `landing-pages/dws10-com/` |
| dws6.com | `dws6.com/` | `landing-pages/dws6-com/` |
| onelifetime.world | `onelifetime.world/` | `landing-pages/onelifetime-world/` |

**Always update BOTH locations when making changes.**
