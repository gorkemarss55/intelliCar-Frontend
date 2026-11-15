import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useFavorites, type FavoriteCar } from '@/features/favorites/store'

export function FavoriteButton({ car, className, label }: { car: FavoriteCar; className?: string; label?: boolean }) {
  const active = useFavorites((s) => s.items.some((i) => i.id === car.id))
  const toggle = useFavorites((s) => s.toggle)
  return (
    <button
      type="button"
      onClick={() => toggle(car)}
      aria-pressed={active}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={cn('inline-flex items-center gap-1.5 rounded-full bg-white/95 p-2 text-sm font-medium shadow-sm ring-1 ring-line transition-colors hover:bg-white', className)}
    >
      <Heart className={cn('h-4 w-4', active ? 'fill-red-500 text-red-500' : 'text-muted')} />
      {label && <span className="pr-1">{active ? 'Favorilerde' : 'Favorilere ekle'}</span>}
    </button>
  )
}
