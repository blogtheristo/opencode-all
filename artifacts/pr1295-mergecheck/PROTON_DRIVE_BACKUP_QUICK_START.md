# ✅ PROTON DRIVE BACKUP - QUICK START CHECKLIST
**Date:** January 11, 2026  
**Time to implement:** 5-30 minutes depending on tier

---

## 🚀 QUICK START OPTIONS

Choose one based on your time and needs:

### ⚡ ULTRA-QUICK (5 minutes) - Immediate Protection

```powershell
# Connect external USB drive (at least 500GB)

# Step 1: Create backup folder
New-Item -ItemType Directory -Path "E:\Proton-Backup-$(Get-Date -Format 'yyyy-MM-dd')" -Force

# Step 2: Copy files NOW
robocopy "D:\Proton\My files\2026" "E:\Proton-Backup-$(Get-Date -Format 'yyyy-MM-dd')" /MIR /V

# Step 3: Verify backup created
Get-ChildItem "E:\" | grep "Proton-Backup"

Write-Host "✅ Manual backup complete! Now do recurring backup setup below."
```

### ⏱️ FAST (15 minutes) - Add Automation

After the quick backup above, add this:

```powershell
# Create PowerShell script for daily backups
$scriptContent = @'
# Daily Proton Drive Backup
$source = "D:\Proton\My files\2026"
$destination = "E:\Proton-Drive-Backups\$(Get-Date -Format 'yyyy-MM-dd_HHmmss')"

robocopy "$source" "$destination" /MIR /V /LOG:"$destination\backup.log" `
    /XD ".git" "node_modules" ".next" `
    /XF "*.log" ".env.mcp"

Write-Host "Backup complete: $destination" -ForegroundColor Green
'@

# Save script
$scriptPath = "C:\Scripts\Proton-Backup-Daily.ps1"
New-Item -ItemType Directory -Path "C:\Scripts" -Force | Out-Null
Set-Content -Path $scriptPath -Value $scriptContent -Force

# Create scheduled task
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -File $scriptPath"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBattery -DontStopIfGoingOnBattery
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME"

Register-ScheduledTask -TaskName "Proton-Daily-Backup" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force

Write-Host "✅ Automated daily backup scheduled for 3:00 AM"
Get-ScheduledTask | grep "Proton"
```

### 🛡️ COMPREHENSIVE (30 minutes) - Full Protection

Implement all 3 tiers:
1. Local backup (above)
2. Cloud backup (AWS S3 or OneDrive)
3. Git backup (GitHub)

See `PROTON_DRIVE_DAILY_BACKUP_STRATEGY.md` for full setup.

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: IMMEDIATE (Do Now - 5 minutes)

- [ ] Connect external USB drive (500GB+ recommended)
- [ ] Create backup folder: `E:\Proton-Backup-2026-01-11`
- [ ] Run robocopy command above to create first backup
- [ ] Verify backup files exist on external drive
- [ ] **⏸️ PAUSE PROTON DRIVE SYNC** during backup (prevents conflicts)

**Time: 5 minutes**  
**Benefit: Protected against file loss today**

---

### Phase 2: TODAY (Automation Setup - 15 minutes)

After Phase 1 is complete:

- [ ] Create `C:\Scripts` folder
- [ ] Create `Proton-Backup-Daily.ps1` script (copy from above)
- [ ] Verify script runs manually: `powershell -File "C:\Scripts\Proton-Backup-Daily.ps1"`
- [ ] Create scheduled task in Windows Task Scheduler
- [ ] Verify task appears: `Get-ScheduledTask | grep Proton`
- [ ] Set task to run daily at 3:00 AM
- [ ] Test task runs: Right-click task → Run

**Time: 15 minutes**  
**Benefit: Automatic daily backups for 30 days**

---

### Phase 3: THIS WEEK (Cloud Backup - 15 minutes)

For additional protection:

- [ ] Create AWS account (free tier available)
- [ ] Create S3 bucket: `dws6-proton-drive-backup`
- [ ] Generate AWS access keys
- [ ] Install AWS CLI: `winget install Amazon.AWSCLI`
- [ ] Configure AWS CLI: `aws configure` (enter keys)
- [ ] Create cloud backup script
- [ ] Create scheduled task for cloud backup
- [ ] Test cloud backup manually

