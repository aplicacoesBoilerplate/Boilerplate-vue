// Axios
import type { AxiosRequestConfig } from 'axios';

// Services
import http from './axios';

/**
 * @description Interface para centralizar os parâmetros esperados pelos métodos services para requisições.
 * @template TBody - Definição do objeto do body da requisição.
 * 
 * @property {string} pathUrl - Endpoint do recurso da API, o prefixo 'base/api/v1' já é tratado, só precisa do recurso.
 * @property {TBody} body - Body da requisição, usado em requisições POST, PUT e PATCH.
 * @property {AxiosRequestConfig} axiosConfig - Configurações adicionais do axios como headers, query params...
 */
export interface IBaseParamsRequest {
  pathUrl: string;
  axiosConfig?: AxiosRequestConfig;
}

export interface IBodyParamsRequest<TBody extends object> extends IBaseParamsRequest {
  body: TBody;
}

/**
 * @description Classe base que provê métodos de requisições HTTP com tratamento automático de erros feitos pelo Axios.
 */
export abstract class CBaseHttpService {
  /**
   * @description Método que faz requisições GET.
   * @template TResposta - Definição do objeto esperado na resposta.
   * 
   * @param {IBaseParamsRequest} pParametros - Parâmetros base.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected async get<TResposta = unknown>(
    pParametros: IBaseParamsRequest
  ): Promise<TResposta> {
    const lSafeUrl = pParametros.pathUrl.startsWith('/api/v1/') ? pParametros.pathUrl : `/api/v1/${pParametros.pathUrl}`;
    const { data } = await http.get<TResposta>(lSafeUrl, pParametros.axiosConfig);
    return data;
  }

  /**
   * @description Método que faz requisições POST.
   * @template TResposta - Definição do objeto esperado na resposta.
   * @template TBody - Definição do objeto do body da requisição.
   * 
   * @param {IBodyParamsRequest<TBody>} pParametros - Parâmetros base.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected async post<TBody extends object = object, TResposta = unknown>(
    pParametros: IBodyParamsRequest<TBody>
  ): Promise<TResposta> {
    const lSafeUrl = pParametros.pathUrl.startsWith('/api/v1/') ? pParametros.pathUrl : `/api/v1/${pParametros.pathUrl}`;
    const { data } = await http.post<TResposta>(lSafeUrl, pParametros.body, pParametros.axiosConfig);
    return data;
  }

  /**
   * @description Método que faz requisições PUT.
   * @template TResposta - Definição do objeto esperado na resposta.
   * @template TBody - Definição do objeto do body da requisição.
   * 
   * @param {IBodyParamsRequest<TBody>} pParametros - Parâmetros base.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected async put<TBody extends object = object, TResposta = unknown>(
    pParametros: IBodyParamsRequest<TBody>
  ): Promise<TResposta> {
    const lSafeUrl = pParametros.pathUrl.startsWith('/api/v1/') ? pParametros.pathUrl : `/api/v1/${pParametros.pathUrl}`;
    const { data } = await http.put<TResposta>(lSafeUrl, pParametros.body, pParametros.axiosConfig);
    return data;
  }

  /**
   * @description Método que faz requisições PATCH.
   * @template TResposta - Definição do objeto esperado na resposta.
   * @template TBody - Definição do objeto do body da requisição.
   * 
   * @param {IBodyParamsRequest<TBody>} pParametros - Parâmetros base.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected async patch<TBody extends object = object, TResposta = unknown>(
    pParametros: IBodyParamsRequest<TBody>
  ): Promise<TResposta> {
    const lSafeUrl = pParametros.pathUrl.startsWith('/api/v1/') ? pParametros.pathUrl : `/api/v1/${pParametros.pathUrl}`;
    const { data } = await http.patch<TResposta>(lSafeUrl, pParametros.body, pParametros.axiosConfig);
    return data;
  }

  /**
   * @description Método que faz requisições DELETE.
   * @template TResposta - Definição do objeto esperado na resposta.
   * 
   * @param {IBaseParamsRequest} pParametros - Parâmetros base.
   * @returns A interface da resposta é transmitida no template do método.
   */
  protected async delete<TResposta = void>(
    pParametros: IBaseParamsRequest
  ): Promise<TResposta> {
    const lSafeUrl = pParametros.pathUrl.startsWith('/api/v1/') ? pParametros.pathUrl : `/api/v1/${pParametros.pathUrl}`;
    const { data } = await http.delete<TResposta>(lSafeUrl, pParametros.axiosConfig);
    return data;
  }
}
