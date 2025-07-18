import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const refreshProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Auth user:', user?.email, user?.id)
      setUser(user)
      
      if (!user) {
        setProfile(null)
        setIsAdmin(false)
        return
      }
      
      // Get user profile from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle()
      
      if (error) throw error
      
     console.log('User profile data:', data)
      setProfile(data)
      
      // Garantir que o usuário pedropardal04@gmail.com seja sempre admin
      if (user.email === 'pedropardal04@gmail.com' || data?.email === 'pedropardal04@gmail.com') {
        console.log('Setting admin status for pedropardal04@gmail.com - TRUE')
        setIsAdmin(true)
        
        // Atualizar o status de admin no banco de dados se necessário
        if (data && !data.is_admin) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('email', 'pedropardal04@gmail.com')
          
          if (updateError) {
            console.error('Erro ao atualizar status de admin:', updateError)
          }
        }
      } else {
        setIsAdmin(data?.is_admin || false)
      }
      console.log('Is admin status final:', isAdmin)
    } catch (error) {
      console.error('Error refreshing profile:', error)
      setProfile(null)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session || null)
        
        if (session?.user) {
          await refreshProfile()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user || null)
          
          if (session?.user) {
            await refreshProfile()
          } else {
            setProfile(null)
            setIsAdmin(false)
          }
        }
      )
      
      return () => {
        subscription.unsubscribe()
      }
    }
    
    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw new Error(error.message)
      
      setSession(data.session)
      setUser(data.user)
      
      // Verificar se é o usuário pedropardal04@gmail.com e definir como admin
      if (email === 'pedropardal04@gmail.com') {
        console.log('Setting admin status for pedropardal04@gmail.com during sign in - TRUE')
        setIsAdmin(true)
        
        // Atualizar o status de admin no banco de dados
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', 'pedropardal04@gmail.com')
          .single()
        
        if (userData) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('id', userData.id)
          
          if (updateError) {
            console.error('Erro ao atualizar status de admin:', updateError)
          }
        }
      } else {
        setIsAdmin(false)
      }
      
      await refreshProfile()
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw new Error(error.message)
      
      if (!data.user) {
        throw new Error('Failed to create user')
      }
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          auth_user_id: data.user.id,
          email: email,
          full_name: fullName,
          status: 'pending_documents',
          is_admin: false
        })
      
      if (profileError) throw new Error(profileError.message)
      
      // Sign in the user
      await signIn(email, password)
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setProfile(null)
      setIsAdmin(false)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      session, 
      profile, 
      isLoading, 
      isAdmin, 
      signIn, 
      signUp, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}