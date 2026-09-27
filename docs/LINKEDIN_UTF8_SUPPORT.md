# LinkedIn UTF-8 Support

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 | Model: gpt-5.6-sol | Agent: copilot | Date: 26.09.2026 | Changes: Corrected test commands, documented both publishing surfaces, and clarified startup-time vault loading.
- Version: 1.0 | Tool: GitHub Copilot Coding Agent | Date: 25.09.2026 | Changes: Initial LinkedIn UTF-8 support documentation.

Document Status:

- Created: 25.09.2026
- Last Modified: 26.09.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Operations Guide
- Harness: GitHub Copilot CLI
- HIC-approved-drift: none

---

## Overview

The Firehorse omnichannel service and social scheduler preserve UTF-8 LinkedIn
post text, including Scandinavian characters (`ä`, `ö`, `å`).

## Technical Implementation

1. **UTF-8 handling:** Both publishers use LinkedIn's `/v2/ugcPosts` endpoint and send `Content-Type: application/json; charset=utf-8`.
2. **NFC normalization:** `normalizeLinkedInText()` composes equivalent Unicode sequences before publishing, so decomposed input such as `a` plus a combining diaeresis becomes `ä`.
3. **Credential management:** Publishers read credentials from `process.env`. At application startup, `loadSecrets()` can populate missing LinkedIn values from the configured Aiven or GCP vault; existing environment values retain priority.

### Relevant Code

- `src/firehorse/linkedin-service.ts` publishes Firehorse omnichannel shares.
- `src/social-scheduler/publisher.ts` publishes approved social-scheduler posts.
- `src/utils/linkedin-text.ts` provides the shared NFC normalizer.
- `src/config/secret-loader.ts` maps the LinkedIn token and author identity to vault keys.

## Testing

Run the UTF-8 normalization tests and pending-queue regression suite from the repository root:

```bash
npm test -- --run src/__tests__/linkedin-text.test.ts src/__tests__/linkedin-pending.test.ts
```

- `linkedin-text.test.ts` verifies that Finnish and Swedish letters survive normalization and that decomposed input is NFC-composed.
- `linkedin-pending.test.ts` verifies queue persistence and error handling. It does not call LinkedIn.
- Neither suite performs a live LinkedIn API request. A successful production publish is confirmed by the returned post URN.

## Usage

1. **Content preparation:** Use ordinary UTF-8 text; do not apply little-text escaping when publishing through `/v2/ugcPosts`.
2. **Credentials:** Configure `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_AUTHOR_URN`, or `LINKEDIN_ORGANIZATION_ID` for the Firehorse organization fallback. Prefer the vault loader in production.
3. **Startup:** Call `loadSecrets()` before code that reads LinkedIn credentials.
4. **Publishing:** Check the returned result. Dry-run or failed responses are not proof that LinkedIn received the post.

Example valid content:

```
Päärni — metsäteollisuus
Öppen för en snabb demo?
All characters should be preserved: äöå
```

## Security Considerations

- The vault loader fills only missing environment values and never overwrites values already present at startup.
- Use the Aiven provider for the repository's EU-sovereign default; GCP Secret Manager remains an explicitly CLOUD Act-exposed alternative.
- Never place LinkedIn tokens in source, documentation, logs, or command output.

## API Endpoints

- **Posts API:** `/v2/ugcPosts`
- **User info:** `/v2/userinfo` for access-token validation

The legacy `escapeLinkedInLittleText()` helper remains available only for callers that still target `/rest/posts`. The active publishers use plain-text UGC commentary and must not pre-escape Scandinavian text.

---

Version 1.1 · 26.09.2026  
© 2026 Lifetime Oy. All rights reserved.  
Classification: INTERNAL
