---
Document: Learn Dashboard + Google Calendar Integration Guide
Type: Operational Guidance
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
schema: DWS_DOCUMENT_STANDARD
---

# Learn Dashboard × Mission Control × Google Calendar Integration

**Effective:** 2026-09-13

## Summary

Three systems now work together to keep you on top of deadlines and daily priorities:

1. **Learn Dashboard** (`/dashboard/learn/`) — Shows today's calendar events + async queue status, auto-refreshing every 3 minutes
2. **Mission Control** (`/dashboard/mission-control/`) — Triage queue for customer/investor/partner items; links to Learn for deadline context
3. **Google Calendar** (MCP `Google_Calendar` tools) — Source of truth for all deadlines, meetings, and follow-ups; automatically synced to Learn Dashboard

---

## Architecture

### Data Flow

```
Google Calendar (risto.paarni2024@lifetime.fi)
    ↓
Learn Dashboard API (/api/v1/learn/calendar-today)
    ↓
Frontend HTML reads calendar events
    ↓
Display with PRIORITY 1 marking for deadlines/meetings
    ↓
User sees urgent items + async queue status
    ↓
Click "Go to Mission Control" to triage
```

### File Structure

```
dws6.com/dashboard/learn/
├── index.html           # Main dashboard (auto-refreshes)
├── guide.html           # HIC workflow guide
└── (no JS files — pure HTML + fetch API)

.workflows/opencode-all/
└── queue.jsonl          # Async queue state (PENDING/IN_PROGRESS/DONE/FAILED)

.claude/handoffs/opencode-batch/
└── mission-control-*.md # Agent work output

src/routes/
├── learn-calendar.routes.ts  # API: /api/v1/learn/calendar-today, /queue-status
└── opencode-queue.routes.ts  # API: /api/v1/opencode-queue/submit, /status
```

### Backend Integration

Two new API endpoints serve the Learn Dashboard:

**1. GET `/api/v1/learn/calendar-today`**

- Returns: `{ calendar, queue, timestamp }`
- `calendar`: today's events from Google Calendar (structure ready, content populated by agent)
- `queue`: PENDING/IN_PROGRESS/DONE/FAILED counts from `.workflows/opencode-all/queue.jsonl`
- `timestamp`: when this data was fetched

**2. GET `/api/v1/learn/queue-status`**

- Returns: `{ pending, in_progress, done, total }`
- Lightweight endpoint for frequent polling (every 3 minutes from dashboard)

Both endpoints are registered in `src/app.ts` at line 374:

```typescript
app.use("/api/v1/learn", learnCalendarRoutes);
```

---

## How PRIORITY 1 Works

Every calendar event with a **time** (not all-day) is marked **PRIORITY 1 — URGENT**:

- **Example P1 events:**
  - Meeting: "Investor call with SoftBank @ 08:00 UTC"
  - Deadline: "Outokumpu bid expires 23:59 UTC"
  - Gate task: "Contract review — sign-by 18:00 UTC"

- **Not P1:**
  - All-day events (no time)
  - Events without urgency marker
  - Events on future dates

**Rule:** If a task has a gate deadline, it must be in Google Calendar with a time. The Learn Dashboard will mark it PRIORITY 1.

---

## Daily Workflow (04:30–07:30 UTC Morning Window)

### 1. Open Learn Dashboard (04:30)

```
https://dws6.com/dashboard/learn/
```

**You see:**

- Today's calendar events (sorted by priority)
- PRIORITY 1 count (red card, right sidebar)
- ✓ Completed count (green card — overnight async results)
- ⏳ Queued count (orange card — items still processing)

### 2. Handle Quick P1 Items (04:30–05:10)

Respond to quick deadlines directly:

- Confirm meeting time to investor
- Sign off on approval
- Submit time-sensitive reply

Takes 3–5 items × 2–3 minutes each = ~15 minutes.

### 3. Check Async Results (05:10–05:30)

Review overnight queue output:

- **✓ Completed: 3** → OpenCode agents finished 3 items
- **⏳ Queued: 2** → Still processing

