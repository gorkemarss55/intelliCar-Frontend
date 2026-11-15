import type { ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  
  variant?: 'dialog' | 'sheet'
}

export function Modal({ open, onClose, title, children, variant = 'dialog' }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-ink/50" aria-hidden />
      <div className={cn('fixed inset-0 flex p-4', variant === 'sheet' ? 'items-end sm:items-center' : 'items-center', 'justify-center')}>
        <DialogPanel className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-panel">
          <div className="mb-4 flex items-start justify-between gap-4">
            <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
            <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface hover:text-ink" aria-label="Kapat">
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
