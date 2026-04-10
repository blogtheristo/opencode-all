# DWS CLI

Command-line interface for DWS IQ 6. Run compliance agents, trigger workflows, query events from any terminal. Built for both humans and machines.

## Install

```bash
cd cli
npm install
npm run build
npm link        # makes 'dws' available globally
```

Or run directly without installing:

```bash
npx tsx cli/src/cli.ts <command>
```

## Quick Start

```bash
# 1. Interactive setup — writes env vars to stdout
dws init

# 2. Save config to .env
dws init > .env

# 3. Verify connection
dws health

# 4. See what's available
dws agents
dws status
```

## Commands

### Getting Started

| Command          | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `dws init`       | Interactive setup wizard (prompts for API URL, token, project) |
| `dws quickstart` | First-time setup and connection check                          |
| `dws status`     | Platform overview — health, agents, usage bars, uptime         |
| `dws health`     | Backend + MCP health check with service indicators             |

### Agents

| Command                          | Description                        |
| -------------------------------- | ---------------------------------- |
| `dws agents`                     | List all registered agents         |
| `dws agent <name>`               | Get agent details                  |
| `dws run <name> --input '{...}'` | Execute an agent with JSON input   |
| `dws run <name> --stdin`         | Execute with JSON piped from stdin |
| `dws discover <capability>`      | Find agents by capability tag      |

### Workflows

| Command                                  | Description                          |
| ---------------------------------------- | ------------------------------------ |
| `dws workflows`                          | List available multi-agent workflows |
| `dws workflow <name> --input '{...}'`    | Trigger a multi-agent workflow       |
| `dws scenario [name]`                    | Run a preconfigured scenario         |
| `dws events [--pattern <p>] [--limit N]` | Show recent agent events             |

### MCP (Model Context Protocol)

| Command                              | Description               |
| ------------------------------------ | ------------------------- |
| `dws mcp tools`                      | List available MCP tools  |
| `dws mcp call <tool> --args '{...}'` | Call an MCP tool directly |

### KYA (Know Your Agent)

Runtime safety controls for the Know Your Agent trust layer. KYA binds an autonomous agent session to a verified human identity and can terminate the whole chain if trust is lost (TC-4 Leash Snap).

| Command                       | Description                                                      |
| ----------------------------- | ---------------------------------------------------------------- |
| `dws kya status <session_id>` | Check KYA trust score & identity binding for a session           |
| `dws kya snap <session_id>`   | Trigger a Leash Snap (TC-4 chain termination with forensic dump) |

**`dws kya snap` options:**

| Flag              | Description                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `--reason <code>` | Reason code (default: `MANUAL_SNAP`). Examples: `TRUST_VIOLATION`, `POLICY_BREACH`, `IDENTITY_REVOKED` |
| `--force-cascade` | Cascade termination to all child agents in the session                                                 |
| `--yes`           | Skip the interactive confirmation prompt (required in non-TTY)                                         |
| `--dry-run`       | Preview the termination payload without executing                                                      |

**Backend wiring:**

- `dws kya snap` → `POST /api/v1/kya/snap` → `terminateChain()` in `src/identity/kya-engine.ts`
- `dws kya status` → `GET /api/v1/kya/status/:sessionId`
- Shufti Pro webhooks → `/api/v1/kya/*` (`src/routes/kya-webhook.routes.ts`)
- Authorization: `Bearer $DWS_API_TOKEN` or `x-admin-key: $ADMIN_API_KEY` (timing-safe compare)

```bash
# Check a session's trust score
dws kya status session-abc123

# Preview what would happen (safe)
dws kya snap session-abc123 --reason TRUST_VIOLATION --dry-run

# Execute a cascade termination non-interactively
dws kya snap session-abc123 --reason TRUST_VIOLATION --force-cascade --yes
```

See `docs/KYA_BYO_LIFECYCLE.md` and `onelifetime.world/posts/kya-standard-v1.html` for the full KYA standard.

### Knowledge Base (`dws kb`)

LLM-maintained knowledge base inspired by Karpathy's workflow: **raw sources → LLM-compiled wiki → auto-maintained indexes → Q&A**. No vector DB — the LLM reads its own indexes and navigates the wiki autonomously.

