# DWS Cost Policy Standard — AI Tool Procurement & Sandbox Governance

<!-- Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=claude-code Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/DWS_COST_POLICY_STANDARD.md -->

## VERSION AND AGENT HISTORY

---

Version: 1.1 [Latest]
Tool: Claude Code
Model: anthropic/claude-opus-5-5
Agent: claude-code
Date: 2026-09-27
Changes: HIC decision 27.09.2026 — use the Copilot promotional credit ($210) in full before it expires; any cloud-agent work that needs persistence must land as a DGX implementation. Added Copilot credit window and Persistence Rule.

---

Version: 1.0 [not latest]
Tool: Claude Code 1.0
Model: claude-haiku-4-5-20251001
Agent: standards-audit
Date: 2026-09-19
Changes: Initial policy: DGX-first agentic compute, 21-day free-credit window, sandbox requirement, full audit trail (EU AI Act Art. 14)

---

**Effective Date:** 2026-09-20  
**Governance Basis:** EU AI Act Art. 12–14 (transparency, tool selection rationale, HIC oversight)

---

## Scope

This standard governs procurement and usage of AI agent compute (Cursor, Grok, Claude Code, OpenCode, and future LLM-backed agents) for engineering workloads within DWS6 and related projects.

**Applies to:**

- All agentic workloads (multi-step code tasks, agent-orchestrated pipelines, autonomous deployments)
- All tool selections (Cursor, Grok, Claude Code, Copilot, custom agents)
- All compute resources (cloud-provisioned vs. local/DGX)

**Does NOT apply to:**

- Manual human coding (IDE without AI)
- LLM-only query tools (web search, knowledge lookup)
- Vendor-hosted SaaS that does not expose agent selection (e.g., Supabase advisory)

---

## Core Policy: DGX-First, Cloud-Justified

### Primary Rule

**Agentic workloads default to DGX compute (local, sandbox-isolated environment).**

Cloud-provisioned agents (Cursor Cloud, Grok Cloud, OpenAI Agents) are **secondary** and require documented justification:

| Scenario                                        | Rule                                                       | Rationale                                                            |
| ----------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| **Iterative engineering (standard task)**       | DGX (mandatory)                                            | Speed + cost: DGX is sufficient; local sandbox is isolated           |
| **Real-time multi-agent coordination**          | DGX (preferred); cloud only if parallel jobs > local cores | Latency vs. throughput trade-off                                     |
| **External API integration (e.g., GitHub MCP)** | Cloud acceptable; document reason                          | May require cloud-side credential storage or rate-limiting allowance |
| **Spike/research (exploratory)**                | Cloud OK if <4 hours; then move to DGX pipeline            | Bounded trial; migrate to permanent solution                         |
| **Vendor lock-in escape**                       | DGX (mandatory)                                            | Avoid dependency on Cursor/Grok pricing changes                      |

### Secondary Rule: Free-Credit Window

HIC received **$100 USD free cloud agent credit** (Cursor/Grok combined), with no specified expiration. **For cost control, apply a 21-day grace period:**

- **Days 1–21 (2026-09-20 through 2026-10-11):** Cloud agents permitted; usage tracked and logged
- **Day 22+ (2026-10-12 onward):** Cloud agents blocked; DGX mandatory
- **Budget overage:** Any cost incurred after Day 21 is non-reimbursable under this policy; HIC must explicitly opt-in to paid cloud

### Copilot Promotional Credit (HIC decision 27.09.2026)

GitHub Copilot Pro+ carries a one-time **$210.00 promotional credit** (21,000 AI credits; 1 credit = $0.01), expiring **2026-10-01** (GitHub billing page, HIC screenshot 27.09.2026; the GitHub email states 2026-09-30 23:59 UTC — use the earlier time).

- **Use in full.** Unused credit is lost, so spending it is zero-cost. Work order: `.claude/handoffs/copilot-bonus-credits-2026-09-30.md`.
- **No overage.** Stop Copilot agent work when the promotional line reaches $210; further Copilot usage is paid and needs HIC opt-in.
- **Log it.** Each Copilot PR is logged against its lane in the work order.

