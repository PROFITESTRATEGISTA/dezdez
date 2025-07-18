import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string
          phone: string | null
          cpf: string | null
          status: 'active' | 'pending_documents' | 'pending_signature' | 'inactive'
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          cpf?: string | null
          status?: 'active' | 'pending_documents' | 'pending_signature' | 'inactive'
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          cpf?: string | null
          status?: 'active' | 'pending_documents' | 'pending_signature' | 'inactive'
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string | null
          gender: string | null
          occupation: string | null
          marital_status: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth?: string | null
          gender?: string | null
          occupation?: string | null
          marital_status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string | null
          gender?: string | null
          occupation?: string | null
          marital_status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          country: string
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          country?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: string
          phone: string
          email: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relationship: string
          phone: string
          email?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: string
          phone?: string
          email?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      beneficiaries: {
        Row: {
          id: string
          user_id: string
          full_name: string
          cpf: string | null
          date_of_birth: string
          relationship: string
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          cpf?: string | null
          date_of_birth: string
          relationship: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          cpf?: string | null
          date_of_birth?: string
          relationship?: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string | null
          beneficiary_id: string | null
          document_type: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate' | 'other'
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          status: 'pending' | 'approved' | 'rejected' | 'missing'
          rejection_reason: string | null
          uploaded_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          beneficiary_id?: string | null
          document_type: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate' | 'other'
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'missing'
          rejection_reason?: string | null
          uploaded_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          beneficiary_id?: string | null
          document_type?: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate' | 'other'
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'missing'
          rejection_reason?: string | null
          uploaded_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      medical_history: {
        Row: {
          id: string
          user_id: string | null
          beneficiary_id: string | null
          condition_name: string
          description: string | null
          severity: string | null
          medications: string[] | null
          allergies: string[] | null
          limitations: string | null
          observations: string | null
          diagnosed_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          beneficiary_id?: string | null
          condition_name: string
          description?: string | null
          severity?: string | null
          medications?: string[] | null
          allergies?: string[] | null
          limitations?: string | null
          observations?: string | null
          diagnosed_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          beneficiary_id?: string | null
          condition_name?: string
          description?: string | null
          severity?: string | null
          medications?: string[] | null
          allergies?: string[] | null
          limitations?: string | null
          observations?: string | null
          diagnosed_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          age_min: number
          age_max: number
          coverage_details: any | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          age_min?: number
          age_max?: number
          coverage_details?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          age_min?: number
          age_max?: number
          coverage_details?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_plans: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          plan_type: 'monthly' | 'annual' | 'biannual'
          monthly_price: number
          total_price: number
          start_date: string
          end_date: string
          auto_renewal: boolean
          is_active: boolean
          contract_signed_at: string | null
          contract_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          plan_type: 'monthly' | 'annual' | 'biannual'
          monthly_price: number
          total_price: number
          start_date: string
          end_date: string
          auto_renewal?: boolean
          is_active?: boolean
          contract_signed_at?: string | null
          contract_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          plan_type?: 'monthly' | 'annual' | 'biannual'
          monthly_price?: number
          total_price?: number
          start_date?: string
          end_date?: string
          auto_renewal?: boolean
          is_active?: boolean
          contract_signed_at?: string | null
          contract_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      billing: {
        Row: {
          id: string
          user_id: string
          user_plan_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          amount: number
          currency: string
          status: 'paid' | 'pending' | 'overdue' | 'failed'
          payment_method: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | null
          due_date: string
          paid_at: string | null
          stripe_payment_intent_id: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_plan_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          amount: number
          currency?: string
          status?: 'paid' | 'pending' | 'overdue' | 'failed'
          payment_method?: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | null
          due_date: string
          paid_at?: string | null
          stripe_payment_intent_id?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_plan_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          amount?: number
          currency?: string
          status?: 'paid' | 'pending' | 'overdue' | 'failed'
          payment_method?: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | null
          due_date?: string
          paid_at?: string | null
          stripe_payment_intent_id?: string | null
          failure_reason?: string | null
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
      user_status: 'active' | 'pending_documents' | 'pending_signature' | 'inactive'
      document_status: 'pending' | 'approved' | 'rejected' | 'missing'
      document_type: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate' | 'other'
      plan_type: 'monthly' | 'annual' | 'biannual'
      payment_status: 'paid' | 'pending' | 'overdue' | 'failed'
      billing_method: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}