import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CarListParams, FuelType, Transmission } from '@/types/api'

/** Filtreler URL'de tutulur: sayfa yenilenince, geri tuşuna basınca ve link paylaşılınca aynı sonuç gelir. */
export interface ListingFilters {
  brand: string
  model: string
  city: string
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
  fuelType: FuelType | ''
  transmission: Transmission | ''
}

export const EMPTY_FILTERS: ListingFilters = {
  brand: '', model: '', city: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', fuelType: '', transmission: '',
}

const FILTER_KEYS = Object.keys(EMPTY_FILTERS) as (keyof ListingFilters)[]
export const DEFAULT_SORT = 'createdAt,desc'
export const PAGE_SIZE = 12

const toNumber = (v: string) => (v === '' ? undefined : Number(v))

export function useListingParams() {
  const [sp, setSp] = useSearchParams()

  const filters = useMemo(() => {
    const f = { ...EMPTY_FILTERS }
    for (const k of FILTER_KEYS) (f as Record<string, string>)[k] = sp.get(k) ?? ''
    return f
  }, [sp])

  const page = Math.max(0, Number(sp.get('page')) || 0)
  const sort = sp.get('sort') || DEFAULT_SORT

  const patch = useCallback(
    (changes: Record<string, string | undefined>, keepPage = false) => {
      setSp((prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(changes)) (v ? next.set(k, v) : next.delete(k))
        if (!keepPage) next.delete('page')
        return next
      })
    },
    [setSp],
  )

  const apiParams: CarListParams = {
    brand: filters.brand.trim() || undefined,
    model: filters.model.trim() || undefined,
    city: filters.city.trim() || undefined,
    minPrice: toNumber(filters.minPrice),
    maxPrice: toNumber(filters.maxPrice),
    minYear: toNumber(filters.minYear),
    maxYear: toNumber(filters.maxYear),
    fuelType: filters.fuelType || undefined,
    transmission: filters.transmission || undefined,
    page,
    size: PAGE_SIZE,
    sort,
  }

  return {
    filters,
    page,
    sort,
    apiParams,
    activeCount: FILTER_KEYS.filter((k) => filters[k] !== '').length,
    setFilters: (f: ListingFilters) => patch({ ...f }),
    removeFilter: (key: keyof ListingFilters) => patch({ [key]: undefined }),
    reset: () => patch(Object.fromEntries(FILTER_KEYS.map((k) => [k, undefined]))),
    setSort: (s: string) => patch({ sort: s === DEFAULT_SORT ? undefined : s }),
    setPage: (p: number) => patch({ page: p ? String(p) : undefined }, true),
  }
}
