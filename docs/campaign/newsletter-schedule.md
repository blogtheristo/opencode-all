# DWS IQ Campaign Newsletter Schedule

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-15
- Agent: Claude Opus 4.6
- Action: Created newsletter schedule document

## Overview

- Frequency: Weekly (every Friday)
- Editions: English + Finnish (separate editions)
- Content: Top 5 posts of the week + 1 product spotlight
- Transport: Amazon SES only (Resend permanently banned — LOCKED_DECISIONS LD-2026-008)
- Sender: risto@onelifetime.world
- Subscriber table: newsletter_subscribers (Supabase)

## Newsletter Template Structure

### Subject Line Pattern
- EN: "Week {N}: {Top Post Title} + {count} more insights"
- FI: "Viikko {N}: {Top Post Title} + {count} muuta katsausta"

### Sections
1. Hero: Top post of the week (full excerpt + image)
2. This Week's Highlights: 4 post summaries (title + 1 sentence + link)
3. Product Spotlight: 1 DWS IQ product feature (rotates weekly)
4. Industry Number: 1 compelling statistic from autoresearch
5. CTA: "Start your free compliance assessment" → dws10.com
6. Footer: Unsubscribe link, Lifetime Oy details, GDPR notice

## Weekly Schedule

| Week | Date | EN Theme | FI Theme | LinkedIn Posts |
|------|------|----------|----------|----------------|
| 1 | 2026-03-20 | Launch: ERP Disruption | Lanseeraus: ERP-murros | Days 1, 2, 5 |
| 2 | 2026-03-27 | Compliance Deep-Dive | Vaatimustenmukaisuus | Days 8, 9, 12 |
| 3 | 2026-04-03 | AI-Powered Industry | Tekoalypohjainen teollisuus | Days 15, 16, 19 |
| 4+ | Ongoing | Pillar rotation | Pillarikierros | Best 2-3/week |

## Subscriber Acquisition

### Touchpoints
- Blog post footer CTA ("Subscribe to weekly insights")
- Blog index banner
- dws10.com contact page
- LinkedIn post CTAs
- Event/webinar follow-ups

### Supabase Schema
```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  lang TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'fi', 'sv')),
  name TEXT,
  company TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  source TEXT -- 'blog', 'linkedin', 'event', 'manual'
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
```

## LinkedIn Promotion Rules

- Promote 2-3 posts per week from Pillars 1 (ERP Transition) and 2 (EU Compliance) — highest LinkedIn engagement
- Format: 3-line hook + key insight paragraph + link + 3-5 hashtags
- Best posting times: Tuesday 8:00, Wednesday 10:00, Thursday 8:00 (Helsinki time)
- Hashtags: #ERP #Compliance #CSRD #FitFor55 #AI #NordicBusiness #DigitalTransformation
