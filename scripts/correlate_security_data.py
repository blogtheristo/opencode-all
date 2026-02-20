#!/usr/bin/env python3
"""
Security Correlation Script - Link Audit Data with ZenFree Runtime Attacks

This script correlates static security audit findings with runtime attack patterns
detected by ZenFree, creating actionable insights and identifying:
- Actively exploited security gaps
- False negatives in audit scoring
- Emerging attack patterns
- Areas needing immediate remediation
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path  # For path sanitization


class SecurityCorrelator:
    """Correlates audit findings with runtime attack data"""

    def __init__(self):
        self.insights = {
            "critical": [],
            "high": [],
            "medium": [],
            "validated_gaps": [],
            "false_negatives": [],
            "emerging_patterns": [],
            "summary": {},
        }

        # Map audit gap types to Aikido attack signatures
        self.gap_attack_mapping = {
            "parameterized_queries": [
                "sql_injection",
                "nosql_injection",
                "database_injection",
            ],
            "input_validation": [
                "path_traversal",
                "command_injection",
                "xxe_injection",
                "template_injection",
                "ldap_injection",
            ],
            "least_privilege": [
                "privilege_escalation",
                "unauthorized_access",
                "account_takeover",
            ],
            "ssrf": ["ssrf", "internal_network_scan", "metadata_exposure"],
            "authentication": [
                "brute_force",
                "credential_stuffing",
                "jwt_bypass",
                "session_hijacking",
            ],
        }

    def parse_audit_report(self, audit_path: str) -> list[dict]:
        """Parse security audit report"""
        audit_gaps = []

        try:
            # Sanitize path to prevent traversal attacks
            safe_audit_path = Path(audit_path).resolve()
            with open(safe_audit_path, encoding="utf-8") as f:
                content = f.read()

            # Extract sections for each security practice
            sections = re.split(r"##\s+", content)

            for section in sections:
                lines = section.split("\n")
                if not lines:
                    continue

                section_name = lines[0].strip()

                # Extract score (e.g., "95%")
                score_match = re.search(r"(\d+)%", section)
                score = int(score_match.group(1)) if score_match else 0

                # Map section to gap type
                gap_type = self._map_section_to_gap_type(section_name)

                if gap_type:
                    audit_gaps.append(
                        {
                            "type": gap_type,
                            "name": section_name,
                            "score": score,
                            "content": section,
                            "paths": self._extract_paths(section),
                        }
                    )

        except FileNotFoundError:
            print(f"❌ Audit report not found: {audit_path}")
            return []

        return audit_gaps

    def parse_attack_log(self, attacks_path: str) -> list[dict]:
        """Parse ZenFree / legacy attack data (JSON or JSONL).

        - `.json`  → standard json.load()  (object with "attacks" key or bare list)
        - `.jsonl` → one JSON object per line (ZenFree default format)
        """
        try:
            # Sanitize path to prevent traversal attacks
            safe_attacks_path = Path(attacks_path).resolve()
            with open(safe_attacks_path, encoding="utf-8") as f:
                if str(safe_attacks_path).endswith(".jsonl"):
                    # JSONL: one JSON object per line
                    attacks: list[dict] = []
                    for lineno, line in enumerate(f, 1):
                        line = line.strip()
                        if not line:
                            continue
                        try:
                            obj = json.loads(line)
                            if isinstance(obj, dict):
                                attacks.append(obj)
                        except json.JSONDecodeError:
                            print(
                                f"⚠️  Skipping malformed JSONL line {lineno} in {attacks_path}"
                            )
                elif str(safe_attacks_path).endswith(".json"):
                    attacks = json.load(f)
                    if isinstance(attacks, dict):
                        attacks = attacks.get("attacks", [])
                else:
                    # Unknown extension — try JSONL first (ZenFree default),
                    # fall back to json.load()
                    content = f.read()
                    try:
                        parsed = json.loads(content)
                        attacks = (
                            parsed.get("attacks", [])
                            if isinstance(parsed, dict)
                            else (parsed if isinstance(parsed, list) else [])
                        )
                    except json.JSONDecodeError:
                        attacks = []
                        for line in content.splitlines():
                            line = line.strip()
                            if not line:
                                continue
                            try:
                                obj = json.loads(line)
                                if isinstance(obj, dict):
                                    attacks.append(obj)
                            except json.JSONDecodeError:
                                pass

            return attacks if isinstance(attacks, list) else []

        except FileNotFoundError:
            print(f"❌ Attack log file not found: {attacks_path}")
            return []
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON in attacks file: {attacks_path}")
            return []

    def correlate_data(self, audit_gaps: list[dict], attacks: list[dict]) -> dict:
        """Cross-reference audit gaps with runtime attacks"""

        # 1. Find actively exploited gaps
        for gap in audit_gaps:
            related_attacks = self._find_related_attacks(gap, attacks)

            if related_attacks:
                self.insights["critical"].append(
                    {
                        "gap": gap,
                        "status": "ACTIVELY EXPLOITED",
                        "attack_count": len(related_attacks),
                        "attack_types": list(
                            {a.get("attack_type") for a in related_attacks}
                        ),
                        "priority": "FIX IMMEDIATELY",
                        "attacks": related_attacks[:5],  # Top 5 examples
                        "score_vs_reality": f"Audit: {gap['score']}% | Reality: EXPLOITED",
                        "recommendation": self._get_remediation(gap),
                    }
                )

        # 2. Find false negatives (high score but attacks detected)
        secure_areas = [g for g in audit_gaps if g["score"] > 85]
        for area in secure_areas:
            attacks_in_area = self._find_related_attacks(area, attacks)
            if attacks_in_area:
                self.insights["false_negatives"].append(
                    {
                        "area": area,
                        "audit_score": area["score"],
                        "actual_threat_level": "HIGH",
                        "message": f"Audit scored {area['score']}% secure, but attacks detected",
                        "attack_count": len(attacks_in_area),
                        "examples": attacks_in_area[:3],
                        "review": "Manual security review recommended",
                        "potential_cause": self._analyze_false_negative(
                            area, attacks_in_area
                        ),
                    }
                )

        # 3. Calculate validated gaps (audit + Zen agreement)
        for gap in audit_gaps:
            if gap["score"] < 80:  # Known weak area
                related = self._find_related_attacks(gap, attacks)
                if not related:  # But no attacks detected
                    self.insights["validated_gaps"].append(
                        {
                            "gap": gap,
                            "status": "VALIDATED - NOT EXPLOITED",
                            "score": gap["score"],
                            "reason": "Audit identified weakness but no active attacks",
                            "action": "Continue monitoring",
                        }
                    )

        # 4. Detect emerging patterns
        self.insights["emerging_patterns"] = self._analyze_patterns(attacks)

        # 5. Generate summary
        self.insights["summary"] = self._generate_summary(audit_gaps, attacks)

        return self.insights

    def _find_related_attacks(self, gap: dict, attacks: list[dict]) -> list[dict]:
        """Find attacks related to a security gap"""
        related = []
        gap_type = gap.get("type")

        if not gap_type:
            return related

        attack_patterns = self.gap_attack_mapping.get(gap_type, [])

        for attack in attacks:
            attack_type = attack.get("attack_type", "").lower()
            attack.get("endpoint", "")

            # Check if attack type matches
            for pattern in attack_patterns:
                if pattern.lower() in attack_type:
                    related.append(attack)
                    break

        return related

    def _map_section_to_gap_type(self, section_name: str) -> str:
        """Map audit section name to gap type"""
        mapping = {
            "parameterized": "parameterized_queries",
            "input": "input_validation",
            "privilege": "least_privilege",
            "dependencies": "dependency_management",
            "environment": "environment_variables",
            "authentication": "authentication",
        }

        section_lower = section_name.lower()
        for key, value in mapping.items():
            if key in section_lower:
                return value

        return None

    def _extract_paths(self, content: str) -> list[str]:
        """Extract file/endpoint paths from audit content"""
        # Simple pattern: look for code blocks and paths
        paths = []
        path_pattern = r"(?:src/|routes/|services/|controllers/)[\w/\.\-]+"
        paths.extend(re.findall(path_pattern, content))
        return paths

    def _analyze_false_negative(self, _area: dict, attacks: list[dict]) -> str:
        """Analyze why a "secure" area has attacks"""
        possible_causes = []

        # Check for new attack vectors
        if len(attacks) > 0:
            latest_attack = max(attacks, key=lambda x: x.get("timestamp", ""))
            possible_causes.append(
                f"Recent attack vector emerged: {latest_attack.get('attack_type')}"
            )

        # Check for bypasses
        if any("bypass" in a.get("attack_type", "").lower() for a in attacks):
            possible_causes.append("Security mechanism bypass detected")

        return (
            " | ".join(possible_causes)
            if possible_causes
            else "Audit methodology may need refinement"
        )

    def _analyze_patterns(self, attacks: list[dict]) -> list[dict]:
        """Detect emerging attack patterns"""
        patterns = {}

        for attack in attacks:
            attack_type = attack.get("attack_type", "unknown")
            endpoint = attack.get("endpoint", "unknown")

            key = f"{attack_type}:{endpoint}"
            if key not in patterns:
                patterns[key] = []
            patterns[key].append(attack)

        # Find patterns with 3+ occurrences (emerging trend)
        emerging = [
            {
                "pattern": key,
                "occurrences": len(attacks_list),
                "severity": self._calculate_severity(attacks_list),
                "recommendation": f"Implement specific defense for {key.split(':')[0]}",
            }
            for key, attacks_list in patterns.items()
            if len(attacks_list) >= 3
        ]

        return sorted(emerging, key=lambda x: x["occurrences"], reverse=True)

    def _generate_summary(self, audit_gaps: list[dict], attacks: list[dict]) -> dict:
        """Generate summary statistics"""
        return {
            "total_audit_gaps": len(audit_gaps),
            "actively_exploited": len(self.insights["critical"]),
            "false_negatives": len(self.insights["false_negatives"]),
            "total_attacks_30d": len(attacks),
            "average_audit_score": sum(g["score"] for g in audit_gaps) / len(audit_gaps)
            if audit_gaps
            else 0,
            "critical_priority_count": len(self.insights["critical"]),
            "generated_at": datetime.now().isoformat(),
        }

    def _get_remediation(self, gap: dict) -> str:
        """Get remediation recommendation for gap"""
        remediation_map = {
            "parameterized_queries": "Use ORM parameterized queries or prepared statements",
            "input_validation": "Implement comprehensive input validation with allowlists",
            "least_privilege": "Review and restrict IAM roles and database permissions",
            "environment_variables": "Audit all secrets in environment, rotate if exposed",
            "dependency_management": "Update dependencies and scan for vulnerabilities",
        }

        return remediation_map.get(gap["type"], "Review audit report for details")

    def _calculate_severity(self, attacks: list[dict]) -> str:
        """Calculate severity based on attack frequency"""
        count = len(attacks)
        if count >= 10:
            return "CRITICAL"
        if count >= 5:
            return "HIGH"
        if count >= 3:
            return "MEDIUM"
        return "LOW"

    def generate_markdown_report(self) -> str:
        """Generate Markdown report of findings"""
        report = f"""# 🔒 Security Correlation Report

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| Total Audit Gaps | {self.insights["summary"].get("total_audit_gaps", 0)} |
| **🚨 Actively Exploited** | **{self.insights["summary"].get("actively_exploited", 0)}** |
| False Negatives Found | {self.insights["summary"].get("false_negatives", 0)} |
| Runtime Attacks (30d) | {self.insights["summary"].get("total_attacks_30d", 0)} |
| Average Audit Score | {self.insights["summary"].get("average_audit_score", 0):.1f}% |

