# DWS Brand Standard

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.5) | Session: bold-lewin | Date: 06.02.2026 | Changes: Initial creation — Gamma design system, color palette, typography, navigation, page layout, component patterns, per-domain standards, consistency checklist
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: bold-lewin | Date: 06.02.2026 | Changes: Added UX research-backed guidelines (Section 8), enhanced accessibility (Section 9), added EU compliance design requirements (Section 10), dark-theme legacy pages (Section 11), applied DWS Document Standard header

Session Links & References:
  - Claude Code (bold-lewin): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/DWS_BRAND_STANDARD.md

Document Status:
  - Created: 06.02.2026
  - Last Modified: 06.02.2026
  - Language: English
  - Publication Status: ✅ ACTIVE

Associated Skills & Agents (Claude assets roadmap):
  - **Planned Agent** (not yet in repo): `.claude/agents/ui-ux-designer.md` — Research-backed UI/UX design critic (Nielsen Norman Group studies) — *Target: create before v1.2 release*
  - **Planned Skill** (not yet in repo): `.claude/skills/ux-researcher-designer/SKILL.md` — UX research toolkit with persona generator — *Target: create before v1.2 release*
  - **Planned Skill** (not yet in repo): `.claude/skills/senior-frontend/SKILL.md` — Senior frontend development toolkit — *Target: create before v1.2 release*
  - **Related** (existing doc): `UI_SKILLS_GAMMA.md` — Technical UI constraints (Tailwind, React, animations)

---

**Version:** 1.1
**Effective Date:** February 2026
**Design System:** Gamma (Enterprise Standard)
**Scope:** dws6.com, dws10.com, onelifetime.world, lifetime.fi
**Owner:** Lifetime Oy

---

## 1. Design System: Gamma

Gamma is the single enterprise design system for all DWS and Lifetime properties. Ultra (legacy premium) and Theta (AI-first) are deprecated for new pages.

### 1.1 Color Palette

#### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0a1628` | Primary dark (nav backgrounds, headers) |
| `--color-primary-light` | `#152238` | Primary dark variant |
| `--color-accent` | `#0066cc` | Links, CTAs, headings |
| `--color-accent-dark` | `#0052a3` | Hover states |

#### EU Sovereignty Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-eu-blue` | `#003399` | Hero backgrounds, sovereignty badges |
| `--color-eu-gold` | `#FFCC00` | Highlights, badges, accents |

#### Legal & Compliance
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-legal` | `#0d7a3e` | Legal Hub links, compliance badges |
| `--color-success` | `#0d7a3e` | Positive indicators |

#### Neutral Scale
| Token | Hex |
|-------|-----|
| `--color-white` | `#ffffff` |
| `--color-gray-50` | `#f8fafc` |
| `--color-gray-100` | `#f1f5f9` |
| `--color-gray-200` | `#e2e8f0` |
| `--color-gray-300` | `#cbd5e1` |
| `--color-gray-400` | `#94a3b8` |
| `--color-gray-500` | `#64748b` |
| `--color-gray-600` | `#475569` |
| `--color-gray-700` | `#334155` |
| `--color-gray-800` | `#1e293b` |
| `--color-gray-900` | `#0f172a` |

### 1.2 Approved Gradients

```css
/* Primary brand gradient - Navy to Slate */
background: linear-gradient(135deg, #0a1628 0%, #1e293b 100%);

/* Sovereignty Hero gradient - EU Blue */
background: linear-gradient(135deg, #003399 0%, #001a4d 100%);

/* CTA gradient - Emerald */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Accent gradient - Cyan to Blue */
background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%);
```

**Never use:** purple gradients, multicolor (3+) gradients, animated gradients, gradient text fills.

---

## 2. Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Google Fonts include: `Inter:wght@300;400;500;600;700;800`

### Type Scale (Page Content)
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title (h1) | `2rem` / `2.5rem` | 800 / 700 | `--color-gray-900` |
| Section Heading (h2) | `1.5rem` | 700 | `--color-accent` or `--color-eu-blue` |
| Sub-heading (h3) | `1.125rem` / `1.2rem` | 600 | `--color-gray-700` or `--color-accent` |
| Body text (p) | `1rem` | 400 | `--color-gray-600` |
| Small text | `0.875rem` | 400 | `--color-gray-500` |
| Table headers | `0.75rem` | 600 | `--color-gray-600` (uppercase, `0.05em` spacing) |

