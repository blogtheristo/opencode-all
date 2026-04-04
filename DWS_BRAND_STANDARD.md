# DWS Gamma Brand Standard v2.4

***
# VERSION AND AGENT HISTORY

Version: 2.4

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: cursor/initial | Date: 01.01.2026 | Changes: Initial brand standard — store identity, dark tokens, product cards, category nav
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 07.02.2026 | Changes: Gamma edition — Iron Clad nav v3.0, footer, hero, typography, SEO meta, sovereignty badges, A2A, responsive, WCAG 2.2, shared assets registry, page template
  - Version: 2.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Added VERSION AND AGENT HISTORY block to comply with DWS Document Standard
  - Version: 2.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-profile-menu-fFgv8 | Date: 03.03.2026 | Changes: Added Section 18 — Dashboard Profile Menu Standard v1.0 (ProfileMenu, HamburgerMenu, avatar initials, accessibility specs, layout integration)
  - Version: 2.3 | Tool: Claude Code (Opus 4.6) | Session: claude/add-linkedin-social-note-QrRLH | Date: 08.03.2026 | Changes: Added NVIDIA Connect ISV Partner badge to Sovereignty Badge System (§11.1) — colors, usage rules, implementation checklist
  - Version: 2.4 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-qif39 | Date: 08.03.2026 | Changes: Added Section 19 — Onboarding Wizard Standard, Section 20 — Compliance Score Widget Standard, Section 21 — CLI Rich Output Standard

