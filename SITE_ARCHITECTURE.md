# Lifetime Site Architecture & Cross-Linking Strategy

**Version:** 1.0
**Date:** November 23, 2025
**Author:** Lifetime Oy

---

## Overview

Lifetime operates a multi-site architecture with clear separation of concerns between the company brand and product platforms.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      LIFETIME ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  COMPANY LAYER (Squarespace)                                │   │
│   │                                                              │   │
│   │  lifetime.fi                                                 │   │
│   │  ├── Company information                                     │   │
│   │  ├── Consulting services                                     │   │
│   │  ├── Blog / News                                             │   │
│   │  ├── Team / About                                            │   │
│   │  └── Contact                                                 │   │
│   │                                                              │   │
│   │  Platform: Squarespace                                       │   │
│   │  Benefits: Easy manual editing, beautiful templates          │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              ↓ Links to                              │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  PRODUCT LAYER (GitHub + Cloudflare Pages)                  │   │
│   │                                                              │   │
│   │  onelifetime.world          dws10.com           dws6.com    │   │
│   │  ├── Community Hub          ├── Platform        ├── LLM API │   │
│   │  ├── PWA Application        ├── SaaS Product    ├── Docs    │   │
│   │  ├── Documentation          ├── Demo Request    └── Status  │   │
│   │  └── Early Access           └── Pricing                      │   │
│   │                                                              │   │
│   │  Platform: GitHub → Cloudflare Pages (auto-deploy)          │   │
│   │  Benefits: Version control, CI/CD, developer-friendly       │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Site Purposes

### lifetime.fi (Squarespace)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Company brand, consulting, thought leadership |
| **Platform** | Squarespace |
| **Audience** | Investors, partners, enterprise prospects |
| **Content** | Blog, team, services, portfolio |
| **Updates** | Manual (Squarespace editor) |
| **DNS** | Squarespace nameservers |

**Why Squarespace:**
- Beautiful templates for brand presentation
- Easy manual content editing
- Built-in blog, SEO, analytics
- No developer needed for updates

### onelifetime.world (GitHub + Cloudflare)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Community hub, PWA, user onboarding |
| **Platform** | GitHub → Cloudflare Pages |
| **Audience** | Construction professionals, early adopters |
| **Content** | Community features, documentation, app |
| **Updates** | Git push → auto-deploy |
| **DNS** | Cloudflare |

**Why GitHub/Cloudflare:**
- Version-controlled content
- Automatic deployments on push
- Edge delivery (200+ locations)
- Free hosting with custom domain

### dws10.com (GitHub + Cloudflare)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Platform product site, SaaS marketing |
| **Platform** | GitHub → Cloudflare Pages |
| **Audience** | Enterprise buyers, technical evaluators |
| **Content** | Product features, pricing, demo requests |
| **Updates** | Git push → auto-deploy |
| **DNS** | Cloudflare |

**Why GitHub/Cloudflare:**
- Same as onelifetime.world
- Consistent deployment pipeline
- Easy A/B testing via branches

### dws6.com (GitHub + Cloudflare)

| Attribute | Value |
|-----------|-------|
| **Purpose** | LLM inference API, developer docs |
| **Platform** | GitHub → Cloudflare Pages (frontend) + Cloud Run (API) |
| **Audience** | Developers, API integrators |
| **Content** | API documentation, status page |
| **Updates** | Git push → auto-deploy |
| **DNS** | Cloudflare |

---

## Cross-Linking Matrix

### Navigation Links

| From Site | Links To | Purpose |
|-----------|----------|---------|
| **lifetime.fi** | onelifetime.world | "Join our community" |
| **lifetime.fi** | dws10.com | "Explore DWS IQ Platform" |
| **onelifetime.world** | lifetime.fi | "About Lifetime Oy" |
| **onelifetime.world** | dws10.com | "Learn about the platform" |
| **dws10.com** | lifetime.fi | "About the company" |
| **dws10.com** | onelifetime.world | "Join community" |
| **dws6.com** | dws10.com | "Back to platform" |

### Footer Links (All Sites)

```html
<!-- Standard footer for all product sites -->
<footer>
  <p>© 2026 <a href="https://lifetime.fi">Lifetime Oy</a> · Helsinki, Finland. All rights reserved.</p>
  <div class="footer-links">
    <a href="https://lifetime.fi">Company</a>
    <a href="https://onelifetime.world">Community</a>
    <a href="https://dws10.com">Platform</a>
    <a href="https://www.linkedin.com/in/ristopaarni">LinkedIn</a>
    <a href="https://github.com/enterprises/Lifetime-oy">GitHub</a>
    <a href="mailto:risto@lifetime.fi">Contact</a>
  </div>
</footer>
```

