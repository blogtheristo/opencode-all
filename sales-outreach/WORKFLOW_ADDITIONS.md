# Signaalimyynti Workflow Additions – Implementation Guide

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/signal-sales-outreach-c6tXj | Date: 10.01.2026 | Changes: Initial creation - Technical implementation guide for signal-based sales

Session Links & References:
  - Claude Code (claude/signal-sales-outreach-c6tXj): https://github.com/blogtheristo/dws6/commits/claude/signal-sales-outreach-c6tXj
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/sales-outreach/WORKFLOW_ADDITIONS.md

Document Status:
  - Created: 10.01.2026
  - Last Modified: 10.01.2026
  - Language: English (Technical)
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

## Quick Start

This document outlines the **technical additions** required to implement signal-based sales automation for DWS IQ 6.

Related document: [signaalimyynti.md](./signaalimyynti.md)

---

## 1. Database Migration

**File:** `supabase/migrations/006_firehorse_signals.sql`

**Purpose:** Add `firehorse_signals` table and related views for signal tracking.

**SQL:**

```sql
-- firehorse_signals table
CREATE TABLE firehorse_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Signal source
  signal_source TEXT NOT NULL CHECK (signal_source IN (
    'linkedin', 'x', 'web', 'rss', 'manual'
  )),
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'job_change', 'company_update', 'press_release', 'blog_post',
    'social_post', 'funding', 'project_announcement', 'other'
  )),
  signal_date TIMESTAMPTZ NOT NULL,

  -- Target company/contact
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  contact_linkedin_url TEXT,

  -- Signal content
  signal_content TEXT NOT NULL,
  signal_url TEXT,
  signal_metadata JSONB, -- Additional data (e.g., LinkedIn post ID, tweet ID)

  -- Correlation analysis
  correlation_score INTEGER CHECK (correlation_score BETWEEN 1 AND 5),
  correlation_reason TEXT,
  dws6_feature_match TEXT[], -- ['CSRD', 'SPI_CPI', 'Fit_for_55']
  keywords_matched TEXT[],

  -- Workflow state
  status TEXT DEFAULT 'detected' CHECK (status IN (
    'detected',        -- Signal found
    'analyzed',        -- Correlation calculated
    'queued',          -- Ready to send
    'approved',        -- Human approved
    'sent',            -- Message sent
    'responded',       -- Customer responded
    'demo_booked',     -- Demo scheduled
    'ignored',         -- No response after 14 days
    'rejected'         -- Human rejected (not relevant)
  )),

  -- Message drafting
  message_draft TEXT,
  message_final TEXT, -- Human-edited version
  message_sent_at TIMESTAMPTZ,

  -- Response tracking
  response_received_at TIMESTAMPTZ,
  response_content TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_signals_correlation ON firehorse_signals(correlation_score DESC);
CREATE INDEX idx_signals_status ON firehorse_signals(status);
CREATE INDEX idx_signals_date ON firehorse_signals(signal_date DESC);
CREATE INDEX idx_signals_company ON firehorse_signals(company_name);

-- Auto-update updated_at
CREATE TRIGGER update_firehorse_signals_updated_at
  BEFORE UPDATE ON firehorse_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views for prioritization
CREATE VIEW firehorse_signals_ultra AS
SELECT * FROM firehorse_signals
WHERE correlation_score = 5
  AND status IN ('analyzed', 'queued')
  AND signal_date >= NOW() - INTERVAL '14 days'
ORDER BY signal_date DESC;

CREATE VIEW firehorse_signals_high AS
SELECT * FROM firehorse_signals
WHERE correlation_score = 4
  AND status IN ('analyzed', 'queued')
  AND signal_date >= NOW() - INTERVAL '14 days'
ORDER BY signal_date DESC;

CREATE VIEW firehorse_signals_pending_approval AS
SELECT
  s.id,
  s.company_name,
  s.contact_name,
  s.contact_title,
  s.signal_date,
  s.correlation_score,
  s.correlation_reason,
  s.signal_content,
  s.message_draft,
  s.signal_url,
  s.dws6_feature_match
FROM firehorse_signals s
WHERE s.status = 'queued'
  AND s.correlation_score >= 4
ORDER BY s.correlation_score DESC, s.signal_date DESC;

-- Performance metrics view
CREATE VIEW firehorse_signals_metrics AS
SELECT
  DATE_TRUNC('week', signal_date) AS week,
  correlation_score,
  COUNT(*) AS total_signals,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent_count,
  SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) AS response_count,
  SUM(CASE WHEN status = 'demo_booked' THEN 1 ELSE 0 END) AS demo_count,
  ROUND(
    100.0 * SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) /
    NULLIF(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END), 0),
    2
  ) AS response_rate_pct
FROM firehorse_signals
WHERE signal_date >= NOW() - INTERVAL '90 days'
GROUP BY week, correlation_score
ORDER BY week DESC, correlation_score DESC;
```

