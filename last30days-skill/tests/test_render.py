"""Tests for render module."""

import sys
import unittest
from pathlib import Path

# Add lib to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from lib import render, schema


class TestRenderCompact(unittest.TestCase):
    def test_renders_basic_report(self):
        report = schema.Report(
            topic="test topic",
            range_from="2026-01-01",
            range_to="2026-01-31",
            generated_at="2026-01-31T12:00:00Z",
            mode="both",
            openai_model_used="gpt-5.2",
            xai_model_used="grok-4-latest",
        )

        result = render.render_compact(report)

        assert "test topic" in result
        assert "2026-01-01" in result
        assert "both" in result
        assert "gpt-5.2" in result

    def test_renders_reddit_items(self):
        report = schema.Report(
            topic="test",
            range_from="2026-01-01",
            range_to="2026-01-31",
            generated_at="2026-01-31T12:00:00Z",
            mode="reddit-only",
            reddit=[
                schema.RedditItem(
                    id="R1",
                    title="Test Thread",
                    url="https://reddit.com/r/test/1",
                    subreddit="test",
                    date="2026-01-15",
                    date_confidence="high",
                    score=85,
                    why_relevant="Very relevant",
                )
            ],
        )

        result = render.render_compact(report)

        assert "R1" in result
        assert "Test Thread" in result
        assert "r/test" in result

    def test_shows_coverage_tip_for_reddit_only(self):
        report = schema.Report(
            topic="test",
            range_from="2026-01-01",
            range_to="2026-01-31",
            generated_at="2026-01-31T12:00:00Z",
            mode="reddit-only",
        )

        result = render.render_compact(report)

        assert "xAI key" in result


class TestRenderContextSnippet(unittest.TestCase):
    def test_renders_snippet(self):
        report = schema.Report(
            topic="Claude Code Skills",
            range_from="2026-01-01",
            range_to="2026-01-31",
            generated_at="2026-01-31T12:00:00Z",
            mode="both",
        )

        result = render.render_context_snippet(report)

        assert "Claude Code Skills" in result
        assert "Last 30 Days" in result


class TestRenderFullReport(unittest.TestCase):
    def test_renders_full_report(self):
        report = schema.Report(
            topic="test topic",
            range_from="2026-01-01",
            range_to="2026-01-31",
            generated_at="2026-01-31T12:00:00Z",
            mode="both",
            openai_model_used="gpt-5.2",
            xai_model_used="grok-4-latest",
        )

        result = render.render_full_report(report)

        assert "# test topic" in result
        assert "## Models Used" in result
        assert "gpt-5.2" in result


class TestGetContextPath(unittest.TestCase):
    def test_returns_path_string(self):
        result = render.get_context_path()
        assert isinstance(result, str)
        assert "last30days.context.md" in result


if __name__ == "__main__":
    unittest.main()