---

## 🚨 CRITICAL - Active Exploitation of Known Gaps

**Action Required:** Fix immediately

"""

        if self.insights["critical"]:
            for i, item in enumerate(self.insights["critical"], 1):
                gap = item["gap"]
                report += f"""
### {i}. {gap["name"]} - {item["status"]}

- **Audit Score:** {gap["score"]}%
- **Attacks Detected:** {item["attack_count"]} in last 30 days
- **Attack Types:** {", ".join(item["attack_types"])}
- **Priority:** 🔴 {item["priority"]}

**Top Attack Examples:**
```json
{json.dumps(item["attacks"][:3], indent=2)}
```

**Recommended Fix:**
```
{item["recommendation"]}
```

---
"""
        else:
            report += "\n✅ No critical exploitations detected!\n\n---\n"

        # False Negatives Section
        report += "\n## ⚠️ FALSE NEGATIVES - High Score But Attacks Detected\n\n"

        if self.insights["false_negatives"]:
            for item in self.insights["false_negatives"]:
                area = item["area"]
                report += f"""
### {area["name"]}
- **Audit Score:** {item["audit_score"]}% (Seemingly Secure)
- **Actual Threat:** {item["actual_threat_level"]}
- **Attacks Detected:** {item["attack_count"]}
- **Issue:** {item["message"]}
- **Potential Cause:** {item["potential_cause"]}

