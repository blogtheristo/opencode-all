---
name: design-first
description: >
  Use when starting a feature that touches 3+ files or involves architectural
  decisions. Hard gate: present 2-3 design approaches and get user approval
  BEFORE writing any production code. Prevents wasted implementation.
---

# Design First

**NO IMPLEMENTATION WITHOUT DESIGN APPROVAL.**

## The Gate

For any change touching 3+ files or involving architectural decisions:

1. **Surface assumptions** — List what you're assuming about requirements
2. **Present 2-3 approaches** — Each with tradeoffs (complexity, performance, maintainability)
3. **Recommend one** — State why, including what you'd lose
4. **Wait for approval** — Do NOT proceed until the user picks an approach

## Quick Reference

```
DESIGN PROPOSAL: [feature name]

ASSUMPTIONS:
1. [assumption] — correct me if wrong

APPROACH A: [name]
+ [pro]
- [con]

APPROACH B: [name]
+ [pro]
- [con]

RECOMMENDATION: Approach [X] because [reason].
→ Approve to proceed, or redirect.
```

## When to Skip This Gate

- Bug fixes with clear root cause (1-2 files)
- Documentation-only changes
- Dependency updates
- User explicitly says "just do it"

## DWS Integration

- Use `/plan-ceo-review` for product-level decisions (is this the right thing to build?)
- Use `/plan-eng-review` for architecture decisions (is this the right way to build it?)
- This skill is the lightweight version for everyday feature work

## Common Mistakes

- Presenting one approach disguised as a choice ("Option A is clearly better, but here's B...")
- Designing in too much detail — keep it to tradeoffs, not implementation
- Skipping the gate because "I already know the right answer"
- Starting implementation while "waiting" for approval

Adapted from obra/superpowers `brainstorming` for DWS IQ 6.
