# Architecture Layers — Dependency Direction Rules

VERSION AND AGENT HISTORY

| Version | Date       | Agent        | Change Summary                          |
|---------|------------|--------------|-----------------------------------------|
| 1.0     | 2026-03-14 | Claude Opus  | Initial architecture layer documentation |

---

## Overview

The DWS6 backend (`src/`) follows a strict layered architecture. Dependencies flow in ONE direction only — from foundational layers toward the application entry point. Violating this direction creates circular dependencies, makes testing harder, and breaks module isolation.

## Dependency Direction

```
types/  →  config/  →  services/  →  middleware/  →  agents/  →  routes/  →  app.ts
  ↑                                                                            ↑
  └─── foundational (no imports from higher layers) ───────────────────────────┘
                                                                       entry point
```

Each layer may only import from layers to its LEFT. Never from layers to its RIGHT.

## Layer Definitions

### 1. `types/` — Type Definitions

Pure TypeScript types, interfaces, and Zod schemas. Zero runtime dependencies.

**May import from:** nothing (leaf layer)
**May NOT import from:** config, services, middleware, agents, routes

### 2. `config/` — Configuration

Environment variable parsing, feature flags, constants. Reads from `process.env`.

**May import from:** types
**May NOT import from:** services, middleware, agents, routes

### 3. `services/` — Business Logic

Core business logic, database access (Supabase), external API clients, LLM integrations.

**May import from:** types, config
**May NOT import from:** middleware, agents, routes

### 4. `middleware/` — Express Middleware

Authentication, rate limiting, request validation, error handling, logging.

**May import from:** types, config, services
**May NOT import from:** agents, routes

### 5. `agents/` — AI Agents

Autonomous agent logic, agent orchestration, MCP tool handlers.

**May import from:** types, config, services, middleware
**May NOT import from:** routes

### 6. `routes/` — Express Routes

HTTP route handlers. Thin layer that wires middleware and services to endpoints.

**May import from:** types, config, services, middleware, agents
**May NOT import from:** app.ts

### 7. `app.ts` — Entry Point

Application bootstrap. Assembles routes, middleware, and starts the server.

**May import from:** all layers

## Common Violations and Remediation

### Violation: Service imports from a route

```
src/services/billing.ts imports from src/routes/payment.ts
```

**Why it is wrong:** Services are reusable business logic. If a service depends on a route, it cannot be called from agents, CLI commands, or tests without pulling in Express.

**Remediation:** Extract the shared logic into a service function. Have both the route and the original service call that function.

### Violation: Type file imports a service

```
src/types/user.ts imports from src/services/auth.ts
```

**Why it is wrong:** Types are the foundation layer. If types depend on services, every file that imports a type transitively depends on every service dependency (database clients, HTTP libraries, etc.).

**Remediation:** Move the runtime logic out of the type file. If you need a type that a service returns, define it in `types/` and have the service import it — not the reverse.

### Violation: Config imports middleware

```
src/config/cors.ts imports from src/middleware/auth.ts
```

**Why it is wrong:** Config is loaded at startup before middleware is initialized. Circular initialization order causes undefined values at runtime.

**Remediation:** Config should export plain objects or values. Middleware reads config — never the other way around.

### Violation: Middleware imports a route

```
src/middleware/validate.ts imports from src/routes/api.ts
```

**Why it is wrong:** Middleware must be reusable across routes. Importing a specific route creates a circular dependency and prevents the middleware from being used elsewhere.

**Remediation:** If the middleware needs route-specific data (e.g., a schema), pass it as a parameter: `validate(schema)` returns a middleware function.

### Violation: Agent imports from routes

```
src/agents/compliance.ts imports from src/routes/compliance.ts
```

**Why it is wrong:** Agents should be invocable from CLI, MCP, scheduled jobs, and routes. Depending on a route handler locks the agent to HTTP-only execution.

**Remediation:** Move shared logic into `services/`. The route and the agent both import from the service.

## Utility Folders

The following folders sit outside the layer hierarchy and have special rules:

| Folder | Rule |
|--------|------|
| `utils/` | May import from: types, config only. Treat as same level as services. |
| `database/` | May import from: types, config only. Provides database client to services. |
| `logging/` | May import from: types, config only. Available to all layers. |
| `__tests__/` | May import from anything — tests are not part of the dependency graph. |

## Enforcement

This architecture is documented but not yet enforced by ESLint import boundaries. When `eslint-plugin-boundaries` or equivalent is added, the layer map above will be codified as lint rules.

Until automated enforcement exists:
- **Code review:** Reviewers check import direction on every PR touching `src/`.
- **Agent rule:** AI agents (Claude Code, Cursor) must verify imports comply before committing.
- **Quick check:** Run `grep -rn "from.*routes" src/services/` — any matches are violations.
