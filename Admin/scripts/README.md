# Admin Scripts Directory

This directory contains administrative and maintenance scripts for the DWS IQ 6 repository.

## Git Recovery Scripts

### recover-git-corruption.ps1
**Platform:** Windows PowerShell  
**Purpose:** Non-destructive recovery from git corruption caused by sync tools (OneDrive, Google Drive, Dropbox)

**Key Features:**
- ✅ Safe by default - verify-only mode when run without parameters
- ✅ No history rewriting or object deletion
- ✅ Reversible quarantine operations with automatic RESTORE.ps1 generation
- ✅ Detects "Name clash" and "Edit conflict" artifacts in `.git\refs`
- ✅ Interactive prompts with non-interactive override for automation
- ✅ Comprehensive git fsck validation before/after operations

**Usage:**
```powershell
# Verify only (default - no changes)
.\recover-git-corruption.ps1

# Archive corrupted files
.\recover-git-corruption.ps1 -ArchiveCorruptedRefs

# Quarantine corrupted files (fix errors)
.\recover-git-corruption.ps1 -QuarantineCorruptedRefs

# Full recovery with backup
.\recover-git-corruption.ps1 -ArchiveCorruptedRefs -QuarantineCorruptedRefs
```

**Documentation:** See `GIT_CORRUPTION_RECOVERY.md` in repository root

### validate-recovery-script.sh
**Platform:** Linux/macOS/WSL (bash)  
**Purpose:** Automated validation of the PowerShell recovery script

Verifies:
- Script structure and safety guarantees
- No destructive operations present
- Documentation completeness
- .gitignore configuration

**Usage:**
```bash
bash Admin/scripts/validate-recovery-script.sh
```

## Other Scripts

Additional administrative scripts may be added here following these guidelines:

### Script Guidelines
1. **Safety first** - Scripts should be non-destructive by default
2. **Documentation** - Include comprehensive help comments
3. **Testing** - Provide validation or test scripts when possible
4. **Reversibility** - Operations should be reversible when modifying state
5. **Logging** - Use clear, colored output for operations
6. **Platform** - Clearly indicate platform requirements (Windows/Linux/cross-platform)

### Naming Convention
- Use descriptive names: `verb-noun.ext`
- PowerShell: `Verb-Noun.ps1` (PascalCase)
- Bash: `verb-noun.sh` (kebab-case)
- Python: `verb_noun.py` (snake_case)

## Directory Structure

```
Admin/
├── scripts/
│   ├── README.md (this file)
│   ├── recover-git-corruption.ps1      # Git recovery (Windows)
│   └── validate-recovery-script.sh     # Validation (Linux/macOS)
├── artifacts/
│   └── git-recovery/                   # Recovery artifacts (gitignored)
│       └── <timestamp>/                # Timestamped recovery sessions
└── ADMIN_MANUAL.md                     # Main admin documentation
```

## Related Documentation

- **Admin Manual:** `Admin/ADMIN_MANUAL.md`
- **Git Recovery Guide:** `GIT_CORRUPTION_RECOVERY.md`
- **Security Documentation:** `Admin/Security/`

---

**Maintained by:** DWS IQ Admin Team  
**Last Updated:** January 11, 2026
