# Supabase Storage Setup Guide

## ✅ What's Implemented

The complete file upload system is now ready! Here's what works:

1. **Upload API** (`/api/upload`) - Handles file uploads to Supabase Storage
2. **Avatar Upload Component** - Beautiful UI for uploading profile photos and company logos
3. **Storage Integration** - Full integration with Supabase Storage buckets
4. **Profile Updates** - Saves uploaded image URLs to user profiles

## 🚀 How to Enable File Uploads

You need to run the storage migration in your Supabase project. Here are the steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the storage migration**
   - Copy the entire contents of `supabase/migrations/002_storage_setup.sql`
   - Paste into the SQL editor
   - Click "Run"

4. **Verify the buckets were created**
   - Go to "Storage" in the left sidebar
   - You should see two new buckets:
     - `avatars` (for profile photos)
     - `logos` (for company logos)

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to project directory
cd /Users/Akil/Ideas/Apps/invoicenest

# Run the migration
supabase db push
```

### Option 3: Manual SQL Execution

If you prefer to create buckets manually:

```sql
-- 1. Create buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[]);

-- 2. Set up RLS policies (copy from migration file)
```

## 🧪 Testing the Upload Feature

Once the migration is complete:

1. **Go to Settings → Profile tab**
2. **Click "Upload Photo"**
3. **Select an image (JPG, PNG, or WebP)**
4. **Watch it upload and preview!**
5. **Click "Save Changes" to save to your profile**

Same process for Company Logo in the Company tab!

## 📋 File Upload Limits

- **Maximum file size**: 2MB
- **Allowed formats**:
  - Avatars: JPG, PNG, WebP
  - Logos: JPG, PNG, WebP, SVG
- **Storage location**: Organized by user ID (`{userId}/{timestamp}.{ext}`)

## 🔒 Security

The migration sets up proper Row Level Security (RLS) policies:

- ✅ Users can only upload to their own folder
- ✅ Users can only update/delete their own files
- ✅ All uploaded images are publicly viewable (needed for invoices)
- ✅ File type validation prevents malicious uploads
- ✅ File size limits prevent abuse

## 🐛 Troubleshooting

### "Unauthorized" error when uploading
- Make sure you're logged in
- Check that your Supabase session is valid

### "Failed to upload file" error
- Verify the storage migration ran successfully
- Check that the buckets exist in Supabase Dashboard → Storage
- Ensure your `.env.local` has the correct Supabase credentials

### Images not displaying
- Verify the bucket is set to `public: true`
- Check the public URL in browser developer tools
- Ensure RLS policies allow public SELECT

## 📁 File Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql     # Database tables
│   └── 002_storage_setup.sql      # Storage buckets (NEW!)
```

```
app/api/
└── upload/
    └── route.ts                    # Upload endpoint (NEW!)
```

```
components/settings/
└── avatar-upload.tsx               # Upload component (NEW!)
```

## ✨ Next Steps

After enabling storage, you can:

1. Upload your profile photo
2. Upload your company logo
3. See the logo appear on generated invoices (future feature)
4. Use the same upload component for other file types (future feature)

---

**Ready to test?** Run the migration and start uploading! 🎉
