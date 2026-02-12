# Git Corruption Resolution Note - Issue #142

**Date:** January 11, 2026  
**Status:** ✅ RESOLVED  
**PR:** #142 - Non-destructive git corruption recovery script

---

## Problem Summary

**Issue:** Nasty corrupted files in Proton Drive .gitignored GitHub causing merge hangs

**Symptoms:**
- Merge operations hung indefinitely
- `git fsck --full` reported 2 bad objects:
  - `.git/objects/56/f479e065fec12a7a6154dd9b1acdb224316a81 (# Name clash 2025-12-03...)`
  - `.git/objects/5e/09b5da05f2ded6dfaaf21dd7196d1282d3e0ba (# Name clash 2025-12-30...)`
- `git gc` failed with: `fatal: mmap failed: Invalid argument`

**Root Cause:** 
Proton Drive sync tool created corrupted git object files with name clash markers when syncing `.git` directory. These corrupt objects prevented git operations.

---

## Solution

**Created:** `Admin/scripts/recover-git-corruption.ps1` (v1.0.0)

**What it does:**
1. Scans `.git/refs` for corrupted refs with name clash markers
2. Runs `git fsck --full` to identify bad objects
3. Removes corrupted ref files (interactive confirmation)
4. Rebuilds packfiles with `git gc --prune=now --aggressive --force`
5. Verifies repository integrity

**How to use:**

```powershell
# Full recovery (aggressive mode)
.\Admin\scripts\recover-git-corruption.ps1 -Aggressive

# Preview without changes
.\Admin\scripts\recover-git-corruption.ps1 -DryRun

# Verification only
.\Admin\scripts\recover-git-corruption.ps1 -VerifyOnly
```

---

## Resolution Path

### Step 1: Detection
```bash
git fsck --full
# Output: 2 bad sha1 files with (# Name clash ...) markers
```

### Step 2: Cleanup
Removed corrupted object files:
- `56/f479e065fec12a7a6154dd9b1acdb224316a81`
- `5e/09b5da05f2ded6dfaaf21dd7196d1282d3e0ba`

### Step 3: Rebuild
```bash
git gc --prune=now --aggressive --force
```

### Step 4: Verification
```bash
git fsck --full
# Output: No issues found ✅
```

---

## Tips for Future Resolution

If **Cursor AI** cannot resolve git corruption:

1. **Switch to GitHub Copilot Pro** with Claude backend
2. **Use OpenAI GPT-4o or GPT-5.2** (if available)
3. **Reason:**
   - These models have better git internals knowledge
   - Better at scripting PowerShell/bash solutions
   - Faster iteration on complex debugging scenarios

**This approach worked for resolving #142** ✅

---

## Prevention

**To prevent Proton Drive corruption:**

1. **Exclude `.git` from Proton sync:**
   - Add to Proton Drive exclusion list
   - Or keep repo outside synced folders

2. **Use `.gitignore` properly:**
   - Ensure all sync metadata is ignored
   - Don't version control `.git` directory

3. **Regular health checks:**
   ```bash
   git fsck --full  # Weekly
   git gc --auto    # After large operations
   ```

---

## Related Files

- **Recovery Script:** `Admin/scripts/recover-git-corruption.ps1`
- **Active Scripts Reference:** `Admin/scripts/ACTIVE_SCRIPTS_REFERENCE.md`
- **GDPR Compliance:** `Admin/GDPR_STATUS_SUMMARY.md` (historical context)

---

## Credits

- **Detection:** Git fsck analysis
- **Resolution:** GitHub Copilot Pro + OpenAI GPT-5.2 scripting
- **Implementation:** Lifetime Oy development team

---

**Status:** ✅ MERGED TO MAIN  
**Next Review:** Monitor for similar Proton Drive sync issues

