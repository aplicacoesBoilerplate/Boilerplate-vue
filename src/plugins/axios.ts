import { useSnackbarStore } from '@/components/notifications/notificationsStore'
import router from '@/router'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptador para adicionar o token a cada requisição
http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const snackbar = useSnackbarStore()

    if (error.response && error.response.status === 401) {
      snackbar.showSnackbar('Session expired. Please log in again.', 'red')

      sessionStorage.removeItem('token')
      router.push('/')
    }

    return Promise.reject(error)
  },
)

export default http
