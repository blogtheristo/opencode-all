# Rule 5 Audit Report — Model Call Categorization

**Date:** 2026-09-03  
**Auditor:** Claude Code Agent  
**Audit Scope:** dws6 repository (src/, scripts/), excluding node_modules and test mocks  
**Rule 5 Definition:** "Use the model only for judgment calls — classification, drafting, summarization, extraction. NOT routing, retries, status-code handling, or deterministic transforms. If code can answer, code answers."

---

## Executive Summary

**Total model-call sites found: 4** (production code, excluding tests and node_modules)  
**Safe (JUDGMENT): 2** ✓  
**Concern (MEDIUM risk): 2** ⚠️  
**High risk (ROUTING/TRANSFORM): 0** ✓

### Key Findings

- **No critical Rule 5 violations detected** in active production code.
- **Two low-risk judgment calls** (blog post generation) are appropriate uses of the LLM.
- **Two general-purpose agent endpoints** (Cloudflare Workers) present MEDIUM risk due to lack of system-prompt constraints; customer-provided prompts could enable routing/transform misuse if not validated.
- **No retry loops, status-code handling, or deterministic transforms** delegated to LLM were found.

---

## Detailed Findings

### 1. Blog Post Generation — JUDGMENT ✓

**Files:**

- `scripts/generate-campaign-post.ts:227` (EN post generation)
- `scripts/generate-campaign-post.ts:238` (FI post generation)

**Category:** JUDGMENT (safe)  
**Risk Level:** LOW  
**Model Call:**

```typescript
const enResponse = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 8000,
  messages: [{ role: "user", content: enPrompt }],
});
```

**Assessment:**

✓ **This is a correct use of Rule 5.** The LLM is asked to draft blog content:

- Prompt includes pillar (domain), day number, phase, git commit history, PR data.
- Output is parsed and formatted into HTML.
- Intent is synthesis and creative composition (classic JUDGMENT use case).
- No control flow depends on LLM output; the response is treated as content, not a decision signal.

**Recommendation:** No action required. This pattern is exemplary.

---

### 2. DWS IQ Cloudflare Worker Agent — MEDIUM RISK ⚠️

**File:** `src/cloudflare/worker-agent.ts:237`

**Category:** JUDGMENT (but configurable)  
**Risk Level:** MEDIUM  
**Model Call:**

```typescript
const response = await client.messages.create({
  model,
  max_tokens: maxTokens,
  temperature,
  system: systemPrompt,
  messages: [
    {
      role: "user",
      content: request.prompt,
    },
  ],
  tools: tools.length > 0 ? tools : undefined,
});
```

**Assessment:**

⚠️ **Risk comes from flexibility, not current misuse.** The endpoint is designed as a general-purpose agent that:

- Accepts any `request.prompt` from the caller.
- Allows customer-controlled `systemPrompt` override.
- Can enable MCP tools if `request.tools` is provided.

**Scenarios where this could violate Rule 5:**

1. **Routing delegation:** A customer could pass `systemPrompt: "Route this request to the best agent: [list of agents]"` — the LLM would decide routing, not code.
2. **Transform delegation:** A customer could pass `"Parse this CSV and return JSON"` — deterministic, not a judgment call.
3. **Error routing:** Inside a `catch` block, sending the error to this endpoint with a routing prompt could escalate errors to LLM decision-making.

**Current Safeguards:**

- System prompt has a DWS IQ climate-focused default (good).
- The endpoint is internal to Cloudflare workers, not exposed to untrusted callers (good).

**Refactor Recommendation:**

1. Add a **system-prompt validator** that rejects prompts containing routing keywords (route, dispatch, choose, select agent).
2. Add a **prompt categorizer** that warns if the prompt pattern matches TRANSFORM or ROUTING before calling the LLM.
3. Document the allowed use cases (judgment, synthesis, extraction, analysis) in code comments.
4. For multi-tenant scenarios, apply the same validation to tenant-provided system prompts.

---

### 3. DWS IQ Multi-Tenant Sandbox Agent — MEDIUM RISK ⚠️

**File:** `src/cloudflare/tenant-sandbox.ts:239`

**Category:** JUDGMENT (but tenant-configurable)  
**Risk Level:** MEDIUM  
**Model Call:**

```typescript
const response = await client.messages.create({
  model: body.model || TENANT_CONFIG.allowedModels[0],
  max_tokens: Math.min(body.maxTokens || 4096, TENANT_CONFIG.limits.maxTokensPerRequest),
  system: systemPrompt,
  messages: body.messages,
});
```

**Assessment:**

⚠️ **Similar risk profile to worker-agent, amplified by multi-tenant isolation.** Each tenant can configure:

- `customSystemPrompt` (stored in `TENANT_CONFIG`)
- `messages` (passed in request body by the tenant)

**Risk Escalation:**

- A customer (tenant) could set a system prompt that routes to LLM decision-making.
- If tenant isolation is compromised, one tenant's misconfiguration affects others (unlikely, but tenant config is shared).
- No validation of system prompt content before calling the LLM.

**Refactor Recommendation:**

