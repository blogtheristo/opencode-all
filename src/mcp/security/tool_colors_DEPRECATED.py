"""
MCP Colors Framework

Classify every tool with a color to prevent "The Lethal Trifecta":
- RED: Exposes agent to untrusted instructions
- BLUE: Performs critical actions
- GREEN: Safe (neither red nor blue)

Based on: Tim Kellogg's MCP Colors framework
Reference: https://simonwillison.net/2025/Nov/4/mcp-colors/

Key Rule: NEVER mix RED + BLUE tools in the same agent session.
"""

import logging
from enum import Enum

logger = logging.getLogger(__name__)


class ToolColor(Enum):
    """
    MCP tool classification for prompt injection risk.
    """

    RED = "red"  # Exposes to untrusted input
    BLUE = "blue"  # Performs critical actions
    GREEN = "green"  # Safe (neither red nor blue)


class MCPToolRegistry:
    """
    Registry of all MCP tools with risk classifications.
    Prevents mixing RED + BLUE in same agent session.
    """

    TOOL_CLASSIFICATIONS: dict[str, ToolColor] = {
        # RED: Untrusted Input Sources
        "web_fetch": ToolColor.RED,
        "pdf_read": ToolColor.RED,
        "email_inbox_read": ToolColor.RED,
        "slack_channel_history": ToolColor.RED,
        "iot_sensor_data": ToolColor.RED,
        "document_read": ToolColor.RED,
        "web_scrape": ToolColor.RED,
        "api_fetch": ToolColor.RED,
        # BLUE: Critical Actions
        "database_write": ToolColor.BLUE,
        "email_send": ToolColor.BLUE,
        "slack_message_post": ToolColor.BLUE,
        "file_write": ToolColor.BLUE,
        "file_delete": ToolColor.BLUE,
        "payment_initiate": ToolColor.BLUE,
        "user_create": ToolColor.BLUE,
        "permission_grant": ToolColor.BLUE,
        "system_command": ToolColor.BLUE,
        # GREEN: Safe Operations
        "date_time": ToolColor.GREEN,
        "calculator": ToolColor.GREEN,
        "unit_converter": ToolColor.GREEN,
        "database_read_restricted": ToolColor.GREEN,  # Read-only with RLS
        "file_read_restricted": ToolColor.GREEN,  # Read-only from safe paths
        "weather_api": ToolColor.GREEN,  # Read-only public data
    }

    @classmethod
    def validate_tool_combination(cls, tools: set[str]) -> tuple[bool, str]:
        """
        Validate that tool combination doesn't mix RED + BLUE.

        Args:
            tools: Set of tool names to validate

        Returns:
            (is_safe, reason_if_unsafe)
        """
        colors = set()
        red_tools = []
        blue_tools = []

        for tool in tools:
            if tool in cls.TOOL_CLASSIFICATIONS:
                color = cls.TOOL_CLASSIFICATIONS[tool]
                colors.add(color)

                if color == ToolColor.RED:
                    red_tools.append(tool)
                elif color == ToolColor.BLUE:
                    blue_tools.append(tool)

        if ToolColor.RED in colors and ToolColor.BLUE in colors:
            logger.error(
                f"LETHAL TRIFECTA DETECTED! RED tools: {red_tools}, "
                f"BLUE tools: {blue_tools}"
            )
            return False, (
                "LETHAL TRIFECTA DETECTED!\n"
                f"RED tools (untrusted input): {', '.join(red_tools)}\n"
                f"BLUE tools (critical actions): {', '.join(blue_tools)}\n\n"
                "Cannot mix RED tools (untrusted input) with BLUE tools (critical actions).\n"
                "This creates data exfiltration risk via prompt injection.\n\n"
                "Reference: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"
            )

        return True, ""

    @classmethod
    def get_safe_tool_alternatives(cls, requested_tools: set[str]) -> dict[str, str]:
        """
        Suggest safe alternatives when dangerous combination detected.

        Args:
            requested_tools: Set of requested tool names

        Returns:
            Dictionary of tool -> alternative suggestion
        """
        alternatives = {}

        if "database_write" in requested_tools:
            alternatives["database_write"] = (
                "Use 'database_write_approval_required' instead. "
                "This tool requires human approval before executing writes."
            )

        if "email_send" in requested_tools:
            alternatives["email_send"] = (
                "Use 'email_draft' instead. "
                "This tool creates draft emails for human review before sending."
            )

        if "file_write" in requested_tools:
            alternatives["file_write"] = (
                "Use 'file_write_staged' instead. "
                "This tool stages file changes for human review before committing."
            )

        if "slack_message_post" in requested_tools:
            alternatives["slack_message_post"] = (
                "Use 'slack_draft_message' instead. "
                "This tool creates draft messages for human review before posting."
            )

        if "payment_initiate" in requested_tools:
            alternatives["payment_initiate"] = (
                "Use 'payment_prepare' instead. "
                "This tool prepares payment details for human approval before execution."
            )

        return alternatives

    @classmethod
    def register_tool(cls, tool_name: str, color: ToolColor) -> None:
        """
        Register a new tool with its color classification.

        Args:
            tool_name: Name of the tool
            color: ToolColor classification
        """
        if tool_name in cls.TOOL_CLASSIFICATIONS:
            logger.warning(f"Overwriting existing tool classification: {tool_name}")

        cls.TOOL_CLASSIFICATIONS[tool_name] = color
        logger.info(f"Registered tool: {tool_name} as {color.value}")

    @classmethod
    def get_tool_color(cls, tool_name: str) -> ToolColor:
        """
        Get the color classification for a tool.

        Args:
            tool_name: Name of the tool

        Returns:
            ToolColor classification (defaults to GREEN if unknown)
        """
        return cls.TOOL_CLASSIFICATIONS.get(tool_name, ToolColor.GREEN)
