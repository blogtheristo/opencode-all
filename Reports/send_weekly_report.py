#!/usr/bin/env python3
"""
Weekly Report Email Automation
Sends bilingual reports via Resend API to risto.paarni2024@lifetime.fi
"""

import base64
import glob
import json
import os
import urllib.error
import urllib.request
from datetime import datetime


def send_weekly_report():
    """Send weekly reports in English and Finnish via Resend"""

    # Email configuration
    resend_api_key = os.getenv("RESEND_API_KEY")
    sender_email = os.getenv("EMAIL_FROM", "risto@onelifetime.world")
    recipient_email = "risto.paarni2024@lifetime.fi"

    # Get latest reports (support both from repo root and Reports/ directory)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    en_pattern = os.path.join(script_dir, "en/WEEKLY_REPORT*.pdf")
    fi_pattern = os.path.join(script_dir, "fi/WEEKLY_REPORT*.pdf")

    en_reports = sorted(glob.glob(en_pattern), reverse=True)
    fi_reports = sorted(glob.glob(fi_pattern), reverse=True)

    if not en_reports or not fi_reports:
        print("No PDF reports found")
        print("Run 'python generate_pdf.py' first to create PDFs")
        return False

    en_report = en_reports[0]
    fi_report = fi_reports[0]

    # Email body
    body = f"""Hi Risto,

Your weekly DWS6 progress report is attached in both English and Finnish (PDF format).

This Week's Highlights:
- Production-ready AI agent system complete (25 files, 2,087 lines)
- 2 AI agents operational (Customer Satisfaction + Viability)
- 5 Nordic companies profiled for sales targeting
- Ready for deployment to api.dws6.com

Attachments:
- WEEKLY_REPORT.pdf (English)
- WEEKLY_REPORT_FI.pdf (Finnish / Suomi)

These reports are formatted for presentation to:
- University partners
- Investors
- Media contacts

---
Lifetime Group - DWS IQ Platform
Team Lead: Risto Anton Paarni
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M")}"""

    # Build attachments (base64-encoded for Resend API)
    attachments = []
    for pdf_path, filename in [
        (en_report, "DWS6_Weekly_Report_EN.pdf"),
        (fi_report, "DWS6_Weekly_Report_FI.pdf"),
    ]:
        try:
            with open(pdf_path, "rb") as f:
                content = base64.b64encode(f.read()).decode("utf-8")
                attachments.append({"filename": filename, "content": content})
        except Exception as e:
            print(f"Failed to read {filename}: {e}")
            return False

    # Send via Resend
    if not resend_api_key:
        print("RESEND_API_KEY not set. Email not sent (dry run mode).")
        print(f"Would send to: {recipient_email}")
        print(
            f"Attachments: {os.path.basename(en_report)}, {os.path.basename(fi_report)}"
        )
        return True

    payload = json.dumps({
        "from": sender_email,
        "to": [recipient_email],
        "subject": f"DWS6 Weekly Progress Report - {datetime.now().strftime('%Y-%m-%d')}",
        "text": body,
        "attachments": attachments,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {resend_api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"Weekly report sent to {recipient_email}")
            print("Attached: DWS6_Weekly_Report_EN.pdf, DWS6_Weekly_Report_FI.pdf")
            print(f"Resend ID: {result.get('id', 'unknown')}")
            return True
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else str(e)
        print(f"Resend API error ({e.code}): {error_body}")
        return False
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


if __name__ == "__main__":
    success = send_weekly_report()
    exit(0 if success else 1)
