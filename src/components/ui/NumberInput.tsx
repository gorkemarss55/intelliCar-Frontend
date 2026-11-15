import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from './Field'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | null | undefined
  onChange: (value: number | undefined) => void
  invalid?: boolean
}

const fmt = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })


export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({ value, onChange, ...props }, ref) => (
  <Input
    ref={ref}
    type="text"
    inputMode="numeric"
    autoComplete="off"
    value={value == null || Number.isNaN(value) ? '' : fmt.format(value)}
    onChange={(e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
      onChange(digits === '' ? undefined : Number(digits))
    }}
    {...props}
  />
))
NumberInput.displayName = 'NumberInput'
