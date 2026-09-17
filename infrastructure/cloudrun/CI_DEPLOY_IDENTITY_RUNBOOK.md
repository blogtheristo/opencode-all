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

## Two projects — do NOT conflate them

The two workflows deploy to **different projects on purpose**:

| Workflow                                | Deploy target | Service            | Secrets                                                 | Notes                                                                                                                                                    |
| --------------------------------------- | ------------- | ------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy-cloudrun.yml` (prod, on `main`) | `dws6run6`    | `dws-iq-backend`   | `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`                   | **Active B2B payment stack** (Stripe live webhooks) — `Admin/ADMIN_MANUAL.md` → "Google Cloud Run (Active – B2B Payment Stack)". **Keep on `dws6run6`.** |
| `deploy-staging.yml` (on `claude/**`)   | `dws-iq-60`   | `dws6run6-staging` | `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` | Admin-owned CI identity project (proj# `134875067432`). Authoritative runbook: `Admin/ADMIN_MANUAL.md` v2.9.                                             |

> ⚠️ Do **not** point `deploy-cloudrun.yml` at `dws-iq-60` — that would move the live payment
> service to the wrong project. The two have independent WIF identities.

To enable GitHub-Actions auto-deploy to `dws6run6` (today that prod service is also deployed
manually per the Admin manual's dws6run6 section), set this workflow's `WIF_PROVIDER` /
`WIF_SERVICE_ACCOUNT` to a deployer SA **in `dws6run6`**, or grant the `dws-iq-60` deployer SA
cross-project `roles/run.admin` + `roles/artifactregistry.writer` on `dws6run6`. Until then the
workflow skips green.

### Confirm which project owns the live service

```cmd
REM Where the live B2B payment backend runs (expect a service URL):
gcloud run services describe dws-iq-backend --region=europe-north1 --project=dws6run6 --format="value(status.url)"
gcloud projects describe dws6run6 --format="value(projectId,projectNumber)"

REM CI identity project (expect projectNumber 134875067432):
gcloud projects describe dws-iq-60 --format="value(projectId,projectNumber)"
```

The steps below create/repair the **`dws-iq-60` CI identity** (used by staging; authoritative in
`Admin/ADMIN_MANUAL.md`). For the `dws6run6` prod stack, see that manual's
"Google Cloud Run (Active – B2B Payment Stack)" section.

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

**`deploy-staging.yml`** (→ `dws-iq-60`, values per `Admin/ADMIN_MANUAL.md`):

- `GCP_WORKLOAD_IDENTITY_PROVIDER` =
  `projects/134875067432/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
- `GCP_SERVICE_ACCOUNT` = `github-actions-deployer@dws-iq-60.iam.gserviceaccount.com`

**`deploy-cloudrun.yml`** (→ `dws6run6`, active payment stack) uses its own pair:

- `WIF_PROVIDER` = the `dws6run6` workload-identity provider resource name
  (or, if you reuse the `dws-iq-60` SA cross-project, set this to the value above)
- `WIF_SERVICE_ACCOUNT` = the deployer SA that has `run.admin` + `artifactregistry.writer`
  on `dws6run6`
- Runtime env secrets it references: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SMTP_*`, `EMAIL_FROM`, `BOOKING_ADMIN_EMAIL`.

In all cases the deployer SA needs `roles/iam.serviceAccountTokenCreator` and the repo
principal needs `roles/iam.workloadIdentityUser` (the `getAccessToken` gate).

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
