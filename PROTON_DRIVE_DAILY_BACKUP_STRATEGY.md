# 🔒 PROTON DRIVE DAILY BACKUP STRATEGY
**Purpose:** Ensure all Proton Drive files are backed up daily  
**Created:** January 11, 2026  
**Status:** ✅ ACTIVE

---

## 📋 Executive Summary

You need a **multi-layered backup strategy** to protect your Proton Drive files against:
- ❌ Sync conflicts and file loss
- ❌ Accidental deletions
- ❌ Corrupted files
- ❌ System failures
- ❌ Security incidents (like today's Copilot script issue)

**Solution:** Automated daily backups with 3 backup locations + Git protection.

---

## 🎯 Three-Tier Backup Strategy

### TIER 1: Local System Backup (Primary)
**What:** Automated Windows backup of Proton Drive folder  
**Frequency:** Daily  
**Retention:** 30 days  
**Time:** 3:00 AM  

### TIER 2: Cloud Backup (Secondary)
**What:** AWS S3 or similar cloud storage backup  
**Frequency:** Daily  
**Retention:** 90 days  
**Time:** 3:30 AM  

### TIER 3: Git Repository Backup (Repository-specific)
**What:** Git-based backup for code and configuration  
**Frequency:** Continuous (every commit) + Daily full backup  
**Retention:** Indefinite (GitHub stores all history)  
**Location:** GitHub + local `.git` folder  

---

## 📍 SETUP INSTRUCTIONS

### TIER 1: Windows Backup Setup

#### Step 1: Enable Windows Backup

```powershell
# Run as Administrator
Start-Process ms-settings:backup
```

**In Settings:**
1. Settings → System → Backup
2. Click "Backup options"
3. Click "Add a drive"
4. Select external USB drive or network location
5. Click "Back up now"

#### Step 2: Configure Backup Schedule

```powershell
# Create PowerShell script to run backups
$backupScript = @'
# Daily backup script for Proton Drive
$protonPath = "D:\Proton\My files\2026"
$backupPath = "E:\Backups\Proton-Drive"  # Change to your external drive
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"

# Create daily folder
$dailyBackup = Join-Path $backupPath $timestamp
New-Item -ItemType Directory -Path $dailyBackup -Force

# Robocopy with exclusions
robocopy "$protonPath" "$dailyBackup" /MIR /V /LOG:"$dailyBackup\backup.log" `
    /XD ".git" "node_modules" ".next" "venv" `
    /XF "*.log" ".env.mcp" "*.tmp"

Write-Host "Backup completed: $dailyBackup" -ForegroundColor Green
'@

# Save script
$scriptPath = "C:\Scripts\Proton-Backup-Daily.ps1"
Set-Content -Path $scriptPath -Value $backupScript -Force

# Make executable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

#### Step 3: Schedule Task (Windows Task Scheduler)

```powershell
# Create scheduled task to run daily at 3:00 AM
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Scripts\Proton-Backup-Daily.ps1 -NoProfile"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBattery -DontStopIfGoingOnBattery
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Password

Register-ScheduledTask `
    -TaskName "Proton-Drive-Daily-Backup" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Daily backup of Proton Drive folder" `
    -Force

Write-Host "✅ Scheduled task created: Proton-Drive-Daily-Backup" -ForegroundColor Green
```

#### Step 4: Verify Backup

```powershell
# Check backup folder
Get-ChildItem "E:\Backups\Proton-Drive" -Directory | Sort-Object LastWriteTime -Descending | Select-Object Name, @{Name="Size(MB)"; Expression={(Get-ChildItem -Path $_.FullName -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB -as [int]}} -First 10

# Test restore
Copy-Item "E:\Backups\Proton-Drive\2026-01-11_030000\Repos2026\dws6\.env.mcp" -Destination "D:\Proton\My files\2026\Repos2026\dws6\.env.mcp.test"
```

---

### TIER 2: Cloud Backup Setup (AWS S3)

#### Step 1: Create AWS Account & S3 Bucket

```powershell
# Install AWS CLI
winget install Amazon.AWSCLI

# Configure AWS credentials
aws configure
# Enter: Access Key ID
# Enter: Secret Access Key
# Region: eu-central-1 (or your region)
# Output: json
```

#### Step 2: Create S3 Bucket

```powershell
# Via AWS Management Console:
# 1. Go to S3 → Create Bucket
# 2. Name: dws6-proton-drive-backup
# 3. Region: eu-central-1
# 4. Block public access: ✅ ON
# 5. Versioning: ✅ ON (keep file history)
# 6. Server-side encryption: ✅ ON

# Or via CLI:
aws s3api create-bucket `
    --bucket dws6-proton-drive-backup `
    --region eu-central-1 `
    --create-bucket-configuration LocationConstraint=eu-central-1

# Enable versioning
aws s3api put-bucket-versioning `
    --bucket dws6-proton-drive-backup `
    --versioning-configuration Status=Enabled
```

#### Step 3: Create Backup Script

```powershell
# Script: Cloud-Backup-Proton.ps1
$protonPath = "D:\Proton\My files\2026\Repos2026\dws6"
$s3Bucket = "dws6-proton-drive-backup"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$s3Path = "proton-drive-backups/$timestamp"

# Exclude sensitive files
$excludeFiles = @(
    "node_modules",
    ".git\objects",  # Only exclude large git objects
    ".next",
    "*.log",
    ".env.mcp"       # NEVER backup sensitive env files to cloud
)

# Sync to S3 (only non-excluded files)
Write-Host "Starting S3 backup to $s3Bucket/$s3Path..." -ForegroundColor Cyan

aws s3 sync "$protonPath" "s3://$s3Bucket/$s3Path/" `
    --region eu-central-1 `
    --exclude ".git/*" `
    --exclude ".env.mcp" `
    --exclude "node_modules/*" `
    --exclude ".next/*" `
    --exclude "*.log" `
    --include ".env*.example" `
    --storage-class STANDARD_IA `
    --metadata "backup-date=$timestamp,backup-type=proton-drive"

Write-Host "✅ S3 backup complete: $s3Path" -ForegroundColor Green

# Also sync to local folder for quick access
$localBackupPath = "C:\Local-Backups\Proton-Drive\$timestamp"
Copy-Item -Path "$protonPath\*" -Destination $localBackupPath -Recurse -Force
Write-Host "✅ Local backup complete: $localBackupPath" -ForegroundColor Green
```

#### Step 4: Schedule Cloud Backup

```powershell
# Create scheduled task for cloud backup at 3:30 AM
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Scripts\Cloud-Backup-Proton.ps1 -NoProfile"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:30AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBattery -DontStopIfGoingOnBattery
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME"

Register-ScheduledTask `
    -TaskName "Proton-Drive-Cloud-Backup-S3" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Daily cloud backup to AWS S3" `
    -Force

Write-Host "✅ Cloud backup scheduled: Proton-Drive-Cloud-Backup-S3" -ForegroundColor Green
```

---

### TIER 3: Git Repository Backup

#### Step 1: Create Git Backup Script

```powershell
# Script: Git-Backup-Repository.ps1

$repoPath = "D:\Proton\My files\2026\Repos2026\dws6"
$backupPath = "C:\Git-Backups"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$bundleFile = "$backupPath\dws6-backup-$timestamp.bundle"

# Ensure backup directory exists
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Navigate to repo
Push-Location $repoPath

# Create bundle (complete backup of all commits, branches, tags)
git bundle create $bundleFile --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git bundle created: $bundleFile" -ForegroundColor Green
    Write-Host "   Size: $((Get-Item $bundleFile).Length / 1MB -as [int]) MB" -ForegroundColor Green
    
    # Also push to GitHub
    git push --all origin
    git push --tags origin
    Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ Git bundle failed" -ForegroundColor Red
}

Pop-Location

# Verify bundle
git bundle verify $bundleFile
```

#### Step 2: Schedule Git Backup

```powershell
# Create scheduled task at 4:00 AM
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Scripts\Git-Backup-Repository.ps1 -NoProfile"
$trigger = New-ScheduledTaskTrigger -Daily -At 4:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBattery
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME"

Register-ScheduledTask `
    -TaskName "Proton-Drive-Git-Backup" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Daily Git repository bundle backup" `
    -Force

Write-Host "✅ Git backup scheduled: Proton-Drive-Git-Backup" -ForegroundColor Green
```

---

## 🚀 QUICK START (For Today)

### If you want backups working TODAY:

#### Option A: Manual Backup (5 minutes)

```powershell
# 1. Create backup folder
New-Item -ItemType Directory -Path "E:\Proton-Drive-Backup" -Force

# 2. Copy Proton Drive folder
robocopy "D:\Proton\My files\2026" "E:\Proton-Drive-Backup\$(Get-Date -Format 'yyyy-MM-dd_HHmmss')" /MIR

# 3. Verify
Get-ChildItem "E:\Proton-Drive-Backup"
```

#### Option B: Scheduled Backup (15 minutes)

```powershell
# Create scripts folder
New-Item -ItemType Directory -Path "C:\Scripts" -Force

# Copy the backup script above into C:\Scripts\Proton-Backup-Daily.ps1

# Schedule task (use the PowerShell commands above)
```

#### Option C: Full Setup (30 minutes)

1. Set up Windows Backup (above)
2. Set up AWS S3 (if you have cloud storage)
3. Set up Git backup
4. Verify all 3 tiers are working

---

## 📊 Backup Locations Reference

| Tier | Location | Frequency | Retention | Recovery Time |
|------|----------|-----------|-----------|---|
| **1** | External USB/NAS | Daily 3:00 AM | 30 days | < 5 min |
| **2** | AWS S3 Cloud | Daily 3:30 AM | 90 days | 5-30 min |
| **3** | GitHub + Bundle | Continuous + Daily 4:00 AM | Indefinite | 1-30 min |

---

## ⚠️ SENSITIVE FILES - DO NOT BACKUP TO CLOUD

These files should ONLY be backed up locally or to hardware you control:

```
❌ .env.mcp (sensitive config)
❌ .env.local (secrets)
❌ Private keys (.pem files)
❌ API keys (credentials)
❌ Database passwords
❌ Stripe/payment secrets
```

**Solution:** Use `.gitignore` and exclude from cloud backups

```bash
# .gitignore
.env.mcp
.env.local
.env.*.local
*.pem
secrets/
```

---

## 🔄 Recovery Procedures

### Scenario 1: File Disappeared (Like .env.mcp Today)

```powershell
# Step 1: Check local backup
Get-ChildItem "E:\Proton-Drive-Backup" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Step 2: Find the file
Get-ChildItem "E:\Proton-Drive-Backup\2026-01-11_030000\Repos2026\dws6" -Filter ".env.mcp" -Recurse

# Step 3: Restore
Copy-Item "E:\Proton-Drive-Backup\2026-01-11_030000\Repos2026\dws6\.env.mcp" -Destination "D:\Proton\My files\2026\Repos2026\dws6\.env.mcp"
```

### Scenario 2: Accidental Deletion of Entire Folder

```powershell
# Step 1: Stop Proton Drive sync (pause it)

# Step 2: Restore from backup
robocopy "E:\Proton-Drive-Backup\2026-01-10_030000" "D:\Proton\My files\2026" /MIR

# Step 3: Resume sync
```

### Scenario 3: Cloud Recovery (From AWS S3)

```powershell
# List available backups
aws s3 ls s3://dws6-proton-drive-backup/ --recursive | grep "2026-01-"

# Download specific backup
aws s3 sync "s3://dws6-proton-drive-backup/proton-drive-backups/2026-01-10_030000/" "C:\Recovered-Files\" --region eu-central-1
```

### Scenario 4: Git Recovery

```powershell
# List git bundles
Get-ChildItem "C:\Git-Backups" | Sort-Object LastWriteTime -Descending

# Verify bundle
git bundle verify "C:\Git-Backups\dws6-backup-2026-01-10_040000.bundle"

# Clone from bundle
git clone "C:\Git-Backups\dws6-backup-2026-01-10_040000.bundle" dws6-recovered
```

---

## 📋 Backup Monitoring Checklist

### Daily (5 minutes)
- [ ] Check Windows Task Scheduler - all 3 tasks completed
- [ ] Verify backup folder has today's date subfolder
- [ ] Check backup log for errors

### Weekly (15 minutes)
- [ ] Verify all 3 backup types are running
- [ ] Check backup sizes (should be consistent)
- [ ] Test one restoration from each tier
- [ ] Check disk space on backup drives

### Monthly (30 minutes)
- [ ] Full restoration test
- [ ] Review backup rotation (30/90 day retention)
- [ ] Update backup strategy if needed
- [ ] Archive old backups if storage is limited

---

## 🛡️ Backup Best Practices

### DO's ✅
- ✅ Keep backups in at least 2 separate physical locations
- ✅ Test restorations monthly
- ✅ Automate everything with scheduled tasks
- ✅ Use encryption for cloud backups
- ✅ Monitor backup status regularly
- ✅ Keep backup drives offline most of the time (better security)

### DON'Ts ❌
- ❌ Don't backup sensitive config files to cloud
- ❌ Don't rely on a single backup location
- ❌ Don't forget to test restorations
- ❌ Don't store passwords with backups
- ❌ Don't forget to update backup scripts
- ❌ Don't keep backup drives connected 24/7

---

## 🚨 Emergency Recovery Plan

**If everything is lost (total system failure):**

1. **Hour 1:** Check cloud backups (AWS S3, GitHub)
2. **Hour 2:** Download from S3 or GitHub
3. **Hour 3:** Restore to new system
4. **Hour 4:** Verify all files recovered
5. **Hour 5:** Resume work

**Total recovery time:** ~4 hours (if automated backups are running)

---

## 📞 Troubleshooting

### Backup Task Not Running

```powershell
# Check if scheduled task exists
Get-ScheduledTask | grep "Proton"

# Check task status
Get-ScheduledTaskInfo -TaskName "Proton-Drive-Daily-Backup"

# View recent runs
Get-ScheduledTaskInfo -TaskName "Proton-Drive-Daily-Backup" | Select-Object LastRunTime, LastTaskResult

# Re-create task if needed (see setup section above)
```

### Backup Taking Too Long

```powershell
# Check backup file sizes
Get-ChildItem "E:\Proton-Drive-Backup" -Directory -Recurse | 
    Select-Object FullName, @{Name="Size(GB)"; Expression={(Get-ChildItem -Path $_.FullName -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB}} |
    Sort-Object "Size(GB)" -Descending

# Optimize: Exclude large folders like node_modules
```

### S3 Upload Failing

```powershell
# Check AWS credentials
aws sts get-caller-identity

# Check S3 bucket access
aws s3 ls s3://dws6-proton-drive-backup/ --region eu-central-1

# Check network connectivity
Test-NetConnection -ComputerName s3.amazonaws.com -Port 443
```

---

## 📝 Summary

### Implementation Steps (in order)

1. **TODAY:** Manual backup to external drive (5 min)
2. **TOMORROW:** Set up Windows Backup task (10 min)
3. **THIS WEEK:** Set up AWS S3 backup (30 min, optional)
4. **THIS WEEK:** Set up Git backup task (10 min)
5. **ONGOING:** Test restorations monthly

### Cost Breakdown

| Service | Cost | Purpose |
|---------|------|---------|
| External USB 1TB | €20-50 | Local backup storage |
| AWS S3 (90 days) | €2-5/month | Cloud redundancy |
| GitHub | Free | Git history + backup |
| **TOTAL** | **€2-5/month** | **Complete protection** |

---

## ✅ Verification Checklist

After setup is complete, verify:

- [ ] Local backup created today
- [ ] Windows Task Scheduler has 3 tasks
- [ ] S3 bucket created (if using cloud)
- [ ] Git bundle created
- [ ] All scheduled tasks show "Ready"
- [ ] One test restoration successful from each tier
- [ ] Documentation updated for your team

---

**Status:** ✅ READY TO IMPLEMENT  
**Created:** January 11, 2026  
**Last Updated:** January 11, 2026  
**Review Date:** February 11, 2026

Next: Implement TIER 1 (local backup) today, and TIER 2-3 this week.
