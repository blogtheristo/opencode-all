# Claude Code Agent Teams, Subagents & Cowork: Architecture Comparison

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: silly-bassi | Date: 05.02.2026 | Changes: Initial field note analyzing Claude Code Agent Teams feature

Document Status:
  - Created: 05.02.2026
  - Last Modified: 05.02.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Technical Analysis

Related Documents:
  - docs/thesis/MULTI_AGENT_COORDINATION_EN.md
  - AgentFoundry/DEPLOYMENT_GUIDE.md
  - docs/architecture/03-ORCHESTRATION-LAYER.md

---

## Summary

This field note analyzes Anthropic's agent architecture options for Claude:
1. **Agent Teams** (Experimental) - Multiple independent Claude instances coordinating
2. **Subagents** (Production) - Lightweight focused agents within a session
3. **Cowork** (Research Preview) - Claude Code for non-technical users with plugins

Understanding these options is critical for DWS6's AgentFoundry architecture decisions.

**Sources:**
- https://code.claude.com/docs/en/agent-teams
- https://simonwillison.net/2026/Jan/12/claude-cowork/

---

## Key Concepts

### Agent Teams (New - Experimental)

Agent Teams allow coordinating multiple **independent** Claude Code instances:

- **Team Lead**: Main session that creates, spawns, and coordinates teammates
- **Teammates**: Separate Claude instances with their own context windows
- **Shared Task List**: Centralized work items that teammates claim and complete
- **Mailbox**: Inter-agent messaging system

### Subagents (Existing)

Subagents run **within** a single session:

- Results return to the caller only
- Cannot communicate with each other
- Main agent manages all work
- Lower token cost (results summarized)

---

## Feature Comparison

| Aspect | Subagents | Agent Teams |
|--------|-----------|-------------|
| **Context** | Own window, results return to caller | Own window, fully independent |
| **Communication** | Report back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all | Shared task list, self-coordination |
| **Best For** | Focused tasks where only result matters | Complex work requiring discussion |
| **Token Cost** | Lower (summarized results) | Higher (each teammate = separate instance) |
| **Status** | Production | Experimental |

---

## Best Use Cases for Agent Teams

Based on the documentation, agent teams excel at:

1. **Research and Review**: Multiple investigators exploring different aspects simultaneously
2. **New Modules/Features**: Each teammate owns a separate piece
3. **Debugging with Competing Hypotheses**: Test different theories in parallel
4. **Cross-Layer Coordination**: Frontend, backend, tests owned by different teammates

### Example: Parallel Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Example: Debugging with Competing Hypotheses

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

---

## Architecture Details

### Team Structure

```
┌─────────────────┐
│   Team Lead     │ ← Creates team, spawns teammates, coordinates work
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    │         │            │
┌───┴───┐ ┌───┴───┐ ┌──────┴──────┐
│ Agent │ │ Agent │ │    Agent    │
│   A   │ │   B   │ │      C      │
└───────┘ └───────┘ └─────────────┘
    ↑         ↑           ↑
    └─────────┴───────────┘
         Inter-agent messaging
```

### Storage Locations

- **Team Config**: `~/.claude/teams/{team-name}/config.json`
- **Task List**: `~/.claude/tasks/{team-name}/`

### Display Modes

1. **In-process** (default): All teammates in main terminal, use Shift+Up/Down to select
2. **Split panes**: Each teammate in own pane (requires tmux or iTerm2)

---

## Enabling Agent Teams

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set environment variable:
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## Implications for DWS6 AgentFoundry

### Current DWS6 Architecture

DWS6 uses a three-tier agent ecosystem:
- **Category A**: Development agents (10) - Sprint-based
- **Category B**: Internal operations (7) - Continuous
- **Category C**: Customer-facing (5+) - Phased deployment

### Recommended Approach

| Scenario | Use |
|----------|-----|
| Single-task automation | Subagents |
| Multi-file refactoring | Agent Teams |
| Code review (security, performance, tests) | Agent Teams |
| Customer support agents | Subagents (cost-effective) |
| Research/investigation | Agent Teams |
| Sales automation (Apollo, LinkedIn) | Subagents |
| Complex debugging | Agent Teams |

### Integration with MCP Hub

The DWS6 MCP Hub (port 8765) already coordinates agents. Agent Teams could complement this by:

1. **Development Phase**: Use Agent Teams for parallel feature development
2. **Review Phase**: Spawn security, performance, and test reviewers
3. **Production**: Use subagents for cost-effective operations

