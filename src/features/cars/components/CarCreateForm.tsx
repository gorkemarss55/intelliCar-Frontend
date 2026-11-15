import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/constants'
import { BrandModelFields } from '@/components/shared/BrandModelFields'
import { CitySelect } from '@/components/shared/CitySelect'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import { PriceHint } from '@/features/ai/components/PriceHint'
import { estimateSchema, toEstimateRequest } from '@/features/ai/schemas'
import { useCreateCar } from '../hooks'
import { carCreateSchema, type CarCreateValues } from '../schemas'
import { ImageListEditor } from './ImageListEditor'

const DESCRIPTION_MAX = 255

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="p-5 sm:p-6">
    <h2 className="mb-4 text-lg font-bold">{title}</h2>
    {children}
  </Card>
)

export function CarCreateForm() {
  const navigate = useNavigate()
  const create = useCreateCar()
  const { register, control, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm<CarCreateValues>({
    resolver: zodResolver(carCreateSchema),
    defaultValues: { brand: '', model: '', year: new Date().getFullYear() - 3, mileage: 0, fuelType: 'GASOLINE', transmission: 'MANUAL', city: '', description: '', images: [] },
  })
  const [brand, model, description] = watch(['brand', 'model', 'description'])

  const onSubmit = (v: CarCreateValues) =>
    create.mutate(
      { ...v, brand: v.brand.trim(), model: v.model.trim(), city: v.city.trim(), description: v.description.trim(), images: v.images.map((imageUrl, i) => ({ imageUrl, isPrimary: i === 0 })) },
      { onSuccess: (car) => navigate(`/ilan/${car.id}`) },
    )

  /** Fiyat önerisi için aracın kimlik bilgileri geçerli olmalı. */
  const buildEstimateRequest = () => {
    const v = getValues()
    const parsed = estimateSchema.safeParse({ ...v, city: v.city ?? '', description: v.description ?? '' })
    if (!parsed.success) {
      toast.error('Fiyat önerisi için marka, model, yıl ve kilometreyi doldur.')
      return null
    }
    return toEstimateRequest(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Section title="Araç bilgileri">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <Field label="Model yılı" error={errors.year?.message}><Input type="number" inputMode="numeric" invalid={!!errors.year} {...register('year', { valueAsNumber: true })} /></Field>
          <Field label="Kilometre" error={errors.mileage?.message}>
            <Controller name="mileage" control={control} render={({ field }) => (
              <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={!!errors.mileage} />
            )} />
          </Field>
          <Field label="Yakıt"><Select options={FUEL_OPTIONS} {...register('fuelType')} /></Field>
          <Field label="Vites"><Select options={TRANSMISSION_OPTIONS} {...register('transmission')} /></Field>
          <Field label="Şehir" error={errors.city?.message} className="lg:col-span-2"><CitySelect invalid={!!errors.city} {...register('city')} /></Field>
        </div>
      </Section>

      <Section title="Fiyat ve açıklama">
        <div className="space-y-4">
          <Field label="Fiyat (TL)" error={errors.price?.message} className="max-w-sm">
            <Controller name="price" control={control} render={({ field }) => (
              <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Örn. 850.000" invalid={!!errors.price} />
            )} />
          </Field>
          <PriceHint buildRequest={buildEstimateRequest} onApply={(p) => setValue('price', Math.round(p / 1000) * 1000, { shouldValidate: true })} />
          <Field label="Açıklama" error={errors.description?.message} hint={`Hasar kaydı, bakım geçmişi, donanım. ${description?.length ?? 0}/${DESCRIPTION_MAX}`}>
            <Textarea rows={4} maxLength={DESCRIPTION_MAX} invalid={!!errors.description} {...register('description')} />
          </Field>
        </div>
      </Section>

      <Section title="Görseller">
        <Controller name="images" control={control} render={({ field }) => <ImageListEditor value={field.value} onChange={field.onChange} />} />
        {errors.images && <p role="alert" className="mt-2 text-xs text-red-600">{errors.images.message ?? 'Geçersiz görsel'}</p>}
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => navigate(-1)}>Vazgeç</Button>
        <Button type="submit" size="lg" loading={create.isPending}>İlanı yayınla</Button>
      </div>
    </form>
  )
}
