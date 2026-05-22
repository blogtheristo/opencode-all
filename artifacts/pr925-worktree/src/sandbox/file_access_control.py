"""
File Access Control for MCP Agents

Enforce file access restrictions to prevent cross-agent privilege escalation.
Prevents agents from modifying each other's config files.

Based on:
- Simon Willison: "When agents free each other" (2025-09-24)
- https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/

Attack Scenario:
- Multiple coding agents operating on the same system
- Agent A tricks Agent B into modifying Agent A's configuration
- Agent A gains elevated privileges
- Result: System compromise

This module prevents agents from modifying protected system paths.
"""

import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class FileAccessControl:
    """
    Enforce file access restrictions for MCP agents.
    Prevents agents from modifying each other's config files.
    """

    # Protected paths (read-only for agents)
    PROTECTED_PATHS: set[Path] = {
        Path.home() / ".config" / "dws6",
        Path.home() / ".config" / "claude",
        Path.home() / ".config" / "cursor",
        Path.home() / ".gitconfig",
        Path.home() / ".ssh",
        Path.home() / ".aws",
        Path.home() / ".gcloud",
        Path("/etc"),  # System configuration
        Path("/usr"),  # System binaries
        Path("/bin"),
        Path("/sbin"),
    }

    # Additional protected patterns (glob-style)
    PROTECTED_PATTERNS = [
        "*.key",
        "*.pem",
        "*.p12",
        "*.pfx",
        "*_rsa",
        "*_dsa",
        "*_ecdsa",
        "*_ed25519",
        ".env",
        ".env.*",
        "secrets.*",
    ]

    @classmethod
    def is_write_allowed(cls, path: Path) -> bool:
        """
        Check if writing to path is allowed.

        Args:
            path: Path to check

        Returns:
            True if write is allowed, False otherwise
        """
        try:
            path = path.resolve()
        except Exception as e:
            logger.warning(f"Could not resolve path {path}: {e}")
            return False

        # Check protected paths
        for protected in cls.PROTECTED_PATHS:
            try:
                if path == protected or path.is_relative_to(protected):
                    return False
            except (ValueError, TypeError):
                # is_relative_to can raise ValueError on Windows
                if str(path).startswith(str(protected)):
                    return False

        # Check protected patterns
        return all(not path.match(pattern) for pattern in cls.PROTECTED_PATTERNS)

    @classmethod
    def validate_file_operation(cls, operation: str, path: Path) -> None:
        """
        Validate file operation before execution.
        Raises exception if operation is not allowed.

        Args:
            operation: Operation type ('read', 'write', 'delete', 'chmod')
            path: Path to operate on

        Raises:
            PermissionError: If operation is not allowed
        """
        if operation in [
            "write",
            "delete",
            "chmod",
            "chown",
        ] and not cls.is_write_allowed(path):
            logger.error(
                f"Cross-agent privilege escalation blocked! "
                f"Operation: {operation}, Path: {path}"
            )
            raise PermissionError(
                f"Cross-agent privilege escalation blocked!\n"
                f"Operation: {operation}\n"
                f"Path: {path}\n\n"
                f"Protected system configuration cannot be modified by agents.\n"
                f"This is a security protection against malicious prompt injection.\n\n"
                f"Reference: https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/"
            )

    @classmethod
    def add_protected_path(cls, path: Path) -> None:
        """
        Add a path to the protected list.

        Args:
            path: Path to protect
        """
        cls.PROTECTED_PATHS.add(path.resolve())
        logger.info(f"Added protected path: {path}")

    @classmethod
    def remove_protected_path(cls, path: Path) -> None:
        """
        Remove a path from the protected list.
        Use with caution!

        Args:
            path: Path to unprotect
        """
        cls.PROTECTED_PATHS.discard(path.resolve())
        logger.warning(f"Removed protected path: {path}")


def secure_file_wrapper(operation: str):
    """
    Decorator to wrap file operations with access control.

    Usage:
        @secure_file_wrapper('write')
        def write_file(path, content):
            with open(path, 'w') as f:
                f.write(content)
    """

    def decorator(func):
        def wrapper(path, *args, **kwargs):
            path_obj = Path(path)
            FileAccessControl.validate_file_operation(operation, path_obj)
            return func(path, *args, **kwargs)

        return wrapper

    return decorator
