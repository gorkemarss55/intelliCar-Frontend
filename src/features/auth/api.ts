import { http } from '@/lib/http'
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '@/types/api'

export const authApi = {
  login: (body: LoginRequest) => http.post<AuthResponse>('/auth/login', body).then((r) => r.data),
  register: (body: RegisterRequest) => http.post<AuthResponse>('/auth/register', body).then((r) => r.data),
  logout: () => http.post<void>('/auth/logout'),
  me: () => http.get<UserResponse>('/users/me').then((r) => r.data),
}
