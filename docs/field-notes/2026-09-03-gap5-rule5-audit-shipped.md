# Gap 5: Rule 5 Audit — Shipped & Findings

**Date:** 2026-09-03  
**Branch:** `claude/ai-software-engineering-krt01q`  
**Session:** Gap 5 (Rule 5 Audit depends on Gap 3)  
**Status:** ✅ Complete

---

## Summary

Completed comprehensive Rule 5 audit of the dws6 codebase to identify and categorize all LLM model-call sites by business logic intent. **No critical violations found.** Two existing calls are safe (JUDGMENT); two general-purpose agent endpoints present medium-risk due to configurable prompts.

**Deliverables:**

1. ✅ `scripts/audit-rule-5.ts` — Audit harness (TypeScript, grep-based pattern matching)
2. ✅ `docs/audit-rule-5-report.md` — Comprehensive findings + refactor roadmap
3. ✅ `docs/audit-rule-5-backlog.json` — Structured backlog for future sprints (6 items)
4. ✅ `docs/field-notes/2026-09-03-gap5-rule5-audit-shipped.md` — This note

---

## Key Findings

### Model-Call Sites Audited: 4

| File                              | Line     | Category | Risk   | Status             |
| --------------------------------- | -------- | -------- | ------ | ------------------ |
| scripts/generate-campaign-post.ts | 227, 238 | JUDGMENT | LOW    | ✓ Safe             |
| src/cloudflare/worker-agent.ts    | 237      | JUDGMENT | MEDIUM | ⚠️ Needs validator |
| src/cloudflare/tenant-sandbox.ts  | 239      | JUDGMENT | MEDIUM | ⚠️ Needs validator |

**No violations of Rule 5 found.** All calls are classified as JUDGMENT (legitimate uses). Risk is not from current misuse, but from architectural flexibility that could allow future misuse.

### Safe Calls

**Blog post generator** (`scripts/generate-campaign-post.ts:227,238`)

- Drafts bilingual blog posts (EN + FI) for the 800-day campaign.
- Input: commit history, PR data, pillar info.
- Output: structured HTML blog content.
- ✅ Exemplary use of Rule 5 (judgment call: synthesis and creative composition).
- No action required.

### Medium-Risk Calls (Configurable Prompts)

**Cloudflare Worker Agent** (`src/cloudflare/worker-agent.ts:237`)

- General-purpose agent endpoint for DWS IQ climate intelligence tasks.
- Accepts customer-provided `systemPrompt` override.
- Risk: A customer could pass `systemPrompt: "Route this to the best agent: [list]"` → LLM decides routing.
- Refactor cost: 1 day (add system-prompt validator).

**Tenant Sandbox** (`src/cloudflare/tenant-sandbox.ts:239`)

- Multi-tenant sandbox where each tenant configures `customSystemPrompt`.
- Risk: Same as worker-agent, but per-tenant (misconfiguration affects compliance scoring).
- Refactor cost: 1 day (add tenant config validator).

---

## Refactoring Roadmap (Priority Order)

### HIGH Priority (Week 1) — Unblock deployment

1. **worker-agent.ts: Add system-prompt validator**
   - Scan `systemPrompt` for routing keywords (route, dispatch, choose, decide, select).
   - Reject or apply fallback if found.
   - Effort: 4 hours.
   - Owner: [TBD by HIC].

2. **tenant-sandbox.ts: Add tenant config validator**
   - Validate `customSystemPrompt` at creation/update time.
   - Reject invalid configs or emit admin warning.
   - Effort: 4 hours.
   - Owner: [TBD by HIC].

### MEDIUM Priority (Week 2–3) — Compliance & observability

3. **Add audit logging for Article 14 compliance (EU AI Act)**
   - Log model calls with system prompt, intent category, tokens.
   - Store in new Supabase table: `model_call_audit`.
   - Effort: 5 hours.
   - Owner: [TBD by HIC].

4. **Capability-based access control (tenant tiers)**
   - Add `allowedPromptIntents` field to `TenantSandboxConfig`.
   - Restrict sandbox tier to ["judgment", "analysis"].
   - Effort: 6 hours.
   - Owner: [TBD by HIC].

