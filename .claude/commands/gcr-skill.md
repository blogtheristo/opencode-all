---
name: gcr-skill
version: 1.0
date: 2026-05-13
description: Bootstrap Google Cloud Run CI identity for DWS using admin@dws6.com-owned project and fix iam.serviceAccounts.getAccessToken gate failures.
---

Create or repair Google Cloud Run CI deploy identity in an admin-owned GCP project.

Usage: `/gcr-skill <project-id>`

Input: $ARGUMENTS

## Steps

1. Parse `$ARGUMENTS` as target project id (default: `dws-iq-60`).
2. Confirm operator account is `admin@dws6.com`:
   - `gcloud auth list`
3. Ensure project exists and billing is linked.
4. Set active project and align ADC quota project:
   - `gcloud config set project <project-id>`
   - `gcloud auth application-default set-quota-project <project-id>`
5. Enable required APIs in one command:
   - `iamcredentials.googleapis.com`
   - `run.googleapis.com`
   - `artifactregistry.googleapis.com`
   - `cloudbuild.googleapis.com`
   - `secretmanager.googleapis.com`
6. Create CI deployer service account:
   - `github-actions-deployer@<project-id>.iam.gserviceaccount.com`
7. Grant minimum deployment roles:
   - `roles/run.admin`
   - `roles/artifactregistry.writer`
   - `roles/iam.serviceAccountUser`
8. Fix token minting failure gate by granting:
   - `roles/iam.serviceAccountTokenCreator` on the deployer service account.
9. If workflow uses key-based auth, create key JSON and rotate GitHub secrets.
10. Verify:
   - `gcloud services list --enabled --project=<project-id>`
   - `gcloud iam service-accounts get-iam-policy <deployer-sa>`
   - GitHub workflow points to the new project and service account.

## Guardrails

- Do not use personal-owner projects for production CI (`risto.paarni2024lifetime.fi` scope is out-of-bound for DWS6 prod control plane).
- Keep ownership and billing under `admin@dws6.com`.
- Never commit key JSON files; store only in GitHub secrets or secret manager.

