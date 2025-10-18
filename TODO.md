# InvoiceNest - Project TODO

## ✅ Completed Features

### Dashboard
- [x] Live dashboard statistics from real invoice data
- [x] Clickable stat cards linking to filtered invoice views
- [x] Revenue card with time-based filtering (Today/Week/Month/All Time/Custom)
- [x] Dynamic subscription tier display
- [x] Recent invoices section

### Invoices
- [x] Draft invoice system with localStorage persistence
- [x] Invoice templates for 8 different industries
- [x] Saved line items feature (reusable products/services)
- [x] Template selection in create invoice flow
- [x] Status filtering on invoices page (draft/sent/paid/overdue)
- [x] Individual line item save buttons
- [x] Draft selector dialog on invoice creation

### Settings
- [x] Referral program section with unique codes
- [x] Social media sharing for referrals
- [x] Referral stats dashboard

### UI Components
- [x] Dark/Light mode toggle
- [x] Dropdown menu component
- [x] Popover component for date pickers
- [x] NestCard, NestButton components
- [x] EggStatus component for invoice states

### Authentication & Authorization
- [x] Google OAuth setup
- [x] Tier-based feature flags (Free/Pro/Business)

## 🔧 Known Issues to Fix

### High Priority
- [ ] Fix dropdown-menu import error in invoices page (Module not found error)
- [ ] Fix CSS parsing error in globals.css (line 1730)
- [ ] Implement actual database storage for sent/paid invoices (currently using mock data)
- [ ] Create invoice edit functionality for sent invoices

### Medium Priority
- [ ] Add client management (CRUD operations)
- [ ] Implement email sending functionality for invoices
- [ ] Add invoice PDF generation/download
- [ ] Implement payment tracking
- [ ] Add invoice reminders/notifications

### Low Priority
- [ ] Add search functionality on invoices page
- [ ] Implement invoice duplication feature
- [ ] Add bulk actions for invoices
- [ ] Create analytics/reports section

## 🚀 Future Enhancements

### Features to Add
- [ ] Recurring invoices functionality
- [ ] Multi-currency support
- [ ] Invoice customization (colors, logos, templates)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Expense tracking
- [ ] Time tracking integration
- [ ] Mobile app
- [ ] API for integrations
- [ ] Automated late payment reminders
- [ ] Client portal for viewing/paying invoices

### Infrastructure
- [ ] Set up proper database with Supabase tables
- [ ] Implement real-time subscriptions
- [ ] Add proper error handling and logging
- [ ] Set up automated backups
- [ ] Add comprehensive testing (unit, integration, e2e)
- [ ] Implement rate limiting
- [ ] Add monitoring and analytics

### Marketing/Business
- [ ] Complete GTM strategy implementation
- [ ] Set up payment processing for subscriptions
- [ ] Create landing page conversion optimizations
- [ ] Implement referral reward system backend
- [ ] Add onboarding flow for new users

## 📝 Notes

### Current Tech Stack
- Next.js 15.5.5 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth)
- Zustand (State Management)
- date-fns (Date utilities)
- Radix UI (UI Primitives)

### Environment
- Development server running on http://localhost:3000
- Git repository: https://github.com/flyy4abrownguy/invoicenest.git
- Latest commit: 303ee64 - "Add comprehensive dashboard features and improvements"

---
Last Updated: 2025-10-18
