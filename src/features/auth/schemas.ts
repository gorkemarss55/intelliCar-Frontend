import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'E-posta zorunlu').email('Geçerli bir e-posta gir'),
  password: z.string().min(1, 'Şifre zorunlu'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Ad zorunlu'),
  lastName: z.string().trim().min(1, 'Soyad zorunlu'),
  email: z.string().trim().min(1, 'E-posta zorunlu').email('Geçerli bir e-posta gir'),
  phone: z.string().trim().min(10, 'Telefon numaranı gir').regex(/^[0-9+()\s-]+$/, 'Yalnızca rakam ve + ( ) - kullan'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  role: z.enum(['BUYER', 'SELLER']),
})
export type RegisterValues = z.infer<typeof registerSchema>
