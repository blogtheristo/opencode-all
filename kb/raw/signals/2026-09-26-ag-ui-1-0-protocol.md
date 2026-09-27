# Signal: AG-UI 1.0 — agent-to-user protocol (2026-09-17)

**Field Note:** `docs/field-notes/2026-09-26-ag-ui-protocol-dws6-fit.md`
**Branch:** `claude/agui-protocol-dws6-jjojli`
**Status:** Decision Q1 open (HIC)

## Summary

- **What AG-UI is.** An open, event-based protocol from an agent backend to a user interface. The client makes one HTTP POST with `RunAgentInput`, and the server answers with an SSE or protobuf event stream.
- **Licence and governance.** MIT. CopilotKit originated it, and it has no foundation home yet.
- **1.0 release.** Shipped 2026-09-17 for TypeScript (`@ag-ui/core`), Python (`ag-ui-protocol`) and .NET (`AGUI.Server` and four sibling packages). Verified in the registries.
- **Adopters.** Microsoft Agent Framework now uses the first-party .NET SDK. Google ADK, AWS Strands, Mastra, Pydantic AI, LangGraph and CrewAI are listed as integrations.
- **How it fits with other protocols.** MCP connects an agent to tools, A2A connects agents to each other, and AG-UI connects an agent to the user. Generative-UI specs such as A2UI, MCP-UI and MCP Apps travel over AG-UI.
- **Human-in-the-loop.** The run ends with `outcome: interrupt` and a JSON Schema for the answer. The client resumes by starting a new run with `resume[]`.

## DWS relevance

- DWS6 agents return one JSON response and do not stream. The V10 dashboard polls every 30–60 s. KYA verdicts are never shown to the user.
- AG-UI would make runs and governance visible and interoperable. The proposed Phase 1 is an additive SSE endpoint `POST /api/agents/:name/agui`.
- The main risk is governance, since one vendor steers the protocol. Mitigation: pin 1.0.x and keep all AG-UI code behind a single adapter file.
