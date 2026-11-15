import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from './api'
import { useAuthStore } from './store'

export const useIsAuthenticated = () => useAuthStore((s) => !!s.accessToken)

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({ mutationFn: authApi.login, onSuccess: setSession })
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({ mutationFn: authApi.register, onSuccess: setSession })
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return async () => {
    try {
      await authApi.logout()
    } catch {
      // Sunucu tarafı başarısız olsa da yerel oturum kapatılır.
    }
    clear()
    queryClient.clear()
    navigate('/')
  }
}

export function useProfile() {
  const enabled = useIsAuthenticated()
  return useQuery({ queryKey: ['profile'], queryFn: authApi.me, enabled })
}
