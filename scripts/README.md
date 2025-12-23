# Demo Data Seeding Script

## What It Does

This script populates your InvoiceNest database with realistic demo data so you can showcase all features without manually creating everything.

## What Gets Created

- **4 Clients**: Tech Startup Inc, Design Studio Co, E-Commerce Plus, Marketing Agency Ltd
- **4 Invoices**:
  - 1 Paid invoice (from last month)
  - 1 Sent invoice (waiting for payment)
  - 1 Overdue invoice (past due date)
  - 1 Draft invoice (not yet sent)
- **Invoice Line Items**: Realistic services with quantities and rates
- **5 Expense Categories**: Software, Office Supplies, Travel, Marketing, Professional Services
- **4 Expenses**: Mix of billable and non-billable
- **1 Recurring Invoice**: Monthly retainer setup
- **1 Invoice Template**: Pre-filled consulting template
- **Pro Tier Access**: All features unlocked for demo

## Usage

### 1. Sign up first
Visit http://localhost:3000 and create an account with any email.

### 2. Run the script
```bash
node scripts/seed-demo-data.js your@email.com
```

Replace `your@email.com` with the email you used to sign up.

### Example
```bash
node scripts/seed-demo-data.js demo@example.com
```

## Output

You'll see progress messages:
```
🌱 Seeding demo data for InvoiceNest...

✅ Found user: demo@example.com

🏢 Updating profile with demo company info...
✅ Profile updated

👥 Creating demo clients...
✅ Created 4 clients

📄 Creating demo invoices...
✅ Created 4 invoices

📋 Creating invoice line items...
✅ Created 7 invoice items

📂 Creating expense categories...
✅ Created 5 expense categories

💰 Creating demo expenses...
✅ Created 4 expenses

🔄 Creating recurring invoice...
✅ Created recurring invoice

🎨 Creating invoice template...
✅ Created invoice template

✨ Demo data seeding completed successfully!
```

## Requirements

- Node.js installed
- `.env.local` file configured with Supabase credentials
- An existing user account

## Troubleshooting

**Error: "User not found"**
- Make sure you've signed up first at http://localhost:3000
- Use the exact email address from signup
- Check for typos in the email

**Error: "Connection refused"**
- Check your `.env.local` has correct Supabase credentials
- Make sure Supabase project is active

**Error: "Permission denied"**
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check RLS policies are set up correctly

## Reset Demo Data

To start fresh:
1. Delete all records from Supabase dashboard
2. Run the script again

Or delete your user and sign up again.

## Customization

Edit `seed-demo-data.js` to:
- Change client names
- Modify invoice amounts
- Add more or fewer items
- Adjust dates
- Change currencies
