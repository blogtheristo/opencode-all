"""
Tests for File Access Control

Based on Simon Willison: "When agents free each other" (2025-09-24)
"""

from pathlib import Path

import pytest

from src.sandbox.file_access_control import FileAccessControl


class TestFileAccessControl:
    """Test cross-agent privilege escalation protection."""

    def test_protected_config_paths_blocked(self):
        """Protected configuration paths should be blocked."""
        assert not FileAccessControl.is_write_allowed(
            Path.home() / ".config" / "dws6" / "settings.json"
        )
        assert not FileAccessControl.is_write_allowed(
            Path.home() / ".config" / "claude" / "config.json"
        )
        assert not FileAccessControl.is_write_allowed(Path.home() / ".gitconfig")

    def test_ssh_keys_blocked(self):
        """SSH keys should be protected."""
        assert not FileAccessControl.is_write_allowed(Path.home() / ".ssh" / "id_rsa")
        assert not FileAccessControl.is_write_allowed(
            Path.home() / ".ssh" / "authorized_keys"
        )

    def test_system_paths_blocked(self):
        """System paths should be blocked."""
        # Skip on Windows (no /etc or /usr paths)
        import platform

        if platform.system() != "Windows":
            assert not FileAccessControl.is_write_allowed(Path("/etc/passwd"))
            assert not FileAccessControl.is_write_allowed(Path("/usr/bin/python"))

    def test_workspace_files_allowed(self):
        """Workspace files should be allowed."""
        assert FileAccessControl.is_write_allowed(Path("src/main.py"))
        assert FileAccessControl.is_write_allowed(Path("README.md"))

    def test_key_files_blocked_by_pattern(self):
        """Key files should be blocked by pattern matching."""
        assert not FileAccessControl.is_write_allowed(Path("private.key"))
        assert not FileAccessControl.is_write_allowed(Path("cert.pem"))
        assert not FileAccessControl.is_write_allowed(Path("id_rsa"))

    def test_env_files_blocked(self):
        """.env files should be blocked."""
        assert not FileAccessControl.is_write_allowed(Path(".env"))
        assert not FileAccessControl.is_write_allowed(Path(".env.local"))
        assert not FileAccessControl.is_write_allowed(Path(".env.production"))

    def test_validate_write_operation_raises(self):
        """Validate should raise PermissionError for blocked paths."""
        with pytest.raises(PermissionError) as exc_info:
            FileAccessControl.validate_file_operation(
                "write", Path.home() / ".config" / "dws6" / "settings.json"
            )

        assert "privilege escalation" in str(exc_info.value).lower()

    def test_validate_delete_operation_raises(self):
        """Validate should raise PermissionError for delete on blocked paths."""
        with pytest.raises(PermissionError):
            FileAccessControl.validate_file_operation(
                "delete", Path.home() / ".ssh" / "id_rsa"
            )

    def test_validate_read_operation_allowed(self):
        """Read operations should be allowed on protected paths."""
        # Should not raise
        FileAccessControl.validate_file_operation(
            "read", Path.home() / ".config" / "dws6" / "settings.json"
        )

    def test_add_protected_path(self):
        """Can add custom protected paths."""
        custom_path = Path("/custom/protected")
        FileAccessControl.add_protected_path(custom_path)

        assert not FileAccessControl.is_write_allowed(custom_path / "file.txt")

        # Cleanup
        FileAccessControl.remove_protected_path(custom_path)
