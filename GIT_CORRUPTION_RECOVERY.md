# Git Corruption Recovery Guide

**Problem:** Corrupted git refs with invalid branch names containing special characters  
**Symptom:** `fatal: bad object refs/heads/my-local-changes (# Name clash 2026-01-11 6la4q5C #)`  
**Environment:** Windows local repository  
**Status:** January 11, 2026

---

## Understanding the Issue

Your local git repository has corrupted branch references with invalid names like:
```
refs/heads/my-local-changes (# Name clash 2026-01-11 6la4q5C #)
refs/heads/claude (# Name clash 2025-12-20 om7l2oC #)
```

These corrupted refs are **only in your local `.git` directory** and are NOT on GitHub remote.

## Quick Recovery Solution (Recommended)

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

### Option 2: Local Cleanup (More Complex)

Only if you cannot do a fresh clone:

```bash
# Step 1: Backup your work
cd "D:\Proton\My files\2026\Repos2026\dws6"
git bundle create ../dws6-backup.bundle --all

# Step 2: Remove corrupted refs manually
# Navigate to .git/refs/heads and delete files with invalid names
# Use PowerShell:
Get-ChildItem -Path ".git\refs\heads" -Recurse | 
  Where-Object { $_.Name -match "#" } | 
  Remove-Item -Force

# Step 3: Clean up packed refs
# Edit .git/packed-refs and remove lines with corrupted branch names
# Use a text editor to remove lines containing "(# Name clash"

# Step 4: Run git gc
git gc --prune=now

# Step 5: Verify
git branch -a
git status
```

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

## FAQ

**Q: Will I lose my commits?**  
A: No, all commits pushed to GitHub are safe. Only local branch references are corrupted.

**Q: What about PR #142?**  
A: PR #142 branch `feature/investor-progress-report-and-google-partnership` exists on GitHub and is not corrupted. You can check it out in a fresh clone.

**Q: Why did this happen?**  
A: Likely a filesystem issue, text editor conflict, or tool that modified `.git/refs/` with invalid characters.

**Q: Can I just delete the corrupted repo?**  
A: Yes, if all your work is pushed to GitHub. Do a fresh clone.

---

## Checklist

- [ ] Verify your work is on GitHub: `git ls-remote origin`
- [ ] Do a fresh clone to a new directory
- [ ] Verify all expected branches exist in fresh clone
- [ ] Cherry-pick or merge any needed commits
- [ ] Push your consolidated work to a new clean branch
- [ ] Merge PR #142 via GitHub UI
- [ ] Archive or delete the corrupted local repository
- [ ] Add git hooks to prevent future corruption

---

## Support

If you continue to have issues:
1. Check GitHub branches are intact (they should be)
2. Try cloning on a different machine
3. Check for filesystem corruption (run `chkdsk` on Windows)
4. Ensure no special tools are modifying `.git/` directory

---

**Last Updated:** January 11, 2026  
**Status:** Active Recovery Guide
