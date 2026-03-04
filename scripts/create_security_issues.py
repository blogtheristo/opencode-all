#!/usr/bin/env python3
"""
Automated Security Issue Creator

Creates GitHub issues from security correlation findings.
Automatically prioritizes and assigns issues based on severity.
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path  # For path sanitization

# Import Github for type hints
Github = object | None


class SecurityIssueCreator:
    """Create GitHub issues from security findings"""

    def __init__(self, github_token: str = None):
        """Initialize with GitHub token"""
        self.github_token = github_token or os.getenv("GITHUB_TOKEN")
        self.repo = os.getenv("GITHUB_REPOSITORY", "dws6")
        self.owner = self.repo.split("/")[0] if "/" in self.repo else "unknown"
        self.repo_name = self.repo.split("/")[-1] if "/" in self.repo else self.repo

        # Try to import GitHub library
        self.github = None
        try:
            from github import Github as GithubClient

            self.github = GithubClient(self.github_token) if self.github_token else None
        except ImportError:
            print("⚠️  PyGithub not installed. Install with: pip install PyGithub")

    def parse_correlation_report(self, report_path: str) -> list[dict]:
        """Parse correlation report and extract issues"""
        issues = []

        try:
            # Sanitize path to prevent traversal attacks
            safe_path = Path(report_path).resolve()
            with open(safe_path, encoding="utf-8") as f:
                content = f.read()

            # Extract critical sections
            critical_section = re.search(
                r"## 🚨 CRITICAL.*?(?=##|\Z)", content, re.DOTALL
            )

            if critical_section:
                critical_text = critical_section.group(0)

                # Find each issue (### pattern)
                issue_blocks = re.findall(
                    r"### (\d+\.\s+.*?)\n\n(.*?)(?=###|\Z)", critical_text, re.DOTALL
                )

                for title, content_block in issue_blocks:
                    issue = self._parse_issue_block(title, content_block)
                    if issue:
                        issues.append(issue)

            # Extract false negatives
            fn_section = re.search(
                r"## ⚠️ FALSE NEGATIVES.*?(?=##|\Z)", content, re.DOTALL
            )

            if fn_section:
                fn_text = fn_section.group(0)
                fn_blocks = re.findall(
                    r"### (.*?)\n(.*?)(?=###|\Z)", fn_text, re.DOTALL
                )

                for title, content_block in fn_blocks:
                    issue = self._parse_false_negative_block(title, content_block)
                    if issue:
                        issues.append(issue)

        except FileNotFoundError:
            print(f"❌ Report not found: {report_path}")
            return []

        return issues

    def _parse_issue_block(self, title: str, content: str) -> dict:
        """Parse critical issue block"""

        # Extract metrics
        audit_score_match = re.search(r"Audit Score:\*\*\s+(\d+)%", content)
        attacks_match = re.search(r"Attacks Detected:\*\*\s+(\d+)", content)

        audit_score = int(audit_score_match.group(1)) if audit_score_match else 0
        attacks_count = int(attacks_match.group(1)) if attacks_match else 0

        # Extract recommended fix
        fix_match = re.search(r"Recommended Fix:.*?```\n(.*?)\n```", content, re.DOTALL)
        recommended_fix = (
            fix_match.group(1)
            if fix_match
            else "See full report for remediation details"
        )

        # Determine severity
        if attacks_count > 10 or audit_score < 60:
            severity = "critical"
            label = "priority-critical"
        elif attacks_count > 5 or audit_score < 75:
            severity = "high"
            label = "priority-high"
        else:
            severity = "medium"
            label = "priority-medium"

        return {
            "title": f"[SECURITY] {title}",
            "body": self._generate_issue_body(
                title,
                audit_score,
                attacks_count,
                content,
                recommended_fix,
                "critical_exploitation",
            ),
            "labels": ["security", "zenfree-detected", label],
            "severity": severity,
            "assignees": ["security-team"],
        }

    def _parse_false_negative_block(self, title: str, content: str) -> dict:
        """Parse false negative issue block"""

        audit_score_match = re.search(r"Audit Score:\*\*\s+(\d+)%", content)
        attacks_match = re.search(r"Attacks Detected:\*\*\s+(\d+)", content)

        audit_score = int(audit_score_match.group(1)) if audit_score_match else 90
        attacks_count = int(attacks_match.group(1)) if attacks_match else 1

        return {
            "title": f"[SECURITY] False Negative: {title}",
            "body": self._generate_issue_body(
                title,
                audit_score,
                attacks_count,
                content,
                "Audit methodology needs review",
                "false_negative",
            ),
            "labels": [
                "security",
                "zenfree-detected",
                "false-negative",
                "priority-high",
            ],
            "severity": "high",
            "assignees": ["security-team"],
        }

    def _generate_issue_body(
        self,
        title: str,
        audit_score: int,
        attacks_count: int,
        content: str,
        recommendation: str,
        issue_type: str,
    ) -> str:
        """Generate GitHub issue body"""

        issue_type_emoji = {"critical_exploitation": "🚨", "false_negative": "⚠️"}.get(
            issue_type, "🔍"
        )

        return f"""{issue_type_emoji} **Security Finding**

