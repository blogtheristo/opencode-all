"""
ZenFree: Free Runtime Protection Alternative to Aikido Zen

Drop-in replacement for development and free-tier deployments.
Same interface as aikido_zen, no API calls, no licensing costs.

Features:
- Pattern-based threat detection (SQL injection, NoSQL, command injection, etc.)
- JSONL attack logging for correlation with monthly audits
- Optional blocking mode for production
- Flask middleware support
- Zero external dependencies
"""

import json
import logging
import re
import urllib.parse
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)


def _compile(patterns: list[str]) -> list[re.Pattern]:
    """Compile regex patterns with case-insensitive flag"""
    return [re.compile(p, re.IGNORECASE) for p in patterns]


class ZenFree:
    """Free runtime protection - drop-in replacement for Aikido Zen

    Detection Mode (default): Logs threats without blocking
    Blocking Mode (optional): Returns 403 on detected threats

    Attack logs saved to security-attacks.jsonl for correlation with monthly audits
    """

    PATTERNS = {
        "sql_injection": _compile(
            [
                r"\bunion\b.*\bselect\b",
                r"\bor\b\s+[\d'\"]+\s*=\s*[\d'\"]+",
                r";\s*drop\s+table",
                r"--\s*$",
                r"/\*.*\*/",
                r"\bexec\b\s*\(",
                r"\bxp_cmdshell\b",
                r";\s*shutdown",
                r"'\s*or\s+'1'\s*=\s*'1",
            ]
        ),
        "nosql_injection": _compile(
            [
                r"\$ne|\$gt|\$lt|\$gte|\$lte|\$regex|\$where",
                r"{\s*\$",
                r"\[\s*\$ne\s*\]",
                r"{\s*\$gt",
                r"function\s*\(",
            ]
        ),
        "command_injection": _compile(
            [
                r"[;&|`$(){}<>]",
                r"\$\(.*\)",
                r"`.*`",
                r"(&&|\|\|)",
                r">\s*/dev/",
                r"/bin/(?:ba)?sh",
                r"\bnc\s+-",
                r"\b(wget|curl)\s+https?://",
            ]
        ),
        "path_traversal": _compile(
            [
                r"\.\./",
                r"\.\.\\",
                r"%2e%2e[/\\]",
                r"\.\.%2f",
                r"/etc/passwd",
                r"/windows/system",
                r"\.\.;",
            ]
        ),
        "ssrf": _compile(
            [
                r"\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)\b",
                r"\b169\.254\.169\.254\b",
                r"\b192\.168\.\d{1,3}\.\d{1,3}\b",
                r"\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
                r"\b172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}\b",
                r"\b(file|dict|gopher)://",
            ]
        ),
    }

    def __init__(
        self,
        block: bool = False,
        debug: bool = False,
        log_file: str = "security-attacks.jsonl",
    ):
        """
        Initialize ZenFree protection

        Args:
            block: If True, blocks requests with threats (403). Default: False (detection mode)
            debug: If True, logs more verbose information
            log_file: Path to JSONL file for attack logging
        """
        self.block = block
        self.debug = debug
        self.attack_log = log_file
        self.threat_count = 0

        level = logging.DEBUG if debug else logging.INFO
        logger.setLevel(level)
        logger.info(
            "✅ ZenFree initialized (block=%s, debug=%s, log_file=%s)",
            block,
            debug,
            log_file,
        )

    @staticmethod
    def _normalize(value: str) -> str:
        """Normalize value for pattern matching

        - URL decode once
        - Remove null bytes
        - Collapse whitespace
        - Convert to lowercase
        """
        if not isinstance(value, str):
            return ""
        value = urllib.parse.unquote(value)
        value = value.replace("\x00", "")
        value = " ".join(value.split())
        return value.lower()

    def _check(self, value: str, threat_type: str) -> bool:
        """Check if string matches threat patterns"""
        if not isinstance(value, str) or not value:
            return False

        value = self._normalize(value)
        for pattern in self.PATTERNS.get(threat_type, []):
            if pattern.search(value):
                if self.debug:
                    logger.debug(
                        f"Threat detected: {threat_type} | Pattern: {pattern.pattern}"
                    )
                return True
        return False

    def _scan_dict(self, data: Any, path: str = "") -> list[dict[str, Any]]:
        """Recursively scan dict/list for threats"""
        threats = []

        if isinstance(data, dict):
            for key, val in data.items():
                child_path = f"{path}.{key}" if path else str(key)
                threats.extend(self._scan_dict(val, child_path))

        elif isinstance(data, list):
            for i, val in enumerate(data):
                child_path = f"{path}[{i}]" if path else f"[{i}]"
                threats.extend(self._scan_dict(val, child_path))

        elif isinstance(data, str):
            for threat_type in self.PATTERNS:
                if self._check(data, threat_type):
                    threats.append(
                        {
                            "type": threat_type,
                            "path": path or "<root>",
                            "value": data[:100],  # First 100 chars
                            "severity": "high",
                        }
                    )

        return threats

    def _log_attack(
        self, threats: list[dict], request_data: dict | None = None
    ) -> None:
        """Log attack to JSONL file for monthly correlation

        Format compatible with correlate_security_data.py
        """
        payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "threats": threats,
            "request": request_data,
            "source": "zen_free",
        }

        try:
            with open(self.attack_log, "a", encoding="utf-8") as f:
                f.write(json.dumps(payload) + "\n")
            self.threat_count += 1
        except Exception as exc:
            logger.exception("Failed to write attack log: %s", exc)

    def scan(self, data: Any, context: dict | None = None) -> list[dict]:
        """Manual threat scan - returns threats without blocking

        Args:
            data: Data to scan (dict, list, or string)
            context: Additional context (endpoint, method, user, etc.)

        Returns:
            List of detected threats
        """
        threats = self._scan_dict(data)

        if threats:
            logger.warning("Threats detected: %s | Context: %s", threats, context)
            self._log_attack(threats, context)

        return threats

    def check_and_block(self, data: Any, context: dict | None = None) -> bool:
        """Check data and block if threats detected (only if block=True)

        Args:
            data: Data to scan
            context: Additional context

        Returns:
            True if threats detected and blocking is enabled

        Raises:
            SecurityError: If threats detected and blocking is enabled
        """
        threats = self._scan_dict(data)

        if threats:
            logger.warning("Threats detected: %s | Context: %s", threats, context)
            self._log_attack(threats, context)

            if self.block:
                logger.error("Blocking request due to threats: %s", threats)
                raise SecurityError(f"Security threat detected: {threats[0]['type']}")

            return True

        return False

    def middleware(self, app: Any) -> Any:
        """Flask/FastAPI middleware support - drop-in replacement

        Usage with Flask:
            from flask import Flask
            app = Flask(__name__)
            zen = ZenFree(block=False, debug=True)
            app = zen.middleware(app)

        Usage with FastAPI:
            from fastapi import FastAPI
            app = FastAPI()
            zen = ZenFree(block=False, debug=True)
            zen.middleware_fastapi(app)
        """
        try:
            from flask import abort, request
        except ImportError as exc:
            raise RuntimeError("Flask is required for ZenFree.middleware()") from exc

        @app.before_request
        def check_request():
            """Check all request data for threats"""
            data = {
                **request.args.to_dict(flat=False),
                **request.form.to_dict(flat=False),
            }

            if request.is_json:
                data["json"] = request.get_json(silent=True)

            threats = self._scan_dict(data)

            if threats:
                context = {
                    "path": request.path,
                    "method": request.method,
                    "remote_addr": request.remote_addr,
                }
                logger.warning("Threats detected: %s | %s", threats, context)
                self._log_attack(threats, context)

                if self.block:
                    abort(403, description="Security threat detected")

        return app

    def middleware_fastapi(self, app: Any) -> Any:
        """FastAPI middleware support"""
        try:
            from fastapi import Request
            from starlette.middleware.base import BaseHTTPMiddleware
            from starlette.responses import JSONResponse
        except ImportError as exc:
            raise RuntimeError("FastAPI is required") from exc

        class SecurityMiddleware(BaseHTTPMiddleware):
            def __init__(self, app, zen_instance):
                super().__init__(app)
                self.zen = zen_instance

            async def dispatch(self, request: Request, call_next):
                # Extract request data
                data = dict(request.query_params)

                try:
                    if request.method in ["POST", "PUT", "PATCH"]:
                        body = await request.body()
                        if body:
                            data["body"] = body.decode("utf-8", errors="ignore")
                except Exception:
                    pass

                # Check for threats
                threats = self.zen._scan_dict(data)

                if threats:
                    context = {
                        "path": request.url.path,
                        "method": request.method,
                        "client": request.client.host if request.client else None,
                    }
                    logger.warning("Threats detected: %s | %s", threats, context)
                    self.zen._log_attack(threats, context)

                    if self.zen.block:
                        return JSONResponse(
                            {"error": "Security threat detected"}, status_code=403
                        )

                return await call_next(request)

        app.add_middleware(SecurityMiddleware, zen_instance=self)
        return app

    def get_stats(self) -> dict[str, Any]:
        """Get protection statistics"""
        return {
            "threat_count": self.threat_count,
            "blocking_enabled": self.block,
            "debug_enabled": self.debug,
            "log_file": self.attack_log,
            "patterns": {k: len(v) for k, v in self.PATTERNS.items()},
        }


class SecurityError(Exception):
    """Raised when threat is detected and blocking is enabled"""


# Global instance for module-level API
_zen_instance: ZenFree | None = None


def protect(block: bool = False, debug: bool = False) -> ZenFree:
    """Initialize protection - same interface as aikido_zen.protect()

    Usage:
        import zen_free as aikido_zen
        aikido_zen.protect()

    This creates a drop-in replacement for:
        import aikido_zen
        aikido_zen.protect()
    """
    global _zen_instance
    _zen_instance = ZenFree(block=block, debug=debug)
    logger.info("✅ ZenFree protection enabled (block=%s)", block)
    return _zen_instance


def get_instance() -> ZenFree | None:
    """Get the current ZenFree instance"""
    return _zen_instance
