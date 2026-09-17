"""
Tests for Redirect Validator

Based on Simon Willison: Datasette open redirect fix (2025-11-05)
"""

from src.web.utils.redirect_validator_OLD import RedirectValidator


class TestRedirectValidator:
    """Test open redirect vulnerability prevention."""

    def test_relative_url_allowed(self):
        """Relative URLs should be allowed (same-origin)."""
        assert RedirectValidator.is_safe_redirect("/dashboard")
        assert RedirectValidator.is_safe_redirect("/api/data")
        assert RedirectValidator.is_safe_redirect("/path/to/page")

    def test_protocol_relative_url_blocked(self):
        """Protocol-relative URLs should be blocked (//evil.com)."""
        assert not RedirectValidator.is_safe_redirect("//evil.com")
        assert not RedirectValidator.is_safe_redirect("//evil.com/phishing")

    def test_allowed_domain_redirect(self):
        """Redirects to allowed domains should be permitted."""
        assert RedirectValidator.is_safe_redirect("https://dws10.com/page")
        assert RedirectValidator.is_safe_redirect("https://onelifetime.world/")

    def test_unknown_domain_blocked(self):
        """Redirects to unknown domains should be blocked."""
        assert not RedirectValidator.is_safe_redirect("https://evil.com/phishing")
        assert not RedirectValidator.is_safe_redirect("http://attacker.com/steal")

    def test_javascript_scheme_blocked(self):
        """JavaScript URLs should be blocked."""
        assert not RedirectValidator.is_safe_redirect("javascript:alert('XSS')")

    def test_data_scheme_blocked(self):
        """Data URLs should be blocked."""
        assert not RedirectValidator.is_safe_redirect(
            "data:text/html,<script>alert('XSS')</script>"
        )

    def test_sanitize_returns_safe_url(self):
        """Sanitize should return URL if safe."""
        url = "/dashboard"
        assert RedirectValidator.sanitize_redirect(url) == url

    def test_sanitize_returns_default_if_unsafe(self):
        """Sanitize should return default if URL is unsafe."""
        url = "https://evil.com/phishing"
        default = "/home"
        assert RedirectValidator.sanitize_redirect(url, default) == default

    def test_sanitize_handles_none(self):
        """Sanitize should handle None gracefully."""
        assert RedirectValidator.sanitize_redirect(None) == "/"
        assert RedirectValidator.sanitize_redirect(None, "/custom") == "/custom"

    def test_add_allowed_domain(self):
        """Can add domains to allow-list."""
        RedirectValidator.add_allowed_domain("partner.com")
        assert RedirectValidator.is_safe_redirect("https://partner.com/page")

        # Cleanup
        RedirectValidator.remove_allowed_domain("partner.com")

    def test_case_insensitive_domain_check(self):
        """Domain checking should be case-insensitive."""
        assert RedirectValidator.is_safe_redirect("https://DWS10.COM/page")
        assert RedirectValidator.is_safe_redirect("https://Dws10.Com/page")
