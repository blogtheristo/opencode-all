# DWS IQ 800-Day Campaign — Publishing Workflow

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-15
- Agent: Claude Opus 4.6
- Action: Created publishing workflow document

## Daily Publishing Workflow

### Batch Generation (Daily, Automated)
1. AI generates 21 posts per batch (3 weeks of content: 7 per week x 3 weeks ahead)
2. Posts generated in both EN and FI simultaneously
3. Each post includes:
   - Oxford notation citations with links (minimum 1 main reference)
   - Cross-links to other campaign posts (related pillar posts)
   - Links to DWS product pages (contextual, not forced)
   - Autoresearch data where meaningful
   - NYT-level depth (1,500-2,500 words)
   - Honest competitor acknowledgment

### Draft Review Pipeline
1. Generated posts saved as drafts in `posts/en/drafts/` and `posts/fi/drafts/`
2. Human (Risto) reviews drafts daily via GitHub PR or direct review
3. If reviewed: edits applied, moved to `posts/en/` and `posts/fi/`
4. If NOT reviewed within 24 hours: auto-published as-is
5. All posts get `data-draft-reviewed: true|false` in HTML meta

### Daily Publication
- 1 post per day published (EN + FI)
- Published at 08:00 Helsinki time (06:00 UTC)
- Post moves from drafts to live directory
- Blog index auto-updates (client-side JS reads post list)
- Sitemap regenerated

### Quality Gates
- No post published without: title, description, hreflang, schema.org, citations
- Minimum word count: 1,500 words
- At least 1 Oxford citation with source link
- At least 2 internal links (to other posts or DWS products)
- Category tag from the 7 pillars

## Weekly Newsletter Workflow

### Friday Newsletter (EN + FI editions)
1. Collects all posts published that week (7 posts, 1 per pillar)
2. Generates weekly digest email using `newsletter-weekly-digest` template
3. Top 3 posts featured with full excerpts
4. Remaining 4 posts listed as links with 1-sentence summaries
5. Product spotlight: 1 DWS product highlighted (rotates weekly)
6. Industry data point from autoresearch

### Newsletter Schedule
- Content freeze: Thursday 18:00 Helsinki time
- Review window: Thursday 18:00 — Friday 07:00
- Send time: Friday 08:00 Helsinki time
- Separate EN and FI editions

### Subscriber Management
- Supabase table: `newsletter_subscribers`
- Double opt-in confirmation email
- GDPR-compliant unsubscribe in every email
- Language preference stored per subscriber

## LinkedIn Promotion

### Selection Criteria
- 2-3 posts per week promoted to LinkedIn
- Priority: Pillar 1 (ERP Transition) and Pillar 2 (EU Compliance) — highest B2B engagement
- Posts with strongest data points or most controversial angles selected
- LinkedIn post format:
  - 3-line hook (problem or surprising fact)
  - 2-3 sentence insight paragraph
  - Link to full post
  - 3-5 relevant hashtags

### Posting Schedule
- Tuesday 08:00 Helsinki time
- Wednesday 10:00 Helsinki time
- Thursday 08:00 Helsinki time (if 3rd post warranted)

## Content Editorial Standards

### Oxford Notation Citations
Every post MUST include at least 1 properly formatted citation:
```html
<p>According to the European Commission's impact assessment,
the ETS Phase 4 reforms will reduce emissions by 62% compared
to 2005 levels.<sup><a href="https://ec.europa.eu/..."
target="_blank">[1]</a></sup></p>

<footer class="mt-8 pt-4 border-t border-gray-700">
  <h4>References</h4>
  <ol class="text-xs text-gray-500">
    <li><a href="https://ec.europa.eu/...">European Commission,
    "Fit for 55 Impact Assessment", 2024</a></li>
  </ol>
</footer>
```

### Cross-Linking Rules
- Every post links to at least 1 other campaign post (related pillar or adjacent topic)
- Every post links to at least 1 DWS product page (contextual, in body text)
- Use "Read Also" section at bottom for 2-4 related posts
- Link text should be descriptive (not "click here")

### Honest Competition Acknowledgment
- When discussing a topic where competitors excel, say so
- Pattern: "Tools like [Competitor] handle [specific use case] well. DWS IQ adds value specifically for [gap]."
- Never trash competitors. Compare on: features, EU compliance, data residency, pricing

## Automation (Future Implementation)

### GitHub Actions: Daily Post Generator
```yaml
# .github/workflows/campaign-daily-posts.yml
name: Daily Campaign Post Generator
on:
  schedule:
    - cron: '0 4 * * *'  # 04:00 UTC = 06:00 Helsinki
  workflow_dispatch:
    inputs:
      day_number:
        description: 'Day number (1-800)'

# Steps:
# 1. Calculate current campaign day from start date
# 2. Determine pillar (day % 7)
# 3. Generate post using Claude API
# 4. Save as draft in posts/{lang}/drafts/
# 5. Create PR for human review
# 6. Auto-merge after 24 hours if not reviewed
```

### GitHub Actions: Weekly Newsletter
```yaml
# .github/workflows/campaign-newsletter.yml
name: Weekly Campaign Newsletter
on:
  schedule:
    - cron: '0 6 * * 5'  # Friday 06:00 UTC = 08:00 Helsinki

# Steps:
# 1. Collect posts published this week
# 2. Generate EN digest from email.service.ts
# 3. Generate FI digest
# 4. Send via Amazon SES (SMTP only — Resend banned per LD-2026-008)
# 5. Log to Supabase email_logs
```
