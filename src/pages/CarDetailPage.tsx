import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Eye, Fuel, Gauge, MapPin, Phone, Settings2, Share2, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { Container } from '@/components/shared/Container'
import { CarStatusBadge } from '@/components/shared/StatusBadge'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useCurrentUser } from '@/features/auth/store'
import { FavoriteButton } from '@/features/cars/components/FavoriteButton'
import { ImageGallery } from '@/features/cars/components/ImageGallery'
import { useCar } from '@/features/cars/hooks'
import { carTitle, detailToListItem } from '@/features/cars/utils'
import { OfferForm } from '@/features/offers/components/OfferForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/lib/constants'
import { formatDate, formatKm, formatPrice, fullName } from '@/lib/format'

function SellerCard({ seller }: { seller: { firstName: string; lastName: string; phone: string } }) {
  const [show, setShow] = useState(false)
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-muted">Satıcı</h2>
      <p className="mt-1 flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-muted" aria-hidden />{fullName(seller)}</p>
      {show ? (
        <a href={`tel:${seller.phone.replace(/\s/g, '')}`} className={buttonStyles('secondary', 'md', 'mt-3 w-full')}><Phone className="h-4 w-4" aria-hidden />{seller.phone}</a>
      ) : (
        <Button variant="secondary" className="mt-3 w-full" onClick={() => setShow(true)}><Phone className="h-4 w-4" aria-hidden />Telefonu göster</Button>
      )}
    </Card>
  )
}

export function CarDetailPage() {
  const { id } = useParams()
  const user = useCurrentUser()
  const { data: car, isLoading, isError, error, refetch } = useCar(id)
  useDocumentTitle(car ? `${carTitle(car)} ${car.year}` : 'İlan')

  if (isLoading) return <Spinner className="min-h-[60vh]" />
  if (isError || !car) return <Container className="py-12"><ErrorState error={error} onRetry={refetch} /></Container>

  const own = !!user && user.id === car.seller?.id
  const specs = [
    { icon: Calendar, label: 'Model yılı', value: String(car.year) },
    { icon: Gauge, label: 'Kilometre', value: formatKm(car.mileage) },
    { icon: Fuel, label: 'Yakıt', value: FUEL_LABELS[car.fuelType] },
    { icon: Settings2, label: 'Vites', value: TRANSMISSION_LABELS[car.transmission] },
    { icon: MapPin, label: 'Şehir', value: car.city },
    { icon: Eye, label: 'Görüntülenme', value: String(car.viewCount ?? 0) },
  ]

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: carTitle(car), url: location.href })
      else {
        await navigator.clipboard.writeText(location.href)
        toast.success('Bağlantı kopyalandı')
      }
    } catch {
      /* kullanıcı paylaşımı iptal etti */
    }
  }

  return (
    <Container className="py-6 sm:py-8">
      <nav aria-label="Konum" className="mb-4 text-sm text-muted">
        <Link to="/ilanlar" className="hover:text-ink hover:underline">İlanlar</Link>
        <span className="mx-2">/</span>
        <Link to={`/ilanlar?brand=${encodeURIComponent(car.brand)}`} className="hover:text-ink hover:underline">{car.brand}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{car.model}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <ImageGallery images={car.images ?? []} alt={carTitle(car)} />

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">Özellikler</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 text-brand-600" aria-hidden />
                  <div><dt className="text-xs text-muted">{label}</dt><dd className="font-semibold">{value}</dd></div>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">Açıklama</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-ink/90">{car.description}</p>
            <p className="mt-5 text-xs text-muted">İlan tarihi: {formatDate(car.createdAt)}</p>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl font-extrabold leading-tight">{carTitle(car)}</h1>
              <CarStatusBadge status={car.status} />
            </div>
            <p className="tabular mt-2 font-display text-3xl font-extrabold text-brand-800">{formatPrice(car.price)}</p>
            <div className="mt-4 flex gap-2">
              <FavoriteButton car={detailToListItem(car)} label className="flex-1 justify-center rounded-lg py-2" />
              <Button variant="secondary" onClick={share} aria-label="Paylaş"><Share2 className="h-4 w-4" /></Button>
            </div>
          </Card>

          {car.seller && <SellerCard seller={car.seller} />}

          {own ? (
            <Card className="space-y-2 p-5">
              <p className="text-sm text-muted">Bu ilan senin.</p>
              <Link to={`/ilanlarim/${car.id}/duzenle`} className={buttonStyles('secondary', 'md', 'w-full')}>İlanı düzenle</Link>
              <Link to={`/ilanlarim/${car.id}/teklifler`} className={buttonStyles('primary', 'md', 'w-full')}>Gelen teklifler</Link>
            </Card>
          ) : car.status !== 'ACTIVE' ? (
            <Card className="p-5 text-sm text-muted">Bu ilan yayında olmadığı için teklif verilemez.</Card>
          ) : user ? (
            <Card className="p-5">
              <h2 className="mb-3 text-lg font-bold">Teklif ver</h2>
              <OfferForm carId={car.id} price={car.price} />
            </Card>
          ) : (
            <Card className="p-5">
              <p className="mb-3 text-sm text-muted">Teklif vermek için giriş yapmalısın.</p>
              <Link to="/giris" state={{ from: `/ilan/${car.id}` }} className={buttonStyles('primary', 'md', 'w-full')}>Giriş yap</Link>
            </Card>
          )}
        </aside>
      </div>
    </Container>
  )
}