### Persistence Rule (HIC decision 27.09.2026)

Cloud agents may produce one-off output (PRs, fixes, reports, tests). **Anything that must persist — a scheduled job, a long-running agent, a service, a memory or state store, a recurring pipeline — must end up implemented on DGX.** A cloud agent that builds such a capability delivers it as DGX-deployable code (DGX cron, DGX runner, or DGX service), not as a cloud-hosted runtime. No cloud-agent session, Copilot workspace, or cloud trigger is the permanent home of a DWS capability.

**Rationale:** Free credit is temporary; using it past its useful life locks in cost expectations. After 21 days, DGX + local agents should be routine.

---

## Sandbox Environment Requirement

All agentic workloads (DGX or cloud) **must execute in an isolated sandbox** with:

1. **File isolation:** Agent can read/write only within `/home/user/<project>/` or equivalent namespace
2. **Network isolation:** Outbound access restricted to whitelisted endpoints (GitHub, Supabase, necessary APIs)
3. **Credential isolation:** No secrets in agent memory; use environment variables + .env (gitignored)
4. **Compute limits:** CPU/memory caps enforced to prevent runaway processes

**Exception:** Cloud agents (Cursor Cloud, Grok Cloud) run in vendor-provided sandboxes; no local isolation required if vendor sandbox is verified.

---

## Full Audit Trail Obligations

Every agentic session **must log**:

```
YYYY-MM-DD HH:MM:SS | SESSION_ID | AGENT_TYPE | SANDBOX_STATUS | WORKLOAD_CATEGORY | COMPUTE_LOCATION | DECISION | RATIONALE
```

**Fields:**

- `SESSION_ID`: Branch name or UUID (e.g., `claude/cursor-dws-audit-zl8ts1`)
- `AGENT_TYPE`: `cursor`, `grok`, `claude-code`, `opencode`, `custom`
- `SANDBOX_STATUS`: `isolated` (DGX/local) or `vendor` (cloud provider)
- `WORKLOAD_CATEGORY`: `engineering`, `research`, `spiking`, `pipeline`, `deployment`
- `COMPUTE_LOCATION`: `local-dgx`, `cloud-cursor`, `cloud-grok`, `cloud-openai`
- `DECISION`: `ALLOWED`, `BLOCKED`, `WARNED`, `OVERRIDE`
- `RATIONALE`: Why (e.g., "iterative task, within 21-day window", "spike approved by HIC", "after day 21, DGX required")

**Audit log location:** `.claude/hooks/audit/cost-policy.log` (gitignored)

**Export schedule:** Weekly CSV snapshot to Google Drive `/DWS6 Operations/Cost Audits/` (automated via `scripts/cost-audit-export.sh`)

---

## Enforcement Rules

### Option A: Hard Block (Post Day-21)

After 2026-10-12, `cost-policy-gate.sh` (PreToolUse hook) blocks any agent invocation that **requires** cloud compute:

```
PreToolUse → cost-policy-gate.sh
  ├─ If session age > 21 days AND agent_type ∈ {cursor-cloud, grok-cloud}
  │   ├─ Exit 2 (BLOCK)
  │   └─ stderr: "Cloud agents disabled after free-credit window (Day 22+). Use DGX only."
  └─ Otherwise: Exit 0 (ALLOW), log decision
```

**Effect:** Prevents accidental cost overruns; forces planned migration to DGX pipelines.

### Option B: Soft Audit + Warning

Throughout the 21-day window (Days 1–21), `cost-policy-gate.sh` logs and warns:

```
Day 1–17: Silent log
Day 18–21: Warn at session start
  "Free cloud-agent credit expires in N days (2026-10-11).
   After Day 21, DGX compute is mandatory.
   Migrate heavy workloads to local DGX pipeline now."
Day 22+: Block (see Option A)
```

**Effect:** Transparency + gradual transition; HIC sees impending cost cliff.

---

## Deviation & Override Process

**When to request override:**

1. **Real-time multi-agent orchestration** (> local parallelism)
   - Required: Proof that DGX cores insufficient (test results + timeline)
   - Approval: HIC signs off; logs `OVERRIDE_APPROVED_<date>_<reason>`
   - Cost: Charged to session's project code; visible on monthly report

