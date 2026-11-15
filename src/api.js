import axios from 'axios'


const BASE = 'http://localhost:8080/intelliCar/api/v1'

export const tokens = {
  get access() { return localStorage.getItem('accessToken') },
  get refresh() { return localStorage.getItem('refreshToken') },
  set(a, r) { localStorage.setItem('accessToken', a); localStorage.setItem('refreshToken', r) },
  clear() { ['accessToken', 'refreshToken', 'user'].forEach((k) => localStorage.removeItem(k)) },
}

const http = axios.create({ baseURL: BASE })

const isExpired = (jwt) => {
  try { 
    return JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 < Date.now() + 5000 
  } catch { 
    return true 
  }
}

let refreshing = null
async function refreshTokens() {
  if (!tokens.refresh) { tokens.clear(); return null }
  refreshing ??= axios.post(`${BASE}/auth/refresh-token`, { refreshToken: tokens.refresh })
    .then((r) => { tokens.set(r.data.accessToken, r.data.refreshToken); return r.data.accessToken })
    .catch(() => { tokens.clear(); window.dispatchEvent(new Event('auth:logout')); return null })
    .finally(() => { refreshing = null })
  return refreshing
}

http.interceptors.request.use(async (config) => {
  if (config.url.startsWith('/auth/')) return config
  let t = tokens.access
  if (t && isExpired(t)) t = await refreshTokens()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

export const errMsg = (e) => {
  const d = e?.response?.data
  return d?.exception?.message || d?.message || (e?.response?.status === 429 ? 'Çok fazla istek, biraz bekleyin.' : e?.response?.status === 413 ? 'Dosya çok büyük (en fazla 10 MB).' : 'Beklenmeyen bir hata oluştu')
}

// Parametre temizleyici
const clean = (o) => {
  if (!o) return {}
  const cleaned = Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null))
  
  // Spring Boot Sort düzeltmesi: Eğer sort bir obje veya özel formattaysa 'field,dir' string'ine çevirir
  if (cleaned.sort && typeof cleaned.sort === 'object') {
    const field = cleaned.sort.field || 'createdAt'
    const direction = cleaned.sort.direction || cleaned.sort.order || 'desc'
    cleaned.sort = `${field},${direction}`
  }
  
  return cleaned
}

export const api = {
  register: (d) => http.post('/auth/register', d).then((r) => r.data),
  login: (d) => http.post('/auth/login', d).then((r) => r.data),
  logout: () => http.post('/auth/logout'),
  me: () => http.get('/users/me').then((r) => r.data),
  
  // Araba listeleme isteği
  cars: (params) => http.get('/car', { params: clean(params) }).then((r) => r.data),
  car: (id) => http.get(`/car/${id}`).then((r) => r.data),
  myCars: (params) => http.get('/car/my-cars', { params: clean(params) }).then((r) => r.data),
  
  createCar: (d) => http.post('/car', d).then((r) => r.data),
  updateCar: (id, d) => http.put(`/car/${id}`, d).then((r) => r.data),
  deleteCar: (id) => http.delete(`/car/${id}`),
  
  addImages: (id, list) => http.post(`/carImage/${id}`, list).then((r) => r.data),

  
  upload: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return http.post('/upload', fd).then((r) => r.data.url)
  },
  
  createOffer: (d) => http.post('/offer', d).then((r) => r.data),
  respondOffer: (id, newStatus) => http.patch(`/offer/${id}/respond`, null, { params: { newStatus } }).then((r) => r.data),
  carOffers: (carId, params) => http.get(`/offer/cars/${carId}`, { params: clean(params) }).then((r) => r.data),
  myOffers: (params) => http.get('/offer/my-offers', { params: clean(params) }).then((r) => r.data),
  
  recommend: (d) => http.post('/ai/recommend', clean(d)).then((r) => r.data),
  estimate: (d) => http.post('/ai/price-estimate', clean(d)).then((r) => r.data),
}
