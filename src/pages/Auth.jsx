import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../auth'
import { errMsg } from '../api'
import { Field } from '../ui'

function Shell({ title, children, foot }) {
  return <div className="mx-auto max-w-md"><div className="card p-6"><h1 className="mb-5 text-2xl font-extrabold">{title}</h1>{children}</div><p className="mt-4 text-center text-sm text-steel">{foot}</p></div>
}

export function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation()
  const [f, setF] = useState({ email: '', password: '' }); const [busy, setBusy] = useState(false)
  const submit = async (e) => { e.preventDefault(); setBusy(true)
    try { await login(f); nav(loc.state?.from || '/') } catch (x) { toast.error(errMsg(x)) } finally { setBusy(false) } }
  return <Shell title="Giriş yap" foot={<>Hesabın yok mu? <Link to="/kayit" className="font-semibold text-brand">Kayıt ol</Link></>}>
    <form onSubmit={submit} className="space-y-4">
      <Field label="E-posta"><input type="email" required className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
      <Field label="Şifre"><input type="password" required className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
      <button className="btn w-full" disabled={busy}>{busy ? 'Giriş yapılıyor…' : 'Giriş yap'}</button>
    </form></Shell>
}

export function Register() {
  const { register } = useAuth(); const nav = useNavigate()
  // Hesap türü artık sorulmuyor. Backend bu alanı zorunlu tuttuğu için sabit BUYER gönderilir;
  // her kullanıcı hem ilan verebilir hem teklif verebilir (backend'de rol kontrolü yok).
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' }); const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => { e.preventDefault(); setBusy(true)
    try { await register({ ...f, role: 'BUYER' }); toast.success('Hesabın oluşturuldu'); nav('/') } catch (x) { toast.error(errMsg(x)) } finally { setBusy(false) } }
  return <Shell title="Hesap oluştur" foot={<>Zaten üye misin? <Link to="/giris" className="font-semibold text-brand">Giriş yap</Link></>}>
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ad"><input required className="input" value={f.firstName} onChange={set('firstName')} /></Field>
        <Field label="Soyad"><input required className="input" value={f.lastName} onChange={set('lastName')} /></Field>
      </div>
      <Field label="E-posta"><input type="email" required className="input" value={f.email} onChange={set('email')} /></Field>
      <Field label="Telefon"><input required className="input" value={f.phone} onChange={set('phone')} /></Field>
      <Field label="Şifre (en az 6 karakter)"><input type="password" minLength={6} required className="input" value={f.password} onChange={set('password')} /></Field>
      <button className="btn w-full" disabled={busy}>{busy ? 'Oluşturuluyor…' : 'Kayıt ol'}</button>
    </form></Shell>
}
