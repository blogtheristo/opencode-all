# Supabase OAuth Setup Guide - DWS6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial OAuth configuration guide for DWS6 authentication

Session Links & References:
  - GitHub: https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/SUPABASE_OAUTH_SETUP_GUIDE.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

## Overview

OAuth (Open Authorization) allows users to sign in to DWS6 using their existing accounts from other services (Google, Microsoft, LinkedIn, etc.) without creating new passwords.

**Supabase Project:** dws6  
**Project ID:** kpucuwwfhuwurdxyjjtz

---

## 📋 Table of Contents

1. [OAuth Basics](#oauth-basics)
2. [Registration Types](#registration-types)
3. [Client Types](#client-types)
4. [Recommended OAuth Providers](#recommended-oauth-providers)
5. [Setup Instructions](#setup-instructions)
6. [Security Configuration](#security-configuration)
7. [Implementation Examples](#implementation-examples)
8. [Troubleshooting](#troubleshooting)

---

## OAuth Basics

### What is OAuth?

OAuth is an authentication protocol that allows users to sign in using existing accounts:

```
User → Clicks "Sign in with Google" 
     → Redirected to Google 
     → Approves access 
     → Redirected back to DWS6 
     → Authenticated!
```

### Benefits for DWS6

✅ **User Experience**
- No password to remember
- Faster sign-up process
- Familiar login flow

✅ **Security**
- No password storage
- Multi-factor authentication (from provider)
- Reduced phishing risk

✅ **Professional**
- Enterprise-grade authentication
- SSO (Single Sign-On) capability
- Trusted by users

---

## Registration Types

### 1. Public Registration

**What it means:**
- Anyone can sign up
- Self-service registration
- No admin approval needed

**Use for:**
- ✅ Public-facing applications
- ✅ SaaS products with open registration
- ✅ Trial/freemium models

**DWS6 Use Case:**
```
✅ Firehorse pilot program (public sign-up)
✅ DWS IQ 6 free trial
❌ Internal dashboards (use Private instead)
```

### 2. Private Registration

**What it means:**
- Invite-only access
- Admin must approve/invite users
- Controlled user base

**Use for:**
- ✅ Internal tools
- ✅ Enterprise applications
- ✅ B2B dashboards

**DWS6 Use Case:**
```
✅ V9 Dashboard (internal/client access)
✅ V8 Enhanced Dashboard
✅ People Management
✅ Admin panels
```

---

## Client Types

### 1. Public Client

**What it means:**
- Client secret is NOT used
- Suitable for browser-based apps
- Uses PKCE (Proof Key for Code Exchange)

**Technical Details:**
```
Authorization Flow: Authorization Code + PKCE
Client Secret: Not required
Security: PKCE provides protection
```

**Use for:**
- ✅ Single Page Applications (SPA)
- ✅ Mobile apps
- ✅ Browser-based dashboards

**DWS6 Use Case:**
```
✅ dws6.com (static site)
✅ V9 Dashboard (React SPA)
✅ V8 Enhanced Dashboard
✅ Mobile dashboards
```

### 2. Confidential Client

**What it means:**
- Client secret IS used
- Suitable for server-side apps
- Secret stored securely on server

**Technical Details:**
```
Authorization Flow: Authorization Code
Client Secret: Required
Security: Secret must be protected
```

**Use for:**
- ✅ Server-side applications
- ✅ Backend services
- ✅ API servers

**DWS6 Use Case:**
```
✅ Backend API services
✅ Cron jobs with authentication
✅ Server-side integrations
```

---

## Recommended OAuth Providers

### For DWS6 Ecosystem

| Priority | Provider | Use Case | Setup Difficulty |
|----------|----------|----------|------------------|
| 🔥 **HIGH** | **Google** | Most users have Google accounts | Easy |
| 🔥 **HIGH** | **Microsoft** | Enterprise customers, Azure integration | Easy |
| 🟡 **MEDIUM** | **LinkedIn** | Professional network, B2B | Medium |
| 🟡 **MEDIUM** | **GitHub** | Developers, technical users | Easy |
| 🟢 **LOW** | **Apple** | iOS users | Medium |
| 🟢 **LOW** | **Facebook** | Consumer apps | Easy |

### Recommended Setup for DWS6

#### **Public-Facing (Firehorse, Trials)**

```
Registration Type: Public
Client Type: Public (PKCE)
Providers:
  ✅ Google (primary)
  ✅ Microsoft (enterprise)
  ✅ LinkedIn (B2B focus)
```

#### **Internal Dashboards (V9, V8, People)**

```
Registration Type: Private
Client Type: Public (PKCE)
Providers:
  ✅ Google (primary)
  ✅ Microsoft (enterprise)
  ⚠️ Email/Password (backup)
```

---

## Setup Instructions

### Step 1: Access OAuth Settings

1. Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/auth/providers
2. Navigate to **Authentication** → **Providers**
3. Select the provider you want to configure

---

### Step 2: Configure Google OAuth

#### 2.1 Create Google OAuth App

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project (or select existing)
3. Click **Create Credentials** → **OAuth 2.0 Client ID**
4. Configure consent screen:
   - App name: `DWS IQ 6` or `Firehorse`
   - User support email: `support@dws-iq.com`
   - Developer contact: `risto@lifetime.fi`
   - Scopes: `email`, `profile`, `openid`

5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `DWS6 Production`
   - Authorized JavaScript origins:
     ```
     https://dws6.com
     https://kpucuwwfhuwurdxyjjtz.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
     ```

6. Copy **Client ID** and **Client Secret**

#### 2.2 Configure in Supabase

1. Go to Supabase → Auth → Providers → Google
2. Enable Google provider
3. Paste **Client ID**
4. Paste **Client Secret**
5. Click **Save**

#### 2.3 Test Configuration

```javascript
// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://dws6.com/auth/callback'
  }
})
```

---

### Step 3: Configure Microsoft OAuth

#### 3.1 Create Microsoft App Registration

1. Go to: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps
2. Click **New registration**
3. Configure:
   - Name: `DWS IQ 6`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: 
     ```
     Web: https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
     ```

4. After creation:
   - Copy **Application (client) ID**
   - Go to **Certificates & secrets**
   - Create new client secret
   - Copy **Client Secret Value**

5. Configure API permissions:
   - Add permission → Microsoft Graph → Delegated
   - Add: `email`, `openid`, `profile`, `User.Read`

#### 3.2 Configure in Supabase

1. Go to Supabase → Auth → Providers → Azure (Microsoft)
2. Enable Azure provider
3. Paste **Application (client) ID**
4. Paste **Client Secret**
5. Click **Save**

#### 3.3 Test Configuration

```javascript
// Sign in with Microsoft
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'azure',
  options: {
    scopes: 'email profile openid',
    redirectTo: 'https://dws6.com/auth/callback'
  }
})
```

---

### Step 4: Configure LinkedIn OAuth

#### 4.1 Create LinkedIn App

1. Go to: https://www.linkedin.com/developers/apps
2. Click **Create app**
3. Configure:
   - App name: `DWS IQ 6` or `Firehorse`
   - LinkedIn Page: Your company page
   - App logo: Upload DWS logo
   - Privacy policy URL: `https://dws10.com/privacy-policy/`
   - Legal agreement: Accept

4. After creation:
   - Go to **Auth** tab
   - Copy **Client ID**
   - Copy **Client Secret**
   - Add Redirect URL:
     ```
     https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
     ```

5. Request access to:
   - Sign In with LinkedIn
   - OpenID Connect

#### 4.2 Configure in Supabase

1. Go to Supabase → Auth → Providers → LinkedIn
2. Enable LinkedIn provider
3. Paste **Client ID**
4. Paste **Client Secret**
5. Click **Save**

#### 4.3 Test Configuration

```javascript
// Sign in with LinkedIn
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'linkedin',
  options: {
    redirectTo: 'https://dws6.com/auth/callback'
  }
})
```

---

### Step 5: Configure GitHub OAuth (Optional)

#### 5.1 Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **New OAuth App**
3. Configure:
   - Application name: `DWS IQ 6`
   - Homepage URL: `https://dws6.com`
   - Authorization callback URL:
     ```
     https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
     ```

4. Copy **Client ID** and **Client Secret**

#### 5.2 Configure in Supabase

1. Go to Supabase → Auth → Providers → GitHub
2. Enable GitHub provider
3. Paste **Client ID**
4. Paste **Client Secret**
5. Click **Save**

---

## Security Configuration

### Email Confirmation

**For Public Registration:**

```
Settings → Auth → Email Auth
✅ Enable email confirmations
✅ Secure email change
✅ Double confirm email changes
```

**For Private Registration:**

```
Settings → Auth → Email Auth
❌ Disable email confirmations (admin invites only)
✅ Secure email change
✅ Double confirm email changes
```

### Redirect URLs

**Whitelist only trusted domains:**

```
Settings → Auth → URL Configuration

Site URL:
https://dws6.com

Redirect URLs (whitelist):
https://dws6.com/**
https://dws6.com/auth/callback
https://dws6.com/dashboard/**
http://localhost:3000/** (development only)
```

### Session Configuration

```
Settings → Auth → Session

JWT expiry: 3600 seconds (1 hour)
Refresh token expiry: 2592000 seconds (30 days)
Refresh token rotation: Enabled
Reuse interval: 10 seconds
```

### Rate Limiting

```
Settings → Auth → Rate Limits

Email sign-ups: 10 per hour
Password resets: 5 per hour
Email changes: 5 per hour
```

---

## Implementation Examples

### React/Next.js Implementation

#### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

#### 2. Create Supabase Client

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kpucuwwfhuwurdxyjjtz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 3. Login Component

```javascript
// components/Login.jsx
import { supabase } from '../lib/supabase'

export default function Login() {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) console.error('Error:', error.message)
  }

  const signInWithMicrosoft = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email profile openid',
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) console.error('Error:', error.message)
  }

  const signInWithLinkedIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) console.error('Error:', error.message)
  }

  return (
    <div className="login-container">
      <h2>Sign in to DWS IQ 6</h2>
      
      <button onClick={signInWithGoogle} className="btn-google">
        <img src="/google-icon.svg" alt="Google" />
        Sign in with Google
      </button>
      
      <button onClick={signInWithMicrosoft} className="btn-microsoft">
        <img src="/microsoft-icon.svg" alt="Microsoft" />
        Sign in with Microsoft
      </button>
      
      <button onClick={signInWithLinkedIn} className="btn-linkedin">
        <img src="/linkedin-icon.svg" alt="LinkedIn" />
        Sign in with LinkedIn
      </button>
    </div>
  )
}
```

#### 4. Auth Callback Page

```javascript
// pages/auth/callback.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase automatically handles the OAuth callback
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error:', error.message)
        router.push('/login?error=auth_failed')
        return
      }

      if (session) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="auth-callback">
      <p>Completing sign in...</p>
    </div>
  )
}
```

#### 5. Protected Route Component

```javascript
// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (session) {
          setUser(session.user)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return children
}
```

#### 6. User Profile Display

```javascript
// components/UserProfile.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return null

  return (
    <div className="user-profile">
      <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
      <div>
        <p>{user.user_metadata.full_name}</p>
        <p>{user.email}</p>
        <p>Provider: {user.app_metadata.provider}</p>
      </div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

---

### Vanilla JavaScript Implementation

```html
<!-- login.html -->
<!DOCTYPE html>
<html>
<head>
  <title>DWS IQ 6 - Sign In</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="login-container">
    <h2>Sign in to DWS IQ 6</h2>
    
    <button onclick="signInWithGoogle()">
      Sign in with Google
    </button>
    
    <button onclick="signInWithMicrosoft()">
      Sign in with Microsoft
    </button>
    
    <button onclick="signInWithLinkedIn()">
      Sign in with LinkedIn
    </button>
  </div>

  <script>
    const supabaseUrl = 'https://kpucuwwfhuwurdxyjjtz.supabase.co'
    const supabaseAnonKey = 'YOUR_ANON_KEY'
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey)

    async function signInWithGoogle() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard.html'
        }
      })
      
      if (error) console.error('Error:', error.message)
    }

    async function signInWithMicrosoft() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid',
          redirectTo: window.location.origin + '/dashboard.html'
        }
      })
      
      if (error) console.error('Error:', error.message)
    }

    async function signInWithLinkedIn() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: window.location.origin + '/dashboard.html'
        }
      })
      
      if (error) console.error('Error:', error.message)
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/dashboard.html'
      }
    })
  </script>
