#!/usr/bin/env python3
"""
Codebase Health Reporter - Self-Improving Metrics

Analyzes the DWS6 codebase and produces a health report that feeds
back into AI-assisted development sessions. Each Claude Code / Cursor
session can read this report to understand what needs fixing.

Self-improving loop:
  1. Script runs → produces health_report.json
  2. AI agent reads report → fixes top issues
  3. Next run shows improvement → cycle continues

Usage:
  python scripts/codebase_health.py
  python scripts/codebase_health.py --output json
  python scripts/codebase_health.py --output markdown
  python scripts/codebase_health.py --output-file path/to/report.json
  python scripts/codebase_health.py --no-write    # stdout only (default)

By default the script writes nothing to disk — it prints the report to stdout.
Pass --output-file PATH to persist the JSON report. Recommended paths are
outside the repo or gitignored (the repo already ignores health_report.json).
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def count_files(directory: str, extensions: tuple[str, ...]) -> int:
    """Count files matching extensions recursively."""
    count = 0
    base = Path(directory)
    if not base.exists():
        return 0
    for ext in extensions:
        count += len(list(base.rglob(f"*{ext}")))
    return count


def count_lines(filepath: str) -> int:
    """Count non-empty lines in a file."""
    try:
        with open(filepath, encoding="utf-8", errors="ignore") as f:
            return sum(1 for line in f if line.strip())
    except (OSError, UnicodeDecodeError):
        return 0


def analyze_tests(base_path: str) -> dict:
    """Analyze test coverage metrics."""
    tests_dir = os.path.join(base_path, "src", "__tests__")
    test_files = []
    test_count = 0

    if os.path.isdir(tests_dir):
        for f in os.listdir(tests_dir):
            if f.endswith(".test.ts"):
                filepath = os.path.join(tests_dir, f)
                lines = count_lines(filepath)
                test_files.append({"file": f, "lines": lines})

                # Count test cases (it/test blocks)
                with open(filepath, encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                    test_count += content.count("it(") + content.count("test(")

    return {
        "test_files": len(test_files),
        "test_cases": test_count,
        "files": test_files,
    }


def _load_test_file_contents(base_path: str) -> dict[str, str]:
    """Return a mapping of test filename -> file contents for src/__tests__."""
    tests_dir = os.path.join(base_path, "src", "__tests__")
    result: dict[str, str] = {}
    if not os.path.isdir(tests_dir):
        return result
    for f in os.listdir(tests_dir):
        if f.endswith(".test.ts"):
            try:
                with open(os.path.join(tests_dir, f), encoding="utf-8", errors="ignore") as fh:
                    result[f] = fh.read()
            except OSError:
                continue
    return result


def _agent_class_name(agent_file: str) -> str:
    """Derive the expected class name for an agent file.

    E.g. 'self-diagnostic.agent.ts' -> 'SelfDiagnosticAgent'.
    """
    stem = agent_file.replace(".agent.ts", "")
    parts = stem.split("-")
    return "".join(p.capitalize() for p in parts) + "Agent"


def _extract_agent_class_name(content: str, fallback_agent_file: str) -> str:
    """Extract exported class name from agent source, with safe fallback."""
    match = re.search(r"export\s+class\s+([A-Za-z_][A-Za-z0-9_]*)", content)
    if match:
        return match.group(1)
    return _agent_class_name(fallback_agent_file)


def _agent_registered_name(agent_file: str) -> str:
    """Derive the registry name for an agent file.

    Based on the naming convention, filenames use kebab-case matching the
    registered name (e.g. 'self-diagnostic.agent.ts' -> 'self-diagnostic').
    """
    return agent_file.replace(".agent.ts", "")


def analyze_agents(base_path: str) -> dict:
    """Analyze agent system health."""
    agents_dir = os.path.join(base_path, "src", "agents")
    agents = []
    test_contents = _load_test_file_contents(base_path)

    if os.path.isdir(agents_dir):
        for f in os.listdir(agents_dir):
            if f.endswith(".agent.ts") and f != "base.agent.ts":
                filepath = os.path.join(agents_dir, f)
                with open(filepath, encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()

                # Link agent to test files by searching for its class name or
                # registered name as a whole token. This is a conservative
                # heuristic, not a coverage metric.
                class_name = _extract_agent_class_name(content, f)
                registry_name = _agent_registered_name(f)
                tested_in = sorted(
                    name
                    for name, body in test_contents.items()
                    if class_name in body or f"'{registry_name}'" in body
                )

                agents.append({
                    "file": f,
                    "lines": count_lines(filepath),
                    "has_error_handling": "try {" in content and "catch" in content,
                    "has_logging": "logExecution" in content,
                    "has_llm": "callLLM" in content,
                    "tested_in": tested_in,
                })

    return {
        "total_agents": len(agents),
        "agents": agents,
    }


def analyze_workflows(base_path: str) -> dict:
    """Analyze CI/CD workflow coverage."""
    workflows_dir = os.path.join(base_path, ".github", "workflows")
    workflows = []

    if os.path.isdir(workflows_dir):
        for f in os.listdir(workflows_dir):
            if f.endswith(".yml") or f.endswith(".yaml"):
                workflows.append(f)

    has_test_workflow = any("test" in w.lower() for w in workflows)
    has_security_workflow = any("security" in w.lower() for w in workflows)
    has_lint_workflow = any("ruff" in w.lower() or "lint" in w.lower() for w in workflows)

    return {
        "total_workflows": len(workflows),
        "workflows": workflows,
        "has_test_workflow": has_test_workflow,
        "has_security_workflow": has_security_workflow,
        "has_lint_workflow": has_lint_workflow,
    }


def compute_health_score(tests: dict, agents: dict, workflows: dict) -> int:
    """Compute overall codebase health score 0-100."""
    score = 50  # Base score

    # Test coverage (max +25)
    if tests["test_files"] >= 5:
        score += 15
    elif tests["test_files"] >= 3:
        score += 8
    if tests["test_cases"] >= 20:
        score += 10
    elif tests["test_cases"] >= 10:
        score += 5

    # Agent quality (max +15)
    if agents["total_agents"] >= 5:
        score += 5
    agents_with_logging = sum(1 for a in agents["agents"] if a["has_logging"])
    if agents_with_logging == agents["total_agents"] and agents["total_agents"] > 0:
        score += 5
    agents_with_errors = sum(1 for a in agents["agents"] if a["has_error_handling"])
    if agents_with_errors == agents["total_agents"] and agents["total_agents"] > 0:
        score += 5

    # CI/CD (max +10)
    if workflows["has_test_workflow"]:
        score += 5
    if workflows["has_security_workflow"]:
        score += 3
    if workflows["has_lint_workflow"]:
        score += 2

    return min(100, max(0, score))


def generate_report(base_path: str) -> dict:
    """Generate the full codebase health report."""
    tests = analyze_tests(base_path)
    agents = analyze_agents(base_path)
    workflows = analyze_workflows(base_path)
    health_score = compute_health_score(tests, agents, workflows)

    ts_files = count_files(os.path.join(base_path, "src"), (".ts",))
    py_files = count_files(os.path.join(base_path, "scripts"), (".py",))

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "health_score": health_score,
        "summary": {
            "typescript_source_files": ts_files,
            "python_script_files": py_files,
        },
        "tests": tests,
        "agents": agents,
        "workflows": workflows,
        "recommendations": [],
    }

    # Generate recommendations
    if tests["test_files"] < 5:
        report["recommendations"].append({
            "priority": "critical",
            "action": "Add more test files - currently only "
            f"{tests['test_files']} test files exist",
        })

    if not workflows["has_test_workflow"]:
        report["recommendations"].append({
            "priority": "high",
            "action": "Add CI/CD test workflow (test-on-pr.yml)",
        })

    for agent in agents["agents"]:
        if not agent["has_error_handling"]:
            report["recommendations"].append({
                "priority": "high",
                "action": f"Add error handling to {agent['file']}",
            })
        if not agent["tested_in"]:
            report["recommendations"].append({
                "priority": "medium",
                "action": f"Add test coverage referencing {agent['file']} "
                f"(no test file imports its class or registered name)",
            })

    return report


def format_markdown(report: dict) -> str:
    """Format report as markdown."""
    lines = [
        "# Codebase Health Report",
        "",
        f"**Generated:** {report['generated_at']}",
        f"**Health Score:** {report['health_score']}/100",
        "",
        "## Summary",
        "",
        f"- TypeScript source files: {report['summary']['typescript_source_files']}",
        f"- Python script files: {report['summary']['python_script_files']}",
        f"- Test files: {report['tests']['test_files']}",
        f"- Test cases: {report['tests']['test_cases']}",
        f"- Active agents: {report['agents']['total_agents']}",
        f"- CI/CD workflows: {report['workflows']['total_workflows']}",
        "",
        "## Agents",
        "",
        "| Agent | Lines | Error Handling | Logging | LLM | Tested In |",
        "|-------|-------|---------------|---------|-----|-----------|",
    ]

    for agent in report["agents"]["agents"]:
        eh = "yes" if agent["has_error_handling"] else "NO"
        log = "yes" if agent["has_logging"] else "NO"
        llm = "yes" if agent["has_llm"] else "no"
        tested = ", ".join(agent["tested_in"]) if agent["tested_in"] else "none"
        lines.append(
            f"| {agent['file']} | {agent['lines']} | {eh} | {log} | {llm} | {tested} |"
        )

    lines.extend([
        "",
        "## Recommendations",
        "",
    ])

    for rec in report["recommendations"]:
        lines.append(f"- **[{rec['priority'].upper()}]** {rec['action']}")

    return "\n".join(lines)


def _get_arg(flag: str) -> str | None:
    """Return the value following `flag` in sys.argv, or None if absent."""
    if flag in sys.argv:
        idx = sys.argv.index(flag)
        if idx + 1 < len(sys.argv):
            return sys.argv[idx + 1]
    return None


def main() -> None:
    """Run codebase health analysis."""
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    output_format = _get_arg("--output") or "markdown"
    output_file = _get_arg("--output-file")
    no_write = "--no-write" in sys.argv

    report = generate_report(base_path)

    if output_format == "json":
        print(json.dumps(report, indent=2))
    else:
        print(format_markdown(report))

    # Only write to disk when explicitly requested. Default is stdout-only to
    # avoid creating untracked files in the working tree.
    if output_file and not no_write:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

    sys.exit(0 if report["health_score"] >= 60 else 1)


if __name__ == "__main__":
    main()
