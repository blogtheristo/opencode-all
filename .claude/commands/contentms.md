---
name: contentms
description: >
  Firehorse Content DMS (Evidence Vault) — upload certificates, search the vault, track
  expirations, run HIL review of AI-drafted content, publish artifacts to onelifetime.world. Use
  when user says "evidence vault", "DMS", "when does cert expire", "approve draft", "publish
  blog post", or mentions ISO/CSRD/ETS certificates or artifact distribution.
---

Interact with the Firehorse Content DMS (aka Evidence Vault) via the HTTP API at `/api/v1/content/*` (22 endpoints, mounted in `src/app.ts`).

The DMS is a five-agent pipeline: Document Classifier auto-tags on upload, Expiration Tracker warns before certs lapse, Search Agent does semantic lookup, Access Controller enforces visibility, Archive Manager handles lifecycle transitions. Drafts can be routed through HIL review before `publish_artifact` distributes them to `onelifetime.world/posts/` (blog) or `onelifetime.world/legal/` (legal).

Input: $ARGUMENTS (natural language or JSON for a specific endpoint)

## Steps

1. Parse the user's request and pick the right endpoint from the table below.
2. Direct HTTP: `curl -sS -X <METHOD> http://localhost:8080/api/v1/content/<path> -H 'Content-Type: application/json' -d '<json>'`.
3. For expiration checks, pass `organization_id` and `days` (default 30) — surface any cert with `days_until_expiry <= 30` as a red flag.
4. For HIL workflow: `POST /hil/request` → reviewer queue via `GET /hil/pending` → `POST /hil/:id/approve` or `POST /hil/:id/reject`. Only approved drafts can be published.

## Common endpoints

| Method | Path                              | Purpose                                             |
| ------ | --------------------------------- | --------------------------------------------------- |
| POST   | `/api/v1/content`                 | Upload a document (Document Classifier auto-tags)   |
| GET    | `/api/v1/content`                 | List content for an organization                    |
| GET    | `/api/v1/content/:id`             | Get a single item by id or slug                     |
| PATCH  | `/api/v1/content/:id`             | Update an existing content item                     |
| GET    | `/api/v1/content/search`          | Semantic search across the vault                    |
| GET    | `/api/v1/content/expiring`        | Certs expiring within N days                        |
| GET    | `/api/v1/content/stats`           | Organization-level counts and breakdowns            |
| POST   | `/api/v1/content/:id/share`       | Create a share link with access scope               |
| POST   | `/api/v1/content/:id/transition`  | Move through lifecycle (draft → review → published) |
| POST   | `/api/v1/content/hil/request`     | Send a draft into the human review queue            |
| GET    | `/api/v1/content/hil/pending`     | List items awaiting reviewer action                 |
| POST   | `/api/v1/content/hil/:id/approve` | Approve a queued draft                              |
| POST   | `/api/v1/content/hil/:id/reject`  | Reject with a reason                                |
| POST   | `/api/v1/content/:id/publish`     | Publish approved content                            |

Full reference: `src/contentms/routes.ts` (22 endpoints).

## MCP tools

18 MCP tools (`contentms_*`) are defined in `src/contentms/mcp-tools.ts`. They become callable via `/mcp` once `src/mcp/**/*` is unstubbed in `tsconfig.json` and the MCP agent server is restored. Until then, use the HTTP API.

## When NOT to use

- Report generation (Board Pack, Annual, Compliance, Carbon) → `/firehorse-report-*`
- Blog post authoring outside the vault → edit `onelifetime.world/posts/<slug>.html` directly per `BLOG_STANDARD.md`
- Thesis files → never route through this DMS; follow the CLAUDE.md Thesis Update Rule

## Standards references

- `src/contentms/service.ts` — 5-agent pipeline
- `src/contentms/routes.ts` — 22 HTTP endpoints
- `src/contentms/mcp-tools.ts` — 18 MCP tools (handlers, dispatched via HTTP for now)
- `Firehorse/ContentMS/README.md` — product spec
