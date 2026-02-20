---
applyTo: "src/**/*.ts"
---

# Backend API Instructions (TypeScript)

## Input Validation Pattern

**ALWAYS use express-validator for query and body validation:**

```typescript
import { query, validationResult } from 'express-validator';

router.get('/api/resource',
  query('country').isLength({ min: 2, max: 2 }).isAlpha(),
  query('year').isInt({ min: 2000, max: 2100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Safe to use req.query here
  }
);
```

## Testing Routes

**ALWAYS mock auth middleware to avoid JWT_SECRET dependencies:**

```typescript
import { vi } from 'vitest';

// Mock BEFORE imports
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateJWT: vi.fn((req, res, next) => next())
}));

// THEN dynamic import routes
const { default: router } = await import('../routes/my.routes.js');
```

## Email Service Usage

**Default email configuration:**
```typescript
import { EmailService } from '../services/email.service.js';

const emailService = new EmailService({
  from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
  apiKey: process.env.RESEND_API_KEY
});

// NEVER use noreply@ addresses
await emailService.send({
  to: 'user@example.com',
  from: 'risto@onelifetime.world',  // ✅ Replyable
  // from: 'noreply@dws6.com',       // ❌ PROHIBITED
  subject: 'Welcome',
  html: emailTemplate
});
```

## Logging Pattern

**Use logger from utils/logger.js (not console.log):**

```typescript
import logger from '../utils/logger.js';

logger.info('User authenticated', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
logger.warn('Rate limit approaching', { endpoint: req.path });
```

**Exception:** Scripts in `scripts/` may use `console.log` for CLI output.

## Common Pitfalls

### Issue: "Cannot find module" in tests
**Cause:** Mocking after import  
**Fix:** Place `vi.mock()` calls BEFORE imports, then use dynamic `await import()`

### Issue: Authentication tests fail with JWT errors
**Cause:** Missing JWT_SECRET mock  
**Fix:** Mock auth middleware as shown above

### Issue: Rate limiting fails in tests
**Cause:** Redis connection not mocked  
**Fix:** Mock Redis services in test setup
