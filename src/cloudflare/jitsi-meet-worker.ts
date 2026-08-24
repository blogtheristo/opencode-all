/**
 * Jitsi Meet Worker — Cloudflare Worker for DWS6 video meetings
 *
 * Serves a meeting landing page with embedded Jitsi Meet (IFrame API).
 * Uses the free meet.jit.si infrastructure (Phase 1).
 *
 * Routes:
 *   GET /                → Meeting lobby (create or join)
 *   GET /meet/:roomId    → Join a specific meeting room
 *   GET /api/room        → Create room and return JSON { room, url }
 *
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

export interface Env {
  JITSI_DOMAIN?: string;
}

const BRAND = {
  name: 'DWS IQ',
  tagline: 'Firehorse Video Meeting',
  colorPrimary: '#0ea5e9',   // --color-jitsi from brand standard
  colorBg: '#0f172a',        // dark background
  colorCard: '#1e293b',
  colorText: '#f1f5f9',
  colorMuted: '#94a3b8',
};

function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);

  let id = '';
  for (let i = 0; i < randomBytes.length; i++) {
    const index = randomBytes[i] % chars.length;
    id += chars[index];
  }

  return `dws6-${id}`;
}

function meetingPageHtml(roomName: string, jitsiDomain: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.tagline} — ${roomName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${BRAND.colorBg};
      color: ${BRAND.colorText};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: ${BRAND.colorCard};
      border-bottom: 1px solid #334155;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: ${BRAND.colorPrimary};
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; color: #fff;
    }
    .header h1 { font-size: 16px; font-weight: 600; }
    .room-badge {
      background: ${BRAND.colorPrimary}22;
      color: ${BRAND.colorPrimary};
      padding: 4px 10px; border-radius: 6px;
      font-size: 13px; font-family: monospace;
    }
    .meeting-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    #jitsi-container {
      flex: 1;
      min-height: 0;
    }
    #jitsi-container iframe {
      width: 100% !important;
      height: 100% !important;
      border: none;
    }
    .footer {
      padding: 8px 20px;
      text-align: center;
      font-size: 12px;
      color: ${BRAND.colorMuted};
      background: ${BRAND.colorCard};
      border-top: 1px solid #334155;
    }
    .share-bar {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 20px;
      background: #1a2332;
      border-bottom: 1px solid #334155;
      font-size: 13px;
    }
    .share-url {
      background: ${BRAND.colorBg};
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 6px 10px;
      color: ${BRAND.colorText};
      font-family: monospace;
      font-size: 13px;
      flex: 1;
      max-width: 400px;
    }
    .btn-copy {
      background: ${BRAND.colorPrimary};
      color: #fff;
      border: none; border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }
    .btn-copy:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="logo">F</div>
      <h1>${BRAND.tagline}</h1>
    </div>
    <span class="room-badge">${roomName}</span>
  </div>
  <div class="share-bar">
    <span>Share link:</span>
    <input class="share-url" id="share-url" readonly value="" />
    <button class="btn-copy" onclick="copyLink(this)">Copy</button>
  </div>
  <div class="meeting-container">
    <div id="jitsi-container"></div>
  </div>
  <div class="footer">
    Powered by Jitsi Meet &middot; ${BRAND.name} &middot; Lifetime Oy &middot; EU Data
  </div>

  <script src="https://${jitsiDomain}/external_api.js"></script>
  <script>
    document.getElementById('share-url').value = window.location.href;

    function copyLink(btn) {
      const url = document.getElementById('share-url').value;
      navigator.clipboard.writeText(url).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      }).catch(() => {
        const input = document.getElementById('share-url');
        input.select();
        document.execCommand('copy');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    }

    const api = new JitsiMeetExternalAPI('${jitsiDomain}', {
      roomName: '${roomName}',
      parentNode: document.getElementById('jitsi-container'),
      width: '100%',
      height: '100%',
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        prejoinConfig: { enabled: true },
        disableDeepLinking: true,
        defaultLanguage: 'en',
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_BACKGROUND: '${BRAND.colorBg}',
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'desktop', 'chat',
          'raisehand', 'participants-pane', 'tileview',
          'select-background', 'fullscreen', 'hangup',
          'recording', 'settings',
        ],
      },
    });

    api.addEventListener('readyToClose', () => {
      window.location.href = '/';
    });
  </script>
</body>
</html>`;
}

function lobbyPageHtml(_jitsiDomain: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND.tagline} — Lobby</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${BRAND.colorBg};
      color: ${BRAND.colorText};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: ${BRAND.colorCard};
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 90%;
      text-align: center;
    }
    .logo {
      width: 56px; height: 56px; border-radius: 14px;
      background: ${BRAND.colorPrimary};
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 24px; color: #fff;
      margin-bottom: 16px;
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: ${BRAND.colorMuted}; margin-bottom: 28px; }
    .divider { border-top: 1px solid #334155; margin: 20px 0; }
    label { display: block; text-align: left; font-size: 13px; color: ${BRAND.colorMuted}; margin-bottom: 6px; }
    input[type="text"] {
      width: 100%; padding: 10px 14px;
      background: ${BRAND.colorBg};
      border: 1px solid #334155;
      border-radius: 8px;
      color: ${BRAND.colorText};
      font-size: 15px;
      margin-bottom: 16px;
    }
    input:focus { outline: none; border-color: ${BRAND.colorPrimary}; }
    .btn {
      width: 100%; padding: 12px;
      border: none; border-radius: 8px;
      font-size: 15px; font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: ${BRAND.colorPrimary}; color: #fff; }
    .btn-outline {
      background: transparent;
      border: 1px solid #475569;
      color: ${BRAND.colorText};
    }
    .scheduled {
      background: ${BRAND.colorPrimary}11;
      border: 1px solid ${BRAND.colorPrimary}33;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 24px;
      text-align: left;
    }
    .scheduled h3 { font-size: 14px; color: ${BRAND.colorPrimary}; margin-bottom: 8px; }
    .scheduled p { font-size: 13px; color: ${BRAND.colorMuted}; line-height: 1.5; }
    .scheduled .date { color: ${BRAND.colorText}; font-weight: 600; }
    .quick-join { margin-top: 12px; }
    .quick-join a {
      display: inline-block;
      background: ${BRAND.colorPrimary};
      color: #fff;
      text-decoration: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }
    .footer { margin-top: 24px; font-size: 12px; color: ${BRAND.colorMuted}; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">F</div>
    <h1>${BRAND.tagline}</h1>
    <p class="subtitle">Secure video meetings &middot; No account needed</p>

    <div class="scheduled">
      <h3>Example Meeting</h3>
      <p><span class="date">Friday, 10:00 (local time)</span></p>
      <p>Participants: Alice &amp; Bob</p>
      <p>Room: <code>example-room-1234</code></p>
      <div class="quick-join">
        <a href="/meet/example-room-1234">Join Meeting</a>
      </div>
    </div>

    <div class="divider"></div>

    <form onsubmit="startMeeting(event)">
      <label for="room">Or create / join a room</label>
      <input type="text" id="room" placeholder="Room name (leave empty for random)" />
      <button type="submit" class="btn btn-primary">Start Meeting</button>
    </form>

    <div class="footer">
      Free &middot; No account needed &middot; Encrypted in transit<br>
      Lifetime Oy &middot; ${BRAND.name}
    </div>
  </div>

  <script>
    function sanitizeRoomName(name) {
      // Allow only [a-zA-Z0-9_-], replace others with '-'
      let sanitized = name.replace(/[^a-zA-Z0-9_-]+/g, '-');
      // Collapse multiple dashes and trim leading/trailing dashes
      sanitized = sanitized.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      return sanitized;
    }

    function generateRandomRoom() {
      return 'dws6-' + Math.random().toString(36).substring(2, 10);
    }

    function startMeeting(e) {
      e.preventDefault();
      const raw = document.getElementById('room').value.trim();
      let roomName = raw ? sanitizeRoomName(raw) : '';

      if (!roomName) {
        roomName = generateRandomRoom();
      }

      // Room name is already limited to [a-zA-Z0-9_-], no need to URL-encode
      window.location.href = '/meet/' + roomName;
    }
  </script>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const jitsiDomain = env.JITSI_DOMAIN || 'meet.jit.si';

    // GET /meet/:roomId — Join a specific meeting
    const meetMatch = url.pathname.match(/^\/meet\/([a-zA-Z0-9_-]+)$/);
    if (meetMatch) {
      const roomName = meetMatch[1];
      return new Response(meetingPageHtml(roomName, jitsiDomain), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // GET /api/room — Create a new room (returns JSON)
    if (url.pathname === '/api/room') {
      const roomId = generateRoomId();
      const meetUrl = `${url.origin}/meet/${roomId}`;
      return Response.json({ room: roomId, url: meetUrl, jitsi: `https://${jitsiDomain}/${roomId}` });
    }

    // GET / — Lobby page
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(lobbyPageHtml(jitsiDomain), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // 404 fallback
    return new Response('Not found', { status: 404 });
  },
};