**Deployment:**

```bash
cd /home/user/dws6
supabase migration new firehorse_signals
# Copy SQL above to migration file
supabase db push
```

---

## 2. Python Scripts

### 2.1 Web Signal Collector

**File:** `scripts/collect_signals.py`

**Purpose:** Scrape company news, press releases, and blog posts.

**Dependencies:**

```bash
pip install requests beautifulsoup4 playwright supabase-py python-dotenv
```

**Script:**

```python
#!/usr/bin/env python3
"""
Signal Collection Script for DWS IQ 6 Sales Automation

Scrapes company news, press releases, and blogs for sales signals.
"""

import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Target companies (TOP 30)
COMPANIES = [
    {"name": "NCC AB", "news_url": "https://www.ncc.se/news", "country": "SE"},
    {"name": "Skanska AB", "news_url": "https://www.skanska.com/newsroom", "country": "SE"},
    {"name": "PORR AG", "news_url": "https://www.porr-group.com/en/press", "country": "AT"},
    {"name": "STRABAG SE", "news_url": "https://www.strabag.com/news", "country": "AT"},
    {"name": "Veidekke ASA", "news_url": "https://www.veidekke.com/en/news", "country": "NO"},
    # ... add all TOP 30
]

# Keywords for correlation scoring
ULTRA_KEYWORDS = [
    "CSRD", "Fit for 55", "SPI", "CPI", "Schedule Performance Index",
    "Cost Performance Index", "ESG reporting", "Scope 1", "Scope 2", "Scope 3",
    "carbon accounting", "EU Taxonomy", "EPBD", "zero-emission building"
]

HIGH_KEYWORDS = [
    "COO", "CDO", "Chief Operating Officer", "Chief Digital Officer",
    "digitalization", "digital transformation", "funding round", "Series A",
    "Series B", "ESG director", "sustainability officer", "portfolio growth"
]

MEDIUM_KEYWORDS = [
    "BIM", "Construction 4.0", "digitization", "smart construction",
    "IoT", "sensors", "automation", "project management"
]

def scrape_company_news(company: dict) -> list:
    """Scrape latest news from company website (last 7 days)"""
    try:
        response = requests.get(company["news_url"], timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        articles = []
        # Generic parsing (customize per site)
        for article in soup.find_all(['article', 'div'], class_=lambda c: c and 'news' in c.lower()):
            title_elem = article.find(['h2', 'h3', 'a'])
            date_elem = article.find(['time', 'span'], class_=lambda c: c and 'date' in c.lower())
            link_elem = article.find('a', href=True)

            if title_elem and link_elem:
                articles.append({
                    'title': title_elem.get_text(strip=True),
                    'text': article.get_text(strip=True)[:1000],
                    'url': link_elem['href'],
                    'date': date_elem.get_text(strip=True) if date_elem else None
                })

        return articles[:5]  # Return max 5 latest
    except Exception as e:
        print(f"Error scraping {company['name']}: {e}")
        return []

def calculate_correlation(text: str) -> tuple:
    """Calculate correlation score (1-5) based on keywords"""
    text_lower = text.lower()
    matched_keywords = []

    # ULTRA (5)
    for keyword in ULTRA_KEYWORDS:
        if keyword.lower() in text_lower:
            matched_keywords.append(keyword)
            return 5, f"Contains ULTRA keyword: {keyword}", matched_keywords, ['CSRD', 'Fit_for_55', 'SPI_CPI']

    # HIGH (4)
    for keyword in HIGH_KEYWORDS:
        if keyword.lower() in text_lower:
            matched_keywords.append(keyword)
            return 4, f"Contains HIGH keyword: {keyword}", matched_keywords, ['Digitalization', 'ESG']

    # MEDIUM (3)
    for keyword in MEDIUM_KEYWORDS:
        if keyword.lower() in text_lower:
            matched_keywords.append(keyword)
            return 3, f"Contains MEDIUM keyword: {keyword}", matched_keywords, ['BIM', 'Automation']

    # LOW (1-2)
    return 1, "Generic content", [], []

def save_signal(signal: dict):
    """Save signal to Supabase"""
    try:
        supabase.table('firehorse_signals').insert(signal).execute()
        print(f"✅ Saved: {signal['company_name']} - {signal['correlation_reason']}")
    except Exception as e:
        print(f"❌ Error saving signal: {e}")

def main():
    print(f"🔍 Starting signal collection at {datetime.now()}")
    total_saved = 0

    for company in COMPANIES:
        print(f"\n📰 Scraping {company['name']}...")
        articles = scrape_company_news(company)

        for article in articles:
            score, reason, keywords, features = calculate_correlation(article['text'])

            # Only save HIGH/ULTRA signals
            if score >= 4:
                signal = {
                    'signal_source': 'web',
                    'signal_type': 'press_release',
                    'signal_date': datetime.now().isoformat(),
                    'company_name': company['name'],
                    'signal_content': article['text'],
                    'signal_url': article['url'],
                    'correlation_score': score,
                    'correlation_reason': reason,
                    'keywords_matched': keywords,
                    'dws6_feature_match': features,
                    'status': 'detected'
                }
                save_signal(signal)
                total_saved += 1

    print(f"\n✅ Collection complete. Saved {total_saved} signals.")

if __name__ == "__main__":
    main()
```

