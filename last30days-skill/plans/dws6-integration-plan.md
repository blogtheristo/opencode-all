# last30days Integration Plan for DWS6

## Objective

Use the last30days skill to bring fresh, trending industry content to DWS6 landing pages, driving newsletter signups and visitor engagement.

## Strategic Value

| Goal | How last30days Helps |
|------|---------------------|
| Fresh content | Research trending topics every 1-7 days |
| Newsletter signups | "Get exclusive industry insights" as value prop |
| SEO authority | Current, community-validated topics |
| Sales enablement | Know what prospects are discussing |

---

## Target Industries & Research Topics

DWS6 serves 16 EU industries. Each gets tailored research queries:

### Heavy Industry (CBAM-affected)

| Industry Page | Research Query Examples |
|---------------|------------------------|
| `/manufacturing` | "EU manufacturing decarbonization 2026", "CBAM steel imports" |
| `/mining` | "mining electrification EU", "critical minerals regulation" |
| `/shipbuilding` | "FuelEU Maritime compliance", "green shipbuilding EU" |
| `/construction` | "embodied carbon construction EU", "CSRD construction reporting" |

### Energy & Utilities

| Industry Page | Research Query Examples |
|---------------|------------------------|
| `/energy` | "EU energy transition 2026", "renewable PPA trends" |
| `/waste` | "circular economy EU regulation", "waste-to-energy compliance" |

### Services & Compliance

| Industry Page | Research Query Examples |
|---------------|------------------------|
| `/financial-services` | "ESG reporting financial sector", "SFDR compliance" |
| `/healthcare` | "healthcare carbon footprint EU", "sustainable healthcare" |
| `/logistics` | "logistics decarbonization EU", "ETS road transport" |
| `/public-sector` | "public procurement sustainability EU", "green public tender" |
| `/real-estate` | "EPBD building renovation", "real estate ESG EU" |

### Regulatory Pages

| Page | Research Query Examples |
|------|------------------------|
| `/csrd` | "CSRD implementation challenges", "CSRD double materiality" |
| `/fit-for-55` | "Fit for 55 industry impact", "ETS phase 4 prices" |

---

## Content Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT PIPELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Scheduled   │───▶│  last30days  │───▶│  Content Store   │  │
│  │  Research    │    │  Skill       │    │  (Supabase)      │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│        │                    │                     │             │
│        │                    ▼                     ▼             │
│        │             ┌──────────────┐    ┌──────────────────┐  │
│        │             │  Judge Agent │    │  Industry Pages  │  │
│        │             │  (Synthesis) │    │  (Landing Pages) │  │
│        │             └──────────────┘    └──────────────────┘  │
│        │                    │                     │             │
│        ▼                    ▼                     ▼             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Cron Job    │    │  Newsletter  │    │  Email Signup    │  │
│  │  (Weekly)    │    │  Generator   │    │  CTA             │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Manual Research Pipeline (Week 1)

**Goal**: Validate value before automation

1. **Install skill locally**
   ```bash
   # Already done - skill is at /home/user/dws6/last30days-skill
   # For Claude Code users:
   ln -s /home/user/dws6/last30days-skill ~/.claude/skills/last30days
   ```

2. **Configure API keys** (optional for web-only mode)
   ```bash
   mkdir -p ~/.config/last30days
   cat > ~/.config/last30days/.env << 'EOF'
   OPENAI_API_KEY=sk-...  # For Reddit research
   XAI_API_KEY=xai-...    # For X/Twitter research
   EOF
   ```

3. **Research 3 priority industries manually**
   ```bash
   # Manufacturing (highest CBAM exposure)
   python3 last30days-skill/scripts/last30days.py "EU manufacturing CBAM compliance 2026" --emit=md

   # Energy (ETS carbon pricing)
   python3 last30days-skill/scripts/last30days.py "EU energy carbon pricing ETS 2026" --emit=md

   # Construction (CSRD reporting)
   python3 last30days-skill/scripts/last30days.py "construction CSRD sustainability reporting" --emit=md
   ```

4. **Create industry insights section on landing pages**
   - Add "What's Trending" or "Industry Pulse" section
   - Include top 3-5 insights with engagement metrics
   - Add "Subscribe for weekly updates" CTA

### Phase 2: Semi-Automated Pipeline (Week 2-3)

**Goal**: Streamline research with Firehorse Automation

1. **Create research task in Firehorse Automation**
   ```python
   # Firehorse/Automation/tasks/industry_research.py
   from last30days.scripts.last30days import run_research

   INDUSTRIES = {
       "manufacturing": ["CBAM steel imports", "EU manufacturing decarbonization"],
       "energy": ["EU energy transition", "carbon pricing ETS"],
       "construction": ["embodied carbon", "CSRD construction"],
       # ... other industries
   }

   def research_all_industries():
       results = {}
       for industry, queries in INDUSTRIES.items():
           for query in queries:
               results[f"{industry}_{query}"] = run_research(query)
       return results
   ```

2. **Store results in Supabase**
   ```sql
   -- supabase/migrations/add_industry_insights.sql
   CREATE TABLE industry_insights (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       industry TEXT NOT NULL,
       query TEXT NOT NULL,
       insights JSONB NOT NULL,
       reddit_stats JSONB,
       x_stats JSONB,
       web_sources JSONB,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
   );

   CREATE INDEX idx_industry_insights_industry ON industry_insights(industry);
   CREATE INDEX idx_industry_insights_expires ON industry_insights(expires_at);
   ```

