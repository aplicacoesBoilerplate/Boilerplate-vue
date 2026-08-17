// Ecossistema Vue
import { type Ref, ref } from 'vue';

// Store
import { useSnackbarStore } from '@/stores/Snackbar.store';

// Models
import type { IPropsSnackbarQueue } from '@/models/components/props/IPropsSnackbarQueue';

import { CTradutor } from '@/classes/Utils/CTradutor';

export type TMetodoRequisicao<TParametros, TResposta> = (pParametros: TParametros) => Promise<TResposta>;

export interface IExecutarRequisicaoOptions<TParametros, TResposta> {
  metodo: TMetodoRequisicao<TParametros, TResposta>;
  parametros: TParametros;
  sucesso?: IPropsSnackbarQueue;
}

export type TUseRequisicaoServiceReturn = {
  carregando: Ref<boolean>;
  erro: Ref<unknown>;
  executar: <TParametros, TResposta>(
    pOptions: IExecutarRequisicaoOptions<TParametros, TResposta>,
  ) => Promise<TResposta>;
};

function normalizarMensagemErro(pErro: unknown): string {
  if (typeof pErro === 'string') {
    return pErro;
  }

  if (pErro instanceof Error) {
    return pErro.message;
  }

  if (typeof pErro === 'object' && pErro !== null && 'mensagem' in pErro) {
    return String((pErro as { mensagem?: unknown }).mensagem);
  }

  return CTradutor.traduzir('common.messages.requestFailed');
}

export function useRequisicaoService(): TUseRequisicaoServiceReturn {
  // Stores
  const snackbarStore = useSnackbarStore();

  // Reativas
  const carregando = ref(false);
  const erro = ref<unknown>(null);

  // Funções
  async function executar<TParametros, TResposta>(
    pOptions: IExecutarRequisicaoOptions<TParametros, TResposta>,
  ): Promise<TResposta> {
    carregando.value = true;
    erro.value = null;

    try {
      const resposta = await pOptions.metodo(pOptions.parametros);

      if (pOptions.sucesso) {
        snackbarStore.adicionar(pOptions.sucesso);
      }

      return resposta;
    } catch (pErro) {
      erro.value = pErro;
      snackbarStore.adicionar({
        tipo: 'error',
        mensagem: normalizarMensagemErro(pErro),
      });

      throw pErro;
    } finally {
      carregando.value = false;
    }
  }

  return {
    carregando,
    erro,
    executar,
  };
}
