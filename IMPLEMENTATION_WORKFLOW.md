# Site Quality Standards Implementation Workflow

**Version:** 1.0
**Date:** 2025-12-26
**Purpose:** Step-by-step workflow for implementing quality standards on each page

---

## Workflow Overview

```
┌─────────────────┐
│   Preparation   │
└────────┬────────┘
         │
┌────────▼────────┐
│   Backup Page   │
└────────┬────────┘
         │
┌────────▼────────┐
│ Update Component│
└────────┬────────┘
         │
┌────────▼────────┐
│  Test & Verify  │
└────────┬────────┘
         │
┌────────▼────────┐
│   Commit & Push │
└─────────────────┘
```

---

## Phase 1: Preparation

### 1.1 Select Page to Update

**Priority Order:**
```
Priority 1 (Critical): Homepage, Store
Priority 2 (High):     Product pages
Priority 3 (Medium):   Company pages
Priority 4 (Low):      Legal/Admin pages
```

**Checklist:**
- [ ] Identify page to update
- [ ] Note current page issues
- [ ] Take screenshot of current state
- [ ] Check page traffic stats (if available)

### 1.2 Review Current Implementation

**Questions to answer:**
- [ ] Does page have custom navigation?
- [ ] How many different CTA styles exist?
- [ ] What logo is used?
- [ ] Are there any unique features to preserve?
- [ ] Are there any forms or interactive elements?

**Document findings:**
```
Page: [page path]
Current Issues:
- Issue 1: [description]
- Issue 2: [description]

Features to Preserve:
- Feature 1: [description]
- Feature 2: [description]
```

---

## Phase 2: Backup

### 2.1 Create Backup

```bash
# Create backup directory if it doesn't exist
mkdir -p backups/pre-quality-standards/

# Backup the page
cp [page-path] backups/pre-quality-standards/[page-name]-backup-$(date +%Y%m%d).html

# Verify backup exists
ls -lh backups/pre-quality-standards/
```

**Checklist:**
- [ ] Backup file created
- [ ] Backup file size matches original
- [ ] Backup filename includes date

### 2.2 Document Current State

Create a file: `backups/pre-quality-standards/[page-name]-NOTES.md`

```markdown
# Page: [page-path]
# Backup Date: [date]
# Backed up by: [name]

## Current Issues
1. [Issue]
2. [Issue]

## Planned Changes
1. [Change]
2. [Change]

## Features to Preserve
- [Feature]
- [Feature]
```

---

## Phase 3: Update Navigation

### 3.1 Remove Old Navigation

**Find and remove:**
```html
<!-- OLD NAVIGATION - Remove this entire block -->
<header style="...">
  <nav>
    <!-- Old navigation code -->
  </nav>
</header>
```

**Checklist:**
- [ ] Removed `<header>` with old navigation
- [ ] Removed associated `<style>` for old nav
- [ ] Removed associated `<script>` for old nav
- [ ] Kept any unique elements (banners, alerts, etc.)

### 3.2 Add Shared Navigation

**Add to page (before main content):**
```html
<!-- Shared Navigation Component -->
<div id="main-navigation"></div>

<!-- Navigation Configuration -->
<script>
  window.NAV_CONFIG = {
    variant: 'dws-iq',        // or 'onelifetime'
    activePage: 'home'         // current page identifier
  };
</script>

<!-- Load Navigation -->
<script src="/shared/components/navigation.js"></script>
```

**Checklist:**
- [ ] Added `<div id="main-navigation"></div>`
- [ ] Added configuration script
- [ ] Set correct variant (dws-iq or onelifetime)
- [ ] Set correct activePage
- [ ] Added navigation.js script tag

### 3.3 Link CTA Styles

**Add to `<head>` section:**
```html
<link rel="stylesheet" href="/shared/components/cta-buttons.css">
```

**Checklist:**
- [ ] CSS link added to `<head>`
- [ ] Path is correct (`/shared/components/cta-buttons.css`)

---

## Phase 4: Update CTAs

### 4.1 Identify All CTAs

**Scan page for:**
- Primary action buttons (Book Demo, Get Started, Buy Now)
- Secondary action buttons (Learn More, Contact, View)
- Text links that should be tertiary CTAs

**Document CTAs found:**
```
Section: Hero
- CTA 1: "Book Demo" → Should be PRIMARY
- CTA 2: "Learn More" → Should be SECONDARY

Section: Features
- CTA 1: "Get Started" → Should be PRIMARY

[etc.]
```

**Checklist:**
- [ ] All CTAs identified
- [ ] CTA hierarchy determined
- [ ] Conversion goals defined

### 4.2 Update Primary CTAs

