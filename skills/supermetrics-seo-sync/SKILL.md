---
name: supermetrics-seo-sync
description: "Pull real Google Search Console + GA4 data via the Supermetrics MCP connector and feed it into the keyword-intent and lead-feedback SEO sales agents, closing the P0 instrumentation gap in docs/SEO_SALES_AGENT_SPECIFICATION.md."
argument-hint: "site (dws10.com|dws6.com|onelifetime.world), optional date range"
allowed-tools:
  [
    Bash,
    mcp__Supermetrics_Marketing_Analytics__data_source_discovery,
    mcp__Supermetrics_Marketing_Analytics__accounts_discovery,
    mcp__Supermetrics_Marketing_Analytics__field_discovery,
    mcp__Supermetrics_Marketing_Analytics__data_query,
    mcp__Supermetrics_Marketing_Analytics__get_async_query_results,
  ]
---

# Supermetrics SEO Sync — Real Analytics for the Sales Outreach Pipeline

**Domain:** SEO-to-Sales pipeline instrumentation (`docs/SEO_SALES_AGENT_SPECIFICATION.md`)
**Agents fed by this skill:** `keyword-intent` (`src/agents/seo/keyword-intent.agent.ts`), `lead-feedback` (`src/agents/seo/lead-feedback.agent.ts`)
**Transform module:** `src/integrations/supermetrics/transform.ts`
**Replaces:** bespoke Google Search Console OAuth + GA4 API + DataForSEO integrations listed in spec §4 — Supermetrics is one connector across all of them.

## Why this exists

The SEO Sales Agent Pipeline (5 agents forming keyword research → content →
audit → lead feedback, feeding the Apollo "Content & Outreach" workflow agent
and `sales-outreach.agent.ts`) has always required real Search Console and
GA4 data as input. Spec phase **P0: Instrument** (§6) was never completed —
`keyword-intent` and `lead-feedback` exist and work, but nobody has fed them
live data. Supermetrics is already connected as an MCP server in this
environment and covers Search Console, GA4, and 150+ other sources with one
auth flow, so it closes P0 without building three separate OAuth
integrations.

## Procedure

1. **Discover sources.** Call `data_source_discovery()`. Find the Google
   Search Console and Google Analytics 4 entries; note their `ds_id`s and
   auth status. If a source shows as unauthenticated, share the login link
   from `data_source_discovery(ds_id=X)` with the user and stop — do not
   guess credentials.
2. **Discover accounts.** For each `ds_id`, call `accounts_discovery(ds_id=X)`
   to get the account/property ID for the target site (`dws10.com`,
   `dws6.com`, or `onelifetime.world` — ask which if not specified).
3. **Discover fields.** Call `field_discovery(ds_id=X)` for each source.
   Map the returned field IDs to these human-readable keys — **never
   hardcode a field ID**, always resolve it from this call:
   - Search Console → `query`, `clicks`, `impressions`, `ctr`, `position`
   - GA4 → `url` (landing page / page path), `organicSessions` (sessions,
     organic-channel filtered if the source supports it), `conversions`,
     `avgTimeOnPage`, `bounceRate`
4. **Query.** Call `data_query(ds_id=X, ds_accounts=..., fields=[...],
settings={report_type, date_range_type / start_date+end_date, ...})` per
   source, using only field IDs and setting keys returned above. Poll
   `get_async_query_results(schedule_id=...)` if the query returns async.
5. **Normalize.** Reshape each source's rows into the raw shapes the
   transform module expects, then call it — this is deterministic code, not
   a judgment call, so do not have the LLM compute these numbers by hand:

   ```ts
   import {
     toSearchConsoleQueries,
     toContentPerformance,
     DWS_SEO_ICP_PROFILE,
   } from "../../src/integrations/supermetrics/transform.js";

   const queries = toSearchConsoleQueries(searchConsoleRows);
   const contentPerformance = toContentPerformance(ga4Rows);
   ```

6. **Run the agents.** Prefer the CLI (works against the running backend):

   ```bash
   cd cli && npx tsx src/cli.ts run keyword-intent --input '{
     "searchConsoleData": { "queries": <queries>, "dateRange": {"start":"...","end":"..."}, "siteUrl": "https://dws10.com" },
     "icpProfile": <DWS_SEO_ICP_PROFILE>
   }'
   ```

   `lead-feedback` additionally needs `closedWonDeals` and `currentKeywords`
   from the CRM/Supabase side (not from Supermetrics) — only run it when
   that data is available; `contentPerformance` from step 5 fills its third
   input.

7. **Report.** Summarize: quick-win keywords found, funnel distribution,
   any content flagged `boost`/`retire`, and any Search Console/GA4 sources
   that still need authentication. Surface partial results explicitly if a
   source was skipped (fail loud — do not present a partial sync as
   complete).

## When to use

- Before running `/workflow seo-pipeline` — it needs `keyword-intent`'s real
  output as its first step's input.
- Monthly, ahead of the `lead-feedback` agent's scheduled run
  (`SEO_PIPELINE_SCHEDULE['lead-feedback']` = 1st of month, 06:00 UTC per
  `src/agents/seo/types.ts`), to refresh `contentPerformance`.
- Whenever someone asks "what are people actually searching for that finds
  DWS" or "which of our pages convert" — answer from Supermetrics data, not
  from memory.

## Latent vs Deterministic

| Step                                                    | Where                                        | Kind                                     |
| ------------------------------------------------------- | -------------------------------------------- | ---------------------------------------- |
| Source/account/field discovery                          | Supermetrics MCP tools                       | Deterministic (API lookup)               |
| Field-ID → human-readable key mapping                   | This skill (per-run, since IDs vary)         | Judgment (one-time per source, cheap)    |
| Row merge/type-coercion/rate calculation                | `src/integrations/supermetrics/transform.ts` | Deterministic — do not re-derive by hand |
| Funnel classification, ICP scoring, quick-win detection | `keyword-intent.agent.ts`                    | Deterministic (regex + arithmetic)       |
| Content recommendation narrative                        | `lead-feedback.agent.ts` / LLM               | Latent                                   |

## Non-Negotiables

- Never invent a Supermetrics field ID or setting key — always resolve via
  `field_discovery`.
- Never fabricate query/session/conversion numbers if a source is
  unauthenticated or a query fails — report the gap instead of estimating.
- This skill only reads marketing/analytics data; it does not write to ad
  accounts or CRM records.
