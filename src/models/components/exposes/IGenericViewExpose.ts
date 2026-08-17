// Ecossistema Vue
// Types e Interfaces
import type { IGenericInfiniteListExpose } from './IGenericInfiniteListExpose';
import type { Ref } from 'vue';

/**
 * @description Contrato exposto pela view genérica para controlar a lista e a exibição de gráficos.
 *
 * @property {Ref<IGenericInfiniteListExpose | null>} infiniteListRef - Referência da lista infinita interna.
 * @property {Function} loadMore - Solicita o carregamento da próxima página.
 * @property {Function} resetAndLoad - Reinicia o contexto e carrega a lista.
 * @property {Function} carregarMaisRegistros - Alias em português para `loadMore`.
 * @property {Function} resetarECarregar - Alias em português para `resetAndLoad`.
 * @property {Function} inserirItem - Insere um objeto no contexto da lista.
 * @property {Function} atualizarItem - Atualiza campos de um item existente.
 * @property {Function} removerItem - Remove um item pelo identificador.
 * @property {Ref<boolean>} exibirGraficosAtivos - Estado reativo de exibição do painel de gráficos.
 * @property {Function} alternarGraficos - Alterna a visibilidade do painel de gráficos.
 */
export interface IGenericViewExpose {
  infiniteListRef: Ref<IGenericInfiniteListExpose | null>;
  loadMore: IGenericInfiniteListExpose['loadMore'];
  resetAndLoad: IGenericInfiniteListExpose['resetAndLoad'];
  carregarMaisRegistros: IGenericInfiniteListExpose['carregarMaisRegistros'];
  resetarECarregar: IGenericInfiniteListExpose['resetarECarregar'];
  inserirItem: IGenericInfiniteListExpose['inserirItem'];
  atualizarItem: IGenericInfiniteListExpose['atualizarItem'];
  removerItem: IGenericInfiniteListExpose['removerItem'];
  exibirGraficosAtivos: Ref<boolean>;
  alternarGraficos: () => void;
}
