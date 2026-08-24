---
name: soul-audit
description: >
  Use when checking that a draft (blog, INTRO_*.md, board memo, CEO statement)
  sounds like the founder voice and the DWS6 CEO voice. Compares to the
  canonical Risto persona (`skills/risto/Risto_Skills.md`) and flags tone
  drift, jargon creep, deprecated taxonomy ("GodAgent/Godagent"), or
  ghostwritten phrasing.
argument-hint: "path to the draft; optional --voice=risto|ceo|both"
allowed-tools: [Read, Grep]
track: gbrain
triggers:
  - "soul audit"
  - "does this sound like risto"
  - "founder voice check"
  - "ceo voice check"
  - "tone drift"
  - "ghostwritten"
reads-pages:
  - skills/risto/Risto_Skills.md
  - docs/DWS_BRAND_STANDARD.md
  - "**/*.md (target draft only)"
writes-pages: []
---

# Soul Audit — Voice & Identity Check

**Read-only.** Compares a draft against the canonical founder voice and the
DWS6 brand voice; never edits the draft itself — only reports.

Based on `soul-audit` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/soul-audit).
**Source pin:** garrytan/gbrain @ VERSION 0.46.23.0, observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

## Checks

1. **Founder voice (Risto)** — sentence length, declarative cadence, use of
   first-person, presence of concrete numbers. Reference `skills/risto/Risto_Skills.md`.
2. **CEO voice (DWS brand)** — alignment with `docs/DWS_BRAND_STANDARD.md`
   tone (clarity > cleverness, Finnish directness, no marketing fluff).
3. **Terminology guardrail** — per CLAUDE.md, fail if "GodAgent" / "Godagent"
   appears in new copy.
4. **Ghostwriter smell** — flag corporate filler ("at the end of the day",
   "moving forward", "leverage synergies"), passive voice spikes.

## Output

```json
{
  "voiceMatch": { "risto": 0.78, "ceo": 0.81 },
  "guardrailFails": ["line 42: 'GodAgent' is deprecated taxonomy"],
  "ghostwriterFlags": ["line 8: 'leverage synergies' — corporate filler"],
  "suggest": "Rewrite lines 8, 42; keep the rest."
}
```

## When NOT to use

- Code review — `/review`.
- Citation problems — `citation-fixer`.
- Strategic decision review — `/plan-ceo-review`.
