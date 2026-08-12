# Field Note: MCP Debugging — The Authorization Layer Is the Hardest Part

***

# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Opus 4.7) | Session: claude/add-mcp-debugging-note-fDXoJ | Date: 24.04.2026 | Changes: Initial field note. Drafted around debugmcp/mcp-debugger (a DAP-based step-through debugger) because the referring article aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/ returned HTTP 403 and I assumed the wrong tool from the URL slug.
- Version: 2.0 | Tool: Claude Code (Claude Opus 4.7) | Session: claude/add-mcp-debugging-note-fDXoJ | Date: 24.04.2026 | Changes: Major rewrite after human pasted the actual article text. Subject corrected to mcpdebugger.dev (a protocol-conformance scanner built on modelcontextprotocol/conformance), not debugmcp/mcp-debugger. Article author identified as a founding engineer at Arcade.dev with an OAuth/OpenID Connect background. Three failure buckets, conformance feedback-loop pattern, and DWS CI implication added. Step-through debugger kept as a sidebar — different layer, also useful, original analysis preserved.

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
- DWS_SECURITY_STANDARD.md
- Admin/ADMIN_MANUAL.md (Section 30 — Safety Hooks)

***

## Ontology Tags

- **Geography:** Global > MCP open-source ecosystem
- **Sector:** Technology > AI/ML > Protocol tooling > Security & conformance
- **Entities:** Nate Barbettini (Arcade.dev), mcpdebugger.dev, modelcontextprotocol/conformance, Arcade.dev, Anthropic, Model Context Protocol, OAuth 2.1, PKCE, Simon Willison ("lethal trifecta"), debugmcp/mcp-debugger (sidebar)
- **Temporal Context:** 2026-Q2, MCP authorization spec stabilising, agent-as-OAuth-client patterns emerging
- **Confidence:** Medium-High — article text now verified (human-pasted). mcpdebugger.dev itself returned HTTP 403 to automated fetch, so no first-hand UI review.

---

## Referring Article

**"Debugging the Hardest Parts of MCP with MCP Debugger"** — published 2026-04-24
URL: https://aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/
Author: **Nate Barbettini** — Founding Engineer at Arcade.dev, building on the cutting edge of AI. Known for explaining OAuth and OpenID Connect in plain English; brings that authentication / web-security background directly into the MCP authorization problem space.

The article was inaccessible from this environment (HTTP 403 to both automated fetch and `curl`); content here is grounded in two excerpts the human pasted into the working session, plus the verified upstream sources (`modelcontextprotocol/conformance` repo, `mcpdebugger.dev` search snippets).

---

## What `mcpdebugger.dev` Actually Is

A hosted scanner that points at any MCP server URL and behaves like a real client would: connects, runs the authorization flow, discovers tools, inspects metadata, and runs protocol-level validation. It produces a graded report.

The architecturally interesting part is what it builds on: **`modelcontextprotocol/conformance`**, the upstream open-source test suite that defines what protocol-correct means. The scanner runs many of its checks directly from that suite, and the author has already contributed checks back. That's a real two-way feedback loop — field deployment surfaces failures, failures become upstream checks, every other implementer benefits.

> "What excites me most is the feedback loop this creates: MCP Debugger sees the messy real-world failures that happen when clients and servers actually meet, and those lessons can flow back upstream into the conformance suite as new checks and improvements."
> — aaif.io article, 2026-04-24

The conformance suite itself is runnable directly: `npx @modelcontextprotocol/conformance` (server and client modes, scenario-based, 30s default timeout).

---

## The Three Failure Buckets (Verbatim from the Article)

### 1. Authorization flows that don't work end-to-end (largest category)

> "A server might expose the right endpoints, but still fail because metadata is incomplete, URLs are inconsistent, PKCE handling is off, or a required part of the flow is implemented in a way that does not match what clients expect."

The author calls these "almost-correct implementations" — passes a smoke test, fails a real client. The relevant standards stack is bigger than people assume: **OAuth 2.1, PKCE, protected resource metadata, CIMD, and several pieces of machine-readable metadata that all have to line up.** Miss one and the whole flow breaks.

### 2. Tool metadata that leaves too much room for guessing

> "If descriptions are vague, schemas are incomplete, or parameters are underspecified, the model has to guess. And when a model guesses, it can guess wrong."

A reachable, technically-functional server can still be unusable to agents because the metadata doesn't constrain the model enough. This is a quality-of-tool issue, not a protocol issue, but the scanner surfaces it because it's what an agent-as-client would experience.

### 3. The spec as a moving target

> "Server frameworks and SDKs can have hidden gaps, especially soon after a new spec version is released. Many clients also have gaps, which makes it hard for teams to know whether a failure is due to their own bug, an outdated assumption, a client problem, or something else."

This is the meta-failure — without a shared conformance baseline, every team triages alone. The scanner + conformance suite are the answer.

---

## Why Authorization Is the Hardest Part

The article makes a point worth keeping in mind:

