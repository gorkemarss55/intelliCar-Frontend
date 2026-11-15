import { useState } from 'react'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Modal } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Field'
import { CarCard, CarCardSkeleton, CarGrid } from '@/features/cars/components/CarCard'
import { CarFilters } from '@/features/cars/components/CarFilters'
import { useCars } from '@/features/cars/hooks'
import { useListingParams, PAGE_SIZE, type ListingFilters } from '@/features/cars/useListingParams'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { FUEL_LABELS, SORT_OPTIONS, TRANSMISSION_LABELS } from '@/lib/constants'
import { formatNumber } from '@/lib/format'

const chipLabel = (key: keyof ListingFilters, f: ListingFilters): string => {
  const v = f[key]
  switch (key) {
    case 'minPrice': return `En az ${formatNumber(Number(v))} TL`
    case 'maxPrice': return `En çok ${formatNumber(Number(v))} TL`
    case 'minYear': return `${v} ve sonrası`
    case 'maxYear': return `${v} ve öncesi`
    case 'fuelType': return FUEL_LABELS[v as keyof typeof FUEL_LABELS]
    case 'transmission': return TRANSMISSION_LABELS[v as keyof typeof TRANSMISSION_LABELS]
    default: return v
  }
}

export function ListingsPage() {
  useDocumentTitle('İlanlar')
  const lp = useListingParams()
  const { data, isLoading, isError, error, refetch, isPlaceholderData } = useCars(lp.apiParams)
  const [sheet, setSheet] = useState(false)
  const filterKey = JSON.stringify(lp.filters)
  const activeKeys = (Object.keys(lp.filters) as (keyof ListingFilters)[]).filter((k) => lp.filters[k] !== '')

  return (
    <Container className="py-8">
      <PageHeader
        title="Araç ilanları"
        description={data ? `${formatNumber(data.totalElements)} ilan bulundu` : 'İlanlar yükleniyor…'}
        actions={
          <>
            <Button variant="secondary" className="lg:hidden" onClick={() => setSheet(true)}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filtreler{lp.activeCount > 0 && ` (${lp.activeCount})`}
            </Button>
            <Select aria-label="Sırala" options={SORT_OPTIONS} value={lp.sort} onChange={(e) => lp.setSort(e.target.value)} className="w-52" />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden lg:block">
          <Card className="sticky top-24 p-5">
            <h2 className="mb-4 text-base font-bold">Filtrele</h2>
            <CarFilters key={filterKey} value={lp.filters} onApply={lp.setFilters} onReset={lp.reset} />
          </Card>
        </aside>

        <section aria-live="polite">
          {activeKeys.length > 0 && (
            <ul className="mb-4 flex flex-wrap items-center gap-2">
              {activeKeys.map((k) => (
                <li key={k}>
                  <button onClick={() => lp.removeFilter(k)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-sm hover:border-brand-300" aria-label={`${chipLabel(k, lp.filters)} filtresini kaldır`}>
                    {chipLabel(k, lp.filters)} <X className="h-3.5 w-3.5 text-muted" aria-hidden />
                  </button>
                </li>
              ))}
              <li><button onClick={lp.reset} className="px-2 text-sm font-medium text-brand-700 hover:underline">Tümünü temizle</button></li>
            </ul>
          )}

          {isLoading ? (
            <CarGrid>{Array.from({ length: 8 }, (_, i) => <CarCardSkeleton key={i} />)}</CarGrid>
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : !data?.content.length ? (
            <EmptyState icon={SearchX} title="Bu kriterlere uygun ilan yok" description="Filtreleri gevşetmeyi ya da farklı bir marka denemeyi dene."
              action={lp.activeCount > 0 ? <Button variant="secondary" onClick={lp.reset}>Filtreleri temizle</Button> : undefined} />
          ) : (
            <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.content.map((c) => <CarCard key={c.id} car={c} />)}
              </div>
              <Pagination page={lp.page} totalPages={Math.max(data.totalPages, Math.ceil(data.totalElements / PAGE_SIZE))} onChange={lp.setPage} />
            </div>
          )}
        </section>
      </div>

      <Modal open={sheet} onClose={() => setSheet(false)} title="Filtrele" variant="sheet">
        <CarFilters key={filterKey} value={lp.filters} onApply={(f) => { lp.setFilters(f); setSheet(false) }} onReset={() => { lp.reset(); setSheet(false) }} />
      </Modal>
    </Container>
  )
}
