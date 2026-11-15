import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { EDITABLE_STATUS_OPTIONS, CAR_STATUS_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Select, Textarea } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import type { CarDetail } from '@/types/api'
import { useUpdateCar } from '../hooks'
import { carUpdateSchema, type CarUpdateValues } from '../schemas'
import { ImageManager } from './ImageManager'


export function CarEditForm({ car }: { car: CarDetail }) {
  const navigate = useNavigate()
  const update = useUpdateCar(car.id)
  const { register, control, handleSubmit, formState: { errors, isDirty } } = useForm<CarUpdateValues>({
    resolver: zodResolver(carUpdateSchema),
    defaultValues: { price: car.price, mileage: car.mileage, description: car.description, status: car.status },
  })

  
  const statusOptions = EDITABLE_STATUS_OPTIONS.some((o) => o.value === car.status)
    ? EDITABLE_STATUS_OPTIONS
    : [{ value: car.status, label: CAR_STATUS_LABELS[car.status] }, ...EDITABLE_STATUS_OPTIONS]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit((v) => update.mutate({ ...v, description: v.description.trim() }, { onSuccess: () => navigate('/ilanlarim') }))} className="space-y-6" noValidate>
        <Card className="p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">İlan bilgileri</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Fiyat (TL)" error={errors.price?.message}>
              <Controller name="price" control={control} render={({ field }) => <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={!!errors.price} />} />
            </Field>
            <Field label="Kilometre" error={errors.mileage?.message}>
              <Controller name="mileage" control={control} render={({ field }) => <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={!!errors.mileage} />} />
            </Field>
            <Field label="Durum"><Select options={statusOptions} {...register('status')} /></Field>
            <Field label="Açıklama" error={errors.description?.message} hint="En fazla 255 karakter." className="sm:col-span-3"><Textarea rows={4} maxLength={255} invalid={!!errors.description} {...register('description')} /></Field>
          </div>
          <p className="mt-3 text-xs text-muted">Marka, model ve yıl yayınlandıktan sonra değiştirilemez. “Satıldı” veya “Yayında değil” seçersen bekleyen teklifler otomatik olarak süresi doldu olarak işaretlenir.</p>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>Vazgeç</Button>
          <Button type="submit" size="lg" loading={update.isPending} disabled={!isDirty}>Değişiklikleri kaydet</Button>
        </div>
      </form>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold">Görseller</h2>
        <ImageManager carId={car.id} images={car.images} />
      </Card>
    </div>
  )
}
