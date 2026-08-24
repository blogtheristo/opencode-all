"""
Payment Models Module

Pydantic models for payment requests, responses, and webhooks.
"""

from datetime import datetime
from decimal import Decimal
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class SubscriptionStatus(StrEnum):
    """Subscription status enum"""

    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PAYMENT_FAILED = "payment_failed"


class PaymentProvider(StrEnum):
    """Payment provider enum"""

    REVOLUT = "revolut"
    PAYPAL = "paypal"


class PlanTier(StrEnum):
    """Subscription plan tier"""

    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


# =============================================================================
# Request Models
# =============================================================================


class CreateSubscriptionRequest(BaseModel):
    """Request to create a new subscription"""

    user_email: EmailStr
    user_id: str = Field(..., min_length=1)
    plan: PlanTier
    payment_provider: PaymentProvider
    metadata: dict[str, Any] | None = None


class CancelSubscriptionRequest(BaseModel):
    """Request to cancel a subscription"""

    subscription_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    reason: str | None = None


# =============================================================================
# Response Models
# =============================================================================


class PaymentUrlResponse(BaseModel):
    """Response containing payment redirect URL"""

    payment_url: str
    provider: PaymentProvider
    plan: PlanTier
    amount_eur: Decimal
    expires_at: datetime | None = None


class SubscriptionResponse(BaseModel):
    """Subscription details response"""

    id: str
    user_id: str
    plan: PlanTier
    status: SubscriptionStatus
    payment_provider: PaymentProvider | None
    provider_subscription_id: str | None
    monthly_amount: Decimal
    currency: str = "EUR"
    start_date: datetime | None
    end_date: datetime | None
    next_billing_date: datetime | None
    created_at: datetime
    updated_at: datetime


class SubscriptionListResponse(BaseModel):
    """List of subscriptions"""

    subscriptions: list[SubscriptionResponse]
    total: int


# =============================================================================
# Webhook Models
# =============================================================================


class WebhookPayload(BaseModel):
    """Generic webhook payload"""

    provider: PaymentProvider
    event_type: str
    raw_payload: dict[str, Any]


class RevolutWebhookPayload(BaseModel):
    """Revolut webhook payload structure"""

    event_type: str
    event_id: str
    data: dict[str, Any]
    created_at: datetime | None = None


class PayPalWebhookPayload(BaseModel):
    """PayPal webhook payload structure"""

    id: str
    event_type: str
    resource_type: str
    resource: dict[str, Any]
    create_time: datetime | None = None


# =============================================================================
# Payment Event Models
# =============================================================================


class PaymentEvent(BaseModel):
    """Payment event record for audit logging"""

    id: str | None = None
    subscription_id: str
    provider: PaymentProvider
    event_type: str
    amount: Decimal | None = None
    currency: str = "EUR"
    provider_event_id: str
    raw_payload: dict[str, Any]
    created_at: datetime | None = None


class PaymentEventCreate(BaseModel):
    """Create a new payment event"""

    subscription_id: str
    provider: PaymentProvider
    event_type: str
    amount: Decimal | None = None
    currency: str = "EUR"
    provider_event_id: str
    raw_payload: dict[str, Any]


# =============================================================================
# Internal Models
# =============================================================================


class SubscriptionUpdate(BaseModel):
    """Internal model for subscription updates"""

    status: SubscriptionStatus | None = None
    provider_subscription_id: str | None = None
    provider_customer_id: str | None = None
    next_billing_date: datetime | None = None
    cancelled_at: datetime | None = None
    cancellation_reason: str | None = None
