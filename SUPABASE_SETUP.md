# Supabase Setup Instructions

## 1. Database Setup
Run the SQL commands in `tables.sql` in your Supabase SQL editor to create the tables and RLS policies.

## 2. Disable Email Confirmation (Important!)
To disable email verification and allow immediate signup:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll down to **Email Auth**
4. **Uncheck** "Enable email confirmations"
5. Click **Save**

## 3. Configure RLS Policies
The `tables.sql` file includes Row Level Security policies that:
- Allow users to create their own profiles
- Allow admins to manage shelters
- Allow shelter admins to manage animals for their shelter
- Allow public viewing of shelters and animals

## 4. Test the Setup
1. Try creating a regular user account
2. Try creating a shelter admin account (you'll need to create a shelter first as an admin)
3. Verify that users can sign in immediately without email confirmation

## Troubleshooting

### "Row-level security policy" error
- Make sure you've run all the SQL commands in `tables.sql`
- Check that RLS policies are created correctly

### Still getting email confirmations
- Double-check that "Enable email confirmations" is unchecked in Supabase Dashboard
- Clear your browser cache and try again

### "shelter_id not found" error
- Make sure the `ALTER TABLE users ADD COLUMN shelter_id` command was run
- Check that the shelters table exists and has data for shelter admin signup