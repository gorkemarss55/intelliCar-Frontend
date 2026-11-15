import { useState } from 'react'
import { Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { CarImage } from '@/types/api'

export function ImageGallery({ images, alt }: { images: CarImage[]; alt: string }) {
  const sorted = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
  const [index, setIndex] = useState(0)

  if (!sorted.length) {
    return (
      <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-xl border border-line bg-slate-100 text-muted">
        <CarIcon className="h-10 w-10" aria-hidden />
        <span className="text-sm">Bu ilanda görsel yok</span>
      </div>
    )
  }

  const go = (d: number) => setIndex((i) => (i + d + sorted.length) % sorted.length)
  const btn = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-line hover:bg-white'

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-slate-100">
        <img src={sorted[index].imageUrl} alt={`${alt} - görsel ${index + 1}`} className="h-full w-full object-cover" />
        {sorted.length > 1 && (
          <>
            <button className={cn(btn, 'left-3')} onClick={() => go(-1)} aria-label="Önceki görsel"><ChevronLeft className="h-5 w-5" /></button>
            <button className={cn(btn, 'right-3')} onClick={() => go(1)} aria-label="Sonraki görsel"><ChevronRight className="h-5 w-5" /></button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">{index + 1} / {sorted.length}</span>
          </>
        )}
      </div>
      {sorted.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <li key={img.id} className="shrink-0">
              <button onClick={() => setIndex(i)} aria-label={`Görsel ${i + 1}`} aria-current={i === index}
                className={cn('h-16 w-24 overflow-hidden rounded-lg border-2', i === index ? 'border-brand-600' : 'border-transparent opacity-80 hover:opacity-100')}>
                <img src={img.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
