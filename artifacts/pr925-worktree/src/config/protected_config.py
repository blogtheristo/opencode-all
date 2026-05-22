"""
Protected Configuration System

Immutable configuration system to prevent cross-agent tampering.
Config files are read-only to prevent privilege escalation attacks.

Based on:
- Simon Willison: "Cross-Agent Privilege Escalation" (2025-09-24)
- https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/
- Johann Rehberger's self-escalation research

Attack Scenario:
1. Customer uses Claude Code for development
2. Malicious dependency introduces prompt injection
3. Claude Code modifies DWS IQ 6 configuration
4. DWS IQ 6 now runs with elevated privileges
5. Result: Full system compromise

This module prevents step 3 by making config files read-only.
"""

import json
import logging
import os
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class ConfigurationError(Exception):
    """Raised when configuration operations fail."""


class ProtectedConfiguration:
    """
    Immutable configuration system.
    Config files are read-only to prevent cross-agent tampering.
    """

    CONFIG_DIR = Path.home() / ".config" / "dws6"
    CONFIG_FILE = CONFIG_DIR / "settings.json"

    # Config file permissions (read-only for user, no write)
    CONFIG_PERMISSIONS = 0o444  # r--r--r--

    # Authorized emails for config modification
    AUTHORIZED_EMAILS = ["risto@lifetime.fi", "security@dws10.com"]

    @classmethod
    def initialize(cls) -> None:
        """
        Create config directory with restricted permissions.
        Called once during installation.
        """
        try:
            cls.CONFIG_DIR.mkdir(parents=True, exist_ok=True, mode=0o755)

            if not cls.CONFIG_FILE.exists():
                default_config = {
                    "version": "1.0.0",
                    "readonly": True,
                    "security": {
                        "domain_validation_enabled": True,
                        "image_sanitization_enabled": True,
                        "mcp_tool_approval_required": True,
                        "max_tool_uses_per_session": 100,
                        "csrf_protection_enabled": True,
                        "sql_injection_protection_enabled": True,
                    },
                    "mcp": {
                        "oauth_dcr_enabled": True,
                        "tool_colors_enforcement": True,
                    },
                    "logging": {
                        "security_events": True,
                        "audit_trail": True,
                        "log_level": "INFO",
                    },
                }

                # Write with restricted permissions
                with open(cls.CONFIG_FILE, "w") as f:
                    json.dump(default_config, f, indent=2)

                # Make read-only
                os.chmod(cls.CONFIG_FILE, cls.CONFIG_PERMISSIONS)

                logger.info(f"Initialized protected configuration: {cls.CONFIG_FILE}")
            else:
                # Ensure existing config is read-only
                os.chmod(cls.CONFIG_FILE, cls.CONFIG_PERMISSIONS)
                logger.info(f"Verified protected configuration: {cls.CONFIG_FILE}")

        except Exception as e:
            logger.error(f"Failed to initialize configuration: {e}")
            raise ConfigurationError(f"Configuration initialization failed: {e}")

    @classmethod
    def load(cls) -> dict[str, Any]:
        """
        Load configuration (read-only).

        Returns:
            Configuration dictionary
        """
        if not cls.CONFIG_FILE.exists():
            raise ConfigurationError(
                f"Configuration file not found: {cls.CONFIG_FILE}\n"
                f"Run: python -m dws6.config.protected_config init"
            )

        try:
            with open(cls.CONFIG_FILE) as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load configuration: {e}")
            raise ConfigurationError(f"Configuration load failed: {e}")

    @classmethod
    def update(cls, key: str, value: Any, authorized_by: str) -> None:
        """
        Update configuration (requires explicit authorization).
        Only security team can modify config.

        Args:
            key: Config key (dot-notation, e.g., "security.domain_validation_enabled")
            value: New value
            authorized_by: Email of person authorizing change

        Raises:
            PermissionError: If unauthorized
            ConfigurationError: If update fails
        """
        # Verify authorization
        if authorized_by not in cls.AUTHORIZED_EMAILS:
            logger.error(
                f"Unauthorized config modification attempt by: {authorized_by}"
            )
            raise PermissionError(
                f"Unauthorized config modification attempt by: {authorized_by}\n"
                f"Only security team can modify configuration.\n"
                f"Authorized emails: {', '.join(cls.AUTHORIZED_EMAILS)}\n"
                f"Reference: https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/"
            )

        # Load current config
        config = cls.load()

        # Make writable temporarily
        os.chmod(cls.CONFIG_FILE, 0o644)

        try:
            # Update nested key
            keys = key.split(".")
            current = config
            for k in keys[:-1]:
                if k not in current:
                    current[k] = {}
                current = current[k]

            old_value = current.get(keys[-1])
            current[keys[-1]] = value

            # Write updated config
            with open(cls.CONFIG_FILE, "w") as f:
                json.dump(config, f, indent=2)

            # Log authorization
            logger.info(
                f"Configuration updated: key={key}, "
                f"old_value={old_value}, new_value={value}, "
                f"authorized_by={authorized_by}"
            )

        except Exception as e:
            logger.error(f"Configuration update failed: {e}")
            raise ConfigurationError(f"Configuration update failed: {e}")
        finally:
            # Make read-only again
            os.chmod(cls.CONFIG_FILE, cls.CONFIG_PERMISSIONS)

    @classmethod
    def get(cls, key: str, default: Any = None) -> Any:
        """
        Get configuration value by key.

        Args:
            key: Config key (dot-notation)
            default: Default value if key not found

        Returns:
            Configuration value
        """
        config = cls.load()

        keys = key.split(".")
        current = config

        try:
            for k in keys:
                current = current[k]
            return current
        except (KeyError, TypeError):
            return default


# CLI interface for initialization
if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "init":
        ProtectedConfiguration.initialize()
        print("✅ Protected configuration initialized successfully")
    else:
        print("Usage: python -m src.config.protected_config init")
