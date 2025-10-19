# Next Session Tasks

## Don't Forget - Critical Setup Steps

### 1. Add CRON_SECRET to Vercel Environment Variables
- Go to Vercel Project Settings → Environment Variables
- Add: `CRON_SECRET` = `zIWYIX98rHZ3xH8gZD064BeSOCMJQQd2Xs814zvI7YI=`
- Set for: Production, Preview, and Development

### 2. Configure Email Service (for Payment Reminders)
- Add `RESEND_API_KEY` to Vercel environment variables
- Add `RESEND_FROM_EMAIL` to Vercel (optional, e.g., `invoices@yourdomain.com`)
- Or use the default: `onboarding@resend.dev`

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

- [ ] Add UI pages for expense management
- [ ] Add UI pages for template management
- [ ] Add payment reminder settings page
- [ ] Integrate currency selector into invoice form
- [ ] Add notification system for invoice views/payments (user mentioned this)
- [ ] Test all cron jobs after deployment
- [ ] Create default expense categories on user signup
- [ ] Add expense attachment/receipt upload functionality
- [ ] Add PDF generation for expenses
- [ ] Add bulk actions for expenses (export, delete, mark as billed)

---

## Environment Variables Reference
See `vercel-env-variables.txt` for the complete list of environment variables needed.
