#!/usr/bin/env python3
"""
EU Regulatory Signal Collection Script — DWS IQ 6
Follows DWS_MARKET_RESEARCH_STANDARD.md v1.0 §4.3, §10, §11

Stage 1 of the sales-manager newsletter automation plan
(docs/field-notes/2026-07-12-sales-manager-newsletter-automation-plan.md).
Populates the Supabase `market_signals` table with signal_type='regulation'
rows — the ingestion layer the repo's own regulatory-radar skill
(.claude/commands/regulatory-radar.md) already documents as unbuilt.

Usage:
    python scripts/collect_regulatory_signals.py [--dry-run] [--topic NAME]

Requirements:
    pip install -r scripts/requirements-signals.txt

Environment Variables:
    SUPABASE_URL          - Supabase project URL
    SUPABASE_KEY          - Supabase service key (with write permissions)
    SUPABASE_SERVICE_KEY  - Alternative env var name for service key

Data Retention Policy (mirrors collect_market_research.py):
    - Public information only (news aggregation, no authenticated content)
    - Respects robots.txt
    - Rate limit: max 1 request/second per domain
    - Retention: 2 years rolling (per DWS_MARKET_RESEARCH_STANDARD.md §10)

Source note (read before extending):
    This collector uses Google News RSS as an aggregator — the same proven
    pattern already live in scripts/daily/news-to-signal.sh — rather than
    scraping EUR-Lex / EC press-corner / Euractiv directly. Direct fetches to
    eur-lex.europa.eu, ec.europa.eu/commission/presscorner, and
    euractiv.com were attempted from this development session and all
    returned HTTP 403 or were unreachable (bot-detection on the fetch path
    used to develop this script, not necessarily true from DGX Spark's
    network in production). Rather than hardcode unverified official-source
    URLs, TOPICS below use the aggregator, and can_fetch()/rate_limited_get()
    are still applied to it. If a verified direct EUR-Lex/EC feed URL is
    confirmed working from DGX Spark, add it as a new entry in TOPICS with
    kind="direct_rss" (see fetch_signals_for_topic).
"""

import argparse
import hashlib
import logging
import os
import sys
import time
from datetime import datetime, timedelta
from urllib.parse import quote, urlparse
from urllib.robotparser import RobotFileParser

import colorlog
import feedparser
import requests
from dateutil import parser as dateutil_parser
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

REQUEST_TIMEOUT = 10  # seconds
RATE_LIMIT_SECONDS = 1.0  # max 1 req/sec per domain (DWS_MARKET_RESEARCH_STANDARD.md §10)
USER_AGENT = "DWSRegulatorySignals/1.0 (+https://dws10.com; research@lifetime.fi)"
LOOKBACK_DAYS = 7  # matches the "when:7d" Google News window

# ============================================================================
# TOPIC REGISTRY — maps to DWS_MARKET_RESEARCH_STANDARD.md / sales-manager.md themes
# ============================================================================

TOPICS = [
    {
        "name": "CSRD/ESRS",
        "query": "CSRD ESRS sustainability reporting EU",
        "dws_product_id": "dws-iq-platform",
        "keywords": ["csrd", "esrs", "sustainability report", "double materiality", "omnibus"],
    },
    {
        "name": "CBAM",
        "query": "CBAM carbon border adjustment EU steel",
        "dws_product_id": "dws-iq-manufacturing",
        "keywords": ["cbam", "carbon border", "embedded emissions", "certificate price"],
    },
    {
        "name": "Sovereign Cloud / CADA",
        "query": "EU sovereign cloud AI Development Act data sovereignty",
        "dws_product_id": "dws-iq-aegis",
        "keywords": ["sovereign cloud", "cada", "cloud act", "data sovereignty", "edge ai"],
    },
    {
        "name": "Fit for 55 / ETS",
        "query": "Fit for 55 EU ETS emissions trading transport",
        "dws_product_id": "dws-iq-platform",
        "keywords": ["fit for 55", "ets", "emissions trading", "carbon price"],
    },
    {
        "name": "Clean Industrial Deal",
        "query": "EU Clean Industrial Deal decarbonization competitiveness",
        "dws_product_id": "dws-iq-platform",
        "keywords": ["clean industrial deal", "decarbonization", "competitiveness", "green deal"],
    },
    {
        "name": "EU AI Act",
        "query": "EU AI Act compliance deadline enforcement",
        "dws_product_id": "dws-iq-aegis",
        "keywords": ["ai act", "high-risk ai", "article 12", "ai governance"],
    },
]

# Impact scoring: baseline + boosts for deadline/enforcement language.
URGENCY_KEYWORDS = ["deadline", "enforcement", "penalty", "fine", "mandatory", "effective from", "adopted"]

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
    os.path.join(LOG_DIR, f"regulatory_signals_{datetime.now().strftime('%Y%m%d')}.log")
)
file_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)-8s %(message)s"))
logger.addHandler(file_handler)

# ============================================================================
# RATE LIMITER (mirrors collect_market_research.py)
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
# ROBOTS.TXT CHECKER (mirrors collect_market_research.py)
# ============================================================================

_robots_cache: dict[str, RobotFileParser | None] = {}


def can_fetch(url: str) -> bool:
    """Check robots.txt before fetching (required by §10)."""
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    if robots_url not in _robots_cache:
        rp = RobotFileParser()
        rp.set_url(robots_url)
        try:
            rp.read()
        except Exception:
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