**Time: 15 minutes**  
**Benefit: Cloud redundancy, disaster recovery**  
**Cost: ~$2-5/month**

---

### Phase 4: ONGOING (Monitoring - 5 minutes/day)

- [ ] Check backup folder daily (verify new backups exist)
- [ ] Review backup log for errors
- [ ] Keep external drive powered off except during backups (security)
- [ ] Test one restoration monthly

**Time: 5 minutes/day**  
**Benefit: Early detection of backup problems**

---

## 🎯 ONE-LINER COMMANDS

### Check if backup task is running

```powershell
Get-ScheduledTask -TaskName "*Proton*" | Select-Object TaskName, State, LastRunTime
```

### Manually trigger backup now

```powershell
Start-ScheduledTask -TaskName "Proton-Daily-Backup"
```

### Verify backups exist

```powershell
Get-ChildItem "E:\Proton-Drive-Backups" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 7
```

### Test restore (safe dry-run)

```powershell
# Just list files, don't copy (safe to test)
Get-ChildItem "E:\Proton-Drive-Backups" -Directory | Select-Object -First 1 | ForEach-Object {
    "Found backup: $($_.Name)"
    Get-ChildItem $_.FullName -Recurse | Select-Object FullName | Select-Object -First 5
}
```

### Quick restore (emergency)

```powershell
# Find latest backup
$latest = Get-ChildItem "E:\Proton-Drive-Backups" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Show what will be restored
Get-ChildItem $latest.FullName -Recurse | Measure-Object | Select-Object Count

# Ask for confirmation
Read-Host "Enter to restore from $($latest.Name) to D:\Proton\My files\2026 (will overwrite!)"

# Restore
robocopy $latest.FullName "D:\Proton\My files\2026" /MIR
```

---

## ⚠️ CRITICAL REMINDERS

### DO:
✅ Backup BEFORE doing risky operations  
✅ Test restores monthly (don't wait for disaster)  
✅ Keep backups in 2+ separate locations  
✅ Pause Proton Drive sync during backups  
✅ Monitor backup size (should be consistent)  

### DON'T:
❌ Keep external drive connected 24/7  
❌ Backup `.env.mcp` to cloud  
❌ Skip backup testing  
❌ Ignore backup errors  
❌ Delete backups until verified restored  

---

## 🔍 TROUBLESHOOTING

### "Backup task didn't run"

```powershell
# Check task status
Get-ScheduledTaskInfo -TaskName "Proton-Daily-Backup"

# Check last result (0 = success, non-zero = error)
# Common errors:
# 267009 = Access denied (run as administrator)
# 2147944695 = Disk full
```

### "External drive not showing"

```powershell
# List all drives
Get-Volume | Select-Object DriveLetter, FileSystemLabel, Size

# If not found, connect USB and wait 10 seconds, then retry
```

### "Backup too large"

```powershell
# Check what's taking space
Get-ChildItem "D:\Proton\My files\2026" -Directory | 
    ForEach-Object { @{Name=$_.Name; Size=((Get-ChildItem $_.FullName -Recurse | Measure-Object -Property Length -Sum).Sum/1GB)} } |
    Sort-Object Size -Descending
```

---

## 📞 NEED HELP?

1. **Read:** `PROTON_DRIVE_DAILY_BACKUP_STRATEGY.md` (full guide)
2. **Ask:** Check troubleshooting section above
3. **Verify:** Run commands manually before scheduling
4. **Test:** Always test backup restore before trusting it

---

## ✅ SUCCESS CRITERIA

You'll know it's working when:

- ✅ Backup folder grows on external drive daily
- ✅ Scheduled task shows "Ready" status
- ✅ Last run time is recent (today)
- ✅ Test restore successfully recovered files
- ✅ You can explain how to restore in emergency

---

**Status: READY TO IMPLEMENT TODAY**

**Estimated Setup Time:**
- Phase 1 (Quick): 5 minutes
- Phase 2 (Automation): 15 minutes  
- Phase 3 (Cloud): 15 minutes
- **Total: 35 minutes for complete protection**

Pick a phase above and start now! 🚀
