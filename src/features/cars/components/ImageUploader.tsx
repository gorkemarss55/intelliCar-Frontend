import { useRef, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/cn'
import { prepareImage } from '@/lib/image'
import { useUploadImages } from '@/features/files/hooks'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_MB = 15

interface Props {
  
  remaining: number
  onUploaded: (urls: string[]) => void
}


export function ImageUploader({ remaining, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preparing, setPreparing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const upload = useUploadImages()
  const busy = preparing || upload.isPending
  const disabled = busy || remaining <= 0

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length || disabled) return
    let files = Array.from(list)
    if (files.length > remaining) {
      toast(`En fazla ${remaining} görsel daha ekleyebilirsin, ilk ${remaining} tanesi alındı.`)
      files = files.slice(0, remaining)
    }
    if (files.some((f) => !ACCEPTED.includes(f.type))) return void toast.error('Yalnızca JPG, PNG veya WEBP görseller yüklenebilir.')
    if (files.some((f) => f.size > MAX_FILE_MB * 1024 * 1024)) return void toast.error(`Her görsel en fazla ${MAX_FILE_MB} MB olabilir.`)

    setPreparing(true)
    try {
      const prepared = await Promise.all(files.map(prepareImage))
      setPreparing(false)
      const urls = await upload.mutateAsync(prepared)
      onUploaded(urls)
    } catch {
      // Hata mesajını global mutation handler gösterir.
    } finally {
      setPreparing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void handleFiles(e.dataTransfer.files) }}
        className={cn(
          'flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          dragging ? 'border-brand-500 bg-brand-50' : 'border-line bg-white hover:border-brand-300 hover:bg-brand-50/40',
        )}
      >
        {busy ? <Loader2 className="h-7 w-7 animate-spin text-brand-600" aria-hidden /> : <ImagePlus className="h-7 w-7 text-brand-600" aria-hidden />}
        <span className="text-sm font-semibold">{busy ? 'Görseller yükleniyor…' : 'Bilgisayarından görsel seç'}</span>
        <span className="text-xs text-muted">veya buraya sürükle bırak · JPG, PNG, WEBP</span>
      </button>
      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} multiple hidden onChange={(e) => void handleFiles(e.target.files)} />
    </div>
  )
}