Session Links & References:
  - Claude Code (claude/research-dws-brand-standard-Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_BRAND_STANDARD.md

Document Status:
  - Created: 01.01.2026
  - Last Modified: 08.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Effective Date:** February 2026
**Scope:** All DWS landing pages (dws10.com, dws6.com, onelifetime.world, lifetime.fi)
**Maintained by:** DWS Design System Team

This document is the single source of truth for DWS brand standards across all pages and products.
All AI agents (Claude Code, Cursor, Codex), VS Code, and human developers MUST follow these rules.

---

## Table of Contents

| # | Section | Scope |
|---|---------|-------|
| 0 | Store Identity & Product Data | Store pages |
| 1 | Store Category Navigation | Store buy/ pages |
| 2 | Dark Theme Tokens | All pages |
| 3 | Product Card Component | Store pages |
| 4 | Store Category Taxonomy | products.json |
| 5 | Iron Clad Navigation (v3.0) | **All pages** |
| 6 | Iron Clad Footer (v1.0) | **All pages** |
| 7 | Hero Section Standard | All content pages |
| 8 | Typography & Fonts | All pages |
| 9 | Logo Usage & Assets | All pages |
| 10 | SEO Meta Tags Standard | **All pages** |
| 11 | Sovereignty Badge System | Products & compliance |
| 12 | A2A Agent Integration | Industrial pages |
| 13 | Responsive Breakpoints | All pages |
| 14 | Accessibility (WCAG 2.2) | All pages |
| 15 | Shared Assets Registry | Infrastructure |
| 16 | Page Template | New pages |
| 17 | Climate IQ Pantheon Agent Brand Identity | onelifetime.world agent cards |
| 18 | Dashboard Profile Menu Standard | Logged-in dashboard (v10-react) |
| 19 | Onboarding Wizard Standard | First-run experience (v10-react) |
| 20 | Compliance Score Widget Standard | Dashboard compliance ring (v10-react) |
| 21 | CLI Rich Output Standard | CLI human-readable formatting |
| 22 | Product Pitch Lines | Canonical one-liners (EN/FI) |

---

## 0. Store Identity — Sovereign AI Store

**Competitive Positioning (vs SAP Business AI, IBM watsonx, Palantir AIP):**
- **EU Data Residency** — hosted in Finland, zero CLOUD Act exposure (SAP/IBM/Palantir are US-hosted)
- **AI Agents, Not Dashboards** — autonomous compliance outputs, 90% less manual work than legacy enterprise tools
- **ERP Native** — connects to SAP, IFS, Dynamics 365, Monitor, Visma (not locked to one vendor)
- **EU AI Act Compliant** — Article 12 logging, KYA governance, deterministic scoring built in
- **Enterprise + SME** — serves both segments; SAP/IBM/Palantir are enterprise-only
- On public pages, reference competitors **implicitly** ("Unlike US-hosted platforms..."), not by name

All DWS store pages MUST display the store identity info box above the product grid.

**Component:**
```html
<div class="store-identity">
    <div class="store-identity-icon">🏪</div>
    <div class="store-identity-content">
        <h2 class="store-identity-title">Sovereign AI for Enterprises and SMEs</h2>
        <p class="store-identity-subtitle">EU-sovereign products, compliance tools, and expert services for enterprises and SMEs.</p>
    </div>
    <div class="store-identity-badges">
        <span class="sovereignty-badge eu-data">EU Data Residency</span>
        <span class="sovereignty-badge cloud-act-free">CLOUD Act Free</span>
    </div>
</div>
```

**CSS Spec:**
```css
.store-identity {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px 32px;
    margin-bottom: 32px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(30, 41, 59, 0.7));
    border: 1px solid rgba(37, 99, 235, 0.3);
}
.store-identity-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0;
}
.store-identity-subtitle {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 4px 0 0 0;
}
.store-identity-icon {
    font-size: 2rem;
}
.store-identity-badges {
    display: flex;
    gap: 8px;
    margin-left: auto;
}
```

**Mobile (max-width: 768px):** stack vertically, center-align, hide badges.

**Placement:** Above category navigation on all store pages (buy/, buy/page2/, etc.)

---

## 0.1 Store Product Data Sources

Product data lives in two places. **`products.json` is the single source of truth** for store products.

| Source | Location | Purpose |
|--------|----------|---------|
| **Primary** | `dws10.com/config/products.json` | All ~30 store products (name, price, SKU, category, image, description) |
| **Extended** | `Store/*.md` (Store Product Format) | Detailed product pages with rich markdown content |

**Rule:** `Store/*.md` files use YAML frontmatter (NOT DWS Document Standard). See `product-catalog/README.md` § "Store Product Format" for the required schema.

**Build pipeline:** `scripts/build_store.py` reads `products.json` first, then merges any `Store/*.md` extended descriptions by matching on `sku`.

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

## 5. Iron Clad Navigation v3.0 (Single Source of Truth)

**CRITICAL: Only ONE navigation exists for all dws10.com pages.**

**File:** `shared-assets/nav/ironclad-nav.js`
**Version:** v3.0 (with mobile hamburger menu)

**Usage:** Add to any page:
```html
<script src="/shared-assets/nav/ironclad-nav.js"></script>
```

The script auto-injects a complete `<header>` element at the start of `<body>`:
- **Desktop (>900px):** Horizontal nav bar with hover dropdowns, nested flyout submenus
- **Mobile (≤900px):** Hamburger button → slide-out panel from right, tap-to-expand submenus

**DO NOT create inline navigation on any page.** Use the script.

### Navigation Architecture

| Menu | Contents |
|------|----------|
| **Home ▾** | Main page, Fit for 55, CSRD, Industries (11), Tools (5), Company (6), Designs (4), Legal (12), Compliance (3), Other (7) |
| **Solutions ▾** | Fit for 55 × 8 industries, CSRD × 8 industries |
| **Products ▾** | DWS IQ v6, Bundle, 4× Firehorse modules, Expert services, Consulting, AI Consulting, Sovereignty Cloud, World Model |
| **About ▾** | Lifetime World, Team, Careers, Partners, Investor Relations, Contact, Lifetime Group (3), Designs (3), Legal (11) |
| **IQ Login** | CTA button → dws6.com/login |
| **Icons** | OneLifetime.World logo, Firehorse Store cart |

### Design Specs

| Property | Desktop | Mobile (≤900px) |
|----------|---------|-----------------|
| Background | `#ffffff` | `#ffffff` |
| Position | `sticky; top: 0; z-index: 1000` | Same |
| Logo height | `50px` | `36px` |
| Title | `clamp(0.9rem, 1.5vw, 1.25rem)` | Hidden |
| Hamburger | Hidden | `24px` bars, `#334155`, animated ×-to-bars |
| Panel | N/A | `min(300px, 85vw)`, slide from right |
| Dropdown | Hover, `box-shadow: 0 4px 20px rgba(0,0,0,0.15)` | Tap-to-expand, flush |
| CTA button | `background: linear-gradient(135deg, #0a1628, #152238)` | Same, centered |

### Accessibility

- Hamburger: `aria-label="Open menu"`, `aria-expanded` toggled
- Close button: `aria-label="Close menu"`
- Escape key closes mobile menu
- Backdrop click closes mobile menu
- Body scroll locked while menu is open

---

## 6. Iron Clad Footer v1.0 (Single Source of Truth)

**CRITICAL: Only ONE footer exists for all dws10.com pages.**

**File:** `shared-assets/footer/ironclad-footer.js`
**Version:** v1.0

**Usage:** Add to any page (before `</body>`):
```html
<script src="/shared-assets/footer/ironclad-footer.js"></script>
```

The script auto-injects a `<footer class="ironclad-footer">` at the end of `<body>` and **removes any existing `<footer>` or `<div class="footer">` element** to prevent duplicates.

**DO NOT create inline footers on any page.** Use the script.

### Footer Architecture (5-Column Grid)

| Column | Links |
|--------|-------|
| **Products** | Platform & Products, AI & Cloud Consulting, Expert Advisory, Digital Services, Enterprise Offers (mailto) |
| **Industries** | Construction, Energy, Manufacturing, Real Estate, Logistics, Healthcare, Financial Services, Public Sector |
| **Platform** | Login, Dashboard, DWS IQ 6, DWS IQ Report, Firehorse Automation, Firehorse Omnichannel, Architecture |
| **Compliance** | Fit for 55, CSRD Reporting, EU AI Act, Regulatory Notice, Dual Use, Carbon Calculator |
| **Help & Company** | Lifetime Consulting, Careers, Partners, Investor Relations, Community, Support (mailto), Sales (mailto), Legal Hub |

### Footer Bars

| Bar | Content |
|-----|---------|
| **Payments** | Revolut Business (blue), PayPal Business (navy), SEPA EUR (green), Bank Transfer |
| **Legal** | Website Terms, Privacy Policy, Return Policy, Data Handling, Data Security, Investment Safety, Regulatory Notice |
| **Copyright** | © 2025–2026 Lifetime Oy · VAT FI07724079 · Address · GDPR · DSA · NIS2 · EU AI Act |

### Design Specs

| Property | Desktop | Mobile (≤900px) | Mobile (≤480px) |
|----------|---------|-----------------|-----------------|
| Background | `#1e293b` | Same | Same |
| Grid | `repeat(5, 1fr)` | `repeat(2, 1fr)` | `1fr` |
| Max width | `1200px` centered | Same | Same |
| Heading color | `#e2e8f0` | Same | Same |
| Link color | `#94a3b8` → `#60a5fa` on hover | Same | Same |
| Padding | `48px 20px 32px` | `32px 16px 24px` | `24px 16px 20px` |

### Pages Excluded from Footer

| Page | Reason |
|------|--------|
| `checkout/` | Functional payment flow |
| `dashboard/` | App interface |
| `assistant/` | Chat interface |

---

## 7. Hero Section Standard

Every content/landing page MUST have a hero section as the first visual element after the navigation.

### Standard Hero Structure

```html
<section class="hero">
    <div class="hero-container">
        <div class="hero-badges">
            <span class="sovereignty-badge eu-data">EU Data Residency</span>
            <span class="sovereignty-badge cloud-act-free">CLOUD Act Free</span>
        </div>
        <h1 class="hero-title">Page Title Here</h1>
        <p class="hero-subtitle">One-line description of the page purpose.</p>
        <div class="hero-cta">
            <a href="/buy/" class="btn-primary">Get Started</a>
            <a href="/products/dwsiq.html" class="btn-secondary">Learn More</a>
        </div>
    </div>
</section>
```

### Hero CSS Spec

```css
.hero {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    color: #ffffff;
    padding: 80px 20px;
    text-align: center;
}
.hero-container {
    max-width: 900px;
    margin: 0 auto;
}
.hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.15;
    margin: 16px 0;
    color: #ffffff;
}
.hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: #94a3b8;
    max-width: 700px;
    margin: 0 auto 32px;
    line-height: 1.6;
}
.hero-badges {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.hero-cta {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
}
.btn-primary {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s;
    border: none;
}
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}
.btn-secondary {
    background: transparent;
    color: #60a5fa;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    border: 1px solid rgba(96, 165, 250, 0.3);
    transition: all 0.3s;
}
.btn-secondary:hover {
    background: rgba(96, 165, 250, 0.1);
    border-color: #60a5fa;
}
```

### Hero Variants

| Variant | Usage | Gradient |
|---------|-------|----------|
| **Default (dark)** | Most pages | `#0f172a → #1e293b → #0f172a` |
| **Industry** | Industry pages | `#0f172a → #1a365d → #0f172a` (navy) |
| **Compliance** | Compliance pages | `#0f172a → #1e1b4b → #0f172a` (indigo) |
| **Product** | Product detail pages | `#0f172a → #14532d → #0f172a` (emerald accent) |

---

## 8. Typography & Fonts

### Font Stack

**Primary typeface:** Inter (all weights: 400, 500, 600, 700)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

**Loading method depends on document classification:**

| Classification | Method | Source |
|---------------|--------|--------|
| Public (landing pages, blog, dashboards) | Google Fonts CDN | `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">` |
| Confidential / Sales / Internal | Self-hosted `@font-face` | `docs/assets/fonts/Inter-{Regular,Medium,SemiBold,Bold}.ttf` |

**Why self-host for confidential documents:** Loading from `fonts.googleapis.com` / `fonts.gstatic.com` triggers external network requests when opened, leaking document access to Google. Confidential briefs must work offline and in locked-down enterprise environments.

System font stack (`-apple-system`, `Segoe UI`) serves as fallback when Inter is unavailable.

### Type Scale

| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| `h1` | `clamp(2rem, 4vw, 3rem)` | 800 | `#ffffff` | 1.15 |
| `h2` | `clamp(1.5rem, 3vw, 2.25rem)` | 700 | `#e2e8f0` | 1.2 |
| `h3` | `1.25rem` | 700 | `#e2e8f0` | 1.3 |
| `h4` | `0.75rem` | 700 | `#e2e8f0` | 1.4 |
| Body | `0.875rem – 1rem` | 400 | `#94a3b8` | 1.6 |
| Small | `0.8rem` | 400 | `#64748b` | 1.5 |
| Caption | `0.75rem` | 700 | `#e2e8f0` | 1.4 |

### Text Formatting Rules

- **Headings:** All caps only for `h4` footer column headers and badge labels
- **Body text:** Sentence case
- **Links:** No underline, color change on hover (`#94a3b8` → `#60a5fa`)
- **Prices:** `#4ade80` (green), bold weight
- **Legal text:** `#64748b`, 0.8rem

---

## 9. Logo Usage & Assets

### Primary Logos

| Logo | File | Usage | Min Height |
|------|------|-------|-----------|
| **DWS IQ Platform** | `DWS_IQ2026.png` | Navigation, hero sections | 50px desktop, 36px mobile |
| **OneLifetime.World** | `static/images/OneLifetime_Logo_Final.png` | Nav icon, community links | 32px |
| **Firehorse Store** | `static/images/Firehorse_Store.jpg` | Nav cart icon, store pages | 32px |

### Logo Rules

1. **Never distort or recolor** logos — use original files only
2. **Minimum clear space:** 8px around all logos
3. **Background:** Logos designed for white nav background; for dark backgrounds, ensure contrast
4. **Linking:** DWS IQ logo always links to homepage (`/`), OneLifetime logo links to `https://onelifetime.world`
5. **Alt text:** Always include descriptive alt text (`"DWS IQ Platform"`, `"OneLifetime.World"`)

### Favicon

Pages should reference the DWS IQ logo or a dedicated favicon:
```html
<link rel="icon" type="image/png" href="/DWS_IQ2026.png">
```

---

## 10. SEO Meta Tags Standard (CRITICAL)

**Every page MUST have these meta tags** for Google Search, social sharing, and structured data.

### Required Meta Tags

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Page Title} | DWS IQ Platform</title>
    <meta name="description" content="{50-160 chars describing the page}">
    <meta name="keywords" content="DWS IQ, EU compliance, {page-specific keywords}">
    <meta name="author" content="Lifetime Oy">
    <meta name="robots" content="index, follow">

    <!-- Open Graph (Facebook, LinkedIn) -->
    <meta property="og:title" content="{Page Title} | DWS IQ Platform">
    <meta property="og:description" content="{Same as meta description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dws10.com/{page-path}">
    <meta property="og:image" content="https://dws10.com/static/images/dws-og-image.png">
    <meta property="og:site_name" content="DWS IQ Platform">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{Page Title} | DWS IQ Platform">
    <meta name="twitter:description" content="{Same as meta description}">
    <meta name="twitter:image" content="https://dws10.com/static/images/dws-og-image.png">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://dws10.com/{page-path}">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/DWS_IQ2026.png">

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Lifetime Oy",
        "url": "https://dws10.com",
        "logo": "https://dws10.com/DWS_IQ2026.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@lifetime.fi",
            "contactType": "customer support"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Laidunmaanraitti 2 A 25",
            "addressLocality": "Espoo",
            "postalCode": "02330",
            "addressCountry": "FI"
        },
        "vatID": "FI07724079"
    }
    </script>
