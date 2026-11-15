import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car as CarIcon, Pencil, PlusCircle, Tag, Trash2 } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { CarStatusBadge } from '@/components/shared/StatusBadge'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { useDeleteCar, useMyCars } from '@/features/cars/hooks'
import { carTitle } from '@/features/cars/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatKm, formatPrice, timeAgo } from '@/lib/format'
import type { MyCarListItem } from '@/types/api'

export function MyCarsPage() {
  useDocumentTitle('İlanlarım')
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error, refetch } = useMyCars({ page, size: 10, sort: 'createdAt,desc' })
  const del = useDeleteCar()
  const [target, setTarget] = useState<MyCarListItem | null>(null)

  return (
    <Container className="py-8">
      <PageHeader title="İlanlarım" description="İlanlarını düzenle, gelen teklifleri yanıtla."
        actions={<Link to="/ilanlarim/yeni" className={buttonStyles('accent')}><PlusCircle className="h-4 w-4" aria-hidden />Yeni ilan</Link>} />

      {isLoading ? <Spinner /> : isError ? <ErrorState error={error} onRetry={refetch} /> : !data?.content.length ? (
        <EmptyState icon={CarIcon} title="Henüz ilanın yok" description="İlk aracını yayınla; fiyatı belirlemek için yapay zekâ önerisini kullanabilirsin."
          action={<Link to="/ilanlarim/yeni" className={buttonStyles('primary')}>İlan ver</Link>} />
      ) : (
        <>
          <ul className="space-y-3">
            {data.content.map((car) => (
              <li key={car.id}>
                <Card className="flex flex-wrap items-center gap-4 p-4">
                  <Link to={`/ilan/${car.id}`} className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100" aria-hidden tabIndex={-1}>
                    {car.primaryImageUrl && <img src={car.primaryImageUrl} alt="" className="h-full w-full object-cover" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/ilan/${car.id}`} className="truncate font-semibold hover:text-brand-700 hover:underline">{carTitle(car)} · {car.year}</Link>
                      {car.status && <CarStatusBadge status={car.status} />}
                    </div>
                    <p className="tabular mt-0.5 font-display text-lg font-extrabold text-brand-800">{formatPrice(car.price)}</p>
                    <p className="text-xs text-muted">{formatKm(car.mileage)} · {car.city} · {timeAgo(car.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/ilanlarim/${car.id}/teklifler`} className={buttonStyles('secondary', 'sm')}><Tag className="h-3.5 w-3.5" aria-hidden />Teklifler</Link>
                    <Link to={`/ilanlarim/${car.id}/duzenle`} className={buttonStyles('secondary', 'sm')}><Pencil className="h-3.5 w-3.5" aria-hidden />Düzenle</Link>
                    <Button size="sm" variant="danger" onClick={() => setTarget(car)} disabled={car.status === 'INACTIVE'}><Trash2 className="h-3.5 w-3.5" aria-hidden />Kaldır</Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!target}
        danger
        title="İlan yayından kaldırılsın mı?"
        description={target ? `${carTitle(target)} ilanı yayından kalkar ve bekleyen teklifler süresi doldu olarak işaretlenir. İlanı daha sonra düzenleyerek tekrar yayına alabilirsin.` : ''}
        confirmLabel="Yayından kaldır"
        loading={del.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && del.mutate(target.id, { onSettled: () => setTarget(null) })}
      />
    </Container>
  )
}
