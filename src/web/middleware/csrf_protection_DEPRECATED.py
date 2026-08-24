"""
Modern CSRF Protection

CSRF protection using Sec-Fetch-Site header (94.18% browser support).
Falls back to Origin/Host comparison for legacy browsers.

Based on:
- Go 1.25 http.CrossOriginProtection middleware
- Simon Willison: "A modern approach to preventing CSRF in Go" (2025-10-15)
- https://simonwillison.net/2025/Oct/15/csrf-in-go/
- Alex Edwards: "Have we finally reached the point where CSRF attacks can be
  prevented without relying on a token-based check?"

Key Innovation:
Modern browsers send Sec-Fetch-Site header indicating request origin.
This eliminates need for hidden CSRF tokens in most cases.

Browser Support:
- Sec-Fetch-Site: 94.18% (Chrome 76+, Firefox 90+, Safari 15.5+)
- Origin header: 98%+ (fallback for legacy browsers)
"""

import logging
from urllib.parse import urlparse

from flask import abort, request

logger = logging.getLogger(__name__)


class ModernCSRFProtection:
    """
    CSRF protection using Sec-Fetch-Site header.
    Falls back to Origin/Host comparison for legacy browsers.
    """

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS", "TRACE"}

    @classmethod
    def validate_request(cls) -> str | None:
        """
        Validate CSRF protection.

        Returns:
            Error message if invalid, None if valid
        """
        # Skip CSRF check for safe methods
        if request.method in cls.SAFE_METHODS:
            return None

        # TIER 1: Sec-Fetch-Site header (modern browsers)
        sec_fetch_site = request.headers.get("Sec-Fetch-Site")
        if sec_fetch_site:
            if sec_fetch_site in ["same-origin", "none"]:
                return None  # ✅ Safe: same-origin or direct navigation
            return f"CSRF: Sec-Fetch-Site={sec_fetch_site} (cross-site request)"

        # TIER 2: Origin/Host comparison (legacy browsers)
        origin = request.headers.get("Origin")
        host = request.headers.get("Host")

        if origin and host:
            # Extract domain from origin (includes scheme)
            origin_domain = urlparse(origin).netloc

            if origin_domain != host:
                return f"CSRF: Origin={origin} != Host={host}"

            return None  # ✅ Safe: origin matches host

        # TIER 3: Referer check (last resort)
        referer = request.headers.get("Referer")
        if referer and host:
            referer_domain = urlparse(referer).netloc
            if referer_domain != host:
                return f"CSRF: Referer={referer} != Host={host}"
            return None

        # No CSRF protection available - reject
        return "CSRF: Missing Sec-Fetch-Site, Origin, and Referer headers"


def csrf_protection_middleware(app):
    """
    Flask middleware for CSRF protection.

    Usage:
        from flask import Flask
        from src.web.middleware import csrf_protection_middleware

        app = Flask(__name__)
        csrf_protection_middleware(app)
    """

    @app.before_request
    def check_csrf():
        error = ModernCSRFProtection.validate_request()
        if error:
            logger.warning(
                f"CSRF attempt blocked: {error}\n"
                f"IP: {request.remote_addr}\n"
                f"User-Agent: {request.headers.get('User-Agent')}\n"
                f"Path: {request.path}"
            )
            abort(403, description="Cross-Site Request Forgery detected")
