import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hiretrack_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function login(username, password) {
  const { data } = await api.post('auth/token/', { username, password })
  localStorage.setItem('hiretrack_access', data.access)
  localStorage.setItem('hiretrack_refresh', data.refresh)
  return data
}
export async function register(username, email, password) {
  return (await api.post('auth/register/', { username, email, password })).data
}
export async function getApplications(params = {}) {
  return (await api.get('applications/', { params })).data
}
export async function getSummary() {
  return (await api.get('dashboard/summary/')).data
}
export async function saveApplication(payload, id) {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } }
  const response = id
    ? await api.patch(`applications/${id}/`, payload, config)
    : await api.post('applications/', payload, config)
  return response.data
}
export async function deleteApplication(id) {
  return api.delete(`applications/${id}/`)
}
export function logout() {
  localStorage.removeItem('hiretrack_access')
  localStorage.removeItem('hiretrack_refresh')
}
export default api
