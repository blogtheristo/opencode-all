---
applyTo: "**/*test*.{ts,js,py},src/__tests__/**/*,tests/**/*"
excludeAgent: "code-review"
---

# Testing Instructions

## TypeScript/Vitest Tests

### Mock Setup Pattern

**CRITICAL: Mock modules BEFORE importing them:**

```typescript
import { vi, describe, test, expect } from 'vitest';

// 1. Mock dependencies FIRST
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateJWT: vi.fn((req, res, next) => next())
}));

vi.mock('../services/email.service.js', () => ({
  EmailService: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ success: true })
  }))
}));

// 2. THEN import modules that depend on mocks
const { default: router } = await import('../routes/api.routes.js');
```

### Testing API Routes

**Standard route test structure:**

```typescript
import request from 'supertest';
import express from 'express';

describe('GET /api/resource', () => {
  const app = express();
  app.use(router);
  
  test('returns 200 for valid request', async () => {
    const response = await request(app)
      .get('/api/resource')
      .query({ country: 'FI', year: '2024' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
  
  test('returns 400 for invalid country code', async () => {
    const response = await request(app)
      .get('/api/resource')
      .query({ country: 'INVALID', year: '2024' });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/__tests__/auth.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# UI mode (interactive)
npm run test:ui
```

## Python Tests

### Pytest Structure

```python
import pytest
from mymodule import calculate_emissions

def test_calculate_emissions_valid_input():
    """Test emissions calculation with valid data."""
    result = calculate_emissions('steel', 100.0, {'steel': 1.5})
    assert result == 150.0

def test_calculate_emissions_missing_factor():
    """Test emissions calculation with missing material factor."""
    result = calculate_emissions('unknown', 100.0, {'steel': 1.5})
    assert result == 0.0

@pytest.mark.parametrize('material,quantity,expected', [
    ('steel', 100, 150),
    ('concrete', 200, 100),
    ('aluminum', 50, 75),
])
def test_calculate_emissions_multiple_materials(material, quantity, expected):
    """Test emissions for multiple materials."""
    factors = {'steel': 1.5, 'concrete': 0.5, 'aluminum': 1.5}
    result = calculate_emissions(material, quantity, factors)
    assert result == expected
```

### Running Python Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_emissions.py

# Run with coverage
pytest --cov=Firehorse --cov-report=html

# Verbose output
pytest -v
```

## Security Tests

**Test input validation and sanitization:**

```typescript
describe('Security: Input Validation', () => {
  test('rejects SQL injection attempts', async () => {
    const response = await request(app)
      .get('/api/users')
      .query({ email: "' OR '1'='1" });
    
    expect(response.status).toBe(400);
  });
  
  test('sanitizes HTML in user input', async () => {
    const response = await request(app)
      .post('/api/comments')
      .send({ text: '<script>alert("xss")</script>' });
    
    expect(response.status).toBe(201);
    expect(response.body.text).not.toContain('<script>');
  });
});
```

## Common Testing Issues

### Issue: "Cannot find module" in Vitest
**Cause:** Missing mock or incorrect import order  
**Fix:** Ensure `vi.mock()` is called before `import`

### Issue: Tests pass locally but fail in CI
**Cause:** Environment-dependent behavior (timestamps, random data)  
**Fix:** Mock `Date.now()`, use fixed seeds for random data

```typescript
vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
```

### Issue: Async tests timeout
**Cause:** Missing await or unresolved promise  
**Fix:** Always await async operations, increase timeout if needed

```typescript
test('slow operation', async () => {
  await slowFunction();
}, 10000); // 10 second timeout
```

## Test Coverage Goals

- **New code:** >80% coverage required
- **Critical paths:** 100% coverage (auth, payments, security)
- **View coverage:** `npm test -- --coverage`
- **HTML report:** Opens `coverage/index.html` in browser
