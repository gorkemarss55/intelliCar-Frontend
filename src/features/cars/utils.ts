import type { CarDetail, CarListItem } from '@/types/api'

export const carTitle = (c: { brand: string; model: string }) => `${c.brand} ${c.model}`


export const detailToListItem = (c: CarDetail): CarListItem => ({
  id: c.id,
  brand: c.brand,
  model: c.model,
  year: c.year,
  mileage: c.mileage,
  price: c.price,
  fuelType: c.fuelType,
  transmission: c.transmission,
  city: c.city,
  primaryImageUrl: ((c.images ?? []).find((i) => i.isPrimary) ?? c.images?.[0])?.imageUrl ?? null,
  createdAt: c.createdAt,
})
