# DocuSign eSignature Integration — Developer Note

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/verify-nda-signatures-rdgOj | Date: 21.03.2026 | Changes: Initial field note — DocuSign JWT integration, mutual NDA signing, Qantic GmbH first test, MD-to-PDF conversion pipeline

Session Links & References:
  - Claude Code Session: https://claude.ai/code/session_018frQoqZEi6pram6vmDjeu9
  - Branch: claude/verify-nda-signatures-rdgOj
  - PR: pending

Document Status:
  - Created: 21.03.2026
  - Last Modified: 21.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note — Integration / Legal Tech

Related Documents:
  - CLAUDE.md (Lifetime Oy Legal Identity Rule, DocuSign Account, Qantic Contact)
  - Partners/NDA_TEMPLATE_EU_2026.md (Mutual NDA template v2.0)
  - Partners/NDA_Qantic.md (First live NDA — Qantic GmbH)
  - src/integrations/docusign/client.ts (DocuSign client v1.1.0)
  - src/integrations/docusign/types.ts (Type definitions v1.0.0)
  - scripts/verify-nda-signatures.ts (CLI tool v1.1.0)
  - Admin/SECURITY_COMPLIANCE.md (Vendor risk — DocuSign)
  - .env.example (DocuSign environment variables)

***

## Summary

DocuSign eSignature integration is now operational for mutual NDA signing. The system uses JWT Grant authentication (service account), supports dual-signer envelopes, auto-converts Markdown documents to PDF, and provides a CLI for sending and tracking. First successful test: mutual NDA sent to Risto Paarni and Thomas Kalitzky (Qantic GmbH) via DocuSign sandbox on 21.03.2026.


## 1. Architecture

### Components

| Component | File | Purpose |
|-----------|------|---------|
| DocuSign Client | src/integrations/docusign/client.ts | JWT auth, envelope CRUD, sendNDA, sendMutualNDA |
| Type Definitions | src/integrations/docusign/types.ts | Enums, interfaces, webhook types |
| Barrel Export | src/integrations/docusign/index.ts | Public API surface |
| CLI Script | scripts/verify-nda-signatures.ts | auth, consent, list, status, send commands |
| NDA Template | Partners/NDA_TEMPLATE_EU_2026.md | Mutual NDA template v2.0 |

### Authentication

- Method: OAuth 2.0 JWT Grant (Service Account)
- No user interaction required — suitable for CLI and automation
- Token TTL: 1 hour (3600 seconds), cached and reused
- Scope: signature impersonation
- RSA-SHA256 signing with PEM private key from environment

### API

- DocuSign eSignature REST API v2.1
- Transport: Native Node.js fetch (no external HTTP dependencies)
- Base URLs auto-derived from environment (demo vs production)


## 2. DocuSign Account

| Field | Value |
|-------|-------|
| Developer Account | risto.paarni@lifetime.fi |
| Environment | Demo (sandbox) — switch to production for live signing |
| Integration Key | 3fc9680c-fae6-41bc-93eb-3f4377db51d0 |
| User ID | 5f700ff5-51dc-4a06-8e57-e416a710bee8 |
| Account ID | 6eb1e2af-f0f0-475f-9464-a3cc17c4d8d1 |
| Demo Base URL | https://demo.docusign.net/restapi |
| Demo OAuth URL | account-d.docusign.com |
| Production Base URL | https://na1.docusign.net/restapi |
| Production OAuth URL | account.docusign.com |


## 3. Environment Variables

Required in .env (see .env.example lines 238-244):

| Variable | Purpose | Default |
|----------|---------|---------|
| DOCUSIGN_ENABLED | Feature flag | false |
| DOCUSIGN_ENVIRONMENT | demo or production | demo |
| DOCUSIGN_INTEGRATION_KEY | OAuth app UUID | (from DocuSign dashboard) |
| DOCUSIGN_USER_ID | Service account UUID | (from DocuSign dashboard) |
| DOCUSIGN_ACCOUNT_ID | Account UUID | (from DocuSign dashboard) |
| DOCUSIGN_RSA_PRIVATE_KEY | PEM private key (escaped newlines OK) | (generate in DocuSign) |

CRITICAL: RSA private key must include -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- markers. Escaped newlines (\n) are auto-converted by the client.


## 4. CLI Commands

