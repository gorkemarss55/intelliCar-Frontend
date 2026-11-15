import { Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

export const tl = (n) => n == null ? '-' : new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n)
export const FUEL = { GASOLINE: 'Benzin', DIESEL: 'Dizel', HYBRID: 'Hibrit', ELECTRIC: 'Elektrik' }
export const TRANS = { MANUAL: 'Manuel', AUTOMATIC: 'Otomatik' }
export const STATUS = { ACTIVE: 'Yayında', PENDING_REVIEW: 'İncelemede', SOLD: 'Satıldı', INACTIVE: 'Pasif', PENDING: 'Beklemede', ACCEPTED: 'Kabul edildi', REJECTED: 'Reddedildi', EXPIRED: 'Süresi doldu' }

export function Navbar() {
  const { user, logout } = useAuth()
  const link = ({ isActive }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-soft text-brand-dark' : 'text-steel hover:text-ink'}`
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3">
        <NavLink to="/" end className={link}>İlanlar</NavLink>
        <NavLink to="/ai/oneri" className={link}>Bütçeme göre öner</NavLink>
        <NavLink to="/ai/fiyat" className={link}>Aracım ne kadar?</NavLink>
        <div className="ml-auto flex items-center gap-1">
          {user ? (<>
            <NavLink to="/ilanlarim" className={link}>İlanlarım</NavLink>
            <NavLink to="/tekliflerim" className={link}>Tekliflerim</NavLink>
            <button onClick={logout} className="btn-ghost !py-2">Çıkış ({user.email.split('@')[0]})</button>
          </>) : (<>
            <Link to="/giris" className="btn-ghost !py-2">Giriş yap</Link>
            <Link to="/kayit" className="btn !py-2">Kayıt ol</Link>
          </>)}
        </div>
      </div>
    </header>
  )
}

export function Protected({ children }) {
  const { user } = useAuth(); const loc = useLocation()
  return user ? children : <Navigate to="/giris" state={{ from: loc.pathname }} replace />
}

export const Spinner = () => <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>
export const Empty = ({ children }) => <div className="card p-10 text-center text-steel">{children}</div>
export const Title = ({ children, sub }) => <div className="mb-6"><h1 className="text-2xl font-extrabold tracking-tight">{children}</h1>{sub && <p className="mt-1 text-steel">{sub}</p>}</div>

export function Field({ label, children }) { return <label className="block"><span className="label">{label}</span>{children}</label> }
export function Select({ value, onChange, options, placeholder }) {
  return <select className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
    {placeholder && <option value="">{placeholder}</option>}
    {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
  </select>
}

export function Badge({ children, tone = 'slate' }) {
  const t = { slate: 'bg-slate-100 text-slate-700', green: 'bg-emerald-50 text-emerald-700', red: 'bg-rose-50 text-rose-700', amber: 'bg-amber-50 text-amber-700' }[tone]
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>
}
export const statusTone = (s) => ({ ACTIVE: 'green', ACCEPTED: 'green', SOLD: 'amber', PENDING: 'amber', PENDING_REVIEW: 'amber', REJECTED: 'red', EXPIRED: 'red', INACTIVE: 'red' }[s] || 'slate')

export function Pager({ page, onChange }) {
  if (!page || page.totalPages <= 1) return null
  return <div className="mt-6 flex items-center justify-center gap-3">
    <button className="btn-ghost" disabled={page.number === 0} onClick={() => onChange(page.number - 1)}>Önceki</button>
    <span className="text-sm text-steel">{page.number + 1} / {page.totalPages}</span>
    <button className="btn-ghost" disabled={page.number + 1 >= page.totalPages} onClick={() => onChange(page.number + 1)}>Sonraki</button>
  </div>
}

export function CarCard({ car, extra }) {
  return (
    <Link to={`/ilan/${car.id ?? car.carId}`} className="card group block overflow-hidden transition hover:border-brand">
      <div className="aspect-[16/10] bg-slate-100">
        {car.primaryImageUrl ? <img src={car.primaryImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          : <div className="flex h-full items-center justify-center text-sm text-steel">Görsel yok</div>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold">{car.brand} {car.model}</h3>
          <span className="whitespace-nowrap font-extrabold text-brand-dark">{tl(car.price)}</span>
        </div>
        <p className="mt-1 text-sm text-steel">{car.year} · {Number(car.mileage).toLocaleString('tr-TR')} km · {FUEL[car.fuelType]} · {TRANS[car.transmission]}</p>
        <p className="text-sm text-steel">{car.city}</p>
        {extra}
      </div>
    </Link>
  )
}
