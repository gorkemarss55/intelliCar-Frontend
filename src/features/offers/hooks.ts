import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { OfferStatus } from '@/types/api'
import { offersApi } from './api'

type PageParams = { page: number; size: number; sort: string }

export const offerKeys = {
  all: ['offers'] as const,
  mine: (p: PageParams) => [...offerKeys.all, 'mine', p] as const,
  forCar: (carId: string, p: PageParams) => [...offerKeys.all, 'car', carId, p] as const,
}

export const useMyOffers = (params: PageParams) =>
  useQuery({ queryKey: offerKeys.mine(params), queryFn: () => offersApi.mine(params), placeholderData: keepPreviousData })

export const useCarOffers = (carId: string, params: PageParams) =>
  useQuery({ queryKey: offerKeys.forCar(carId, params), queryFn: () => offersApi.forCar(carId, params), placeholderData: keepPreviousData })

export function useCreateOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: offerKeys.all })
      toast.success('Teklifin satıcıya iletildi')
    },
  })
}

export function useRespondToOffer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Extract<OfferStatus, 'ACCEPTED' | 'REJECTED'> }) => offersApi.respond(id, status),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: offerKeys.all })
      toast.success(status === 'ACCEPTED' ? 'Teklif kabul edildi' : 'Teklif reddedildi')
    },
  })
}
