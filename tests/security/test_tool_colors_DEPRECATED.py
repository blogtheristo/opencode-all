"""
Tests for MCP Colors Framework

Based on Simon Willison: "MCP Colors" (2025-11-04)
"""

from src.mcp.security.tool_colors_OLD import MCPToolRegistry, ToolColor


class TestMCPToolColors:
    """Test MCP tool color classification and validation."""

    def test_red_tools_classified(self):
        """RED tools (untrusted input) should be classified correctly."""
        assert MCPToolRegistry.get_tool_color("web_fetch") == ToolColor.RED
        assert MCPToolRegistry.get_tool_color("pdf_read") == ToolColor.RED
        assert MCPToolRegistry.get_tool_color("email_inbox_read") == ToolColor.RED

    def test_blue_tools_classified(self):
        """BLUE tools (critical actions) should be classified correctly."""
        assert MCPToolRegistry.get_tool_color("database_write") == ToolColor.BLUE
        assert MCPToolRegistry.get_tool_color("email_send") == ToolColor.BLUE
        assert MCPToolRegistry.get_tool_color("file_write") == ToolColor.BLUE

    def test_green_tools_classified(self):
        """GREEN tools (safe) should be classified correctly."""
        assert MCPToolRegistry.get_tool_color("calculator") == ToolColor.GREEN
        assert MCPToolRegistry.get_tool_color("date_time") == ToolColor.GREEN

    def test_unknown_tool_defaults_to_green(self):
        """Unknown tools should default to GREEN (safe)."""
        assert MCPToolRegistry.get_tool_color("unknown_tool") == ToolColor.GREEN

    def test_red_blue_combination_blocked(self):
        """Combining RED + BLUE tools should be blocked (Lethal Trifecta)."""
        tools = {"web_fetch", "database_write"}
        is_safe, reason = MCPToolRegistry.validate_tool_combination(tools)

        assert not is_safe
        assert "LETHAL TRIFECTA" in reason
        assert "web_fetch" in reason
        assert "database_write" in reason

    def test_red_green_combination_allowed(self):
        """Combining RED + GREEN tools should be allowed."""
        tools = {"web_fetch", "calculator"}
        is_safe, reason = MCPToolRegistry.validate_tool_combination(tools)

        assert is_safe
        assert reason == ""

    def test_blue_green_combination_allowed(self):
        """Combining BLUE + GREEN tools should be allowed."""
        tools = {"database_write", "date_time"}
        is_safe, reason = MCPToolRegistry.validate_tool_combination(tools)

        assert is_safe
        assert reason == ""

    def test_multiple_red_tools_allowed(self):
        """Multiple RED tools together should be allowed."""
        tools = {"web_fetch", "pdf_read", "email_inbox_read"}
        is_safe, reason = MCPToolRegistry.validate_tool_combination(tools)

        assert is_safe

    def test_multiple_blue_tools_allowed(self):
        """Multiple BLUE tools together should be allowed."""
        tools = {"database_write", "email_send", "file_write"}
        is_safe, reason = MCPToolRegistry.validate_tool_combination(tools)

        assert is_safe

    def test_safe_alternatives_suggested(self):
        """Safe alternatives should be suggested for dangerous combinations."""
        tools = {"web_fetch", "database_write", "email_send"}
        alternatives = MCPToolRegistry.get_safe_tool_alternatives(tools)

        assert "database_write" in alternatives
        assert "approval" in alternatives["database_write"].lower()

        assert "email_send" in alternatives
        assert "draft" in alternatives["email_send"].lower()

    def test_register_custom_tool(self):
        """Custom tools can be registered with color classification."""
        MCPToolRegistry.register_tool("custom_api_fetch", ToolColor.RED)
        assert MCPToolRegistry.get_tool_color("custom_api_fetch") == ToolColor.RED

        MCPToolRegistry.register_tool("custom_db_insert", ToolColor.BLUE)
        assert MCPToolRegistry.get_tool_color("custom_db_insert") == ToolColor.BLUE
