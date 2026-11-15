import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/features/auth/hooks'

/** Giriş yapılmamışsa login'e yönlendirir; giriş sonrası kaldığı sayfaya döner. */
export function RequireAuth() {
  const authed = useIsAuthenticated()
  const location = useLocation()
  if (!authed) return <Navigate to="/giris" state={{ from: location.pathname + location.search }} replace />
  return <Outlet />
}
