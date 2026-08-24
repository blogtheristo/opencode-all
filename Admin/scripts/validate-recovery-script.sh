#!/bin/bash
# Git Recovery Script Validation
# Automated checks for the PowerShell recovery script

set -e

echo "=== Git Recovery Script Validation ==="
echo ""

# Check 1: Verify script exists
if [ -f "Admin/scripts/recover-git-corruption.ps1" ]; then
    echo "✓ Check 1: Script file exists"
else
    echo "✗ Check 1: Script file NOT found"
    exit 1
fi

# Check 2: Verify safety guarantee - no destructive pruning
if grep -q "prune=never" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 2: Uses safe git gc (--prune=never)"
else
    echo "✗ Check 2: SAFETY VIOLATION - destructive pruning found"
    exit 1
fi

# Check 3: Verify LiteralPath usage for file safety
# Minimum threshold: 5 critical operations that must use LiteralPath:
#   1. Check .git directory exists
#   2. Check refs/objects paths exist
#   3. Copy-Item for archiving
#   4. Move-Item for quarantine
#   5. Set-Content for manifests
COUNT=$(grep -c "LiteralPath" Admin/scripts/recover-git-corruption.ps1 || true)
if [ "$COUNT" -gt 5 ]; then
    echo "✓ Check 3: Uses -LiteralPath for safe file operations ($COUNT occurrences)"
else
    echo "✗ Check 3: Insufficient LiteralPath usage (expected >5, found $COUNT)"
    exit 1
fi

# Check 4: Verify no destructive deletion of refs
if ! grep -q "Remove-Item.*refs" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 4: No destructive deletion of refs"
else
    echo "✗ Check 4: SAFETY VIOLATION - destructive deletion found"
    exit 1
fi

# Check 5: Verify quarantine uses Move (reversible)
if grep -q "Move-Item" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 5: Quarantine uses Move-Item (reversible)"
else
    echo "✗ Check 5: Move-Item not found"
    exit 1
fi

# Check 6: Verify RESTORE script generation
if grep -q "RESTORE.ps1" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 6: Creates restoration script"
else
    echo "✗ Check 6: RESTORE.ps1 generation not found"
    exit 1
fi

# Check 7: Verify pattern detection
if grep -q "Name clash" Admin/scripts/recover-git-corruption.ps1 && \
   grep -q "Edit conflict" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 7: Detects OneDrive/sync tool patterns"
else
    echo "✗ Check 7: Pattern detection incomplete"
    exit 1
fi

# Check 7b: Verify objects detection
if grep -q "Get-CorruptedObjects" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 7b: Detects corrupted objects (new feature)"
else
    echo "✗ Check 7b: Objects detection not found"
    exit 1
fi

# Check 7c: Verify objects quarantine
if grep -q "Invoke-QuarantineCorruptedObjects" Admin/scripts/recover-git-corruption.ps1; then
    echo "✓ Check 7c: Quarantine for objects implemented"
else
    echo "✗ Check 7c: Objects quarantine not found"
    exit 1
fi

# Check 8: Verify documentation exists
if [ -f "GIT_CORRUPTION_RECOVERY.md" ]; then
    echo "✓ Check 8: Documentation exists"
else
    echo "✗ Check 8: Documentation NOT found"
    exit 1
fi

# Check 9: Verify documentation includes PowerShell script
if grep -q "recover-git-corruption.ps1" GIT_CORRUPTION_RECOVERY.md; then
    echo "✓ Check 9: Documentation includes PowerShell script"
else
    echo "✗ Check 9: Documentation incomplete"
    exit 1
fi

# Check 10: Verify test plan exists
if grep -q "Manual Test Plan" GIT_CORRUPTION_RECOVERY.md; then
    echo "✓ Check 10: Test plan documented"
else
    echo "✗ Check 10: Test plan not found"
    exit 1
fi

# Check 11: Verify safety guarantees documented
if grep -q "Safety Guarantees" GIT_CORRUPTION_RECOVERY.md; then
    echo "✓ Check 11: Safety guarantees documented"
else
    echo "✗ Check 11: Safety documentation incomplete"
    exit 1
fi

# Check 12: Verify scripts directory is allowed in .gitignore
if grep -q "!Admin/scripts/" .gitignore; then
    echo "✓ Check 12: Admin/scripts/ is tracked in git"
else
    echo "✗ Check 12: .gitignore misconfigured"
    exit 1
fi

# Check 13: Verify artifacts directory configured
if grep -q "Admin/artifacts/git-recovery/" .gitignore; then
    echo "✓ Check 13: Artifacts directory excluded from git (contains recovery data)"
else
    echo "✗ Check 13: .gitignore incomplete"
    exit 1
fi

echo ""
echo "=== All Validation Checks Passed! ==="
echo ""
echo "Manual testing on Windows required for:"
echo "  - Verify-only mode functionality"
echo "  - Archive mode file operations"
echo "  - Quarantine mode file operations"
echo "  - Interactive prompts"
echo "  - Non-interactive mode"
echo "  - Idempotency testing"
echo "  - Restoration testing"
echo "  - fsck before/after validation"
echo "  - Pattern detection with real OneDrive conflicts"
echo "  - Path safety with special characters"
echo ""
echo "See GIT_CORRUPTION_RECOVERY.md for detailed test plan"

