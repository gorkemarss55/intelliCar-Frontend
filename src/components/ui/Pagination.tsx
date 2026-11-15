import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PaginationProps {
  /** 0 tabanlı sayfa numarası (Spring ile aynı). */
  page: number
  totalPages: number
  onChange: (page: number) => void
}

function pageWindow(page: number, total: number): (number | 'gap')[] {
  const pages = new Set([0, total - 1, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const item = 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium'
  return (
    <nav aria-label="Sayfalar" className="mt-8 flex items-center justify-center gap-1">
      <button className={cn(item, 'text-muted hover:bg-white disabled:opacity-40')} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Önceki sayfa">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageWindow(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-muted">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}
            className={cn(item, p === page ? 'bg-brand-700 text-white' : 'text-ink hover:bg-white')}>
            {p + 1}
          </button>
        ),
      )}
      <button className={cn(item, 'text-muted hover:bg-white disabled:opacity-40')} disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)} aria-label="Sonraki sayfa">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