def signal_already_collected(supabase: Client, source_url: str) -> bool:
    """Dedup guard — this script runs on a recurring schedule against the
    same rolling news window, so re-runs must not re-insert the same item."""
    try:
        result = (
            supabase.table("market_signals")
            .select("id")
            .eq("source_url", source_url)
            .limit(1)
            .execute()
        )
        return bool(result.data)
    except Exception as exc:
        logger.warning(f"Dedup check failed for {source_url}: {exc} — proceeding (may duplicate)")
        return False


# ============================================================================
# SIGNAL SCORING
# ============================================================================

def score_impact(title: str, summary: str, topic_keywords: list[str]) -> int:
    """1-5 impact score. Baseline 2, +1 per topic keyword hit (cap +2),
    +1 if urgency language present."""
    text = f"{title} {summary}".lower()
    score = 2
    keyword_hits = sum(1 for kw in topic_keywords if kw in text)
    score += min(keyword_hits, 2)
    if any(kw in text for kw in URGENCY_KEYWORDS):
        score += 1
    return min(score, 5)


# ============================================================================
# FEED FETCH + PARSE
# ============================================================================

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_feed_text(url: str, session: requests.Session) -> str | None:
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


def fetch_signals_for_topic(topic: dict, session: requests.Session) -> list[dict]:
    """Fetch and parse the Google News RSS aggregator for one topic. Returns
    a list of {title, summary, source_url, published} dicts, most recent
    LOOKBACK_DAYS only. One topic failing does not raise — returns []."""
    query = quote(topic["query"])
    url = f"https://news.google.com/rss/search?q={query}+when:{LOOKBACK_DAYS}d&hl=en-US&gl=EU&ceid=EU:en"

    try:
        raw = fetch_feed_text(url, session)
    except Exception as exc:
        logger.error(f"[{topic['name']}] feed fetch failed after retries: {exc}")
        return []

    if not raw:
        return []

    parsed = feedparser.parse(raw)
    if parsed.bozo and not parsed.entries:
        logger.warning(f"[{topic['name']}] feed did not parse cleanly and had no entries")
        return []

    cutoff = datetime.utcnow() - timedelta(days=LOOKBACK_DAYS + 1)
    items: list[dict] = []
    for entry in parsed.entries:
        title = getattr(entry, "title", "").strip()
        link = getattr(entry, "link", "").strip()
        summary = getattr(entry, "summary", "").strip()
        if not title or not link:
            continue

        published = None
        if getattr(entry, "published", None):
            try:
                published = dateutil_parser.parse(entry.published).replace(tzinfo=None)
            except (ValueError, TypeError):
                published = None
        if published and published < cutoff:
            continue

        items.append({"title": title, "summary": summary, "source_url": link})

    return items


# ============================================================================
# COLLECTION RUN
# ============================================================================

def run_collection(args: argparse.Namespace) -> None:
    dry_run = args.dry_run
    topic_filter = args.topic

    if dry_run:
        logger.warning("DRY-RUN mode — no data will be written to Supabase")

    supabase = get_supabase_client()
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    topics = TOPICS
    if topic_filter:
        topics = [t for t in TOPICS if t["name"].lower() == topic_filter.lower()]
        if not topics:
            logger.error(f"Topic not found: {topic_filter}")
            logger.info(f"Available: {', '.join(t['name'] for t in TOPICS)}")
            sys.exit(1)

    total_found = 0
    total_saved = 0
    total_skipped_dup = 0

    for topic in topics:
        logger.info(f"Scanning: {topic['name']}")
        items = fetch_signals_for_topic(topic, session)
        total_found += len(items)
        logger.info(f"  {len(items)} items in last {LOOKBACK_DAYS}d")

        for item in items:
            if not dry_run and signal_already_collected(supabase, item["source_url"]):
                total_skipped_dup += 1
                continue

            impact = score_impact(item["title"], item["summary"], topic["keywords"])
            payload = {
                "signal_type": "regulation",
                "competitor_id": None,
                "dws_product_id": topic["dws_product_id"],
                "title": item["title"][:255],
                "summary": item["summary"][:2000] if item["summary"] else None,
                "source_url": item["source_url"],
                "impact_score": impact,
                "action_required": impact >= 4,
                "collected_at": datetime.utcnow().isoformat(),
            }

            if dry_run:
                logger.info(f"  [DRY-RUN] [{topic['name']}] score={impact}: {item['title'][:80]}")
                total_saved += 1
                continue

            try:
                supabase.table("market_signals").insert(payload).execute()
                logger.info(f"  Saved [{topic['name']}] score={impact}: {item['title'][:70]}")
                total_saved += 1
            except Exception as exc:
                logger.error(f"  Failed to save signal: {exc}")

    logger.info(
        f"\nCollection complete: {total_found} items scanned, "
        f"{total_saved} saved, {total_skipped_dup} already-known (skipped)"
    )


# ============================================================================
# ENTRYPOINT
# ============================================================================

def main() -> None:
    parser = argparse.ArgumentParser(
        description="DWS EU Regulatory Signal Collection (DWS_MARKET_RESEARCH_STANDARD.md v1.0 §4.3)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without saving to Supabase",
    )
    parser.add_argument(
        "--topic",
        metavar="NAME",
        help="Run for a single topic only (e.g. 'CBAM', 'EU AI Act')",
    )
    args = parser.parse_args()
    run_collection(args)


if __name__ == "__main__":
    main()
