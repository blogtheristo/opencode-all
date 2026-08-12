# DWS Database Sovereignty & Cloud Fit Plan

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Sonnet 5) | Session: claude/database-sovereignty-cloud-plan-j8wuy7 | Date: 05.07.2026 | Changes: Added Pillar 5 (Agentic Commerce Data — `payment_events`/`subscription_plans`, Stripe webhook connector, card-data-never-in-our-DB rule) and Pillar 6 (KYA / Know Your Agent Data — Shufti Pro EU-only residency, trust-score audit-log treatment, destructive-action gating template). Renumbered Phased Roadmap to §8 and Cross-References to §9.
- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/database-sovereignty-cloud-plan-j8wuy7 | Date: 05.07.2026 | Changes: Initial plan — four-pillar database strategy (sovereignty, cloud-fit decision framework, connector integration, security compliance), phased roadmap, and audit of current database estate against `DWS_SECURITY_STANDARD.md` §17.5.

Session Links & References:

- Claude Code (claude/database-sovereignty-cloud-plan-j8wuy7): https://github.com/blogtheristo/dws6/commits/claude/database-sovereignty-cloud-plan-j8wuy7

Document Status:

- Created: 05.07.2026
- Last Modified: 05.07.2026
- Language: English
- Languages Available: English
- Publication Status: DRAFT — pending founder review

---

## 0. Scope & How to Read This

This is a **plan**, not an executed change. It answers four standing questions the founder raised:

1. Are our databases **sovereign** (EU-owned infrastructure, no unmitigated CLOUD Act exposure)?
2. When should we use a **cloud-based (managed) database** rather than self-hosted, and how do we decide — including reacting to **market signals** (pricing, feature velocity, new EU-sovereign entrants)?
3. How do databases **work with our connectors** (ERP connectors, MCP tool servers, Cloudflare edge storage)?
4. How do we keep this **compliant** with `DWS_SECURITY_STANDARD.md` and GDPR/EU AI Act obligations?

Per this repo's auto-mode trust boundary: authoring migration **files** under `supabase/migrations/*.sql` is a reviewable text artifact (green zone). **Applying** migrations to a live database (`supabase db push`, `psql`, `mcp__Supabase__apply_migration`) is red zone — it requires an explicit human action. Nothing in this plan proposes an agent apply a migration or move production data unattended.

---

## 1. Current State (audited 05.07.2026)

| Database / store                                            | Provider                                                | Region                    | CLOUD Act status                                                                                                                          | Role                                                                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| DWS 6 primary (`dws6.com`)                                  | Supabase (managed Postgres)                             | EU (Frankfurt/Helsinki)   | Supabase Inc. is US-domiciled — same exposure class as the Aiven exception below                                                          | Primary OLTP: auth, RLS-scoped tenant data, agent logging, migrations `supabase/migrations/*.sql` (85+ files) |
| Aiven PostgreSQL sandbox (`dws-test`)                       | Aiven (Finnish, US-VC-backed) on `google-europe-north1` | EU (Finland, GCP-hosted)  | **Explicit sovereignty exception**, founder-approved 2026-07-02 (`DWS_SECURITY_STANDARD.md` §17.5) — residual risk recorded, not resolved | Agent workspace, LWM training mirror, disaster-recovery secondary (daily mirror from Supabase)                |
| Cloudflare D1 / Hyperdrive (available, not yet provisioned) | Cloudflare (US-owned)                                   | Configurable (can pin EU) | Same "content/edge" class as Cloudflare Pages/Workers — treated as edge-cache, not system of record                                       | Not yet in use; MCP connector present in this session (`Cloudflare_Developer_Platform`)                       |
| pgvector (embeddings)                                       | Same Supabase instance                                  | EU                        | Same as row 1                                                                                                                             | Semantic search, LWM memory (`065_firehorse_memory.sql`, `047_hybrid_memory_search.sql`)                      |

**Honest finding:** DWS's _database layer_ today runs entirely on providers with US-ownership exposure (Supabase, Aiven) even though compute is migrating toward EU-sovereign hosts (Scaleway, UpCloud). §17.5's own residual-risk note flags this directly: the DB is now "the last GCP/US-resident piece" once the compute migration completes. This plan's Pillar 1 exists to close that gap on a schedule, not to re-litigate whether it matters.

---

