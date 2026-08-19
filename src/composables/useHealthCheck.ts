// Ecossistema Vue
import { type Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

// Types e Interfaces
import type { IHealthCheckResultado } from '@/models/services/IHealthCheck';

// Services
import { CHealthCheckService } from '@/services/CHealthCheckService';

type TVerificarHealthCheckOptions = {
  /**
   * Define se deve solicitar o retorno detalhado do Actuator.
   */
  detalhado?: boolean;

  /**
   * Define se respostas diferentes de HTTP 200 devem redirecionar para a tela de erro do servidor.
   */
  redirecionarErroServidor?: boolean;
};

export type TUseHealthCheckReturn = {
  carregando: Ref<boolean>;
  resultado: Ref<IHealthCheckResultado | null>;
  verificarHealthCheck: (pOptions?: TVerificarHealthCheckOptions) => Promise<IHealthCheckResultado>;
};

/**
 * @description Centraliza a execução do health-check e o redirecionamento de indisponibilidade da API.
 * @returns Estado e função para executar o health-check.
 */
export function useHealthCheck(): TUseHealthCheckReturn {
  const router = useRouter();

  const carregando = ref(false);
  const resultado = ref<IHealthCheckResultado | null>(null);

  async function verificarHealthCheck(pOptions: TVerificarHealthCheckOptions = {}): Promise<IHealthCheckResultado> {
    carregando.value = true;

    try {
      const resposta = pOptions.detalhado
        ? await CHealthCheckService.verificarDetalhado()
        : await CHealthCheckService.verificarSimplificado();

      resultado.value = resposta;

      if (pOptions.redirecionarErroServidor !== false && resposta.statusCode !== 200) {
        await router.replace({ name: 'ServerError' });
      }

      return resposta;
    } finally {
      carregando.value = false;
    }
  }

  return {
    carregando,
    resultado,
    verificarHealthCheck,
  };
}
