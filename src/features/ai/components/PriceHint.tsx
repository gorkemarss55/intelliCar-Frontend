import { Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import type { PriceEstimateRequest } from '@/types/api'
import { useEstimatePrice } from '../hooks'

interface PriceHintProps {
  /** Form o an eksik/geçersizse null döner. */
  buildRequest: () => PriceEstimateRequest | null
  onApply: (price: number) => void
}

/** İlan verirken fiyat alanının altında, tek tıkla piyasa fiyatı önerir. */
export function PriceHint({ buildRequest, onApply }: PriceHintProps) {
  const estimate = useEstimatePrice()
  const run = () => {
    const req = buildRequest()
    if (req) estimate.mutate(req)
  }

  return (
    <div className="rounded-lg border border-accent-300 bg-accent-300/10 p-3 text-sm">
      {estimate.data ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>
            Önerilen: <b className="tabular">{formatPrice(estimate.data.suggestedPrice)}</b>
            <span className="tabular text-muted"> ({formatPrice(estimate.data.minPrice)} – {formatPrice(estimate.data.maxPrice)})</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="accent" onClick={() => onApply(estimate.data!.suggestedPrice)}>Bu fiyatı kullan</Button>
            <Button size="sm" variant="ghost" onClick={run} loading={estimate.isPending}>Yenile</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted">Fiyattan emin değil misin? Benzer ilanlara göre hesaplayalım.</p>
          <Button size="sm" variant="accent" onClick={run} loading={estimate.isPending}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Fiyat öner
          </Button>
        </div>
      )}
    </div>
  )
}
