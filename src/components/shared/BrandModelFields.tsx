import { useState } from 'react'
import { Field, Input, Select } from '@/components/ui/Field'
import type { Option } from '@/lib/constants'
import { CAR_BRANDS, getModels } from '@/lib/carCatalog'

const OTHER = '__other__'

interface Props {
  brand: string
  model: string
  onChange: (brand: string, model: string) => void
  /** true: listede olmayan marka/model yazılabilir (ilan formları). false: yalnızca filtre gibi seçim. */
  allowOther?: boolean
  brandError?: string
  modelError?: string
}

const toOpts = (items: string[]): Option[] => items.map((v) => ({ value: v, label: v }))

/** Marka seçilince modeller ona göre listelenir. Fragment döner, grid içine iki alan olarak yerleşir. */
export function BrandModelFields({ brand, model, onChange, allowOther = false, brandError, modelError }: Props) {
  const [brandOther, setBrandOther] = useState(() => allowOther && brand !== '' && !CAR_BRANDS.includes(brand))
  const [modelOther, setModelOther] = useState(() => allowOther && brand !== '' && model !== '' && !getModels(brand).includes(model))
  const modelFree = brandOther || modelOther
  const catalogModels = getModels(brand)

  // Filtrede URL'den gelen, listede olmayan değer de görünür kalsın.
  const brandOptions = toOpts(CAR_BRANDS)
  if (!allowOther && brand && !CAR_BRANDS.includes(brand)) brandOptions.push({ value: brand, label: brand })
  if (allowOther) brandOptions.push({ value: OTHER, label: 'Diğer…' })

  const modelOptions = toOpts(catalogModels)
  if (!allowOther && model && !catalogModels.includes(model)) modelOptions.push({ value: model, label: model })
  if (allowOther) modelOptions.push({ value: OTHER, label: 'Diğer…' })

  const pickBrand = (v: string) => {
    if (v === OTHER) {
      setBrandOther(true)
      setModelOther(true)
      return onChange('', '')
    }
    setModelOther(false)
    onChange(v, '')
  }
  const pickModel = (v: string) => {
    if (v === OTHER) {
      setModelOther(true)
      return onChange(brand, '')
    }
    onChange(brand, v)
  }
  const backToList = () => {
    setBrandOther(false)
    setModelOther(false)
    onChange('', '')
  }

  return (
    <>
      <div>
        <Field label="Marka" error={brandError}>
          {brandOther ? (
            <Input value={brand} placeholder="Markayı yaz" invalid={!!brandError} onChange={(e) => onChange(e.target.value, model)} />
          ) : (
            <Select options={brandOptions} value={brand} invalid={!!brandError} placeholder={allowOther ? 'Marka seç' : 'Tüm markalar'} onChange={(e) => pickBrand(e.target.value)} />
          )}
        </Field>
        {brandOther && <button type="button" onClick={backToList} className="mt-1 text-xs font-medium text-brand-700 hover:underline">Listeden seç</button>}
      </div>
      <div>
        <Field label="Model" error={modelError}>
          {modelFree ? (
            <Input value={model} placeholder="Modeli yaz" invalid={!!modelError} onChange={(e) => onChange(brand, e.target.value)} />
          ) : (
            <Select
              options={modelOptions}
              value={model}
              disabled={!brand}
              invalid={!!modelError}
              placeholder={allowOther ? (brand ? 'Model seç' : 'Önce marka seç') : 'Tüm modeller'}
              onChange={(e) => pickModel(e.target.value)}
            />
          )}
        </Field>
        {!brandOther && modelOther && <button type="button" onClick={() => { setModelOther(false); onChange(brand, '') }} className="mt-1 text-xs font-medium text-brand-700 hover:underline">Listeden seç</button>}
      </div>
    </>
  )
}
