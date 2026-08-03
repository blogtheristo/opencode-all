---
name: human-capital
description: >
  Use when assessing a firm's or customer's human capital — the knowledge, judgment,
  relationships, and pattern recognition of its people — and deciding which of it is captured
  into the AI learning loop versus left to commoditisation. Says "human capital", "encode our
  experts", "tacit knowledge inventory", "is our judgment being captured". Pairs with /token-
  capital.
argument-hint: "firm or customer name, or a description of the org / team to inventory"
---

Run a Human Capital inventory & capture assessment.

Load and follow the full procedure in `skills/human-capital/SKILL.md`. Canonical framework:
`docs/field-notes/2026-06-15-human-token-capital.md`.

Input: $ARGUMENTS (firm / customer / team, or a natural-language description).

## Steps

1. Read `skills/human-capital/SKILL.md` and apply it.
2. Scope the org/team/role(s); reference customer roles by R-ID from `DWS_ROLES_REGISTRY.md`.
3. Inventory the five dimensions (knowledge, judgment, relationships, ingenuity, pattern recognition).
4. Score capture rate (flowing into the loop vs trapped in heads/scrollback) and flag commoditisation risk.
5. Emit the Output-contract block; recommend the encode path (SKILL.md | kb/raw | eval | workflow) per high-value item.
6. Suggest running `/token-capital` next — human capital sets direction; token capital compounds it.
