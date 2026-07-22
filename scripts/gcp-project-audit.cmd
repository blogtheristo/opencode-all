@echo off
REM ============================================================================
REM  gcp-project-audit.cmd  -  Inventory billable resources per GCP project
REM ----------------------------------------------------------------------------
REM  Lists storage buckets, Cloud Run services and Compute instances for each
REM  project so you can decide what is safe to delete BEFORE running
REM  `gcloud projects delete`. Read-only: it never deletes anything.
REM
REM  gcloud is a CMD-based tool (CLAUDE.md Rule 11) - run this from cmd.exe,
REM  not PowerShell.
REM
REM  Usage:
REM    scripts\gcp-project-audit.cmd                 (audit every project the
REM                                                   active account can see)
REM    scripts\gcp-project-audit.cmd PROJ1 PROJ2     (audit only the listed ids)
REM
REM  Auth first (sensitive actions need fresh reauth):
REM    gcloud auth login risto.paarni2024@lifetime.fi
REM ============================================================================

setlocal enabledelayedexpansion

where gcloud >nul 2>nul
if errorlevel 1 (
  echo [ERROR] gcloud CLI not found on PATH. Install from https://cloud.google.com/sdk
  exit /b 1
)

REM Build the project list: explicit args win, otherwise enumerate all projects.
set "PROJECTS=%*"
if "%PROJECTS%"=="" (
  echo No project ids given - enumerating all projects for the active account...
  for /f "usebackq tokens=1" %%P in (`gcloud projects list --format^=value^(projectId^)`) do (
    set "PROJECTS=!PROJECTS! %%P"
  )
)

if "%PROJECTS%"=="" (
  echo [ERROR] No projects found. Are you logged in? Try: gcloud auth login
  exit /b 1
)

for %%P in (%PROJECTS%) do (
  echo(
  echo ============================================================
  echo  PROJECT: %%P
  echo ============================================================
  echo --- Storage buckets ---
  gcloud storage buckets list --project=%%P --format="value(name)" 2>nul
  echo --- Cloud Run services (all regions) ---
  gcloud run services list --project=%%P --format="table(metadata.name,status.url,metadata.namespace)" 2>nul
  echo --- Compute instances ---
  gcloud compute instances list --project=%%P --format="table(name,zone,status,machineType.basename())" 2>nul
  echo --- Billing ---
  gcloud billing projects describe %%P --format="value(billingAccountName,billingEnabled)" 2>nul
)

echo(
echo Audit complete. Review the output above before deleting any project.
echo To delete:  gcloud projects delete PROJECT_ID   ^(30-day undelete window^)
endlocal