> "Risks like the lethal trifecta mean that getting MCP security right matters a lot, but that doesn't mean it is easy. Even with a deep background in OAuth and API security, getting this right in practice can be very hard."

The "lethal trifecta" (Simon Willison's framing): an agent with (1) access to private data, (2) exposure to untrusted content, and (3) ability to externally communicate. All three converge in any production MCP deployment that authenticates a real user. Getting OAuth right is not optional and not easy.

---

## DWS-Specific Implications

1. **`npx @modelcontextprotocol/conformance` belongs in the CI of every DWS MCP server.** We ship `mcp-hub/` and `mcp-servers/`. Free, official, no third-party dependency, no data leaves the worktree. This is the highest-leverage action from this article.
2. **If/when we expose an MCP server publicly with OAuth** (sovereignty story for `Aegis`/EU-hosted), point `mcpdebugger.dev` at the staging URL before the production URL. The third-party scanner is fine for an exposed surface — it's already public.
3. **Tool metadata is product copy, not just plumbing.** The "guessing" failure mode (bucket #2) means our `dws agents` registry and the descriptions in our MCP `tools/list` outputs are user-facing for the LLM. They deserve the same scrutiny as Store product descriptions. Worth a pass through the existing servers.
4. **Audit our OAuth surface against the listed standards: OAuth 2.1, PKCE, protected resource metadata, CIMD.** The CLAUDE.md MCP rule already bans GitHub PATs ("OAuth only"); the same posture extends here. If we author an MCP server that does OAuth, get an OAuth specialist (or Arcade.dev tooling) to review it.
5. **Watch the conformance suite as the upstream.** Pin the version in CI, treat suite version bumps as security-relevant — they encode new lessons from the field that our servers may not yet pass.

---

## Sidebar — Different Layer, Different Tool: `debugmcp/mcp-debugger`

The original v1.0 of this note was built around `debugmcp/mcp-debugger` (https://github.com/debugmcp/mcp-debugger), which is a separate project despite the similar name. It's a DAP-based step-through debugger exposed as an MCP server — six language adapters (Python/debugpy, JS/js-debug, Rust/CodeLLDB, Go/Delve, Java/JDI, .NET/netcoredbg), ~20 tools (`set_breakpoint`, `step_over`, `get_variables`, etc.), runnable as `npx @debugmcp/mcp-debugger`.

The two tools sit at different layers and both have a place at DWS:

| Layer       | Question it answers                                  | Tool                          |
| ----------- | ---------------------------------------------------- | ----------------------------- |
| Protocol    | Is this server spec-compliant and OAuth-correct?     | mcpdebugger.dev + conformance |
| Application | Is the code behind the tool handler logically right? | debugmcp/mcp-debugger         |

Security caveat for the application-layer debugger (preserved from v1.0): a step-through debugger reads process memory and `evaluate` is effectively arbitrary code execution inside the debuggee. Local worktree only, never on shared/production runners, never auto-installed.

---

## Open Questions

1. Does `npx @modelcontextprotocol/conformance` cover OAuth 2.1 + PKCE + protected resource metadata fully today, or is mcpdebugger.dev's strength specifically that it has _more_ checks than the upstream right now (because of the contribution lag)? If the latter, our CI gate is partial and we should track which checks the scanner runs that the suite doesn't.
2. Is "CIMD" (cited verbatim in the article) Client-Initiated Metadata Discovery, or does Arcade.dev use the term differently? Worth confirming before citing it in a DWS standard doc.
3. Does mcpdebugger.dev offer a self-hosted or CLI variant? A hosted scanner that ingests our staging URLs is a data-residency question for EU sovereignty claims.
4. Article-loop: can we get the aaif.io author's permission to cite the three-buckets framing in `DWS_SECURITY_STANDARD.md`?

---

## Next Actions

- [ ] Add `npx @modelcontextprotocol/conformance` to one MCP server's CI as a pilot; measure friction before rolling out repo-wide.
- [ ] Audit existing MCP server `tools/list` outputs for bucket #2 (vague descriptions, underspecified params).
- [ ] If/when we add OAuth to a DWS-authored MCP server, run mcpdebugger.dev against staging before production cutover.
- [ ] Resolve open question #2 (CIMD term) before referencing in any standard.
- [ ] Backfill: read the aaif.io article in a real browser when convenient; verify nothing material was missed in the pasted excerpts.

---

## Sources

- Article (referring): https://aaif.io/blog/debugging-the-hardest-parts-of-mcp-with-mcp-debugger/ (HTTP 403 from this environment; content captured from human-pasted excerpts)
- Scanner: https://mcpdebugger.dev/ (HTTP 403 from this environment)
- Upstream conformance suite: https://github.com/modelcontextprotocol/conformance
- Conformance Testing SEP: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1627
- Adjacent — protocol scanner alternative: https://mcpscan.dev/
- Adjacent — official visual tester: https://github.com/modelcontextprotocol/inspector
- Sidebar — application-layer step-through debugger: https://github.com/debugmcp/mcp-debugger
- Author: Nate Barbettini — https://arcade.dev/ (Founding Engineer)
