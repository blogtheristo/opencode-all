# 301 Redirect Strategy — Homepage Deployment & URL Migration

**Status:** Planning phase (ready to implement before production deployment)  
**Rule:** "301-uudelleenohjaukset pitää tehdä samassa julkaisussa kuin poisto" (Redirects must be published simultaneously with removals)  
**Priority:** Critical — SEO preservation, no 404 errors

---

## Overview

When content is removed or relocated:
1. Old URLs **must** issue HTTP 301 (Permanent Redirect) to new locations
2. 301 redirects **must** be published in the **same deployment** as content removal
3. Publishing without redirects causes 404 errors → SEO damage, lost authority

---

## Current URL Landscape

### lifetime.fi (Corporate Platform Site)
| Page | Current URL | Purpose | Status |
|------|---|---|---|
| Home | `lifetime.fi/` | Hero + product positioning | ✅ Updated with campaign messaging |
| About | `lifetime.fi/about/` | Corporate info | Not present (static content below hero) |
| Agents/Loops/Workflows | `lifetime.fi/agents-loops-workflows/` | Product deep-dive | ✅ Exists |
| Consulting | `lifetime.fi/` (section) | Service offering | ✅ Exists |

### dws10.com (Enterprise Product Platform)
| Page | Current URL | Purpose | Status |
|------|---|---|---|
| Home | `dws10.com/` | Enterprise sales landing | ✅ Exists |
| About | `dws10.com/about/` | Company background | ✅ NEWLY CREATED |
| Trust Center | `dws10.com/compliance/trust-center/` | Security/governance | ✅ Exists |
| Compliance | `dws10.com/compliance/` | Legal/regulatory docs | ✅ Exists |

### Campaign Pages
| Page | Current URL | Status |
|------|---|---|
| A5 Campaign | `/campaigns/a5-kampanja-kaksipuolinen.html` | ✅ Created on both lifetime.fi & dws10.com |
| Product: WEB-STARTER | `/products/lifetime-web-starter.html` | ✅ Created |
| Product: WEBSTORE-MINI | `/products/lifetime-webstore-mini.html` | ✅ Created |

---

## Redirect Mappings

### Phase 1: Immediate (No Current Removals)

