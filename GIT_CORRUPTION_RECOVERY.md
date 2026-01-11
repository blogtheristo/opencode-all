# Git Corruption Recovery Guide

**Problem:** Corrupted git refs and objects with invalid names containing special characters  
**Symptom:** 
- `fatal: bad object refs/heads/my-local-changes (# Name clash 2026-01-11 6la4q5C #)`
- `bad sha1 file: .git/objects/56/f479e065fec12a7a6154dd9b1acdb224316a81 (# Name clash ...)`
- `fatal: mmap failed: Invalid argument`

**Environment:** Windows local repository  
**Status:** January 11, 2026  
**Script Version:** 2.0 (PowerShell)

---

## Automated Recovery (Recommended)

### PowerShell Recovery Script

**Location:** `Admin/scripts/recover-git-corruption.ps1`

This script provides safe, non-destructive recovery from OneDrive/Google Drive/Dropbox sync conflicts in `.git\refs` and `.git\objects`.

#### Safety Guarantees

✅ **No history rewriting** - No force push, no rebase operations  
✅ **No object deletion** - Git gc uses `--prune=never`  
✅ **Reversible operations** - Quarantine can be undone with provided script  
✅ **No data loss** - All operations create backups first

#### Quick Start

**1. Verify Only (Check for Issues):**
```powershell
# Default mode - scans for corruption but makes no changes
.\Admin\scripts\recover-git-corruption.ps1
```

**2. Archive Corrupted Files:**
```powershell
# Creates backup copies in Admin/artifacts/git-recovery/<timestamp>/
# Handles BOTH refs and objects
.\Admin\scripts\recover-git-corruption.ps1 -ArchiveCorruptedRefs
```

**3. Quarantine Corrupted Files (Fix badRefName and bad sha1 errors):**
```powershell
# Moves invalid ref and object files out of .git (interactive prompt)
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs

# Non-interactive mode (for automation)
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs -NonInteractive
```

**4. Archive + Quarantine (Full Recovery):**
```powershell
# Backup AND fix in one command
.\Admin\scripts\recover-git-corruption.ps1 -ArchiveCorruptedRefs -QuarantineCorruptedRefs
```

#### What the Script Detects

The script automatically finds corrupted files in **both** `.git\refs` and `.git\objects` with these patterns:
- `*# Name clash*` - OneDrive conflict files
- `*# Edit conflict*` - OneDrive edit conflicts
- `*# Desktop conflict*` - OneDrive desktop conflicts
- `*(conflicted copy)*` - Dropbox/Google Drive conflicts
- Any file with parentheses in `.git\refs` or `.git\objects`

**Common Issues Detected:**
- `refs/heads/branch (# Name clash 2025-12-03 xyz #)` - Invalid branch ref
- `refs/stash (# Name clash ...)` - Invalid stash ref
- `objects/56/f479e065... (# Name clash ...)` - Corrupted object file causing "bad sha1 file" errors

#### How Quarantine Works

1. **Scans** `.git\refs` and `.git\objects` for suspicious files
2. **Moves** them to:
   - `.git\quarantine\refs-name-clash\<timestamp>\` for refs
   - `.git\quarantine\objects-name-clash\<timestamp>\` for objects
3. **Creates** separate `RESTORE.ps1` scripts in each quarantine directory
4. **Runs** `git fsck` before/after to verify fix
5. **No deletion** - files are moved, not removed

#### Restoring Quarantined Files

If you need to restore quarantined files:
```powershell
# Restore refs
cd .git\quarantine\refs-name-clash\<timestamp>
.\RESTORE.ps1

# Restore objects
cd .git\quarantine\objects-name-clash\<timestamp>
.\RESTORE.ps1
```

Or manually copy files back to `.git\refs\` or `.git\objects\` in their original structure.

#### Script Output Example

```
╔════════════════════════════════════════════════════════════════╗
║   Git Corruption Recovery Script v2.0                         ║
║   Non-Destructive Recovery for Windows/OneDrive Conflicts     ║
╚════════════════════════════════════════════════════════════════╝

✓ Running in git repository
ℹ Operation mode: Archive + Quarantine

