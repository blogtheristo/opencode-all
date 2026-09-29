# Cloud Build release channels: impact on dws6run6

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/cloud-build-release-channels-5niz06 | Date: 29.09.2026 | Changes: Impact triage of the Google Cloud notice "Cloud Build release channels" (to admin@dws6.com) against the repo's Cloud Build configs and the Cloud Run exit plan. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Session Links & References:

- Notice: Google Cloud email to admin@dws6.com, received 29.09.2026 (HIC forward)
- Exit plan: `infrastructure/cloudrun/EXIT_CLOUDRUN_RUNBOOK.md`
- Project record: `Admin/ADMIN_MANUAL.md` § "Project: dws6run6"

Document Status:

- Created: 29.09.2026
- Status: PENDING_REVIEW

---

## 1. The notice

- Cloud Build worker VMs now follow one of three release channels. The channel sets the host software (Docker daemon, Debian); step containers are unaffected.
- **28.03.2027:** the `regular` channel becomes the default for all Cloud Build workers.
- Google advises: test builds on `regular` before that date; pin to `stable` if a longer validation window is needed.
- Affected project: `dws6run6`.

## 2. What in the repo runs on Cloud Build

| Config                                             | Service deployed       | Host-sensitive?                                                                                          |
| -------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `cloudbuild.yaml`                                  | `dws-iq-backend`       | Yes: `gcr.io/cloud-builders/docker` build/push uses the worker's Docker daemon                           |
| `mcp-hub-ts/cloudbuild.yaml`                       | `mcp-hub`              | Yes: same Docker builder; `push --all-tags`                                                              |
| `mcp-servers/cloud-run-gateway/cloudbuild.yaml`    | `mcp-gateway` (Python) | Yes: same Docker builder                                                                                 |
| `mcp-servers/cloud-run-gateway-ts/cloudbuild.yaml` | `mcp-gateway` (TS)     | Yes: same Docker builder                                                                                 |
| `AgentFoundry/cloudbuild.yaml`                     | sales agents           | Highest: `--cache-from` + `BUILDKIT_INLINE_CACHE=1` depend on the host daemon's BuildKit/cache behaviour |

The `gcloud run deploy` steps run inside the `cloud-sdk` container and are not affected.

## 3. Assessment

1. **The project is on its way out.** The GitHub Actions Cloud Run deploys are disabled (`.github/workflows/deploy-cloudrun.yml.disabled`, `deploy-staging.yml.disabled`) and the runbook lists `gcloud` teardown of `dws6run6` as an open item. The reason is jurisdictional (CLOUD Act applies regardless of region), not technical.
2. **Open question: are any Cloud Build triggers still live?** The repo cannot answer this. `cloudbuild.yaml` names GitHub triggers on `main`; if they still exist, every push to `main` still ships a US-jurisdiction copy of the backend, which contradicts the exit runbook. This matters more than the release channel.
3. **Release-channel risk is low.** All five configs use plain `docker build` / `docker push`. The only step with real host coupling is AgentFoundry's inline-cache build; a Docker major version change can alter cache behaviour. Worst case is a slower build or a cache miss, not a broken deploy.
4. **If `dws6run6` is torn down before 28.03.2027, no action is needed.** If it stays, one test build on `regular` per config is enough.
5. **Config syntax not verified.** The Cloud Build release-channel documentation (`docs.cloud.google.com`) was blocked from this session's network, so no field name or `gcloud` flag has been added to the configs. Adding an unverified key would fail every build.

## 4. Commands for the HIC (CMD syntax)

Check for live triggers and recent builds:

```cmd
gcloud builds triggers list --project=dws6run6 --region=global
gcloud builds triggers list --project=dws6run6 --region=europe-north1
gcloud builds list --project=dws6run6 --limit=10 --format="table(id,createTime,status,substitutions.TRIGGER_NAME)"
```

If triggers exist and the exit plan still holds: disable them (reversible) rather than delete:

```cmd
gcloud builds triggers update <TRIGGER_NAME> --project=dws6run6 --region=<REGION> --disabled
```

## 5. Sales Score

N/A: vendor infrastructure notice, no buyer or product signal.

## 6. Learning-outcome steps

- KB update: N/A (single operational notice, no new concept).
- Learn/ HTML render and Drive export: N/A pending HIC decision in §7.
- Calendar: deadline 28.03.2027 surfaced to HIC; event only if `dws6run6` is kept.

## 7. HIC decision

Retire `dws6run6` (finish the exit runbook teardown before 28.03.2027) or keep Cloud Build there and run the `regular`-channel test builds?
