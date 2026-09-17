---
name: learn
description: "Use when closing the learning loop after retros or CI churn. Reads recent mediocre outcomes and proposes read-only skill or ruleset edits that would have prevented them."
argument-hint: "SCOPE=<last-day|last-week|last-feature|last-N|YYYY-MM-DD..YYYY-MM-DD> [TARGET=<skill-name|all>]"
allowed-tools: [Bash, Read]
parameters:
  - name: SCOPE
    required: true
    enum_or_pattern: ["last-day", "last-week", "last-feature", "last-{N}", "YYYY-MM-DD..YYYY-MM-DD"]
    default: last-week
  - name: TARGET
    required: false
    default: all
    note: skill name (without leading slash) or "all"
steps:
  - id: gather
    kind: deterministic
    do: Collect signals — `git log --since=...`, `.claude/hooks/audit/*.log`, recent `/retro` outputs in `docs/retros/`, CI failure logs if present in `.ci-audit/`
  - id: classify
    kind: deterministic
    do: Bucket each signal into FAILURE / MEDIOCRE / OK / GOOD via heuristics (exit codes, retry counts, time-to-green, manual workarounds)
  - id: diarize-mediocre
    kind: latent
    do: For each MEDIOCRE event, write 1–3 sentences — what happened, what the agent missed, what would have made this GOOD
  - id: extract-rules
    kind: latent
    do: For each cluster of related MEDIOCRE events, articulate the one rule that would have changed the outcome
  - id: map-to-skills
    kind: latent
    do: For each rule, identify the `SKILL.md` it belongs in (or propose a new skill if none fits)
  - id: draft-diffs
    kind: latent
    do: Produce unified-diff-style edit blocks against the target SKILL.md files
  - id: write-plan
    kind: deterministic
    do: Write the full plan to `docs/learning-loops/YYYY-MM-DD-<scope>.md`; do NOT modify any SKILL.md
---

# /learn — Learning Loop (Read-Only)

You are running the DWS learning loop. This skill is **read-only**. It surfaces rules; it does not write them. After this skill emits the plan, the user reviews and applies skill edits in a separate commit.

**Input:** `$ARGUMENTS` — parse `SCOPE=` (required) and `TARGET=` (optional, default `all`).

## Why This Exists

Source: Garry Tan, "Thin Harness, Fat Skills" (May 2026):

> After the event, an `/improve` skill reads NPS surveys, diarizes the mediocre responses — not the bad ones, the "OK" ones, where the system almost worked but didn't — and extracts patterns. Then it proposes new rules and writes them back into the matching skills.

DWS6's adaptation: `/learn` proposes rules; humans approve and apply. The skill itself never crosses the YELLOW/RED boundary defined in `DWS_SECURITY_STANDARD.md`. The bias is **mediocre over failed** — failures get caught; the OK-but-not-great cases are where the system silently drifts.

## Procedure

### 1. Gather signals (deterministic)

For the given `SCOPE`:

- `git log --since=<SCOPE> --pretty=format:'%h %ad %s' --date=short` — commit churn
- `git log --since=<SCOPE> --numstat` — file thrash (lots of edits to same file = unclear procedure)
- `cat .claude/hooks/audit/bash-commands.log` (if present) — YELLOW-zone actions
- `cat .claude/hooks/audit.log` (if present) — hook blocks/allows
- `ls docs/retros/` and read any retro inside `SCOPE` — engineering manager observations
- `ls .ci-audit/` if present — CI failure summaries
- `git log --since=<SCOPE> --grep='revert\|fix\|hotfix\|oops'` — same-day-fix patterns

If `TARGET` is set, also limit `git log` to paths touching that skill's domain.

### 2. Classify each signal (deterministic)

| Bucket   | Heuristic                                                                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FAILURE  | Exit code ≠ 0, BLOCK in hook audit, `git revert`, "hotfix" commits, KYA leash-snap                                                                                                            |
| MEDIOCRE | Multiple retries to green, same file touched 3+ times in `SCOPE`, "oops" / "actually" / "second try" in commit msg, dual-folder sync forgotten then fixed, .OLD file shipping later corrected |
| OK       | Single commit, green CI, no rework                                                                                                                                                            |
| GOOD     | Single commit, green CI, no rework, used a parameterized skill correctly                                                                                                                      |

**Focus on MEDIOCRE.** FAILUREs already triggered alerts. OK and GOOD don't need new rules.

### 3. Diarize mediocre events (latent)

