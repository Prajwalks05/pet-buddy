import { User } from '../backend/types/database'

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin'
}

export const isShelterAdmin = (user: User | null): boolean => {
  return user?.role === 'shelter_admin'
}

export const isRegularUser = (user: User | null): boolean => {
  return user?.role === 'user'
}

export const canManageShelters = (user: User | null): boolean => {
  return isAdmin(user)
}

export const canManageAnimals = (user: User | null, shelterId?: string): boolean => {
  if (!user) return false
  
  // Admins can manage all animals
  if (isAdmin(user)) return true
  
  // Shelter admins can only manage animals in their shelter
  if (isShelterAdmin(user) && user.shelter_id) {
    return shelterId ? user.shelter_id === shelterId : true
  }
  
  return false
}

export const getUserShelter = (user: User | null): string | null => {
  if (!user || !isShelterAdmin(user)) return null
  return user.shelter_id || null
}

export const requireAuth = (user: User | null): boolean => {
  return user !== null
}

export const requireRole = (user: User | null, requiredRole: 'user' | 'admin' | 'shelter_admin'): boolean => {
  return user?.role === requiredRole
}

export const requireAnyRole = (user: User | null, roles: ('user' | 'admin' | 'shelter_admin')[]): boolean => {
  return user ? roles.includes(user.role) : false
}