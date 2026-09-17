# KYA-S1 Specification Conformance Baseline

## Scope

This baseline tests the Agent Trust Score (ATS) permission bands defined by
`standards/kya-open/SPEC.md` section 2.2. KYA-S1 is a specification, not a
standard.

The suite currently verifies only:

- ATS values at or above `0.80` receive `FULL_SANDBOX`.
- ATS values from `0.50` through `0.79` receive `RESTRICTED`.
- ATS values below `0.50` receive `SUSPENDED` and fail closed.
- Non-finite and out-of-range ATS values are rejected.
- Deterministic ATS fixtures match the production classifier.

It does not establish full KYA-S1 conformance. Capability-manifest signatures,
mandate gating, evidence chains, verified-done attestations, revocation, and
human-oversight controls require separate tests against production
implementations before DWS may make a complete conformance claim.

## Files

- `src/fairness/trust-score-classifier.ts` implements the ATS permission bands.
- `src/fairness/test-snapshots.ts` contains typed deterministic ATS fixtures.
- `src/__tests__/kya-standard-conformance.test.ts` executes the baseline.

## Execution

```bash
npx vitest run src/__tests__/kya-standard-conformance.test.ts
```

## Version History

- **Version 1.1.0** - Aligned terminology and ATS thresholds with the canonical
  KYA-S1 specification; removed non-executable placeholder assertions.
- **Version 1.0.0** - Initial draft.