### Rules
- Use `text-balance` for headings, `text-pretty` for body
- Use `tabular-nums` for numeric data
- Never modify letter-spacing except `tracking-tight` for large display text

---

## 3. Navigation: Gamma Ironclad

### Standard Implementation
Every page on dws10.com MUST use the shared Gamma Ironclad navigation:

```html
<script src="/shared-assets/nav/ironclad-nav.js"></script>
```

The script auto-injects both HTML and CSS. It:
- Calculates relative base paths automatically
- Injects a sticky white header with logo, nav dropdowns, IQ Login button
- Includes full responsive mobile styles (stacks at 900px breakpoint)
- Highlights the Store link when on `/buy/`

### Navigation Structure
```
Home ▾ (mega-menu with Industries, Tools, Company, Designs, Legal, Compliance, Other)
Solutions ▾ (Fit for 55, CSRD & ESG)
Products ▾ (all product pages)
About ▾ (Lifetime Group, Designs, Legal)
IQ Login (CTA button)
OneLifetime.World (icon link)
Firehorse Store (icon link)
```

### Do NOT use:
- Embedded HTML navigation (inline `<header>` with nav)
- The older `nav-loader.js` + `ironclad-nav.html` approach
- Dark-theme nav headers (`.nav-header` with `#1e293b` background)

---

## 4. Page Layout Standard

### 4.1 Sovereignty Hero Section

Used on the Legal Hub main page and other key landing pages. Conveys EU sovereignty positioning.

```html
<section class="sovereignty-hero">
    <div class="sovereignty-hero-content">
        <div class="sovereignty-badge">
            <svg>...</svg>
            EU-Sovereign by Design
        </div>
        <h1 class="sovereignty-title">
            <span class="highlight">Sovereign</span> by Design.<br>
            <span class="highlight">Global</span> by Choice.
        </h1>
        <p class="sovereignty-subtitle">
            Deploy on global hyperscalers or EU-sovereign infrastructure.
        </p>
        <a href="..." class="sovereignty-cta">
            <span>View Sovereignty Options</span>
            <svg>...</svg>
        </a>
    </div>
</section>
```

**CSS:**
- Background: `linear-gradient(135deg, var(--color-eu-blue) 0%, #001a4d 100%)`
- Radial gradient overlays for depth
- Badge: gold border (`rgba(255, 204, 0, 0.4)`) with pill shape
- Title: 800 weight, `clamp(2rem, 5vw, 3rem)`, gold highlights
- CTA: EU Gold background, EU Blue text, pill shape

### 4.2 Legal Sub-Page Header

Used on legal sub-pages (terms, policies, notices). Simpler than the Sovereignty Hero.

```html
<div class="legal-header">
    <h1>Page Title</h1>
    <p class="effective-date">Effective: 28 January 2026</p>
    <div class="sovereignty-badge">
        <span>Sovereign by Design. Global by Choice.</span>
    </div>
</div>
```

**CSS:**
- Background: `linear-gradient(135deg, var(--color-eu-blue) 0%, #001a4d 100%)`
- Padding: `60px 20px`, center-aligned
- Title: `2.5rem`, 700 weight, white
- Effective date: EU Gold color
- Badge: Gold border pill

### 4.3 Content Area

```html
<main>
    <a href="/legal/" class="back-link">&larr; Back to Legal Hub</a>
    <!-- Content here -->
</main>
```

- Max-width: `900px` (legal content) or `960px` (Legal Hub)
- Padding: `40px 20px`
- `flex: 1` to push footer down

### 4.4 Footer

```html
<footer class="site-footer">
    <div class="footer-legal">
        <p><strong>Data Controller:</strong> Lifetime Oy (...)</p>
        <p><strong>Regulatory Framework:</strong> GDPR, DSA, NIS2, EU AI Act.</p>
        <p>Copyright &copy; 2025-2026 Lifetime Oy. All Rights Reserved.</p>
    </div>
</footer>
```

- Light footer: `background: var(--color-bg-subtle)`, border-top
- Dark footer: `background: var(--color-gray-900)`, white text

---

## 5. Component Patterns

### 5.1 Back Link
Every sub-page linked from a hub page should include a back link:
```html
<a href="/legal/" class="back-link">&larr; Back to Legal Hub</a>
```

