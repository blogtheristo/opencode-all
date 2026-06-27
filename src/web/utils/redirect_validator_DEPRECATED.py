"""
Redirect Validator

Validate redirect URLs to prevent open redirect vulnerabilities.

Based on:
- Datasette CVE-2025-XXXXX (open redirect)
- Simon Willison: "Datasette 0.65.2 fixes open redirect issue" (2025-11-05)
- https://simonwillison.net/2025/Nov/5/datasette-open-redirect/
- OWASP: Unvalidated Redirects and Forwards

Open Redirect Attack:
1. Attacker crafts malicious link: https://dws10.com/login?next=https://evil.com
2. User logs in successfully
3. Application redirects to https://evil.com (attacker's site)
4. User thinks they're still on dws10.com, enters credentials
5. Result: Phishing attack, credential theft

This module validates redirect URLs against an allow-list.
"""

import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


class RedirectValidator:
    """
    Validate redirect URLs to prevent open redirect vulnerabilities.
    """

    # Allowed domains for absolute redirects
    ALLOWED_DOMAINS: set[str] = {
        "dws10.com",
        "onelifetime.world",
        "localhost",  # Development only
        "127.0.0.1",  # Development only
    }

    @classmethod
    def is_safe_redirect(cls, url: str) -> bool:
        """
        Check if redirect URL is safe.

        Args:
            url: Redirect URL (can be relative or absolute)

        Returns:
            True if safe, False if potentially malicious
        """
        if not url:
            return False

        # Allow relative URLs (same-origin)
        # Must start with / but NOT with // (protocol-relative URLs are dangerous)
        if url.startswith("/") and not url.startswith("//"):
            return True

        # Parse absolute URL
        try:
            parsed = urlparse(url)
        except Exception as e:
            logger.warning(f"Failed to parse redirect URL {url}: {e}")
            return False

        # Scheme must be http or https (block javascript:, data:, etc.)
        if parsed.scheme and parsed.scheme not in ["http", "https"]:
            logger.warning(f"Blocked redirect with dangerous scheme: {parsed.scheme}")
            return False

        # Domain must be in allow-list
        if parsed.netloc:
            domain = parsed.netloc.split(":")[0]  # Remove port
            domain = domain.lower()

            if domain not in cls.ALLOWED_DOMAINS:
                logger.warning(f"Blocked redirect to non-whitelisted domain: {domain}")
                return False

        return True

    @classmethod
    def sanitize_redirect(cls, url: str | None, default: str = "/") -> str:
        """
        Sanitize redirect URL, returning default if unsafe.

        Args:
            url: User-provided redirect URL
            default: Default redirect if URL is unsafe

        Returns:
            Safe redirect URL
        """
        if not url:
            return default

        if cls.is_safe_redirect(url):
            return url

        # Log potential attack
        logger.warning(
            f"Open redirect attempt blocked: {url}\n"
            f"Returning default redirect: {default}"
        )

        return default

    @classmethod
    def add_allowed_domain(cls, domain: str) -> None:
        """
        Add domain to allow-list.

        Args:
            domain: Domain to allow (without scheme or path)
        """
        domain = domain.lower().strip()
        cls.ALLOWED_DOMAINS.add(domain)
        logger.info(f"Added allowed redirect domain: {domain}")

    @classmethod
    def remove_allowed_domain(cls, domain: str) -> None:
        """
        Remove domain from allow-list.

        Args:
            domain: Domain to remove
        """
        domain = domain.lower().strip()
        cls.ALLOWED_DOMAINS.discard(domain)
        logger.info(f"Removed allowed redirect domain: {domain}")