## 2. Pillar 1 — Sovereignty

**Objective:** No customer data lives on infrastructure with unmitigated CLOUD Act exposure, in line with `DWS_SECURITY_STANDARD.md` §17.5 (permanent rule).

**Actions:**

1. **Tiering, not a single migration.** Match database residency to the customer tier already defined in `docs/CLOUD_ENVIRONMENTS.md` §3.2.1:
   - Tier 1 (default EU, current pilot customers): Supabase EU stays acceptable short-term — it is a _documented, founder-approved exception_, not silently accepted.
   - Tier 2 (customer explicitly requests sovereignty / non-CLOUD-Act jurisdiction): database must sit on an EU-sovereign provider from the approved list (Scaleway managed Postgres, UpCloud Managed Database, Hetzner-hosted PostgreSQL/Aiven-on-Hetzner if available, or self-hosted Postgres on Scaleway/UpCloud compute with our own backup pipeline).
   - Full Sovereignty (Aegis, EU AI Act Art. 12 customers): dedicated single-tenant Postgres instance on UpCloud/Hetzner, no shared schema, own encryption keys.
2. **Track the exception, don't let it go stale.** Add a recurring line item (quarterly, tied to the existing `/cron audit`) to re-check whether Aiven/Supabase ownership status has changed and whether an EU-sovereign managed-Postgres alternative has closed the feature gap (see Pillar 2). Owning doc: this file + `DWS_SECURITY_STANDARD.md` §17.5.
3. **Encryption & key ownership.** Confirm at-rest encryption keys for Tier 2+ databases are customer- or DWS-managed (not the cloud provider's default), matching the sovereignty-pillars-assess SIB/CSB/EAB scoring (`/sovereignty-pillars-assess`).
4. **Data residency proof, not just a claim.** Use `mcp__Supabase__get_project_url` / project settings to confirm the actual region string per project, and record it in this table at every review — don't rely on provider marketing copy.

**Do not:** migrate the live Tier 1 Supabase database as a reflex action. It is a founder-accepted exception with a documented rationale; moving it is a Tier-2-trigger decision (first non-CLOUD-Act customer, or the quarterly review above concluding the risk profile changed), not a default.

---

## 3. Pillar 2 — Cloud-Based Database, Chosen by Fit (Market-Signal-Driven)

**Objective:** Don't default to "always self-host" or "always managed cloud." Pick per workload, and revisit the pick when the market changes underneath us.

**Decision framework** — use a managed cloud database when _all_ of these hold, self-host/sovereign-managed otherwise:

| Signal                       | Favors managed cloud DB                                                               | Favors self-hosted / sovereign-managed                                      |
| ---------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Customer tier                | Tier 1 pilot, internal tooling                                                        | Tier 2+, Aegis, regulated customer                                          |
| Operational load             | Small team, no dedicated DBA capacity                                                 | Capacity to run backups/HA ourselves exists or is budgeted                  |
| Feature velocity needed      | Yes — pgvector, realtime, auto-scaling, branching (Supabase branches) save build time | No — workload is stable, standard Postgres suffices                         |
| CLOUD Act exposure tolerance | Explicit, documented exception accepted (Pillar 1)                                    | Zero-tolerance customer requirement                                         |
| Cost at current scale        | Managed tier cheaper below usage threshold                                            | Self-hosted cheaper once scale crosses provider's per-seat/row pricing knee |

**Market-signal watch list** (review quarterly alongside the sovereignty exception review in Pillar 1 — same cadence, same meeting, don't run two separate processes):

- New EU-sovereign managed-Postgres entrants closing the feature gap with Supabase (branching, realtime, auto-generated REST/GraphQL). If one appears, it becomes the Tier 2 default candidate before we build a bespoke self-hosted equivalent.
- Cloudflare D1 (SQLite at the edge) / Hyperdrive (connection pooling in front of existing Postgres) — these MCP tools are already connected in this workspace (`Cloudflare_Developer_Platform`). Treat D1 as an **edge cache / read-path accelerator** in front of the sovereign system of record, never as the primary store for customer PII — Cloudflare is US-owned, same class as Cloudflare Pages/Workers today (content-only, not sovereign data plane, per `docs/CLOUD_ENVIRONMENTS.md` §2.2).
- Aiven's own roadmap (since we already have a founder-approved exception with them) — if Aiven ships a genuinely EU-owned region/entity structure, that resolves the residual risk in §17.5 without a migration.
- Supabase pricing/region changes — re-run the cost row of the table above whenever Supabase changes its EU pricing tier.

**Concretely, next review is due:** first quarterly cron audit after this plan lands — register alongside `/cron audit` rather than as a new manual reminder (Script Automation Rule: no human-memory-dependent follow-ups).

---

## 4. Pillar 3 — Work With Our Connectors

**Objective:** Every database interaction goes through a reviewed connector or MCP tool — no ad hoc direct-`psql` scripts scattered across the codebase.

**Current connector inventory:**

| Connector class                                         | Location                                                                           | Talks to DB how                                                                                                                                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ERP connectors (SAP, Dynamics 365, IFS, Jeeves, Visma)  | `src/integrations/erp/connectors/*.ts`, shared `base-connector.ts`                 | Pull external ERP data → normalize → write into Supabase tables (e.g. `073_erp_integration_tables.sql`) via the app's own DB client, never direct connector-to-Postgres                    |
| ESG connector (Worldfavor)                              | `src/integrations/esg/worldfavor-connector.ts`                                     | Same pattern — external API → app layer → Supabase                                                                                                                                         |
| Supabase MCP tools                                      | `mcp__Supabase__*` (list_tables, execute_sql, get_advisors, apply_migration, etc.) | Direct project-scoped access; `apply_migration`/`execute_sql` are the only tools that mutate schema/data — both are RED zone per this repo's trust boundary and require human confirmation |
| Cloudflare Developer Platform MCP (D1/Hyperdrive/KV/R2) | Session MCP server, not yet wired into app code                                    | Available for edge-cache or edge-KV use cases; not a system of record (Pillar 2)                                                                                                           |
| Agent memory / LWM connectors                           | `065_firehorse_memory.sql`, `047_hybrid_memory_search.sql`                         | pgvector-backed; same Supabase instance, no separate connector class needed                                                                                                                |

**Actions:**

1. **New ERP/data connectors follow `BaseERPConnector`'s pattern** (axios client, auth-header interceptor, rate-limit tracking, structured `SyncResult`/`SyncError` types) — don't invent a second connector shape. This is Rule 11 (match codebase conventions).
2. **Any new connector that reaches the database earns a skill entry** per the Agent Productization Rule: CLI path, structured JSON output, `skills/manifest.json` registration. If a connector is reused by more than one agent, it's a candidate for MCP exposure rather than being buried in `src/integrations/`.
3. **Cloudflare D1/Hyperdrive stays edge-only until a named use case exists.** Do not provision a D1 database speculatively (Rule 2, simplicity first) — wait for a concrete read-path latency problem the sovereign Postgres can't solve directly.
4. **MCP-mutation tools stay gated.** `mcp__Supabase__apply_migration` and `execute_sql` (write path) require the same human-in-the-loop step as any RED-zone action in this repo's trust boundary — this plan does not change that gate, it documents why it exists (schema/data mutation is exactly the kind of hard-to-reverse action CLAUDE.md's "Executing actions with care" section calls out).

---

## 5. Pillar 4 — Security & Compliance

**Objective:** Every database change stays inside `DWS_SECURITY_STANDARD.md` and this repo's non-negotiable rules — no exceptions carved out for expediency.

**Non-negotiables already in force (reaffirmed, not re-invented):**

1. **RLS stays on for every tenant-scoped table.** New tables added under Pillar 3 connectors must ship RLS policies in the same migration file that creates them — see `031_supabase_advisor_fixes.sql`, `039_fix_security_definer_views.sql`, `072_fix_v_booked_slots_security_invoker.sql` for the established remediation pattern when RLS/security-definer issues are found.
2. **Migrations are reviewable SQL files, applying them is not automatic.** Author in `supabase/migrations/`, run `mcp__Supabase__get_advisors` after any schema change to catch missing RLS / security-definer regressions before a human applies it.
3. **Secrets never move through migration files or connector code as literals.** `SUPABASE_SERVICE_ROLE_KEY`, ERP API credentials, etc. stay in env vars / Secret Manager per the existing `Provision-DwsIqSecrets.ps1` pattern (`docs/CLOUD_ENVIRONMENTS.md` §4.5) — this applies equally to any new sovereign-hosted database's credentials.
4. **Validate at the boundary.** New connector endpoints that accept external data (ERP webhooks, ESG feeds) go through Zod validation before touching the DB layer, per `DWS_SECURITY_STANDARD.md` §15.2.
5. **Audit trail.** Anything touching Article 12 / audit-log tables (`038_article12_audit_log.sql`, `071_command_audit_log.sql`) must preserve immutability — no `UPDATE`/`DELETE` migrations against those tables; append-only per the existing `036_grok_audit_immutability_DEPRECATED.sql` lesson (deprecated because the _feature_ was retired, not because immutability was wrong — don't repeat the mutable-audit-log mistake in new tables).
6. **Quarterly advisor sweep.** Run `mcp__Supabase__get_advisors` (security + performance) as part of the same quarterly review cadence as Pillars 1–2, so sovereignty, cloud-fit, and security review happen in one sitting instead of three separate untracked habits.

---

## 6. Pillar 5 — Agentic Commerce Data

**Objective:** Payment and checkout data generated by agent-initiated commerce (cart, checkout, subscription agents; ACP/AP2-style protocols per `docs/architecture/AGENTIC_COMMERCE_REFERENCE.md`) gets the same sovereignty and RLS treatment as any other customer data — plus the card-data-specific rule that we never store what Stripe already tokenizes.

**Current state:**

| Table / component        | Location                                                                 | Contains                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_events`         | `supabase/migrations/008_payment_integration.sql`                        | Stripe event mirror (invoice, charge, subscription lifecycle) — references only, no raw card data                                                                                     |
| `subscription_plans`     | `supabase/migrations/008_payment_integration.sql`                        | Plan/pricing metadata, sourced from `dws10.com/config/products.json` (single pricing source per this repo's Store/Product Pricing rule)                                               |
| Stripe webhook connector | `src/routes/stripe-webhook.routes.ts`, `docs/CLOUD_ENVIRONMENTS.md` §4.5 | HMAC-verified event ingestion → writes into `payment_events`; `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in Secret Manager, never in the DB                                          |
| Stripe MCP tools         | `mcp__Stripe__*` (this session)                                          | Read/query Stripe resources directly; not a substitute for the DB mirror — Stripe remains system of record for card data, our DB remains system of record for order/entitlement state |

**Actions:**

1. **Card data never enters our database.** Stripe (PCI Level 1) holds card tokens; our tables store only Stripe object IDs, amounts, and status. Any new agentic-commerce table follows this split — if a migration ever adds a raw PAN/CVV column, that is a Rule-1-violating design error, not a style choice.
2. **Agent-initiated purchases carry an audit trail.** When an autonomous agent (not a human clicking checkout) triggers a charge or subscription change, the originating agent/session ID must be recorded alongside the `payment_events` row it produced — reuse the `command_audit_log` pattern (`071_command_audit_log.sql`) rather than inventing a parallel log.
3. **Sovereignty applies to the mirror, not just the processor.** `payment_events`/`subscription_plans` live in the same Supabase project as everything else (Pillar 1's Tier 1 exception) — a Tier 2/Aegis customer's agentic-commerce data migrates with the rest of their tenant data, not separately.
4. **Pricing stays single-sourced.** No agentic-commerce connector or migration hardcodes a price; it reads `dws10.com/config/products.json` (synced to the `landing-pages/dws10-com/` mirror in the same commit per this repo's Dual Folder Sync rule).

---

## 7. Pillar 6 — KYA (Know Your Agent) Data

**Objective:** Identity-binding and trust-score data that gates agent actions (the KYA system — `.claude/commands/kya.md`, `src/routes/kya-webhook.routes.ts`, TC-4 Leash Snap) is treated as sensitive-identity data, not ordinary application state — because it is, functionally, KYC data plus a security control.

**Current state:**

| Component            | Location                                                     | Contains                                                                                                           |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| KYA engine / webhook | `src/routes/kya-webhook.routes.ts`, `POST/GET /api/v1/kya/*` | Session trust score, identity binding, TC-4 Leash Snap (chain termination) triggers                                |
| Identity provider    | Shufti Pro (KYC/identity verification)                       | `DPA_LIFETIME_SHUFTI_v1.1`, `DPA_ADDENDUM_SHUFTI_EU_ONLY_2026_v1.5` — EU-only processing addendum already in force |
| Audit trail          | `071_command_audit_log.sql`, `048_memory_audit_log.sql`      | Append-only record of agent actions correlated to a session/trust-score snapshot                                   |
| Forensic dumps       | Per `docs/KYA_BYO_LIFECYCLE.md`                              | Generated on a Leash Snap; retention policy defined there, not in this DB layer                                    |

**Actions:**

1. **KYA identity data inherits the strictest residency requirement in the stack.** Shufti Pro's own sub-processor list carries flagged entities (`DWS_SECURITY_STANDARD.md` §1604–1609: TeleSign, Twilio/SendGrid elevated-risk sub-processors) — any DWS-side table storing trust scores or identity-binding results must stay EU-only per the existing `DPA_ADDENDUM_SHUFTI_EU_ONLY_2026_v1.5` addendum, independent of which provider (Supabase/Aiven/Tier-2-sovereign) hosts it.
2. **Trust-score/identity tables get RLS + append-only audit, same as Article 12 tables.** Follow the same "no `UPDATE`/`DELETE` on audit rows" rule from Pillar 4 — a trust score's _history_ is itself an audit artifact (it's what a TC-4 Leash Snap investigation reconstructs from).
3. **KYA mutation stays gated the same way migrations do.** `kya snap` is already documented as a DESTRUCTIVE, human-confirmed action (`Admin/SECURITY_COMPLIANCE.md`, `.claude/commands/kya.md`) — this plan doesn't add a new gate, it notes that the pattern (dry-run first, confirm session ID, audit-logged) is the template for any other destructive database-adjacent action this plan introduces (e.g. a future Tier 2 migration cutover).
4. **Don't let KYA data sprawl into a new bespoke store.** If trust-score/identity data grows beyond what fits in the existing audit-log tables, extend those tables/add a companion migration in the same Supabase project — don't stand up a separate "identity database" without a concrete driver (Rule 2, simplicity first).

---

## 8. Phased Roadmap

| Phase     | Timing                                                                          | Deliverable                                                                                                                                                                             | Zone                                              |
| --------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Now**   | This session                                                                    | This plan document; audit table in §1 committed                                                                                                                                         | Green (doc only)                                  |
| **Next**  | Before next Tier 2 customer signs                                               | Pick and document the specific EU-sovereign managed-Postgres provider for Tier 2 (Scaleway vs UpCloud vs self-hosted-on-Hetzner), write the migration runbook (not execute it)          | Green (planning + migration _files_)              |
| **Next**  | Same window                                                                     | Register the quarterly sovereignty + cloud-fit + security-advisor review as a single cron-tracked item (Script Automation Rule) — do not rely on this document being reread from memory | Yellow (cron registration)                        |
| **Later** | On first non-CLOUD-Act customer requirement, or Aiven/Supabase ownership change | Execute the Tier 2 migration runbook — human-applied, per RED zone gate                                                                                                                 | Red (human required)                              |
| **Later** | When a concrete edge-latency use case exists                                    | Provision Cloudflare D1/Hyperdrive for that specific read path only                                                                                                                     | Green→Yellow (provisioning is MCP, not migration) |

---

## 9. Cross-References

- `DWS_SECURITY_STANDARD.md` §17.5 — Infrastructure Sovereignty Rule (canonical CLOUD Act policy)
- `DWS_SECURITY_STANDARD.md` §1604-1609 — Shufti Pro sub-processor risk register (Pillar 6)
- `docs/CLOUD_ENVIRONMENTS.md` §3.2.1, §9 — deployment tier choice, data residency & sovereignty
- `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md` — day-to-day Supabase operations, RLS, migration mechanics
- `Admin/ADMIN_MANUAL_AUDIT.md` — audit-trail inventory for external auditors
- `.claude/commands/sovereignty-assess.md`, `.claude/commands/sovereignty-pillars-assess.md` — scoring tools for this plan's quarterly review
- `src/integrations/erp/base-connector.ts` — canonical connector pattern for Pillar 3
- `docs/architecture/AGENTIC_COMMERCE_REFERENCE.md` — agentic commerce reference architecture (Pillar 5)
- `.claude/commands/kya.md`, `docs/KYA_BYO_LIFECYCLE.md`, `DPA_ADDENDUM_SHUFTI_EU_ONLY_2026_v1.5` — KYA operational + legal basis (Pillar 6)