For each MEDIOCRE event, write 1–3 sentences:

```
EVENT: <one-line summary>
WHAT HAPPENED: <what the agent or human did>
WHAT THE AGENT MISSED: <the implicit rule that would have made this clean>
WHAT GOOD LOOKS LIKE: <the version where it worked first time>
```

### 4. Cluster and extract rules (latent)

Group MEDIOCRE events by missing-rule similarity. For each cluster (3+ related events), articulate the rule as a single declarative sentence:

```
RULE: When <condition>, the agent must <action>.
EVIDENCE: <count> events in scope (<list of short refs>).
```

### 5. Map to skills (latent)

For each RULE, identify the target:

| Rule scope                                            | Target file                                   |
| ----------------------------------------------------- | --------------------------------------------- |
| Workflow choreography (plan → review → ship)          | `.claude/commands/<workflow-skill>.md`        |
| Judgment-heavy domain capability (compliance, carbon) | `skills/<skill>/SKILL.md`                     |
| Cross-cutting agent behavior                          | `AI_AGENT_GUIDELINES.md`                      |
| Non-negotiable safety / source-of-truth rule          | `CLAUDE.md` (Non-Negotiable Rules)            |
| Active routing of standards docs to tasks             | `CLAUDE.md` (Resolver section, once it lands) |
| No existing skill fits                                | Propose new `skills/<new-name>/SKILL.md`      |

### 6. Draft diffs (latent)

For each target, draft a unified-diff-style block. Example:

```diff
--- skills/firehorse-report/SKILL.md
+++ skills/firehorse-report/SKILL.md
@@ KIND = compliance @@
 ### Section 5: EU AI Act (if applicable)
+
+RULE: When the company operates a high-risk AI system per EU Reg. 2024/1689
+Annex III, the Article 12 logging coverage MUST be cited per system, not in
+aggregate. Aggregate-only citations triggered 3 reviewer rejections in scope.
```

Include rationale block above each diff:

```
WHY: <which mediocre events drove this rule>
RISK: <what could go wrong if we ship this rule>
TEST: <how to verify the next run is GOOD>
```

### 7. Write the plan (deterministic)

Write to `docs/learning-loops/<YYYY-MM-DD>-<SCOPE>.md` (create the folder if missing). Use this template:

````markdown
# Learning Loop — <SCOPE> — <DATE>

Generated by `/learn SCOPE=<SCOPE> TARGET=<TARGET>` on <branch>.

## Signal Summary

- Commits in scope: N
- MEDIOCRE events: N (focus)
- FAILURE events: N (informational)
- OK / GOOD: N (no action)

## Proposed Skill Edits

### Edit 1 — <target file>

WHY: ...
RISK: ...
TEST: ...

```diff
...
```
````

### Edit 2 — ...

## Apply Plan

To accept these edits:

1. Review each diff with the team owner of the target skill.
2. Apply via `git apply` or manual edit in a new commit titled `learn: <SCOPE> rule updates`.
3. Re-run the affected workflow once to verify the new rule changes the outcome.
4. If no improvement, revert and add a counter-example to this plan.

## Open Questions

- <questions the model could not resolve from signals alone>

```

## Output

The skill returns:

1. Path to the generated plan file.
2. Count of proposed edits, grouped by target.
3. Top 3 highest-confidence rules (those with the most supporting events).

**The skill MUST NOT modify any `SKILL.md`, `CLAUDE.md`, or `AI_AGENT_GUIDELINES.md` file directly.** Doing so violates the read-only contract and the trust boundary.

## Anti-Patterns

- Proposing a rule from a single MEDIOCRE event. Wait for ≥3 occurrences.
- Writing rules in chat instead of in `docs/learning-loops/...`. The plan is the artifact.
- Auto-applying edits. This is a YELLOW-zone action by design.
- Proposing rules for FAILURE events that already triggered hook blocks. Those rules already exist; the failure means they were skipped, not absent.

## After This Skill

- Human reviews `docs/learning-loops/<latest>.md`.
- Approved edits applied in a single commit: `learn: <scope> rule updates`.
- One commit per learning loop run keeps the skill-evolution history greppable.
- Re-run `/learn SCOPE=last-week` on subsequent Fridays after `/retro`.

## Composability

- Follows: `/retro` (provides one of the signal sources)
- Feeds: skill files in `skills/` and `.claude/commands/`
- Cross-references: `CLAUDE.md` Skill Codification Rule, `AI_AGENT_GUIDELINES.md` §10
```
