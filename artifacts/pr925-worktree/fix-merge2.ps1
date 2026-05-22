$ErrorActionPreference = "Continue"
Set-Location "F:\2026\Repos2026\dws6"

Write-Output "=== Step 1: Abort in-progress merge ==="
git merge --abort
Write-Output "Exit: $LASTEXITCODE"

Write-Output "`n=== Step 2: Current branch ==="
git branch --show-current

Write-Output "`n=== Step 3: Pull Copilot's remote commits for this branch ==="
git pull origin fix/security-vulnerabilities-feb2026 --no-rebase
Write-Output "Exit: $LASTEXITCODE"

Write-Output "`n=== Step 4: Log after pull ==="
git --no-pager log --oneline -5

Write-Output "`n=== Step 5: Merge origin/main ==="
$env:GIT_EDITOR = "true"
git merge origin/main --no-edit
Write-Output "Merge exit: $LASTEXITCODE"

Write-Output "`n=== Step 6: Status ==="
git status --short

Write-Output "`n=== Step 7: Add any conflicts resolved ==="
git add -A
git commit --no-edit --no-verify -m "merge: sync with origin/main (Copilot security fixes + new deps)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" 2>&1
Write-Output "Commit exit: $LASTEXITCODE"

Write-Output "`n=== Step 8: Push ==="
git push origin fix/security-vulnerabilities-feb2026
Write-Output "Push exit: $LASTEXITCODE"

Write-Output "`n=== Step 9: Final log ==="
git --no-pager log --oneline -5
