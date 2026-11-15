import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'


export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', className)} aria-label="intelliCar ana sayfa">
      <span className="inline-flex h-7 items-stretch overflow-hidden rounded-[5px] border-[1.5px] border-ink bg-white" aria-hidden>
        <span className="flex w-3.5 items-end justify-center bg-brand-700 pb-[3px] text-[6px] font-bold leading-none text-white">TR</span>
        <span className="flex items-center px-1.5 font-display text-[13px] font-extrabold tracking-wide text-ink">iC</span>
      </span>
      <span className={cn('font-display text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>
        intelli<span className={light ? 'text-accent-400' : 'text-brand-600'}>Car</span>
      </span>
    </Link>
  )
}
