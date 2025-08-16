export interface User {
  id: string; // UUID matching auth.users.id
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin' | 'shelter_admin';
  shelter_id?: string; // For shelter admins
  created_at: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  contact?: string;
}

export interface Animal {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  age?: number;
  color?: string;
  height?: number;
  weight?: number;
  vaccinated?: boolean;
  shelter_id: string;
  pictures?: AnimalPicture[];
}

export interface AnimalPicture {
  id: string;
  animal_id: string;
  image_url: string;
}

export interface Booking {
  id: string;
  user_id: string;
  animal_id: string;
  booking_date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// Create/Update types
export interface UserCreateData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin' | 'shelter_admin';
  shelter_id?: string; // Only required for shelter_admin role
}

export interface ShelterCreateData {
  name: string;
  location: string;
  contact?: string;
}

export interface ShelterUpdateData {
  name?: string;
  location?: string;
  contact?: string;
}

export interface AnimalCreateData {
  name: string;
  breed?: string;
  gender?: string;
  age?: number;
  color?: string;
  height?: number;
  weight?: number;
  vaccinated?: boolean;
  shelter_id: string;
}

export interface AnimalUpdateData {
  name?: string;
  breed?: string;
  gender?: string;
  age?: number;
  color?: string;
  height?: number;
  weight?: number;
  vaccinated?: boolean;
}