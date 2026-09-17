# Exit Google Cloud Run — Cutover Runbook

**Owner:** Lifetime Oy · risto.paarni@lifetime.fi
**Created:** 2026-07-16 · Branch: `claude/scaleway-pricing-update-19g8df`
**Why:** Google Cloud is US-incorporated, so **the CLOUD Act applies regardless
of region** — even `europe-north1`. Cloud Run was shipping a parallel
US-jurisdiction copy of the full `dws-iq-backend` (with prod Stripe / Supabase /
SMTP secrets) on every push to `main`. This voids the zero-CLOUD-Act claim and
costs ~3× the Scaleway equivalent for the same container. We are cutting over to
the Scaleway Serverless deploy the frontends already call.

## What changed in the repo (this branch)

| File                                               | Before                                                                 | After                                                                                                          |
| -------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/deploy-cloudrun.yml`            | **Active** prod deploy → Cloud Run `dws6run6` (europe-north1)          | Renamed `→ .disabled` (inert)                                                                                  |
| `.github/workflows/deploy-staging.yml`             | **Active** staging deploy → Cloud Run `dws6run6-staging` (`dws-iq-60`) | Renamed `→ .disabled` (inert)                                                                                  |
| `.github/workflows/deploy-scaleway_DEPRECATED.yml` | Deprecated                                                             | Renamed `→ deploy-scaleway.yml`, **reactivated** as canonical prod deploy, hardened with a graceful-skip guard |

These take effect **on merge to `main`** (workflow files are read from the
default branch). Until merge, `main` still runs the Cloud Run deploy.

> **Note — `mcp-hub-ts/cloudbuild.yaml`** still deploys the MCP hub to Cloud Run
> (`europe-north1`, image `…/dws-iq/mcp-hub-ts`) via Cloud Build. That is a
> separate service and is **not** covered by this cutover. Decide separately
> whether to migrate mcp-hub to Scaleway or retire it (tracked below).

## Prerequisites before merge (human — GitHub console)

Confirm these repo **Actions secrets** exist so `deploy-scaleway.yml` actually
deploys (it skips gracefully, not fails, if any are missing):

- [ ] `SCW_ACCESS_KEY`
- [ ] `SCW_SECRET_KEY`
- [ ] `SCW_ORGANIZATION_ID`
- [ ] `SCW_PROJECT_ID`
- [ ] `SCW_NAMESPACE_ID` (namespace `dwsiqcontainersjwyssm4e`)

If any are absent, add them from the Scaleway console (Project `dws-iq-backend`,
region `fr-par`) per `docs/field-notes/2026-04-05-scaleway-eu-inference-setup.md`.

## Cutover sequence

1. **Merge this branch to `main`.** Cloud Run deploys stop; the Scaleway deploy
   becomes the only backend deploy path.
2. **Trigger the Scaleway deploy** — either push a `src/**` change or run
   `deploy-scaleway.yml` via _workflow_dispatch_. Confirm the run reaches the
   `deploy` job (not the skip path) and the health check passes:
   `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/health` → 200.
3. **Verify the frontends** (already point at the scw.cloud URL — no change
   needed): load the assistant widget on dws6.com / dws10.com / onelifetime.world
   and confirm the backend responds from Scaleway.

## Google Cloud teardown (human — `gcloud`, CMD syntax per CLAUDE.md Rule 11)

Do this **only after** step 2 confirms Scaleway is serving. Run from CMD, not
PowerShell (gcloud is CMD-based).

```
:: Production service + project dws6run6
gcloud run services delete dws-iq-backend --region=europe-north1 --project=dws6run6 --quiet
gcloud artifacts repositories delete dws-iq-repo --location=europe-north1 --project=dws6run6 --quiet

:: Staging service + project dws-iq-60
gcloud run services delete dws6run6-staging --region=europe-north1 --project=dws-iq-60 --quiet

:: Revoke CI deploy identity (Workload Identity Federation)
::   - Delete the WIF pool/provider used by deploy-cloudrun / deploy-staging
::   - Delete/disable github-actions-deployer@<project>.iam.gserviceaccount.com
```

Then **remove the now-unused GitHub secrets**: `WIF_PROVIDER`,
`WIF_SERVICE_ACCOUNT`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`,
and the `STAGING_*` secrets that only fed the Cloud Run staging deploy.

Finally, **shut down / unlink billing** on `dws6run6` and `dws-iq-60` once no
other resource depends on them.

## Legal / compliance follow-ups (human — RED zone, Store/legal)

- [ ] **Remove Google Cloud from the sub-processor list** if it is listed:
      `dws10.com/legal/sub-processors.html`, `dpa.html`, `data-handling-policy`.
      Removing the US-jurisdiction backend copy is exactly the change that lets
      the zero-CLOUD-Act claim stand — reflect it in the DPA chain.
- [ ] Re-run `/truth-check` on public sovereignty claims after the sub-processor
      edit.

## Rollback

If Scaleway fails to serve after cutover, rename `deploy-cloudrun.yml.disabled`
back to `deploy-cloudrun.yml` on `main` and re-run it (Cloud Run infra is intact
until the teardown step above is executed — do teardown last, and only after a
stable Scaleway window).

## Open items

- [ ] Confirm SCW\_\* secrets present (above).
- [ ] Merge → trigger → verify Scaleway health 200.
- [ ] `gcloud` teardown of `dws6run6` + `dws-iq-60` (after stable window).
- [ ] Decide mcp-hub-ts: migrate `cloudbuild.yaml` to Scaleway or retire.
- [ ] Sub-processor / DPA edit + `/truth-check`.
- [ ] Provide a Scaleway staging target if branch-preview staging is still wanted
      (the old `deploy-staging.yml` was Cloud-Run-only).
