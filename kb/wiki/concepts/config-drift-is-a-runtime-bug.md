<!--
VERSION AND AGENT HISTORY
Document: config-drift-is-a-runtime-bug.md
Version: 1.0
Last-Updated: 2026-07-31
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (Opus 5)
Purpose: Canonical DWS concept — when the same fact is declared in N places,
         "documentation drift" is the wrong diagnosis. One of those places is
         load-bearing at runtime, and the mismatch is a live defect.
Introduced-In: PR-pending (branch claude/enterprise-ai-harness-0anl7s)
Branch: claude/enterprise-ai-harness-0anl7s
Owner: risto.paarni@lifetime.fi
-->

# Config Drift Is a Runtime Bug, Not a Documentation Problem

**Version:** 1.0 · **Status:** Active
**Companions:** `src/agents/model-selector.ts` (`OLLAMA_DEPLOYED_MODELS`), `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md`

## The claim

> **When the same fact is declared in several places and they disagree, at least one of them is executed. The disagreement is not untidiness — it is a defect that has already shipped.**

## The incident (31.07.2026)

Ten places named the local Ollama models on the DGX Spark / GN-100. They did not agree:

| Source | Named | Status |
| --- | --- | --- |
| `MODEL_CATALOG` | `qwen2.5:7b`, `qwen2.5:32b` | **never on the box** |
| `llm-client.ts` default | `qwen2.5:32b` | **never on the box** |
| `docker-compose.yml` ×3, `deploy.sh`, `Deploy-DgxSpark.ps1`, `first-boot.sh`, `check-ollama-models.sh`, `state-observer.ts`, `heartbeat.ts` | `nemotron-3-super`, `qwen3-coder:30b` | deployed |
| `.env.example` (root) | nothing | undocumented |
| `infrastructure/dgx-spark/.env.example` | `llama3.3:70b`, `qwen2.5-coder:32b` | **the pair `--models-cleanup` deletes** |

It had been read as documentation drift and deferred. It was not. `MODEL_CATALOG` is read by `selectModel()` on every agent call, so the runtime asked Ollama for a model the host had never pulled. The call fails, or falls through to a metered cloud provider — **the sovereign local path was selectable in name only**, which is precisely the property sold to customers as architectural.

## Why it hid

Every individual file was internally coherent and recently edited. Drift of this kind is invisible to file-level review because **no single file is wrong** — only the relation between them is. Nothing in a diff shows a relation.

## The rule

1. **Ask which copy executes.** If any does, it is a bug with a severity, not a cleanup task.
2. **Make one copy canonical and have the others bind to it** — an exported constant, not a comment saying "keep in sync". A comment is a wish.
3. **Assert the relation in a test.** The test must read the *other* sources from disk, so editing them in isolation fails CI.
4. **Truth flows from the deployed reality inward.** The box has what it has. A catalog that disagrees with the box is wrong even when the catalog is prettier — you cannot fix a deployment by editing a constant.
5. **Never add an unverified model/endpoint to the canonical set.** An aspirational entry makes the daily drift check fail every day until someone silences it, which trains the team to ignore the alarm.

## The test

- If I changed this value in one file only, would anything fail? If no, the sync is a wish.
- Does the runtime read any of these copies? If yes, it is a defect.
- Is the canonical copy the one describing what is actually deployed, or the one describing what we intended?