Go to `.claude/handoffs/opencode-batch/` to read agent findings.

### 4. Triage Remaining Work (05:30–06:30)

Click **"Go to Mission Control"** (Learn Dashboard sidebar button).

In Mission Control:

- Hand anonymized items to **Grok** (Cursor/Windows 11)
- Hand raw PII items to **OpenCode** (EU-resident processor)
- Queue complex work for **async processing** (overnight agents)

### 5. Final Check (06:30–07:30)

Any new PRIORITY 1 arrived during morning? Learn Dashboard auto-refreshes — check for red badges.

---

## Using Learn Dashboard

### Buttons & Navigation

| Button                    | Action                                              |
| ------------------------- | --------------------------------------------------- |
| **Go to Mission Control** | Switch to triage queue (sidebar)                    |
| **Refresh Now**           | Force immediate refresh (normally auto every 3 min) |
| **← Back to Dashboard**   | Return from Guide page                              |

### Stats Sidebar

- **Priority 1** (red) — Count of urgent items. **Act on these.**
- **✓ Completed** (green) — Overnight async finished. Review results.
- **⏳ Queued** (orange) — Items waiting. Check later.

### Color Scheme

- **Red border (P1)** — Urgent deadline or meeting TODAY
- **Orange border (P2)** — Important but not blocking
- **No border** — Informational

---

## Using Mission Control with Learn

### Workflow

1. **Learn Dashboard shows 2 PRIORITY 1 items:**
   - Item A: "Bid response needed by 18:00"
   - Item B: "Investor contract review"

2. **Go to Mission Control** (click button)

3. **Triage each item:**
   - Item A: Anonymized bid context → **Hand to Grok**
   - Item B: Raw contract with customer data → **Open in OpenCode**

4. **See queue status update:**
   - Back to Learn Dashboard
   - ⏳ Queued count increases (items now in process)

5. **Next morning:**
   - ✓ Completed shows results
   - Read handoff files for agent output

---

## Google Calendar Integration

### Setup (Already Done)

Your Google Calendar on `risto.paarni2024@lifetime.fi` is live.

- The calendar is **shared with Boardy** (board-level access)
- Learn Dashboard reads it automatically
- No setup needed

### Adding Deadlines

**Manual:**

1. Open Google Calendar
2. Create event → set date/time
3. Save
4. Appears in Learn Dashboard at next refresh (3-min intervals)

**Automatic (by agents):**

When an agent finds a deadline, it calls:

```
Google_Calendar.create_event({
  title: "Outokumpu pilot offer expires",
  start: "2026-07-27T23:59:00Z",
  description: "Originally 30 days from 2026-06-27"
})
```

Result: Event shows in Learn Dashboard next morning.

### Calendar Sync

- **Read frequency:** Every 3 minutes (Learn Dashboard polling)
- **Write source:** `Google_Calendar.create_event` MCP tool (agents)
- **Canonical time zone:** UTC (all Learn timestamps in UTC)

---

## Async Queue Mechanics

### Queue Lifecycle

```
PENDING
  ↓
IN_PROGRESS (agent picks it up)
  ↓
DONE (agent finishes, writes result to .claude/handoffs/opencode-batch/*.md)
  ↓
User reviews result in Mission Control
```

### Queue File

Location: `.workflows/opencode-all/queue.jsonl`

Each line is a JSON entry:

```json
{
  "id": "mission-control-1694593200000-abc12",
  "title": "Analyze investor term sheet",
  "centre": "investor",
  "itemId": "term-sheet-softbank",
  "source": "mission-control",
  "context": "SoftBank Series B proposal; needs legal review",
  "state": "PENDING",
  "createdAt": "2026-09-13T04:35:00Z",
  "handoffPath": ".claude/handoffs/opencode-batch/mission-control-term-sheet-softbank.md"
}
```

### Queue API

**GET `/api/v1/learn/queue-status`** returns:

```json
{
  "pending": 2,
  "in_progress": 1,
  "done": 3,
  "total": 6
}
```

Used by Learn Dashboard to show:

- ⏳ Queued: 3 (pending + in_progress)
- ✓ Completed: 3 (done)

