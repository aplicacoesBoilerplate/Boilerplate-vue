// Types e Interfaces
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';
import type { IFiltrosConsulta } from '../filters/IFiltrosConsulta';

export type TOrdem = 'asc' | 'desc';

export interface IGenericListContext<TItem = unknown> {
  /** Identificador unico dessa lista. */
  contexto: string;
  /** Registros ja consultados e restauraveis quando a rota voltar para a lista. */
  items: TItem[];
  /** Proximo Entry (cursor) usado pela chamada do backend em infinite scroll. */
  proximaEntrada: unknown;
  /** Indica se o componente ainda deve pedir novas paginas (tem mais dados no banco). */
  temMaisRegistros: boolean;
  /** Limite atual escolhido pelo usuario para manter o contexto consistente. */
  limite: number;
  /** Ordem da paginacao (ex: 'asc' ou 'desc'). */
  ordem: TOrdem;
  /** Ultima alteracao do contexto; util para debug e politicas futuras de cache. */
  atualizadoEm: number;
}

export interface IGenericListContextOptions {
  /** Tempo de validade do contexto no storage da aba. */
  cacheTtlMs?: number;
  /** Normalmente session para cache temporario de listas; local fica disponivel para outros usos. */
  storage?: TManagerStorageLocation;
  /** Quantidade inicial por pagina. */
  limite?: number;
  /** Orientacao padrao de ordenacao inicial. */
  ordem?: TOrdem;
}

/**
 * Payload padrao de chamadas do tipo infinite scroll.
 */
export interface IGenericListFetchPayload<TFiltros = IFiltrosConsulta[]> {
  contexto: string;
  limite: number;
  proximaEntrada: unknown;
  ordem: TOrdem;
  filtros?: TFiltros;
}

/**
 * Resultado padrao de chamadas do tipo infinite scroll.
 */
export interface IGenericListFetchReturn<TItem = unknown> {
  items: TItem[];
  proximaEntrada?: unknown;
  /** Se ausente, o componente infere pelo tamanho da pagina retornada. (Se for < que o limite, recebe false) */
  temMaisRegistros?: boolean;
}

/** Resposta padrao de chamadas do tipo infinite scroll. */
export type TGenericListFetchResponse<TItem = unknown> =
  | TItem[]
  | IGenericListFetchReturn<TItem>;
