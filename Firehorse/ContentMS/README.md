# Content Management System

> **Status: PLANNED** — This sub-product has no implementation code yet. This README describes the planned architecture. See AGENTS.md §19 Product Maturity Matrix for full status.

## Overview

Central repository for all campaign content, templates, and messaging assets used across Firehorse campaigns.

## Directory Structure

```
ContentMS/
├── email-templates/      # Email campaign templates
├── landing-pages/        # Landing page copy
├── social-media/         # Social media content
├── presentations/        # Pitch decks and slides
├── case-studies/         # Customer success stories
├── blog-posts/           # Blog content
├── whitepapers/          # Long-form content
└── assets/               # Images, videos, files
```

## Email Template Library

### Categories
1. **Cold Outreach**: First contact emails
2. **Follow-ups**: Sequence emails
3. **Nurture**: Educational content
4. **Announcements**: Product updates
5. **Events**: Webinar invitations
6. **Transactional**: Confirmations, receipts

### Template Naming Convention
```
[category]-[audience]-[purpose]-v[version].html

Examples:
- cold-investor-intro-v1.html
- followup-customer-trial-v2.html
- nurture-partner-education-v1.html
```

## Content Guidelines

### Email Best Practices
- **Subject Line**: 6-10 words, clear value
- **Preview Text**: Compelling first 40 characters
- **Body Length**: 50-150 words for cold outreach
- **Call-to-Action**: Single, clear CTA
- **Personalization**: Minimum 3 dynamic fields
- **Mobile-Friendly**: Responsive design

### Brand Voice
- **Tone**: Professional yet approachable
- **Style**: Clear, concise, action-oriented
- **Language**: Industry-specific but accessible
- **Personality**: Confident, innovative, trustworthy

## Template Variables

Standard variables across all templates:

```
{{first_name}}          - Recipient's first name
{{last_name}}           - Recipient's last name
{{company}}             - Recipient's company
{{title}}               - Recipient's job title
{{sender_name}}         - Sender's name
{{sender_title}}        - Sender's title
{{company_name}}        - Your company name
{{product_name}}        - Product name
{{meeting_link}}        - Calendar link
{{unsubscribe_link}}    - Opt-out link
{{footer}}              - Standard footer
```

## Content Approval Workflow

1. **Draft**: Initial content creation
2. **Review**: Team review and feedback
3. **Edit**: Incorporate changes
4. **Approve**: Final sign-off
5. **Publish**: Add to active templates
6. **Monitor**: Track performance
7. **Optimize**: A/B test and improve

## Performance Tracking

Track these metrics for each content piece:

- **Usage**: Times used in campaigns
- **Open Rate**: Email opens
- **Click Rate**: Link clicks
- **Conversion Rate**: Desired action
- **Response Rate**: Replies received
- **A/B Test Results**: Variant performance

## Content Calendar

Maintain a calendar for:
- Campaign launches
- Content updates
- Seasonal messaging
- Product announcements
- Industry events

## Asset Management

### File Organization
- Use descriptive filenames
- Include version numbers
- Tag with categories
- Date stamp updates

### Version Control
- Keep previous versions
- Document changes
- Track performance by version
- Archive outdated content

## Quick Start

1. Browse existing templates
2. Copy template to customize
3. Update variables and content
4. Test with small audience
5. Deploy to campaign
6. Monitor performance

---

**Content Library Status**: Active
**Last Updated**: December 27, 2025
**Total Templates**: [To be counted]
