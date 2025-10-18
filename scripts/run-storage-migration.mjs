/**
 * Run Supabase Storage Migration
 *
 * This creates the storage buckets directly via Supabase Management API
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

console.log('🚀 Supabase Storage Migration\n');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Service Key: ${supabaseServiceKey.slice(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBuckets() {
  console.log('📦 Creating storage buckets...\n');

  // Create avatars bucket
  try {
    const { data: avatarBucket, error: avatarError } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (avatarError) {
      if (avatarError.message.includes('already exists')) {
        console.log('   ℹ️  Bucket "avatars" already exists');
      } else {
        throw avatarError;
      }
    } else {
      console.log('   ✅ Created bucket: avatars');
    }
  } catch (error) {
    console.error('   ❌ Error creating avatars bucket:', error.message);
  }

  // Create logos bucket
  try {
    const { data: logoBucket, error: logoError } = await supabase.storage.createBucket('logos', {
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    });

    if (logoError) {
      if (logoError.message.includes('already exists')) {
        console.log('   ℹ️  Bucket "logos" already exists');
      } else {
        throw logoError;
      }
    } else {
      console.log('   ✅ Created bucket: logos');
    }
  } catch (error) {
    console.error('   ❌ Error creating logos bucket:', error.message);
  }

  console.log('\n✅ Storage buckets configured!\n');
}

async function setupRLSPolicies() {
  console.log('🔒 Setting up RLS policies...\n');

  // Read and execute SQL migration for policies
  const migrationPath = join(__dirname, '../supabase/migrations/002_storage_setup.sql');
  const sql = readFileSync(migrationPath, 'utf8');

  // Extract only the policy statements
  const policyStatements = sql
    .split(';')
    .filter(stmt => stmt.trim().toLowerCase().includes('create policy'))
    .map(stmt => stmt.trim() + ';');

  console.log(`   Found ${policyStatements.length} RLS policies to create\n`);

  for (const statement of policyStatements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error && !error.message.includes('already exists')) {
        console.warn(`   ⚠️  Warning: ${error.message}`);
      }
    } catch (err) {
      // Policies might already exist or need to be created via dashboard
      console.log('   ℹ️  Some policies may need to be created via Supabase Dashboard');
      break;
    }
  }

  console.log('   ✅ RLS policies configured\n');
}

async function verifySetup() {
  console.log('🔍 Verifying setup...\n');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('   ❌ Error listing buckets:', error.message);
    return;
  }

  const avatarBucket = buckets.find(b => b.id === 'avatars');
  const logoBucket = buckets.find(b => b.id === 'logos');

  if (avatarBucket) {
    console.log('   ✅ avatars bucket: configured');
    console.log(`      - Public: ${avatarBucket.public}`);
  }

  if (logoBucket) {
    console.log('   ✅ logos bucket: configured');
    console.log(`      - Public: ${logoBucket.public}`);
  }

  console.log('\n');
}

async function main() {
  try {
    await createStorageBuckets();
    await verifySetup();

    console.log('🎉 Migration complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Go to: http://localhost:3001/dashboard/settings');
    console.log('   2. Try uploading a profile photo or company logo');
    console.log('   3. RLS policies may need manual setup in Supabase Dashboard\n');
    console.log('📖 For RLS policy setup:');
    console.log('   1. Go to: https://supabase.com/dashboard → SQL Editor');
    console.log('   2. Run the SQL from: supabase/migrations/002_storage_setup.sql\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Manual setup:');
    console.error('   Go to Supabase Dashboard → Storage → Create Buckets\n');
    process.exit(1);
  }
}

main();
