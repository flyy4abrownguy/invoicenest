# InvoiceNest 🪹

**Your Invoices, Safely Nested**

InvoiceNest is a beautiful, modern invoice management SaaS application built with Next.js 14, featuring a warm nest-themed design that makes managing invoices a delightful experience.

![InvoiceNest](https://via.placeholder.com/1200x600/0d9488/ffffff?text=InvoiceNest)

## 🌟 Features

### Free Tier (Starter Nest)
- ✅ 5 invoices per month
- ✅ 3 saved clients
- ✅ Professional invoice templates
- ✅ PDF generation
- ✅ Email sending
- ✅ Mobile responsive design

### Pro Tier ($9.99/month - Pro Nest)
- ✅ Unlimited invoices & clients
- ✅ No watermark on PDFs
- ✅ Recurring invoices
- ✅ Payment tracking
- ✅ Multiple tax rates & currencies
- ✅ Custom templates & branding
- ✅ Expense tracking
- ✅ Payment links (Stripe integration)
- ✅ Revenue analytics & reports
- ✅ Data export (CSV/Excel)

### Business Tier ($24.99/month - Business Nest)
- ✅ All Pro features
- ✅ Multi-user access (up to 5 users)
- ✅ Role-based permissions
- ✅ Client portal
- ✅ Automated payment reminders
- ✅ QuickBooks/Xero integration
- ✅ API access
- ✅ Priority support
- ✅ White-label option

## 🎨 Design System

InvoiceNest features a unique nest-themed design language:

### Color Palette
- **Primary**: Warm teal (#0d9488) - Trust & calm
- **Secondary**: Soft amber (#f59e0b) - Warmth & value
- **Accent**: Sage green (#10b981) - Growth & success
- **Background**: Soft cream (#fafaf9) - Like an eggshell

### Nest Metaphors
- **Invoices** = Eggs in your nest
- **Creating invoice** = Laying an egg
- **Dashboard** = Your nest view
- **Saved invoices** = Safely nested

### Custom Animations
- `nest-bounce` - Gentle bounce effect
- `nest-settle` - Documents settling into the nest
- `egg-hatch` - Invoice status changes
- `weave` - Elements appearing like twigs being woven

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS with custom nest theme
- **UI Components**: Shadcn/ui + Custom nest components
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **PDF Generation**: @react-pdf/renderer
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/invoicenest.git
   cd invoicenest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and add your credentials:
   - Supabase URL and keys (get from https://supabase.com)
   - Stripe keys (get from https://stripe.com)

4. **Set up the database**

   Run the SQL migrations in Supabase:
   - Copy the schema from `PROJECT_PLAN.md`
   - Execute in Supabase SQL Editor
   - This creates all tables and Row Level Security policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
invoicenest/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Landing page
│   │   ├── pricing/          # Pricing page
│   │   └── layout.tsx        # Marketing layout
│   ├── dashboard/            # Protected dashboard
│   │   ├── page.tsx          # Dashboard home
│   │   ├── invoices/         # Invoice management
│   │   ├── clients/          # Client management
│   │   ├── settings/         # User settings
│   │   └── layout.tsx        # Dashboard layout
│   ├── auth/                 # Authentication pages
│   ├── api/                  # API routes
│   ├── globals.css           # Global styles with nest theme
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # Core UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── nest/                 # Nest-themed components
│   │   ├── nest-logo.tsx
│   │   ├── empty-nest.tsx
│   │   ├── egg-status.tsx
│   │   ├── nest-card.tsx
│   │   └── nest-button.tsx
│   └── invoice/              # Invoice-specific components
├── lib/
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client
│   ├── store/                # Zustand stores
│   │   ├── invoice-store.ts
│   │   └── user-store.ts
│   ├── utils/                # Utility functions
│   │   ├── cn.ts             # Class name utilities
│   │   ├── calculations.ts   # Invoice calculations
│   │   └── validation.ts     # Zod schemas
│   └── types/                # TypeScript types
│       └── index.ts
├── public/                   # Static assets
├── .env.local.example        # Environment template
├── PROJECT_PLAN.md           # Detailed project plan
├── SETUP.md                  # Setup guide
├── README.md                 # This file
├── package.json
└── tsconfig.json
```

## 🔑 Environment Variables

Required environment variables (see `.env.local.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛠️ Development

### Running locally
```bash
npm run dev
```

### Building for production
```bash
npm run build
```

### Running production build
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up preview deployments
- Configure custom domains

See `SETUP.md` for detailed deployment instructions.

## 📚 Key Concepts

### Nest-Themed UI
Every part of InvoiceNest reinforces the nest metaphor:
- Invoices are represented as "eggs"
- The dashboard is "your nest"
- Creating invoices uses language like "nesting a new invoice"
- Animations mimic natural nest-building movements

### Invoice Status Flow
Invoices progress through states visualized with egg icons:
- **Draft** (○) - Empty egg, not yet finalized
- **Sent** (◐) - Half egg, sent to client
- **Paid** (●) - Full egg, payment received
- **Overdue** (◓) - Cracked egg, needs attention
- **Cancelled** (✕) - Broken, will not proceed

### Subscription Tiers
- **Free Tier**: 5 invoices/month, perfect for trying
- **Pro Tier**: Unlimited invoices, professional features
- **Business Tier**: Team features, integrations, white-label

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)

## 📞 Support

For support, email support@invoicenest.com or open an issue on GitHub.

---

**Made with ❤️ and nested with care**
