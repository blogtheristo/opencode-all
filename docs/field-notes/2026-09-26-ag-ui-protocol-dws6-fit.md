# AG-UI 1.0 — agent-to-user protocol fit for DWS6 — 2026-09-26

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/agui-protocol-dws6-jjojli | Date: 26.09.2026 | Changes: Initial note — AG-UI 1.0 state, DWS6 gap map, adoption design, decision Q1.

Document Status:

- Created: 26.09.2026
- Last Modified: 26.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-26
- **Author:** Claude Code, on behalf of Lifetime Oy
- **Location:** DWS6 repository, cloud session
- **Context:** HIC 26.09.2026: "AGUI protocol into dws6. Field note + decision", plus the Microsoft .NET blog link `https://devblogs.microsoft.com/dotnet/ag-ui-dotnet-sdk/`.

Standards loaded: `docs/system-config/STANDARDS_ROUTING.md`, `DWS_TRUTH_STANDARD.md`, `DWS_ROLES_REGISTRY.md`, `DWS_LEARNING_STANDARD.md` (§4, §10), `DWS_SECURITY_STANDARD.md` (grep: prompt injection, SSE), `AI_AGENT_GUIDELINES.md` (grep: streaming/events), `docs/field-notes/README.md`.

## Ontology Tags

- **Geography:** Global (protocol); Europe > Finland (DWS deployment)
- **Sector:** AI agent platforms > Agent-user interface protocols
- **Entities:** AG-UI, CopilotKit, Microsoft Agent Framework, Google ADK, AWS Strands, Amazon Bedrock AgentCore, MCP, A2A, A2UI, MCP Apps, DWS IQ 6, Firehorse V10 dashboard
- **Systems:** `src/agents/base.agent.ts`, `src/agents/routes.ts`, `src/mcp/agent-server.ts`, `dws6.com/dashboard/firehorse/v10-react/`, `src/security/runtime-auth.ts`, `src/temporal/workflows/human-approval.workflow.ts`
- **Temporal Context:** 2026-Q3 (AG-UI 1.0 released 2026-09-17)
- **Confidence:** High on versions and the DWS6 code map (read directly). Medium on adoption claims (from the upstream README; integration maturity not tested).

## The Story

1. **AG-UI reached 1.0 nine days ago.**
   - A single release on 2026-09-17 took the TypeScript, Python and .NET SDKs to 1.0.0.
   - 1.0 adds a normative spec in RFC 2119 language, one JSON Schema that generates every SDK, and a conformance harness.
   - Pre-1.0 compatibility shims expire on 2027-09-17.
2. **Microsoft now ships and consumes a first-party .NET SDK.**
   - There are five NuGet packages: `AGUI.Abstractions`, `AGUI.Formatting`, `AGUI.Protobuf`, `AGUI.Client` and `AGUI.Server`.
   - Microsoft Agent Framework has replaced its own internal implementation with these packages. `MapAGUI` is renamed `MapAGUIServer`, and the wire format is unchanged.
3. **What AG-UI is.**
   - The client sends one HTTP POST containing `RunAgentInput` (`threadId`, `runId`, `messages`, `state`, `tools`, `context`, `forwardedProps`, `resume`).
   - The server answers with an ordered event stream, either SSE or length-prefixed protobuf. The event types are:
     - lifecycle and steps;
     - text messages, streamed token by token;
     - tool calls;
     - state snapshots and JSON-Patch (RFC 6902) deltas;
     - reasoning;
     - subagents;
     - activity;
     - raw and custom events.
   - Human-in-the-loop works as an interrupt:
     - The run ends with `RUN_FINISHED` carrying `outcome.type = "interrupt"` and a JSON Schema for the answer.
     - The client resumes by starting a new run with `resume[]`.
4. **Where it sits among the other protocols.**
   - MCP connects an agent to tools and data. A2A connects agents to each other. AG-UI connects an agent to the user's interface.
   - A2UI, MCP-UI and MCP Apps define generative-UI payloads, and AG-UI is the channel that carries them. The three protocols complement each other rather than compete.
5. **DWS6 today.**
   - **Agents return a single JSON response at the end.** Nothing streams.
     - `BaseAgent.execute()` returns one `Promise<AgentResponse>` (`src/agents/base.agent.ts:73`).
     - `runLoop()` (`:89`) collects every iteration and returns them only when the loop ends. There is no per-step callback.
     - `POST /api/agents/:name/chat` (`src/agents/routes.ts:276`) returns `{reply, confidence, agentName}` as plain JSON.
   - **The V10 React dashboard calls agents with plain `fetch` and refreshes on 30–60 s timers.**
     - Callers: `AgentChat.tsx:95`, `QuickActions.tsx:89`.
     - There is no `EventSource` or WebSocket client anywhere in `v10-react/src`.
     - `ai@^6` and `@ai-sdk/react` are in `package.json` but nothing imports them.
   - **Three SSE endpoints exist, but none streams a single agent run.**
     - The event-bus firehose at `src/mcp/agent-server.ts:917`.
     - The activity stream at `src/routes/activity.routes.ts:183`.
     - The Cloudflare MCP gateway at `src/cloudflare/mcp-gateway.ts`.
   - **Human approval is asynchronous, outside the agent loop.**
     - It runs through Temporal (`src/temporal/workflows/human-approval.workflow.ts`), token links (`src/routes/hil.routes.ts`) and a review queue that polls every 60 s.
     - A run cannot pause for approval and then resume.
   - **Every tool call already passes a policy check and a trace.**
     - Each call goes through `authorizeToolCall()` (`src/security/runtime-auth.ts:284`) and is wrapped in `withToolSpan()` (`src/observability/tracing.ts:226`).
     - Neither the check nor the trace reaches the user's screen.
   - **The codebase does not use AG-UI or the A2A protocol.**
     - The `agui` string match in `Firehorse/mobile-app/package-lock.json` is inside a sha512 hash.
     - "A2A-style discovery" in `src/agents/index.ts:132` is capability lookup, not the A2A protocol.
     - There is no `/.well-known/agent.json`.

