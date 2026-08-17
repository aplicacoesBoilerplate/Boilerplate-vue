// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

/**
 * @description Parâmetros de busca utilizados pelo componente de barra de pesquisa global.
 * @property {string} queryBasica - Termo de pesquisa textual livre.
 * @property {IFiltrosConsulta[]} filtros - Lista de filtros estruturados aplicados à consulta.
 */
export type TParametrosBusca = {
  queryBasica?: string;
  filtros?: IFiltrosConsulta[];
};
