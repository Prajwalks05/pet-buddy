import { supabase } from '../supabase'
import { User, UserCreateData } from '../types/database'

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin' | 'shelter_admin';
  shelter_id?: string;
}

export class AuthService {
  async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    try {
      // Create auth user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: signUpData.full_name,
            role: signUpData.role || 'user'
          }
        }
      })

      if (authError) {
        return { user: null, error: authError?.message || 'Failed to create account' }
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create account' }
      }

      // If email confirmation is required, inform user but continue
      if (!authData.session && authData.user && !authData.user.email_confirmed_at) {
        // For now, we'll create the user record anyway and let them sign in later
        // This is a workaround until email confirmation is disabled in Supabase dashboard
      }

      // Prepare user data - only include shelter_id for shelter_admin role
      const userData: UserCreateData = {
        id: authData.user.id,
        full_name: signUpData.full_name,
        email: signUpData.email,
        phone: signUpData.phone,
        address: signUpData.address,
        role: signUpData.role || 'user',
        // Only set shelter_id if user is shelter_admin and shelter_id is provided
        shelter_id: (signUpData.role === 'shelter_admin' && signUpData.shelter_id) ? signUpData.shelter_id : undefined,
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (userError) {
        return { user: null, error: `Database error: ${userError.message}. Please make sure you've run the database setup script.` }
      }

      // If no session but user was created, inform about email confirmation
      if (!authData.session) {
        return { 
          user, 
          error: 'Account created! Please check your email and click the confirmation link, then try signing in.' 
        }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.user) {
        return { user: null, error: authError?.message || 'Failed to sign in' }
      }

      // Get user data from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        return { user: null, error: 'Failed to get user data' }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        return { user: null, error: 'Not authenticated' }
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        return { user: null, error: 'Failed to get user data' }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async updateUserRole(userId: string, role: 'user' | 'admin' | 'shelter_admin', shelterId?: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role, shelter_id: shelterId })
        .eq('id', userId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }
}

export const authService = new AuthService()