# Storage Upload Debug Guide

## Issue: Manual upload works, automatic upload fails

This usually indicates a **permissions** or **authentication** problem.

## Step 1: Check Storage Bucket Policies

Go to Supabase Dashboard → Storage → shelter_images → Policies

### Current Issue: 
- Manual upload (via dashboard) = Admin permissions ✅
- Automatic upload (via code) = User permissions ❌

## Step 2: Create Storage Policies

Run this in your Supabase SQL Editor:

```sql
-- Allow authenticated users to INSERT (upload) files
CREATE POLICY "Allow authenticated uploads to shelter_images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'shelter_images' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to SELECT (view) files
CREATE POLICY "Allow public access to shelter_images" ON storage.objects
FOR SELECT USING (bucket_id = 'shelter_images');

-- Allow authenticated users to UPDATE files
CREATE POLICY "Allow authenticated updates to shelter_images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'shelter_images' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to DELETE files
CREATE POLICY "Allow authenticated deletes from shelter_images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'shelter_images' AND 
  auth.role() = 'authenticated'
);
```

## Step 3: Check if RLS is enabled on storage.objects

```sql
-- Check RLS status on storage.objects
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

## Step 4: Alternative - Disable RLS on storage (if needed)

```sql
-- Only if the above policies don't work
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## Step 5: Test Authentication

Add this to your animalService.ts to check auth:

```javascript
// Before upload, check authentication
const { data: { user }, error: authError } = await supabase.auth.getUser()
console.log('Current user for upload:', user)
console.log('Auth error:', authError)
```