// Ecossistema vue
import type { InjectionKey } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

/**
 * Contexto compartilhado entre GenericInfiniteList e itens filhos.
 */
export interface IGenericInfiniteListProvided {
  contexto: string;
  /**
   * Gera atributos CSS/data-* que permitem restaurar scroll após redirecionamento.
   */
  obterVinculosItem: (
    pItem: unknown,
    pIndex: number,
    pItemKey?: string | number,
  ) => Record<string, unknown>;
  /**
   * Redireciona depois de gravar o seletor do item na rota de origem.
   */
  redirecionarPara: (pDestino: RouteLocationRaw, pSeletor?: string | null) => Promise<void>;

  /**
   * Alias temporário mantido durante a migração para nomenclatura em português.
   */
  getItemBindings?: IGenericInfiniteListProvided['obterVinculosItem'];

  /**
   * Alias temporário mantido durante a migração para nomenclatura em português.
   */
  redirectTo?: IGenericInfiniteListProvided['redirecionarPara'];
}

/**
 * Chave para injeção de dependências.
 */
export const genericInfiniteListKey: InjectionKey<IGenericInfiniteListProvided> = Symbol('genericInfiniteList');
