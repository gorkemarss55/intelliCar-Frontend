import { http } from '@/lib/http'
import { compact, normalizePage } from '@/lib/pagination'
import type { OfferCreateRequest, OfferResponse, OfferStatus } from '@/types/api'

type PageParams = { page: number; size: number; sort: string }

export const offersApi = {
  create: (body: OfferCreateRequest) => http.post<OfferResponse>('/offer', body).then((r) => r.data),
  respond: (id: string, newStatus: Extract<OfferStatus, 'ACCEPTED' | 'REJECTED'>) =>
    http.patch<OfferResponse>(`/offer/${id}/respond`, null, { params: { newStatus } }).then((r) => r.data),
  forCar: (carId: string, params: PageParams) =>
    http.get(`/offer/cars/${carId}`, { params: compact(params) }).then((r) => normalizePage<OfferResponse>(r.data)),
  mine: (params: PageParams) =>
    http.get('/offer/my-offers', { params: compact(params) }).then((r) => normalizePage<OfferResponse>(r.data)),
}