</body>
</html>
```

---

## Troubleshooting

### Common Issues

#### 1. Redirect URI Mismatch

**Error:** `redirect_uri_mismatch`

**Solution:**
- Verify redirect URI in provider settings matches exactly:
  ```
  https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
  ```
- Check for trailing slashes
- Ensure HTTPS (not HTTP)

#### 2. Invalid Client

**Error:** `invalid_client`

**Solution:**
- Verify Client ID and Client Secret are correct
- Check if OAuth app is enabled in provider
- Ensure app is not in development mode (for production)

#### 3. Access Denied

**Error:** `access_denied`

**Solution:**
- Check OAuth scopes requested
- Verify user approved all permissions
- Check if user's account is restricted

#### 4. Session Not Persisting

**Problem:** User gets logged out on page refresh

**Solution:**
```javascript
// Ensure session persistence
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

#### 5. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Add your domain to Supabase allowed origins
- Settings → API → CORS Allowed Origins:
  ```
  https://dws6.com
  http://localhost:3000
  ```

---

## Best Practices

### Security

✅ **DO:**
- Use HTTPS for all OAuth redirects
- Whitelist specific redirect URLs
- Enable email confirmation for public registration
- Use PKCE for public clients
- Store client secrets securely (never in frontend code)
- Implement rate limiting
- Use short JWT expiry times
- Enable refresh token rotation

