/**
 * Demo Data Seeding Script for InvoiceNest
 *
 * This script creates sample data so you can showcase all features
 * Run with: node scripts/seed-demo-data.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDemoData() {
  console.log('🌱 Seeding demo data for InvoiceNest...\n');

  try {
    // Get the current user
    console.log('📝 Please enter your user email to seed data:');
    const userEmail = process.argv[2];

    if (!userEmail) {
      console.error('❌ Please provide your email as an argument');
      console.log('Usage: node scripts/seed-demo-data.js your@email.com');
      process.exit(1);
    }

    // Get user ID
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(u => u.email === userEmail);
    if (!user) {
      console.error(`❌ User with email ${userEmail} not found`);
      process.exit(1);
    }

    const userId = user.id;
    console.log(`✅ Found user: ${userEmail}\n`);

    // Update profile with demo company info
    console.log('🏢 Updating profile with demo company info...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Demo User',
        company_name: 'Acme Consulting',
        company_address: '123 Business St, San Francisco, CA 94102',
        company_phone: '+1 (555) 123-4567',
        company_email: 'hello@acmeconsulting.com',
        default_currency: 'USD',
        subscription_tier: 'pro', // Give Pro tier for demo
        subscription_status: 'active'
      })
      .eq('id', userId);

    if (profileError) throw profileError;
    console.log('✅ Profile updated\n');

    // Create demo clients
    console.log('👥 Creating demo clients...');
    const clients = [
      {
        user_id: userId,
        name: 'Tech Startup Inc',
        email: 'billing@techstartup.com',
        phone: '+1 (555) 234-5678',
        address: '456 Innovation Ave, San Francisco, CA 94103',
        notes: 'Monthly retainer client'
      },
      {
        user_id: userId,
        name: 'Design Studio Co',
        email: 'accounts@designstudio.com',
        phone: '+1 (555) 345-6789',
        address: '789 Creative Blvd, Los Angeles, CA 90001',
        notes: 'Project-based work'
      },
      {
        user_id: userId,
        name: 'E-Commerce Plus',
        email: 'finance@ecommerceplus.com',
        phone: '+1 (555) 456-7890',
        address: '321 Retail Way, New York, NY 10001',
        notes: 'Quarterly consulting'
      },
      {
        user_id: userId,
        name: 'Marketing Agency Ltd',
        email: 'billing@marketingagency.com',
        phone: '+1 (555) 567-8901',
        address: '654 Brand Street, Chicago, IL 60601',
        notes: 'SEO and content services'
      }
    ];

    const { data: createdClients, error: clientsError } = await supabase
      .from('clients')
      .insert(clients)
      .select();

    if (clientsError) throw clientsError;
    console.log(`✅ Created ${createdClients.length} clients\n`);

    // Create demo invoices
    console.log('📄 Creating demo invoices...');
    const today = new Date();
    const invoices = [
      {
        user_id: userId,
        client_id: createdClients[0].id,
        invoice_number: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-0001`,
        issue_date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'paid',
        subtotal: 5000.00,
        tax_rate: 10,
        tax_amount: 500.00,
        discount_amount: 0,
        total: 5500.00,
        currency: 'USD',
        notes: 'Monthly retainer for December',
        payment_terms: 'Net 15'
      },
      {
        user_id: userId,
        client_id: createdClients[1].id,
        invoice_number: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-0002`,
        issue_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent',
        subtotal: 3500.00,
        tax_rate: 8.5,
        tax_amount: 297.50,
        discount_amount: 200.00,
        total: 3597.50,
        currency: 'USD',
        notes: 'Website redesign project - Phase 1',
        payment_terms: 'Net 30'
      },
      {
        user_id: userId,
        client_id: createdClients[2].id,
        invoice_number: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-0003`,
        issue_date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'overdue',
        subtotal: 7500.00,
        tax_rate: 10,
        tax_amount: 750.00,
        discount_amount: 0,
        total: 8250.00,
        currency: 'USD',
        notes: 'Q4 consulting services',
        payment_terms: 'Net 30'
      },
      {
        user_id: userId,
        client_id: createdClients[3].id,
        invoice_number: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-0004`,
        issue_date: today.toISOString(),
        due_date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        subtotal: 2800.00,
        tax_rate: 8.5,
        tax_amount: 238.00,
        discount_amount: 100.00,
        total: 2938.00,
        currency: 'USD',
        notes: 'SEO optimization package',
        payment_terms: 'Net 14'
      }
    ];

    const { data: createdInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .insert(invoices)
      .select();

    if (invoicesError) throw invoicesError;
    console.log(`✅ Created ${createdInvoices.length} invoices\n`);

    // Create invoice items
    console.log('📋 Creating invoice line items...');
    const invoiceItems = [
      // Invoice 1 items
      { invoice_id: createdInvoices[0].id, description: 'Monthly Retainer - December', quantity: 1, rate: 5000.00, amount: 5000.00 },

      // Invoice 2 items
      { invoice_id: createdInvoices[1].id, description: 'Website Design', quantity: 40, rate: 75.00, amount: 3000.00 },
      { invoice_id: createdInvoices[1].id, description: 'UI/UX Consultation', quantity: 10, rate: 100.00, amount: 1000.00 },
      { invoice_id: createdInvoices[1].id, description: 'Responsive Development', quantity: 5, rate: 150.00, amount: 750.00 },

      // Invoice 3 items
      { invoice_id: createdInvoices[2].id, description: 'Strategy Consulting', quantity: 50, rate: 150.00, amount: 7500.00 },

      // Invoice 4 items
      { invoice_id: createdInvoices[3].id, description: 'SEO Audit', quantity: 8, rate: 200.00, amount: 1600.00 },
      { invoice_id: createdInvoices[3].id, description: 'Keyword Research', quantity: 12, rate: 100.00, amount: 1200.00 }
    ];

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;
    console.log(`✅ Created ${invoiceItems.length} invoice items\n`);

    // Create expense categories
    console.log('📂 Creating expense categories...');
    const categories = [
      { user_id: userId, name: 'Software & Tools', color: '#3b82f6' },
      { user_id: userId, name: 'Office Supplies', color: '#8b5cf6' },
      { user_id: userId, name: 'Travel', color: '#ec4899' },
      { user_id: userId, name: 'Marketing', color: '#f59e0b' },
      { user_id: userId, name: 'Professional Services', color: '#10b981' }
    ];

    const { data: createdCategories, error: categoriesError } = await supabase
      .from('expense_categories')
      .insert(categories)
      .select();

    if (categoriesError) throw categoriesError;
    console.log(`✅ Created ${createdCategories.length} expense categories\n`);

    // Create demo expenses
    console.log('💰 Creating demo expenses...');
    const expenses = [
      {
        user_id: userId,
        category_id: createdCategories[0].id,
        amount: 99.00,
        currency: 'USD',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Adobe Creative Cloud Subscription',
        payment_method: 'credit_card',
        is_billable: false
      },
      {
        user_id: userId,
        category_id: createdCategories[1].id,
        client_id: createdClients[1].id,
        amount: 156.50,
        currency: 'USD',
        date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Office supplies for client project',
        payment_method: 'credit_card',
        is_billable: true
      },
      {
        user_id: userId,
        category_id: createdCategories[2].id,
        client_id: createdClients[2].id,
        amount: 450.00,
        currency: 'USD',
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Flight to client site',
        payment_method: 'credit_card',
        is_billable: true
      },
      {
        user_id: userId,
        category_id: createdCategories[3].id,
        amount: 299.00,
        currency: 'USD',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Social media advertising',
        payment_method: 'credit_card',
        is_billable: false
      }
    ];

    const { error: expensesError } = await supabase
      .from('expenses')
      .insert(expenses);

    if (expensesError) throw expensesError;
    console.log(`✅ Created ${expenses.length} expenses\n`);

    // Create recurring invoice
    console.log('🔄 Creating recurring invoice...');
    const recurringInvoice = {
      user_id: userId,
      client_id: createdClients[0].id,
      frequency: 'monthly',
      next_generation_date: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString(),
      is_active: true,
      payment_terms: 'Net 15',
      subtotal: 5000.00,
      tax_rate: 10,
      tax_amount: 500.00,
      discount_amount: 0,
      total: 5500.00,
      currency: 'USD',
      notes: 'Monthly retainer - auto-generated'
    };

    const { data: createdRecurring, error: recurringError } = await supabase
      .from('recurring_invoices')
      .insert(recurringInvoice)
      .select();

    if (recurringError) throw recurringError;
    console.log('✅ Created recurring invoice\n');

    // Create recurring invoice item
    const recurringItem = {
      recurring_invoice_id: createdRecurring[0].id,
      description: 'Monthly Retainer',
      quantity: 1,
      rate: 5000.00,
      amount: 5000.00
    };

    const { error: recurringItemError } = await supabase
      .from('recurring_invoice_items')
      .insert(recurringItem);

    if (recurringItemError) throw recurringItemError;

    // Create invoice template
    console.log('🎨 Creating invoice template...');
    const template = {
      user_id: userId,
      name: 'Consulting Services Template',
      is_default: true,
      theme_color: '#0d9488',
      font_family: 'Inter',
      logo_position: 'left',
      payment_terms: 'Net 30',
      tax_rate: 10,
      notes: 'Thank you for your business!'
    };

    const { data: createdTemplate, error: templateError } = await supabase
      .from('invoice_templates')
      .insert(template)
      .select();

    if (templateError) throw templateError;
    console.log('✅ Created invoice template\n');

    // Create template items
    const templateItems = [
      { template_id: createdTemplate[0].id, description: 'Consulting Services', quantity: 1, rate: 150.00 },
      { template_id: createdTemplate[0].id, description: 'Project Management', quantity: 1, rate: 100.00 }
    ];

    const { error: templateItemsError } = await supabase
      .from('invoice_template_items')
      .insert(templateItems);

    if (templateItemsError) throw templateItemsError;

    console.log('\n✨ Demo data seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${createdClients.length} clients`);
    console.log(`   - ${createdInvoices.length} invoices`);
    console.log(`   - ${invoiceItems.length} invoice items`);
    console.log(`   - ${createdCategories.length} expense categories`);
    console.log(`   - ${expenses.length} expenses`);
    console.log(`   - 1 recurring invoice`);
    console.log(`   - 1 invoice template`);
    console.log('\n🚀 Start your dev server with: npm run dev');
    console.log('🌐 Visit: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message);
    process.exit(1);
  }
}

seedDemoData();
