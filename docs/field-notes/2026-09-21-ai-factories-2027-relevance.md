# AI Factories 2027 — GTC Session Relevance + Backlog Workflow Recommendations

**Date:** 2026-09-21
**Owner:** Risto Anton Päärni, Lifetime Oy
**Status:** PENDING_REVIEW
**Trigger:** HIC-supplied GTC session list, scanned for DWS IQ relevance.

## Sessions Scanned

| ID       | Title                                                      | Relevance                                                                                                       | Track                                         |
| -------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| SB61180  | From Grid to AI: Engineering the Future of AI Factories    | High — power/compute-as-physical-substrate maps to Edge Control Room Capital thesis                             | PhD market signal                             |
| SB61141  | Behind NVIDIA Engineering's Gigawatt-Scale AI Factories    | High — architecture/deployment patterns at scale, informs DGX-first cost policy horizon                         | PhD market signal                             |
| CWEB1178 | Performance for AI Factories AMA (sizing/config/workloads) | Medium — direct input to Firehorse compute-cost policy and token-capital sizing decisions                       | Master's implementation (if we act on sizing) |
| SB61080  | AgentOps 101: MLOps Discipline for Agentic Systems         | Highest — maps directly to KYA+I runtime controls, mcp-hub agent productization, our own agent discipline rules | Master's implementation                       |
| CWEB1179 | Rearchitecting Storage for Agentic AI                      | Low — tangential to Supabase/RLS posture, no current pain point                                                 | Watch only                                    |

## Assessment

No immediate code/architecture action required. Two items (SB61080, CWEB1178) have a plausible near-term backlog path; the two AI Factories talks are 3–7 year horizon market-signal material (PhD scope), not build now.

## Backlog Workflow Recommendations

1. **Triage lane, not auto-ingest.** Conference/session lists like this should land in a single `docs/signals/` (or existing `regulatory-radar`-style) backlog file, not directly in thesis or code. One line per item: title, relevance score (High/Med/Low), target (PhD §14.x / master's / skill backlog / discard).
2. **Score before promote.** Reuse the `promote-proposal` skill pattern already in the repo (clawdbot dream cycle: proposal → HIL approval → promotion) for signals, not just code proposals. A signal only becomes a thesis edit or a backlog ticket after explicit HIC promotion — avoids speculative PhD churn.
3. **Split by scope at intake, not later.** Tag each item PhD (market signal, no sprint detail) vs. master's (implementation evidence) at the moment it's logged — matches CLAUDE.md's Thesis Content Scope Rule and prevents rework.
4. **AgentOps 101 → concrete backlog ticket.** Recommend opening a backlog item to diff SB61080's MLOps-for-agentic-systems discipline against our existing 12 Engineering Discipline rules + KYA+I controls — gap analysis, not blind adoption.
5. **Sizing AMA (CWEB1178) → attach to cost policy review.** File as input to the next `DWS_COST_POLICY_STANDARD.md` review cycle rather than a standalone task.
6. **Storage talk → parking lot.** Log and drop; revisit only if Supabase/RLS scaling becomes an active pain point.

## HIC Decision Needed

~~Promote SB61080 (AgentOps 101) to a backlog ticket for gap analysis against our discipline rules — yes/no?~~ **DECIDED 2026-09-21: YES.** Promoted to [Issue #2058](https://github.com/blogtheristo/dws6/issues/2058).

## Outreach Log

- **2026-09-21** — Sent session/demo proposal to Charlie Boyle: "Governed AI Factories: MGD-Native Agent Operations for Gigawatt-Scale Infrastructure," referencing SB61180, SB61141, CWEB1178, SB61080, CWEB1179. Content offered: KYA+I runtime trust/verification demo, MGD as north-star metric for agent fleets, Edge Control Room Capital case data. Sent from `risto.paarni@lifetime.fi` (Proton, per Sender Identity Rule).
- **Follow-up calendared:** 2026-10-05 09:00 Europe/Helsinki (2 weeks out) — check for reply, nudge if none.

Status: PENDING_REVIEW — awaiting Charlie Boyle reply; follow-up scheduled 2026-10-05.