=== Git Fsck - Pre-Check ===
⚠ git fsck reported issues
  error: badRefName refs/heads/my-branch (# Name clash ...)

=== Scanning for Corrupted Refs ===
⚠ Found 3 suspicious ref file(s):
  - .git\refs\heads\my-branch (# Name clash 2026-01-11 #)
  - .git\refs\stash (# Name clash 2026-01-05 #)
  - .git\refs\remotes\origin\main (# Edit conflict #)

=== Archiving Corrupted Refs ===
✓ Created archive directory: Admin\artifacts\git-recovery\2026-01-11_14-30-00
✓ Archived: heads\my-branch (# Name clash 2026-01-11 #)
✓ Archived 3 file(s)

=== Quarantining Corrupted Refs ===
✓ Created quarantine directory: .git\quarantine\refs-name-clash\2026-01-11_14-30-00
✓ Quarantined: heads\my-branch (# Name clash 2026-01-11 #)
✓ Quarantined 3 file(s)

=== Git Fsck - Post-Quarantine ===
✓ git fsck completed successfully
ℹ Repository integrity: OK

=== Summary ===
✓ Operation completed successfully
ℹ ✓ Archived 3 file(s) to Admin/artifacts/git-recovery/2026-01-11_14-30-00
ℹ ✓ Quarantined 3 file(s) to .git/quarantine/refs-name-clash/2026-01-11_14-30-00
```

---

## Preventing Future Corruption

### Exclude .git from Sync Tools

**OneDrive:**
1. Right-click OneDrive icon → Settings
2. Sync and backup → Manage backup
3. Add `.git` to exclusion list
4. **Critical:** Exclude at folder level, not file level

**Google Drive:**
1. Open Google Drive preferences
2. Add exclusion pattern: `**/.git/**`
3. This excludes all `.git` folders recursively

**Dropbox:**
1. Open Dropbox preferences
2. Sync → Selective Sync
3. Uncheck any folders containing repositories
4. Or use Dropbox ignore: Add `.dropboxignore` with `.git/`

**Alternative: Move Repositories Outside Synced Folders**
```powershell
# Best practice: Keep git repos outside sync folders
# Good: C:\Dev\repos\dws6
# Bad:  C:\Users\YourName\OneDrive\repos\dws6
```

### Git Configuration

Add to your global `.gitconfig`:
```ini
[core]
    # Prevent special characters in refs (Windows)
    protectNTFS = true
    # Handle line endings properly
    autocrlf = true
    # Safer renames on Windows
    precomposeUnicode = true
```

Apply with:
```bash
git config --global core.protectNTFS true
git config --global core.autocrlf true
```

---

## Understanding the Issue

Your local git repository has corrupted branch references with invalid names like:
```
refs/heads/my-local-changes (# Name clash 2026-01-11 6la4q5C #)
refs/heads/claude (# Name clash 2025-12-20 om7l2oC #)
```

These corrupted refs are **only in your local `.git` directory** and are NOT on GitHub remote.

---

## Manual Recovery Options

If you prefer manual recovery or the automated script doesn't work for your situation:

### Option 1: Fresh Clone + Cherry-Pick (Safest)

This approach gives you a clean repository while preserving your work.

```bash
# Step 1: Move to a safe location
cd D:\Proton\My files\2026\

# Step 2: Clone fresh from GitHub
git clone https://github.com/blogtheristo/dws6.git dws6-clean
cd dws6-clean

# Step 3: Identify commits you want to keep from remote branches
# Check agent-1-7-10-launch branch (has your recent work)
git log origin/agent-1-7-10-launch --oneline -20

# Step 4: Check feature/investor-progress-report-and-google-partnership
git log origin/feature/investor-progress-report-and-google-partnership --oneline -20

# Step 5: Cherry-pick specific commits you need
# Example:
git checkout -b feature/merge-local-changes-clean main
git cherry-pick <commit-sha-1>
git cherry-pick <commit-sha-2>
# ... continue with needed commits

# Step 6: Push your new clean branch
git push -u origin feature/merge-local-changes-clean
```

### Option 2: Bash Recovery Script (Linux/macOS/WSL)

For Linux/macOS or Windows Subsystem for Linux (WSL):

**Location:** `scripts/recover-from-corrupted-refs.sh`

```bash
# Run from repository root
./scripts/recover-from-corrupted-refs.sh
```

This script:
- Creates a backup bundle
- Clones a fresh repository
- Lists available branches for recovery
- Provides merge/cherry-pick guidance

### Option 3: Manual Local Cleanup (Advanced)

**⚠️ WARNING:** This method is more complex and risky. Use the PowerShell script instead when possible.

Only if you cannot use the automated script or fresh clone:

```powershell
# Step 1: Backup your work
cd "D:\Proton\My files\2026\Repos2026\dws6"
git bundle create ../dws6-backup.bundle --all

# Step 2: Use the automated script instead!
# But if you must do it manually:

# Step 2a: Archive corrupted refs manually
$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
New-Item -ItemType Directory -Path "Admin\artifacts\git-recovery\$timestamp" -Force

Get-ChildItem -Path ".git\refs" -Recurse -File | 
  Where-Object { $_.Name -match "#" } | 
  ForEach-Object {
    $dest = "Admin\artifacts\git-recovery\$timestamp\$($_.Name)"
    Copy-Item -LiteralPath $_.FullName -Destination $dest
  }

# Step 2b: Move (don't delete!) corrupted refs
Get-ChildItem -Path ".git\refs" -Recurse -File | 
  Where-Object { $_.Name -match "#" } | 
  ForEach-Object {
    $dest = ".git\quarantine\$($_.Name)"
    New-Item -ItemType Directory -Path ".git\quarantine" -Force
    Move-Item -LiteralPath $_.FullName -Destination $dest
  }

# Step 3: Clean up packed refs (if needed)
# Edit .git/packed-refs with text editor
# Remove lines containing "(# Name clash" or "(# Edit conflict"

# Step 4: Run safe git gc (NEVER use --prune=now)
git gc --prune=never

# Step 5: Verify
git fsck --full
git branch -a
git status
```

**Note:** The PowerShell script at `Admin/scripts/recover-git-corruption.ps1` does all of this automatically and safely.

---

## Recovering Specific Work

### Find Commits from Your Work Session

```bash
# In the corrupted repo, before cleanup:
# Find all commits from the last N days
git log --all --since="5 days ago" --oneline --decorate

# Find commits by author
git log --all --author="your-email@example.com" --oneline -50

# Find commits that aren't on main
git log origin/main..origin/agent-1-7-10-launch --oneline
```

### Save Commit List

```bash
# Export commits to a file
git log --all --since="5 days ago" --format="%H %s" > commits-to-recover.txt
```

---

## Preventing Future Corruption

### 1. Branch Naming Rules

Never use these characters in branch names:
- Parentheses: `(` `)`
- Hash/pound: `#`
- Spaces (use hyphens instead)
- Special Windows chars: `< > : " | ? *`

**Good:** `feature/investor-report-update`  
**Bad:** `my-local-changes (# Name clash #)`

### 2. Git Configuration

Add to your `.gitconfig`:

```ini
[core]
    # Prevent special characters in refs
    protectNTFS = true
    # Ensure line endings are handled properly
    autocrlf = true
```

### 3. Use Git Hooks

Install pre-push hook to validate branch names (see `scripts/recover-from-corrupted-refs.sh`).

---

## Specific to Your Situation

Based on the problem statement, here's what happened:

1. **Working branches identified:**
   - `agent-1-7-10-launch` - Has your V1.0 Phase 1 work (clean, on remote)
   - `feature/investor-progress-report-and-google-partnership` - PR #142 work (clean, on remote)
   - `feature/investor-progress-report-update` - Another variant (on remote)
   - `my-local-changes` - Corrupted locally

2. **Good news:** The branches `agent-1-7-10-launch` and `feature/investor-progress-report-*` are already on GitHub and NOT corrupted!

3. **Recommended action:**
   ```bash
   # Do a fresh clone
   cd "D:\Proton\My files\2026\"
   git clone https://github.com/blogtheristo/dws6.git dws6-recovered
   cd dws6-recovered
   
   # Your work is already there!
   git fetch origin
   git checkout agent-1-7-10-launch
   # or
   git checkout feature/investor-progress-report-and-google-partnership
   
   # If you need to merge them:
   git checkout -b feature/merged-work main
   git merge agent-1-7-10-launch
   git merge feature/investor-progress-report-and-google-partnership
   
   # Resolve any conflicts, then:
   git push -u origin feature/merged-work
   ```

---

## Merging PR #142

The conflict in PR #142 should be resolvable after a fresh clone:

```bash
# In your fresh clone
cd dws6-recovered
git fetch origin
git checkout feature/investor-progress-report-and-google-partnership

# Update from main
git merge origin/main

# Resolve conflicts if any
# ... edit files ...
git add .
git commit -m "fix: resolve merge conflicts with main"

# Push
git push origin feature/investor-progress-report-and-google-partnership
```

Then the PR can be merged via GitHub UI.

---

## Emergency: Salvaging Uncommitted Changes

If you had uncommitted changes in the corrupted repo:

```bash
# In the corrupted repo
cd "D:\Proton\My files\2026\Repos2026\dws6"

# Stash everything (even with corruption, stash might work)
git stash push -u -m "emergency-save-$(date +%Y%m%d)"

# Check stash
git stash list

# After setting up fresh repo, apply stash
cd ../dws6-recovered
git stash apply stash@{0}
```

---

## Manual Test Plan for PowerShell Script

This section describes how to test the `Admin/scripts/recover-git-corruption.ps1` script.

### Test Environment Setup

```powershell
# Create a test repository with simulated corruption
cd $env:TEMP
mkdir git-recovery-test
cd git-recovery-test
git init
git config user.name "Test User"
git config user.email "test@example.com"

# Create some normal refs
echo "test content" > file.txt
git add .
git commit -m "Initial commit"
git branch feature/normal-branch

# Simulate OneDrive/sync tool corruption
# Create refs with special characters (Name clash, Edit conflict)
$refsPath = ".git\refs\heads"
New-Item -ItemType Directory -Path $refsPath -Force

# Simulate Name clash
"ref: refs/heads/main" | Set-Content -Path "$refsPath\my-branch (# Name clash 2026-01-11 abc123 #)"

# Simulate Edit conflict  
"ref: refs/heads/main" | Set-Content -Path "$refsPath\feature-work (# Edit conflict 2026-01-05 xyz789 #)"

# Create a conflicted stash ref
$stashPath = ".git\refs"
"ref: refs/heads/main" | Set-Content -Path "$stashPath\stash (# Name clash 2026-01-10 #)"

Write-Host "Test repository created with simulated corruption!" -ForegroundColor Green
```

### Test Case 1: Verify-Only Mode (Default)

**Purpose:** Ensure script detects corruption without making changes

```powershell
# Run script with no parameters
.\Admin\scripts\recover-git-corruption.ps1

# Expected output:
# - ✓ Running in git repository
# - ℹ Running in VERIFY-ONLY mode
# - ⚠ Found 3 suspicious ref file(s)
# - Lists detected files
# - No changes made
```

**Verification:**
- [ ] Script completes successfully
- [ ] No files created in Admin/artifacts/
- [ ] No files created in .git/quarantine/
- [ ] Corrupted files still exist in .git/refs/
- [ ] git fsck shows badRefName errors

### Test Case 2: Archive-Only Mode

**Purpose:** Verify archiving without modifying .git/refs

```powershell
.\Admin\scripts\recover-git-corruption.ps1 -ArchiveCorruptedRefs

# Expected output:
# - Creates Admin/artifacts/git-recovery/<timestamp>/
# - Copies all corrupted files to archive
# - Creates MANIFEST.txt
# - ✓ Archived N file(s)
```

**Verification:**
- [ ] Archive directory created with timestamp
- [ ] All corrupted files copied to archive (not moved)
- [ ] MANIFEST.txt exists with file list
- [ ] Original corrupted files still in .git/refs/
- [ ] Archive files are readable copies

### Test Case 3: Quarantine Mode (Interactive)

**Purpose:** Verify interactive quarantine with user prompt

```powershell
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs

# When prompted "Continue? (yes/no)", type: yes
```

**Verification:**
- [ ] Script prompts for confirmation
- [ ] Quarantine directory created: .git/quarantine/refs-name-clash/<timestamp>/
- [ ] Corrupted files MOVED (not copied) from .git/refs/
- [ ] RESTORE.ps1 script created in quarantine folder
- [ ] git fsck runs before and after
- [ ] Post-quarantine fsck shows no badRefName errors

**Test prompt rejection:**
```powershell
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs
# When prompted, type: no
```

**Verification:**
- [ ] Script cancels operation
- [ ] No files moved
- [ ] Message: "Quarantine cancelled by user"

### Test Case 4: Non-Interactive Mode

**Purpose:** Verify automation-friendly mode

```powershell
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs -NonInteractive
```

**Verification:**
- [ ] No user prompts shown
- [ ] Files quarantined automatically
- [ ] Script completes without waiting for input

### Test Case 5: Combined Archive + Quarantine

**Purpose:** Verify both operations work together

```powershell
.\Admin\scripts\recover-git-corruption.ps1 -ArchiveCorruptedRefs -QuarantineCorruptedRefs -NonInteractive
```

**Verification:**
- [ ] Archive created first
- [ ] Quarantine performed second
- [ ] Both operations complete successfully
- [ ] Corrupted files exist in archive (copy)
- [ ] Corrupted files exist in quarantine (moved from .git/refs)
- [ ] .git/refs/ is clean of corrupted files

### Test Case 6: Idempotency Test

**Purpose:** Verify collision avoidance when running multiple times

```powershell
# Run quarantine twice
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs -NonInteractive
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs -NonInteractive

# Expected: Second run finds no corrupted refs
```

**Verification:**
- [ ] First run moves files
- [ ] Second run reports "No corrupted ref files detected"
- [ ] No errors about duplicate files

### Test Case 7: Restoration Test

**Purpose:** Verify quarantine is reversible

```powershell
# After quarantining files
cd .git\quarantine\refs-name-clash\<timestamp>
.\RESTORE.ps1
```

**Verification:**
- [ ] RESTORE.ps1 exists and is executable
- [ ] Files moved back to original locations in .git/refs/
- [ ] Quarantine folder is now empty (except RESTORE.ps1)
- [ ] git fsck now shows badRefName errors again (corruption restored)

### Test Case 8: No Corruption Scenario

**Purpose:** Verify script handles clean repositories

```powershell
# Create clean test repo
cd $env:TEMP
mkdir clean-repo-test
cd clean-repo-test
git init
echo "test" > file.txt
git add .
git commit -m "Test"

# Run script
.\Admin\scripts\recover-git-corruption.ps1
```

**Verification:**
- [ ] Script reports "No corrupted refs found"
- [ ] Success message with prevention tips
- [ ] Exit code 0
- [ ] No errors

### Test Case 9: LiteralPath Safety

**Purpose:** Verify paths with special characters are handled correctly

This is automatically tested by the Name clash files which contain parentheses, spaces, and # symbols.

**Verification:**
- [ ] Files with spaces in names handled correctly
- [ ] Files with parentheses handled correctly
- [ ] Files with # symbols handled correctly
- [ ] No "path not found" errors

### Test Case 10: Git GC Safety

**Purpose:** Verify no destructive pruning occurs

```powershell
# Monitor git gc command
.\Admin\scripts\recover-git-corruption.ps1 -QuarantineCorruptedRefs -NonInteractive -Verbose

# Check output for git gc command
```

**Verification:**
- [ ] Output shows "git gc --prune=never"
- [ ] Output NEVER shows "--prune=now"
- [ ] No objects are deleted from .git/objects/

### Test Cleanup

```powershell
# Remove test repositories
cd $env:TEMP
Remove-Item -Recurse -Force git-recovery-test
Remove-Item -Recurse -Force clean-repo-test
```

### Expected Test Results Summary

All tests should pass with these outcomes:
- ✅ Verify mode: Detection only, no changes
- ✅ Archive mode: Backup copies created
- ✅ Quarantine mode: Files moved, reversible
- ✅ Non-interactive: No prompts
- ✅ Combined mode: Both operations work
- ✅ Idempotent: Safe to run multiple times
- ✅ Reversible: RESTORE.ps1 works
- ✅ Clean repos: Graceful handling
- ✅ Special chars: LiteralPath works
- ✅ Safe maintenance: No destructive pruning

### CI/Automation Notes

This script is designed for interactive use on Windows developer machines. For CI/CD:
- Use `-NonInteractive` flag
- Verify mode (default) is safe for automated checks
- Archive mode is safe for pre-deployment validation
- Quarantine mode should require manual approval in production

---

## FAQ

**Q: Will I lose my commits?**  
A: No, all commits pushed to GitHub are safe. Only local branch references are corrupted. The PowerShell script never deletes commits or objects.

**Q: Is the PowerShell script safe to run?**  
A: Yes! It follows strict safety guarantees: no history rewriting, no object deletion, and all operations are reversible. The default mode (verify-only) makes no changes at all.

**Q: What's the difference between Archive and Quarantine?**  
A: **Archive** creates backup copies in `Admin/artifacts/` without modifying `.git/refs`. **Quarantine** moves files out of `.git/refs` to fix errors, but keeps them in `.git/quarantine/` for restoration.

**Q: Can I undo quarantine operations?**  
A: Yes! The script creates a `RESTORE.ps1` in the quarantine directory that moves files back to their original locations.

**Q: What about PR #142?**  
A: PR #142 branch `feature/investor-progress-report-and-google-partnership` exists on GitHub and is not corrupted. You can check it out in a fresh clone.

**Q: Why did this happen?**  
A: Sync tools (OneDrive, Google Drive, Dropbox) don't understand `.git/` internal structure. When they detect conflicts, they create files with special characters like `(# Name clash #)` which are invalid git ref names.

**Q: Can I just delete the corrupted repo?**  
A: Yes, if all your work is pushed to GitHub. Do a fresh clone. But using the PowerShell script is safer if you want to preserve local state.

**Q: Should I exclude .git from my sync tool?**  
A: **Absolutely yes!** Git repositories should NEVER be in synced folders. Either exclude `.git` specifically or move your repositories outside synced directories entirely.

**Q: Will this script work on Linux/macOS?**  
A: No, this is a PowerShell script for Windows. Linux/macOS/WSL users should use `scripts/recover-from-corrupted-refs.sh` (bash script).

**Q: What if I have uncommitted changes?**  
A: The script only affects `.git/refs/` metadata, not your working directory. Your uncommitted changes are safe. However, backing up with `git stash` before running is recommended.

---

## Recovery Checklist

### Using PowerShell Script (Recommended for Windows)
- [ ] Run verify mode: `.\Admin\scripts\recover-git-corruption.ps1`
- [ ] Review detected issues
- [ ] Archive corrupted refs: Add `-ArchiveCorruptedRefs` flag
- [ ] Quarantine to fix: Add `-QuarantineCorruptedRefs` flag
- [ ] Verify fix: `git fsck --full` should pass
- [ ] Configure git: Add `core.protectNTFS = true`
- [ ] Exclude .git from sync tools
- [ ] Push any recovered work to GitHub

### Using Fresh Clone (All Platforms)
- [ ] Verify your work is on GitHub: `git ls-remote origin`
- [ ] Do a fresh clone to a new directory
- [ ] Verify all expected branches exist in fresh clone
- [ ] Cherry-pick or merge any needed commits
- [ ] Push your consolidated work to a new clean branch
- [ ] Archive or delete the corrupted local repository
- [ ] Exclude .git from sync tools

---

## Support

If you continue to have issues:
1. Run the PowerShell script with `-ArchiveCorruptedRefs` to preserve evidence
2. Check GitHub branches are intact (they should be): `git ls-remote origin`
3. Try cloning on a different machine
4. Check for filesystem corruption (run `chkdsk /F` on Windows)
5. Ensure no special tools are modifying `.git/` directory
6. Verify sync tool settings exclude `.git`

## Related Documentation

- **PowerShell Script:** `Admin/scripts/recover-git-corruption.ps1`
- **Bash Script:** `scripts/recover-from-corrupted-refs.sh`
- **Admin Manual:** `Admin/ADMIN_MANUAL.md`
- **Git Workflow:** See Admin Manual section on Git Workflow

---

**Last Updated:** January 11, 2026  
**Script Version:** 2.0  
**Status:** Active Recovery Guide
