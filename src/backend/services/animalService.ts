import { supabase } from '../supabase'
import { Animal, AnimalPicture, AnimalCreateData, AnimalUpdateData } from '../types/database'

export interface AnimalResponse {
  animal: Animal | null;
  error: string | null;
}

export interface AnimalsResponse {
  animals: Animal[];
  error: string | null;
}

export interface AnimalPicturesResponse {
  pictures: AnimalPicture[];
  error: string | null;
}

export class AnimalService {
  async createAnimal(animalData: AnimalCreateData): Promise<AnimalResponse> {
    try {
      const { data: animal, error } = await supabase
        .from('animals')
        .insert(animalData)
        .select()
        .single()

      if (error) {
        return { animal: null, error: error.message }
      }

      return { animal, error: null }
    } catch (error) {
      return { animal: null, error: 'An unexpected error occurred' }
    }
  }

  async getAnimalsByShelter(shelterId: string): Promise<AnimalsResponse> {
    try {
      const { data: animals, error } = await supabase
        .from('animals')
        .select(`
          *,
          pictures:animalpictures(*)
        `)
        .eq('shelter_id', shelterId)
        .order('name', { ascending: true })

      if (error) {
        return { animals: [], error: error.message }
      }

      return { animals: animals || [], error: null }
    } catch (error) {
      return { animals: [], error: 'An unexpected error occurred' }
    }
  }

  async getAllAnimals(): Promise<AnimalsResponse> {
    try {
      const { data: animals, error } = await supabase
        .from('animals')
        .select(`
          *,
          pictures:animalpictures(*)
        `)
        .order('name', { ascending: true })

      if (error) {
        return { animals: [], error: error.message }
      }

      return { animals: animals || [], error: null }
    } catch (error) {
      return { animals: [], error: 'An unexpected error occurred' }
    }
  }

  async getAnimalById(id: string): Promise<AnimalResponse> {
    try {
      const { data: animal, error } = await supabase
        .from('animals')
        .select(`
          *,
          pictures:animalpictures(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return { animal: null, error: error.message }
      }

      return { animal, error: null }
    } catch (error) {
      return { animal: null, error: 'An unexpected error occurred' }
    }
  }

  async updateAnimal(id: string, data: AnimalUpdateData): Promise<AnimalResponse> {
    try {
      const { data: animal, error } = await supabase
        .from('animals')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          pictures:animalpictures(*)
        `)
        .single()

      if (error) {
        return { animal: null, error: error.message }
      }

      return { animal, error: null }
    } catch (error) {
      return { animal: null, error: 'An unexpected error occurred' }
    }
  }

