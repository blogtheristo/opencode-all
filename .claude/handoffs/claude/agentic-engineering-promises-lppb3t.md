# Handoff: Agentic Engineering Promises Framework

**Branch:** `claude/agentic-engineering-promises-lppb3t`  
**Date:** 2026-09-07  
**Author:** Risto Anton Päärni, Founder, CEO · Lifetime Oy  
**Status:** Research complete, ready for piloting

---

## What Was Done

**Research task:** Build a framework for evaluating agentic engineering promises against four critical questions in Finnish:

1. Paljonko se maksaa? (Cost model)
2. Kuka on pätevä? (Qualification requirements)
3. Kuka sen toteuttaa? (Implementation assignment)
4. Mikä on mitattava vaikutus? (Measurable impact)

**Deliverable:** `/docs/field-notes/2026-09-07-agentic-engineering-promise-framework.md`

**Framework components:**

- Five-layer cost model (inference, orchestration, tooling, human override, operational risk)
- Cost accountability formula + pricing strategies
- Four-tier qualification framework (Tier 1 assistant → Tier 4 core team)
- Domain certifications (EU AI Act, data handling, financial/legal, sales, technical)
- Four implementation patterns (single, sequential, feedback loop, swarm)
- RACI model adapted for agents + human oversight
- Three-layer impact measurement (customer, operational, financial)
- Measurement cadence + red flags for pausing agents
- Promise template (reusable for every commitment)
- Two case studies with full economics (KYA compliance, sales prospecting)
- Phase-gate roadmap (design → development → validation → deployment → optimization)
- Eight HIC review questions (cost alignment, qualification bar, incentives, accountability, learning, expansion)

---

## Key Findings

### Cost Economics

- Simple research agent: ~$210/query (10% override rate) → needs $300+ customer value
- Compliance research: ~$318/engagement (30% override rate) → 150% sustainable margin
- Sales prospecting swarm: ~$700/50-lead batch → 14,000% margin on $100K+ deal value

**Cost-to-value ratio:** Safe zone <20%, acceptable 20–50%, at-risk 50–80%, unsustainable >80%

### Qualification Model

- **Tier 1:** Basic TypeScript + MCP, public APIs only, human-in-loop always
- **Tier 2:** SQL + domain knowledge, customer data (read-only RLS), QA gate required
- **Tier 3:** Staff engineer + ML ops, 2+ years agentic experience, all tools allowed, exec sign-off
- **Tier 4:** Core DWS/Lifetime team, unrestricted, peer review only

### Impact Measurement

- **Customer:** Time saved, quality improvement, risk reduction, scalability, accessibility
- **Operational:** Agent reliability, cost per outcome, team velocity, learning rate, uptime
- **Financial:** Revenue influenced, churn reduction, premium upsell, risk mitigation, market expansion

### Red Flags for Pausing

- Usage drops >20% week-over-week
- Error rate >10%
- Cost exceeds 80% of customer value
- Single escalation incident reaching legal (compliance violation)

---

## Next Steps

### For OpenCode / HIC Decision

1. Review the eight HIC questions in §8 of the framework
2. Decide on pilot scope (start with KYA, sales prospecting, support classifier?)
3. Approve tier definitions and qualification requirements
4. Decide on cost-to-value pricing policy (charge customers? Internal margin?)

### For Implementation Team

1. **Week 1:** Select first three agent promises to pilot
2. **Week 2–3:** Instrument each agent with cost tracking + impact metrics
3. **Week 4:** Collect real cost/impact data, validate framework assumptions
4. **Week 5:** Document post-mortem, update framework based on learnings
5. **Week 6+:** Scale framework to all agent commitments

### For Handoff to OpenCode

- Framework file: `/docs/field-notes/2026-09-07-agentic-engineering-promise-framework.md`
- Tier template: Use §2 (Qualification Requirements)
- Promise template: Use §5 (The Promise Template)
- Case studies: Reference for cost/impact benchmarking (§6)
- Phase-gate roadmap: For planning (§7)

---

## Files Modified/Created

- ✅ **NEW:** `/docs/field-notes/2026-09-07-agentic-engineering-promise-framework.md` (784 lines)
- ✅ **NEW:** `./.claude/handoffs/claude/agentic-engineering-promises-lppb3t.md` (this file)

---

## Commits

```
39508841 docs: expand agentic engineering framework with standards & regulatory compliance (v1.1)
f80bfb03 docs: agentic engineering promise framework — four-question model for agent commitments (v1.0)
```

---

## Updates in v1.1 — Standards & Regulatory Integration

**Research:** Explore agent conducted comprehensive audit of existing frameworks + regulatory requirements.

**Deliverables:**

- ✅ §0 Standards & Regulatory Integration — Maps DWS canonical standards (TRUTH_STANDARD, AI_AGENT_GUIDELINES, KYA, AGENTS, DISCIPLINE)
- ✅ §9 Regulatory Requirements — EU AI Act (Art. 12–14/50), GDPR, NIS2, Fit for 55 with compliance checklists
- ✅ §10 Operationalization Checklist — 7 gaps identified + ROI-ranked fixes (21 days total implementation)
- ✅ KYA ATS integration — Tier 1–4 gating via Agent Trust Score (0.50–1.00 bands) from `KYA_STANDARD_v1.12.md`

**Key additions to framework:**

1. **Article 50 Risk Classification** — High-risk agent gating (requires CAB eval + post-market monitoring)
2. **Gap 1: Cost Model Validation** (3 days, HIGH ROI) — Instrument actual vs promised costs, flag >10% variance
3. **Gap 2: Tier Boundary Enforcement** (2 days, HIGH ROI) — Cross-check ATS band >= min tier requirement
4. **Gap 3: Canary Evaluation** (5 days, MEDIUM ROI) — 10% pilot traffic + 7-day red-flag monitoring
5. **Gap 5: Learning Loop Automation** (3 days, MEDIUM ROI) — Auto-generate post-mortem + KB at 90-day mark
6. **Gap 7: Rule 5 Audit Trail** (4 days, MEDIUM ROI) — Tag code as judgment/deterministic/routing, CI gate >80%
7. **NIS2 Incident Response SLA** — 48h critical, 7d high, 30d medium, 90d low with named escalation owners

**Implementation roadmap:**

- **Phase 1 (NOW):** Deploy Gap 1 + Gap 2; implement Gap 5 for pilot agents
- **Phase 2 (Oct):** Deploy Gap 3 + Gap 7; observability dashboard
- **Phase 3 (Q1 2027):** Gap 4 (cryptographic attestation when KYA v2.0 ships), Gap 6 (dependency orchestration)

---

## Questions Left for HIC

1. **Cost alignment:** Are the cost models realistic for our customer segments? Should we tier pricing differently by customer size?
2. **Qualification bar:** Is Tier 3 too high for a simple agent? Should we add Tier 3.5 for "trusted pairs"?
3. **Incentives:** How do we incentivize agents to optimize for customer impact vs operational cost?
4. **Accountability:** When an agent promise fails, who owns remediation cost?
5. **Learning loop:** Should every promise generate a post-mortem field note?
6. **Expansion:** Should this extend to customer-built agents (AgentFoundry) or stay internal-only?

---

## Branch Status

**Ready to:**

- Push to origin and open PR
- Pilot framework on first three agents
- Gather real cost/impact data
- Iterate based on learnings

**Blocked on:**

- HIC decision on scope + tier definitions
- Budget approval (if charging customers)
- Pilot agent selection
