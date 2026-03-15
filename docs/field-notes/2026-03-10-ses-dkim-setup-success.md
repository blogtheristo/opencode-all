# Amazon SES DKIM Setup — onelifetime.world (Europe Stockholm)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/amazon-ses-google-drive | Date: 10.03.2026 | Changes: Initial field note — DKIM setup success for onelifetime.world in eu-north-1

Session Links & References:
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-03-10-ses-dkim-setup-success.md

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note — Infrastructure / Email

Related Documents:
  - CLAUDE.md (Email rules, risto@onelifetime.world)
  - docs/Google/Google-Services.md (Morning Briefing email)
  - src/utils/send-email.ts (SMTP/SES primary)

***

## Summary

**DKIM setup completed successfully** for the domain `onelifetime.world` in Amazon SES, Europe (Stockholm) region (`eu-north-1`). Emails from any address within this domain can now be DKIM-signed when sent through Amazon SES or Amazon Pinpoint.

## Event Details

| Property | Value |
|----------|-------|
| **Event** | AWS_SES_DKIM_PENDING_TO_VERIFIED |
| **Region** | Europe (Stockholm) — `eu-north-1` |
| **Domain** | onelifetime.world |
| **Account** | 406223549445 |
| **Start time** | Tue, 10 Mar 2026 20:18:08 GMT |
| **Service** | Amazon SES |
| **Category** | Security / Account Notification |

## What This Enables

- **DKIM-signed emails** from any address @onelifetime.world via Amazon SES and Amazon Pinpoint
- **Improved deliverability** — receiving servers can verify message authenticity
- **Reduced spam risk** — DKIM helps legitimate mail pass filters

## Important Notes

1. **Individually verified addresses override domain settings** — If DKIM is disabled for a specific verified email address, emails from that address will not be DKIM-signed even if the domain has DKIM enabled.

2. **Region-specific** — This notification applies only to the Europe (Stockholm) region. Other regions (e.g. us-east-1) require separate DKIM configuration if used.

3. **Cloudflare DNS** — Domain onelifetime.world is managed in Cloudflare. DKIM CNAME records were added to Cloudflare DNS for SES verification.

## DKIM Reference

- [Amazon SES Developer Guide — DKIM](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/dkim.html)

## Ontology Tags

- **Geography:** Europe > Sweden > Stockholm (eu-north-1)
- **Sector:** Infrastructure > Email > Transactional
- **Entities:** Amazon SES, onelifetime.world, risto@onelifetime.world, Cloudflare
- **Temporal Context:** 2026-Q1
- **Confidence:** High (AWS notification)

## Next Steps

- [ ] Verify email delivery from risto@onelifetime.world via SES SMTP in GitHub Actions workflows
- [ ] Monitor bounce/complaint rates in SES console
- [ ] Consider SPF/DMARC alignment if not already configured

---

**Document Owner:** Platform Operations  
**Classification:** INTERNAL

---

(c) 2026 Lifetime Oy — Field Note
