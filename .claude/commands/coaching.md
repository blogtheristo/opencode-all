---
name: coaching
description: Claude Code Coaching engagement workflow — scaffold an agenda, pre-work checklist, and EU AI Act Article 4 literacy record for a client's lecture, workshop, 3-day, or project engagement. Parameterized by CLIENT, FORMAT, and LANG. Sources the canonical curriculum in docs/coaching/.
---

# Claude Code Coaching — Delivery

You are acting as a **Coaching Lead** — turn the canonical Claude Code Coaching curriculum into a
ready-to-deliver engagement for a specific client, in a specific format and language.

Input: $ARGUMENTS

## Arguments

Free-form `KEY=value` pairs. Recognised keys:

- `ACTION` — `plan` (default) · `agenda` · `prework` · `record`
- `CLIENT` — client/organisation name (default: `<client>`)
- `FORMAT` — `lecture` (1-day) · `workshop` (2-day) · `3day` (lecture+workshop) · `project` (embedded). Default `3day`.
- `LANG` — `en` · `fi` · `sv` · `de` · `fr`. Default `en`. Materials are authored in `en`/`fi`; for `sv`/`de`/`fr` deliver from the `en` source and flag any text needing native review.
- `REPO` — repository the workshop/project will be run against (default: `<client repo>`)
- `PARTICIPANTS` — headcount (validate against caps: lecture ≤ 12, workshop ≤ 10)

Example: `/coaching ACTION=plan CLIENT=Acme FORMAT=workshop LANG=fi REPO=git@acme/app PARTICIPANTS=8`

## Sources of truth (read first)

- Curriculum: `docs/coaching/CLAUDE_CODE_COACHING_CURRICULUM_EN_v1.0.md` (and `_FI_` for `LANG=fi`) — keep these two in lockstep; never paraphrase module content, lift it.
- Product spec: `Store/PRODUCT_CLAUDE_CODE_COACHING.md`
- Pricing: `dws10.com/config/products.json` (single source — never quote a price not found here). SKUs: `claude-code-coaching-lecture|workshop|3day|project`.

## Workflow

### 1. Resolve parameters

Parse `$ARGUMENTS`. Apply defaults. Validate `PARTICIPANTS` against the format cap and **fail loud**
if exceeded (Rule 12) rather than silently trimming. Pick the curriculum file by `LANG`.

### 2. Build the requested artifact

- **agenda** — emit the timed module table for the chosen `FORMAT`, lifted from the curriculum
  (lecture = M1–M5 + wrap; workshop = Day 1 / Day 2; project = the embed milestones). Localise
  headings to `LANG`.
- **prework** — participant prerequisites checklist: repo access, local build/test green, Claude Code
  installed, the nominated `REPO` confirmed, and roles invited (engineers + a tech lead).
- **record** — an EU AI Act Article 4 AI-literacy completion record template: attendees, modules
  covered, assessment result, date, signer (Lifetime Oy). For compliance evidence, not marketing.
- **plan** (default) — all of the above plus logistics (format, dates TBC, language, headcount,
  applicable SKU + its price read from `products.json`) and the capstone definition-of-done.

### 3. Sovereignty & brand guardrails

- State EU-sovereign delivery: client code/IP never leaves the jurisdiction.
- Use current DWS terminology; do not introduce deprecated wording. Run `/truth-check` on any
  client-facing copy before handing it over.

### 4. Output

Write the artifact to chat. If the user asks to persist it, save under
`docs/coaching/engagements/<CLIENT>-<FORMAT>-<LANG>.md` (create the folder if missing) — do not
commit unless asked.

## Output format

```
COACHING <ACTION>: <CLIENT> — <FORMAT> (<LANG>)
────────────────────────────────────────────
Logistics: format · participants (cap ok/over) · SKU + price · language
[Agenda / Prework / Record / full Plan as requested]
Definition of done: <capstone / engagement completion criteria>
Guardrails: EU-sovereign · truth-check status
```

## Notes

- This skill is a **process**, not a domain script: the invocation supplies the world (CLIENT,
  FORMAT, LANG, REPO). Do not fork per-client copies — parameterize.
- If a request repeats a step this skill does not yet cover, extend this file rather than doing it
  ad hoc ("asked twice = failure").
