# Cloudia Integration Guide

**Daily Bid Monitoring Setup**

---

## Prerequisites

1. Cloudia account with API access enabled
2. API credentials (API Key or OAuth token)
3. Node.js environment with dotenv support

---

## Setup Steps

### Step 1: Configure Environment

Create `.env` file in project root (NOT committed to git):

```bash
# .env (NEVER commit this file)
CLOUDIA_API_KEY=your_actual_api_key_here
CLOUDIA_API_URL=https://api.cloudia.net
CLOUDIA_USERNAME=risto.paarni@lifetime.fi
```

**Verify `.env` is ignored:**

```bash
# Add to .gitignore if not present
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### Step 2: Install Dependencies

```bash
npm install dotenv
```

### Step 3: Test Connection

```bash
# Test bid scout with live Cloudia API
node scripts/bid-scout.mjs run
```

**Expected output if authenticated:**

```
🔍 Bid Scout Daily Run
============================================================
🔐 Authenticating with Cloudia API...
✅ Connected to Cloudia. Found N open bids
```

### Step 4: Schedule Daily Scan

**Option A: Cron (Linux/Mac)**

```bash
# Add to crontab
crontab -e

# Add this line (runs daily at 08:00 UTC)
0 8 * * * cd /path/to/dws6 && bash scripts/daily/bid-scout-daily.sh >> /var/log/bid-scout.log 2>&1
```

**Option B: systemd timer (Linux)**

Create `/etc/systemd/system/bid-scout.service`:

```ini
[Unit]
Description=Daily Bid Scout - Cloudia Monitoring
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/home/admin100/dws6
ExecStart=/bin/bash scripts/daily/bid-scout-daily.sh
User=admin100
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
```

Create `/etc/systemd/system/bid-scout.timer`:

```ini
[Unit]
Description=Daily Bid Scout Timer
Requires=bid-scout.service

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 08:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bid-scout.timer
sudo systemctl start bid-scout.timer
```

**Option C: Windows Task Scheduler**

```powershell
$Action = New-ScheduledTaskAction -Execute "pwsh.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File $(pwd)/scripts/daily/bid-scout-daily.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At 08:00
Register-ScheduledTask -TaskName "BidScoutDaily" -Action $Action -Trigger $Trigger
```

---

## Output Files

### `.workflows/opportunities.json`

Today's actionable opportunities:

```json
{
  "date": "2026-08-27T08:00:00Z",
  "total_opportunities": 3,
  "total_potential_value": 280000,
  "opportunities": [
    {
      "id": "cloudia_bid_001",
      "title": "AI Agent Development",
      "buyer": "TechCorp Finland",
      "budget_midpoint": 75000,
      "deadline": "2026-09-30",
      "score": 100,
      "win_probability": 0.95,
      "action": "OFFER",
      "reasons": ["Budget in range", "Geography: FI", "Product fit"]
    }
  ]
}
```

### `.workflows/bids-log.jsonl`

Historical log (append-only) of all bids scanned:

```
{"id":"cloudia_bid_001","score":100,"win_probability":0.95,...}
{"id":"cloudia_bid_002","score":100,"win_probability":0.95,...}
```

---

## Integration with Offer Generation

When bid-scout finds opportunities (`score ≥ 60`, `win_probability ≥ 60%`), it triggers:

1. **Outreach Agent**: Creates draft offer
2. **Compliance Check**: Validates legal + GDPR
3. **Pricing Validator**: Matches products.json
4. **Calendar**: Adds deadline reminder (30 days)
5. **CRM Sync**: Links to customer master (Risto)

---

## Troubleshooting

### "CLOUDIA_API_KEY not set in .env"

**Fix:** Create `.env` file with valid API key

```bash
echo "CLOUDIA_API_KEY=your_key" > .env
```

### "Cloudia API error: 401 Unauthorized"

**Fix:** Check API key validity

- Verify key hasn't expired
- Regenerate key in Cloudia dashboard
- Ensure Bearer token format

### "Cloudia API error: 403 Forbidden"

**Fix:** Check API permissions

- Ensure account has "Bid Scanning" permission
- Contact Cloudia support if needed

### "Connection timeout"

**Fix:** Check network and API URL

```bash
# Test connectivity
curl -I https://api.cloudia.net/api/v1/health
```

---

## Security Best Practices

✅ **DO:**

- Store credentials in `.env` (git-ignored)
- Rotate API keys regularly (monthly)
- Use separate API keys per environment (dev/prod)
- Log scanning activity
- Monitor for unusual patterns

❌ **DON'T:**

- Commit `.env` to git
- Share API keys in messages/emails
- Use personal login passwords (use API keys instead)
- Log sensitive bid data in public logs

---

## Performance

**Typical scan:**

- Time: 15-30 seconds (depends on Cloudia API latency)
- Bids scanned: 100+ per run
- CPU usage: <5%
- Memory: ~50MB

**Daily cost:** ~0.01 EUR (Cloudia API cost, if charged)

---

## Next Steps

1. ✅ Set up `.env` with valid credentials
2. ✅ Run `node scripts/bid-scout.mjs run` to verify
3. ✅ Schedule daily execution (cron/systemd/Task Scheduler)
4. ✅ Set up Slack webhook for notifications (optional)
5. ✅ Wire offer generation agent to opportunities output

---

## Example Workflow

```
08:00 UTC: Daily bid-scout-daily.sh runs
    ↓
Fetches bids from Cloudia API (100+ bids)
    ↓
Scores each bid (0-100)
    ↓
Filters opportunities (score ≥60, win ≥60%)
    ↓
Saves to .workflows/opportunities.json
    ↓
Sends Slack notification
    ↓
Next: Outreach agent creates offers for opportunities
```

---

## Status Check

```bash
# See last scan results
node scripts/bid-scout.mjs status

# Show today's opportunities
jq '.opportunities[] | {title, score, budget_midpoint}' .workflows/opportunities.json

# Count total bids scanned (all time)
wc -l .workflows/bids-log.jsonl
```
