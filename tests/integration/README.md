# Integration Tests

Slow, heavier tests that exercise multiple real components together (real HTTP
via supertest against mounted routers, real DB containers, network stubs at the
edge). They are **excluded from the fast PR gate**:

- `npm run test:unit` — fast gate (`src/**`, what CI runs per PR)
- `npm run test:integration` — everything in this directory
- `npx vitest run` — both tiers (what the flake detector and release checks run)

## Conventions

- File naming: `<area>.integration.test.ts`
- Spin up real dependencies via testcontainers or local docker-compose; never
  mock the unit under test's own collaborators here (that is what `src/__tests__` is for).
- Keep runtime < 5 min; anything longer belongs in a nightly job, not here.
