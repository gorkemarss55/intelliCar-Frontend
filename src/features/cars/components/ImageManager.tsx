import { Star, Trash2 } from 'lucide-react'
import { MAX_IMAGES } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CarImage } from '@/types/api'
import { useCarImageMutations } from '../hooks'
import { ImageUploader } from './ImageUploader'

/** Yayındaki bir ilanın görsellerini doğrudan API üzerinden yönetir. */
export function ImageManager({ carId, images }: { carId: string; images: CarImage[] }) {
  const { add, setPrimary, remove } = useCarImageMutations(carId)

  return (
    <div className="space-y-3">
      <ImageUploader remaining={MAX_IMAGES - images.length} onUploaded={(urls) => add.mutate(urls)} />
      {images.length === 0 ? (
        <p className="text-sm text-muted">Bu ilanda henüz görsel yok. Görselli ilanlar daha çok ilgi görür.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">
                <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                {img.isPrimary && <Badge tone="blue" className="absolute left-2 top-2 bg-white">Ana görsel</Badge>}
              </div>
              <div className="flex items-center justify-between p-1.5">
                <Button size="sm" variant="ghost" disabled={img.isPrimary} loading={setPrimary.isPending && setPrimary.variables === img.id} onClick={() => setPrimary.mutate(img.id)}>
                  <Star className="h-3.5 w-3.5" aria-hidden /> Ana yap
                </Button>
                <Button size="sm" variant="ghost" loading={remove.isPending && remove.variables === img.id} onClick={() => remove.mutate(img.id)} aria-label="Görseli sil" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