1. **Tenant system-prompt validation:** When a tenant creates/updates a config, validate that the `customSystemPrompt` does not contain routing or transform keywords.
2. **Message validation:** Optionally, validate request `body.messages` for routing/transform patterns (less critical, since customers own their prompts).
3. **Audit logging:** Log all system-prompt changes and model calls per tenant (Article 14 compliance, CLAUDE.md).
4. **Capability-based constraints:** Store a "allowed_prompt_intents" field in `TenantSandboxConfig` (default: ["judgment", "analysis", "synthesis"]; restrict routing/transform by policy).

---

## Risk Matrix

| Finding                     | Category | Risk Level | Impact                     | Effort to Fix |
| --------------------------- | -------- | ---------- | -------------------------- | ------------- |
| Blog post generator         | JUDGMENT | LOW        | None (correct use)         | 0 (exemplary) |
| Worker agent (Cloudflare)   | JUDGMENT | MEDIUM     | Misuse by prompt injection | 1 day         |
| Tenant sandbox (Cloudflare) | JUDGMENT | MEDIUM     | Misuse by tenant config    | 1 day         |
| Retry loops                 | N/A      | None found | N/A                        | N/A           |
| Routing inside conditions   | N/A      | None found | N/A                        | N/A           |
| Status-code handling        | N/A      | None found | N/A                        | N/A           |

---

## Refactoring Roadmap

### High Priority (Week 1)

1. **worker-agent.ts: Add system-prompt validator**
   - Scan `systemPrompt` for keywords: `route`, `dispatch`, `choose`, `decide`, `select`, `which.*should`.
   - If found, reject the request or log a warning and apply a safe fallback prompt.
   - Cost: 2–4 hours.

2. **tenant-sandbox.ts: Add tenant config validator**
   - When `saveTenantConfig()` is called, validate `customSystemPrompt` against the same keyword list.
   - Reject invalid configs or emit a warning to the tenant admin.
   - Cost: 2–4 hours.

### Medium Priority (Week 2–3)

3. **Audit logging for Article 14 compliance (EU AI Act)**
   - Log model calls with system prompt, request, response, and result category (JUDGMENT/ROUTING/TRANSFORM).
   - Store in Supabase audit table.
   - Cost: 4–6 hours.

4. **Capability-based access control**
   - Add `allowed_prompt_intents` to `TenantSandboxConfig`.
   - Validate incoming requests match the tenant's allowed intents.
   - Cost: 1 day.

### Low Priority (Ongoing)

5. **Documentation and examples**
   - Add comments to worker-agent.ts and tenant-sandbox.ts explaining the Rule 5 boundary.
   - Provide example prompts for judgment vs. routing/transform.
   - Cost: 2 hours.

---

## Code Examples: Before & After

### Example 1: Routing (violation)

**Before (WRONG):**

```typescript
const agentRouter = await client.messages.create({
  system:
    "You are a router. Given the task, respond with the agent name: EmailAgent, CalendarAgent, or FileAgent.",
  messages: [{ role: "user", content: `Route this: ${task.description}` }],
});
const agentName = agentRouter.content[0].text;
const agent = agents[agentName]; // CONTROL FLOW DEPENDS ON LLM OUTPUT
```

**After (CORRECT):**

```typescript
const routingTable: Record<string, string> = {
  email: "EmailAgent",
  calendar: "CalendarAgent",
  file: "FileAgent",
};
const agentName = routingTable[task.type] || "DefaultAgent"; // CODE DECIDES
```

### Example 2: Judgment (correct use)

**Correct:**

```typescript
const classificationResponse = await client.messages.create({
  system: "Classify this support ticket by urgency: LOW, MEDIUM, or HIGH.",
  messages: [{ role: "user", content: ticketText }],
});
const urgencyScore = classificationResponse.content[0].text; // OUTPUT IS DATA, NOT CONTROL FLOW
recordTicketUrgency(ticketId, urgencyScore);
```

---

## Audit Metadata

**Files Audited:** 4 production model-call sites  
**Audit Method:** Manual inspection + grep pattern matching  
**Patterns Searched:**

- `.messages.create()`
- `new Anthropic()`
- `.invoke()` with model context
- `.generate()` method calls

**Exclusions:**

- Test files (`*.test.ts`, `__tests__/`)
- Mock/stub code
- node_modules/
- Dependency libraries (vite, magicast, ioredis, etc.)

**Next Steps:**

1. Implement high-priority validators (worker-agent, tenant-sandbox).
2. Re-run audit after implementation to confirm risk reduction.
3. Add Rule 5 audit to CI/CD pipeline (weekly) to catch new violations.
4. Train team on Rule 5 patterns via engineering discipline sessions.

---

## References

- **Rule 5:** `CLAUDE.md` Engineering Discipline, Rule 5 ("Use the model only for judgment...")
- **Implementation:** `scripts/audit-rule-5.ts` (audit harness)
- **Backlog:** `docs/audit-rule-5-backlog.json` (structured refactor plan)
- **Prior work:** Gap 3 (decision-log.sh) established Rule 5 category definitions

---

**Report Generated:** 2026-09-03T03:54:39Z  
**Status:** Ready for HIC review and refactor sprint planning
