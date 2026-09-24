# Next session prompt — Active Ontology after LD-007

Status: READY
Branch: claude/loving-einstein-fkjj4b (PR #2091), sibling #2059
Date: 2026-09-24

Paste to start the next session:

```
Continue on claude/loving-einstein-fkjj4b. Read .claude/handoffs/claude/loving-einstein-fkjj4b.md first, then docs/market-signals/2026-09-24-boardy-kuka-omistaa-ongelman.md (LD-007, rounds 1–6) and docs/proposals/2026-09-24-lifetime-fi-tulossivu-ehdotus.md §15.

Rules for this session: hero and positioning on dws10.com are frozen (HIC 24.09.2026). Never merge on red. Migrations are files only; applying is RED. Blog text needs my full-text approval before publish (Rule 13).

Do in order:
1. Merge status: #2059 then #2091 per handoff. If CI is red, root-cause and fix; if it is infra, tell me which check and why.
2. After merge: ask me for Pages env vars SUPABASE_URL/SUPABASE_SERVICE_KEY on dws10-com and confirm I applied migrations 089–091; then verify one real observation is stored and /api/observations/summary?industry=chemicals returns available:true.
3. Chapter 14 CLASSIFY: add ownership_known, owner_roles and verdict to the market-signal schema and pipeline view (src/agents/workflow-v2/), with tests.
4. Draft Journal series 0 text 2, "Kaikki tietävät ongelman, kukaan ei omista sitä" (worldview, not technology), to docs/blog-drafts/ and show me the full text. Stop there.
5. Propose the product family (Discover/Understand/Decide/Execute/Learn) and the "Ownership Evidence" SKU as a one-page decision memo using the price logic in dws10.com/config/products.json. No new prices without my decision.

Report in HIC format: Decisions / Facts used / HIC actions.
```
