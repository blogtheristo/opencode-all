# DWS Technology Radar

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Initial creation - Technology Radar with Adopt/Trial/Assess/Hold rings, AI-friendliness ratings, populated from package.json dependencies

Session Links & References:

- Claude Code (claude/openai-harness-documentation-3QVGZ): https://github.com/blogtheristo/dws6

Document Status:

- Created: 14.03.2026
- Last Modified: 14.03.2026
- Language: English
- Publication Status: ACTIVE

---

**Version:** 1.0
**Effective Date:** 2026-03-14
**Last Updated:** 2026-03-14
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Ring Definitions](#2-ring-definitions)
3. [Adopt](#3-adopt)
4. [Trial](#4-trial)
5. [Assess](#5-assess)
6. [Hold](#6-hold)
7. [AI-Friendliness Rating Guide](#7-ai-friendliness-rating-guide)

---

## 1. Overview

This Technology Radar tracks the technologies used and considered by the DWS6 platform. Technologies are placed into four rings based on their maturity and recommendation level within the project. Each entry includes an AI-friendliness rating indicating how well autonomous agents can work with the technology.

**Principle:** Boring technology is good technology. Agents work best with stable, well-documented, widely-adopted tools.

---

## 2. Ring Definitions

| Ring       | Meaning                                                     |
| ---------- | ----------------------------------------------------------- |
| **Adopt**  | Production-proven in DWS6. Default choice for new work.     |
| **Trial**  | Active experimentation. Used in production with guardrails. |
| **Assess** | Worth investigating. Not yet used in production.            |
| **Hold**   | Do not use for new work. Migrate away when practical.       |

---

## 3. Adopt

These technologies are production defaults. Use them unless there is a compelling reason not to.

| Technology             | Version (package.json) | Category          | AI-Friendliness                                       | Notes                                                                                                  |
| ---------------------- | ---------------------- | ----------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Express**            | ^4.19.2                | Backend Framework | HIGH - Mature, predictable API, massive training data | Core HTTP server. Stable API surface since v4.                                                         |
| **TypeScript**         | ^5.6.3                 | Language          | HIGH - Type hints give agents strong context          | Strict mode enabled. Zod for runtime validation.                                                       |
| **Vitest**             | ^4.0.16                | Testing           | HIGH - Jest-compatible API, fast feedback loops       | Default test runner. Jest-compatible syntax.                                                           |
| **Zod**                | (via validators)       | Validation        | HIGH - Schema-as-code, self-documenting               | Runtime type validation. Used with express-validator.                                                  |
| **Supabase JS**        | ^2.39.0                | Database Client   | HIGH - Typed client, predictable query builder        | PostgreSQL + Auth + Realtime. EU-hosted (europe-north1).                                               |
| **Helmet**             | ^7.1.0                 | Security          | HIGH - Zero-config sensible defaults                  | HTTP security headers. No configuration surprises.                                                     |
| **dotenv**             | ^16.4.5                | Config            | HIGH - Simple key=value, universally understood       | Environment variable loading.                                                                          |
| **Pino**               | ^9.3.2                 | Logging           | HIGH - Structured JSON logs, agent-parseable          | Fast structured logger with pino-pretty for dev.                                                       |
| **cors**               | ^2.8.5                 | Security          | HIGH - Declarative config object                      | CORS middleware. Always use explicit origins (never `*`).                                              |
| **jsonwebtoken**       | ^9.0.2                 | Auth              | HIGH - Standard JWT, well-documented                  | JWT signing/verification.                                                                              |
| **bcryptjs**           | ^2.4.3                 | Auth              | HIGH - Single-purpose, hard to misuse                 | Password hashing. Pure JS implementation.                                                              |
| **node-cron**          | ^3.0.3                 | Scheduling        | HIGH - Simple cron syntax, no surprises               | Cron job scheduling for backend tasks.                                                                 |
| **express-rate-limit** | ^7.4.0                 | Security          | HIGH - Declarative middleware pattern                 | Rate limiting. Applied per-route.                                                                      |
| **tsx**                | ^4.19.2                | Dev Tooling       | HIGH - Drop-in node replacement for TS                | TypeScript execution without build step.                                                               |
| **Nodemailer**         | ^8.0.1                 | Email             | HIGH - Stable transport API, well-known               | Email sending. Used with SES transport.                                                                |
| ~~**Resend**~~         | ~~^4.0.0~~             | ~~Email~~         | ~~HIGH~~                                              | **BANNED** — Removed 2026-03-26 (Clawdbot C2 incident). Replaced by Amazon SES SMTP. See Hold section. |
| **AWS SES SDK**        | ^3.1006.0              | Email             | MEDIUM - Large SDK surface, but typed                 | Email infrastructure via AWS.                                                                          |
| **Luxon**              | ^3.7.2                 | Date/Time         | HIGH - Immutable, timezone-aware, well-typed          | DateTime handling. Replaces Moment.js.                                                                 |
| **ioredis**            | ^5.9.2                 | Cache             | HIGH - Predictable Redis client, typed                | Redis client for caching and pub/sub.                                                                  |
| **Upstash Redis**      | ^1.36.2                | Cache             | HIGH - REST-based Redis, serverless-friendly          | Edge-compatible Redis for Cloudflare Workers.                                                          |
| **pg**                 | ^8.20.0                | Database          | HIGH - Raw PostgreSQL driver, well-understood         | Direct PostgreSQL access for migrations and scripts.                                                   |
| **supertest**          | ^7.2.2                 | Testing           | HIGH - Express-native HTTP testing                    | Integration testing for Express routes.                                                                |

**Frontend (referenced in CLAUDE.md, dashboard packages):**

| Technology      | Version | Category     | AI-Friendliness                                         | Notes                                               |
| --------------- | ------- | ------------ | ------------------------------------------------------- | --------------------------------------------------- |
| **React**       | 19.x    | UI Framework | HIGH - Massive training corpus, functional components   | Default UI library. Functional components only.     |
| **Vite**        | 7.x     | Build Tool   | HIGH - Convention over config, fast HMR                 | Default bundler. Replaced Webpack.                  |
| **TailwindCSS** | 4.x     | Styling      | HIGH - Utility classes map directly to CSS, predictable | Default styling. Agents excel at utility-first CSS. |

---

## 4. Trial

Active experimentation. Used in production with guardrails. Evaluate for promotion to Adopt.

| Technology              | Version | Category      | AI-Friendliness                                      | Notes                                                 |
| ----------------------- | ------- | ------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| **Temporal.io**         | -       | Orchestration | MEDIUM - DSL-like workflow definitions, growing docs | Workflow orchestration for long-running agent tasks.  |
| **Claude Agent SDK**    | ^0.2.50 | AI/Agent      | MEDIUM - Evolving API, but well-typed                | Agent swarm orchestration. Core to DWS IQ 6.          |
| **Groq**                | -       | AI/Inference  | MEDIUM - OpenAI-compatible API, fast inference       | Fast LLM inference. Used for low-latency agent tasks. |
| **Alibaba OpenSandbox** | ^0.1.0  | Sandboxing    | LOW - Early-stage, limited documentation             | Code execution sandboxing. Evaluate security posture. |

---

## 5. Assess

Worth investigating. Not yet used in production. Research and prototype only.

| Technology | Category  | AI-Friendliness                                      | Notes                                                          |
| ---------- | --------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| **Bun**    | Runtime   | MEDIUM - Node-compatible but edge cases exist        | Alternative JS runtime. Monitor for Express compatibility.     |
| **Deno**   | Runtime   | MEDIUM - Good TS support but different module system | Alternative runtime. Interesting security model (permissions). |
| **tRPC**   | API Layer | HIGH - End-to-end type safety, less boilerplate      | Type-safe APIs without REST. Evaluate for internal services.   |

---

## 6. Hold

Do not use for new work. Existing usage should be migrated when practical.

| Technology    | Category      | AI-Friendliness | Replacement            | Reason                                                                                                                                                               |
| ------------- | ------------- | --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jest**      | Testing       | HIGH            | Vitest                 | Vitest is faster, ESM-native, Jest-compatible API.                                                                                                                   |
| **Webpack**   | Build Tool    | MEDIUM          | Vite                   | Vite is simpler config, faster builds, better DX.                                                                                                                    |
| **Moment.js** | Date/Time     | HIGH            | Luxon / native `Intl`  | Moment is in maintenance mode. Luxon already in use.                                                                                                                 |
| **jQuery**    | DOM           | HIGH            | React / vanilla JS     | No jQuery in DWS6. React handles all UI.                                                                                                                             |
| **CommonJS**  | Module System | HIGH            | ESM (`type: "module"`) | Project uses ESM. New files must use `import/export`.                                                                                                                |
| **Resend**    | Email         | HIGH            | Amazon SES SMTP        | **BANNED** — Suspected C2 exfiltration channel (Clawdbot incident 2026-03-26). Never re-add. See `docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`. |

---

## 7. AI-Friendliness Rating Guide

AI-friendliness measures how effectively autonomous agents (Claude Code, Cursor, Copilot) can work with a technology. Boring, stable, well-documented technologies score highest.

| Rating     | Criteria                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **HIGH**   | Stable API (2+ years unchanged), extensive training data, typed interfaces, predictable behavior, convention-over-configuration |
| **MEDIUM** | Evolving API, adequate documentation, some edge cases, typed but with gaps                                                      |
| **LOW**    | Rapidly changing API, sparse documentation, undocumented behaviors, novel patterns                                              |

**Principle:** When choosing between two equivalent technologies, prefer the one with higher AI-friendliness. Agent productivity compounds over time.

---

_Document maintained as part of the DWS6 technology governance process._
_Next review: 2026-06-14 (quarterly)_
