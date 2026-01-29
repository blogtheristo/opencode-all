# Copilot Instructions for DWS6

## Project Overview

**DWS IQ 6** is an enterprise-grade industrial climate intelligence and compliance platform for EU-regulated industries. It automates climate compliance (Fit for 55, ETS, CBAM, CSRD) across 16 EU industries.

## Tech Stack

### Frontend
- React 19.2, Vite 7.2, TypeScript 5.9, TailwindCSS 4.1
- Zod for schema validation
- Supabase JS SDK for backend integration

### Backend
- Express 4.19 with TypeScript
- Node-cron for task scheduling
- JWT authentication, Helmet for security

### AI/LLM
- Claude (Anthropic) - Primary AI model
- Google Gemini, Groq API
- LlamaStack for LLM orchestration

### Database
- Supabase (PostgreSQL + Auth + Realtime)
- pgvector for embeddings

## Code Style

### TypeScript
- Use strict TypeScript configuration
- Use Zod schemas for runtime validation
- Prefer interface-first design for API contracts
- Avoid `any` types

### React
- Use functional components with hooks
- Use TailwindCSS for styling
- Co-locate components with their styles

### Naming Conventions
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

## Development Commands

```bash
# Backend
npm run dev              # Start Express backend with hot reload
npm run build            # Build TypeScript
npm run test             # Run Vitest tests
npm run lint             # ESLint

# Dashboard (in dws6.com/dashboard/firehorse/v9-react/)
npm run dev              # Start Vite dev server
npm run build            # Production build
```

## Security Rules

### Never
- Commit secrets or credentials
- Commit customer data (PII, GDPR protected)
- Skip input validation
- Use `any` types in TypeScript
- Force push to main/master
- **Expose Admin/ folder to GitHub in ANY case**
- Use `git add -f Admin/` or similar force commands
- Create exceptions in `.gitignore` for Admin files
- Use `git worktree` (disabled until April 2026 - security incident)

### Always
- Use environment variables for secrets
- Validate all input data
- Write tests for new features
- Use parameterized queries for database operations
- Use `security-reports/` for CI/CD generated reports (not Admin/)

## Git Workflow

### Branch Naming
- `claude/<feature>-<session-id>` - AI-assisted work
- `feature/<name>` - New features
- `fix/<description>` - Bug fixes

### Commit Messages
```
<type>: <description>

Types: feat, fix, docs, style, refactor, test, chore
```

## Key Directories

```
src/                     # Backend/shared logic
dws6.com/dashboard/      # React dashboards
public/                  # Static assets served by Express
supabase/migrations/     # Database migrations
.github/workflows/       # CI/CD pipelines
```

## Deployment

- **Primary**: Scaleway Serverless Containers (EU-hosted)
- **Container Registry**: rg.fr-par.scw.cloud
- **Region**: fr-par (Paris, France)

## Testing

- Run `npm test` before committing
- Maintain >80% coverage for new code
- Use Vitest for unit/integration tests
