import router from '@/router'
import axios, { AxiosError } from 'axios'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels'

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
  (error: AxiosError) => {
    if (!error) Promise.reject('Erro inesperado!')

    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token')
      router.push('/')
    }

    const objetoError = new ErrorAPI(error.response?.data)

    return Promise.reject(objetoError.erro)
  },
)

class ErrorAPI {
  erro: string = ''
  usuario: UsuarioConsulta | null = null
  saida: number = 0
  trace:
    | {
        lineNumber: number
        fileName: string
        className: string
        methodName: string
      }
    | undefined
  horaErro: Date | undefined
  statusCode: number = 500

  constructor(pObj: any) {
    this.erro = pObj.erro ?? this.erro
  }
}

export default http
