import { forwardRef, type ComponentProps } from 'react'
import { Select } from '@/components/ui/Field'
import { TR_CITIES } from '@/lib/constants'

const CITY_OPTIONS = TR_CITIES.map((c) => ({ value: c, label: c }))

type Props = Omit<ComponentProps<typeof Select>, 'options' | 'placeholder'> & { placeholder?: string }


export const CitySelect = forwardRef<HTMLSelectElement, Props>(({ placeholder = 'Şehir seç', ...props }, ref) => (
  <Select ref={ref} options={CITY_OPTIONS} placeholder={placeholder} {...props} />
))
CitySelect.displayName = 'CitySelect'
