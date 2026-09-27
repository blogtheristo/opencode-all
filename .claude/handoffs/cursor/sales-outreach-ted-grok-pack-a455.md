# Handoff — cursor/sales-outreach-ted-grok-pack-a455

**Branch:** `cursor/sales-outreach-ted-grok-pack-a455`
**Task:** TED auto-import for sales-outreach across all 25 industries (Grok chats stay private)
**State:** READY-FOR-REVIEW
**PR:** https://github.com/blogtheristo/dws6/pull/2038
**Date:** 2026-09-18

---

## VERSION AND AGENT HISTORY

***

Version: 1.3
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: Copilot review: mapped filter, 25 seeds, TED links, keep seed-queue. No RLS migration.

Version: 1.2
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Admin-key TED live sales-queue API + ted:sales-queue CLI. requireHicAuth stays.

Version: 1.1
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Auto-import via public TED API; all 25 industries; Grok project private. HIC marked PR ready for review.

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Partial TED pack + field note from Grok chat URL

***

---

## Task

HIC: import automatically; sales-outreach holds leads from all industries. Grok project https://grok.com/project/5e85a398-76db-4714-9117-e0945d357441?tab=conversations is private (same as the chat).

## State

- **What's done:** `industry-cpv.json` maps CPV → industries 1–25; TED default query uses those parents, `worksOnly` off; sales-outreach seed = one public EU company per industry; MC Sales auto-loads `construction_leads` for authenticated HIC (dual-folder). Machine API: GET `/api/v1/construction-leads/ted-live` (X-Admin-Key) and `npm run ted:sales-queue`. No Grok scrape. No unauthenticated MC page.
- **What's blocked:** grok.com REST without xAI session (401/404). Vitest not installed in this cloud image.

## Next steps

1. Keep requireHicAuth on Mission Control. Use ted-live / ted:sales-queue for machine access.
2. DGX daily cron picks up the new CPV list on next run.
3. Optional: HIC paste unread Grok remainder while logged in as `risto.paarni@lifetime.fi`.

## Notes for next session

TED API is anonymous — that is the “bypass Google/Grok login” path for sales-outreach JSON. `requireHicAuth` on Mission Control stays. Endpoints: GET /api/v1/construction-leads/ted-live and GET /sales-queue.

***

**Document version:** v1.3 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
