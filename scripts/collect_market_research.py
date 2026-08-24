#!/usr/bin/env python3
"""
Competitor Market Research Collection Script — DWS IQ 6
Follows DWS_MARKET_RESEARCH_STANDARD.md v1.0

Collects competitor pricing, features, and market signals from public sources.
Populates Supabase tables: competitors, competitor_products, market_signals.

Usage:
    python scripts/collect_market_research.py [--dry-run] [--competitor NAME]

Requirements:
    pip install -r scripts/requirements-signals.txt

Environment Variables:
    SUPABASE_URL        - Supabase project URL
    SUPABASE_KEY        - Supabase service key (with write permissions)
    SUPABASE_SERVICE_KEY - Alternative env var name for service key

Data Retention Policy:
    - Public information only (websites, press releases, review sites)
    - Never scrapes private/authenticated content
    - Respects robots.txt
    - Rate limit: max 1 request/second per domain
    - Retention: 2 years rolling (per DWS_MARKET_RESEARCH_STANDARD.md §10)
"""

import argparse
import json
import logging
import os
import re
import sys
import time
from datetime import date, datetime
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import colorlog
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

from supabase import Client, create_client

# ============================================================================
# CONFIGURATION
# ============================================================================

load_dotenv()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "logs")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")  # optional — enables Tier 3 Claude fallback

REQUEST_TIMEOUT = 10  # seconds
RATE_LIMIT_SECONDS = 1.0  # max 1 req/sec per domain (§10)
USER_AGENT = "DWSMarketResearch/1.0 (+https://dws10.com; research@lifetime.fi)"

SCRAPING_CONFIG_FILE = os.path.join(SCRIPT_DIR, "competitor_scraping_config.json")


def _load_scraping_config() -> dict:
    """Load per-site CSS selector config (Tier 2). Returns empty dict on failure."""
    try:
        with open(SCRAPING_CONFIG_FILE, encoding="utf-8") as f:
            data = json.load(f)
        return data.get("sites", {})
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# ============================================================================
# COMPETITOR REGISTRY (DWS_MARKET_RESEARCH_STANDARD.md Table 3.2)
# ============================================================================

