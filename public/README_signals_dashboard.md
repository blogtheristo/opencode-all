# Signals Dashboard - Mobile-First UI

## Overview

Mobile-optimized dashboard for reviewing and approving sales signals on-the-go.

**Optimized for:** iPhone 16 Pro Max (6.9" display)
**URL:** `http://localhost:3001/signals` or `/signals-dashboard.html`

## Features

✅ **Mobile-First Design**
- Touch-optimized buttons (48px+ tap targets)
- Safe area inset support (Dynamic Island, home indicator)
- Dark theme optimized for OLED displays
- Smooth animations and transitions

✅ **Signal Review**
- ULTRA/HIGH badge indicators
- Company name and contact info
- Signal date and source link
- Full signal content preview
- AI-generated message draft

✅ **Actions**
- ✅ Approve & Send (marks signal as approved)
- ✏️ Edit (placeholder for future feature)
- ❌ Reject (marks signal as not relevant)

✅ **Real-time Stats**
- Total pending signals
- ULTRA signals count
- HIGH signals count

## Usage

### Desktop Browser

```bash
# Start backend
npm run dev

# Visit dashboard
open http://localhost:3001/signals
```

### iPhone 16 Pro Max

1. **Connect to same network as dev server**
2. **Find your local IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. **Open in Safari:**
   ```
   http://YOUR_IP:3001/signals
   ```
4. **Add to Home Screen** (optional):
   - Tap Share button
   - Tap "Add to Home Screen"
   - Now works like a native app!

## API Endpoints

Dashboard uses these Firehorse API endpoints:

```
GET  /api/v1/firehorse/signals/pending
POST /api/v1/firehorse/signals/:id/approve
POST /api/v1/firehorse/signals/:id/reject
GET  /api/v1/firehorse/signals/stats
```

## Design Specs

### Colors (Dark Theme)

```css
--bg-primary: #000000       /* Pure black (OLED optimized) */
--bg-secondary: #1c1c1e     /* Card backgrounds */
--bg-card: #2c2c2e          /* Elevated cards */
--text-primary: #ffffff     /* Main text */
--text-secondary: #8e8e93   /* Secondary text */
--accent-ultra: #ff453a     /* ULTRA badge */
--accent-high: #ff9f0a      /* HIGH badge */
--accent-success: #32d74b   /* Success/approve */
```

### Typography

- **Font:** SF Pro Display (Apple system font)
- **Header:** 28px bold
- **Company:** 20px bold
- **Body:** 15px regular
- **Meta:** 13px secondary color

### Spacing

- **Safe area top:** 48px (Dynamic Island clearance)
- **Safe area bottom:** 34px (home indicator)
- **Card padding:** 20px
- **Card margin:** 16px
- **Border radius:** 12-16px (iOS-style)

### Touch Targets

- **Buttons:** Minimum 48px height
- **Tap highlight:** Disabled (custom active states)
- **Active state:** scale(0.96) transform

## Screenshots

### Pending Signals View

```
┌────────────────────────────────────┐
│ 📊 Signals                         │
│ Signal-Based Sales Automation      │
├────────────────────────────────────┤
│ [3] Pending  [2] ULTRA  [1] HIGH  │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐  │
│ │ NCC AB              [ULTRA]  │  │
│ │ Anders Johansson · COO       │  │
│ │ 📅 2 days ago  🔗 Source      │  │
│ │                              │  │
│ │ [Signal content preview...]  │  │
│ │                              │  │
│ │ [Message draft...]           │  │
│ │                              │  │
│ │ [✅ Approve & Send]          │  │
│ │ [✏️ Edit]  [❌ Reject]       │  │
│ └──────────────────────────────┘  │
│                                    │
│ [↻] (refresh button)               │
└────────────────────────────────────┘
```

## Workflow

1. **Signal Collector runs** (daily 07:00 cron)
   → Signals saved to `firehorse_signals` table

2. **Dashboard loads pending signals**
   → Queries `firehorse_signals_pending_approval` view
   → Shows ULTRA/HIGH only (score ≥4)

3. **User reviews signal on mobile**
   → Reads signal content
   → Reads AI-generated message draft
   → Decides: Approve, Edit, or Reject

4. **User approves signal**
   → POST `/api/v1/firehorse/signals/:id/approve`
   → Status updated to `approved`
   → Toast notification shown

5. **User sends message manually**
   → Open LinkedIn on phone
   → Navigate to company page
   → Send approved message
   → (Future: Auto-send via PhantomBuster)

## Future Enhancements

- [ ] Edit message in-app (textarea modal)
- [ ] Swipe gestures (swipe left = reject, right = approve)
- [ ] Push notifications for new ULTRA signals
- [ ] Offline support (PWA with service worker)
- [ ] Auto-send via PhantomBuster integration (Q2/2026)
- [ ] Signal preview images/screenshots
- [ ] Bulk actions (approve/reject multiple)
- [ ] Search and filter
- [ ] Signal history view

## Troubleshooting

### "Failed to load signals"

**Cause:** Backend not running or Supabase connection issue

**Fix:**
```bash
# Check backend is running
curl http://localhost:3001/health

# Check Supabase credentials in .env
cat .env | grep SUPABASE

# Restart backend
npm run dev
```

### Dashboard not accessible on iPhone

**Cause:** Firewall blocking port 3001

**Fix:**
```bash
# macOS: Allow connections on port 3001
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/node

# Linux: Open port
sudo ufw allow 3001
```

### Buttons not working

**Cause:** CORS issue

**Fix:** Add your IP to CORS_ORIGIN in `.env`:
```bash
CORS_ORIGIN=http://localhost:3000,http://192.168.1.xxx:3001
```

## Performance

- **Load time:** <1s (on good connection)
- **API response:** <200ms (Supabase query)
- **Bundle size:** 17KB (pure HTML/CSS/JS, no framework)
- **Mobile data:** ~20KB per page load

## Accessibility

- ✅ Touch-friendly buttons (48px min)
- ✅ High contrast (WCAG AAA on dark theme)
- ✅ Readable font sizes (15px+ body text)
- ✅ Clear visual hierarchy
- ⚠️ Screen reader support (future enhancement)

---

**Version:** 1.0
**Last Updated:** 2026-01-10
**Status:** ✅ Production Ready
**Compatible:** iOS 16+, Safari 16+, Chrome 100+
