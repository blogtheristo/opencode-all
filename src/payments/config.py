"""
Payment Configuration Module

Loads environment variables and defines subscription plan configurations.
"""

import os
from dataclasses import dataclass
from decimal import Decimal
from enum import StrEnum
from functools import lru_cache


class PaymentProvider(StrEnum):
    """Supported payment providers"""

    REVOLUT = "revolut"
    PAYPAL = "paypal"


class PlanTier(StrEnum):
    """Subscription plan tiers"""

    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


@dataclass(frozen=True)
class SubscriptionPlan:
    """Subscription plan configuration"""

    tier: PlanTier
    name: str
    price_monthly_eur: Decimal
    agent_calls_per_month: int  # -1 for unlimited
    edge_devices: int
    support_type: str
    features: tuple[str, ...]


# Subscription Plans Configuration
SUBSCRIPTION_PLANS: dict[PlanTier, SubscriptionPlan] = {
    PlanTier.FREE: SubscriptionPlan(
        tier=PlanTier.FREE,
        name="Free",
        price_monthly_eur=Decimal("0"),
        agent_calls_per_month=100,
        edge_devices=0,
        support_type="Community",
        features=(
            "100 agent calls/month",
            "Basic dashboard access",
            "Community support",
        ),
    ),
    PlanTier.PRO: SubscriptionPlan(
        tier=PlanTier.PRO,
        name="Pro",
        price_monthly_eur=Decimal("499"),
        agent_calls_per_month=10000,
        edge_devices=5,
        support_type="Email",
        features=(
            "10,000 agent calls/month",
            "5 edge devices",
            "Email support",
            "API access",
            "Carbon tracking",
        ),
    ),
    PlanTier.ENTERPRISE: SubscriptionPlan(
        tier=PlanTier.ENTERPRISE,
        name="Enterprise",
        price_monthly_eur=Decimal("2499"),
        agent_calls_per_month=-1,  # Unlimited
        edge_devices=50,
        support_type="Dedicated WhatsApp/Webhook",
        features=(
            "Unlimited agent calls",
            "50+ edge devices",
            "Dedicated WhatsApp/webhook channel",
            "Custom integrations",
            "Priority support",
            "SLA guarantee",
        ),
    ),
}


@dataclass
class PaymentConfig:
    """Payment provider configuration loaded from environment"""

    # Revolut Business
    revolut_api_key: str
    revolut_webhook_secret: str
    revolut_api_url: str

    # PayPal Business
    paypal_client_id: str
    paypal_secret: str
    paypal_webhook_id: str
    paypal_api_url: str
    paypal_plan_id_pro: str
    paypal_plan_id_enterprise: str

    # Supabase
    supabase_url: str
    supabase_service_key: str

    # Application URLs
    app_base_url: str
    api_base_url: str

    # Environment
    is_production: bool

    @property
    def success_url(self) -> str:
        return f"{self.app_base_url}/subscribe/success"

    @property
    def cancel_url(self) -> str:
        return f"{self.app_base_url}/subscribe/cancel"


@lru_cache
def get_payment_config() -> PaymentConfig:
    """
    Load payment configuration from environment variables.

    Uses lru_cache for singleton behavior.
    """
    is_production = os.getenv("ENVIRONMENT", "development") == "production"

    # Revolut API URLs
    revolut_api_url = (
        "https://b2b.revolut.com/api/1.0"
        if is_production
        else "https://sandbox-b2b.revolut.com/api/1.0"
    )

    # PayPal API URLs
    paypal_api_url = (
        "https://api-m.paypal.com"
        if is_production
        else "https://api-m.sandbox.paypal.com"
    )

    return PaymentConfig(
        # Revolut
        revolut_api_key=os.getenv("REVOLUT_API_KEY", ""),
        revolut_webhook_secret=os.getenv("REVOLUT_WEBHOOK_SECRET", ""),
        revolut_api_url=revolut_api_url,
        # PayPal
        paypal_client_id=os.getenv("PAYPAL_CLIENT_ID", ""),
        paypal_secret=os.getenv("PAYPAL_SECRET", ""),
        paypal_webhook_id=os.getenv("PAYPAL_WEBHOOK_ID", ""),
        paypal_api_url=paypal_api_url,
        paypal_plan_id_pro=os.getenv("PAYPAL_PLAN_ID_PRO", ""),
        paypal_plan_id_enterprise=os.getenv("PAYPAL_PLAN_ID_ENTERPRISE", ""),
        # Supabase
        supabase_url=os.getenv("SUPABASE_URL", ""),
        supabase_service_key=os.getenv("SUPABASE_SERVICE_KEY", ""),
        # Application
        app_base_url=os.getenv("APP_BASE_URL", "https://app.lifetime.fi"),
        api_base_url=os.getenv("API_BASE_URL", "https://api.lifetime.fi"),
        # Environment
        is_production=is_production,
    )


def get_plan_by_tier(tier: PlanTier) -> SubscriptionPlan:
    """Get subscription plan configuration by tier"""
    return SUBSCRIPTION_PLANS[tier]


def get_paypal_plan_id(config: PaymentConfig, tier: PlanTier) -> str:
    """Get PayPal subscription plan ID for a tier"""
    if tier == PlanTier.PRO:
        return config.paypal_plan_id_pro
    if tier == PlanTier.ENTERPRISE:
        return config.paypal_plan_id_enterprise
    raise ValueError(f"No PayPal plan ID for tier: {tier}")