</head>
```

### Per-Page Meta Rules

| Page Type | Title Pattern | Description Focus |
|-----------|--------------|-------------------|
| Industry | `{Industry} Solutions \| DWS IQ Platform` | Industry-specific compliance value prop |
| Product | `{Product Name} - {Price} \| DWS IQ Platform` | Product features + price + EU sovereignty |
| Compliance | `{Regulation} Compliance \| DWS IQ Platform` | Regulation scope + how DWS solves it |
| Legal | `{Policy Name} \| DWS IQ Platform` | What the policy covers |
| Store | `Sovereign AI Store - Enterprise Products \| DWS IQ Platform` | Product range + pricing range |

### Keyword Strategy

Every page should include a subset of these core keywords:

- **Brand:** DWS IQ, Firehorse, Lifetime Oy, dws10.com
- **Compliance:** Fit for 55, CSRD, EU ETS, CBAM, EU AI Act, NIS2, GDPR
- **Industry:** Climate compliance, industrial AI, carbon reporting, ESG
- **Geography:** EU, Finland, EU data residency, CLOUD Act free, GAIA-X
- **Products:** AI consulting, compliance automation, carbon calculator, Firehorse reports

---

## 11. Sovereignty Badge System

For products and pages related to EU data sovereignty compliance.

**Badge types:**
| Badge | Color | CSS Class | Usage |
|-------|-------|-----------|-------|
| EU Data Residency | `#10b981` (green) | `.sovereignty-badge.eu-data` | Data stays in EU |
| GAIA-X Aligned | `#2563eb` (blue) | `.sovereignty-badge.gaia-x` | GAIA-X Level 3 compliant |
| NIS2 Ready | `#8b5cf6` (purple) | `.sovereignty-badge.nis2` | NIS2 Directive compliant |
| EU AI Act | `#f59e0b` (amber) | `.sovereignty-badge.eu-ai-act` | EU AI Act Article 12 compliant |
| CLOUD Act Free | `#ef4444` (red accent) | `.sovereignty-badge.cloud-act-free` | No US CLOUD Act exposure |
| NVIDIA Connect ISV Partner | `#76b900` (NVIDIA green) | `.sovereignty-badge.nvidia-isv` | NVIDIA Connect ISV certified |

