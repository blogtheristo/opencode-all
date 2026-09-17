***
VERSION AND AGENT HISTORY
- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note
- Author: Claude Code (claude-opus-4-7) + risto.paarni2024@lifetime.fi
- Date: 2026-05-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/exa-openclaw-integration-YnDpO
***

# Exa + OpenClaw + GCP Vault Integration

## Ontology Tags
- **Geography:** EU / FI
- **Sector:** AI infrastructure, secrets management, retrieval
- **Entities:** Exa AI, OpenClaw, Google Cloud (`dws6run6`), Aiven (deferred), Firehorse, DGX Spark Ollama
- **Confidence:** HIGH for credentials + vault wiring; MEDIUM for production smoke-test (unverified at write time)

## Context

Firehorse agents (`investor-outreach`, `regulatory-radar`, `competitor-surveillance`, `kb-research`) needed a real EU-friendly web/people/company search backend. We picked Exa (Search + Websets), wired it through the existing GCP Secret Manager vault path (`dws6run6`, `europe-north1`), and held the line on DGX-only inference — Exa is a *data tool*, never an LLM. Work happened in a Claude Code web session against a remote sandbox, with all secret-touching commands executed on the operator's local Windows machine.

## The Story

Chronological — what was tried, what was chosen, what was deferred:

1. **MCP wizard → repo config.** Exa dashboard wizard generated an MCP setup prompt; registered at `mcp-hub/config/exa-mcp.json` (HTTP transport, OAuth-primary, API-key fallback, tool list pinned to `web_search_exa,web_fetch_exa,web_search_advanced_exa`). Commit `2950235`.
2. **Vault wiring (round 1).** Added `EXA_API_KEY → 'exa-api-key'` to `SECRET_MAP` in `src/config/secret-loader.ts` so the loader auto-populates `process.env` on boot. Commit `856a054`.
3. **Vault decision corrected.** Initially proposed Aiven PostgreSQL `app_secrets` (EU-sovereign). Operator clarified that the only running vault today is GCP Secret Manager under `admin@dws6.com` / project `dws6run6`. Kept the Aiven scaffolding on the branch as parked future state: `mcp-hub/config/aiven-mcp.json`, `scripts/aiven-vault-bootstrap.sh`. Installed `mcp-aiven` 1.4.0 and `avn` CLI 4.15.0 in the sandbox for reference. Commit `2c36c21`.
4. **GCP provisioner extended.** Added `EXA_API_KEY → 'exa-api-key'` to `$SecretMap` in `scripts/Provision-DwsIqSecrets.ps1`. Commit `13f1439`.
5. **Two-key split.** Operator created two prod keys on the Exa dashboard (`dws-iq-6-prod`, `dws-iq-6-openclaw-prod`). Both renamed in local `.env` to valid env-var form (`EXA_API_KEY`, `EXA_API_KEY_OPENCLAW`). Added the second key to both `SECRET_MAP` and the provisioner. Commit `c5863bd`.
6. **Live execution — shell-syntax wall.** Operator pasted the PowerShell-style `gcloud ... ` block into Windows CMD. CMD rejected backtick continuation, treating each subsequent flag as a fresh command (`'--region' is not recognized…`). Misread as "HTTP 400" initially; correct root cause was syntax-not-recognized in CMD. Resolved by rewriting examples as single-line CMD-safe commands and invoking the `.ps1` provisioner via `powershell -ExecutionPolicy Bypass -File`.

## Key Decisions

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Vault | GCP Secret Manager (`dws6run6`, `europe-north1`) | Aiven PostgreSQL `app_secrets` | Existing infra; Aiven not yet provisioned. CLOUD Act exposure is acceptable for a retrieval-only credential (low blast radius — only buys Exa search budget). Aiven reserved for user-data secrets. |
| Auth path | API key (env-loaded from vault) | OAuth via Exa MCP | Headless backend agents cannot complete a browser OAuth flow; vault path matches DWS_SECURITY_STANDARD. OAuth path remains available for interactive sessions. |
| Key count | Two (`EXA_API_KEY`, `EXA_API_KEY_OPENCLAW`) | Single shared key | Operator created both; kept the split so the OpenClaw native-search-provider lane and the Firehorse direct-call lane rotate independently. Will revisit after one week of prod use. |
| Inference | DGX Spark Ollama only | Anthropic / OpenAI / Groq | EU sovereignty (CLAUDE.md). Exa = data tool; reasoning stays in EU. Codified in `mcp-hub/config/exa-mcp.json` field `consumer_models.policy = "dgx_only"`. |
| Region | `europe-north1` (Finland) | `us-central1` etc. | EU data residency. Replication policy on Secret Manager is `user-managed --locations=europe-north1`. |

