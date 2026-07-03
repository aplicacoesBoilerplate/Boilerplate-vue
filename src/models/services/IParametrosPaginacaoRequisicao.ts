// Types e Interfaces
import type { TOrdem } from '@/models/components/IGenericListContext';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

export interface IParametrosPaginacaoRequisicao<TFiltros = IFiltrosConsulta[]> {
  /**
   * Quantidade máxima de registros solicitados na requisição.
   */
  limite?: number;

  /**
   * Cursor usado para solicitar a próxima página.
   */
  proximaEntrada?: unknown;

  /**
   * Direção da ordenação enviada para o backend.
   */
  ordem?: TOrdem;

  /**
   * Filtros aplicados sobre a consulta.
   */
  filtros?: TFiltros;
}
