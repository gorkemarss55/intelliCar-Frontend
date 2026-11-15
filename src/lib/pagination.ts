import type { Page } from '@/types/api'


export function normalizePage<T>(raw: any): Page<T> {
  const meta = raw?.page ?? raw ?? {}
  return {
    content: raw?.content ?? [],
    totalElements: meta.totalElements ?? raw?.totalElements ?? 0,
    totalPages: meta.totalPages ?? raw?.totalPages ?? 0,
    number: meta.number ?? raw?.number ?? 0,
    size: meta.size ?? raw?.size ?? 0,
  }
}


export function compact<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null && !Number.isNaN(v)),
  ) as Partial<T>
}
