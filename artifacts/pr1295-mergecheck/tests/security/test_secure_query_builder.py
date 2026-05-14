"""
Tests for Secure Query Builder

Based on Simon Willison: PostHog vulnerability research (2025-12-18)
"""

from unittest.mock import MagicMock, Mock

import pytest

from src.database.secure_query_builder import SecureQueryBuilder


@pytest.fixture
def mock_connection():
    """Create mock database connection."""
    conn = Mock()
    cursor = MagicMock()
    cursor.description = [("id",), ("name",), ("email",)]
    cursor.fetchall.return_value = [(1, "Test User", "test@example.com")]
    cursor.rowcount = 1

    # Create a context manager mock
    cursor_context = MagicMock()
    cursor_context.__enter__ = MagicMock(return_value=cursor)
    cursor_context.__exit__ = MagicMock(return_value=None)
    conn.cursor.return_value = cursor_context

    return conn


class TestSecureQueryBuilder:
    """Test SQL injection prevention."""

    def test_execute_query_uses_parameters(self, mock_connection):
        """Queries should use parameterized execution."""
        builder = SecureQueryBuilder(mock_connection)

        results = builder.execute_query("SELECT * FROM users WHERE id = %s", (1,))

        # Verify parameterized query was used
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.assert_called_once_with(
            "SELECT * FROM users WHERE id = %s", (1,)
        )

        assert len(results) == 1
        assert results[0]["name"] == "Test User"

    def test_get_customer_safe(self, mock_connection):
        """get_customer should use parameterized query."""
        builder = SecureQueryBuilder(mock_connection)

        # Even with SQL injection attempt, should be safe
        malicious_id = "1' OR '1'='1"
        builder.get_customer(malicious_id)

        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.assert_called_once()

        # Verify parameter was passed separately (not interpolated)
        call_args = cursor.execute.call_args
        assert "%s" in call_args[0][0]  # Query has placeholder
        assert malicious_id in call_args[0][1]  # Parameter passed separately

    def test_search_reports_safe(self, mock_connection):
        """search_reports should use parameterized query with full-text search."""
        builder = SecureQueryBuilder(mock_connection)

        # SQL injection attempt
        malicious_search = "test'; DROP TABLE reports; --"
        builder.search_reports(malicious_search, "customer-123")

        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.assert_called_once()

        # Verify parameters passed separately
        call_args = cursor.execute.call_args
        assert malicious_search in call_args[0][1]  # Parameter, not interpolated

    def test_execute_write_commits(self, mock_connection):
        """Write operations should commit."""
        builder = SecureQueryBuilder(mock_connection)

        rows_affected = builder.execute_write(
            "UPDATE users SET name = %s WHERE id = %s", ("New Name", 1)
        )

        mock_connection.commit.assert_called_once()
        assert rows_affected == 1

    def test_execute_write_rollback_on_error(self, mock_connection):
        """Write operations should rollback on error."""
        builder = SecureQueryBuilder(mock_connection)

        # Make execute raise an error
        cursor = mock_connection.cursor.return_value.__enter__.return_value
        cursor.execute.side_effect = Exception("Database error")

        with pytest.raises(Exception):
            builder.execute_write(
                "UPDATE users SET name = %s WHERE id = %s", ("New Name", 1)
            )

        mock_connection.rollback.assert_called_once()

    def test_no_f_string_interpolation(self):
        """Verify code doesn't use f-strings for SQL (static check)."""
        import inspect

        source = inspect.getsource(SecureQueryBuilder)

        # Check that source doesn't contain f-string SQL patterns
        # This is a basic check - the audit_sql_injection.py script is more thorough
        assert 'f"SELECT' not in source
        assert 'f"INSERT' not in source
        assert 'f"UPDATE' not in source
        assert 'f"DELETE' not in source
