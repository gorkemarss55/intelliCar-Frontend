#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const API = opt('api', 'http://localhost:8080/intelliCar/api/v1')
const PER_MODEL = Number(opt('per-model', 6))
let WITH_IMAGES = !args.includes('--no-images')
const IMAGE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-images')

const SELLERS = [
  ['Mehmet', 'Yılmaz', '05321110011'], ['Ayşe', 'Demir', '05332220022'], ['Ahmet', 'Kaya', '05423330033'],
  ['Fatma', 'Çelik', '05354440044'], ['Mustafa', 'Şahin', '05445550055'], ['Zeynep', 'Aydın', '05376660066'],
  ['Emre', 'Arslan', '05057770077'], ['Elif', 'Koç', '05068880088'],
].map(([firstName, lastName, phone], i) => ({
  email: `satici${i + 1}@intellicar.test`, password: 'Test1234!', firstName, lastName, phone, role: 'SELLER',
}))

// base: sıfır km güncel model için yaklaşık TL fiyatı (örnek veri). from: modelin çıktığı yıl.
const M = (brand, model, base, body, fuels, trans, from = 2012) => ({ brand, model, base, body, fuels, trans, from })
const MODELS = [
  M('Renault', 'Clio', 1_050_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Renault', 'Megane', 1_500_000, 'sedan', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Renault', 'Captur', 1_450_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Renault', 'Austral', 2_200_000, 'suv', ['HYBRID', 'GASOLINE'], ['AUTOMATIC'], 2022),
  M('Renault', 'Taliant', 950_000, 'sedan', ['GASOLINE'], ['MANUAL', 'AUTOMATIC'], 2021),
  M('Fiat', 'Egea', 1_100_000, 'sedan', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC'], 2015),
  M('Fiat', 'Egea Cross', 1_300_000, 'suv', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC'], 2020),
  M('Fiat', '500', 1_200_000, 'hatch', ['GASOLINE', 'ELECTRIC'], ['MANUAL', 'AUTOMATIC']),
  M('Volkswagen', 'Golf', 1_900_000, 'hatch', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Volkswagen', 'Polo', 1_350_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Volkswagen', 'Passat', 2_600_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Volkswagen', 'Tiguan', 2_700_000, 'suv', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Volkswagen', 'T-Roc', 2_100_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL'], 2018),
  M('Toyota', 'Corolla', 1_900_000, 'sedan', ['HYBRID', 'GASOLINE'], ['AUTOMATIC']),
  M('Toyota', 'Yaris', 1_250_000, 'hatch', ['HYBRID', 'GASOLINE'], ['AUTOMATIC', 'MANUAL']),
  M('Toyota', 'C-HR', 2_100_000, 'suv', ['HYBRID', 'GASOLINE'], ['AUTOMATIC'], 2017),
  M('Honda', 'Civic', 2_200_000, 'sedan', ['GASOLINE', 'HYBRID'], ['AUTOMATIC', 'MANUAL']),
  M('Honda', 'CR-V', 3_000_000, 'suv', ['GASOLINE', 'HYBRID'], ['AUTOMATIC']),
  M('Hyundai', 'i20', 1_250_000, 'hatch', ['GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Hyundai', 'Tucson', 2_500_000, 'suv', ['DIESEL', 'HYBRID', 'GASOLINE'], ['AUTOMATIC'], 2015),
  M('Hyundai', 'Elantra', 1_650_000, 'sedan', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Dacia', 'Duster', 1_500_000, 'suv', ['DIESEL', 'GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Dacia', 'Sandero Stepway', 1_050_000, 'hatch', ['GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Ford', 'Focus', 1_500_000, 'hatch', ['DIESEL', 'GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Ford', 'Fiesta', 1_050_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Ford', 'Kuga', 2_400_000, 'suv', ['DIESEL', 'HYBRID'], ['AUTOMATIC']),
  M('Skoda', 'Octavia', 2_000_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC', 'MANUAL']),
  M('Skoda', 'Superb', 2_900_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Skoda', 'Kodiaq', 2_800_000, 'suv', ['DIESEL', 'GASOLINE'], ['AUTOMATIC'], 2017),
  M('Opel', 'Astra', 1_450_000, 'hatch', ['DIESEL', 'GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Opel', 'Corsa', 1_150_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Opel', 'Mokka', 1_700_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL'], 2013),
  M('Peugeot', '208', 1_300_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Peugeot', '3008', 2_300_000, 'suv', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Peugeot', '301', 1_000_000, 'sedan', ['GASOLINE', 'DIESEL'], ['MANUAL']),
  M('Kia', 'Sportage', 2_300_000, 'suv', ['DIESEL', 'HYBRID'], ['AUTOMATIC']),
  M('Kia', 'Ceed', 1_500_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Kia', 'Picanto', 950_000, 'hatch', ['GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Nissan', 'Qashqai', 2_000_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Nissan', 'Juke', 1_500_000, 'suv', ['GASOLINE'], ['MANUAL', 'AUTOMATIC']),
  M('Seat', 'Leon', 1_550_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Citroen', 'C3', 1_000_000, 'hatch', ['GASOLINE', 'DIESEL'], ['MANUAL', 'AUTOMATIC']),
  M('Citroen', 'C-Elysee', 900_000, 'sedan', ['GASOLINE', 'DIESEL'], ['MANUAL']),
  M('BMW', '3 Serisi', 3_500_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('BMW', '5 Serisi', 4_800_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('BMW', 'X3', 4_300_000, 'suv', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Mercedes-Benz', 'C 200', 3_800_000, 'sedan', ['GASOLINE', 'DIESEL'], ['AUTOMATIC']),
  M('Mercedes-Benz', 'E 200', 5_200_000, 'sedan', ['GASOLINE', 'DIESEL'], ['AUTOMATIC']),
  M('Mercedes-Benz', 'GLA', 3_600_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC'], 2014),
  M('Audi', 'A3', 2_800_000, 'sedan', ['GASOLINE', 'DIESEL'], ['AUTOMATIC']),
  M('Audi', 'A4', 3_600_000, 'sedan', ['DIESEL', 'GASOLINE'], ['AUTOMATIC']),
  M('Audi', 'Q3', 3_300_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC'], 2012),
  M('Volvo', 'XC60', 4_300_000, 'suv', ['DIESEL', 'HYBRID'], ['AUTOMATIC']),
  M('Tesla', 'Model Y', 2_700_000, 'suv', ['ELECTRIC'], ['AUTOMATIC'], 2022),
  M('Tesla', 'Model 3', 2_300_000, 'sedan', ['ELECTRIC'], ['AUTOMATIC'], 2019),
  M('Mazda', 'CX-5', 2_600_000, 'suv', ['GASOLINE', 'DIESEL'], ['AUTOMATIC', 'MANUAL']),
  M('Suzuki', 'Vitara', 1_700_000, 'suv', ['GASOLINE', 'HYBRID'], ['MANUAL', 'AUTOMATIC'], 2015),
]

const W = (pairs) => pairs.flatMap(([v, w]) => Array(w).fill(v)) // ağırlıklı seçim için
const CITIES = W([['İstanbul', 25], ['Ankara', 14], ['İzmir', 10], ['Bursa', 7], ['Antalya', 6], ['Konya', 5], ['Kayseri', 5], ['Adana', 4], ['Gaziantep', 4], ['Kocaeli', 3], ['Eskişehir', 3], ['Samsun', 3], ['Trabzon', 3], ['Mersin', 3], ['Diyarbakır', 2], ['Denizli', 2], ['Tekirdağ', 2]])
const COLORS = W([['beyaz', 28], ['gri', 20], ['siyah', 18], ['gumus', 12], ['mavi', 8], ['kirmizi', 7], ['bej', 4], ['yesil', 3]])

const COND = ['Boyasız, değişensiz.', 'Hasar kaydı yok.', 'Sadece sağ ön çamurluk boyalı.', 'Kaput ve tavan lokal boyalı, diğer parçalar orijinal.', 'Küçük çizikler dışında temiz.', 'Ağır hasar kaydı yok, tramer belgesi mevcut.']
const SERVICE = ['Yetkili servis bakımlı.', 'Tüm bakımları zamanında yapıldı.', 'Bakım kayıtları mevcut.', 'Periyodik bakımları özel serviste yapıldı.', 'Yağ ve filtreleri yeni değişti.']
const OWNER = ['Tek elden.', 'İkinci sahibinden.', 'Aile aracı, sigara içilmedi.', 'Garaj arabası.', 'Emekli öğretmenden.']
const EQUIP = ['Geri görüş kamerası, yol bilgisayarı ve hız sabitleyici var.', 'Deri döşeme, sunroof ve ısıtmalı koltuk.', 'Apple CarPlay ve Android Auto destekli multimedya.', 'Park sensörü ve şerit takip sistemi mevcut.', 'Kışlık lastik seti hediye.', 'Yeni lastikli, akü değişti.']
const EV_EQUIP = ['Şarj kablosu hediye.', 'Batarya sağlığı yüksek, garantisi devam ediyor.', 'Ev tipi şarj ünitesiyle birlikte.']
const SALE = ['Takas olur.', 'Ekspertiz yaptırılabilir.', 'Pazarlık payı vardır.', 'Sadece ciddi alıcılar arasın.', 'Noter satışa uygundur.']

const CURRENT_YEAR = new Date().getFullYear()
const rand = (min, max) => Math.random() * (max - min) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const roundTo = (n, step) => Math.round(n / step) * step
const FUEL_FACTOR = { GASOLINE: 1, DIESEL: 1.05, HYBRID: 1.1, ELECTRIC: 1.0 }

function describe(fuel) {
  const parts = [pick(COND), pick(SERVICE), pick(OWNER), fuel === 'ELECTRIC' ? pick(EV_EQUIP) : pick(EQUIP), pick(SALE)]
  let out = ''
  for (const p of parts.slice(0, 3 + Math.floor(Math.random() * 3))) {
    if ((out + ' ' + p).trim().length > 250) break // veritabanı sütunu 255 karakter
    out = (out + ' ' + p).trim()
  }
  return out
}

function makeCar(m, imageUrls) {
  const year = Math.floor(rand(Math.max(m.from, CURRENT_YEAR - 13), CURRENT_YEAR + 0.99))
  const age = CURRENT_YEAR - year
  const mileage = roundTo(Math.max(1_000, age * rand(9_000, 24_000) + (age === 0 ? 0 : rand(0, 6_000))), 500)
  const fuelType = pick(m.fuels)
  // Yılda ~%9 değer kaybı, yüksek km'de ek düşüş, ilan fiyatında ±%7 oynama.
  const price = m.base * Math.pow(0.91, age) * FUEL_FACTOR[fuelType] * (1 - Math.min(mileage / 650_000, 0.25)) * rand(0.93, 1.07)
  const color = pick(COLORS)
  const imageUrl = imageUrls?.get(`${m.body}-${color}`)
  return {
    brand: m.brand,
    model: m.model,
    year,
    mileage,
    price: roundTo(price, 5_000),
    fuelType,
    transmission: pick(m.trans),
    city: pick(CITIES),
    description: describe(fuelType),
    images: imageUrl ? [{ imageUrl, isPrimary: true }] : [],
    _imageKey: `${m.body}-${color}`,
  }
}

async function call(method, route, body, token) {
  const res = await fetch(`${API}${route}`, {
    method,
    headers: { ...(body && !(body instanceof FormData) && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { /* JSON olmayan yanıt */ }
  return { ok: res.ok, status: res.status, data }
}

async function getToken(user) {
  let r = await call('POST', '/auth/register', user)
  if (!r.ok) r = await call('POST', '/auth/login', { email: user.email, password: user.password }) // zaten kayıtlıysa
  if (!r.ok) throw new Error(`${user.email} için giriş yapılamadı (HTTP ${r.status})`)
  return r.data.accessToken
}

/** scripts/seed-images içindeki dosyaları bir kez yükler ve "gövde-renk" → URL eşlemesi döner. */
async function uploadImages(token) {
  const urls = new Map()
  const keys = new Set()
  for (const b of ['hatch', 'sedan', 'suv']) for (const c of new Set(COLORS)) keys.add(`${b}-${c}`)
  for (const key of keys) {
    const buf = await readFile(path.join(IMAGE_DIR, `${key}.webp`))
    const form = new FormData()
    form.append('files', new Blob([buf], { type: 'image/webp' }), `${key}.webp`)
    const r = await call('POST', '/files', form, token)
    if (!r.ok || !r.data?.urls?.[0]) throw new Error(`görsel yüklenemedi (${key}, HTTP ${r.status})`)
    urls.set(key, r.data.urls[0])
  }
  return urls
}

async function main() {
  console.log(`Backend: ${API}`)
  const tokens = []
  for (const s of SELLERS) tokens.push(await getToken(s))
  console.log(`${SELLERS.length} satıcı hesabı hazır.`)

  const existing = await call('GET', '/car?size=1')
  const total = existing.data?.totalElements ?? existing.data?.page?.totalElements
  if (total) console.log(`Not: veritabanında zaten ${total} ilan var, yenileri ekleniyor.`)

  let imageUrls = null
  if (WITH_IMAGES) {
    try {
      imageUrls = await uploadImages(tokens[0])
      console.log(`${imageUrls.size} örnek görsel yüklendi.`)
    } catch (e) {
      console.warn(`Görseller yüklenemedi, ilanlar görselsiz eklenecek: ${e.message}`)
      console.warn('  (Backend\'e /files endpoint\'ini eklediğinden emin ol, ya da --no-images kullan.)')
      WITH_IMAGES = false
    }
  }

  const jobs = MODELS.flatMap((m) => Array.from({ length: PER_MODEL }, () => m))
  let ok = 0
  let fail = 0
  const BATCH = 6
  for (let i = 0; i < jobs.length; i += BATCH) {
    await Promise.all(
      jobs.slice(i, i + BATCH).map(async (m, j) => {
        const { _imageKey, ...car } = makeCar(m, imageUrls)
        const r = await call('POST', '/car', car, tokens[(i + j) % tokens.length])
        if (r.ok) ok++
        else { fail++; console.warn(`  ✗ ${m.brand} ${m.model}: HTTP ${r.status} ${r.data?.exception?.message ?? ''}`) }
      }),
    )
    process.stdout.write(`\r  ${Math.min(i + BATCH, jobs.length)} / ${jobs.length} ilan işlendi`)
  }
  console.log(`\n\nBitti: ${ok} ilan eklendi${fail ? `, ${fail} hata` : ''}.`)
  console.log('Şimdi KENDİ hesabınla giriş yapıp /ai/oneri ve /ai/fiyat sayfalarını deneyebilirsin.')
}

main().catch((e) => {
  console.error(`\nHata: ${e.message}`)
  console.error('Backend çalışıyor mu? Adres farklıysa: node scripts/seed.mjs --api http://localhost:PORT/intelliCar/api/v1')
  process.exit(1)
})
