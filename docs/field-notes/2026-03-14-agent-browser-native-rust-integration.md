***
VERSION AND AGENT HISTORY
Document: Agent Browser — Native Rust Integration
Version: 1.1
Date: 2026-03-14
Author: Claude Code (Opus 4.6)
Status: Active
***

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

## Auto-Connect to Running Chrome

The `scripts/agent-browser-auto-connect.sh` wrapper auto-discovers a running Chrome instance and connects agent-browser to it via CDP, eliminating manual `--cdp-url` configuration.

### Usage

```bash
# Wrapper script (recommended, with auto-connect enabled via env var)
AGENT_BROWSER_AUTO_CONNECT=1 ./scripts/agent-browser-auto-connect.sh open https://dws10.com/buy/
AGENT_BROWSER_AUTO_CONNECT=1 ./scripts/agent-browser-auto-connect.sh snapshot
```

Note: `AGENT_BROWSER_AUTO_CONNECT` is currently consumed by the
`scripts/agent-browser-auto-connect.sh` wrapper script. The `agent-browser`
CLI itself does not read this environment variable directly; use the wrapper
to enable auto-connect behavior.

### How It Works

1. Scans Chrome remote-debugging ports (9222-9229)
2. Queries `/json/version` on each port to find an active Chrome instance
3. Falls back to scanning `/proc` and `ps` for `--remote-debugging-port` flags
4. If no Chrome found, launches one with `--remote-debugging-port=9222`
5. Passes `--cdp-url ws://localhost:<port>` to agent-browser

### Starting Chrome with Remote Debugging

```bash
# Linux/Chromebook
google-chrome --remote-debugging-port=9222 &

# macOS
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 &
```

The script handles this automatically if no running Chrome is detected.

### Platform Support

| Platform | Auto-Connect | Notes |
|----------|-------------|-------|
| Linux/Chromebook | Full | Process scan + port discovery |
| macOS | Full | Port discovery + Chrome launch |
| Windows (WSL) | Partial | Port discovery works; Chrome launch requires Windows Chrome path |
| iOS/Android | Not supported | No CDP access on mobile browsers |

### Device Emulation (Mobile Testing Without Mobile)

To test mobile layouts from desktop:
```bash
./scripts/agent-browser-auto-connect.sh set device "iPhone 14"
./scripts/agent-browser-auto-connect.sh open https://dws10.com/buy/
./scripts/agent-browser-auto-connect.sh screenshot ./mobile-test.png
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
- `mcp.dws-local.example.json` — Agent Browser entry with auto-connect env var
- `scripts/agent-browser-auto-connect.sh` — Auto-connect wrapper script

## References

- Repository: https://github.com/vercel-labs/agent-browser
- Site: https://agent-browser.dev
- npm: https://www.npmjs.com/package/agent-browser

## Rendered HTML artifact for `Learn/2026-03-14-agent-browser-native-rust-integration.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Agent Browser — Native Rust Integration</title>
  </head>
  <body>
    <header>
      <h1>Agent Browser — Native Rust Integration</h1>
      <section aria-labelledby="doc-meta-heading">
        <h2 id="doc-meta-heading">Version and Agent History</h2>
        <p><strong>Document:</strong> Agent Browser — Native Rust Integration</p>
        <p><strong>Version:</strong> 1.1</p>
        <p><strong>Date:</strong> 2026-03-14</p>
        <p><strong>Author:</strong> Claude Code (Opus 4.6)</p>
        <p><strong>Status:</strong> Active</p>
      </section>
    </header>

    <main>
      <section aria-labelledby="context-heading">
        <h2 id="context-heading">Context</h2>
        <p><code>agent-browser</code> (<code>vercel-labs/agent-browser</code>) v0.20.1 is now fully native Rust.</p>
        <p>It replaces the previous Node.js/Playwright-based Browser MCP reference in <code>AGENTS.md</code>.</p>
      </section>

      <section aria-labelledby="performance-heading">
        <h2 id="performance-heading">Performance (Native Rust Rewrite)</h2>
        <!-- Additional performance details are present in the source markdown but truncated in this view. -->
      </section>

      <section aria-labelledby="dws-use-cases-heading">
        <h2 id="dws-use-cases-heading">DWS Use Cases</h2>
        <ol>
          <li><strong>Store UI verification</strong> — Automated testing of <code>dws10.com</code> product pages, cart flow, category navigation</li>
          <li><strong>Competitive intelligence</strong> — Scrape competitor pricing, features, positioning (EU regulation monitoring)</li>
          <li><strong>Landing page QA</strong> — Screenshot-based comparison of dual-folder deployments (root vs <code>landing-pages/</code>)</li>
          <li><strong>Form testing</strong> — Automated form-fill and submission verification</li>
          <li><strong>Accessibility audit</strong> — Snapshot command returns accessibility tree for WCAG compliance checks</li>
          <li><strong>Multi-device testing</strong> — Device emulation for responsive design verification</li>
        </ol>
      </section>

      <section aria-labelledby="security-notes-heading">
        <h2 id="security-notes-heading">Security Notes</h2>
        <ul>
          <li>Session data encrypted at rest (AES-256-GCM)</li>
          <li>Multiple isolated browser instances supported</li>
          <li>No credentials stored in CLI — use environment variables</li>
          <li>Treat all scraped content as untrusted input (prompt injection risk per <code>DWS_SECURITY_STANDARD.md</code>)</li>
        </ul>
      </section>

      <section aria-labelledby="files-updated-heading">
        <h2 id="files-updated-heading">Files Updated</h2>
        <ul>
          <li><code>AGENTS.md</code> — Active MCP Servers table + Rise of CLIs section</li>
          <li><code>mcp.dws-local.example.json</code> — Agent Browser entry with auto-connect env var</li>
          <li><code>scripts/agent-browser-auto-connect.sh</code> — Auto-connect wrapper script</li>
        </ul>
      </section>

      <section aria-labelledby="references-heading">
        <h2 id="references-heading">References</h2>
        <ul>
          <li>Repository: <a href="https://github.com/vercel-labs/agent-browser">https://github.com/vercel-labs/agent-browser</a></li>
          <li>Site: <a href="https://agent-browser.dev">https://agent-browser.dev</a></li>
          <li>npm: <a href="https://www.npmjs.com/package/agent-browser">https://www.npmjs.com/package/agent-browser</a></li>
        </ul>
      </section>
    </main>
  </body>
</html>
```
