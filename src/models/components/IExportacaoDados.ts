// Types e Interfaces
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type {
  IGenericListFetchPayload,
  TGenericListFetchResponse,
  TOrdem,
} from '@/models/components/IGenericListContext';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

/** @description Tipo para representar as opções de formato de exportação de dados. */
export type TFormatoExportacaoDados = 'txt' | 'pdf' | 'excel';

/**
 * @description Tipo que representa os parâmetros necessários para a exportação de dados.
 * @template TParametros Tipo dos parâmetros específicos do endpoint.
 * @template TItem Tipo do item que será exportado.
 * @param {TParametros & IGenericListFetchPayload} pParametros Parâmetros necessários para a exportação de dados.
 * @returns {Promise<TGenericListFetchResponse<TItem>>} Retorna a resposta da exportação de dados.
 */
export type TMetodoExportacaoDados<TParametros extends object = Record<string, unknown>, TItem = unknown> = (
  pParametros: TParametros & IGenericListFetchPayload,
) => Promise<TGenericListFetchResponse<TItem>>;

/**
 * @description Interface que representa os parâmetros necessários para a execução da exportação de dados.
 * @template TParametros Tipo dos parâmetros específicos do endpoint.
 * @template TItem Tipo do item que será exportado.
 * @param {TFormatoExportacaoDados} formato Formato do arquivo que será gerado para download.
 * @param {string} contexto Identificador do contexto da lista exportada.
 * @param {TMetodoExportacaoDados<TParametros, TItem>} metodo Método responsável por consultar os registros paginados.
 * @param {TParametros} parametros Parâmetros específicos do endpoint, além de paginação e filtros.
 * @param {IHeadersDataTable[]} colunas Colunas usadas para montar cabeçalhos e valores exportados.
 * @param {string} nomeArquivo Nome base do arquivo gerado, sem extensão.
 * @param {TOrdem} ordem Ordenação usada na paginação serial da exportação.
 * @param {IFiltrosConsulta[]} filtros Filtros aplicados na exportação.
 */
export interface IExecutarExportacaoDadosOptions<TParametros extends object = Record<string, unknown>, TItem = unknown> {
  formato: TFormatoExportacaoDados;
  contexto: string;
  metodo: TMetodoExportacaoDados<TParametros, TItem>;
  parametros?: TParametros;
  colunas?: IHeadersDataTable[];
  nomeArquivo?: string;
  ordem?: TOrdem;
  filtros?: IFiltrosConsulta[];
}

/**
 * @description Interface que representa uma coluna de dados que será exportada.
 * @template TItem Tipo do item que será exportado.
 * @param {string} titulo Título exibido no cabeçalho do arquivo exportado.
 * @param {string} chave Chave usada como fallback para leitura direta do item.
 * @param {(pItem: TItem) => unknown} valor Função opcional para formatar o valor com base no item inteiro.
 */
export interface IColunaNormalizadaExportacao<TItem = unknown> {
  titulo: string;
  chave: string;
  valor?: (pItem: TItem) => unknown;
}