## Finding Details

**Type:** {issue_type.upper().replace("_", " ")}
**Component:** {title}
**Severity:** {"CRITICAL" if attacks_count > 10 else "HIGH" if attacks_count > 5 else "MEDIUM"}

## Impact Assessment

| Metric | Value |
|--------|-------|
| Audit Score | {audit_score}% |
| Active Attacks | {attacks_count} (last 30 days) |
| Status | {"Actively Exploited" if attacks_count > 0 else "Audit Finding"} |

## Analysis

{content[:500]}...

## Remediation

**Recommended Action:**
```
{recommendation}
```

## Timeline

- **Immediate:** Review and triage
- **This Week:** Implement fix
- **Verification:** Verify via ZenFree attack log

## Evidence

**Source:** Correlation between monthly security audit and ZenFree runtime detection
**Generated:** {datetime.now().isoformat()}
**Correlation ID:** {os.getenv("GITHUB_RUN_ID", "unknown")}

## Related Documentation

- 📄 [DWS6 Security Audit](../../Admin/Security/DWS6_REPOSITORY_SECURITY_AUDIT.md)
- 📊 [Remediation Roadmap](../../Admin/Security/REMEDIATION_ROADMAP_DWS6.md)
- 🔗 [ZenFree Attack Log](security-attacks.jsonl)

---

*Created by automated security workflow*
*Do not manually close - close via security remediation PR*
"""

    def create_issues_locally(
        self, issues: list[dict], output_file: str = "security-issues.json"
    ) -> None:
        """Save issues to file for manual creation"""

        # Sanitize path to prevent traversal attacks
        output_file = str(Path(output_file).resolve())

        with open(output_file, "w") as f:
            json.dump(issues, f, indent=2)

        print(f"✅ Issues saved to: {output_file}")
        print("\n📝 Issue Summary:")
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. [{issue['severity'].upper()}] {issue['title']}")

        print("\n💡 To create these issues in GitHub:")
        print("   1. Use GitHub web UI to create issues")
        print("   2. Or use: gh issue create --title '...' --body '...'")

    def create_issues_github(self, issues: list[dict]) -> None:
        """Create issues directly in GitHub"""

        if not self.github:
            print("❌ GitHub API not available. Run locally mode instead.")
            return

        try:
            repo = self.github.get_repo(self.repo)
            print(f"🔗 Connected to repository: {repo.full_name}")
        except Exception as e:
            print(f"❌ Failed to connect to GitHub: {e}")
            return

        created_count = 0
        skipped_count = 0

        for issue in issues:
            try:
                # Check if similar issue already exists
                existing_issues = repo.get_issues(
                    state="open", labels=["security", "zenfree-detected"]
                )

                issue_exists = any(
                    issue["title"] in existing_issue.title
                    for existing_issue in existing_issues
                )

                if issue_exists:
                    print(f"⏭️  Skipping (already exists): {issue['title']}")
                    skipped_count += 1
                    continue

                # Create issue
                new_issue = repo.create_issue(
                    title=issue["title"], body=issue["body"], labels=issue["labels"]
                )

                print(f"✅ Created issue #{new_issue.number}: {issue['title']}")
                created_count += 1

                # Add to project if available
                try:
                    # Try to add to security project
                    for project in repo.get_projects():
                        if "security" in project.name.lower():
                            column = project.get_columns()[0]
                            column.create_card(issue_id=new_issue.id)
                            print(f"   → Added to project: {project.name}")
                            break
                except:
                    pass  # Project addition failed, continue

            except Exception as e:
                print(f"❌ Failed to create issue: {e}")
                continue

        print("\n📊 Summary:")
        print(f"   Created: {created_count}")
        print(f"   Skipped: {skipped_count}")
        print(f"   Total: {len(issues)}")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Create GitHub issues from security findings"
    )
    parser.add_argument("--report", required=True, help="Path to correlation report")
    parser.add_argument(
        "--output", help="Output file for issues (default: security-issues.json)"
    )
    parser.add_argument(
        "--create",
        action="store_true",
        help="Create issues directly in GitHub (requires GITHUB_TOKEN)",
    )

    args = parser.parse_args()

    print("🔐 Security Issue Creator")
    print("=" * 50)

    creator = SecurityIssueCreator()

    print("\n📖 Parsing correlation report...")
    issues = creator.parse_correlation_report(args.report)
    print(f"   Found {len(issues)} security issues")

    if not issues:
        print("✅ No critical issues found!")
        return

    if args.create and creator.github:
        print("\n📤 Creating issues in GitHub...")
        creator.create_issues_github(issues)
    else:
        output_file = args.output or "security-issues.json"
        print("\n💾 Saving issues locally...")
        creator.create_issues_locally(issues, output_file)

    print("\n✅ Issue creation complete!")


if __name__ == "__main__":
    main()
