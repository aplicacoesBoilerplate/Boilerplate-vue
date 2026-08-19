/**
 * @description Contrato flexível retornado pelo Spring Actuator para o health-check.
 * @property {string} status - Estado geral informado pelo backend.
 * @property {Record<string, unknown>} components - Componentes detalhados quando o usuário autenticado possui autorização.
 * @property {Record<string, unknown>} details - Detalhes adicionais retornados pelo Actuator.
 */
export interface IHealthCheckResponse {
  status?: string;
  components?: Record<string, unknown>;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * @description Resultado padronizado da verificação HTTP do health-check.
 * @property {number} statusCode - Status HTTP retornado pela API, ou 0 quando não houve resposta.
 * @property {IHealthCheckResponse | null} data - Corpo retornado pelo Actuator.
 */
export interface IHealthCheckResultado {
  statusCode: number;
  data: IHealthCheckResponse | null;
}
