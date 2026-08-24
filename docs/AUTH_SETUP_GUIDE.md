# DWS IQ 6 - Authentication Setup Guide

Complete setup instructions for the DWS IQ Login System with Supabase Auth, OAuth providers, and MFA.

**Last Updated:** January 4, 2026  
**Estimated Time:** 30-45 minutes

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Project Setup](#2-supabase-project-setup)
3. [Enable Supabase Authentication](#3-enable-supabase-authentication)
4. [Google OAuth Setup](#4-google-oauth-setup)
5. [Microsoft OAuth Setup](#5-microsoft-oauth-setup)
6. [Run Database Migrations](#6-run-database-migrations)
7. [Configure Environment Variables](#7-configure-environment-variables)
8. [Enable MFA (TOTP)](#8-enable-mfa-totp)
9. [Configure Email Templates](#9-configure-email-templates)
10. [Testing the Setup](#10-testing-the-setup)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

- [ ] A Supabase account (free tier works) - [supabase.com](https://supabase.com)
- [ ] A Google Cloud Console account - [console.cloud.google.com](https://console.cloud.google.com)
- [ ] A Microsoft Azure account (for Microsoft OAuth) - [portal.azure.com](https://portal.azure.com)
- [ ] Node.js 18+ installed
- [ ] Access to the DWS6 codebase

---

## 2. Supabase Project Setup

### 2.1 Create a New Project (if needed)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `dws-iq-6` (or your preferred name)
   - **Database Password:** Generate a strong password and save it securely
   - **Region:** Choose the closest to your users (e.g., `eu-central-1` for Europe)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### 2.2 Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (safe to expose in frontend)
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (KEEP SECRET - backend only)

---

## 3. Enable Supabase Authentication

Supabase Auth is enabled by default. Let's configure it:

### 3.1 Configure Auth Settings

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Under **Email**, ensure these settings:
   - **Enable Email Signup:** ON
   - **Confirm email:** ON (recommended for production)
   - **Secure email change:** ON
   - **Double confirm email change:** ON

### 3.2 Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL:** `https://dws6.com` (your production domain)
   - **Redirect URLs:** Add all valid redirect URLs:
     ```
     https://dws6.com/**
     https://onelifetime.world/**
     http://localhost:3000/**
     http://localhost:5173/**
     ```

### 3.3 Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm signup** - Verification email
   - **Reset password** - Password reset email
   - **Magic link** - Passwordless login

Example confirmation email template:
```html
<h2>Welcome to DWS IQ 6</h2>
<p>Click the link below to verify your email:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email</a></p>
<p>This link expires in 24 hours.</p>
```

---

## 4. Google OAuth Setup

### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown → **"New Project"**
3. Name it `DWS IQ 6` and create

### 4.2 Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity Toolkit API" (optional but recommended)

### 4.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (or Internal if using Google Workspace)
3. Fill in:
   - **App name:** `DWS IQ 6`
   - **User support email:** Your email
   - **Developer contact:** Your email
4. Click **"Save and Continue"**
5. **Scopes:** Add these scopes:
   - `openid`
   - `email`
   - `profile`
6. **Test users:** Add your email for testing (if in testing mode)
7. Click **"Save and Continue"** through the remaining steps

### 4.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `DWS IQ 6 Web Client`
5. **Authorized JavaScript origins:**
   ```
   https://dws6.com
   https://onelifetime.world
   http://localhost:3000
   ```
6. **Authorized redirect URIs:**
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Replace `xxxxxxxxxxxxx` with your Supabase project reference ID)

7. Click **"Create"**
8. Copy and save:
   - **Client ID:** `xxxx.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-xxxxxxxxxxxx`

### 4.5 Add Google to Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google** to ON
4. Enter:
   - **Client ID:** (from step 4.4)
   - **Client Secret:** (from step 4.4)
5. Click **Save**

---

## 5. Microsoft OAuth Setup

### 5.1 Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"App registrations"** and open it
3. Click **"+ New registration"**
4. Fill in:
   - **Name:** `DWS IQ 6`
   - **Supported account types:** 
     - Choose "Accounts in any organizational directory and personal Microsoft accounts" for broadest access
     - Or "Accounts in this organizational directory only" for single-tenant
   - **Redirect URI:**
     - Platform: **Web**
     - URI: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
5. Click **"Register"**

### 5.2 Get Application Credentials

1. On the app's **Overview** page, copy:
   - **Application (client) ID:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Directory (tenant) ID:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

2. Go to **Certificates & secrets** → **Client secrets**
3. Click **"+ New client secret"**
4. Description: `Supabase Auth`
5. Expires: Choose appropriate expiration (recommend 24 months)
6. Click **"Add"**
7. **IMMEDIATELY copy the Value** (you won't see it again):
   - **Client Secret Value:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 5.3 Configure API Permissions

1. Go to **API permissions**
2. Click **"+ Add a permission"**
3. Select **Microsoft Graph** → **Delegated permissions**
4. Add these permissions:
   - `openid`
   - `email`
   - `profile`
   - `User.Read`
5. Click **"Grant admin consent"** (if you have admin rights)

### 5.4 Add Microsoft to Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Azure (Microsoft)** and click to expand
3. Toggle **Enable Sign in with Azure** to ON
4. Enter:
   - **Azure Tenant URL:** 
     - For multi-tenant: `https://login.microsoftonline.com/common`
     - For single-tenant: `https://login.microsoftonline.com/YOUR_TENANT_ID`
   - **Client ID:** (Application ID from step 5.2)
   - **Client Secret:** (Client secret value from step 5.2)
5. Click **Save**

---

## 6. Run Database Migrations

### 6.1 Using Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"+ New query"**
3. Open the migration file: `supabase/migrations/007_auth_users_orgs.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. Verify success - you should see tables created in **Table Editor**

### 6.2 Using Supabase CLI (Alternative)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref xxxxxxxxxxxxx

# Run migrations
supabase db push
```

### 6.3 Verify Tables Created

After running the migration, verify these tables exist in **Table Editor**:

- `user_profiles`
- `organizations`
- `organization_members`
- `user_sessions`
- `mfa_backup_codes`
- `organization_invitations`
- `auth_audit_log`

---

## 7. Configure Environment Variables

### 7.1 Frontend (dws6.com)

Create or update `dws6.com/shared/config/supabase-config.js`:

```javascript
export const supabaseConfig = {
  url: 'https://xxxxxxxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Your anon key
  
  // ... rest of config
};
```

> **Note:** This file is in `.gitignore`. Copy from `supabase-config.template.js` and fill in your values.

### 7.2 Next.js (onelifetime.world)

Create `.env.local` in `onelifetime.world/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.3 Backend (src/)

Create or update `.env`:

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT (for custom JWT if not using Supabase Auth exclusively)
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=another-super-secret-refresh-key-min-32-chars

# Demo user password hash (development only)
DEMO_PASSWORD_HASH=$2b$12$...
```

---

## 8. Enable MFA (TOTP)

### 8.1 Enable in Supabase

1. Go to **Authentication** → **MFA**
2. Toggle **Enable MFA** to ON
3. Configure:
   - **TOTP:** Enabled
   - **Phone (SMS):** Optional (requires Twilio setup)

### 8.2 MFA Settings

The default TOTP settings work well:
- Algorithm: SHA1
- Digits: 6
- Period: 30 seconds

---

## 9. Configure Email Templates

### 9.1 SMTP Configuration (Recommended for Production)

By default, Supabase uses their built-in email service (limited to 4 emails/hour on free tier).

For production, configure custom SMTP:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Configure with your email provider (e.g., SendGrid, Resend, AWS SES):

   **Example with SendGrid:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Sender email: risto@onelifetime.world
   Sender name: DWS IQ 6
   ```

### 9.2 Customize Email Templates

Go to **Authentication** → **Email Templates** and customize:

**Confirm Signup:**
```html
<h2>Welcome to DWS IQ 6!</h2>
<p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Verify Email</a></p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

**Reset Password:**
```html
<h2>Reset Your Password</h2>
<p>Click the button below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
```

---

## 10. Testing the Setup

### 10.1 Test Email/Password Authentication

1. Go to `https://dws6.com/register/index.html`
2. Create a test account
3. Check your email for verification link
4. Click to verify
5. Login at `https://dws6.com/login/dws-iq/index.html`

### 10.2 Test Google OAuth

1. Go to `https://dws6.com/login/dws-iq/index.html`
2. Click "Google Workspace" button
3. Sign in with Google
4. Verify redirect back to dashboard

### 10.3 Test Microsoft OAuth

1. Go to `https://dws6.com/login/enterprise/index.html`
2. Click "Microsoft 365" button
3. Sign in with Microsoft
4. Verify redirect back to dashboard

### 10.4 Test MFA

1. Login to your account
2. Go to Security Settings (`/dashboard/security`)
3. Click "Enable Two-Factor Authentication"
4. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
5. Enter 6-digit code
6. Save backup codes
7. Logout and login again - should prompt for MFA code

---

## 11. Troubleshooting

### Common Issues

#### "Invalid redirect URI" error
- Ensure the redirect URI in OAuth provider matches exactly: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
- Check for trailing slashes

#### "User not found" after OAuth login
- The `handle_new_user()` trigger should create user profile automatically
- Check if the trigger exists in the database

#### Email not sending
- Check SMTP configuration
- Verify sender email is verified with your email provider
- Check Supabase logs: **Logs** → **Auth**

#### MFA not working
- Ensure device time is synced (TOTP is time-based)
- Try regenerating the QR code
- Check if the factor was verified (status should be "verified")

#### CORS errors
- Add your domain to **Site URL** and **Redirect URLs** in Supabase Auth settings
- Check browser console for specific CORS errors

### Getting Help

- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- DWS6 Issues: [github.com/blogtheristo/dws6/issues](https://github.com/blogtheristo/dws6/issues)

---

## Quick Reference

| Service | Dashboard URL |
|---------|--------------|
| Supabase | https://supabase.com/dashboard |
| Google Cloud Console | https://console.cloud.google.com |
| Azure Portal | https://portal.azure.com |

| Environment Variable | Where Used | Secret? |
|---------------------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend only | **YES** |
| `JWT_SECRET_KEY` | Backend | **YES** |

---

**Document Version:** 1.0  
**Created:** January 4, 2026  
**Author:** DWS IQ Team
