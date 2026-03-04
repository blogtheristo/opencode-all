"""
Secure Query Builder

Parameterized query builder to prevent SQL injection.

Based on:
- OWASP SQL Injection Prevention Cheat Sheet
- Simon Willison: PostHog vulnerability research (2025-12-18)
- https://simonwillison.net/2025/Dec/18/posthog-vulnerability/

PostHog Attack Chain:
1. SSRF (Server-Side Request Forgery)
2. ClickHouse SQL escaping 0day
3. PostgreSQL COPY FROM PROGRAM
4. Result: Remote Code Execution (RCE)

This module prevents SQL injection by using parameterized queries exclusively.

NEVER use:
- f-strings with SQL: f"SELECT * FROM users WHERE id = '{user_id}'"
- .format(): "SELECT * FROM users WHERE id = '{}'".format(user_id)
- % formatting: "SELECT * FROM users WHERE id = '%s'" % user_id

ALWAYS use:
- Parameterized queries: cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


class SecureQueryBuilder:
    """
    Parameterized query builder to prevent SQL injection.
    """

    def __init__(self, connection):
        """
        Initialize query builder.

        Args:
            connection: PostgreSQL DB-API connection
        """
        self.conn = connection

    def execute_query(
        self, query: str, params: tuple | None = None
    ) -> list[dict[str, Any]]:
        """
        Execute parameterized query safely.

        Args:
            query: SQL query with %s placeholders
            params: Tuple of parameters

        Returns:
            List of result rows as dictionaries
        """
        if params is None:
            params = ()

        try:
            with self.conn.cursor() as cursor:
                # ALWAYS use parameterized queries
                cursor.execute(query, params)

                if cursor.description:
                    columns = [desc[0] for desc in cursor.description]
                    return [
                        dict(zip(columns, row, strict=False))
                        for row in cursor.fetchall()
                    ]

                return []
        except Exception as e:
            logger.error(
                f"Query execution failed: {e}\nQuery: {query}\nParams: {params}"
            )
            raise

    def execute_write(self, query: str, params: tuple | None = None) -> int:
        """
        Execute write query (INSERT, UPDATE, DELETE).

        Args:
            query: SQL query with %s placeholders
            params: Tuple of parameters

        Returns:
            Number of affected rows
        """
        if params is None:
            params = ()

        try:
            with self.conn.cursor() as cursor:
                cursor.execute(query, params)
                self.conn.commit()
                return cursor.rowcount
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Write query failed: {e}\nQuery: {query}\nParams: {params}")
            raise

    # Safe query methods

    def get_customer(self, customer_id: str) -> dict[str, Any] | None:
        """
        Get customer by ID (SQL injection safe).

        Args:
            customer_id: Customer ID

        Returns:
            Customer record or None
        """
        query = "SELECT * FROM customers WHERE id = %s"
        results = self.execute_query(query, (customer_id,))
        return results[0] if results else None

    def search_reports(
        self, search_term: str, customer_id: str, limit: int = 100
    ) -> list[dict[str, Any]]:
        """
        Search reports with full-text search (SQL injection safe).

        Args:
            search_term: Search term
            customer_id: Customer ID
            limit: Maximum results

        Returns:
            List of matching reports
        """
        query = """
        SELECT r.id, r.title, r.created_at, r.content
        FROM reports r
        WHERE r.customer_id = %s
          AND to_tsvector('english', r.content) @@ plainto_tsquery('english', %s)
        ORDER BY r.created_at DESC
        LIMIT %s
        """
        return self.execute_query(query, (customer_id, search_term, limit))

    def get_projects_by_region(
        self, customer_id: str, region: str
    ) -> list[dict[str, Any]]:
        """
        Get projects by region (SQL injection safe).

        Args:
            customer_id: Customer ID
            region: Region name

        Returns:
            List of projects
        """
        query = """
        SELECT p.id, p.name, p.region, p.phase, p.spi, p.cpi
        FROM projects p
        WHERE p.customer_id = %s
          AND p.region = %s
        ORDER BY p.name
        """
        return self.execute_query(query, (customer_id, region))

    def insert_audit_log(
        self, event_type: str, user_id: str, details: dict[str, Any]
    ) -> int:
        """
        Insert audit log entry (SQL injection safe).

        Args:
            event_type: Type of event
            user_id: User ID
            details: Event details (JSON)

        Returns:
            ID of inserted row
        """
        query = """
        INSERT INTO audit_logs (event_type, user_id, details, created_at)
        VALUES (%s, %s, %s, NOW())
        RETURNING id
        """
        import json

        results = self.execute_query(query, (event_type, user_id, json.dumps(details)))
        return results[0]["id"] if results else None


# Example of DANGEROUS patterns to NEVER use
class DangerousQueryExamples:
    """
    ⚠️ NEVER USE THESE PATTERNS ⚠️

    These are examples of SQL injection vulnerabilities.
    Kept here for educational purposes only.
    """

    @staticmethod
    def vulnerable_get_customer_bad(cursor, customer_id: str):
        """
        ❌ VULNERABLE: f-string SQL injection
        This is an intentional example of vulnerable code for documentation purposes.
        """
        query = f"SELECT * FROM customers WHERE id = '{customer_id}'"  # noqa: S608
        cursor.execute(query)  # Attacker can inject: ' OR '1'='1

    @staticmethod
    def vulnerable_search_bad(cursor, search_term: str):
        """
        ❌ VULNERABLE: .format() SQL injection
        This is an intentional example of vulnerable code for documentation purposes.
        """
        query = f"SELECT * FROM reports WHERE content LIKE '%{search_term}%'"  # noqa: S608
        cursor.execute(query)  # Attacker can inject: %'; DROP TABLE reports; --

    @staticmethod
    def vulnerable_filter_bad(cursor, region: str):
        """
        ❌ VULNERABLE: % formatting SQL injection
        This is an intentional example of vulnerable code for documentation purposes.
        """
        query = f"SELECT * FROM projects WHERE region = '{region}'"  # noqa: S608
        cursor.execute(query)  # Attacker can inject: ' UNION SELECT * FROM users --
