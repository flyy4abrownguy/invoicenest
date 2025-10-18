/**
 * Run Supabase Storage Migration
 *
 * This script connects to your Supabase database and runs the storage setup migration.
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function runMigration() {
  console.log('🚀 Starting Supabase Storage Migration...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('   Required variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`  URL: ${supabaseUrl}\n`);

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/002_storage_setup.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: Migration file not found at', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log('✓ Migration file loaded\n');

  // Execute migration
  console.log('⏳ Running migration...');
  console.log('   This will create storage buckets and RLS policies\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If exec_sql doesn't exist, try direct execution
      // Split by semicolons and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`   Executing ${statements.length} SQL statements...\n`);

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (!stmt) continue;

        console.log(`   [${i + 1}/${statements.length}] Executing...`);

        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: stmt + ';' });

        if (stmtError) {
          console.warn(`   ⚠️  Warning: ${stmtError.message}`);
          // Some errors are okay (like "already exists")
          if (!stmtError.message.includes('already exists')) {
            throw stmtError;
          }
        }
      }
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📦 Storage buckets created:');
    console.log('   - avatars (for profile photos)');
    console.log('   - logos (for company logos)\n');
    console.log('🔒 RLS policies configured:');
    console.log('   - Users can upload to their own folders');
    console.log('   - Public read access enabled\n');
    console.log('🎉 You can now upload files in the Settings page!');
    console.log('   Go to: http://localhost:3001/dashboard/settings\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Alternative: Run the migration manually in Supabase Dashboard:');
    console.error('   1. Go to: https://supabase.com/dashboard');
    console.error('   2. Open SQL Editor');
    console.error('   3. Paste contents of: supabase/migrations/002_storage_setup.sql');
    console.error('   4. Click "Run"\n');
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);
