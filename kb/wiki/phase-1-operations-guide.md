---
title: Phase 1 Operations Guide — Semantic Drift Detection (Q1 2027)
description: Operator runbook for handling drift evaluation events, escalations, and SLA compliance
status: Active
applies_to: ["Phase 1", "Operations", "Operators"]
version: 1.0
last_updated: 2026-09-08
---

# Phase 1 Operations Guide

## Quick Reference: Drift Tiers & SLA Response

| Drift Tier   | Drift Score | Action                          | SLA   | Your Role            |
| ------------ | ----------- | ------------------------------- | ----- | -------------------- |
| **PROCEED**  | < 0.10      | Continue, log to audit trail    | Auto  | Monitor only         |
| **LOG**      | 0.10–0.30   | Continue, escalate for review   | <24hr | Optional review      |
| **ESCALATE** | 0.30–0.70   | Review required, human decision | <1hr  | **RESPOND REQUIRED** |
| **HALT**     | > 0.70      | Revoke access immediately       | <5min | **CRITICAL**         |

---

## Responding to Escalations

### When You Get an Alert (Tier: ESCALATE or HALT)

**Timeline:**

- **Minute 0:** Alert lands in Slack (kya-escalations-q1-2027 channel)
- **Minute 1–5:** Read entity details, reasoning chain, confidence scores
- **Minute 5–15:** Consult with team or escalate to HIC
- **Minute 15–60:** Make decision (APPROVE / DEFER / REJECT)
- **Minute 60:** Log decision to audit trail (SLA deadline for ESCALATE tier)

### Alert Format (Slack)

```
🔴 ESCALATE: Drift Score 0.52 (YELLOW FLAG)

Entity: Agent "claude-opus-5" v1.2
Reasoning Chain: [finance_compliance] → [market_signal_analysis] → [recommendation]
Confidence: 0.92 → 0.78 → 0.45 (exponential decay detected)

Approver: @operator-name (your role ID)
Escalation Recipient: @security-team (from DWS_ROLES_REGISTRY)

**Action Required:** Review reasoning steps 2–3, provide decision by 05:15 UTC
Decision Options: approve / defer / reject

Audit Link: https://dws6-kya-v2.internal/drift-audit/{drift_id}
```

---

## Understanding Drift Scores

### Confidence Decay Formula

```
confidence(n) = initial_confidence × e^(-λ × n)
```

**Example Reasoning Chain:**

1. Step 1: "Retrieve Q3 earnings data" → confidence 0.95
2. Step 2: "Analyze market trends" → confidence 0.95 × e^(-0.3×1) ≈ 0.74
3. Step 3: "Recommend investment" → confidence 0.74 × e^(-0.3×2) ≈ 0.41

**Drift Score = 1 - avg(edge_weights) = 1 - 0.70 = 0.30** (Yellow flag: ESCALATE)

### Why Did Drift Score Rise?

**High drift (> 0.50) typically means:**

1. Long reasoning chain (>4 steps) — confidence naturally decays
2. Semantic boundary crossed (e.g., finance → speculation without justification)
3. Low similarity between reasoning steps (edge weights < 0.6)
4. Entity type mismatch (e.g., Agent making role-level decisions)

**Read the reasoning chain to understand the root cause.**

---

## Decision Workflow

### Before You Decide

**Ask yourself:**

1. **Is the reasoning chain valid?**
   - Does each step follow logically from the previous?
   - Are semantic boundaries crossed appropriately?
   - Is the confidence decay natural or suspicious?

2. **Is the entity behaving within its scope?**
   - Is an Agent (AI) making Agent-level decisions? ✓
   - Is it venturing into Role (human) or Org decisions? ⚠️
   - Does the entity type match DWS truth standard? (dws-truth-v1.0)

3. **What's the business context?**
   - Is this a known pattern for this entity?
   - Are we testing new reasoning on purpose?
   - Is this the first time seeing high drift for this entity type?

