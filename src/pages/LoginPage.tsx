import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Field'
import { useIsAuthenticated, useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginValues } from '@/features/auth/schemas'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function LoginPage() {
  useDocumentTitle('Giriş yap')
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const authed = useIsAuthenticated()
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  if (authed && !login.isPending) return <Navigate to={from} replace />

  return (
    <Container className="max-w-md py-12">
      <Card className="p-6 shadow-panel sm:p-8">
        <h1 className="text-2xl font-extrabold">Giriş yap</h1>
        <p className="mt-1 text-sm text-muted">İlanlarını yönet, teklif ver ve yapay zekâ araçlarını kullan.</p>
        <form onSubmit={handleSubmit((v) => login.mutate(v, { onSuccess: () => navigate(from, { replace: true }) }))} className="mt-6 space-y-4" noValidate>
          <Field label="E-posta" error={errors.email?.message}><Input type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} /></Field>
          <Field label="Şifre" error={errors.password?.message}><Input type="password" autoComplete="current-password" invalid={!!errors.password} {...register('password')} /></Field>
          <Button type="submit" size="lg" className="w-full" loading={login.isPending}>Giriş yap</Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted">Hesabın yok mu? <Link to="/kayit" state={{ from }} className="font-semibold text-brand-700 hover:underline">Kayıt ol</Link></p>
    </Container>
  )
}
