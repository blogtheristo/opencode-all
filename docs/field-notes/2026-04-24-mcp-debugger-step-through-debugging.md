# Field Note: MCP Debugger — Giving LLM Agents Step-Through Debugging

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Opus 4.7) | Session: claude/add-mcp-debugging-note-fDXoJ | Date: 24.04.2026 | Changes: Initial field note on mcp-debugger (DAP bridge for MCP). Referring article aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/ returned HTTP 403; content below is grounded in the canonical debugmcp/mcp-debugger README and modelcontextprotocol.io debugging docs, not the aaif.io article.

Session Links & References:

- Claude Code (claude/add-mcp-debugging-note-fDXoJ): https://github.com/blogtheristo/dws6
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-04-24-mcp-debugger-step-through-debugging.md

Document Status:

- Created: 24.04.2026
- Last Modified: 24.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Tool Evaluation

Related Documents:

- docs/field-notes/2026-04-22-obsidian-cli-claude-code-integration.md
- docs/GITHUB_MCP_TOOLS.md
- Admin/ADMIN_MANUAL.md (Section 30 — Safety Hooks)

***

## Ontology Tags

- **Geography:** Global > open-source tooling
- **Sector:** Technology > AI/ML > Developer Tooling > MCP ecosystem
- **Entities:** debugmcp/mcp-debugger, Model Context Protocol, Debug Adapter Protocol (DAP), debugpy, js-debug, CodeLLDB, Delve, netcoredbg, Anthropic MCP Inspector, Claude Code, Claude Desktop
- **Temporal Context:** 2026-Q2, MCP ecosystem maturation, LLM-as-developer era
- **Confidence:** Medium — canonical README verified; referring aaif.io article could not be fetched (HTTP 403), so its specific framing is not captured here.

---

## Referring Link

https://aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/

The aaif.io post is what flagged this tool for us. The page is gated against automated fetch (both WebFetch and `curl` returned 403), so this note is grounded in upstream sources rather than the article text. If a human pastes the article body, add a §"Author's framing" block below and bump to v1.1.

---

## The Problem

MCP has a visibility gap. A server runs over JSON-RPC through STDIO, the client is an LLM, and when something misbehaves — wrong tool call, truncated payload, silent exception inside the server's own business logic — there is no obvious place to put a breakpoint. Two failure modes recur at DWS:

1. **Server-side logic bugs.** Our MCP servers (`mcp-hub/`, `mcp-servers/`) wrap real code: compliance scorers, ERP adapters, agent runners. When a tool call returns a plausible-but-wrong answer, the failure is inside our own function, not the protocol.
2. **Agent-side reasoning bugs.** The LLM chooses the wrong tool, passes the wrong argument, or loops. Inspector-style tools help with (1) but not (2).

The existing MCP debugging surface is:

- **Anthropic MCP Inspector** (`modelcontextprotocol/inspector`) — visual tool caller, good for smoke-testing a server by hand. It does not step through application code.
- **`mcp-framework` debug logs and `modelcontextprotocol.io/docs/tools/debugging`** — protocol tracing, STDIO logging, standard "println debugging."
- **Language-native debuggers** (pdb, VSCode, IntelliJ) — require a human at the keyboard.

`mcp-debugger` sits one layer deeper: it lets the agent itself drive a real step-through debugger.

---

## What `mcp-debugger` Is

An MCP server that exposes the **Debug Adapter Protocol (DAP)** as structured MCP tools. The agent (Claude, Cursor, any MCP client) gets the same primitives a human gets in VSCode: breakpoints, step in/out/over, stack frames, variable inspection, expression evaluation.

Repo: https://github.com/debugmcp/mcp-debugger

### Supported adapters (verified from README, 2026-04-24)

| Language        | Adapter    | Notes                                               |
| --------------- | ---------- | --------------------------------------------------- |
| Python          | debugpy    | Mature, our primary Firehorse/Python surface        |
| JavaScript/Node | js-debug   | VSCode's production debugger, bundled               |
| Rust            | CodeLLDB   | Linux/macOS/Windows-GNU                             |
| Go              | Delve      | —                                                   |
| Java            | JDI bridge | JDK 21+, launch and attach, supports hot-swap       |
| .NET / C#       | netcoredbg | —                                                   |
| (mock)          | built-in   | Lets you test the debugger without a real toolchain |

### Exposed MCP tools (approximately 20)

Categories, from the upstream README:

