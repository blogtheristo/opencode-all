# Supabase Setup Guide for DWS6.com Multi-Login Platform

## Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API" under Project Settings
4. Copy the following values:
   - **Project URL**: `https://kpucuwwfhuwurdxyjjtz.supabase.co`
   - **anon/public key**: This is your `SUPABASE_ANON_KEY`

5. Update `dws6.com/shared/config/supabase-config.js`:
   ```javascript
   anonKey: 'YOUR_ACTUAL_ANON_KEY_HERE'
   ```

## Step 2: Configure Authentication

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Enable **Email** provider (should be enabled by default)
3. Optional: Enable social providers (Google, Microsoft, etc.)

## Step 3: Configure Email Templates

1. Go to "Authentication" → "Email Templates"
2. Customize the following templates:
   - **Confirm signup**: Welcome email with verification link
   - **Magic Link**: Passwordless login email
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset email

## Step 4: Set Redirect URLs

1. Go to "Authentication" → "URL Configuration"
2. Add the following Site URL:
   ```
   https://dws6.com
   ```

3. Add the following Redirect URLs:
   ```
   https://dws6.com/dashboard/dws-iq-mobile/index.html
   https://dws6.com/dashboard/store/index.html
   https://dws6.com/dashboard/dws-iq/index.html
   https://dws6.com/dashboard/onelifetime/index.html
   https://dws6.com/dashboard/lifetime-model/index.html
   https://dws6.com/dashboard/enterprise/index.html
   https://dws6.com/dashboard/enterprise-model/index.html
   https://dws6.com/dashboard/backoffice/index.html
   https://dws6.com/dashboard/api/index.html
   https://dws6.com/dashboard/mcp-hub/index.html
   ```

4. For local development, also add:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   ```

## Step 5: Create User Metadata Schema (Optional)

While Supabase automatically handles `user_metadata`, you can create a custom table for extended profiles:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  organization TEXT,
  access_level TEXT DEFAULT 'free',
  vertex_ai_enabled BOOLEAN DEFAULT false,
  vertex_ai_project_id TEXT,
  enterprise_org_id TEXT,
  permissions JSONB DEFAULT '["read"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'backoffice_admin'
    )
  );

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, permissions)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'community_user'),
    COALESCE(NEW.raw_user_meta_data->'permissions', '["read"]'::jsonb)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Step 6: Set Up Row Level Security Policies

Create policies for each dashboard type to ensure users only see their authorized data.

Example for a projects table:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own projects
CREATE POLICY "Users can create own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 7: Test Authentication

1. Create a test user:
   ```javascript
   // In browser console on any login page
   const { data, error } = await supabase.auth.signUp({
     email: 'test@dws6.com',
     password: 'TestPassword123!',
     options: {
       data: {
         role: 'dws_iq_mobile',
         permissions: ['read', 'write']
       }
     }
   });
   ```

2. Check your email for verification link
3. Click verification link
4. Try logging in with the test credentials

## Step 8: Configure SMTP (Optional)

For production, configure custom SMTP:

1. Go to "Settings" → "Auth" → "SMTP Settings"
2. Enable "Enable Custom SMTP"
3. Enter your SMTP credentials:
   - **Host**: smtp.your-provider.com
   - **Port**: 587 (or 465 for SSL)
   - **Username**: your-email@domain.com
   - **Password**: your-smtp-password
   - **Sender email**: risto@onelifetime.world
   - **Sender name**: DWS IQ Platform

## Step 9: Security Best Practices

1. **Enable Email Verification**:
   - Go to "Authentication" → "Settings"
   - Enable "Confirm email"

2. **Set Password Requirements**:
   - Minimum length: 12 characters
   - Require uppercase, lowercase, numbers, symbols

3. **Enable Rate Limiting**:
   - Default: 5 requests per hour per IP
   - Adjust in "Authentication" → "Rate Limits"

4. **Configure Session Timeout**:
   - Go to "Authentication" → "Settings"
   - Set "JWT expiry limit": 3600 (1 hour)
   - Set "Refresh token rotation": Enabled

## Step 10: Monitor Usage

1. Go to "Reports" to monitor:
   - Daily Active Users (DAU)
   - Monthly Active Users (MAU)
   - API requests
   - Database size
   - Bandwidth usage

2. Set up alerts for:
   - Approaching free tier limits
   - Unusual login patterns
   - Failed authentication attempts

## Free Tier Limits

- ✅ 50,000 Monthly Active Users
- ✅ 500 MB Database Storage
- ✅ 1 GB File Storage
- ✅ 2 GB Bandwidth
- ✅ Social OAuth Providers
- ✅ 50,000 Monthly Edge Function Invocations

## Upgrade Path

When you exceed free tier limits:
- **Pro Plan**: $25/month
  - 100,000 MAU
  - 8 GB database
  - 100 GB bandwidth
  - Daily backups
  - Email support

- **Team Plan**: $599/month
  - Unlimited MAU
  - Dedicated resources
  - Priority support
  - SLA guarantees

## Troubleshooting

### Issue: "Invalid API key"
**Solution**: Double-check that you copied the `anon` key, not the `service_role` key.

### Issue: "Email not confirmed"
**Solution**: Check spam folder for verification email, or resend verification.

### Issue: "Redirect URL not allowed"
**Solution**: Add the URL to "Authentication" → "URL Configuration" → "Redirect URLs".

### Issue: "User already registered"
**Solution**: Use password reset flow or try logging in instead of signing up.

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **DWS IQ Support**: support@dws6.com

---

**Status**: ✅ Ready for implementation
**Last Updated**: December 28, 2025
