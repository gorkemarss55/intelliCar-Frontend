import axios from 'axios'

/** Backend mesajları İngilizce; kullanıcıya Türkçe göstermek için bilinen mesajları eşleriz. */
const TRANSLATIONS: [prefix: string, tr: string][] = [
  ['Account already exists', 'Bu e-posta ile zaten bir hesap var.'],
  ['User not found', 'Kullanıcı bulunamadı.'],
  ['Invalid email or password', 'E-posta veya şifre hatalı.'],
  ['JWT token is invalid or expired', 'Oturum süresi doldu. Lütfen tekrar giriş yap.'],
  ['Refresh token', 'Oturum süresi doldu. Lütfen tekrar giriş yap.'],
  ['Car not found', 'İlan bulunamadı.'],
  ['You are not authorized to perform operations on this car', 'Bu ilan üzerinde işlem yapma yetkin yok.'],
  ['Offers can only be made on active', 'Yalnızca yayındaki ilanlara teklif verilebilir.'],
  ['You cannot make an offer on your own', 'Kendi ilanına teklif veremezsin.'],
  ['You already have a pending offer', 'Bu ilan için zaten bekleyen bir teklifin var.'],
  ['Only pending offers', 'Yalnızca beklemedeki teklifler yanıtlanabilir.'],
  ['You are not authorized to respond', 'Bu teklifi yanıtlama yetkin yok.'],
  ['Only the vehicle owner', 'Teklifleri yalnızca ilan sahibi görebilir.'],
  ['Offer not found', 'Teklif bulunamadı.'],
  ['Invalid offer status', 'Geçersiz teklif durumu.'],
  ['Car image not found', 'Görsel bulunamadı.'],
  ['You are not authorized to modify images', 'Bu ilanın görsellerini düzenleme yetkin yok.'],
  ['The AI service is currently unavailable', 'Yapay zekâ servisi şu an yanıt vermiyor. Biraz sonra tekrar dene.'],
  ['No similar listings', 'Bu marka için karşılaştırılacak ilan bulunamadı, fiyat tahmini yapılamıyor.'],
  ['Only JPEG, PNG or WEBP', 'Yalnızca JPG, PNG veya WEBP görseller (en fazla 10 MB) yüklenebilir.'],
  ['An unexpected error', 'Sunucuda beklenmeyen bir hata oluştu. Detay için backend konsoluna bak.'],
  ['Too many AI requests', 'Çok fazla yapay zekâ isteği gönderdin. Biraz bekleyip tekrar dene.'],
]

const translate = (msg: string) => TRANSLATIONS.find(([p]) => msg.startsWith(p))?.[1] ?? msg

export function getErrorMessage(error: unknown): string {
  if ((error as { maskedServerError?: boolean })?.maskedServerError) {
    return 'Sunucuda beklenmeyen bir hata oluştu. Detay için backend konsolundaki hata kaydına bak (Redis, Kafka ve veritabanının çalıştığından emin ol).'
  }
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'İstek zaman aşımına uğradı. Yapay zekâ servisi yanıt vermiyor olabilir; backend konsolunu ve API anahtarını kontrol et.'
    }
    if (!error.response) return 'Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.'
    const { status, data } = error.response
    if (status === 429) {
      const wait = error.response.headers['retry-after']
      return wait ? `Çok fazla istek gönderdin. ${wait} saniye sonra tekrar dene.` : 'Çok fazla istek gönderdin. Biraz bekleyip tekrar dene.'
    }
    // ApiError { exception: { message } } | ErrorMessage { ofStatic } | { alan: "mesaj" } | { message }
    const raw =
      data?.exception?.message ??
      data?.ofStatic ??
      data?.message ??
      (data && typeof data === 'object' ? Object.values(data).filter((v) => typeof v === 'string').join(', ') : null)
    if (typeof raw === 'string' && raw) return translate(raw)
    if (status === 401) return 'Bu işlem için giriş yapmalısın.'
    if (status === 403) return 'Bu işlem için yetkin yok.'
    if (status >= 500) return 'Sunucuda bir hata oluştu. Biraz sonra tekrar dene.'
  }
  return 'Beklenmeyen bir hata oluştu.'
}

export const isClientError = (error: unknown) =>
  axios.isAxiosError(error) && !!error.response && error.response.status >= 400 && error.response.status < 500
