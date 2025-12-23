# Quick Start for Demo

## 3-Step Setup (5 minutes)

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Create an Account
1. Open http://localhost:3000
2. Click "Get Started"
3. Sign up with any email (e.g., `demo@example.com`)
4. Verify your email if prompted (check your Supabase dashboard)

### Step 3: Seed Demo Data
In a new terminal:
```bash
node scripts/seed-demo-data.js demo@example.com
```
*(Replace with your actual signup email)*

---

## That's It! 🎉

Now visit http://localhost:3000/dashboard and you'll see:
- ✅ 4 clients
- ✅ 4 invoices (various statuses)
- ✅ Expense tracking with categories
- ✅ Recurring invoice template
- ✅ Pro tier access (all features unlocked)

---

## What to Show Your Friend

### 1. Dashboard (30 seconds)
- Revenue stats and charts
- Invoice overview

### 2. Create Invoice (2 minutes)
- Click "New Invoice"
- Select a client
- Add line items
- Watch calculations update in real-time
- Download PDF

### 3. Client Management (1 minute)
- View client cards
- Add a new client
- Show client details

### 4. Recurring Invoices (1 minute)
- Show automated invoice generation
- Explain monthly/quarterly billing

### 5. Expenses (1 minute)
- View expense categories
- Show billable expenses linked to clients

### 6. Settings (1 minute)
- Company branding
- Logo upload
- Currency preferences
- Dark mode toggle

### 7. Client Portal (30 seconds)
- Generate shareable invoice link
- Open in incognito mode
- Show how clients view and pay

---

## Troubleshooting

**No data showing?**
```bash
node scripts/seed-demo-data.js your@email.com
```

**Port in use?**
```bash
lsof -ti:3000 | xargs kill
npm run dev
```

**Need to reset?**
- Delete your user in Supabase dashboard
- Sign up again
- Re-run seeding script

---

For detailed walkthrough, see `DEMO_GUIDE.md`
