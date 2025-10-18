#!/usr/bin/env node

/**
 * Setup Supabase Storage Buckets
 *
 * Creates the avatars and logos storage buckets
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🚀 Supabase Storage Setup\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('   Please ensure .env.local contains:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

console.log(`✓ Found Supabase URL: ${supabaseUrl}`);
console.log(`✓ Found Service Key: ${supabaseKey.slice(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBuckets() {
  console.log('📦 Creating storage buckets...\n');

  // Create avatars bucket
  console.log('   Creating "avatars" bucket...');
  const { data: avatarData, error: avatarError } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 2097152, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  if (avatarError) {
    if (avatarError.message.includes('already exists')) {
      console.log('   ℹ️  Bucket "avatars" already exists');
    } else {
      console.error(`   ❌ Error: ${avatarError.message}`);
    }
  } else {
    console.log('   ✅ Created bucket: avatars');
  }

  // Create logos bucket
  console.log('   Creating "logos" bucket...');
  const { data: logoData, error: logoError } = await supabase.storage.createBucket('logos', {
    public: true,
    fileSizeLimit: 2097152, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  });

  if (logoError) {
    if (logoError.message.includes('already exists')) {
      console.log('   ℹ️  Bucket "logos" already exists');
    } else {
      console.error(`   ❌ Error: ${logoError.message}`);
    }
  } else {
    console.log('   ✅ Created bucket: logos');
  }

  console.log('\n');
}

async function verifyBuckets() {
  console.log('🔍 Verifying buckets...\n');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error(`   ❌ Error listing buckets: ${error.message}\n`);
    return;
  }

  const avatarBucket = buckets.find(b => b.id === 'avatars');
  const logoBucket = buckets.find(b => b.id === 'logos');

  if (avatarBucket) {
    console.log(`   ✅ avatars bucket found (public: ${avatarBucket.public})`);
  } else {
    console.log('   ❌ avatars bucket not found');
  }

  if (logoBucket) {
    console.log(`   ✅ logos bucket found (public: ${logoBucket.public})`);
  } else {
    console.log('   ❌ logos bucket not found');
  }

  console.log('\n');
}

async function main() {
  try {
    await createBuckets();
    await verifyBuckets();

    console.log('🎉 Storage buckets are ready!\n');
    console.log('📝 Next steps:');
    console.log('   1. Set up RLS policies in Supabase Dashboard (SQL Editor)');
    console.log('   2. Run the SQL from: supabase/migrations/002_storage_setup.sql');
    console.log('   3. Test uploads at: http://localhost:3001/dashboard/settings\n');
    console.log('💡 The buckets are public, but RLS policies will secure uploads\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n📖 Manual setup:');
    console.error('   1. Go to: https://supabase.com/dashboard');
    console.error('   2. Storage → Create Bucket → "avatars" (public)');
    console.error('   3. Storage → Create Bucket → "logos" (public)');
    console.error('   4. SQL Editor → Run: supabase/migrations/002_storage_setup.sql\n');
    process.exit(1);
  }
}

main();
