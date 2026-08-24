#!/usr/bin/env python3
"""
Construction Lead Scraper — TED (Tenders Electronic Daily) + EU Sources

Fetches construction tenders from the EU TED portal, generates a leads CSV,
and sends a daily email digest via Resend.

Usage:
    python scripts/fetch_tenders.py [--dry-run] [--no-email] [--country FI,SE,NO,DK,DE]

Requirements:
    pip install -r scripts/requirements-tenders.txt

Environment Variables:
    RESEND_API_KEY    - Resend API key (for email sending)
    EMAIL_FROM        - Sender email (default: risto@onelifetime.world)
    EMAIL_TO          - Recipient email (default: risto@lifetime.fi)
    TED_API_KEY       - TED API key (optional, increases rate limits)

Sources:
    - TED (Tenders Electronic Daily): https://ted.europa.eu
    - CPV codes 45xxxxxx (Construction work)
"""

import argparse
import csv
import logging
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
LEADS_CSV = DATA_DIR / "leads.csv"
LOG_DIR = PROJECT_ROOT / "logs"

# TED API
TED_SEARCH_URL = "https://api.ted.europa.eu/v3/notices/search"
TED_NOTICE_URL = "https://ted.europa.eu/en/notice/-/detail/{}"

# Construction CPV codes (top-level)
CONSTRUCTION_CPV_CODES = [
    "45000000",  # Construction work
    "45100000",  # Site preparation work
    "45200000",  # Complete/part construction and civil engineering
    "45210000",  # Building construction work
    "45220000",  # Engineering works and construction works
    "45230000",  # Pipeline, communication and power line construction
    "45240000",  # Water works construction
    "45250000",  # Plant construction (non-mining)
    "45260000",  # Roof works and other special trade construction
    "45300000",  # Building installation work
    "45400000",  # Building completion work
    "71000000",  # Architectural, construction, engineering, inspection
    "71300000",  # Engineering services
    "71500000",  # Construction-related services
]

# Target countries (ISO 3166-1 alpha-2 → TED country codes)
DEFAULT_COUNTRIES = ["FIN", "SWE", "NOR", "DNK", "DEU", "AUT", "FRA", "NLD", "BEL", "EST"]

# Map ISO 2-letter to TED 3-letter
COUNTRY_MAP = {
    "FI": "FIN", "SE": "SWE", "NO": "NOR", "DK": "DNK", "DE": "DEU",
    "AT": "AUT", "FR": "FRA", "NL": "NLD", "BE": "BEL", "EE": "EST",
    "LT": "LTU", "LV": "LVA", "PL": "POL", "CZ": "CZE", "IT": "ITA",
    "ES": "ESP", "PT": "PRT", "IE": "IRL", "UK": "GBR", "CH": "CHE",
}

# Email config
EMAIL_FROM = os.getenv("EMAIL_FROM", "risto@onelifetime.world")
EMAIL_TO = os.getenv("EMAIL_TO") or os.getenv("OUTREACH_DIGEST_EMAIL", "risto@lifetime.fi")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# Scraping config
REQUEST_TIMEOUT = 30
MAX_RESULTS = 100
LOOKBACK_DAYS = 1  # Fetch tenders published in last N days

# ============================================================================
# LOGGING
# ============================================================================

LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(
            LOG_DIR / f"tenders_{datetime.now().strftime('%Y%m%d')}.log"
        ),
    ],
)
logger = logging.getLogger(__name__)

# ============================================================================
# TED API CLIENT
# ============================================================================


