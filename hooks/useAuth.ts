import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { setUser, setRole, setLoading, logout } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        logout()
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile && !error) {
        setUser(profile)
        setRole(profile.role)
      } else {
        // Profile not yet created (mid-onboarding)
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: 'creator' | 'brand') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    })
    if (error) throw error
    if (data.user) {
      await loadProfile(data.user.id)
    }
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
  }

  const getCurrentUserId = async (): Promise<string | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  }

  return { signUp, signIn, signOut, getCurrentUserId }
}
