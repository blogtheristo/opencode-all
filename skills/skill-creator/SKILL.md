---
name: skill-creator
description: >
  Use when adding a new skill to DWS6 — scaffolds the folder, writes a
  starter SKILL.md with valid frontmatter, registers it in
  `docs/DWS_SKILLS_GUIDE.md` and `AGENTS.md`, and runs `skillpack-check` to
  confirm the registry is in sync.
argument-hint: "<skill-name> --track=gbrain|gstack|discipline|agent-report [--with-scripts]"
allowed-tools: [Read, Write, Edit, Bash]
track: gbrain
triggers:
  - "new skill"
  - "create skill"
  - "scaffold a skill"
  - "add to skills folder"
  - "register a skill"
reads-pages:
  - skills/RESOLVER.md
  - docs/DWS_SKILLS_GUIDE.md
  - AGENTS.md
writes-pages:
  - skills/<name>/SKILL.md
  - docs/DWS_SKILLS_GUIDE.md
  - AGENTS.md
---

# Skill Creator — Meta-skill

**Scaffold then register.** Two atomic steps; never one without the other.

Based on `skill-creator` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/skill-creator).
**Source pin:** garrytan/gbrain @ VERSION 0.46.23.0, observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

## Scaffolding contract

```
skills/<name>/
├── SKILL.md                # generated from template below
├── scripts/                # only with --with-scripts
└── tests/                  # only with --with-scripts
```

## SKILL.md template (gbrain layout)

```yaml
---
name: <name>
description: >
  Use when <trigger>. Does <action>. Returns <output>.
argument-hint: "<args>"
allowed-tools: [Read, Bash]
track: <track>
triggers:
  - "phrase one"
  - "phrase two"
reads-pages: []
writes-pages: []
---
# <Name>

<one-line rule, then sections>
```

## Registration steps (atomic)

1. Write `skills/<name>/SKILL.md`.
2. Add the skill row to `docs/DWS_SKILLS_GUIDE.md` Section 10 (Quick Reference)
   AND its track-specific section (3 = gstack, 4 = gbrain, 9 = discipline).
3. Bump the `Version` line in `docs/DWS_SKILLS_GUIDE.md` (use `***` delimiters
   in the `VERSION AND AGENT HISTORY` block, never `---`).
4. Append a line to `AGENTS.md` Quick Reference (Section 8).
5. Run `node skills/skillpack-check/scripts/validate-index.mjs` — must exit 0.
6. Stop. Do not commit; user reviews diff first.

## When NOT to use

- One-off agent invocation — use `/agent-run` instead.
- Migrating an existing skill's layout — that's a separate refactor PR.