3. **API endpoint for fresh insights**
   ```typescript
   // src/routes/industry-insights.ts
   router.get('/api/insights/:industry', async (req, res) => {
       const { industry } = req.params;
       const insights = await supabase
           .from('industry_insights')
           .select('*')
           .eq('industry', industry)
           .gt('expires_at', new Date().toISOString())
           .order('created_at', { ascending: false })
           .limit(5);

       res.json(insights);
   });
   ```

### Phase 3: Full Automation (Week 4+)

**Goal**: Hands-off content freshness

1. **Cron job for weekly research**
   ```typescript
   // src/cron/industry-research.ts
   import cron from 'node-cron';

   // Every Monday at 6 AM
   cron.schedule('0 6 * * 1', async () => {
       for (const industry of INDUSTRIES) {
           await runResearchForIndustry(industry);
           await generateNewsletterContent(industry);
       }
   });
   ```

2. **Newsletter generation with Firehorse ContentMS**
   - Auto-generate weekly industry digest
   - Use insights as newsletter sections
   - Include engagement metrics as social proof

3. **Landing page dynamic content**
   - Fetch latest insights via API
   - Display "Updated X days ago" freshness indicator
   - Show engagement metrics (upvotes, likes)

---

## Newsletter Integration

### Value Proposition

> "Get weekly industry intelligence powered by real community discussions.
> See what 50,000+ professionals are saying about [INDUSTRY] and EU climate compliance."

### Content Structure

```markdown
# [Industry] Climate Intelligence Weekly

## What's Trending This Week
[Top 3 insights from last30days research with engagement metrics]

## Key Discussions
- [Reddit thread with X upvotes]: "Summary..."
- [X post with Y likes]: "Summary..."

## Expert Take
[AI-synthesized analysis from DWS IQ]

## Action Items
- [Specific compliance deadline]
- [Regulatory update to watch]

---
Want deeper analysis? [Book a consultation →]
```

### Signup Triggers

| Page Section | CTA |
|--------------|-----|
| Industry Pulse widget | "Subscribe for weekly updates" |
| After first insight | "See more in your inbox" |
| Bottom of page | "Join 5,000+ compliance professionals" |

---

## Technical Integration Points

### MCP Server Option

Add last30days as an MCP tool in mcp-hub:

```typescript
// mcp-servers/last30days/index.ts
export const last30daysServer = {
    name: 'last30days',
    description: 'Research trending topics from last 30 days',
    tools: {
        research: {
            description: 'Research a topic across Reddit, X, and web',
            parameters: {
                topic: { type: 'string', required: true },
                emit: { type: 'string', enum: ['compact', 'json', 'md'] }
            },
            execute: async ({ topic, emit }) => {
                // Call Python script
            }
        }
    }
};
```

### Firehorse Automation Integration

```python
# Firehorse/Automation/connectors/last30days.py
import subprocess
import json

def research_topic(topic: str) -> dict:
    """Run last30days research and return structured results."""
    result = subprocess.run(
        ['python3', '~/.claude/skills/last30days/scripts/last30days.py',
         topic, '--emit=json'],
        capture_output=True,
        text=True
    )
    return json.loads(result.stdout)
```

### Dashboard Widget

Add to v9-react dashboard:

```tsx
// dws6.com/dashboard/firehorse/v9-react/src/components/IndustryPulse.tsx
export function IndustryPulse({ industry }: { industry: string }) {
    const { data: insights } = useQuery(['insights', industry],
        () => fetchIndustryInsights(industry)
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Industry Pulse</CardTitle>
                <Badge variant="outline">Updated {insights?.updatedAt}</Badge>
            </CardHeader>
            <CardContent>
                {insights?.items.map(insight => (
                    <InsightCard
                        key={insight.id}
                        title={insight.title}
                        engagement={insight.engagement}
                        source={insight.source}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Newsletter signups | +25% per industry page | Supabase analytics |
| Time on page | +40 seconds | Cloudflare analytics |
| Email open rate | 35%+ | Email provider |
| Consultation bookings | +15% | CRM tracking |

---

## Next Steps

1. [ ] Set up API keys in `~/.config/last30days/.env`
2. [ ] Run manual research for top 3 industries
3. [ ] Design "Industry Pulse" component for landing pages
4. [ ] Create Supabase table for storing insights
5. [ ] Build API endpoint for serving insights
6. [ ] Add newsletter signup CTA to industry pages
7. [ ] Set up weekly cron job for automated research
8. [ ] Create newsletter template in Firehorse ContentMS

---

## Research Query Templates by Use Case

### CBAM Compliance
```
/last30days CBAM [product] imports EU 2026
/last30days carbon border adjustment [industry] impact
```

### ETS Carbon Pricing
```
/last30days EU ETS carbon price [industry]
/last30days emissions trading [sector] compliance
```

### CSRD Reporting
```
/last30days CSRD [industry] reporting requirements
/last30days double materiality [sector] assessment
```

### General Industry Trends
```
/last30days [industry] decarbonization EU
/last30days [industry] sustainability trends 2026
```
