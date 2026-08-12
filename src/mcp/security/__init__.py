"""
MCP Security Module

Implements security controls for Model Context Protocol (MCP) agents.
Based on Simon Willison's security research (simonwillison.net/tags/security/).
"""

from .domain_validator import DomainValidator
from .image_sanitizer_OLD import ImagePromptInjectionDetector
from .tool_colors_OLD import MCPToolRegistry, ToolColor

__all__ = [
    "DomainValidator",
    "ImagePromptInjectionDetector",
    "ToolColor",
    "MCPToolRegistry",
]
