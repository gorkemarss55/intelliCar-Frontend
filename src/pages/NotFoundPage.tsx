import { Link } from 'react-router-dom'
import { Container } from '@/components/shared/Container'
import { buttonStyles } from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Sayfa bulunamadı')
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-700">404</p>
      <h1 className="mt-3 text-2xl font-extrabold">Aradığın sayfa bulunamadı</h1>
      <p className="mt-2 text-muted">Adres yanlış olabilir ya da sayfa kaldırılmış olabilir.</p>
      <Link to="/ilanlar" className={buttonStyles('primary', 'md', 'mt-6')}>İlanlara göz at</Link>
    </Container>
  )
}
