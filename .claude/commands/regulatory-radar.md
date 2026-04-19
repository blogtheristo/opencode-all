---
name: regulatory-radar
description: Scans EU regulatory pipeline (EUR-Lex, DG ENER, Commission work programme, EFRAG, CINEA) and scores upcoming regulations per customer. Use when user says "regulatory radar", "what's coming from EU", "regulation pipeline", "Delegated Act tracking", "score this customer against next regulation", "what should we warn [customer] about", or asks about EED/CSRD/CBAM/EU AI Act upcoming changes.
---

Run the DWS IQ Regulatory Radar — a pipeline scanner that scores forthcoming EU regulatory changes against a specific customer's profile (industry, IT load, jurisdictions, existing regulations in scope).

Purpose: turn the EU regulatory pipeline from noise into a scored early-warning system. One-line output per relevant instrument: what it is, when it bites, what the customer must do.

Input: $ARGUMENTS (customer profile as JSON — or describe in natural language and I'll build the JSON)

## Steps

1. Parse the input — if natural language, convert to the Regulatory Radar expected format.
2. **Execution status:** the dedicated `regulatory-radar` CLI agent is **not yet available**, so do **not** run `dws run regulatory-radar` or `cd cli && npx tsx src/cli.ts run regulatory-radar --input '<json>'` yet.
3. **Current workaround:** use `/compliance-check` with the same customer profile and ask for an upcoming-regulations / regulatory-pipeline review. This provides the currently available alternative until the `regulatory-radar` agent is wired into the CLI.
4. **Expected behavior once implemented:** the agent will scan these sources (in priority order):
   - **EUR-Lex** — pending Delegated Acts, Implementing Regulations, Directives (CELEX search filtered by customer's active regulation frameworks)
   - **DG ENER / DG CLIMA / DG GROW** — consultation pages, work programme entries, feedback periods
   - **Commission work programme** — annual published schedule of upcoming Acts
   - **EFRAG** — ESRS exposure drafts and sector standards
   - **CINEA** — Innovation Fund auction schedules (hydrogen, industrial decarbonisation)
   - **National scheme registries** — Energimyndigheten (SE), SEAI (IE), Germanwatch (DE) for member-state overlays
5. The review should score each pipeline item per the customer profile:
   - **Applicability:** does it hit this customer? (industry, size threshold, jurisdiction)
   - **Urgency:** months until in-force / first reporting deadline
   - **Effort:** estimated gap-to-compliance (low/medium/high)
   - **Risk:** penalty exposure + reputational exposure if missed
6. The expected output is a signed, Article-12-auditable radar report sorted by urgency × risk, with citation to the regulatory source (EUR-Lex CELEX, DG URL, Commission work-programme entry).
7. If any item scores urgency ≤6 months AND risk = high, flag it as ALERT.

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

- EUR-Lex snapshot: refreshed daily via `scripts/daily/eur-lex-sync.ts` (auto-discovered by DGX Spark day-runner)
- DG consultation pages: weekly refresh via `scripts/weekly/dg-consultations-sync.ts`
- EFRAG / CINEA: event-driven refresh on Commission press releases
- Cache TTL: 24 h for EUR-Lex; 7 d for consultation pages; invalidated on any new CELEX entry in watched regulation families

## Agent lineage

- **Brain:** `regulatory-radar` agent (new — to be built after `/datacentre-compliance` PRD Gate 1 passes)
- **Memory:** extends Lifetime World Model with regulatory-pipeline ontology (EUR-Lex CELEX + in-force dates + customer-impact rules)
- **Body:** signed radar PDF via Firehorse Report Engine
- **Hands:** EUR-Lex daily scrape + DG consultation weekly scrape
- **MCP tool:** `regulatory-radar` exposed at `/mcp tools/list`
