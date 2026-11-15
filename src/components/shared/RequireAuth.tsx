import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from '@/features/auth/hooks'


export function RequireAuth() {
  const authed = useIsAuthenticated()
  const location = useLocation()
  if (!authed) return <Navigate to="/giris" state={{ from: location.pathname + location.search }} replace />
  return <Outlet />
}
