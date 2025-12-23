# 🚀 Start Here - Demo Setup

## ⚠️ IMPORTANT: Fix Database Error First

Your app has a database error that needs to be fixed before the demo works.

### Fix It Now (1 minute):

1. **Open Supabase**
   https://supabase.com/dashboard/project/fplpcetyjzzpxjetswhv/sql/new

2. **Copy & Run the Fix**
   - Open the file `QUICKFIX.sql` in this folder
   - Copy everything (all 54 lines)
   - Paste into Supabase SQL Editor
   - Click "Run"

3. **Restart Your Server**
   ```bash
   # Kill the current server (Ctrl+C or)
   lsof -ti:3000 | xargs kill

   # Start fresh
   npm run dev
   ```

✅ **Error should be gone!**

---

## 🎯 After the Fix: Demo Setup (3 Steps)

### Step 1: Create Account
1. Visit http://localhost:3000
2. Sign up with any email (e.g., `demo@test.com`)

### Step 2: Seed Demo Data
```bash
node scripts/seed-demo-data.js demo@test.com
```
*(Use your signup email)*

This creates:
- 4 clients
- 4 invoices (paid, sent, overdue, draft)
- Expenses and categories
- Recurring invoice
- Templates
- **Pro tier unlocked!**

### Step 3: Explore
Visit http://localhost:3000/dashboard and show your friend!

---

## 📚 Helpful Guides

- **`QUICK_START.md`** - 3-step setup (after database fix)
- **`DEMO_GUIDE.md`** - Complete feature walkthrough with talking points
- **`FIX_RLS_ERROR.md`** - Detailed explanation of the database error
- **`QUICKFIX.sql`** - The SQL to run in Supabase

---

## 🔍 What Features Can You Show?

✅ **Works fully:**
- Invoice creation & management
- PDF generation & download
- Client management
- Recurring invoices
- Expense tracking
- Dashboard analytics
- Templates
- Dark mode
- Settings & branding

⚠️ **Needs API keys (can explain instead):**
- Email sending (needs Resend)
- Stripe payments (needs real test keys)
- Google OAuth (needs setup)

---

## 🆘 Troubleshooting

**Error: "infinite recursion detected"**
→ Run `QUICKFIX.sql` in Supabase dashboard

**No data showing?**
→ Run: `node scripts/seed-demo-data.js your@email.com`

**Port in use?**
→ Run: `lsof -ti:3000 | xargs kill && npm run dev`

---

## 🎬 Demo Flow

1. **Landing page** - Marketing site
2. **Dashboard** - Stats & charts
3. **Create invoice** - Live calculations
4. **Download PDF** - Professional output
5. **Clients** - Management grid
6. **Recurring** - Auto-generation
7. **Expenses** - Business tracking
8. **Settings** - Branding & theme
9. **Share link** - Client portal demo

---

**Ready? Fix the database error first, then follow QUICK_START.md!**
