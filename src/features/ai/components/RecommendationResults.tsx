import { Check, Minus, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CarCard, CarGrid } from '@/features/cars/components/CarCard'
import type { BudgetRecommendationResponse, RecommendedCar } from '@/types/api'
import { SearchX } from 'lucide-react'

function ScoreBar({ score }: { score: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-brand-800">Uyum puanı</span>
        <span className="tabular font-bold">{score}<span className="text-muted">/100</span></span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-accent-400" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function Insight({ rec }: { rec: RecommendedCar }) {
  return (
    <div className="space-y-3 text-sm">
      <ScoreBar score={rec.score} />
      <p className="text-muted">{rec.reason}</p>
      {rec.pros.length > 0 && (
        <ul className="space-y-1">
          {rec.pros.map((p) => <li key={p} className="flex gap-2 text-emerald-800"><Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{p}</li>)}
        </ul>
      )}
      {rec.cons.length > 0 && (
        <ul className="space-y-1">
          {rec.cons.map((c) => <li key={c} className="flex gap-2 text-red-800"><Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{c}</li>)}
        </ul>
      )}
    </div>
  )
}

export function RecommendationResults({ data }: { data: BudgetRecommendationResponse }) {
  return (
    <div className="space-y-6">
      <Card className="border-accent-300 bg-gradient-to-br from-accent-300/20 to-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent-600">
          <Sparkles className="h-4 w-4" aria-hidden /> {data.candidatesAnalyzed} ilan incelendi
        </div>
        <p className="mt-2 max-w-3xl">{data.summary}</p>
      </Card>

      {data.recommendations.length === 0 ? (
        <EmptyState icon={SearchX} title="Uygun ilan bulunamadı" description="Bütçeni artırmayı ya da filtreleri gevşetmeyi dene." />
      ) : (
        <CarGrid>
          {data.recommendations.map((r) => (
            <CarCard
              key={r.carId}
              car={{ ...r, id: r.carId }}
              badge={<Badge tone="blue" className="bg-white">#{r.rank} öneri</Badge>}
              footer={<Insight rec={r} />}
            />
          ))}
        </CarGrid>
      )}
    </div>
  )
}
