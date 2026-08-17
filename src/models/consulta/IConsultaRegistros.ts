// Models
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

export type TOrdem = 'asc' | 'desc';

/**
 * @description Contrato com a API para a requisição de registros paginados.
 * @template TInterfaceRegistro - Interface do objeto que os filtros vão ser aplicados.
 * @template TFiltros - Monta um default com de IFiltrosConsulta<TInterfaceRegistro> para restrição de valores dos campos válidos para filtros.
 * 
 * @property {TFiltros} filtros - Objeto completo de filtros para cumprir o contrato da API.
 * @property {TOrdem} ordenacao - Modifica a cláusula do ORDER BY.
 * @property {number} limite - Limitação de registros para não sobrecarregar a API.
 * @property {unknown} proximaEntrada - Cursor para a paginação, utiliza o retorno da última resposta.
 * @property {boolean} possuiMais - Controle para saber quando parar de consultar registros ou se é o fim da lista.
 */
export interface IConsultaRegistros<TInterfaceRegistro, TFiltros = IFiltrosConsulta<TInterfaceRegistro>[]> {
  filtros: TFiltros;
  ordenacao: TOrdem;
  limite: number;
  proximaEntrada?: unknown;
  possuiMais?: boolean;
}

/**
 * @description Contrato com a API para a resposta de consultas paginadas. Estende de IConsultaRegistros para manter o contrato.
 * @template TInterfaceRegistro - Interface do objeto que deve ser retornado na consulta de registros.
 * 
 * @property {TInterfaceRegistro[]} registros - Lista com os registros retornados pela API.
 */
export interface IRespostaConsultaRegistros<TInterfaceRegistro extends object = object> extends IConsultaRegistros<TInterfaceRegistro> {
  registros: TInterfaceRegistro[];
}

export interface IConsultaTodosRegistrosOptions {
  signal?: AbortSignal;
  maxPages?: number;
  maxRecords?: number;
  maxBytes?: number;
  timeoutMs?: number;
}

/**
 * @description Interface genérica responsável por configurar a consulta auxiliar de registros disponível para um campo do filtro.
 * @template TInterfaceRegistro - O tipo do registro que será consultado.
 * 
 * @property {keyof TInterfaceRegistro & string} atributoValor - O atributo do registro usado como valor aplicado no filtro.
 * @property {keyof TInterfaceRegistro & string} atributoDescricao - O atributo do registro usado como descrição visual na lista.
 * @property {(pPayload: IConsultaRegistros<TInterfaceRegistro>) => Promise<IResultadoConsultaRegistros<TInterfaceRegistro>>} buscarRegistros - A função responsável por consultar os registros auxiliares para filtros.
 * @property {number} limiteInicial - A quantidade inicial carregada por página.
 * @property {string} textoVazio - O texto exibido quando a consulta não retornar registros.
 */
export interface IConsultaAuxiliarRegistros<TInterfaceRegistro extends object = object> {
  atributoValor: keyof TInterfaceRegistro & string;
  atributoDescricao: keyof TInterfaceRegistro & string;
  buscarRegistros: (pPayload: IConsultaRegistros<TInterfaceRegistro>) => Promise<IRespostaConsultaRegistros<TInterfaceRegistro>>;
  limiteInicial?: number;
  textoVazio?: string;
}