**Replace old buttons:**
```html
<!-- OLD -->
<button style="background: #e53e3e; ...">Book Demo</button>

<!-- NEW -->
<a
  href="/#booking"
  class="cta-button cta-primary"
  id="hero-cta-book-demo"
  data-analytics="cta-click"
  data-cta-location="hero"
  data-cta-type="primary"
  data-conversion-goal="demo-booking"
>
  Book a Demo
</a>
```

**Checklist:**
- [ ] All primary CTAs updated
- [ ] Max 1 primary per section
- [ ] IDs are unique
- [ ] Analytics attributes added
- [ ] Copy follows guidelines (action-oriented, <3 words)

### 4.3 Update Secondary CTAs

**Replace old buttons:**
```html
<!-- OLD -->
<a href="/products/" style="border: 1px solid...">Learn More</a>

<!-- NEW -->
<a
  href="/products/"
  class="cta-button cta-secondary"
  id="hero-cta-learn-more"
  data-analytics="cta-click"
  data-cta-location="hero"
  data-cta-type="secondary"
>
  Learn More
</a>
```

**Checklist:**
- [ ] All secondary CTAs updated
- [ ] Max 2 secondary per section
- [ ] Proper hierarchy maintained

### 4.4 Update Tertiary CTAs

**Replace text links:**
```html
<!-- OLD -->
<a href="/docs/" style="text-decoration: underline">Documentation</a>

<!-- NEW -->
<a href="/docs/" class="cta-button cta-tertiary">
  Read Documentation →
</a>
```

**Checklist:**
- [ ] Text links converted to tertiary CTAs
- [ ] Icons added where appropriate (→)

### 4.5 Group CTAs Properly

**Use CTA groups:**
```html
<div class="cta-group cta-group-center">
  <a href="#" class="cta-button cta-primary">Primary Action</a>
  <a href="#" class="cta-button cta-secondary">Secondary Action</a>
</div>
```

**Checklist:**
- [ ] CTAs grouped with `.cta-group`
- [ ] Proper alignment (center, start, end)
- [ ] Responsive stacking on mobile

---

## Phase 5: Update Hero Section

### 5.1 Standard Hero Pattern

**Replace old hero with standard pattern:**
```html
<section class="hero">
  <div class="hero-container">
    <h1 class="hero-title">
      Clear Value Proposition (10 Words Max)
    </h1>

    <p class="hero-description">
      Supporting text explaining what you offer and who it's for.
      Keep to 1-2 sentences maximum.
    </p>

    <div class="cta-group cta-group-center">
      <a href="/#booking" class="cta-button cta-primary">Book a Demo</a>
      <a href="/products/" class="cta-button cta-secondary">Learn More</a>
    </div>

    <p class="hero-social-proof">
      Trusted by 500+ companies worldwide
    </p>
  </div>
</section>
```

**Checklist:**
- [ ] H1 title is clear and concise
- [ ] Description is 1-2 sentences
- [ ] Primary + Secondary CTA included
- [ ] Social proof added (optional)
- [ ] Proper CSS classes used

---

## Phase 6: Testing

### 6.1 Visual Testing

**Test at these breakpoints:**
```
Mobile:  320px, 375px, 414px
Tablet:  768px, 834px, 1024px
Desktop: 1280px, 1440px, 1920px
```

**Checklist:**
- [ ] Page loads without errors
- [ ] Navigation displays correctly
- [ ] Logo displays correctly
- [ ] No horizontal scrolling
- [ ] No layout shifts
- [ ] All CTAs visible above fold (desktop)
- [ ] Text is readable at all sizes

### 6.2 Functional Testing

**Test all interactions:**
```
Navigation:
- [ ] Hamburger menu opens/closes (mobile)
- [ ] Dropdowns open on hover (desktop)
- [ ] Dropdowns open on click (mobile)
- [ ] Logo links to homepage
- [ ] All menu items clickable

CTAs:
- [ ] All primary CTAs clickable
- [ ] All secondary CTAs clickable
- [ ] Hover states work
- [ ] Links go to correct destinations

Forms (if any):
- [ ] Forms submit correctly
- [ ] Validation works
- [ ] Error messages display
```

### 6.3 Keyboard Navigation Testing

**Test keyboard accessibility:**
```
- [ ] Tab through all navigation items
- [ ] Tab through all CTAs
- [ ] Enter key activates links/buttons
- [ ] Arrow keys navigate dropdowns
- [ ] Escape closes dropdowns
- [ ] Focus indicators visible
- [ ] No keyboard traps
```

### 6.4 Browser Testing

**Test in these browsers:**
```
Desktop:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

Mobile:
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)
```

### 6.5 Performance Testing

**Check performance:**
```bash
# Open Chrome DevTools
# Run Lighthouse audit

Target Scores:
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90
```

