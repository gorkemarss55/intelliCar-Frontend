import { http } from '@/lib/http'

const MAX_SIDE = 1600

export async function prepareImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86))
    if (!blob || (scale === 1 && blob.size >= file.size)) return file
    return new File([blob], `${file.name.replace(/\.\w+$/, '')}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

/** 
 * Görseli hazırlar ve backend'deki /upload endpoint'ine gönderir.
 */
export async function uploadCarImage(file: File): Promise<string> {
  const preparedFile = await prepareImage(file)
  const formData = new FormData()
  formData.append('file', preparedFile) // Backend RestUploadController @RequestParam("file") bekliyor

  // '/files' YERİNE '/upload' OLARAK GÜNCELLENDİ
  const response = await http.post<{ url: string }>('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.url
}