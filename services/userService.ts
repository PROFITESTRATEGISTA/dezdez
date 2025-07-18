import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type Address = Database['public']['Tables']['addresses']['Row']
type EmergencyContact = Database['public']['Tables']['emergency_contacts']['Row']
type Beneficiary = Database['public']['Tables']['beneficiaries']['Row']
type Document = Database['public']['Tables']['documents']['Row']
type MedicalHistory = Database['public']['Tables']['medical_history']['Row']
type UserPlan = Database['public']['Tables']['user_plans']['Row']
type Billing = Database['public']['Tables']['billing']['Row']

export interface CompleteUserProfile {
  user: User
  profile?: UserProfile
  address?: Address
  emergencyContact?: EmergencyContact
  beneficiaries: Beneficiary[]
  documents: Document[]
  medicalHistory: MedicalHistory[]
  userPlan?: UserPlan
  billing?: Billing[]
}

export class UserService {
  // Get all users with basic info for admin panel
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get users by status for admin filtering
  static async getUsersByStatus(status: User['status']): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get complete user profile with all related data
  static async getCompleteUserProfile(userId: string): Promise<CompleteUserProfile | null> {
    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) return null

    // Get all related data in parallel
    const [
      { data: profile },
      { data: address },
      { data: emergencyContact },
      { data: beneficiaries },
      { data: documents },
      { data: medicalHistory },
      { data: userPlan },
      { data: billing }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('addresses').select('*').eq('user_id', userId).eq('is_primary', true).single(),
      supabase.from('emergency_contacts').select('*').eq('user_id', userId).eq('is_primary', true).single(),
      supabase.from('beneficiaries').select('*').eq('user_id', userId).eq('is_active', true),
      supabase.from('documents').select('*').eq('user_id', userId),
      supabase.from('medical_history').select('*').eq('user_id', userId).eq('is_active', true),
      supabase.from('user_plans').select('*').eq('user_id', userId).eq('is_active', true).single(),
      supabase.from('billing').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    ])

    return {
      user,
      profile: profile || undefined,
      address: address || undefined,
      emergencyContact: emergencyContact || undefined,
      beneficiaries: beneficiaries || [],
      documents: documents || [],
      medicalHistory: medicalHistory || [],
      userPlan: userPlan || undefined,
      billing: billing || []
    }
  }

  // Create new user
  static async createUser(userData: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update user
  static async updateUser(userId: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update user status
  static async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)

    if (error) throw error
  }

  // Get users with pending documents
  static async getUsersWithPendingDocuments(): Promise<User[]> {
    return this.getUsersByStatus('pending_documents')
  }

  // Get users with pending signatures
  static async getUsersWithPendingSignatures(): Promise<User[]> {
    return this.getUsersByStatus('pending_signature')
  }

  // Get active users
  static async getActiveUsers(): Promise<User[]> {
    return this.getUsersByStatus('active')
  }

  // Get users with billing issues
  static async getUsersWithBillingIssues(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        billing!inner(*)
      `)
      .in('billing.status', ['pending', 'overdue'])
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Document management
  static async approveDocument(documentId: string, reviewerId: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      })
      .eq('id', documentId)

    if (error) throw error
  }

  static async rejectDocument(documentId: string, reason: string, reviewerId: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId
      })
      .eq('id', documentId)

    if (error) throw error
  }

  // Search users
  static async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,cpf.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}