**Cron Job:**

```bash
# Run every morning at 07:00
0 7 * * * cd /home/user/dws6 && /usr/bin/python3 scripts/collect_signals.py >> logs/signals.log 2>&1
```

### 2.2 LinkedIn Signal Collector

**File:** `scripts/linkedin_scraper.py`

**Purpose:** Track LinkedIn job changes, company updates, and posts.

**Note:** Use PhantomBuster or LinkedIn API (requires OAuth).

```python
#!/usr/bin/env python3
"""
LinkedIn Signal Collector

Tracks:
- Job changes (new COO, CDO, ESG director)
- Company updates
- Relevant posts from target accounts
"""

import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# PhantomBuster API (alternative: LinkedIn Official API)
PHANTOMBUSTER_API_KEY = os.getenv("PHANTOMBUSTER_API_KEY")

# TODO: Implement PhantomBuster integration
# See: https://phantombuster.com/api-store/linkedin-profile-scraper

def scrape_linkedin_job_changes(company_linkedin_url: str):
    """Scrape job changes from LinkedIn company page"""
    # Placeholder - implement with PhantomBuster
    pass

def main():
    print("🔗 LinkedIn signal collection - Coming in Q2/2026")
    # For Q1/2026: Manual LinkedIn tracking (8:00-8:30 daily)

if __name__ == "__main__":
    main()
```

---

## 3. TypeScript Services

### 3.1 Signal Message Generator

**File:** `src/firehorse/signal-message-generator.ts`

**Purpose:** AI-powered message drafting using OpenAI GPT-4.

```typescript
import OpenAI from 'openai';
import { supabase } from './database';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Signal {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_title?: string;
  signal_content: string;
  correlation_score: number;
  correlation_reason?: string;
  dws6_feature_match?: string[];
}

export async function generateMessageDraft(signal: Signal): Promise<string> {
  const language = determineLanguage(signal.company_name);

  const prompt = `
You are a B2B sales expert writing empathetic, signal-based outreach messages for DWS IQ 6.

SIGNAL CONTEXT:
- Company: ${signal.company_name}
- Contact: ${signal.contact_name || 'Decision Maker'} (${signal.contact_title || 'Unknown'})
- Signal: ${signal.signal_content.substring(0, 500)}
- Correlation: ${signal.correlation_score}/5 (${signal.correlation_reason})
- DWS6 Features: ${signal.dws6_feature_match?.join(', ') || 'General'}

PRODUCT (DWS IQ 6):
- Real-time portfolio control room for construction companies
- SPI/CPI dashboards, Fit for 55 compliance tracking, safety monitoring
- Mobile-first, AI-powered, focused on Nordic/CEE markets

