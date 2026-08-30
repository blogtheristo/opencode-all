# Field Note — Data Structures Audit

**Date:** 2026-08-10  
**Session:** claude/data-structures-audit  
**Author:** Copilot (HIC: Risto Anton Päärni)  
**Trigger:** Linus Torvalds quote — "Bad programmers worry about the code. Good programmers worry about data structures and their relationships."

---

## Why This Matters

LLMs write impressive-looking code. They also routinely choose wrong data structures — and then write a lot of correct-but-unnecessary code to work around the penalty. Arrays where Maps belong. Linear scans on every call. Aliases rebuilt fresh on each invocation. Silent overwrites. Duplicated logic that should live in one place.

If you don't audit, you won't see it. If you see it but don't know what's better, you won't fix it. This session is the audit.

---

## What Was Found

Audit scope: `src/agents/` — the platform's core reasoning layer.

### 1. `industry-registry.ts` — O(n) Lookups on a Static Registry (HIGH)

**Before:**  
`getIndustryById()` called `INDUSTRY_REGISTRY.find((p) => p.id === id)` — a full linear scan of 25 entries on every call. `getIndustryByName()` rebuilt the entire alias lookup object (`Record<string, number>`) inside the function body on every invocation, then called `getIndustryById()` again, triggering a second scan. `industriesWithoutDedicatedAgent()` filtered the array on every call.

**After:**  
Three module-level indexes built once at import time:
- `_INDUSTRY_BY_ID: Map<number, IndustryProfile>` — O(1) id lookup via `.get()`
- `_INDUSTRY_BY_NAME_LOWER: Map<string, IndustryProfile>` — O(1) exact name lookup
- `_ALIAS_TO_ID: ReadonlyMap<string, number>` — O(1) alias resolution (replaces the object literal rebuilt per call)
- `_INDUSTRIES_WITHOUT_DEDICATED_AGENT: readonly IndustryProfile[]` — precomputed once

The O(n) fuzzy substring fallback is retained — but it is now the true last resort, used only when no exact or alias match exists, not as the first path.

**Why it matters:** Industry lookups happen on every agent execution that touches sector context. Exact and alias matches — the vast majority of calls — are now O(1).

---

### 2. `sovereignty-monitor.agent.ts` — Duplicated Region-Check Logic (MEDIUM)

**Before:**  
The class had a private `isEuResident(region?: string): boolean` method at line 584. Two other methods (`checkDataResidency`, `checkBackupSovereignty`) duplicated the same logic inline:
```typescript
const regionLower = si.region.toLowerCase();
const isEu = EU_REGIONS.some((r) => regionLower.includes(r));
```

**After:**  
Both call `this.isEuResident()`. The duplication is gone. The `EU_REGIONS` array is the single source of truth, accessed only through the method.

**Why it matters:** Duplicated logic is a maintenance hazard — a change to the EU region list or the matching algorithm must now be made in one place, not three.

---

### 3. `tools.ts` — Silent Tool Handler Overwrite (HIGH)

**Before:**  
```typescript
export function registerToolHandler(name: string, handler: ToolHandler): void {
  toolHandlers.set(name, handler);  // Silently overwrites any existing handler
```

**After (current):**  
```typescript
if (toolHandlers.has(name)) {
  logger.warn('Tool handler already registered — skipping duplicate', { tool: name });
  return;  // First registered wins; duplicate is logged at WARN, not swallowed silently
}
```

**Precedence rule (canonical, explicit):** `registerToolHandler` enforces **first-registered-wins**. The first caller to register a given tool name owns that name for the lifetime of the process. Any subsequent registration for the same name is dropped and logged at `warn` level. This is a **breaking change** from the pre-PR "last-registered-wins" (silent overwrite) behavior.

