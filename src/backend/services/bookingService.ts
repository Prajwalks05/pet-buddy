import { supabase } from '../supabase'

export interface BookingCreateData {
  user_id: string;
  animal_id: string;
  booking_date: string;
  preferred_time?: string;
  message?: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface Booking {
  id: string;
  user_id: string;
  animal_id: string;
  booking_date: string;
  preferred_time?: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface BookingResponse {
  booking: Booking | null;
  error: string | null;
}

export interface BookingsResponse {
  bookings: Booking[];
  error: string | null;
}

export class BookingService {
  async createBooking(bookingData: BookingCreateData): Promise<BookingResponse> {
    try {
      // Validate and clean the booking data
      const cleanBookingData = {
        user_id: bookingData.user_id,
        animal_id: bookingData.animal_id,
        booking_date: bookingData.booking_date,
        preferred_time: bookingData.preferred_time || null,
        message: bookingData.message ? bookingData.message.trim() : null,
        status: bookingData.status || 'Pending'
      };

      console.log("💾 Inserting booking data:", cleanBookingData);

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(cleanBookingData)
        .select()
        .single()

      if (error) {
        console.error("❌ Booking insert error:", error);
        return { booking: null, error: error.message }
      }

      console.log("✅ Booking created successfully:", booking);
      return { booking, error: null }
    } catch (error) {
      console.error("💥 Exception in createBooking:", error);
      return { booking: null, error: 'An unexpected error occurred' }
    }
  }

  async getUserBookings(userId: string): Promise<BookingsResponse> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          animal:animals(
            id,
            name,
            breed,
            shelter_id,
            shelter:shelters(name, location)
          )
        `)
        .eq('user_id', userId)
        .order('booking_date', { ascending: true })

      if (error) {
        return { bookings: [], error: error.message }
      }

      return { bookings: bookings || [], error: null }
    } catch (error) {
      return { bookings: [], error: 'An unexpected error occurred' }
    }
  }

  async updateBookingStatus(bookingId: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'): Promise<BookingResponse> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single()

      if (error) {
        return { booking: null, error: error.message }
      }

      return { booking, error: null }
    } catch (error) {
      return { booking: null, error: 'An unexpected error occurred' }
    }
  }

  async cancelBooking(bookingId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', bookingId)

      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  async getShelterBookings(shelterId: string): Promise<BookingsResponse> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          animal:animals!inner(
            id,
            name,
            breed,
            shelter_id
          ),
          user:users(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('animal.shelter_id', shelterId)
        .order('booking_date', { ascending: true })

      if (error) {
        return { bookings: [], error: error.message }
      }

      return { bookings: bookings || [], error: null }
    } catch (error) {
      return { bookings: [], error: 'An unexpected error occurred' }
    }
  }
}

export const bookingService = new BookingService()