2. **External API bottleneck** (GitHub MCP rate limiting, Supabase edge function latency)
   - Required: Vendor documentation of latency/throughput requirement
   - Approval: HIC + architect review; must include fallback plan to move to local caching

3. **Vendor security policy** (e.g., Cursor requires cloud for certain SaaS integrations)
   - Required: Policy doc from vendor
   - Approval: HIC; cost allowed under "unavoidable"

**No override:** Convenience, preference, or "it's faster"—these are not valid reasons.

---

## Integration with DWS Standards

This policy is **mandatory upstream** of:

- **DWS_TRUTH_STANDARD.md** (agent-authored code is truth; cost-justified provenance is part of truth)
- **DWS_ROLES_REGISTRY.md** (Cost Auditor role added; reports to HIC weekly)
- **CLAUDE.md** (Non-Negotiable Rules §X: "DGX-first agentic compute, cost audit required")

---

## Workload Categories (For Logging)

| Category        | Examples                                   | Preferred Compute                           |
| --------------- | ------------------------------------------ | ------------------------------------------- |
| **engineering** | Feature development, bug fixes, refactors  | DGX (high priority)                         |
| **research**    | Exploratory analysis, spike investigation  | Cloud OK (bounded time); DGX after findings |
| **spiking**     | Time-boxed PoC (≤4 hours)                  | Cloud acceptable if iterating fast          |
| **pipeline**    | Automated deployments, CI/CD orchestration | DGX (deterministic, repeatable)             |
| **deployment**  | Production releases, migrations            | DGX (auditability + no surprise costs)      |

---

## Rollout & Communication

**Timeline:**

- **2026-09-20:** Policy effective; hooks activated; advisory period begins (Days 1–21)
- **2026-10-11:** Last day of free-credit window
- **2026-10-12:** Hard block activated; DGX mandatory

**Communication:**

1. Notify HIC: Cost policy memo with timeline + audit dashboard
2. Update CLAUDE.md: Add reference to this standard
3. Session-start hook displays countdown: "Free credit: N days remaining"
4. Weekly audit report (CSV): Agent usage, compute location, costs incurred

---

## Rationale (Art. 14 Transparency)

**Why this policy exists:**

1. **Cost predictability:** Free credits are not infinite; move to sustainable cost model
2. **Vendor independence:** DGX-first reduces lock-in to Cursor/Grok pricing
3. **Auditability:** Full trail shows _why_ each tool was chosen, not just _that_ it was
4. **Replicability:** Future teams inherit the decision-making framework, not just the tools
5. **Compliance:** EU AI Act Art. 14 requires documented rationale for tool selection in regulated contexts

---

## Exceptions & Future Updates

**Managed exceptions:**

- HIC pre-approvals (documented in `.claude/handoffs/` per session)
- Vendor SaaS integrations (cannot avoid cloud; document in PR)
- Security incidents (expedited cloud override; logged post-incident)

**Review schedule:** This standard reviews quarterly (2026-12-20, 2027-03-20, etc.). Changes require HIC approval + CLAUDE.md update.

---

## References

- **CLAUDE.md:** Non-Negotiable Rules, Sender Identity, Session Learning Outcome Rule
- **DWS_TRUTH_STANDARD.md:** Agent provenance tracking
- **DWS_ROLES_REGISTRY.md:** Cost Auditor role
- **EU AI Act Art. 14:** Transparency requirements for AI-authored code
- **`.claude/hooks/cost-policy-gate.sh`:** Enforcement hook (source-of-truth)
- **`.claude/hooks/audit/cost-policy.log`:** Audit trail (gitignored)

---

## Version History

| Version | Date       | Changes                                                                                                                         | Author            |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1.0     | 2026-09-19 | Initial policy: DGX-first + 21-day free-credit window + sandbox requirement + full audit                                        | DWS Architecture  |
| 1.1     | 2026-09-27 | Copilot $210 promotional credit window (use in full, expires 2026-10-01); Persistence Rule: persistent capabilities land on DGX | HIC / Claude Code |