5. **Integrate Rule 5 audit into CI/CD**
   - Add pre-commit hook to detect new violations.
   - Fail on HIGH-risk, warn on MEDIUM-risk.
   - Effort: 3 hours.
   - Owner: [TBD by HIC].

### LOW Priority (Ongoing) — Documentation & training

6. **Document Rule 5 patterns for the team**
   - Create `docs/rule-5-guidelines.md` with examples and decision flowchart.
   - Share in engineering sync.
   - Effort: 2 hours.
   - Owner: [TBD by HIC].

---

## Audit Method & Scope

**Patterns searched:**

- `.messages.create()` ← Anthropic API direct calls
- `new Anthropic(...)` ← SDK instantiation
- `.invoke()` with model context ← Indirect invocation
- `.generate()` ← Generator methods

**Scope:** dws6 repository (src/, scripts/)  
**Exclusions:** node_modules/, test files, mocks

**Categorization:** Heuristic based on context analysis

- JUDGMENT: drafting, synthesis, analysis, classification (safe)
- ROUTING: control flow delegation, agent selection (violation)
- TRANSFORM: JSON parsing, format conversion, deterministic operations (violation)

---

## Risk Assessment

**Current State:**

- No active Rule 5 violations in production code.
- Two safe judgment calls (blog generation).
- Two medium-risk configurable endpoints (worker-agent, tenant-sandbox).

**Risk Without Action:**

- Future deployments could add routing/transform calls to the configurable endpoints.
- Tenant customers could misconfigure prompts to request routing/transform.
- EU AI Act Article 14 (human oversight) compliance gap: no audit trail of model calls.

**Risk With Refactoring:**

- Both medium-risk findings reduced to LOW-risk via validators.
- Audit logging enables compliance with Article 14.
- CI/CD gate prevents new violations.

---

## Recommendations for HIC

1. **Schedule refactoring:** Assign HIGH-priority tasks (worker-agent, tenant-sandbox validators) to upcoming sprint (Week 1).
2. **Audit logging:** Plan for MEDIUM-priority items (Week 2–3) as part of EU AI Act compliance prep.
3. **Team training:** Share Rule 5 guidelines with engineering team to prevent future violations.
4. **Recurring audit:** Schedule weekly Rule 5 audits in CI/CD after implementation (scripted, low overhead).

**Decision Gate:** Should we implement validators before shipping Cloudflare worker and tenant-sandbox to production customers?

- Recommendation: YES. The validators are lightweight (1 day each) and significantly reduce compliance risk.

---

## Files Delivered

**Source code:**

- `scripts/audit-rule-5.ts` (290 lines, TypeScript)
- Includes pattern matching, categorization logic, risk assessment heuristics

**Documentation:**

- `docs/audit-rule-5-report.md` (600+ lines, markdown)
- Executive summary, detailed findings, risk matrix, refactoring roadmap, code examples
- `docs/audit-rule-5-backlog.json` (500+ lines, structured JSON)
- 6 backlog items with implementation steps, cost estimates, dependencies

**Field note:**

- `docs/field-notes/2026-09-03-gap5-rule5-audit-shipped.md` (this file)
- HIC-facing summary, recommendations, decision gate

---

## Next Steps (For HIC)

**Immediate (today):**

- Review findings in `docs/audit-rule-5-report.md` (executive summary section).
- Decide: implement validators before production ship? (recommend YES).

**This week:**

- Schedule refactoring sprint for worker-agent + tenant-sandbox validators.
- Assign owners from engineering team.

**Next week:**

- Begin implementation (validators, 1 day each).
- Prepare audit logging for Article 14 compliance.

**Ongoing:**

- Run weekly Rule 5 audits in CI/CD (automated, no manual overhead).
- Re-audit after refactoring to confirm risk reduction.

---

## Dependencies & Blockers

- Gap 3 (decision-log.sh) should be committed first (provides decision categorization framework).
- No external blockers; refactoring is self-contained.
- Requires Supabase schema migration for audit logging (low effort).

---

## Evidence Trail

- Audit script: `scripts/audit-rule-5.ts`
- Grep patterns defined inline; reproducible.
- Manual inspection of 4 model-call sites: context extracted and categorized.
- Findings documented in `docs/audit-rule-5-report.md` (section "Detailed Findings").

---

**Report Status:** Ready for HIC review and sprint planning.  
**Session:** Closed; work delivered and documented.
