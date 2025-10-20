# 🔐 Authentication Troubleshooting Guide

## Issues Reported

### ❌ Issue 1: Email Verification Not Received
**Symptom:** After signing up, no confirmation email arrives

### ❌ Issue 2: Google OAuth Loading Loop
**Symptom:** After selecting Google account, page enters infinite loading state

---

## 🔧 Fixes Applied

### Fix 1: Enhanced OAuth Callback Error Handling
**File:** `app/auth/callback/route.ts`

**What was changed:**
- Added error parameter detection from OAuth providers
- Added proper error handling for session exchange
- Redirect to login with error message on failure
- Added console logging for debugging

### Fix 2: Login Page Error Display
**File:** `app/auth/login/page.tsx`

**What was changed:**
- Added URL parameter error checking
- Display OAuth errors from callback redirect
- Show user-friendly error messages

---

## 🛠️ Supabase Configuration Required

### Step 1: Check Email Confirmation Settings

1. Go to: https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/auth/url-configuration
2. Navigate to **Authentication** → **Email Templates**
3. Check if email confirmation is **ENABLED** or **DISABLED**

#### **Option A: Disable Email Confirmation** (Quick Fix for Testing)
✅ **Recommended for development/testing**

1. Go to **Authentication** → **Providers** → **Email**
2. Find "Confirm email" setting
3. **Disable** it
4. Save changes
5. Users can now sign up and login immediately without email verification

#### **Option B: Enable Email Sending** (Production Ready)
✅ **Recommended for production**

1. **Configure SMTP Settings:**
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Enable "Custom SMTP"
   - Add your SMTP credentials (Gmail, SendGrid, Mailgun, etc.)

2. **OR Use Supabase Default Email** (Limited):
   - Supabase provides default email for testing
   - Check spam folder
   - May have delivery issues

3. **Verify Email Templates:**
   - Go to **Authentication** → **Email Templates**
   - Check "Confirm signup" template
   - Verify `{{ .ConfirmationURL }}` is present
   - Test by sending yourself a test email

---

### Step 2: Configure Google OAuth Provider

1. Go to: https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/auth/providers
2. Click on **Google** provider
3. Verify the following:

#### **Google OAuth Configuration Checklist:**

- [ ] **Google OAuth is ENABLED**
- [ ] **Client ID** is set (from Google Cloud Console)
- [ ] **Client Secret** is set (from Google Cloud Console)
- [ ] **Authorized redirect URIs** includes:
  ```
  https://fplpcetyjzzpxjetswhv.supabase.co/auth/v1/callback
  ```

#### **If Not Configured - Set Up Google OAuth:**

1. **Create Google OAuth App:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create new project (or use existing)
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: "InvoiceNest"

2. **Add Authorized Redirect URIs:**
   ```
   https://fplpcetyjzzpxjetswhv.supabase.co/auth/v1/callback
   ```

3. **Copy Credentials:**
   - Copy **Client ID**
   - Copy **Client Secret**

4. **Add to Supabase:**
   - Go back to Supabase Auth Providers → Google
   - Paste Client ID
   - Paste Client Secret
   - Enable Google provider
   - Save

---

### Step 3: Verify Site URL Configuration

1. Go to: https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/auth/url-configuration
2. Check **Site URL** settings:

**Should be:**
```
https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app
```

3. Check **Redirect URLs**:

**Should include:**
```
https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/auth/callback
https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/dashboard
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
```

4. **Wildcard Patterns** (Optional for flexibility):
```
https://invoicenest-*.vercel.app/*
```

---

## 🧪 Testing After Fixes

### Test 1: Email/Password Sign Up (Without Email Confirmation)

1. **Disable email confirmation** in Supabase (see Step 1, Option A)
2. Go to: https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/auth/signup
3. Fill in form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
4. Click "Create Account"
5. **Expected:** Redirect to dashboard immediately
6. **If fails:** Check browser console and Supabase logs

### Test 2: Google OAuth Sign In

1. Make sure Google OAuth is configured (see Step 2)
2. Go to: https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/auth/login
3. Click "Google" button
4. **Expected:** Redirect to Google login
5. Select Google account
6. **Expected:** Redirect back to dashboard
7. **If fails:** Check for error message on login page
8. **If loading loop:** Check browser console for errors

### Test 3: Email/Password Login

1. Go to: https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/auth/login
2. Enter credentials from Test 1
3. Click "Sign In"
4. **Expected:** Redirect to dashboard
5. **If fails:** Check error message

