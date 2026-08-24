-- Firehorse Omnichannel Next Pilot - PORR AG Specific Templates
-- High-value account templates for strategic prospects

-- ============================================================================
-- PORR AG - Email Templates
-- ============================================================================

-- PORR Cold 1 - CEO/COO Level (references PORR 2025 programme)
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'PORR_Cold1_EN',
  'PORR AG - Cold Outreach 1 (CEO/COO Level)',
  'DWS IQ 6 – Real-time portfolio control for PORR 2025 transformation',
  'Hi {{first_name}},

I see PORR is executing an impressive transformation with your "future programme PORR 2025" – focusing on operational excellence, digitalization (BIM, LEAN Design & Construction), and your Green and Lean strategy toward ESG 2030 targets.

I''m building the DWS IQ 6 platform at Lifetime Group to address exactly this: giving construction and infrastructure portfolios a **real-time mobile control room** for SPI/CPI steering, safety oversight, and Fit for 55 compliance tracking. Here''s a short live demo of an NCC-style portfolio view:
https://j6prmljgpvnia.ok.kimi.link/

**Why this might fit PORR 2025:**
• Real-time visibility into portfolio performance (SPI/CPI deviations, early warnings)
• Mobile-first dashboard for C-level and project teams
• Support for Fit for 55, ESG reporting automation (Scope 1-3 tracking)
• LEAN integration – reduce waste, improve project predictability
• Proven results: 15–25% material waste reduction, 70–120k €/year value per large project

**Pilot proposal for Central Europe:**
• 5-month enterprise pilot
• Starting from 29,950 € (pilot pricing for strategic partners)
• Focused on 1-2 flagship PORR projects (tunnels, infra, or CEE portfolio)

Would you be open to a 20-minute call to explore if DWS IQ 6 could support PORR''s operational efficiency and ESG targets?

Best regards,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
+358 400 319 010
https://dws10.com/',
  'EN',
  'email'
);

-- ============================================================================
-- PORR AG - LinkedIn DM Templates
-- ============================================================================

-- PORR LinkedIn DM - Short version for connection request
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'PORR_LinkedIn_DM',
  'PORR AG - LinkedIn Connection Request',
  'DWS IQ 6 Platform',
  'Hi {{first_name}}, I see you''re leading {{role_context}} at PORR with expertise in high-complexity projects. We''re developing DWS IQ 6 – a mobile portfolio control room for real-time SPI/CPI, safety & Fit for 55 steering, aligned with PORR 2025''s Green and Lean strategy.

Seeking pilot partners in Central Europe (5 months, 29,950 €). Open for a quick demo?

Demo: https://j6prmljgpvnia.ok.kimi.link/

Best, Risto Päärni
+358 400 319 010',
  'EN',
  'linkedin_dm'
);

-- ============================================================================
-- PORR AG - Follow-up Templates
-- ============================================================================

-- PORR Cold 2 - Reminder with PORR 2025 angle
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'PORR_Cold2_Reminder',
  'PORR AG - Follow-up 2 (PORR 2025 angle)',
  'Re: DWS IQ 6 for PORR 2025 transformation',
  'Hi {{first_name}},

Quick follow-up on my previous email about DWS IQ 6 and how it could support PORR''s operational excellence goals in the PORR 2025 programme.

Given your focus on digitalization (BIM, LEAN), ESG 2030 targets (Scope 1-3 reduction), and portfolio resilience, I thought this might be timely:

**What DWS IQ 6 delivers:**
✓ Real-time SPI/CPI dashboard (mobile-first, C-level access)
✓ Early warning system for project deviations
✓ Fit for 55 & ESG compliance tracking
✓ 15–25% material waste reduction in pilot cases

We have limited pilot slots for Q1/2026 in Central Europe. Would a brief 15–20 minute call next week work to explore fit?

Best,
Risto Anton Päärni
Lifetime Oy
+358 400 319 010',
  'EN',
  'email'
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE firehorse_templates IS 'Message templates for email and LinkedIn DM campaigns, including account-specific templates (e.g., PORR AG)';
