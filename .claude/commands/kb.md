---
name: kb
description: Use when compiling the DWS knowledge base, ingesting sources, asking wiki questions, or running KB research.
---

Drive the DWS Knowledge Base agent via the DWS CLI. The KB is a Karpathy-style LLM-compiled wiki — no vector DB. Raw sources in `kb/raw/`, compiled output in `kb/wiki/`, ephemeral research in `kb/ephemeral/`.

Input: $ARGUMENTS (a subcommand + its argument — e.g. `ask "what does CSRD require for SMEs"`, `compile`, `ingest path/to/file.pdf`)

## Subcommands

| Form                                     | What it does                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `/kb status`                             | Show raw count, wiki article count, health score, last compile/lint timestamps                      |
| `/kb ingest <file>`                      | Copy a raw source into `kb/raw/` (auto-routes to `articles/`, `repos/`, `images/`, or `signals/`)   |
| `/kb compile [--full]`                   | Compile `kb/raw/` → `kb/wiki/`: summaries, concepts, entities, regenerate all 3 indexes             |
| `/kb ask "question" [--save]`            | Q&A against the compiled wiki; `--save` writes answer to `kb/wiki/reports/{slug}.md`                |
| `/kb research "question"`                | Deep multi-hop research (longer timeout, writes to `kb/ephemeral/{slug}/`)                          |
| `/kb lint`                               | Health check — find orphaned articles, broken backlinks, stale summaries                            |

## Steps

1. Parse `$ARGUMENTS` into `{subcommand, positional, flags}`.
2. Run the CLI:
   - `cd cli && npx tsx src/cli.ts kb <subcommand> [args] [--flags]`
3. For `ask` and `research`, render the answer in-chat with citations back to wiki articles.
4. For `compile`/`ingest`/`lint`/`status`, surface the key stats (articles added, health score, stale count).
5. If `compile` runs and finds new raw sources but the user hasn't asked, offer to run `lint` after.

## Folder layout (for reference)

```
kb/
├── kb.json                  # Metadata: version, lastCompile, articleCount, healthScore
├── raw/                     # Human dumps sources here (source of truth)
│   ├── _inbox.md            # Quick notes / incoming links
│   ├── articles/            # PDFs, markdown, web captures
│   ├── repos/               # Code snapshots or repo notes
│   ├── images/              # Screenshots, diagrams
│   └── signals/             # Market/regulatory signals
├── wiki/                    # LLM-compiled output — NEVER edit manually
│   ├── _index.md, _index-by-topic.md, _index-by-date.md, _stale.md
│   ├── concepts/            # Concept articles (500–2000 words)
│   ├── entities/            # People, companies, regulations
│   ├── summaries/           # One summary per raw source
│   ├── reports/             # Saved `kb ask --save` answers
│   └── slides/              # Slide-deck outlines
└── ephemeral/               # Temp research wikis, auto-cleaned after 7 days
```

## Workflow rules

1. **`kb/wiki/` is LLM-owned.** Never hand-edit wiki files — they get overwritten on the next `compile`.
2. **`kb/raw/` is human-owned.** Drop sources here; compile picks them up incrementally.
3. **`compile` is incremental by default.** Use `--full` only for a clean rebuild.
4. **`ephemeral/` is disposable.** `scripts/daily/kb-cleanup.sh` sweeps entries older than 7 days.
5. **Security: path traversal is blocked.** `kb_write_article` only writes inside `kb/wiki/`.

## Backend

- All `dws kb` subcommands → `POST /api/agents/kb/execute` with `input.operation = compile|ask|research|lint|ingest|status`
- Agent: `src/agents/kb.agent.ts`
- Tools exposed to the LLM: `kb_list_raw`, `kb_read_file`, `kb_write_article`, `kb_list_wiki`, `kb_update_metadata`
- Daily cleanup: `scripts/daily/kb-cleanup.sh` (auto-discovered by day-runner)

## When NOT to use

- Supabase / Postgres queries — use `/sovereignty-assess` or direct SQL
- Live web search — the KB only reads what's been ingested into `kb/raw/`
- Code search across the repo — use `Grep` / `Glob` / Explore subagent
- Confidential / PII content — KB is not cleared for PII, see `docs/DWS_DATA_STANDARD.md`
