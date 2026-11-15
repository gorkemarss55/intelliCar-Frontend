import { useState, type FormEvent } from 'react'
import { cn } from '@/lib/cn'
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/constants'
import { BrandModelFields } from '@/components/shared/BrandModelFields'
import { CitySelect } from '@/components/shared/CitySelect'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import { EMPTY_FILTERS, type ListingFilters } from '../useListingParams'

function Chips<T extends string>({ value, options, onChange, label }: { value: T | ''; options: { value: T; label: string }[]; onChange: (v: T | '') => void; label: string }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value
          return (
            <button key={o.value} type="button" aria-pressed={active} onClick={() => onChange(active ? '' : o.value)}
              className={cn('rounded-full border px-3 py-1.5 text-sm transition-colors', active ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-white text-ink hover:border-brand-300')}>
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

interface CarFiltersProps {
  value: ListingFilters
  onApply: (filters: ListingFilters) => void
  onReset: () => void
}

export function CarFilters({ value, onApply, onReset }: CarFiltersProps) {
  const [draft, setDraft] = useState(value)
  const set = <K extends keyof ListingFilters>(key: K, v: ListingFilters[K]) => setDraft((d) => ({ ...d, [key]: v }))
  const text = (key: keyof ListingFilters) => ({ value: draft[key], onChange: (e: { target: { value: string } }) => set(key, e.target.value as never) })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onApply(draft)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <BrandModelFields brand={draft.brand} model={draft.model} onChange={(b, m) => setDraft((d) => ({ ...d, brand: b, model: m }))} />
      <Field label="Şehir"><CitySelect placeholder="Tüm şehirler" value={draft.city} onChange={(e) => set('city', e.target.value)} /></Field>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Fiyat (TL)</span>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput placeholder="En az" aria-label="En düşük fiyat" value={draft.minPrice === '' ? undefined : Number(draft.minPrice)} onChange={(n) => set('minPrice', n === undefined ? '' : String(n))} />
          <NumberInput placeholder="En çok" aria-label="En yüksek fiyat" value={draft.maxPrice === '' ? undefined : Number(draft.maxPrice)} onChange={(n) => set('maxPrice', n === undefined ? '' : String(n))} />
        </div>
      </div>
      <div>
        <span className="mb-1.5 block text-sm font-medium">Model yılı</span>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" min={1950} inputMode="numeric" placeholder="En az" aria-label="En eski model yılı" {...text('minYear')} />
          <Input type="number" min={1950} inputMode="numeric" placeholder="En çok" aria-label="En yeni model yılı" {...text('maxYear')} />
        </div>
      </div>

      <Chips label="Yakıt" value={draft.fuelType} options={FUEL_OPTIONS} onChange={(v) => set('fuelType', v)} />
      <Chips label="Vites" value={draft.transmission} options={TRANSMISSION_OPTIONS} onChange={(v) => set('transmission', v)} />

      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1">Sonuçları göster</Button>
        <Button variant="secondary" onClick={() => { setDraft(EMPTY_FILTERS); onReset() }}>Temizle</Button>
      </div>
    </form>
  )
}
