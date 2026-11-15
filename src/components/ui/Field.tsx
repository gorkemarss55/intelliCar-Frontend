import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import type { Option } from '@/lib/constants'

const control =
  'w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-surface'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}


export function Field({ label, error, hint, children, className }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  )
}

interface InvalidProp { invalid?: boolean }

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & InvalidProp>(
  ({ className, invalid, ...props }, ref) => (
    <input ref={ref} aria-invalid={invalid || undefined} className={cn(control, 'h-10', invalid ? 'border-red-400' : 'border-line', className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & InvalidProp>(
  ({ className, invalid, ...props }, ref) => (
    <textarea ref={ref} aria-invalid={invalid || undefined} className={cn(control, 'py-2.5', invalid ? 'border-red-400' : 'border-line', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & InvalidProp & { options: Option[]; placeholder?: string }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, options, placeholder, ...props }, ref) => (
    <select ref={ref} aria-invalid={invalid || undefined} className={cn(control, 'h-10 pr-8', invalid ? 'border-red-400' : 'border-line', className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  ),
)
Select.displayName = 'Select'
