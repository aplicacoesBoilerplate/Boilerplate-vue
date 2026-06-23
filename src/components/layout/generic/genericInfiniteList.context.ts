// Ecossistema vue
import type { InjectionKey } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

// Contexto compartilhado entre GenericInfiniteList e itens filhos.
export interface IGenericInfiniteListProvided {
  contextId: string;
  /** Gera atributos CSS/data-* que permitem restaurar scroll apos redirect. */
  getItemBindings: (
    item: unknown,
    index: number,
    itemKey?: string | number,
  ) => Record<string, unknown>;
  /** Redireciona depois de gravar o seletor do item na rota de origem. */
  redirectTo: (to: RouteLocationRaw, selector?: string | null) => Promise<void>;
}

// Key para injecao de dependencias.
export const genericInfiniteListKey: InjectionKey<IGenericInfiniteListProvided> = Symbol('genericInfiniteList');
