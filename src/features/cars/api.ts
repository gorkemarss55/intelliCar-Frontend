import { http } from '@/lib/http'
import { compact, normalizePage } from '@/lib/pagination'
import type {
  CarCreateRequest, CarDetail, CarImage, CarImageRequest, CarListItem, CarListParams, CarUpdateRequest, MyCarListItem,
} from '@/types/api'

export const carsApi = {
  list: (params: CarListParams) =>
    http.get('/car', { params: compact(params) }).then((r) => normalizePage<CarListItem>(r.data)),
  mine: (params: Pick<CarListParams, 'page' | 'size' | 'sort'>) =>
    http.get('/car/my-cars', { params: compact(params) }).then((r) => normalizePage<MyCarListItem>(r.data)),
  get: (id: string) => http.get<CarDetail>(`/car/${id}`).then((r) => r.data),
  create: (body: CarCreateRequest) => http.post<CarDetail>('/car', body).then((r) => r.data),
  update: (id: string, body: CarUpdateRequest) => http.put<CarDetail>(`/car/${id}`, body).then((r) => r.data),
  remove: (id: string) => http.delete<void>(`/car/${id}`),

  /** Bilgisayardan seçilen resmi backend'deki /upload endpoint'ine yükler ve URL döner */
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file) // RestUploadController @RequestParam("file") bekliyor

    return http
      .post<{ url: string }>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((r) => r.data)
  },

  addImages: (carId: string, images: CarImageRequest[]) =>
    http.post<CarImage[]>(`/carImage/${carId}`, images).then((r) => r.data),
  setPrimaryImage: (carId: string, imageId: string) => http.patch<void>(`/carImage/${carId}/images/${imageId}/primary`),
  deleteImage: (imageId: string) => http.delete<void>(`/carImage/${imageId}`),
}