# Retired: DWS IQ Mobile Dashboard

**Retired:** 2026-07-04

## Why

This app was a code-free shell (Phase 1 "Foundation" only — docs, `package.json`, 9 mock fixtures; Phase 2 "Environment & Build Setup" never started). It was dormant for 6 months. See `docs/field-notes/2026-07-03-mobile-apps-ui-library-audit.md` for the full audit that surfaced this, and `docs/field-notes/2026-07-04-training-secret-egress.md`'s sibling session notes for the retirement decision.

The decision (confirmed by the product owner 2026-07-04): fold the NCC Corporate scope into `Firehorse/mobile-app` — already a fully built app on the same stack (Expo, React Native Paper, Redux Toolkit) — rather than build a second Expo tree from scratch. This avoids maintaining two dependency surfaces for one product concept.

## Where the scope went

- **Portfolio KPI dashboard** (SPI/CPI/active-projects/at-risk tiles, project list with RAG badges) — already covered by `Firehorse/mobile-app/src/screens/DashboardScreen.tsx` ("DWS IQ 6 Dashboard").
- **Alerts Center** (the genuinely missing piece) — added as `Firehorse/mobile-app/src/screens/AlertsScreen.tsx`, registered in the drawer under "NCC PORTFOLIO".
- The remaining Phase 3–11 items in `docs/IMPLEMENTATION_PLAN.md` below (API integration, OAuth2/OIDC auth, offline cache, E2E tests, release prep) were never built and are not carried forward automatically — they're future work if NCC becomes a firm commercial commitment, to be scoped against `Firehorse/mobile-app`'s existing architecture at that point, not this shell's.

## What's preserved here

The original docs (`README.md`, `docs/ARCHITECTURE.md`, `docs/API_SPECIFICATION.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/SETUP.md`) and fixtures (`config/fixtures/*.json`) are kept as-is for reference — they describe the intended NCC API contract and are useful if/when real backend integration is scoped.
