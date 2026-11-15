import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Car as CarIcon, Fuel, Gauge, MapPin, Settings2 } from 'lucide-react'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/lib/constants'
import { formatKm, formatPrice, timeAgo } from '@/lib/format'
import { Skeleton } from '@/components/ui/Spinner'
import type { CarListItem } from '@/types/api'
import { carTitle } from '../utils'
import { FavoriteButton } from './FavoriteButton'

type CarCardData = Omit<CarListItem, 'createdAt'> & { createdAt?: string }

export function CarCard({ car, footer, badge }: { car: CarCardData; footer?: ReactNode; badge?: ReactNode }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-panel">
      <Link to={`/ilan/${car.id}`} className="flex flex-1 flex-col" aria-label={`${carTitle(car)} ilanını gör`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {car.primaryImageUrl ? (
            <img src={car.primaryImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-muted">
              <CarIcon className="h-8 w-8" aria-hidden />
              <span className="text-xs">Görsel yok</span>
            </div>
          )}
          {badge && <div className="absolute left-3 top-3">{badge}</div>}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="tabular font-display text-xl font-extrabold text-brand-800">{formatPrice(car.price)}</p>
          <h3 className="mt-1 truncate font-semibold">{carTitle(car)}</h3>
          <p className="mt-0.5 text-sm text-muted">{car.year} model</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
            <li className="inline-flex items-center gap-1"><Gauge className="h-3.5 w-3.5" aria-hidden />{formatKm(car.mileage)}</li>
            <li className="inline-flex items-center gap-1"><Fuel className="h-3.5 w-3.5" aria-hidden />{FUEL_LABELS[car.fuelType]}</li>
            <li className="inline-flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" aria-hidden />{TRANSMISSION_LABELS[car.transmission]}</li>
          </ul>
          <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{car.city}</span>
            {car.createdAt && <span>{timeAgo(car.createdAt)}</span>}
          </div>
        </div>
      </Link>
      <FavoriteButton car={car} className="absolute right-3 top-3" />
      {footer && <div className="border-t border-line p-4">{footer}</div>}
    </article>
  )
}

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white" aria-hidden>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  )
}

export function CarGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
}
