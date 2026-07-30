// Types e Interfaces
import type { IConsultaRegistrosFiltroPayload } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { AxiosRequestConfig } from 'axios';

// Classes
import { CResolvePayloadFiltros } from '@/classes/filters/CResolvePayloadFiltros';

// Services
import http from './axios';

/**
 * @description Classe base que provê métodos de requisições HTTP com tratamento automático de erros.
 */
export abstract class CBaseHttpService {
  /**
   * @description Centraliza a instância da classe de normalização do payload de consulta com filtros aplicados.
   * @template T - type union com os valores dos campos validos para aplicar filtros.
   * @param pPayload - Payload gerado pelo DialogFiltros para ser tratado.
   * @param pCampoDefault - Campo fallback para aplicar filtro caso a validação com Set falhe.
   * @param pCamposValidos - Conjunto de campos válidos para validação.
   * @returns Payload esperado pelo backend para uma consulta com filtros aplicados.
   */
  protected static resolverPayload<T>(
    pPayload: IConsultaRegistrosFiltroPayload<T>,
    pCampoDefault?: string,
    pCamposValidos?: Set<string>,
  ): IFiltrosConsulta[] {
    const resolver = new CResolvePayloadFiltros(pCamposValidos);
    return resolver.montarFiltrosPesquisa(pPayload, pCampoDefault);
  }

  /**
   * @description Método que faz requisições GET.
   * @param pPathUrl - Path do Endpoint da API, URL da requisição será tratada com '/api/v1/'.
   * @param pConfig - Configurações da requisição.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected static async get<TResposta>(pPathUrl: string, pConfig?: AxiosRequestConfig): Promise<TResposta> {
    try {
      const lSafeUrl = pPathUrl.startsWith('/api/v1/') ? pPathUrl : `/api/v1/${pPathUrl}`;
      const { data } = await http.get<TResposta>(lSafeUrl, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições POST.
   * @param pPathUrl - Path do Endpoint da API, URL da requisição será tratada com '/api/v1/'.
   * @param pBody - Body da requisição.
   * @param pConfig - Configurações da requisição.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected static async post<TResposta, TBody = unknown>(
    pPathUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const lSafeUrl = pPathUrl.startsWith('/api/v1/') ? pPathUrl : `/api/v1/${pPathUrl}`;
      const { data } = await http.post<TResposta>(lSafeUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições PUT.
   * @param pPathUrl - Path do Endpoint da API, URL da requisição será tratada com '/api/v1/'.
   * @param pBody - Body da requisição.
   * @param pConfig - Configurações da requisição.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected static async put<TResposta, TBody = unknown>(
    pPathUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const lSafeUrl = pPathUrl.startsWith('/api/v1/') ? pPathUrl : `/api/v1/${pPathUrl}`;
      const { data } = await http.put<TResposta>(lSafeUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições PATCH.
   * @param pPathUrl - Path do Endpoint da API, URL da requisição será tratada com '/api/v1/'.
   * @param pBody - Body da requisição.
   * @param pConfig - Configurações da requisição.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected static async patch<TResposta, TBody = unknown>(
    pPathUrl: string,
    pBody?: TBody,
    pConfig?: AxiosRequestConfig,
  ): Promise<TResposta> {
    try {
      const lSafeUrl = pPathUrl.startsWith('/api/v1/') ? pPathUrl : `/api/v1/${pPathUrl}`;
      const { data } = await http.patch<TResposta>(lSafeUrl, pBody, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }

  /**
   * @description Método que faz requisições DELETE.
   * @param pPathUrl - Path do Endpoint da API, URL da requisição será tratada com '/api/v1/'.
   * @param pConfig - Configurações da requisição.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected static async delete<TResposta = void>(pPathUrl: string, pConfig?: AxiosRequestConfig): Promise<TResposta> {
    try {
      const lSafeUrl = pPathUrl.startsWith('/api/v1/') ? pPathUrl : `/api/v1/${pPathUrl}`;
      const { data } = await http.delete<TResposta>(lSafeUrl, pConfig);
      return data;
    } catch (pErro) {
      throw pErro;
    }
  }
}
