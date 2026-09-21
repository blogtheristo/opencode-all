---
Status: DECIDED
---

# GITEX AI Türkiye × Google Cloud — 3 goals, mapped to DWS IQ

## Source

LinkedIn post (Google Cloud, GITEX AI Türkiye, ~3 days old at capture):

> "At GITEX AI Türkiye, Google Cloud joined customers, partners and industry
> leaders to explore how AI can support better decisions, simplify complex
> workflows and create new opportunities across industries."

Three stated goals, verbatim from the post's own framing:

1. **Support better decisions**
2. **Simplify complex workflows**
3. **Create new opportunities across industries**

**HIC-reframed goal set (2026-09-21) — for DWS IQ's own outbound use, goal 3
is sharpened from the post's generic "opportunities across industries" to a
sales-outcome claim:**

1. Better decisions
2. Simplify complex workflows
3. **Create new sales**

## Mapping to DWS IQ

| DWS IQ goal (HIC-reframed) | DWS IQ equivalent already built or in flight                                                                                                                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Better decisions           | This is the DWS north-star metric itself — Monthly Governed Decisions (MGD), see `scripts/compute-mgd.mjs` / `/mgd-report`. Direct language match: "AI can support better decisions" is the MGD thesis in one sentence.                                                                                                                    |
| Simplify complex workflows | Workflow v2 (Procedural Graphs, `src/agents/workflow-v2/`, PR #2059) + the multi-agent DAG orchestrator (`/workflow` skill) — both exist specifically to take long, complex, multi-step work and make it explicit and reliable instead of ad hoc.                                                                                          |
| Create new sales           | Demand/revenue engine work: outbound, enrichment, targeting, attribution (`/investor-outreach`, `sales-outreach/`, `SALES_FUNNEL_WORKFLOW*.md`, `email` skill). Reframes Google Cloud's generic "new opportunities across industries" into DWS IQ's own north-star for the sales-led motion — outcome-specific, not just industry-breadth. |

## Why this is worth a field note

Google Cloud is running the identical "decisions / workflows / opportunities"
framing as DWS IQ's own MGD + CRC north-star and Workflow v2 pitch, at a
flagship regional event (GITEX AI Türkiye). That's an external, hyperscaler-level
validation signal of the positioning already chosen — not a new direction, a
confirmation of the current one.

## Decisions

- HIC adopted the 3-goal frame for DWS IQ's own outbound use, with goal 3
  reframed from the post's generic "opportunities across industries" to
  **"create new sales"** — an explicit revenue-engine claim, not a breadth claim.
- This 3-line frame (better decisions / simplify complex workflows / create
  new sales) is now ready-made copy for investor and sales-led outreach.

## Facts used

- Source: LinkedIn post screenshot, GITEX AI Türkiye / Google Cloud, captured 2026-09-21.
- HIC decision, 2026-09-21 (this session): goal 3 reframed to "create new sales."
- `docs/system-config/` MGD metric definition (referenced via `/mgd-report` skill).
- PR #2059 (Workflow v2 — this session, same branch).

## HIC action

None required — decision made. Next use of this frame (investor deck, sales
outreach copy) is a normal content task whenever HIC wants to draft it.
