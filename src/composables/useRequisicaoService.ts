// Ecossistema Vue
import { ref, type Ref } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Types e Interfaces
import type { IPropsSnackbarQueue } from '@/models/IPropsSnackbarQueue';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IGenericListFetchPayload } from '@/models/components/IGenericListContext';
import type { IParametrosPaginacaoRequisicao } from '@/models/services/IParametrosPaginacaoRequisicao';

export type TMetodoRequisicao<TParametros, TResposta> = (pParametros: TParametros) => Promise<TResposta>;

export type TParametrosPaginados<TParametros extends object, TFiltros = IFiltrosConsulta[]> = TParametros &
  IParametrosPaginacaoRequisicao<TFiltros>;

export interface IExecutarRequisicaoOptions<TParametros, TResposta> {
  /**
   * Método estático do service que será executado.
   */
  metodo: TMetodoRequisicao<TParametros, TResposta>;

  /**
   * Parâmetros já normalizados para o service.
   */
  parametros: TParametros;

  /**
   * Feedback exibido quando a requisição concluir com sucesso.
   */
  sucesso?: IPropsSnackbarQueue;
}

export interface IExecutarConsultaPaginadaOptions<
  TParametros extends object,
  TResposta,
  TFiltros = IFiltrosConsulta[],
> {
  /**
   * Método estático do service que receberá paginação, ordenação e filtros.
   */
  metodo: TMetodoRequisicao<TParametrosPaginados<TParametros, TFiltros>, TResposta>;

  /**
   * Payload emitido por componentes genéricos de listagem.
   */
  payload: IGenericListFetchPayload<TFiltros>;

  /**
   * Parâmetros específicos do endpoint, além de paginação e filtros.
   */
  parametros?: TParametros;

  /**
   * Feedback exibido quando a requisição concluir com sucesso.
   */
  sucesso?: IPropsSnackbarQueue;
}

export type TUseRequisicaoServiceReturn = {
  /** Estado de carregamento da requisição. */
  carregando: Ref<boolean>;
  /** Erro ocorrido durante a execução da requisição. */
  erro: Ref<unknown>;
  /** Função que executa uma requisição com parâmetros já normalizados. */
  executar: <TParametros, TResposta>(pOptions: IExecutarRequisicaoOptions<TParametros, TResposta>) => Promise<TResposta>;
  /** Função que executa uma requisição com paginação e filtros. */
  executarConsultaPaginada: <TParametros extends object, TResposta, TFiltros = IFiltrosConsulta[]>(
    pOptions: IExecutarConsultaPaginadaOptions<TParametros, TResposta, TFiltros>,
  ) => Promise<TResposta>;
  /** Função que monta os parâmetros paginados, combinando payload e parâmetros. */
  montarParametrosPaginados: <TParametros extends object, TFiltros = IFiltrosConsulta[]>(
    pPayload: IGenericListFetchPayload<TFiltros>,
    pParametros?: TParametros,
  ) => TParametrosPaginados<TParametros, TFiltros>;
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

/**
 * Padroniza a execução de services, incluindo montagem de parâmetros, filtros e feedbacks.
 */
export function useRequisicaoService(): TUseRequisicaoServiceReturn {
  const genericFilterStore = useGenericFilterStore();
  const snackbarStore = useSnackbarStore();

  const carregando = ref(false);
  const erro = ref<unknown>(null);

  function montarParametrosPaginados<TParametros extends object, TFiltros = IFiltrosConsulta[]>(
    pPayload: IGenericListFetchPayload<TFiltros>,
    pParametros = {} as TParametros,
  ): TParametrosPaginados<TParametros, TFiltros> {
    const filtros = genericFilterStore.filtersApplied as unknown as TFiltros;

    return {
      ...pParametros,
      ...pPayload,
      filtros,
    };
  }

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

  async function executarConsultaPaginada<TParametros extends object, TResposta, TFiltros = IFiltrosConsulta[]>(
    pOptions: IExecutarConsultaPaginadaOptions<TParametros, TResposta, TFiltros>,
  ): Promise<TResposta> {
    const parametros = montarParametrosPaginados(pOptions.payload, pOptions.parametros);

    return executar({
      metodo: pOptions.metodo,
      parametros,
      sucesso: pOptions.sucesso,
    });
  }

  return {
    carregando,
    erro,
    executar,
    executarConsultaPaginada,
    montarParametrosPaginados,
  };
}