COMPETITORS = [
    # Firehorse V3 SME / Communication
    {
        "name": "Zoom",
        "website": "https://zoom.us",
        "category": "direct",
        "dws_product_id": "firehorse-v3-sme",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://zoom.us/pricing",
        "notes": "US-based, Cloud Act exposure, dominant video conferencing",
    },
    {
        "name": "Google Meet",
        "website": "https://meet.google.com",
        "category": "direct",
        "dws_product_id": "firehorse-v3-sme",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://workspace.google.com/pricing",
        "notes": "Part of Google Workspace, US jurisdiction",
    },
    {
        "name": "Microsoft Teams",
        "website": "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",
        "category": "direct",
        "dws_product_id": "firehorse-v3-sme",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
        "notes": "US-based, Cloud Act exposure, enterprise dominant",
    },
    {
        "name": "Jitsi Meet",
        "website": "https://jitsi.org",
        "category": "indirect",
        "dws_product_id": "firehorse-v3-sme",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": False,
        "pricing_page": "https://jitsi.org",
        "notes": "Free open source, self-hostable, no EU-managed offering",
    },
    # Firehorse V3 Email
    {
        "name": "Proton Mail",
        "website": "https://proton.me",
        "category": "direct",
        "dws_product_id": "firehorse-v3-email",
        "headquarters_country": "CH",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://proton.me/pricing",
        "notes": "Swiss-based, strong privacy, E2E encrypted",
    },
    {
        "name": "Tutanota",
        "website": "https://tuta.com",
        "category": "direct",
        "dws_product_id": "firehorse-v3-email",
        "headquarters_country": "DE",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://tuta.com/pricing",
        "notes": "German-based, GDPR compliant, E2E encrypted",
    },
    # Firehorse V2 Reports
    {
        "name": "Autodesk BIM360",
        "website": "https://construction.autodesk.com",
        "category": "direct",
        "dws_product_id": "firehorse-v2-reports",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://construction.autodesk.com/products/autodesk-build/pricing/",
        "notes": "US-based construction platform, dominant in enterprise",
    },
    {
        "name": "Procore",
        "website": "https://www.procore.com",
        "category": "direct",
        "dws_product_id": "firehorse-v2-reports",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://www.procore.com/pricing",
        "notes": "US construction management, aggressive EU expansion",
    },
    # DWS IQ Platform
    {
        "name": "Sphera",
        "website": "https://sphera.com",
        "category": "direct",
        "dws_product_id": "dws-iq-platform",
        "headquarters_country": "US",
        "eu_hosted": False,
        "cloud_act_exposure": True,
        "pricing_page": "https://sphera.com/products/",
        "notes": "Enterprise ESG/EHS, US-based, CSRD tooling",
    },
    {
        "name": "Ecoinvent",
        "website": "https://ecoinvent.org",
        "category": "direct",
        "dws_product_id": "dws-iq-platform",
        "headquarters_country": "CH",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://ecoinvent.org/ecoinvent-in-your-organisation/registration/",
        "notes": "Swiss LCA database, widely used in EU compliance",
    },
    {
        "name": "SimaPro",
        "website": "https://simapro.com",
        "category": "direct",
        "dws_product_id": "dws-iq-platform",
        "headquarters_country": "NL",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://simapro.com/sales/",
        "notes": "Dutch LCA software, EU-hosted, professional standard",
    },
    {
        "name": "Worldfavor",
        "website": "https://www.worldfavor.com",
        "category": "indirect",
        "dws_product_id": "dws-iq-platform",
        "headquarters_country": "SE",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://www.worldfavor.com/pricing/",
        "notes": "Swedish ESG platform, supply chain focus",
    },
    {
        "name": "PositionGreen",
        "website": "https://www.positiongreen.com",
        "category": "indirect",
        "dws_product_id": "dws-iq-platform",
        "headquarters_country": "NO",
        "eu_hosted": True,
        "cloud_act_exposure": False,
        "pricing_page": "https://www.positiongreen.com/en/pricing/",
        "notes": "Nordic ESG reporting SaaS, CSRD focus",
    },
]

# ============================================================================
# LOGGING SETUP
# ============================================================================

os.makedirs(LOG_DIR, exist_ok=True)

handler = colorlog.StreamHandler()
handler.setFormatter(
    colorlog.ColoredFormatter(
        "%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(message)s",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
    )
)

logger = colorlog.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(
    os.path.join(LOG_DIR, f"market_research_{datetime.now().strftime('%Y%m%d')}.log")
)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s %(levelname)-8s %(message)s")
)
logger.addHandler(file_handler)

# ============================================================================
# RATE LIMITER
# ============================================================================

_last_request_time: dict[str, float] = {}


def rate_limited_get(url: str, session: requests.Session) -> requests.Response:
    """GET with per-domain rate limiting (max 1 req/sec per §10)."""
    domain = urlparse(url).netloc
    last = _last_request_time.get(domain, 0.0)
    elapsed = time.time() - last
    if elapsed < RATE_LIMIT_SECONDS:
        time.sleep(RATE_LIMIT_SECONDS - elapsed)
    _last_request_time[domain] = time.time()
    return session.get(url, timeout=REQUEST_TIMEOUT)


# ============================================================================
# ROBOTS.TXT CHECKER
# ============================================================================

_robots_cache: dict[str, RobotFileParser] = {}