| Command                          | Description                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| `dws kb status`                  | Show KB stats (raw count, article count, health, last compile/lint)         |
| `dws kb ingest <file>`           | Add a raw source (`.md`, `.pdf`, etc.) to `kb/raw/`                         |
| `dws kb compile [--full]`        | Compile `kb/raw/` → `kb/wiki/` (summaries, concepts, entities, indexes)     |
| `dws kb ask "question" [--save]` | Q&A against the compiled wiki. `--save` writes answer to `kb/wiki/reports/` |
| `dws kb research "question"`     | Deep research run (longer timeout, ephemeral working wiki)                  |
| `dws kb lint`                    | Health check — finds orphaned articles, broken backlinks, stale summaries   |

**`kb/` folder layout:**

```
kb/
├── kb.json                  # Metadata: version, lastCompile, articleCount, healthScore
├── raw/                     # Human dumps sources here (source of truth)
│   ├── _inbox.md            # Quick notes / incoming links
│   ├── articles/            # PDFs, markdown, web captures
│   ├── repos/               # Code snapshots or repo notes
│   ├── images/              # Screenshots, diagrams
│   └── signals/             # Market/regulatory signals
├── wiki/                    # LLM-compiled output (never edit manually)
│   ├── _index.md            # Master index (grouped by type)
│   ├── _index-by-topic.md   # Topic clusters
│   ├── _index-by-date.md    # Reverse-chronological
│   ├── _stale.md            # Articles flagged by lint
│   ├── concepts/            # Concept articles (500–2000 words)
│   ├── entities/            # People, companies, regulations
│   ├── summaries/           # One summary per raw source
│   ├── reports/             # Saved `kb ask --save` answers
│   └── slides/              # Slide-deck outlines
└── ephemeral/               # Temporary research wikis (auto-cleaned after 7 days)
```

**Workflow:**

1. Drop a source into `kb/raw/articles/` (manually or via `dws kb ingest`).
2. Run `dws kb compile` — the LLM reads raw/, writes summaries + concepts + entities, regenerates all 3 indexes, and updates `kb.json`.
3. Ask questions with `dws kb ask "..."` — the LLM reads the indexes, picks 3–8 relevant articles, and answers with citations.
4. `dws kb lint` runs a health check; `scripts/daily/kb-cleanup.sh` sweeps `kb/ephemeral/` older than 7 days (auto-discovered by the day-runner).

**Backend wiring:**

- All `dws kb` subcommands call `POST /api/agents/kb/execute` with `input.operation` set to `compile|ask|research|lint|ingest|status`.
- Agent implementation: `src/agents/kb.agent.ts`. Tools exposed: `kb_list_raw`, `kb_read_file`, `kb_write_article`, `kb_list_wiki`, `kb_update_metadata` (path-traversal protected, writes confined to `kb/wiki/`).
- `--save` on `dws kb ask` persists the answer into `kb/wiki/reports/{slug}.md` and updates the indexes.

```bash
# Add a source and compile
dws kb ingest ~/Downloads/eu-ai-act-final.pdf
dws kb compile

# Ask a question, save the answer as a report
dws kb ask "What does the EU AI Act require for high-risk systems?" --save

# Deep multi-hop research (writes to kb/ephemeral/)
dws kb research "How does CBAM interact with the EU ETS phase-out of free allocations?"

# Health check + stats
dws kb lint
dws kb status
```

### Scenarios

Preconfigured multi-step demos for specific industries:

| Scenario        | What it runs                                      |
| --------------- | ------------------------------------------------- |
| `quickstart`    | Health check, list agents, demo compliance run    |
| `construction`  | Site safety, carbon footprint, full assessment    |
| `manufacturing` | ETS compliance, emissions analysis, quality gates |
| `logistics`     | Fleet emissions, CSRD reporting, competitor scan  |
| `energy`        | Fit for 55, GHG reporting, SEO pipeline           |

```bash
dws scenario construction
```

## Output Modes

The CLI has **dual output mode** — human-friendly by default, machine-parseable when needed.

| Condition                  | Output Format                           |
| -------------------------- | --------------------------------------- |
| Interactive terminal (TTY) | Colors, tables, spinners, progress bars |
| Piped to another command   | Pure JSON (no colors)                   |
| `--json` flag              | Force JSON output even in TTY           |

