import { create } from 'zustand'
import { Profile, UserRole } from '../lib/types'

interface AuthState {
  user: Profile | null
  role: UserRole | null
  isLoading: boolean
  isAuthenticated: boolean

  setUser: (user: Profile | null) => void
  setRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setRole: (role) => set({ role }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}))
