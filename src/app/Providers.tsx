import { useEffect, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/features/auth/store'
import { queryClient } from './queryClient'

export function Providers({ children }: { children: ReactNode }) {
  // Oturum süresi dolup token'lar silindiğinde önceki kullanıcının verisi önbellekte kalmasın.
  useEffect(
    () =>
      useAuthStore.subscribe((state, prev) => {
        if (prev.accessToken && !state.accessToken) queryClient.clear()
      }),
    [],
  )
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 14 } }} />
    </QueryClientProvider>
  )
}