## The Insight

1. **The gap is real and it affects buyers.**
   - A DWS agent run is invisible until it finishes. The user sees a spinner, then a block of text.
   - The KYA verdict on each tool call, which is the governance story we sell to CISO / Head of InfoSec (R15/R16), never reaches the screen.
   - AG-UI's `TOOL_CALL_*`, `STEP_*` and `CUSTOM` events are the standard way to show it live.
2. **The interrupt pattern matches DWS HIC practice.**
   - The run stops with a typed question and resumes only on an explicit human answer, validated against a JSON Schema.
   - In code, this is EU AI Act Art. 14 oversight: a stoppable run with an answer shape the machine can check.
   - It can sit in front of the existing Temporal approval flow without replacing it.
3. **It is self-hostable and has no runtime dependency on a vendor.**
   - The protocol is HTTP POST plus SSE, and the SDKs are MIT-licensed.
   - Nothing in the protocol requires CopilotKit Cloud or any hosted service.
   - That fits the Aegis / sovereignty positioning. An EU customer runs it inside their own boundary.
4. **Governance is the one real risk.**
   - CopilotKit, a single US startup, still steers the protocol. The repo has no foundation and no governance file.
   - MCP and A2A are under the Linux Foundation; AG-UI is not.
   - Mitigation: depend only on `@ag-ui/core` and `@ag-ui/encoder` (types plus the encoder), pin 1.0.x, and keep the DWS event producer behind one adapter file. If the protocol stalls, the adapter is the only thing to replace.
5. **Security: the protocol leaves enforcement to us.**
   - Treat everything the client sends as untrusted input: `RunAgentInput.state`, `tools`, `forwardedProps` (untyped) and `messages`.
   - Validate all of it with Zod before it reaches `runLoop` (Non-Negotiable Rule 8, Security Coding Rules).
   - Keep secrets out of `state`, because state round-trips through the browser on every run.
   - Put auth in Express middleware: the existing `authenticateToken` plus org scoping.
6. **Why AG-UI rather than the Vercel AI SDK stream.** The V10 dashboard already lists the Vercel AI SDK, so its data stream is the obvious alternative. It is a library format, not a protocol:
   - It has no interrupt or resume semantics.
   - It has no state-delta contract.
   - It is not a server-side standard in Microsoft, Google or AWS agent stacks.
   - AG-UI lists Vercel AI SDK integrations, so the dashboard need not rewrite its React layer to adopt AG-UI.
7. **The sales and investor angle, stated honestly.**
   - "DWS agents speak AG-UI" means any AG-UI client can drive a DWS agent. That includes Microsoft Agent Framework front-ends, CopilotKit UIs and AgentCore-style hosts.
   - That is interoperability evidence for R13 CIO (vendor consolidation) and a credible line for investors.
   - Claim it only after the endpoint passes the upstream conformance harness. Until then it is "in progress", not a feature (Truth Standard).

### Proposed design (not implemented; awaiting Q1)

| #   | Change                                                                                                                                                                                                     | Files                                              | Size       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------- |
| 1   | Optional `onEvent?(e)` hook on `runLoop` to emit step start/end, text, tool-call start/args/result, and the KYA verdict (as `CUSTOM` `dws.kya.verdict`). Default no-op, so existing callers do not change. | `src/agents/base.agent.ts`                         | ~40 lines  |
| 2   | Adapter mapping DWS loop events to AG-UI 1.0 events via `@ag-ui/core` types plus `@ag-ui/encoder`                                                                                                          | `src/agents/agui/adapter.ts` (new)                 | ~120 lines |
| 3   | `POST /api/agents/:name/agui` (SSE). Zod-validated `RunAgentInput`, `authenticateToken`, org scoping, timeout exemption as for the existing SSE route. Additive: `/chat` and `/execute` stay.              | `src/agents/routes.ts`                             | ~60 lines  |
| 4   | Interrupt bridge: a tool gated `requireApproval` ends the run with `outcome: interrupt` and records it in the Temporal approval workflow; `resume[]` signals the workflow.                                 | `src/temporal/approvals.ts`, adapter               | Phase 2    |
| 5   | V10 `AgentChat.tsx` uses `@ag-ui/client` `HttpAgent` behind a feature flag; `/chat` stays as fallback                                                                                                      | `dws6.com/dashboard/firehorse/v10-react/` + mirror | ~80 lines  |
| 6   | Tests: event-order contract (RUN_STARTED first, exactly one terminal event), Zod rejection of bad input, org isolation, and the upstream conformance harness                                               | `src/agents/agui/*.test.ts`                        | ~150 lines |

