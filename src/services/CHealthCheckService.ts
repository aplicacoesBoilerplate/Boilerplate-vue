// Types e Interfaces
import type { IHealthCheckResponse, IHealthCheckResultado } from '@/models/services/IHealthCheck';

// Services
import http from '@/services/base/axios';

/**
 * @description Centraliza a verificação de disponibilidade da API.
 */
export class CHealthCheckService {
  /**
   * @description Executa o health-check simplificado, aceitando qualquer status para permitir redirecionamento controlado pela UI.
   * @returns Resultado HTTP padronizado do health-check.
   */
  public static async verificarSimplificado(): Promise<IHealthCheckResultado> {
    try {
      const response = await http.get<IHealthCheckResponse>('/actuator/health-check', {
        validateStatus: () => true,
      });

      return {
        statusCode: response.status,
        data: response.data,
      };
    } catch {
      return {
        statusCode: 0,
        data: null,
      };
    }
  }

  /**
   * @description Executa o health-check detalhado para usuários autenticados.
   * @returns Resultado HTTP padronizado do health-check.
   */
  public static async verificarDetalhado(): Promise<IHealthCheckResultado> {
    return CHealthCheckService.verificarSimplificado();
  }
}
