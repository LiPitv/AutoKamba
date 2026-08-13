import api from './api'
import type { User, Vehicle, ServiceCategory } from '../types'

export const authApi = {
  login: (identificador: string, password: string) =>
    api.post('/auth/login', { identificador, password }).then((r) => r.data),
  registerDriver: (data: Record<string, unknown>) =>
    api.post('/auth/register', { role: 'condutor', ...data }).then((r) => r.data),
  registerProfessional: (data: Record<string, unknown>) =>
    api.post('/auth/register', { role: 'prestador', ...data }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}

export const userApi = {
  profile: () => api.get('/users/profile').then((r) => r.data as { user: User }),
  update: (data: Record<string, unknown>) =>
    api.put('/users/profile', data).then((r) => r.data as { user: User }),
  location: (latitude: number, longitude: number) =>
    api.put('/users/location', { latitude, longitude }),
  avatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return api.post('/users/avatar', form).then((r) => r.data as { avatar: string })
  },
}

export const vehicleApi = {
  all: () => api.get('/vehicles').then((r) => r.data as { vehicles: Vehicle[] }),
  create: (data: FormData) => api.post('/vehicles', data).then((r) => r.data),
  update: (id: number, data: FormData) => api.put(`/vehicles/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/vehicles/${id}`),
  principal: (id: number) => api.put(`/vehicles/${id}/principal`),
}

export const categoryApi = {
  all: () => api.get('/service-categories').then((r) => r.data as { categories: ServiceCategory[] }),
}

export interface RequestBody {
  category_id: number
  vehicle_id?: number | null
  provider_id?: number | null
  descricao?: string
  latitude: number
  longitude: number
  endereco?: string
  referencia?: string
}

export const requestApi = {
  create: (data: RequestBody, fotos?: File[]) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => v != null && form.append(k, String(v)))
    fotos?.forEach((f) => form.append('fotos', f))
    return api.post('/requests', form).then((r) => r.data)
  },
  mine: (status?: string) =>
    api.get('/requests', { params: { status } }).then((r) => r.data as { requests: any[] }),
  available: (lat: number, lng: number, raio = 25) =>
    api.get('/requests/available', { params: { lat, lng, raio } }).then((r) => r.data),
  detail: (id: number) => api.get(`/requests/${id}`).then((r) => r.data),
  status: (id: number, status: string, extra: Record<string, unknown> = {}) =>
    api.put(`/requests/${id}/status`, { status, ...extra }).then((r) => r.data),
}

export const professionalApi = {
  nearby: (lat: number, lng: number, raio = 15, categoria?: number) =>
    api
      .get('/professionals/nearby', { params: { lat, lng, raio, categoria } })
      .then((r) => r.data as { professionals: any[] }),
  detail: (id: number) => api.get(`/professionals/${id}`).then((r) => r.data),
  me: () => api.get('/professionals/me').then((r) => r.data),
  availability: (status: 'online' | 'offline') =>
    api.put('/professionals/availability', { status }).then((r) => r.data),
  services: () => api.get('/professionals/services').then((r) => r.data as { services: any[] }),
  createService: (data: Record<string, unknown>) =>
    api.post('/professionals/services', data).then((r) => r.data),
  updateService: (id: number, data: Record<string, unknown>) =>
    api.put(`/professionals/services/${id}`, data).then((r) => r.data),
  removeService: (id: number) => api.delete(`/professionals/services/${id}`),
  documents: () => api.get('/professionals/documents').then((r) => r.data),
  uploadDocument: (tipo: string, file: File) => {
    const form = new FormData()
    form.append('tipo', tipo)
    form.append('documento', file)
    return api.post('/professionals/documents', form).then((r) => r.data)
  },
  submitVerification: () => api.post('/professionals/verification/submit').then((r) => r.data),
  earnings: (mes?: number, ano?: number) =>
    api.get('/professionals/earnings', { params: { mes, ano } }).then((r) => r.data),
}

export const ratingApi = {
  create: (data: Record<string, unknown>) => api.post('/ratings', data).then((r) => r.data),
  ofProfessional: (id: number) => api.get(`/professionals/${id}/ratings`).then((r) => r.data),
}

export const favoriteApi = {
  all: () => api.get('/favorites').then((r) => r.data),
  add: (professional_id: number) => api.post('/favorites', { professional_id }),
  remove: (providerId: number) => api.delete(`/favorites/${providerId}`),
}

export const notificationApi = {
  all: () => api.get('/notifications').then((r) => r.data),
  unread: () => api.get('/notifications/unread').then((r) => r.data),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAll: () => api.put('/notifications/read-all'),
}

export const messageApi = {
  list: (requestId: number) =>
    api.get('/messages', { params: { request_id: requestId } }).then((r) => r.data),
  send: (requestId: number, mensagem: string) =>
    api.post('/messages', { request_id: requestId, mensagem }).then((r) => r.data),
}

export const paymentApi = {
  all: () => api.get('/payments').then((r) => r.data as { payments: any[] }),
}

export const complaintApi = {
  create: (data: Record<string, unknown>) => api.post('/complaints', data).then((r) => r.data),
  mine: () => api.get('/complaints').then((r) => r.data as { complaints: any[] }),
}

export const adminApi = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  drivers: (params: Record<string, unknown> = {}) =>
    api.get('/admin/drivers', { params }).then((r) => r.data),
  driverStatus: (id: number, estado: string) =>
    api.put(`/admin/drivers/${id}/status`, { estado }),
  professionals: (params: Record<string, unknown> = {}) =>
    api.get('/admin/professionals', { params }).then((r) => r.data),
  professional: (id: number) => api.get(`/admin/professionals/${id}`).then((r) => r.data),
  professionalVerif: (id: number, estado: string, motivo?: string) =>
    api.put(`/admin/professionals/${id}/verification`, { estado, motivo }),
  professionalStatus: (id: number, estado: string) =>
    api.put(`/admin/professionals/${id}/status`, { estado }),
  documentEstado: (id: number, estado: string, motivo?: string) =>
    api.put(`/admin/documents/${id}/estado`, { estado, motivo }),
  complaints: (params: Record<string, unknown> = {}) =>
    api.get('/admin/complaints', { params }).then((r) => r.data),
  complaintEstado: (id: number, estado: string) =>
    api.put(`/admin/complaints/${id}/estado`, { estado }),
  requests: (params: Record<string, unknown> = {}) =>
    api.get('/admin/requests', { params }).then((r) => r.data),
  promotions: () => api.get('/admin/promotions').then((r) => r.data),
  createPromotion: (data: Record<string, unknown>) => api.post('/admin/promotions', data).then((r) => r.data),
  updatePromotion: (id: number, data: Record<string, unknown>) =>
    api.put(`/admin/promotions/${id}`, data).then((r) => r.data),
  removePromotion: (id: number) => api.delete(`/admin/promotions/${id}`),
  settings: () => api.get('/admin/settings').then((r) => r.data),
  updateSettings: (data: Record<string, unknown>) => api.put('/admin/settings', data).then((r) => r.data),
  logs: () => api.get('/admin/logs').then((r) => r.data),
}