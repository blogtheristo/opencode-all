# Admin Manual: Testing Infrastructure with Vitest

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - Vitest testing infrastructure documentation

Session Links & References:
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_TESTING.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English & Finnish (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.0  
**Effective Date:** 2025-12-30  
**Last Updated:** 2025-12-30  
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Vitest Configuration](#2-vitest-configuration)
3. [Testing Setup](#3-testing-setup)
4. [Running Tests](#4-running-tests)
5. [Writing Tests](#5-writing-tests)
6. [Coverage Reports](#6-coverage-reports)
7. [CI/CD Integration](#7-cicd-integration)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Overview

### Purpose / Tarkoitus

**English:**
This manual documents the Vitest testing infrastructure for the DWS IQ Platform. Vitest is a Vite-native testing framework that provides fast unit and integration testing with excellent TypeScript support.

**Suomi:**
Tämä käsikirja dokumentoi Vitest-testausinfrastruktuurin DWS IQ -alustalle. Vitest on Vite-natiivi testaustyökalu, joka tarjoaa nopean yksikkö- ja integraatiotestauksen erinomaisella TypeScript-tuella.

### Why Vitest? / Miksi Vitest?

**English:**
- ✅ **Vite-native**: Seamless integration with our Vite-based build system
- ✅ **Fast**: Instant hot module reload, parallel test execution
- ✅ **TypeScript**: First-class TypeScript support out of the box
- ✅ **Jest-compatible**: Familiar API for developers coming from Jest
- ✅ **Modern**: ESM support, watch mode, UI mode
- ✅ **Coverage**: Built-in coverage with c8/istanbul

**Suomi:**
- ✅ **Vite-natiivi**: Saumaton integraatio Vite-pohjaiseen build-järjestelmään
- ✅ **Nopea**: Välitön hot module reload, rinnakkainen testien suoritus
- ✅ **TypeScript**: Ensimmäisen luokan TypeScript-tuki suoraan
- ✅ **Jest-yhteensopiva**: Tuttu API Jest-kehittäjille
- ✅ **Moderni**: ESM-tuki, watch-tila, UI-tila
- ✅ **Kattavuus**: Sisäänrakennettu kattavuusraportointi c8/istanbul

---

## 2. Vitest Configuration

### Configuration File / Konfiguraatiotiedosto

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.ts',
        '**/*.d.ts'
      ]
    }
  }
})
```

### Key Settings / Keskeiset asetukset

| Setting | Value | Purpose |
|---------|-------|---------|
| `globals` | `true` | Enable global test APIs (`describe`, `it`, `expect`) |
| `environment` | `node` | Node.js test environment (use `jsdom` for browser) |
| `coverage.provider` | `c8` | Use c8 for native V8 coverage |
| `coverage.reporter` | `['text', 'json', 'html']` | Multiple report formats |

---

## 3. Testing Setup

### Install Dependencies / Asenna riippuvuudet

```bash
# Install Vitest and coverage tools
npm install --save-dev vitest @vitest/ui c8

# For React testing (if needed)
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 4. Running Tests

### Command Reference / Komentoviite

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run with UI dashboard
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test src/__tests__/example.test.ts

# Run tests matching pattern
npm test -- --grep "authentication"
```

### Watch Mode / Katselutila

**English:**
Watch mode automatically reruns tests when files change. Press `h` in watch mode for help menu.

**Suomi:**
Katselutila suorittaa testit automaattisesti uudelleen, kun tiedostoja muutetaan. Paina `h` katselutilassa ohjevalikkoa varten.

---

## 5. Writing Tests

### Test Structure / Testien rakenne

```typescript
// filepath: src/__tests__/example.test.ts
import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test async code', async () => {
    const result = await Promise.resolve('success')
    expect(result).toBe('success')
  })
})
```

### Testing Best Practices / Testauksen parhaat käytännöt

**English:**
1. **Arrange-Act-Assert**: Structure tests clearly
2. **One assertion per test**: Keep tests focused
3. **Descriptive names**: Use clear test descriptions
4. **Mock external dependencies**: Isolate units
5. **Test edge cases**: Cover error scenarios

**Suomi:**
1. **Järjestä-Toimi-Varmista**: Rakenna testit selkeästi
2. **Yksi assertio per testi**: Pidä testit keskitettyinä
3. **Kuvaavat nimet**: Käytä selkeitä testikuvauksia
4. **Mockaa ulkoiset riippuvuudet**: Eristä yksiköt
5. **Testaa reunatapaukset**: Kata virheskenaariot

### Example: Testing a Function

```typescript
// filepath: src/utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return a / b
}
```

```typescript
// filepath: src/__tests__/calculator.test.ts
import { describe, it, expect } from 'vitest'
import { add, divide } from '../utils/calculator'

describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })
  })

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should throw error on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero')
    })
  })
})
```

---

## 6. Coverage Reports

### Generate Coverage / Luo kattavuusraportti

```bash
# Generate coverage report
npm run test:coverage

# Output:
# - Terminal summary
# - HTML report in coverage/index.html
# - JSON report in coverage/coverage-final.json
```

### Coverage Thresholds / Kattavuusrajat

Add to `vitest.config.ts`:

```typescript
coverage: {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
}
```

### View HTML Report / Näytä HTML-raportti

```bash
# Open coverage report in browser
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

---

## 7. CI/CD Integration

### GitHub Actions Workflow

```yaml
# filepath: .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:run
      
      - name: Generate coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 8. Troubleshooting

### Common Issues / Yleiset ongelmat

#### Issue: "Cannot find module"

```bash
# Solution: Ensure TypeScript paths are configured
# Check tsconfig.json baseUrl and paths
```

#### Issue: "Timeout exceeded"

```typescript
// Solution: Increase timeout for slow tests
it('slow test', async () => {
  // Test code
}, { timeout: 10000 }) // 10 seconds
```

#### Issue: "Coverage not generated"

```bash
# Solution: Check coverage provider is installed
npm install --save-dev c8
```

---

## 📊 Testing Metrics

### Current Status

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | 80% | TBD |
| Total Tests | - | 0 |
| Passing Tests | 100% | - |
| Test Duration | <30s | - |

---

## 📚 Related Documentation

- **Architecture:** `ARCHITECTURE_SUMMARY.md`
- **DWS Document Standard:** `DWS_DOCUMENT_STANDARD.md`
- **GitHub Copilot Instructions:** `.github/copilot-instructions.md`

---

## 📞 Support

**English:**
- **Technical Issues:** Create GitHub issue
- **Testing Questions:** Check Vitest documentation
- **Coverage Reports:** See coverage/index.html

**Suomi:**
- **Tekniset ongelmat:** Luo GitHub-issue
- **Testikysymykset:** Katso Vitest-dokumentaatio
- **Kattavuusraportit:** Katso coverage/index.html

---

**Version:** 1.0  
**Last Updated:** 30.12.2025  
**Maintained By:** Development Team  
**License:** Proprietary - Lifetime Oy