**Who this affects:**
- **Test harnesses** that register a mock tool handler _after_ `initializeBuiltinTools()` has already registered the real one will silently keep the real handler. Mocks must either use a unique tool name or reset module state (e.g. `vi.resetModules()`) between tests.
- **Dynamic tool loaders / agent extensions** that rely on overriding a built-in tool at runtime will no longer work. Any intentional override must be registered _before_ `initializeBuiltinTools()` is called, or the tool name must differ from built-ins.
- **Normal agent startup** is unaffected: built-ins are registered once; no override patterns exist in production boot sequences.

**Why first-wins over last-wins:** The original silent-overwrite behaviour was a correctness race — initialization order determined which handler actually ran, with no log or assertion to catch accidental collisions. First-wins makes initialization order explicit and observable (via the `warn` log) without requiring a process restart to diagnose. The architectural debt (module-level shared state across `AgentRegistry` instances) is logged in the backlog as a future isolated-registry refactor.

**Unit test coverage added:** `src/__tests__/agents/tools-register.test.ts` asserts that (a) the first handler executes, (b) the duplicate registration emits `logger.warn` with the tool name, and (c) a fresh registration does not emit a warning.

---

### 4. `mercury.agent.ts` + `hephaestus.agent.ts` — Repeated `.find()` on `successful[]` (MEDIUM)

**Before:**  
After building a `successful` array from `Promise.allSettled` results, both agents extracted individual results using repeated `.find((r) => r.label === 'X')` — one full scan per label.

**After:**  
One `Map` built from the array immediately after filtering:
```typescript
const successfulByLabel = new Map(successful.map((r) => [r.label, r]));
```
All subsequent lookups use `.get()`.

**Why it matters:** The array is small (3–5 elements), so the raw performance win is minor. The real gain is clarity: the Map makes the intent explicit — "I'm looking up a specific label" — and eliminates the risk of someone adding a fourth `.find()` call that the reader has to mentally de-duplicate.

---

## What Was Not Changed (and Why)

- **`EU_REGIONS` array → Set:** The check is `EU_REGIONS.some((r) => regionLower.includes(r))` — a substring match, not an exact match. A `Set.has()` would only work for exact strings. Converting to Set would change semantics. DRY consolidation (fix #2) is the right lever here.
- **`Record<string, unknown>` in AgentResponse:** Pervasive and requires a full type-system redesign. Logged as a future backlog item.
- **Repeated `.filter()` chains in compliance/seo agents:** Out of scope for this surgical pass; logged for a follow-up.

---

## Remaining Backlog (Not Fixed This Session)

| Item | File | Impact |
|------|------|--------|
| `AgentResponse.result: Record<string, unknown>` — type erasure at every agent boundary | `src/agents/types.ts` | High — needs design |
| `any[]` in ERP connector abstract methods | `src/integrations/erp/base-connector.ts` | Medium |
| Optional fields that should be discriminated unions | `src/agents/memory.types.ts` | Medium |
| Repeated `.filter()` chains computing same condition | `compliance.agent.ts`, `seo-audit.agent.ts` | Medium |
| Cache invalidation by string substring | `src/agents/memory.service.ts` | Low-medium |

---

## Engineering Principle Reinforced

Linus is right. The data structure question comes first:
- **Array vs Map:** Do you need ordered iteration, or keyed lookup? If lookup, use Map.
- **Object literal inside a function vs module-level Map:** If the object is constant, build it once.
- **Deduplication after the fact vs Set from the start:** If uniqueness matters, the right structure makes it automatic.
- **Optional fields vs discriminated unions:** If two fields are always present together or absent together, they belong in a separate type.

The code that wraps a bad data structure is not the problem. The data structure is. Fix the structure first; the code simplifies itself.

---

## HIC Action

No HIC action required. Changes are defensive improvements with no behavioral change to external API contracts.

**One question for the HIC:** The `AgentResponse.result: Record<string, unknown>` pattern erases all type information at the agent boundary — every agent result is an opaque bag. Do you want to prioritize designing typed result builders for the next session, starting with the agents whose output is most frequently consumed downstream (compliance, sitesense, customer-sat)?
