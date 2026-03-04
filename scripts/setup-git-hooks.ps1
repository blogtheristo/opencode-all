<#
DWS6 NO-DELETE POLICY

Installs repo-local git hooks to prevent destructive operations like branch deletion pushes.

Usage:
  pwsh scripts/setup-git-hooks.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "[DWS6] Configuring git to use repo hooks path .githooks ..." -ForegroundColor Cyan
git config core.hooksPath ".githooks"

Write-Host "[DWS6] Done. Branch deletions via push are now blocked locally." -ForegroundColor Green
Write-Host "[DWS6] Note: GitHub-side rulesets should still be enabled to block deletions in the UI/API." -ForegroundColor Yellow

