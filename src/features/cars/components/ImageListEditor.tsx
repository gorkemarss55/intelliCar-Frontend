import { Star, Trash2 } from 'lucide-react'
import { MAX_IMAGES } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from './ImageUploader'


export function ImageListEditor({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const makePrimary = (i: number) => onChange([value[i], ...value.filter((_, idx) => idx !== i)])
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3">
      <ImageUploader remaining={MAX_IMAGES - value.length} onUploaded={(urls) => onChange([...value, ...urls])} />
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, i) => (
            <li key={url} className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">
                <img src={url} alt={`Görsel ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && <Badge tone="blue" className="absolute left-2 top-2 bg-white">Ana görsel</Badge>}
              </div>
              <div className="flex items-center justify-between p-1.5">
                <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => makePrimary(i)}>
                  <Star className="h-3.5 w-3.5" aria-hidden /> Ana yap
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(i)} aria-label="Görseli kaldır" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted">{value.length} / {MAX_IMAGES} görsel. İlk eklediğin görsel ana görsel olur.</p>
    </div>
  )
}
