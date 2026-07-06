---
description: Send any document for legally binding eSignature via DocuSign (scripts/sign-report.ts). Usage: /sign-document <file> [signer]. Defaults signer to Risto Anton Paarni. Local machine only (needs DOCUSIGN_* keys in .env).
---

# /sign-document — DocuSign eSignature for any document

Send a document for a legally binding eSignature using the existing Firehorse
Signed Reports pipeline (`scripts/sign-report.ts` → `src/integrations/docusign/`).

## Why this exists (and why NOT a signature image)

A reusable signature image in the repo would be a forgery-enabling artifact and
PII in permanent git history (Non-Negotiable Rule 1). DocuSign stores the
signer's adopted signature and reuses it per envelope with full audit trail
(identity, timestamp, envelope ID) — court-defensible where a pasted image is
not. This command is the sanctioned "sign anything quickly" path.

## Inputs

- `FILE` (required): path to the PDF/document to sign.
- `SIGNER` (optional): `"Name <email>"`. Default: `"Risto Anton Paarni <risto.paarni@lifetime.fi>"`.
- Additional signers: repeat `--signer` (sequence: author → reviewer → approver → auditor via `(role)` suffix).

## Procedure

1. **Environment check.** This works only where `DOCUSIGN_INTEGRATION_KEY`,
   `DOCUSIGN_USER_ID`, `DOCUSIGN_ACCOUNT_ID`, `DOCUSIGN_RSA_PRIVATE_KEY` exist
   in `.env` (Risto's local machine). Cloud sessions: emit the command for the
   human to run locally — do not attempt to fetch the keys (RED zone).
2. **Send:**
   ```powershell
   npx tsx scripts/sign-report.ts send "<FILE>" --signer "<SIGNER>"
   ```
   Capture the returned envelope ID.
3. **Track:** `npx tsx scripts/sign-report.ts status <envelope-id>`
4. **Retrieve when completed:** `npx tsx scripts/sign-report.ts download <envelope-id> [--output-dir ./signed]`
5. **Archive:** store the completed PDF where the engagement lives (e.g.
   `Partners/<partner>-received/` for partner contracts) and record the
   envelope ID in the relevant tracking document (partner record, case file).

## Guardrails

- Signing/sending is a human decision — an agent may prepare and emit the
  command but never triggers a legally binding signature autonomously.
- Never commit signature images, DocuSign keys, or RSA material to the repo.
- Counterparty-bound documents (NDAs, contracts): verify the counterparty's
  legal identifiers before sending for signature.

## Example (first real use, 2026-07-06)

Aiven mutual NDA: envelope `f7382f1c-4342-856a-81df-9fc4f27206db`, signed same
day. See `Partners/outreach/2026-04-18-aiven.md` §4/§9.