**Check specific metrics:**
- [ ] Page load < 3 seconds (3G)
- [ ] No console errors
- [ ] No 404 errors in network tab
- [ ] Images optimized

### 6.6 Analytics Verification

**Open browser console and test:**
```javascript
// Click a CTA and verify console output
// Should see: "📊 CTA Clicked: {...}"

// Verify data includes:
- [ ] CTA ID
- [ ] Location
- [ ] Type (primary/secondary/tertiary)
- [ ] Text content
- [ ] Destination URL
```

---

## Phase 7: Code Quality Check

### 7.1 HTML Validation

**Check for:**
- [ ] No duplicate IDs
- [ ] All tags properly closed
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Alt text on all images
- [ ] Lang attribute on `<html>`
- [ ] Meta description present

### 7.2 Accessibility Check

**Verify:**
- [ ] All buttons have accessible text
- [ ] All links have descriptive text (not "click here")
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] ARIA labels present where needed
- [ ] Form labels associated with inputs
- [ ] Skip to main content link (optional)

### 7.3 Code Cleanup

**Remove:**
- [ ] Unused CSS styles
- [ ] Unused JavaScript
- [ ] Commented-out code
- [ ] Debug console.log statements
- [ ] Inline styles (except dynamic)

**Format:**
- [ ] Proper indentation
- [ ] Consistent quote style
- [ ] Meaningful comments where needed
- [ ] No trailing whitespace

---

## Phase 8: Documentation

### 8.1 Update Page Notes

**Create/update:** `docs/pages/[page-name].md`

```markdown
# Page: [page-path]
# Last Updated: [date]
# Updated By: [name]

## Changes Made
- Implemented shared navigation component
- Updated all CTAs to standard hierarchy
- [Other changes]

## CTAs on This Page
1. Hero Section
   - Primary: "Book a Demo" → /#booking
   - Secondary: "Learn More" → /products/

2. [Other sections...]

## Special Features
- [Any unique features preserved]

## Testing Notes
- Tested on: Chrome, Safari, Firefox, Edge
- Mobile tested: iOS Safari, Chrome Android
- Performance: 95 (Lighthouse)

## Known Issues
- [Any remaining issues]

## Next Steps
- [Any follow-up work needed]
```

### 8.2 Update Tracking Sheet

**Update:** `docs/IMPLEMENTATION_TRACKER.md`

```markdown
| Page | Status | Date | Tested | Notes |
|------|--------|------|--------|-------|
| dws10.com/index.html | ✅ Complete | 2025-12-26 | ✅ | Homepage updated |
```

---

## Phase 9: Git Workflow

### 9.1 Stage Changes

```bash
# Check what changed
git status

# Review changes
git diff [page-path]

# Stage the updated page
git add [page-path]

# Stage any related files
git add docs/pages/[page-name].md
```

**Checklist:**
- [ ] Only intended files staged
- [ ] No accidental files included
- [ ] Changes reviewed in diff

### 9.2 Commit Changes

```bash
git commit -m "$(cat <<'EOF'
feat: implement quality standards on [page-name]

Updates [page-path] to use shared components and follow
quality standards defined in SITE_QUALITY_STANDARDS.md

Changes:
- Replace custom navigation with shared component
- Update all CTAs to standard hierarchy (primary/secondary/tertiary)
- Add analytics tracking to all CTAs
- Implement standard hero section pattern
- [Other specific changes]

Testing:
- ✅ Visual: mobile (320px), tablet (768px), desktop (1920px)
- ✅ Functional: all navigation and CTAs work
- ✅ Keyboard: full keyboard navigation tested
- ✅ Accessibility: WCAG 2.1 AA compliant
- ✅ Performance: Lighthouse score > 90
- ✅ Cross-browser: Chrome, Safari, Firefox, Edge

Metrics:
- Code removed: [X] lines (old navigation)
- CTAs updated: [Y] buttons
- Analytics tracking: [Y] CTAs now tracked

Related: SITE_QUALITY_STANDARDS.md, IMPLEMENTATION_GUIDE.md
EOF
)"
```

**Checklist:**
- [ ] Commit message follows format
- [ ] All changes documented
- [ ] Testing results included

### 9.3 Push Changes

```bash
# Push to branch
git push -u origin claude/site-quality-standards-IjtD0

# Verify push succeeded
git log --oneline -1
```

**Checklist:**
- [ ] Push succeeded
- [ ] No conflicts
- [ ] Remote branch updated

---

## Phase 10: Deploy & Monitor

### 10.1 Deploy to Staging

```bash
# Deploy to staging environment
# [Your deployment command]
```

**Checklist:**
- [ ] Deployed to staging
- [ ] Staging URL accessible
- [ ] All changes visible on staging

