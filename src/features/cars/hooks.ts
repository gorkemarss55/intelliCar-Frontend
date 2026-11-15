import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { CarListParams, CarUpdateRequest } from '@/types/api'
import { carsApi } from './api'

export const carKeys = {
  all: ['cars'] as const,
  list: (params: CarListParams) => [...carKeys.all, 'list', params] as const,
  mine: (params: object) => [...carKeys.all, 'mine', params] as const,
  detail: (id: string) => [...carKeys.all, 'detail', id] as const,
}

export const useCars = (params: CarListParams) =>
  useQuery({ queryKey: carKeys.list(params), queryFn: () => carsApi.list(params), placeholderData: keepPreviousData })

export const useMyCars = (params: { page: number; size: number; sort: string }) =>
  useQuery({ queryKey: carKeys.mine(params), queryFn: () => carsApi.mine(params), placeholderData: keepPreviousData })

export const useCar = (id: string | undefined) =>
  useQuery({ queryKey: carKeys.detail(id ?? ''), queryFn: () => carsApi.get(id!), enabled: !!id })

export function useCreateCar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: carsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: carKeys.all })
      toast.success('İlanın yayınlandı')
    },
  })
}

export function useUpdateCar(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CarUpdateRequest) => carsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: carKeys.all })
      toast.success('İlan güncellendi')
    },
  })
}

export function useDeleteCar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: carsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: carKeys.all })
      toast.success('İlan yayından kaldırıldı')
    },
  })
}

export function useCarImageMutations(carId: string) {
  const qc = useQueryClient()
  const refresh = () => qc.invalidateQueries({ queryKey: carKeys.all })
  return {
    add: useMutation({
      mutationFn: (urls: string[]) => carsApi.addImages(carId, urls.map((imageUrl) => ({ imageUrl, isPrimary: false }))),
      onSuccess: () => { refresh(); toast.success('Görsel eklendi') },
    }),
    setPrimary: useMutation({
      mutationFn: (imageId: string) => carsApi.setPrimaryImage(carId, imageId),
      onSuccess: () => { refresh(); toast.success('Ana görsel güncellendi') },
    }),
    remove: useMutation({
      mutationFn: (imageId: string) => carsApi.deleteImage(imageId),
      onSuccess: () => { refresh(); toast.success('Görsel silindi') },
    }),
  }
}
