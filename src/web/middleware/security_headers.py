"""
Security Headers Middleware

Adds security headers to all HTTP responses.

Headers:
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Content-Security-Policy (CSP)
"""

import logging

from flask import Flask

logger = logging.getLogger(__name__)


def security_headers_middleware(app: Flask):
    """
    Add security headers to all responses.

    Usage:
        from flask import Flask
        from src.web.middleware import security_headers_middleware

        app = Flask(__name__)
        security_headers_middleware(app)
    """

    @app.after_request
    def add_security_headers(response):
        # HSTS (HTTP Strict Transport Security)
        # Force HTTPS for 2 years, include subdomains, allow preload
        response.headers["Strict-Transport-Security"] = (
            "max-age=63072000; includeSubDomains; preload"
        )

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "SAMEORIGIN"

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # XSS protection (legacy, but still useful)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.anthropic.com https://api.groq.com; "
            "frame-ancestors 'none'"
        )
        response.headers["Content-Security-Policy"] = csp

        return response

    logger.info("Security headers middleware initialized")