### 10.2 Final Staging Review

**Re-test on staging:**
- [ ] Navigation works
- [ ] All CTAs work
- [ ] Forms submit (if any)
- [ ] No broken links
- [ ] No console errors

### 10.3 Get Approval

**Stakeholder review:**
- [ ] Screenshots shared
- [ ] Feedback collected
- [ ] Approval received

### 10.4 Deploy to Production

```bash
# Deploy to production
# [Your deployment command]
```

**Checklist:**
- [ ] Deployed to production
- [ ] Production URL accessible
- [ ] All changes live

### 10.5 Post-Deployment Monitoring

**Within 1 hour:**
- [ ] Verify homepage loads
- [ ] Check navigation works
- [ ] Test primary CTA
- [ ] Review error logs
- [ ] Check analytics for anomalies

**Within 24 hours:**
- [ ] Full regression test
- [ ] Performance audit
- [ ] User feedback review
- [ ] Analytics dashboard check

---

## Workflow Metrics

### Track These Metrics Per Page

**Efficiency:**
- Time to update: [X] hours
- Code removed: [X] lines
- Code added: [X] lines
- Net change: [+/-X] lines

**Quality:**
- Lighthouse Performance: [score]
- Lighthouse Accessibility: [score]
- CTAs updated: [count]
- CTAs with tracking: [count]

**Issues:**
- Bugs found during testing: [count]
- Bugs found post-deployment: [count]
- Rollback needed: [yes/no]

---

## Rollback Procedure

**If critical issues found:**

### Step 1: Immediate Rollback
```bash
# Restore from backup
cp backups/pre-quality-standards/[page-name]-backup-[date].html [page-path]

# Commit rollback
git add [page-path]
git commit -m "rollback: revert [page-name] due to [issue]"
git push
```

### Step 2: Document Issue
```markdown
# Rollback Report
Page: [page-path]
Date: [date]
Reason: [issue description]

Issue Details:
- [What went wrong]
- [Impact]
- [Steps to reproduce]

Resolution Plan:
- [How to fix]
- [When to retry]
```

### Step 3: Fix & Retry
- [ ] Fix identified issue
- [ ] Re-test locally
- [ ] Re-deploy to staging
- [ ] Get approval
- [ ] Re-deploy to production

---

## Quick Reference Checklist

**Use this for each page update:**

```
[ ] 1. Select page & document current state
[ ] 2. Create backup
[ ] 3. Remove old navigation
[ ] 4. Add shared navigation component
[ ] 5. Link CTA button CSS
[ ] 6. Update all CTAs (primary, secondary, tertiary)
[ ] 7. Update hero section
[ ] 8. Test visually (mobile, tablet, desktop)
[ ] 9. Test functionally (all interactions)
[ ] 10. Test keyboard navigation
[ ] 11. Test in multiple browsers
[ ] 12. Run Lighthouse audit
[ ] 13. Verify analytics tracking
[ ] 14. Code quality check
[ ] 15. Document changes
[ ] 16. Git commit & push
[ ] 17. Deploy to staging
[ ] 18. Get approval
[ ] 19. Deploy to production
[ ] 20. Monitor for 24 hours
```

---

## Templates

### Issue Template
```markdown
# Issue: [Title]
Page: [page-path]
Found: [date]
Severity: [Critical/High/Medium/Low]

## Description
[What's wrong]

## Steps to Reproduce
1. [Step]
2. [Step]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[Attach screenshots]

## Environment
- Browser: [browser + version]
- Device: [desktop/mobile]
- OS: [operating system]
```

### Testing Report Template
```markdown
# Testing Report: [Page Name]
Date: [date]
Tester: [name]

## Visual Testing
- [ ] Mobile (320px)
- [ ] Mobile (375px)
- [ ] Mobile (414px)
- [ ] Tablet (768px)
- [ ] Tablet (1024px)
- [ ] Desktop (1280px)
- [ ] Desktop (1920px)

## Functional Testing
- [ ] Navigation works
- [ ] All CTAs work
- [ ] Forms submit
- [ ] No broken links

## Performance
- Lighthouse Performance: [score]
- Lighthouse Accessibility: [score]
- Page load time: [seconds]

## Issues Found
1. [Issue]
2. [Issue]

## Status
[Pass/Fail/Pass with Issues]
```

---

## Success Criteria

**Page update is complete when:**

✅ All checklist items completed
✅ All tests passing
✅ Lighthouse scores meet targets
✅ Stakeholder approval received
✅ Deployed to production
✅ Monitoring shows no issues
✅ Documentation updated

---

**Workflow Version:** 1.0
**Last Updated:** 2025-12-26
**Maintained By:** Development Team
**Next Review:** 2026-01-26
