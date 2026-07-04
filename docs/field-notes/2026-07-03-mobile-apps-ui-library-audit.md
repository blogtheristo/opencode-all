# Field Note: Mobile Apps UI-Library & Dependency Audit

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Initial creation — full audit of both mobile applications triggered by "replace the unmaintained UI library (native-base)"

Document Status:

- Created: 03.07.2026
- Last Modified: 03.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Trigger

Dependency remediation left `Firehorse/mobile-app` (14 moderate) and `mobile-dashboard` (18 moderate + 2 high, incl. unmaintained `native-base`) unfixed, gated on "Expo major upgrade + UI library replacement requiring native verification." The instruction was to replace the unmaintained UI library with a known-good one in both, and audit the whole application, its usage scenario, and implementation. The audit changed the plan — the premise that _both_ apps needed a UI-library replacement was wrong.

## Finding 1 — `mobile-dashboard` has no implementation at all

`mobile-dashboard/` ("DWS IQ Mobile Dashboard", target customer NCC Corporate) contains **zero source code**: no `src/`, no `App.tsx`, no screens — only planning docs (11-phase implementation plan), 9 JSON fixtures, and a `package.json`. Phase 1 ("Foundation") completed 2025-12-23; Phase 2 ("Setup & Config, 2-3 days") never started. Dormant ~6 months.

Consequences:

- `native-base` was declared but **never imported by anything** — repo-wide grep for `from 'native-base'` returns zero hits outside `node_modules`. Both HIGH findings (`native-base`, `lodash.pick`) existed purely in a manifest for code that doesn't exist.
- "Replacing" the UI library here is a manifest edit, not a migration. No screens to port, no visual regression possible, no native build to verify.
- The declared stack had rotted beyond native-base: Expo 49 (EOL), `react-query` v3 (abandoned; superseded by `@tanstack/react-query`), deprecated `@types/react-native` (types ship with RN itself now), `redux` pinned separately (bundled in Redux Toolkit).

**Action taken:** rewrote the manifest to a coherent, current, known-good stack aligned with the sibling app's conventions — Expo SDK 57 (react 19.2.3 / RN 0.86.0), **React Native Paper 5.15** (+ `react-native-vector-icons`) replacing native-base, TanStack Query 5 replacing react-query 3, React Navigation 7, Redux Toolkit 2, jest-expo 57. Removed deprecated `@types/react-native` and the redundant standalone `redux`. Updated the three planning docs (README, QUICK_REFERENCE, IMPLEMENTATION_PLAN) that still named NativeBase. Result: **20 → 0 vulnerabilities.**

## Finding 2 — `Firehorse/mobile-app` never had the problem

The real, implemented app (11 screens: Dashboard, Diary, Inspection, CarbonReport, ControlRoom, SituationRoom, Omnichannel, Automation, Settings, Report, Home) **already uses React Native Paper 5.x throughout** — `PaperProvider` with a custom `nordicTheme` in `App.tsx`, Paper components in all 14 source files. There was no unmaintained UI library to replace. Its 14 moderate findings traced to exactly **two root advisories**, both in build-time tooling, not app runtime:

- `postcss <8.5.10` (XSS in stringify output) — pulled only by `@expo/metro-config`.
- `uuid <11.1.1` (buffer bounds check in v3/v5/v6-with-buf) — pulled by `xcode`, `@expo/bunyan`, `@expo/rudder-sdk-node`. All three call `v4()` via named exports (uuid 7/8 API, preserved in 11); none pass a buffer, so the advisory was not even exploitable in this usage.

**Action taken:** two `overrides` entries (`uuid >=11.1.1`, `postcss >=8.5.10`), following the security-pin overrides convention already established in that package.json (16 prior entries). No Expo SDK bump, no runtime code touched, no native verification needed — the overridden packages are dev/build tooling. Result: **14 → 0 vulnerabilities.**

The Expo 50 → current SDK migration remains desirable for support-lifecycle reasons but is **no longer security-gated**; it can be scheduled as ordinary maintenance with proper simulator/EAS verification.

## Implementation-quality observations (Firehorse/mobile-app)

- Architecture is clean and conventional: Redux Toolkit slices (`carbonSlice`, `offlineSlice`, `inspectionSlice`, `diarySlice`), drawer navigation, WatermelonDB for offline, BLE (`react-native-ble-plx`), camera/location/signature capture — consistent with the field-inspection usage scenario.
- **No tests exist** — `find` returns no `*.test.*`/`*.spec.*` files. The jest/`@testing-library/react-native` toolchain is not even declared here (unlike mobile-dashboard, which declares a full test setup for code that doesn't exist — an ironic inversion). This is the app's biggest quality gap and made this audit's "no runtime impact" claim rest on dependency-tree analysis instead of a test run. Recommend: add smoke tests for the four store slices before the eventual Expo SDK migration, so that migration has a safety net.
- `numeral` (declared in mobile-dashboard) is also effectively unmaintained (last release 2017) but is not a UI library, has no known advisories, and is not imported anywhere; it was left in place — flag for removal when Phase 2 ever starts.

## Decision needed (not taken unilaterally)

`mobile-dashboard` has been a code-less shell for ~6 months. Options: (a) resume Phase 2 on the now-clean foundation, or (b) fold the NCC dashboard scope into `Firehorse/mobile-app` as new screens and retire `mobile-dashboard/` per the `_RETIRED` convention. (b) avoids maintaining two Expo trees and two dependency surfaces — this audit is itself evidence of that cost — but it is a product decision, not an engineering default.

## Verification

- `npm audit` clean (0 total) in both directories after `npm install --package-lock-only` lockfile regeneration.
- No source imports of any removed/replaced package anywhere in the repo (grep-verified).
- Repo root suite untouched by these changes (isolated package trees).
