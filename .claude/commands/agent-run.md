---
name: agent-run
description: Runs any named DWS IQ AI agent with structured input and returns scored results. Use when user says "run agent", "call agent", "execute [agent-name]", or mentions agents by name — sitesense, material-oracle, compliance, schedule-genius, customer-sat, viability, deepwiki-extractor, emissions-data-analyst, construction, logistics, quality-gate, competitor-surveillance, seo-audit, lead-feedback, aegis.
---

Run any DWS IQ agent by name with the given input.

Usage: /agent-run <agent-name> <input-json-or-description>

Input: $ARGUMENTS

## Steps

1. Parse the arguments — first word is agent name, rest is input (JSON or natural language)
2. If no agent name given, run `cd cli && npx tsx src/cli.ts agents` to list available agents
3. If input is natural language, convert to JSON matching the agent's expected schema
4. Execute: `cd cli && npx tsx src/cli.ts run <agent-name> --input '<json>'`
5. Present the result with confidence score, reasoning, and recommendations

## Available agents

sitesense, schedule-genius, material-oracle, customer-sat, viability, deepwiki-extractor, emissions-data-analyst, compliance-researcher, sales-outreach, construction, logistics, compliance, quality-gate, keyword-intent, competitor-surveillance, content-brief, seo-audit, lead-feedback, designer, aegis

`aegis` — vulnerability & patch SLA triage (Dependabot alerts, npm audit). Input: `{"action": "triage", "findings": [{"severity": "critical|high|moderate|low", "package": "...", "discoveredAt": "YYYY-MM-DD"}]}`. See `docs/SECURITY_ROLES_AND_GUIDANCE.md` and `security-reports/SECURITY_BACKLOG_BUG_FIXES.md`.

## Examples

```
/agent-run customer-sat {"customerId": "acme", "touchpoints": ["onboarding", "support"]}
/agent-run viability {"projectId": "solar-fi", "region": "FI", "budget": 2000000}
/agent-run emissions-data-analyst {"facility": "steelplant-01", "period": "2025-Q4"}
```

## When NOT to use

- Need chained multi-agent analysis → use `/workflow` instead
- Don't know which agent to call → use `/discover-agents` first
- Want to send an email → use `/email`
