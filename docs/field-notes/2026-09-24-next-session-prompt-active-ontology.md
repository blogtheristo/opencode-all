# Next session prompt — after #2059/#2091 merge

Status: READY (supersedes the earlier version of this file — those PRs are now merged)
Date: 2026-09-24
Branch to start from: fresh branch off `origin/main` (do not resume `claude/loving-einstein-fkjj4b` — it's closed, see its handoff)

Paste to start the next session:

```
Start a new branch off origin/main (name it claude/<feature>-<id>). Read .claude/handoffs/claude/loving-einstein-fkjj4b.md first — it's CLOSED but lists what shipped and what's still open. Then read docs/market-signals/2026-09-24-boardy-kuka-omistaa-ongelman.md (LD-007, ownership stage) and docs/proposals/2026-09-24-lifetime-fi-tulossivu-ehdotus.md §15.

Before touching Active Ontology: re-read dws10.com/config/active-ontology.json _meta.version and diff commits ec584b4, and PRs #2094/#2095 on main — they shipped after this handoff (event-first decision_journey, Independent Ontology product page, ontology pilot terms, catalogue 1.31/1.32) and may have already done some of what's listed as "open" below.

Rules: dws10.com hero and positioning are frozen unless the HIC explicitly says otherwise. Never merge on red CI. Migrations are files only; applying them is RED (human only). Blog text needs the HIC's full-text approval before publish (Rule 13) — use /blog-draft.

Do in order, skipping anything #2092–#2095 already covered:
1. Ask the HIC: were Pages env vars SUPABASE_URL/SUPABASE_SERVICE_KEY set on dws10-com, and were migrations 089–091 applied? If yes, verify one real observation is stored and GET /api/observations/summary?industry=chemicals returns available:true. If no, that's still the top blocker — flag it.
2. Chapter 14 CLASSIFY: check whether ownership_known/owner_roles/verdict already exist in the market-signal schema and pipeline view (src/agents/workflow-v2/) post-#2092. If not, add them with tests.
3. Draft Journal series 0 text 2, "Kaikki tietävät ongelman, kukaan ei omista sitä" (worldview, not technology), to docs/blog-drafts/. Show the HIC the full text in one block and stop.
4. Check whether the product family question (Discover/Understand/Decide/Execute/Learn, "Ownership Evidence" SKU) was resolved by the Independent Ontology product line (#2094/#2095). If not, propose it as a one-page memo using dws10.com/config/products.json pricing. No new prices without the HIC's decision.

Report in HIC format: Decisions / Facts used / HIC actions.
```
