import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { TOrdem } from '@/models/filters/IConsultaRegistrosFiltro';

export interface IConsultaRegistros<TFiltros = IFiltrosConsulta[]> {
  filtros: TFiltros;
  limite: number;
  proximaEntrada?: unknown;
  ordenacao: TOrdem;
}

export interface IResultadoConsultaRegistros<TRegistro extends object = object> {
  registros: TRegistro[];
  proximaEntrada?: unknown;
  possuiMais?: boolean;
}
