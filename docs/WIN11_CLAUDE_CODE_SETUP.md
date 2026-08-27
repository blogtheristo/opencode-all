# Windows 11 Claude Code — Procurement Monitoring Setup

Run the automated tarjouspalvelu.fi bid scanner on Windows 11 Claude Code.

---

## Prerequisites

- Claude Code installed (Windows 11)
- PowerShell (admin access for task scheduler setup — optional)
- Node.js 18+ (`node --version`)
- npm (`npm --version`)

---

## Step 1: Environment Setup

### Create `.env` file

**File location:** `C:\Users\<YourUser>\dws6\.env`

**Contents:**

```bash
CLOUDIA_USER_NAME=risto.paarni@lifetime.fi
CLOUDIA_PASSWORD=<your-password>
CLOUDIA_API_URL=https://api.cloudia.net
CLOUDIA_API_KEY=<your-api-key-if-available>
```

**Security:**

- `.env` is in `.gitignore` (never committed)
- Keep this file private — do not share or commit

---

## Step 2: Install Dependencies

Run in Claude Code terminal:

```powershell
npm install
npm install playwright
```

Verify Playwright is installed:

```powershell
npm list playwright
```

Expected output:

```
└── playwright@1.59.1
```

---

## Step 3: Run Bid Scout (One-Time Test)

Test the bid scanner with mock data:

```powershell
node scripts/bid-scout.mjs run
```

**Expected output:**

```
🔍 Bid Scout Daily Run
============================================================
📊 Found N open bids on Cloudia

✅ OPPORTUNITY: <title>
   Score: XX/100 | Win: XX%
   ...
```

---

## Step 4: Fetch Tarjouspalvelu Opportunity

Test fetching a specific opportunity (requires CLOUDIA credentials):

```powershell
node scripts/tarjouspalvelu-fetch.mjs 5101501
```

**What happens:**

1. Logs into tarjouspalvelu.fi via Playwright
2. Navigates to opportunity `tarjousid=5101501`
3. Extracts and displays full details

---

## Step 5: Schedule Daily Execution (Windows Task Scheduler)

### Option A: Manual PowerShell Script (Recommended)

**Create file:** `C:\Users\<YourUser>\dws6\scripts\daily\bid-scout-daily.ps1`

```powershell
# Bid Scout Daily Runner for Windows

$ProjectRoot = "C:\Users\<YourUser>\dws6"
$LogFile = "$ProjectRoot\logs\bid-scout-daily.log"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"

Add-Content -Path $LogFile -Value "[$Timestamp] 🔍 Starting daily Bid Scout run..."

try {
    Set-Location $ProjectRoot
    $output = & node scripts\bid-scout.mjs run 2>&1
    Add-Content -Path $LogFile -Value $output
    Add-Content -Path $LogFile -Value "[$Timestamp] ✅ Bid Scout completed successfully"

    # Extract opportunity count
    if ($output -match "Total opportunities \(score ≥60\): (\d+)") {
        $opportunities = $matches[1]
        Add-Content -Path $LogFile -Value "[$Timestamp] 📊 Found $opportunities opportunities"
    }
} catch {
    Add-Content -Path $LogFile -Value "[$Timestamp] ❌ Error: $_"
}
```

### Create Windows Task Scheduler Entry

**In PowerShell (as Administrator):**

```powershell
$Action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\Users\<YourUser>\dws6\scripts\daily\bid-scout-daily.ps1"

$Trigger = New-ScheduledTaskTrigger -Daily -At 08:00

$Settings = New-ScheduledTaskSettingsSet `
  -RunOnlyIfNetworkAvailable `
  -StartWhenAvailable

Register-ScheduledTask `
  -TaskName "DWS-BidScout-Daily" `
  -Action $Action `
  -Trigger $Trigger `
  -Settings $Settings `
  -Description "Daily Cloudia/tarjouspalvelu.fi bid scanner" `
  -RunLevel Highest
```

**Verify it was created:**

```powershell
Get-ScheduledTask -TaskName "DWS-BidScout-Daily" | Select-Object *
```

**Delete task (if needed):**

```powershell
Unregister-ScheduledTask -TaskName "DWS-BidScout-Daily" -Confirm:$false
```

---

## Step 6: Monitor Execution

### View logs

```powershell
Get-Content C:\Users\<YourUser>\dws6\logs\bid-scout-daily.log -Tail 50
```

### Check last run status

```powershell
$task = Get-ScheduledTaskInfo -TaskName "DWS-BidScout-Daily"
Write-Host "Last run: $($task.LastRunTime)"
Write-Host "Last result: $($task.LastTaskResult)" # 0 = success, non-zero = failed
```

---

## Step 7: Daily Workflows

### Manual execution (anytime)

```powershell
node scripts\bid-scout.mjs run
```

### Check last results

```powershell
node scripts\bid-scout.mjs status
```

### Fetch specific opportunity

```powershell
node scripts\tarjouspalvelu-fetch.mjs <tarjousid>
```

---

## Output Files

| File                            | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `.workflows/opportunities.json` | Today's actionable opportunities   |
| `.workflows/bids-log.jsonl`     | Historical log of all scanned bids |
| `logs/bid-scout-daily.log`      | Execution logs                     |
| `contracts/offers/`             | Generated offer documents          |

---

## Troubleshooting

### "Cannot find package 'playwright'"

```powershell
npm install playwright --save-dev
npm run build  # if applicable
```

### Task Scheduler shows "Task Completed with an error"

Check log file:

```powershell
Get-Content logs\bid-scout-daily.log
```

Common issues:

- `.env` not found in project root
- CLOUDIA credentials invalid
- Network error reaching Cloudia/tarjouspalvelu.fi

### PowerShell execution policy error

Run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Integration with Claude Code

### Run from Claude Code terminal

All commands work directly in Claude Code's integrated terminal:

```powershell
node scripts\bid-scout.mjs run
node scripts\tarjouspalvelu-fetch.mjs 5101501
```

### Edit and test scripts

1. Open `scripts/bid-scout.mjs` in Claude Code editor
2. Make changes
3. Run `node scripts\bid-scout.mjs run` in terminal
4. Logs appear immediately

---

## Next Steps

1. ✅ Set up `.env` with CLOUDIA credentials
2. ✅ Run bid-scout test: `node scripts\bid-scout.mjs run`
3. ✅ Test tarjouspalvelu fetch: `node scripts\tarjouspalvelu-fetch.mjs 5101501`
4. ✅ Schedule daily task (optional)
5. ✅ Monitor results in `.workflows/opportunities.json`

---

## Support

- **Bid Scout Help:** `node scripts\bid-scout.mjs --help`
- **Tarjouspalvelu Help:** `node scripts\tarjouspalvelu-fetch.mjs --help`
- **Error logs:** `logs/bid-scout-daily.log`
- **Documentation:** `docs/CLOUDIA_INTEGRATION.md`, `docs/TARJOUSPALVELU_LOGIN_RULE.md`
