# DWS IQ Essentials Positioning — Strategic Decision Log

**Date:** 2026-08-30  
**Context:** Themis control plane impact analysis revealed clear path to SME entry market  
**Decision:** Ship DWS IQ Essentials (not standalone "Themis" product) by Q4 2026

---

## The Decision

**Rejected:** Standalone "Themis" product for SMEs + separate DWS IQ enterprise stack  
**Adopted:** Single contract/adapter model, two commercial tiers (Essentials, Pro, Enterprise)

**Rationale:**

- Avoids "two products" divergence risk (code splits, audit trail breaks, contract model drift)
- Enables ladder validation: SME customer discovers upsell need organically (governance, analytics)
- Faster time-to-market: ship engine + 2 connectors now, full stack later
- Shared evidence architecture means SME at Tier 1 trusts same audit trail at Tier 3

---

## Product Positioning

### Commercial Brand

- **Essentials:** DWS IQ Essentials ($X/mo) — agent orchestration, inventory, evidence, safe updates
- **Pro:** DWS IQ Pro ($Y/mo) — governance + compliance + analytics
- **Enterprise:** DWS IQ Enterprise (custom) — full feature set, self-hosted, custom integrations

### Internal Architecture

- Themis = control-plane engine (not user-facing brand)
- MCP Hub = task routing layer
- Evidence chain = audit foundation for all tiers

### Value Ladder

1. SME buys Essentials; deploys GitHub + Supabase connectors
2. SME sees audit trail, agent evidence → discovers "we need governance"
3. SME buys Pro for governance rules + analytics dashboards
4. If SME grows to multi-site, buy Enterprise

**Test:** Can a customer go Essentials → Pro → Enterprise on the same contract model without re-architecture?  
**Assumption:** Yes, if contracts/RLS/adapters are tier-agnostic

---

## What This Means for Themis

**Themis remains:**

- The orchestration engine
- The control-plane architecture
- The agent registry and task routing core

**Themis is NOT:**

- A commercial product name (customers buy "DWS IQ Essentials", not "Themis")
- A separate P&L
- A standalone go-to-market motion

**This reduces risk because:**

- No code fork between "Themis for SMEs" and "DWS IQ for Enterprise"
- Evidence chain is identical across tiers (EU AI Act compliance survives all upgrades)
- MCP server registry stays consistent (RLS adapters don't change between tiers)

---

## Ship Checklist for Essentials

**Blocking Issues:**

- [ ] Agent registry health: 3 services DEAD, registry 72h stale
- [ ] GitHub connector: MCP exists, untested in Essentials workflow
- [ ] Supabase connector: MCP exists, untested in Essentials workflow
- [ ] MCP_SERVERS hardcoded URLs: decision needed (replace with discovery or accept tight coupling)

**Documentation Needed:**

- [ ] Essentials user guide (deploy, first workflow, troubleshoot)
- [ ] Pricing & feature comparison page
- [ ] Sales one-pager
- [ ] Managed deployment runbook

**Target SME Customer Profile:**

- 50–500 employee manufacturing/logistics/utility company
- Pain: No audit trail, no change tracking, no compliance evidence
- Buy signal: Asks about governance within 60 days (ladder validation)

---

## Ladder Validation Metrics

If the ladder works, we'll see:

1. **Adoption:** >50% of Essentials beta customers deploy within 2 weeks
2. **Connectors:** >80% connect both GitHub and Supabase
3. **Upsell:** >30% of Essentials customers buy Pro within 90 days
4. **Reason:** Upsell driven by governance or analytics need, not feature gaps

If adoption stalls or upsell flops, we'll know the ladder assumption is wrong and pivot.

---

## Questions for HIC

1. **Pricing:** Essentials at $X/month? (Recommendation: $500–1500)
2. **First customer:** Which profile? Manufacturing, logistics, utility, or other?
3. **Support:** Community-only for Essentials, or email support included?
4. **Procurement:** Safe to defer to Pro, or needed for Essentials?
5. **Managed vs. Self-Hosted:** Essentials managed-only, or also self-hosted option?

---

## Related Documents

- `docs/DWS_IQ_ESSENTIALS_ROADMAP.md` — Full product roadmap, Phase 1–4 timeline
- `.claude/handoffs/claude/themis-control-plane-impact-dxvrh2.md` — Themis control plane analysis that led to this decision
- `AGENTS.md` — Agent topology (includes Themis orchestrators)

---

## Session Notes

This decision came from analyzing the recent PR impact (MCP Hub refactor, Cosmos 3 Edge, agent health) and recognizing:

1. **Themis as entry product** makes sense architecturally (modular, evidence-driven)
2. **Waiting for full enterprise stack** risks missing first customer signal
3. **Quiet ladder validation** (architecture supports tiers, but don't force positioning)
4. **SME pain point** is clear: no audit trail, no safe updates, no evidence

The roadmap operationalizes this: ship Essentials Q4 → land beta customer Q1 → observe ladder behavior Q1 → ship Pro Q2.

If the ladder works (customer upsells for governance/analytics), we've validated the entire DWS IQ strategy. If it doesn't, we'll know to pivot (maybe SMEs don't want governance, or want it differently).

---

**Status:** Decision logged for next sprint planning  
**Owner:** Product strategy  
**Next:** HIC decision gate on pricing, first customer, support model
