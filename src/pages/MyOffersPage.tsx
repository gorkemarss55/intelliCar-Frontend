import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { OfferStatusBadge } from '@/components/shared/StatusBadge'
import { buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { useMyOffers } from '@/features/offers/hooks'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatPrice, timeAgo } from '@/lib/format'

export function MyOffersPage() {
  useDocumentTitle('Tekliflerim')
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, error, refetch } = useMyOffers({ page, size: 10, sort: 'createdAt,desc' })

  return (
    <Container className="max-w-4xl py-8">
      <PageHeader title="Tekliflerim" description="Verdiğin tekliflerin durumunu buradan takip et." />
      {isLoading ? <Spinner /> : isError ? <ErrorState error={error} onRetry={refetch} /> : !data?.content.length ? (
        <EmptyState icon={Tag} title="Henüz teklif vermedin" description="Beğendiğin bir ilanın sayfasından satıcıya teklif gönderebilirsin."
          action={<Link to="/ilanlar" className={buttonStyles('primary')}>İlanlara göz at</Link>} />
      ) : (
        <>
          <ul className="space-y-3">
            {data.content.map((o) => (
              <li key={o.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <Link to={`/ilan/${o.carId}`} className="font-semibold hover:text-brand-700 hover:underline">{o.carTitle}</Link>
                    <p className="tabular mt-0.5 font-display text-lg font-extrabold">{formatPrice(o.offeredPrice)}</p>
                    {o.note && <p className="mt-1 text-sm text-muted">“{o.note}”</p>}
                    <p className="mt-1 text-xs text-muted">{timeAgo(o.createdAt)}</p>
                  </div>
                  <OfferStatusBadge status={o.status} />
                </Card>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </Container>
  )
}