**Badge CSS:**
```css
.sovereignty-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.sovereignty-badge.eu-data { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
.sovereignty-badge.gaia-x { background: rgba(37, 99, 235, 0.15); color: #60a5fa; border: 1px solid rgba(37, 99, 235, 0.3); }
.sovereignty-badge.nis2 { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }
.sovereignty-badge.eu-ai-act { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
.sovereignty-badge.cloud-act-free { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.sovereignty-badge.nvidia-isv { background: rgba(118, 185, 0, 0.15); color: #76b900; border: 1px solid rgba(118, 185, 0, 0.3); }
```

### 11.1 NVIDIA Connect ISV Partner Badge

**Status:** Confirmed (2026-03-08). Independently verifiable at NVIDIA Partner Locator.

**Colors:** NVIDIA Green `#76b900`, NVIDIA Black `#000000`, Gold accent `#d4a843` (for hero/celebration contexts).

**Usage rules:**
- Display on Lifetime Fleet pages, Optimus V3, and hardware-related product pages
- Hero sections on NVIDIA pages use gold gradient text with NVIDIA black background
- Always link to NVIDIA Partner Locator for independent verification
- Never claim "NVIDIA certified" — correct term is "NVIDIA Connect ISV Partner"

**Implementation checklist (2026-03-08):**
- [x] NVIDIA Connect ISV Partner confirmed (official email)
- [x] Badge added to Optimus V3 hero row
- [x] Stack card added to Fleet index partner grid
- [x] Moat slide upgraded to "Connect ISV Partner"
- [x] Investor page cleaned, no more "(applied)" credits
- [x] Nav updated: Lifetime Fleet submenu with Fleet Overview, Optimus V3, NVIDIA ISV Partner
- [x] Products dropdown: "DWS IQ Report" label, href unchanged
- [x] NVIDIA ISV Partner page live at dws10.com/lifetime-fleet/nvidia-isv/
- [ ] Annex III biometric one-liner in Technical Requirements section on Optimus V3 page

---

## 12. A2A Agent Integration (Industrial Pages)

Industrial pages MUST include a **Google A2A (Agent-to-Agent) connection section** enabling industrial partners to connect their AI agents to DWS IQ for operational collaboration — not just web marketing, but real compliance calculation, Firehorse reporting, and multi-agent workflows.

### A2A Protocol Overview