def can_fetch(url: str) -> bool:
    """Check robots.txt before scraping (required by §10)."""
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    if robots_url not in _robots_cache:
        rp = RobotFileParser()
        rp.set_url(robots_url)
        try:
            rp.read()
        except Exception:
            # If robots.txt is unreachable, allow (fail open for public data)
            _robots_cache[robots_url] = None
            return True
        _robots_cache[robots_url] = rp
    rp = _robots_cache.get(robots_url)
    if rp is None:
        return True
    return rp.can_fetch(USER_AGENT, url)


# ============================================================================
# SUPABASE CLIENT
# ============================================================================

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.error("SUPABASE_URL and SUPABASE_KEY/SUPABASE_SERVICE_KEY are required")
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# ============================================================================
# COMPETITOR UPSERT
# ============================================================================

def upsert_competitor(supabase: Client, competitor: dict, dry_run: bool) -> str | None:
    """
    Upsert a competitor row. Returns the competitor UUID or None on error.
    Uses name+dws_product_id as natural key.
    """
    payload = {
        "name": competitor["name"],
        "website": competitor["website"],
        "category": competitor["category"],
        "dws_product_id": competitor["dws_product_id"],
        "headquarters_country": competitor.get("headquarters_country"),
        "eu_hosted": competitor.get("eu_hosted", False),
        "cloud_act_exposure": competitor.get("cloud_act_exposure", True),
        "last_checked": date.today().isoformat(),
        "notes": competitor.get("notes"),
        "updated_at": datetime.utcnow().isoformat(),
    }

    if dry_run:
        logger.info(f"[DRY-RUN] Would upsert competitor: {competitor['name']}")
        return f"dry-run-id-{competitor['name'].lower().replace(' ', '-')}"

    try:
        result = (
            supabase.table("competitors")
            .upsert(payload, on_conflict="name,dws_product_id")
            .execute()
        )
        if result.data:
            return result.data[0]["id"]
        logger.warning(f"No data returned for competitor: {competitor['name']}")
        return None
    except Exception as exc:
        logger.error(f"Failed to upsert competitor {competitor['name']}: {exc}")
        return None


# ============================================================================
# PRICING SCRAPER
# ============================================================================

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_pricing_page(url: str, session: requests.Session) -> str | None:
    """Fetch raw HTML from a pricing page with retry."""
    if not can_fetch(url):
        logger.warning(f"robots.txt disallows fetching: {url}")
        return None
    try:
        resp = rate_limited_get(url, session)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as exc:
        logger.warning(f"Failed to fetch {url}: {exc}")
        raise


def _detect_period_and_currency(text: str, currency_hint: str = "EUR") -> tuple[str | None, str]:
    """Shared helper: infer billing period and currency from page text."""
    text_lower = text.lower()
    period = None
    if "/month" in text_lower or "/mo" in text_lower or "per month" in text_lower:
        period = "monthly"
    elif "/year" in text_lower or "annual" in text_lower or "per year" in text_lower:
        period = "yearly"
    elif "one-time" in text_lower or "one time" in text_lower:
        period = "one-time"
    elif "per user" in text_lower or "per seat" in text_lower:
        period = "per-user-monthly"

    currency = currency_hint
    if "€" in text:
        currency = "EUR"
    elif "$" in text and "€" not in text:
        currency = "USD"
    elif "chf" in text_lower or "fr." in text:
        currency = "CHF"
    return period, currency


def _extract_features_from_soup(soup: BeautifulSoup) -> list[str]:
    """Extract feature list items from pricing sections."""
    features: list[str] = []
    pricing_sections = soup.find_all(
        ["section", "div"],
        class_=lambda c: c and any(
            kw in c.lower() for kw in ["pricing", "plan", "tier", "package"]
        ),
    )
    for section in pricing_sections[:3]:
        for li in section.find_all("li")[:20]:
            feat = li.get_text(strip=True)
            if feat and len(feat) < 120:
                features.append(feat)
    return features[:15]


# ── Tier 1: JSON-LD schema.org Offer ─────────────────────────────────────────