MESSAGE REQUIREMENTS:
1. Start with "Hei [Name]," (${language} style)
2. Reference the signal in first sentence ("Näin että..." / "I noticed that...")
3. Show empathy ("Monet asiakkaamme kohtasivat saman haasteen..." / "Many of our clients faced the same challenge...")
4. Brief mention of DWS IQ 6 (1-2 sentences max)
5. Soft CTA: "Kiinnostaako 15 min demo?" / "Interested in a 15-min demo?"
6. Include signature:
   ${language === 'Finnish' ? 'Terveisin' : 'Best regards'},
   Risto Päärni
   +358 400 319 010
   Demo: https://j6prmljgpvnia.ok.kimi.link/

7. Max 150 words
8. Language: ${language}
9. Tone: Professional but conversational, empathetic, NOT pushy

Write the message now:
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });

  const draft = response.choices[0].message.content || '';

  // Save draft to database
  await supabase
    .from('firehorse_signals')
    .update({
      message_draft: draft,
      status: 'queued',
      updated_at: new Date().toISOString()
    })
    .eq('id', signal.id)
    .execute();

  return draft;
}

function determineLanguage(companyName: string): string {
  // Finnish companies
  if (companyName.includes('Oyj') || companyName.includes('YIT') || companyName.includes('Caverion')) {
    return 'Finnish';
  }
  // Swedish companies
  if (companyName.includes('AB') || companyName.includes('Skanska') || companyName.includes('NCC')) {
    return 'Swedish';
  }
  // Default: English
  return 'English';
}

export async function processPendingSignals() {
  const { data: signals } = await supabase
    .from('firehorse_signals')
    .select('*')
    .in('correlation_score', [4, 5])
    .eq('status', 'analyzed')
    .order('signal_date', { ascending: false })
    .limit(10)
    .execute();

  if (!signals) {
    console.log('No pending signals to process');
    return;
  }

  for (const signal of signals) {
    console.log(`📝 Generating message for ${signal.company_name}...`);
    try {
      await generateMessageDraft(signal);
      console.log(`✅ Draft created for ${signal.company_name}`);
    } catch (error) {
      console.error(`❌ Error generating draft: ${error}`);
    }
  }
}
```

### 3.2 Signal Processor

**File:** `src/firehorse/signal-processor.ts`

**Purpose:** Analyze signals, calculate correlation, trigger message drafting.

```typescript
import { supabase } from './database';
import { generateMessageDraft } from './signal-message-generator';

export async function analyzeSignals() {
  // Get unanalyzed signals
  const { data: signals } = await supabase
    .from('firehorse_signals')
    .select('*')
    .eq('status', 'detected')
    .order('signal_date', { ascending: false })
    .execute();

  if (!signals || signals.length === 0) {
    console.log('No new signals to analyze');
    return;
  }

  for (const signal of signals) {
    console.log(`🔍 Analyzing signal from ${signal.company_name}...`);

    // Correlation already calculated in Python script
    // Just update status to 'analyzed'
    await supabase
      .from('firehorse_signals')
      .update({ status: 'analyzed' })
      .eq('id', signal.id)
      .execute();

    // If ULTRA or HIGH, generate message draft
    if (signal.correlation_score >= 4) {
      await generateMessageDraft(signal);
    }
  }

  console.log(`✅ Analyzed ${signals.length} signals`);
}

// Run daily at 08:00 (after signal collection at 07:00)
export async function dailySignalProcessing() {
  console.log('🚀 Starting daily signal processing...');
  await analyzeSignals();
  console.log('✅ Daily signal processing complete');
}
```

---

## 4. Cron Jobs / Scheduler

**File:** `scripts/cron-signals.sh`

```bash
#!/bin/bash

# Daily signal collection and processing

# 07:00 - Collect signals from web
/usr/bin/python3 /home/user/dws6/scripts/collect_signals.py >> /home/user/dws6/logs/signals.log 2>&1

# 08:00 - Process signals (TypeScript)
cd /home/user/dws6 && npm run process-signals >> /home/user/dws6/logs/signals.log 2>&1
```

**Add to crontab:**

```bash
crontab -e

# Add:
0 7 * * * /home/user/dws6/scripts/cron-signals.sh
```

**package.json script:**

```json
{
  "scripts": {
    "process-signals": "tsx src/firehorse/signal-processor.ts"
  }
}
```

---

## 5. Dashboard UI (React)

**File:** `src/pages/signals.tsx`

**Purpose:** Human-in-the-loop approval interface.

```typescript
import React, { useEffect, useState } from 'react';
import { supabase } from '../firehorse/database';

