import { Link } from 'react-router-dom'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Spinner'
import { EstimateForm } from '@/features/ai/components/EstimateForm'
import { EstimateResult } from '@/features/ai/components/EstimateResult'
import { useEstimatePrice } from '@/features/ai/hooks'
import { useElapsed } from '@/hooks/useElapsed'
import { useIsAuthenticated } from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function EstimatePage() {
  useDocumentTitle('Aracım ne kadar eder?')
  const authed = useIsAuthenticated()
  const estimate = useEstimatePrice()
  const elapsed = useElapsed(estimate.isPending)

  return (
    <Container className="py-8">
      <PageHeader title="Aracım ne kadar eder?" description="Aynı markadaki ilanlara bakarak satış fiyat aralığını hesaplarız. Fiyat aralığı gerçek ilan verilerine dayanır." />
      {!authed ? (
        <Card className="p-8 text-center">
          <p className="text-muted">Bu özelliği kullanmak için giriş yapmalısın.</p>
          <Link to="/giris" state={{ from: '/ai/fiyat' }} className={buttonStyles('primary', 'md', 'mt-4')}>Giriş yap</Link>
        </Card>
      ) : (
        <div className="space-y-8">
          <EstimateForm loading={estimate.isPending} onSubmit={(req) => estimate.mutate(req)} />
          {estimate.isPending && (
            <div aria-live="polite">
              <p className="mb-3 text-sm text-muted">Fiyat hesaplanıyor… {elapsed} sn. Genellikle 10-30 saniye sürer, 60 saniyede yanıt gelmezse istek iptal edilir.</p>
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
          )}
          {estimate.data && !estimate.isPending && <EstimateResult estimate={estimate.data} />}
        </div>
      )}
    </Container>
  )
}