### 5.2 Compliance Summary Table
```html
<div class="summary-table">
    <table>
        <thead>
            <tr><th>Policy</th><th>Applies to</th><th>Effective</th><th>Last reviewed</th></tr>
        </thead>
        <tbody>...</tbody>
    </table>
    <p class="table-note">Footnote text here.</p>
</div>
```

### 5.3 Tags & Badges
```html
<span class="tag">Updated Q1 2026</span>
<span class="tag tag-sovereignty">New</span>
```

### 5.4 Contact Cards
Grid layout (`repeat(auto-fit, minmax(220px, 1fr))`) for contact information.

### 5.5 Section Notes & Callouts
```html
<!-- Callout with left border accent -->
<div class="callout">
    <p><strong>Title</strong></p>
    <p>Content here.</p>
</div>

<!-- Section note with border -->
<div class="section-note">
    <strong>Note:</strong> Content here.
</div>
```

---

## 6. Per-Domain Standards

| Domain | Design System | Navigation | Deployment |
|--------|--------------|------------|------------|
| dws10.com | Gamma Ironclad | `ironclad-nav.js` | Workers (test) → Pages (prod) |
| dws6.com | Gamma (dashboard) | React Router | Workers (test) → Pages (prod) |
| onelifetime.world | Gamma | `ironclad-nav.js` or custom | Workers (test) → Pages (prod) |
| lifetime.fi | Gamma (coming) | TBD | TBD |

### Dual-Folder Rule
1. **Always update root folder first** (e.g., `dws10.com/`)
2. Test on Cloudflare Workers
3. Copy to `landing-pages/` folder (e.g., `landing-pages/dws10-com/`)
4. Landing-pages folder is production on Cloudflare Pages

---

## 7. Consistency Checklist

Before publishing any page on a DWS domain, verify:

