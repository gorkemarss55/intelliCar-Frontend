import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from '@/lib/constants'
import { CitySelect } from '@/components/shared/CitySelect'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { NumberInput } from '@/components/ui/NumberInput'
import type { BudgetRecommendationRequest } from '@/types/api'
import { recommendSchema, type RecommendValues } from '../schemas'

export function RecommendForm({ loading, onSubmit }: { loading: boolean; onSubmit: (req: BudgetRecommendationRequest) => void }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<RecommendValues>({
    resolver: zodResolver(recommendSchema),
    defaultValues: { preferences: '', fuelType: '', transmission: '', city: '', limit: 5 },
  })

  const submit = (v: RecommendValues) =>
    onSubmit({
      budget: v.budget,
      limit: v.limit,
      preferences: v.preferences.trim() || undefined,
      fuelType: v.fuelType || undefined,
      transmission: v.transmission || undefined,
      city: v.city.trim() || undefined,
    })

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={handleSubmit(submit)} className="grid gap-4 md:grid-cols-4" noValidate>
        <Field label="Bütçe (TL)" error={errors.budget?.message} className="md:col-span-2">
          <Controller name="budget" control={control} render={({ field }) => (
            <NumberInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Örn. 900.000" invalid={!!errors.budget} />
          )} />
        </Field>
        <Field label="Kaç araç önerilsin?" error={errors.limit?.message}>
          <Input type="number" min={1} max={10} invalid={!!errors.limit} {...register('limit', { valueAsNumber: true })} />
        </Field>
        <Field label="Şehir" error={errors.city?.message}>
          <CitySelect placeholder="Tüm şehirler" {...register('city')} />
        </Field>
        <Field label="Yakıt"><Select options={FUEL_OPTIONS} placeholder="Fark etmez" {...register('fuelType')} /></Field>
        <Field label="Vites"><Select options={TRANSMISSION_OPTIONS} placeholder="Fark etmez" {...register('transmission')} /></Field>
        <Field label="Beklentilerin" error={errors.preferences?.message} className="md:col-span-4" hint="Örn. “Aile için geniş, düşük yakıt tüketimi, şehir içi kullanım”">
          <Textarea rows={2} maxLength={500} invalid={!!errors.preferences} {...register('preferences')} />
        </Field>
        <div className="md:col-span-4">
          <Button type="submit" size="lg" loading={loading} variant="accent">
            <Sparkles className="h-4 w-4" aria-hidden /> {loading ? 'İlanlar inceleniyor…' : 'Önerileri getir'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
