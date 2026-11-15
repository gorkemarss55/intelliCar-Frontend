import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, UserRole } from '@/types/api'

export interface SessionUser { id: string; email: string; role: UserRole }

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: SessionUser | null
  setSession: (res: AuthResponse) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (res) =>
        set({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: { id: res.userId, email: res.email, role: res.role },
        }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'intellicar-auth' },
  ),
)

export const useCurrentUser = () => useAuthStore((s) => s.user)
