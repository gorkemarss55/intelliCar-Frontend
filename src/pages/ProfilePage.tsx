import { LogOut, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useLogout, useProfile } from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ROLE_LABELS } from '@/lib/constants'
import { formatDate, fullName } from '@/lib/format'

export function ProfilePage() {
  useDocumentTitle('Profilim')
  const { data: user, isLoading, isError, error, refetch } = useProfile()
  const logout = useLogout()

  return (
    <Container className="max-w-2xl py-8">
      <PageHeader title="Profilim" />
      {isLoading ? <Spinner /> : isError || !user ? <ErrorState error={error} onRetry={refetch} /> : (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 font-display text-xl font-extrabold uppercase text-white">{user.firstName[0]}{user.lastName[0]}</span>
            <div>
              <h2 className="text-xl font-extrabold">{fullName(user)}</h2>
              <p className="text-sm text-muted">{formatDate(user.createdAt)} tarihinden beri üye</p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted" aria-hidden /><dt className="sr-only">E-posta</dt><dd>{user.email}</dd></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted" aria-hidden /><dt className="sr-only">Telefon</dt><dd>{user.phone}</dd></div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-muted" aria-hidden /><dt className="sr-only">Hesap türü</dt><dd>{ROLE_LABELS[user.role]}</dd></div>
          </dl>
          <Button variant="secondary" className="mt-6" onClick={logout}><LogOut className="h-4 w-4" aria-hidden />Çıkış yap</Button>
        </Card>
      )}
    </Container>
  )
}
