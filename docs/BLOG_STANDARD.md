# Blog Standard — OneLifetime.World

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/liquidity-engine-guide-P6sVY | Date: 28.03.2026 | Changes: Added social share section (LinkedIn, X, Email, Copy Link), registered in CLAUDE.md standards table
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/liquidity-engine-guide-P6sVY | Date: 28.03.2026 | Changes: Initial creation — blog post standard for onelifetime.world/posts, covering structure, nav injection, product cards, dual-folder sync, and post registry

Session Links & References:
  - Claude Code (claude/liquidity-engine-guide-P6sVY): https://github.com/blogtheristo/dws6

Document Status:
  - Created: 28.03.2026
  - Last Modified: 28.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.1
**Effective Date:** 2026-03-28
**Last Updated:** 2026-03-28
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Locations](#2-file-locations)
3. [Post Registry](#3-post-registry)
4. [HTML Template Structure](#4-html-template-structure)
5. [Required Meta Tags](#5-required-meta-tags)
6. [Footer Navigation (Prev/Next)](#6-footer-navigation-prevnext)
7. [Product Cards](#7-product-cards)
8. [Injection Script](#8-injection-script)
9. [Checklist for Every New Post](#9-checklist-for-every-new-post)
10. [Social Share Section](#10-social-share-section)
11. [Style Tokens](#11-style-tokens)

---

## 1. Overview

All blog posts for OneLifetime.World live as **HTML files** (never `.md`) in `onelifetime.world/posts/`. Each post MUST be synced to `landing-pages/onelifetime-world/posts/` in the same commit (dual-folder rule from CLAUDE.md).

Every post gets:
- Prev/Next navigation linking to chronological neighbours
- Three product cards linking to the DWS10 store
- Consistent nav, footer, and meta tags

---

## 2. File Locations

| Purpose | Path |
|---------|------|
| Source of truth | `onelifetime.world/posts/<slug>.html` |
| Production copy | `landing-pages/onelifetime-world/posts/<slug>.html` |
| EN template | `onelifetime.world/posts/_template-en.html` |
| FI template | `onelifetime.world/posts/_template-fi.html` |
| EN series posts | `onelifetime.world/posts/en/day-NNN-<slug>.html` |
| FI series posts | `onelifetime.world/posts/fi/day-NNN-<slug>.html` |
| Nav injection script | `scripts/inject-blog-nav.cjs` |

---

## 3. Post Registry (Root-Level)

Chronological order. Update this table when adding/removing posts.

| # | File | Title | Date |
|---|------|-------|------|
| 1 | `business-case-logistics.html` | Business Case: The Intelligent Fleet Pilot | Dec 2025 |
| 2 | `kya-standard-v1.html` | Field Note: KYA Standard for Autonomous Control Rooms | Mar 2026 |
| 3 | `eu-regulation-harness-engineering.html` | EU Regulation Makes Better AI | 14 Mar 2026 |
| 4 | `eu-ai-act-compliance-ready.html` | EU AI Act: Compliance Ready | 15 Mar 2026 |
| 5 | `buyers-note-harness-engineering.html` | Buyer's Note: Harness Engineering | 15 Mar 2026 |
| 6 | `harness-engineering-investor-note.html` | Investor Note: Harness Engineering | 15 Mar 2026 |
| 7 | `nvidia-gtc-2026-dws-roadmap-impact.html` | NVIDIA GTC 2026: Industrial AI Roadmaps | 16 Mar 2026 |
| 8 | `validated-mock-data-principle.html` | The Validated Mock Data Principle | 16 Mar 2026 |
| 9 | `closing-the-bom-gap-cad-erp-sync.html` | Closing the BOM Gap: CAD-ERP Sync | 26 Mar 2026 |
| 10 | `liquidity-engine-captain-seats.html` | The Liquidity Engine: Captain Seats | 28 Mar 2026 |

---

## 4. HTML Template Structure

Every blog post follows this skeleton:

```
<!DOCTYPE html>
<html lang="en">
<head>
    [Meta tags — see §5]
    [Tailwind CDN]
    [Custom styles]
    [JSON-LD structured data]
</head>
<body>
    <nav>          [Hamburger menu — same as _template-en.html]
    <main>
        <section>  [Hero: category badge, date, title, subtitle]
        <section>  [Article content]
            <article>
                [Content sections with h2 headings]
                [Insight cards, metric cards, comparison blocks]
                [Newsletter CTA]
                [Read Also cards]
            </article>
        </section>
    </main>
    [Post Navigation + Products — auto-injected by script]
    <footer>       [Copyright, links]
</body>
</html>
```

---

## 5. Required Meta Tags

Every post MUST include:

```html
<meta name="description" content="...">
<meta name="author" content="Risto Anton Paarni">
<meta name="date" content="YYYY-MM-DD">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="article">
<meta property="og:url" content="https://onelifetime.world/posts/<slug>.html">
<meta property="og:image" content="https://dws10.com/DWS_IQ2026.png">
<meta property="og:site_name" content="OneLifetime.World">
<meta property="article:published_time" content="YYYY-MM-DD">
<meta property="article:author" content="Risto Anton Paarni">
<meta property="article:section" content="[category]">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://onelifetime.world/posts/<slug>.html">
```

Plus JSON-LD `Article` schema (see template).

---

## 6. Footer Navigation (Prev/Next)

Auto-injected by `scripts/inject-blog-nav.cjs`. The script:

1. Reads the `posts` array (chronological order) defined at the top of the script
2. For each post, generates prev/next links based on array position
3. Inserts the nav block before the `<!-- Footer -->` comment (or `<footer>` tag)
4. Is **idempotent** — safe to re-run; removes old injection before re-inserting

### Adding a New Post to Navigation

1. Add the post to the `posts` array in `scripts/inject-blog-nav.cjs` in chronological position
2. Run `node scripts/inject-blog-nav.cjs`
3. Copy all changed files to `landing-pages/onelifetime-world/posts/`

### Nav HTML Structure

```html
<nav class="flex justify-between items-center pt-8 border-t border-gray-700">
    <a href="/posts/prev.html">← Previous Title</a>
    <a href="/posts/next.html">Next Title →</a>
</nav>
```

- First post: no prev link (empty span)
- Last post: no next link (empty span)
- Links use truncated titles to prevent overflow on mobile

---

## 7. Product Cards

Three product cards appear below the prev/next nav in every post:

| # | Product | Price | Badge | URL |
|---|---------|-------|-------|-----|
| 1 | DWS IQ Platform | €4,999 | Flagship | `/products/dwsiq.html` |
| 2 | Climate Reporting Bundle | €6,500 | Best Value | `/products/bundle.html` |
| 3 | Firehorse Omnichannel | €499 | Start Here | `/products/firehorse-omnichannel.html` |

Cards use the `metric-card` style pattern (dark glass background, cyan border on hover, translateY lift).

To change products: edit the `products` array in `scripts/inject-blog-nav.cjs` and re-run.

---

## 8. Injection Script

```bash
# Run from repo root
node scripts/inject-blog-nav.cjs

# Then sync to landing-pages
for f in *.html; do
  cp "onelifetime.world/posts/$f" "landing-pages/onelifetime-world/posts/$f"
done
```

The script is located at `scripts/inject-blog-nav.cjs` and:
- Processes only root-level posts (not `en/` or `fi/` subdirectories)
- Uses regex removal for idempotent re-runs
- Supports both `<!-- Footer -->` comment and direct `<footer>` tag markers

---

## 9. Checklist for Every New Post

- [ ] Create HTML in `onelifetime.world/posts/<slug>.html`
- [ ] Include all required meta tags (§5)
- [ ] Include JSON-LD structured data
- [ ] Use consistent nav/footer from template
- [ ] Add post to `scripts/inject-blog-nav.cjs` posts array
- [ ] Run `node scripts/inject-blog-nav.cjs`
- [ ] Copy ALL changed files to `landing-pages/onelifetime-world/posts/`
- [ ] Verify: `diff onelifetime.world/posts/<slug>.html landing-pages/onelifetime-world/posts/<slug>.html` → empty
- [ ] Commit source + landing-pages copy in SAME commit
- [ ] Update this registry table (§3)
- [ ] Never create posts as `.md` files (CLAUDE.md rule)

---

## 10. Social Share Section

Every post includes a social share bar between the prev/next nav and the product cards. Auto-injected by the script.

### Share Channels

| Channel | Icon | Behavior |
|---------|------|----------|
| LinkedIn | LinkedIn logo (SVG) | Opens LinkedIn share dialog with post URL |
| X (Twitter) | X logo (SVG) | Opens tweet compose with title + URL + @LifetimeOy |
| Email | Envelope (SVG) | Opens `mailto:` with subject + body + URL |
| Copy Link | Link icon + "Copy link" | Copies URL to clipboard, shows "Copied!" confirmation |

### Design

- Icons are 36x36px circular buttons with dark glass background
- Each has a brand-color hover state (LinkedIn blue, X blue, cyan for email/copy)
- SVG icons use `#94a3b8` (muted gray) fill
- "Copy link" button uses `navigator.clipboard.writeText()` with 2-second feedback

### Privacy

- No tracking pixels or analytics in share links
- LinkedIn and X share dialogs are native platform dialogs (no SDK loaded)
- No third-party JavaScript loaded for sharing

---

## 11. Style Tokens

Consistent across all posts (from DWS Brand Standard dark theme):

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f172a → #1e293b → #0f172a` | Body gradient |
| Text primary | `#f1f5f9` | Body text |
| Text secondary | `#cbd5e1` | Article prose |
| Text muted | `#94a3b8` | Captions, dates |
| Accent cyan | `#06b6d4` | Links, highlights, borders |
| Accent gold | `#d4a843` | Badges, section headers |
| Accent blue | `#2563eb` | CTAs, buttons |
| Card background | `rgba(30,41,59,0.9)` | Metric/product cards |
| Card border | `rgba(6,182,212,0.2)` | Default state |
| Card border hover | `rgba(6,182,212,0.5)` | Hover state |
| Nav background | `#1e293b` | Sticky nav bar |

---

*Document maintained by DWS IQ 6 Platform team. For questions, contact risto.paarni@lifetime.fi*
