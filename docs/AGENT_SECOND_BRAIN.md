# Agent Second Brain — DGX Spark KB

# VERSION AND AGENT HISTORY

---

| Version | Date       | Agent       | Change                                                    |
| ------- | ---------- | ----------- | --------------------------------------------------------- |
| 1.0.0   | 2026-04-25 | Claude Code | Initial: DGX Spark embeddings + inbox watcher capability. |

***

## 1. What this is

A "second brain" for DWS agents — long-term, retrievable knowledge that survives between sessions. The pattern is borrowed from NanoClaw (a Raspberry-Pi personal assistant gist), adapted to run on **DGX Spark** so embeddings stay EU-sovereign instead of round-tripping through OpenAI cloud.

The brain is composed of three layers that already mostly exist in this repo:

| Layer                | Where it lives                            | Status         |
| -------------------- | ----------------------------------------- | -------------- |
| Raw sources          | `kb/raw/{articles,images,repos,signals}/` | ✅ existed     |
| Markdown wiki        | `kb/wiki/{concepts,entities,summaries}/`  | ✅ existed     |
| Working memory (DB)  | `semantic_memories` (Supabase pgvector)   | ✅ existed     |
| **Local embeddings** | DGX Spark Ollama `nomic-embed-text`       | 🆕 this commit |
| **Auto-ingest**      | `scripts/daily/kb-watch-inbox.sh`         | 🆕 this commit |

This commit only adds the two new rows. The four existing pieces are untouched (no schema migration, no agent rewrite — `memoryService` keeps using OpenAI by default).

## 2. Why agents need it (use cases)

The morning briefing pipeline is the first concrete consumer. Four gaps motivate this work:

1. **Multi-source news monitoring.** The morning brief currently reads from a narrow source set; agents should be able to recall context from a wider set of ingested articles (`kb/raw/articles/`) without an LLM having to re-read every file.
2. **Customer-needs understanding.** Sales notes, support transcripts, and partner conversations should be ingestible as raw markdown and recallable by capability ("show me everything we know about cement-sector decarbonisation pain points").
3. **Investor & grant matching.** Funding-opportunity briefs (Horizon Europe, EIC, EU innovation funds) live as raw articles; agents should match them against company profile vectors.
4. **Fit for 55 currency.** Regulatory updates land in the inbox, the watcher ingests them, and `dws kb ask` retrieves the right slice without re-summarising the whole pipeline each morning.

The capability ships in this commit. **Wiring the morning brief to actually use it is a follow-up.**

## 3. Architecture

```
            ┌────────────────────┐
            │  kb/raw/articles/  │ ← human or agent drops a file
            └─────────┬──────────┘
                      │
                      ▼
       ┌──────────────────────────────┐
       │ scripts/daily/                │
       │   kb-watch-inbox.sh           │  auto-discovered by day-runner
       │   → npx tsx cli.ts kb ingest  │
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌──────────────────────────────┐         ┌──────────────────────┐
       │ kb agent (compile / ask /     │ ──────► │ src/utils/           │
       │ research / lint)              │  embed  │   embeddings.ts      │
       └──────────────────────────────┘         └──────────┬───────────┘
                                                            │
                                            EMBEDDING_PROVIDER=…
                                                            │
                                  ┌─────────────────────────┼─────────────────────────┐
                                  ▼                         ▼                         ▼
                          openai (default)            dgx-spark                    (null)
                          text-embedding-3-small      nomic-embed-text             graceful
                          1536-dim, cloud             768-dim, EU-sovereign        skip
                                                      via ssh dgx-spark
                                                      → /api/embeddings
```

## 4. Configuration

| Variable                 | Default                  | Purpose                                 |
| ------------------------ | ------------------------ | --------------------------------------- |
| `EMBEDDING_PROVIDER`     | `openai`                 | `openai` or `dgx-spark`                 |
| `EMBEDDING_MODEL_OPENAI` | `text-embedding-3-small` | OpenAI model (1536-dim)                 |
| `EMBEDDING_MODEL_DGX`    | `nomic-embed-text`       | Ollama model on DGX Spark (768-dim)     |
| `OPENAI_API_KEY`         | —                        | Required when provider is `openai`      |
| `DGX_SSH_HOST`           | `dgx-spark`              | SSH alias for the DGX Spark Ollama host |
| `DGX_OLLAMA_URL`         | `http://localhost:11434` | Ollama endpoint inside the Spark        |