---

## Troubleshooting

### "Learn Dashboard shows blank / no events"

**Cause 1:** No calendar events created for today.
**Fix:** Create an event in Google Calendar and wait for next refresh (3 min).

**Cause 2:** API backend down.
**Fix:** Check with IT. Manually verify `curl https://localhost:3001/api/v1/learn/calendar-today` works.

**Cause 3:** Browser cache.
**Fix:** Press **Ctrl+Shift+R** (hard refresh) or click "Refresh Now" button.

### "A deadline isn't showing as PRIORITY 1"

**Cause:** Event has no time (all-day event) or is tomorrow's date.
**Fix:** Edit the calendar event to set a specific time.

### "Async queue stuck at IN_PROGRESS"

**Cause:** Agent crashed or is waiting for human input.
**Fix:** Check `.claude/handoffs/opencode-batch/mission-control-*.md` for the item.
If stuck >2 hours, manually update `.workflows/opencode-all/queue.jsonl` to set `state` back to `PENDING`.

### "Mission Control doesn't show queued items"

**Cause:** Items are queued in `.workflows/opencode-all/queue.jsonl` but not yet loaded in Mission Control UI.
**Fix:** Refresh Mission Control page (F5).

---

## Technical Details

### API Response Structure

**GET `/api/v1/learn/calendar-today`**

```json
{
  "calendar": {
    "date": "2026-09-13",
    "events": [
      {
        "title": "Investor call",
        "time": "08:00",
        "deadline": true,
        "priority": 1,
        "meetingUrl": "https://meet.google.com/abc"
      },
      {
        "title": "Bid expires",
        "time": "18:00",
        "deadline": true,
        "priority": 1
      }
    ],
    "priority1Count": 2
  },
  "queue": {
    "pending": 2,
    "in_progress": 1,
    "done": 3,
    "total": 6
  },
  "timestamp": "2026-09-13T04:45:00Z",
  "note": "Calendar events populated by agent via Google_Calendar.list_events MCP tool"
}
```

### Frontend Polling

Learn Dashboard polls every 3 minutes:

```javascript
setInterval(
  async () => {
    const res = await fetch("/api/v1/learn/calendar-today");
    const data = await res.json();
    updateCalendarDisplay(data);
    updateQueueStats(data.queue);
  },
  3 * 60 * 1000,
);
```

---

## FAQ

**Q: How do I add a recurring deadline?**
A: Google Calendar supports recurring events. Create event → "Does not repeat" → change to daily/weekly/monthly. Learn Dashboard will show each occurrence.

**Q: Can I color-code events in Learn Dashboard?**
A: Not yet. The color coding comes from Google Calendar tags, which we plan to sync in v1.1.

**Q: What happens if I miss a PRIORITY 1 deadline?**
A: The Learn Dashboard will still show it (even if time has passed). Review it in Mission Control and note what happened in `.claude/handoffs/` for the learning outcome.

**Q: Can Grok see Google Calendar?**
A: No. Grok runs in Cursor (Windows) and doesn't have API access to your Google Calendar. Only OpenCode (local) and Learn Dashboard (this browser) see it.

**Q: How do I export queue results?**
A: Results are in `.claude/handoffs/opencode-batch/*.md` files. Read them directly or copy to a report.

---

## Version History

| Version      | Date       | Changes                                                              | Author      |
| ------------ | ---------- | -------------------------------------------------------------------- | ----------- |
| 1.0 [Latest] | 2026-09-13 | Initial integration: Learn Dashboard + Google Calendar + async queue | Claude Code |

---

## Related Docs

- `docs/handovers/HIC_MORNING_ROUTINE.md` — Daily 3-hour schedule (04:30–07:30 UTC)
- `docs/handovers/OPTION_A_OPERATING_GUIDE.md` — Grok soft failover pattern (HIC click → OpenCode)
- `docs/handovers/OPTION_B_ASYNC_QUEUE.md` — Async queue mechanics (queue → agent work → results)
- `dws6.com/dashboard/learn/guide.html` — HIC workflow guide (how to use this dashboard)
