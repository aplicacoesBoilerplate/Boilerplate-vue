// Types e Interfaces
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

export interface IGenericListContext<TItem = unknown> {
  /** Identificador unico dessa lista. */
  contextId: string;
  /** Registros ja consultados e restauraveis quando a rota voltar para a lista. */
  items: TItem[];
  /** Proximo Entry (cursor) usado pela chamada do backend em infinite scroll. */
  nextEntry: unknown;
  /** Indica se o componente ainda deve pedir novas paginas (tem mais dados no banco). */
  hasMore: boolean;
  /** Limite atual escolhido pelo usuario para manter o contexto consistente. */
  limit: number;
  /** Ordem da paginacao (ex: 'asc' ou 'desc'). */
  order: string;
  /** Ultima alteracao do contexto; util para debug e politicas futuras de cache. */
  updatedAt: number;
}

export interface IGenericListContextOptions {
  /** Tempo de validade do contexto no storage da aba. */
  cacheTtlMs?: number;
  /** Normalmente session para cache temporario de listas; local fica disponivel para outros usos. */
  storage?: TManagerStorageLocation;
  /** Quantidade inicial por pagina. */
  limit?: number;
  /** Orientacao padrao de ordenacao inicial. */
  order?: string;
}

export interface IGenericListFetchPayload<TFiltros = any> {
  contextId: string;
  limit: number;
  nextEntry: unknown;
  order: string;
  filtros?: TFiltros;
}

export interface IGenericListFetchResult<TItem = unknown> {
  items: TItem[];
  nextEntry?: unknown;
  /** Se ausente, o componente infere pelo tamanho da pagina retornada. (Se for < que o limit, recebe false) */
  hasMore?: boolean;
}

export type TGenericListFetchResponse<TItem = unknown> =
  | TItem[]
  | IGenericListFetchResult<TItem>;
