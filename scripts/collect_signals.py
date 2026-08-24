#!/usr/bin/env python3
"""
Signal Collection Script for DWS IQ 6 Sales Automation

Scrapes company news, press releases, and blogs for sales signals.
Analyzes correlation with DWS6 features and saves to Supabase.

Usage:
    python scripts/collect_signals.py [--dry-run] [--limit N]

Requirements:
    pip install -r scripts/requirements-signals.txt

Environment Variables:
    SUPABASE_URL - Supabase project URL
    SUPABASE_KEY - Supabase service key (with write permissions)
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime
from urllib.parse import urljoin

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
CONFIG_FILE = os.path.join(SCRIPT_DIR, "signal_targets.json")
LOG_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "logs")

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")

# Scraping settings
REQUEST_TIMEOUT = 10  # seconds
MAX_ARTICLES_PER_COMPANY = 5
SIGNAL_LOOKBACK_DAYS = 7  # Only collect signals from last N days

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

# File handler (for debugging)
file_handler = logging.FileHandler(
    os.path.join(LOG_DIR, f"signals_{datetime.now().strftime('%Y%m%d')}.log")
)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
)
logger.addHandler(file_handler)

# ============================================================================
# SUPABASE CLIENT
# ============================================================================


class SignalDatabase:
    """Supabase database client for signal storage"""

    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError(
                "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY env vars."
            )

        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    @retry(
        stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def save_signal(self, signal: dict) -> bool:
        """Save signal to firehorse_signals table"""
        try:
            response = self.client.table("firehorse_signals").insert(signal).execute()
            logger.debug(f"Saved signal: {response.data}")
            return True
        except Exception as e:
            logger.error(f"Failed to save signal: {e}")
            return False

    def signal_exists(self, company_name: str, signal_url: str) -> bool:
        """Check if signal already exists (prevent duplicates)"""
        try:
            response = (
                self.client.table("firehorse_signals")
                .select("id")
                .eq("company_name", company_name)
                .eq("signal_url", signal_url)
                .execute()
            )

            return len(response.data) > 0
        except Exception as e:
            logger.warning(f"Error checking duplicate: {e}")
            return False  # Assume doesn't exist if check fails


# ============================================================================
# CORRELATION ANALYZER
# ============================================================================


class CorrelationAnalyzer:
    """Analyzes signal content for DWS6 feature correlation"""

    def __init__(self, keywords: dict[str, list[str]]):
        self.keywords = keywords

    def analyze(self, text: str) -> tuple[int, str, list[str], list[str]]:
        """
        Analyze text and return (score, reason, matched_keywords, features)

        Returns:
            score (int): 1-5 (LOW to ULTRA)
            reason (str): Why this correlation score
            matched_keywords (List[str]): Keywords found in text
            features (List[str]): DWS6 features matched
        """
        text_lower = text.lower()
        matched_keywords = []
        features = []

        # ULTRA (5) - Direct DWS6 need
        for keyword in self.keywords.get("ULTRA", []):
            if keyword.lower() in text_lower:
                matched_keywords.append(keyword)
                # Map keywords to DWS6 features
                if keyword.upper() in ["CSRD", "EU TAXONOMY", "ESG REPORTING"]:
                    features.append("CSRD")
                if "FIT FOR 55" in keyword.upper() or "SCOPE" in keyword.upper():
                    features.append("Fit_for_55")
                if "SPI" in keyword.upper() or "CPI" in keyword.upper():
                    features.append("SPI_CPI")

                return (
                    5,
                    f"Contains ULTRA keyword: {keyword}",
                    matched_keywords,
                    list(set(features)),
                )

        # HIGH (4) - Strong signal
        for keyword in self.keywords.get("HIGH", []):
            if keyword.lower() in text_lower:
                matched_keywords.append(keyword)

                if "COO" in keyword or "CDO" in keyword or "CSO" in keyword:
                    features.append("Digitalization")
                if "ESG" in keyword.upper() or "SUSTAINABILITY" in keyword.upper():
                    features.append("ESG")
                if "FUNDING" in keyword.upper():
                    features.append("Growth")

                return (
                    4,
                    f"Contains HIGH keyword: {keyword}",
                    matched_keywords,
                    list(set(features)),
                )

        # MEDIUM (3) - Potential interest
        for keyword in self.keywords.get("MEDIUM", []):
            if keyword.lower() in text_lower:
                matched_keywords.append(keyword)

                if "BIM" in keyword.upper():
                    features.append("BIM")
                if "AUTOMATION" in keyword.upper() or "AI" in keyword.upper():
                    features.append("Automation")

                return (
                    3,
                    f"Contains MEDIUM keyword: {keyword}",
                    matched_keywords,
                    list(set(features)),
                )

        # LOW (1) - Generic content
        return 1, "Generic content, no relevant keywords", [], []


# ============================================================================
# WEB SCRAPER
# ============================================================================


class WebScraper:
    """Scrapes company news pages for signals"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        )

    @retry(
        stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=5)
    )
    def scrape_company_news(self, company: dict) -> list[dict]:
        """Scrape latest news from company website"""
        try:
            response = self.session.get(company["news_url"], timeout=REQUEST_TIMEOUT)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")
            articles = []

            # Generic article parsing (works for most news pages)
            # You may need to customize selectors per site
            article_elements = soup.find_all(
                ["article", "div"],
                class_=lambda c: (
                    c
                    and any(
                        word in str(c).lower()
                        for word in ["news", "press", "article", "post"]
                    )
                ),
                limit=MAX_ARTICLES_PER_COMPANY * 2,  # Get more, filter later
            )

            for elem in article_elements:
                article = self._parse_article(elem, company["news_url"])
                if article and self._is_recent(article):
                    articles.append(article)

                if len(articles) >= MAX_ARTICLES_PER_COMPANY:
                    break

            logger.info(f"✓ {company['name']}: Found {len(articles)} articles")
            return articles

        except requests.RequestException as e:
            logger.warning(f"✗ {company['name']}: Request failed - {e}")
            return []
        except Exception as e:
            logger.error(f"✗ {company['name']}: Parsing error - {e}")
            return []

    def _parse_article(self, elem, base_url: str) -> dict | None:
        """Parse individual article element"""
        try:
            # Find title
            title_elem = elem.find(["h1", "h2", "h3", "h4", "a"])
            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)

            # Find link
            link_elem = elem.find("a", href=True)
            if not link_elem:
                return None

            url = urljoin(base_url, link_elem["href"])

            # Get full text (title + content snippet)
            text = elem.get_text(separator=" ", strip=True)[:2000]

            # Try to find date
            date_elem = elem.find(
                ["time", "span", "div"], class_=lambda c: c and "date" in str(c).lower()
            )
            date_str = date_elem.get_text(strip=True) if date_elem else None

            return {"title": title, "url": url, "text": text, "date": date_str}

        except Exception as e:
            logger.debug(f"Error parsing article element: {e}")
            return None

    def _is_recent(self, _article: dict) -> bool:
        """Check if article is within lookback period"""
        # Simple check - in production, parse dates properly
        # For now, assume all scraped articles are recent enough
        return True


