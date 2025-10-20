# 🧪 InvoiceNest Testing Guide

## 🌐 **Deployment Information**

**Production URL:** https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/

**Vercel Dashboard:** https://vercel.com/akil-rajparis-projects/invoicenest

**Supabase Dashboard:** https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv

---

## 📋 **Quick Setup Checklist**

### **Step 1: Upload Environment Variables to Vercel** ⚡

1. Go to: https://vercel.com/akil-rajparis-projects/invoicenest/settings/environment-variables
2. Click **"Import .env"** button
3. Upload `.env.production` file (or paste contents)
4. Select: **Production, Preview, Development** (all three)
5. Click **Save**

### **Step 2: Update Stripe Keys** (if you want to test payments)

Before uploading, edit `.env.production` and replace:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key
```

Get these from: https://dashboard.stripe.com/test/apikeys

### **Step 3: Redeploy** 🔄

After uploading environment variables:
1. Go to: https://vercel.com/akil-rajparis-projects/invoicenest
2. Click **"Redeploy"** on the latest deployment
3. Or push a small commit to trigger auto-deploy

---

## 🧪 **Testing Workflow**

### **Phase 1: Authentication Testing** 🔐

1. **Visit the site:**
   - https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/

2. **Test Sign Up:**
   - Go to `/auth/signup`
   - Create new account with email/password
   - Check if email verification is required
   - Verify you're redirected to dashboard

3. **Test Login:**
   - Log out
   - Go to `/auth/login`
   - Log in with credentials
   - Verify redirect to dashboard

4. **Test Google OAuth** (if configured):
   - Try "Sign in with Google" button

---

### **Phase 2: Core Functionality Testing** ⚙️

#### **A. Dashboard** (`/dashboard`)
- [ ] View shows correctly
- [ ] Stats cards display (revenue, invoices, payments)
- [ ] Recent invoices list appears
- [ ] Navigation sidebar works

#### **B. Client Management** (`/dashboard/clients`)
- [ ] Click "Add Client" button
- [ ] Fill in client details:
  - Name: "Test Client Inc"
  - Email: test@client.com
  - Phone: (555) 123-4567
  - Address: "123 Test St, City, State 12345"
- [ ] Save client
- [ ] Verify client appears in grid
- [ ] Edit client details
- [ ] Search for client

#### **C. Invoice Creation** (`/dashboard/invoices/new`)
- [ ] Click "Create Invoice"
- [ ] Select test client
- [ ] Add line items:
  - Description: "Web Development"
  - Quantity: 10
  - Rate: 150
- [ ] Add another line item
- [ ] Set tax rate (e.g., 10%)
- [ ] Set discount (optional)
- [ ] Choose due date
- [ ] Add notes
- [ ] **Save as Draft** first
- [ ] Verify draft appears in list
- [ ] Edit draft
- [ ] **Send Invoice** (saves to database)

#### **D. Invoice List** (`/dashboard/invoices`)
- [ ] View all invoices
- [ ] Search invoices by number
- [ ] Filter by status
- [ ] Click on invoice to view details
- [ ] Generate PDF
- [ ] Update invoice status

---

### **Phase 3: Advanced Features Testing** 🚀

#### **E. Multi-Currency** 💱
- [ ] Create new invoice
- [ ] Select currency dropdown
- [ ] Choose EUR, GBP, or other currency
- [ ] Verify amounts display in selected currency

#### **F. Recurring Invoices** 🔄
- [ ] Go to `/dashboard/recurring-invoices`
- [ ] Create recurring invoice
- [ ] Set frequency (weekly/monthly/quarterly/yearly)
- [ ] Set start date
- [ ] Add line items
- [ ] Save
- [ ] Verify it appears in list

#### **G. Invoice Templates** 📝
- [ ] Create new invoice
- [ ] Look for "Use Template" option
- [ ] Create a template with:
  - Name: "Consulting Template"
  - Default payment terms: 30 days
  - Default tax rate: 10%
  - Pre-filled line items
- [ ] Use template for new invoice

#### **H. Client Portal** 🌐
- [ ] Create/view an invoice
- [ ] Click "Share" button
- [ ] Copy share link
- [ ] Open share link in incognito/private window
- [ ] Verify invoice displays publicly
- [ ] Test download PDF option

#### **I. Expense Tracking** 💰
- [ ] Access expense management (via API or direct URL)
- [ ] Create expense category: "Office Supplies"
- [ ] Add expense:
  - Description: "Printer Paper"
  - Amount: $25.99
  - Category: Office Supplies
  - Mark as billable
- [ ] View expenses list

---

### **Phase 4: Settings & Profile** ⚙️

#### **J. User Settings** (`/dashboard/settings`)
- [ ] Update profile:
  - Full name
  - Avatar (upload)
- [ ] Update company info:
  - Company name
  - Logo (upload)
  - Address
  - Phone
  - Email
- [ ] Save changes
- [ ] Verify changes reflect in invoices

---

### **Phase 5: Payment & Stripe Testing** 💳

#### **K. Stripe Integration** (requires Stripe keys)
- [ ] Create invoice with payment enabled
- [ ] Click "Pay Invoice" button
- [ ] Redirects to Stripe checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Verify invoice status updates to "Paid"

#### **L. Webhook Testing**
After setting up webhook in Stripe:
- [ ] Webhook endpoint: `https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/api/webhooks/stripe`
- [ ] Test payment completion
- [ ] Check Vercel logs for webhook events

**Stripe Webhook Setup:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel
6. Redeploy

---

### **Phase 6: Cron Jobs Testing** ⏰

#### **M. Recurring Invoice Generation**
Test endpoint (requires CRON_SECRET):
```bash
curl -X GET \
  https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/api/cron/generate-recurring-invoices \
  -H "Authorization: Bearer zIWYIX98rHZ3xH8gZD064BeSOCMJQQd2Xs814zvI7YI="