- **Session:** `create_debug_session`, `list_debug_sessions`, `close_debug_session`
- **Breakpoints:** `set_breakpoint`
- **Execution:** `start_debugging`, `step_over`, `step_into`, `step_out`, `continue_execution`, `pause_execution`
- **Inspection:** `get_variables`, `get_local_variables`, `get_scopes`, `get_stack_trace`, `list_threads`
- **Evaluation:** expression evaluation, source context retrieval
- **Java extras:** `redefine_classes` (hot-swap)

### Quickest run

```bash
npx @debugmcp/mcp-debugger --help
```

Also installable via `npm -g`, Docker, or as a direct Node invocation in an MCP client config (e.g. a `claude_desktop_config.json` entry or a `.mcp.json` `command`/`args` pair for Claude Code).

---

## Why This Matters for DWS6

We operate under two constraints that amplify the value here:

1. **Agent-first product rule** (CLAUDE.md §"Build for Agents"). Every product must be usable by an agent via MCP/CLI. When an MCP server misbehaves, the debugger must also be agent-usable, otherwise we've pushed the human back into the loop for a whole class of bugs.
2. **EU AI Act Article 12 logging** (`DWS_ARTICLE_12_LOGGING_STANDARD.md`). Hash-chained audit records already capture tool-call traces; pairing them with step-through debug sessions gives us a _reproducible_ story for any misbehaving agent, not just a log.

Concrete near-term use cases:

- **`mcp-hub/` servers** — when a tool returns wrong data, the agent can set a breakpoint inside the handler, re-invoke its own call, inspect inputs, and report the root cause in the same turn.
- **Firehorse Python agents** — debugpy coverage means we can attach to a failing scheduled job without shelling in manually.
- **Compliance scorers** (`src/compliance/`) — when a CBAM or ETS score comes back wrong, step through `emission-factors.ts` / `eu-benchmarks.ts` with live inputs rather than reasoning about it from logs.

---

## Security Posture (Must Not Skip)

Per `DWS_SECURITY_STANDARD.md` and the 2026-02-21 vulnerability assessment, treat `mcp-debugger` as a **privileged tool**. Reasons:

- A step-through debugger can read process memory, including environment variables and in-flight secrets.
- `evaluate` / expression evaluation is effectively arbitrary code execution inside the debuggee.
- Running it locally is fine; exposing it to a remote MCP client without auth is not.

Proposed guardrails before we adopt it in any production-adjacent flow:

1. **GREEN zone only** — local worktrees, never production or shared CI runners.
2. **No auto-install.** Add to `.mcp.json` explicitly, per the CLAUDE.md MCP rule; do not let a community skill or installer add it silently.
3. **Secret scan** — confirm `.claude/hooks/secret-scan.sh` covers `.mcp.json` entries referencing `@debugmcp/*` and that no API keys / tokens are passed as args.
4. **Audit trail** — any `mcp-debugger` session run against DWS code should be logged to the Article 12 ledger alongside the normal MCP tool trace.

---

## Open Questions

1. Does the debugger's `evaluate` tool respect the debuggee's sandbox, or is it unrestricted inside the process? (Needs a 30-min spike.)
2. Can we run `mcp-debugger` _as a sub-server_ of our existing `mcp-hub`, so a single MCP connection exposes both business tools and debug tools? This would simplify the agent's connection graph.
3. Integration with `docs/GITHUB_MCP_TOOLS.md` — when a CI job fails, can an agent attach `mcp-debugger` to a reproduction container and post the diagnosis back as a PR comment via `mcp__github__add_issue_comment`? This is the highest-leverage workflow if it works.

---

## Next Actions

- [ ] 30-minute local spike: install via `npx @debugmcp/mcp-debugger`, attach to a Firehorse Python job that's known to fail, verify breakpoint + variable inspection.
- [ ] Draft `.mcp.json` snippet (GREEN-zone worktree only) and add to `docs/GITHUB_MCP_TOOLS.md` appendix once verified.
- [ ] Re-read the aaif.io article (manual browser) and backfill §"Author's framing" in v1.1 — in particular, any concrete bug-hunting narratives that would sharpen the use-cases section.
- [ ] Security review against `DWS_SECURITY_STANDARD.md` before anything leaves the local worktree.

---

## Sources

- Canonical repo and README: https://github.com/debugmcp/mcp-debugger
- MCP debugging docs: https://modelcontextprotocol.io/docs/tools/debugging
- Anthropic MCP Inspector (comparison point): https://github.com/modelcontextprotocol/inspector
- Snyk write-up on Inspector (context): https://snyk.io/articles/how-to-debug-mcp-server-with-anthropic-inspector/
- Referring article (not readable from this environment — HTTP 403): https://aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/