def _extract_via_jsonld(soup: BeautifulSoup, currency_hint: str) -> dict | None:
    """
    Tier 1: Parse <script type="application/ld+json"> for schema.org Offer price.
    Returns signal dict or None if no usable data found.
    """
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
        except (json.JSONDecodeError, TypeError):
            continue

        # Normalise to list to handle both single-object and @graph arrays
        nodes = data if isinstance(data, list) else data.get("@graph", [data])

        for node in nodes:
            node_type = node.get("@type", "")
            # Handle Product → offers → Offer
            offers = node.get("offers") if node_type in ("Product", "SoftwareApplication") else None
            if offers is None and node_type == "Offer":
                offers = node
            if offers is None:
                continue

            if isinstance(offers, list):
                offers = offers[0]  # use lowest/first offer

            price_raw = offers.get("price") or offers.get("lowPrice")
            if price_raw is None:
                continue

            try:
                price_value = float(str(price_raw).replace(",", "."))
            except ValueError:
                continue

            currency = offers.get("priceCurrency", currency_hint)
            # Map billing via priceSpecification if present
            period = None
            spec = offers.get("priceSpecification", {})
            if isinstance(spec, list):
                spec = spec[0]
            billing = spec.get("billingDuration") or spec.get("unitText", "")
            if "month" in str(billing).lower():
                period = "monthly"
            elif "year" in str(billing).lower():
                period = "yearly"

            logger.debug(f"    [JSON-LD] price={price_value} {currency} period={period}")
            return {
                "price_value": price_value,
                "price_currency": currency,
                "price_period": period,
                "features": [],  # JSON-LD rarely lists features; filled by caller
                "extraction_tier": "jsonld",
            }
    return None


# ── Tier 2: Per-site CSS selectors ───────────────────────────────────────────

def _extract_via_css_selectors(
    soup: BeautifulSoup,
    pricing_url: str,
    scraping_config: dict,
    currency_hint: str,
) -> dict | None:
    """
    Tier 2: Apply site-specific CSS selectors from competitor_scraping_config.json.
    Returns signal dict or None if no match.
    """
    site_cfg = scraping_config.get(pricing_url)
    if not site_cfg:
        return None

    price_selector = site_cfg.get("price_selector", "")
    price_regex = site_cfg.get("price_regex", r"(?P<price>\d[\d.,]*)")
    currency_hint = site_cfg.get("currency_hint", currency_hint)

    price_value = None
    for selector in price_selector.split(", "):
        selector = selector.strip()
        if not selector:
            continue
        element = soup.select_one(selector)
        if not element:
            continue
        raw_text = element.get_text(strip=True)
        match = re.search(price_regex, raw_text.replace(",", "."))
        if match:
            try:
                price_value = float(match.group("price"))
                break
            except (ValueError, IndexError):
                continue

    if price_value is None:
        return None

    # Period from period_selector
    period_selector = site_cfg.get("period_selector", "")
    period = None
    for sel in period_selector.split(", "):
        sel = sel.strip()
        if not sel:
            continue
        el = soup.select_one(sel)
        if el:
            period_text = el.get_text(strip=True).lower()
            if "month" in period_text:
                period = "monthly"
            elif "year" in period_text or "annual" in period_text:
                period = "yearly"
            break

    # Fallback period from full page text
    if period is None:
        _, _ = _detect_period_and_currency(soup.get_text(), currency_hint)

    logger.debug(f"    [CSS] price={price_value} {currency_hint} period={period}")
    return {
        "price_value": price_value,
        "price_currency": currency_hint,
        "price_period": period,
        "features": [],
        "extraction_tier": "css_selector",
    }


# ── Tier 3: Claude API fallback ───────────────────────────────────────────────

