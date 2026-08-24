#!/usr/bin/env python3
"""
SQL Injection Vulnerability Auditor

Static analysis to detect SQL injection vulnerabilities in Python code.

Based on:
- Simon Willison: PostHog vulnerability research (2025-12-18)
- OWASP SQL Injection Prevention

Detects:
- f-strings in SQL queries
- .format() in SQL queries
- % formatting in SQL queries
- String concatenation in SQL queries

Usage:
    python scripts/security/audit_sql_injection.py [directory]
"""

import argparse
import ast
import os
import sys
from pathlib import Path


class SQLInjectionAuditor(ast.NodeVisitor):
    """
    Static analysis to detect SQL injection vulnerabilities.
    """

    def __init__(self, filepath: str):
        self.filepath = filepath
        self.vulnerabilities: list[dict] = []

    def visit_Call(self, node):
        """Check for cursor.execute() with dangerous patterns."""
        # Check for cursor.execute() or connection.execute()
        if hasattr(node.func, "attr") and node.func.attr == "execute" and node.args:
            arg = node.args[0]

            # Detect f-strings
            if isinstance(arg, ast.JoinedStr):
                self.vulnerabilities.append(
                    {
                        "line": node.lineno,
                        "type": "f-string in SQL query",
                        "severity": "CRITICAL",
                        "description": "SQL query uses f-string, vulnerable to injection",
                    }
                )

            # Detect .format()
            if (
                isinstance(arg, ast.Call)
                and hasattr(arg.func, "attr")
                and arg.func.attr == "format"
            ):
                self.vulnerabilities.append(
                    {
                        "line": node.lineno,
                        "type": ".format() in SQL query",
                        "severity": "CRITICAL",
                        "description": "SQL query uses .format(), vulnerable to injection",
                    }
                )

            # Detect % formatting
            if isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Mod):
                self.vulnerabilities.append(
                    {
                        "line": node.lineno,
                        "type": "% formatting in SQL query",
                        "severity": "CRITICAL",
                        "description": "SQL query uses % formatting, vulnerable to injection",
                    }
                )

            # Detect string concatenation
            if isinstance(arg, ast.BinOp) and isinstance(arg.op, ast.Add):
                self.vulnerabilities.append(
                    {
                        "line": node.lineno,
                        "type": "String concatenation in SQL query",
                        "severity": "HIGH",
                        "description": "SQL query uses string concatenation, possibly vulnerable",
                    }
                )

        self.generic_visit(node)


def audit_file(filepath: Path) -> list[dict]:
    """Audit a single Python file for SQL injection vulnerabilities."""
    try:
        with open(filepath, encoding="utf-8") as f:
            tree = ast.parse(f.read(), str(filepath))
            auditor = SQLInjectionAuditor(str(filepath))
            auditor.visit(tree)
            return auditor.vulnerabilities
    except SyntaxError as e:
        print(f"⚠️  Syntax error in {filepath}: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"⚠️  Error auditing {filepath}: {e}", file=sys.stderr)
        return []


def audit_directory(directory: Path) -> dict[str, list[dict]]:
    """Audit all Python files in a directory for SQL injection vulnerabilities."""
    results = {}

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                filepath = Path(root) / file
                vulnerabilities = audit_file(filepath)

                if vulnerabilities:
                    results[str(filepath)] = vulnerabilities

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Audit Python code for SQL injection vulnerabilities"
    )
    parser.add_argument(
        "directory", nargs="?", default="src", help="Directory to audit (default: src)"
    )
    parser.add_argument("--json", action="store_true", help="Output results as JSON")

    args = parser.parse_args()
    directory = Path(args.directory)

    if not directory.exists():
        print(f"❌ Directory not found: {directory}", file=sys.stderr)
        sys.exit(1)

    print(f"🔍 Auditing {directory} for SQL injection vulnerabilities...\n")

    results = audit_directory(directory)

    if not results:
        print("✅ No SQL injection vulnerabilities found!")
        sys.exit(0)

    if args.json:
        import json

        print(json.dumps(results, indent=2))
    else:
        total_vulns = 0
        for filepath, vulnerabilities in results.items():
            print(f"\n⚠️  {filepath}")
            for vuln in vulnerabilities:
                total_vulns += 1
                print(f"  Line {vuln['line']}: {vuln['type']} ({vuln['severity']})")
                print(f"    {vuln['description']}")

        print(
            f"\n❌ Found {total_vulns} SQL injection vulnerabilities in {len(results)} files"
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
