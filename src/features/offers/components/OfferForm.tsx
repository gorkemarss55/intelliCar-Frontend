import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { formatNumber, formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Field, Textarea } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import { useCreateOffer } from '../hooks'

const schema = z.object({
  offeredPrice: z.number({ invalid_type_error: 'Teklif tutarını gir', required_error: 'Teklif tutarını gir' }).positive('Tutar 0’dan büyük olmalı'),
  note: z.string().max(500, 'En fazla 500 karakter').optional(),
})
type Values = z.infer<typeof schema>

const QUICK_DISCOUNTS = [0.05, 0.1, 0.15]

export function OfferForm({ carId, price }: { carId: string; price: number }) {
  const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) })
  const create = useCreateOffer()

  const onSubmit = (v: Values) =>
    create.mutate({ carId, offeredPrice: v.offeredPrice, note: v.note?.trim() || undefined }, { onSuccess: () => reset() })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field label="Teklifin (TL)" error={errors.offeredPrice?.message}>
        <Controller name="offeredPrice" control={control} render={({ field }) => (
          <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder={formatNumber(Math.round(price * 0.95))} invalid={!!errors.offeredPrice} />
        )} />
      </Field>
      <div className="flex flex-wrap gap-2" aria-label="Hızlı teklif">
        {QUICK_DISCOUNTS.map((d) => {
          const amount = Math.round((price * (1 - d)) / 1000) * 1000
          return (
            <button key={d} type="button" onClick={() => setValue('offeredPrice', amount, { shouldValidate: true })}
              className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted hover:border-brand-300 hover:text-ink">
              %{d * 100} altı: {formatPrice(amount)}
            </button>
          )
        })}
      </div>
      <Field label="Satıcıya not (isteğe bağlı)" error={errors.note?.message}>
        <Textarea rows={2} {...register('note')} />
      </Field>
      <Button type="submit" className="w-full" loading={create.isPending}>Teklif gönder</Button>
    </form>
  )
}
