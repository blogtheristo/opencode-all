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

**Adding new products:** Add to `config/products.json` with `storeCategory` field. Featured products set `featured: true`.

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

---

## 7. Product Pricing Clarity (Two-Number Rule)

**Authority:** `DWS_PRODUCT_STANDARD.md` is the single source of truth for all pricing.

### 7.1 Every Product Card Must Show Two Numbers

```
Buy now:  €XX,XXX    ← total upfront commitment
Monthly:  €X,XXX/mo  ← ongoing cost (if applicable)
```

If no monthly component, show only the buy-now price. Never show "Contact us for pricing."

### 7.2 Price Display Tokens

| Token | CSS | Usage |
|-------|-----|-------|
| `.product-price` | `color: var(--text-success); font-size: 1.5rem; font-weight: 700` | Primary price |
| `.product-price-note` | `color: var(--text-secondary); font-size: 0.875rem` | "per month" / "one-time" clarifier |
| `.product-price-total` | `color: var(--text-primary); font-size: 1rem` | Total commitment (e.g., "€29,950 total") |

### 7.3 Product Card Price Layout

```html
<div class="product-pricing">
    <div class="product-price">€5,990/mo</div>
    <div class="product-price-total">€29,950 total (5 months)</div>
    <div class="product-price-note">VAT 0% · Full platform included</div>
</div>
```

### 7.4 Enterprise Tier Cards

Enterprise subscription tiers (Pilot, Alpha, Production) use a distinct card variant:

```html
<div class="product-card tier-card">
    <div class="tier-badge">PILOT</div>
    <div class="product-pricing">
        <div class="product-price">€5,990<span class="price-period">/mo</span></div>
        <div class="product-price-total">€29,950 total · 5 months</div>
    </div>
    <ul class="tier-includes">
        <li>DWS IQ 6 Platform</li>
        <li>Firehorse Suite (all modules)</li>
        <li>Lifetime World Model</li>
        <li>Onboarding workshop included</li>
    </ul>
    <div class="tier-not-included">
        <small>Not included: hardware, customer cloud costs</small>
    </div>
    <a class="btn btn-primary btn-block">Start Pilot</a>
</div>
```

**Tier card CSS:**
```css
.tier-card { border: 2px solid var(--border-subtle); }
.tier-card:hover { border-color: var(--text-accent); }
.tier-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.tier-badge.pilot { background: var(--gradient-primary); color: white; }
.tier-badge.alpha { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
.tier-badge.production { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.price-period { font-size: 0.875rem; font-weight: 400; color: var(--text-secondary); }
.btn-block { width: 100%; text-align: center; margin-top: 16px; }
```

### 7.5 Intelligent Decision Helper

Pricing pages with 3+ tiers MUST include a decision helper:

```html
<div class="tier-selector">
    <h3>Which tier is right for you?</h3>
    <div class="selector-question">
        <label>Buildings in your portfolio:</label>
        <select id="building-count">
            <option value="1-5">1-5 buildings</option>
            <option value="6-20">6-20 buildings</option>
            <option value="20+">20+ buildings</option>
        </select>
    </div>
    <div class="selector-result" id="tier-recommendation">
        <!-- JS populates recommendation based on selection -->
    </div>
</div>
```

---

## 8. Cross-Reference to Standards

| Standard | File | What It Governs |
|----------|------|----------------|
| **Brand Standard** | `DWS_BRAND_STANDARD.md` (this file) | UI components, dark tokens, product cards, badges |
| **Product Standard** | `DWS_PRODUCT_STANDARD.md` | Pricing, product taxonomy, catalog rules |
| **Document Standard** | `DWS_DOCUMENT_STANDARD.md` | Document headers, versioning, metadata |
| **Sales Strategy** | `sales-outreach/NORDIC_SALES_STRATEGY.md` | Outreach, metaphors, one-click buy |
| **Security Standard** | `DWS_SECURITY_STANDARD.md` | Security, .env, .gitignore rules |