def _extract_via_claude(html: str, pricing_url: str, currency_hint: str) -> dict | None:
    """
    Tier 3: Ask Claude to extract the lowest public price from page text.
    Only runs when ANTHROPIC_API_KEY is set. Sends ≤3 000 chars of visible text
    to keep token cost low. Returns signal dict or None on failure.
    """
    if not ANTHROPIC_API_KEY:
        logger.debug("    [Claude] ANTHROPIC_API_KEY not set — skipping Tier 3")
        return None

    soup = BeautifulSoup(html, "html.parser")
    # Strip scripts/styles; keep only visible text
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    visible_text = soup.get_text(separator="\n", strip=True)[:3000]

    prompt = (
        f"You are a pricing data extraction assistant. "
        f"Extract the LOWEST public price from this pricing page text.\n\n"
        f"Page URL: {pricing_url}\n"
        f"Page text (truncated):\n{visible_text}\n\n"
        f"Reply with a JSON object only (no markdown), with these fields:\n"
        f'{{"price_value": <number or null>, '
        f'"price_currency": "<{currency_hint}|USD|EUR|CHF>", '
        f'"price_period": "<monthly|yearly|one-time|per-user-monthly|null>", '
        f'"confidence": "<high|medium|low>"}}\n'
        f"If no public price is shown, return price_value: null."
    )

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-haiku-4-5-20251001",  # cheapest model — price extraction only
                "max_tokens": 256,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=20,
        )
        resp.raise_for_status()
        content = resp.json()["content"][0]["text"].strip()
        # Strip markdown code fences if present
        content = re.sub(r"^```[a-z]*\n?", "", content)
        content = re.sub(r"\n?```$", "", content)
        data = json.loads(content)
        price_value = data.get("price_value")
        if price_value is not None:
            price_value = float(price_value)
        confidence = data.get("confidence", "low")
        if confidence == "low" and price_value is not None:
            logger.debug(f"    [Claude] low confidence — discarding price {price_value}")
            price_value = None  # don't store guesses

        logger.debug(
            f"    [Claude] price={price_value} {data.get('price_currency')} "
            f"period={data.get('price_period')} confidence={confidence}"
        )
        return {
            "price_value": price_value,
            "price_currency": data.get("price_currency", currency_hint),
            "price_period": data.get("price_period"),
            "features": [],
            "extraction_tier": f"claude/{confidence}",
        }
    except (requests.RequestException, json.JSONDecodeError, KeyError, ValueError) as exc:
        logger.warning(f"    [Claude] extraction failed: {exc}")
        return None


# ── Orchestrator ──────────────────────────────────────────────────────────────

def extract_price_signals(
    html: str,
    pricing_url: str,
    scraping_config: dict,
    currency_hint: str = "EUR",
) -> dict:
    """
    Three-tier price extraction chain.

    Tier 1 — JSON-LD schema.org: zero-config, works on sites with structured data.
    Tier 2 — CSS selectors:      per-site config in competitor_scraping_config.json.
    Tier 3 — Claude API:         LLM fallback when both structured approaches fail.
                                 Requires ANTHROPIC_API_KEY env var.

    Always returns a complete dict (price_value may be None if all tiers fail).
    """
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    features = _extract_features_from_soup(soup)
    period_fallback, currency_fallback = _detect_period_and_currency(text, currency_hint)

    # Tier 1: JSON-LD
    result = _extract_via_jsonld(soup, currency_hint)
    if result and result.get("price_value") is not None:
        logger.info(f"    Tier 1 (JSON-LD): price={result['price_value']} {result['price_currency']}")
        result["features"] = result["features"] or features
        result.setdefault("price_period", period_fallback)
        return result

    # Tier 2: CSS selectors
    result = _extract_via_css_selectors(soup, pricing_url, scraping_config, currency_hint)
    if result and result.get("price_value") is not None:
        logger.info(f"    Tier 2 (CSS): price={result['price_value']} {result['price_currency']}")
        result["features"] = result["features"] or features
        result.setdefault("price_period", period_fallback)
        return result

    # Tier 3: Claude API (only if key is available)
    result = _extract_via_claude(html, pricing_url, currency_hint)
    if result and result.get("price_value") is not None:
        logger.info(
            f"    Tier 3 (Claude/{result['extraction_tier'].split('/')[1]}): "
            f"price={result['price_value']} {result['price_currency']}"
        )
        result["features"] = result["features"] or features
        result.setdefault("price_period", period_fallback)
        return result

    # All tiers failed — return what we can
    logger.info("    All extraction tiers failed — price_value=null")
    return {
        "price_value": None,
        "price_currency": currency_fallback,
        "price_period": period_fallback,
        "features": features,
        "extraction_tier": "none",
    }


