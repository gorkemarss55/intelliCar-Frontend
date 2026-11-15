import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { RecommendForm } from '@/features/ai/components/RecommendForm'
import { RecommendationResults } from '@/features/ai/components/RecommendationResults'
import { useRecommend } from '@/features/ai/hooks'
import { useElapsed } from '@/hooks/useElapsed'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CarCardSkeleton, CarGrid } from '@/features/cars/components/CarCard'
import { useIsAuthenticated } from '@/features/auth/hooks'
import { Link } from 'react-router-dom'
import { buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function RecommendPage() {
  useDocumentTitle('Bütçeme göre araç öner')
  const authed = useIsAuthenticated()
  const recommend = useRecommend()
  const elapsed = useElapsed(recommend.isPending)

  return (
    <Container className="py-8">
      <PageHeader title="Bütçeme göre araç öner" description="Bütçeni ve beklentini yaz. Yapay zekâ yalnızca platformdaki gerçek ilanlar arasından en uygunları sıralar." />
      {!authed ? (
        <Card className="p-8 text-center">
          <p className="text-muted">Bu özelliği kullanmak için giriş yapmalısın.</p>
          <Link to="/giris" state={{ from: '/ai/oneri' }} className={buttonStyles('primary', 'md', 'mt-4')}>Giriş yap</Link>
        </Card>
      ) : (
        <div className="space-y-8">
          <RecommendForm loading={recommend.isPending} onSubmit={(req) => recommend.mutate(req)} />
          {recommend.isPending && (
            <div aria-live="polite">
              <p className="mb-4 text-sm text-muted">İlanlar inceleniyor… {elapsed} sn. Genellikle 10-30 saniye sürer, 60 saniyede yanıt gelmezse istek iptal edilir.</p>
              <CarGrid>{Array.from({ length: 4 }, (_, i) => <CarCardSkeleton key={i} />)}</CarGrid>
            </div>
          )}
          {recommend.data && !recommend.isPending && <RecommendationResults data={recommend.data} />}
        </div>
      )}
    </Container>
  )
}
