***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Extracted from AGENTS.md §10 as part of agents-md-slim refactoring

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

# Lifetime Scope Signals Protocol

Extracted from AGENTS.md §10. Development agent coordination via file-based signals.

---

## Signal Format

```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

| Component | Description |
|-----------|-------------|
| `AGENT-XX` | Agent identifier (e.g., `AGENT-01`, `AGENT-07`) |
| `SIGNAL_TYPE` | `READY` / `COMPLETE` / `ERROR` / `BLOCKED` |
| `MILESTONE` | Specific deliverable (e.g., `supabase-auth`) |
| `TIMESTAMP` | ISO 8601 |

## Signal Commands

```bash
cd .workflows/agents
node coordinator.cjs status                         # All statuses
node coordinator.cjs ready                          # Ready to launch
node coordinator.cjs emit agent-07 READY:rls-policies  # Emit signal
```

## Dependency Map

```
PHASE 1 (Foundation)
├── Agent-01 (Auth)      → READY:supabase-auth
├── Agent-07 (Database)  → READY:rls-policies, READY:schema-users
└── Agent-10 (Docs)      → READY:api-docs
         │
PHASE 2 (Core Backend)
├── Agent-02 (Firehorse) ← Agent-01, Agent-07
├── Agent-04 (AI Agents) ← Agent-07
└── Agent-09 (Email)     ← Agent-07
         │
PHASE 3 (Frontend)
├── Agent-03 (Dashboard) ← Agent-02, Agent-04
└── Agent-05 (Mobile)    ← Agent-02, Agent-04
         │
PHASE 4 (Enhancements)
├── Agent-08 (Payments)  ← Agent-01, Agent-07
└── Agent-06 (Enterprise) → DEFERRED V1.1
```
