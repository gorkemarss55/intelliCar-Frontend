import { z } from 'zod'

const num = (msg: string) => z.number({ invalid_type_error: msg, required_error: msg })
const fuel = z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC'])
const trans = z.enum(['MANUAL', 'AUTOMATIC'])

export const recommendSchema = z.object({
  budget: num('Bütçeni gir').positive('Bütçe 0’dan büyük olmalı'),
  preferences: z.string().max(500, 'En fazla 500 karakter'),
  fuelType: fuel.or(z.literal('')),
  transmission: trans.or(z.literal('')),
  city: z.string().max(100),
  limit: num('1 ile 10 arasında gir').int().min(1, 'En az 1').max(10, 'En fazla 10'),
})
export type RecommendValues = z.infer<typeof recommendSchema>

export const estimateSchema = z.object({
  brand: z.string().trim().min(1, 'Marka zorunlu').max(50),
  model: z.string().trim().min(1, 'Model zorunlu').max(50),
  year: num('Model yılını gir').int().min(1950, '1950 veya sonrası olmalı').max(new Date().getFullYear() + 1, 'Geçerli bir yıl gir'),
  mileage: num('Kilometreyi gir').int().min(0, 'Negatif olamaz'),
  fuelType: fuel,
  transmission: trans,
  city: z.string().max(100),
  description: z.string().max(1000, 'En fazla 1000 karakter'),
})
export type EstimateValues = z.infer<typeof estimateSchema>

export const toEstimateRequest = (v: EstimateValues) => ({
  ...v,
  brand: v.brand.trim(),
  model: v.model.trim(),
  city: v.city.trim() || undefined,
  description: v.description.trim() || undefined,
})
