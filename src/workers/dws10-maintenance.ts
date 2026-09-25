// Evidence: Tool=ClaudeCode Model=anthropic/claude-opus-4-6 Agent=claude Date=2026-09-08
// Audit trail: git log -- src/workers/dws10-maintenance.ts

interface Env {
  MAINTENANCE_MODE?: string;
  MAINTENANCE_MESSAGE?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const enabled = env.MAINTENANCE_MODE === '1' || env.MAINTENANCE_MODE === 'true';

    if (!enabled) {
      return fetch(request);
    }

    const message =
      env.MAINTENANCE_MESSAGE ||
      "We're currently updating dws10.com to serve you better. This should take approximately 1 hour.";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DWS IQ — Scheduled Maintenance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 60px 40px;
      max-width: 520px;
    }
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #c8a84e;
      margin-bottom: 32px;
      letter-spacing: 2px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #fff;
      font-weight: 500;
    }
    p {
      font-size: 16px;
      color: #999;
      line-height: 1.7;
      margin-bottom: 16px;
    }
    .bar {
      width: 60px;
      height: 3px;
      background: #c8a84e;
      margin: 32px auto;
      border-radius: 2px;
    }
    .footer {
      font-size: 13px;
      color: #555;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">DWS IQ</div>
    <h1>Scheduled Maintenance</h1>
    <div class="bar"></div>
    <p>${message}</p>
    <p>Thank you for your patience.</p>
    <div class="footer">Lifetime Oy &middot; dws10.com</div>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Retry-After': '3600',
      },
    });
  },
};