- [ ] Uses Gamma Ironclad navigation (`ironclad-nav.js`)
- [ ] Inter font loaded from Google Fonts
- [ ] Color tokens match this standard (no custom blues, no purple)
- [ ] Page has proper `<title>` and `<meta description>`
- [ ] Responsive at mobile breakpoint (max-width: 900px for nav, 768px for content)
- [ ] Footer includes Data Controller, Business ID, Regulatory Framework
- [ ] Copyright shows `2025-2026 Lifetime Oy`
- [ ] Links use `--color-accent` (#0066cc), not browser default blue
- [ ] Legal pages include "Back to Legal Hub" link
- [ ] Legal pages use `legal-header` with EU Blue gradient
- [ ] Tables use `summary-table` class with uppercase headers
- [ ] No dark-theme pages (legacy) — all pages use white/light background
- [ ] DPA requests directed to `dpa@lifetime.fi`
- [ ] EU Sovereignty badge present on key pages

---

## 8. UX Research-Backed Guidelines

Sourced from Nielsen Norman Group studies and usability research. Applied within the constraints of the existing DWS Gamma design system.

### 8.1 Content Hierarchy & Reading Patterns

**F-Pattern Reading** (NN Group eye-tracking studies):
- Users scan in an F-shaped pattern on text-heavy pages (79% scan, 16% read word-by-word)
- Front-load important information in the first two paragraphs
- Use meaningful subheadings (`h2`, `h3`) as scan anchors
- Legal pages: place critical obligations and dates early in each section

**Left-Side Bias** (NN Group, 2024):
- Users spend 69% more time viewing the left half of screens
- Body text must be left-aligned (never center-align paragraphs)
- Navigation items left-aligned within the header (Ironclad nav already does this)
- Exception: Hero sections and legal headers may use center-alignment for visual impact

### 8.2 Interactive Element Sizing (Fitts's Law)

- **Minimum touch target**: 44×44px for all interactive elements (WCAG 2.2)
- **Primary CTAs**: Large, high-contrast, minimum `padding: 12px 24px`
- **Related actions grouped**: Put related buttons close together to reduce acquisition time
- **Sovereignty CTA pill**: `border-radius: 9999px` with generous padding — already compliant

### 8.3 Choice Architecture (Hick's Law)

- Limit navigation dropdown items to 7±2 per group
- Use progressive disclosure: show summary first, detail on click
- Legal Hub compliance table: group by category (Privacy, Commercial, Product)
- Contact cards: maximum 4 per row

### 8.4 Motion & Interaction

**When to animate:**
- State transitions (hover, focus, active states)
- Page load with staggered reveals for card grids
- Loading feedback (skeleton screens, not spinners for content areas)
- Error/success feedback on forms

**Performance rules:**
- Only animate compositor properties (`transform`, `opacity`)
- Never animate layout properties (`width`, `height`, `margin`, `padding`)
- Maximum duration: 200ms for interaction feedback, 300ms for page transitions
- Always respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Approved hover effects:**
```css
/* CTA hover - subtle lift */
.sovereignty-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 204, 0, 0.3);
}

/* Table row hover */
.summary-table tr:hover td {
    background: var(--color-gray-50);
}

/* Card hover */
.contact-card > div:hover {
    border-color: var(--color-accent);
    transition: border-color 0.15s ease-out;
}
```

### 8.5 Empty States & Loading

**Empty states** must have one clear next action:
```html
<div style="text-align: center; padding: 48px 20px;">
    <p style="font-size: 1.125rem; font-weight: 600;">No results found</p>
    <p style="color: var(--color-gray-500);">Try adjusting your search criteria.</p>
    <a href="/legal/" class="sovereignty-cta" style="margin-top: 16px;">Browse Legal Hub</a>
</div>
```

**Loading states**: Use structural skeletons matching the final layout, not spinners for content areas.

### 8.6 Anti-Patterns to Avoid

- **Never** auto-play videos or carousels (NN Group: carousels are ignored)
- **Never** use glassmorphism (reduces readability on content pages)
- **Never** use parallax scrolling (motion sickness, performance)
- **Never** use text over busy images without an overlay
- **Never** use body text smaller than `0.875rem` (14px) for accessibility
- **Never** rely on color alone as an indicator (always include text labels)

---

## 9. Accessibility Requirements

- WCAG 2.2 AA minimum
- `aria-label` on all icon-only buttons
- Keyboard navigation works for all interactive elements
- `prefers-reduced-motion` respected
- Color contrast ratios meet AA (4.5:1 for text, 3:1 for large text)
- No content hidden from screen readers that is visible to sighted users
- Password managers must work (never block paste)
- Minimum touch targets: 44×44px
- Focus indicators visible on all interactive elements
- Semantic HTML: use `<main>`, `<nav>`, `<footer>`, `<section>` correctly
- Skip-to-content link on pages with Ironclad navigation

---

## 10. EU Compliance Design Requirements

- Cookie consent banner before any tracking
- GDPR privacy notice accessible from every page (via Legal Hub in nav)
- EU AI Act: AI-generated content must be disclosed
- DSA: Notice & action channel accessible via footer
- NIS2: Security contact visible in footer or Legal Hub

---

## 11. Dark-Theme Legacy Pages

Four pages still use dark-theme styling (dark background `#0f172a`). These are maintained as-is but should be migrated to the light-theme Gamma standard during future updates:
- `data-security-policy/index.html`
- `data-handling-policy/index.html`
- `regulatory-notice/index.html`
- `investment-safety/index.html`

**Navigation status (as of Feb 2026):** The `landing-pages/dws10-com/` copies of these pages use Ironclad navigation. However, the source files in `dws10.com/` still use the old embedded navigation HTML and CSS (`nav-loader.js`), not `ironclad-nav.js`. The root folder files must be migrated first (test on Cloudflare Workers), then the `landing-pages/` copies updated — per the dual-folder workflow in CLAUDE.md. Migration to Ironclad nav and light-theme is tracked separately.

---

## References

- `UI_SKILLS_GAMMA.md` — Technical UI constraints (Tailwind, React, animations)
- `.claude/agents/ui-ux-designer.md` — UI/UX design critic agent (research-backed)
- `.claude/skills/ux-researcher-designer/` — UX research toolkit
- `.claude/skills/senior-frontend/` — Frontend development skill
- `docs/field-notes/2026-01-23-design-system-audit-navigation-gaps.md` — Design system audit
- `dws10.com/shared-assets/nav/ironclad-nav.js` — Gamma navigation implementation
- `dws10.com/legal/index.html` — Legal Hub reference implementation
- [Nielsen Norman Group](https://www.nngroup.com/) — UX research citations
- [Claude Code Templates](https://www.aitmpl.com/) — Skills and agents platform
