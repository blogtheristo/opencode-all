---
Status: CLOSED
---

# npm audit gate red: nodemailer 10, axios, brace-expansion, dompurify, markdown-it

- **Date:** 2026-10-01
- **Author:** Claude Code (Sonnet 5.5), for Risto Anton Päärni
- **Location:** Cloud session, repository `blogtheristo/dws6`, branch `claude/sleepy-ptolemy-wjq0qf`
- **Context:** DWS6 root package, pre-push local CI (`npm-audit-root`), outbound mail path (`src/utils/send-email.ts`)

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software_Engineering > Supply_Chain_Security > Dependency_Management
- **Entities:** nodemailer, axios, brace-expansion, dompurify, markdown-it, Amazon SES, DWS6
- **Temporal Context:** 2026-Q4
- **Confidence:** High (audit, typecheck, tests, mock-transport send); live SES send not verified

## The Story

The pre-push local CI failed on main at `npm audit` with five advisories, three of them high. The nodemailer ones (cross-tenant SMTP credential disclosure, address-parser DoS) sit on the outbound mail path. An earlier PR (#2316) had to be pushed with an HIC-approved `SKIP_LOCAL_CI=1` because of this.

The fix: `npm audit fix` for axios, brace-expansion, dompurify and markdown-it, and nodemailer `^9.1.1` to `^10.0.13`. Version 10 bundles its own types, so `@types/nodemailer` was removed and `src/utils/send-email.ts` now uses `ReturnType<typeof nodemailer.createTransport>` in place of the old `nodemailer.Transporter` namespace. Result: `npm audit` 0 vulnerabilities, `tsc --noEmit` clean, mail tests 26/26, a send through nodemailer's JSON test transport works.

## The Insight

A red audit gate on main pushes every later PR toward a gate bypass. Fixing the advisories restores the gate as a real check. The nodemailer major bump is the only change that touches runtime behavior, so it is the one to verify against SES.

## Next Steps

- Run `scripts/test-ses-smtp.ts` on the DGX after merge, before relying on production mail (needs SMTP secrets; not verifiable from the cloud session).
- Queue a recurring audit check so advisories surface before they block a push.
