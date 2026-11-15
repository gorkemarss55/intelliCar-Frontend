import { createBrowserRouter, Link, useRouteError, type RouteObject } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { RequireAuth } from '@/components/shared/RequireAuth'
import { Container } from '@/components/shared/Container'
import { Spinner } from '@/components/ui/Spinner'
import { buttonStyles } from '@/components/ui/Button'


const page = <K extends string>(loader: () => Promise<Record<K, React.ComponentType>>, name: K): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => ({ Component: (await loader())[name] }),
})

function RouteError() {
  const error = useRouteError()
  console.error(error)
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl font-extrabold">Sayfa yüklenemedi</h1>
      <p className="mt-2 text-muted">Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi dene.</p>
      <Link to="/" className={buttonStyles('primary', 'md', 'mt-6')}>Ana sayfaya dön</Link>
    </Container>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <Spinner className="min-h-screen" />,
    children: [
      { index: true, ...page(() => import('@/pages/HomePage'), 'HomePage') },
      { path: 'ilanlar', ...page(() => import('@/pages/ListingsPage'), 'ListingsPage') },
      { path: 'ilan/:id', ...page(() => import('@/pages/CarDetailPage'), 'CarDetailPage') },
      { path: 'giris', ...page(() => import('@/pages/LoginPage'), 'LoginPage') },
      { path: 'kayit', ...page(() => import('@/pages/RegisterPage'), 'RegisterPage') },
      { path: 'favoriler', ...page(() => import('@/pages/FavoritesPage'), 'FavoritesPage') },
      { path: 'hakkimizda', ...page(() => import('@/pages/AboutPage'), 'AboutPage') },
      { path: 'ai/oneri', ...page(() => import('@/pages/RecommendPage'), 'RecommendPage') },
      { path: 'ai/fiyat', ...page(() => import('@/pages/EstimatePage'), 'EstimatePage') },
      {
        element: <RequireAuth />,
        children: [
          { path: 'profil', ...page(() => import('@/pages/ProfilePage'), 'ProfilePage') },
          { path: 'ilanlarim', ...page(() => import('@/pages/MyCarsPage'), 'MyCarsPage') },
          { path: 'ilanlarim/yeni', ...page(() => import('@/pages/CreateCarPage'), 'CreateCarPage') },
          { path: 'ilanlarim/:id/duzenle', ...page(() => import('@/pages/EditCarPage'), 'EditCarPage') },
          { path: 'ilanlarim/:id/teklifler', ...page(() => import('@/pages/CarOffersPage'), 'CarOffersPage') },
          { path: 'tekliflerim', ...page(() => import('@/pages/MyOffersPage'), 'MyOffersPage') },
        ],
      },
      { path: '*', ...page(() => import('@/pages/NotFoundPage'), 'NotFoundPage') },
    ],
  },
])
