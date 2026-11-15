import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { CarCreateForm } from '@/features/cars/components/CarCreateForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function CreateCarPage() {
  useDocumentTitle('İlan ver')
  return (
    <Container className="max-w-4xl py-8">
      <PageHeader title="İlan ver" description="Aracının bilgilerini gir. Ne kadar ayrıntı verirsen o kadar çok teklif alırsın." />
      <CarCreateForm />
    </Container>
  )
}
