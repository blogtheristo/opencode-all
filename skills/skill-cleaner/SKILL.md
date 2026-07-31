---
name: skill-cleaner
description: "Audit skill metadata in skills/*/SKILL.md and .claude/commands/*.md for prompt-budget cost, bloated descriptions, duplicate triggers, and status-banner waste."
argument-hint: "[--apply <skill>] [--root <path>]"
allowed-tools: [Bash, Read, Edit, Glob]
---

# Skill Cleaner

Trim skill prompt budget. The `description:` field is loaded into EVERY
context; bodies only load on invoke. So bloat in descriptions is a
permanent token tax across every session.

Adapted from Peter Steipete's `skill-cleaner` (agent-scripts).

## Workflow

1. Run the analyzer from repo root:

```bash
node --experimental-strip-types skills/skill-cleaner/scripts/skill-cleaner.ts --root skills --root .claude/commands
```

Variants:

```bash
node --experimental-strip-types skills/skill-cleaner/scripts/skill-cleaner.ts --context-tokens 272000 --budget-percent 2 --root skills --root .claude/commands
node --experimental-strip-types skills/skill-cleaner/scripts/skill-cleaner.ts --root skills --root .claude/commands --exit-code
```

2. Read the report in this order:
   - `Budget`: context window, 2% skills budget, current usage, headroom.
   - `Offenders`: skills or slash commands exceeding word/char/trigger thresholds.
   - `Anti-patterns`: status banners, prose, marketing copy, repeated triggers.
   - `Proposed rewrites`: tightened descriptions to paste back.

3. Before editing:
   - Preserve trigger nouns: product, tool, action, object.
   - Move status/version banners, related-file lists, cross-surface caveats to the body.
   - Keep `name`, `argument-hint`, `allowed-tools` unchanged.

## Hard Limits

- description: ≤ 60 words, ≤ 400 chars, ≤ 100 tokens
- triggers (in "Use when:" list): ≤ 6, no near-duplicates
- single-line double-quoted form preferred over folded `>` block
- no prose paragraphs, banners, marketing copy, or dependency lists in description
- relax grammar: fragments OK. Nouns over sentences.

## Anti-patterns (real, from this repo)

- `risto`: "Load this skill when advising on EU Fit for 55 strategy, industrial AI architecture, Nordic enterprise sales, deep tech fundraising, edge AI deployment, or any domain requiring senior industrial founder judgment." → prose. Replace with topical nouns.
- `dream-on`: 125-word description with EXPERIMENTAL status banner + Cross-Surface Verification caveat. → move banner to body H1 note.
- `firehorse-report`: 16 quoted trigger phrases ("annual report", "sustainability report", "ESRS report", "board pack", "board report", "executive compliance briefing"…). → keep 3-4 distinct.
- `clawdbot` / `compliance`: 9 trigger variants each. → keep the 3 most natural.

## Apply Mode

`skill-cleaner --apply <skill>` — replace ONLY the frontmatter description.
Diff first, ask y/n, then write. Never touch the body.

## Output Policy

- Suggest first; edit only when the user asks.
- For grouped cleanup, one small commit per skill.
- Do not delete or rename skills without explicit confirmation.
