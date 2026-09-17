# Business-Critical Systems Inventory

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Initial creation — no business-critical systems inventory existed anywhere in the repo before this (confirmed by repo audit against the cybersecurity self-assessment survey, item "liiketoimintakriittiset palvelut ja järjestelmät on tunnistettu ja dokumentoitu")
- Version: 1.1 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Cloudflare Developer Platform connector went live this session — verified the Cloudflare entries against the real account instead of config-file inference. Found one previously undocumented Worker (`dws-revolut-checkout`) and added it as its own row.

Document Status:

- Created: 03.07.2026
- Last Modified: 03.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Why this document exists

A repo-wide audit (2026-07-03) found that "business-critical services and systems identified and documented" had **no supporting evidence anywhere** — the term was defined in `docs/SECURITY_GLOSSARY.md` but no actual list existed. This is that list.

This is a canonical, standalone document (not folded into `Admin/ADMIN_MANUAL.md`) because it is queried independently by the `Vesta` agent (`src/agents/vesta.agent.ts`) and needs a stable, linkable identity. It is cross-referenced from `Admin/ADMIN_MANUAL.md`'s Admin Manuals Index.

**Keep this document and `src/agents/vesta.agent.ts`'s `REGISTRY` constant in lockstep.** Vesta is the queryable form of this table — if you add, remove, or re-rate a system here, update Vesta's registry in the same change, and vice versa.

## Registry

| System                                                       | Criticality | Impact if disrupted                                                                                                                                                                                                                                                                                    | Owner       | Last reviewed |
| ------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ------------- |
| **Supabase** (primary database)                              | Critical    | Only production datastore; also the EU AI Act Art. 12 execution-log store (`agent_executions` table). Outage stops the platform. No HA read replica exists — backups go to Proton Drive, not a live replica.                                                                                           | Engineering | 2026-07-03    |
| **DGX Spark** (primary compute + cron)                       | Critical    | Runs `dws-backend`, `dws-cron`, `firehorse-reports`, Redis, NemoClaw via `infrastructure/dgx-spark/docker-compose.yml`. Cloud Run is the documented failover but is not a full equivalent (see Cron-works.md gaps).                                                                                    | Engineering | 2026-07-03    |
| **Cloudflare Pages — dws6.com / lifetime.fi**                | Critical    | Customer- and investor-facing sites. Outage is publicly visible and reputationally costly.                                                                                                                                                                                                             | Engineering | 2026-07-03    |
| **Cloudflare Worker `dws-revolut-checkout`**                 | Critical    | Revolut side of the hybrid Revolut+Stripe payment flow (`ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`). Verified live via the Cloudflare Developer Platform connector 2026-07-03 — this is the only Worker on the account (no KV/D1/Hyperdrive in use; R2 not enabled). Was not previously in this inventory. | Engineering | 2026-07-03    |
| **Stripe** (payments)                                        | Critical    | Revenue path. Webhook failures silently drop billing events (`src/routes/stripe-webhook.routes.ts`). Tier-3 autonomy per `AI_AGENT_GUIDELINES.md` — payment actions require human approval.                                                                                                            | Engineering | 2026-07-03    |
| **GitHub Actions + DGX Spark cron** (two-tier automation)    | High        | Deploy workflows (`deploy-*.yml`) are high-impact; reporting/content workflows are lower. See `Cron-works.md` — several jobs were found mid-migration with real gaps (fixed 2026-07-03, see that file's changelog).                                                                                    | Engineering | 2026-07-03    |
| **Cloudflare Pages — dws10.com / onelifetime.world**         | Medium      | Secondary sites (store, blog). Degrades marketing/store, not core product.                                                                                                                                                                                                                             | Engineering | 2026-07-03    |
| **Amazon SES** (email)                                       | Medium      | Transactional/notification email path. Delays outreach, not core product. Never Resend — see CLAUDE.md Non-Negotiable Rule 4.                                                                                                                                                                          | Engineering | 2026-07-03    |
| **MCP servers** (`mcp-hub/`, `mcp-hub-ts/`, `mcp-servers/*`) | Medium      | Internal tool-serving/LLM-routing layer for agents and Claude Code sessions, not directly customer-facing.                                                                                                                                                                                             | Engineering | 2026-07-03    |
| **Claude Code hooks** (`.claude/hooks/`)                     | Medium      | Secret-leak and SQL-safety guardrails gating agent actions. Disruption is a latent risk (things stop being caught), not an immediate outage.                                                                                                                                                           | Security    | 2026-07-03    |

Criticality tiers (matching the definition in `docs/SECURITY_GLOSSARY.md`):

- **Critical** — disruption stops core product function or revenue, or is publicly visible.
- **High** — disruption degrades an important but non-core capability (automation, deploys).
- **Medium** — disruption is inconvenient or delays a secondary function; no core-product impact.

## Review cadence

Review this table whenever a new system is added to the "Repository Focus Areas" in `CLAUDE.md`, or at minimum every 180 days. `Vesta`'s `stale-check` action flags any entry whose `lastReviewed` date is more than 180 days old — run it (`agent-run` skill, `TARGET=vesta`, `action: stale-check`) as part of the security review cadence defined in `docs/SECURITY_ROLES_AND_GUIDANCE.md`.

## Known gap

No system in this table currently has a documented Recovery Time Objective (RTO) or Recovery Point Objective (RPO). That is a genuine gap, not an oversight of this document's scope — RTO/RPO definition is a business decision for the systems' owner (Engineering), not something this inventory can assert on its own. Flagged here so it isn't silently lost.
