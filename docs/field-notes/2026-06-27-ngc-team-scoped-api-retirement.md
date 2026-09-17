# Field Note: NGC Team-Scoped API Paths Retiring September 30, 2026

**Date:** 2026-06-27
**Author:** DWS Team
**Source:** NGC Core Services Team notification email
**Type:** Vendor API Deprecation / Audit

---

## Summary

Starting September 30, 2026, NVIDIA is retiring NGC API paths containing `/teams/{team}` segments for organization-level resources. The fix is to remove the `/teams/{team}` segment from affected URLs.

**Example:**

- Before: `/v2/orgs/{org}/teams/{team}/nvcf/functions/**`
- After: `/v2/orgs/{org}/nvcf/functions/**`

Products not using NVIDIA Private Registry or NVIDIA Data Services will no longer support team-scoped paths.

## DWS6 Codebase Audit Result

**Status: No action required.**

Audit performed 2026-06-27 across the full repository. The DWS integration surface with NVIDIA consists of:

| Integration                           | Pattern                                                       | Affected? |
| ------------------------------------- | ------------------------------------------------------------- | --------- |
| NIM API (climate-assistant, NemoClaw) | `build.nvidia.com` / OpenAI-compatible `/v1/chat/completions` | No        |
| Container registry pulls              | `nvcr.io/nvidia/*`                                            | No        |
| NemoClaw NGC key                      | `NEMOCLAW_NGC_KEY` env var (auth token)                       | No        |
| ISV sync script                       | `scripts/sync-nvidia-isv.cjs` (local config)                  | No        |
| Product catalog                       | Hardware/model names in `products.json`                       | No        |

No team-scoped NGC REST API paths (`/v2/orgs/{org}/teams/{team}/...`) exist in the codebase.

## Contact

For NGC API questions: contact-ngc-services@nvidia.com
