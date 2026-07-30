import { type Ref, ref } from 'vue';

import { useGenericFilterStore } from '@/stores/genericFilter.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IPropsSnackbarQueue } from '@/models/components/props/IPropsSnackbarQueue';

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

  return 'Não foi possível concluir a requisição.';
}

export function useRequisicaoService(): TUseRequisicaoServiceReturn {
  const snackbarStore = useSnackbarStore();

  const carregando = ref(false);
  const erro = ref<unknown>(null);

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
