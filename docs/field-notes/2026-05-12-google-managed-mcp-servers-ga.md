# Google-Managed MCP Servers GA — Impact on DWS MCP Fleet

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Opus 4.7) | Session: claude/update-dws-mcp-hub-oVklG | Date: 12.05.2026 | Changes: Initial field note — Google Cloud announces 50+ managed MCP servers; documents DWS prefer-Google-managed rule, retires `cloudrun-mcp` plan, scopes `cloud-run-gateway` to Supabase + DWS agents + GitHub

Session Links & References:

- GitHub branch: https://github.com/blogtheristo/dws6/tree/claude/update-dws-mcp-hub-oVklG
- Source announcement: https://cloud.google.com/blog/products/ai-machine-learning/google-managed-mcp-servers-are-available-for-everyone
- Canonical catalog: https://docs.cloud.google.com/mcp/supported-products

Document Status:

- Created: 12.05.2026
- Last Modified: 12.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Architecture Field Note / Infrastructure

Related Documents:

- docs/MCP_CONFIGURATION.md (section 4 — Google-Managed MCP Servers)
- docs/MCP_CLIENT_QUICKSTART.md
- mcp.google-managed.example.json
- mcp-servers/cloud-run-gateway/README.md
- docs/field-notes/2026-02-23-mcp-server-expansion-cloudrun-lwm-claude.md (the
  pre-Google-managed expansion this supersedes for GCP capabilities)

---

## Executive Summary

On 12 May 2026, Google Cloud announced general availability + preview of 50+
first-party MCP servers covering most of its native services (Cloud Run,
BigQuery, GCS, Cloud Logging, Maps Grounding Lite, Gmail/Drive/Calendar,
Spanner, AlloyDB, Pub/Sub, …). They are MCP-spec compliant and work with
Claude Code, Gemini CLI, ChatGPT, VS Code, LangChain, ADK, and CrewAI.

For DWS, this changes the build/buy line for any MCP server whose only job
was to be a thin wrapper around a Google API:

- **Buy (use Google-managed):** Cloud Run, BigQuery, Cloud Logging,
  Cloud Monitoring, GCS, Maps Grounding Lite, Drive/Gmail/Calendar.
- **Keep building (DWS-owned):** Supabase MCP (not Google), DWS agents,
  DGX hub orchestration, LWM training pipeline, anything inside the
  EU-sovereign data perimeter.

**Impact:** The retired `cloudrun-mcp` (port 8769) stays retired — we no
longer need to resurrect it. The active `mcp-servers/cloud-run-gateway`
narrows scope to Supabase + DWS-agent surface + GitHub passthrough. New
GCP-native capabilities should be wired in via Google-managed MCP in the
client config rather than as new DWS-owned servers.

---

## What changed

| Capability                         | Before                                          | After                                                         |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Cloud Run management               | Self-hosted `cloudrun-mcp` (port 8769, retired) | Google-managed Cloud Run MCP                                  |
| BigQuery query / dataset access    | Ad-hoc `scripts/` glue                          | Google-managed BigQuery MCP                                   |
| Cloud Logging / Monitoring         | `gcloud` CLI from scripts                       | Google-managed MCP                                            |
| GCS objects (e.g. LWM checkpoints) | Wrapper code in `lwm-mcp`                       | Google-managed GCS MCP for read paths; LWM stays for compute  |
| Maps / weather / POI for SiteSense | Ad-hoc fetch logic                              | Google-managed Maps Grounding Lite MCP (non-sensitive inputs) |
| Workspace (Drive / Gmail / Cal.)   | None                                            | Google-managed Workspace MCPs (read-only first)               |

Authentication shifts from DWS bearer tokens to Cloud IAM identity tokens.
Model Armor (Google's prompt-injection / exfil layer), OTel tracing, and
Cloud Audit Logs are available out of the box on the Google-managed path.

---

## Decisions

### D1 — Prefer Google-managed for thin-pass-through capabilities

If a candidate MCP server is essentially `call Google API → return JSON`,
use the Google-managed version. Do not add a new DWS-owned wrapper for it.

### D2 — Keep DWS-owned MCP for orchestration + sovereignty

- `dws-gateway-local` / `mcp-servers/cloud-run-gateway` stays, narrowed to:
  Supabase tools, DWS agent surface, GitHub passthrough for non-Claude clients.
- `mcp-hub` orchestration on DGX stays — its job is multi-agent flow control,
  not GCP API wrapping.
- `claude-mcp` (session sync) and `lwm-mcp` (training pipeline) stay — both
  are DWS-specific and don't have a Google-managed equivalent.

### D3 — EU sovereignty gate before pointing at customer data

Google-managed MCP is not automatically EU-sovereign. Before using it for
anything that would fall under our sovereignty posture, confirm region pinning
(`europe-north1` default), residency commitments, and that the MCP traffic
does not leave the EU perimeter. Customer / PII workloads stay on Supabase
and the DWS hub. Maps Grounding Lite specifically can route via non-EU
endpoints — keep it for non-sensitive routing context only.

### D4 — Auth via Cloud IAM, not static keys

`.mcp.json` references `${GOOGLE_ID_TOKEN}` populated at session start by
`gcloud auth print-identity-token`. No long-lived static API keys, no
service-account JSON content inside `.mcp.json`. Per-service viewer roles +
Deny policies on destructive actions.

---

## Implementation in this branch

1. `docs/MCP_CONFIGURATION.md` — new section 4 "Google-Managed MCP Servers"
   covering rationale, catalog subset, IAM auth, wiring, EU sovereignty gate,
   and the migration plan for DWS-owned wrappers. Bottom-line ordering updated
   to put Google-managed second only to GitHub Official.
2. `mcp.google-managed.example.json` — root-level reference config showing
   typical entries for Cloud Run, BigQuery, Cloud Logging, Cloud Monitoring,
   GCS, and Maps Grounding Lite, all using `${GOOGLE_ID_TOKEN}`.
3. `mcp-servers/cloud-run-gateway/README.md` — scope-narrowing note pointing
   at Google-managed alternatives for GCP-native capabilities; the gateway
   keeps Supabase + DWS-agent + GitHub.
4. `docs/MCP_CLIENT_QUICKSTART.md` — adds the Google-managed option as a
   client-config choice alongside the Win11 / DGX / remote profiles.

No code changes to running MCP servers — this is a configuration + policy
update. Existing deployments continue to work; new capabilities prefer the
Google-managed path.

---

## Open follow-ups

1. Replace the placeholder `<managed-…-mcp-endpoint>` hostnames in
   `mcp.google-managed.example.json` with the canonical URLs from
   `docs.cloud.google.com/mcp/supported-products` once the catalog page
   surfaces stable endpoints we want to commit to.
2. Add a `gcloud auth print-identity-token` helper to the worktree creation
   scripts so `${GOOGLE_ID_TOKEN}` is populated automatically per session.
3. Run the `sovereignty-assess` skill on each Google-managed MCP we wire in
   before letting it touch anything beyond synthetic / public data.
4. Update `Admin/ADMIN_MANUAL.md` MCP Configuration section to reference
   the new section 4 in `docs/MCP_CONFIGURATION.md`.
5. Decide whether to expose `dws_workflow` over Google's Agent Registry as
   well, so a Gemini CLI / ADK client can discover DWS agents the same way
   it discovers Google MCP servers.
