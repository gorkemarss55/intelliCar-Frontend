import { Link } from 'react-router-dom'
import { Calculator, ListChecks, Search, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const STEPS = [
  { icon: Search, title: 'Ara ve karşılaştır', text: 'Marka, model, şehir, fiyat ve yıl filtreleriyle yayındaki gerçek ilanlar arasında ara.' },
  { icon: Wallet, title: 'Bütçeni söyle', text: 'Bütçeni ve beklentini yaz. Yapay zekâ yalnızca platformdaki ilanları puanlayıp artı ve eksileriyle sıralar.' },
  { icon: Calculator, title: 'Doğru fiyatı bul', text: 'Satacağın aracın bilgilerini gir. Aynı markadaki ilanlardan çıkan fiyat dağılımıyla bir satış aralığı önerilir.' },
  { icon: ListChecks, title: 'Teklifleri yönet', text: 'Alıcılar tekliflerini iletir, sen kabul veya reddedersin. Her gelişmede e-posta bildirimi alırsın.' },
]

export function AboutPage() {
  useDocumentTitle('Hakkımızda')
  return (
    <>
      <section className="bg-brand-900 text-white">
        <Container className="max-w-4xl py-14 sm:py-20">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">İkinci el araç alıp satmayı daha şeffaf yapıyoruz.</h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100">
            intelliCar, ilan platformunun sunduğu aramayı, yapay zekânın sunduğu yorumla birleştirir. Amaç, doğru araca ve doğru fiyata daha az zamanda ulaşmanı sağlamak.
          </p>
        </Container>
      </section>

      <Container className="max-w-4xl py-12">
        <h2 className="text-2xl font-extrabold">Nasıl çalışır?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Card>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold">Yapay zekâya nasıl yaklaşıyoruz?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <ShieldCheck className="h-5 w-5 text-brand-700" aria-hidden />
            <h3 className="mt-2 font-bold">Uydurma ilan yok</h3>
            <p className="mt-1 text-sm text-muted">Önerilen araçlar yalnızca veritabanındaki gerçek ilanlardır. Fiyat, yıl ve kilometre bilgisi her zaman ilandan gelir, yapay zekâ bu değerleri değiştiremez.</p>
          </Card>
          <Card className="p-5">
            <Sparkles className="h-5 w-5 text-accent-600" aria-hidden />
            <h3 className="mt-2 font-bold">Rakamlar veriden, yorum yapay zekâdan</h3>
            <p className="mt-1 text-sm text-muted">Fiyat aralığı benzer ilanların istatistiğinden hesaplanır. Yapay zekâ yıl, kilometre ve araç durumu farklarını yorumlar. Sonuç makul değilse sistem istatistiksel aralığa döner.</p>
          </Card>
        </div>
        <p className="mt-6 text-sm text-muted">Fiyat tahminleri platformdaki istenen fiyatlara dayanır. Gerçek satış fiyatı ve aracın ekspertiz durumu farklı olabilir.</p>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-800 p-7 text-white">
          <div>
            <h2 className="text-xl font-extrabold">Hemen başla</h2>
            <p className="text-brand-100">İlanlara göz at ya da aracını satışa çıkar.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/ilanlar" className={buttonStyles('secondary', 'lg')}>İlanlara göz at</Link>
            <Link to="/ilanlarim/yeni" className={buttonStyles('accent', 'lg')}>İlan ver</Link>
          </div>
        </div>
      </Container>
    </>
  )
}
