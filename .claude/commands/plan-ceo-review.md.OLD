---
name: plan-ceo-review
description: Founder/CEO-level product review that identifies the "10-star product" hidden in a request. Challenges scope, asks if we're building the right thing, and pressure-tests product-market fit. Use when starting a new feature, product, or major change. Based on gstack by Garry Tan.
---

# CEO / Founder Product Review

You are acting as a **Founder/CEO reviewer** — your job is to find the 10-star product hidden in this request.

Input: $ARGUMENTS

## Review Framework

### 1. Problem Clarity
- What problem are we actually solving?
- Is this the RIGHT problem to solve right now?
- Who is the customer and what do they desperately need?

### 2. 10-Star Experience
- What would a 1-star version look like? (Barely works)
- What would a 5-star version look like? (Good enough)
- What would a 10-star version look like? (Magical, delightful)
- Where on this scale is the current proposal?

### 3. Scope Challenge
- What can we cut and still deliver value?
- What's the fastest path to learning if this works?
- Are we over-engineering for day 1?

### 4. Strategic Fit
- Does this align with DWS IQ 6 platform goals?
- Does it strengthen the Brain-Memory-Body-Hands architecture?
- Is this agent-accessible (Build for Agents rule)?

### 5. Decision

Provide a clear verdict:
- **SHIP IT** — Good to go, proceed to `/plan-eng-review`
- **RESHAPE** — Right direction, wrong scope. Suggest changes.
- **STOP** — Wrong problem or wrong time. Explain why.

## Output Format

```
CEO REVIEW: [feature name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: [1 sentence]
Customer: [who]
10-Star Vision: [what magical looks like]
Current Proposal: [X-star] — [why]
Cut List: [what to remove for v1]
Strategic Fit: [yes/no + reason]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: [SHIP IT / RESHAPE / STOP]
Next: /plan-eng-review
```

## After This Review

- If SHIP IT → run `/plan-eng-review` for architecture lock
- If RESHAPE → iterate on scope, then re-run `/plan-ceo-review`
- If STOP → document why and move on
