// Types e Interfaces
import type { RouteLocationRaw } from 'vue-router';

/** @description Callback que informa o resultado do carregamento de uma página. */
export type TInfiniteListLoadDone = (pStatus: 'ok' | 'empty' | 'error') => void;

/** @description Contrato exposto para controlar uma lista com paginação infinita. */
export interface IGenericInfiniteListExpose {
  loadMore: (pParams?: { done?: TInfiniteListLoadDone; force?: boolean }) => Promise<void>;
  resetAndLoad: () => Promise<void>;
  carregarMaisRegistros: (pParams?: { done?: TInfiniteListLoadDone; force?: boolean }) => Promise<void>;
  resetarECarregar: () => Promise<void>;
  inserirItem: (pItem: unknown) => void;
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
