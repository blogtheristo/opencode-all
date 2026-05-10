#!/usr/bin/env python3
"""
DWS Sales AI Agent - Director Dashboard
Mobile-friendly control panel for Sales HIL Director

Features:
- Agent performance monitoring
- Email approval workflow (Advisor mode)
- High-priority leads view
- Cost tracking
- Manual agent triggers
- Real-time operator notifications

Deployment: Google Cloud Run (always-on, min 1 instance)
Access: https://agent-director-dashboard-xxx.run.app (authentication required)
"""

import logging
import os
import secrets
from datetime import UTC, datetime, timedelta

import uvicorn

# Third-party imports
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from supabase import Client, create_client

# ============================================================================
# Configuration
# ============================================================================

# Logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DASHBOARD_USERNAME = os.getenv("DASHBOARD_USERNAME", "director")
DASHBOARD_PASSWORD = os.getenv(
    "DASHBOARD_PASSWORD", "changeme123"
)  # TODO: Use Secret Manager

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================================================
# FastAPI App
# ============================================================================

app = FastAPI(
    title="DWS Sales AI - Director Dashboard",
    description="Mobile-friendly control panel for Sales HIL Director",
    version="1.0.0",
)

# HTTP Basic Auth
security = HTTPBasic()

_security_dep = Depends(security)


def verify_credentials(credentials: HTTPBasicCredentials = _security_dep) -> str:
    """Verify username and password."""
    correct_username = secrets.compare_digest(credentials.username, DASHBOARD_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, DASHBOARD_PASSWORD)

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username


# ============================================================================
# Dashboard Endpoints
# ============================================================================


