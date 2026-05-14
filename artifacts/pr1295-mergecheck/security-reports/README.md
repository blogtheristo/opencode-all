# Security Reports

This folder contains CI/CD generated security reports.

**Created:** January 29, 2026
**Purpose:** Store automated security audit reports from GitHub Actions

## Contents

- `monthly-audits/` - Monthly security compliance audit reports (JSON)
- `metrics/` - Security metrics data (auto-generated)
- `SECURITY_BACKLOG.md` - Security backlog tracking

## Important

This folder replaces `Admin/Security/` for CI/CD purposes.

The `Admin/` folder is **NEVER** pushed to GitHub:
- Admin files are stored locally in ProtonDrive only
- Contains sensitive deployment configurations
- All exceptions have been removed from .gitignore

## Workflows Using This Folder

- `.github/workflows/monthly-security-audit.yml`
- `.github/workflows/monthly-security-audit-enhanced.yml`

## Report Artifacts

Full audit reports are also uploaded as GitHub Actions artifacts with 90-day retention.
