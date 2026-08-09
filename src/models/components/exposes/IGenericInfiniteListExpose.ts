// Types e Interfaces
import type { RouteLocationRaw } from 'vue-router';

/**
 * @description Callback que informa o resultado do carregamento de uma página.
 * @param pStatus - Estado final do carregamento solicitado pelo componente de scroll.
 */
export type TInfiniteListLoadDone = (pStatus: 'ok' | 'empty' | 'error') => void;

/**
 * @description Contrato exposto para controlar uma lista com paginação infinita.
 *
 * @property {Function} loadMore - Solicita o carregamento da próxima página.
 * @property {Function} resetAndLoad - Descarta o contexto atual e reinicia a lista.
 * @property {Function} carregarMaisRegistros - Alias em português para `loadMore`.
 * @property {Function} resetarECarregar - Alias em português para `resetAndLoad`.
 * @property {Function} inserirItem - Insere um objeto no contexto em memória.
 * @property {Function} atualizarItem - Atualiza campos de um item existente.
 * @property {Function} removerItem - Remove um item pelo seu identificador.
 * @property {Function} obterVinculosItem - Retorna atributos usados na restauração de scroll.
 * @property {Function} getItemBindings - Alias em inglês para `obterVinculosItem`.
 * @property {Function} redirecionarPara - Navega preservando o alvo de restauração de scroll.
 */
export interface IGenericInfiniteListExpose {
  loadMore: (pParams?: { done?: TInfiniteListLoadDone; force?: boolean }) => Promise<void>;
  resetAndLoad: () => Promise<void>;
  carregarMaisRegistros: (pParams?: { done?: TInfiniteListLoadDone; force?: boolean }) => Promise<void>;
  resetarECarregar: () => Promise<void>;
  inserirItem: (pItem: object) => void;
  atualizarItem: <TItem extends object>(
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
    pNewValues: Partial<TItem>,
  ) => void;
  removerItem: <TItem extends object>(pIdField: keyof TItem, pIdValue: TItem[keyof TItem]) => void;
  obterVinculosItem: (pItem: unknown, pIndex: number, pItemKey?: string | number) => Record<string, string>;
  getItemBindings: (pItem: unknown, pIndex: number, pItemKey?: string | number) => Record<string, string>;
  redirecionarPara: (pTo: RouteLocationRaw, pSelector?: string | null) => Promise<void>;
}