### Make Your Decision

**Option 1: APPROVE**

- Reasoning chain is valid and expected
- Drift is natural (long chain, not boundary crossing)
- Continue operations, log to audit trail
- **Impact:** Entity decision proceeds; drift tracked for transparency

**Option 2: DEFER**

- Need more context before deciding
- Escalate to team lead or HIC for guidance
- Timeline extends to <1hr SLA; still within compliance window
- **Impact:** Operation paused pending human input

**Option 3: REJECT**

- Reasoning chain has critical flaw
- Semantic boundary crossed inappropriately
- Entity should not have made this decision
- **Impact:** Operation revoked; decision voided in KYA v2

### Log Your Decision

**Audit Trail Entry (automatically created):**

```json
{
  "drift_id": "6f3d8e2a-94b1-4e6c-8b3a-c5d7f9e1b2c3",
  "entity_id": "agent:claude-opus-5:v1.2",
  "drift_score": 0.52,
  "approver_role_id": "operator:sec-team-01",
  "approver_decision": "approved",
  "reasoning_chain": [...],
  "human_notes": "Reasoning chain valid; long chain expected for finance analysis. Drift decay natural.",
  "created_at": "2026-01-06T12:45:30Z",
  "hash_chain_previous": "5e2c7d1a-83b4-4f5c-9a1b-d8c6e9f0a7b1"
}
```

**Your entry will be immutably logged per Article 12 compliance.**

---

## Common Scenarios

### Scenario 1: Multi-Step Reasoning (Expected High Drift)

**Alert:**

```
Drift Score: 0.58
Chain: [data_retrieval] → [data_validation] → [statistical_analysis] → [risk_modeling] → [recommendation]
5 steps, confidence decay natural
```

**Analysis:** This is a complex analysis. 5-step chains naturally have higher drift due to exponential decay. **APPROVE** if each step follows logically and semantic boundaries are respected.

**Decision:** APPROVE (expected pattern for analytical agents)

---

### Scenario 2: Semantic Boundary Crossing

**Alert:**

```
Drift Score: 0.72 (HIGH)
Chain: [customer_analysis] → [pricing_strategy] → [unauthorized_contract_modification]
Confidence: 0.85 → 0.62 → 0.15 (sharp drop at step 3)
```

**Analysis:** Sharp confidence drop suggests Agent crossed from its domain (analysis) into Role-level authority (contract negotiation). **REJECT** — Agent should not be modifying contracts without explicit authorization.

**Decision:** REJECT (semantic boundary violation)

---

### Scenario 3: First-Time High Drift for Entity Type

**Alert:**

```
Drift Score: 0.48
Chain: [market_data] → [sentiment_analysis] → [forecast]
Entity: New Agent "claude-sonnet-5" (deployed 1 week ago)
Historical avg drift for Agent type: 0.22
```

**Analysis:** 0.48 is higher than typical for this entity type. Could be legitimate (new reasoning pattern) or suspicious. **DEFER** to team lead for context about why this Agent's approach differs from similar agents.

**Decision:** DEFER (get team context, then approve or reject)

---

## Troubleshooting

### "Alert didn't arrive in Slack"

**Check:**

1. Are you in the `kya-escalations-q1-2027` Slack channel?
2. Is your role configured in DWS_ROLES_REGISTRY as escalation recipient?
3. Slack token still valid? (expires every 90 days)

**Fix:** Confirm role in registry, re-authorize Slack token, retry drift evaluation.

### "Drift score seems wrong (too high or too low)"

**Check:**

1. Are you reading the confidence decay formula correctly?
2. How many reasoning steps? (>4 steps = naturally higher drift)
3. Are edge weights correct? (0.0–1.0, where 1.0 = perfect similarity)

**Fix:** Review "Understanding Drift Scores" section above. If still wrong, contact Tech Lead.

### "I disagree with APPROVE/REJECT decision. Can I override it?"

**No.** Decisions are immutable per Article 12. If you believe a prior decision was wrong:

