# InvoiceNest - Project Plan & Build Guide

## Overview
InvoiceNest is a production-ready invoice generator SaaS application with a warm, nest-themed brand identity. This document outlines the complete build plan, architecture, and implementation strategy.

## Brand Identity

### Core Concept
InvoiceNest represents a safe, organized "nest" where all invoices live. Every aspect of the app reflects this metaphor:
- **Invoices = Eggs** in your nest
- **Creating invoice = Laying an egg**
- **Dashboard = Your nest** view
- **Saved invoices = Safely nested**

### Color Palette
- **Primary**: Warm teal (#0d9488) to soft blue (#06b6d4) - trust, calm
- **Secondary**: Soft amber (#f59e0b) to gold (#eab308) - warmth, value
- **Accent**: Sage green (#10b981) - growth, success
- **Background**: Soft cream (#fafaf9) - eggshell color
- **Text**: Warm dark brown (#292524)
- **Dark Mode**: Warm dark tones (#1c1917 base)

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom nest theme
- **UI Components**: Shadcn/ui + Custom nest components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **PDF Generation**: @react-pdf/renderer
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with @supabase/ssr
- **Storage**: Supabase Storage
- **Payments**: Stripe

### DevOps
- **Hosting**: Vercel
- **Domain**: invoicenest.com (or .app)
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: PostHog

## Database Schema

### Tables

```sql
-- users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  company_logo TEXT,
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  invoice_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- clients
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- invoices
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles NOT NULL,
  client_id UUID REFERENCES public.clients,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'monthly', 'yearly')),
  next_invoice_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

-- invoice_items
CREATE TABLE public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payments
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'business')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can manage own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can manage own invoices" ON public.invoices
  FOR ALL USING (auth.uid() = user_id);

-- Invoice items policies
CREATE POLICY "Users can manage items of own invoices" ON public.invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can manage payments of own invoices" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

## Feature Tiers

### Free Tier (Starter Nest)
- 5 invoices per month
- 3 saved clients
- Basic invoice templates
- PDF generation with watermark
- Email sending
- Mobile responsive

### Pro Tier ($9.99/month - Pro Nest)
- Unlimited invoices
- Unlimited clients
- No watermark
- Recurring invoices
- Payment tracking
- Multiple tax rates
- Multi-currency
- 3 custom templates
- Expense tracking
- Payment links (Stripe)
- Email invoices
- File attachments
- Custom fields
- Late fee automation
- Revenue dashboard
- Aging reports
- Export data (CSV/Excel)
- Custom branding

### Business Tier ($24.99/month - Business Nest)
- All Pro features
- Multi-user access (up to 5)
- Role-based permissions
- Client portal
- Automated reminders
- QuickBooks/Xero integration
- API access
- Priority support
- White-label option

## Project Structure

```
invoicenest/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── features/page.tsx
│   │   └── layout.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── callback/route.ts     # OAuth callback
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── invoices/
│   │   ├── page.tsx              # Invoice list
│   │   ├── new/page.tsx          # Create invoice
│   │   ├── [id]/page.tsx         # View/edit invoice
│   │   ├── [id]/pdf/route.ts    # PDF generation
│   │   └── layout.tsx
│   ├── clients/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/page.tsx
│   │   └── layout.tsx
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── profile/page.tsx
│   │   ├── company/page.tsx
│   │   ├── branding/page.tsx
│   │   ├── billing/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts
│   │   ├── invoices/
│   │   │   └── [id]/route.ts
│   │   └── subscription/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                        # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── nest/                      # Custom nest-themed components
│   │   ├── nest-card.tsx
│   │   ├── egg-status.tsx
│   │   ├── nest-button.tsx
│   │   ├── empty-nest.tsx
│   │   ├── nest-logo.tsx
│   │   └── ...
│   ├── invoice/
│   │   ├── invoice-form.tsx
│   │   ├── invoice-preview.tsx
│   │   ├── invoice-list.tsx
│   │   └── invoice-pdf.tsx
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   ├── recent-invoices.tsx
│   │   └── revenue-chart.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   ├── store/
│   │   ├── invoice-store.ts      # Zustand store
│   │   ├── user-store.ts
│   │   └── ui-store.ts
│   ├── utils/
│   │   ├── cn.ts                 # Class name merger
│   │   ├── calculations.ts       # Invoice calculations
│   │   ├── formatting.ts         # Number/date formatting
│   │   └── validation.ts         # Zod schemas
│   ├── stripe/
│   │   ├── client.ts
│   │   └── webhooks.ts
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
│   ├── images/
│   │   ├── nest-logo.svg
│   │   ├── empty-nest.svg
│   │   └── ...
│   └── ...
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [x] Initialize Next.js project
- [x] Install dependencies
- [x] Configure Tailwind with nest theme
- [ ] Create utility functions
- [ ] Set up Supabase project
- [ ] Configure database schema
- [ ] Implement authentication
- [ ] Create basic layout structure

### Phase 2: Core Features (Week 2-3)
- [ ] Build dashboard UI
- [ ] Create invoice form
- [ ] Implement invoice calculations
- [ ] Build client management
- [ ] Create PDF generation
- [ ] Implement invoice list/search
- [ ] Add invoice status management

### Phase 3: Premium Features (Week 4)
- [ ] Integrate Stripe subscriptions
- [ ] Implement recurring invoices
- [ ] Add payment tracking
- [ ] Create revenue analytics
- [ ] Build custom templates
- [ ] Add file attachments

### Phase 4: Polish & Launch (Week 5)
- [ ] Create landing page
- [ ] Add nest-themed animations
- [ ] Implement dark mode
- [ ] Write documentation
- [ ] Set up monitoring
- [ ] Deploy to Vercel
- [ ] Configure domain
- [ ] Launch marketing

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Next Steps

1. Set up Supabase project at supabase.com
2. Create Stripe account at stripe.com
3. Run database migrations
4. Configure OAuth providers
5. Set up Stripe products:
   - Pro Nest: $9.99/month
   - Business Nest: $24.99/month
6. Start building core components

## Notes

- All nest-themed language should be consistent throughout
- Animations should be subtle and professional
- Mobile-first design approach
- Accessibility is a priority (WCAG AA)
- Performance optimization with Next.js features
- Regular backups of Supabase database