class TEDClient:
    """Client for TED (Tenders Electronic Daily) search API."""

    def __init__(self, api_key: str | None = None):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "User-Agent": "DWS6-ConstructionLeadScraper/1.0",
        })
        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=15))
    def search_tenders(
        self,
        cpv_codes: list[str],
        countries: list[str],
        published_after: str,
        page: int = 1,
        page_size: int = 50,
    ) -> dict:
        """
        Search TED for construction tenders.

        Args:
            cpv_codes: List of CPV codes to filter by
            countries: List of 3-letter country codes
            published_after: Date string YYYYMMDD
            page: Page number
            page_size: Results per page

        Returns:
            API response dict with notices
        """
        # Build TED expert search query
        cpv_query = " OR ".join(f'cpv="{code}"' for code in cpv_codes[:5])
        country_query = " OR ".join(f'country="{c}"' for c in countries)
        date_query = f'publication-date>={published_after}'

        query = f"({cpv_query}) AND ({country_query}) AND {date_query}"

        params = {
            "q": query,
            "page": page,
            "limit": page_size,
            "scope": "ALL",
        }

        logger.info(f"TED search: countries={countries}, cpv_codes={len(cpv_codes)}, after={published_after}")
        logger.debug(f"Query: {query}")

        try:
            response = self.session.get(
                TED_SEARCH_URL,
                params=params,
                timeout=REQUEST_TIMEOUT,
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            logger.warning(f"TED API HTTP error: {e}")
            # Fallback to RSS-based search
            return self._fallback_search(cpv_codes, countries, published_after)

        except requests.exceptions.RequestException as e:
            logger.error(f"TED API request failed: {e}")
            return self._fallback_search(cpv_codes, countries, published_after)

    def _fallback_search(
        self,
        cpv_codes: list[str],
        countries: list[str],
        published_after: str,  # noqa: ARG002
    ) -> dict:
        """
        Fallback: use TED search export endpoint when v3 API is unavailable.
        Returns data in the same structure as the main search.
        """
        logger.info("Using TED fallback search (RSS/export)...")

        # TED legacy search URL
        base_url = "https://ted.europa.eu/api/v2.0/notices/search"

        cpv_short = cpv_codes[0][:2]  # Use top-level "45" prefix
        country_list = ",".join(countries)

        params = {
            "q": f"cpv:{cpv_short}* AND country:{country_list}",
            "reverseOrder": "true",
            "sortField": "PUBLICATION_DATE",
            "scope": 3,
            "pageNum": 1,
            "pageSize": MAX_RESULTS,
        }

        try:
            response = self.session.get(base_url, params=params, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.warning(f"Fallback search also failed: {e}")
            return {"notices": [], "total": 0}

    def parse_notices(self, raw_data: dict) -> list[dict]:
        """
        Parse TED API response into standardized lead records.

        Handles both v3 and v2 response formats.
        """
        leads = []

        # Try v3 format
        notices = raw_data.get("notices") or raw_data.get("results") or []

        if not notices and "links" in raw_data:
            # v2 format wraps differently
            notices = raw_data.get("results", [])

        for notice in notices:
            try:
                lead = self._parse_notice(notice)
                if lead:
                    leads.append(lead)
            except Exception as e:
                logger.debug(f"Failed to parse notice: {e}")
                continue

        logger.info(f"Parsed {len(leads)} leads from {len(notices)} notices")
        return leads

    def _parse_notice(self, notice: dict) -> dict | None:
        """Parse a single TED notice into a lead record."""
        # Handle various field name formats across TED API versions
        notice_id = (
            notice.get("id")
            or notice.get("noticeId")
            or notice.get("tedNoticeId", "")
        )
        title = (
            notice.get("title")
            or notice.get("titleText")
            or notice.get("TI", {}).get("text", "")
            or "N/A"
        )
        # Get first available title if it's a dict/list
        if isinstance(title, dict):
            title = next(iter(title.values()), "N/A")
        if isinstance(title, list):
            title = title[0] if title else "N/A"

        buyer = (
            notice.get("buyerName")
            or notice.get("organisationName")
            or notice.get("CA", {}).get("officialName", "")
            or notice.get("buyer", {}).get("name", "")
            or "N/A"
        )
        if isinstance(buyer, dict):
            buyer = next(iter(buyer.values()), "N/A")

        country = (
            notice.get("country")
            or notice.get("ISO_COUNTRY", {}).get("VALUE", "")
            or notice.get("buyerCountry", "")
            or ""
        )

        deadline = (
            notice.get("deadline")
            or notice.get("DT_DATE_FOR_SUBMISSION", "")
            or notice.get("submissionDeadline", "")
            or ""
        )

        pub_date = (
            notice.get("publicationDate")
            or notice.get("DS_DATE_DISPATCH", "")
            or notice.get("datePublished", "")
            or ""
        )

        estimated_value = (
            notice.get("estimatedValue")
            or notice.get("VALUE", {}).get("text", "")
            or notice.get("totalValue", "")
            or ""
        )

        cpv_code = (
            notice.get("cpvCode")
            or notice.get("CPV_MAIN", {}).get("cpvCode", "")
            or notice.get("mainCpv", "")
            or ""
        )

        notice_type = (
            notice.get("type")
            or notice.get("TD", {}).get("text", "")
            or notice.get("noticeType", "")
            or ""
        )

        contact_email = (
            notice.get("contactEmail")
            or notice.get("IA_URL_ETENDERING", "")
            or notice.get("buyer", {}).get("email", "")
            or ""
        )

        contact_url = (
            notice.get("contactUrl")
            or notice.get("IA_URL_GENERAL", "")
            or notice.get("buyer", {}).get("url", "")
            or ""
        )

        ted_url = TED_NOTICE_URL.format(notice_id) if notice_id else ""

        return {
            "notice_id": str(notice_id),
            "title": str(title)[:500],
            "buyer": str(buyer)[:300],
            "country": str(country),
            "publication_date": str(pub_date),
            "deadline": str(deadline),
            "estimated_value": str(estimated_value),
            "cpv_code": str(cpv_code),
            "notice_type": str(notice_type),
            "contact_email": str(contact_email),
            "contact_url": str(contact_url),
            "ted_url": ted_url,
            "source": "TED",
            "scraped_at": datetime.now().isoformat(),
        }


# ============================================================================
# CSV WRITER
# ============================================================================

CSV_FIELDS = [
    "notice_id",
    "title",
    "buyer",
    "country",
    "publication_date",
    "deadline",
    "estimated_value",
    "cpv_code",
    "notice_type",
    "contact_email",
    "contact_url",
    "ted_url",
    "source",
    "scraped_at",
]


def save_leads_csv(leads: list[dict], output_path: Path) -> int:
    """
    Save leads to CSV file. Appends new leads, deduplicates by notice_id.

    Returns number of new leads added.
    """
    existing_ids: set[str] = set()

    # Read existing leads
    if output_path.exists():
        with open(output_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_ids.add(row.get("notice_id", ""))

    new_leads = [lead for lead in leads if lead["notice_id"] not in existing_ids]

    if not new_leads:
        logger.info("No new leads to add (all duplicates).")
        return 0

    # Write all leads (existing + new)
    write_header = not output_path.exists() or output_path.stat().st_size == 0

    with open(output_path, "a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS, extrasaction="ignore")
        if write_header:
            writer.writeheader()
        writer.writerows(new_leads)

    logger.info(f"Added {len(new_leads)} new leads to {output_path}")
    return len(new_leads)


# ============================================================================
# EMAIL SENDER
# ============================================================================


def build_email_html(leads: list[dict], date_str: str) -> str:
    """Build HTML email with construction lead summary."""
    if not leads:
        summary_rows = "<tr><td colspan='5' style='padding:12px;text-align:center;color:#666;'>No new construction tenders found today.</td></tr>"
    else:
        summary_rows = ""
        for lead in leads[:30]:  # Limit to 30 in email
            deadline = lead.get("deadline", "N/A") or "N/A"
            value = lead.get("estimated_value", "") or "—"
            country = lead.get("country", "")
            title = lead.get("title", "")[:80]
            buyer = lead.get("buyer", "")[:60]
            ted_url = lead.get("ted_url", "#")

            summary_rows += f"""
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:8px 12px;font-size:13px;">
                    <a href="{ted_url}" style="color:#2563eb;text-decoration:none;">{title}</a>
                </td>
                <td style="padding:8px 12px;font-size:13px;">{buyer}</td>
                <td style="padding:8px 12px;font-size:13px;text-align:center;">{country}</td>
                <td style="padding:8px 12px;font-size:13px;text-align:center;">{deadline}</td>
                <td style="padding:8px 12px;font-size:13px;text-align:right;">{value}</td>
            </tr>"""

    # Country breakdown
    country_counts: dict[str, int] = {}
    for lead in leads:
        c = lead.get("country", "Unknown")
        country_counts[c] = country_counts.get(c, 0) + 1
    country_summary = " | ".join(f"{c}: {n}" for c, n in sorted(country_counts.items(), key=lambda x: -x[1]))

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f8fafc;">
        <div style="max-width:800px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);color:white;padding:24px 32px;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;font-size:22px;">Construction Leads Daily Digest</h1>
                <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">{date_str} | {len(leads)} new tenders found</p>
            </div>

            <div style="background:white;padding:24px 32px;border:1px solid #e2e8f0;">
                <h2 style="font-size:16px;color:#334155;margin:0 0 8px;">Summary</h2>
                <p style="font-size:14px;color:#64748b;margin:0 0 4px;">Total new leads: <strong>{len(leads)}</strong></p>
                <p style="font-size:14px;color:#64748b;margin:0 0 16px;">Countries: {country_summary or 'N/A'}</p>

                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <thead>
                        <tr style="background:#f1f5f9;border-bottom:2px solid #cbd5e1;">
                            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#475569;">Title</th>
                            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#475569;">Buyer</th>
                            <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;color:#475569;">Country</th>
                            <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;color:#475569;">Deadline</th>
                            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#475569;">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary_rows}
                    </tbody>
                </table>
            </div>

            <div style="background:#f1f5f9;padding:16px 32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:0;">
                <p style="font-size:12px;color:#64748b;margin:0;">
                    Source: <a href="https://ted.europa.eu" style="color:#2563eb;">TED — Tenders Electronic Daily</a> |
                    Full CSV: data/leads.csv |
                    DWS IQ 6 Firehorse Automation
                </p>
            </div>
        </div>
    </body>
    </html>
    """


def build_email_text(leads: list[dict], date_str: str) -> str:
    """Build plain text email."""
    lines = [
        f"Construction Leads Daily Digest — {date_str}",
        f"Total new leads: {len(leads)}",
        "=" * 60,
        "",
    ]

    for i, lead in enumerate(leads[:30], 1):
        lines.append(f"{i}. {lead.get('title', 'N/A')[:80]}")
        lines.append(f"   Buyer: {lead.get('buyer', 'N/A')}")
        lines.append(f"   Country: {lead.get('country', '')} | Deadline: {lead.get('deadline', 'N/A')}")
        lines.append(f"   Value: {lead.get('estimated_value', 'N/A')}")
        lines.append(f"   URL: {lead.get('ted_url', '')}")
        lines.append("")

    lines.append("=" * 60)
    lines.append("Source: TED — Tenders Electronic Daily (https://ted.europa.eu)")
    lines.append("DWS IQ 6 Firehorse Automation")

    return "\n".join(lines)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=10))
def send_email(subject: str, html: str, text: str) -> bool:
    """Send email via Resend API."""
    if not RESEND_API_KEY:
        logger.error("RESEND_API_KEY not set. Cannot send email.")
        return False

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {RESEND_API_KEY}",
        },
        json={
            "from": EMAIL_FROM,
            "to": [EMAIL_TO],
            "subject": subject,
            "html": html,
            "text": text,
        },
        timeout=15,
    )

    if response.ok:
        result = response.json()
        logger.info(f"Email sent via Resend. ID: {result.get('id', 'unknown')}")
        return True
    logger.error(f"Resend failed ({response.status_code}): {response.text}")
    return False


# ============================================================================
# MAIN
# ============================================================================


def main():
    parser = argparse.ArgumentParser(
        description="Fetch construction tenders from TED and generate leads CSV"
    )
    parser.add_argument("--dry-run", action="store_true", help="Print results without saving")
    parser.add_argument("--no-email", action="store_true", help="Skip sending email digest")
    parser.add_argument(
        "--country",
        type=str,
        default=None,
        help="Comma-separated 2-letter country codes (e.g., FI,SE,NO,DK,DE)",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=LOOKBACK_DAYS,
        help=f"Lookback period in days (default: {LOOKBACK_DAYS})",
    )
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")
    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    # Determine target countries
    if args.country:
        country_codes_2 = [c.strip().upper() for c in args.country.split(",")]
        countries = [COUNTRY_MAP.get(c, c) for c in country_codes_2]
    else:
        countries = DEFAULT_COUNTRIES

    # Calculate date range
    since_date = (datetime.now() - timedelta(days=args.days)).strftime("%Y%m%d")

    logger.info("=" * 60)
    logger.info("Construction Lead Scraper — TED EU Tenders")
    logger.info(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    logger.info(f"Countries: {', '.join(countries)}")
    logger.info(f"Lookback: {args.days} day(s) (since {since_date})")
    logger.info(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    logger.info("=" * 60)

    # Initialize TED client
    ted_api_key = os.getenv("TED_API_KEY")
    client = TEDClient(api_key=ted_api_key)

    # Fetch tenders
    all_leads: list[dict] = []

    # Search with top-level construction CPV codes
    raw_data = client.search_tenders(
        cpv_codes=CONSTRUCTION_CPV_CODES[:5],  # Use top 5 CPV codes
        countries=countries,
        published_after=since_date,
        page_size=MAX_RESULTS,
    )

    leads = client.parse_notices(raw_data)
    all_leads.extend(leads)

    logger.info(f"Total leads fetched: {len(all_leads)}")

    if args.dry_run:
        logger.info("[DRY RUN] Would save the following leads:")
        for lead in all_leads[:10]:
            logger.info(f"  - {lead['title'][:60]} | {lead['buyer'][:40]} | {lead['country']}")
        if len(all_leads) > 10:
            logger.info(f"  ... and {len(all_leads) - 10} more")
    else:
        # Ensure data directory exists
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        # Save to CSV
        new_count = save_leads_csv(all_leads, LEADS_CSV)
        logger.info(f"New leads added to CSV: {new_count}")

        # Send email
        if not args.no_email and new_count > 0:
            date_str = datetime.now().strftime("%A %d %B %Y")
            subject = f"Construction Leads: {new_count} new tenders ({datetime.now().strftime('%d.%m.%Y')})"
            html = build_email_html(all_leads, date_str)
            text = build_email_text(all_leads, date_str)

            if send_email(subject, html, text):
                logger.info(f"Daily digest sent to {EMAIL_TO}")
            else:
                logger.warning("Failed to send email digest")
        elif args.no_email:
            logger.info("Email sending skipped (--no-email flag)")
        elif new_count == 0:
            logger.info("No new leads — email not sent")

    # Summary
    logger.info("=" * 60)
    logger.info("SUMMARY")
    logger.info(f"  Leads fetched:  {len(all_leads)}")
    logger.info(f"  Countries:      {', '.join(countries)}")
    logger.info(f"  CSV output:     {LEADS_CSV}")
    logger.info("=" * 60)

    return 0


if __name__ == "__main__":
    sys.exit(main())
