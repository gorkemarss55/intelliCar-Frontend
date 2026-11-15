import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Inbox, Phone, X } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { OfferStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { useCar } from '@/features/cars/hooks'
import { carTitle } from '@/features/cars/utils'
import { useCarOffers, useRespondToOffer } from '@/features/offers/hooks'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatPrice, fullName, timeAgo } from '@/lib/format'
import type { OfferResponse } from '@/types/api'

export function CarOffersPage() {
  useDocumentTitle('Gelen teklifler')
  const { id = '' } = useParams()
  const [page, setPage] = useState(0)
  const { data: car } = useCar(id)
  const { data, isLoading, isError, error, refetch } = useCarOffers(id, { page, size: 10, sort: 'createdAt,desc' })
  const respond = useRespondToOffer()
  const [pending, setPending] = useState<{ offer: OfferResponse; status: 'ACCEPTED' | 'REJECTED' } | null>(null)

  const accepting = pending?.status === 'ACCEPTED'

  return (
    <Container className="max-w-4xl py-8">
      <Link to="/ilanlarim" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden />İlanlarım</Link>
      <PageHeader title="Gelen teklifler" description={car ? `${carTitle(car)} · ilan fiyatı ${formatPrice(car.price)}` : undefined} />

      {isLoading ? <Spinner /> : isError ? <ErrorState error={error} onRetry={refetch} /> : !data?.content.length ? (
        <EmptyState icon={Inbox} title="Henüz teklif gelmedi" description="Fiyatı piyasa aralığında tutmak ve görsel eklemek teklif sayısını artırır." />
      ) : (
        <>
          <ul className="space-y-3">
            {data.content.map((o) => (
              <li key={o.id}>
                <Card className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tabular font-display text-xl font-extrabold">{formatPrice(o.offeredPrice)}</span>
                        <OfferStatusBadge status={o.status} />
                      </div>
                      {car && <p className="tabular mt-0.5 text-xs text-muted">İlan fiyatının %{Math.round((o.offeredPrice / car.price) * 100)}’i</p>}
                      <p className="mt-2 text-sm font-medium">{fullName(o.buyer)}</p>
                      <a href={`tel:${o.buyer.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"><Phone className="h-3.5 w-3.5" aria-hidden />{o.buyer.phone}</a>
                      {o.note && <p className="mt-2 max-w-prose rounded-lg bg-surface px-3 py-2 text-sm text-muted">“{o.note}”</p>}
                      <p className="mt-2 text-xs text-muted">{timeAgo(o.createdAt)}</p>
                    </div>
                    {o.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button onClick={() => setPending({ offer: o, status: 'ACCEPTED' })}><Check className="h-4 w-4" aria-hidden />Kabul et</Button>
                        <Button variant="danger" onClick={() => setPending({ offer: o, status: 'REJECTED' })}><X className="h-4 w-4" aria-hidden />Reddet</Button>
                      </div>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!pending}
        danger={!accepting}
        title={accepting ? 'Teklifi kabul et' : 'Teklifi reddet'}
        description={pending ? `${fullName(pending.offer.buyer)} kişisinin ${formatPrice(pending.offer.offeredPrice)} teklifini ${accepting ? 'kabul ediyorsun' : 'reddediyorsun'}. Alıcıya e-posta ile bildirilir.` : ''}
        confirmLabel={accepting ? 'Kabul et' : 'Reddet'}
        loading={respond.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => pending && respond.mutate({ id: pending.offer.id, status: pending.status }, { onSettled: () => setPending(null) })}
      />
    </Container>
  )
}
