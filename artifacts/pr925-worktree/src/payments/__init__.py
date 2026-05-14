"""
DWS IQ 6 Payment Integration Module

Provides payment processing via:
- Revolut Business (EU customers, low fees)
- PayPal Business (Global customers)

Supports subscription management for:
- Pro Plan: €499/month
- Enterprise Plan: €2,499/month
"""

from src.payments.config import PaymentConfig, SubscriptionPlan
from src.payments.models import (
    CreateSubscriptionRequest,
    PaymentEvent,
    SubscriptionResponse,
    SubscriptionStatus,
    WebhookPayload,
)
from src.payments.paypal import PayPalClient
from src.payments.revolut import RevolutClient
from src.payments.subscription_service import SubscriptionService

__all__ = [
    # Config
    "PaymentConfig",
    "SubscriptionPlan",
    # Clients
    "RevolutClient",
    "PayPalClient",
    # Service
    "SubscriptionService",
    # Models
    "CreateSubscriptionRequest",
    "SubscriptionResponse",
    "SubscriptionStatus",
    "PaymentEvent",
    "WebhookPayload",
]
