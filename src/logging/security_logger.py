"""
Security Event Logging

Centralized logging for security events based on Simon Willison's research.

Log Categories:
- Prompt injection attempts
- Data exfiltration attempts
- CSRF attacks
- SQL injection attempts
- Open redirect attempts
- Cross-agent privilege escalation
- Authentication failures
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any


class SecurityLogger:
    """
    Centralized security event logger.
    """

    def __init__(self, log_dir: Path | None = None):
        """
        Initialize security logger.

        Args:
            log_dir: Directory for log files (default: logs/security)
        """
        if log_dir is None:
            log_dir = Path("logs/security")

        self.log_dir = log_dir
        self.log_dir.mkdir(parents=True, exist_ok=True)

        # Setup logger
        self.logger = logging.getLogger("dws6.security")
        self.logger.setLevel(logging.INFO)

        # File handler for security events
        log_file = self.log_dir / f"security_{datetime.now().strftime('%Y%m%d')}.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)

        # JSON formatter for structured logging
        formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "event": "%(message)s"}'
        )
        file_handler.setFormatter(formatter)

        self.logger.addHandler(file_handler)

        # Console handler for critical events
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.WARNING)
        console_handler.setFormatter(
            logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        )
        self.logger.addHandler(console_handler)

    def log_event(
        self,
        event_type: str,
        severity: str,
        details: dict[str, Any],
        customer_id: str | None = None,
    ) -> None:
        """
        Log security event.

        Args:
            event_type: Type of security event
            severity: Severity level (INFO, WARNING, ERROR, CRITICAL)
            details: Event details
            customer_id: Optional customer ID
        """
        event = {
            "event_type": event_type,
            "severity": severity,
            "customer_id": customer_id,
            "details": details,
            "timestamp": datetime.utcnow().isoformat(),
        }

        log_message = json.dumps(event)

        if severity == "CRITICAL":
            self.logger.critical(log_message)
        elif severity == "ERROR":
            self.logger.error(log_message)
        elif severity == "WARNING":
            self.logger.warning(log_message)
        else:
            self.logger.info(log_message)

    def log_prompt_injection_attempt(
        self,
        source: str,
        content: str,
        patterns_matched: list,
        customer_id: str | None = None,
    ) -> None:
        """Log prompt injection attempt."""
        self.log_event(
            event_type="PROMPT_INJECTION_ATTEMPT",
            severity="WARNING",
            details={
                "source": source,
                "content_preview": content[:200],
                "patterns_matched": patterns_matched,
                "reference": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
            },
            customer_id=customer_id,
        )

    def log_data_exfiltration_attempt(
        self, blocked_url: str, reason: str, customer_id: str | None = None
    ) -> None:
        """Log data exfiltration attempt."""
        self.log_event(
            event_type="DATA_EXFILTRATION_ATTEMPT",
            severity="CRITICAL",
            details={
                "blocked_url": blocked_url,
                "reason": reason,
                "reference": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
            },
            customer_id=customer_id,
        )

    def log_csrf_attempt(
        self, ip_address: str, user_agent: str, path: str, reason: str
    ) -> None:
        """Log CSRF attack attempt."""
        self.log_event(
            event_type="CSRF_ATTEMPT",
            severity="WARNING",
            details={
                "ip_address": ip_address,
                "user_agent": user_agent,
                "path": path,
                "reason": reason,
                "reference": "https://simonwillison.net/2025/Oct/15/csrf-in-go/",
            },
        )

    def log_sql_injection_attempt(
        self,
        query_preview: str,
        vulnerability_type: str,
        customer_id: str | None = None,
    ) -> None:
        """Log SQL injection attempt."""
        self.log_event(
            event_type="SQL_INJECTION_ATTEMPT",
            severity="CRITICAL",
            details={
                "query_preview": query_preview,
                "vulnerability_type": vulnerability_type,
                "reference": "https://simonwillison.net/2025/Dec/18/posthog-vulnerability/",
            },
            customer_id=customer_id,
        )

    def log_open_redirect_attempt(
        self, redirect_url: str, customer_id: str | None = None
    ) -> None:
        """Log open redirect attempt."""
        self.log_event(
            event_type="OPEN_REDIRECT_ATTEMPT",
            severity="WARNING",
            details={
                "redirect_url": redirect_url,
                "reference": "https://simonwillison.net/2025/Nov/5/datasette-open-redirect/",
            },
            customer_id=customer_id,
        )

    def log_privilege_escalation_attempt(
        self, operation: str, path: str, customer_id: str | None = None
    ) -> None:
        """Log cross-agent privilege escalation attempt."""
        self.log_event(
            event_type="PRIVILEGE_ESCALATION_ATTEMPT",
            severity="CRITICAL",
            details={
                "operation": operation,
                "path": path,
                "reference": "https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/",
            },
            customer_id=customer_id,
        )

    def log_auth_failure(self, username: str, ip_address: str, reason: str) -> None:
        """Log authentication failure."""
        self.log_event(
            event_type="AUTH_FAILURE",
            severity="INFO",
            details={"username": username, "ip_address": ip_address, "reason": reason},
        )

    def log_config_modification(
        self, key: str, old_value: Any, new_value: Any, authorized_by: str
    ) -> None:
        """Log configuration modification."""
        self.log_event(
            event_type="CONFIG_MODIFICATION",
            severity="INFO",
            details={
                "key": key,
                "old_value": str(old_value),
                "new_value": str(new_value),
                "authorized_by": authorized_by,
            },
        )


# Global security logger instance
_security_logger: SecurityLogger | None = None


def get_security_logger() -> SecurityLogger:
    """Get global security logger instance."""
    global _security_logger
    if _security_logger is None:
        _security_logger = SecurityLogger()
    return _security_logger


# Convenience functions
def log_prompt_injection_attempt(*args, **kwargs):
    """Log prompt injection attempt."""
    get_security_logger().log_prompt_injection_attempt(*args, **kwargs)


def log_data_exfiltration_attempt(*args, **kwargs):
    """Log data exfiltration attempt."""
    get_security_logger().log_data_exfiltration_attempt(*args, **kwargs)


def log_csrf_attempt(*args, **kwargs):
    """Log CSRF attempt."""
    get_security_logger().log_csrf_attempt(*args, **kwargs)


def log_sql_injection_attempt(*args, **kwargs):
    """Log SQL injection attempt."""
    get_security_logger().log_sql_injection_attempt(*args, **kwargs)


def log_open_redirect_attempt(*args, **kwargs):
    """Log open redirect attempt."""
    get_security_logger().log_open_redirect_attempt(*args, **kwargs)


def log_privilege_escalation_attempt(*args, **kwargs):
    """Log privilege escalation attempt."""
    get_security_logger().log_privilege_escalation_attempt(*args, **kwargs)
