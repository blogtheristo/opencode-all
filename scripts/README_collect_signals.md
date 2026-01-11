# Signal Collection Script - Usage Guide

## Overview

`collect_signals.py` automatically scrapes company news pages for sales signals and saves high-correlation leads to Supabase.

## Installation

```bash
# Install dependencies
pip install -r scripts/requirements-signals.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-service-key
```

## Usage

### Basic Usage

```bash
# Collect signals from all 30 companies (LIVE mode)
python scripts/collect_signals.py

# Dry run (test without saving to database)
python scripts/collect_signals.py --dry-run

# Process only first 5 companies (for testing)
python scripts/collect_signals.py --limit 5

# Enable debug logging
python scripts/collect_signals.py --debug
```

### Scheduled Execution (Cron)

```bash
# Add to crontab (run daily at 07:00)
crontab -e

# Add this line:
0 7 * * * cd /home/user/dws6 && /usr/bin/python3 scripts/collect_signals.py >> logs/signals.log 2>&1
```

## Configuration

### Company Targets

Edit `scripts/signal_targets.json` to add/remove companies:

```json
{
  "target_companies": [
    {
      "name": "NCC AB",
      "country": "SE",
      "news_url": "https://www.ncc.se/om-ncc/press-och-nyheter/",
      "linkedin_url": "https://www.linkedin.com/company/ncc-ab/",
      "priority": "ULTRA"
    }
  ],
  "keywords": {
    "ULTRA": ["CSRD", "Fit for 55", ...],
    "HIGH": ["COO", "CDO", ...],
    "MEDIUM": ["BIM", "Construction 4.0", ...]
  }
}
```

### Priority Levels

- **ULTRA**: Top 10 accounts (NCC, Skanska, PORR, Veidekke, YIT, etc.)
- **HIGH**: Strategic accounts (Peab, Implenia, Caverion, AF Gruppen, etc.)
- **MEDIUM**: Tier 2 accounts
- **LOW**: Monitor only

## Output

### Console Output

```
========================================
Starting signal collection at 2026-01-10 07:00:00
Mode: LIVE
Processing 30 companies
========================================

📰 Scraping NCC AB (SE)...
✓ NCC AB: Found 5 articles
  ✅ Saved: NCC Q4 report mentions CSRD compliance... (score: 5)

📰 Scraping Skanska AB (SE)...
✓ Skanska AB: Found 3 articles
  ✅ Saved: New COO appointed to drive digital transformation... (score: 4)

...

========================================
COLLECTION SUMMARY
========================================
Companies processed:  30
Articles found:       87
Signals saved:        12
  - ULTRA (score 5):  4
  - HIGH (score 4):   8
Duplicates skipped:   3
========================================
```

### Database

Signals are saved to `firehorse_signals` table with:
- `correlation_score`: 4-5 (only HIGH/ULTRA saved)
- `status`: 'detected'
- `signal_content`: First 1000 chars of article
- `keywords_matched`: Array of matched keywords
- `dws6_feature_match`: Array of DWS6 features (CSRD, Fit_for_55, SPI_CPI, etc.)

## Correlation Scoring

| Score | Level  | Triggers | Example |
|-------|--------|----------|---------|
| 5     | ULTRA  | CSRD, Fit for 55, SPI/CPI | "NCC commits to CSRD reporting by 2026" |
| 4     | HIGH   | COO/CDO hire, funding round | "PORR appoints new Chief Digital Officer" |
| 3     | MEDIUM | BIM, digitalization | "Skanska explores BIM for project planning" |
| 1-2   | LOW    | Generic | "Construction company opens new office" |

**Only score 4-5 signals are saved to database.**

## Troubleshooting

### No signals found

```bash
# Run with debug to see what's happening
python scripts/collect_signals.py --debug --limit 3

# Check if websites are accessible
curl -I https://www.ncc.se/om-ncc/press-och-nyheter/
```

### Duplicate signals

The script automatically skips duplicates (same company + same URL).

### Rate limiting / IP blocking

If you get 429 errors:
- Reduce `MAX_ARTICLES_PER_COMPANY` in script
- Add delays between requests
- Use rotating proxies (not implemented yet)

## Next Steps

After collecting signals:

1. **View pending signals:**
   ```sql
   SELECT * FROM firehorse_signals_pending_approval;
   ```

2. **Run message generator:**
   ```bash
   npm run process-signals
   ```

3. **Approve signals in dashboard:**
   Visit `http://localhost:3000/signals`

## Performance

- **Runtime:** ~3-5 minutes for 30 companies
- **Network:** ~150 HTTP requests
- **Memory:** <100 MB
- **Disk:** Minimal (signals are small, ~500 bytes each)

## Maintenance

### Weekly Tasks

1. Review signal quality (are we catching relevant signals?)
2. Add new keywords if needed
3. Update company news URLs if they change

### Monthly Tasks

1. Add/remove companies from target list
2. Review correlation accuracy
3. Optimize scraping selectors if sites change

---

**Last Updated:** 2026-01-10
**Version:** 1.0
**Status:** ✅ Ready for Production
