"""
Tests for Modern CSRF Protection

Based on Simon Willison: "A modern approach to preventing CSRF in Go" (2025-10-15)
"""

import pytest
from flask import Flask

from src.web.middleware.csrf_protection_OLD import csrf_protection_middleware


@pytest.fixture
def app():
    """Create test Flask app with CSRF protection."""
    app = Flask(__name__)
    csrf_protection_middleware(app)

    @app.route("/api/data", methods=["GET", "POST"])
    def api_data():
        return {"status": "ok"}

    return app.test_client()


class TestCSRFProtection:
    """Test modern CSRF protection using Sec-Fetch-Site header."""

    def test_get_request_allowed(self, app):
        """GET requests should always be allowed (safe method)."""
        response = app.get("/api/data")
        assert response.status_code == 200

    def test_same_origin_request_allowed(self, app):
        """Requests with Sec-Fetch-Site: same-origin should be allowed."""
        response = app.post("/api/data", headers={"Sec-Fetch-Site": "same-origin"})
        assert response.status_code == 200

    def test_none_fetch_site_allowed(self, app):
        """Direct navigation (Sec-Fetch-Site: none) should be allowed."""
        response = app.post("/api/data", headers={"Sec-Fetch-Site": "none"})
        assert response.status_code == 200

    def test_cross_site_request_blocked(self, app):
        """Requests with Sec-Fetch-Site: cross-site should be blocked."""
        response = app.post("/api/data", headers={"Sec-Fetch-Site": "cross-site"})
        assert response.status_code == 403
        # Check for either "CSRF" or "Cross-Site Request Forgery" in response
        assert (
            b"CSRF" in response.data or b"Cross-Site Request Forgery" in response.data
        )

    def test_legacy_browser_origin_check(self, app):
        """Legacy browsers without Sec-Fetch-Site fall back to Origin check."""
        response = app.post(
            "/api/data", headers={"Origin": "https://dws10.com", "Host": "dws10.com"}
        )
        assert response.status_code == 200

    def test_legacy_browser_origin_mismatch(self, app):
        """Mismatched Origin/Host should be blocked."""
        response = app.post(
            "/api/data", headers={"Origin": "https://evil.com", "Host": "dws10.com"}
        )
        assert response.status_code == 403

    def test_referer_fallback(self, app):
        """Referer header can be used as last resort."""
        response = app.post(
            "/api/data",
            headers={"Referer": "https://dws10.com/page", "Host": "dws10.com"},
        )
        assert response.status_code == 200

    def test_referer_mismatch_blocked(self, app):
        """Mismatched Referer should be blocked."""
        response = app.post(
            "/api/data",
            headers={"Referer": "https://evil.com/page", "Host": "dws10.com"},
        )
        assert response.status_code == 403

    def test_no_csrf_headers_blocked(self, app):
        """Request without any CSRF protection headers should be blocked."""
        response = app.post("/api/data")
        assert response.status_code == 403