The [Agent2Agent (A2A) Protocol](https://a2a-protocol.org/) is an open standard (now under the Linux Foundation) created by Google and 50+ partners. It enables autonomous AI agents from different vendors, frameworks, and organizations to communicate and collaborate on tasks.

**Key difference from MCP:** MCP connects agents to tools (structured I/O). A2A connects agents to agents (autonomous reasoning). DWS IQ uses both:
- **MCP** — Internal: DWS IQ agents connect to tools (calculators, databases, ERP connectors)
- **A2A** — External: Partner agents connect to DWS IQ agents (cross-company workflows)

### A2A Core Concepts (Protocol v0.3.0)

| Concept | Description |
|---------|-------------|
| **Agent Card** | JSON metadata at `/.well-known/agent.json` — describes agent identity, capabilities (skills), endpoint URL, and authentication requirements |
| **Task** | Unit of work with lifecycle: `submitted` → `working` → `completed` / `failed` / `input-required` |
| **Message** | Communication turn between client and remote agent (role: `user` or `agent`) |
| **Part** | Content within a Message — text, file, or structured data |
| **Artifact** | Output generated by the agent (documents, reports, structured data) |

### DWS IQ Agent Card

DWS IQ Platform publishes its Agent Card at:
```
https://api.dws10.com/.well-known/agent.json
```

```json
{
  "name": "DWS IQ Climate Compliance Agent",
  "description": "EU climate compliance calculation, ESG reporting, and Firehorse report generation for industrial enterprises.",
  "url": "https://api.dws10.com/a2a",
  "version": "6.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "compliance-calculation",
      "name": "Climate Compliance Calculation",
      "description": "Calculate Fit for 55, CSRD, ETS, and CBAM compliance scores from emissions data"
    },
    {
      "id": "firehorse-report",
      "name": "Firehorse Report Generation",
      "description": "Generate audit-ready ESG and climate compliance reports (PDF/Excel)"
    },
    {
      "id": "carbon-calculator",
      "name": "Carbon Footprint Calculator",
      "description": "Calculate Scope 1/2/3 carbon emissions for organizations"
    }
  ],
  "authentication": {
    "schemes": ["oauth2", "apiKey"]
  },
  "provider": {
    "organization": "Lifetime Oy",
    "url": "https://dws10.com"
  }
}
```

### A2A Section Structure (UI Component)

```html
<section class="a2a-section">
    <div class="a2a-container">
        <h2 class="a2a-title">Connect Your AI Agent</h2>
        <p class="a2a-subtitle">
            DWS IQ Platform supports the Google A2A Protocol (Agent-to-Agent).
            Your AI agents discover our capabilities via Agent Card, send tasks,
            and receive compliance scores, Firehorse reports, and carbon calculations — autonomously.
        </p>
        <div class="a2a-capabilities">
            <div class="a2a-card">
                <div class="a2a-icon">📊</div>
                <h3>Compliance Calculation</h3>
                <p>Your agent sends emissions data as a Task → DWS IQ returns Fit for 55, CSRD, and ETS compliance scores as Artifacts.</p>
            </div>
            <div class="a2a-card">
                <div class="a2a-icon">📋</div>
                <h3>Firehorse Reports</h3>
                <p>Your agent triggers a report Task → Firehorse generates audit-ready PDF/Excel as downloadable Artifacts.</p>
            </div>
            <div class="a2a-card">
                <div class="a2a-icon">🤖</div>
                <h3>Multi-Agent Orchestration</h3>
                <p>Your agents discover DWS IQ skills via Agent Card. Multi-turn conversations enable complex cross-company ESG workflows.</p>
            </div>
        </div>
        <div class="a2a-cta">
            <a href="mailto:a2a@lifetime.fi?subject=A2A Agent Integration — {Industry}" class="btn-primary">
                Bring Your Own Agent
            </a>
            <a href="/architecture/" class="btn-secondary">View Agent Card</a>
        </div>
        <div class="a2a-protocols">
            <span class="a2a-protocol">A2A Protocol v0.3</span>
            <span class="a2a-protocol">MCP</span>
            <span class="a2a-protocol">JSON-RPC</span>
            <span class="a2a-protocol">gRPC</span>
            <span class="a2a-protocol">REST</span>
        </div>
    </div>
</section>
```

### A2A CSS Spec

```css
.a2a-section {
    background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%);
    padding: 80px 20px;
    border-top: 1px solid #334155;
}
.a2a-container {
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
}
.a2a-title {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: #e2e8f0;
    margin-bottom: 12px;
}
.a2a-subtitle {
    color: #94a3b8;
    font-size: 1rem;
    max-width: 700px;
    margin: 0 auto 40px;
    line-height: 1.6;
}
.a2a-capabilities {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
}
.a2a-card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 32px 24px;
    text-align: left;
}
.a2a-card h3 {
    color: #e2e8f0;
    font-size: 1.1rem;
    margin: 12px 0 8px;
}
.a2a-card p {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.5;
}
.a2a-icon {
    font-size: 1.5rem;
}
.a2a-cta {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.a2a-protocols {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}
.a2a-protocol {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #60a5fa;
    background: rgba(37, 99, 235, 0.1);
    border: 1px solid rgba(37, 99, 235, 0.2);
}

@media (max-width: 768px) {
    .a2a-capabilities { grid-template-columns: 1fr; }
}
```

### A2A Integration Scope

This is **not just web marketing.** The A2A section represents real operational capabilities following the A2A Protocol specification:

| DWS Skill | A2A Task Flow | Transport | Output Artifact |
|-----------|--------------|-----------|-----------------|
| **Compliance Calculation** | Client agent sends emissions data as Task → DWS IQ agent processes → returns scores | JSON-RPC / gRPC | Structured JSON scores |
| **Firehorse Reports** | Client agent sends report request as Task → Firehorse generates → returns file | JSON-RPC / REST | PDF/Excel file Part |
| **Carbon Calculator** | Client agent sends org data → DWS IQ calculates Scope 1/2/3 → returns breakdown | JSON-RPC / REST | Structured JSON |
| **Multi-Turn ESG Workflow** | Multi-turn conversation: agent requests, DWS asks for clarifications (`input-required`), agent responds | A2A streaming (SSE) | Multiple Artifacts |
| **Data Exchange** | Structured emissions/energy/fleet/waste data exchange between organizations | GAIA-X compliant | Structured data Parts |

### A2A Technical Implementation

**Python SDK:** `pip install a2a-sdk` ([a2a-python](https://github.com/a2aproject/a2a-python))
**Spec version:** v0.3.0 — Protocol bindings: JSON-RPC, gRPC, HTTP+JSON/REST
**Validation:** Use [a2a-inspector](https://github.com/a2aproject/a2a-inspector) to validate agent compliance

**Partner integration flow:**
1. Partner's client agent fetches `https://api.dws10.com/.well-known/agent.json`
2. Agent Card reveals DWS IQ skills (compliance-calculation, firehorse-report, carbon-calculator)
3. Client creates a Task targeting the desired skill
4. Task progresses: `submitted` → `working` → `completed` (or `input-required` for multi-turn)
5. Client retrieves Artifacts (reports, scores, data) from the completed Task

**Authentication:** OAuth 2.0 or API key (defined in Agent Card `authentication.schemes`)

### A2A + MCP Architecture

```
┌─────────────────────────────────────────────────┐
│  PARTNER ORGANIZATION                           │
│  ┌───────────────┐                              │
│  │ Partner Agent  │ ←→ Partner's own MCP tools   │
│  └───────┬───────┘                              │
└──────────┼──────────────────────────────────────┘
           │ A2A Protocol (JSON-RPC / gRPC)
           │ Task: compliance-calculation
           ▼
┌─────────────────────────────────────────────────┐
│  DWS IQ PLATFORM (Lifetime Oy)                  │
│  ┌───────────────┐    ┌────────────────────┐    │
│  │ DWS IQ Agent  │←──→│ MCP Tools (internal)│   │
│  │ (A2A Server)  │    │ • Carbon Calculator │   │
│  └───────┬───────┘    │ • ERP Connectors    │   │
│          │            │ • Supabase DB       │   │
│          ▼            │ • Firehorse Engine  │   │
│  ┌───────────────┐    └────────────────────┘    │
│  │ Firehorse     │                              │
│  │ Report Engine │ → PDF/Excel Artifacts        │
│  └───────────────┘                              │
└─────────────────────────────────────────────────┘
```

### Which Pages Get A2A

| Industry Page | A2A Placement |
|--------------|---------------|
| `/construction/` | Before footer, after industry solutions |
| `/energy/` | Before footer |
| `/manufacturing/` | Before footer |
| `/logistics/` | Before footer |
| `/healthcare/` | Before footer |
| `/real-estate/` | Before footer |
| `/financial-services/` | Before footer |
| `/public-sector/` | Before footer |
| `/mining/` | Before footer |
| `/shipbuilding/` | Before footer |
| `/waste/` | Before footer |

---

## 13. Responsive Breakpoints

All DWS pages use consistent breakpoints:

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| **Desktop** | `>900px` | Full nav, 5-col footer, 3-col grids |
| **Tablet** | `481–900px` | Hamburger nav, 2-col footer, 2-col grids |
| **Mobile** | `≤480px` | Hamburger nav, 1-col footer, 1-col grids |

### Key Breakpoint Rules

- Navigation switches at **900px** (hamburger ↔ horizontal)
- Footer grid switches at **900px** (5-col → 2-col) and **480px** (2-col → 1-col)
- Product cards: `minmax(320px, 1fr)` auto-fit
- Hero title: `clamp(2rem, 4vw, 3rem)` for fluid scaling
- Touch targets: minimum `48px × 48px` on mobile (WCAG 2.2)

---

## 14. Accessibility (WCAG 2.2 AA)

All DWS pages MUST meet WCAG 2.2 Level AA.

### Requirements

| Category | Rule |
|----------|------|
| **Color contrast** | Minimum 4.5:1 for text, 3:1 for large text and UI elements |
| **Touch targets** | Minimum 48×48px on mobile (nav items, buttons, links) |
| **Keyboard nav** | All interactive elements reachable via Tab; Escape closes overlays |
| **ARIA labels** | Hamburger: `aria-label`, `aria-expanded`; Images: `alt` text |
| **Focus indicators** | Visible focus ring on all interactive elements |
| **Reduced motion** | Respect `prefers-reduced-motion: reduce` for animations |
| **Language** | `<html lang="en">` on all pages |
| **Semantic HTML** | Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` |

---

## 15. Shared Assets Registry

All shared JavaScript and CSS assets live under `dws10.com/shared-assets/`.

| File | Version | Purpose | Pages |
|------|---------|---------|-------|
| `nav/ironclad-nav.js` | v3.0 | Navigation bar + hamburger menu | All pages |
| `footer/ironclad-footer.js` | v1.0 | 5-column footer + payments + legal | All pages (except checkout/dashboard/assistant) |
| `nav/hamburger-menu.js` | v1.0 | Legacy hamburger (superseded by ironclad-nav v3.0) | Deprecated |
| `vat-locale/vat-locale.js` | v1.0 | VAT calculation + locale switching | Store pages |

### Dual Folder Sync Rule

When any shared asset is modified, **BOTH locations must be updated:**

| Source | Production |
|--------|------------|
| `dws10.com/shared-assets/` | `landing-pages/dws10-com/shared-assets/` |
| `onelifetime.world/shared-assets/` | `landing-pages/onelifetime-world/shared-assets/` |

---

## 16. Page Template

When creating a **new page** on dws10.com, use this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Page Title} | DWS IQ Platform</title>
    <meta name="description" content="{50-160 chars}">
    <meta name="keywords" content="DWS IQ, {keywords}">
    <meta name="author" content="Lifetime Oy">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="{Page Title} | DWS IQ Platform">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dws10.com/{path}">
    <meta property="og:image" content="https://dws10.com/static/images/dws-og-image.png">
    <link rel="canonical" href="https://dws10.com/{path}">
    <link rel="icon" type="image/png" href="/DWS_IQ2026.png">
    <style>
        /* Page-specific styles here */
        body {
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }
    </style>
</head>
<body>
    <!-- Navigation injected by ironclad-nav.js -->

    <section class="hero">
        <!-- Hero section per Section 7 -->
    </section>

    <main>
        <!-- Page content -->
    </main>

    <!-- For industry pages, add A2A section per Section 12 -->

    <script src="/shared-assets/nav/ironclad-nav.js"></script>
    <script src="/shared-assets/footer/ironclad-footer.js"></script>
</body>
</html>
```

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

## 17. Climate IQ Pantheon — Agent Brand Identity

### Naming Convention

All Climate IQ AI agents use Greek/Roman deity names. Names are **permanent identity** — never rename them. Deity origin and domain assignment:

| Agent | Deity Origin | Domain | Accent Color |
|-------|-------------|--------|-------------|
| Atlas | Greek Titan | Chief of Staff | Indigo `#6366f1` |
| Athena | Greek | EU Compliance | Sky `#0ea5e9` |
| Hephaestus | Greek | Field & Site | Red `#ef4444` |
| Iris | Greek | Research & Intel | Purple `#a855f7` |
| Hermes | Greek | Logistics & Ops | Amber `#f59e0b` |
| Apollo | Greek | Content & Outreach | Orange `#f97316` |
| Vulcan | Roman | Steel & Metals | Orange `#f97316` |
| Helios | Greek | Energy & Renewables | Yellow `#eab308` |
| Neptune | Roman | Maritime & Shipping | Cyan `#06b6d4` |
| Ceres | Roman | Agriculture | Green `#22c55e` |
| Prometheus | Greek | Hydrogen | Blue `#3b82f6` |
| Mars | Roman | Construction | Red `#ef4444` |
| Gaia | Greek | Cement & Earth | Stone `#78716c` |

### Agent Card Component (onelifetime.world Team Section)

**Orchestrator cards (large):**
- Dark card: `background: #1e293b`
- Colored border: `2px solid {accent-color}` per agent above
- Large emoji avatar (centered, `text-5xl`)
- Name in white `#f1f5f9`, bold
- Role subtitle in accent color, `text-sm font-medium`
- One-liner in `text-slate-400`, italic
- Capability badge: dark bg + accent text, `rounded-full px-3 py-1 text-xs font-semibold`

**Industry Specialist cards (compact):**
- Same dark background `#1e293b`
- Thin border `1px solid #374151`
- Medium emoji (`text-4xl`)
- Name bold `text-sm`
- Industry in accent color `text-xs`
- One-liner in `text-slate-500 text-xs italic`

### One-Liner Tone Rules

Agent one-liners MUST be:
- **Self-assured, not arrogant** — the agent knows it's good, but doesn't brag
- **Specific to the domain** — reference real EU regulations, real tools, real outcomes
- **Wry, not slapstick** — dry humor that makes a compliance executive smile
- **Single sentence** — never longer

**Examples (approved):**
- ✅ "Has memorized every EU regulation since 2005. Corrects lawyers. Unprompted." (Athena)
- ✅ "Turns ETS carbon prices into competitive strategy. Red-hot accuracy." (Vulcan)
- ❌ "I'm so smart and fast and amazing!" — too generic/hollow
- ❌ "LOL compliance is boring but not for me!" — wrong tone

### Section Header (Team Page)

```html
<h2>Our Team</h2>
<p>Humans and AI agents. Both take their jobs very seriously. One of them never sleeps.</p>
<h3>Climate IQ Pantheon</h3>
<p class="uppercase tracking-widest text-sm">AI Orchestrator Agents</p>
<h3>Industry Specialists</h3>
<p class="uppercase tracking-widest text-sm">Sector AI Agents — One per Industry</p>
```

### Footer (onelifetime.world)

onelifetime.world uses its own Ironclad Footer (`onelifetime.world/shared-assets/footer/ironclad-footer.js`) — same design system as dws10.com but with onelifetime.world-specific links (Community, Pledge, Partners).

| Site | Footer Asset |
|------|-------------|
| dws10.com | `dws10.com/shared-assets/footer/ironclad-footer.js` |
| onelifetime.world | `onelifetime.world/shared-assets/footer/ironclad-footer.js` |

---

## 18. Dashboard Profile Menu Standard v1.0

**Scope:** DWS IQ logged-in dashboard (v10-react and future versions)
**Components:** `ProfileMenu.tsx`, `HamburgerMenu.tsx`
**Effective:** 2026-03-03

### Overview

Every logged-in dashboard MUST display:
1. A **user avatar** (initials circle) in the header top-right area.
2. A **profile dropdown** on desktop with user info and navigation.
3. A **hamburger menu** on mobile (≤768px) with full nav + user identity strip + sign-out.

### User Avatar

| Property | Value |
|----------|-------|
| Shape | Circle (`rounded-full`) |
| Size — desktop | `w-9 h-9` (36 px) |
| Size — mobile | `w-8 h-8` (32 px) |
| Background | `bg-gradient-to-br from-primary-500 to-primary-700` |
| Text | White, `text-sm font-semibold` (desktop), `text-xs` (mobile) |
| Content | First 2 initials from `user_metadata.full_name`; fallback: first 2 chars of email |
| Ring | `ring-2 ring-white shadow-sm` |

**Initials derivation:**
```ts
// Split name on spaces, take first letter of each word, max 2, uppercase
const name = user?.user_metadata?.full_name;
if (name) return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
return (user?.email ?? '').slice(0, 2).toUpperCase();
```

### Profile Dropdown (Desktop)

Triggered by clicking the avatar. Auto-closes on click-outside or Escape key.

**Structure:**
```
┌─────────────────────┐
│ Full Name           │  ← user_metadata.full_name
│ user@email.com      │  ← user.email
├─────────────────────┤
│ 🏠 Dashboard        │
│ 🖥  Agent Monitor   │
│ ⚙️  Settings        │
├─────────────────────┤
│ 🔴 Sign Out         │
└─────────────────────┘
```

**Design specs:**
| Property | Value |
|----------|-------|
| Width | `w-56` (224 px) |
| Border radius | `rounded-xl` |
| Shadow | `shadow-lg` |
| Border | `border border-gray-100` |
| Item height | `py-2` (comfortable tap target) |
| Sign Out color | `text-red-600 hover:bg-red-50` |
| Z-index | `z-50` |

**Accessibility:**
- Button: `aria-haspopup="true"`, `aria-expanded={open}`, `aria-label="Open profile menu"`
- Menu container: `role="menu"`, `aria-label="Profile menu"`
- Each item: `role="menuitem"`
- Escape key closes menu
- Click-outside closes menu

### Hamburger Menu (Mobile ≤768px)

Visible only on mobile (`md:hidden`). Three horizontal bars (`w-5 h-0.5`) that open a slide-out panel from the right.

**Panel dimensions:** `w-72` (288 px), full height
**Animation:** `translate-x-0` ↔ `translate-x-full`, 300ms ease-in-out
**Backdrop:** `bg-black/40` overlay, click closes panel
**Body scroll:** Locked (`overflow: hidden`) while panel is open

**Panel layout (top to bottom):**
```
┌──────────────────────────────┐
│ DWS IQ Dashboard        [×]  │  ← panel header
├──────────────────────────────┤
│ [Avatar] Full Name           │  ← user identity strip (bg-gray-50)
│         user@email.com       │
├──────────────────────────────┤
│ 🏠 Dashboard                 │
│ 🖥  Agent Monitor            │
│ 💬 AI Assistant              │
│ 📹 Meeting                   │
│ ──────────────────────────── │
│ ⚙️  Settings                 │
├──────────────────────────────┤
│ 🔴 Sign Out                  │  ← pinned to bottom
└──────────────────────────────┘
```

**Accessibility:**
- Hamburger button: `aria-label="Open menu"`, `aria-expanded={open}`
- Close button: `aria-label="Close menu"`
- Panel: `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`
- Escape key closes panel
- Backdrop click closes panel
- Body scroll locked while open

### Layout Integration (App.tsx)

```tsx
// Desktop: logo | nav-buttons | ProfileMenu
// Mobile:  logo | HamburgerMenu | avatar-circle
<header>
  <div className="flex items-center justify-between gap-4">
    <Logo />
    <DesktopNavButtons className="hidden md:flex" />
    <div className="flex items-center gap-2 shrink-0">
      <ProfileMenu className="hidden md:block" />  {/* desktop dropdown */}
      <HamburgerMenu className="md:hidden" />       {/* mobile slide-out */}
      <AvatarCircle className="md:hidden" />        {/* mobile avatar (no dropdown) */}
    </div>
  </div>
</header>
```

### Component Files

| File | Purpose |
|------|---------|
| `src/components/ProfileMenu.tsx` | Desktop avatar + dropdown |
| `src/components/HamburgerMenu.tsx` | Mobile hamburger + slide-out panel |

---

## 8. Cross-Reference to Standards

| Standard | File | What It Governs |
|----------|------|----------------|
| **Brand Standard** | `DWS_BRAND_STANDARD.md` (this file) | UI components, dark tokens, product cards, badges |
| **Product Standard** | `DWS_PRODUCT_STANDARD.md` | Pricing, product taxonomy, catalog rules |
| **Document Standard** | `DWS_DOCUMENT_STANDARD.md` | Document headers, versioning, metadata |
| **Sales Strategy** | `sales-outreach/NORDIC_SALES_STRATEGY.md` | Outreach, metaphors, one-click buy |
| **Security Standard** | `DWS_SECURITY_STANDARD.md` | Security, .env, .gitignore rules |

---

---

## 19. Onboarding Wizard Standard (v1.0)

**File:** `dws6.com/dashboard/firehorse/v10-react/src/pages/OnboardingWizard.tsx`
**Trigger:** Shown on first login when `onboarding_completed` is not set.

### 19.1 Flow

| Step | Title | Purpose | Required Fields |
|------|-------|---------|-----------------|
| 1 | Select Industry | Tailor compliance checks | `industry` (one of 16 EU sectors) |
| 2 | Company Details | Calibrate requirements | `companyName`, `companySize`, `country` |
| 3 | Data Sources | Plan integrations | `dataSources[]` (min 1) |
| 4 | Regulations | Set monitoring scope | `regulations[]` (min 1) + summary + submit |

### 19.2 Design Rules

- **Dark theme** — `bg-gray-950` background, `bg-gray-900` card, `border-gray-800`
- **Selection cards** — `border-2 border-blue-500 bg-blue-600/20` when selected
- **Progress bar** — Blue gradient, `h-1.5 rounded-full`, step labels below
- **Touch targets** — All selection buttons min 48px height for mobile
- **Skip option** — Always available on step 1 ("Skip setup" link)
- **Mobile-first** — Grid `grid-cols-2` for selection cards, stacks on small screens
- **Max width** — `max-w-lg` for wizard container

### 19.3 Data Persistence

- Saves to `user_profiles` table via Supabase on completion
- Falls back to `localStorage` key `dws_onboarded_{userId}` for skip
- `onboarding_completed_at` timestamp stored for analytics

---

## 20. Compliance Score Widget Standard (v1.0)

**File:** `dws6.com/dashboard/firehorse/v10-react/src/components/ComplianceScoreWidget.tsx`
**API:** `GET /api/v1/compliance/overview`

### 20.1 Visual Components

| Component | Description | Design |
|-----------|-------------|--------|
| Score Ring | SVG animated circle | 160px, 12px stroke, color by score tier |
| Score Counter | Animated number | `text-3xl font-bold`, ease-out cubic animation |
| Trend Indicator | Arrow + delta | Green up, red down, gray neutral |
| Regulation Bars | Horizontal bars | Per-regulation progress bars with status badge |
| Gap Summary | Total / Critical | Two-column layout with divider |
| Action Button | "Run New Assessment" | Full-width `bg-gray-900` button |

### 20.2 Color Tiers

| Score Range | Ring Color | Status |
|-------------|-----------|--------|
| 80–100 | `#22c55e` (green-500) | Compliant |
| 60–79 | `#f59e0b` (amber-500) | Partial |
| 40–59 | `#f97316` (orange-500) | At Risk |
| 0–39 | `#ef4444` (red-500) | Non-compliant |

### 20.3 Responsive Behavior

- Shows in main grid when no side panel is open (`lg:col-span-1`)
- Hidden when chat/meeting panel is active (space constraint)
- Full-width on mobile

---

## 21. CLI Rich Output Standard (v1.0)

**File:** `cli/src/format.ts`

### 21.1 Output Modes

| Mode | When | Format |
|------|------|--------|
| Human | Interactive TTY | Colors, tables, spinners, progress bars |
| JSON | Piped or `--json` flag | Structured JSON for machine consumption |

### 21.2 Color Semantics

| Element | Color | ANSI |
|---------|-------|------|
| Success | Green | `\x1b[32m` |
| Error | Red | `\x1b[31m` |
| Warning | Yellow | `\x1b[33m` |
| Info | Cyan | `\x1b[36m` |
| Agent names | Cyan | `\x1b[36m` |
| Tags/capabilities | Yellow | `\x1b[33m` |
| Dim/secondary | Gray | `\x1b[90m` |
| Status badges | Inverted bg | `\x1b[42;30m` etc. |

### 21.3 New Commands

| Command | Purpose | Human Output |
|---------|---------|--------------|
| `dws init` | Interactive setup wizard | Guided prompts → env export |
| `dws status` | Platform overview | Health, agents, usage bars |
| `dws health` | System health | Service status indicators |

### 21.4 Spinner Pattern

- Braille animation (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏) at 80ms interval
- Outputs to stderr (doesn't pollute JSON stdout)
- Graceful fallback: plain text when not TTY

---

## 22. Product Pitch Lines

Canonical one-liners for investor materials, landing pages, and sales outreach. Both language versions MUST be updated together.

### DWS IQ Aegis

**EN:** DWS IQ Aegis — intelligence interceptor for EU dual-use industries. Sovereign AI, Finnish-hosted, CLOUD Act-free.

**FI (kotimainen):** DWS IQ Aegis — teollisuustiedustelualusta EU:n säännellyille toimialoille. Suvereeni tekoäly, Suomessa ylläpidetty (reuna/private), CLOUD Act -vapaa.

**Translation notes:**
- "intelligence interceptor" → "teollisuustiedustelualusta" (industrial intelligence platform) — not "tiedustelun torjuntajärjestelmä" which means counter-intelligence
- "dual-use industries" → "säännellyt toimialat" (regulated industries) — dual-use is determined by end-use, not by industry classification
- "(reuna/private)" added in FI version — clarifies edge-deployed, not public cloud

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v2.5 | 2026-04-01 | Added: Section 22 Product Pitch Lines — canonical EN/FI one-liners for DWS IQ Aegis, translation notes |
| v2.4 | 2026-03-08 | Added: Section 19 Onboarding Wizard Standard v1.0 — 4-step guided flow (Industry, Company, Data Sources, Regulations), mobile-first design, dark theme, progress bar, skip option. Section 20 Compliance Score Widget Standard v1.0 — SVG animated ring chart, regulation breakdown, trend indicator, color tiers, responsive layout. Section 21 CLI Rich Output Standard v1.0 — ANSI colors, tables, spinners, progress bars, `dws init` and `dws status` commands, dual-mode output (human/JSON). |
| v2.2 | 2026-03-03 | Added: Section 18 Dashboard Profile Menu Standard v1.0 — ProfileMenu (desktop avatar + dropdown), HamburgerMenu (mobile slide-out), avatar initials algorithm, accessibility specs (ARIA roles, Escape key, backdrop), layout integration pattern |
| v2.1 | 2026-03-02 | Added: Section 17 Climate IQ Pantheon Agent Brand Identity — naming convention, accent colors, card components, one-liner tone rules, footer for onelifetime.world |
| v2.0 | 2026-02-19 | Added: Iron Clad Nav v3.0, Iron Clad Footer v1.0, Hero Section, Typography, Logo Usage, SEO Meta Tags, A2A Agent Integration, Responsive Breakpoints, Accessibility, Page Template. Replaced: old hamburger-menu.js (Section 5) with ironclad-nav.js v3.0. |
| v1.1 | 2026-02-15 | Added: Store identity, product data sources, category taxonomy, hamburger menu, sovereignty badges |
| v1.0 | 2026-02-01 | Initial release: dark tokens, product cards, category nav |
