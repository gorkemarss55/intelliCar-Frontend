const priceFmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })
const numberFmt = new Intl.NumberFormat('tr-TR')
const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
const relFmt = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' })

export const formatPrice = (n: number | null | undefined) => (n == null ? '-' : priceFmt.format(n))
export const formatNumber = (n: number | null | undefined) => (n == null ? '-' : numberFmt.format(n))
export const formatKm = (n: number) => `${numberFmt.format(n)} km`
export const formatDate = (iso: string) => dateFmt.format(new Date(iso))

export function timeAgo(iso: string): string {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000], ['month', 2_592_000], ['day', 86_400], ['hour', 3_600], ['minute', 60],
  ]
  for (const [unit, secs] of units) {
    if (Math.abs(diffSec) >= secs) return relFmt.format(Math.round(diffSec / secs), unit)
  }
  return 'az önce'
}

export const fullName = (u: { firstName: string; lastName: string }) => `${u.firstName} ${u.lastName}`.trim()
