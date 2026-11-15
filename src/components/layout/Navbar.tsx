import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown, Heart, LogOut, Menu as MenuIcon, PlusCircle, Sparkles, Tag, User, X, Car as CarIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/shared/Container'
import { Logo } from '@/components/shared/Logo'
import { buttonStyles } from '@/components/ui/Button'
import { useCurrentUser } from '@/features/auth/store'
import { useLogout } from '@/features/auth/hooks'
import { useFavorites } from '@/features/favorites/store'

const NAV = [
  { to: '/ilanlar', label: 'İlanlar' },
  { to: '/ai/oneri', label: 'Bütçeme göre öner', ai: true },
  { to: '/ai/fiyat', label: 'Aracım ne kadar?', ai: true },
]

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn('inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-brand-50 text-brand-800' : 'text-muted hover:text-ink')

const menuItem = 'flex w-full items-center gap-2 px-3 py-2 text-sm text-ink data-[focus]:bg-surface'

export function Navbar() {
  const user = useCurrentUser()
  const logout = useLogout()
  const favCount = useFavorites((s) => s.items.length)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-2">
      <Logo className="mr-4" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navLink}>
              {n.ai && <Sparkles className="h-3.5 w-3.5 text-accent-600" aria-hidden />}
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/favoriler" className="relative rounded-lg p-2 text-muted hover:bg-surface hover:text-ink" aria-label={`Favoriler (${favCount})`}>
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-ink">{favCount}</span>
            )}
          </Link>

          <Link to="/ilanlarim/yeni" className={buttonStyles('accent', 'md', 'hidden sm:inline-flex')}>
            <PlusCircle className="h-4 w-4" aria-hidden /> İlan ver
          </Link>

          {user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white pl-2 pr-2.5 text-sm font-medium hover:bg-surface">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold uppercase text-white">{user.email[0]}</span>
                <span className="hidden max-w-32 truncate sm:block">{user.email.split('@')[0]}</span>
                <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
              </MenuButton>
              <MenuItems anchor="bottom end" className="z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-panel focus:outline-none">
                <MenuItem><Link to="/profil" className={menuItem}><User className="h-4 w-4 text-muted" />Profilim</Link></MenuItem>
                <MenuItem><Link to="/ilanlarim" className={menuItem}><CarIcon className="h-4 w-4 text-muted" />İlanlarım</Link></MenuItem>
                <MenuItem><Link to="/tekliflerim" className={menuItem}><Tag className="h-4 w-4 text-muted" />Tekliflerim</Link></MenuItem>
                <div className="my-1 border-t border-line" />
                <MenuItem><button onClick={logout} className={menuItem}><LogOut className="h-4 w-4 text-muted" />Çıkış yap</button></MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/giris" className={buttonStyles('ghost')}>Giriş yap</Link>
              <Link to="/kayit" className={buttonStyles('primary')}>Kayıt ol</Link>
            </div>
          )}

          <button className="rounded-lg p-2 text-ink hover:bg-surface lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menüyü aç/kapat">
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={navLink}>
                {n.ai && <Sparkles className="h-3.5 w-3.5 text-accent-600" aria-hidden />}
                {n.label}
              </NavLink>
            ))}
            <Link to="/ilanlarim/yeni" className={buttonStyles('accent', 'md', 'mt-2')}><PlusCircle className="h-4 w-4" /> İlan ver</Link>
            {!user && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/giris" className={buttonStyles('secondary')}>Giriş yap</Link>
                <Link to="/kayit" className={buttonStyles('primary')}>Kayıt ol</Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  )
}
