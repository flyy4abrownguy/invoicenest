# InvoiceNest Setup Guide

This guide will walk you through setting up InvoiceNest from scratch.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account (free tier works)
- A Stripe account (optional for payments)
- Git

## Step-by-Step Setup

### 1. Initial Setup

```bash
# Clone or navigate to the project
cd invoicenest

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - Name: invoicenest
   - Database Password: (generate a strong password)
   - Region: (choose closest to you)

#### Get Your Credentials

1. Go to Project Settings → API
2. Copy these values to `.env.local`:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

#### Run Database Migrations

1. Go to SQL Editor in Supabase
2. Click "New Query"
3. Copy the entire database schema from `PROJECT_PLAN.md` (starting with CREATE TABLE)
4. Click "Run"

This creates:
- All tables (profiles, clients, invoices, etc.)
- Row Level Security policies
- Indexes for performance

#### Set Up Authentication

1. Go to Authentication → Providers
2. Enable Email provider (already enabled by default)
3. Optional: Enable Google OAuth
   - Create OAuth app in Google Cloud Console
   - Add credentials to Supabase
4. Configure email templates (optional)

### 3. Stripe Setup (Optional - for payments)

#### Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete account setup

#### Get API Keys

1. Go to Developers → API keys
2. Copy these to `.env.local`:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

#### Create Products

1. Go to Products → Add Product
2. Create "Pro Nest":
   - Name: Pro Nest
   - Price: $9.99/month
   - Recurring
   - Copy Price ID
3. Create "Business Nest":
   - Name: Business Nest
   - Price: $24.99/month
   - Recurring
   - Copy Price ID

#### Set Up Webhooks

1. Go to Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the Application

1. **Landing Page**: Visit homepage, check design
2. **Sign Up**: Create a test account
3. **Dashboard**: Should see empty nest
4. **Create Invoice**: Try creating a sample invoice
5. **PDF Export**: Download PDF (will have watermark on free tier)

### 6. Deployment to Vercel

#### Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Or use the Vercel dashboard:

1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Connect your GitHub repo
4. Add environment variables
5. Deploy!

#### Environment Variables in Vercel

Add all variables from `.env.local`:
- Supabase credentials
- Stripe credentials
- Set `NEXT_PUBLIC_APP_URL` to your Vercel URL

#### Update Supabase Settings

1. Go to Authentication → URL Configuration
2. Add your Vercel URL to:
   - Site URL
   - Redirect URLs

#### Update Stripe Webhooks

1. Update webhook URL to your production domain
2. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### 7. Custom Domain (Optional)

#### In Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., invoicenest.com)
3. Configure DNS as instructed

#### Update Environment:
- Change `NEXT_PUBLIC_APP_URL` to your domain
- Update Supabase redirect URLs
- Update Stripe webhook URL

### 8. Monitoring & Analytics

#### Set Up Error Tracking (Sentry)

```bash
npm install @sentry/nextjs

# Follow prompts
npx @sentry/wizard@latest -i nextjs
```

#### Set Up Analytics (PostHog)

```bash
npm install posthog-js

# Add to app/layout.tsx
```

## Common Issues

### Issue: Supabase connection fails

**Solution**:
- Check environment variables are correct
- Ensure Supabase project is active
- Check network/firewall

### Issue: Authentication doesn't work

**Solution**:
- Verify redirect URLs in Supabase match your domain
- Check email templates are configured
- Look at Supabase Auth logs

### Issue: Stripe webhooks failing

**Solution**:
- Verify webhook secret is correct
- Check endpoint URL is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Issue: Build fails

**Solution**:
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors: `npm run build`

### Issue: Database queries fail

**Solution**:
- Check Row Level Security policies are set up
- Verify user is authenticated
- Check Supabase logs for detailed errors

## Next Steps

1. **Customize branding**: Update colors, logo in code
2. **Add email templates**: Set up transactional emails
3. **Create content**: Add blog, help docs
4. **Marketing**: Set up SEO, social media
5. **Launch**: Share with users!

## Getting Help

- Check `PROJECT_PLAN.md` for architecture details
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Open an issue on GitHub

---

**Happy nesting! 🪹**
