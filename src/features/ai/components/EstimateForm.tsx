import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/constants'
import { BrandModelFields } from '@/components/shared/BrandModelFields'
import { CitySelect } from '@/components/shared/CitySelect'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import type { PriceEstimateRequest } from '@/types/api'
import { estimateSchema, toEstimateRequest, type EstimateValues } from '../schemas'

export function EstimateForm({ loading, onSubmit }: { loading: boolean; onSubmit: (req: PriceEstimateRequest) => void }) {
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<EstimateValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: { brand: '', model: '', year: new Date().getFullYear() - 5, mileage: 0, fuelType: 'GASOLINE', transmission: 'MANUAL', city: '', description: '' },
  })
  const [brand, model] = watch(['brand', 'model'])

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={handleSubmit((v) => onSubmit(toEstimateRequest(v)))} className="grid gap-4 md:grid-cols-4" noValidate>
        <BrandModelFields
          allowOther
          brand={brand}
          model={model}
          brandError={errors.brand?.message}
          modelError={errors.model?.message}
          onChange={(b, m) => {
            setValue('brand', b, { shouldValidate: b !== '' })
            setValue('model', m, { shouldValidate: m !== '' })
          }}
        />
        <Field label="Model yılı" error={errors.year?.message}>
          <Input type="number" inputMode="numeric" invalid={!!errors.year} {...register('year', { valueAsNumber: true })} />
        </Field>
        <Field label="Kilometre" error={errors.mileage?.message}>
          <Controller name="mileage" control={control} render={({ field }) => (
            <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={!!errors.mileage} />
          )} />
        </Field>
        <Field label="Yakıt"><Select options={FUEL_OPTIONS} {...register('fuelType')} /></Field>
        <Field label="Vites"><Select options={TRANSMISSION_OPTIONS} {...register('transmission')} /></Field>
        <Field label="Şehir" className="md:col-span-2"><CitySelect placeholder="Belirtmek istemiyorum" {...register('city')} /></Field>
        <Field label="Aracın durumu" error={errors.description?.message} className="md:col-span-4" hint="Boya, hasar kaydı, bakım, ekstra donanım gibi fiyatı etkileyen bilgiler.">
          <Textarea rows={2} maxLength={1000} placeholder="Örn. Boyasız, hasar kaydı yok, düzenli servis bakımlı…" {...register('description')} />
        </Field>
        <div className="md:col-span-4">
          <Button type="submit" size="lg" loading={loading}>
            <Calculator className="h-4 w-4" aria-hidden /> {loading ? 'Hesaplanıyor…' : 'Fiyat aralığını hesapla'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
