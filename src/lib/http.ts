import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store'
import type { AuthResponse } from '@/types/api'

export const API_BASE: string = import.meta.env.VITE_API_URL || '/intelliCar/api/v1'

export const http = axios.create({ baseURL: API_BASE, timeout: 30_000 })

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh-token']


const isPublicAuthPath = (url?: string) => {
  if (!url) return false
  const relativeUrl = url.replace(API_BASE, '').replace(/^https?:\/\/[^/]+/, '')
  return PUBLIC_AUTH_PATHS.some((p) => relativeUrl.startsWith(p))
}

function isExpired(jwt: string): boolean {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp * 1000 < Date.now() + 5_000
  } catch {
    return true
  }
}

let refreshPromise: Promise<string | null> | null = null


export function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setSession, clear } = useAuthStore.getState()
  if (!refreshToken) return Promise.resolve(null)

  refreshPromise ??= axios
    .post<AuthResponse>(`${API_BASE}/auth/refresh-token`, { refreshToken })
    .then((res) => {
      setSession(res.data)
      return res.data.accessToken
    })
    .catch(() => {
      clear()
      return null
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

http.interceptors.request.use(async (config) => {
  if (isPublicAuthPath(config.url)) return config
  
  let token = useAuthStore.getState().accessToken
  
  
  if (token && isExpired(token)) {
    token = await refreshAccessToken()
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }


const isPublicRead = (c: RetryConfig) => {
  const relativeUrl = (c.url ?? '').replace(API_BASE, '').replace(/^https?:\/\/[^/]+/, '')
  return c.method === 'get' && /^\/car(?:\/(?!my-cars)[^/]+)?$/.test(relativeUrl)
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryConfig | undefined
    if (!original || error.response?.status !== 401 || isPublicAuthPath(original.url)) {
      return Promise.reject(error)
    }

    const sent = (original.headers?.Authorization as string | undefined)?.replace('Bearer ', '')

   
    if ((sent && !isExpired(sent)) || (!sent && isPublicRead(original))) {
      ;(error as any).maskedServerError = true
      return Promise.reject(error)
    }

    if (!original._retry) {
      original._retry = true
      const token = await refreshAccessToken()
      if (token) {
        original.headers = original.headers || {}
        original.headers.Authorization = `Bearer ${token}`
        return http(original)
      }
    }
    return Promise.reject(error)
  },
)
