# Supabase RLS Debug Steps

## 1. Check if animalpictures table exists
Run this in your Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables WHERE table_name = 'animalpictures';
```

## 2. Create animalpictures table if it doesn't exist
```sql
CREATE TABLE IF NOT EXISTS animalpictures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animals(id),
  image_url TEXT
);
```

## 3. Disable RLS on animalpictures table
```sql
ALTER TABLE animalpictures DISABLE ROW LEVEL SECURITY;
```

## 4. Check storage bucket policies
Go to Supabase Dashboard → Storage → shelter_images bucket → Policies
Make sure there are no restrictive policies on the storage bucket.

## 5. Create permissive storage policy if needed
```sql
-- Allow authenticated users to upload to shelter_images bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'shelter_images' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'shelter_images');
```

## 6. Test with simple insert
Try this in SQL Editor to test if the table works:
```sql
INSERT INTO animalpictures (animal_id, image_url) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test-url');
```

## 7. Check current RLS status
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'animals', 'animalpictures', 'shelters');
```