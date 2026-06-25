# Cloud Run CI Deploy Identity — Runbook

Repairs the GitHub Actions → Google Cloud Run deploy identity and fixes the
`iam.serviceAccounts.getAccessToken` (token-minting) gate that was failing
`deploy-cloudrun.yml`.

> **Who runs this:** a human operator authenticated as **`admin@dws6.com`** with
> `gcloud` installed. These steps touch GCP IAM and GitHub **secrets** — both are
> outside the agent's automation boundary (RED zone). The agent has already made
> the in-repo workflow fixes (below); this runbook is the remaining manual part.

## What the agent already fixed in-repo (no action needed)

`.github/workflows/deploy-cloudrun.yml`:

- **Valid YAML** — the `--set-env-vars` continuation block was malformed (zero-indented
  lines inside a `run: |` scalar → "Invalid workflow file"). Collapsed to one line.
- **Correct WIF auth** — added `google-github-actions/auth@v2` (mints the access token);
  `setup-gcloud@v1` alone does **not** authenticate via workload identity. Bumped
  `setup-gcloud` to `@v2`.
- **Graceful skip** — `HAS_GCP_DEPLOY_AUTH` gate skips the deploy (green) instead of
  hard-failing the `main` pipeline when WIF secrets are absent (matches
  `deploy-staging.yml`).

## ✅ Project resolved — `dws-iq-60`

> **Authoritative source:** `Admin/ADMIN_MANUAL.md` (GCP CI deploy-identity runbook, v2.9).
> It is the command-of-record for project **`dws-iq-60`** and SA
> **`github-actions-deployer@dws-iq-60.iam.gserviceaccount.com`**. This file defers to it.

Both deploy workflows now use the **same** identity (consolidated 2026-06):

| Workflow                                | `PROJECT_ID` | Service            | Secrets                                                 |
| --------------------------------------- | ------------ | ------------------ | ------------------------------------------------------- |
| `deploy-cloudrun.yml` (prod, on `main`) | `dws-iq-60`  | `dws-iq-backend`   | `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` |
| `deploy-staging.yml` (on `claude/**`)   | `dws-iq-60`  | `dws6run6-staging` | `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` |

(`dws6run6` remains a separate project for the Gemini-review Cloud Run service — it is
**not** the CI deploy-identity project.)

### Confirm ownership before applying IAM (optional sanity check)

`dws-iq-60` should be admin-owned with project number **`134875067432`** (the number embedded
in `GCP_WORKLOAD_IDENTITY_PROVIDER`). Verify:

```cmd
REM Expect projectNumber 134875067432; owners should include admin@dws6.com (or the admin group):
gcloud projects describe dws-iq-60 --format="value(projectId,projectNumber)"
gcloud projects get-iam-policy dws-iq-60 --flatten="bindings[].members" --filter="bindings.role=roles/owner" --format="value(bindings.members)"

REM For contrast (Gemini-review host, not CI identity):
gcloud projects describe dws6run6 --format="value(projectId,projectNumber)"
```

If `dws-iq-60` is **not** admin-owned, stop and reconcile with `Admin/ADMIN_MANUAL.md` before
proceeding.

## Steps (run as `admin@dws6.com`; `gcloud` is CMD syntax — caret `^`, never backtick)

```cmd
set PROJECT_ID=dws-iq-60
set REGION=europe-north1
set DEPLOYER=github-actions-deployer@%PROJECT_ID%.iam.gserviceaccount.com

gcloud auth list
gcloud config set project %PROJECT_ID%
gcloud auth application-default set-quota-project %PROJECT_ID%

gcloud services enable iamcredentials.googleapis.com run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com --project=%PROJECT_ID%

gcloud iam service-accounts create github-actions-deployer --display-name="GitHub Actions Cloud Run deployer" --project=%PROJECT_ID%

gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%DEPLOYER%" --role="roles/run.admin"
gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%DEPLOYER%" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding %PROJECT_ID% --member="serviceAccount:%DEPLOYER%" --role="roles/iam.serviceAccountUser"

REM --- the token-minting gate fix: allow the SA to mint its own access token ---
gcloud iam service-accounts add-iam-policy-binding %DEPLOYER% --member="serviceAccount:%DEPLOYER%" --role="roles/iam.serviceAccountTokenCreator" --project=%PROJECT_ID%
```

### Workload Identity Federation (keyless — preferred)

```cmd
set POOL=github-pool
set PROVIDER=github-provider
set REPO=blogtheristo/dws6

gcloud iam workload-identity-pools create %POOL% --location=global --display-name="GitHub Actions pool" --project=%PROJECT_ID%

gcloud iam workload-identity-pools providers create-oidc %PROVIDER% --location=global --workload-identity-pool=%POOL% --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" --attribute-condition="assertion.repository=='%REPO%'" --project=%PROJECT_ID%

gcloud iam service-accounts add-iam-policy-binding %DEPLOYER% --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/%POOL%/attribute.repository/%REPO%" --project=%PROJECT_ID%
```

Get the provider resource name for the GitHub secret:

```cmd
gcloud iam workload-identity-pools providers describe %PROVIDER% --location=global --workload-identity-pool=%POOL% --format="value(name)" --project=%PROJECT_ID%
```

Ensure the Artifact Registry repo exists:

```cmd
gcloud artifacts repositories create dws-iq-repo --repository-format=docker --location=%REGION% --project=%PROJECT_ID%
```

## GitHub secrets to set (Settings → Secrets and variables → Actions)

`deploy-cloudrun.yml` and `deploy-staging.yml` now use the **same two secrets** (values per
`Admin/ADMIN_MANUAL.md`):

- `GCP_WORKLOAD_IDENTITY_PROVIDER` =
  `projects/134875067432/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
- `GCP_SERVICE_ACCOUNT` = `github-actions-deployer@dws-iq-60.iam.gserviceaccount.com`
- Runtime env secrets already referenced by `deploy-cloudrun.yml`: `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SMTP_*`, `EMAIL_FROM`,
  `BOOKING_ADMIN_EMAIL`.

If these two secrets are already set (staging uses them), `deploy-cloudrun.yml` needs no new
secrets — it just needs the deployer SA to have `roles/iam.serviceAccountTokenCreator` and
the repo principal `roles/iam.workloadIdentityUser` (see Admin manual).

## Verify

```cmd
gcloud services list --enabled --project=%PROJECT_ID%
gcloud iam service-accounts get-iam-policy %DEPLOYER% --project=%PROJECT_ID%
```

Then re-run the deploy: **Actions → Deploy to Google Cloud Run → Run workflow** (or push a
backend change to `main`). With secrets set, the gate flips to `true` and it deploys; until
then it skips green instead of failing red.

## Guardrails

- Keep ownership + billing under `admin@dws6.com`; do not use a personal-owner project for prod CI.
- Prefer WIF (keyless). If key JSON is unavoidable, store it only in GitHub secrets /
  Secret Manager — **never commit key files**.
