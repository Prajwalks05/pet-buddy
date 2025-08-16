import { supabase } from '../supabase'
import { User, UserCreateData } from '../types/database'

export interface UserResponse {
  user: User | null;
  error: string | null;
}

export interface UsersResponse {
  users: User[];
  error: string | null;
}

export class UserService {
  async createUser(userData: UserCreateData): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async getAllUsers(): Promise<UsersResponse> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return { users: [], error: error.message }
      }

      return { users: users || [], error: null }
    } catch (error) {
      return { users: [], error: 'An unexpected error occurred' }
    }
  }

  async getUsersByShelter(shelterId: string): Promise<UsersResponse> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('shelter_id', shelterId)
        .eq('role', 'shelter_admin')
        .order('created_at', { ascending: false })

      if (error) {
        return { users: [], error: error.message }
      }

      return { users: users || [], error: null }
    } catch (error) {
      return { users: [], error: 'An unexpected error occurred' }
    }
  }

  async linkUserToShelter(userId: string, shelterId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          shelter_id: shelterId,
          role: 'shelter_admin'
        })
        .eq('id', userId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async unlinkUserFromShelter(userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          shelter_id: null,
          role: 'user'
        })
        .eq('id', userId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserCreateData>): Promise<UserResponse> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  async deleteUser(userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }
}

export const userService = new UserService()