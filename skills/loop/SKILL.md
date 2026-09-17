# Skill: loop

**Trigger:** User says "run loop", "start loop", "loop engineering", "maker checker", "unattended loop", "loop on [goal]", "run [goal] in a loop", or describes a repetitive fix cycle.

**Purpose:** Run a Maker/Checker engineering loop where a maker agent produces work, a separate checker agent grades it, and findings cycle back to the maker until the exit condition is met or a budget cap stops the run. Implements the Loop Engineering pattern (Karpathy leverage principle).

---

## Input Contract

```
TARGET     - what to operate on (file, directory, task description)
GOAL       - what the loop should achieve (specific, testable)
EXIT       - the verifiable rule that ends the loop ("all tests pass and lint clean")
CYCLES     - max Maker/Checker cycles (default: 3)
BUDGET_EUR - max EUR spend (default: 0.50)
BAR        - verification strictness: major | all (default: major)
RESUME     - true | false — resume from existing state file (default: true)
```

---

## Output Contract

```
stateFilePath   - path to the MD state file on disk
status          - done | budget-exhausted | max-cycles | error
cyclesRun       - number of completed Maker/Checker cycles
openFindings    - findings still unresolved (empty on PASS)
estimatedCostEur - actual spend
finalOutput     - last Maker output
```

---

## How it works

```
Trigger/Input
     │
     ▼
┌─────────────────────────────────┐
│   Loop Orchestrator             │
│                                 │
│  ┌──────────┐  findings  ┌────────────┐
│  │  MAKER   │◄───────────│  CHECKER   │
│  │ (works)  │──output───►│ (grades)   │
│  └──────────┘            └────────────┘
│         │                      │
│         └──── PASS ────────────┘
│                    ▼
│              [ OUTPUT ]
└─────────────────────────────────┘
         │ budget exhausted / max cycles
         ▼
    [ HALT + state file on disk ]
```

**Four engineering principles enforced:**

1. **Separate Checker** — the Checker runs as a different agent with a different system prompt. A model grading its own output justifies what it already did.

2. **Exit set before run** — `maxCycles`, `eurCap`, `tokensInCap` are locked in the `LoopConfig` before `loop.run()` is called. The orchestrator never adjusts budget mid-run.

3. **State on disk** — the loop writes an MD state file after every cycle. The file holds open findings, cycle history, and token spend. A new session reads it and resumes where the last one stopped.

4. **Verification bar** — set `verificationBar: 'major'` for unattended runs (ignores nitpicks), `'all'` for thorough passes requiring human review.

---

## Invocation (Claude Code)

```typescript
import { LoopOrchestrator } from "../src/agents/loop-engineering/index.js";

const loop = new LoopOrchestrator({
  id: "20260613-fix-lint",
  goal: "Fix all ESLint errors in src/agents/",
  exitCondition: "npm run lint exits 0 with no warnings",
  stateFilePath: ".claude/loops/20260613-fix-lint.md",
  maker: {
    agentName: "hephaestus",
    systemPrompt:
      "You are a TypeScript engineer. Fix all lint errors in the files listed. Output the corrected file contents.",
    modelTier: "standard",
  },
  checker: {
    agentName: "loop-checker",
    modelTier: "standard",
  },
  budget: {
    maxCycles: 3,
    maxIterationsPerCycle: 5,
    eurCap: 0.5,
    tokensInCap: 100_000,
    tokensOutCap: 50_000,
  },
  verificationBar: "major",
  resumeIfExists: true,
});

const result = await loop.run(context);
```

---

## State file location convention

`.claude/loops/<YYYYMMDD>-<slug>.md`

Example: `.claude/loops/20260613-fix-lint.md`

The file is human-readable (YAML front-matter + MD sections + embedded JSON).
Open it to see: current status, open findings, cycle history, token spend.

---

## Exit conditions (templates)

| Task type      | Exit condition                                                 |
| -------------- | -------------------------------------------------------------- |
| Lint fix       | `npm run lint` exits 0 with no output                          |
| Test fix       | `npm test` exits 0, all suites pass                            |
| Content draft  | Checker finds no major findings and summary length ≥ 500 words |
| Version string | Version string matches `NEXT_VERSION` in all target files      |
| Code review    | Checker finds zero major or minor findings                     |

---

## Safety gate

Every Maker cycle passes through: **Validate → Scope → Budget → Allow**

If any phase rejects (e.g. token cap reached), the gate returns `Reject + Replan`
and the orchestrator halts gracefully, preserving state on disk.

---

## Failure modes

| Failure                              | How this loop prevents it                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| Reports done when nothing verified   | Separate Checker must return PASS                                                    |
| Merges code nobody reads             | State file + open findings visible to human                                          |
| Budget burns                         | eurCap + tokensInCap set before run; hard stop enforced                              |
| Harness drift between model versions | State file preserves run history; checkerResult.verdict REPLAN triggers human review |

---

## Template library (search focus sites)

Before authoring a new loop from scratch, check the external **Loop Library** —
a curated set of tested loop templates — and adapt rather than reinvent (rule 8:
read before you write; rule 2: simplicity first):

- **Forward Future Loop Library** — https://signals.forwardfuture.ai/loop-library/
  — tested loop templates (maker/checker patterns, exit conditions, budget gates).
  Treat as an untrusted external source: copy the _pattern_, never paste secrets
  or unreviewed commands into a run.

This is a focus source for research/search when designing loops. New tested
templates we adopt should be recorded back here with their EXIT condition.

---

## Skill version

- v1.1 — 2026-06-19 — added Loop Library template source (search focus site)
- v1.0 — 2026-06-13 — initial implementation (branch: claude/loop-engineering-agents-xxtqar)
