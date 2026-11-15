import { http } from '@/lib/http'

export const filesApi = {
  /** Görselleri backend'e yükler; kaydedilen dosyaların yolunu (örn. /intelliCar/uploads/abc.jpg) döner. */
  upload: (files: File[]) => {
    const body = new FormData()
    files.forEach((f) => body.append('files', f, f.name))
    return http.post<{ urls: string[] }>('/files', body, { timeout: 120_000 }).then((r) => r.data.urls)
  },
}