---

## 🐛 Common Errors & Solutions

### Error: "Email not confirmed"
**Solution:** Disable email confirmation in Supabase Auth settings

### Error: "Invalid OAuth state"
**Solution:**
- Check redirect URLs are correctly configured
- Verify Site URL matches your deployment
- Clear browser cookies and try again

### Error: "OAuth provider not configured"
**Solution:**
- Enable Google provider in Supabase
- Add Google OAuth credentials
- Verify redirect URI in Google Cloud Console

### Error: Loading loop after Google selection
**Causes:**
1. Redirect URL mismatch
2. Missing callback route
3. Session exchange failure

**Solutions:**
- Check browser console for specific error
- Verify `/auth/callback` route exists
- Check Supabase logs for session errors
- Ensure Site URL is correct

### Error: "User already registered"
**Solution:**
- User exists in database
- Try logging in instead
- OR delete user from Supabase dashboard and try again

---

## 📊 Where to Check Logs

### 1. Browser Console
**How:** F12 → Console tab

**Look for:**
- JavaScript errors
- Network request failures
- OAuth redirect errors
- Supabase auth errors

### 2. Supabase Auth Logs
**URL:** https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/auth/users

**Check:**
- User sign-up events
- OAuth login attempts
- Email confirmation status
- Failed authentication attempts

### 3. Vercel Function Logs
**URL:** https://vercel.com/akil-rajparis-projects/invoicenest/logs

**Filter for:** `/auth/callback`

**Look for:**
- OAuth error parameters
- Session exchange errors
- Redirect issues

---

## ✅ Verification Checklist

After applying fixes and configuration:

### Supabase Configuration:
- [ ] Email confirmation is disabled (for testing) OR SMTP is configured
- [ ] Google OAuth provider is enabled
- [ ] Google Client ID and Secret are set
- [ ] Site URL matches production URL
- [ ] Redirect URLs include all necessary paths
- [ ] Google Cloud Console has correct redirect URI

### Code Changes:
- [ ] `app/auth/callback/route.ts` updated with error handling
- [ ] `app/auth/login/page.tsx` updated to show OAuth errors
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel redeployed with latest code

### Testing:
- [ ] Email/password sign up works
- [ ] Email/password login works
- [ ] Google OAuth sign in works
- [ ] No loading loops
- [ ] Dashboard loads after authentication
- [ ] User profile is created in database

---

## 🚀 Quick Fix Summary

### For Immediate Testing:

1. **Disable Email Confirmation:**
   ```
   Supabase → Auth → Providers → Email → Disable "Confirm email"
   ```

2. **Deploy Code Fixes:**
   ```bash
   git add -A
   git commit -m "Fix OAuth callback error handling"
   git push origin main
   ```

3. **Verify Redirect URLs:**
   ```
   Supabase → Auth → URL Configuration → Add production URL
   ```

4. **Test Sign Up:**
   ```
   Sign up with email/password → Should work immediately
   ```

---

## 📞 Still Not Working?

### Debug Steps:

1. **Check Supabase Status:**
   - Visit: https://status.supabase.com/
   - Verify all services are operational

2. **Test Authentication Directly:**
   ```javascript
   // Run in browser console on your site
   const { data, error } = await window.supabase.auth.getSession()
   console.log('Session:', data, error)
   ```

3. **Check Network Tab:**
   - F12 → Network
   - Try authentication
   - Look for failed requests to Supabase
   - Check request/response details

4. **Verify Environment Variables:**
   - Vercel → Settings → Environment Variables
   - Check `NEXT_PUBLIC_SUPABASE_URL`
   - Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Redeploy if changed

5. **Clear Everything:**
   - Clear browser cache
   - Clear cookies
   - Try incognito mode
   - Try different browser

---

## 📝 Report Template

If still experiencing issues, gather this information:

```
**Issue:** [Email not received / Google OAuth loop]

**Browser:** [Chrome/Firefox/Safari + version]

**Steps Taken:**
1.
2.
3.

**Error Message:**
[Exact error from browser console]

**Supabase Configuration:**
- Email confirmation: [Enabled/Disabled]
- Google OAuth: [Enabled/Disabled]
- Site URL: [Your URL]

**Browser Console Log:**
[Paste any errors]

**Supabase Auth Logs:**
[Screenshot or paste]

**Network Request:**
[Failed request details from Network tab]
```

---

**Last Updated:** 2025-10-19
**Status:** Fixes applied, awaiting Supabase configuration
