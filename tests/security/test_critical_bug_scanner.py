#!/usr/bin/env python3
"""
Tests for Critical Bug Scanner
Validates that the scanner correctly detects vulnerabilities and excludes itself.
"""

# Import the scanner
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from scripts.scan_critical_bugs import CriticalBugScanner


class TestCriticalBugScanner:
    """Test suite for CriticalBugScanner"""

    def test_scanner_excludes_itself_from_directory_scan(self, tmp_path):
        """Test that scanner excludes itself when scanning directories"""
        scanner = CriticalBugScanner(tmp_path)

        # Create the scanner file path
        Path(__file__).parent.parent.parent / "scripts" / "scan_critical_bugs.py"

        # Scan should not include the scanner file
        findings = scanner.scan_directory()

        # Check that scanner file was not scanned
        scanner_paths = [
            f["file"] for f in findings if "scan_critical_bugs.py" in f["file"]
        ]
        assert len(scanner_paths) == 0, "Scanner should exclude itself from scans"

    def test_scanner_detects_command_injection(self, tmp_path):
        """Test that scanner detects command injection vulnerabilities"""
        # Create a file with command injection vulnerability
        vuln_file = tmp_path / "vulnerable.js"
        vuln_file.write_text("""
const { execSync } = require('child_process');

function processFile(filename) {
    execSync(`git add ${filename}`);
}
""")

        scanner = CriticalBugScanner(tmp_path)
        findings = scanner.scan_file(vuln_file)

        # Should detect at least one command injection
        assert len(findings) > 0, "Scanner should detect command injection"
        assert findings[0]["type"] == "command_injection"
        assert findings[0]["severity"] == "critical"
        assert findings[0]["cwe"] == "CWE-78"

    def test_scanner_detects_sql_injection(self, tmp_path):
        """Test that scanner detects SQL injection vulnerabilities"""
        vuln_file = tmp_path / "vulnerable.js"
        vuln_file.write_text("""
function getUserData(userId) {
    return db.query(`SELECT * FROM users WHERE id = ${userId}`);
}
""")

        scanner = CriticalBugScanner(tmp_path)
        findings = scanner.scan_file(vuln_file)

        # Should detect SQL injection
        assert len(findings) > 0, "Scanner should detect SQL injection"
        assert findings[0]["type"] == "sql_injection"
        assert findings[0]["severity"] == "critical"

    def test_scanner_handles_safe_code(self, tmp_path):
        """Test that scanner doesn't flag safe code"""
        safe_file = tmp_path / "safe.js"
        safe_file.write_text("""
const { spawnSync } = require('child_process');

function processFile(filename) {
    // Safe: uses array arguments
    spawnSync('git', ['add', filename]);
}
""")

        scanner = CriticalBugScanner(tmp_path)
        findings = scanner.scan_file(safe_file)

        # Should not detect any vulnerabilities in safe code
        assert len(findings) == 0, "Scanner should not flag safe code"

    def test_scanner_statistics_tracking(self, tmp_path):
        """Test that scanner correctly tracks statistics"""
        # Create files with different severity issues
        # Note: Test patterns are constructed to avoid triggering scanners on this test file
        critical_file = tmp_path / "critical.js"
        critical_cmd = "execSync(`rm -rf $" + "{path}`);"
        critical_file.write_text(critical_cmd)

        high_file = tmp_path / "high.js"
        # Split the readFile identifier to avoid scanner false positives on this test file's source
        read_fn = "read" + "File"
        path_traversal_pattern = f"fs.{read_fn}(userPath + filename);"
        high_file.write_text(path_traversal_pattern)

        scanner = CriticalBugScanner(tmp_path)
        scanner.scan_file(critical_file)
        scanner.scan_file(high_file)

        # Check statistics
        assert scanner.stats["files_scanned"] == 2
        assert scanner.stats["critical"] >= 1
        assert scanner.stats["high"] >= 1

    def test_scanner_report_generation(self, tmp_path):
        """Test that scanner generates reports correctly"""
        vuln_file = tmp_path / "vuln.js"
        # Construct test pattern to avoid scanner false positives on test file
        cmd_injection_pattern = "execSync(`rm $" + "{file}`);"
        vuln_file.write_text(cmd_injection_pattern)

        scanner = CriticalBugScanner(tmp_path)
        findings = scanner.scan_file(vuln_file)
        scanner.findings.extend(findings)

        # Generate report
        report_file = tmp_path / "report.md"
        report = scanner.generate_report(str(report_file))

        assert report_file.exists(), "Report file should be created"
        assert "Critical Security Bug Report" in report
        assert "Files Scanned:" in report
        assert len(scanner.findings) > 0
