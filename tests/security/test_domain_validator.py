"""
Tests for Domain Validator

Based on Simon Willison: "The Lethal Trifecta" (2025-06-16)
"""

import pytest

from src.mcp.security.domain_validator import DomainValidator, SecurityException


class TestDomainValidator:
    """Test domain validation for preventing data exfiltration."""

    def test_infrastructure_domains_allowed(self):
        """Tier 1 domains should always be allowed."""
        assert DomainValidator.validate_url("https://api.anthropic.com/v1/messages")[0]
        assert DomainValidator.validate_url(
            "https://api.groq.com/openai/v1/chat/completions"
        )[0]
        assert DomainValidator.validate_url(
            "https://storage.googleapis.com/bucket/file"
        )[0]
        assert DomainValidator.validate_url("https://dws10.com/api/data")[0]

    def test_regulatory_domains_allowed(self):
        """Tier 2 EU regulatory domains should be allowed."""
        assert DomainValidator.validate_url(
            "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114"
        )[0]
        assert DomainValidator.validate_url("https://ec.europa.eu/info/index_en")[0]
        assert DomainValidator.validate_url("https://eib.org/en/index.htm")[0]

    def test_blacklist_blocks_webhook_site(self):
        """Known exfiltration vectors should be blocked."""
        is_valid, reason = DomainValidator.validate_url("https://webhook.site/abc123")
        assert not is_valid
        assert "blacklisted" in reason.lower()
        assert "exfiltration" in reason.lower()

    def test_blacklist_blocks_requestbin(self):
        """RequestBin should be blocked."""
        is_valid, reason = DomainValidator.validate_url(
            "https://requestbin.com/r/abc123"
        )
        assert not is_valid
        assert "blacklisted" in reason.lower()

    def test_wildcard_blacklist(self):
        """Wildcard blacklist patterns should work."""
        assert not DomainValidator.validate_url("https://test.ngrok-free.app")[0]
        assert not DomainValidator.validate_url("https://abc.ngrok-free.app")[0]
        assert not DomainValidator.validate_url("https://xyz.ngrok-free.app/webhook")[0]

    def test_unknown_domain_blocked(self):
        """Unknown domains should be blocked by default."""
        is_valid, reason = DomainValidator.validate_url("https://evil.com/steal-data")
        assert not is_valid
        assert "not in allow-list" in reason

    def test_customer_domain_requires_approval(self):
        """Customer-specific domains require explicit approval."""
        customer_id = "uber-finland"
        domain = "internal.uber.com"

        # Before approval: blocked
        assert not DomainValidator.validate_url(f"https://{domain}/api")[0]

        # After approval: allowed
        DomainValidator.add_customer_domain(customer_id, domain, "risto@lifetime.fi")
        assert DomainValidator.validate_url(f"https://{domain}/api", customer_id)[0]

        # Cleanup
        DomainValidator.remove_customer_domain(domain)

    def test_invalid_url_rejected(self):
        """Invalid URLs should be rejected."""
        is_valid, reason = DomainValidator.validate_url("not-a-url")
        assert not is_valid

    def test_url_with_port(self):
        """URLs with ports should work."""
        # Add localhost for testing
        DomainValidator.add_customer_domain("test", "localhost", "risto@lifetime.fi")
        assert DomainValidator.validate_url("https://localhost:8080/api", "test")[0]
        DomainValidator.remove_customer_domain("localhost")

    def test_blacklisted_domain_cannot_be_added(self):
        """Blacklisted domains cannot be added to customer allow-list."""
        with pytest.raises(SecurityException):
            DomainValidator.add_customer_domain(
                "test", "webhook.site", "risto@lifetime.fi"
            )
