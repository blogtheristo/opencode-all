# Scaleway Infrastructure Setup

**Date:** April 24, 2026  
**Owner:** Lifetime Oy  
**Status:** ✅ Active

## Account Information

| Field                 | Value                                  |
| --------------------- | -------------------------------------- |
| **Organization ID**   | `78e26603-c820-4617-b0d2-f8589eb7693b` |
| **Organization Name** | Lifetime Oy                            |
| **Console URL**       | https://console.scaleway.com           |
| **Admin Console**     | https://admin6.com                     |
| **Project Name**      | `dws-backend`                          |
| **Project ID**        | `78e26603-c820-4617-b0d2-f8589eb7693b` |

## Access & Authentication

- **Login Method:** Google OAuth (must use same Google account as admin6 Chrome profile)
- **Browser:** Chrome (admin6 profile)
- **Multi-factor:** Enabled (if applicable)
- **Access Level:** Owner / Administrator

## Scaleway CLI Version

| Property     | Value           |
| ------------ | --------------- |
| **Version**  | 2.33.0          |
| **Build**    | 2024-09-03      |
| **Go**       | 1.22.6          |
| **Platform** | Windows (amd64) |
| **Git SHA**  | e60b4150        |

## Live Deployment

| Property          | Value                                                                           |
| ----------------- | ------------------------------------------------------------------------------- |
| **Service Type**  | Serverless Functions (Containers)                                               |
| **Function Name** | `dws-iq-backend`                                                                |
| **Container ID**  | `7f17b90d-a44c-4b75-ab9e-7099c5ade031`                                          |
| **Namespace ID**  | `3639617d-3041-4051-9a28-19b4ca6a14db`                                          |
| **Region**        | `fr-par` (France - Paris)                                                       |
| **Endpoint**      | `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud` |
| **Status**        | ✅ LIVE                                                                         |
| **Deployed**      | January 28, 2026                                                                |

## Webhook Configuration

| Event Type                         | Status     | Stripe Workbench |
| ---------------------------------- | ---------- | ---------------- |
| `invoice.payment_succeeded`        | ✅ Handled | Listening        |
| `invoice.marked_uncollectible`     | ✅ Handled | Listening        |
| `invoice.payment_action_required`  | ✅ Handled | Listening        |
| `invoice.payment_attempt_required` | ✅ Handled | Listening        |
| `invoice.payment_failed`           | ✅ Handled | Listening        |
| `charge.refunded`                  | ✅ Handled | Listening        |
| `customer.deleted`                 | ✅ Handled | Listening        |

**Webhook Destination:**

- **ID:** `we_1TPfyGAK2DZTbwRFTuzNhaqT`
- **Name:** `captivating-splendor`
- **Endpoint URL:** `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/webhooks/stripe`
- **API Version:** `2026-03-25.dahlia`
- **Status:** ✅ Created

## Environment Variables to Set

```
STRIPE_SECRET_KEY=sk_live_... (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe Workbench)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Common Tasks

### Update Environment Variables

1. Go to https://console.scaleway.com
2. Select project `dws-backend`
3. Navigate to **Serverless → Functions**
4. Click `dws-iq-backend` container
5. Go to **Environment variables** tab
6. Add/update variables
7. **Redeploy** the container (new version)

### View Logs

1. Navigate to `dws-iq-backend` function
2. Click **Logs** tab
3. Filter by date/time range
4. Search for errors or specific event types

### Redeploy

1. Push new code to the branch
2. GitHub Actions triggers automatic build
3. Once build succeeds, manually trigger deployment in Scaleway console or use gcloud

## Backup & Restore

- Database backups: Supabase (automatic daily)
- Configuration backups: This field note + environment variable snapshots
- Disaster recovery: Failover to Google Cloud Run (project `dws6run6`)

## Monitoring & Alerts

- **Uptime monitoring:** Stripe webhook health checks
- **Error tracking:** Sentry integration (TBD)
- **Performance:** Scaleway Functions metrics dashboard
- **Database:** Supabase monitoring dashboard

## References

- Admin manual: `Admin/ADMIN_MANUAL.md` (Scaleway section)
- Stripe webhook docs: `src/routes/stripe-webhook.routes.ts`
- Middleware: `src/middleware/stripe-webhook.middleware.ts`

---

**Last Updated:** April 24, 2026  
**Session:** Claude Code continuation (claude-haiku-4-5)  
**Commit:** Add Scaleway infrastructure field note
