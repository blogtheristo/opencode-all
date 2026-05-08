---
name: case-run
version: 1.0
date: 2026-05-08
description: >
  Invokes Themis as Case Coordinator on a caseId (or ad-hoc case description). Use when user
  says "run case", "open a case", "coordinate agents on this", "case status", "assign agents to
  case", "case coordinator", "Themis coordinate", "what agents should handle this", or provides a
  case type like compliance, contract, ERP sync, or sales.
---

Invoke Themis as DWS Case Coordinator — dispatch specialist agents, retrieve case context, and
return a unified case status with next steps.

Usage: /case-run <caseId | case-description>

Input: $ARGUMENTS

## Steps

1. **Parse input** — determine if it's a UUID (existing case) or a natural-language description
   (new ad-hoc case):
   - UUID format: query case from Supabase — `GET /api/cases/:id`
   - Description: build a case object: `{ type, title, context }` and call Themis inline

2. **Invoke Themis with `case-coordinate` action**:

   ```bash
   cd cli && npx tsx src/cli.ts run themis --input '{
     "action": "case-coordinate",
     "caseId": "<id-or-ad-hoc>",
     "type": "<compliance|contract|erp-sync|sales>",
     "context": "<description or case data>"
   }'
   ```

3. **Themis dispatches sub-agents automatically** based on case type:
   - `compliance` → Themis + Auditor + ChronosAgent (deadlines)
   - `contract` → Themis + Auditor + Proposal state check
   - `erp-sync` → Themis + ERP sync status + QualityGate
   - `sales` → Themis + Lead state + SalesOutreach

4. **Present case status report**:
   - Case ID, type, status, priority
   - Active agents and their findings
   - Deadline risk (ChronosAgent output if applicable)
   - Required human approvals (if any action is HIGH risk)
   - Recommended next step

5. **If `approval_required` is raised**: surface the blocking action clearly and provide the
   approval API call — `PATCH /api/cases/:id/approve { "action": "<action>", "approvedBy": "..." }`

## Output format

```
CASE: <title> [<status>] — <type>
Priority: HIGH | MEDIUM | LOW
Deadline: <date or "none">

Agents dispatched:
  • Themis: <finding summary>
  • Auditor: <audit status>
  • ChronosAgent: <deadline risk>

Next step: <single clear action>
Approval required: YES / NO
```

## When NOT to use

- Single-agent call without case context → use `/agent-run` instead
- Full EU compliance assessment → use `/compliance-check` or `/workflow compliance-assessment`
- Site safety scoring → use `/site-safety`
- Unknown which agent to use → use `/discover-agents` first
