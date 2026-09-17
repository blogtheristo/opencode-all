/**
 * Booking Health Check (Hourly)
 *
 * Auto-discovered by DGX Spark day-runner.sh (scripts/hourly/*.ts convention).
 * Detects production booking regressions and alerts immediately via:
 *   1) Email (fast path)
 *   2) HIL todo (fallback + audit trail)
 *
 * Checks:
 * - https://dws10.com/book/?service=demo is reachable
 * - Booking page no longer points to legacy dws6.com API
 * - Booking API /services endpoint returns JSON with service list
 *
 * Code-Version: 1.0
 * Date: 2026-04-29
 * Owner: Lifetime Oy
 */

import { sendEmail } from '../../src/utils/send-email.js';

const BOOKING_PAGE_URL = 'https://dws10.com/book/?service=demo';
const BOOKING_API_BASE =
  process.env.BOOKING_API_BASE ||
  'https://dws-iq-backend-1074393862472.europe-north1.run.app';
const BOOKING_SERVICES_URL = `${BOOKING_API_BASE}/api/v1/booking/services`;
const EMAIL_FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const ALERT_TO = process.env.OUTAGE_ALERT_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
const ALERT_DEDUP_KEY = `booking_outage:${new Date().toISOString().slice(0, 13)}`;
const DRY_RUN = process.argv.includes('--dry-run');

type HealthIssue = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

async function checkBookingPage(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  let response: Response;
  try {
    response = await fetch(BOOKING_PAGE_URL, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    issues.push({
      code: 'BOOKING_PAGE_UNREACHABLE',
      message: 'Booking page is unreachable',
      details: { error: error instanceof Error ? error.message : String(error) },
    });
    return issues;
  }

  if (!response.ok) {
    issues.push({
      code: 'BOOKING_PAGE_HTTP_ERROR',
      message: `Booking page returned HTTP ${response.status}`,
      details: { status: response.status },
    });
    return issues;
  }

  const html = await response.text();
  if (html.includes('https://dws6.com/api/v1/booking')) {
    issues.push({
      code: 'BOOKING_PAGE_LEGACY_API',
      message: 'Booking page still references legacy dws6.com booking API',
      details: { expectedApiBase: BOOKING_API_BASE },
    });
  }

  return issues;
}

async function checkBookingServicesApi(): Promise<HealthIssue[]> {
  const issues: HealthIssue[] = [];
  let response: Response;
  try {
    response = await fetch(BOOKING_SERVICES_URL, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    issues.push({
      code: 'BOOKING_API_UNREACHABLE',
      message: 'Booking services API endpoint is unreachable',
      details: {
        endpoint: BOOKING_SERVICES_URL,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return issues;
  }

  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();
  if (!response.ok) {
    issues.push({
      code: 'BOOKING_API_HTTP_ERROR',
      message: `Booking services endpoint returned HTTP ${response.status}`,
      details: { endpoint: BOOKING_SERVICES_URL, status: response.status },
    });
    return issues;
  }

  if (!contentType.includes('application/json')) {
    issues.push({
      code: 'BOOKING_API_NON_JSON',
      message: 'Booking services endpoint returned non-JSON content',
      details: {
        endpoint: BOOKING_SERVICES_URL,
        contentType,
        bodyPreview: bodyText.slice(0, 120).replace(/\s+/g, ' ').trim(),
      },
    });
    return issues;
  }

  try {
    const parsed = JSON.parse(bodyText) as { services?: Array<{ id: string }> };
    if (!Array.isArray(parsed.services) || parsed.services.length === 0) {
      issues.push({
        code: 'BOOKING_API_EMPTY_SERVICES',
        message: 'Booking services endpoint returned empty service list',
        details: { endpoint: BOOKING_SERVICES_URL },
      });
    }
  } catch (error) {
    issues.push({
      code: 'BOOKING_API_INVALID_JSON',
      message: 'Booking services endpoint returned invalid JSON',
      details: {
        endpoint: BOOKING_SERVICES_URL,
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }

  return issues;
}

async function upsertHilTodo(issues: HealthIssue[]): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const description = `Booking outage detected: ${issues.map((i) => i.code).join(', ')}`;
  const context = {
    bookingPageUrl: BOOKING_PAGE_URL,
    bookingServicesUrl: BOOKING_SERVICES_URL,
    issues,
    detectedAt: new Date().toISOString(),
  };

  if (DRY_RUN) {
    console.log('[booking-health] DRY-RUN: skipping HIL todo upsert');
    return;
  }

  await fetch(`${url}/rest/v1/hil_todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'resolution=ignore-duplicates',
    },
    body: JSON.stringify({
      category: 'site_outage',
      description,
      context,
      dedup_key: ALERT_DEDUP_KEY,
    }),
  });
}

async function sendAlertEmail(issues: HealthIssue[]): Promise<void> {
  const issueLines = issues.map((i) => `- ${i.code}: ${i.message}`).join('\n');
  const details = JSON.stringify(issues, null, 2);
  const subject = `[CRITICAL] Booking flow outage detected (${issues.length} issue${issues.length > 1 ? 's' : ''})`;
  const text = [
    'Booking health check failed.',
    '',
    `Page: ${BOOKING_PAGE_URL}`,
    `API: ${BOOKING_SERVICES_URL}`,
    '',
    'Issues:',
    issueLines,
    '',
    'Details:',
    details,
  ].join('\n');

  if (DRY_RUN) {
    console.log('[booking-health] DRY-RUN: skipping alert email send');
    return;
  }

  await sendEmail({
    from: EMAIL_FROM,
    to: ALERT_TO,
    subject,
    text,
    html: `<pre>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
    source: 'admin',
    templateType: 'booking_health_alert',
    metadata: { check: 'booking-health', issueCount: issues.length },
  });
}

async function main() {
  const pageIssues = await checkBookingPage();
  const apiIssues = await checkBookingServicesApi();
  const issues = [...pageIssues, ...apiIssues];

  if (issues.length === 0) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        check: 'booking-health',
        status: 'healthy',
        bookingPageUrl: BOOKING_PAGE_URL,
        bookingServicesUrl: BOOKING_SERVICES_URL,
      }),
    );
    return;
  }

  console.error('[booking-health] CRITICAL outage detected');
  for (const issue of issues) {
    console.error(`[booking-health] ${issue.code}: ${issue.message}`);
  }

  if (DRY_RUN) {
    console.log('[booking-health] DRY-RUN issues payload:');
    console.log(JSON.stringify(issues, null, 2));
  }

  await Promise.all([sendAlertEmail(issues), upsertHilTodo(issues)]);
  process.exit(1);
}

main().catch((error) => {
  console.error(`[booking-health] FATAL: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
