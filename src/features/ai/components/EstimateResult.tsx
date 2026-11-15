import { Link } from 'react-router-dom'
import { Info, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatKm, formatPrice } from '@/lib/format'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Confidence, PriceEstimate } from '@/types/api'

const CONFIDENCE: Record<Confidence, { label: string; tone: BadgeTone; hint: string }> = {
  LOW: { label: 'Düşük güven', tone: 'red', hint: 'Aynı modelden az ilan var.' },
  MEDIUM: { label: 'Orta güven', tone: 'amber', hint: 'Aynı modelden birkaç ilan var.' },
  HIGH: { label: 'Yüksek güven', tone: 'green', hint: 'Aynı modelden çok sayıda ilan var.' },
}


function RangeBar({ e }: { e: PriceEstimate }) {
  const lo = Math.min(e.minPrice, e.market.min)
  const hi = Math.max(e.maxPrice, e.market.max)
  const pct = (v: number) => (hi === lo ? 50 : ((v - lo) / (hi - lo)) * 100)
  return (
    <div className="mt-6">
      <div className="relative h-3 rounded-full bg-surface">
        <div className="absolute inset-y-0 rounded-full bg-brand-200" style={{ left: `${pct(e.minPrice)}%`, width: `${Math.max(pct(e.maxPrice) - pct(e.minPrice), 1)}%` }} />
        <div className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded bg-ink/40" style={{ left: `${pct(e.market.median)}%` }} title="Piyasa medyanı" />
        <div className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-accent-500 shadow" style={{ left: `${pct(e.suggestedPrice)}%` }} title="Önerilen fiyat" />
      </div>
      <div className="tabular mt-2 flex justify-between text-xs text-muted">
        <span>Piyasada en düşük<br /><b className="text-ink">{formatPrice(e.market.min)}</b></span>
        <span className="text-right">Piyasada en yüksek<br /><b className="text-ink">{formatPrice(e.market.max)}</b></span>
      </div>
      <p className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-accent-500" />Önerilen</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1 rounded bg-ink/40" />Medyan ({formatPrice(e.market.median)})</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-brand-200" />Önerilen aralık</span>
      </p>
    </div>
  )
}

export function EstimateResult({ estimate: e, showComparables = true }: { estimate: PriceEstimate; showComparables?: boolean }) {
  const conf = CONFIDENCE[e.confidence]
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Önerilen satış fiyatı</p>
            <p className="tabular font-display text-4xl font-extrabold text-brand-800 sm:text-5xl">{formatPrice(e.suggestedPrice)}</p>
            <p className="tabular mt-1 text-muted">Makul aralık: {formatPrice(e.minPrice)} – {formatPrice(e.maxPrice)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone={conf.tone}>{conf.label}</Badge>
            {e.aiAssisted ? (
              <Badge tone="amber"><Sparkles className="h-3 w-3" aria-hidden />Yapay zekâ destekli</Badge>
            ) : (
              <Badge>Yalnızca piyasa istatistiği</Badge>
            )}
          </div>
        </div>

        <RangeBar e={e} />

        {e.explanation && <p className="mt-6 max-w-3xl">{e.explanation}</p>}
        {e.factors.length > 0 && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {e.factors.map((f) => (
              <li key={f} className="flex gap-2 rounded-lg bg-surface px-3 py-2 text-sm"><Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />{f}</li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-xs text-muted">{conf.hint} {e.disclaimer}</p>
      </Card>

      {showComparables && e.comparables.length > 0 && (
        <Card className="p-5">
          <h2 className="text-lg font-bold">Karşılaştırılan ilanlar</h2>
          <p className="mt-0.5 text-sm text-muted">{e.market.comparablesCount} benzer ilan, {e.market.sameModelCount} tanesi aynı model.</p>
          <div className="-mx-5 mt-4 overflow-x-auto px-5">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-muted">
                <tr><th className="py-2 font-medium">Araç</th><th className="font-medium">Yıl</th><th className="font-medium">Kilometre</th><th className="font-medium">Şehir</th><th className="text-right font-medium">Fiyat</th></tr>
              </thead>
              <tbody>
                {e.comparables.map((c) => (
                  <tr key={c.carId} className={cn('border-t border-line')}>
                    <td className="py-2.5 font-medium"><Link to={`/ilan/${c.carId}`} className="hover:text-brand-700 hover:underline">{c.brand} {c.model}</Link></td>
                    <td>{c.year}</td><td className="tabular">{formatKm(c.mileage)}</td><td>{c.city}</td>
                    <td className="tabular text-right font-semibold">{formatPrice(c.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
