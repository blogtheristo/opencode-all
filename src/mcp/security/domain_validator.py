"""
Domain Validator - Protection Against "The Lethal Trifecta"

Enforces Claude API's web_fetch safety model by only allowing URLs from
explicitly trusted domains.

References:
- https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-fetch-tool
- Simon Willison: "The Lethal Trifecta" (2025-06-16)
- https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/

The Lethal Trifecta:
1. User content includes untrusted input
2. Tool access enables querying or exfiltrating data
3. Exfiltration channel (webhook.site, image markdown, etc.)

This module blocks condition #3 by restricting outbound URLs.
"""

import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


class SecurityException(Exception):
    """Raised when a security violation is detected."""


class DomainValidator:
    """
    Enforce Claude API's web_fetch safety model:
    Only allow URLs from explicitly trusted domains.
    """

    # TIER 1: Core Infrastructure (Always Safe)
    INFRASTRUCTURE_DOMAINS: set[str] = {
        "api.anthropic.com",
        "api.openai.com",
        "api.groq.com",
        "console.groq.com",
        "storage.googleapis.com",  # Google Cloud Storage
        "run.app",  # Cloud Run endpoints
        "cloudflare.com",
        "pages.dev",  # Cloudflare Pages
        "vercel.app",  # Vercel deployments
        "dws10.com",  # DWS IQ 6 production
        "onelifetime.world",  # OneLifetime World
    }

    # TIER 2: EU Regulatory Sources (Read-Only)
    REGULATORY_DOMAINS: set[str] = {
        "eur-lex.europa.eu",  # EU law database
        "ec.europa.eu",  # European Commission
        "eib.org",  # European Investment Bank
        "investeu.europa.eu",  # InvestEU Portal
        "data.europa.eu",  # EU Open Data Portal
        "europa.eu",  # General EU domain
        "consilium.europa.eu",  # Council of the EU
        "europarl.europa.eu",  # European Parliament
    }

    # TIER 3: Customer-Specific (Requires Explicit Opt-In)
    # Populated at runtime from customer configuration
    _customer_allowed_domains: set[str] = set()

    # BLACKLIST: Never Allow (Known Exfiltration Vectors)
    BLACKLISTED_DOMAINS: set[str] = {
        "webhook.site",  # Simon Willison: Used in Salesforce AgentForce exploit
        "requestbin.com",
        "requestcatcher.com",
        "httpbin.org",
        "pipedream.com",
        "ngrok.io",  # Tunneling service
        "*.ngrok-free.app",
        "localtunnel.me",
        "*.loca.lt",
        "serveo.net",
        "*.burpcollaborator.net",  # Burp Suite testing
        "*.oastify.com",  # OAST testing
    }

    @classmethod
    def validate_url(cls, url: str, customer_id: str | None = None) -> tuple[bool, str]:
        """
        Validate URL against three-tier allow-list.

        Args:
            url: URL to validate
            customer_id: Optional customer ID for customer-specific domains

        Returns:
            (is_valid, reason_if_invalid)
        """
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()

            if not domain:
                return False, "Invalid URL: missing domain"

            # Remove port if present
            domain = domain.split(":")[0]

            # Check blacklist first
            if cls._is_blacklisted(domain):
                logger.warning(f"Blocked blacklisted domain: {domain}")
                return (
                    False,
                    f"Domain {domain} is blacklisted (known exfiltration vector)",
                )

            # Check Tier 1: Infrastructure
            if domain in cls.INFRASTRUCTURE_DOMAINS:
                return True, ""

            # Check Tier 2: Regulatory
            if domain in cls.REGULATORY_DOMAINS:
                return True, ""

            # Check Tier 3: Customer-Specific
            if customer_id and domain in cls._customer_allowed_domains:
                return True, ""

            # Default: DENY
            logger.warning(f"Blocked non-whitelisted domain: {domain}")
            return False, (
                f"Domain {domain} not in allow-list. "
                f"Contact security@dws10.com to add trusted domains."
            )

        except Exception as e:
            logger.error(f"Error validating URL {url}: {e}")
            return False, f"Invalid URL format: {e}"

    @classmethod
    def _is_blacklisted(cls, domain: str) -> bool:
        """Check if domain matches blacklist (supports wildcards)."""
        if domain in cls.BLACKLISTED_DOMAINS:
            return True

        # Check wildcard patterns (e.g., *.ngrok-free.app)
        for blacklisted in cls.BLACKLISTED_DOMAINS:
            if blacklisted.startswith("*."):
                suffix = blacklisted[2:]
                if domain.endswith(suffix):
                    return True

        return False

    @classmethod
    def add_customer_domain(
        cls, customer_id: str, domain: str, approved_by: str
    ) -> None:
        """
        Add customer-specific domain to allow-list.
        Requires security team approval.

        Args:
            customer_id: Customer ID
            domain: Domain to allow
            approved_by: Email of security team member who approved
        """
        # Validate domain format
        domain = domain.lower().strip()
        if not domain or "/" in domain:
            raise ValueError(f"Invalid domain format: {domain}")

        # Check if already blacklisted
        if cls._is_blacklisted(domain):
            raise SecurityException(f"Cannot add blacklisted domain: {domain}")

        # Log approval for audit trail
        logger.info(
            f"Domain allow-list addition: customer={customer_id}, "
            f"domain={domain}, approved_by={approved_by}"
        )

        cls._customer_allowed_domains.add(domain)

    @classmethod
    def remove_customer_domain(cls, domain: str) -> None:
        """Remove domain from customer allow-list."""
        domain = domain.lower().strip()
        cls._customer_allowed_domains.discard(domain)
        logger.info(f"Removed domain from allow-list: {domain}")

    @classmethod
    def get_customer_domains(cls) -> set[str]:
        """Get all customer-specific allowed domains."""
        return cls._customer_allowed_domains.copy()