❌ **DON'T:**
- Use HTTP for OAuth (always HTTPS)
- Allow wildcard redirect URLs
- Store client secrets in frontend code
- Disable email confirmation without good reason
- Use long JWT expiry times (> 1 hour)
- Skip security reviews

### User Experience

✅ **DO:**
- Offer multiple OAuth providers
- Show clear provider icons
- Handle errors gracefully
- Provide fallback (email/password)
- Remember user's last provider
- Show loading states
- Redirect to intended page after login

❌ **DON'T:**
- Force users to use specific provider
- Show technical error messages
- Redirect to unexpected pages
- Lose user's navigation state

---

## Recommended Configuration for DWS6

### Public Applications (Firehorse, Trials)

```yaml
Registration Type: Public
Client Type: Public (PKCE)
Email Confirmation: Enabled
Providers:
  - Google (primary)
  - Microsoft (enterprise)
  - LinkedIn (B2B)
Redirect URLs:
  - https://dws6.com/auth/callback
  - https://dws6.com/dashboard
Session:
  JWT Expiry: 3600s (1 hour)
  Refresh Token: 30 days
  Token Rotation: Enabled
```

### Internal Dashboards (V9, V8, People)

```yaml
Registration Type: Private
Client Type: Public (PKCE)
Email Confirmation: Disabled (invite-only)
Providers:
  - Google (primary)
  - Microsoft (enterprise)
  - Email/Password (backup)
Redirect URLs:
  - https://dws6.com/v9/callback
  - https://dws6.com/v8/callback
  - https://dws6.com/people/callback
Session:
  JWT Expiry: 3600s (1 hour)
  Refresh Token: 30 days
  Token Rotation: Enabled
Row Level Security:
  - Enabled on all tables
  - User can only see their own data
```

