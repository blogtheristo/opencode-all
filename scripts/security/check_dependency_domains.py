#!/usr/bin/env python3
"""
Dependency Domain Checker

Check if dependencies have expired or broken domains.

Based on:
- Simon Willison: Supply chain security research (2025-10-10)
- Filippo Valsorda: 18 incidents from the past year

Attack Vectors:
- Expired domains in package metadata
- Maintainer email domains expired
- Homepage/documentation domains hijacked

Usage:
    python scripts/security/check_dependency_domains.py
"""

import sys
import time

import requests


def load_requirements(file_path: str = "requirements.txt") -> list[str]:
    """Load package names from requirements.txt."""
    try:
        with open(file_path) as f:
            packages = []
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    # Extract package name (before ==, >=, etc.)
                    pkg_name = line.split("==")[0].split(">=")[0].split("<=")[0].strip()
                    packages.append(pkg_name)
            return packages
    except FileNotFoundError:
        print(f"❌ {file_path} not found", file=sys.stderr)
        return []


def check_package_domains(package: str) -> dict:
    """Check PyPI package for broken domains."""
    try:
        response = requests.get(f"https://pypi.org/pypi/{package}/json", timeout=10)

        if response.status_code == 404:
            return {
                "package": package,
                "status": "NOT_FOUND",
                "issues": ["Package not found on PyPI"],
            }

        response.raise_for_status()
        metadata = response.json()

        info = metadata.get("info", {})
        issues = []

        # Check project URLs
        project_urls = info.get("project_urls", {})
        for url_type, url in project_urls.items():
            if url:
                try:
                    url_response = requests.head(url, allow_redirects=True, timeout=5)
                    if url_response.status_code >= 400:
                        issues.append(
                            f"{url_type} URL is broken: {url} (HTTP {url_response.status_code})"
                        )
                except requests.RequestException as e:
                    issues.append(f"{url_type} URL unreachable: {url} ({e})")

        # Check homepage
        homepage = info.get("home_page")
        if homepage:
            try:
                homepage_response = requests.head(
                    homepage, allow_redirects=True, timeout=5
                )
                if homepage_response.status_code >= 400:
                    issues.append(
                        f"Homepage is broken: {homepage} (HTTP {homepage_response.status_code})"
                    )
            except requests.RequestException as e:
                issues.append(f"Homepage unreachable: {homepage} ({e})")

        return {
            "package": package,
            "status": "OK" if not issues else "WARNING",
            "issues": issues,
        }

    except Exception as e:
        return {
            "package": package,
            "status": "ERROR",
            "issues": [f"Failed to check package: {e}"],
        }


def main():
    print("🔍 Checking dependency domains for security issues...\n")

    packages = load_requirements()

    if not packages:
        print("❌ No packages found to check", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(packages)} packages to check\n")

    issues_found = False

    for i, package in enumerate(packages, 1):
        print(f"[{i}/{len(packages)}] Checking {package}...", end=" ")
        result = check_package_domains(package)

        if result["status"] == "OK":
            print("✅")
        elif result["status"] == "WARNING":
            print("⚠️")
            issues_found = True
            for issue in result["issues"]:
                print(f"  - {issue}")
        elif result["status"] == "ERROR":
            print("❌")
            issues_found = True
            for issue in result["issues"]:
                print(f"  - {issue}")
        elif result["status"] == "NOT_FOUND":
            print("❌ NOT FOUND")
            issues_found = True

        # Rate limiting
        time.sleep(0.5)

    print()

    if issues_found:
        print("⚠️  Some dependencies have domain issues - review above")
        sys.exit(1)
    else:
        print("✅ All dependency domains are healthy")
        sys.exit(0)


if __name__ == "__main__":
    main()
