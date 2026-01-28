# Weekly Google Merchant Center Maintenance Workflow

**Platform:** DWS10.com Store
**Account:** Google Merchant Center (ID: 8496329)
**Schedule:** Monday/Wednesday/Friday
**Owner:** Lifetime Oy Store Operations

---

## Quick Reference

| Day | Task | Duration | Priority |
|-----|------|----------|----------|
| Monday | Feed Health Check | 15 min | High |
| Wednesday | Performance Review | 30 min | Medium |
| Friday | Optimization & Upload | 45 min | High |

---

## Monday: Feed Health Check

### 1. Access Google Merchant Center

```
URL: https://merchants.google.com/mc/products/diagnostics
Account: 8496329
```

### 2. Check Product Diagnostics

Review the following status categories:

| Status | Action Required |
|--------|-----------------|
| Approved | No action |
| Limited | Review warning messages |
| Disapproved | Immediate fix required |
| Pending | Wait 24-48 hours |

### 3. Common Issues Checklist

- [ ] **Domain mismatch**: Product URLs must point to dws10.com
- [ ] **Missing price**: Verify `price` field in products.json
- [ ] **Image errors**: Check image paths, no double slashes
- [ ] **identifier_exists**: Remove if MPN + brand are set
- [ ] **Checkout link**: Verify Revolut links are active

### 4. Feed Freshness Verification

```bash
# Check lastUpdated in products.json
cat dws10.com/config/products.json | grep lastUpdated
```

If older than 7 days, regenerate:

```bash
cd dws10.com/feeds
node generate-feed.cjs
```

### 5. Document Issues

Log any issues found in:
- Git commit messages
- This maintenance log (append below)

---

## Wednesday: Performance Review

### 1. Access Performance Metrics

```
URL: https://merchants.google.com/mc/performance
```

### 2. Key Metrics to Track

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Impressions | >1000/week | Improve titles/descriptions |
| Clicks | >50/week | Update images, pricing |
| CTR | >5% | Review product positioning |
| Conversions | Track | Verify Revolut links |

### 3. Product Performance Analysis

Create a report of top/bottom performers:

**Top Performers:**
| Product | Impressions | Clicks | CTR |
|---------|-------------|--------|-----|
| 1. | | | |
| 2. | | | |
| 3. | | | |

**Underperformers:**
| Product | Issue | Proposed Action |
|---------|-------|-----------------|
| 1. | | |
| 2. | | |
| 3. | | |

### 4. Competitive Analysis (Monthly)

- Review market pricing for similar products
- Check competitor product titles/descriptions
- Note any new entrants in our categories

---

## Friday: Optimization & Upload

### 1. Implement Improvements

Based on Wednesday's analysis, update:

```bash
# Edit products.json
vim dws10.com/config/products.json
```

Common optimizations:
- **Improve titles**: Include keywords, benefits
- **Update descriptions**: Focus on value proposition
- **Refresh images**: Higher quality, consistent style
- **Adjust pricing**: Market-competitive rates

### 2. Regenerate Feed

```bash
cd dws10.com/feeds
node generate-feed.cjs
```

### 3. Validate Feed

```bash
# Check XML validity
xmllint --noout google-products.xml

# Verify product count
grep -c "</item>" google-products.xml
```

Expected: 30 products

### 4. Upload to Google Merchant