**Current deployment (PR #2053) introduces NO removals.** Redirect strategy is **preparatory** for future phases.

**Affected pages:**
- lifetime.fi hero section (updated, not removed)
- Campaign links (new content)
- Product pages (new content)

**Action:** No redirects required for current deployment.

### Phase 2: Future - If lifetime.fi Focus Narrows to SME

**Scenario:** If lifetime.fi becomes SME-only (removing B2B/enterprise content), redirects would be:

| Old URL | New URL | Reason | HTTP Code |
|---------|---------|--------|-----------|
| `lifetime.fi/agents-loops-workflows/` | `dws10.com/dws-iq-6/` (TBD) | Enterprise content moves to dws10.com | 301 |
| `lifetime.fi/` (if full content moves) | `dws10.com/` | Platform consolidation | 301 |

**Status:** Conditional — requires explicit decision from HIC.

### Phase 3: Future - Product Consolidation

**Scenario:** If product pages are reorganized:

| Old URL | New URL | Reason | HTTP Code |
|---------|---------|--------|-----------|
| `dws10.com/buy/page3/` (if retired) | `dws10.com/buy/` | Page consolidation | 301 |
| `dws10.com/products/lifetime-*.html` (if moved) | `/products/<category>/lifetime-*.html` | Reorganization | 301 |

**Status:** Conditional — requires reorganization decision.

---

## Implementation Strategy

### When Removing or Relocating Content

**ALWAYS follow this sequence:**

1. **Identify** the page(s) being removed or relocated
2. **Map** old URLs → new URLs (or home page as fallback)
3. **Create** redirect rule in hosting config:
   - For Cloudflare Pages (current): Use `_redirects` file (syntax below)
   - For other hosting: Use web server config (nginx, Apache, or hosting provider rules)

### _redirects File Format (Cloudflare Pages)

```
# A5 Campaign deployment redirects (if content moves)
/campaigns/a5-kampanja-kaksipuolinen-old/ /campaigns/a5-kampanja-kaksipuolinen/ 301
/old-product-path/ /products/lifetime-web-starter.html 301

# Preserve authority for high-traffic pages (if moved)
/agents-loops-workflows/ /dws10.com/dws-iq-6/ 301
```

**File location:** `dws10.com/_redirects` and `lifetime.fi/_redirects`

### Git & Deployment Workflow

```bash
# 1. Create _redirects file with mappings
touch dws10.com/_redirects

# 2. Add to git
git add dws10.com/_redirects

# 3. Commit (same commit as content removal, if any)
git commit -m "Add redirects for homepage migration

- lifetime.fi → dws10.com content migration
- Preserve authority and SEO for moved pages
- Implement simultaneously with content removal per CLAUDE.md rule"

# 4. Push to branch
git push origin claude/a5-kampanja-kaksipuolinen-followup-17ser8

# 5. Merge (no separate PR for redirects if in main feature PR)
```

---

## Current Deployment Checklist (PR #2053)

- [ ] Campaign page created and tested (`/campaigns/a5-kampanja-kaksipuolinen.html`)
- [ ] lifetime.fi hero updated with campaign messaging
- [ ] Product detail pages functional (`/products/lifetime-*.html`)
- [ ] Checkout payment tested with real payment ⏳ **PENDING** (blocker)
- [ ] No old URLs being removed in this deployment
- [ ] **Redirect file:** Not needed for this deployment (no removals)

---

## SEO Impact Analysis

### Current Deployment (No Redirects Needed)

| URL | Status | SEO Impact |
|-----|--------|-----------|
| `lifetime.fi/` | Updated (hero section) | ✅ No impact (same URL) |
| `lifetime.fi/agents-loops-workflows/` | Unchanged | ✅ No impact |
| `/campaigns/a5-kampanja-kaksipuolinen.html` | New | ✅ Positive (new content) |
| `/products/lifetime-*.html` | New | ✅ Positive (new content) |

### If Future Removals Occur (Redirects Critical)

| Scenario | With Redirects | Without Redirects |
|----------|---|---|
| Remove old product page | ✅ 301 preserves authority | ❌ 404 loses all authority |
| Move content to dws10.com | ✅ Traffic flows to new URL | ❌ Broken links, bad UX |
| Consolidate landing pages | ✅ Backlinks redirect | ❌ Backlinks break |

---

## Tools & Resources

### Cloudflare Pages `_redirects` Syntax
- **Reference:** https://developers.cloudflare.com/pages/configuration/redirects/
- **Format:** `<source> <destination> [<status_code>]`
- **Example:** `/old-page/ /new-page/ 301`
- **Wildcards:** `/old/*  /new/:splat 301` (captures path segments)

### Testing Redirects

```bash
# After deployment, verify redirects work:
curl -I https://lifetime.fi/old-url
# Should return 301 with Location header pointing to new URL

curl -I https://dws10.com/old-url
# Should return 301 with Location header pointing to new URL
```

### SEO Monitoring

After deployment:
1. **Google Search Console:** Monitor crawl errors (should show redirects working)
2. **Backlink checkers:** Verify redirected URLs are indexed by new URL
3. **404 Monitoring:** Watch for unexpected 404 errors in logs

---

## Decision Points for HIC

**Choose one or more before proceeding:**

1. **Keep current structure** — lifetime.fi stays corporate, dws10.com stays enterprise, no removals
   - **Redirects needed:** None for current deployment
   - **Timeline:** Deploy now (after checkout testing passes)

2. **Narrow lifetime.fi to SME** — move B2B content to dws10.com
   - **Redirects needed:** YES (enterprise content → dws10.com)
   - **Timeline:** Plan redirect mapping, implement in same commit as removal

3. **Consolidate to single platform** — centralize on dws10.com
   - **Redirects needed:** YES (all lifetime.fi → dws10.com)
   - **Timeline:** Plan redirect mapping, implement in same commit as removal

---

## Next Steps

✅ **Current Status:** Redirect strategy documented, no redirects needed for current (PR #2053) deployment

⏳ **Blocker:** Checkout payment testing (see `.claude/checkouts-test-plan.md`)

📋 **Decision Pending:** Confirm with HIC whether URLs are changing. If yes, implement redirects in same deployment.

---

## Related Files
- Handoff: `.claude/handoffs/claude/a5-kampanja-kaksipuolinen-followup-17ser8.md`
- Testing: `.claude/checkouts-test-plan.md`
- Main campaign page: `dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`
- About page (new role separation): `dws10.com/about/index.html`
