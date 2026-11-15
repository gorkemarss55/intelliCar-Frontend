import { AlertTriangle } from 'lucide-react'
import { getErrorMessage } from '@/lib/error'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Bir sorun oluştu"
      description={getErrorMessage(error)}
      action={onRetry && <Button variant="secondary" onClick={onRetry}>Tekrar dene</Button>}
    />
  )
}
