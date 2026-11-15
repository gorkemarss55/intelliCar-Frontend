import { z } from 'zod'
import { MAX_IMAGES } from '@/lib/constants'

const num = (msg: string) => z.number({ invalid_type_error: msg, required_error: msg })
const currentYear = new Date().getFullYear()

export const carCreateSchema = z.object({
  brand: z.string().trim().min(1, 'Marka zorunlu').max(50, 'En fazla 50 karakter'),
  model: z.string().trim().min(1, 'Model zorunlu').max(50, 'En fazla 50 karakter'),
  year: num('Model yılını gir').int('Tam sayı gir').min(1950, '1950 veya sonrası olmalı').max(currentYear + 1, 'Geçerli bir yıl gir'),
  mileage: num('Kilometreyi gir').int('Tam sayı gir').min(0, 'Negatif olamaz').max(2_000_000, 'Geçerli bir değer gir'),
  price: num('Fiyatı gir').positive('Fiyat 0’dan büyük olmalı'),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  city: z.string().trim().min(1, 'Şehir zorunlu').max(100),
  description: z.string().trim().min(10, 'Açıklama en az 10 karakter olmalı').max(255, 'En fazla 255 karakter'),
  images: z.array(z.string().min(1)).max(MAX_IMAGES, `En fazla ${MAX_IMAGES} görsel ekleyebilirsin`),
})
export type CarCreateValues = z.infer<typeof carCreateSchema>

export const carUpdateSchema = z.object({
  price: num('Fiyatı gir').positive('Fiyat 0’dan büyük olmalı'),
  mileage: num('Kilometreyi gir').int('Tam sayı gir').min(0, 'Negatif olamaz'),
  description: z.string().trim().min(10, 'Açıklama en az 10 karakter olmalı').max(255, 'En fazla 255 karakter'),
  status: z.enum(['ACTIVE', 'PENDING_REVIEW', 'SOLD', 'INACTIVE']),
})
export type CarUpdateValues = z.infer<typeof carUpdateSchema>
