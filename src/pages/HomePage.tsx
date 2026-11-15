import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calculator, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { CitySelect } from '@/components/shared/CitySelect'
import { Container } from '@/components/shared/Container'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Field, Select } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import { ErrorState } from '@/components/ui/ErrorState'
import { CarCard, CarCardSkeleton, CarGrid } from '@/features/cars/components/CarCard'
import { useCars } from '@/features/cars/hooks'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CAR_BRANDS } from '@/lib/carCatalog'

function Hero() {
  const navigate = useNavigate()
  const [q, setQ] = useState({ brand: '', city: '', maxPrice: '' })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    Object.entries(q).forEach(([k, v]) => v.trim() && sp.set(k, v.trim()))
    navigate(`/ilanlar?${sp}`)
  }

  return (
    <section className="bg-brand-900 text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl">Aradığın araç, doğru fiyatla burada.</h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100">
            Gerçek ilanlar arasında ara. Bütçeni söyle, yapay zekâ sana uygun olanları sıralasın. Satacaksan piyasaya göre fiyatını hesaplasın.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-400" aria-hidden />Fiyatlar ilan verilerinden hesaplanır</li>
            <li className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent-400" aria-hidden />Önerilen araçlar yalnızca gerçek ilanlardır</li>
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-white p-5 text-ink shadow-panel sm:p-6">
          <h2 className="text-lg font-bold">İlan ara</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Marka"><Select options={CAR_BRANDS.map((b) => ({ value: b, label: b }))} placeholder="Tüm markalar" value={q.brand} onChange={(e) => setQ({ ...q, brand: e.target.value })} /></Field>
            <Field label="Şehir"><CitySelect placeholder="Tüm şehirler" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} /></Field>
            <Field label="En yüksek fiyat (TL)" className="sm:col-span-2"><NumberInput placeholder="Örn. 1.000.000" value={q.maxPrice === '' ? undefined : Number(q.maxPrice)} onChange={(n) => setQ({ ...q, maxPrice: n === undefined ? '' : String(n) })} /></Field>
          </div>
          <Button type="submit" size="lg" className="mt-4 w-full">İlanları göster</Button>
        </form>
      </Container>
    </section>
  )
}

function LatestListings() {
  const { data, isLoading, isError, error, refetch } = useCars({ page: 0, size: 8, sort: 'createdAt,desc' })
  return (
    <section className="py-12">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold">Son eklenen ilanlar</h2>
          <Link to="/ilanlar" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">Tüm ilanlar <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        {isLoading ? (
          <CarGrid>{Array.from({ length: 4 }, (_, i) => <CarCardSkeleton key={i} />)}</CarGrid>
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !data?.content.length ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">Henüz yayında ilan yok. İlk ilanı sen ver.</p>
        ) : (
          <CarGrid>{data.content.map((c) => <CarCard key={c.id} car={c} />)}</CarGrid>
        )}
      </Container>
    </section>
  )
}

function AiTools() {
  return (
    <section className="pb-12">
      <Container className="grid gap-5 md:grid-cols-2">
        <Link to="/ai/oneri" className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition-shadow hover:shadow-panel">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Wallet className="h-5 w-5" aria-hidden /></span>
          <h3 className="mt-4 text-xl font-extrabold">Bütçeme göre araç öner</h3>
          <p className="mt-2 flex-1 text-muted">Bütçeni ve beklentini yaz. Yapay zekâ gerçek ilanları puanlar, artı ve eksilerini açıklar.</p>
          <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-700">Önerileri gör <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
        </Link>
        <Link to="/ai/fiyat" className="group flex flex-col rounded-2xl border border-accent-300 bg-accent-300/15 p-7 transition-shadow hover:shadow-panel">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-400 text-ink"><Calculator className="h-5 w-5" aria-hidden /></span>
          <h3 className="mt-4 text-xl font-extrabold">Aracım ne kadar eder?</h3>
          <p className="mt-2 flex-1 text-muted">Aynı markadaki ilanlara bakarak satış fiyat aralığını ve güven düzeyini hesaplar.</p>
          <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-800">Fiyatı hesapla <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
        </Link>
      </Container>
    </section>
  )
}

export function HomePage() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <LatestListings />
      <AiTools />
      <section className="pb-4">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-800 p-7 text-white sm:p-9">
            <div>
              <h2 className="text-2xl font-extrabold">Aracını satmak mı istiyorsun?</h2>
              <p className="mt-1 text-brand-100">İlanını dakikalar içinde yayınla, gelen teklifleri tek yerden yönet.</p>
            </div>
            <Link to="/ilanlarim/yeni" className={buttonStyles('accent', 'lg')}>İlan ver</Link>
          </div>
        </Container>
      </section>
    </>
  )
}
