# Field Note: GitHub App Installation Token Format Change — Workflow Scan

**Date:** 2026-05-23  
**Author:** Claude Code / Risto Paarni  
**Status:** No action required

## Background

GitHub announced that App installation tokens will migrate to a new stateless format:

- New prefix: `ghs_...` (replacing the legacy format)
- New max length: ~520 characters (up from ~40–100)
- Rollout: per-request override header available now; forced migration TBD

Apps or workflows with hardcoded length assumptions (e.g., `== 40`, `[0:40]`, regex anchors on token length) may silently break.

## Scan Performed

All 41 workflow files under `.github/workflows/*.yml` were scanned for:

- Hardcoded token length comparisons (`== 40`, `!= 40`, `< 40`, `[0:4x]`, `cut -c 4x`)
- Token prefix checks (`ghp_`, `ghs_`, `v1.`)
- Token regex or format validation
- GitHub App token generation actions (`actions/create-github-app-token`, `tibdex/github-app-token`, etc.)

## Findings

**No issues found.** All workflows use one of two safe patterns:

1. `${{ github.token }}` — the standard automatic `GITHUB_TOKEN`, passed directly to actions/CLI without any length or format inspection.
2. `${{ secrets.* }}` — named secrets passed opaquely to CLI tools (GH CLI, curl headers).

The only `token_format` reference (`deploy-staging.yml:77`) is a GCP Workload Identity parameter unrelated to GitHub tokens.

## Conclusion

The dws6 repository is not affected by the GitHub App token format change. No workflow changes are needed.

If GitHub App authentication is added in future (e.g., `actions/create-github-app-token`), ensure the receiving code never asserts token length or prefix format.