1. Document your concern in Slack (`#kya-v2-feedback`)
2. Tag the approver and Tech Lead
3. Create a "drift appeal" item in the backlog for Phase 2 review
4. Future decisions can differ based on new evidence

---

## Weekly Reporting

### End-of-Week Summary (Every Friday)

**Your report includes:**

- Total escalations this week: ___
- APPROVE / DEFER / REJECT breakdown: ___ / ___ / ___
- False alarm rate: ___ (escalations that turned out to be valid)
- Avg SLA response time: ___ (goal: <1hr for ESCALATE tier)
- Operational issues: ___
- Blockers for Phase 2: ___

**Submit by 17:00 UTC Friday to:** kya-v2-ops-reports channel

### Sample Report

```
📊 Phase 1 Operations Weekly Report — Week 2 (Jan 6–12)

✓ Total Escalations: 47
✓ Decisions: 38 APPROVE | 7 DEFER | 2 REJECT
✓ False Alarm Rate: 2.1% (1 entity correctly flagged for semantic boundary)
✓ Avg Response Time: 34 min (well within 1hr SLA)
⚠️ Blockers: None this week

Trend: Drift scores normalizing for new Agent types; no systemic issues.
Ready for Phase 2 enforcement testing (pending HIC approval, Week 8).

— Operator Team Lead
```

---

## Phase 1 vs Phase 2 (What Changes)

### Phase 1 (Logging-only, Now)

- Drift evaluation → logged to audit trail
- ESCALATE alerts → human review required
- No automatic revocation (all decisions manual)
- SLA target: <1hr response time
- **Your role:** Reactive reviewer (when escalation alert arrives)

### Phase 2 (Enforcement, Q2 2027)

- Drift evaluation → logged + automatic SLA enforcement
- HALT tier → automatic access revocation (<5min)
- ESCALATE → 1hr timer, auto-escalate to HIC if no response
- No manual approval for routine drifts (operators monitor exceptions)
- **Your role:** Proactive monitor (watch dashboards, handle exceptions)

**Phase 1 is your training ground. Good decision-making now = streamlined automation in Phase 2.**

---

## Contacts & Escalation

**Your Escalation Chain:**

1. **Immediate (drift event):** Review reasoning chain, make decision in Slack
2. **Blocked (can't decide):** Tag @tech-lead in thread, escalate
3. **Critical issue:** Mention @hic-ops in Slack, page on-call (Phase 2)
4. **Feedback on process:** Weekly retrospective, backlog items

**Key Contacts:**

- **Tech Lead:** @risto (HIC) — policy decisions
- **Operations Lead:** @ops-manager — team coordination, training
- **Security Lead:** @security-team — semantic boundary violations, threat assessment
- **Legal/Compliance:** @compliance-officer — Article 12/13/14 questions

---

## Success Definition

You're succeeding in Phase 1 if:

✓ **Accuracy:** <2% false alarm rate (escalations that turn out invalid)
✓ **Speed:** Avg decision time <1hr (SLA compliance)
✓ **Consistency:** Decision rationale documented and reviewable by auditors
✓ **Learning:** Understanding drift scores improves over weeks 1–4
✓ **Readiness:** Phase 2 automation feels like natural progression, not shock

**Phase 1 ends Week 8 (Mar 2). If you meet these criteria, you'll be ready to shift to Phase 2 (monitoring exceptions, not reactive reviewing).**

---

**Operator Resources:**

- Drift scoring algorithm: `docs/GRAPH_LAYER_ONTOLOGY_INTEGRATION.md` (Layer 3)
- Entity types & reconciliation: `DWS_TRUTH_STANDARD.md` (§8)
- Role-based access: `DWS_ROLES_REGISTRY.md`
- Full Phase 1 spec: `docs/PHASE_1_PREPARATION_ROADMAP.md`

**Document Status:** ✓ Ready for operator certification (Week 7 training sessions).
