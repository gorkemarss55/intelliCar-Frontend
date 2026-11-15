import { MutationCache, QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getErrorMessage, isClientError } from '@/lib/error'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => !isClientError(error) && count < 2,
    },
  },
  // Tüm mutation hataları tek yerden kullanıcıya gösterilir.
  mutationCache: new MutationCache({ onError: (error) => toast.error(getErrorMessage(error)) }),
})