## Postmortem — the "400" was a shell-syntax error

**Symptom.** Operator reported "your code goes to 400 … server cannot process the request because it is malformed."

**Actual error captured later:**
```
F:\2026\Repos2026\dws6>gcloud run services update dws-iq-backend `
ERROR: (gcloud.run.services.update) unrecognized arguments: `
F:\2026\Repos2026\dws6>  --region europe-north1 `
'--region' is not recognized as an internal or external command, operable program or batch file.
```

**Root cause.** The `F:\...>` prompt is Windows **CMD**, not PowerShell. CMD does not recognize backtick (`` ` ``) as a line-continuation character — that is PowerShell-only. CMD treats the trailing backtick as a literal argument to `gcloud` (hence "unrecognized arguments: `") and treats every following line as an independent command (hence each `--flag` failing as "not recognized as internal/external command"). No HTTP request ever reached Google.

**Fix codified.** Added Rule 11 to `CLAUDE.md`:
> `gcloud` is a CMD-based tool, not PowerShell. All `gcloud` examples MUST use CMD syntax — single-line OR caret (`^`) continuation, never backtick. When a flow mixes `.ps1` and `gcloud`, invoke the `.ps1` via `powershell -ExecutionPolicy Bypass -File .\script.ps1` from CMD rather than switching shells mid-flow.

**Status:** Resolved.

## The Insight

- Credential plumbing for a third-party retrieval API is 80% wiring (SECRET_MAP, provisioner, Cloud Run binding) and 20% naming hygiene. Two specific naming traps bit us today: env-var names cannot contain hyphens, and the *Exa-dashboard label* is not the *env-var name*. Future credential intake should explicitly call out both.
- Splitting a "vault decision" across multiple commits (proposal → correction → parked alternative) was cheaper than fighting Aiven provisioning when the GCP path already worked. Park-don't-delete is the right move for half-built future state.
- "DGX-only inference" is documentable as a single JSON field today (`consumer_models.policy = "dgx_only"`) because every consumer-side agent route is hand-wired. The day we add dynamic agent loading, that policy needs a runtime guard.
- Shell mismatch is a recurring class of error that LLMs reliably miss. The fix is not "be more careful" — it's a hard rule per tool (Rule 10: `.ps1` → PowerShell; Rule 11: `gcloud` → CMD). Codify shell-per-tool, not shell-per-OS.

## Next Steps

- [ ] Operator: complete the 5-step push from this session's chat (CMD-safe block), confirm `gcloud secrets list --filter="name~exa-api-key"` shows two secrets in `europe-north1`.
- [ ] Operator: trigger a Cloud Run revision rollout so `EXA_API_KEY*` lands in `process.env` of `dws-iq-backend`.
- [ ] Operator: hit `/api/v1/health/secrets` and confirm `exa: loaded`.
- [ ] Next session: wire the `investor-outreach` skill to actually call Exa MCP through OpenClaw with DGX-Spark reasoning. Verify via `dws agent-run investor-outreach --query "Series B EU climate-tech 2026"`.
- [ ] After one week of stable production use: revoke whichever of the two Exa keys is unused. Default: keep `EXA_API_KEY` (general), revoke `EXA_API_KEY_OPENCLAW`.
- [ ] When user-data secrets (Supabase service key, JWT, Gmail tokens) next rotate, migrate them to Aiven vault using the parked scaffolding on this branch — those are the real CLOUD Act targets, not a search API token.

## Related

- **Branch:** `claude/exa-openclaw-integration-YnDpO`
- **Commits:** `2950235`, `856a054`, `2c36c21`, `13f1439`, `c5863bd`
- **Config:** `mcp-hub/config/exa-mcp.json`, `mcp-hub/config/aiven-mcp.json`
- **Loader:** `src/config/secret-loader.ts` (`SECRET_MAP` entries for `EXA_API_KEY`, `EXA_API_KEY_OPENCLAW`)
- **Provisioner:** `scripts/Provision-DwsIqSecrets.ps1` (`$SecretMap`)
- **Aiven parked:** `scripts/aiven-vault-bootstrap.sh`
- **Rule added:** `CLAUDE.md` Rule 11 (`gcloud` is CMD)
- **Prior vault decision:** `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`
- **Reference format:** `docs/field-notes/2026-02-23-mcp-server-expansion-cloudrun-lwm-claude.md`
