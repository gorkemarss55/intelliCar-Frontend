import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CarListItem } from '@/types/api'

export type FavoriteCar = Omit<CarListItem, 'createdAt'> & { createdAt?: string }

interface FavoritesState {
  items: FavoriteCar[]
  toggle: (car: FavoriteCar) => void
  clear: () => void
}

/** Backend'de favori yok; ilanın özeti tarayıcıda saklanır, böylece liste ilan servisine bağlı olmadan açılır. */
export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (car) =>
        set((s) => ({
          items: s.items.some((i) => i.id === car.id) ? s.items.filter((i) => i.id !== car.id) : [car, ...s.items],
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'intellicar-favorites-v2' },
  ),
)