Phase 1 is rows 1–3 plus 6: one agent, one endpoint, SSE only. Protobuf, WebSocket, A2UI generative UI and an A2A agent card are out of scope.

### Provenance (DWS_LEARNING_STANDARD §10.4)

**Verified this session:**

- **Versions and licence.** Read from the npm registry, the PyPI JSON API and the NuGet v3 registration API:
  - `@ag-ui/core` 1.0.0, published 2026-09-17T18:27Z, MIT.
  - `ag-ui-protocol` (PyPI) 1.0.0, published 2026-09-17T18:31Z.
  - `AGUI.Server` 1.0.0, published 2026-09-17T18:47Z, MIT.
- **.NET target frameworks.** `AGUI.Server` targets net8.0, net9.0 and net10.0.
- **Event enum, `RunAgentInput` shape, interrupt semantics, transports and security clauses.** Read from a clone of `github.com/ag-ui-protocol/ag-ui` (`docs/spec/1.0`, `sdks/typescript/packages/core/src/generated/`).
- **DWS6 code map.** Every `file:line` above was read in this repo.

**Propagated (not independently checked):**

- **The Microsoft devblog itself.**
  - The network proxy blocked both devblogs.microsoft.com and copilotkit.ai.
  - The five package names and the `MapAGUI`→`MapAGUIServer` rename come from search-result summaries.
  - The ".NET Framework 4.7.2" support claim **conflicts** with the verified NuGet target frameworks (net8/9/10 only, no netstandard). Treat it as false until the package shows a netstandard2.0 build.
- **Amazon Bedrock AgentCore native AG-UI support** (March 2026, 14 regions).
- **Integration maturity.** The upstream README lists these integrations as "supported"; none was tested here.
- **CopilotKit funding ($27M).**
- **"No foundation home".** The repo has no governance file (verified); the claim itself is a secondary source.

## Next Steps

### HIC decision (branch-scoped counter starts here: Q1)

```
Q1. Adopt AG-UI 1.0 as the DWS6 agent-to-UI wire protocol, starting with a Phase-1 SSE endpoint?
    Options:       A) Phase 1 now: additive POST /api/agents/:name/agui behind a flag, one agent
                      (AgentChat in V10), pinned @ag-ui/core + @ag-ui/encoder 1.0.x, behind one adapter file.
                   B) Wait until AG-UI moves to a neutral foundation (LF / Agentic AI Foundation); keep JSON + polling.
                   C) Use the Vercel AI SDK data stream already listed in the V10 dashboard (no protocol, no interrupts).
    (RECOMMEND:    A. The gap (invisible runs, invisible KYA verdicts) is real today. The protocol is MIT and
                   self-hosted. Microsoft, Google and AWS agent stacks already emit it. The adapter isolates the
                   governance risk. Confidence: medium-high.)
    Reversibility: two-way door. Additive route + feature flag; delete the adapter and the flag to undo.
                   The ONE-WAY part is the public claim "DWS agents speak AG-UI". Hold it until the conformance
                   harness passes (cooling gap, §10.3.1).
    Unblocks:      live streaming in V10 chat; KYA verdicts visible per tool call; later the interrupt bridge
                   onto Temporal approvals; an interoperability line for CIO/CISO decks.
    Cost of delay: V10 keeps 30–60 s polling and a spinner; each new agent built on single-response execute()
                   adds retrofit work.
    Rests on:      verified: versions, licence, spec text, DWS6 code map. Propagated: MS devblog details,
                   AgentCore support, integration maturity, governance status.
```

### After the answer

- **If A:**
  - Implement Phase 1 on this branch: rows 1–3 and 6 of the design table.
  - Run `npm run build`, `npm test` and the upstream conformance harness.
  - Open a PR.
  - Truth-check any AG-UI claim before it reaches `dws10.com`.
- **If B:** Add a quarterly watch item on AG-UI governance and change nothing in code.
- **If C:** Record why interrupts were dropped, and keep the Temporal flow as the only approval path.

### Learning-outcome steps (DWS_LEARNING_STANDARD §4)

- Step 1 KB: `kb/raw/signals/2026-09-26-ag-ui-1-0-protocol.md`.
- Step 2 field note: this file.
- Step 3 Learn HTML: `Learn/2026-09-26-ag-ui-protocol-dws6-fit.html`.
- Step 4 Drive export: see the session reply; if not done, the reason is recorded there.
- Step 5: Q1 above.
- Step 6 calendar: N/A. The session produced no DWS-owned dated commitment. The upstream shim expiry (2027-09-17) only matters if DWS adopts a pre-1.0 SDK, and the design pins 1.0.x.
