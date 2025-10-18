-- Create storage buckets for avatars and logos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[])
on conflict (id) do nothing;

-- Set up RLS policies for avatars bucket
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Set up RLS policies for logos bucket
create policy "Users can upload their own logo"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own logo"
on storage.objects for update
to authenticated
using (
  bucket_id = 'logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own logo"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Anyone can view logos"
on storage.objects for select
to public
using (bucket_id = 'logos');
