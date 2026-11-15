import { Link } from 'react-router-dom'
import { Container } from '@/components/shared/Container'

const link = 'text-sm text-muted hover:text-ink hover:underline'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <Container className="grid gap-8 py-10 sm:grid-cols-3">
        <nav className="flex flex-col gap-2" aria-label="Keşfet">
          <span className="text-sm font-semibold">Keşfet</span>
          <Link to="/ilanlar" className={link}>Tüm ilanlar</Link>
          <Link to="/ai/oneri" className={link}>Bütçeme göre öner</Link>
          <Link to="/ai/fiyat" className={link}>Aracım ne kadar?</Link>
        </nav>
        <nav className="flex flex-col gap-2" aria-label="Hesap">
          <span className="text-sm font-semibold">Hesabım</span>
          <Link to="/ilanlarim" className={link}>İlanlarım</Link>
          <Link to="/tekliflerim" className={link}>Tekliflerim</Link>
          <Link to="/favoriler" className={link}>Favorilerim</Link>
        </nav>
        <nav className="flex flex-col gap-2" aria-label="Kurumsal">
          <span className="text-sm font-semibold">Kurumsal</span>
          <Link to="/hakkimizda" className={link}>Hakkımızda</Link>
        </nav>
      </Container>
      <div className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} intelliCar</div>
    </footer>
  )
}
