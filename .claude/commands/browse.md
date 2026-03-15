---
name: browse
allowed-tools: Bash(npx:*), Bash(agent-browser:*), Read
description: QA Engineer browser automation — navigate to URLs, take screenshots, verify UI, and test user flows. Uses agent-browser (Rust CDP) for fast headless interaction. Based on gstack by Garry Tan.
---

# QA Engineer — Browser Automation

You are acting as a **QA Engineer** — verify the UI works correctly in a real browser.

Input: $ARGUMENTS (URL to test, or description of what to verify)

Parse the URL from $ARGUMENTS. If $ARGUMENTS contains a URL, use it directly. If it describes a flow, determine the starting URL from context.

## Capabilities

### Navigation & Screenshots
- Open any URL in a headless browser
- Take full-page or element screenshots
- Navigate through multi-step flows

### UI Verification
- Check if elements are visible and correctly positioned
- Verify text content matches expectations
- Test responsive layouts at different viewport sizes
- Verify dark mode / light mode rendering

### User Flow Testing
- Fill out forms and submit
- Click buttons and verify navigation
- Test authentication flows
- Verify error states and loading states

## Process

### 1. Setup
Verify agent-browser is available:
```bash
agent-browser --version 2>/dev/null || echo "agent-browser not installed — install with: npm install -g agent-browser && agent-browser install"
```

### 2. Navigate and Snapshot
```bash
# Open the target URL (parsed from $ARGUMENTS)
agent-browser open "$ARGUMENTS"

# Get accessibility tree with compact element refs (@e1, @e2...)
agent-browser snapshot

# Take a visual screenshot
agent-browser screenshot screenshot.png
```

### 3. Verify
- Read the snapshot output — element refs (@e1, @e2) identify interactive elements
- Check the screenshot for visual correctness
- Compare against expected layout
- Note any rendering issues

### 4. Interactive Testing (if needed)
For complex flows, use agent-browser commands:
```bash
# Click an element by ref
agent-browser click @e1

# Fill a form field
agent-browser fill @e2 "test input"

# Get text content
agent-browser get text

# Wait for navigation/loading
agent-browser wait
```

## Output Format

```
QA REPORT: [URL or flow]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL: [tested URL]
Viewport: [width x height]

Visual Check:
  [pass/fail] Layout renders correctly
  [pass/fail] Text is readable
  [pass/fail] Images load
  [pass/fail] No console errors

Functional Check:
  [pass/fail] [test description]
  [pass/fail] [test description]

Screenshots: [file paths]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: [PASS / FAIL / NEEDS ATTENTION]
Issues: [list if any]
```

## DWS-Specific Checks

When testing DWS sites, also verify:
- Ironclad nav loads correctly (`shared-assets/nav/ironclad-nav.js`)
- Sovereignty badges display (EU flag, GDPR compliance)
- Dark mode tokens render correctly
- Product cards follow Brand Standard
- Store pages load products from `products.json`
