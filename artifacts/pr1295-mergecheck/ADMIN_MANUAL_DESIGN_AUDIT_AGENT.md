# Admin Manual: Design Audit Agent

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: hiQHt | Date: 05.02.2026 | Changes: Initial creation - Design Audit Agent documentation

Session Links & References:
  - Claude Code (hiQHt): https://claude.ai/code/session_01G6Df2Fsma7EsNQWQNBYbVF
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md

Document Status:
  - Created: 05.02.2026
  - Last Modified: 05.02.2026
  - Language: English
  - Publication Status: ✅ ACTIVE

Repository Status:
  - GitHub: ✅ Committed & Pushed
  - Location: ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md
  - .gitignore: NO
  - Access Level: 🟢 Public

---

**Version:** 1.0
**Effective Date:** 2026-02-05
**Last Updated:** 2026-02-05
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [When to Use the Design Audit Agent](#2-when-to-use-the-design-audit-agent)
3. [Prerequisites](#3-prerequisites)
4. [How to Invoke the Agent](#4-how-to-invoke-the-agent)
5. [The Audit Workflow](#5-the-audit-workflow)
6. [Understanding the Design Plan Output](#6-understanding-the-design-plan-output)
7. [Approving and Implementing Phases](#7-approving-and-implementing-phases)
8. [Best Practices](#8-best-practices)
9. [Examples](#9-examples)
10. [Troubleshooting](#10-troubleshooting)
11. [Integration with Other Agents](#11-integration-with-other-agents)

---

## 1. Overview

### What is the Design Audit Agent?

The Design Audit Agent is a specialized AI agent that transforms your UI/UX into premium, Apple-quality interfaces. It embodies the design philosophy of Steve Jobs and Jony Ive:

> *"Simplicity is the ultimate sophistication."*

The agent audits every screen, component, and pixel of your application, then delivers a phased design plan for your review and approval.

### What It Does

- **Audits** visual hierarchy, spacing, typography, color, alignment, and motion
- **Identifies** consistency issues across screens and components
- **Proposes** design improvements in three prioritized phases
- **Implements** approved changes with surgical precision
- **Protects** functionality — it never breaks what works

### What It Does NOT Do

- Does not add new features or modify functionality
- Does not touch backend code, APIs, or data models
- Does not implement changes without explicit approval
- Does not make subjective preferences — every change has a design reason

---

## 2. When to Use the Design Audit Agent

### Ideal Use Cases

| Scenario | Why Use This Agent |
|----------|-------------------|
| **Before Launch** | Polish your app to premium quality before going live |
| **After MVP** | Elevate a functional prototype to production-ready UI |
| **New Dashboard** | Ensure new screens match existing design language |
| **Inconsistency Detected** | Fix visual inconsistencies across your application |
| **Mobile Optimization** | Verify responsive design works at all breakpoints |
| **Accessibility Review** | Check color contrast, focus states, and ARIA compliance |
| **Design System Update** | Identify where new tokens should be added |

### When NOT to Use

- When you need new features built → Use Build Agent
- When you need backend changes → Use appropriate development agent
- When the app is still in early prototype stage with expected major pivots

---

## 3. Prerequisites

### Required Documentation

Before invoking the agent, ensure these files exist (create if missing):

| Document | Path | Purpose | Required |
|----------|------|---------|----------|
| `DESIGN_SYSTEM.md` | Root or `/docs/` | Visual tokens (colors, spacing, typography) | Yes |
| `FRONTEND_GUIDELINES.md` | Root or `/docs/` | Component engineering standards | Recommended |
| `APP_FLOW.md` | Root or `/docs/` | Screen routes and user journeys | Recommended |
| `PRD.md` | Root or `/docs/` | Product requirements | Recommended |
| `TECH_STACK.md` | Root or `/docs/` | Technical capabilities/constraints | Recommended |
| `progress.txt` | Root | Current build state | Optional |
| `LESSONS.md` | Root or `/docs/` | Design patterns and past mistakes | Optional |

### Minimal DESIGN_SYSTEM.md Template

If you don't have a design system, create one:

```markdown
# Design System

## Colors
- Primary: #2563EB
- Secondary: #64748B
- Background: #FFFFFF
- Surface: #F8FAFC
- Text Primary: #0F172A
- Text Secondary: #475569
- Error: #DC2626
- Success: #16A34A

## Typography
- Font Family: Inter, system-ui, sans-serif
- H1: 32px / 40px line-height / 700 weight
- H2: 24px / 32px line-height / 600 weight
- Body: 16px / 24px line-height / 400 weight
- Small: 14px / 20px line-height / 400 weight

## Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- full: 9999px

## Shadows
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
```

---

## 4. How to Invoke the Agent

### Method 1: Direct Prompt (Recommended)

Copy and paste this prompt into your AI coding tool:

```
You are now operating as the Design Audit Agent for DWS IQ 6.

Read and internalize: .workflows/agents/DESIGN_AUDIT_AGENT.md

Target application: [SPECIFY: e.g., "dws6.com/dashboard/firehorse/v9-react"]

Required documents to read first:
- DESIGN_SYSTEM.md
- FRONTEND_GUIDELINES.md
- APP_FLOW.md

Mode: AUDIT

Begin by reading all required documentation, then walk through the application
screens and produce a complete Design Audit Plan following the template in
DESIGN_AUDIT_AGENT.md.
```

### Method 2: Targeted Audit

For auditing specific screens or components:

```
You are the Design Audit Agent.

Read: .workflows/agents/DESIGN_AUDIT_AGENT.md

Target: [SPECIFIC COMPONENT OR SCREEN]
Example: "The login page at dws6.com/login/"

Focus areas: [OPTIONAL FOCUS]
Example: "Mobile responsiveness and touch targets"

Mode: AUDIT

Produce a focused design plan for this specific target.
```

### Method 3: Implementation Mode

After approving a phase:

```
You are the Design Audit Agent.

Read: .workflows/agents/DESIGN_AUDIT_AGENT.md

Mode: IMPLEMENT PHASE 1

Reference: [Link to approved design plan]

Execute only the approved Phase 1 changes. Do not add, modify, or skip anything.
Report all changes made using the CHANGES MADE format.
```

---

## 5. The Audit Workflow

### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DESIGN AUDIT WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1: INVOKE AGENT                                                      │
│   ├── Paste the audit prompt                                                │
│   └── Specify target application/screen                                     │
│                              ↓                                              │
│   STEP 2: AGENT READS DOCUMENTATION                                         │
│   ├── DESIGN_SYSTEM.md                                                      │
│   ├── FRONTEND_GUIDELINES.md                                                │
│   ├── APP_FLOW.md                                                           │
│   └── Other supporting docs                                                 │
│                              ↓                                              │
│   STEP 3: AGENT WALKS THROUGH APP                                           │
│   ├── Mobile viewport (375px)                                               │
│   ├── Tablet viewport (768px)                                               │
│   └── Desktop viewport (1280px+)                                            │
│                              ↓                                              │
│   STEP 4: AGENT PRODUCES DESIGN PLAN                                        │
│   ├── Overall Assessment                                                    │
│   ├── Phase 1: Critical issues                                              │
│   ├── Phase 2: Refinement items                                             │
│   ├── Phase 3: Polish items                                                 │
│   ├── DESIGN_SYSTEM.md updates needed                                       │
│   └── Implementation notes for Build Agent                                  │
│                              ↓                                              │
│   STEP 5: YOU REVIEW THE PLAN                                               │
│   ├── Accept, modify, or reject items                                       │
│   ├── Reorder priorities if needed                                          │
│   └── Approve phase(s) for implementation                                   │
│                              ↓                                              │
│   STEP 6: AGENT IMPLEMENTS APPROVED PHASE                                   │
│   ├── Makes only approved changes                                           │
│   ├── Reports all changes with before/after                                 │
│   └── Updates progress.txt                                                  │
│                              ↓                                              │
│   STEP 7: YOU REVIEW IMPLEMENTATION                                         │
│   ├── Verify changes look correct                                           │
│   ├── Request refinements if needed                                         │
│   └── Approve next phase or conclude                                        │
│                              ↓                                              │
│   REPEAT STEPS 6-7 FOR REMAINING PHASES                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Understanding the Design Plan Output

### Phase Breakdown

| Phase | Priority | Content | When to Implement |
|-------|----------|---------|-------------------|
| **Phase 1: Critical** | Highest | Issues that actively hurt the experience — broken hierarchy, unusable on mobile, major inconsistencies | Immediately |
| **Phase 2: Refinement** | Medium | Improvements that elevate quality — spacing adjustments, typography cleanup, color refinements | After Phase 1 |
| **Phase 3: Polish** | Lower | Premium touches — micro-interactions, transitions, empty/loading/error states, dark mode | After Phase 2 |

### Reading the Issue Format

Each issue follows this structure:

```
| Screen/Component | Issue | Solution | Why It Matters |
|-----------------|-------|----------|----------------|
| LoginPage | CTA button competes with secondary actions | Increase button size to 48px height, reduce secondary link opacity to 60% | Primary action must be unmissable |
```

- **Screen/Component**: Exact location in the codebase
- **Issue**: What's wrong (specific, measurable)
- **Solution**: Exact change needed (no ambiguity)
- **Why It Matters**: Design reasoning

### Implementation Notes Section

The most critical section for developers. Example:

| File | Component | Property | Old Value | New Value | Token Reference |
|------|-----------|----------|-----------|-----------|-----------------|
| `src/pages/Login.tsx` | `SubmitButton` | `height` | `40px` | `48px` | `size-button-lg` |
| `src/pages/Login.tsx` | `ForgotPassword` | `opacity` | `1` | `0.6` | - |

This allows any developer (human or AI) to implement changes without design interpretation.

---

## 7. Approving and Implementing Phases

### Approval Responses

When reviewing the design plan, respond clearly:

**Full Approval:**
```
Phase 1: APPROVED - implement all items as specified.
Phase 2: APPROVED with modification - skip item #3, implement rest.
Phase 3: DEFER - we'll revisit after Phase 1 & 2 are complete.
```

**Partial Approval:**
```
From Phase 1, I approve items 1, 2, and 4.
Item 3: Please clarify why the border radius change matters.
Item 5: Skip this - we have a reason for the current color.
```

**Request Clarification:**
```
Before I approve Phase 1:
- What's the visual impact of changing the header height?
- Can you show a mockup or example of the proposed typography scale?
```

### Implementation Commands

After approval:

```
Implement Phase 1 as approved.

Constraints:
- Do not touch files outside the approved scope
- Preserve all existing functionality
- Report each change using the CHANGES MADE format
- Pause and ask if anything is unclear
```

### Post-Implementation Review

After each phase, expect a report like:

```
CHANGES MADE:
- src/pages/Login.tsx: Increased SubmitButton height from 40px to 48px
- src/pages/Login.tsx: Reduced ForgotPassword link opacity to 0.6
- src/styles/buttons.css: Added size-button-lg token (48px height)

THINGS I DIDN'T TOUCH:
- LoginForm validation logic: Intentionally left alone (functionality)
- API call structure: Out of scope

POTENTIAL CONCERNS:
- The ForgotPassword link may need hover state adjustment after opacity change

BEFORE/AFTER:
[Visual comparison if screenshots available]
```

---

## 8. Best Practices

### Do's

- **Provide screenshots** when possible — helps the agent understand current state
- **Be specific about targets** — "audit the login page" is better than "audit the app"
- **Review each phase carefully** — you control what gets implemented
- **Update DESIGN_SYSTEM.md** — before implementing new tokens
- **Test after each phase** — ensure functionality is preserved

### Don'ts

- **Don't skip Phase 1** — critical issues should be fixed first
- **Don't rush approvals** — understand what each change does
- **Don't mix design and features** — use separate agents for functionality
- **Don't ignore accessibility items** — they're critical, not optional
- **Don't hardcode values** — always use design tokens

### Quality Checklist

After each phase implementation, verify:

- [ ] All approved changes are implemented
- [ ] No unapproved changes were made
- [ ] Functionality is preserved
- [ ] Responsive behavior works at all breakpoints
- [ ] DESIGN_SYSTEM.md is updated with new tokens
- [ ] progress.txt reflects current state

---

## 9. Examples

### Example 1: Full Dashboard Audit

**Invoke:**
```
You are the Design Audit Agent.
Read: .workflows/agents/DESIGN_AUDIT_AGENT.md
Target: dws6.com/dashboard/firehorse/v9-react/
Mode: AUDIT
```

**Expected Output:**
```markdown
# DESIGN AUDIT RESULTS

**Overall Assessment:** The dashboard has a solid foundation but suffers from
inconsistent spacing and competing visual hierarchy in the navigation. Mobile
experience needs significant improvement.

## PHASE 1 — Critical

| Screen/Component | Issue | Solution | Why It Matters |
|-----------------|-------|----------|----------------|
| Sidebar | 5 different icon sizes (16-28px) | Standardize all icons to 20px | Icons must be uniform |
| ProjectCard | Text truncates at 768px, becomes unreadable | Add responsive text sizing, min-width constraint | Mobile usability |
| DataTable | No loading state, appears frozen | Add skeleton loader using existing LoadingSkeleton component | Perceived performance |

...
```

### Example 2: Targeted Component Audit

**Invoke:**
```
You are the Design Audit Agent.
Target: The ProjectCard component in src/components/ProjectCard.tsx
Focus: Responsiveness and visual hierarchy
Mode: AUDIT
```

**Expected Output:**
A focused plan covering only the ProjectCard across all viewports.

### Example 3: Implementation

**After approving Phase 1:**
```
Implement Phase 1 as approved. All 3 items are approved without modification.
```

**Agent Response:**
```
CHANGES MADE:
- src/components/Sidebar/icons.css: Standardized all icon sizes to 20px
- src/components/ProjectCard.tsx: Added responsive text sizing with min-width
- src/components/DataTable.tsx: Integrated LoadingSkeleton component for loading state

THINGS I DIDN'T TOUCH:
- Sidebar navigation logic: Functionality preserved
- ProjectCard click handlers: Out of scope
- DataTable sorting logic: Functionality preserved

POTENTIAL CONCERNS:
- Icon standardization may affect some custom icons — please verify visually
```

---

## 10. Troubleshooting

### Common Issues

#### "Agent is making feature suggestions"

**Problem:** The agent is suggesting new functionality instead of design improvements.

**Solution:**
```
Stop. You are the Design Audit Agent. You do not propose features or
functionality changes. Return to visual design only: spacing, typography,
color, alignment, hierarchy, motion, accessibility. Revise your plan.
```

#### "Agent implemented unapproved changes"

**Problem:** Changes were made beyond what was approved.

**Solution:**
```
Revert the following unapproved changes: [list them]
Only implement exactly what was approved. Ask before adding anything.
```

#### "Design plan is too vague"

**Problem:** Solutions like "make it feel cleaner" instead of specific values.

**Solution:**
```
Your implementation notes are too vague. Revise with exact values:
- File path
- Component name
- Property name
- Current value
- New value
- Token reference

"Cleaner" is not an instruction. "padding: 16px → 24px" is an instruction.
```

#### "Agent can't access the live app"

**Problem:** Agent cannot view the running application.

**Solution:**
- Provide screenshots at mobile, tablet, and desktop viewports
- Or paste relevant component code for the agent to analyze
- Or describe the current state in detail

---

## 11. Integration with Other Agents

### Handoff to Build Agent

When the Design Audit Agent identifies a change that requires functionality modifications:

```
FLAGGED FOR BUILD AGENT:
- The loading spinner needs API integration to know when to stop
- This is outside Design Audit Agent scope
- Build Agent should handle in separate session
```

### Coordination with V1.0 Development Agents

| Agent | Relationship |
|-------|--------------|
| Agent-03 (Dashboard) | Design Audit Agent can review Agent-03's work after completion |
| Agent-05 (Mobile) | Design Audit Agent provides mobile-specific guidance |
| Agent-10 (Documentation) | Design findings should be documented in LESSONS.md |

### Signal Protocol

When using the coordinator system:

```bash
# After completing audit
node coordinator.cjs emit design-audit READY:audit-complete

# After Phase 1 is approved and implemented
node coordinator.cjs emit design-audit READY:phase-1-approved

# After all phases complete
node coordinator.cjs emit design-audit COMPLETE:design-audit
```

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.workflows/agents/DESIGN_AUDIT_AGENT.md` | Full agent specification |
| `DESIGN_SYSTEM.md` | Visual language tokens |
| `FRONTEND_GUIDELINES.md` | Component engineering standards |
| `AGENTS.md` | Master index of all agents |
| `AI_AGENT_GUIDELINES.md` | General AI agent documentation standards |

---

## Support

**Technical Issues:**
- Create a GitHub issue with the `design-audit` label
- Include the audit prompt, target, and unexpected behavior

**Questions:**
- Check this manual first
- Review `.workflows/agents/DESIGN_AUDIT_AGENT.md` for detailed specifications

---

**Version:** 1.0
**Last Updated:** 05.02.2026
**Maintained By:** DWS IQ Design Team
**License:** Proprietary - Lifetime Oy
