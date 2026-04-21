<#
DWS6 NO-DELETE POLICY

Installs repo-local git hooks to prevent destructive operations like branch deletion pushes.

Usage:
  pwsh scripts/setup-git-hooks.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "[DWS6] Configuring git to use repo hooks path .githooks ..." -ForegroundColor Cyan
git config core.hooksPath ".githooks"

Write-Host "[DWS6] Done. Local hooks enabled from .githooks/" -ForegroundColor Green
Write-Host "[DWS6] Active hooks:" -ForegroundColor Cyan
Write-Host "  - pre-commit: secret/pattern checks (content-based, docs allowed)" -ForegroundColor Gray
Write-Host "  - pre-push: no-delete policy + branch name validation" -ForegroundColor Gray
Write-Host "[DWS6] Note: Enable GitHub Secret Scanning + Push Protection and require CI secret scan checks." -ForegroundColor Yellow