def collect_competitor_product(
    supabase: Client,
    competitor: dict,
    competitor_id: str,
    session: requests.Session,
    scraping_config: dict,
    dry_run: bool,
) -> None:
    """Scrape pricing page and upsert a competitor_products row."""
    pricing_url = competitor.get("pricing_page", competitor["website"])
    currency_hint = competitor.get("currency_hint", "EUR")

    logger.info(f"  Fetching pricing: {pricing_url}")

    html = None
    try:
        html = fetch_pricing_page(pricing_url, session)
    except Exception as exc:
        logger.error(f"  Pricing fetch failed after retries: {exc}")

    signals = {"price_value": None, "price_currency": "EUR", "price_period": None, "features": [], "extraction_tier": "none"}
    if html:
        signals = extract_price_signals(html, pricing_url, scraping_config, currency_hint)
        tier = signals.get("extraction_tier", "none")
        logger.info(
            f"  Extracted [{tier}]: currency={signals['price_currency']}, "
            f"period={signals['price_period']}, price={signals['price_value']}, "
            f"features={len(signals['features'])}"
        )

    payload = {
        "competitor_id": competitor_id,
        "product_name": competitor["name"],
        "price_value": signals["price_value"],
        "price_currency": signals["price_currency"],
        "price_period": signals["price_period"],
        "features": signals["features"],
        "eu_hosted": competitor.get("eu_hosted", False),
        "e2e_encrypted": False,  # Conservative default; manual update needed
        "open_source": competitor["name"] in ("Jitsi Meet",),
        "compliance_claims": [],
        "data_source_url": pricing_url,
        "collected_at": datetime.utcnow().isoformat(),
        "collected_by": "automated",
    }

    if dry_run:
        logger.info(f"  [DRY-RUN] Would insert competitor_products row for {competitor['name']}")
        return

    try:
        supabase.table("competitor_products").insert(payload).execute()
        logger.info(f"  Saved competitor_products for {competitor['name']}")
    except Exception as exc:
        logger.error(f"  Failed to save competitor_products for {competitor['name']}: {exc}")


# ============================================================================
# MARKET SIGNAL DETECTION
# ============================================================================

SIGNAL_KEYWORDS = {
    "pricing_change": ["price", "pricing", "new plan", "discount", "subscription", "cost reduction"],
    "new_feature": ["new feature", "launch", "introducing", "release", "update", "changelog"],
    "funding": ["funding", "raised", "series", "investment", "venture", "capital"],
    "acquisition": ["acqui", "merger", "acquis", "bought", "purchased"],
    "partnership": ["partner", "integration", "alliance", "collaborate"],
    "regulation": ["gdpr", "csrd", "ets", "cbam", "fit for 55", "eu ai act", "regulation", "compliance"],
    "market_entry": ["enter", "expand", "new market", "launches in", "available in"],
    "market_exit": ["shutdown", "discontinue", "end of life", "sunset", "closing"],
}

IMPACT_SCORES = {
    "pricing_change": 4,
    "new_feature": 3,
    "funding": 4,
    "acquisition": 5,
    "partnership": 3,
    "regulation": 4,
    "market_entry": 3,
    "market_exit": 5,
}


