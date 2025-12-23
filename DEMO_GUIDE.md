# InvoiceNest Demo Guide

This guide will help you show off all features of InvoiceNest to your friend locally without deploying.

## Quick Setup (5 minutes)

### 1. Seed Demo Data

First, you need to create a user account and seed it with demo data:

```bash
# Start the dev server in one terminal
npm run dev

# In your browser, go to http://localhost:3000
# Sign up with a new account (use any email for demo)

# Once signed up, note your email address
# Then run the seeding script in another terminal:
node scripts/seed-demo-data.js your@email.com
```

This will create:
- ✅ 4 demo clients
- ✅ 4 invoices (draft, sent, paid, overdue)
- ✅ 5 expense categories
- ✅ 4 expenses
- ✅ 1 recurring invoice template
- ✅ 1 invoice template
- ✅ Pro subscription tier (so you can access all features)

### 2. Start Demo Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Feature Walkthrough

### 🏠 Landing Page
**URL:** `http://localhost:3000`

**Show:**
- Marketing homepage with nest theme
- "Get Started" call-to-action
- Professional branding

**Action:** Click "Get Started" or "Sign In"

---

### 🔐 Authentication
**URL:** `http://localhost:3000/auth/login`

**Show:**
- Email/password login
- Google OAuth option (won't work locally without setup)
- Sign up flow

**Action:** Log in with the account you created

---

### 📊 Dashboard
**URL:** `http://localhost:3000/dashboard`

**Show:**
- Welcome message with user name
- Stats cards:
  - Total invoices (4)
  - Total revenue ($20,285.50)
  - Awaiting payment
  - Overdue count
- Revenue chart visualization
- Invoice status chart
- Recent invoices feed

**Action:** Explore the dashboard metrics

---

### 📄 Invoice Management
**URL:** `http://localhost:3000/dashboard/invoices`

**Features to Show:**

1. **Invoice List View**
   - Search bar (try searching by client name)
   - Status filter (All, Draft, Sent, Paid, Overdue)
   - Invoice cards with:
     - Invoice number
     - Client name
     - Amount
     - Due date
     - Status badges (color-coded)
   - Action buttons (View, Edit, Delete)

2. **Create New Invoice**
   - Click "+ New Invoice" button
   - **Show:**
     - Client selection dropdown
     - Invoice number (auto-generated)
     - Issue & due dates
     - Dynamic line items (add multiple)
     - Quantity × Rate = Amount calculation
     - Subtotal calculation
     - Tax rate selector
     - Discount field
     - Total calculation (live updates)
     - Currency selector (10 currencies)
     - Payment terms
     - Notes field
   - Save as draft or mark as sent

3. **View Invoice Detail**
   - Click on any invoice
   - **Show:**
     - Full invoice layout
     - Download PDF button
     - Send Email button
     - Share Link button
     - Payment Link button (Stripe integration)
     - Status update options
     - Edit button

4. **Download PDF**
   - Click "Download PDF"
   - **Show:**
     - Professional PDF with company branding
     - No watermark (Pro tier)
     - Print-ready format

5. **Email Invoice**
   - Click "Send Email"
   - Note: Email won't actually send without Resend API key configured
   - **Show:** Email preview modal

6. **Share Invoice**
   - Click "Share Link"
   - **Show:**
     - Generate public link with token
     - Password protection option
     - Expiration date setting
     - Copy link to clipboard
   - Open the link in incognito window to show public view

---

### 👥 Client Management
**URL:** `http://localhost:3000/dashboard/clients`

**Show:**
- Grid of client cards
- "+ Add Client" button
- Each card shows:
  - Client name
  - Email
  - Phone
  - Address
  - Notes
  - Edit/Delete actions

**Action:**
- Click "+ Add Client"
- Fill in: Name, Email, Phone, Address, Notes
- Save and see it appear in grid

**Advanced:**
- Click on a client to see their invoices
- Edit client information
- Delete a client (shows confirmation)

---

### 🔄 Recurring Invoices
**URL:** `http://localhost:3000/dashboard/recurring-invoices`

**Show:**
- List of recurring invoice templates
- Each template shows:
  - Client name
  - Frequency (Weekly/Monthly/Quarterly/Yearly)
  - Next generation date
  - Total amount
  - Active/Inactive status

**Action:**
- Click "+ New Recurring Invoice"
- **Show:**
  - Client selection
  - Frequency dropdown
  - Start date
  - Optional end date
  - Line items (same as regular invoice)
  - Tax rate, payment terms
  - Save template

- Click "Generate Now" on existing template
- **Show:** Creates new invoice instantly

---

### 💰 Expense Tracking
**URL:** `http://localhost:3000/dashboard/expenses` (you may need to add this page)

**Show:**
- List of expenses
- Categories with colors
- Filter by:
  - Category
  - Date range
  - Billable vs non-billable
  - Client
- Each expense shows:
  - Description
  - Amount
  - Category
  - Date
  - Payment method
  - Billable flag

**Action:**
- Click "+ Add Expense"
- **Show:**
  - Amount field
  - Currency selector
  - Date picker
  - Category dropdown
  - Description
  - Payment method (Cash/Credit/Debit/Bank Transfer/Check)
  - Billable checkbox
  - Client selection (if billable)
  - Receipt URL (optional)

---

### 🎨 Invoice Templates
**URL:** `http://localhost:3000/dashboard/templates` (you may need to add this page)

**Show:**
- Custom invoice templates
- Pre-filled line items
- Theme customization:
  - Color picker
  - Font family selection
  - Logo position
- Default payment terms
- Default tax rate
- Set as default template

**Action:**
- Create a template with pre-filled services
- Use template when creating new invoice

---

### 🏪 Client Portal
**URL:** `http://localhost:3000/portal/[token]`

**Show:**
- Public invoice view (no login required)
- Invoice details displayed beautifully
- Download PDF button
- Pay Now button (Stripe checkout)
- Password protection (if enabled)
- Expiration message (if expired)

**Action:**
- Share link with "client" (open in incognito)
- Show how they can view and pay

---

### ⚙️ Settings
**URL:** `http://localhost:3000/dashboard/settings`

**Show tabs:**

1. **Profile Tab**
   - Full name
   - Avatar upload
   - Email (read-only)

2. **Company Tab**
   - Company name
   - Logo upload
   - Company address
   - Company phone
   - Company email

3. **Preferences Tab**
   - Default currency
   - Theme toggle (light/dark)
   - Date format
   - Number format

4. **Billing Tab**
   - Current plan (Pro - showing demo)
   - Usage statistics
   - Upgrade/downgrade options
   - Billing history

**Action:**
- Upload a company logo
- Toggle dark mode
- Change default currency

---

### 💳 Payment Flow (Stripe)
**URL:** Any invoice → "Pay Now" button

**Show:**
- Click "Pay Now" on an invoice
- Note: Requires real Stripe test keys for full demo
- **Show:** Stripe checkout page would open
- Explain: After payment, webhook updates invoice to "Paid"

---

### 📈 Reports & Analytics
**URL:** `http://localhost:3000/dashboard/reports` (if implemented)

**Show:**
- Revenue over time
- Invoice status breakdown
- Top clients by revenue
- Payment trends
- Export to CSV/Excel

---

## Key Features to Highlight

### 1. Multi-Currency Support
- Show invoice creation with different currencies
- 10 supported currencies: USD, EUR, GBP, CAD, AUD, JPY, INR, CHF, CNY, SEK

### 2. Real-Time Calculations
- Show adding line items and watching totals update
- Apply tax rates and discounts
- Everything calculates automatically

### 3. Status Flow
- Draft → Sent → Paid
- Overdue detection
- Status badges with colors

### 4. Nest Theme
- Point out the warm, nest-inspired design
- Egg metaphors for invoices
- Smooth animations
- Professional yet friendly

### 5. Tier Differentiation
- Explain Free vs Pro vs Business features
- Show Pro features you're using (no watermark, recurring invoices, etc.)

---

## Demo Tips

### Before Your Friend Arrives
1. ✅ Run `npm run dev` and make sure it's working
2. ✅ Seed demo data with your email
3. ✅ Log in and verify all data is there
4. ✅ Test creating a new invoice
5. ✅ Test downloading a PDF
6. ✅ Open dashboard and settings tabs

### During Demo
1. Start with the landing page to show marketing
2. Show the dashboard with stats and charts
3. Create a new invoice live (shows real-time calculations)
4. Download a PDF to show professional output
5. Show client management
6. Show recurring invoices (unique feature)
7. Show expense tracking
8. Show settings with company branding
9. Show client portal (public view)
10. End with explaining subscription tiers

### Talking Points
- "Built with Next.js 15, TypeScript, and Supabase"
- "Stripe integration for payments"
- "Row-level security for data isolation"
- "Professional PDF generation"
- "Recurring invoice automation"
- "Multi-currency support"
- "Client portal for easy payment"
- "Expense tracking for profitability"

---

## Troubleshooting

### Issue: "No data showing"
**Solution:** Run the seeding script with your email:
```bash
node scripts/seed-demo-data.js your@email.com
```

### Issue: "Stripe payment not working"
**Solution:** You need real Stripe test keys. For demo purposes, just explain the flow without clicking "Pay Now"

### Issue: "Email not sending"
**Solution:** You need Resend API key. For demo, show the email button and explain it would send

### Issue: "Port 3000 already in use"
**Solution:**
```bash
lsof -ti:3000 | xargs kill
npm run dev
```

### Issue: "Build errors"
**Solution:**
```bash
rm -rf .next
npm run dev
```

---

## After Demo

If your friend wants to try it themselves:
1. Have them sign up with their own email
2. Run seeding script with their email
3. They can explore everything

If they want their own deployment:
1. Fork the repository
2. Set up Supabase project
3. Set up Stripe account
4. Deploy to Vercel
5. Add environment variables

---

## Features NOT Available Locally Without Setup

These features require additional API keys/setup:

- ❌ **Email sending** - Needs Resend API key
- ❌ **Google OAuth** - Needs Google Cloud OAuth credentials
- ❌ **Stripe payments** - Needs real Stripe test keys
- ❌ **Automated payment reminders** - Needs email + cron setup
- ❌ **QuickBooks/Xero integration** - Needs OAuth setup

But you can still **show and explain** these features!

---

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Seed demo data
node scripts/seed-demo-data.js your@email.com

# Build for production
npm run build

# Start production server
npm start

# Kill port 3000
lsof -ti:3000 | xargs kill
```

---

**Have a great demo! 🚀**
