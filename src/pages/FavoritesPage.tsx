import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button, buttonStyles } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CarCard, CarGrid } from '@/features/cars/components/CarCard'
import { useFavorites } from '@/features/favorites/store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function FavoritesPage() {
  useDocumentTitle('Favorilerim')
  const items = useFavorites((s) => s.items)
  const clear = useFavorites((s) => s.clear)

  return (
    <Container className="py-8">
      <PageHeader
        title="Favorilerim"
        description="Beğendiğin ilanlar bu tarayıcıda saklanır. Fiyat ve durum için ilanın sayfasına bak."
        actions={items.length > 0 ? <Button variant="secondary" onClick={clear}><Trash2 className="h-4 w-4" aria-hidden />Tümünü temizle</Button> : undefined}
      />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Henüz favorin yok" description="İlanlardaki kalp simgesine dokunarak buraya ekleyebilirsin."
          action={<Link to="/ilanlar" className={buttonStyles('primary')}>İlanlara göz at</Link>} />
      ) : (
        <CarGrid>{items.map((c) => <CarCard key={c.id} car={c} />)}</CarGrid>
      )}
    </Container>
  )
}
