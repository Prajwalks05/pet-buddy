import { supabase } from '../supabase'
import { Shelter, ShelterCreateData, ShelterUpdateData } from '../types/database'

export interface ShelterResponse {
  shelter: Shelter | null;
  error: string | null;
}

export interface SheltersResponse {
  shelters: Shelter[];
  error: string | null;
}

export class ShelterService {
  async createShelter(shelterData: ShelterCreateData): Promise<ShelterResponse> {
    try {
      const { data: shelter, error } = await supabase
        .from('shelters')
        .insert(shelterData)
        .select()
        .single()

      if (error) {
        return { shelter: null, error: error.message }
      }

      return { shelter, error: null }
    } catch (error) {
      return { shelter: null, error: 'An unexpected error occurred' }
    }
  }

  async getShelters(): Promise<SheltersResponse> {
    try {
      const { data: shelters, error } = await supabase
        .from('shelters')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        return { shelters: [], error: error.message }
      }

      return { shelters: shelters || [], error: null }
    } catch (error) {
      return { shelters: [], error: 'An unexpected error occurred' }
    }
  }

  async getShelterById(id: string): Promise<ShelterResponse> {
    try {
      const { data: shelter, error } = await supabase
        .from('shelters')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { shelter: null, error: error.message }
      }

      return { shelter, error: null }
    } catch (error) {
      return { shelter: null, error: 'An unexpected error occurred' }
    }
  }

  async updateShelter(id: string, data: ShelterUpdateData): Promise<ShelterResponse> {
    try {
      const { data: shelter, error } = await supabase
        .from('shelters')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { shelter: null, error: error.message }
      }

      return { shelter, error: null }
    } catch (error) {
      return { shelter: null, error: 'An unexpected error occurred' }
    }
  }

  async deleteShelter(id: string): Promise<{ error: string | null }> {
    try {
      // First check if shelter has any animals
      const { data: animals, error: animalsError } = await supabase
        .from('animals')
        .select('id')
        .eq('shelter_id', id)
        .limit(1)

      if (animalsError) {
        return { error: animalsError.message }
      }

      if (animals && animals.length > 0) {
        return { error: 'Cannot delete shelter with existing animals' }
      }

      // Check if shelter has any users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('shelter_id', id)
        .limit(1)

      if (usersError) {
        return { error: usersError.message }
      }

      if (users && users.length > 0) {
        return { error: 'Cannot delete shelter with associated users' }
      }

      // Delete shelter
      const { error } = await supabase
        .from('shelters')
        .delete()
        .eq('id', id)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async getShelterStats(id: string): Promise<{
    animalCount: number;
    userCount: number;
    error: string | null;
  }> {
    try {
      // Get animal count
      const { count: animalCount, error: animalError } = await supabase
        .from('animals')
        .select('*', { count: 'exact', head: true })
        .eq('shelter_id', id)

      if (animalError) {
        return { animalCount: 0, userCount: 0, error: animalError.message }
      }

      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('shelter_id', id)

      if (userError) {
        return { animalCount: 0, userCount: 0, error: userError.message }
      }

      return { 
        animalCount: animalCount || 0, 
        userCount: userCount || 0, 
        error: null 
      }
    } catch (error) {
      return { animalCount: 0, userCount: 0, error: 'An unexpected error occurred' }
    }
  }

  async validateShelterData(data: ShelterCreateData): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Shelter name is required')
    }

    if (!data.location || data.location.trim().length === 0) {
      errors.push('Shelter location is required')
    }

    if (data.name && data.name.length > 100) {
      errors.push('Shelter name must be less than 100 characters')
    }

    if (data.location && data.location.length > 200) {
      errors.push('Shelter location must be less than 200 characters')
    }

    if (data.contact && data.contact.length > 50) {
      errors.push('Contact information must be less than 50 characters')
    }

    return { isValid: errors.length === 0, errors }
  }
}

export const shelterService = new ShelterService()