import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ className, label = 'Yükleniyor' }: { className?: string; label?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center py-16 text-brand-600', className)}>
      <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/70', className)} aria-hidden />
}