---

## Next Steps

### Week 1: Setup OAuth Providers

- [ ] Configure Google OAuth
- [ ] Configure Microsoft OAuth
- [ ] Configure LinkedIn OAuth (optional)
- [ ] Test each provider

### Week 2: Implement Authentication

- [ ] Add login page to dws6.com
- [ ] Implement auth callback handling
- [ ] Add protected routes
- [ ] Test user flows

### Week 3: Integrate with Dashboards

- [ ] Add auth to V9 Dashboard
- [ ] Add auth to V8 Enhanced
- [ ] Add auth to People Management
- [ ] Test RLS policies

### Week 4: Polish & Deploy

- [ ] Add user profile display
- [ ] Implement sign-out
- [ ] Add error handling
- [ ] Deploy to production

---

## Documentation & Resources

### Official Documentation

- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **OAuth Providers:** https://supabase.com/docs/guides/auth/social-login
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
- **Microsoft OAuth:** https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
- **LinkedIn OAuth:** https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication

### Internal Documentation

- **Admin Manual:** `ADMIN_MANUAL_DWS6_COM.md` (Section 7)
- **Supabase Project Info:** `supabase/PROJECT_INFO.md` (⚠️ Confidential)
- **Project Strategy:** `SUPABASE_PROJECT_STRATEGY.md`
- **Wrappers Strategy:** `SUPABASE_WRAPPERS_STRATEGY.md`

---

**Version:** 1.0  
**Date:** 30. December 2025  
**Status:** 🎯 READY TO IMPLEMENT  
**Recommended:** Google + Microsoft OAuth for DWS6

---

**Document Information:**

**Title:** Supabase OAuth Setup Guide - DWS6  
**Author:** Risto Anton Päärni  
**Project:** dws6  
**Project ID:** kpucuwwfhuwurdxyjjtz  
**Classification:** Internal Technical Documentation  
**Version:** 1.0  
**Last Updated:** 30.12.2025

**License:** Proprietary - Lifetime Oy  
**Contact:** risto@lifetime.fi

