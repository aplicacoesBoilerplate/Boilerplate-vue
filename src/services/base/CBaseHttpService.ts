// Axios
import type { AxiosRequestConfig } from 'axios';

// Services
import http from './axios';

/**
 * @description
 * Classe base que provê métodos de requisições HTTP com tratamento automático de erros.
 */
export abstract class CBaseHttpService {
  /**
   * @description Método que faz requisições GET.
   * @param pUrl URL da requisição.
   * @param pConfig Configurações da requisição.
   * @returns Promise<TResposta> que contém a resposta da requisição.
   */
  protected static async get<TResposta>(pUrl: string, pConfig?: AxiosRequestConfig): Promise<TResposta> {
    try {
      const { data } = await http.get<TResposta>(pUrl, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições POST.
   * @param pUrl URL da requisição.
   * @param pBody Body da requisição.
   * @param pConfig Configurações da requisição.
   * @returns Promise<TResposta> que contém a resposta da requisição.
   */
  protected static async post<TResposta, TBody = unknown>(
    pUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const { data } = await http.post<TResposta>(pUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições PUT.
   * @param pUrl URL da requisição.
   * @param pBody Body da requisição.
   * @param pConfig Configurações da requisição.
   * @returns Promise<TResposta> que contém a resposta da requisição.
   */
  protected static async put<TResposta, TBody = unknown>(
    pUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const { data } = await http.put<TResposta>(pUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições PATCH.
   * @param pUrl URL da requisição.
   * @param pBody Body da requisição.
   * @param pConfig Configurações da requisição.
   * @returns Promise<TResposta> que contém a resposta da requisição.
   */
  protected static async patch<TResposta, TBody = unknown>(
    pUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const { data } = await http.patch<TResposta>(pUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições DELETE.
   * @param pUrl URL da requisição.
   * @param pConfig Configurações da requisição.
   * @returns Promise<TResposta> que contém a resposta da requisição.
   */
  protected static async delete<TResposta = void>(pUrl: string, pConfig?: AxiosRequestConfig): Promise<TResposta> {
    try {
      const { data } = await http.delete<TResposta>(pUrl, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }
}
