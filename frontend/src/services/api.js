import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = (data) => api.post('/user/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const fetchProducts = () => api.get('/items')
export const createTransaction = (data) => api.post('/transaction/create', data)

export default api