| Command | Usage | Purpose |
|---------|-------|---------|
| auth | npx tsx scripts/verify-nda-signatures.ts auth | Test JWT authentication |
| consent | npx tsx scripts/verify-nda-signatures.ts consent | Get one-time OAuth consent URL |
| list | npx tsx scripts/verify-nda-signatures.ts list | List envelopes from last 30 days |
| status | npx tsx scripts/verify-nda-signatures.ts status <id> | Check envelope + recipient status |
| send | npx tsx scripts/verify-nda-signatures.ts send <file> | Send mutual NDA for dual signing |

### Send Command Details

The send command:
1. Accepts .md or .pdf files (default: Partners/NDA_Qantic.md)
2. Auto-converts .md to .pdf using pandoc (primary) or markdown-pdf (fallback)
3. Displays signer emails and environment
4. Prompts for Y/n confirmation before sending
5. Creates dual-signer envelope (routingOrder 1 then 2)
6. Returns envelope ID for tracking

Pandoc conversion uses: xelatex engine, 2.5cm margins, 11pt font.


## 5. Client API Methods

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| authenticate() | (none) | token string | JWT access token (cached) |
| sendEnvelope(request) | CreateEnvelopeRequest | EnvelopeResult | Send document(s) for signing |
| sendNDA(params) | signer + document path | EnvelopeResult | Single-signer NDA convenience |
| sendMutualNDA(params) | 2 signers + document path | EnvelopeResult | Dual-signer mutual NDA |
| getEnvelopeStatus(id) | envelopeId | EnvelopeStatusResult | Check status + recipients |
| listEnvelopes(fromDate) | ISO date string | EnvelopeStatusResult[] | Query recent envelopes |
| downloadDocument(id, docId, path) | envelopeId, documentId, outputPath | file path | Download signed PDF |
| voidEnvelope(id, reason) | envelopeId, reason | void | Cancel unsigned envelope |
| getConsentUrl() | (none) | URL string | First-time consent link |

### Envelope Status Flow

created -> sent -> delivered -> signed -> completed
                                       -> declined
                                       -> voided


## 6. Mutual NDA Signing Flow

### Signature Anchors

Documents must contain anchor strings for signature placement:
- /sn1/ — Party A (Lifetime Oy) signature position
- /sn2/ — Party B (counterparty) signature position

The anchor string is invisible in the final document but tells DocuSign where to place each signature field. Y-offset of -10 positions the signature 10px above the anchor.

### Signing Order

1. Signer 1 (routingOrder 1) receives email, reviews, signs
2. After Signer 1 completes, Signer 2 (routingOrder 2) receives email
3. After both sign, status changes to "completed"
4. Both parties receive final signed PDF


## 7. First Test — Qantic GmbH Mutual NDA (21.03.2026)

### Test Details

| Field | Value |
|-------|-------|
| Document | Partners/NDA_Qantic.md |
| Environment | DocuSign Sandbox (demo) |
| Signer 1 | Risto Anton Paarni <risto.paarni@lifetime.fi> |
| Signer 2 | Thomas A. Kalitzky <t.kalitzky@qantic.com> |
| Conversion | pandoc (xelatex) — MiKTeX warnings (cosmetic, non-blocking) |
| Result | SUCCESS — demo NDA delivered to both signers |

### MiKTeX Warnings (Windows)

On Windows with MiKTeX, pandoc shows warnings:
- "miktex-dvipdfmx: critical issue: You are running MiKTeX on an unsupported version of Windows."
- "xelatex: major issue: So far, you have not checked for MiKTeX updates."

These are cosmetic warnings from MiKTeX on Windows 11 24H2+. The PDF is generated correctly despite the warnings.

### Document Corrections Made During Session

1. Qantic address: verified via Handelsregister HRB 202069 B — Lohmuhlenstrasse corrected to Lohmuhlenstrasse 65 with proper umlaut
2. Thomas email: support@qantic.com corrected to t.kalitzky@qantic.com
3. Lifetime Oy BUID: confirmed 0772407-9 (not 3464035-4), VAT ID FI07724079 added
4. NDA structure: converted from one-way to mutual (Party A / Party B)


## 8. NDA Template v2.0 Changes

The NDA template (Partners/NDA_TEMPLATE_EU_2026.md) was upgraded from v1.0 to v2.0 to match the Qantic NDA structure:

