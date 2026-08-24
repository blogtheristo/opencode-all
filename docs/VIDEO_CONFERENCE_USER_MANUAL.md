# VIDEO CONFERENCE USER MANUAL: Firehorse Video Meeting

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: 015pW | Date: 13.03.2026 | Changes: Initial creation — user guide for Firehorse Video Meeting (Jitsi integration)

Session Links & References:
  - Claude Code (015pW): https://claude.ai/code/session_015pWykGmQUN3nYmW3in3KSA
  - PR: https://github.com/blogtheristo/dws6/pull/new/claude/jitsi-video-integration-mZfsN

Document Status:
  - Created: 13.03.2026
  - Last Modified: 13.03.2026
  - Language: English
  - Publication Status: ACTIVE

---

**Version:** 1.0
**Purpose:** User guide for Firehorse Video Meeting — DWS IQ video conferencing
**Audience:** All users, meeting participants, team leads
**Updated:** 13.03.2026

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Creating a Meeting](#2-creating-a-meeting)
3. [Joining a Meeting](#3-joining-a-meeting)
4. [Sharing Meeting Links](#4-sharing-meeting-links)
5. [Email Invitations](#5-email-invitations)
6. [During the Meeting](#6-during-the-meeting)
7. [Leaving a Meeting](#7-leaving-a-meeting)
8. [Troubleshooting](#8-troubleshooting)
9. [Privacy & Security](#9-privacy--security)

---

## 1. Getting Started

### What is Firehorse Video Meeting?

Firehorse Video Meeting is a free, secure video conferencing tool built into DWS IQ. It uses Jitsi Meet for encrypted video/audio communication.

### Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Camera and microphone (optional — you can join audio-only)
- No account or login required

### Access

Open the meeting page at your DWS6 deployment URL, typically:

```
https://dws6.com/meet/
```

---

## 2. Creating a Meeting

### Quick Start (Random Room)

1. Open the meeting lobby page
2. Leave the "Room name" field empty
3. Click **Start Meeting**
4. A random room name (e.g., `dws6-k7x2m9ab`) is generated automatically

### Custom Room Name

1. Enter a room name in the text field (e.g., `project-review`)
2. Click **Start Meeting**
3. Special characters are automatically sanitized — only letters, numbers, hyphens, and underscores are kept

### Room Name Rules

| Input | Result |
|-------|--------|
| `my meeting` | `my-meeting` |
| `project@2026!` | `project-2026` |
| `dws6-standup` | `dws6-standup` (unchanged) |
| *(empty)* | `dws6-k7x2m9ab` (random) |

---

## 3. Joining a Meeting

### From a Shared Link

Click or paste a meeting link in your browser. Links look like:

```
https://dws6.com/meet/#room=dws6-k7x2m9ab
```

The meeting loads automatically — no lobby needed.

### From the Lobby

1. Open the meeting lobby page
2. Enter the room name you were given
3. Click **Start Meeting**

### Pre-Join Screen

Before entering the meeting, Jitsi shows a pre-join screen where you can:

- Check your camera preview
- Toggle audio/video on or off
- Enter your display name

Click **Join** when ready.

---

## 4. Sharing Meeting Links

Once in a meeting, the share bar shows two links:

| Link | Use |
|------|-----|
| **Share link** | Full meeting page URL with room hash — best for team members |
| **Direct Jitsi link** | Opens directly on meet.jit.si — works if your site is down |

### Copy to Clipboard

Click **Copy Link** or **Copy Jitsi Link**. The button text changes to "Copied!" for confirmation.

---

## 5. Email Invitations

### From the Lobby

1. Scroll down to the "Send Email Invitation" section
2. Enter the recipient's email address
3. Optionally set a room name and meeting date/time
4. Click **Send Invitation via Email**
5. Your email client opens with a pre-filled invitation

### From Inside a Meeting

Click the green **Email Invite** button in the share bar. Your email client opens with the current room's links pre-filled.

### What the Invitation Contains

- Meeting room name
- Direct Jitsi link (no account needed)
- Firehorse meeting page link
- Date/time (if provided)

---

## 6. During the Meeting

### Toolbar Controls

| Button | Function |
|--------|----------|
| Microphone | Mute/unmute audio |
| Camera | Turn video on/off |
| Desktop | Share your screen |
| Chat | Open text chat panel |
| Raise Hand | Signal you want to speak |
| Participants | View participant list |
| Tile View | Switch between speaker and grid layout |
| Background | Change or blur your background |
| Fullscreen | Enter/exit fullscreen mode |
| Record | Start recording (if available) |
| Settings | Audio/video device settings |
| Hangup | Leave the meeting |

### Tips

- Audio starts **muted** by default — click the microphone to unmute
- Video starts **on** by default
- Use **Tile View** for group meetings with many participants
- **Screen sharing** works best in Chrome

---

## 7. Leaving a Meeting

Three ways to leave:

1. Click the red **Hangup** button in the Jitsi toolbar
2. Click the **Leave** button in the share bar
3. Close the browser tab

After leaving, you return to the lobby and can start or join another meeting.

---

## 8. Troubleshooting

### Camera or Microphone Not Working

1. Check browser permissions — click the camera/lock icon in the address bar
2. Allow camera and microphone access for this site
3. Verify your device is not in use by another application
4. Try refreshing the page

### "Copied!" Button Does Not Work

On HTTP (non-HTTPS) connections, the clipboard API may be restricted. The page falls back to selecting the text in the input field — use Ctrl+C / Cmd+C to copy manually.

### Meeting Does Not Load

- Check your internet connection
- Verify the room name contains only letters, numbers, hyphens, and underscores
- Try the direct Jitsi link instead (shown below the share link)
- Disable browser extensions that may block iframes or scripts

### No Audio From Other Participants

1. Check your system volume
2. Click the Settings button in the Jitsi toolbar
3. Verify the correct audio output device is selected

### Echo or Feedback

- Use headphones to prevent microphone picking up speaker audio
- Mute when not speaking in large groups

---

## 9. Privacy & Security

### Encryption

All video/audio is encrypted in transit via Jitsi's WebRTC implementation.

### No Account Required

No login, registration, or personal data is collected. Room names are the only identifier.

### Room Privacy

- Rooms are accessible to anyone with the link
- Use unique, hard-to-guess room names for private meetings
- Room names are not stored on any DWS server — the system is stateless

### Data Residency

Phase 1 uses the public meet.jit.si infrastructure (8x8, Inc.). Phase 2 will move to self-hosted Jitsi on Hetzner Helsinki for EU data residency.

---

*Firehorse Video Meeting — Lifetime Oy — DWS IQ*
