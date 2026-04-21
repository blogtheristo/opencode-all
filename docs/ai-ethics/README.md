---
title: "AI Ethics — Session Logs and Reasoning Lineage"
version: "1.0"
last_updated: "2026-04-21"
standard: "DWS Document Standard + AI Ethics Playbook 2.0"
---

# AI Ethics — Session Logs and Reasoning Lineage

This folder stores reasoning-lineage artifacts for AI-assisted sessions against the
DWS IQ 6 codebase. It operationalizes:

1. **EU AI Act Article 12** — Automatic logging of AI system events
2. **AI Ethics Playbook 2.0 Part 3** — Data Traceability (Tiedon jäljitettävyys)
   (RTS & A-Insinöörit, KIRA RESP-AI project, v2.0 / 18.06.2025)

## Folder structure

```
docs/ai-ethics/
├── README.md                    ← this file
└── sessions/                    ← individual session logs (one markdown per session)
    └── YYYY-MM-DD-<slug>.md
```

## What to log per session

Every AI-assisted session that produces committable changes should leave a session
log containing:

| Section | Content |
|---------|---------|
| **Metadata** | Session ID, date, agent, model, user, repo, tools used |
| **Inputs** | Every user prompt, verbatim, in order |
| **Outputs** | AI-generated content (summaries, decisions, proposed artifacts) with source attribution |
| **Reasoning lineage** | Decision chain diagram from input → output, including branch points |
| **Oversight checkpoints** | Where the human architect redirected, approved, or overrode the AI |
| **Principle mapping** | Which of the four playbook principles (harm avoidance, accountability, transparency, fairness) the session honored |
| **Data handling notes** | Secrets touched? PII collected? Branch used? |

See [`sessions/2026-04-21-taru-lehtinen-database-tables.md`](sessions/2026-04-21-taru-lehtinen-database-tables.md)
for a reference implementation.

## Database mirroring

Session logs duplicate content that also belongs in the Supabase `agent_executions`
table (migration 030). The markdown file is the **human-readable** artifact; the
database row is the **queryable** artifact. Both should exist for every
non-trivial AI session.

| Aspect | Markdown file | Database row |
|--------|---------------|--------------|
| **Audience** | Human reviewers, auditors, thesis appendix | Backend queries, dashboards, compliance reports |
| **Retention** | Git history (≥10 years) | `agent_executions` + backups |
| **Schema** | Free-form with required sections | Fixed columns (`input jsonb`, `output jsonb`, `status`, etc.) |
| **Access** | All developers (repo read access) | Service-role only (RLS policy) |

## Related standards

- AI Ethics Playbook 2.0 (RTS & A-Insinöörit, KIRA RESP-AI project): https://www.rts.fi/verkkojulkaisut/tekoalyn-pelikirja/
- [DWS Document Standard](../../DWS_DOCUMENT_STANDARD.md)
- [DWS Security Standard](../../DWS_SECURITY_STANDARD.md)
- [CLAUDE.md — 2026 EU AI Act Compliance](../../CLAUDE.md)
- [Supabase migration 030 — `agent_executions` table](../../supabase/migrations/030_agent_logging_tables.sql)
