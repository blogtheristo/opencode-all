---
Document: Mission Control — Grok → OpenCode Soft Failover (Option A)
Type: Branch / overflow baton
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
schema: DWS_DOCUMENT_STANDARD
---

# Grok overflow → OpenCode (EU / PII soft failover)

**Canonical path:** `.claude/handoffs/claude/mission-control-grok-overflow.md`  
**Parent plan:** `.claude/handoffs/claude/mission-control-ops.md`  
**PR:** https://github.com/blogtheristo/dws6/pull/2002

---

VERSION AND AGENT HISTORY

| Version      | Date       | Changes                                                               | Agent  |
| ------------ | ---------- | --------------------------------------------------------------------- | ------ |
| 1.0 [Latest] | 2026-09-13 | Option A soft failover: HIC-approved OpenCode handoff for raw threads | Cursor |

---

## Purpose

Cursor/Grok is **not** an approved EU-resident processor for raw customer/helpdesk/investor threads
(`DWS_SECURITY_STANDARD` §4.1; `AI_AGENT_GUIDELINES` §5).

When Grok refuses raw content, Mission Control prepares an **OpenCode Ready** pack.
**HIC must click** (copy / paste into OpenCode). No automatic launch (Option C forbidden).

## HIC steps (approval preserved)

1. In Mission Control, open the item → **Open in OpenCode**.
2. Copy the prepared prompt (or download the markdown).
3. Start **OpenCode on the EU/DGX local path** (not Cursor/Grok cloud).
4. Paste the prompt as the first message; read this file if present in the checkout.
5. Work raw threads **only** inside that local session; do not paste PII back into Grok.

## OpenCode session contract

- Runtime: OpenCode local / DGX EU (Claude Code standby under same residency).
- Do **not** push raw PII into git, PR comments, or public handoffs — redact before commit.
- Update this file’s **Active overflow** section with non-PII metadata only (ids, centre, status).
- When done: clear Active overflow or mark `status: closed` and bump VERSION.

## Active overflow

_HIC or Mission Control paste replaces the block below. No raw message bodies in git._

```yaml
status: idle
updated: 2026-09-13
item_id: null
centre: null
title: null
repo_path: null
reason: "awaiting HIC Open in OpenCode click"
hic_approved: false
```

## Prepared prompt template (filled by Mission Control UI)

Agents: if you refuse raw input, tell HIC to use Mission Control **Open in OpenCode**, which
builds the live prompt. Do not invent customer content here.
