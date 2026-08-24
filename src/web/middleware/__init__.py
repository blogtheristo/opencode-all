"""
Web Security Middleware

Flask middleware for web application security.
"""

from .csrf_protection_OLD import ModernCSRFProtection, csrf_protection_middleware
from .security_headers import security_headers_middleware

__all__ = [
    "csrf_protection_middleware",
    "ModernCSRFProtection",
    "security_headers_middleware",
]
