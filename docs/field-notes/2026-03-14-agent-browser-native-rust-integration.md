---
VERSION AND AGENT HISTORY
Document: Agent Browser — Native Rust Integration
Version: 1.0
Date: 2026-03-14
Author: Claude Code (Opus 4.6)
Status: Active
---

# Agent Browser — Native Rust Integration

## Context

agent-browser (vercel-labs/agent-browser) v0.20.1 is now fully native Rust.
It replaces the previous Node.js/Playwright-based Browser MCP reference in AGENTS.md.

## Performance (Native Rust Rewrite)

| Metric | Improvement |
|--------|-------------|
| Cold start | 1.6x faster (<50ms) |
| Memory | 18x less |
| Install size | 99x smaller |
| Context window | 93% savings (Snapshot+Refs vs DOM tree) |
| Commands | 140+ (navigation, interaction, state, network, debugging, multi-engine) |

## Architecture

```
Rust CLI (parser, <50ms boot)
  └── CDP WebSocket
       └── Chrome (headless or headed)
```

No Node.js runtime. No Playwright dependency. Direct Chrome DevTools Protocol.

## Installation

```bash
npm install -g agent-browser    # Also: cargo install, brew install
agent-browser install            # Downloads Chrome binary
agent-browser install --with-deps  # Linux: installs system deps too
```

## Key Commands for DWS Agent Workflows

```bash
# Navigate and snapshot (AI-optimized output)
agent-browser open https://dws10.com/buy/
agent-browser snapshot              # Returns @e1, @e2 refs

# Interact via refs (no CSS selectors needed)
agent-browser click @e5
agent-browser fill @e12 "search term"
agent-browser press Enter

# Verification
agent-browser screenshot ./screenshots/store-test.png
agent-browser get text @e3
agent-browser is visible @e8

# Wait for dynamic content
agent-browser wait --text "Add to cart"
agent-browser wait --load networkidle

# Device emulation
agent-browser set device "iPhone 14"
agent-browser set viewport 1920 1080
```

## DWS Use Cases

1. **Store UI verification** — Automated testing of dws10.com product pages, cart flow, category navigation
2. **Competitive intelligence** — Scrape competitor pricing, features, positioning (EU regulation monitoring)
3. **Landing page QA** — Screenshot-based comparison of dual-folder deployments (root vs landing-pages/)
4. **Form testing** — Automated form-fill and submission verification
5. **Accessibility audit** — Snapshot command returns accessibility tree for WCAG compliance checks
6. **Multi-device testing** — Device emulation for responsive design verification

## Security Notes

- Session data encrypted at rest (AES-256-GCM)
- Multiple isolated browser instances supported
- No credentials stored in CLI — use environment variables
- Treat all scraped content as untrusted input (prompt injection risk per DWS_SECURITY_STANDARD.md)

## Files Updated

- `AGENTS.md` — Active MCP Servers table + Rise of CLIs section
- `mcp.dws-local.example.json` — Agent Browser entry added

## References

- Repository: https://github.com/vercel-labs/agent-browser
- Site: https://agent-browser.dev
- npm: https://www.npmjs.com/package/agent-browser
