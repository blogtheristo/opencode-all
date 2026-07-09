---
name: autoresearch
description: Autonomously optimize a DWS skill by running it repeatedly, scoring against binary evals, mutating prompts, and retaining improvements. Adapted from Karpathy's autoresearch. Use when user says "autoresearch", "optimize skill", "improve skill", "research loop", "run experiments on [skill]".
---

Run autonomous skill optimization using the autoresearch pattern.

Input: $ARGUMENTS (TARGET=<skill-name> and optional CYCLES, RUNS, BUDGET_EUR, HOST)

## Steps

1. Read `skills/autoresearch/SKILL.md` for the full procedure
2. Parse input — extract TARGET skill name and parameters
3. Validate that `skills/<TARGET>/SKILL.md` exists
4. Follow the 6-phase autoresearch workflow:
   - Phase 1: Gather context (confirm skill, inputs, evals)
   - Phase 2: Build eval suite (3–6 binary yes/no checks)
   - Phase 3: Generate dashboard (autoresearch-<skill>/dashboard.html)
   - Phase 4: Establish baseline (run unchanged, score)
   - Phase 5: Experiment loop (mutate → run → score → keep/revert)
   - Phase 6: Deliver results (summary, changelog, updated SKILL.md)
5. All artifacts go to `autoresearch-<TARGET>/` directory
6. Report final score improvement and top mutations
