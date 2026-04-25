# Playwright — Browser Capability for DWS Agents

# VERSION AND AGENT HISTORY

***

| Version | Date       | Agent       | Change                                           |
| ------- | ---------- | ----------- | ------------------------------------------------ |
| 1.0.0   | 2026-04-25 | Claude Code | Initial Playwright wiring (utility + MCP + CLI). |

---

## 1. Why Playwright

DWS agents need to fetch pages whose content is rendered by JavaScript (EUR-Lex deep links, EFRAG tables, competitor SPAs, EU Commission portals). A plain `axios.get()` would return a near-empty HTML shell. The `/browse` skill had documented this need but referenced an external Rust binary (`agent-browser`) that was never installed.

Playwright (Chromium, headless) is the chosen replacement: in-tree npm dependency, type-safe, well-maintained, and already familiar to most contributors.

## 2. Architecture

```
┌─────────────────────┐
│   /browse  skill    │  Slash command for QA & ad-hoc research
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   dws browse CLI    │  cli/src/cli.ts → cmdBrowse()
└──────────┬──────────┘
           │ HTTP POST /mcp (JSON-RPC)
           ▼
┌─────────────────────┐
│   MCP agent server  │  src/mcp/agent-server.ts
│   dws_browse_fetch  │
│   dws_browse_screen.│
│   dws_browse_snap.  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ src/utils/browser.ts │  Thin Playwright wrapper
└──────────┬──────────┘
           │
           ▼
     Playwright (Chromium, headless)
```

Any agent (regulatory-radar, competitor-surveillance, seo-audit) can either call `browseFetch` / `browseScreenshot` / `browseSnapshot` directly from TypeScript, or invoke `dws_browse_*` via MCP if it lives outside the backend process.

## 3. CLI

```bash
# Fetch rendered HTML
dws browse fetch https://eur-lex.europa.eu/eli/reg/2023/956 --json

# Screenshot, save PNG to disk
dws browse screenshot https://dws10.com --out homepage.png

# Accessibility tree (cheap structural read)
dws browse snapshot https://dws10.com/buy --json
```

All three return JSON — see "Build for Agents" rule in `CLAUDE.md`. Output shape lives in `src/utils/browser.ts` (`BrowseFetchResult`, `BrowseScreenshotResult`, `BrowseSnapshotResult`).

## 4. MCP tools

Discoverable via `dws mcp tools`:

| Tool                    | Required args | Returns                                                 |
| ----------------------- | ------------- | ------------------------------------------------------- |
| `dws_browse_fetch`      | `url`         | `{url, finalUrl, status, title, html, durationMs}`      |
| `dws_browse_screenshot` | `url`         | `{url, finalUrl, pngBase64, width, height, durationMs}` |
| `dws_browse_snapshot`   | `url`         | `{url, finalUrl, title, nodes[], durationMs}`           |

`screenshot` accepts optional `width` and `height` (default 1280×800).

## 5. One-time setup

The Playwright npm package is a dev dependency (`package.json`). The Chromium binary is downloaded separately:

```bash
npx playwright install chromium
```

Run this once on a fresh checkout, on DGX Spark, and in any CI runner that uses the `/browse` skill or runs E2E tests. The browser binary is **not** committed.

## 6. Security

`browser.ts` enforces:

- `http://` and `https://` only — `file://`, `javascript:`, `ftp://`, `data:` etc. are rejected at the boundary.
- Hard 30 s navigation timeout.
- Fresh `BrowserContext` per call (no cookie carry-over between requests).
- `Browser` and `Context` are always closed in `finally`, even on error.
- Identifying user agent: `DWS-IQ-Agent/1.0` (so target sites can rate-limit / contact us).

The returned HTML is treated as **untrusted input** by callers — never `eval`'d, never inserted into the DOM verbatim.

## 7. Testing

Unit test: `src/__tests__/browser.test.ts` mocks `playwright` via `vi.mock` so CI does not need a Chromium binary. Run:

```bash
npm run test -- browser
```

For end-to-end verification against a real browser, run locally after `npx playwright install chromium`:

```bash
DWS_API_URL=http://localhost:8080 dws browse fetch https://example.com
```

## 8. Build for Agents checklist (per CLAUDE.md §Build for Agents)

| #   | Requirement              | Status                                                                |
| --- | ------------------------ | --------------------------------------------------------------------- |
| 1   | CLI exists               | ✅ `dws browse <action> <url>`                                        |
| 2   | Output is JSON           | ✅ All three actions return structured JSON                           |
| 3   | MCP tools exposed        | ✅ `dws_browse_fetch`, `dws_browse_screenshot`, `dws_browse_snapshot` |
| 4   | Claude Code skill exists | ✅ `.claude/commands/browse.md`                                       |
| 5   | Docs are markdown        | ✅ This file                                                          |
