import router from '@/router'
import axios, { AxiosError } from 'axios'
import { ClassErrorAPI } from '@/classes/ClassErrorAPI'
import type { IErrorAPI } from '@/classes/models/ModelErrorAPI'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { i18n } from '@/plugins/i18n'

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
    const snackbar = useSnackbarStore();
    if (!error) {
      Promise.reject(new Error('Erro desconhecido!'));
    }

    const errorResponse = error?.response;

    if (errorResponse?.status === 401) {
      snackbar.showSnackbar('Sessão expirada! faça login novamente.', 'error');
      sessionStorage.removeItem('token');
      router.push({ name: 'Login' });
      return Promise.reject(error);
    }

    const objetoError = new ClassErrorAPI(error.response?.data as IErrorAPI)

    snackbar.showSnackbar(objetoError.getErrorAPI.errorMessage || 'Ocorreu um erro na requisição.', 'error');

    return Promise.reject(objetoError.getErrorAPI)
  },
)

export default http
