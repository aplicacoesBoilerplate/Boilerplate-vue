// Ecosssitema Vue
import router from '@/router'
import { i18n } from '@/plugins/i18n'

// Axios
import axios, { AxiosError } from 'axios'

// Types e Interfaces
import type { IErrorAPI } from '@/models/model/errors/IErrorAPI'

const http = axios.create({
  baseURL: window.env?.VITE_API_URL || import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // @ts-ignore
  config.headers['Accept-Language'] = i18n.global.locale.value

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error) {
      return Promise.reject(new Error('Erro desconhecido!'));
    }

    const errorResponse = error?.response;

    if (errorResponse?.status === 401) {
      sessionStorage.removeItem('token');
      router.push({ name: 'Login' });
      return Promise.reject('Sessão expirada! faça login novamente.');
    }

    const objetoError = error.response?.data as IErrorAPI

    return Promise.reject(objetoError?.mensagem ?? error.message ?? 'messages.errors.reqGenerics')
  },
)

export default http