  async deleteAnimal(id: string): Promise<{ error: string | null }> {
    try {
      // First delete all pictures
      const { error: picturesError } = await supabase
        .from('animalpictures')
        .delete()
        .eq('animal_id', id)

      if (picturesError) {
        return { error: picturesError.message }
      }

      // Then delete the animal
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async uploadAnimalPictures(animalId: string, files: File[]): Promise<AnimalPicturesResponse> {
    try {
      // First get the animal to find its shelter_id
      console.log('Uploading pictures for animal ID:', animalId)
      
      const { data: animal, error: animalError } = await supabase
        .from('animals')
        .select('shelter_id, name')
        .eq('id', animalId)
        .single()

      console.log('Animal query result:', { animal, animalError })

      if (animalError || !animal) {
        return { pictures: [], error: `Animal not found: ${animalError?.message || 'Unknown error'}` }
      }

      if (!animal.shelter_id) {
        return { pictures: [], error: `Animal "${animal.name || animalId}" has no shelter_id assigned. Please ensure the animal was created with a valid shelter_id.` }
      }

      console.log('Animal shelter_id:', animal.shelter_id)

      const uploadedPictures: AnimalPicture[] = []

      for (const file of files) {
        // Validate file type - only allow images
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          return {
            pictures: [],
            error: `Invalid file type: ${file.type}. Only JPEG, PNG, GIF, and WebP images are allowed.`
          }
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
          return {
            pictures: [],
            error: `File too large: ${file.name}. Maximum size is 5MB.`
          }
        }

        // Generate filename with specific structure: shelter_id/animal_id_timestamp.jpg
        // Clean the IDs to remove any special characters that might cause issues
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const timestamp = Date.now()
        const cleanShelterId = animal.shelter_id.replace(/[^a-zA-Z0-9-]/g, '')
        const cleanAnimalId = animalId.replace(/[^a-zA-Z0-9-]/g, '')
        const fileName = `${cleanShelterId}/${cleanAnimalId}_${timestamp}.${fileExt}`
        
        console.log('Uploading file:', fileName)

        // Check authentication before upload
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Current user for upload:', user)
        console.log('Auth error:', authError)

        // Step 1: Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shelter_images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        console.log('Upload result:', { uploadData, uploadError })

        if (uploadError) {
          return { pictures: [], error: `Upload failed: ${uploadError.message}` }
        }

        // Step 2: Get public URL
        const { data: urlData } = supabase.storage
          .from('shelter_images')
          .getPublicUrl(fileName)

        // Step 3: Save picture record to animalpictures table
        const { data: picture, error: pictureError } = await supabase
          .from('animalpictures')
          .insert({
            animal_id: animalId,
            image_url: urlData.publicUrl
          })
          .select()
          .single()

        if (pictureError) {
          // If database insert fails, clean up the uploaded file
          await supabase.storage
            .from('shelter_images')
            .remove([fileName])
          return { pictures: [], error: `Database error: ${pictureError.message}` }
        }

        uploadedPictures.push(picture)
      }

      return { pictures: uploadedPictures, error: null }
    } catch (error) {
      return { pictures: [], error: 'An unexpected error occurred' }
    }
  }

  async deleteAnimalPicture(pictureId: string): Promise<{ error: string | null }> {
    try {
      // Get picture data first to delete from storage
      const { data: picture, error: fetchError } = await supabase
        .from('animalpictures')
        .select('image_url')
        .eq('id', pictureId)
        .single()

      if (fetchError) {
        return { error: fetchError.message }
      }

      // Extract full file path from URL and delete from storage
      if (picture?.image_url) {
        // Extract the full path from the URL (includes shelter_id/animal_id_timestamp.jpg)
        const urlParts = picture.image_url.split('/shelter_images/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0] // Remove query parameters if any
          await supabase.storage
            .from('shelter_images')
            .remove([filePath])
        }
      }

      // Delete picture record from database
      const { error } = await supabase
        .from('animalpictures')
        .delete()
        .eq('id', pictureId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async validateAnimalData(data: AnimalCreateData): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Animal name is required')
    }

    if (!data.shelter_id || data.shelter_id.trim().length === 0) {
      errors.push('Shelter ID is required')
    }

    if (data.name && data.name.length > 100) {
      errors.push('Animal name must be less than 100 characters')
    }

    if (data.breed && data.breed.length > 50) {
      errors.push('Breed must be less than 50 characters')
    }

    if (data.gender && !['Male', 'Female', 'Unknown'].includes(data.gender)) {
      errors.push('Gender must be Male, Female, or Unknown')
    }

    if (data.age && (data.age < 0 || data.age > 30)) {
      errors.push('Age must be between 0 and 30 years')
    }

    if (data.height && data.height < 0) {
      errors.push('Height must be positive')
    }

    if (data.weight && data.weight < 0) {
      errors.push('Weight must be positive')
    }

    return { isValid: errors.length === 0, errors }
  }

  async searchAnimals(query: string, shelterId?: string): Promise<AnimalsResponse> {
    try {
      let queryBuilder = supabase
        .from('animals')
        .select(`
          *,
          pictures:animalpictures(*)
        `)
        .or(`name.ilike.%${query}%,breed.ilike.%${query}%,color.ilike.%${query}%`)

      if (shelterId) {
        queryBuilder = queryBuilder.eq('shelter_id', shelterId)
      }

      const { data: animals, error } = await queryBuilder
        .order('name', { ascending: true })

      if (error) {
        return { animals: [], error: error.message }
      }

      return { animals: animals || [], error: null }
    } catch (error) {
      return { animals: [], error: 'An unexpected error occurred' }
    }
  }

  // Helper method to validate image files
  validateImageFiles(files: File[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WebP images are allowed.`)
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.name}. Maximum size is 5MB.`)
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  // Get all pictures for a specific shelter (for admin purposes)
  async getShelterPictures(shelterId: string): Promise<AnimalPicturesResponse> {
    try {
      const { data: pictures, error } = await supabase
        .from('animalpictures')
        .select(`
          *,
          animal:animals!inner(
            id,
            name,
            shelter_id
          )
        `)
        .eq('animal.shelter_id', shelterId)
        .order('created_at', { ascending: false })

      if (error) {
        return { pictures: [], error: error.message }
      }

      return { pictures: pictures || [], error: null }
    } catch (error) {
      return { pictures: [], error: 'An unexpected error occurred' }
    }
  }
}

export const animalService = new AnimalService()