**Important:** the existing `memoryService` (Supabase `semantic_memories`) is hard-coded to 1536-dim columns. Switching it to `dgx-spark` requires a schema migration (RED zone — human required). For now, `dgx-spark` is the right provider for KB-side, file-based recall; `openai` remains correct for the production memory table.

## 5. Programmatic use (TypeScript)

```ts
import { generateEmbedding, cosineSimilarity } from "./utils/embeddings.js";

const a = await generateEmbedding("CBAM importer threshold");
const b = await generateEmbedding("carbon border adjustment 150k EUR");
if (a && b && a.dimensions === b.dimensions) {
  console.log("similarity:", cosineSimilarity(a.vector, b.vector));
}
```

`generateEmbedding` returns `null` on any failure — callers must degrade gracefully (don't `throw`).

## 6. Shell use (DGX Spark)

```bash
# Verify the Spark is reachable + the model is loaded BEFORE flipping the env var
scripts/ollama-spark-embed.sh --preflight
# or, equivalently, via the CLI:
dws kb preflight

# Single-shot embedding
scripts/ollama-spark-embed.sh nomic-embed-text "CBAM importer threshold"

# Long text via stdin (avoids quoting issues)
cat kb/raw/articles/cbam-2026-update.md | scripts/ollama-spark-embed.sh nomic-embed-text -
```

Returns the raw Ollama JSON: `{"embedding": [0.012, -0.043, …], "model": "..."}`.

`dws kb preflight` runs three checks and emits an actionable hint on failure:

1. SSH alias is reachable non-interactively (`ssh $DGX_SSH_HOST true`).
2. Ollama `/api/tags` responds.
3. The `EMBEDDING_MODEL_DGX` model is in the tag list.
4. A round-trip embedding succeeds and reports its dimension count.

Exits non-zero on any failure so it composes with shell pipelines (`dws kb preflight && export EMBEDDING_PROVIDER=dgx-spark`).

## 7. Inbox watcher

`scripts/daily/kb-watch-inbox.sh` is auto-discovered by the DGX Spark `day-runner.sh` per the **Script Automation Rule** (`CLAUDE.md`). On each daily pass:

1. **First run** (no `.last-watch-run` sentinel): backfill the existing inbox, oldest-first, capped at `KB_WATCH_MAX_PER_RUN` (default `25`). Anything beyond the cap is picked up on subsequent passes — no manual sentinel deletion required.
2. **Subsequent runs**: only files newer than the sentinel.
3. Each selected file is piped through `npx tsx cli/src/cli.ts kb ingest <file>`.
4. The sentinel only advances when (a) every selected file ingested cleanly **and** (b) the cap was not hit. Failed or capped files are retried on the next pass.

The cap bounds blast radius if a large historical inbox is dropped onto a fresh deployment; raise `KB_WATCH_MAX_PER_RUN` if you want a faster initial drain.

## 8. Build for Agents checklist (per CLAUDE.md)

| #   | Requirement              | Status                                                                     |
| --- | ------------------------ | -------------------------------------------------------------------------- |
| 1   | CLI exists               | ✅ `dws kb {compile,ask,research,ingest,lint,status}` (already shipped)    |
| 2   | Output is JSON           | ✅ all `dws kb …` operations                                               |
| 3   | MCP tools exposed        | ✅ KB agent registered in `agentRegistry`, surfaced as `dws_kb` MCP tool   |
| 4   | Claude Code skill exists | ✅ `.claude/commands/kb.md`                                                |
| 5   | Docs are markdown        | ✅ this file + `kb/raw/karpathy-llm-knowledge-bases.md` (design rationale) |

## 9. Follow-ups (deliberately NOT in this commit)

- Wire `memoryService` to use `src/utils/embeddings.ts` (requires `semantic_memories` schema migration to support both 1536 and 768 dims, or a per-org column).
- Sidecar `kb/embeddings.jsonl` so `dws kb ask` can do top-k retrieval before LLM reasoning instead of pure file navigation.
- Hook the morning brief (`scripts/send-morning-brief-v2.ts`) into the four use cases in §2.
- Multi-source ingestion via the new `dws browse fetch` (commit 1 of this branch) → drop fetched HTML into `kb/raw/articles/` → watcher picks it up.

The last bullet is where commit 1 (Playwright) and commit 2 (this) compose: agents can now both _find_ information and _remember_ it.
