# Windows 11 Claude Code Setup Guide

This guide walks you through setting up Claude Code on Windows 11 with DWS6 tools, including Bid Scout and Tarjouspalvelu Fetcher.

## Prerequisites

- **Windows 11** (Build 22000 or later)
- **Node.js 24.17.0+** (download from https://nodejs.org/ — v24.20.0 recommended)
- **PowerShell 7+** (built into Windows 11)
- **Git for Windows** (https://git-scm.com/download/win)
- **Claude Code CLI** (https://github.com/anthropics/claude-code)

**Note:** The project requires Node.js ≥24.17.0. If you have an older version (e.g., 22.x or 23.x), follow the upgrade instructions below.

## 1️⃣ Setup .env

Create file: `C:\Users\<YourUsername>\dws6\.env`

```env
CLOUDIA_USER_NAME=risto.paarni@lifetime.fi
CLOUDIA_PASSWORD=<your-cloudia-password>
CLOUDIA_API_URL=https://api.cloudia.net
CLOUDIA_API_KEY=<your-cloudia-api-key>
```

**Important:**

- Replace `<YourUsername>` with your actual Windows username
- Replace `<your-cloudia-password>` with your Cloudia login password
- Replace `<your-cloudia-api-key>` with your Cloudia API key (if available)
- Never commit `.env` to Git — it's in `.gitignore` by default

### Environment Variables Explained

| Variable            | Purpose                                  | Required | Example                    |
| ------------------- | ---------------------------------------- | -------- | -------------------------- |
| `CLOUDIA_USER_NAME` | Email for Cloudia/Tarjouspalvelu login   | Yes      | `risto.paarni@lifetime.fi` |
| `CLOUDIA_PASSWORD`  | Password for login (stored locally only) | Yes      | Your secure password       |
| `CLOUDIA_API_URL`   | Cloudia API endpoint                     | No       | `https://api.cloudia.net`  |
| `CLOUDIA_API_KEY`   | API key for direct API access            | Optional | Your API key               |

## 2️⃣ Install Dependencies

Open PowerShell in the repository directory and run:

```powershell
npm install
npm install playwright
```

This will:

- Install Node.js dependencies from `package.json`
- Download Chromium browser for Playwright (used by Tarjouspalvelu Fetcher)
- Set up the development environment

**First-time setup tip:** The Chromium download may take 2-3 minutes. This is normal.

## 3️⃣ Test Bid Scout

Bid Scout monitors Cloudia for open opportunities that match DWS6 criteria.

```powershell
node scripts\bid-scout.mjs run
```

**Expected output:**

```
🔍 Bid Scout Daily Run
============================================================
Timestamp: 2026-08-27T14:30:00.000Z

🔐 Authenticating with Cloudia API...
✅ Connected to Cloudia. Found 3 open bids

✅ OPPORTUNITY: AI Agent Development for Customer Service
   Score: 85/100 | Win: 68%
   Budget: €50,000-€100,000
   Deadline: 2026-09-30
   Reasons: Budget in range, Geography: FI, Product/service fit detected, 34 days until deadline

...

📈 Summary:
   Total bids: 3
   Opportunities (score ≥60): 1
   Monitor list: 2

💾 Saved 1 opportunities to .workflows/opportunities.json
```

### Bid Scout Scoring Explained

Each bid is scored 0-100 based on:

- **Budget fit (0-30 points):** Aligned with DWS6 service range (€5k-€500k)
- **Geography (0-20 points):** Finland, Sweden, Germany, UK, or US
- **Product fit (0-30 points):** Mentions AI, agents, or DWS services
- **Deadline (0-20 points):** Adequate time to submit offer

Bids scoring ≥60 and meeting win probability thresholds are flagged as "OFFER" opportunities.

## 4️⃣ Test Tarjouspalvelu Fetcher

The Tarjouspalvelu Fetcher logs into tarjouspalvelu.fi and extracts opportunity details.

```powershell
node scripts\tarjouspalvelu-fetch.mjs 5101501
```

Replace `5101501` with the actual opportunity ID.

**Expected output:**

```
🔐 Starting tarjouspalvelu.fi login flow for opportunity 5101501
📄 Loading tarjouspalvelu.fi...
🔑 Entering credentials...
⏳ Submitting login...
⏳ Waiting for authentication...
✅ Authentication successful

🔍 Fetching opportunity: 5101501

📋 OPPORTUNITY DETAILS:

================================================================================
[Full text content of the opportunity from tarjouspalvelu.fi]
================================================================================
```

### Troubleshooting Tarjouspalvelu

| Issue                                           | Solution                                    |
| ----------------------------------------------- | ------------------------------------------- |
| "Missing CLOUDIA_USER_NAME or CLOUDIA_PASSWORD" | Check `.env` has correct credentials        |
| "Timeout waiting for login"                     | Verify Cloudia/Tarjouspalvelu is accessible |
| "Page not found"                                | Verify the tarjous ID exists                |
| "Chrome/Chromium not found"                     | Run `npm install playwright` again          |

## 5️⃣ Schedule Daily (Optional)

Schedule Bid Scout to run automatically every morning at 08:00 UTC.

### Step 1: Create the scheduled task PowerShell script

Save as `C:\Users\<YourUsername>\dws6\scripts\daily\bid-scout-daily.ps1`:

```powershell
# DWS6 Bid Scout Daily Task
# Scheduled to run every morning at 08:00 UTC

param(
    [string]$RepoPath = "C:\Users\$env:USERNAME\dws6",
    [string]$LogPath = "$RepoPath\.workflows\bid-scout-daily.log"
)

# Ensure .workflows directory exists
if (-not (Test-Path "$RepoPath\.workflows")) {
    New-Item -ItemType Directory -Path "$RepoPath\.workflows" -Force | Out-Null
}

# Start logging
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogPath -Value "`n[$timestamp] Starting Bid Scout daily run..."

# Run Bid Scout
try {
    Push-Location $RepoPath
    $output = & node scripts\bid-scout.mjs run 2>&1
    Add-Content -Path $LogPath -Value $output
    Write-Host "✅ Bid Scout completed successfully"
} catch {
    Add-Content -Path $LogPath -Value "❌ Error: $_"
    Write-Host "❌ Bid Scout failed: $_"
    exit 1
} finally {
    Pop-Location
}

exit 0
```

### Step 2: Register the Scheduled Task

Run PowerShell as **Administrator** and execute:

```powershell
$Action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\Users\<YourUsername>\dws6\scripts\daily\bid-scout-daily.ps1"

$Trigger = New-ScheduledTaskTrigger `
  -Daily `
  -At 08:00

$Principal = New-ScheduledTaskPrincipal `
  -UserID "$env:USERDOMAIN\$env:USERNAME" `
  -LogonType S4U

Register-ScheduledTask `
  -TaskName "DWS-BidScout-Daily" `
  -Action $Action `
  -Trigger $Trigger `
  -Principal $Principal `
  -RunLevel Highest `
  -Description "Daily monitoring of Cloudia bids via DWS6 Bid Scout"
```

Replace `<YourUsername>` with your actual Windows username.

### Verify the Scheduled Task

```powershell
# List the task
Get-ScheduledTask -TaskName "DWS-BidScout-Daily" | Format-List

# Run manually (for testing)
Start-ScheduledTask -TaskName "DWS-BidScout-Daily"

# View task history
Get-ScheduledTaskInfo -TaskName "DWS-BidScout-Daily"
```

### Stop the Scheduled Task

```powershell
Unregister-ScheduledTask -TaskName "DWS-BidScout-Daily" -Confirm:$false
```

## 📊 View Results

### Today's Opportunities

View the most recent scan results:

```powershell
cat .workflows\opportunities.json
```

**Output format:**

```json
{
  "date": "2026-08-27T14:30:00.000Z",
  "total_opportunities": 2,
  "total_potential_value": 250000,
  "opportunities": [
    {
      "id": "cloudia_bid_001",
      "title": "AI Agent Development for Customer Service",
      "buyer": "TechCorp Finland",
      "budget_midpoint": 75000,
      "deadline": "2026-09-30",
      "score": 85,
      "win_probability": 0.68,
      "reasons": ["Budget in range", "Geography: FI", "Product/service fit detected"],
      "action": "OFFER",
      "assessment_date": "2026-08-27T14:30:00.000Z"
    }
  ]
}
```

### All-Time Bid Log

View the complete history of all bids checked:

```powershell
cat .workflows\bids-log.jsonl
```

This JSONL file (one JSON object per line) contains every bid processed, including those that didn't meet the threshold. Useful for trend analysis and historical reference.

### Last Scan Status

Quick summary of the latest run:

```powershell
node scripts\bid-scout.mjs status
```

**Output:**

```
📊 Latest Bid Scout Results
Date: 2026-08-27T14:30:00.000Z
Opportunities: 2
Total value: €250,000
  • AI Agent Development for Customer Service (Score: 85/100)
  • Enterprise AI Integration Platform (Score: 72/100)
```

## 🔧 Troubleshooting

### Node.js version too old

**Warning:** `npm warn EBADENGINE Unsupported engine { required: { node: '>=24.17.0' }, current: { node: 'vX.X.X' } }`

This means your Node.js version is below 24.17.0 (e.g., Node 22.x, 23.x). While scripts may run, update to Node 24.20.0+ for full compatibility.

**Solution (choose one):**

**Option A: Direct Download**

1. Visit https://nodejs.org/
2. Download Node.js 24.20.0 LTS (or latest)
3. Run installer, accept defaults
4. Restart PowerShell
5. Verify: `node --version` (should show v24.20.0+)

**Option B: Using nvm-windows (Version Manager)**

1. Install nvm-windows: https://github.com/coreybutler/nvm-windows/releases
2. Open PowerShell as Administrator
3. Run:
   ```powershell
   nvm install 24.20.0
   nvm use 24.20.0
   node --version  # Verify
   ```

**Option C: Using Chocolatey**

```powershell
choco upgrade nodejs --version=24.20.0
```

After upgrade, re-run `npm install` to confirm:

```powershell
npm install  # Should show no EBADENGINE warning
```

### npm install fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**

```powershell
npm install --legacy-peer-deps
```

### Playwright installation fails

**Error:** `Error: Failed to download Chromium`

**Solution:**

```powershell
# Set proxy (if behind corporate proxy)
npm config set proxy http://proxy.corporate.com:8080
npm config set https-proxy http://proxy.corporate.com:8080

# Retry install
npm install playwright --force
```

### .env file not being read

**Symptom:** Scripts run but environment variables are undefined

**Solution:**

1. Verify `.env` is in the repository root: `C:\Users\<YourUsername>\dws6\.env`
2. Check file is readable: `Get-Item -Path .\.env`
3. Verify format (no leading spaces):
   ```
   CLOUDIA_USER_NAME=value
   CLOUDIA_PASSWORD=value
   ```

### Cloudia API connection fails

**Error:** `Cloudia API error: 401 Unauthorized`

**Solution:**

- Verify credentials in `.env`
- Check `CLOUDIA_API_KEY` is set (if required)
- Verify Cloudia API is accessible: `Invoke-WebRequest https://api.cloudia.net/api/v1/health`

### Tarjouspalvelu login timeout

**Error:** `Timeout: browser.waitForNavigation 15000ms`

**Solution:**

1. Verify credentials are correct
2. Check internet connectivity
3. Verify tarjouspalvelu.fi is accessible
4. Try increasing timeout in `scripts/tarjouspalvelu-fetch.mjs`

## 📝 Daily Workflow

### Morning (Automated)

1. ⏰ 08:00 UTC: Scheduled task runs Bid Scout
2. 📊 Results saved to `.workflows/opportunities.json`
3. 📧 (Optional) Set up email alerts on high-value opportunities

### During Day (Manual)

1. 🔍 Review new opportunities:

   ```powershell
   node scripts\bid-scout.mjs status
   ```

2. 📋 Fetch details of promising opportunities:

   ```powershell
   node scripts\tarjouspalvelu-fetch.mjs <tarjousid>
   ```

3. 📝 Draft proposal based on fetched details

### End of Week

1. 📊 Analyze bid history:

   ```powershell
   # Count total opportunities by week
   Get-Content .workflows\bids-log.jsonl | Measure-Object -Line
   ```

2. 🎯 Update scoring criteria in `scripts/bid-scout.mjs` if needed

## 🚀 Advanced Usage

### Custom Bid Scout Criteria

Edit `scripts/bid-scout.mjs` to adjust scoring:

```javascript
const CRITERIA = {
  minValue: 5000, // Minimum budget (EUR)
  maxValue: 500000, // Maximum budget (EUR)
  ourProductsFit: ["dws_iq", "agent_services", "consulting"],
  geographies: ["FI", "SE", "DE", "UK", "US"],
  minWinProbability: 0.6, // 60% win probability threshold
};
```

### Export Results to CSV

```powershell
# PowerShell one-liner to export opportunities to CSV
$opps = Get-Content .workflows\opportunities.json | ConvertFrom-Json
$opps.opportunities | Export-Csv -Path .workflows\opportunities-export.csv -NoTypeInformation
```

### Set Up Email Alerts

Create a PowerShell function to email high-value opportunities:

```powershell
function Send-BidAlert {
    param([string]$BidTitle, [decimal]$Value)

    $params = @{
        From = 'your-email@lifetime.fi'
        To = 'risto.paarni@lifetime.fi'
        Subject = "🎯 DWS6 Bid Alert: $BidTitle"
        Body = "High-value opportunity: €$Value"
        SmtpServer = 'smtp.gmail.com'
        Port = 587
        UseSsl = $true
        Credential = (Get-Credential)
    }
    Send-MailMessage @params
}
```

## 📚 Reference

### Output Files

| File                             | Purpose                           | Format |
| -------------------------------- | --------------------------------- | ------ |
| `.workflows/opportunities.json`  | Current opportunities (score ≥60) | JSON   |
| `.workflows/bids-log.jsonl`      | Historical bid log                | JSONL  |
| `.workflows/bid-scout-daily.log` | Scheduled task logs               | Text   |

### Command Reference

```powershell
# Run Bid Scout
node scripts\bid-scout.mjs run

# Check Bid Scout status
node scripts\bid-scout.mjs status

# Get Bid Scout help
node scripts\bid-scout.mjs --help

# Fetch Tarjouspalvelu opportunity
node scripts\tarjouspalvelu-fetch.mjs <tarjousid>
```

### Environment Variables Reference

```powershell
# View current environment variables
Get-ChildItem env: | Where-Object { $_.Name -like "CLOUDIA*" }

# Temporarily set for current session
$env:CLOUDIA_API_KEY = "your-key"

# Verify .env is loaded
node -e "require('dotenv/config'); console.log(process.env.CLOUDIA_USER_NAME)"
```

## ❓ FAQ

**Q: Why does Bid Scout use mock data?**
A: If `CLOUDIA_API_KEY` is not set in `.env`, it uses sample data for testing. Set the environment variable to use live Cloudia data.

**Q: Can I run multiple instances of Bid Scout?**
A: Not recommended. Multiple instances may cause file locking issues on `.workflows/opportunities.json`. The scheduled task ensures single daily execution.

**Q: How do I update Playwright?**
A: Run `npm install playwright@latest` — Chromium will be re-downloaded automatically.

**Q: Can Bid Scout run on weekends?**
A: Yes, modify the trigger:

```powershell
$Trigger = New-ScheduledTaskTrigger -Daily -At 08:00  # Runs every day
```

**Q: How do I disable the scheduled task?**
A:

```powershell
Disable-ScheduledTask -TaskName "DWS-BidScout-Daily"
```

## 🆘 Getting Help

- **Claude Code issues:** See `.claude/` directory for hooks and configuration
- **Script bugs:** Check `git log -- scripts/` for recent changes
- **Cloudia API:** Refer to https://api.cloudia.net/docs
- **Tarjouspalvelu:** Visit https://tarjouspalvelu.fi
- **Windows Task Scheduler:** See https://learn.microsoft.com/windows/win32/taskschd/

---

**Last updated:** 2026-08-27  
**Version:** 1.0  
**Maintained by:** DWS6 Development Team
