# Playwright — Browser Capability for DWS Agents

# VERSION AND AGENT HISTORY

---

| Version | Date       | Agent       | Change                                           |
| ------- | ---------- | ----------- | ------------------------------------------------ |
| 1.0.0   | 2026-04-25 | Claude Code | Initial Playwright wiring (utility + MCP + CLI). |

***

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

The Playwright npm package is a **runtime** dependency (`dependencies` in `package.json`) because the backend invokes it from `src/utils/browser.ts` whenever an MCP `dws_browse_*` tool is called. Production deploys that run `npm ci --omit=dev` (e.g., the DGX Spark workflow) therefore still install it. The Chromium binary itself is downloaded separately and is **not** committed:

```bash
npx playwright install chromium
```

Run this once on a fresh checkout, on DGX Spark, and in any CI runner that uses the `/browse` skill or runs E2E tests.

## 6. Security

`browser.ts` enforces:

- `http://` and `https://` only — `file://`, `javascript:`, `ftp://`, `data:` etc. are rejected at the boundary.
- **SSRF guard (`src/utils/url-guard.ts`):** every URL — both the user-supplied one and every redirect / sub-resource Chromium tries to fetch — is checked against a default-deny list of private ranges:
  - IPv4: loopback `127/8`, RFC1918 (`10/8`, `172.16/12`, `192.168/16`), link-local `169.254/16` (incl. cloud-metadata `169.254.169.254`), CGNAT `100.64/10`, unspecified `0/8`, multicast `224/4`, reserved `240/4`.
  - IPv6: loopback `::1`, unspecified `::`, link-local `fe80::/10`, unique-local `fc00::/7`, multicast `ff00::/8`, IPv4-mapped equivalents.
  - Hostnames: `localhost`, `*.local`, `*.internal`, `*.intranet`, `*.localhost` are blocked without a DNS lookup. All other hostnames are resolved and rejected if **any** answer is private.
  - Two-layer enforcement: pre-`goto` `assertPublicUrl()` + `page.route('**/*')` so a public URL that 302-redirects to `http://10.0.0.5/` still gets aborted.
  - Override (dev only): `BROWSE_ALLOW_PRIVATE=1` disables the IP check (scheme check still runs). Do **not** set this in production.
  - Residual risk: DNS rebinding (TTL=0 attacker flips a hostname public→private between Node's lookup and Chromium's). Pre-resolve + route-intercept narrow the window; full mitigation needs per-request IP pinning and is out of scope for v1.
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