| Change | v1.0 (old) | v2.0 (new) |
|--------|-----------|-----------|
| Structure | One-way (Disclosing/Receiving) | Mutual (Party A / Party B) |
| Format | Markdown (#, **bold**) | Plain text (DocuSign-compatible) |
| Definitions | "disclosed by Lifetime" | "disclosed by either Party" |
| Warranties | "Lifetime makes no warranties" | "Neither Party makes warranties" |
| Assignment | Only Recipient restricted | Neither Party can assign |
| Remedies | One-sided for Lifetime | Symmetrical for both Parties |
| Penalty | EUR [AMOUNT] | EUR 100,000 default |
| Address | c/o Lifetime Oy / c/o Lifetime Group | Clean address |
| VAT ID | Not included | FI07724079 |
| USAGE NOTES | Internal notes at bottom | Removed |
| Schedule B | Single list | Split per party |


## 9. Rules Established This Session

### CLAUDE.md Updates

1. Lifetime Oy Legal Identity Rule (CRITICAL) — BUID 0772407-9, VAT FI07724079, always correct wrong BUIDs
2. DocuSign Account — developer account risto.paarni@lifetime.fi, NDA template and send script references
3. Qantic GmbH Contact (CRITICAL) — t.kalitzky@qantic.com, never support@qantic.com
4. Rule #9 strengthened — "Never Delete Files — Always Rename to _OLD" with mandatory human confirmation before renaming

### LOI Template Fix

docs/partnerships/qantic-loi-template.md — BUID corrected from 3464035-4 to 0772407-9, city from Helsinki to Espoo


## 10. Production Checklist

Before switching from demo to production:

- [ ] Change DOCUSIGN_ENVIRONMENT=production in .env
- [ ] Generate new RSA key pair in DocuSign production account
- [ ] Update DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_ACCOUNT_ID for production
- [ ] Grant consent via production consent URL (one-time)
- [ ] Add signature anchors /sn1/ and /sn2/ to NDA documents
- [ ] Test with internal signing before sending to external parties
- [ ] Add DocuSign webhook (Connect) for real-time status updates
- [ ] Consider adding NDA_Qantic.pdf to .gitignore (generated artifact)


## 11. Session Commit History

| Commit | Message |
|--------|---------|
| c8ba74c | feat: add DocuSign eSignature integration for NDA signature tracking |
| aa5ec58 | feat: add NDA signature verification script and update DocuSign config |
| f665185 | fix: replace axios with native fetch in DocuSign client |
| e54e9a5 | fix: use wildcard re-export in docusign index for Node.js 24 compat |
| b678d15 | feat: add mutual NDA for Qantic GmbH with correct registered address |
| 049257e | fix: correct Lifetime Oy BUID to 0772407-9 and add legal identity rule |
| b667f98 | chore: remove generated NDA_QANTIC_2026.md — waiting for local version |
| 2abea40 | chore: rename generated Qantic NDA to OLD — waiting for local version |
| 7a25120 | fix: strengthen rule #9 — never delete, rename to _OLD, ask human first |
| afbaf9f | Add Partners/NDA_Qantic.md for partner NDA reference |
| e9d5743 | fix: correct Qantic address umlaut |
| dd490e9 | feat: add mutual NDA signing — sendMutualNDA() + send command |
| 4e93501 | fix: correct Thomas email to t.kalitzky@qantic.com |
| d4aac6f | feat: add Y/n confirmation prompt before sending mutual NDA |
| 69e0f46 | fix: simplify environment label to DocuSign |
| 7f77c7b | feat: auto-convert MD to PDF before DocuSign send |
| 1a2190e | fix: align NDA template v2.0 with Qantic NDA structure |
| 62d8b41 | fix: correct Thomas email to t.kalitzky@qantic.com in NDA + add notes |


## 12. Lessons Learned

1. DocuSign cannot convert .md files to PDF — always convert before sending
2. MiKTeX on Windows 11 24H2+ shows critical warnings but works correctly
3. Always verify company addresses from official registers (Handelsregister, PRH) before legal documents
4. Template should be plain text, not markdown — ensures compatibility with all document processors
5. Mutual NDA structure is preferred for partnership discussions — symmetrical protection
6. Never delete files — rename to _OLD and ask human first (rule #9 incident)
7. Agent should push back on destructive operations, not comply silently
