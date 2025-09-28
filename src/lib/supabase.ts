import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dfcqlkuiklalwijorqni.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmY3Fsa3Vpa2xhbHdpam9ycW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODIxOTMsImV4cCI6MjA3NDQ1ODE5M30.O8zOkr9PXcniJhkrAGXn60mvi92pQjcLLjloQYPS2hM'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface User {
  id: string
  email: string
  display_name: string
  role: 'paziente' | 'caregiver' | 'medico'
  created_at: string
}

export interface Product {
  id: string
  name: string
  stock: number
  unit: string
  low_stock_threshold: number
  user_id: string
  created_at: string
}

export interface TherapyLog {
  id: string
  therapy_type: string
  duration: number
  notes?: string
  date: string
  user_id: string
  created_at: string
}