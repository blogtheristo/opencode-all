# Skill: outreach-agents

**Trigger:** Use when user says "find leads", "outreach agents", "run outreach", "craft outreach message", "send outreach email", "book demos", "outreach pipeline", or invokes `/outreach-agents`.

## Description

Four-step autonomous B2B outreach pipeline powered by DGX Spark Ollama models. Finds high-intent EU enterprise leads, crafts personalized messages in DWS brand voice, and delivers via Amazon SES email. LinkedIn drafts are queued for human delivery (MDP partner restriction). All messages follow DWS_BRAND_STANDARD.md §24.

## Parameters

| Parameter   | Required          | Values                                                                     | Default      |
| ----------- | ----------------- | -------------------------------------------------------------------------- | ------------ |
| ACTION      | yes               | `find` \| `craft` \| `send` \| `full`                                      | —            |
| TARGET      | yes               | ICP description (min 10 chars)                                             | —            |
| ROLE        | no                | R-ID from DWS_ROLES_REGISTRY (R07/R13/R22/R23)                             | R07 (CSO)    |
| INDUSTRY    | no                | steel / construction / cement / energy / logistics / manufacturing         | all          |
| REGION      | no                | FI / SE / DE / AT / EU                                                     | EU           |
| REGULATION  | no                | ETS / CBAM / CSRD / EU-Taxonomy / Fit-for-55                               | CSRD         |
| OFFERING    | no                | dws-iq6 / firehorse-reports / sitesense / material-oracle / sovereign-cbam | dws-iq6      |
| MAX_LEADS   | no                | 1–15                                                                       | 5            |
| STYLE       | no                | consultative / professional / cold                                         | consultative |
| THREAD_ID   | find=no, send=yes | Supabase outreach_threads UUID                                             | —            |
| TO_EMAIL    | send=yes          | Recipient email address                                                    | —            |
| APPROVED_BY | send=yes          | Human approver name (Tier 2 gate)                                          | —            |
| AUTO_SEND   | no                | true / false                                                               | false        |

## Action Map

| ACTION | Runs Agent               | Description                                             |
| ------ | ------------------------ | ------------------------------------------------------- |
| find   | outreach-lead-finder     | Score EU leads against ICP; upsert to outreach_orgs     |
| craft  | outreach-message-crafter | Craft email + LinkedIn draft; store to outreach_threads |
| send   | outreach-executor        | Deliver via SES email; queue LinkedIn for human         |
| full   | outreach-orchestrator    | Run find → craft → (optionally send) in sequence        |

## Steps

### Latent (LLM judgment — DGX Spark Ollama, llama3.3:70b)

1. **Find**: Score `EU_TARGET_UNIVERSE` against ICP + regulatory trigger. Route via `OLLAMA_BASE_URL` env.
2. **Craft**: Generate consultative email (110–150 words) + LinkedIn note (≤300 chars) in DWS brand voice. Apply §24 banned-phrase filter.

### Deterministic

3. **Send**: Deliver email via `src/utils/send-email.ts` (Amazon SES SMTP). Log to `outreach_activities`. Update `outreach_threads.status` → contacted.
4. **LinkedIn**: Write draft to `outreach_activities` (channel=linkedin, outcome=queued). Human copies from daily digest at `/api/v1/outreach/digest`.

## Brand Voice Rules (§24)

- Tone: consultative by default (insight → observed problem → soft CTA)
- Subject: ≤50 chars, no "Quick question", no ALL CAPS
- Approved CTAs: "Would you be open to a 15-minute call?" / "Happy to share how we handle this for [sector]."
- Banned: synergy, leverage, disruptive, game-changer, "I hope this email finds you well"
- Sender: `risto@onelifetime.world` — display name "Risto at DWS"

## Tier 2 Gate

`outreach-executor` requires `approvedBy` — a human must explicitly name themselves before any email is sent. `autoSend=false` (default) means Step 3 never runs automatically.

## Invocation Examples

```
/outreach-agents ACTION=find TARGET="EU steel manufacturers with ETS exposure" ROLE=R07 INDUSTRY=steel REGULATION=ETS MAX_LEADS=5
```