### Proposed Hybrid Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DWS6 AGENT ORCHESTRATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  MCP HUB (Port 8765)                                      │  │
│  │  - Temporal.io workflow orchestration                     │  │
│  │  - Agent activity logging (Supabase)                      │  │
│  │  - Session persistence                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│           ┌────────────────┼────────────────┐                   │
│           ▼                ▼                ▼                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  SUBAGENTS  │  │AGENT TEAMS │  │   CUSTOMER AGENTS       │ │
│  │  (Quick,    │  │(Complex,   │  │   (AgentFoundry)        │ │
│  │   focused)  │  │ parallel)  │  │                         │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────────┤ │
│  │ • Research  │  │ • PR Review │  │ • Sales AI (Sonnet)     │ │
│  │ • Validation│  │ • Debugging │  │ • Support (Llama 3.1)   │ │
│  │ • One-shot  │  │ • Refactor  │  │ • Compliance (Haiku)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Limitations to Note

Current experimental limitations:
- No session resumption with in-process teammates
- Task status can lag behind
- Shutdown can be slow
- One team per session
- No nested teams
- Lead is fixed (cannot transfer leadership)
- Split panes require tmux or iTerm2

---

## Recommendations for DWS6

### Immediate (Can Enable Now)

1. **Enable experimentally** for development sessions:
   ```json
   // .claude/settings.json
   {
     "env": {
       "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
     }
   }
   ```

2. **Use for code reviews**: Security + Performance + Tests reviewers

3. **Use for complex debugging**: Competing hypothesis investigation

### Short-term (Q1 2026)

1. **Document patterns**: Create AgentFoundry playbooks for team vs subagent decisions
2. **Monitor costs**: Track token usage differences between approaches
3. **Integrate with MCP Hub**: Log team activities alongside subagent activities

### Medium-term (Q2 2026)

1. **Evaluate GA status**: Reassess when agent teams exit experimental
2. **Customer agent migration**: Consider if customer-facing agents benefit from teams
3. **Temporal.io integration**: Orchestrate team spawning through Temporal workflows

---

---

## Appendix: Claude Cowork (January 2026)

### What is Claude Cowork?

Claude Cowork is Anthropic's general-purpose agent tool - essentially "Claude Code for the rest of your work". It repackages Claude Code for non-technical users through a dedicated tab in the Claude Desktop app.

### Key Features

- **Filesystem Sandbox**: Users designate a specific folder where Claude can read/modify files
- **Natural Language Interface**: No terminal knowledge required
- **Containerized Execution**: Uses Apple's VZVirtualMachine framework (Linux container)
- **Autonomous Task Execution**: Multi-step tasks with user consent

### Availability

| Plan | Access |
|------|--------|
| Max ($100-200/mo) | Full access |
| Pro ($20/mo) | Full access |
| Free | Waitlist |

### Use Cases

- Expense reports from receipt photos
- Media file management
- Document analysis and drafting
- Social media scanning
- Conversation analysis

### Plugins (February 2026)

Anthropic added plugin support for specialized workflows:
- **Legal Plugin**: Contract analysis, document review
- **Sales Plugin**: CRM integration, lead analysis
- **Finance Plugin**: Financial document processing

### Relevance to DWS6

| Cowork Feature | DWS6 Application |
|----------------|------------------|
| Document analysis | Climate compliance document scanning |
| File organization | Carbon report consolidation |
| Multi-step tasks | EN 15978 calculation workflows |
| Plugins | Potential DWS6 compliance plugin |

### DWS6 Plugin Opportunity

A **DWS6 Compliance Plugin** for Claude Cowork could offer:
- EU regulation document scanning (CSRD, EPBD, ETS, CBAM)
- Carbon footprint calculation from receipts/invoices
- Compliance checklist generation
- Integration with Firehorse Report

**Market Opportunity**: 25+ EU industries need simplified compliance tools. Non-technical sustainability managers could use Cowork + DWS6 plugin instead of full dashboard.

### Security Considerations

- Filesystem sandboxing isolates from host system
- Prompt injection risk from internet content
- Avoid sensitive files (API keys, credentials)
- Monitor for suspicious activities

---

## References

- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents)
- [First impressions of Claude Cowork](https://simonwillison.net/2026/Jan/12/claude-cowork/) - Simon Willison
- [Anthropic's Cowork Tool](https://techcrunch.com/2026/01/12/anthropics-new-cowork-tool-offers-claude-code-without-the-code/) - TechCrunch
- [Anthropic Cowork Plugins](https://www.pymnts.com/news/artificial-intelligence/2026/anthropic-says-new-cowork-plugins-tailor-claude-specific-job-functions/) - PYMNTS
- DWS6 Multi-Agent Coordination: `docs/thesis/MULTI_AGENT_COORDINATION_EN.md`
- AgentFoundry Deployment: `AgentFoundry/DEPLOYMENT_GUIDE.md`

---

## Action Items

- [ ] Enable agent teams in worktree settings
- [ ] Test with next PR review
- [ ] Update thesis documentation with comparison
- [ ] Create decision matrix for team vs subagent selection
- [ ] Document token cost comparison

---

**Document Version:** 1.0
**Field Note Type:** Technical Analysis
**Author:** Claude Code Session silly-bassi