---

## Recommended Links for lifetime.fi (Squarespace)

Add these links to your Squarespace navigation or footer:

### Primary Navigation

```
Products
├── DWS IQ Platform → https://dws10.com
└── Community → https://onelifetime.world
```

### Footer Links

```
Products:
- DWS IQ Platform: https://dws10.com
- Community: https://onelifetime.world
- API Docs: https://api.dws6.com/docs

Connect:
- LinkedIn: https://www.linkedin.com/in/ristopaarni
- GitHub: https://github.com/enterprises/Lifetime-oy
- Crunchbase: https://www.crunchbase.com/organization/lifetime-oy
- Peachscore: https://app.peachscore.com/company/lifetime-oy
```

### Call-to-Action Buttons

Add to homepage hero section:

```
[Explore Platform] → https://dws10.com
[Join Community] → https://onelifetime.world
```

---

## SEO Considerations

### Internal Linking Benefits

1. **Authority flow** - lifetime.fi (established) passes trust to new domains
2. **Discovery** - Search engines find all sites through cross-links
3. **User journey** - Clear paths between company info and products

### Recommended Anchor Text

| Link Target | Good Anchor Text | Avoid |
|-------------|------------------|-------|
| onelifetime.world | "Join our AI construction community" | "Click here" |
| dws10.com | "DWS IQ Platform" or "Agentic AI for construction" | "Our product" |
| lifetime.fi | "Lifetime Oy" or "About the company" | "Main site" |

### Schema Markup (for Squarespace)

Add to lifetime.fi Code Injection (Settings → Advanced → Code Injection):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lifetime Oy",
  "url": "https://lifetime.fi",
  "logo": "https://lifetime.fi/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/lifetime-oy",
    "https://github.com/enterprises/Lifetime-oy",
    "https://www.crunchbase.com/organization/lifetime-oy"
  ],
  "subOrganization": [
    {
      "@type": "Product",
      "name": "DWS IQ Platform",
      "url": "https://dws10.com"
    },
    {
      "@type": "WebSite",
      "name": "One Lifetime World",
      "url": "https://onelifetime.world"
    }
  ]
}
</script>
```

---

## Deployment Workflow

### Squarespace (lifetime.fi)

```
Manual Edit → Preview → Publish
```

No automation needed - that's the benefit of Squarespace.

### GitHub Sites (product domains)

```
Edit in VS Code/GitHub → git push → Cloudflare Pages auto-deploy
     ↓                      ↓              ↓
   Local                  GitHub        Live in ~30 seconds
```

### Repository Structure

```
blogtheristo/dws6 (GitHub)
├── landing-pages/
│   ├── onelifetime-world/
│   │   └── index.html        → onelifetime.world
│   └── dws10-com/
│       └── index.html        → dws10.com
├── lifetime-agent-foundry/
│   └── AGENT_FOUNDRY.md
├── SITE_ARCHITECTURE.md      ← This document
└── ...
```

---

## DNS Configuration Summary

| Domain | Provider | Nameservers | SSL |
|--------|----------|-------------|-----|
| lifetime.fi | Squarespace | Squarespace NS | Auto (Squarespace) |
| onelifetime.world | Cloudflare | Cloudflare NS | Full (strict) |
| dws10.com | Cloudflare | Cloudflare NS | Full (strict) |
| dws6.com | Cloudflare | Cloudflare NS | Full (strict) |

---

## Maintenance Schedule

| Task | Frequency | Who |
|------|-----------|-----|
| Update lifetime.fi content | As needed | CEO (manual) |
| Update product landing pages | As needed | Dev team (git push) |
| Check cross-links work | Monthly | Automated (see below) |
| Review analytics | Weekly | Marketing |

### Automated Link Checker (GitHub Action)

Add to `.github/workflows/check-links.yml`:

```yaml
name: Check Cross-Links

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check links
        uses: lycheeverse/lychee-action@v1
        with:
          args: >
            https://lifetime.fi
            https://onelifetime.world
            https://dws10.com
            https://dws6.com
          fail: true
```

---

## Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Keep Squarespace for lifetime.fi** | Yes | Easy manual editing, good for brand |
| **Use GitHub for products** | Yes | Version control, auto-deploy, developer-friendly |
| **Cross-link all sites** | Yes | SEO, user journey, brand cohesion |
| **Sync Squarespace to GitHub** | No | Different purposes, unnecessary complexity |

---

**Document Version:** 1.0
**Last Updated:** November 23, 2025
**Repository:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6)