```

Expected response:
```json
{
  "message": "Recurring invoices generated",
  "generated": 0,
  "skipped": 0,
  "failed": 0
}
```

#### **N. Payment Reminders** (requires RESEND_API_KEY)
```bash
curl -X GET \
  https://invoicenest-c7qb0vp7r-akil-rajparis-projects.vercel.app/api/cron/send-payment-reminders \
  -H "Authorization: Bearer zIWYIX98rHZ3xH8gZD064BeSOCMJQQd2Xs814zvI7YI="
```

Expected response:
```json
{
  "message": "Payment reminders sent",
  "success": 0,
  "failed": 0,
  "skipped": 0
}
```

**Vercel Cron Schedule:**
- Recurring invoices: Daily at midnight UTC (`0 0 * * *`)
- Payment reminders: Daily at 9 AM UTC (`0 9 * * *`)

Configured in `vercel.json`

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: "Authentication Error"**
**Symptoms:** Can't sign up or log in

**Fixes:**
- Check Supabase environment variables are uploaded to Vercel
- Verify Supabase project is active at https://supabase.com/dashboard
- Check browser console for specific error messages
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Try clearing browser cache and cookies

### **Issue 2: "Failed to create invoice"**
**Symptoms:** Error when saving invoice

**Fixes:**
- Check database migrations are applied in Supabase SQL Editor
- Verify RLS (Row Level Security) policies are active
- Check Vercel deployment logs for server errors
- Ensure user is authenticated
- Verify all required fields are filled

### **Issue 3: PDF Generation Fails**
**Symptoms:** PDF doesn't download or shows blank

**Fixes:**
- Check browser console for errors
- Verify invoice has all required fields (client, items, amounts)
- Try in different browser (Chrome recommended)
- Check if invoice ID is valid
- Look for errors in Vercel function logs

### **Issue 4: Stripe Not Working**
**Symptoms:** Payment button doesn't work or redirects fail

**Fixes:**
- Verify Stripe keys are correct (test vs live mode)
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in Vercel
- Verify webhook secret matches Stripe dashboard
- Test with Stripe test card: `4242 4242 4242 4242`
- Check Stripe dashboard for failed payments
- Verify `NEXT_PUBLIC_APP_URL` is set correctly

### **Issue 5: Emails Not Sending**
**Symptoms:** Payment reminders don't send

**Fixes:**
- Add `RESEND_API_KEY` to Vercel environment variables
- Verify sender email is verified in Resend dashboard
- Check Vercel function logs for email errors
- Test Resend API key at https://resend.com/api-keys
- Verify email template is configured

### **Issue 6: Images/Logos Not Uploading**
**Symptoms:** Avatar or company logo upload fails

**Fixes:**
- Verify Supabase Storage is set up (migration `002_storage_setup.sql`)
- Check Storage policies in Supabase dashboard
- Verify file size is under 5MB
- Check file type is image (jpg, png, gif, svg)
- Look for CORS errors in browser console

### **Issue 7: Recurring Invoices Not Generating**
**Symptoms:** Cron job doesn't create invoices automatically

**Fixes:**
- Verify `CRON_SECRET` is set in Vercel
- Check Vercel cron logs
- Test cron endpoint manually with curl command (see Phase 6)
- Verify recurring invoice has future `next_generation_date`
- Check if recurring invoice is marked as `is_active`

### **Issue 8: Client Portal Link Broken**
**Symptoms:** Shared invoice link shows 404 or error

**Fixes:**
- Verify invoice has been shared (check `invoice_shares` table)
- Check if share token is valid
- Verify share hasn't expired
- Test link in incognito mode
- Check Vercel deployment logs

---

## 📊 **Where to Check Logs**

### **1. Vercel Logs**
**URL:** https://vercel.com/akil-rajparis-projects/invoicenest/logs

**What to check:**
- Function execution errors
- API route failures
- Build/deployment errors
- Cron job execution logs

### **2. Supabase Logs**
**URL:** https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/logs/explorer

**What to check:**
- Database query errors
- RLS policy violations
- Authentication failures
- Storage upload errors

### **3. Browser Console**
**How to access:** Press F12 → Console tab

**What to check:**
- JavaScript errors
- Network request failures
- React component errors
- API response errors

### **4. Stripe Dashboard**
**URL:** https://dashboard.stripe.com/test/events

**What to check:**
- Payment events
- Webhook delivery status
- Failed payment attempts
- Test mode vs live mode

---

## ✅ **Success Criteria**

Your InvoiceNest deployment is working correctly if:

### **Essential Features:**
- ✅ You can sign up and log in
- ✅ Dashboard loads with stats
- ✅ You can create and save clients
- ✅ You can create and send invoices
- ✅ PDFs generate correctly
- ✅ Invoice status updates work
- ✅ Settings save properly

### **Advanced Features:**
- ✅ Multi-currency selector works
- ✅ Recurring invoices can be created
- ✅ Invoice templates can be saved and used
- ✅ Client portal links work
- ✅ Expenses can be tracked

### **Integrations:**
- ✅ Stripe payments process (if configured)
- ✅ Email reminders send (if Resend configured)
- ✅ Cron jobs execute on schedule

---

## 🎯 **Quick Test Scenario**

**Goal:** Create and send an invoice in under 5 minutes

1. **Login** → `/auth/login`
2. **Add Client** → `/dashboard/clients` → "Add Client"
   - Name: "Acme Corp"
   - Email: "billing@acme.com"
3. **Create Invoice** → `/dashboard/invoices/new`
   - Select "Acme Corp"
   - Add item: "Consulting Services" | Qty: 10 | Rate: $150
   - Tax: 10%
   - Due date: 30 days from now
   - Click "Send Invoice"
4. **Verify Invoice** → `/dashboard/invoices`
   - See invoice in list
   - Status shows "sent"
   - Click to view details
5. **Generate PDF** → Click "Download PDF"
   - PDF opens/downloads
   - Shows all invoice details correctly
6. **Share Invoice** → Click "Share" button
   - Copy link
   - Open in incognito window
   - Verify public view works

**Time:** ~3-5 minutes
**Result:** ✅ Core functionality confirmed working

---

## 🔄 **Next Session Checklist**

Before starting your next development session:

- [ ] Review `NEXT_SESSION.md` for high-priority TODOs
- [ ] Check Vercel deployment status
- [ ] Verify all environment variables are set
- [ ] Test authentication still works
- [ ] Run a quick invoice creation test
- [ ] Check for any Vercel function errors
- [ ] Review Supabase database health

---

## 📝 **Testing Notes Template**

Use this template to document your test results:

```markdown
## Testing Session - [Date]

### Environment
- [ ] Production
- [ ] Preview
- [ ] Local

### Tests Performed
- [ ] Authentication
- [ ] Invoice Creation
- [ ] PDF Generation
- [ ] Payments (Stripe)
- [ ] Other: _______________

### Issues Found
1. [Description of issue]
   - Expected: ...
   - Actual: ...
   - Steps to reproduce: ...

### Fixes Applied
1. [Description of fix]
   - Commit: [commit hash]
   - Result: ✅ / ❌

### Next Steps
- [ ] ...
- [ ] ...
```

---

**Happy Testing! 🚀**

*Last Updated: 2025-10-19*
