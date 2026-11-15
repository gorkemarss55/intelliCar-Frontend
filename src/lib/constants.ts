import type { CarStatus, FuelType, OfferStatus, Transmission, UserRole } from '@/types/api'

export const FUEL_LABELS: Record<FuelType, string> = {
  GASOLINE: 'Benzin', DIESEL: 'Dizel', HYBRID: 'Hibrit', ELECTRIC: 'Elektrik',
}
export const TRANSMISSION_LABELS: Record<Transmission, string> = { MANUAL: 'Manuel', AUTOMATIC: 'Otomatik' }
export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  ACTIVE: 'Yayında', PENDING_REVIEW: 'İncelemede', SOLD: 'Satıldı', INACTIVE: 'Yayında değil',
}
export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  PENDING: 'Beklemede', ACCEPTED: 'Kabul edildi', REJECTED: 'Reddedildi', EXPIRED: 'Süresi doldu',
}
export const ROLE_LABELS: Record<UserRole, string> = { BUYER: 'Alıcı', SELLER: 'Satıcı', ADMIN: 'Yönetici' }

export interface Option<T extends string = string> { value: T; label: string }
export const toOptions = <T extends string>(labels: Record<T, string>): Option<T>[] =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }))

export const FUEL_OPTIONS = toOptions(FUEL_LABELS)
export const TRANSMISSION_OPTIONS = toOptions(TRANSMISSION_LABELS)

/** Satıcının ilan durumu olarak seçebileceği değerler (PENDING_REVIEW'u sistem verir). */
export const EDITABLE_STATUS_OPTIONS: Option<CarStatus>[] = [
  { value: 'ACTIVE', label: CAR_STATUS_LABELS.ACTIVE },
  { value: 'SOLD', label: CAR_STATUS_LABELS.SOLD },
  { value: 'INACTIVE', label: CAR_STATUS_LABELS.INACTIVE },
]

export const SORT_OPTIONS: Option[] = [
  { value: 'createdAt,desc', label: 'En yeni' },
  { value: 'price,asc', label: 'Fiyat: düşükten yükseğe' },
  { value: 'price,desc', label: 'Fiyat: yüksekten düşüğe' },
  { value: 'year,desc', label: 'Model yılı: yeni' },
  { value: 'mileage,asc', label: 'Kilometre: az' },
]

export const TR_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
  'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

export const MAX_IMAGES = 10