```bash
# SFTP upload
curl -T google-products.xml \
  -u "mc-sftp-8496329:YOUR_PASSWORD" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

**Password note:** URL-encode special characters
- `$` becomes `%24`
- `!` becomes `%21`

### 5. Verify Upload

- Check file size: ~33KB expected
- Log in to Merchant Center
- Verify "Last updated" timestamp

### 6. Commit Changes

```bash
git add dws10.com/config/products.json
git add dws10.com/feeds/google-products.xml
git commit -m "chore: Weekly feed update - $(date +%Y-%m-%d)"
git push
```

---

## Monthly Tasks

### First Monday: Full Catalog Audit

1. **Review all 30 products**
   - Remove discontinued items
   - Update stale descriptions
   - Verify pricing accuracy

2. **Check Revolut links**
   - Test each checkout URL
   - Create links for products missing them
   - Update fallback link if needed

3. **Store page review**
   - Verify /buy/ page loads correctly
   - Check page2 and page3 content
   - Test mobile responsiveness

### Second Monday: Compliance Check

1. **Return policy review**
   - Verify /return-policy/ is accessible
   - Check content matches Google requirements
   - Update if policies have changed

2. **Feed compliance**
   - Verify all required attributes present
   - Check for deprecated fields
   - Review Google policy updates

### Third Monday: Expansion Planning

1. **New products**
   - Identify gaps in product catalog
   - Draft new product entries
   - Create Revolut checkout links

2. **Market expansion**
   - Review performance in FI market
   - Plan SE, NO, DK expansion
   - Update targetCountry as needed

### Fourth Monday: Performance Report

1. **Generate monthly summary**
   - Total impressions
   - Total clicks
   - Conversion rate
   - Revenue attribution

2. **Trend analysis**
   - Compare to previous month
   - Identify seasonal patterns
   - Plan promotional activities

---

## Improvement Proposals

### To Get More Customers

1. **Search Optimization**
   - Use industry-specific keywords in titles
   - Include compliance terms (Fit for 55, CSRD, EU AI Act)
   - Add Finnish translations for local search

2. **Visual Improvements**
   - Professional product images
   - Consistent branding across all products
   - Add lifestyle/context images

3. **Pricing Strategy**
   - Bundle offerings for higher value
   - Introduce entry-level products
   - Seasonal promotions

4. **Product Expansion**
   - Industry-specific packages
   - Vertical solutions (e.g., "Manufacturing Compliance Kit")
   - Partner product bundles

5. **Geographic Expansion**
   - Enable shopping ads in Sweden (SE)
   - Enable shopping ads in Norway (NO)
   - Enable shopping ads in Denmark (DK)
   - Enable shopping ads in Germany (DE)

### Audio Chat Integration (Future)

When audio chat is deployed:

1. **Product Interest Tracking**
   - Log which products are asked about
   - Track common customer questions
   - Identify unmet needs

2. **Recommendation Optimization**
   - A/B test recommendation scripts
   - Personalize based on industry
   - Include compliance requirements automatically

3. **Lead Qualification**
   - Score leads based on conversation
   - Route high-value leads to sales
   - Automated follow-up sequences

---

## Maintenance Log

### Template

```
Date: YYYY-MM-DD
Performed by: [Name]
Tasks completed:
- [ ] Feed health check
- [ ] Performance review
- [ ] Optimization
- [ ] Upload

Issues found:
- [Description of any issues]

Actions taken:
- [Description of fixes]

Notes:
- [Any additional observations]
```

---

### Log Entries

#### 2026-01-27
```
Performed by: Claude Code (Firehorse Operations)
Tasks completed:
- [x] Feed health check
- [x] Performance review
- [x] Optimization (product ID alignment)
- [x] Upload via SFTP

Issues found:
- Domain mismatch for legacy products
- Duplicate product IDs
- Missing checkout links

Actions taken:
- Aligned product IDs with Merchant Center
- Added Revolut checkout links
- Updated all URLs to dws10.com
- Created pagination (page 2, page 3)

Notes:
- Feed successfully uploaded (32,893 bytes)
- All 30 products now in catalog
- Documentation created
```

---

## Contact Information

- **Technical Issues:** support@lifetime.fi
- **Google Merchant Support:** merchants.google.com/support
- **Revolut Business:** business.revolut.com/support
- **Claude Code Operations:** [Firehorse model via git]

---

*Workflow document generated using Firehorse Operations Model*
*Last updated: January 2026*