This means you can do both:

```bash
# Human-readable
dws status

# Machine-parseable
dws status --json
dws agents | jq '.[0].name'
```

## `dws init` — The Setup Wizard

`dws init` uses a **stdout/stderr split pattern** for safe piping:

- **Prompts and messages** go to `stderr` (visible to the user)
- **Configuration output** goes to `stdout` (capturable by pipes/redirects)

This means you can safely pipe the output to a file:

```bash
# Prompts appear on screen, config goes to file
dws init > .env

# Or append to existing shell profile
dws init >> ~/.bashrc

# Or just see what it would output
dws init
```

The output format is shell-compatible `export` statements:

```bash
export DWS_API_URL="https://your-api.example.com"
export DWS_API_TOKEN="eyJhbG..."
export DWS_PROJECT="my-project"
```

## Environment Variables

| Variable        | Default                 | Description                |
| --------------- | ----------------------- | -------------------------- |
| `DWS_API_URL`   | `http://localhost:8080` | Backend API URL            |
| `DWS_API_TOKEN` | —                       | JWT authentication token   |
| `DWS_PROJECT`   | `cli-session`           | Default project ID         |
| `DWS_SESSION`   | `cli-<timestamp>`       | Session ID for agent runs  |
| `NO_COLOR`      | —                       | Set to disable ANSI colors |

## Piping & Composition

The CLI is designed to compose with standard Unix tools:

```bash
# Extract compliance gaps
dws run compliance --input '{"industry":"steel"}' | jq '.result.gaps'

# Pipe data from another source
echo '{"query":"scope 1 total"}' | dws run emissions-data-analyst --stdin

# Chain: discover → pick first → run
dws discover carbon | jq '.[0].name' -r | xargs -I{} dws run {} --input '{}'

# Monitor events in real-time
watch -n 5 'dws events --pattern "agent.*" --limit 10'

# Export all agent names
dws agents --json | jq '.[].name' -r > agents.txt
```

## Examples

```bash
# Check EU compliance for a steel company
dws run compliance --input '{
  "projectId": "demo",
  "industry": "steel",
  "regulations": ["ets", "cbam", "csrd"],
  "currentMeasures": {
    "carbonReporting": true,
    "emissionsMonitoring": false,
    "supplyChainDueDiligence": false
  },
  "annualEmissions": 50000,
  "importValue": 200000
}'

# Run full construction site assessment
dws workflow construction-full --input '{
  "temperature": 28,
  "humidity": 75,
  "windSpeed": 15,
  "workerCount": 50
}'

# Find all compliance-related agents
dws discover compliance

# Get platform status with usage bars
dws status
```

## Architecture

```
cli/
├── src/
│   ├── cli.ts        # Main CLI — commands, arg parser, main loop
│   └── format.ts     # Rich output — colors, tables, spinners, boxes
├── dist/             # Compiled output (after npm run build)
├── package.json
└── tsconfig.json
```

**Zero runtime dependencies.** The CLI uses only Node.js built-ins. TypeScript and tsx are dev-only.

### format.ts API

The formatting module provides human-friendly output primitives:

| Function                         | Description                             |
| -------------------------------- | --------------------------------------- |
| `fmt.bold()`, `fmt.red()`, etc.  | ANSI text styling                       |
| `fmt.success()`, `fmt.error()`   | Semantic log lines (✓/✗ prefixed)       |
| `fmt.score(value)`               | Color-coded score (green/yellow/red)    |
| `fmt.status(status)`             | Inverted badge (HEALTHY, WARNING, etc.) |
| `table(headers, rows)`           | Formatted ASCII table                   |
| `spinner(message)`               | Animated braille spinner on stderr      |
| `progressBar(current, total)`    | Unicode block progress bar              |
| `box(title, content)`            | Unicode box-drawing frame               |
| `formatAgentList(agents)`        | Formatted agent listing                 |
| `formatHealth(health)`           | Service health dashboard                |
| `formatComplianceResult(result)` | Compliance score breakdown              |

## Development

```bash
# Run in dev mode (no build step)
npx tsx cli/src/cli.ts agents

# Build for production
cd cli && npm run build

# Test a command
npm run dev -- health
```
