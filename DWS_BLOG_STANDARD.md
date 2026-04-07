# DWS Blog Standard

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/nvidia-gtc-2026-notes-cYO48 | Date: 16.03.2026 | Changes: Initial creation — blog standard derived from 60 published posts across onelifetime.world, established patterns for post types, templates, meta tags, SEO, dual-folder sync

Session Links & References:
  - Claude Code (claude/nvidia-gtc-2026-notes-cYO48): https://github.com/blogtheristo/dws6/commits/claude/nvidia-gtc-2026-notes-cYO48

Document Status:
  - Created: 16.03.2026
  - Last Modified: 16.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-16
**Status:** Active
**Publication:** Lifetime Scope Journal (onelifetime.world/blog/)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Post Types](#2-post-types)
3. [File Structure & Naming](#3-file-structure--naming)
4. [Template System](#4-template-system)
5. [Meta Tags & SEO](#5-meta-tags--seo)
6. [Visual Design System](#6-visual-design-system)
7. [Navigation & Layout](#7-navigation--layout)
8. [Content Structure](#8-content-structure)
9. [Multilingual Strategy](#9-multilingual-strategy)
10. [Dual-Folder Sync Rule](#10-dual-folder-sync-rule)
11. [Blog Index Management](#11-blog-index-management)
12. [Quality Checklist](#12-quality-checklist)

---

## 1. Overview

The **Lifetime Scope Journal** is the DWS editorial platform published at `onelifetime.world/blog/`. All blog posts are static HTML files — no CMS, no build step. Posts use Tailwind CSS 4.1 (CDN) with a dark-mode-first design system.

**Brand:** "Turning 2050 goals into 2026 insights"

**Author:** Risto Anton (default)
**Publisher:** Lifetime Oy
**VAT:** FI07724079

---

## 2. Post Types

| Type | Location | Length | Use Case |
|------|----------|--------|----------|
| **Featured Post** | `posts/*.html` (root) | 250-400 lines | Deep dives, standards, architecture articles |
| **Campaign Post** | `posts/en/*.html`, `posts/fi/*.html` | 150-250 lines | Daily insights, 800-day campaign series |
| **Template** | `posts/_template-en.html`, `posts/_template-fi.html` | N/A | Starting point for new posts |

### Featured Post Conventions

- Root level in `posts/` directory (no language subdirectory)
- Slug-based filename: `topic-name-v1.html`
- Custom layout with multiple sections, pillar cards, code blocks
- No "Day X / 800" badge
- Examples: `kya-standard-v1.html`, `eu-regulation-harness-engineering.html`

### Campaign Post Conventions

- Language subdirectories: `posts/en/`, `posts/fi/`
- Filename pattern: `day-NNN-slug-description.html`
- "Day X / 800" campaign badge
- Bilingual pairs linked via `hreflang`
- Schema.org JSON-LD structured data

---

## 3. File Structure & Naming

```
onelifetime.world/
  blog/
    index.html              # Blog index with featured + campaign grid
    index-dynamic.html      # Dynamic variant
    post.html               # Single post template (unused, static preferred)
  posts/
    _template-en.html       # English template
    _template-fi.html       # Finnish template
    kya-standard-v1.html    # Featured post (root level)
    en/
      day-001-slug.html     # English campaign post
      market-signal-*.html  # English market signals
    fi/
      day-001-slug.html     # Finnish campaign post
      market-signal-*.html  # Finnish market signals
```

**Naming rules:**
- All lowercase, hyphens for word separation
- Featured posts: `topic-description.html` or `topic-v1.html`
- Campaign posts: `day-NNN-short-description.html`
- Market signals: `market-signal-topic-date.html`
- Never use `.md` in public site folders (CLAUDE.md rule)

---

## 4. Template System

Use `posts/_template-en.html` or `posts/_template-fi.html` as starting point.

**Placeholders:**

| Placeholder | Example Value |
|------------|---------------|
| `{{TITLE}}` | What Happens When Your ERP Vendor Gets Sold? |
| `{{DESCRIPTION}}` | 5 critical questions every CTO must ask... |
| `{{CATEGORY}}` | ERP Transition |
| `{{DATE_ISO}}` | 2026-03-16 |
| `{{DATE_DISPLAY}}` | March 16, 2026 |
| `{{DAY_NUMBER}}` | 1 |
| `{{FILENAME}}` | day-001-what-happens-when-erp-vendor-sold.html |
| `{{FI_FILENAME}}` | day-001-mita-tapahtuu-kun-erp-toimittaja-myydaan.html |
| `{{CONTENT}}` | Article body HTML |
| `{{RELATED_POSTS}}` | Related post cards HTML |

---

## 5. Meta Tags & SEO

Every post MUST include:

```html
<!-- Basic meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="...">
<meta name="author" content="Risto Anton">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="article">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="https://onelifetime.world/posts/...">
<meta property="og:site_name" content="Lifetime Scope Journal">
<meta property="article:published_time" content="2026-03-16">
<meta property="article:author" content="Risto Anton">
<meta property="article:section" content="...">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">

<!-- Multilingual -->
<link rel="alternate" hreflang="fi" href="...">
<link rel="alternate" hreflang="en" href="...">
<link rel="canonical" href="...">
```

### Schema.org JSON-LD (Campaign Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Person", "name": "Risto Anton", "url": "https://onelifetime.world" },
  "publisher": { "@type": "Organization", "name": "Lifetime Oy", "url": "https://dws10.com" },
  "datePublished": "2026-03-16",
  "mainEntityOfPage": "https://onelifetime.world/posts/en/...",
  "articleSection": "...",
  "inLanguage": "en"
}
```

---

## 6. Visual Design System

### Color Palette (Dark Mode First)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#0f172a` (slate-950) | Page background, footer |
| `--bg-secondary` | `#1e293b` (slate-800) | Nav, cards, sections |
| `--text-primary` | `#e2e8f0` (slate-100) | Headlines, H1/H2 |
| `--text-secondary` | `#cbd5e1` (slate-300) | Body text |
| `--text-muted` | `#94a3b8` (slate-400) | Metadata, captions |
| `--accent-cyan` | `#06b6d4` | Links, borders, glows |
| `--accent-blue` | `#2563eb` | CTAs, gradients |
| `--dws-gold` | `#d4a843` | Category badges, "Read Also" headers |
| `--amber-gradient` | `#f59e0b → #d97706` | Store button |

### CSS Components

```css
/* Pillar card — feature sections */
.pillar-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(6, 182, 212, 0.2);
  transition: border-color 0.3s ease, transform 0.3s ease;
}
.pillar-card:hover {
  border-color: rgba(6, 182, 212, 0.5);
  transform: translateY(-2px);
}

/* Hero text glow */
.hero-glow {
  text-shadow: 0 0 40px rgba(6, 182, 212, 0.3);
}

/* Post card — blog index */
.post-card:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.1);
}

/* Category badge */
.tag-badge {
  background: rgba(212, 168, 67, 0.15);
  color: #d4a843;
  border: 1px solid rgba(212, 168, 67, 0.25);
}

/* Callout box */
.callout {
  background: rgba(6, 182, 212, 0.1);
  border-left: 3px solid #06b6d4;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
}
```

### Body Background

```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
```

---

## 7. Navigation & Layout

### Sticky Nav (All Posts)

```html
<nav style="background: #1e293b;" class="sticky top-0 z-50 border-b border-gray-700">
  <div class="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
    <!-- Hamburger menu (left) -->
    <!-- Logo (center) -->
    <!-- Store CTA (right) -->
  </div>
  <!-- Mobile menu (hidden by default) -->
</nav>
```

**Menu items:** Blog, DWS IQ Platform, Store, Lifetime Consulting

### Content Width

- Article body: `max-w-3xl mx-auto px-4`
- Blog index: `max-w-lg mx-auto lg:max-w-none`

### Footer (All Posts)

```html
<footer class="border-t border-gray-700 py-8 text-center text-xs text-gray-500"
        style="background: #0f172a;">
  <p>&copy; 2026 Lifetime Oy &middot; VAT FI07724079 &middot; Helsinki, Finland</p>
  <p class="mt-1">
    <a href="https://dws10.com">DWS IQ Platform</a> &middot;
    <a href="https://dws10.com/buy">Store</a> &middot;
    <a href="/blog/">Blog</a>
  </p>
</footer>
```

---

## 8. Content Structure

### Article Body

```html
<div class="prose prose-invert max-w-none space-y-6" style="color: #cbd5e1;">
  <!-- Content here -->
</div>
```

### Heading Hierarchy

- `<h1>`: Post title (once, in header area)
- `<h2>`: Major sections (color: `#e2e8f0`)
- `<h3>`: Subsections (color: `#e2e8f0`)
- Never skip levels (no h1 → h3)

### Standard Sections

1. **Campaign badge** (campaign posts only): Category + Day counter
2. **Title + metadata**: Date, author, organization
3. **Divider**: `w-16 h-0.5` gradient line
4. **Article body**: `prose prose-invert`
5. **Newsletter CTA**: Subscribe box
6. **Related posts**: 2-column grid of pillar cards
7. **Footer**: Company info + links

### Link Styling

```html
<a class="text-cyan-400 hover:underline" href="...">Link text</a>
```

---

## 9. Multilingual Strategy

- English posts: `posts/en/` with `og:locale="en_US"`, `inLanguage: "en"`
- Finnish posts: `posts/fi/` with `og:locale="fi_FI"`, `inLanguage: "fi"`
- Both versions link via `hreflang` tags
- Canonical URL points to English version
- Featured posts: English only (root `posts/`), Finnish translation optional

---

## 10. Dual-Folder Sync Rule

**CRITICAL:** Every blog post update MUST sync to both locations in the same commit.

| Source of Truth | Production Copy |
|----------------|----------------|
| `onelifetime.world/posts/` | `landing-pages/onelifetime-world/posts/` |
| `onelifetime.world/blog/` | `landing-pages/onelifetime-world/blog/` |

**Workflow:**
1. Create/edit in `onelifetime.world/posts/`
2. Copy to `landing-pages/onelifetime-world/posts/` in same commit
3. Verify: `diff onelifetime.world/posts/FILE landing-pages/onelifetime-world/posts/FILE` → empty

---

## 11. Blog Index Management

Blog index at `onelifetime.world/blog/index.html`:

- **Featured section**: 4 posts in 2x2 grid (manually curated)
- **Campaign section**: Filterable grid with category buttons
- **Filter mechanism**: `data-category` attributes, JavaScript toggle
- **Categories**: ERP Transition, EU Compliance, AI & Automation, Industrial IoT, Market Signals

When adding a **featured post**, update the featured section in `blog/index.html`. Campaign posts auto-appear if they follow the grid pattern.

---

## 12. Quality Checklist

Before publishing any blog post:

- [ ] HTML validates (no unclosed tags)
- [ ] All meta tags present (og:title, og:description, og:type, og:url, article:published_time, article:author)
- [ ] Schema.org JSON-LD for campaign posts
- [ ] `hreflang` links for bilingual posts
- [ ] Canonical URL set
- [ ] Navigation matches current pattern (hamburger + logo + Store CTA)
- [ ] Footer matches standard (copyright + VAT + links)
- [ ] Newsletter CTA section included
- [ ] Related posts section with 2 relevant links
- [ ] Dark mode colors only (no light backgrounds)
- [ ] Mobile responsive (tested at 375px width conceptually)
- [ ] Synced to `landing-pages/onelifetime-world/` in same commit
- [ ] No `.md` files in public directories
- [ ] No raw GitHub URLs (private repo rule)

---

*Standard derived from analysis of 60 published posts. Updated as patterns evolve.*