**Action:** {item["review"]}

"""
        else:
            report += "✅ No false negatives found!\n\n"

        # Emerging Patterns
        report += "\n## 📈 Emerging Attack Patterns\n\n"

        if self.insights["emerging_patterns"]:
            for pattern in self.insights["emerging_patterns"]:
                report += f"""
### {pattern["pattern"]}
- **Occurrences:** {pattern["occurrences"]}
- **Severity:** {pattern["severity"]}
- **Recommendation:** {pattern["recommendation"]}

"""
        else:
            report += "✅ No emerging patterns detected!\n\n"

        # Validated Gaps
        report += "\n## ✅ Validated Security Measures\n\n"
        report += "These gaps were identified by audit but no attacks detected:\n\n"

        if self.insights["validated_gaps"]:
            for gap in self.insights["validated_gaps"][:5]:
                report += f"- **{gap['gap']['name']}** ({gap['gap']['score']}%): {gap['action']}\n"
        else:
            report += "- All gaps have been actively targeted. Continuous monitoring recommended.\n"

        report += f"""

---

## 🎯 Next Steps

1. **This Week:** Address critical exploitations
2. **This Month:** Investigate false negatives
3. **Ongoing:** Monitor emerging patterns via ZenFree attack log

---

**Report Generated by:** Security Correlation Script
**Data Sources:** Monthly Audit + ZenFree
**Correlation Engine:** CPython {sys.version_info.major}.{sys.version_info.minor}
"""

        return report

    def save_report(self, output_path: str) -> None:
        """Save report to file"""
        report = self.generate_markdown_report()

        # Sanitize path to prevent traversal attacks
        safe_output_path = Path(output_path).resolve()
        safe_output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(safe_output_path, "w", encoding="utf-8") as f:
            f.write(report)

        print(f"✅ Report saved to: {safe_output_path}")

    def get_json_insights(self) -> dict:
        """Get insights as JSON"""
        return self.insights


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Correlate security audit findings with ZenFree attack data"
    )
    parser.add_argument("--audit", required=True, help="Path to audit report")
    parser.add_argument(
        "--attacks", required=True, help="Path to attack log JSON/JSONL"
    )
    parser.add_argument(
        "--output", required=True, help="Output path for correlation report"
    )
    parser.add_argument("--json-output", help="Optional: Output JSON insights")

    args = parser.parse_args()

    print("🔗 Starting Security Correlation Analysis...")
    print(f"   Audit Report: {args.audit}")
    print(f"   Attack Data: {args.attacks}")
    print()

    correlator = SecurityCorrelator()

    # Parse data
    print("📖 Parsing audit report...")
    audit_gaps = correlator.parse_audit_report(args.audit)
    print(f"   Found {len(audit_gaps)} audit gaps")

    print("📖 Parsing attack log...")
    attacks = correlator.parse_attack_log(args.attacks)
    print(f"   Found {len(attacks)} attacks in last 30 days")

    # Correlate
    print("🔗 Correlating data...")
    insights = correlator.correlate_data(audit_gaps, attacks)

    # Generate summary
    summary = insights["summary"]
    print("\n📊 Correlation Complete:")
    print(f"   Critical Issues: {summary.get('actively_exploited', 0)}")
    print(f"   False Negatives: {summary.get('false_negatives', 0)}")
    print(f"   Validated Gaps: {len(insights.get('validated_gaps', []))}")
    print(f"   Emerging Patterns: {len(insights.get('emerging_patterns', []))}")

    # Save reports
    print("\n💾 Saving reports...")
    correlator.save_report(args.output)

    if args.json_output:
        # Sanitize path to prevent traversal attacks
        json_output_path = str(Path(args.json_output).resolve())
        with open(json_output_path, "w") as f:
            json.dump(insights, f, indent=2)
        print(f"✅ JSON insights saved to: {json_output_path}")

    print("\n✅ Correlation analysis complete!")


if __name__ == "__main__":
    main()
