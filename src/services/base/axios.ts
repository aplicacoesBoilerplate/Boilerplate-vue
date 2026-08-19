// Axios
import axios, { AxiosError } from 'axios';

// Models
import type { IErros } from '@/models/model/common/IErros';
import type { InternalAxiosRequestConfig } from 'axios';

// Classes
import { CTradutor } from '@/classes/Utils/CTradutor';
import { pinia } from '@/plugins/pinia';

type TPermissionRefreshConfig = InternalAxiosRequestConfig & {
  permissionRefreshScheduled?: boolean;
};

const http = axios.create({
  baseURL: window.env?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.request.use((pConfig) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    pConfig.headers.Authorization = `Bearer ${token}`;
  }

  pConfig.headers['Accept-Language'] = CTradutor.locale;

  return pConfig;
});

http.interceptors.response.use(
  (pResponse) => pResponse,
  (pError: AxiosError) => {
    if (!pError) {
      return Promise.reject(new Error('Erro desconhecido!'));
    }

    const errorResponse = pError?.response;

    if (errorResponse?.status === 401) {
      void import('@/stores/auth.store').then(({ useAuthStore: pUseAuthStore }) =>
        pUseAuthStore(pinia).encerrarSessao(),
      );
      return Promise.reject('Sessão expirada! faça login novamente.');
    }

    const requestConfig = pError.config as TPermissionRefreshConfig | undefined;
    if (
      errorResponse?.status === 403 &&
      requestConfig &&
      requestConfig?.url !== '/auth/me/cargo' &&
      !requestConfig?.permissionRefreshScheduled
    ) {
      requestConfig.permissionRefreshScheduled = true;
      void import('@/stores/auth.store')
        .then(({ useAuthStore: pUseAuthStore }) => pUseAuthStore(pinia).atualizarPermissoesUsuarioAutenticado())
        .catch(() => undefined);
    }

    const objetoError = pError.response?.data as IErros;

    return Promise.reject(objetoError?.mensagem ?? pError.message ?? 'messages.errors.reqGenerics');
  },
);

export default http;
