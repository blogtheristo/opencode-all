---
name: human-capital
description: >
  Use when assessing a firm's or customer's human capital — the knowledge, judgment,
  relationships, and pattern recognition of its people — and deciding which of it is captured
  into the AI learning loop versus left to commoditisation. Says "human capital", "encode our
  experts", "tacit knowledge inventory", "is our judgment being captured". Pairs with /token-
  capital.
argument-hint: "firm or customer name, or a description of the org / team to inventory"
allowed-tools: [Read, Glob, Grep, Bash]
---

# Human Capital — Inventory & Capture Assessment

**HUMAN CAPITAL DOES NOT BECOME LESS VALUABLE AS TOKEN CAPITAL GROWS. IT BECOMES MORE
VALUABLE.** Human agency is the driver of token-capital growth. This skill inventories that
agency and scores how much of it is being _captured into the learning loop_ versus _left in
people's heads where it commoditises on exit_.

Canonical source: `docs/field-notes/2026-06-15-human-token-capital.md`.
Pair skill: `/token-capital` (the AI-capability half of the same loop).

## What human capital is (the five dimensions)

| Dimension               | What to inventory                                                        |
| ----------------------- | ------------------------------------------------------------------------ |
| **Knowledge**           | Domain facts, regulations, process know-how, "how we actually do X here" |
| **Judgment**            | Decisions under uncertainty, trade-off calls, what-to-ignore             |
| **Relationships**       | Customer trust, supplier networks, regulator contacts, internal context  |
| **Ingenuity**           | Novel solutions, goal-setting, cross-domain connection                   |
| **Pattern recognition** | "I've seen this before" — the tacit signal a veteran reads instantly     |

## The procedure

1. **Scope.** Identify the org/team/role(s) from `$ARGUMENTS`. For a customer, use the
   25-role taxonomy in `DWS_ROLES_REGISTRY.md` (reference by R-ID). For DWS itself, the
   company-veteran package is `skills/risto/SKILL.md` — that is what "encoded human capital"
   looks like as an artefact.
2. **Inventory** each of the five dimensions. For each item, record: who holds it, whether
   it is written down anywhere, and what happens to the firm if that person leaves tomorrow.
3. **Score capture** (per item, then rolled up): is this human capital _flowing into the
   loop_ (a SKILL.md, KB article, eval, RL trace, documented workflow) or _trapped_
   (only in someone's head / chat scrollback)?
4. **Flag commoditisation risk.** Any high-value item that an off-the-shelf model could
   absorb and resell — and that the firm has _not_ encoded as its own token capital — is a
   leak. That is value flowing out from underneath the firm.
5. **Recommend the encode path.** For each trapped, high-value item, name the concrete
   capture artefact: a `skills/<name>/SKILL.md` (judgment), a `kb/raw/` source (knowledge),
   a private eval (outcome), or a documented workflow (process). "Asked twice = failure" —
   if a judgment call recurs, it must become a skill, not stay tribal.

## Output contract

```
Human Capital Assessment — <scope>
  Dimensions inventoried: <n items across knowledge/judgment/relationships/ingenuity/patterns>
  Capture rate: <% of high-value items flowing into the loop>
  Top commoditisation risks: <3 items an external model could eat that we haven't encoded>
  Encode plan: <item → artefact (SKILL.md | kb/raw | eval | workflow), owner>
  Human-agency multiplier: <where human direction most increases token-capital ROI>
```

## Latent vs deterministic

| Step                                                      | Kind          |
| --------------------------------------------------------- | ------------- |
| Decide what counts as high-value human capital            | Latent        |
| Map a role to its R-ID in DWS_ROLES_REGISTRY.md           | Deterministic |
| Judge whether an item is "captured" vs "trapped"          | Latent        |
| Grep the repo for an existing capture artefact (SKILL/KB) | Deterministic |
| Recommend the encode path                                 | Latent        |

## When This Applies

- Onboarding/offboarding a domain expert (capture before they leave).
- Customer discovery: "what judgment do your people make that no software does yet?"
- Before building token capital — you cannot compound what you have not inventoried.

## Common Mistakes

- Treating human capital as a cost to be replaced by AI. It is the _driver_; this note's
  whole point is that it appreciates.
- Inventorying knowledge (easy to write down) and skipping judgment/patterns (the hard,
  defensible part).
- Capturing into chat scrollback instead of a skill/KB. Scrollback is not the loop.

## DWS Standards applied (CLAUDE.md Resolver)

- `DWS_ROLES_REGISTRY.md` — 25-role taxonomy, reference roles by R-ID.
- `CLAUDE.md` Skill Codification Rule — "Asked twice = failure"; recurring judgment → skill.
- `docs/field-notes/2026-06-15-human-token-capital.md` — canonical framework.
