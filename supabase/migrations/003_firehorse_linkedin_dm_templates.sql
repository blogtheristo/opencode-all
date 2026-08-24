-- Firehorse Omnichannel Next Pilot - LinkedIn DM Templates & Country Personalization
-- Extension to CustomerPilotLoop v1

-- ============================================================================
-- EXTEND ENUMS
-- ============================================================================

-- Add Germany to country list
ALTER TYPE lead_country ADD VALUE 'DE';

-- Create template type enum
CREATE TYPE template_type AS ENUM ('email', 'linkedin_dm');

-- ============================================================================
-- ALTER TABLES
-- ============================================================================

-- Add LinkedIn URL to leads table
ALTER TABLE firehorse_leads
  ADD COLUMN linkedin_url VARCHAR(500);

-- Add template_type column to email_templates table
ALTER TABLE firehorse_email_templates
  ADD COLUMN template_type template_type DEFAULT 'email';

-- Rename table to be more generic (templates for both email and LinkedIn)
-- Note: This is optional, but makes more sense semantically
ALTER TABLE firehorse_email_templates
  RENAME TO firehorse_templates;

-- Update comment
COMMENT ON TABLE firehorse_templates IS 'Message templates for email and LinkedIn DM campaigns';

-- ============================================================================
-- SEED DATA - Updated Email Templates with Country Personalization
-- ============================================================================

-- Update existing templates with new format (country-personalized)
UPDATE firehorse_templates
SET body = 'Hi {{first_name}},

I''m building the DWS IQ 6 platform at Lifetime Group to bring real‑time SPI/CPI, safety and quality visibility to construction and infrastructure portfolios, directly on the phone. Here is a short live demo of an NCC‑style mobile portfolio view:
https://j6prmljgpvnia.ok.kimi.link/

We''ve productised this as an enterprise pilot (DWS IQ 6 platform + Firehorse reporting + edge device) starting from 5,990 €/month (5‑month pilot). In similar use cases we are targeting 15–25% reduction in material waste and 70–120k €/year in value per customer.

{{country_context}}

Would you be open to a 15–20 minute call to see what a similar portfolio view could look like for your projects?

Best regards,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
+358 400 319 010
https://dws10.com/'
WHERE id = 'CustomerPilot_Cold1_EN';

-- ============================================================================
-- SEED DATA - LinkedIn DM Templates
-- ============================================================================

-- LinkedIn DM - General (FI, NO, DK)
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'CustomerPilot_LinkedIn_DM_General',
  'LinkedIn DM - General (Nordic)',
  'DWS IQ 6 Platform',
  'Hi {{first_name}}, I''m building the DWS IQ 6 platform at Lifetime to give construction portfolios a real-time SPI/CPI + safety/quality view on the phone. Here''s a short NCC-style demo: https://j6prmljgpvnia.ok.kimi.link/

We''re offering a 5‑month enterprise pilot (from 5,990 €/month) and targeting 15–25% less material waste and 70–120k €/year in value per customer. Would a 15–20 min call to see if this fits your portfolio be relevant for you?',
  'EN',
  'linkedin_dm'
);

-- LinkedIn DM - Sweden
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'CustomerPilot_LinkedIn_DM_SE',
  'LinkedIn DM - Sweden',
  'DWS IQ 6 Platform',
  'Hej {{first_name}}, I''m building the DWS IQ 6 platform to give Nordic construction portfolios a real‑time SPI/CPI + safety/quality view on the phone. Here''s a short NCC‑style demo: https://j6prmljgpvnia.ok.kimi.link/

We''re testing this as a 5‑month enterprise pilot with clear targets on waste reduction and portfolio visibility. Would a 15–20 min call to see if this fits your projects be relevant?',
  'EN',
  'linkedin_dm'
);

-- LinkedIn DM - Germany
INSERT INTO firehorse_templates (id, name, subject, body, language, template_type) VALUES
(
  'CustomerPilot_LinkedIn_DM_DE',
  'LinkedIn DM - Germany',
  'DWS IQ 6 Platform',
  'Hi {{first_name}}, I''m building the DWS IQ 6 platform to give construction and infrastructure portfolios a real‑time SPI/CPI + safety/quality view on the phone – with a strong focus on Fit for 55, EPBD 2028 and CSRD in Germany. Short NCC‑style demo: https://j6prmljgpvnia.ok.kimi.link/

Would a 15–20 min call to see if this could support your German/European projects be relevant for you?',
  'EN',
  'linkedin_dm'
);

-- ============================================================================
-- HELPER FUNCTION - Get Country Context for Email Personalization
-- ============================================================================

CREATE OR REPLACE FUNCTION get_country_context(country_code VARCHAR(2))
RETURNS TEXT AS $$
BEGIN
  RETURN CASE country_code
    WHEN 'FI' THEN 'We are based in Espoo and already working with Finnish logistics and public sector flows (e.g. Uber, Bolt, Kela).'
    WHEN 'SE' THEN 'We are working on Nordic‑focused use cases and have built this demo with an NCC‑style portfolio view as a reference.'
    WHEN 'NO' THEN 'We are focusing on Nordic infrastructure and construction portfolios, especially around Fit for 55 and EPBD 2028 readiness.'
    WHEN 'DK' THEN 'We are focusing on Nordic construction and infrastructure portfolios, with a strong angle on Fit for 55 and CSRD compliance.'
    WHEN 'DE' THEN 'We are focusing on EU construction and infrastructure portfolios, with a strong emphasis on Fit for 55, EPBD 2028 and CSRD compliance.'
    ELSE ''
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION get_country_context IS 'Returns country-specific context text for email personalization based on lead country';
COMMENT ON COLUMN firehorse_templates.template_type IS 'Type of template: email or linkedin_dm';
