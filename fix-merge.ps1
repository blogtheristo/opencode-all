$ErrorActionPreference = "Stop"
Set-Location "F:\2026\Repos2026\dws6"

# Stage the resolved conflict
& git add ".claude/settings.local.json"
Write-Output "Staged settings.local.json"

# Complete the merge
$env:GIT_EDITOR = "true"
& git commit --no-edit
Write-Output "Merge committed"

# Push
& git push origin fix/security-vulnerabilities-feb2026
Write-Output "Pushed"

# Final status
& git log --oneline -3
