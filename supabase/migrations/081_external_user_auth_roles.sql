-- External User Authentication: Auto-Assign Roles
-- Migration to assign roles to external domain users (lifetime.fi, dws10.com, etc.)

-- Function to automatically assign roles to external users
CREATE OR REPLACE FUNCTION assign_external_user_role()
RETURNS TRIGGER AS $$
DECLARE
  email_domain text;
  assigned_role text;
BEGIN
  -- Extract domain from email
  email_domain := SUBSTRING(NEW.email FROM POSITION('@' IN NEW.email) + 1);

  -- Set default role
  assigned_role := 'dws_iq_standard';

  -- Allow only specific external users (security: no wildcards)
  IF NEW.email IN (
    'risto.paarni2024@lifetime.fi',
    'admin2026@dws10.com',
    'ristopaarni@gmail.com'
  ) THEN
    -- Set role in user metadata
    NEW.raw_user_meta_data := jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(assigned_role)
    );

    NEW.raw_user_meta_data := jsonb_set(
      NEW.raw_user_meta_data,
      '{external_user}',
      'true'::jsonb
    );

    NEW.raw_user_meta_data := jsonb_set(
      NEW.raw_user_meta_data,
      '{organization}',
      to_jsonb(email_domain)
    );

    RAISE LOG 'External user assigned role: email=%, domain=%, role=%',
              NEW.email, email_domain, assigned_role;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign roles on user signup
DROP TRIGGER IF EXISTS on_external_user_signup ON auth.users;
CREATE TRIGGER on_external_user_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_external_user_role();

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION assign_external_user_role() TO service_role;