```
/outreach-agents ACTION=craft TARGET="Outokumpu" ROLE=R07 OFFERING=dws-iq6 REGULATION=ETS
```

```
/outreach-agents ACTION=send THREAD_ID=<uuid> TO_EMAIL=cso@outokumpu.com APPROVED_BY="Risto"
```

```
/outreach-agents ACTION=full TARGET="Finnish construction companies facing CSRD in 2026" ROLE=R07 INDUSTRY=construction REGULATION=CSRD MAX_LEADS=3
```

## CLI Equivalent

```bash
npx tsx src/cli.ts run outreach-orchestrator --input '{"icp":"EU steel ETS-exposed","industry":"steel","roleId":"R07","region":"EU","regulatoryTrigger":"ETS","offering":"dws-iq6","maxLeads":5}'
```

## Output Shape

```json
{
  "agentName": "outreach-orchestrator",
  "result": {
    "leadsFound": 5,
    "draftsCrafted": 5,
    "threadIds": ["uuid1", "uuid2"],
    "emailsSent": 0,
    "step1": { "leads": [...] },
    "step2": [{ "threadId": "uuid1", "confidence": 0.8 }]
  },
  "confidence": 0.82,
  "reasoning": "Drafts ready for 5 leads..."
}
```

## Supabase Tables Used

| Table                 | Operation    | Notes                            |
| --------------------- | ------------ | -------------------------------- |
| `outreach_orgs`       | UPSERT       | merge-duplicates on domain key   |
| `outreach_threads`    | INSERT/PATCH | stores drafts + status flow      |
| `outreach_activities` | INSERT       | delivery log + LinkedIn queue    |
| `email_queue`         | INSERT       | SES audit trail (via send-email) |
| `agent_executions`    | INSERT       | Article 12 compliance logging    |

## Self-Improvement Loop

This skill implements Zach Lloyd's two-loop self-improvement pattern. The outer loop reads inner loop outcomes and proposes SKILL.md diffs.

```
Inner loop ──────────────────────────────────────────────────────────────
  /outreach-agents ACTION=full → outcomes recorded in outreach_threads
  Human corrections → notes written to outreach_activities
                                        │
                                        ▼ (daily, scripts/daily/outreach-skill-improve.ts)
Outer loop ──────────────────────────────────────────────────────────────
  outreach-improver reads past 7d outcomes from Supabase
  Analyzes: response rate by style / hook / role / industry
  DGX Spark identifies patterns + proposes specific SKILL.md diffs
  Writes: .claude/clawdbot/proposals/skill-outreach-agents-YYYY-MM-DD.md
                                        │
                                        ▼ (HIL-gated, weekly)
Human review ────────────────────────────────────────────────────────────
  /promote-proposal .claude/clawdbot/proposals/skill-outreach-agents-<date>.md
  Apply approved diffs → SKILL.md improves → next inner loop runs better
```

### Feedback signals read by the outer loop

| Signal                             | Source             | Meaning                                           |
| ---------------------------------- | ------------------ | ------------------------------------------------- |
| `status=responded`                 | `outreach_threads` | Message landed — positive signal                  |
| `status=meeting_booked`            | `outreach_threads` | Strong positive — use this style/hook more        |
| `status=contacted` + age > 7d      | `outreach_threads` | Likely no-response — negative signal              |
| Inbound `outreach_activities.body` | Human corrections  | Text feedback to update banned phrase list / tone |

### Running the outer loop manually

```bash
npx tsx src/cli.ts run outreach-improver --input '{"lookbackDays":7,"minThreads":3,"dryRun":false}'
```

Or trigger via daily runner:

```bash
npx tsx scripts/daily/outreach-skill-improve.ts
```

### Env vars for outer loop

| Var                              | Default | Description                             |
| -------------------------------- | ------- | --------------------------------------- |
| `OUTREACH_IMPROVE_LOOKBACK_DAYS` | 7       | Days of history to analyze              |
| `OUTREACH_IMPROVE_MIN_THREADS`   | 3       | Skip if fewer threads found             |
| `OUTREACH_IMPROVE_DRY_RUN`       | false   | Print analysis without writing proposal |

## Allowed Tools

Read, Glob, Grep, Bash (npm/npx only), Supabase REST (via fetch in agent code)