interface Signal {
  id: string;
  company_name: string;
  contact_name: string;
  signal_date: string;
  correlation_score: number;
  signal_content: string;
  message_draft: string;
  signal_url: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    fetchPendingSignals();
  }, []);

  async function fetchPendingSignals() {
    const { data } = await supabase
      .from('firehorse_signals_pending_approval')
      .select('*')
      .execute();

    setSignals(data || []);
  }

  async function approveSignal(id: string) {
    await supabase
      .from('firehorse_signals')
      .update({ status: 'approved' })
      .eq('id', id)
      .execute();

    alert('✅ Signal approved! Now send manually on LinkedIn.');
    fetchPendingSignals();
  }

  async function rejectSignal(id: string) {
    await supabase
      .from('firehorse_signals')
      .update({ status: 'rejected' })
      .eq('id', id)
      .execute();

    fetchPendingSignals();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📊 Signaalit Odottavat Hyväksyntää ({signals.length})</h1>

      {signals.map((signal) => (
        <div key={signal.id} className="border p-4 mb-4 rounded">
          <h2 className="font-bold">
            {signal.company_name} – {signal.contact_name || 'Unknown Contact'}
            <span className="ml-2 text-sm text-gray-500">
              ({signal.correlation_score === 5 ? 'ULTRA' : 'HIGH'})
            </span>
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Signal: {signal.signal_date} | <a href={signal.signal_url} target="_blank" className="text-blue-500">Source</a>
          </p>
          <div className="bg-gray-100 p-3 rounded mb-3">
            <pre className="whitespace-pre-wrap">{signal.message_draft}</pre>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => approveSignal(signal.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              ✅ Hyväksy & Lähetä
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              ✏️ Muokkaa
            </button>
            <button
              onClick={() => rejectSignal(signal.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ❌ Hylkää
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. Environment Variables

**File:** `.env` (add these)

```bash
# OpenAI (for message drafting)
OPENAI_API_KEY=sk-...

# PhantomBuster (for LinkedIn automation - Q2/2026)
PHANTOMBUSTER_API_KEY=...

# Supabase (already exists)
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

---

## 7. Testing Checklist

### Phase 1: Manual Testing (Q1/2026)

- [ ] Run `python scripts/collect_signals.py` manually
- [ ] Verify signals appear in `firehorse_signals` table
- [ ] Check correlation scores (ULTRA/HIGH/MEDIUM)
- [ ] Run `npm run process-signals` to generate message drafts
- [ ] Open `/signals` page in browser
- [ ] Approve a signal and send manually on LinkedIn
- [ ] Track response (update status to 'responded')

### Phase 2: Automation (Q2/2026)

- [ ] Set up cron jobs
- [ ] Test PhantomBuster LinkedIn integration
- [ ] Verify auto-message sending
- [ ] Monitor response rates

---

## 8. Success Metrics

**Track in Supabase Dashboard:**

```sql
-- Weekly signal collection
SELECT * FROM firehorse_signals_metrics;

-- Response rate by correlation score
SELECT
  correlation_score,
  AVG(response_rate_pct) as avg_response_rate
FROM firehorse_signals_metrics
GROUP BY correlation_score;
```

**Q1/2026 Targets:**

- ✅ 15-25 signals/week collected
- ✅ 3-5 ULTRA signals/week
- ✅ 8-15% response rate (vs. 0.5-2% cold outreach)
- ✅ 2-3 demos/week booked
- ✅ 2 pilots signed

---

## 9. Roadmap

| Phase | Timeline | Features |
|-------|----------|----------|
| **Q1/2026** | Manual | Python scraper, manual LinkedIn, human approval |
| **Q2/2026** | Semi-Auto | PhantomBuster integration, auto message drafting |
| **Q3/2026** | Full Auto | 1-click approval, auto follow-ups, AI response handling |

---

## 10. Next Steps

1. **Deploy Database Migration:**
   ```bash
   supabase migration new firehorse_signals
   supabase db push
   ```

2. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Test Signal Collection:**
   ```bash
   python scripts/collect_signals.py
   ```

4. **Deploy Dashboard:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/signals
   ```

5. **Set Up Cron Jobs:**
   ```bash
   chmod +x scripts/cron-signals.sh
   crontab -e  # Add cron entry
   ```

---

**Document Version:** 1.0
**Last Updated:** January 10, 2026
**Status:** ✅ Ready for Implementation
**Estimated Effort:** 20-30 hours (database + scripts + UI)
