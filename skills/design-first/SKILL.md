---
name: design-first
triggers:
  - design proposal
  - 3+ files
  - architectural decision
  - present approaches
  - design before implementation
description: >
  Use when starting a feature that touches 3+ files or involves architectural
  decisions. Hard gate: present 2-3 design approaches and get user approval
  BEFORE writing any production code. Prevents wasted implementation.
---

# Design First

**NO IMPLEMENTATION WITHOUT DESIGN APPROVAL.**

## The Gate

For any change touching 3+ files or involving architectural decisions:

1. **Surface assumptions** - List what you're assuming about requirements
2. **Present 2-3 approaches** - Each with tradeoffs (complexity, performance, maintainability)
3. **Recommend one** - State why, including what you'd lose
4. **Wait for approval** - Do NOT proceed until the user picks an approach

## Quick Reference

```
DESIGN PROPOSAL: [feature name]

ASSUMPTIONS:
1. [assumption] - correct me if wrong

APPROACH A: [name]
+ [pro]
- [con]

APPROACH B: [name]
+ [pro]
- [con]

RECOMMENDATION: Approach [X] because [reason].
-> Approve to proceed, or redirect.
```

## When to Skip This Gate

- Bug fixes with clear root cause (1-2 files)
- **Docs-only changes** — markdown in `docs/`, `Admin/`, `Learn/`, `README.md`, or DWS standards at repo root. **Not** `.claude/**`, `skills/**`, `.github/**`, `scripts/**`, or any code path.
- **Skill registration** — adding a `.claude/commands/*.md` that wraps an already-documented reference, provided ALL of:
  - no change to `.claude/hooks/**`, `.claude/settings*.json`, or `.mcp.json`
  - no new env vars, secrets, or permissions
  - the skill only invokes existing tools / existing docs
  - **PR is opened and CI is green before merge** (this is the recovery gate)
- Dependency updates
- User explicitly says "just do it"

## Recovery Path If You Skip

A skipped gate is only safe if the change goes through the **PR + CI** path. Direct commits to feature branches without a PR means our CI workflows never validate the change. For any skip above, the expectation is: push → open PR → wait for CI green → merge. No exceptions.

## DWS Integration

- Use `/plan-review ROLE=ceo` for product-level decisions (is this the right thing to build?)
- Use `/plan-review ROLE=eng` for architecture decisions (is this the right way to build it?)
- This skill is the lightweight version for everyday feature work

## Common Mistakes

- Presenting one approach disguised as a choice ("Option A is clearly better, but here's B...")
- Designing in too much detail - keep it to tradeoffs, not implementation
- Skipping the gate because "I already know the right answer"
- Starting implementation while "waiting" for approval

## Latent vs Deterministic

| Step                                                                | Kind                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| Trigger detection (does this change touch 3+ files? Architectural?) | Deterministic (file count) + Latent (architectural-ness) |
| Assumption surfacing                                                | Latent                                                   |
| Designing 2–3 approaches with tradeoffs                             | Latent                                                   |
| Waiting for approval                                                | Deterministic (control flow — do not proceed)            |

Rule: never collapse the gate. Even if you "know the right answer", the gate exists because the _user's preference_ is itself unknown information.

Adapted from obra/superpowers `brainstorming` for DWS IQ 6.
