# TED construction leads pack — Grok 2026-09-18 (partial)

## VERSION AND AGENT HISTORY

***

Version: 1.3
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: Copilot review: mapped compliance default; all-industry seed cap 25; TED notice links; seed-queue kept; CPV 45 row marked historical.

Version: 1.2
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Machine API for sales-outreach TED without Google/Grok login: GET /api/v1/construction-leads/ted-live (X-Admin-Key) and npm run ted:sales-queue (public TED). Mission Control requireHicAuth stays.

Version: 1.1
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] HIC — import automatically; sales-outreach covers all 25 industries. TED daily query uses industry-cpv.json (not CPV 45 only). Grok project https://grok.com/project/5e85a398-76db-4714-9117-e0945d357441 is private (same 401/empty shell as the chat). Mission Control Sales centre auto-loads construction_leads for authenticated HIC. No Grok-login scrape; no MC auth bypass.

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Captured HIC GLASS paste of Grok TED construction-leads brief; grok.com thread not readable without xAI login; mapped onto existing DWS construction-leads pipeline. No invented tenders.

***

**Status:** PARTIAL_CAPTURE + AUTO_IMPORT — `PENDING_REVIEW`
**Audience:** Internal — sales-outreach / construction TED (PRIVATE)
**Language:** English
**Source chat:** [grok.com/chat/bc915922-3ccb-4e2e-85d9-d1fd28b5f32f](https://grok.com/chat/bc915922-3ccb-4e2e-85d9-d1fd28b5f32f)
**Grok project:** [grok.com/project/5e85a398-76db-4714-9117-e0945d357441](https://grok.com/project/5e85a398-76db-4714-9117-e0945d357441?tab=conversations)
**HIC paste:** Cursor Cloud GLASS, 2026-09-18T00:53:41Z (run `bc-01a09dae-c4ec-7cd5-a66e-f6ae9071a455`)

This file is **not** a send list and **not** Mission Control ingest. It is the sales-outreach TED brief HIC pointed at.

## 1. Completeness (fail loud)

| Claim                            | Evidence                                                                                                                                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full Grok thread is in this repo | **False.** `GET https://grok.com/rest/app-chat/conversations/bc915922-3ccb-4e2e-85d9-d1fd28b5f32f` returned **401** (`No credentials presented`). Public HTML is the Grok shell (title “Grok”), not the messages. |
| HIC paste is complete            | **False.** Stored body is **931 characters**, starts with a dropped leading `s` (`ales-outreach`), ends mid-bullet at `44 (materials / struc ...`.                                                                |
| This pack invents live tenders   | **Forbidden.** No notice IDs, buyers, or company names were added.                                                                                                                                                |

To finish the pack: while signed into Grok as `risto.paarni@lifetime.fi` (Proton / xAI — not Workspace `risto.paarni2024@lifetime.fi`), export the remainder of [that chat](https://grok.com/chat/bc915922-3ccb-4e2e-85d9-d1fd28b5f32f) and paste it into §3 or a v1.1 of this file.

## 2. As received (verbatim)

Mobile/GLASS stored the heading without the first letter. Restored heading in brackets; body otherwise unchanged.

```
[s]ales-outreach is ready
======================

New European construction leads

Here are the most usable ways to get construction leads tied to European construction companies—meaning public tenders they bid on, frameworks they sit on, and supplier/subcontractor opportunities into the majors.

1. Best official source: EU public construction tenders (TED)
-------------------------------------------------------------

Construction is the largest sector on TED (Tenders Electronic Daily) — the official EU journal for above-threshold public contracts.

-   Site: ted.europa.eu
-   Search CPV division 45 (construction work). Useful splits:
    -   `45100000` site prep / demolition
    -   `45200000` buildings and civil works
    -   `45210000` building construction
    -   `45230000` roads, pipelines, power/comms
    -   `45300000` installations (MEP)
    -   Also 71 (architecture / engineering) and 44 (materials / struc ...
```

## 3. Remainder of Grok thread

**Not captured.** Do not reconstruct numbered sections 2+ (national portals, award notices, commercial aggregators, outreach scripts) as if they came from Grok.

## 4. Official CPV names for codes Grok already listed

Grok used 8-digit CPV **without** check digits. Names below are the EU Common Procurement Vocabulary, not Grok prose. The truncated last bullet is completed **only** as official division titles for 71 and 44.

| Grok token               | Official CPV (check digit shown) | Official title                                                                                                        |
| ------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| division 45 / `45000000` | `45000000-7`                     | Construction work                                                                                                     |
| `45100000`               | `45100000-8`                     | Site preparation work                                                                                                 |
| `45200000`               | `45200000-9`                     | Works for complete or part construction and civil engineering work                                                    |
| `45210000`               | `45210000-2`                     | Building construction work                                                                                            |
| `45230000`               | `45230000-8`                     | Construction work for pipelines, communication and power lines, for highways, roads, airfields and railways; flatwork |
| `45300000`               | `45300000-0`                     | Building installation work                                                                                            |
| 71                       | `71000000-8`                     | Architectural, construction, engineering and inspection services                                                      |
| 44                       | `44000000-0`                     | Construction structures and materials; auxiliary products to construction (except electric apparatus)                 |

Grok’s gloss “site prep / demolition” for `45100000` is informal: official heading is site preparation (demolition sits under that division’s sub-codes). “Installations (MEP)” for `45300000` is informal: official heading is building installation work.

## 5. DWS mapping — already wired (do not re-build)

Grok’s “best official source = TED, CPV 45” is the production construction-leads pipeline.

| Grok advice (captured)           | DWS implementation                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TED at ted.europa.eu             | `src/construction-leads/ted-api.ts` (`TED_API_BASE` v3.0 notices search); `scripts/fetch_tenders.py`; daily `scripts/daily/construction-leads.sh` |
| CPV division 45 (Grok brief)     | Historical. Current `DEFAULT_QUERY_CONFIG.cpvCodes` is `TED_SEARCH_CPV_CODES` (all 25 industries). Construction 45 remains one parent among them. |
| Building construction `45210000` | Priority prefixes `45210`, `45211`, `45213` in `lead-processor.ts`                                                                                |
| Roads / pipelines `45230000`     | Priority prefix `45230`                                                                                                                           |
| Installations `45300000`         | Priority prefixes `45310`, `45320`, `45330`                                                                                                       |
| Nordic + EU majors               | Default countries FI, SE, NO, DK, DE, AT, EE, LV, LT                                                                                              |
| Daily run                        | DGX cron Mon–Sat; GitHub Actions `construction-leads.yml` is **workflow_dispatch failover only** (schedule removed 2026-04-08)                    |
| Ontology / DM workflow           | `docs/field-notes/2026-03-21-ted-eprocurement-ontology-lead-sourcing.md`                                                                          |
| Agent                            | `sales-outreach` in `AGENTS.md` / `src/agents/sales-outreach.agent.ts` — drafts only, HIC review before send                                      |

Sources registered but **not** auto-fetched: DTAD, Building Radar, Mercell, GlobalTenders, Tendersinfo in `src/construction-leads/lead-sources.ts`. If the unread Grok remainder names those, map them here in v1.1 — do not treat “planned” as live.

## 6. What not to do with this file

- Do not paste it into Mission Control as an automatic queue item unless HIC asks (MC v1 is paste-only; Grok/X is not synced).
- Do not send outreach from this pack; there are no contacts.
- Do not claim “sales-outreach is ready” as a product ship — that was Grok’s heading on a lead-source brief.
- Do not mix xAI login `risto.paarni@lifetime.fi` with dashboard login `risto.paarni2024@lifetime.fi`.

## 7. Automatic import (HIC 2026-09-18)

HIC: **tuodaan automaattisesti** — do not wait for Grok paste. Public TED API is anonymous; grok.com chats/projects are not.

| Path                  | Behaviour                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Daily TED fetch       | `DEFAULT_QUERY_CONFIG` ORs parent CPV codes for all 25 industries; `worksOnly` is off so services/supplies (healthcare, finance, data centres) are included              |
| Sales-outreach agent  | Seed list is one public EU company per industry; “all 25 industries” picks diverse industries                                                                            |
| Mission Control Sales | Authenticated HIC auto-loads `construction_leads` (status=new). Grok/X paste stays optional. **Google login is not bypassed on the page.** |
| Machine API (no Google) | `GET /api/v1/construction-leads/ted-live` with `X-Admin-Key`. Live TED → same Sales JSON as MC. `GET /sales-queue?source=stored` reads `construction_leads`. `POST /fetch` still ingests. CLI with no keys: `npm run ted:sales-queue` |
| Grok project          | [Conversations tab](https://grok.com/project/5e85a398-76db-4714-9117-e0945d357441?tab=conversations) — REST 404/unauthenticated; Cursor will not scrape xAI with secrets |

## 8. API path — bypass Google/Grok login, not MC auth

HIC: **find api way bypass login in mission-control sales outreach**.

What this is: TED is anonymous. Sales-outreach can load leads without opening `/dashboard/mission-control/` and without a Grok session.

What this is not: an unauthenticated Mission Control page. `requireHicAuth` still gates the dashboard.

```bash
# CLI — no login, no ADMIN_API_KEY (public TED)
npm run ted:sales-queue

# Backend — ADMIN_API_KEY only (not Google JWT)
curl -sS -H "X-Admin-Key: $ADMIN_API_KEY" \
  "https://dws6.com/api/v1/construction-leads/ted-live?limit=25"

curl -sS -H "X-Admin-Key: $ADMIN_API_KEY" \
  "https://dws6.com/api/v1/construction-leads/sales-queue?source=stored&limit=25"
```

## Footer

***

**Document version:** v1.3 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
