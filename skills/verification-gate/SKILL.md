---
name: verification-gate
triggers:
  - verify before completion
  - fresh verification
  - completion gate
  - before commit
  - before claiming done
description: >
  Use when about to claim a task is complete, mark a todo as done, commit code,
  or close a PR. Prevents false completion claims by requiring fresh evidence.
  Red flags: "should work", "probably fixed", "seems correct", "appears to pass".
---

# Verification Gate

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

## Core Pattern

Before any status claim, run the gate:

1. Identify which command validates the assertion (`npm test`, `npm run build`, `npm run lint`)
2. Run the command **fresh** (not from memory or cache)
3. Review **full output** including exit codes
4. Confirm output supports your claim
5. State results WITH evidence, or report actual status

## Red Flag Language (STOP and verify)

| If you're about to say...      | Do this instead                    |
| ------------------------------ | ---------------------------------- |
| "should work"                  | Run the test. Show output.         |
| "probably fixed"               | Reproduce the bug. Show it's gone. |
| "seems correct"                | Run the linter. Show zero errors.  |
| "I believe this passes"        | Run `npm test`. Paste the result.  |
| "Great!" (before verification) | Verify first. Celebrate after.     |

## When This Gate Applies

- Before marking any TodoWrite item as `completed`
- Before `git commit`
- Before claiming a bug is fixed
- Before saying "all tests pass"
- Before closing a task or PR

## Common Mistakes

- Trusting a subagent's completion claim without running tests yourself
- Running only one test file when the change affects multiple
- Checking exit code but not reading the actual output
- Skipping verification because "it's a small change"

## Latent vs Deterministic

| Step                                                                   | Kind                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Detect "completion claim about to happen" (commit, todo done, "fixed") | Latent (read intent from the agent's own next action) |
| Pick the right validating command (`npm test`, `npm run build`, etc.)  | Latent                                                |
| Run the command fresh                                                  | Deterministic                                         |
| Read exit code + output                                                | Deterministic                                         |
| Decide whether output supports the claim                               | Latent (interpretation), Deterministic (exit code)    |

Rule: never substitute LLM confidence for an exit code. "Should work" is not evidence. The exit code is.

Adapted from obra/superpowers `verification-before-completion` for DWS IQ 6.
