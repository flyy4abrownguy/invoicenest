# Next Session Tasks

## Don't Forget - Critical Setup Steps

### 1. Upload Environment Variables to Vercel
**Easy Method:** Use `.env.vercel.template` file
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Click **"Import .env"** button
- Upload or paste contents of `.env.vercel.template`
- Select environments: Production, Preview, Development

**Before uploading, update these values in `.env.vercel.template`:**
- `NEXT_PUBLIC_APP_URL` → Your actual Vercel URL (e.g., `https://invoicenest.vercel.app`)
- `STRIPE_SECRET_KEY` → Your real Stripe secret key from https://dashboard.stripe.com/apikeys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Your real Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` → Your Stripe webhook secret (create webhook first)
- `RESEND_API_KEY` → Your Resend API key from https://resend.com/api-keys (for email reminders)
- `RESEND_FROM_EMAIL` → Your sender email (optional, e.g., `invoices@yourdomain.com`)

**Critical Variables:**
- ✅ `CRON_SECRET` is already set (DO NOT CHANGE)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is sensitive - keep it secret!

### 2. Create Stripe Webhook (for Payment Processing)
- Go to https://dashboard.stripe.com/webhooks
- Create endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Test Cron Jobs After Deployment
- **Recurring Invoice Generation**: `/api/cron/generate-recurring-invoices`
  - Schedule: Daily at midnight UTC
- **Payment Reminders**: `/api/cron/send-payment-reminders`
  - Schedule: Daily at 9 AM UTC

### 4. Deploy to Vercel
```bash
git push origin main
```

---

## Features Implemented This Session

✅ **Recurring Invoices** - Activation complete with cron job
✅ **Multi-Currency Support** - 10 major currencies
✅ **Invoice Templates & Themes** - Reusable templates with styling
✅ **Payment Reminders** - Automated email reminders
✅ **Expense Tracking** - Full CRUD with categories
✅ **Client Portal** - Public invoice sharing and viewing

---

## Potential Next Session Features

### Option 1: UI Integration for New Features
- Add Expenses page to dashboard
- Add Templates management page
- Add Payment Reminder settings page
- Integrate currency selector into invoice form
- Add expense tracking to invoice creation

### Option 2: Additional Features
1. **Invoice Analytics Dashboard**
   - Revenue charts
   - Client profitability analysis
   - Expense vs income reports
   - Payment trends

2. **Advanced Client Portal**
   - Client login with password
   - View all invoices for a client
   - Payment history
   - Download multiple invoices

3. **Team Collaboration**
   - Multi-user support
   - Role-based permissions
   - Activity logs
   - Team member invitations

4. **Integrations**
   - QuickBooks sync
   - Xero integration
   - Zapier webhooks
   - Calendar integrations for due dates

5. **Mobile Optimization**
   - Progressive Web App (PWA)
   - Mobile-responsive improvements
   - Native mobile notifications

6. **Advanced Features**
   - Late fees automation
   - Discounts & promotions
   - Subscription billing
   - Multi-language support
   - Custom invoice numbering schemes

---

## Known TODOs

### High Priority
- [ ] **Add Bitcoin (BTC) payment option** - Alternative to Stripe for cryptocurrency payments
- [ ] **Add border styling to custom invoices** - Border colors, widths, styles for invoice templates
- [ ] **Add custom payment reminder days** - Let users set custom number of days before/after due date (current: fixed at 7,3,1 before and 1,7,14 after)
- [ ] Add UI pages for expense management
- [ ] Add UI pages for template management
- [ ] Add payment reminder settings page with custom days input
- [ ] Integrate currency selector into invoice form
- [ ] Add notification system for invoice views/payments (user mentioned this)

### Testing & Setup
- [ ] Test all cron jobs after deployment
- [ ] Verify payment reminder schedule works with custom day settings

### Nice to Have
- [ ] Create default expense categories on user signup
- [ ] Add expense attachment/receipt upload functionality
- [ ] Add PDF generation for expenses
- [ ] Add bulk actions for expenses (export, delete, mark as billed)

---

## Environment Variables Reference
See `vercel-env-variables.txt` for the complete list of environment variables needed.
