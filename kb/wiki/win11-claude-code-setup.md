# Windows 11 Claude Code Setup & Bid Monitoring

**Last updated:** 2026-08-29  
**Related:** [Procurement Integration — Cloudia](procurement-integration-cloudia.md)

## Overview

Complete setup guide for running Claude Code on Windows 11 with DWS6's bid monitoring and procurement tools (Bid Scout agent + Tarjouspalvelu Fetcher).

## Key Components

### Bid Scout Agent

- **Purpose:** Daily monitoring of Cloudia opportunities
- **Scoring:** Budget (€5k-€500k), geography (FI/SE/DE/UK/US), product fit, deadline
- **Automation:** Windows Task Scheduler (08:00 UTC daily)
- **Output:** `.workflows/opportunities.json` + historical `.workflows/bids-log.jsonl`

### Tarjouspalvelu Fetcher

- **Purpose:** Browser automation to extract opportunity details from tarjouspalvelu.fi
- **Technology:** Playwright (Chromium)
- **Auth:** Cloudia credentials via `.env` (CLOUDIA_USER_NAME, CLOUDIA_PASSWORD)
- **Usage:** `node scripts\tarjouspalvelu-fetch.mjs <tarjousid>`

## Environment Setup

**File:** `.env` at `C:\Users\<YourUsername>\dws6\.env`

Set these variables from your Cloudia account:

- `CLOUDIA_USER_NAME` — Email login
- `CLOUDIA_PASSWORD` — Login credential
- `CLOUDIA_API_URL` — API endpoint (default: https://api.cloudia.net)
- `CLOUDIA_API_KEY` — Optional API key for direct access

**Never commit `.env` to Git** — it's in `.gitignore` by default.

## System Requirements

- **Windows 11** (Build 22000+)
- **Node.js 24.17.0+** (v24.19.0 minimum tested; v24.20.0 recommended)
  - Upgrade methods: direct installer, nvm-windows, Chocolatey
- **PowerShell 7+** (built into Windows 11)
- **Administrator access** (for task scheduling)

## Installation & Testing

### Step 1: Install Dependencies

```powershell
npm install
npm install playwright
```

### Step 2: Test Bid Scout

```powershell
node scripts\bid-scout.mjs run
```

Expected: 3-5 test opportunities scored and logged.

### Step 3: Test Tarjouspalvelu Fetcher

```powershell
node scripts\tarjouspalvelu-fetch.mjs <tarjousid>
```

Expected: Fetches opportunity details from tarjouspalvelu.fi.

### Step 4: Schedule Daily Automation (Optional)

Create PowerShell script `scripts\daily\bid-scout-daily.ps1` and register via Windows Task Scheduler.

## Common Issues & Solutions

| Issue                            | Solution                                                               |
| -------------------------------- | ---------------------------------------------------------------------- |
| EBADENGINE: Node version too old | Install Node 24.17.0+ (direct, nvm-windows, or Chocolatey)             |
| npm install fails (ERESOLVE)     | `npm install --legacy-peer-deps`                                       |
| Playwright download fails        | Set proxy: `npm config set proxy http://proxy:8080`                    |
| .env not being read              | Verify file at `C:\Users\<YourUsername>\dws6\.env` (no leading spaces) |
| Cloudia API 401 Unauthorized     | Check credentials in `.env` and API key (if required)                  |
| Tarjouspalvelu login timeout     | Verify internet, check credentials, increase timeout in script         |

## Daily Workflow

1. **Morning (08:00 UTC):** Scheduled task runs Bid Scout
2. **Review:** Check `.workflows/opportunities.json` for actionable bids (score ≥60)
3. **Action:** Fetch details with Tarjouspalvelu Fetcher
4. **Draft:** Create proposal based on fetched opportunity

## Advanced Usage

### Custom Bid Scoring

Edit `scripts/bid-scout.mjs` CRITERIA object:

- `minValue` / `maxValue` — Budget range (EUR)
- `geographies` — Supported regions
- `minWinProbability` — Threshold to flag as "OFFER"

### Export to CSV

```powershell
$opps = Get-Content .workflows\opportunities.json | ConvertFrom-Json
$opps.opportunities | Export-Csv -Path .workflows\export.csv -NoTypeInformation
```

### Email Alerts

Set up PowerShell function to email high-value opportunities via SES or Gmail.

## Related Documentation

- **Full guide:** `docs/WIN11_CLAUDE_CODE_SETUP.md` (~620 lines, all steps + troubleshooting)
- **Scripts:** `scripts/bid-scout.mjs`, `scripts/tarjouspalvelu-fetch.mjs`
- **Session checkpoint:** `.claude/handoffs/claude/win11-claude-code-setup-hi72lr.md`
- **PR #1915:** GitHub pull request with complete implementation
- **Field note:** `docs/field-notes/2026-08-29-win11-claude-code-setup.md`
- **Learning page:** `Learn/2026-08-29-win11-claude-code-setup.html`

## References

- [Cloudia API Docs](https://api.cloudia.net/docs)
- [Tarjouspalvelu](https://tarjouspalvelu.fi)
- [Node.js Downloads](https://nodejs.org/)
- [Playwright Documentation](https://playwright.dev)
- [Windows Task Scheduler](https://learn.microsoft.com/windows/win32/taskschd/)
