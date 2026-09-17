# Field Note: Electe's "New Taxonomy of Programming Labour" — read against DWS's own role lists

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Competitive & Market Signal
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-09
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/sarkain-oy-vendor-gddyf0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Date: 09.07.2026 | Changes: Initial field note. Founder shared a 3-box infographic from Electe (electe.net) titled "A New Taxonomy of Programming Labour" and asked for it to be studied. Analyzed the taxonomy, traced its source, and mapped it against DWS's own builder-side role list (ORK/1462/2026 alihankkijakutsu) and buyer-side registry (`DWS_ROLES_REGISTRY.md`).

Document Status:

- Created: 09.07.2026
- Last Modified: 09.07.2026
- Language: English
- Publication Status: ACTIVE

Related Documents:

- `bids/ORK160826/ORK160826_ALIHANKKIJAKUTSU.md` / `ORK160826_ALIHANKKIJA_EN.md` — DWS's own current builder-side role list for an active tender
- `DWS_ROLES_REGISTRY.md` — canonical buyer-side 25-role registry (different axis, not competing with this taxonomy)
- `DWS_SECURITY_STANDARD.md`, `Legal/KYA_STANDARD_v1.md` — where DWS's "regulatory engineering" work actually lives today

---

## The Source

Founder shared a single infographic (no accompanying article located) attributed to **Electe** (electe.net) — an AI analytics platform for growing companies (automated competitor monitoring, financial forecasting, "human-in-the-loop AI analytics"). Not an EU industrial-compliance company; not a direct DWS competitor. WebFetch to electe.net returned 403 in this session (egress policy, not the site) — could not locate the source post/article via WebSearch either, so treat this as marketing content of **unverified provenance and authorship**, not a peer-reviewed or industry-adopted standard.

**The graphic — "A New Taxonomy of Programming Labour":**

| Role                | Electe's description                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| System Architect    | Focuses on overarching system design to ensure scalability, reliability, and long-term alignment |
| Data Strategist     | Brings expertise in data flow, governance, and insights to drive informed decisions              |
| Regulatory Engineer | Specializes in compliance, security, and ethical considerations to build trust and mitigate risk |

## Reading it

**What it captures:** a plausible, if generic, narrative of what's left for human programmers once AI absorbs mechanical code production — architecture judgment, data/decision strategy, and compliance-as-engineering. It's part of a broader current industry conversation ("the programmer becomes an architect/editor/governor"), not a novel insight.

**What it's thin on:** no seniority or maturity framing, no metrics, one-line boxes with no operational detail — reads as a marketing infographic, not a working framework. Notably absent for an AI-platform company: no "agent orchestration" or "AI-ops" role at all, even though that's arguably the fastest-growing new discipline in 2026.

**Mapped against what DWS actually runs:**

- `DWS_ROLES_REGISTRY.md`'s 25 roles are **buyer-side** (who DWS sells into, across 5 buying-journey stages) — a different axis entirely. Electe's taxonomy doesn't compete with or duplicate it.
- The relevant DWS comparison is the **builder-side** role list actively in use for ORK/1462/2026 (`ORK160826_ALIHANKKIJAKUTSU.md`) — 8 distinct titles across 3 lots: GenAI Solution Architect, AI Engineer, Data Engineer, DevOps Engineer, Software Developer, UI/UX Designer, AI Architect, AI Consultant/Coach. Electe's 3 boxes roughly collapse into that richer set:
  - **System Architect** ≈ GenAI Solution Architect + AI Architect
  - **Data Strategist** ≈ Data Engineer + part of AI Consultant/Coach
  - **Regulatory Engineer** ≈ no distinct DWS subcontractor title exists yet — closest is the explicit "EU AI Act compliance" clause folded into the **AI Architect** role in Lot 3 (`ORK160826_ALIHANKKIJA_EN.md`), plus the governance work that actually lives in `DWS_SECURITY_STANDARD.md` and the KYA framework rather than in a named hire.

**The signal worth keeping:** "Regulatory Engineer" as a distinct, _engineering_ (not compliance-officer) title is the interesting data point — it suggests the market is starting to name what DWS already treats as a first-class discipline (governance-by-design baked into KYA and the Security Standard, not bolted on after the fact) rather than a DWS-only framing. Worth watching whether titles like this start showing up explicitly in EU public-sector procurement role lists (e.g., a future ORK-style tender asking for "Regulatory Engineer" by name) — if so, DWS's alihankkijakutsu role tables should absorb it as its own line rather than folding it into AI Architect.

**Caveat (Truth Standard discipline):** this is one company's 3-box marketing graphic from an unverified source page, not an industry-adopted standard. Do not cite "Electe's taxonomy" externally as evidence of an industry consensus without further corroboration.

## Recommendation

No action needed now. If "Regulatory Engineer" (or an equivalent named role) starts appearing in EU public-sector RFPs, split it out as its own line the next time `DWS_ROLES_REGISTRY.md` or an alihankkijakutsu role table is revised — don't fork a new taxonomy to chase a single infographic.
