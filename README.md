# intelliCar Frontend

intelliCar ikinci el araç ilan platformunun React arayüzü. Spring Boot backend'i ile çalışır.

**Teknolojiler:** React 18, TypeScript, Vite, Tailwind CSS, React Router 6, TanStack Query, Zustand, React Hook Form + Zod, Axios, Headless UI, Lucide.

## Çalıştırma (Docker gerekmez)

Önkoşul: Node.js 20+ ve çalışan backend (`http://localhost:8080`).

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend farklı bir adreste ise `.env.local` oluştur:

```
VITE_API_PROXY_TARGET=http://localhost:9090
```

### CORS hakkında
Backend'de `SecurityConfig` içinde CORS kapalı. Geliştirme sırasında Vite proxy'si (`vite.config.ts`) `/intelliCar` isteklerini backend'e yönlendirdiği için tarayıcı aynı origin'de çalışır ve backend'e dokunmak gerekmez. Canlıya alırken ya aynı alan adı altında reverse proxy (Nginx vb.) kullan ya da backend'de CORS'u aç ve `VITE_API_URL` ver.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run build` | Tip kontrolü + üretim derlemesi (`dist/`) |
| `npm run preview` | Derlemeyi yerelde önizle |

## Klasör yapısı

```
src/
  app/            Provider'lar, router, QueryClient
  components/
    ui/           Genel bileşenler (Button, Field, Modal, Pagination...)
    layout/       Navbar, Footer, RootLayout
    shared/       Uygulama geneli parçalar (Logo, RequireAuth, StatusBadge...)
  features/       Her özellik kendi api / hooks / schemas / components dosyalarını taşır
    auth/  cars/  offers/  ai/  favorites/
  hooks/          Genel hook'lar
  lib/            axios (http.ts), hata çevirisi, formatlama, sabitler
  pages/          Route'lara karşılık gelen ince sayfa bileşenleri
  types/          Backend DTO tipleri
```

Akış: `pages` → `features/*/hooks` (TanStack Query) → `features/*/api` → `lib/http`.

## Sayfalar

`/` ana sayfa · `/ilanlar` filtreli liste (filtreler URL'de) · `/ilan/:id` detay + teklif · `/giris` `/kayit` · `/ilanlarim` (+ `/yeni`, `/:id/duzenle`, `/:id/teklifler`) · `/tekliflerim` · `/favoriler` · `/ai/oneri` · `/ai/fiyat` · `/profil`

## Notlar

- Token yenileme otomatiktir: süresi dolan access token istekten önce yenilenir, 401'de tek seferlik yeniden deneme yapılır.
- Favoriler backend'de olmadığı için tarayıcıda (localStorage) tutulur.
- Backend görsel yüklemeyi dosya olarak değil URL olarak alır; arayüz de bağlantı ile çalışır.
- `/car/my-cars` yanıtında `status` yoktur. `CarListResponse`'a `status` eklersen "İlanlarım" listesinde durum rozeti otomatik görünür.

## Örnek veri yükleme

Yapay zekâ özellikleri gerçek ilan verisine dayanır. Test için örnek ilanları toplu eklemek:

```bash
npm run seed                        # ~290 ilan, çizim görselli
npm run seed -- --per-model 10      # daha fazla ilan
npm run seed -- --no-images         # görselsiz
```

54 farklı model, 8 satıcı hesabı (`satici1..8@intellicar.test`, şifre `Test1234!`). Görseller `scripts/seed-images` klasöründeki çizimlerdir ve backend'in `/files` endpoint'iyle yüklenir. Yapay zekâ kullanıcının kendi ilanlarını dışladığı için öneri ve fiyat tahminini kendi hesabınla dene.

## Görsel yükleme

İlan formunda görseller bilgisayardan seçilir (sürükle-bırak da çalışır), tarayıcıda küçültülür ve backend'in `POST /intelliCar/api/v1/files` endpoint'ine yüklenir. Bu endpoint backend'e eklenmelidir.
