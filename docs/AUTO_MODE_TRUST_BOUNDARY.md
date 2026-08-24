# Auto-Mode Trust Boundary Matrix

---

# VERSION AND AGENT HISTORY

## Sessions & Modifications

- Version: 1.0
- Date: 2026-03-07
- Agent: Claude Opus 4.6

## Session Links & References

- N/A

## Document Status

- Status: Draft

---

## Purpose

Defines the GREEN / YELLOW / RED zones for Claude Code auto-enable-mode in DWS6. This document is the single source of truth for what auto-mode can do without human approval.

## GREEN Zone — Full Auto (No Prompts)

These actions are pre-approved and require no human confirmation:

| Action                                                         | Tool                                                        | Rationale                            |
| -------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Read any source file                                           | Read, Glob, Grep                                            | Read-only, no side effects           |
| Edit source files in `src/`, `scripts/`, `dws6.com/dashboard/` | Edit, Write                                                 | Development code, reversible via git |
| Run linter                                                     | Bash(npm run lint)                                          | Read-only analysis                   |
| Run tests                                                      | Bash(npm run test), Bash(vitest \*)                         | Isolated test environment            |
| Run build                                                      | Bash(npm run build)                                         | Local build, no deploy               |
| Git operations on feature branches                             | Bash(git add/commit/push/pull/fetch/diff/log/status/branch) | Feature branches only, not main      |
| Create directories                                             | Bash(mkdir \*)                                              | Reversible                           |
| Copy/move files                                                | Bash(cp _), Bash(mv _)                                      | Reversible via git                   |
| Run Node/TypeScript scripts                                    | Bash(node _), Bash(npx _)                                   | Local execution                      |
| Search/explore codebase                                        | Agent(Explore), WebSearch, WebFetch                         | Read-only                            |
| File permissions                                               | Bash(chmod +x \*)                                           | Scripts need to be executable        |

## YELLOW Zone — Auto but Logged + Auditable

These actions are allowed but MUST be logged to `.claude/hooks/audit/` for EU AI Act Article 12 compliance:

| Action                       | Tool                                             | Logging Required                 | Rationale                             |
| ---------------------------- | ------------------------------------------------ | -------------------------------- | ------------------------------------- |
| MCP tool calls               | mcp\_\_\*                                        | Yes — tool name + timestamp      | External system interaction           |
| Agent skill execution        | /agent-run, /compliance-check, etc.              | Yes — agent name + input summary | Cost implications, external API calls |
| Docker operations            | Bash(docker _), Bash(docker-compose _)           | Yes — command                    | Container state changes               |
| GitHub CLI (PRs, issues)     | Bash(gh pr _), Bash(gh issue _), Bash(gh api \*) | Yes — action + target            | Visible to collaborators              |
| Git push to feature branches | Bash(git push \*)                                | Yes — branch + remote            | Shared state change                   |
| Install dependencies         | Bash(npm install \*), Bash(npm ci)               | Yes — package changes            | Supply chain risk                     |

## RED Zone — Always Human-in-the-Loop (NEVER Auto)

These actions are HARD-BLOCKED by PreToolUse hooks and permissions.deny rules. No override without human approval.

### Database & Migrations

| Action                     | Why RED                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| Run Supabase migrations    | Irreversible schema changes; Marcus requires BEGIN/COMMIT + rollback path |
| DROP TABLE, TRUNCATE       | Data destruction                                                          |
| DELETE FROM without WHERE  | Mass data loss                                                            |
| SECURITY DEFINER functions | Security escalation risk                                                  |
| Modify RLS policies        | Access control changes                                                    |

### Production Deploys & Infrastructure

| Action                            | Why RED                                |
| --------------------------------- | -------------------------------------- |
| Push to main/master               | Production deployment trigger          |
| Git push --force                  | History destruction                    |
| Git reset --hard                  | Uncommitted work destruction           |
| Modify `.github/workflows/` CI/CD | Pipeline changes affect all developers |
| Cloudflare Workers deploy         | Live production change                 |
| Cloud Run deploy                  | Live production change                 |

### Communications & External Systems

| Action                                       | Why RED                    |
| -------------------------------------------- | -------------------------- |
| Send emails via Resend                       | Real emails to real people |
| Post to Slack/external services              | Visible communications     |
| Create/close GitHub issues                   | Visible to collaborators   |
| Comment on PRs (except auto-review workflow) | Visible to collaborators   |

### DWS6 Governance Rules

| Action                                           | Why RED                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| Modify thesis files (all 4 must update together) | Complex versioning rules, private files                             |
| Generate thesis HTML without version check       | Version number must be verified, not assumed                        |
| Publish .md files to public sites                | DWS6 rule: .md files never in public site folders                   |
| Update Store/ YAML frontmatter                   | Must sync dual folders in same commit                               |
| Update landing-pages/ without root folder first  | Dual folder rule violation                                          |
| Update DWS standards files                       | "Use DWS standard" requires human judgment on which standards apply |
| Modify CLAUDE.md                                 | Meta-governance — changes rules for all future sessions             |

### Security-Sensitive Operations

| Action                                         | Why RED                 |
| ---------------------------------------------- | ----------------------- |
| Read .env, .env._, _.key, _.pem, _.secret      | Credential exposure     |
| Read credentials.json, service-account-\*.json | GCP credential exposure |
| sudo commands                                  | Privilege escalation    |
| curl/wget pipe to shell                        | Remote code execution   |
| rm -rf with broad paths                        | Filesystem destruction  |
| Modify .gitignore security patterns            | Could expose secrets    |

## Decision Flowchart

```
Is the action read-only?
├─ YES → GREEN (auto)
└─ NO  → Does it modify shared state visible to others?
         ├─ YES → Is it reversible via git?
         │        ├─ YES → YELLOW (auto + log)
         │        └─ NO  → RED (human required)
         └─ NO  → Does it touch production, secrets, or governance files?
                  ├─ YES → RED (human required)
                  └─ NO  → Is it a local dev operation?
                           ├─ YES → GREEN (auto)
                           └─ NO  → YELLOW (auto + log)
```

## Enforcement Mechanisms

| Zone   | Enforced By                                                       |
| ------ | ----------------------------------------------------------------- |
| GREEN  | `permissions.allow` in `.claude/settings.json`                    |
| YELLOW | `permissions.allow` + PostToolUse audit hook                      |
| RED    | `permissions.deny` + PreToolUse guard hooks (exit 2 = hard block) |

## Exceptions Process

To temporarily move an action from RED to YELLOW:

1. Human explicitly says "I approve [specific action] for this session"
2. Action is logged with human approval noted
3. Approval does NOT carry over to future sessions
4. Never move RED to GREEN (no permanent auto-approval for RED actions)

## Version History

| Version | Date       | Change                        |
| ------- | ---------- | ----------------------------- |
| 1.0     | 2026-03-07 | Initial trust boundary matrix |
