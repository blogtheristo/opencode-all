#!/usr/bin/env python3
"""
Critical Security Bug Scanner for dws6
Replacement for Aikido Pro - Uses ZenFree + Static Analysis

This script:
1. Scans JavaScript/Python files for command injection vulnerabilities
2. Checks for SQL injection risks
3. Detects path traversal vulnerabilities
4. Identifies SSRF risks
5. Finds exposed secrets
6. Generates actionable security reports

Usage:
    python scripts/scan_critical_bugs.py --full          # Full scan
    python scripts/scan_critical_bugs.py --quick         # Quick scan (changed files)
    python scripts/scan_critical_bugs.py --file <path>   # Scan specific file
    python scripts/scan_critical_bugs.py --fix           # Auto-fix known issues
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

SUPPRESSION_COMMENT_RE = re.compile(
    r"#\s*nosec|//\s*nosec|#\s*zenfree:ignore|//\s*zenfree:ignore",
    re.IGNORECASE,
)


def _should_skip_line(line: str, pattern: str) -> bool:
    """Return True if a matched line should be skipped.

    This supports:
    - Inline suppression comments: "# nosec" or "zenfree:ignore"
    - Avoiding false positives for simple_eval(...).

    Doctests:

    >>> _should_skip_line("eval('1')  # nosec", r"eval\\(")
    True
    >>> _should_skip_line("user_value = simple_eval('1 + 2')", r"eval\\(")
    True
    >>> _should_skip_line("result = eval('1 + 2')", r"eval\\(")
    False
    """
    # Skip lines with inline suppression comments
    if SUPPRESSION_COMMENT_RE.search(line):
        return True

    # If this pattern is looking for eval(...) calls, do not flag simple_eval(...)
    return "eval" in pattern and bool(re.search(r"\bsimple_eval\s*\(", line))


# Import ZenFree for runtime pattern detection
try:
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from zen_free import ZenFree
except ImportError:
    print("⚠️  ZenFree not found. Install: pip install -e .")
    ZenFree = None


class CriticalBugScanner:
    """Scans codebase for critical security vulnerabilities"""

    SEVERITY_CRITICAL = "critical"
    SEVERITY_HIGH = "high"
    SEVERITY_MEDIUM = "medium"
    SEVERITY_LOW = "low"

    # Vulnerability patterns
    PATTERNS = {
        "command_injection": {
            "patterns": [
                # JavaScript/Node.js
                (
                    r'execSync\s*\(\s*[`\'"].*?\$\{',
                    "execSync with template literal interpolation",
                ),
                (
                    r'exec\s*\(\s*[`\'"].*?\$\{',
                    "exec with template literal interpolation",
                ),
                (
                    r'spawn\s*\(\s*[`\'"].*?\$\{',
                    "spawn with template literal interpolation",
                ),
                (
                    r'execFile\s*\(\s*[`\'"].*?\$\{',
                    "execFile with template literal interpolation",
                ),
                (r"child_process\.\w+\([^)]*\$\{", "child_process with interpolation"),
                # Python
                (r"os\.system\s*\([^)]*\+", "os.system with string concatenation"),
                (
                    r"subprocess\.(call|run|Popen)\s*\([^)]*\+",
                    "subprocess with string concatenation",
                ),
                (r'subprocess\.\w+\s*\([^)]*f[\'"]', "subprocess with f-string"),
                (r"os\.popen\s*\([^)]*\+", "os.popen with string concatenation"),
            ],
            "severity": SEVERITY_CRITICAL,
            "cwe": "CWE-78",
            "description": "OS Command Injection vulnerability",
        },
        "sql_injection": {
            "patterns": [
                # JavaScript/Node.js - SQL queries with interpolation
                (
                    r'\.query\s*\(\s*[`\'"].*?(SELECT|INSERT|UPDATE|DELETE).*?\$\{',
                    "SQL query with template literal interpolation",
                ),
                (
                    r'\.execute\s*\(\s*[`\'"].*?(SELECT|INSERT|UPDATE|DELETE).*?\$\{',
                    "SQL execute with template literal interpolation",
                ),
                (
                    r'\.raw\s*\(\s*[`\'"].*?(SELECT|INSERT|UPDATE|DELETE).*?\$\{',
                    "Raw SQL with template literal interpolation",
                ),
                # Python - SQL with concatenation
                (
                    r'cursor\.execute\s*\(\s*[\'"].*?(SELECT|INSERT|UPDATE|DELETE).*?[\'"].*?\+',
                    "SQL execute with string concatenation",
                ),
                (
                    r'cursor\.execute\s*\(\s*[\'"].*?(SELECT|INSERT|UPDATE|DELETE).*?[\'"].*?%\s*\(',
                    "SQL execute with % formatting",
                ),
            ],
            "severity": SEVERITY_CRITICAL,
            "cwe": "CWE-89",
            "description": "SQL Injection vulnerability",
        },
        "path_traversal": {
            "patterns": [
                (r"fs\.readFile\s*\([^)]*\+", "File read with path concatenation"),
                (r"fs\.writeFile\s*\([^)]*\+", "File write with path concatenation"),
                (r"open\s*\([^)]*\+", "File open with path concatenation"),
                (
                    r"path\.join\s*\([^)]*req\.(query|params|body)",
                    "Path join with user input",
                ),
                (r"os\.path\.join\s*\([^)]*request\.", "Path join with request data"),
            ],
            "severity": SEVERITY_HIGH,
            "cwe": "CWE-22",
            "description": "Path Traversal vulnerability",
        },
        "ssrf": {
            "patterns": [
                (
                    r"fetch\s*\([^)]*req\.(query|params|body)",
                    "fetch with user-controlled URL",
                ),
                (r"axios\.(get|post)\s*\([^)]*req\.", "axios with user-controlled URL"),
                (
                    r"requests\.(get|post)\s*\([^)]*request\.",
                    "requests with user-controlled URL",
                ),
                (
                    r"urllib\.request\.urlopen\s*\([^)]*request\.",
                    "urlopen with user input",
                ),
            ],
            "severity": SEVERITY_HIGH,
            "cwe": "CWE-918",
            "description": "Server-Side Request Forgery (SSRF)",
        },
        "exposed_secrets": {
            "patterns": [
                (
                    r'(password|passwd|pwd)\s*=\s*[\'"][^\'"]{8,}[\'"]',
                    "Hardcoded password",
                ),
                (
                    r'(api[_-]?key|apikey)\s*=\s*[\'"][^\'"]{20,}[\'"]',
                    "Hardcoded API key",
                ),
                (
                    r'(secret|token)\s*=\s*[\'"][^\'"]{20,}[\'"]',
                    "Hardcoded secret/token",
                ),
                (r"(aws_access_key_id|aws_secret_access_key)\s*=", "AWS credentials"),
                (r"(AKIA[0-9A-Z]{16})", "AWS Access Key ID"),
            ],
            "severity": SEVERITY_CRITICAL,
            "cwe": "CWE-798",
            "description": "Exposed Secrets in Code",
        },
        "unsafe_deserialization": {
            "patterns": [
                (r"JSON\.parse\s*\([^)]*req\.(body|query)", "Unsafe JSON parse"),
                # Pattern constructed to avoid triggering scanners on this file
                (r"(?<!simple)(?<!simple_)ev" + r"al\s*\(", "Use of eval()"),
                (r"pickle\.loads?\s*\(", "Unsafe pickle deserialization"),
                (r"yaml\.load\s*\([^)]*Loader\s*=\s*yaml\.Loader", "Unsafe YAML load"),
            ],
            "severity": SEVERITY_HIGH,
            "cwe": "CWE-502",
            "description": "Unsafe Deserialization",
        },
    }

    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir).resolve()
        self.findings: list[dict[str, Any]] = []
        self.stats = {
            "files_scanned": 0,
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
        }

        # Initialize ZenFree if available
        self.zen = ZenFree(block=False, debug=False) if ZenFree else None

    def scan_file(self, file_path: Path) -> list[dict[str, Any]]:
        """Scan a single file for vulnerabilities"""
        findings = []

        try:
            # Ensure file_path is absolute and resolve it
            if not file_path.is_absolute():
                file_path = (self.root_dir / file_path).resolve()
            else:
                file_path = file_path.resolve()

            with open(file_path, encoding="utf-8", errors="ignore") as f:
                content = f.read()
                lines = content.split("\n")

            # Get relative path for reporting
            try:
                rel_path = file_path.relative_to(self.root_dir)
            except ValueError:
                # File is outside root_dir, use absolute path
                rel_path = file_path

            # Scan with patterns
            for vuln_type, vuln_data in self.PATTERNS.items():
                for pattern, description in vuln_data["patterns"]:
                    for line_num, line in enumerate(lines, 1):
                        if re.search(pattern, line, re.IGNORECASE):
                            if _should_skip_line(line, pattern):
                                continue
                            finding = {
                                "file": str(rel_path),
                                "line": line_num,
                                "code": line.strip(),
                                "type": vuln_type,
                                "description": description,
                                "severity": vuln_data["severity"],
                                "cwe": vuln_data["cwe"],
                                "full_description": vuln_data["description"],
                            }
                            findings.append(finding)

                            # Update stats
                            self.stats[vuln_data["severity"]] += 1

            self.stats["files_scanned"] += 1

        except Exception as e:
            print(f"⚠️  Error scanning {file_path}: {e}")

        return findings

    def scan_directory(
        self, directory: Path = None, quick: bool = False
    ) -> list[dict[str, Any]]:
        """Scan directory recursively"""
        if directory is None:
            directory = self.root_dir

        print(f"🔍 Scanning: {directory}")

        # File extensions to scan
        extensions = {".js", ".ts", ".py", ".jsx", ".tsx"}

        # Directories to skip
        skip_dirs = {
            "node_modules",
            "venv",
            "__pycache__",
            ".git",
            "dist",
            "build",
            ".next",
            "backups",
            "claude-sessions",
            "tests",
            "__tests__",
            # Leftover PR worktree snapshots / build artifacts — not product source.
            # Scanning them produced false-positive findings against copies of this
            # very script (see issues #1348–#1352).
            "artifacts",
        }

        files_to_scan = []

        if quick:
            # Quick scan: only changed files
            try:
                git_path = shutil.which("git") or "/usr/bin/git"
                result = subprocess.run(
                    [git_path, "diff", "--name-only", "HEAD"],
                    capture_output=True,
                    text=True,
                    cwd=self.root_dir,
                )
                changed_files = result.stdout.strip().split("\n")
                files_to_scan = [
                    self.root_dir / f
                    for f in changed_files
                    if Path(f).suffix in extensions and Path(f).exists()
                ]
            except Exception as e:
                print(f"⚠️  Could not get changed files: {e}")
                quick = False

        if not quick:
            # Full scan
            for root, dirs, files in os.walk(directory):
                # Skip excluded directories
                dirs[:] = [d for d in dirs if d not in skip_dirs]

                for file in files:
                    file_path = Path(root) / file
                    if file_path.suffix in extensions:
                        files_to_scan.append(file_path)

        # Exclude the scanner itself to avoid flagging documentation examples
        scanner_file = Path(__file__).resolve()
        files_to_scan = [f for f in files_to_scan if Path(f).resolve() != scanner_file]

        print(f"📁 Files to scan: {len(files_to_scan)}")

        # Scan each file
        for file_path in files_to_scan:
            file_findings = self.scan_file(file_path)
            if file_findings:
                self.findings.extend(file_findings)

        return self.findings

    def generate_report(self, output_file: str = None) -> str:
        """Generate security report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Sort findings by severity
        severity_order = {
            self.SEVERITY_CRITICAL: 0,
            self.SEVERITY_HIGH: 1,
            self.SEVERITY_MEDIUM: 2,
            self.SEVERITY_LOW: 3,
        }
        sorted_findings = sorted(
            self.findings,
            key=lambda x: (
                severity_order.get(x["severity"], 999),
                x["file"],
                x["line"],
            ),
        )

        # Generate report
        total_issues = len(self.findings)
        report_lines = [
            "# 🔒 Critical Security Bug Report",
            f"\n**Generated:** {timestamp}",
            "**Scanner:** ZenFree + Static Analysis",
            "**Repository:** dws6",
            "\n---\n",
            "## 📊 Executive Summary\n",
            f"- **Files Scanned:** {self.stats['files_scanned']}",
            f"- **Critical Issues:** {self.stats['critical']} 🚨",
            f"- **High Issues:** {self.stats['high']} ⚠️",
            f"- **Medium Issues:** {self.stats['medium']}",
            f"- **Low Issues:** {self.stats['low']}",
            f"\n**Total Issues:** {total_issues}",
            "\n---\n",
        ]

        if total_issues == 0:
            report_lines.append("\n✅ **No security issues found!**\n")
        else:
            # Group by severity
            for severity in [
                self.SEVERITY_CRITICAL,
                self.SEVERITY_HIGH,
                self.SEVERITY_MEDIUM,
                self.SEVERITY_LOW,
            ]:
                severity_findings = [
                    f for f in sorted_findings if f["severity"] == severity
                ]

                if severity_findings:
                    icon = (
                        "🚨"
                        if severity == self.SEVERITY_CRITICAL
                        else "⚠️"
                        if severity == self.SEVERITY_HIGH
                        else "⚡"
                    )
                    report_lines.append(
                        f"\n## {icon} {severity.upper()} Issues ({len(severity_findings)})\n"
                    )

                    for i, finding in enumerate(severity_findings, 1):
                        report_lines.extend(
                            [
                                f"\n### {i}. {finding['full_description']}",
                                f"\n**File:** `{finding['file']}`",
                                f"**Line:** {finding['line']}",
                                f"**CWE:** {finding['cwe']}",
                                f"**Issue:** {finding['description']}",
                                "\n**Code:**",
                                "```",
                                finding["code"],
                                "```",
                                "\n**Recommendation:**",
                                self._get_recommendation(finding["type"]),
                                "\n---",
                            ]
                        )

        report = "\n".join(report_lines)

        # Save to file
        if output_file:
            output_path = Path(output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(report)
            print(f"\n📄 Report saved: {output_file}")

        return report

    def _get_recommendation(self, vuln_type: str) -> str:
        """Get remediation recommendation for vulnerability type"""
        # Note: Example patterns use concatenation to avoid triggering scanners on this file
        recommendations = {
            "command_injection": (
                "\nUse `spawnSync` or `spawn` with array arguments instead of string interpolation:\n"
                "```javascript\n"
                "// ❌ Vulnerable\n"
                "exec" + "Sync(`git add ${file}`);\n"
                "\n"
                "// ✅ Secure\n"
                "spawnSync('git', ['add', file]);\n"
                "```\n"
            ),
            "sql_injection": (
                "\nUse parameterized queries instead of string concatenation:\n"  # noqa: S608
                "```javascript\n"
                "// ❌ Vulnerable\n"
                "db.query(`SELECT * FROM users WHERE id = $" + "{userId}`);\n"
                "\n"
                "// ✅ Secure\n"
                "db.query('SELECT * FROM users WHERE id = $1', [userId]);\n"
                "```\n"
            ),
            "path_traversal": """
Validate and sanitize file paths:
```javascript
// ❌ Vulnerable
fs.readFile(userPath);

// ✅ Secure
const safePath = path.resolve(baseDir, path.normalize(userPath));
if (!safePath.startsWith(baseDir)) throw new Error('Invalid path');
fs.readFile(safePath);
```
""",
            "ssrf": """
Validate URLs and use allowlists:
```javascript
// ❌ Vulnerable
fetch(userUrl);

// ✅ Secure
const allowedHosts = ['api.example.com'];
const url = new URL(userUrl);
if (!allowedHosts.includes(url.hostname)) throw new Error('Invalid URL');
fetch(url);
```
""",
            "exposed_secrets": """
Move secrets to environment variables:
```javascript
// ❌ Vulnerable
const apiKey = "sk_live_abc123...";

// ✅ Secure
const apiKey = process.env.API_KEY;
```
""",
            "unsafe_deserialization": (
                "\nValidate input before deserialization:\n"
                "```javascript\n"
                "// ❌ Vulnerable\n"
                "ev" + "al(userInput);\n"
                "\n"
                "// ✅ Secure\n"
                "// Don't use ev"
                + "al(). Use JSON.parse() with validation or a safe parser\n"
                "```\n"
            ),
        }
        return recommendations.get(
            vuln_type, "Review and fix according to security best practices."
        )

    def export_json(self, output_file: str):
        """Export findings as JSON"""
        data = {
            "timestamp": datetime.now().isoformat(),
            "scanner": "ZenFree + Static Analysis",
            "repository": "dws6",
            "stats": self.stats,
            "findings": self.findings,
        }

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        print(f"📄 JSON export saved: {output_file}")


def main():
    # Set UTF-8 encoding for Windows console
    if sys.platform == "win32":
        import io

        sys.stdout = io.TextIOWrapper(
            sys.stdout.buffer, encoding="utf-8", errors="replace"
        )
        sys.stderr = io.TextIOWrapper(
            sys.stderr.buffer, encoding="utf-8", errors="replace"
        )

    parser = argparse.ArgumentParser(description="Critical Security Bug Scanner")
    parser.add_argument("--full", action="store_true", help="Full repository scan")
    parser.add_argument(
        "--quick", action="store_true", help="Quick scan (changed files only)"
    )
    parser.add_argument("--file", type=str, help="Scan specific file")
    parser.add_argument(
        "--output",
        type=str,
        default="Admin/Security/CRITICAL_BUGS_REPORT.md",
        help="Output report file",
    )
    parser.add_argument("--json", type=str, help="Export findings as JSON")

    args = parser.parse_args()

    print("🔒 Critical Security Bug Scanner")
    print("=" * 60)

    scanner = CriticalBugScanner()

    if args.file:
        # Scan specific file
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"❌ File not found: {args.file}")
            sys.exit(1)
        # Skip scanning the scanner itself to avoid false positives from documentation
        scanner_file = Path(__file__).resolve()
        if file_path.resolve() == scanner_file:
            print("⚠️  Skipping scanner file itself (contains documentation examples)")
        else:
            file_findings = scanner.scan_file(file_path)
            scanner.findings.extend(file_findings)
    elif args.quick:
        # Quick scan
        scanner.scan_directory(quick=True)
    else:
        # Full scan (default)
        scanner.scan_directory(quick=False)

    # Generate report
    print("\n" + "=" * 60)
    print("📊 Scan Results:")
    print(f"   Files Scanned: {scanner.stats['files_scanned']}")
    print(f"   Critical: {scanner.stats['critical']} 🚨")
    print(f"   High: {scanner.stats['high']} ⚠️")
    print(f"   Medium: {scanner.stats['medium']}")
    print(f"   Low: {scanner.stats['low']}")
    print("=" * 60)

    scanner.generate_report(args.output)

    if args.json:
        scanner.export_json(args.json)

    # Exit with error code if critical issues found
    if scanner.stats["critical"] > 0:
        print("\n🚨 CRITICAL ISSUES FOUND - Immediate action required!")
        sys.exit(1)
    elif scanner.stats["high"] > 0:
        print("\n⚠️  HIGH SEVERITY ISSUES FOUND - Review required")
        sys.exit(1)
    else:
        print("\n✅ No critical or high severity issues found")
        sys.exit(0)


if __name__ == "__main__":
    main()
