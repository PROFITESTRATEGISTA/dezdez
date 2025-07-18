import { supabase } from '../lib/supabase'

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
  phone?: string
  cpf?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export class AuthService {
  // Mock implementation for demo purposes
  static async signUp(credentials: SignUpCredentials) {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create user')
      }

      // Then create the user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          email: credentials.email,
          full_name: credentials.fullName,
          // We're not collecting these anymore
          // phone: credentials.phone,
          // cpf: credentials.cpf,
          status: 'pending_documents',
          is_admin: credentials.email.includes('admin') || credentials.email === 'pedropardal04@gmail.com'
        })

      if (profileError) throw profileError

      return { user: authData.user }
    } catch (error) {
      // Check for specific Supabase error codes
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage === 'User already registered' || errorMessage.includes('user_already_exists')) {
          throw new Error('USER_ALREADY_EXISTS');
        }
      }
      throw error;
    }
  }

  static async signIn(credentials: SignInCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) throw error

      return { user: data.user }
    } catch (error) {
      throw error;
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  }

  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  }

  static async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()
    
    if (error || !data) return null
    return data
  }

  static async isAdmin() {
    const profile = await this.getCurrentUserProfile()
    return profile?.is_admin || false
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { success: true }
  }

  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return { success: true }
  }
}