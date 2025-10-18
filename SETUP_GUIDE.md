# InvoiceNest Setup Guide

Follow these steps to get InvoiceNest running with full functionality.

---

## 1. Create a Supabase Project

### Step 1: Sign up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create a New Project
1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name:** invoicenest
   - **Database Password:** (generate a strong password - save it!)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### Step 3: Get API Keys
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)
   - **service_role key** (under Project API keys - keep this secret!)

### Step 4: Run Database Migration
1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify success (you should see "Success. No rows returned")

---

## 2. Configure Environment Variables

### Step 1: Update .env.local
1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 2: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 3. Enable Google OAuth (Optional)

### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure consent screen if needed
6. Application type: **Web application**
7. Add authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for local dev)
   ```
8. Copy **Client ID** and **Client Secret**

### Step 2: Configure in Supabase
1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to expand
3. Enable Google provider
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## 4. Set Up Stripe (For Payments)

### Step 1: Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account
3. Activate your account

### Step 2: Get API Keys
1. Go to **Developers** > **API keys**
2. Copy **Publishable key** and **Secret key**
3. For testing, use the test mode keys

### Step 3: Add to Environment
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Step 4: Create Products in Stripe
1. Go to **Products** > **Add Product**
2. Create two products:

**Pro Plan**
- Name: InvoiceNest Pro
- Price: $9.99/month (recurring)
- Save the Price ID

**Business Plan**
- Name: InvoiceNest Business
- Price: $24.99/month (recurring)
- Save the Price ID

---

## 5. Test the Application

### Step 1: Create an Account
1. Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Fill in your details
3. Check your email for verification link
4. Click the link to verify

### Step 2: Create Your First Invoice
1. Login at [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. You'll be redirected to the dashboard
3. Click "Create Invoice"
4. Add a client
5. Fill in invoice details
6. Click "Save & Send"

### Step 3: Verify Database
1. In Supabase dashboard, click **Table Editor**
2. You should see your data in:
   - profiles
   - clients
   - invoices
   - invoice_items

---

## 6. Optional: Email Configuration

To send invoices via email, integrate an email service:

### Option A: Resend (Recommended)
1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key
   ```

### Option B: SendGrid
1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.your_api_key
   ```

---

## 7. Deploy to Production

### Option A: Vercel (Recommended)

1. Push your code to GitHub (already done!)
2. Go to [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - Copy all values from `.env.local`
   - Paste into Vercel environment variables
   - Update `NEXT_PUBLIC_APP_URL` to your production URL
6. Click "Deploy"

### Option B: Other Platforms
InvoiceNest can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render

---

## 8. Post-Deployment Checklist

- [ ] Update OAuth redirect URIs to production URL
- [ ] Update Supabase site URL in project settings
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up database backups
- [ ] Configure error monitoring (Sentry)
- [ ] Set up analytics (PostHog/Mixpanel)
- [ ] Test all features in production
- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page

---

## Troubleshooting

### Issue: "Failed to create Supabase client"
- **Solution:** Check that environment variables are set correctly
- Restart the dev server after changing `.env.local`

### Issue: Google OAuth not working
- **Solution:** Verify redirect URIs match exactly
- Check that Google provider is enabled in Supabase

### Issue: Database queries failing
- **Solution:** Verify RLS policies are set up correctly
- Run the migration script again if needed

### Issue: Build errors
- **Solution:** Run `npm run build` to see detailed errors
- Check TypeScript errors with `npm run lint`

---

## Getting Help

If you encounter issues:
1. Check the [Supabase Docs](https://supabase.com/docs)
2. Check the [Next.js Docs](https://nextjs.org/docs)
3. Review error messages in browser console
4. Check server logs in terminal

---

## Next Steps After Setup

Once everything is running:
1. ✅ Create your first invoice
2. ✅ Add some clients
3. ✅ Test the PDF generation
4. ✅ Try the settings page
5. ✅ Explore the dashboard

Then move on to:
- Setting up API routes
- Implementing file uploads
- Configuring email sending
- Setting up Stripe webhooks
- Adding analytics

---

**You're all set! Happy invoicing! 🪹**