def detect_signal_type(text: str) -> str | None:
    """Classify text into a market signal type."""
    text_lower = text.lower()
    for signal_type, keywords in SIGNAL_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return signal_type
    return None


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_homepage(url: str, session: requests.Session) -> str | None:
    """Fetch competitor homepage for signal detection."""
    if not can_fetch(url):
        logger.warning(f"robots.txt disallows: {url}")
        return None
    try:
        resp = rate_limited_get(url, session)
        resp.raise_for_status()
        return resp.text
    except requests.RequestException as exc:
        logger.warning(f"Failed to fetch {url}: {exc}")
        raise


def collect_market_signals(
    supabase: Client,
    competitor: dict,
    competitor_id: str,
    session: requests.Session,
    dry_run: bool,
) -> int:
    """
    Scan competitor homepage for market signals.
    Returns count of signals saved.
    """
    logger.info(f"  Scanning for signals: {competitor['website']}")
    saved = 0

    html = None
    try:
        html = fetch_homepage(competitor["website"], session)
    except Exception as exc:
        logger.error(f"  Homepage fetch failed: {exc}")
        return 0

    if not html:
        return 0

    soup = BeautifulSoup(html, "html.parser")

    # Check page title, meta description, and headlines for signals
    candidates: list[tuple[str, str]] = []

    title_tag = soup.find("title")
    if title_tag:
        candidates.append(("title", title_tag.get_text(strip=True)))

    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        candidates.append(("meta_description", meta_desc["content"]))

    for tag in soup.find_all(["h1", "h2", "h3"])[:20]:
        text = tag.get_text(strip=True)
        if text:
            candidates.append((tag.name, text))

    for source, text in candidates:
        signal_type = detect_signal_type(text)
        if not signal_type:
            continue

        payload = {
            "signal_type": signal_type,
            "competitor_id": competitor_id,
            "dws_product_id": competitor["dws_product_id"],
            "title": text[:255],
            "summary": f"Detected via {source} on {competitor['website']}",
            "source_url": competitor["website"],
            "impact_score": IMPACT_SCORES.get(signal_type, 2),
            "action_required": IMPACT_SCORES.get(signal_type, 2) >= 4,
            "collected_at": datetime.utcnow().isoformat(),
        }

        if dry_run:
            logger.info(f"  [DRY-RUN] Signal [{signal_type}] score={payload['impact_score']}: {text[:80]}")
            saved += 1
            continue

        try:
            supabase.table("market_signals").insert(payload).execute()
            logger.info(f"  Signal [{signal_type}] score={payload['impact_score']}: {text[:60]}")
            saved += 1
        except Exception as exc:
            logger.error(f"  Failed to save signal: {exc}")

    return saved


# ============================================================================
# WEEKLY BRIEF GENERATOR
# ============================================================================

