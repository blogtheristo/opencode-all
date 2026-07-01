---
name: regulatory-radar
description: Scans EU regulatory pipeline (EUR-Lex, DG ENER, Commission work programme, EFRAG, CINEA) and scores upcoming regulations per customer. Use when user says "regulatory radar", "what's coming from EU", "regulation pipeline", "Delegated Act tracking", "score this customer against next regulation", "what should we warn [customer] about", or asks about EED/CSRD/CBAM/EU AI Act upcoming changes.
---

Run the DWS IQ Regulatory Radar — a pipeline scanner that scores forthcoming EU regulatory changes against a specific customer's profile (industry, IT load, jurisdictions, existing regulations in scope).

Purpose: turn the EU regulatory pipeline from noise into a scored early-warning system. One-line output per relevant instrument: what it is, when it bites, what the customer must do.

Input: $ARGUMENTS (customer profile as JSON — or describe in natural language and I'll build the JSON)

## Steps

1. Parse the input — if natural language, convert to the Regulatory Radar expected format.
2. **Execution status (live, scoped):** run against the already-active regulations
   (`fit-for-55`, `ets`, `cbam`, `csrd`, `eu-ai-act`) via the existing compliance
   agent: `cd cli && npx tsx src/cli.ts run compliance --input '<json>'` with
   `regulations` set to all five, regardless of the customer's stated
   `activeFrameworks` — the point is to surface what's coming, not just what
   they've already registered for.
3. From the response, take `result.deadlines` (already sorted by urgency
   bucket: `overdue` / `urgent` ≤90d / `approaching` ≤365d / `comfortable`) and
   `result.industryRiskFactor`. Filter to `lookAheadMonths` from the input.
   Flag any item with `urgency` in `overdue` or `urgent` (≤90 days) as **ALERT**;
   treat `approaching` (≤365 days) as a watch item.
4. **Scope note:** this covers deadline-urgency scoring for the five regulations
   already wired into `compliance.agent.ts`. It does **not** yet do live
   EUR-Lex / DG ENER / EFRAG / CINEA pipeline scanning for _new, not-yet-known_
   instruments — that ingestion layer (§ Data freshness below) is still
   unbuilt. If the ask is "is there a Delegated Act about to drop that we don't
   already track," say so explicitly rather than presenting this as exhaustive.
5. **Datacentre-compliance vertical:** the EED-specific radar feature described
   in PRD v0.2 (24-KPI submission tracking, `docs/DWS7_DATACENTRE_COMPLIANCE_PRD_v0.md`)
   remains gated behind Gate 1 (3 signed design-partner letters, target 1 Oct 2026) — this general wrapper does not unblock that vertical-specific build.
6. The output is a radar-style report sorted by urgency, citing the deadline
   source (`compliance.agent.ts` regulation deadline table) — not yet a signed
   Article-12 PDF; that packaging can reuse the Firehorse Report Engine when
   there's demand for it.

## Expected input format

```json
{
  "customerId": "colo-nordic-001",
  "industry": "datacentre",
  "jurisdictions": ["FI", "SE"],
  "size": {
    "itLoadMW": 2.5,
    "siteCount": 2,
    "employeeCount": 18
  },
  "activeFrameworks": ["EED", "CSRD"],
  "watchlist": ["EU AI Act", "CBAM", "RED III"],
  "lookAheadMonths": 24
}
```

## Expected output structure

```json
{
  "customerId": "colo-nordic-001",
  "scanDate": "2026-04-18",
  "alerts": [
    {
      "instrument": "Delegated Reg. (EU) 2024/1364",
      "status": "in-force",
      "nextDeadline": "2027-05-15",
      "urgencyMonths": 12,
      "applicability": "direct",
      "risk": "high",
      "effort": "medium",
      "summary": "24-KPI EED submission to European database",
      "source": "https://eur-lex.europa.eu/eli/reg_del/2024/1364/oj/eng",
      "customerAction": "Generate Annex I+II report via DWS datacentre-compliance agent"
    }
  ],
  "watchItems": [],
  "signedReportPath": "reports/regulatory-radar/colo-nordic-001_2026-04-18.pdf"
}
```

## Use cases (who calls this)

1. **Inside `datacentre-compliance` agent** — enriches the compliance output with forward-looking pipeline view (the "scored against next regulation" hook in PRD v0.2)
2. **Inside `compliance-check` agent** — extends CSRD/CBAM/EED/EU AI Act point-in-time check with pipeline horizon
3. **Customer account review** — monthly automated radar per enterprise customer
4. **Investor/board briefings** — "here's what's coming in the next 24 months" deck
5. **Internal DWS product planning** — prioritise which agents to build next based on regulatory urgency

## When NOT to use

- Point-in-time compliance scoring against **already-in-force** regulations → use `/compliance-check`
- Embodied carbon of materials → `/carbon-analysis`
- Site safety → `/site-safety`
- Sovereignty / data residency → `/sovereignty-assess`
- Asking what compliance standards exist today (no pipeline dimension) → `/discover-agents`

## Data freshness

- The five tracked regulation deadlines (`fit-for-55`, `ets`, `cbam`, `csrd`,
  `eu-ai-act`) live as hardcoded dates in `compliance.agent.ts`
  (`REGULATION_DEADLINES`) — accurate as of each date's last manual update in
  that file, not auto-refreshed. Check the file's own history if a deadline
  looks stale.
- EUR-Lex snapshot: **planned** daily refresh via `scripts/daily/eur-lex-sync.ts` once the regulatory-radar ingestion jobs are implemented
- DG consultation pages: **planned** weekly refresh via `scripts/weekly/dg-consultations-sync.ts` once the consultation crawler is implemented
- EFRAG / CINEA: **planned** event-driven refresh on Commission press releases
- Planned cache policy: 24 h TTL for EUR-Lex; 7 d TTL for consultation pages; invalidate on any new CELEX entry in watched regulation families

## Agent lineage

- **Brain:** thin wrapper over the existing `compliance` agent (`compliance.agent.ts`) — no new agent process; a dedicated `regulatory-radar` agent with live EUR-Lex ingestion remains future work
- **Memory:** currently just `compliance.agent.ts`'s `REGULATION_DEADLINES` table; the Lifetime World Model regulatory-pipeline ontology (EUR-Lex CELEX + in-force dates + customer-impact rules) is still future work
- **Body:** plain JSON/markdown response today; signed radar PDF via Firehorse Report Engine remains future work
- **Hands:** none yet — EUR-Lex daily scrape + DG consultation weekly scrape are still unbuilt
- **MCP tool:** not yet exposed at `/mcp tools/list`