@app.get("/", response_class=HTMLResponse)
async def dashboard_home(username: str = Depends(verify_credentials)):
    """Main dashboard - overview of all agents."""

    # Get agent metrics (last 7 days)
    supabase.table("agent_metrics").select("*").gte(
        "metric_date", (datetime.now() - timedelta(days=7)).date().isoformat()
    ).order("metric_date", desc=True).execute()

    # Get pending approvals count
    pending_approvals = (
        supabase.table("agent_approvals")
        .select("*", count="exact")
        .eq("status", "pending")
        .execute()
    )

    # Get high-priority leads count
    high_priority_leads = (
        supabase.table("firehorse_leads")
        .select("*", count="exact")
        .eq("priority", "High")
        .is_("enriched_at", "not.null")
        .execute()
    )

    # Get today's costs
    today_costs = (
        supabase.table("agent_costs")
        .select("agent_id, total_cost_eur")
        .eq("cost_date", datetime.now().date().isoformat())
        .execute()
    )

    total_cost_today = sum([c["total_cost_eur"] or 0 for c in today_costs.data])

    # Get recent signals (last 10)
    recent_signals = (
        supabase.table("agent_signals")
        .select("*")
        .order("emitted_at", desc=True)
        .limit(10)
        .execute()
    )

    # Build HTML response (mobile-friendly)
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DWS Sales AI - Director Dashboard</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}

            body {{
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: #333;
            }}

            .container {{
                max-width: 1200px;
                margin: 0 auto;
            }}

            .header {{
                background: white;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}

            .header h1 {{
                font-size: 24px;
                margin-bottom: 8px;
                color: #667eea;
            }}

            .header .subtitle {{
                color: #666;
                font-size: 14px;
            }}

            .stats-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }}

            .stat-card {{
                background: white;
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }}

            .stat-card:active {{
                transform: scale(0.98);
            }}

            .stat-card .icon {{
                font-size: 32px;
                margin-bottom: 12px;
            }}

            .stat-card .label {{
                color: #666;
                font-size: 14px;
                margin-bottom: 4px;
            }}

            .stat-card .value {{
                font-size: 28px;
                font-weight: bold;
                color: #333;
            }}

            .stat-card .trend {{
                font-size: 12px;
                color: #10b981;
                margin-top: 4px;
            }}

            .stat-card .trend.down {{
                color: #ef4444;
            }}

            .section {{
                background: white;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}

            .section h2 {{
                font-size: 18px;
                margin-bottom: 16px;
                color: #333;
            }}

            .approval-item {{
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                background: #f9fafb;
            }}

            .approval-item .company {{
                font-weight: bold;
                color: #333;
                margin-bottom: 4px;
            }}

            .approval-item .subject {{
                color: #666;
                font-size: 14px;
                margin-bottom: 8px;
            }}

            .approval-item .body {{
                color: #666;
                font-size: 13px;
                line-height: 1.5;
                margin-bottom: 12px;
                padding: 12px;
                background: white;
                border-radius: 8px;
            }}

            .approval-actions {{
                display: flex;
                gap: 8px;
            }}

            .btn {{
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }}

            .btn-approve {{
                background: #10b981;
                color: white;
            }}

            .btn-approve:active {{
                background: #059669;
            }}

            .btn-reject {{
                background: #ef4444;
                color: white;
            }}

            .btn-reject:active {{
                background: #dc2626;
            }}

            .signal-item {{
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-bottom: 1px solid #e5e7eb;
            }}

            .signal-item:last-child {{
                border-bottom: none;
            }}

            .signal-dot {{
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }}

            .signal-dot.ready {{ background: #10b981; }}
            .signal-dot.error {{ background: #ef4444; }}
            .signal-dot.complete {{ background: #3b82f6; }}
            .signal-dot.blocked {{ background: #f59e0b; }}

            .signal-content {{
                flex: 1;
            }}

            .signal-agent {{
                font-size: 12px;
                color: #666;
            }}

            .signal-message {{
                font-size: 14px;
                color: #333;
            }}

            .signal-time {{
                font-size: 12px;
                color: #999;
                flex-shrink: 0;
            }}

            .empty-state {{
                text-align: center;
                padding: 40px 20px;
                color: #999;
            }}

            .nav-tabs {{
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
                overflow-x: auto;
            }}

            .nav-tab {{
                padding: 12px 20px;
                border-radius: 12px;
                background: white;
                border: 2px solid transparent;
                cursor: pointer;
                white-space: nowrap;
                text-decoration: none;
                color: #666;
                font-weight: 500;
            }}

            .nav-tab.active {{
                border-color: #667eea;
                color: #667eea;
            }}

            @media (max-width: 768px) {{
                .stats-grid {{
                    grid-template-columns: 1fr;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 DWS Sales AI Dashboard</h1>
                <div class="subtitle">Welcome, {username} | {
        datetime.now().strftime("%Y-%m-%d %H:%M CET")
    }</div>
            </div>

            <div class="nav-tabs">
                <a href="/" class="nav-tab active">Overview</a>
                <a href="/approvals" class="nav-tab">Approvals ({
        pending_approvals.count or 0
    })</a>
                <a href="/leads" class="nav-tab">Leads ({
        high_priority_leads.count or 0
    })</a>
                <a href="/costs" class="nav-tab">Costs</a>
                <a href="/agents" class="nav-tab">Agents</a>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="icon">📊</div>
                    <div class="label">Pending Approvals</div>
                    <div class="value">{pending_approvals.count or 0}</div>
                    <div class="trend">Requires your review</div>
                </div>

                <div class="stat-card">
                    <div class="icon">⭐</div>
                    <div class="label">High Priority Leads</div>
                    <div class="value">{high_priority_leads.count or 0}</div>
                    <div class="trend">ICP Score 70+</div>
                </div>

                <div class="stat-card">
                    <div class="icon">💰</div>
                    <div class="label">Cost Today</div>
                    <div class="value">€{total_cost_today:.2f}</div>
                    <div class="trend">Budget: €5/day</div>
                </div>

                <div class="stat-card">
                    <div class="icon">✅</div>
                    <div class="label">Agents Active</div>
                    <div class="value">2/6</div>
                    <div class="trend">Phase 1 (Week 1-4)</div>
                </div>
            </div>

            <div class="section">
                <h2>⚡ Recent Activity</h2>
                {
        '<div class="empty-state">No recent activity</div>'
        if not recent_signals.data
        else "".join(
            [
                f'''
                    <div class="signal-item">
                        <div class="signal-dot {signal['signal_type'].lower()}"></div>
                        <div class="signal-content">
                            <div class="signal-agent">{signal['agent_id']}</div>
                            <div class="signal-message">{signal['signal_type']}: {signal['milestone']}</div>
                        </div>
                        <div class="signal-time">{datetime.fromisoformat(signal['emitted_at'].replace('Z', '+00:00')).strftime('%H:%M')}</div>
                    </div>
                    '''
                for signal in recent_signals.data
            ]
        )
    }
            </div>
        </div>

        <script>
            // Auto-refresh every 30 seconds
            setTimeout(() => location.reload(), 30000);
        </script>
    </body>
    </html>
    """

    return HTMLResponse(content=html)


@app.get("/approvals", response_class=HTMLResponse)
async def approvals_page(_username: str = Depends(verify_credentials)):
    """Email approval workflow - Advisor mode."""

    # Get pending approvals with lead details
    approvals = supabase.rpc("get_pending_approvals_with_details").execute()

    # Fallback: manual join if RPC doesn't exist
    if not hasattr(approvals, "data") or not approvals.data:
        approvals_raw = supabase.from_("v_pending_approvals").select("*").execute()
        approvals_data = approvals_raw.data if approvals_raw.data else []
    else:
        approvals_data = approvals.data

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Approvals - DWS Sales AI</title>
        <style>
            /* Same CSS as dashboard_home */
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }}
            .container {{ max-width: 1200px; margin: 0 auto; }}
            .header {{ background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header h1 {{ font-size: 24px; margin-bottom: 8px; color: #667eea; }}
            .section {{ background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .approval-item {{ border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; background: #f9fafb; }}
            .approval-item .company {{ font-weight: bold; color: #333; margin-bottom: 4px; }}
            .approval-item .contact {{ color: #666; font-size: 14px; margin-bottom: 8px; }}
            .approval-item .subject {{ color: #333; font-weight: 600; font-size: 15px; margin-bottom: 8px; }}
            .approval-item .body {{ color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px; white-space: pre-wrap; }}
            .approval-item .meta {{ display: flex; justify-content: space-between; font-size: 12px; color: #999; margin-bottom: 12px; }}
            .approval-actions {{ display: flex; gap: 8px; }}
            .btn {{ flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }}
            .btn-approve {{ background: #10b981; color: white; }}
            .btn-approve:active {{ background: #059669; }}
            .btn-reject {{ background: #ef4444; color: white; }}
            .btn-reject:active {{ background: #dc2626; }}
            .empty-state {{ text-align: center; padding: 60px 20px; color: #999; }}
            .nav-tabs {{ display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; }}
            .nav-tab {{ padding: 12px 20px; border-radius: 12px; background: white; border: 2px solid transparent; cursor: pointer; text-decoration: none; color: #666; font-weight: 500; }}
            .nav-tab.active {{ border-color: #667eea; color: #667eea; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Email Approvals</h1>
                <div class="subtitle">Review and approve outreach emails</div>
            </div>

            <div class="nav-tabs">
                <a href="/" class="nav-tab">Overview</a>
                <a href="/approvals" class="nav-tab active">Approvals</a>
                <a href="/leads" class="nav-tab">Leads</a>
                <a href="/costs" class="nav-tab">Costs</a>
                <a href="/agents" class="nav-tab">Agents</a>
            </div>

            <div class="section">
                {
        '<div class="empty-state">🎉 No pending approvals!<br><small>All emails have been reviewed.</small></div>'
        if not approvals_data
        else "".join(
            [
                f'''
                    <div class="approval-item">
                        <div class="company">{approval.get('company', 'Unknown Company')}</div>
                        <div class="contact">{approval.get('first_name', '')} {approval.get('last_name', '')} - {approval.get('email', '')}</div>
                        <div class="meta">
                            <span>ICP: {approval.get('icp_score', 'N/A')}</span>
                            <span>Agent: {approval.get('agent_id', 'unknown')}</span>
                        </div>
                        <div class="subject">Subject: {approval.get('subject_line', 'No subject')}</div>
                        <div class="body">{approval.get('body', 'No body content')}</div>
                        <div class="approval-actions">
                            <button class="btn btn-approve" onclick="approve('{approval.get('approval_id', '')}')">✅ Approve & Send</button>
                            <button class="btn btn-reject" onclick="reject('{approval.get('approval_id', '')}')">❌ Reject</button>
                        </div>
                    </div>
                    '''
                for approval in approvals_data
            ]
        )
    }
            </div>
        </div>

        <script>
            function approve(approvalId) {{
                if (confirm('Approve and send this email?')) {{
                    fetch(`/api/approvals/${{approvalId}}/approve`, {{ method: 'POST' }})
                        .then(() => location.reload());
                }}
            }}

            function reject(approvalId) {{
                const reason = prompt('Rejection reason (optional):');
                fetch(`/api/approvals/${{approvalId}}/reject`, {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{ reason }})
                }}).then(() => location.reload());
            }}
        </script>
    </body>
    </html>
    """

    return HTMLResponse(content=html)


@app.post("/api/approvals/{approval_id}/approve")
async def approve_email(approval_id: str, username: str = Depends(verify_credentials)):
    """Approve an email for sending."""
    try:
        # Update approval status
        supabase.table("agent_approvals").update(
            {
                "status": "approved",
                "decision_at": datetime.now(UTC).isoformat(),
                "approved_by": username,
            }
        ).eq("id", approval_id).execute()

        # Update event status to 'scheduled'
        approval = (
            supabase.table("agent_approvals")
            .select("event_id")
            .eq("id", approval_id)
            .single()
            .execute()
        )
        supabase.table("firehorse_events").update({"status": "scheduled"}).eq(
            "id", approval.data["event_id"]
        ).execute()

        logger.info(f"Email approved by {username}: {approval_id}")

        return {"status": "approved"}

    except Exception as e:
        logger.error(f"Approval error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/api/approvals/{approval_id}/reject")
async def reject_email(approval_id: str, username: str = Depends(verify_credentials)):
    """Reject an email."""
    try:
        # TODO: Parse rejection reason from request body

        supabase.table("agent_approvals").update(
            {"status": "rejected", "decision_at": datetime.now(UTC).isoformat()}
        ).eq("id", approval_id).execute()

        logger.info(f"Email rejected by {username}: {approval_id}")

        return {"status": "rejected"}

    except Exception as e:
        logger.error(f"Rejection error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now(UTC).isoformat()}


# ============================================================================
# Main Entrypoint
# ============================================================================


def main():
    """Run dashboard server."""
    port = int(os.getenv("PORT", "8080"))

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")


if __name__ == "__main__":
    main()
