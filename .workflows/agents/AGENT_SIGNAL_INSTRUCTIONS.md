***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Instructions for running agents to use Lifetime Scope Signals

Document Status:
  - Created: 03.01.2026
  - Last Modified: 03.01.2026
  - Language: English
  - Publication Status: Active
  - Document Type: Operational Guide
---

# Agent Signal Instructions
## How Running Agents Use Lifetime Scope Signals

**Status:** Phase 1 agents (1, 7, 10) are RUNNING  
**Updated:** January 3, 2026

---

## Quick Reference

### Emit a Signal (when you complete a milestone)

```bash
cd .workflows/agents
node coordinator.cjs emit <agent-id> <signal>
```

### Check Status

```bash
node coordinator.cjs status    # All agent statuses
node coordinator.cjs ready     # Which agents are unblocked
node coordinator.cjs signals   # View signal history
```

---

## Currently Running Agents

### 🔐 Agent-01: DWS IQ Login System

**Your pending signals (emit when complete):**

| Signal | When to Emit | Command |
|--------|--------------|---------|
| `READY:jwt-service` | JWT token generation/validation works | `node coordinator.cjs emit agent-01 READY:jwt-service` |
| `READY:auth-middleware` | Auth middleware protects routes | `node coordinator.cjs emit agent-01 READY:auth-middleware` |
| `READY:supabase-auth` | Supabase Auth integration complete | `node coordinator.cjs emit agent-01 READY:supabase-auth` |
| `READY:login-ui` | Login/signup UI components work | `node coordinator.cjs emit agent-01 READY:login-ui` |
| `READY:oauth-google` | Google OAuth flow works | `node coordinator.cjs emit agent-01 READY:oauth-google` |
| `READY:oauth-microsoft` | Microsoft OAuth flow works | `node coordinator.cjs emit agent-01 READY:oauth-microsoft` |
| `COMPLETE:v1-auth` | ALL auth features complete | `node coordinator.cjs emit agent-01 COMPLETE:v1-auth` |

**Critical Signal:** `READY:supabase-auth` unblocks Agent-02, Agent-03, Agent-05, Agent-08

---

### 🗄️ Agent-07: Supabase Database

**Your pending signals (emit when complete):**

| Signal | When to Emit | Command |
|--------|--------------|---------|
| `READY:schema-users` | Users table with RLS policies deployed | `node coordinator.cjs emit agent-07 READY:schema-users` |
| `READY:schema-orgs` | Organizations/teams tables deployed | `node coordinator.cjs emit agent-07 READY:schema-orgs` |
| `READY:rls-policies` | All RLS policies working correctly | `node coordinator.cjs emit agent-07 READY:rls-policies` |
| `READY:seed-data` | Seed/test data available | `node coordinator.cjs emit agent-07 READY:seed-data` |
| `COMPLETE:v1-database` | ALL database work complete | `node coordinator.cjs emit agent-07 COMPLETE:v1-database` |

**Critical Signals:**
- `READY:rls-policies` → Unblocks Agent-02, Agent-04
- `READY:schema-users` → Unblocks Agent-09

---

### 📚 Agent-10: Documentation

**Your pending signals (emit when complete):**

| Signal | When to Emit | Command |
|--------|--------------|---------|
| `READY:api-docs` | API documentation published | `node coordinator.cjs emit agent-10 READY:api-docs` |
| `READY:integration-guides` | Integration guides written | `node coordinator.cjs emit agent-10 READY:integration-guides` |
| `COMPLETE:v1-docs` | ALL documentation complete | `node coordinator.cjs emit agent-10 COMPLETE:v1-docs` |

**Note:** Documentation signals don't block other agents, but are required for V1.0 launch.

---

## Signal Emission Workflow

### Step 1: Complete Your Milestone

Work on the feature until it's ready. Test it properly.

### Step 2: Emit the Signal

```bash
cd "d:\Proton\My files\2026\Repos2026\dws6\.workflows\agents"
node coordinator.cjs emit agent-07 READY:schema-users
```

### Step 3: Verify the Signal

```bash
node coordinator.cjs signals  # See your signal in the log
node coordinator.cjs ready    # See newly unblocked agents
```

### Step 4: Notify Other Agents (Optional)

After emitting a critical signal, downstream agents will be unblocked. They can check with `node coordinator.cjs ready`.

---

## Phase 1 → Phase 2 Unlock Conditions

For Phase 2 agents to start:

| Phase 2 Agent | Required Signals |
|---------------|------------------|
| Agent-02 (Firehorse) | `agent-01:READY:supabase-auth` + `agent-07:READY:rls-policies` |
| Agent-04 (AI Agents) | `agent-07:READY:rls-policies` |
| Agent-09 (Email) | `agent-07:READY:schema-users` |

**Fastest path to unlock Phase 2:**
1. Agent-07 emits `READY:schema-users` → Unblocks Agent-09
2. Agent-07 emits `READY:rls-policies` → Unblocks Agent-04
3. Agent-01 emits `READY:supabase-auth` + Agent-07 has `READY:rls-policies` → Unblocks Agent-02

---

## Example: Agent-07 Emitting a Signal

```bash
# Agent-07 just finished the users schema with RLS

cd "d:\Proton\My files\2026\Repos2026\dws6\.workflows\agents"

# Emit the signal
node coordinator.cjs emit agent-07 READY:schema-users

# Output:
# ✅ Signal emitted: [AGENT-07]:READY:schema-users
#
# 🚦 AGENTS READY TO LAUNCH
#
# ✅ Ready to launch:
#    AGENT-09: Email System
#
# ⏳ Blocked (waiting for signals):
#    AGENT-02: Firehorse Apps
#       Needs: agent-01:READY:supabase-auth
#    ...

# Check status
node coordinator.cjs status
```

---

## Troubleshooting

### "Signal not in pending list"

You're trying to emit a signal that's not expected. Check available signals:
```bash
node coordinator.cjs status
```

### "Agent not found"

Use lowercase agent IDs: `agent-07`, not `Agent-07` or `AGENT-07`

### Want to see what signals are blocking an agent?

```bash
node coordinator.cjs ready
```

---

## Important Notes

1. **Emit signals ONLY when the feature actually works** - don't emit prematurely
2. **Order doesn't matter for pending signals** - emit them as you complete milestones
3. **COMPLETE signal should be last** - only emit when ALL your work is done
4. **Signals are permanent** - once emitted, they cannot be un-emitted (by design)

---

## Current Registry Status

View real-time status:
```bash
node coordinator.cjs status
```

**Registry file:** `.workflows/agents/AGENT_SIGNAL_REGISTRY.json`

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026
