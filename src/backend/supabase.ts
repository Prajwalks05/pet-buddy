import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://auuekkzxhvyodahepmkz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dWVra3p4aHZ5b2RhaGVwbWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODU1OTcsImV4cCI6MjA3MDA2MTU5N30.MKLydbXVNdUVZb3c1VnxeYiVraKSVVFy1H4dEUfOVEE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})