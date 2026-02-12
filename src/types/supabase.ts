/**
 * Supabase 데이터베이스 타입 정의
 * 
 * 실제 타입 생성 방법:
 * 1. Supabase CLI 설치: npm install -D supabase
 * 2. 로그인: npx supabase login
 * 3. 프로젝트 연결: npx supabase link --project-ref your-project-ref
 * 4. 타입 생성: npx supabase gen types typescript --linked > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          message: string
          data: Json | null
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          images: string[]
          category: string
          price_per_hour: number
          capacity: number
          location: string | null
          amenities: string[]
          available_time_slots: Json
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          images?: string[]
          category: string
          price_per_hour: number
          capacity: number
          location?: string | null
          amenities?: string[]
          available_time_slots?: Json
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          images?: string[]
          category?: string
          price_per_hour?: number
          capacity?: number
          location?: string | null
          amenities?: string[]
          available_time_slots?: Json
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          product_id: string
          user_id: string
          reservation_date: string
          start_time: string
          end_time: string
          number_of_people: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          reservation_date: string
          start_time: string
          end_time: string
          number_of_people: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          reservation_date?: string
          start_time?: string
          end_time?: string
          number_of_people?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          reservation_id: string
          user_id: string
          amount: number
          payment_method: 'card' | 'transfer' | 'kakao' | 'toss'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          paid_at: string | null
          refunded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_id: string
          user_id: string
          amount: number
          payment_method: 'card' | 'transfer' | 'kakao' | 'toss'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          paid_at?: string | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string
          user_id?: string
          amount?: number
          payment_method?: 'card' | 'transfer' | 'kakao' | 'toss'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          paid_at?: string | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