# ============================================================================
# SIGNAL COLLECTOR
# ============================================================================


class SignalCollector:
    """Main signal collection orchestrator"""

    def __init__(self, config_file: str, dry_run: bool = False):
        self.dry_run = dry_run
        self.db = None if dry_run else SignalDatabase()
        self.scraper = WebScraper()

        # Load configuration
        with open(config_file, encoding="utf-8") as f:
            config = json.load(f)

        self.companies = config["target_companies"]
        self.analyzer = CorrelationAnalyzer(config["keywords"])

        logger.info(f"Loaded {len(self.companies)} target companies")

    def collect(self, limit: int | None = None) -> dict[str, int]:
        """
        Collect signals from all companies

        Args:
            limit: Max number of companies to process (for testing)

        Returns:
            Dictionary with statistics
        """
        stats = {
            "companies_processed": 0,
            "articles_found": 0,
            "signals_saved": 0,
            "ultra": 0,
            "high": 0,
            "medium": 0,
            "duplicates_skipped": 0,
        }

        companies_to_process = self.companies[:limit] if limit else self.companies

        logger.info(f"\n{'=' * 60}")
        logger.info(f"Starting signal collection at {datetime.now()}")
        logger.info(f"Mode: {'DRY RUN' if self.dry_run else 'LIVE'}")
        logger.info(f"Processing {len(companies_to_process)} companies")
        logger.info(f"{'=' * 60}\n")

        for company in companies_to_process:
            logger.info(f"📰 Scraping {company['name']} ({company['country']})...")

            articles = self.scraper.scrape_company_news(company)
            stats["companies_processed"] += 1
            stats["articles_found"] += len(articles)

            for article in articles:
                # Analyze correlation
                score, reason, keywords, features = self.analyzer.analyze(
                    article["text"]
                )

                # Only save HIGH/ULTRA signals
                if score >= 4:
                    # Check for duplicates
                    if not self.dry_run and self.db.signal_exists(
                        company["name"], article["url"]
                    ):
                        logger.debug(f"  ⊘ Duplicate: {article['title'][:50]}...")
                        stats["duplicates_skipped"] += 1
                        continue

                    signal = {
                        "signal_source": "web",
                        "signal_type": "press_release",
                        "signal_date": datetime.now().isoformat(),
                        "company_name": company["name"],
                        "signal_content": article["text"][:1000],  # Limit to 1000 chars
                        "signal_url": article["url"],
                        "correlation_score": score,
                        "correlation_reason": reason,
                        "keywords_matched": keywords,
                        "dws6_feature_match": features,
                        "status": "detected",
                        "signal_metadata": {
                            "country": company["country"],
                            "priority": company["priority"],
                            "title": article["title"],
                        },
                    }

                    if self.dry_run:
                        logger.info(
                            f"  [DRY RUN] Would save: {article['title'][:60]}... (score: {score})"
                        )
                    else:
                        if self.db.save_signal(signal):
                            logger.info(
                                f"  ✅ Saved: {article['title'][:60]}... (score: {score})"
                            )
                            stats["signals_saved"] += 1

                            if score == 5:
                                stats["ultra"] += 1
                            elif score == 4:
                                stats["high"] += 1
                        else:
                            logger.error("  ✗ Failed to save signal")

        return stats

    def print_summary(self, stats: dict[str, int]):
        """Print collection summary"""
        logger.info(f"\n{'=' * 60}")
        logger.info("COLLECTION SUMMARY")
        logger.info(f"{'=' * 60}")
        logger.info(f"Companies processed:  {stats['companies_processed']}")
        logger.info(f"Articles found:       {stats['articles_found']}")
        logger.info(f"Signals saved:        {stats['signals_saved']}")
        logger.info(f"  - ULTRA (score 5):  {stats['ultra']}")
        logger.info(f"  - HIGH (score 4):   {stats['high']}")
        logger.info(f"Duplicates skipped:   {stats['duplicates_skipped']}")
        logger.info(f"{'=' * 60}\n")


# ============================================================================
# MAIN
# ============================================================================


def main():
    parser = argparse.ArgumentParser(
        description="Collect sales signals from company news pages"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Run without saving to database"
    )
    parser.add_argument(
        "--limit", type=int, help="Limit number of companies to process (for testing)"
    )
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")

    args = parser.parse_args()

    if args.debug:
        logger.setLevel(logging.DEBUG)

    # Check config file exists
    if not os.path.exists(CONFIG_FILE):
        logger.error(f"Config file not found: {CONFIG_FILE}")
        sys.exit(1)

    # Run collector
    try:
        collector = SignalCollector(CONFIG_FILE, dry_run=args.dry_run)
        stats = collector.collect(limit=args.limit)
        collector.print_summary(stats)

        # Exit with appropriate code
        if stats["signals_saved"] == 0 and not args.dry_run:
            logger.warning("No signals saved. Check configuration or try --debug.")
            sys.exit(1)
        else:
            logger.info("✅ Collection complete!")
            sys.exit(0)

    except KeyboardInterrupt:
        logger.warning("\n\nInterrupted by user. Exiting...")
        sys.exit(130)
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
