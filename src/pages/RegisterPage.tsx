import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select } from '@/components/ui/Field'
import { useIsAuthenticated, useRegister } from '@/features/auth/hooks'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const ROLE_OPTIONS = [
  { value: 'BUYER', label: 'Alıcı: araç arıyorum' },
  { value: 'SELLER', label: 'Satıcı: araç satacağım' },
]

export function RegisterPage() {
  useDocumentTitle('Kayıt ol')
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const authed = useIsAuthenticated()
  const registerUser = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'BUYER' },
  })

  if (authed && !registerUser.isPending && !registerUser.isSuccess) return <Navigate to={from} replace />

  const onSubmit = (v: RegisterValues) =>
    registerUser.mutate(v, {
      onSuccess: () => {
        toast.success('Hesabın oluşturuldu')
        navigate(from, { replace: true })
      },
    })

  return (
    <Container className="max-w-lg py-12">
      <Card className="p-6 shadow-panel sm:p-8">
        <h1 className="text-2xl font-extrabold">Hesap oluştur</h1>
        <p className="mt-1 text-sm text-muted">Birkaç bilgiyle başla. Hesap türünü istediğin zaman kullanmaya devam edebilirsin.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad" error={errors.firstName?.message}><Input autoComplete="given-name" invalid={!!errors.firstName} {...register('firstName')} /></Field>
            <Field label="Soyad" error={errors.lastName?.message}><Input autoComplete="family-name" invalid={!!errors.lastName} {...register('lastName')} /></Field>
          </div>
          <Field label="E-posta" error={errors.email?.message}><Input type="email" autoComplete="email" invalid={!!errors.email} {...register('email')} /></Field>
          <Field label="Telefon" error={errors.phone?.message} hint="Alıcılar seni bu numaradan arar."><Input type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" invalid={!!errors.phone} {...register('phone')} /></Field>
          <Field label="Şifre" error={errors.password?.message} hint="En az 6 karakter."><Input type="password" autoComplete="new-password" invalid={!!errors.password} {...register('password')} /></Field>
      
          <Button type="submit" size="lg" className="w-full" loading={registerUser.isPending}>Kayıt ol</Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-muted">Zaten üye misin? <Link to="/giris" state={{ from }} className="font-semibold text-brand-700 hover:underline">Giriş yap</Link></p>
    </Container>
  )
}