def generate_market_brief(results: list[dict], output_dir: str, dry_run: bool) -> None:
    """Generate YYYY-WXX-market-brief.md per §9.1."""
    today = date.today()
    week_num = today.isocalendar()[1]
    year = today.year
    filename = f"{year}-W{week_num:02d}-market-brief.md"
    output_path = os.path.join(output_dir, filename)

    lines = [
        f"# Market Brief — Week {week_num:02d}, {year}",
        "",
        f"**Generated:** {today.isoformat()} by collect_market_research.py",
        f"**Mode:** {'DRY RUN' if dry_run else 'LIVE'}",
        "",
        "## Collection Summary",
        "",
        "| Competitor | Product | Signals | Pricing Data |",
        "|------------|---------|---------|--------------|",
    ]

    high_impact = []
    for r in results:
        pricing = "✅" if r.get("pricing_collected") else "—"
        lines.append(
            f"| {r['name']} | {r['dws_product_id']} | {r['signals_found']} | {pricing} |"
        )
        if r.get("signals_found", 0) > 0:
            high_impact.append(r["name"])

    lines += [
        "",
        "## Key Signals This Week",
        "",
    ]

    if high_impact:
        for name in high_impact:
            lines.append(f"- Signals detected for **{name}** — review `market_signals` table")
    else:
        lines.append("- No high-impact signals detected this week")

    lines += [
        "",
        "## Action Items",
        "",
        "- [ ] Review market_signals table in Supabase for action_required=true rows",
        "- [ ] Update competitor_products manually where pricing_value is null",
        "- [ ] File PIPs for any gaps identified",
        "",
        "## Data Sources",
        "",
        "- Competitor websites (public pages only, robots.txt respected)",
        "- Pricing pages as listed in competitor registry",
        "",
        f"**Next collection:** {year}-W{week_num + 1:02d} (Monday 07:00 UTC)",
    ]

    content = "\n".join(lines)

    if dry_run:
        logger.info(f"[DRY-RUN] Would write brief to {output_path}")
        logger.info(content[:500])
        return

    os.makedirs(output_dir, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    logger.info(f"Market brief written: {output_path}")


# ============================================================================
# MAIN COLLECTION LOOP
# ============================================================================

def run_collection(args: argparse.Namespace) -> None:
    dry_run = args.dry_run
    competitor_filter = args.competitor

    if dry_run:
        logger.warning("DRY-RUN mode — no data will be written to Supabase")

    if ANTHROPIC_API_KEY:
        logger.info("Tier 3 (Claude) enabled — ANTHROPIC_API_KEY found")
    else:
        logger.info("Tier 3 (Claude) disabled — set ANTHROPIC_API_KEY to enable")

    supabase = get_supabase_client()
    scraping_config = _load_scraping_config()
    logger.info(f"Loaded CSS selector config for {len(scraping_config)} sites")

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    targets = COMPETITORS
    if competitor_filter:
        targets = [c for c in COMPETITORS if c["name"].lower() == competitor_filter.lower()]
        if not targets:
            logger.error(f"Competitor not found: {competitor_filter}")
            logger.info(f"Available: {', '.join(c['name'] for c in COMPETITORS)}")
            sys.exit(1)

    results = []
    total_signals = 0
    total_products = 0

    for competitor in targets:
        logger.info(f"Processing: {competitor['name']} ({competitor['dws_product_id']})")

        # 1. Upsert competitor registry row
        competitor_id = upsert_competitor(supabase, competitor, dry_run)
        if not competitor_id:
            logger.warning(f"Skipping {competitor['name']} — no competitor_id")
            continue

        # 2. Collect pricing & product data (three-tier extraction)
        collect_competitor_product(supabase, competitor, competitor_id, session, scraping_config, dry_run)
        total_products += 1

        # 3. Collect market signals from homepage
        signals_found = collect_market_signals(supabase, competitor, competitor_id, session, dry_run)
        total_signals += signals_found

        results.append({
            "name": competitor["name"],
            "dws_product_id": competitor["dws_product_id"],
            "signals_found": signals_found,
            "pricing_collected": True,
        })

        logger.info(f"  Done: {signals_found} signals, pricing collected")

    # 4. Generate weekly brief
    brief_dir = os.path.join(os.path.dirname(SCRIPT_DIR), "docs", "market-research")
    generate_market_brief(results, brief_dir, dry_run)

    logger.info(
        f"\nCollection complete: {len(results)} competitors, "
        f"{total_products} product rows, {total_signals} signals"
    )


# ============================================================================
# ENTRYPOINT
# ============================================================================

def main() -> None:
    parser = argparse.ArgumentParser(
        description="DWS Competitor Market Research Collection (DWS_MARKET_RESEARCH_STANDARD.md v1.0)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without saving to Supabase",
    )
    parser.add_argument(
        "--competitor",
        metavar="NAME",
        help="Run for a single competitor only (e.g. 'Zoom', 'Sphera')",
    )
    args = parser.parse_args()
    try:
        run_collection(args)
    except Exception:
        logger.exception("Market research collection failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
