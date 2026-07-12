---
name: skillpack-check
description: >
  Use to validate that every `skills/<name>/SKILL.md` has valid frontmatter,
  every skill is registered in `docs/DWS_SKILLS_GUIDE.md` and `AGENTS.md`,
  and every entry in those registries points to a real skill folder. Idempotent.
argument-hint: "optional --json (machine-readable) or --fix (auto-add missing rows)"
allowed-tools: [Bash, Read, Edit]
track: gbrain
triggers:
  - "validate skills"
  - "skillpack check"
  - "is the registry in sync"
  - "lint skills"
  - "skill registry health"
reads-pages:
  - skills/**/SKILL.md
  - docs/DWS_SKILLS_GUIDE.md
  - AGENTS.md
writes-pages:
  - docs/DWS_SKILLS_GUIDE.md (only with --fix)
  - AGENTS.md (only with --fix)
---

# Skillpack Check — Registry Health

**Three invariants.** Holds them all, exits 0; breaks any, exits non-zero and
prints the offenders.

Based on `skillpack-check` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/skillpack-check).

## Invariants

1. Every `skills/<name>/SKILL.md` parses as YAML frontmatter and contains at
   minimum `name` + `description`.
2. Every skill folder name appears in `docs/DWS_SKILLS_GUIDE.md` at least once
   (anywhere — Section 4 for gbrain, Section 3 for gstack, Section 9 for
   discipline, etc.).
3. Every skill folder name appears in `AGENTS.md` at least once.

## Usage

```bash
node skills/skillpack-check/scripts/validate-index.mjs
node skills/skillpack-check/scripts/validate-index.mjs --json
node skills/skillpack-check/scripts/validate-index.mjs --fix     # appends missing rows
```

## Output (default)

```
OK   compliance              guide=yes  agents=yes
OK   signal-detector         guide=yes  agents=yes
FAIL briefing                guide=NO   agents=yes  -> add to DWS_SKILLS_GUIDE.md
---
14 skills, 0 errors
```

## When NOT to use

- One-off SKILL.md edit — just run the validator after editing.
- Migrating an existing skill layout — `skill-creator` runs this for you.
