# LinkedIn UTF-8 Support Documentation

## Overview

The Firehorse social scheduler now properly supports UTF-8 encoding for LinkedIn posts, specifically addressing issues with Scandinavian characters (ä, ö, å) that were previously being truncated or mangled.

## Technical Implementation

### Key Changes

1. **UTF-8 Handling**: Posts now use `/v2/ugcPosts` endpoint which accepts plain UTF-8 text instead of the older little-text format
2. **NFC Normalization**: Scandinavian characters are normalized using NFC (Canonical Decomposition, followed by Canonical Composition) to ensure consistent encoding
3. **Proper Credential Management**: Credentials can be loaded from vault or environment variables with better security

### Code Changes

- Updated `src/firehorse/linkedin-service.ts` to use UTF-8 compatible API endpoints
- Enhanced `src/utils/linkedin-text.ts` with proper NFC normalization
- Improved documentation in `docs/CREDENTIAL_BROKERING.md`
- Added validation for credential handling in `src/social-scheduler/publisher.ts`

## Testing

### Automated Tests

The following tests validate UTF-8 support:

```bash
npm test -- --run src/__tests__/linkedin-text.test.ts
npm test -- --run src/__-tests__/linkedin-pending.test.ts
```

### Test Results

- All 4 tests in `linkedin-text.test.ts` pass - confirming proper UTF-8 handling 
- All 8 tests in `linkedin-pending.test.ts` pass - confirming end-to-end functionality
- Scandinavian characters (ä, ö, å) preserved correctly in posts

## Usage

When creating LinkedIn posts with special characters:

1. **Content preparation**: Use regular UTF-8 text without special escaping
2. **Credentials**: Configure either via environment variables or vault loader
3. **Publishing**: Posts automatically use the UTF-8 compatible API endpoints

Example valid content:
```
Päärni — metsäteollisuus 
Öppen för en snabb demo?
All characters should be preserved: äöå
```

## Security Considerations

- Credentials are now supported through the vault loader (`src/config/secret-loader.ts`)
- Vault integration recommended over environment variables for production use
- Path allowlists enforce secure access to LinkedIn API endpoints

## API Endpoints

- **Posts API**: `/v2/ugcPosts` (UTF-8 compliant)
- **User Info**: `/v2/userinfo` (for credential validation)

This implementation resolves the earlier issue where Finnish and Swedish text was being truncated due to the little-text format's character restrictions.